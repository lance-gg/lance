import io from 'socket.io-client';
import Utils from './lib/Utils.js';
import { Scheduler } from './lib/Scheduler.js';
import Serializer from './serialize/Serializer.js';
import NetworkMonitor from './network/NetworkMonitor.js';
import NetworkTransmitter from './network/NetworkTransmitter.js';
import { GameEngine } from './GameEngine.js';
import Renderer from './render/Renderer.js';
import { SyncStrategy } from './syncStrategies/SyncStrategy.js';
import { Socket } from 'socket.io';


// TODO: the GAME_UPS below should be common to the value implemented in the server engine,
// or better yet, it should be configurable in the GameEngine instead of ServerEngine+ClientEngine
const GAME_UPS = 60; // default number of game steps per second
const STEP_DELAY_MSEC = 12; // if forward drift detected, delay next execution by this amount
const STEP_HURRY_MSEC = 8; // if backward drift detected, hurry next execution by this amount

type ClientEngineOptions = Partial<ClientEngineOptionsInteral>;
type ClientEngineOptionsInteral = {
    verbose: boolean,
    autoConnect: boolean,
    standaloneMode: boolean,
    delayInputCount: number,
    healthCheckInterval: number,
    healthCheckRTTSample: number,
    stepPeriod: number,
    scheduler: string,
    serverURL: string,
    matchmaker: any
}

/**
 * The client engine is the singleton which manages the client-side
 * process, starting the game engine, listening to network messages,
 * starting client steps, and handling world updates which arrive from
 * the server.
 * Normally, a game will implement its own sub-class of ClientEngine, and may
 * override the constructor {@link ClientEngine#constructor} and the methods
 * {@link ClientEngine#start} and {@link ClientEngine#connect}
 */
class ClientEngine {

    public options: ClientEngineOptionsInteral;
    private serializer: Serializer;
    public gameEngine: GameEngine;
    private networkTransmitter: NetworkTransmitter;
    private networkMonitor: NetworkMonitor;
    private inboundMessages: any[];
    private outboundMessages: any[];
    private delayedInputs: any[];
    private renderer: Renderer;
    private scheduler: any;
    public lastStepTime: number;
    public correction: number;
    public socket: any;
    private messageIndex: number;
    private stopped: boolean;
    private resolved: boolean;
    private lastTimestamp: any;
    private skipOneStep: boolean;
    private resolveGame: (value: unknown) => void;
    syncStrategy: SyncStrategy;

