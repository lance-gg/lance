"use strict";
var io = require("socket.io-client");
const Serializer = require('./serialize/Serializer');
const NetworkTransmitter = require('./network/NetworkTransmitter');
const NetworkMonitor = require('./network/NetworkMonitor');
const Synchronizer = require('./Synchronizer');

const STEP_DRIFT_THRESHOLD = 10;
const GAME_UPS = 60;

/**
 * The client engine is the singleton which manages the client-side
 * process, starting the game engine, listening to network messages,
 * starting client steps, handling world updates which arrive from
 * the server.
 */
class ClientEngine {

    constructor(gameEngine, inputOptions) {

        this.options = Object.assign({}, inputOptions);

        this.socket = io();
        this.serializer = new Serializer();

        this.gameEngine = gameEngine;
        this.networkTransmitter = new NetworkTransmitter(this.serializer);

        this.networkMonitor = new NetworkMonitor();
        this.networkMonitor.registerClient(this);

        this.inboundMessages = [];
        this.outboundMessages = [];

        this.configureSynchronization();

        // create a buffer of delayed inputs (fifo)
        if (inputOptions && inputOptions.delayInputCount) {
            this.delayedInputs = [];
            for (let i = 0; i < inputOptions.delayInputCount; i++)
                this.delayedInputs[i] = [];
        }

        this.socket.on('playerJoined', (playerData) => {
            this.playerId = playerData.playerId;
            this.messageIndex = Number(this.playerId) * 10000;
        });

        // when objects get added, tag them as playerControlled if necessary
        this.gameEngine.on('objectAdded', (object) => {
            object.isPlayerControlled = (this.playerId == object.id);
        });
    }

    configureSynchronization() {

        let syncOptions = this.options.syncOptions;
        const synchronizer = new Synchronizer(this, syncOptions);

        // TODO: mixing different strategies together doesn't
        //     really make sense, so we need to refactor the code
        //     below.
        if (syncOptions.sync === 'extrapolate')
            synchronizer.extrapolateObjectSelector = () => { return true; };
        else if (syncOptions.sync === 'interpolate')
            synchronizer.interpolateObjectSelector = () => { return true; };
        else if (syncOptions.sync === 'frameSync')
            synchronizer.frameSyncSelector = () => { return true; };
    }

    start() {
        var that = this;
        this.socket.on('worldUpdate', function(worldData) {
            that.inboundMessages.push(worldData);
        });

        // initialize the renderer
        if (!this.renderer) {
            alert('ERROR: game has not defined a renderer');
        }
        this.renderer.init();

        // Simple JS game loop adapted from
        // http://nokarma.org/2011/02/02/javascript-game-development-the-game-loop/
        let skipTicks = 1000 / GAME_UPS;
        let nextGameTick = (new Date()).getTime();

        // the game loop ensures a fixed number of steps per second
        let gameLoop = () => {
            while ((new Date()).getTime() > nextGameTick) {
                this.step();
                nextGameTick += skipTicks;
            }
            window.requestAnimationFrame(gameLoop);
        };

        // the render loop waits for next animation frame
        let renderLoop = () => {
            this.renderer.draw();
            window.requestAnimationFrame(renderLoop);
        };

        // start game, game loop, render loop
        this.gameEngine.start();
        window.requestAnimationFrame(gameLoop);
        window.requestAnimationFrame(renderLoop);
    }

    step() {

        // first update the trace state
        this.gameEngine.trace.setStep(this.gameEngine.world.stepCount + 1);

        // skip one step if requested
        if (this.skipOneStep === true) {
            this.skipOneStep = false;
            return;
        }

        this.gameEngine.emit('client.preStep');
        while (this.inboundMessages.length > 0) {
            this.handleInboundMessage(this.inboundMessages.pop());
        }

        // check for server/client step drift
        if (this.gameEngine.serverStep) {
            if (this.gameEngine.world.stepCount > this.gameEngine.serverStep + STEP_DRIFT_THRESHOLD) {
                this.gameEngine.trace.warn(`step drift.  Client is ahead of server.  Client will skip a step.`);
                this.skipOneStep = true;
            } else if (this.gameEngine.serverStep > this.gameEngine.world.stepCount + STEP_DRIFT_THRESHOLD) {
                this.gameEngine.trace.warn(`step drift.  Client is behind server.`);
                this.doubleStep = true;
            }
        }

        // perform game engine step
        this.handleOutboundInput();
        this.applyDelayedInputs();
        this.gameEngine.step();
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

    /**
     * This function should be called by the client whenever an input
     * needs to be handled.  This function will emit the input event,
     * forward the input to the client's game engine (with a delay if
     * configured) and will transmit the input to the server.
     *
     * This function can be called by the extended client engine class,
     * at the beginning of client-side step processing (event client.preStep)
     *
     * @param {Object} input - string representing the input
     * @param {Object} inputOptions - options for the input
     */
    sendInput(input, inputOptions) {
        var message = {
            command: 'move',
            data: {
                messageIndex: this.messageIndex,
                step: this.gameEngine.world.stepCount,
                input: input,
                options: inputOptions
            }
        };

        this.gameEngine.trace.info(`USER INPUT[${this.messageIndex}]: ${input} ${inputOptions ? JSON.stringify(inputOptions) : '{}'}`);

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

        this.gameEngine.trace.info(`========== inbound world update ${this.gameEngine.world.stepCount} ==========`);

        // finally update the stepCount
        if (maxStepCount > this.gameEngine.world.stepCount) {
            this.gameEngine.world.stepCount = maxStepCount;
            this.gameEngine.trace.info(`========== world step count updated to  ${maxStepCount} ==========`);
        }
    }

    handleOutboundInput() {
        for (var x = 0; x < this.outboundMessages.length; x++) {
            this.socket.emit(this.outboundMessages[x].command, this.outboundMessages[x].data);
        }
        this.outboundMessages = [];
    }

}

module.exports = ClientEngine;
