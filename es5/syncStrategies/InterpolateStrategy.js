'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _SyncStrategy2 = require('./SyncStrategy');

var _SyncStrategy3 = _interopRequireDefault(_SyncStrategy2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var defaults = {
    clientStepHold: 6,
    localObjBending: 1.0, // amount of bending towards position of sync object
    remoteObjBending: 1.0, // amount of bending towards position of sync object
    bendingIncrements: 6, // the bending should be applied increments (how many steps for entire bend)
    reflect: false
};

var InterpolateStrategy = function (_SyncStrategy) {
    _inherits(InterpolateStrategy, _SyncStrategy);

    function InterpolateStrategy(clientEngine, inputOptions) {
        _classCallCheck(this, InterpolateStrategy);

        var options = Object.assign({}, defaults, inputOptions);

        var _this = _possibleConstructorReturn(this, (InterpolateStrategy.__proto__ || Object.getPrototypeOf(InterpolateStrategy)).call(this, clientEngine, options));

        _this.gameEngine.ignoreInputsOnClient = true; // client side engine ignores inputs
        return _this;
    }

    // add an object to our world


    _createClass(InterpolateStrategy, [{
        key: 'addNewObject',
        value: function addNewObject(objId, newObj, stepCount) {

            var curObj = new newObj.constructor(this.gameEngine, {
                id: objId
            });
            curObj.syncTo(newObj);
            this.gameEngine.addObjectToWorld(curObj);
            console.log('adding new object ' + curObj);

            return curObj;
        }

        // apply a new sync

    }, {
        key: 'applySync',
        value: function applySync(sync) {
            var _this2 = this;

            this.gameEngine.trace.debug(function () {
                return 'interpolate applying sync';
            });
            //
            //    scan all the objects in the sync
            //
            // 1. if the object exists locally, sync to the server object
            // 2. if the object is new, just create it
            //
            this.needFirstSync = false;
            var world = this.gameEngine.world;
            var serverStep = sync.stepCount;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                var _loop = function _loop() {
                    var ids = _step.value;


                    // TODO: we are currently taking only the first event out of
                    // the events that may have arrived for this object
                    var ev = sync.syncObjects[ids][0];
                    var curObj = world.objects[ev.objectInstance.id];

                    if (curObj) {

                        // case 1: this object already exists locally
                        _this2.gameEngine.trace.trace(function () {
                            return 'object before syncTo: ' + curObj.toString();
                        });
                        curObj.saveState();
                        curObj.syncTo(ev.objectInstance);
                        _this2.gameEngine.trace.trace(function () {
                            return 'object after syncTo: ' + curObj.toString() + ' synced to step[' + ev.stepCount + ']';
                        });
                    } else {

                        // case 2: object does not exist.  create it now
                        _this2.addNewObject(ev.objectInstance.id, ev.objectInstance);
                    }
                };

                for (var _iterator = Object.keys(sync.syncObjects)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    _loop();
                }

                //
                // bend back to original state
                //
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

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                var _loop2 = function _loop2() {
                    var objId = _step2.value;


                    var obj = world.objects[objId];
                    var isLocal = obj.playerId == _this2.gameEngine.playerId; // eslint-disable-line eqeqeq
                    var bending = isLocal ? _this2.options.localObjBending : _this2.options.remoteObjBending;
                    obj.bendToCurrentState(bending, _this2.gameEngine.worldSettings, isLocal, _this2.options.bendingIncrements);
                    if (typeof obj.refreshRenderObject === 'function') obj.refreshRenderObject();
                    _this2.gameEngine.trace.trace(function () {
                        return 'object[' + objId + '] ' + obj.bendingToString();
                    });
                };

                for (var _iterator2 = Object.keys(world.objects)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    _loop2();
                }

                // destroy objects
                // TODO: use world.forEachObject((id, ob) => {});
                // TODO: identical code is in InterpolateStrategy
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

            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                var _loop3 = function _loop3() {
                    var objId = _step3.value;


                    var objEvents = sync.syncObjects[objId];

                    // if this was a full sync, and we did not get a corresponding object,
                    // remove the local object
                    if (sync.fullUpdate && !objEvents && objId < _this2.gameEngine.options.clientIDSpace) {
                        _this2.gameEngine.removeObjectFromWorld(objId);
                        return 'continue';
                    }

                    if (!objEvents || objId >= _this2.gameEngine.options.clientIDSpace) return 'continue';

                    // if we got an objectDestroy event, destroy the object
                    objEvents.forEach(function (e) {
                        if (e.eventName === 'objectDestroy') _this2.gameEngine.removeObjectFromWorld(objId);
                    });
                };

                for (var _iterator3 = Object.keys(world.objects)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var _ret3 = _loop3();

                    if (_ret3 === 'continue') continue;
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
        }
    }]);

    return InterpolateStrategy;
}(_SyncStrategy3.default);

exports.default = InterpolateStrategy;