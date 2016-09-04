"use strict";
var io = require("socket.io-client");
const Serializer = require('./serialize/Serializer');
const NetworkTransmitter = require('./network/NetworkTransmitter');


const STEP_DRIFT_THRESHOLD = 20;
const SKIP_ONE_STEP_COUNTDOWN = 10;

class ClientEngine {

    constructor(gameEngine, inputOptions) {
        var that = this;

        this.socket = io();
        this.serializer = new Serializer();

        this.gameEngine = gameEngine;
        this.networkTransmitter = new NetworkTransmitter(this.serializer);

        this.inboundMessages = [];
        this.outboundMessages = [];

        // create a buffer of delayed inputs (fifo)
        if (inputOptions && inputOptions.delayInputCount) {
            this.delayedInputs = [];
            for (let i = 0; i < inputOptions.delayInputCount; i++)
                this.delayedInputs[i] = [];
        }

        this.socket.on('playerJoined', function(playerData) {
            that.playerId = playerData.playerId;
            that.messageIndex = +that.playerId * 10000;
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

        // skip one step if requested
        // then count down before checking again
        if (typeof this.skipOneStep === 'number') this.skipOneStep--;
        if (this.skipOneStep === true) {
            this.skipOneStep = SKIP_ONE_STEP_COUNTDOWN;
            return;
        }

        this.gameEngine.emit("client.preStep");
        while (this.inboundMessages.length > 0) {
            this.handleInboundMessage(this.inboundMessages.pop());
        }

        // check for server/client step drift
        if (this.gameEngine.serverStep) {
            if (this.gameEngine.world.stepCount > this.gameEngine.serverStep + STEP_DRIFT_THRESHOLD) {
                this.gameEngine.trace.warn(`step drift.  server is behind client.  client will skip a step`);
                this.skipOneStep = true;
            } else if (this.gameEngine.serverStep > this.gameEngine.world.stepCount +  STEP_DRIFT_THRESHOLD) {
                this.gameEngine.trace.warn(`step drift.  client is behind server`);
            }
        }

        // perform game engine step
        this.handleOutboundInput();
        this.applyDelayedInputs();
        this.gameEngine.emit("preStep", this.gameEngine.world.stepCount);
        this.gameEngine.step();
        this.gameEngine.emit("postStep", this.gameEngine.world.stepCount);

        if (this.gameEngine.renderer) {
            this.gameEngine.renderer.draw();
        }
        this.gameEngine.emit("client.postStep");

        if (this.gameEngine.trace.length) {
            this.socket.emit("trace", JSON.stringify(this.gameEngine.trace.rotate()));
        }
    }

    doInputLocal(message) {
        this.gameEngine.emit('client.preInput', message.data);
        this.gameEngine.processInput(message.data, this.playerId);
        this.gameEngine.emit('client.postInput', message.data);
    }

    applyDelayedInputs() {
        if (!this.delayedInputs) {
            return;
        }
        let that = this;
        let delayed = this.delayedInputs.shift();
        if (delayed && delayed.length) {
            delayed.forEach(that.doInputLocal.bind(that));
        }
        this.delayedInputs.push([]);
    }

    // this function should be called whenever an input is handled.
    // this function will take care of raising the event and having it
    // shipped to the server.
    sendInput(input) {
        var message = {
            command: 'move',
            data: {
                messageIndex: this.messageIndex,
                step: this.gameEngine.world.stepCount,
                input: input
            }
        };

        this.gameEngine.trace.info(`USER INPUT[${this.messageIndex}]: ${input}`);

        // if we delay input application on client, then queue it
        // otherwise apply it now
        if (this.delayedInputs) {
            this.delayedInputs[this.delayedInputs.length - 1].push(message);
        } else {
            this.doInputLocal(message);
        }
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
        if (maxStepCount > this.gameEngine.world.stepCount)
            this.gameEngine.world.stepCount = maxStepCount;
    }

    handleOutboundInput() {
        for (var x = 0; x < this.outboundMessages.length; x++) {
            this.socket.emit(this.outboundMessages[x].command, this.outboundMessages[x].data);
        }
        this.outboundMessages = [];
    }

}

module.exports = ClientEngine;
