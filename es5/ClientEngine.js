'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _socket = require('socket.io-client');

var _socket2 = _interopRequireDefault(_socket);

var _Utils = require('./lib/Utils');

var _Utils2 = _interopRequireDefault(_Utils);

var _Scheduler = require('./lib/Scheduler');

var _Scheduler2 = _interopRequireDefault(_Scheduler);

var _Synchronizer = require('./Synchronizer');

var _Synchronizer2 = _interopRequireDefault(_Synchronizer);

var _Serializer = require('./serialize/Serializer');

var _Serializer2 = _interopRequireDefault(_Serializer);

var _NetworkMonitor = require('./network/NetworkMonitor');

var _NetworkMonitor2 = _interopRequireDefault(_NetworkMonitor);

var _NetworkTransmitter = require('./network/NetworkTransmitter');

var _NetworkTransmitter2 = _interopRequireDefault(_NetworkTransmitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// externalizing these parameters as options would add confusion to game
// developers, and provide no real benefit.
var STEP_DRIFT_THRESHOLDS = {
    onServerSync: { MAX_LEAD: 1, MAX_LAG: 3 }, // max step lead/lag allowed after every server sync
    onEveryStep: { MAX_LEAD: 7, MAX_LAG: 8 // max step lead/lag allowed at every step
    } };
var STEP_DRIFT_THRESHOLD__CLIENT_RESET = 20; // if we are behind this many steps, just reset the step counter
var GAME_UPS = 60; // default number of game steps per second
var STEP_DELAY_MSEC = 12; // if forward drift detected, delay next execution by this amount
var STEP_HURRY_MSEC = 8; // if backward drift detected, hurry next execution by this amount

/**
 * The client engine is the singleton which manages the client-side
 * process, starting the game engine, listening to network messages,
 * starting client steps, and handling world updates which arrive from
 * the server.
 */

var ClientEngine = function () {

    /**
      * Create a client engine instance.
      *
      * @param {GameEngine} gameEngine - a game engine
      * @param {Object} inputOptions - options object
      * @param {Boolean} inputOptions.autoConnect - if true, the client will automatically attempt connect to server.
      * @param {Boolean} inputOptions.standaloneMode - if true, the client will never try to connect to a server
      * @param {Number} inputOptions.delayInputCount - if set, inputs will be delayed by this many steps before they are actually applied on the client.
      * @param {Number} inputOptions.healthCheckInterval - health check message interval (millisec). Default is 1000.
      * @param {Number} inputOptions.healthCheckRTTSample - health check RTT calculation sample size. Default is 10.
      * @param {Object} inputOptions.syncOptions - an object describing the synchronization method. If not set, will be set to extrapolate, with local object bending set to 0.0 and remote object bending set to 0.6. If the query-string parameter "sync" is defined, then that value is passed to this object's sync attribute.
      * @param {String} inputOptions.scheduler - When set to "render-schedule" the game step scheduling is controlled by the renderer and step time is variable.  When set to "fixed" the game step is run independently with a fixed step time. Default is "render-schedule".
      * @param {String} inputOptions.syncOptions.sync - chosen sync option, can be interpolate, extrapolate, or frameSync
      * @param {Number} inputOptions.syncOptions.localObjBending - amount (0 to 1.0) of bending towards original client position, after each sync, for local objects
      * @param {Number} inputOptions.syncOptions.remoteObjBending - amount (0 to 1.0) of bending towards original client position, after each sync, for remote objects
      * @param {String} inputOptions.serverURL - Socket server url
      * @param {Renderer} Renderer - the Renderer class constructor
      */
    function ClientEngine(gameEngine, inputOptions, Renderer) {
        _classCallCheck(this, ClientEngine);

        this.options = Object.assign({
            autoConnect: true,
            healthCheckInterval: 1000,
            healthCheckRTTSample: 10,
            stepPeriod: 1000 / GAME_UPS,
            scheduler: 'render-schedule',
            serverURL: null
        }, inputOptions);

        /**
         * reference to serializer
         * @member {Serializer}
         */
        this.serializer = new _Serializer2.default();

        /**
         * reference to game engine
         * @member {GameEngine}
         */
        this.gameEngine = gameEngine;
        this.gameEngine.registerClasses(this.serializer);
        this.networkTransmitter = new _NetworkTransmitter2.default(this.serializer);
        this.networkMonitor = new _NetworkMonitor2.default();

        this.inboundMessages = [];
        this.outboundMessages = [];

        // create the renderer
        this.renderer = this.gameEngine.renderer = new Renderer(gameEngine, this);

        // step scheduler
        this.scheduler = null;
        this.lastStepTime = 0;
        this.correction = 0;

        if (this.options.standaloneMode !== true) {
            this.configureSynchronization();
        }

        // create a buffer of delayed inputs (fifo)
        if (inputOptions && inputOptions.delayInputCount) {
            this.delayedInputs = [];
            for (var i = 0; i < inputOptions.delayInputCount; i++) {
                this.delayedInputs[i] = [];
            }
        }
    }

    // configure the Synchronizer singleton


    _createClass(ClientEngine, [{
        key: 'configureSynchronization',
        value: function configureSynchronization() {

            // the reflect syncronizer is just interpolate strategy,
            // configured to show server syncs
            var syncOptions = this.options.syncOptions;
            if (syncOptions.sync === 'reflect') {
                syncOptions.sync = 'interpolate';
                syncOptions.reflect = true;
            }

            var synchronizer = new _Synchronizer2.default(this, syncOptions);
        }

        /**
         * Makes a connection to the game server.  Extend this method if you want to add additional
         * logic on every connection. Call the super-class connect first, and return a promise which
         * executes when the super-class promise completes.
         *
         * @param {Object} [options] additional socket.io options
         * @return {Promise} Resolved when the connection is made to the server
         */

    }, {
        key: 'connect',
        value: function connect() {
            var _this = this;

            var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};


            var connectSocket = function connectSocket(matchMakerAnswer) {
                return new Promise(function (resolve, reject) {

                    if (matchMakerAnswer.status !== 'ok') reject('matchMaker failed status: ' + matchMakerAnswer.status);

                    console.log('connecting to game server ' + matchMakerAnswer.serverURL);
                    _this.socket = (0, _socket2.default)(matchMakerAnswer.serverURL, options);

                    _this.networkMonitor.registerClient(_this);

                    _this.socket.once('connect', function () {
                        console.log('connection made');
                        resolve();
                    });

                    _this.socket.once('error', function (error) {
                        reject(error);
                    });

                    _this.socket.on('playerJoined', function (playerData) {
                        _this.gameEngine.playerId = playerData.playerId;
                        _this.messageIndex = Number(_this.gameEngine.playerId) * 10000;
                    });

                    _this.socket.on('worldUpdate', function (worldData) {
                        _this.inboundMessages.push(worldData);
                    });
                });
            };

            var matchmaker = Promise.resolve({ serverURL: this.options.serverURL, status: 'ok' });
            if (this.options.matchmaker) matchmaker = _Utils2.default.httpGetPromise(this.options.matchmaker);

            return matchmaker.then(connectSocket);
        }

        /**
         * Start the client engine, setting up the game loop, rendering loop and renderer.
         *
         * @return {Promise} Resolves once the Renderer has been initialized, and the game is
         * ready to connect
         */

    }, {
        key: 'start',
        value: function start() {
            var _this2 = this;

            this.stopped = false;
            this.resolved = false;
            // initialize the renderer
            // the render loop waits for next animation frame
            if (!this.renderer) alert('ERROR: game has not defined a renderer');
            var renderLoop = function renderLoop(timestamp) {
                if (_this2.stopped) {
                    _this2.renderer.stop();
                    return;
                }
                _this2.lastTimestamp = _this2.lastTimestamp || timestamp;
                _this2.renderer.draw(timestamp, timestamp - _this2.lastTimestamp);
                _this2.lastTimestamp = timestamp;
                window.requestAnimationFrame(renderLoop);
            };

            return this.renderer.init().then(function () {
                _this2.gameEngine.start();

                if (_this2.options.scheduler === 'fixed') {
                    // schedule and start the game loop
                    _this2.scheduler = new _Scheduler2.default({
                        period: _this2.options.stepPeriod,
                        tick: _this2.step.bind(_this2),
                        delay: STEP_DELAY_MSEC
                    });
                    _this2.scheduler.start();
                }

                if (typeof window !== 'undefined') window.requestAnimationFrame(renderLoop);
                if (_this2.options.autoConnect && _this2.options.standaloneMode !== true) {
                    return _this2.connect().catch(function (error) {
                        _this2.stopped = true;
                        throw error;
                    });
                }
            }).then(function () {
                return new Promise(function (resolve, reject) {
                    _this2.resolveGame = resolve;
                    _this2.socket.on('disconnect', function () {
                        if (!_this2.resolved && !_this2.stopped) {
                            console.log('disconneted by server...');
                            _this2.stopped = true;
                            reject();
                        }
                    });
                });
            });
        }

        /**
         * Disconnect from game server
         */

    }, {
        key: 'disconnect',
        value: function disconnect() {
            if (!this.stopped) {
                this.socket.disconnect();
                this.stopped = true;
            }
        }

        // check if client step is too far ahead (leading) or too far
        // behing (lagging) the server step

    }, {
        key: 'checkDrift',
        value: function checkDrift(checkType) {

            if (!this.gameEngine.serverStep) return;

            var maxLead = STEP_DRIFT_THRESHOLDS[checkType].MAX_LEAD;
            var maxLag = STEP_DRIFT_THRESHOLDS[checkType].MAX_LAG;
            var clientStep = this.gameEngine.world.stepCount;
            var serverStep = this.gameEngine.serverStep;
            if (clientStep > serverStep + maxLead) {
                this.gameEngine.trace.warn(function () {
                    return 'step drift ' + checkType + '. [' + clientStep + ' > ' + serverStep + ' + ' + maxLead + '] Client is ahead of server.  Delaying next step.';
                });
                if (this.scheduler) this.scheduler.delayTick();
                this.lastStepTime += STEP_DELAY_MSEC;
                this.correction += STEP_DELAY_MSEC;
            } else if (serverStep > clientStep + maxLag) {
                this.gameEngine.trace.warn(function () {
                    return 'step drift ' + checkType + '. [' + serverStep + ' > ' + clientStep + ' + ' + maxLag + '] Client is behind server.  Hurrying next step.';
                });
                if (this.scheduler) this.scheduler.hurryTick();
                this.lastStepTime -= STEP_HURRY_MSEC;
                this.correction -= STEP_HURRY_MSEC;
            }
        }

        // execute a single game step.  This is normally called by the Renderer
        // at each draw event.

    }, {
        key: 'step',
        value: function step(t, dt, physicsOnly) {

            if (!this.resolved) {
                var result = this.gameEngine.getPlayerGameOverResult();
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
            this.gameEngine.step(false, t, dt);
            this.gameEngine.emit('client__postStep', { dt: dt });

            if (this.options.standaloneMode !== true && this.gameEngine.trace.length && this.socket) {
                // socket might not have been initialized at this point
                this.socket.emit('trace', JSON.stringify(this.gameEngine.trace.rotate()));
            }
        }

        // apply a user input on the client side

    }, {
        key: 'doInputLocal',
        value: function doInputLocal(message) {

            // some synchronization strategies (interpolate) ignore inputs on client side
            if (this.gameEngine.ignoreInputsOnClient) {
                return;
            }

            var inputEvent = { input: message.data, playerId: this.gameEngine.playerId };
            this.gameEngine.emit('client__processInput', inputEvent);
            this.gameEngine.emit('processInput', inputEvent);
            this.gameEngine.processInput(message.data, this.gameEngine.playerId, false);
        }

        // apply user inputs which have been queued in order to create
        // an artificial delay

    }, {
        key: 'applyDelayedInputs',
        value: function applyDelayedInputs() {
            if (!this.delayedInputs) {
                return;
            }
            var that = this;
            var delayed = this.delayedInputs.shift();
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
         * @param {String} input - string representing the input
         * @param {Object} inputOptions - options for the input
         */

    }, {
        key: 'sendInput',
        value: function sendInput(input, inputOptions) {
            var _this3 = this;

            var message = {
                command: 'move',
                data: {
                    messageIndex: this.messageIndex,
                    step: this.gameEngine.world.stepCount,
                    input: input,
                    options: inputOptions
                }
            };

            this.gameEngine.trace.info(function () {
                return 'USER INPUT[' + _this3.messageIndex + ']: ' + input + ' ' + (inputOptions ? JSON.stringify(inputOptions) : '{}');
            });

            // if we delay input application on client, then queue it
            // otherwise apply it now
            if (this.delayedInputs) {
                this.delayedInputs[this.delayedInputs.length - 1].push(message);
            } else {
                this.doInputLocal(message);
            }

            if (this.options.standaloneMode !== true) {
                this.outboundMessages.push(message);
            }

            this.messageIndex++;
        }

        // handle a message that has been received from the server

    }, {
        key: 'handleInboundMessage',
        value: function handleInboundMessage(syncData) {
            var _this4 = this;

            var syncEvents = this.networkTransmitter.deserializePayload(syncData).events;
            var syncHeader = syncEvents.find(function (e) {
                return e.eventName === 'syncHeader';
            });

            // emit that a snapshot has been received
            this.gameEngine.serverStep = syncHeader.stepCount;
            this.gameEngine.emit('client__syncReceived', {
                syncEvents: syncEvents,
                stepCount: syncHeader.stepCount,
                fullUpdate: syncHeader.fullUpdate
            });

            this.gameEngine.trace.info(function () {
                return '========== inbound world update ' + syncHeader.stepCount + ' ==========';
            });

            // finally update the stepCount
            if (syncHeader.stepCount > this.gameEngine.world.stepCount + STEP_DRIFT_THRESHOLD__CLIENT_RESET) {
                this.gameEngine.trace.info(function () {
                    return '========== world step count updated from ' + _this4.gameEngine.world.stepCount + ' to  ' + syncHeader.stepCount + ' ==========';
                });
                this.gameEngine.emit('client__stepReset', { oldStep: this.gameEngine.world.stepCount, newStep: syncHeader.stepCount });
                this.gameEngine.world.stepCount = syncHeader.stepCount;
            }
        }

        // emit an input to the authoritative server

    }, {
        key: 'handleOutboundInput',
        value: function handleOutboundInput() {
            for (var x = 0; x < this.outboundMessages.length; x++) {
                this.socket.emit(this.outboundMessages[x].command, this.outboundMessages[x].data);
            }
            this.outboundMessages = [];
        }
    }]);

    return ClientEngine;
}();

exports.default = ClientEngine;