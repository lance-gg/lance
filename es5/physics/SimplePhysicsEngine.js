'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _PhysicsEngine2 = require('./PhysicsEngine');

var _PhysicsEngine3 = _interopRequireDefault(_PhysicsEngine2);

var _TwoVector = require('../serialize/TwoVector');

var _TwoVector2 = _interopRequireDefault(_TwoVector);

var _HSHGCollisionDetection = require('./SimplePhysics/HSHGCollisionDetection');

var _HSHGCollisionDetection2 = _interopRequireDefault(_HSHGCollisionDetection);

var _BruteCollisionDetection = require('./SimplePhysics/BruteCollisionDetection');

var _BruteCollisionDetection2 = _interopRequireDefault(_BruteCollisionDetection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var dv = new _TwoVector2.default();
var dx = new _TwoVector2.default();
/**
 * SimplePhysicsEngine is a pseudo-physics engine which works with
 * objects of class DynamicObject.
 */

var SimplePhysicsEngine = function (_PhysicsEngine) {
    _inherits(SimplePhysicsEngine, _PhysicsEngine);

    function SimplePhysicsEngine(initOptions) {
        _classCallCheck(this, SimplePhysicsEngine);

        // todo does this mean both modules always get loaded?
        var _this = _possibleConstructorReturn(this, (SimplePhysicsEngine.__proto__ || Object.getPrototypeOf(SimplePhysicsEngine)).call(this, initOptions));

        if (initOptions.collisions && initOptions.collisions.type === 'HSHG') {
            _this.collisionDetection = new _HSHGCollisionDetection2.default();
        } else {
            _this.collisionDetection = new _BruteCollisionDetection2.default();
        }

        /**
         * The actor's name.
         * @memberof SimplePhysicsEngine
         * @member {TwoVector} gravity affecting all objects
         */
        _this.gravity = new _TwoVector2.default(0, 0);

        if (initOptions.gravity) _this.gravity.copy(initOptions.gravity);

        var collisionOptions = Object.assign({ gameEngine: _this.gameEngine }, initOptions.collisionOptions);
        _this.collisionDetection.init(collisionOptions);
        return _this;
    }

    // a single object advances, based on:
    // isRotatingRight, isRotatingLeft, isAccelerating, current velocity
    // wrap-around the world if necessary


    _createClass(SimplePhysicsEngine, [{
        key: 'objectStep',
        value: function objectStep(o, dt) {

            // calculate factor
            if (dt === 0) return;

            if (dt) dt /= 1 / 60;else dt = 1;

            var worldSettings = this.gameEngine.worldSettings;

            // TODO: remove this code in version 4: these attributes are deprecated
            if (o.isRotatingRight) {
                o.angle += o.rotationSpeed;
            }
            if (o.isRotatingLeft) {
                o.angle -= o.rotationSpeed;
            }

            // TODO: remove this code in version 4: these attributes are deprecated
            if (o.angle >= 360) {
                o.angle -= 360;
            }
            if (o.angle < 0) {
                o.angle += 360;
            }

            // TODO: remove this code in version 4: these attributes are deprecated
            if (o.isAccelerating) {
                var rad = o.angle * (Math.PI / 180);
                dv.set(Math.cos(rad), Math.sin(rad)).multiplyScalar(o.acceleration).multiplyScalar(dt);
                o.velocity.add(dv);
            }

            // apply gravity
            if (o.affectedByGravity) o.velocity.add(this.gravity);

            var velMagnitude = o.velocity.length();
            if (o.maxSpeed !== null && velMagnitude > o.maxSpeed) {
                o.velocity.multiplyScalar(o.maxSpeed / velMagnitude);
            }

            o.isAccelerating = false;
            o.isRotatingLeft = false;
            o.isRotatingRight = false;

            dx.copy(o.velocity).multiplyScalar(dt);
            o.position.add(dx);

            o.velocity.multiply(o.friction);

            // wrap around the world edges
            if (worldSettings.worldWrap) {
                if (o.position.x >= worldSettings.width) {
                    o.position.x -= worldSettings.width;
                }
                if (o.position.y >= worldSettings.height) {
                    o.position.y -= worldSettings.height;
                }
                if (o.position.x < 0) {
                    o.position.x += worldSettings.width;
                }
                if (o.position.y < 0) {
                    o.position.y += worldSettings.height;
                }
            }
        }

        // entry point for a single step of the Simple Physics

    }, {
        key: 'step',
        value: function step(dt, objectFilter) {

            // each object should advance
            var objects = this.gameEngine.world.objects;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = Object.keys(objects)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var objId = _step.value;


                    // shadow objects are not re-enacted
                    var ob = objects[objId];
                    if (!objectFilter(ob)) continue;

                    // run the object step
                    this.objectStep(ob, dt);
                }

                // emit event on collision
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

            this.collisionDetection.detect(this.gameEngine);
        }
    }]);

    return SimplePhysicsEngine;
}(_PhysicsEngine3.default);

exports.default = SimplePhysicsEngine;