    /**
      * Create a client engine instance.
      *
      * @param {GameEngine} gameEngine - a game engine
      * @param {Object} inputOptions - options object
      * @param {Boolean} inputOptions.verbose - print logs to console
      * @param {Boolean} inputOptions.autoConnect - if true, the client will automatically attempt connect to server.
      * @param {Boolean} inputOptions.standaloneMode - if true, the client will never try to connect to a server
      * @param {Number} inputOptions.delayInputCount - if set, inputs will be delayed by this many steps before they are actually applied on the client.
      * @param {Number} inputOptions.healthCheckInterval - health check message interval (millisec). Default is 1000.
      * @param {Number} inputOptions.healthCheckRTTSample - health check RTT calculation sample size. Default is 10.
      * @param {String} inputOptions.scheduler - When set to "render-schedule" the game step scheduling is controlled by the renderer and step time is variable.  When set to "fixed" the game step is run independently with a fixed step time. Default is "render-schedule".
      * @param {String} inputOptions.serverURL - Socket server url
      * @param {Renderer} renderer - the Renderer class constructor
      */
    constructor(gameEngine: GameEngine, syncStrategy: SyncStrategy, inputOptions: ClientEngineOptions, renderer: Renderer) {

        this.options = Object.assign({
            autoConnect: true,
            healthCheckInterval: 1000,
            healthCheckRTTSample: 10,
            stepPeriod: 1000 / GAME_UPS,
            scheduler: 'render-schedule',
            serverURL: null,
            verbose: false,
            standaloneMode: false,
            delayInputCount: 0,
            matchmaker: null
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
        this.renderer = renderer;
        this.networkTransmitter = new NetworkTransmitter(this.serializer);
        this.networkMonitor = new NetworkMonitor();
        this.syncStrategy = syncStrategy;
        this.inboundMessages = [];
        this.outboundMessages = [];

        // step scheduler
        this.scheduler = null;
        this.lastStepTime = 0;
        this.correction = 0;

        // create a buffer of delayed inputs (fifo)
        if (inputOptions && inputOptions.delayInputCount) {
            this.delayedInputs = [];
            for (let i = 0; i < inputOptions.delayInputCount; i++)
                this.delayedInputs[i] = [];
        }

        // provide back-reference to clientEngine on syncStrategy and renderer
        syncStrategy.initClient(this);
        this.renderer.clientEngine = this;

        this.gameEngine.emit('client__init');
    }

    /**
     * Makes a connection to the game server.  Extend this method if you want to add additional
     * logic on every connection. Call the super-class connect first, and return a promise which
     * executes when the super-class promise completes.
     *
     * @param {Object} [options] additional socket.io options
     * @return {Promise} Resolved when the connection is made to the server
     */
    connect(options = {}) {

        let connectSocket = matchMakerAnswer => {
            return new Promise((resolve: any, reject: any) => {

                if (matchMakerAnswer.status !== 'ok')
                    reject('matchMaker failed status: ' + matchMakerAnswer.status);

                if (this.options.verbose)
                    console.log(`connecting to game server ${matchMakerAnswer.serverURL}`);
                this.socket = io(matchMakerAnswer.serverURL, options);

                this.networkMonitor.registerClient(this);

                this.socket.once('connect', () => {
                    if (this.options.verbose)
                        console.log('connection made');
                    resolve();
                });

                this.socket.once('error', (error) => {
                    reject(error);
                });

                this.socket.on('playerJoined', (playerData) => {
                    this.gameEngine.playerId = playerData.playerId;
                    this.messageIndex = Number(this.gameEngine.playerId) * 10000;
                });

                this.socket.on('worldUpdate', (worldData) => {
                    this.inboundMessages.push(worldData);
                });

                this.socket.on('roomUpdate', (roomData) => {
                    this.gameEngine.emit('client__roomUpdate', roomData);
                });
            });
        };

        let matchmaker: Promise<any> = Promise.resolve({ serverURL: this.options.serverURL, status: 'ok' });
        if (this.options.matchmaker)
            matchmaker = Utils.httpGetPromise(this.options.matchmaker);

        return matchmaker.then(connectSocket);
    }

    /**
     * Start the client engine, setting up the game loop, rendering loop and renderer.
     *
     * @return {Promise} Resolves once the Renderer has been initialized, and the game is
     * ready to connect
     */
    start() {
        this.stopped = false;
        this.resolved = false;

        // initialize the renderer
        // the render loop waits for next animation frame
        if (!this.renderer) alert('ERROR: game has not defined a renderer');
        let renderLoop = (timestamp: any) => {
            if (this.stopped) {
                this.renderer.stop();
                return;
            }
            this.lastTimestamp = this.lastTimestamp || timestamp;
            this.renderer.draw(timestamp, timestamp - this.lastTimestamp);
            this.lastTimestamp = timestamp;
            window.requestAnimationFrame(renderLoop);
        };

        return this.renderer.init().then(() => {
            this.gameEngine.start();

            if (this.options.scheduler === 'fixed') {
                // schedule and start the game loop
                this.scheduler = new Scheduler({
                    period: this.options.stepPeriod,
                    tick: this.step.bind(this),
                    delay: STEP_DELAY_MSEC
                });
                this.scheduler.start();
            }

            if (typeof window !== 'undefined')
                window.requestAnimationFrame(renderLoop);
            if (this.options.autoConnect && this.options.standaloneMode !== true) {
                return this.connect()
                    .catch((error) => {
                        this.stopped = true;
                        throw error;
                    });
            }
        }).then(() => {
            return new Promise((resolve, reject) => {
                this.resolveGame = resolve;
                if (this.socket) {
                    this.socket.on('disconnect', () => {
                        if (!this.resolved && !this.stopped) {
                            if (this.options.verbose)
                                console.log('disconnected by server...');
                            this.stopped = true;
                            reject();
                        }
                    });
                }
            });
        });
    }

    /**
     * Disconnect from game server
     */
    disconnect() {
        if (!this.stopped) {
            this.socket.disconnect();
            this.stopped = true;
        }
    }

    // check if client step is too far ahead (leading) or too far
    // behing (lagging) the server step
    checkDrift(checkType) {

        if (!this.gameEngine.highestServerStep)
            return;

        let thresholds = SyncStrategy.STEP_DRIFT_THRESHOLDS;
        let maxLead = thresholds[checkType].MAX_LEAD;
        let maxLag = thresholds[checkType].MAX_LAG;
        let clientStep = this.gameEngine.world.stepCount;
        let serverStep = this.gameEngine.highestServerStep;
        if (clientStep > serverStep + maxLead) {
            this.gameEngine.trace.warn(() => `step drift ${checkType}. [${clientStep} > ${serverStep} + ${maxLead}] Client is ahead of server.  Delaying next step.`);
            if (this.scheduler) this.scheduler.delayTick();
            this.lastStepTime += STEP_DELAY_MSEC;
            this.correction += STEP_DELAY_MSEC;
        } else if (serverStep > clientStep + maxLag) {
            this.gameEngine.trace.warn(() => `step drift ${checkType}. [${serverStep} > ${clientStep} + ${maxLag}] Client is behind server.  Hurrying next step.`);
            if (this.scheduler) this.scheduler.hurryTick();
            this.lastStepTime -= STEP_HURRY_MSEC;
            this.correction -= STEP_HURRY_MSEC;
        }
    }

    // execute a single game step.  This is normally called by the Renderer
    // at each draw event.
    step(t, dt, physicsOnly = false) {

        if (!this.resolved) {
            const result = this.gameEngine.getPlayerGameOverResult();
            if (result) {
                this.resolved = true;
                this.resolveGame(result);
                // simulation can continue...
                // call disconnect to quit
            }
        }

        // physics only case
        if (physicsOnly) {
            this.gameEngine.step(false, t, dt, physicsOnly);
            return;
        }

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
        if (this.options.standaloneMode !== true) {
            this.handleOutboundInput();
        }
        this.applyDelayedInputs();
        this.gameEngine.step(false, t, dt, false);
        this.gameEngine.emit('client__postStep', { dt });

        if (this.options.standaloneMode !== true && this.gameEngine.trace.length && this.socket) {
            // socket might not have been initialized at this point
            this.socket.emit('trace', JSON.stringify(this.gameEngine.trace.rotate()));
        }
    }

    // apply a user input on the client side
    doInputLocal(message) {

        // some synchronization strategies (interpolate) ignore inputs on client side
        if (this.gameEngine.ignoreInputs) {
            return;
        }

        const inputEvent = { input: message.data, playerId: this.gameEngine.playerId };
        this.gameEngine.emit('client__processInput', inputEvent);
        this.gameEngine.emit('processInput', inputEvent);
        this.gameEngine.processInput(message.data, this.gameEngine.playerId, false);
    }

    // apply user inputs which have been queued in order to create
    // an artificial delay
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
     * typically at the beginning of client-side step processing {@see GameEngine#client__preStep}.
     *
     * @param {String} input - string representing the input
     * @param {Object} inputOptions - options for the input
     */
    sendInput(input: String, inputOptions: any) {
        let inputEvent = {
            command: 'move',
            data: {
                messageIndex: this.messageIndex,
                step: this.gameEngine.world.stepCount,
                input: input,
                options: inputOptions
            }
        };

        this.gameEngine.trace.info(() => `USER INPUT[${this.messageIndex}]: ${input} ${inputOptions ? JSON.stringify(inputOptions) : '{}'}`);

        // if we delay input application on client, then queue it
        // otherwise apply it now
        if (this.delayedInputs) {
            this.delayedInputs[this.delayedInputs.length - 1].push(inputEvent);
        } else {
            this.doInputLocal(inputEvent);
        }

        if (this.options.standaloneMode !== true) {
            this.outboundMessages.push(inputEvent);
        }

        this.messageIndex++;
    }

    // handle a message that has been received from the server
    handleInboundMessage(syncData) {

        let syncEvents = this.networkTransmitter.deserializePayload(syncData).events;
        let syncHeader = syncEvents.find((e) => NetworkTransmitter.getNetworkEvent(e) === 'syncHeader');

        // emit that a snapshot has been received
        if (!this.gameEngine.highestServerStep || syncHeader.stepCount > this.gameEngine.highestServerStep)
            this.gameEngine.highestServerStep = syncHeader.stepCount;
        this.gameEngine.emit('client__syncReceived', {
            syncEvents: syncEvents,
            stepCount: syncHeader.stepCount,
            fullUpdate: syncHeader.fullUpdate
        });

        this.gameEngine.trace.info(() => `========== inbound world update ${syncHeader.stepCount} ==========`);

        // finally update the stepCount
        if (syncHeader.stepCount > this.gameEngine.world.stepCount + SyncStrategy.STEP_DRIFT_THRESHOLDS.clientReset) {
            this.gameEngine.trace.info(() => `========== world step count updated from ${this.gameEngine.world.stepCount} to  ${syncHeader.stepCount} ==========`);
            this.gameEngine.emit('client__stepReset', { oldStep: this.gameEngine.world.stepCount, newStep: syncHeader.stepCount });
            this.gameEngine.world.stepCount = syncHeader.stepCount;
        }
    }

    // emit an input to the authoritative server
    handleOutboundInput() {
        for (var x = 0; x < this.outboundMessages.length; x++) {
            this.socket.emit(this.outboundMessages[x].command, this.outboundMessages[x].data);
        }
        this.outboundMessages = [];
    }

}

export {
    ClientEngineOptions,
    ClientEngine
}

