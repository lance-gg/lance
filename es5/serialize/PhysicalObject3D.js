'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _GameObject2 = require('./GameObject');

var _GameObject3 = _interopRequireDefault(_GameObject2);

var _BaseTypes = require('./BaseTypes');

var _BaseTypes2 = _interopRequireDefault(_BaseTypes);

var _ThreeVector = require('./ThreeVector');

var _ThreeVector2 = _interopRequireDefault(_ThreeVector);

var _Quaternion = require('./Quaternion');

var _Quaternion2 = _interopRequireDefault(_Quaternion);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * The PhysicalObject3D is the base class for physical game objects
 */
var PhysicalObject3D = function (_GameObject) {
    _inherits(PhysicalObject3D, _GameObject);

    _createClass(PhysicalObject3D, null, [{
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
        * which are already part of {@link PhysicalObject3D}.
        * But if you choose to add more attributes, make sure
        * the return value includes the netScheme of the super class.
        *
        * @memberof PhysicalObject3D
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
                quaternion: { type: _BaseTypes2.default.TYPES.CLASSINSTANCE },
                velocity: { type: _BaseTypes2.default.TYPES.CLASSINSTANCE },
                angularVelocity: { type: _BaseTypes2.default.TYPES.CLASSINSTANCE }
            }, _get(PhysicalObject3D.__proto__ || Object.getPrototypeOf(PhysicalObject3D), 'netScheme', this));
        }

        /**
        * Creates an instance of a physical object.
        * Override to provide starting values for position, velocity, quaternion and angular velocity.
        * NOTE: all subclasses of this class must comply with this constructor signature.
        *       This is required because the engine will create temporary instances when
        *       syncs arrive on the clients.
        * @param {GameEngine} gameEngine - the gameEngine this object will be used in
        * @param {Object} options - options for the new object. See {@link GameObject}
        * @param {Object} props - properties to be set in the new object
        * @param {ThreeVector} props.position - position vector
        * @param {ThreeVector} props.velocity - velocity vector
        * @param {Quaternion} props.quaternion - orientation quaternion
        * @param {ThreeVector} props.angularVelocity - 3-vector representation of angular velocity
        */

    }]);

    function PhysicalObject3D(gameEngine, options, props) {
        _classCallCheck(this, PhysicalObject3D);

        var _this = _possibleConstructorReturn(this, (PhysicalObject3D.__proto__ || Object.getPrototypeOf(PhysicalObject3D)).call(this, gameEngine, options));

        _this.playerId = 0;
        _this.bendingIncrements = 0;

        // set default position, velocity and quaternion
        _this.position = new _ThreeVector2.default(0, 0, 0);
        _this.velocity = new _ThreeVector2.default(0, 0, 0);
        _this.quaternion = new _Quaternion2.default(1, 0, 0, 0);
        _this.angularVelocity = new _ThreeVector2.default(0, 0, 0);

        // use values if provided
        props = props || {};
        if (props.position) _this.position.copy(props.position);
        if (props.velocity) _this.velocity.copy(props.velocity);
        if (props.quaternion) _this.quaternion.copy(props.quaternion);
        if (props.angularVelocity) _this.angularVelocity.copy(props.angularVelocity);

        _this.class = PhysicalObject3D;
        return _this;
    }

    /**
     * Formatted textual description of the dynamic object.
     * The output of this method is used to describe each instance in the traces,
     * which significantly helps in debugging.
     *
     * @return {String} description - a string describing the PhysicalObject3D
     */


    _createClass(PhysicalObject3D, [{
        key: 'toString',
        value: function toString() {
            var p = this.position.toString();
            var v = this.velocity.toString();
            var q = this.quaternion.toString();
            var a = this.angularVelocity.toString();
            return 'phyObj[' + this.id + '] player' + this.playerId + ' Pos' + p + ' Vel' + v + ' Dir' + q + ' AVel' + a;
        }

        // display object's physical attributes as a string
        // for debugging purposes mostly

    }, {
        key: 'bendingToString',
        value: function bendingToString() {
            if (this.bendingOptions) return 'bend=' + this.bendingOptions.percent + ' deltaPos=' + this.bendingPositionDelta + ' deltaVel=' + this.bendingVelocityDelta + ' deltaQuat=' + this.bendingQuaternionDelta;
            return 'no bending';
        }

        // derive and save the bending increment parameters:
        // - bendingPositionDelta
        // - bendingAVDelta
        // - bendingQuaternionDelta
        // these can later be used to "bend" incrementally from the state described
        // by "original" to the state described by "self"

    }, {
        key: 'bendToCurrent',
        value: function bendToCurrent(original, percent, worldSettings, isLocal, increments) {

            var bending = { increments: increments, percent: percent };
            // if the object has defined a bending multiples for this object, use them
            var positionBending = Object.assign({}, bending, this.bending.position);
            var velocityBending = Object.assign({}, bending, this.bending.velocity);

            // check for local object overrides to bendingTarget
            if (isLocal) {
                Object.assign(positionBending, this.bending.positionLocal);
                Object.assign(velocityBending, this.bending.velocityLocal);
            }

            // get the incremental delta position & velocity
            this.incrementScale = percent / increments;
            this.bendingPositionDelta = original.position.getBendingDelta(this.position, positionBending);
            this.bendingVelocityDelta = original.velocity.getBendingDelta(this.velocity, velocityBending);
            this.bendingAVDelta = new _ThreeVector2.default(0, 0, 0);

            // get the incremental quaternion rotation
            this.bendingQuaternionDelta = new _Quaternion2.default().copy(original.quaternion).conjugate();
            this.bendingQuaternionDelta.multiply(this.quaternion);

            var axisAngle = this.bendingQuaternionDelta.toAxisAngle();
            axisAngle.angle *= this.incrementScale;
            this.bendingQuaternionDelta.setFromAxisAngle(axisAngle.axis, axisAngle.angle);

            this.bendingTarget = new this.constructor();
            this.bendingTarget.syncTo(this);

            this.position.copy(original.position);
            this.quaternion.copy(original.quaternion);
            this.angularVelocity.copy(original.angularVelocity);

            this.bendingIncrements = increments;
            this.bendingOptions = bending;

            this.refreshToPhysics();
        }
    }, {
        key: 'syncTo',
        value: function syncTo(other, options) {

            _get(PhysicalObject3D.prototype.__proto__ || Object.getPrototypeOf(PhysicalObject3D.prototype), 'syncTo', this).call(this, other);

            this.position.copy(other.position);
            this.quaternion.copy(other.quaternion);
            this.angularVelocity.copy(other.angularVelocity);

            if (!options || !options.keepVelocity) {
                this.velocity.copy(other.velocity);
            }

            if (this.physicsObj) this.refreshToPhysics();
        }

        // update position, quaternion, and velocity from new physical state.

    }, {
        key: 'refreshFromPhysics',
        value: function refreshFromPhysics() {
            this.position.copy(this.physicsObj.position);
            this.quaternion.copy(this.physicsObj.quaternion);
            this.velocity.copy(this.physicsObj.velocity);
            this.angularVelocity.copy(this.physicsObj.angularVelocity);
        }

        // update position, quaternion, and velocity from new game state.

    }, {
        key: 'refreshToPhysics',
        value: function refreshToPhysics() {
            this.physicsObj.position.copy(this.position);
            this.physicsObj.quaternion.copy(this.quaternion);
            this.physicsObj.velocity.copy(this.velocity);
            this.physicsObj.angularVelocity.copy(this.angularVelocity);
        }

        // apply one increment of bending

    }, {
        key: 'applyIncrementalBending',
        value: function applyIncrementalBending(stepDesc) {
            if (this.bendingIncrements === 0) return;

            if (stepDesc && stepDesc.dt) {
                var timeFactor = stepDesc.dt / (1000 / 60);
                // TODO: use clone() below.  it's cleaner
                var posDelta = new _ThreeVector2.default().copy(this.bendingPositionDelta).multiplyScalar(timeFactor);
                var avDelta = new _ThreeVector2.default().copy(this.bendingAVDelta).multiplyScalar(timeFactor);
                this.position.add(posDelta);
                this.angularVelocity.add(avDelta);

                // one approach to orientation bending is slerp:
                this.quaternion.slerp(this.bendingTarget.quaternion, this.incrementScale * timeFactor * 0.8);
            } else {
                this.position.add(this.bendingPositionDelta);
                this.angularVelocity.add(this.bendingAVDelta);
                this.quaternion.slerp(this.bendingTarget.quaternion, this.incrementScale);
            }

            // alternative: fixed delta-quaternion correction
            // TODO: adjust quaternion bending to dt timefactor precision
            // this.quaternion.multiply(this.bendingQuaternionDelta);
            this.bendingIncrements--;
        }

        // interpolate implementation

    }, {
        key: 'interpolate',
        value: function interpolate(nextObj, percent) {

            // slerp to target position
            this.position.lerp(nextObj.position, percent);
            this.quaternion.slerp(nextObj.quaternion, percent);
        }
    }]);

    return PhysicalObject3D;
}(_GameObject3.default);

exports.default = PhysicalObject3D;