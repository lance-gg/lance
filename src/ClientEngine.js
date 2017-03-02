'use strict';
var io = require('socket.io-client');
const Serializer = require('./serialize/Serializer');
const NetworkTransmitter = require('./network/NetworkTransmitter');
const NetworkMonitor = require('./network/NetworkMonitor');
const Synchronizer = require('./Synchronizer');
const Scheduler = require('./lib/Scheduler');

// externalizing these parameters as options would add confusion to game
// developers, and provide no real benefit.
const STEP_DRIFT_THRESHOLDS = {
    onServerSync: { MAX_LEAD: 1, MAX_LAG: 4 }, // max step lead/lag allowed after every server sync
    onEveryStep: { MAX_LEAD: 10, MAX_LAG: 10 } // max step lead/lag allowed at every step
};
const STEP_DRIFT_THRESHOLD__CLIENT_RESET = 20; // if we are behind this many steps, just reset the step counter
const GAME_UPS = 60; // default number of game steps per second
const STEP_DELAY_MSEC = 12; // if drift detected, delay next execution by this amount

/**
 * The client engine is the singleton which manages the client-side
 * process, starting the game engine, listening to network messages,
 * starting client steps, and handling world updates which arrive from
 * the server.
 */
class ClientEngine {

    /**
      * Create a client engine instance.
      *
      * @param {GameEngine} gameEngine - a game engine
      * @param {Object} inputOptions - options object
      * @param {Boolean} inputOptions.autoConnect - if true, the client will automatically attempt connect to server.
      * @param {Number} inputOptions.delayInputCount - if set, inputs will be delayed by this many steps before they are actually applied on the client.
      * @param {Number} inputOptions.healthCheckInterval - health check message interval (millisec).  Default is 1000.
      * @param {Number} inputOptions.healthCheckRTTSample - health check RTT calculation sample size.  Default is 10.
      * @param {Object} inputOptions.syncOptions - an object describing the synchronization method.  If not set, will be set to extrapolate, with local object bending set to 0.0 and remote object bending set to 0.6.  If the query-string parameter "sync" is defined, then that value is passed to this object's sync attribute.
      * @param {String} inputOptions.syncOptions.sync - chosen sync option, can be interpolate, extrapolate, or frameSync
      * @param {Number} inputOptions.syncOptions.localObjBending - amount of bending towards original client position, after each sync, for local objects
      * @param {Number} inputOptions.syncOptions.remoteObjBending - amount of bending towards original client position, after each sync, for remote objects
      * @param {Renderer} Renderer - the Renderer class constructor
      */
    constructor(gameEngine, inputOptions, Renderer) {

        this.options = Object.assign({
            autoConnect: true,
            healthCheckInterval: 1000,
            healthCheckRTTSample: 10,
            stepPeriod: 1000 / GAME_UPS
        }, inputOptions);

        /**
         * reference to serializer
         * @member {Serializer}
         */
        this.serializer = new Serializer();

        /**
         * reference to game engine
         * @member {GameEngine}
         */
        this.gameEngine = gameEngine;
        this.gameEngine.registerClasses(this.serializer);
        this.networkTransmitter = new NetworkTransmitter(this.serializer);
        this.networkMonitor = new NetworkMonitor();

        this.inboundMessages = [];
        this.outboundMessages = [];

        // create the renderer
        this.renderer = this.gameEngine.renderer = new Renderer(gameEngine, this);

        /**
        * client's player ID, as a string.
        * @member {String}
        */
        this.playerId = NaN;

        this.configureSynchronization();

        // create a buffer of delayed inputs (fifo)
        if (inputOptions && inputOptions.delayInputCount) {
            this.delayedInputs = [];
            for (let i = 0; i < inputOptions.delayInputCount; i++)
                this.delayedInputs[i] = [];
        }
    }

    /**
     * Check if a given object is owned by the player on this client
     *
     * @param {Object} object the game object to check
     * @return {Boolean} true if the game object is owned by the player on this client
     */
    isOwnedByPlayer(object) {
        return (object.playerId == this.playerId);
    }

    configureSynchronization() {

        // the reflect syncronizer is just interpolate strategy,
        // configured to show server syncs
        let syncOptions = this.options.syncOptions;
        if (syncOptions.sync === 'reflect') {
            syncOptions.sync = 'interpolate';
            syncOptions.reflect = true;
        }
        const synchronizer = new Synchronizer(this, syncOptions);
    }

