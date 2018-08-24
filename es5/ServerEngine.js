'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _Utils = require('./lib/Utils');

var _Utils2 = _interopRequireDefault(_Utils);

var _Scheduler = require('./lib/Scheduler');

var _Scheduler2 = _interopRequireDefault(_Scheduler);

var _Serializer = require('./serialize/Serializer');

var _Serializer2 = _interopRequireDefault(_Serializer);

var _NetworkTransmitter = require('./network/NetworkTransmitter');

var _NetworkTransmitter2 = _interopRequireDefault(_NetworkTransmitter);

var _NetworkMonitor = require('./network/NetworkMonitor');

var _NetworkMonitor2 = _interopRequireDefault(_NetworkMonitor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
var ServerEngine = function () {

    /**
     * create a ServerEngine instance
     *
     * @param {SocketIO} io - the SocketIO server
     * @param {GameEngine} gameEngine - instance of GameEngine
     * @param {Object} options - server options
     * @param {Number} options.stepRate - number of steps per second
     * @param {Number} options.updateRate - number of steps in each update (sync)
     * @param {String} options.tracesPath - path where traces should go
     * @param {Boolean} options.updateOnObjectCreation - should send update immediately when new object is created
     * @param {Number} options.timeoutInterval=40 - number of seconds after which a player is automatically disconnected if no input is received. Set to 0 for no timeout
     * @return {ServerEngine} serverEngine - self
     */
    function ServerEngine(io, gameEngine, options) {
        _classCallCheck(this, ServerEngine);

        this.options = Object.assign({
            updateRate: 6,
            stepRate: 60,
            timeoutInterval: 40,
            updateOnObjectCreation: true,
            tracesPath: '',
            debug: {
                serverSendLag: false
            }
        }, options);
        if (this.options.tracesPath !== '') {
            this.options.tracesPath += '/';
            require('mkdirp').sync(this.options.tracesPath);
        }

        this.io = io;

        /**
         * reference to game engine
         * @member {GameEngine}
         */
        this.serializer = new _Serializer2.default();
        this.gameEngine = gameEngine;
        this.gameEngine.registerClasses(this.serializer);
        this.networkTransmitter = new _NetworkTransmitter2.default(this.serializer);
        this.networkMonitor = new _NetworkMonitor2.default();

        this.connectedPlayers = {};
        this.playerInputQueues = {};
        this.pendingAtomicEvents = [];
        this.objMemory = {};
        this.requestImmediateUpdate = false;
        this.syncCounter = 0;

        io.on('connection', this.onPlayerConnected.bind(this));
        this.gameEngine.on('objectAdded', this.onObjectAdded.bind(this));
        this.gameEngine.on('objectDestroyed', this.onObjectDestroyed.bind(this));

        return this;
    }

    // start the ServerEngine


    _createClass(ServerEngine, [{
        key: 'start',
        value: function start() {
            this.gameEngine.start();
            this.gameEngine.emit('server__init');

            var schedulerConfig = {
                tick: this.step.bind(this),
                period: 1000 / this.options.stepRate,
                delay: 4
            };
            this.scheduler = new _Scheduler2.default(schedulerConfig).start();
        }

        // every server step starts here

    }, {
        key: 'step',
        value: function step() {
            var _this = this;

            // first update the trace state
            this.gameEngine.trace.setStep(this.gameEngine.world.stepCount + 1);
            this.gameEngine.emit('server__preStep', this.gameEngine.world.stepCount + 1);

            this.serverTime = new Date().getTime();

            // for each player, replay all the inputs in the oldest step
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                var _loop = function _loop() {
                    var playerIdStr = _step.value;

                    var playerId = Number(playerIdStr);
                    var inputQueue = _this.playerInputQueues[playerId];
                    var queueSteps = Object.keys(inputQueue);
                    var minStep = Math.min.apply(null, queueSteps);

                    // check that there are inputs for this step,
                    // and that we have reached/passed this step
                    if (queueSteps.length > 0 && minStep <= _this.gameEngine.world.stepCount) {
                        inputQueue[minStep].forEach(function (input) {
                            _this.gameEngine.emit('server__processInput', { input: input, playerId: playerId });
                            _this.gameEngine.emit('processInput', { input: input, playerId: playerId });
                            _this.gameEngine.processInput(input, playerId, true);
                        });
                        delete inputQueue[minStep];
                    }
                };

                for (var _iterator = Object.keys(this.playerInputQueues)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    _loop();
                }

                // run the game engine step
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            this.gameEngine.step(false, this.serverTime / 1000);

            // update clients only at the specified step interval, as defined in options
            if (this.requestImmediateUpdate || this.gameEngine.world.stepCount % this.options.updateRate === 0) {

                // if at least one player is new, we should send a full payload
                var diffUpdate = true;
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = Object.keys(this.connectedPlayers)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var socketId = _step2.value;

                        var player = this.connectedPlayers[socketId];
                        if (player.state === 'new') {
                            player.state = 'synced';
                            diffUpdate = false;
                        }
                    }

                    // also, one in twenty syncs is a full update
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }

                if (this.syncCounter++ % 20 === 0) diffUpdate = false;

                var payload = this.serializeUpdate({ diffUpdate: diffUpdate });
                this.gameEngine.trace.info(function () {
                    return '========== sending world update ' + _this.gameEngine.world.stepCount + ' is delta update: ' + diffUpdate + ' ==========';
                });
                // TODO: implement server lag by queuing the emit to a future step
                var _iteratorNormalCompletion3 = true;
                var _didIteratorError3 = false;
                var _iteratorError3 = undefined;

                try {
                    for (var _iterator3 = Object.keys(this.connectedPlayers)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                        var _socketId = _step3.value;

                        this.connectedPlayers[_socketId].socket.emit('worldUpdate', payload);
                    }
                } catch (err) {
                    _didIteratorError3 = true;
                    _iteratorError3 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion3 && _iterator3.return) {
                            _iterator3.return();
                        }
                    } finally {
                        if (_didIteratorError3) {
                            throw _iteratorError3;
                        }
                    }
                }

                this.networkTransmitter.clearPayload();
                this.requestImmediateUpdate = false;
            }

            // step is done on the server side
            this.gameEngine.emit('server__postStep', this.gameEngine.world.stepCount);

            if (this.gameEngine.trace.length) {
                var traceData = this.gameEngine.trace.rotate();
                var traceString = '';
                traceData.forEach(function (t) {
                    traceString += '[' + t.time.toISOString() + ']' + t.step + '>' + t.data + '\n';
                });
                _fs2.default.appendFile(this.options.tracesPath + 'server.trace', traceString, function (err) {
                    if (err) throw err;
                });
            }
        }

        // create a serialized package of the game world
        // TODO: this process could be made much much faster if the buffer creation and
        //       size calculation are done in a single phase, along with string pruning.

    }, {
        key: 'serializeUpdate',
        value: function serializeUpdate(options) {
            var world = this.gameEngine.world;
            var diffUpdate = Boolean(options && options.diffUpdate);

            // add this sync header
            // currently this is just the sync step count
            this.networkTransmitter.addNetworkedEvent('syncHeader', {
                stepCount: world.stepCount,
                fullUpdate: Number(!diffUpdate)
            });

            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = Object.keys(world.objects)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var _objId = _step4.value;

                    var obj = world.objects[_objId];
                    var prevObject = this.objMemory[_objId];

                    // if the object (in serialized form) hasn't changed, move on
                    if (diffUpdate) {
                        var s = obj.serialize(this.serializer);
                        if (prevObject && _Utils2.default.arrayBuffersEqual(s.dataBuffer, prevObject)) continue;else this.objMemory[_objId] = s.dataBuffer;

                        // prune strings which haven't changed
                        obj = obj.prunedStringsClone(this.serializer, prevObject);
                    }

                    this.networkTransmitter.addNetworkedEvent('objectUpdate', {
                        stepCount: world.stepCount,
                        objectInstance: obj
                    });
                }

                // remove memory objects which no longer exist
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }

            if (diffUpdate) {
                var _iteratorNormalCompletion5 = true;
                var _didIteratorError5 = false;
                var _iteratorError5 = undefined;

                try {
                    for (var _iterator5 = Object.keys(this.objMemory)[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                        var objId = _step5.value;

                        if (!(objId in world.objects)) {
                            delete this.objMemory[objId];
                        }
                    }
                } catch (err) {
                    _didIteratorError5 = true;
                    _iteratorError5 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion5 && _iterator5.return) {
                            _iterator5.return();
                        }
                    } finally {
                        if (_didIteratorError5) {
                            throw _iteratorError5;
                        }
                    }
                }
            }

            return this.networkTransmitter.serializePayload();
        }

        // handle the object creation

    }, {
        key: 'onObjectAdded',
        value: function onObjectAdded(obj) {
            this.networkTransmitter.addNetworkedEvent('objectCreate', {
                stepCount: this.gameEngine.world.stepCount,
                objectInstance: obj
            });

            if (this.options.updateOnObjectCreation) this.requestImmediateUpdate = true;
        }

        // handle the object creation

    }, {
        key: 'onObjectDestroyed',
        value: function onObjectDestroyed(obj) {
            this.networkTransmitter.addNetworkedEvent('objectDestroy', {
                stepCount: this.gameEngine.world.stepCount,
                objectInstance: obj
            });
        }
    }, {
        key: 'getPlayerId',
        value: function getPlayerId(socket) {}

        // handle new player connection

    }, {
        key: 'onPlayerConnected',
        value: function onPlayerConnected(socket) {
            var that = this;

            console.log('Client connected');

            // save player
            this.connectedPlayers[socket.id] = {
                socket: socket,
                state: 'new'
            };

            var playerId = this.getPlayerId(socket);
            if (!playerId) {
                playerId = ++this.gameEngine.world.playerCount;
            }
            socket.playerId = playerId;

            socket.lastHandledInput = null;
            socket.joinTime = new Date().getTime();
            this.resetIdleTimeout(socket);

            console.log('Client Connected', socket.id);

            var playerEvent = { id: socket.id, playerId: playerId, joinTime: socket.joinTime, disconnectTime: 0 };
            this.gameEngine.emit('server__playerJoined', playerEvent);
            this.gameEngine.emit('playerJoined', playerEvent);
            socket.emit('playerJoined', playerEvent);

            socket.on('disconnect', function () {
                playerEvent.disconnectTime = new Date().getTime();
                that.onPlayerDisconnected(socket.id, playerId);
                that.gameEngine.emit('server__playerDisconnected', playerEvent);
                that.gameEngine.emit('playerDisconnected', playerEvent);
            });

            // todo rename, use number instead of name
            socket.on('move', function (data) {
                that.onReceivedInput(data, socket);
            });

            // we got a packet of trace data, write it out to a side-file
            socket.on('trace', function (traceData) {
                traceData = JSON.parse(traceData);
                var traceString = '';
                traceData.forEach(function (t) {
                    traceString += '[' + t.time + ']' + t.step + '>' + t.data + '\n';
                });
                _fs2.default.appendFile(that.options.tracesPath + 'client.' + playerId + '.trace', traceString, function (err) {
                    if (err) throw err;
                });
            });

            this.networkMonitor.registerPlayerOnServer(socket);
        }

        // handle player timeout

    }, {
        key: 'onPlayerTimeout',
        value: function onPlayerTimeout(socket) {
            console.log('Client timed out after ' + this.options.timeoutInterval + ' seconds', socket.id);
            socket.disconnect();
        }

        // handle player dis-connection

    }, {
        key: 'onPlayerDisconnected',
        value: function onPlayerDisconnected(socketId, playerId) {
            delete this.connectedPlayers[socketId];
            console.log('Client disconnected');
        }

        // resets the idle timeout for a given player

    }, {
        key: 'resetIdleTimeout',
        value: function resetIdleTimeout(socket) {
            var _this2 = this;

            if (socket.idleTimeout) clearTimeout(socket.idleTimeout);
            if (this.options.timeoutInterval > 0) {
                socket.idleTimeout = setTimeout(function () {
                    _this2.onPlayerTimeout(socket);
                }, this.options.timeoutInterval * 1000);
            }
        }

        // add an input to the input-queue for the specific player
        // each queue is key'd by step, because there may be multiple inputs
        // per step

    }, {
        key: 'queueInputForPlayer',
        value: function queueInputForPlayer(data, playerId) {

            // create an input queue for this player, if one doesn't already exist
            if (!this.playerInputQueues.hasOwnProperty(playerId)) this.playerInputQueues[playerId] = {};
            var queue = this.playerInputQueues[playerId];

            // create an array of inputs for this step, if one doesn't already exist
            if (!queue[data.step]) queue[data.step] = [];

            // add the input to the player's queue
            queue[data.step].push(data);
        }

        // an input has been received from a client, queue it for next step

    }, {
        key: 'onReceivedInput',
        value: function onReceivedInput(data, socket) {
            if (this.connectedPlayers[socket.id]) {
                this.connectedPlayers[socket.id].socket.lastHandledInput = data.messageIndex;
            }

            this.resetIdleTimeout(socket);

            this.queueInputForPlayer(data, socket.playerId);
        }

        /**
         * Report game status
         * This method is only relevant if the game uses MatchMaker functionality.
         * This method must return the game status.
         *
         * @return {String} Stringified game status object.
         */

    }, {
        key: 'gameStatus',
        value: function gameStatus() {
            var gameStatus = {
                numPlayers: Object.keys(this.connectedPlayers).length,
                upTime: 0,
                cpuLoad: 0,
                memoryLoad: 0,
                players: {}
            };

            var _iteratorNormalCompletion6 = true;
            var _didIteratorError6 = false;
            var _iteratorError6 = undefined;

            try {
                for (var _iterator6 = Object.keys(this.connectedPlayers)[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                    var p = _step6.value;

                    gameStatus.players[p] = {
                        frameRate: 0
                    };
                }
            } catch (err) {
                _didIteratorError6 = true;
                _iteratorError6 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion6 && _iterator6.return) {
                        _iterator6.return();
                    }
                } finally {
                    if (_didIteratorError6) {
                        throw _iteratorError6;
                    }
                }
            }

            return JSON.stringify(gameStatus);
        }
    }]);

    return ServerEngine;
}();

exports.default = ServerEngine;