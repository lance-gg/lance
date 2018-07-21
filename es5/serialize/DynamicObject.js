'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _TwoVector = require('./TwoVector');

var _TwoVector2 = _interopRequireDefault(_TwoVector);

var _GameObject2 = require('./GameObject');

var _GameObject3 = _interopRequireDefault(_GameObject2);

var _Serializer = require('./Serializer');

var _Serializer2 = _interopRequireDefault(_Serializer);

var _BaseTypes = require('./BaseTypes');

var _BaseTypes2 = _interopRequireDefault(_BaseTypes);

var _MathUtils = require('../lib/MathUtils');

var _MathUtils2 = _interopRequireDefault(_MathUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * DynamicObject is the base class of the game's objects, for games which
 * rely on SimplePhysicsEngine.  It defines the
 * base object which can move around in the game world.  The
 * extensions of this object (the subclasses)
 * will be periodically synchronized from the server to every client.
 *
 * The dynamic objects have pseudo-physical properties, which
 * allow the client to extrapolate the position
 * of dynamic objects in-between server updates.
 */
var DynamicObject = function (_GameObject) {
    _inherits(DynamicObject, _GameObject);

    _createClass(DynamicObject, null, [{
        key: 'netScheme',


        /**
        * The netScheme is a dictionary of attributes in this game
        * object.  The attributes listed in the netScheme are those exact
        * attributes which will be serialized and sent from the server
        * to each client on every server update.
        * The netScheme member is implemented as a getter.
        *
        * You may choose not to implement this method, in which
        * case your object only transmits the default attributes
        * which are already part of {@link DynamicObject}.
        * But if you choose to add more attributes, make sure
        * the return value includes the netScheme of the super class.
        *
        * @memberof DynamicObject
        * @member {Object} netScheme
        * @example
        *     static get netScheme() {
        *       return Object.assign({
        *           mojo: { type: BaseTypes.TYPES.UINT8 },
        *         }, super.netScheme);
        *     }
        */
        get: function get() {
            return Object.assign({
                playerId: { type: _BaseTypes2.default.TYPES.INT16 },
                position: { type: _BaseTypes2.default.TYPES.CLASSINSTANCE },
                width: { type: _BaseTypes2.default.TYPES.INT16 },
                height: { type: _BaseTypes2.default.TYPES.INT16 },
                velocity: { type: _BaseTypes2.default.TYPES.CLASSINSTANCE },
                angle: { type: _BaseTypes2.default.TYPES.FLOAT32 }
            }, _get(DynamicObject.__proto__ || Object.getPrototypeOf(DynamicObject), 'netScheme', this));
        }

        /**
        * Creates an instance of a dynamic object.
        * NOTE: all subclasses of this class must comply with this constructor signature.
        *       This is required because the engine will create temporary instances when
        *       syncs arrive on the clients.
        * @param {GameEngine} gameEngine - the gameEngine this object will be used in
        * @param {Object} options - options for the new object. See {@link GameObject}
        * @param {Object} props - properties to be set in the new object
        * @param {TwoVector} props.position - position vector
        * @param {TwoVector} props.velocity - velocity vector
        */

    }]);

    function DynamicObject(gameEngine, options, props) {
        _classCallCheck(this, DynamicObject);

        /**
        * ID of player who created this object
        * @member {Number}
        */
        var _this = _possibleConstructorReturn(this, (DynamicObject.__proto__ || Object.getPrototypeOf(DynamicObject)).call(this, gameEngine, options));

        _this.playerId = 0;
        _this.bendingIncrements = 0;

        _this.position = new _TwoVector2.default(0, 0);
        _this.velocity = new _TwoVector2.default(0, 0);

        /**
         * Object width for collision detection purposes. Default is 1
         * @member {Number}
         */
        _this.width = 1;

        /**
         * Object Height for collision detection purposes. Default is 1
         * @member {Number}
         */
        _this.height = 1;

        /**
         * The friction coefficient. Velocity is multiplied by this for each step. Default is (1,1)
         * @member {TwoVector}
         */
        _this.friction = new _TwoVector2.default(1, 1);

        /**
         * Whether this object is affected by gravity.
         * @member {Boolean}
         */
        _this.affectedByGravity = true;

        /**
        * position
        * @member {TwoVector}
        */
        if (props && props.position) _this.position.copy(props.position);

        /**
        * velocity
        * @member {TwoVector}
        */
        if (props && props.velocity) _this.velocity.copy(props.velocity);

        /**
        * object orientation angle in degrees
        * @member {Number}
        */
        _this.angle = 90;

        /**
        * should rotate left by {@link DynamicObject#rotationSpeed} on next step
        * @member {Boolean}
        */
        _this.isRotatingLeft = false;

        /**
        * should rotate right by {@link DynamicObject#rotationSpeed} on next step
        * @member {Boolean}
        */
        _this.isRotatingRight = false;

        /**
        * should accelerate by {@link DynamicObject#acceleration} on next step
        * @member {Boolean}
        */
        _this.isAccelerating = false;

        /**
        * angle rotation per step
        * @member {Number}
        */
        _this.rotationSpeed = 2.5;

        /**
        * acceleration per step
        * @member {Number}
        */
        _this.acceleration = 0.1;

        _this.deceleration = 0.99;
        return _this;
    }

    // convenience getters


    _createClass(DynamicObject, [{
        key: 'toString',


        /**
         * Formatted textual description of the dynamic object.
         * The output of this method is used to describe each instance in the traces,
         * which significantly helps in debugging.
         *
         * @return {String} description - a string describing the DynamicObject
         */
        value: function toString() {
            function round3(x) {
                return Math.round(x * 1000) / 1000;
            }
            return this.constructor.name + '[' + this.id + '] player' + this.playerId + ' Pos=' + this.position + ' Vel=' + this.velocity + ' angle' + round3(this.angle);
        }

        /**
         * Each object class can define its own bending overrides.
         * return an object which can include attributes: position, velocity,
         * and angle.  In each case, you can specify a min value, max
         * value, and a percent value.
         *
         * @return {Object} bending - an object with bending paramters
         */

    }, {
        key: 'bendingToString',


        /**
         * Formatted textual description of the game object's current bending properties.
         * @return {String} description - a string description
         */
        value: function bendingToString() {
            if (this.bendingIncrements) return 'bend=' + this.bending + ' angle=' + this.bendingAngle + ' num_increments=' + this.bendingIncrements;
            return 'no bending';
        }

        /**
        * The maximum velocity allowed.  If returns null then ignored.
        * @memberof DynamicObject
        * @member {Number} maxSpeed
        */

    }, {
        key: 'syncTo',
        value: function syncTo(other) {
            _get(DynamicObject.prototype.__proto__ || Object.getPrototypeOf(DynamicObject.prototype), 'syncTo', this).call(this, other);
            this.position.copy(other.position);
            this.velocity.copy(other.velocity);
            this.bendingAngle = other.bendingAngle;
            this.rotationSpeed = other.rotationSpeed;
            this.acceleration = other.acceleration;
            this.deceleration = other.deceleration;
        }
    }, {
        key: 'bendToCurrent',
        value: function bendToCurrent(original, percent, worldSettings, isLocal, increments) {

            var bending = { increments: increments, percent: percent };
            // if the object has defined a bending multiples for this object, use them
            var positionBending = Object.assign({}, bending, this.bending.position);
            var velocityBending = Object.assign({}, bending, this.bending.velocity);
            var angleBending = Object.assign({}, bending, this.bending.angle);

            if (isLocal) {
                Object.assign(positionBending, this.bending.positionLocal);
                Object.assign(velocityBending, this.bending.velocityLocal);
                Object.assign(angleBending, this.bending.angleLocal);
            }

            // get the incremental delta position & velocity
            this.incrementScale = percent / increments;
            this.bendingPositionDelta = original.position.getBendingDelta(this.position, positionBending);
            this.bendingVelocityDelta = original.velocity.getBendingDelta(this.velocity, velocityBending);
            this.bendingAngleDelta = _MathUtils2.default.interpolateDeltaWithWrapping(original.angle, this.angle, angleBending.percent, 0, 2 * Math.PI) / increments;

            this.bendingTarget = new this.constructor();
            this.bendingTarget.syncTo(this);

            // revert to original
            this.position.copy(original.position);
            this.velocity.copy(original.velocity);
            this.angle = original.angle;

            // keep parameters
            this.bendingIncrements = increments;
            this.bendingOptions = bending;
        }
    }, {
        key: 'applyIncrementalBending',
        value: function applyIncrementalBending(stepDesc) {
            if (this.bendingIncrements === 0) return;

            var timeFactor = 1;
            if (stepDesc && stepDesc.dt) timeFactor = stepDesc.dt / (1000 / 60);

            var posDelta = this.bendingPositionDelta.clone().multiplyScalar(timeFactor);
            var velDelta = this.bendingVelocityDelta.clone().multiplyScalar(timeFactor);
            this.position.add(posDelta);
            this.velocity.add(velDelta);
            this.angle += this.bendingAngleDelta * timeFactor;

            this.bendingIncrements--;
        }
    }, {
        key: 'interpolate',
        value: function interpolate(nextObj, playPercentage, worldSettings) {

            var px = this.position.x;
            var py = this.position.y;
            var angle = this.angle;

            // TODO allow netscheme to designate interpolatable attribute (power, shield, etc)
            // first copy all the assignable attributes
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = Object.keys(this.constructor.netScheme)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var k = _step.value;

                    var val = nextObj[k];
                    if (_Serializer2.default.typeCanAssign(this.constructor.netScheme[k].type)) this[k] = val;else if (typeof val.clone === 'function') this[k] = val.clone();
                }

                // update other objects with interpolation
                // TODO interpolate using TwoVector methods, including wrap-around
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

            function calcInterpolate(start, end, wrap, p) {
                if (Math.abs(end - start) > wrap / 2) return end;
                return (end - start) * p + start;
            }
            this.position.x = calcInterpolate(px, nextObj.position.x, worldSettings.width, playPercentage);
            this.position.y = calcInterpolate(py, nextObj.position.y, worldSettings.height, playPercentage);

            var shortestAngle = ((nextObj.angle - angle) % 360 + 540) % 360 - 180;
            this.angle = angle + shortestAngle * playPercentage;
        }
    }, {
        key: 'getAABB',
        value: function getAABB() {
            // todo take rotation into account
            // registration point is in the middle
            return {
                min: [this.x - this.width / 2, this.y - this.height / 2],
                max: [this.x + this.width / 2, this.y + this.height / 2]
            };
        }
    }, {
        key: 'x',
        get: function get() {
            return this.position.x;
        }
    }, {
        key: 'y',
        get: function get() {
            return this.position.y;
        }
    }, {
        key: 'bending',
        get: function get() {
            return {
                // example:
                // position: { percent: 0.8, min: 0.0, max: 4.0 },
                // velocity: { percent: 0.4, min: 0.0 },
                // angleLocal: { percent: 0.0 }
            };
        }
    }, {
        key: 'maxSpeed',
        get: function get() {
            return null;
        }
    }]);

    return DynamicObject;
}(_GameObject3.default);

exports.default = DynamicObject;