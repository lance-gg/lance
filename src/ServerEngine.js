'use strict';

const fs = require('fs');
const Gameloop = require('node-gameloop');
const Serializer = require('./serialize/Serializer');
const NetworkTransmitter = require('./network/NetworkTransmitter');
const NetworkMonitor = require('./network/NetworkMonitor');

/**
 * ServerEngine is the main server-side singleton code.
 * Extend this class with your own server-side logic, and
 * start a single instance.
 *
 * This class should not be used to contain the actual
 * game logic.  That belongs in the GameEngine class, where the mechanics
 * of the gameplay are actually implemented.
 * The ServerEngine singleton is typically a lightweight
 * implementation, logging gameplay statistics and registering
 * user activity and user data.
 *
 * The base class implementation is responsible for starting
 * the server, initiating each game step, accepting new
 * connections and dis-connections, emitting periodic game-state
 * updates, and capturing remote user inputs.
 */
class ServerEngine {

    /**
     * create a ServerEngine instance
     *
     * @param {SocketIO} io - the SocketIO server
     * @param {GameEngine} gameEngine - instance of GameEngine
     * @param {Object} options - server options
     * @param {Number} options.frameRate - number of steps per second
     * @param {Number} options.updateRate - number of steps in each update (sync)
     * @param {Number} options.timeoutInterval=180 - number of seconds after which a player is automatically disconnected if no input is received. Set to 0 for no timeout
     * @return {ServerEngine} serverEngine - self
     */
    constructor(io, gameEngine, options) {
        this.options = Object.assign({
            updateRate: 6,
            frameRate: 60,  // TODO: this is no longer a frame rate, this is a stepRate
            timeoutInterval: 180,
            debug: {
                serverSendLag: false
            }
        }, options);

        this.io = io;

        /**
         * reference to game engine
         * @member {GameEngine}
         */
        this.gameEngine = gameEngine;
        this.serializer = new Serializer();
        this.networkTransmitter = new NetworkTransmitter(this.serializer);

        this.networkMonitor = new NetworkMonitor();

        this.connectedPlayers = {};
        this.playerInputQueues = {};
        this.pendingAtomicEvents = [];

        io.on('connection', this.onPlayerConnected.bind(this));
        this.gameEngine.on('objectAdded', this.onObjectAdded.bind(this));

        return this;
    }

    // start the ServerEngine
    start() {
        var that = this;
        this.gameEngine.start();

        this.gameLoopId = Gameloop.setGameLoop(function() {
            that.step();
        }, 1000 / this.options.frameRate);
    }

    // every server step starts here
    step() {
        var that = this;

        // first update the trace state
        this.gameEngine.trace.setStep(this.gameEngine.world.stepCount + 1);
        this.gameEngine.emit("server__preStep", this.gameEngine.world.stepCount + 1);

        this.serverTime = (new Date().getTime());

        // for each player, replay all the inputs in the oldest step
        for (let playerId of Object.keys(this.playerInputQueues)) {
            let inputQueue = this.playerInputQueues[playerId];
            let queueSteps = Object.keys(inputQueue);
            let minStep = Math.min.apply(null, queueSteps);

            // check that there are inputs for this step,
            // and that we have reached/passed this step
            if (queueSteps.length > 0 && minStep <= this.gameEngine.world.stepCount) {
                inputQueue[minStep].forEach(i => { this.gameEngine.processInput(i, playerId); });
                delete inputQueue[minStep];
            }
        }

        // run the game engine step
        this.gameEngine.step();

        // update clients only at the specified step interval, as defined in options
        if (this.gameEngine.world.stepCount % this.options.updateRate == 0) {
            for (let socketId in this.connectedPlayers) {
                if (this.connectedPlayers.hasOwnProperty(socketId)) {
                    let payload = this.serializeUpdate(socketId);
                    this.gameEngine.trace.info(`========== sending world update ${this.gameEngine.world.stepCount} ==========`);

                    // simulate server send lag
                    if (this.options.debug.serverSendLag !== false) {
                        setTimeout(function() {
                            // verify again that the player exists
                            if (that.connectedPlayers[socketId]) {
                                that.connectedPlayers[socketId].emit('worldUpdate', payload);
                            }
                        }, that.options.debug.serverSendLag);
                    } else {
                        this.connectedPlayers[socketId].emit('worldUpdate', payload);
                    }
                }
            }
        }

        // step is done on the server side
        this.gameEngine.emit("server__postStep", this.gameEngine.world.stepCount);

        if (this.gameEngine.trace.length) {
            let traceData = this.gameEngine.trace.rotate();
            let traceString = '';
            traceData.forEach(t => { traceString += `[${t.time.toISOString()}]${t.step}>${t.data}\n`; });
            fs.appendFile('server.trace', traceString, err => { if (err) throw err; });
        }
    }

