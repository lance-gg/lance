"use strict";
var io = require("socket.io-client");
const Serializer = require('./serialize/Serializer');
const NetworkTransmitter = require('./network/NetworkTransmitter');
const NetworkMonitor = require('./network/NetworkMonitor');

class ClientEngine {

    constructor(gameEngine, inputOptions) {
        var that = this;

        this.socket = io();
        this.serializer = new Serializer();

        this.gameEngine = gameEngine;
        this.networkTransmitter = new NetworkTransmitter(this.serializer);

        this.networkMonitor = new NetworkMonitor();
        this.networkMonitor.registerClient(this);

        this.inboundMessages = [];
        this.outboundMessages = [];

        this.socket.on('playerJoined', function(playerData) {
            that.playerId = playerData.playerId;
        });

        // when objects get added, tag them as playerControlled if necessary
        this.gameEngine.on('objectAdded', function(object) {
            object.isPlayerControlled = (that.playerId == object.playerId);
        });
    }

    start() {
        var that = this;
        this.socket.on('worldUpdate', function(worldData) {
            that.inboundMessages.push(worldData);
        });

        this.gameEngine.start();
    }

    step() {
        this.gameEngine.emit("client.preStep");
        while (this.inboundMessages.length > 0) {
            this.handleInboundMessage(this.inboundMessages.pop());
        }

        this.handleOutboundInput();
        this.gameEngine.emit("preStep", this.gameEngine.world.stepCount);
        this.gameEngine.step();
        this.gameEngine.emit("postStep", this.gameEngine.world.stepCount);

        if (this.gameEngine.renderer) {
            this.gameEngine.renderer.draw();
        }
        this.gameEngine.emit("client.postStep");
    }

    sendInput(input) {
        var message = {
            command: 'move',
            data: {
                messageIndex: this.messageIndex,
                step: this.gameEngine.world.stepCount,
                input: input
            }
        };

        this.gameEngine.processInput(message.data, this.playerId);

        this.outboundMessages.push(message);

        this.messageIndex++;
    }

    handleInboundMessage(syncData) {
        let syncEvents = this.networkTransmitter.deserializePayload(syncData).events;

        // TODO: this should be done in a better way.
        // derive stepCount by taking the max of all events
        let maxStepCount = syncEvents.reduce((max, el) => {
            return el.stepCount ? Math.max(max, el.stepCount) : max;
        }, 0);

        // emit that a snapshot has been received
        this.gameEngine.emit('client.syncReceived', {
            syncEvents: syncEvents,
            stepCount: maxStepCount
        });

        // finally update the stepCount
        this.gameEngine.world.stepCount = maxStepCount;
    }

    handleOutboundInput() {
        for (var x = 0; x < this.outboundMessages.length; x++) {
            // console.log("sent", this.outboundMessages[x].data.messageIndex,
            // "step", this.outboundMessages[x].data.step);
            this.socket.emit(this.outboundMessages[x].command, this.outboundMessages[x].data);
        }
        this.outboundMessages = [];
    }

}

module.exports = ClientEngine;