    /**
     * Makes a connection to the game server
     *
     * @return {Promise} Resolved when the connection is made to the server
     */
    connect() {
        let connectionPromise = new Promise((resolve, reject) => {
            this.socket = io(this.options.serverURL);

            this.networkMonitor.registerClient(this);

            this.socket.once('connect', () => {
                console.log('connection made');
                resolve();
            });

            this.socket.on('playerJoined', (playerData) => {
                this.playerId = playerData.playerId;
                this.messageIndex = Number(this.playerId) * 10000;
            });

            this.socket.on('worldUpdate', (worldData) => {
                this.inboundMessages.push(worldData);
            });
        });

        return connectionPromise;
    }

    /**
     * Start the client engine, setting up the game loop, rendering loop and renderer.
     *
     * @return {Promise} Resolves once the Renderer has been initialized, and the game is
     * ready to connect
     */
    start() {

        // schedule and start the game loop
        this.scheduler = new Scheduler({
            period: this.options.stepPeriod,
            tick: this.step.bind(this),
            delay: STEP_DELAY_MSEC
        });
        this.gameEngine.start();
        this.scheduler.start();

        // initialize the renderer
        // the render loop waits for next animation frame
        if (!this.renderer) alert('ERROR: game has not defined a renderer');
        let renderLoop = () => {
            this.renderer.draw();
            window.requestAnimationFrame(renderLoop);
        };

        return this.renderer.init().then(() => {
            if (typeof window !== 'undefined')
                window.requestAnimationFrame(renderLoop);
            if (this.options.autoConnect) {
                this.connect();
            }
        });
    }

    // check if client step is too far ahead (leading) or too far
    // behing (lagging) the server step
    checkDrift(checkType) {

        if (!this.gameEngine.serverStep)
            return;

        let maxLead = STEP_DRIFT_THRESHOLDS[checkType].MAX_LEAD;
        let maxLag = STEP_DRIFT_THRESHOLDS[checkType].MAX_LAG;
        let clientStep = this.gameEngine.world.stepCount;
        let serverStep = this.gameEngine.serverStep;
        if (clientStep > serverStep + maxLead) {
            this.gameEngine.trace.warn(`step drift ${checkType}. [${clientStep} > ${serverStep} + ${maxLead}] Client is ahead of server.  Delaying next step.`);
            this.scheduler.delayTick();
        } else if (serverStep > clientStep + maxLag) {
            this.gameEngine.trace.warn(`step drift ${checkType}. [${serverStep} > ${clientStep} + ${maxLag}] Client is behind server.  Hurrying next step.`);
            this.scheduler.hurryTick();
        }
    }

    step() {

        // first update the trace state
        this.gameEngine.trace.setStep(this.gameEngine.world.stepCount + 1);

        // skip one step if requested
        if (this.skipOneStep === true) {
            this.skipOneStep = false;
            return;
        }

        this.gameEngine.emit('client__preStep');
        while (this.inboundMessages.length > 0) {
            this.handleInboundMessage(this.inboundMessages.pop());
            this.checkDrift('onServerSync');
        }

        // check for server/client step drift without update
        this.checkDrift('onEveryStep');

        // perform game engine step
        this.handleOutboundInput();
        this.applyDelayedInputs();
        this.gameEngine.step();
        this.gameEngine.emit('client__postStep');

        if (this.gameEngine.trace.length && this.socket) {
            // socket might not have been initialized at this point
            this.socket.emit('trace', JSON.stringify(this.gameEngine.trace.rotate()));
        }
    }

    doInputLocal(message) {
        if (this.gameEngine.passive) {
            return;
        }

        this.gameEngine.emit('client__preInput', message.data);
        this.gameEngine.processInput(message.data, this.playerId);
        this.gameEngine.emit('client__postInput', message.data);
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
     * This function should be called by the client whenever a user input
     * occurs.  This function will emit the input event,
     * forward the input to the client's game engine (with a delay if
     * so configured) and will transmit the input to the server as well.
     *
     * This function can be called by the extended client engine class,
     * typically at the beginning of client-side step processing (see event client__preStep)
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
        let syncHeader = syncEvents.find((e) => e.eventName === 'syncHeader');

        // emit that a snapshot has been received
        this.gameEngine.serverStep = syncHeader.stepCount;
        this.gameEngine.emit('client__syncReceived', {
            syncEvents: syncEvents,
            stepCount: syncHeader.stepCount
        });

        this.gameEngine.trace.info(`========== inbound world update ${syncHeader.stepCount} ==========`);

        // finally update the stepCount
        if (syncHeader.stepCount > this.gameEngine.world.stepCount + STEP_DRIFT_THRESHOLD__CLIENT_RESET) {
            this.gameEngine.trace.info(`========== world step count updated from ${this.gameEngine.world.stepCount} to  ${syncHeader.stepCount} ==========`);
            this.gameEngine.world.stepCount = syncHeader.stepCount;
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