    // create a serialized package of the game world
    serializeUpdate(socketId) {
        let world = this.gameEngine.world;

        for (let objId of Object.keys(world.objects)) {
            this.networkTransmitter.addNetworkedEvent("objectUpdate", {
                stepCount: world.stepCount,
                objectInstance: world.objects[objId]
            });
        }

        return this.networkTransmitter.serializePayload({ resetPayload: true });
    }

    // handle the object creation
    onObjectAdded(obj) {
        console.log('object created event');
        this.networkTransmitter.addNetworkedEvent("objectCreate", {
            stepCount: this.gameEngine.world.stepCount,
            objectInstance: obj
        });
    }

    // handle new player connection
    onPlayerConnected(socket) {
        var that = this;

        console.log('Client connected');

        // save player
        this.connectedPlayers[socket.id] = socket;
        let playerId = socket.playerId = ++this.gameEngine.world.playerCount;
        socket.lastHandledInput = null;
        this.resetIdleTimeout(socket);

        console.log("Client Connected", socket.id);

        this.gameEngine.emit('server__playerJoined', {
            playerId: playerId
        });

        socket.emit('playerJoined', {
            playerId: playerId
        });

        socket.on('disconnect', function() {
            that.onPlayerDisconnected(socket.id, playerId);
            that.gameEngine.emit('server__playerDisconnected', {
                playerId: playerId
            });
        });

        // todo rename, use number instead of name
        socket.on('move', function(data) {
            that.onReceivedInput(data, socket);
        });

        // we got a packet of trace data, write it out to a side-file
        socket.on('trace', function(traceData) {
            traceData = JSON.parse(traceData);
            let traceString = '';
            traceData.forEach(t => { traceString += `[${t.time}]${t.step}>${t.data}\n`; });
            fs.appendFile(`client.${playerId}.trace`, traceString, err => { if (err) throw err; });
        });

        this.networkMonitor.registerPlayerOnServer(socket);
    }

    // handle player timeout
    onPlayerTimeout(socket) {
        console.log(`Client timed out after ${this.options.timeoutInterval} seconds`, socket.id);
        socket.disconnect();
    }

    // handle player dis-connection
    onPlayerDisconnected(socketId, playerId) {
        delete this.connectedPlayers[socketId];
        console.log('Client disconnected');
    }

    // resets the idle timeout for a given player
    resetIdleTimeout(socket) {
        if (socket.idleTimeout) clearTimeout(socket.idleTimeout);
        if (this.options.timeoutInterval > 0) {
            socket.idleTimeout = setTimeout(() => {
                this.onPlayerTimeout(socket);
            }, this.options.timeoutInterval * 1000);
        }
    }

    // add an input to the input-queue for the specific player
    // each queue is key'd by step, because there may be multiple inputs
    // per step
    queueInputForPlayer(data, playerId) {

        // create an input queue for this player, if one doesn't already exist
        if (!this.playerInputQueues.hasOwnProperty(playerId))
            this.playerInputQueues[playerId] = {};
        let queue = this.playerInputQueues[playerId];

        // create an array of inputs for this step, if one doesn't already exist
        if (!queue[data.step]) queue[data.step] = [];

        // add the input to the player's queue
        queue[data.step].push(data);
    }

    // an input has been received from a client, queue it for next step
    onReceivedInput(data, socket) {
        if (this.connectedPlayers[socket.id]) {
            this.connectedPlayers[socket.id].lastHandledInput = data.messageIndex;
        }
        this.gameEngine.emit('server__inputReceived', {
            input: data,
            playerId: socket.playerId
        });
        this.resetIdleTimeout(socket);

        this.queueInputForPlayer(data, socket.playerId);
    }
}

module.exports = ServerEngine;
