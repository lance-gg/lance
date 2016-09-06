"use strict";

const fs = require('fs');
const Gameloop = require('node-gameloop');
const Serializer = require('./serialize/Serializer');
const NetworkTransmitter = require('./network/NetworkTransmitter');

class ServerEngine {

    constructor(io, gameEngine, inputOptions) {
        this.options = Object.assign({
            updateRate: 6,
            frameRate: 60,
            debug: {
                serverSendLag: false
            }
        }, inputOptions);

        this.io = io;
        this.gameEngine = gameEngine;
        this.serializer = new Serializer();
        this.networkTransmitter = new NetworkTransmitter(this.serializer);

        this.connectedPlayers = {};
        this.playerInputQueues = {};
        this.pendingAtomicEvents = [];

        io.on('connection', this.onPlayerConnected.bind(this));
        this.gameEngine.on('objectAdded', this.onObjectAdded.bind(this));
    }

    start() {
        var that = this;
        this.gameEngine.start();

        this.gameLoopId = Gameloop.setGameLoop(function() {
            that.step();
        }, 1000 / this.options.frameRate);
    }

    step() {
        var that = this;

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
        that.gameEngine.emit("preStep", that.gameEngine.world.stepCount);
        this.gameEngine.step();
        that.gameEngine.emit("postStep", that.gameEngine.world.stepCount);

        // update clients only at the specified step interval, as defined in options
        if (this.gameEngine.world.stepCount % this.options.updateRate == 0) {
            for (let socketId in this.connectedPlayers) {
                if (this.connectedPlayers.hasOwnProperty(socketId)) {
                    let payload = this.serializeUpdate(socketId);

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

        if (this.gameEngine.trace.length) {
            let traceData = this.gameEngine.trace.rotate();
            let traceString = '';
            traceData.forEach(t => { traceString += `[${t.time.toISOString()}]:${t.data}\n`; });
            fs.appendFile('server.trace', traceString, err => { if (err) throw err; });
        }
    }

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

    onObjectAdded(obj) {
        console.log('object created event');
        this.networkTransmitter.addNetworkedEvent("objectCreate", {
            stepCount: this.gameEngine.world.stepCount,
            objectInstance: obj
        });
    }

    onPlayerConnected(socket) {
        var that = this;

        console.log('Client connected');

        // save player
        this.connectedPlayers[socket.id] = socket;
        var playerId = socket.playerId = ++this.gameEngine.world.playerCount;
        socket.lastHandledInput = null;

        console.log("Client Connected", socket.id);

        this.gameEngine.emit('server.playerJoined', {
            playerId: playerId
        });

        socket.emit('playerJoined', {
            playerId: playerId
        });

        socket.on('disconnect', function() {
            that.onPlayerDisconnected(socket.id, playerId);
            that.gameEngine.emit('server.playerDisconnected', {
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
            traceData.forEach(t => { traceString += `[${t.time}]:${t.data}\n`; });
            fs.appendFile(`client.${playerId}.trace`, traceString, err => { if (err) throw err; });
        });
    }

    onPlayerDisconnected(socketId, playerId) {
        delete this.connectedPlayers[socketId];
        console.log('Client disconnected');
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
        this.gameEngine.emit('server.inputReceived', {
            input: data,
            playerId: socket.playerId
        });

        this.queueInputForPlayer(data, socket.playerId);
    }
}

module.exports = ServerEngine;
