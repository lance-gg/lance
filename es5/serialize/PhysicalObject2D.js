'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _GameObject2 = require('./GameObject');

var _GameObject3 = _interopRequireDefault(_GameObject2);

var _Serializer = require('./Serializer');

var _Serializer2 = _interopRequireDefault(_Serializer);

var _TwoVector = require('./TwoVector');

var _TwoVector2 = _interopRequireDefault(_TwoVector);

var _MathUtils = require('../lib/MathUtils');

var _MathUtils2 = _interopRequireDefault(_MathUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * The PhysicalObject2D is the base class for physical game objects in 2D Physics
 */
var PhysicalObject2D = function (_GameObject) {
    _inherits(PhysicalObject2D, _GameObject);

    _createClass(PhysicalObject2D, null, [{
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
        * which are already part of {@link PhysicalObject2D}.
        * But if you choose to add more attributes, make sure
        * the return value includes the netScheme of the super class.
        *
        * @memberof PhysicalObject2D
        * @member {Object} netScheme
        * @example
        *     static get netScheme() {
        *       return Object.assign({
        *           mojo: { type: Serializer.TYPES.UINT8 },
        *         }, super.netScheme);
        *     }
        */
        get: function get() {
            return Object.assign({
                playerId: { type: _Serializer2.default.TYPES.INT16 },
                mass: { type: _Serializer2.default.TYPES.FLOAT32 },
                position: { type: _Serializer2.default.TYPES.CLASSINSTANCE },
                angle: { type: _Serializer2.default.TYPES.FLOAT32 },
                velocity: { type: _Serializer2.default.TYPES.CLASSINSTANCE },
                angularVelocity: { type: _Serializer2.default.TYPES.FLOAT32 }
            }, _get(PhysicalObject2D.__proto__ || Object.getPrototypeOf(PhysicalObject2D), 'netScheme', this));
        }

        /**
        * Creates an instance of a physical object.
        * Override to provide starting values for position, velocity, angle and angular velocity.
        * NOTE: all subclasses of this class must comply with this constructor signature.
        *       This is required because the engine will create temporary instances when
        *       syncs arrive on the clients.
        * @param {GameEngine} gameEngine - the gameEngine this object will be used in
        * @param {Object} options - options for the new object. See {@link GameObject}
        * @param {Object} props - properties to be set in the new object
        * @param {TwoVector} props.position - position vector
        * @param {TwoVector} props.velocity - velocity vector
        * @param {Number} props.angle - orientation angle
        * @param {Number} props.mass - the mass
        * @param {Number} props.angularVelocity - angular velocity
        */

    }]);

    function PhysicalObject2D(gameEngine, options, props) {
        _classCallCheck(this, PhysicalObject2D);

        var _this = _possibleConstructorReturn(this, (PhysicalObject2D.__proto__ || Object.getPrototypeOf(PhysicalObject2D)).call(this, gameEngine, options));

        _this.playerId = 0;
        _this.bendingIncrements = 0;

        // set default position, velocity and quaternion
        _this.position = new _TwoVector2.default(0, 0);
        _this.velocity = new _TwoVector2.default(0, 0);
        _this.angle = 0;
        _this.angularVelocity = 0;
        _this.mass = 0;

        // use values if provided
        props = props || {};
        if (props.playerId) _this.playerId = props.playerId;
        if (props.position) _this.position.copy(props.position);
        if (props.velocity) _this.velocity.copy(props.velocity);
        if (props.angle) _this.angle = props.angle;
        if (props.angularVelocity) _this.angularVelocity = props.angularVelocity;
        if (props.mass) _this.mass = props.mass;

        _this.class = PhysicalObject2D;
        return _this;
    }

    /**
     * Called after the object is added to to the game world.
     * This is the right place to add renderer sub-objects, physics sub-objects
     * and any other resources that should be created
     */


    _createClass(PhysicalObject2D, [{
        key: 'onAddToWorld',
        value: function onAddToWorld() {}

        /**
         * Formatted textual description of the dynamic object.
         * The output of this method is used to describe each instance in the traces,
         * which significantly helps in debugging.
         *
         * @return {String} description - a string describing the PhysicalObject2D
         */

    }, {
        key: 'toString',
        value: function toString() {
            var p = this.position.toString();
            var v = this.velocity.toString();
            var a = this.angle;
            var av = this.angularVelocity;
            return 'phyObj2D[' + this.id + '] player' + this.playerId + ' Pos=' + p + ' Vel=' + v + ' Ang=' + a + ' AVel=' + av;
        }

        // display object's physical attributes as a string
        // for debugging purposes mostly

    }, {
        key: 'bendingToString',
        value: function bendingToString() {
            if (this.bendingIncrements) return 'bend=' + this.bending + ' increments=' + this.bendingIncrements + ' deltaPos=' + this.bendingPositionDelta + ' deltaAngle=' + this.bendingAngleDelta;
            return 'no bending';
        }

        // derive and save the bending increment parameters:
        // - bendingPositionDelta
        // - bendingAVDelta
        // - bendingAngleDelta
        // these can later be used to "bend" incrementally from the state described
        // by "original" to the state described by "self"

    }, {
        key: 'bendToCurrent',
        value: function bendToCurrent(original, bending, worldSettings, isLocal, bendingIncrements) {

            // if the object has defined a bending multiples for this object, use them
            if (typeof this.bendingMultiple === 'number') bending = this.bendingMultiple;

            // angle bending factor
            var angleBending = bending;
            var velocityBending = bending;
            var angularVelocityBending = bending;
            if (typeof this.bendingAngleMultiple === 'number') angleBending = this.bendingAngleMultiple;
            if (isLocal && typeof this.bendingAngleLocalMultiple === 'number') angleBending = this.bendingAngleLocalMultiple;
            if (typeof this.bendingVelocityMultiple === 'number') velocityBending = this.bendingVelocityMultiple;
            if (typeof this.bendingAngularVelocityMultiple === 'number') angularVelocityBending = this.bendingAngularVelocityMultiple;

            // get the incremental delta position
            this.incrementScale = bending / bendingIncrements;
            this.bendingPositionDelta = this.position.clone();
            this.bendingPositionDelta.subtract(original.position);
            this.bendingPositionDelta.multiplyScalar(this.incrementScale);
            this.bendingVelocityDelta = this.velocity.clone();
            this.bendingVelocityDelta.subtract(original.velocity);
            this.bendingVelocityDelta.multiplyScalar(this.incrementScale * velocityBending);

            // get the incremental angular-velocity
            this.bendingAVDelta = (this.angularVelocity - original.angularVelocity) * this.incrementScale * angularVelocityBending;

            // get the incremental angle correction
            this.bendingAngleDelta = _MathUtils2.default.interpolateDeltaWithWrapping(original.angle, this.angle, angleBending, 0, 2 * Math.PI) / bendingIncrements;

            this.bendingTarget = new this.constructor();
            this.bendingTarget.syncTo(this);

            this.position.copy(original.position);
            this.angle = original.angle;
            this.angularVelocity = original.angularVelocity;
            this.velocity.copy(original.velocity);

            this.bendingIncrements = bendingIncrements;
            this.bending = bending;

            // TODO: does refreshToPhysics() really belong here?
            //       should refreshToPhysics be decoupled from syncTo
            //       and called explicitly in all cases?
            this.refreshToPhysics();
        }
    }, {
        key: 'syncTo',
        value: function syncTo(other, options) {

            _get(PhysicalObject2D.prototype.__proto__ || Object.getPrototypeOf(PhysicalObject2D.prototype), 'syncTo', this).call(this, other);

            this.position.copy(other.position);
            this.angle = other.angle;
            this.angularVelocity = other.angularVelocity;

            if (!options || !options.keepVelocity) {
                this.velocity.copy(other.velocity);
            }

            if (this.physicsObj) this.refreshToPhysics();
        }

        // update position, angle, angular velocity, and velocity from new physical state.

    }, {
        key: 'refreshFromPhysics',
        value: function refreshFromPhysics() {
            this.copyVector(this.physicsObj.position, this.position);
            this.copyVector(this.physicsObj.velocity, this.velocity);
            this.angle = this.physicsObj.angle;
            this.angularVelocity = this.physicsObj.angularVelocity;
        }

        // generic vector copy.  We need this because different
        // physics engines have different implementations.
        // TODO: Better implementation: the physics engine implementor
        // should define copyFromLanceVector and copyToLanceVector

    }, {
        key: 'copyVector',
        value: function copyVector(source, target) {
            var sourceVec = source;
            if (typeof source[0] === 'number' && typeof source[1] === 'number') sourceVec = { x: source[0], y: source[1] };

            if (typeof target.copy === 'function') {
                target.copy(sourceVec);
            } else if (target instanceof Float32Array) {
                target[0] = sourceVec.x;
                target[1] = sourceVec.y;
            } else {
                target.x = sourceVec.x;
                target.y = sourceVec.y;
            }
        }

        // update position, angle, angular velocity, and velocity from new game state.

    }, {
        key: 'refreshToPhysics',
        value: function refreshToPhysics() {
            this.copyVector(this.position, this.physicsObj.position);
            this.copyVector(this.velocity, this.physicsObj.velocity);
            this.physicsObj.angle = this.angle;
            this.physicsObj.angularVelocity = this.angularVelocity;
        }

        // apply one increment of bending

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
            this.angularVelocity += this.bendingAVDelta * timeFactor;
            this.angle += this.bendingAngleDelta * timeFactor;

            this.bendingIncrements--;
        }

        // interpolate implementation

    }, {
        key: 'interpolate',
        value: function interpolate(nextObj, percent) {

            // slerp to target position
            this.position.lerp(nextObj.position, percent);
            this.angle = _MathUtils2.default.interpolateDeltaWithWrapping(this.angle, nextObj.angle, percent, 0, 2 * Math.PI);
        }
    }]);

    return PhysicalObject2D;
}(_GameObject3.default);

exports.default = PhysicalObject2D;