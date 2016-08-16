"use strict";

const Gameloop = require('node-gameloop');
const Serializer = require('./serialize/Serializer');
const NetworkTransmitter = require('./network/NetworkTransmitter');

class ServerEngine{

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
        this.pendingAtomicEvents = [];

        io.on('connection', this.onPlayerConnected.bind(this));
        this.gameEngine.on('objectAdded', this.onObjectAdded.bind(this));
    }

    start() {
        var that=this;
        this.gameEngine.start();

        this.gameLoopId = Gameloop.setGameLoop(function() {
            that.step();
        }, 1000 / this.options.frameRate);
    }

    step() {
        var that = this;

        this.serverTime = (new Date().getTime());

        that.gameEngine.emit("preStep",that.gameEngine.world.stepCount);
        this.gameEngine.step();
        that.gameEngine.emit("postStep",that.gameEngine.world.stepCount);

        //update clients only at the specified step interval, as defined in options
        if (this.gameEngine.world.stepCount % this.options.updateRate == 0) {
            for (let socketId in this.connectedPlayers) {
                if (this.connectedPlayers.hasOwnProperty(socketId)) {
                    let payload =  this.serializeUpdate(socketId);

                    //simulate server send lag
                    if (this.options.debug.serverSendLag !== false) {
                        setTimeout(function() {
                            //verify again that the player exists
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


        //todo rename, use number instead of name
        socket.on('move', function(data) {
            that.onReceivedInput(data, socket)
        });
    };

    onPlayerDisconnected(socketId, playerId) {
        delete this.connectedPlayers[socketId];
        console.log('Client disconnected')
    };

    onReceivedInput(data, socket) {
        if (this.connectedPlayers[socket.id]) {
            this.connectedPlayers[socket.id].lastHandledInput = data.messageIndex;
        }
        this.gameEngine.emit('server.inputReceived', {
            input: data,
            playerId: socket.playerId
        });
        // console.log("last handled input", this.connectedPlayers[socket.id].lastHandledInput);
    }
}

module.exports = ServerEngine;
