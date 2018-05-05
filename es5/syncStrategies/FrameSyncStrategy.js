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
    worldBufferLength: 60,
    clientStepLag: 0
};

var FrameSyncStrategy = function (_SyncStrategy) {
    _inherits(FrameSyncStrategy, _SyncStrategy);

    function FrameSyncStrategy(clientEngine, inputOptions) {
        _classCallCheck(this, FrameSyncStrategy);

        var _this = _possibleConstructorReturn(this, (FrameSyncStrategy.__proto__ || Object.getPrototypeOf(FrameSyncStrategy)).call(this, clientEngine, inputOptions));

        _this.options = Object.assign(defaults, inputOptions);

        _this.gameEngine = _this.clientEngine.gameEngine;
        _this.gameEngine.on('postStep', _this.frameSync.bind(_this));
        _this.gameEngine.on('client__syncReceived', _this.keepSnapshot.bind(_this));
        return _this;
    }

    // keep snapshot if it's the most recent we've seen


    _createClass(FrameSyncStrategy, [{
        key: 'keepSnapshot',
        value: function keepSnapshot(e) {
            if (!this.latestSnapshot || e.snapshot.stepCount > this.latestSnapshot.stepCount) {
                this.latestSnapshot = e.snapshot;
            }
        }

        /**
         * Perform client-side interpolation.
         */

    }, {
        key: 'frameSync',
        value: function frameSync() {

            var world = this.gameEngine.world;
            var nextWorld = this.latestSnapshot;

            // see if we need to sync
            // TODO: might as well exit this function now if (nextWorld.step == world.step)
            if (!nextWorld) {
                return;
            }

            // create new objects, interpolate existing objects
            for (var objId in nextWorld.objects) {
                if (nextWorld.objects.hasOwnProperty(objId)) {

                    var curObj = null;
                    var nextObj = nextWorld.objects[objId];

                    // if the object is new, add it
                    if (!world.objects.hasOwnProperty(objId)) {
                        console.log('adding new object ' + objId + ' at (' + nextObj.x + ',' + nextObj.y + ',' + nextObj.z + ') velocity (' + nextObj.velX + ',' + nextObj.velY + ',' + nextObj.velZ + ')');

                        curObj = new nextObj.constructor();
                        curObj.copyFrom(nextObj);
                        world.objects[objId] = curObj;
                        curObj.init({
                            velX: nextObj.velX,
                            velY: nextObj.velY,
                            velZ: nextObj.velZ
                        });
                        curObj.initRenderObject(this.gameEngine.renderer);

                        // if this game keeps a physics engine on the client side,
                        // we need to update it as well
                        if (this.gameEngine.physicsEngine) {
                            curObj.initPhysicsObject(this.gameEngine.physicsEngine);
                        }
                    } else {
                        curObj = world.objects[objId];
                        curObj.copy(nextObj);
                    }

                    // update render sub-object
                    curObj.updateRenderObject();
                }
            }
        }
    }]);

    return FrameSyncStrategy;
}(_SyncStrategy3.default);

exports.default = FrameSyncStrategy;