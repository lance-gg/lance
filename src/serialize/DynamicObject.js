import TwoVector from './TwoVector';
import GameObject from './GameObject';
import Serializer from './Serializer';
import BaseTypes from './BaseTypes';
import MathUtils from '../lib/MathUtils';

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
class DynamicObject extends GameObject {

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
    static get netScheme() {
        return Object.assign({
            playerId: { type: BaseTypes.TYPES.INT16 },
            position: { type: BaseTypes.TYPES.CLASSINSTANCE },
            width: { type: BaseTypes.TYPES.INT16 },
            height: { type: BaseTypes.TYPES.INT16 },
            velocity: { type: BaseTypes.TYPES.CLASSINSTANCE },
            angle: { type: BaseTypes.TYPES.FLOAT32 }
        }, super.netScheme);
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
    constructor(gameEngine, options, props) {
        super(gameEngine, options);

        /**
        * ID of player who created this object
        * @member {Number}
        */
        this.playerId = 0;
        this.bendingIncrements = 0;

        this.position = new TwoVector(0, 0);
        this.velocity = new TwoVector(0, 0);

        /**
         * Object width for collision detection purposes. Default is 1
         * @member {Number}
         */
        this.width = 1;

        /**
         * Object Height for collision detection purposes. Default is 1
         * @member {Number}
         */
        this.height = 1;

        /**
         * The friction coefficient. Velocity is multiplied by this for each step. Default is (1,1)
         * @member {TwoVector}
         */
        this.friction = new TwoVector(1, 1);

        /**
         * Whether this object is affected by gravity.
         * @member {Boolean}
         */
        this.affectedByGravity = true;

        /**
        * position
        * @member {TwoVector}
        */
        if (props && props.position) this.position.copy(props.position);

        /**
        * velocity
        * @member {TwoVector}
        */
        if (props && props.velocity) this.velocity.copy(props.velocity);

        /**
        * object orientation angle in degrees
        * @member {Number}
        */
        this.angle = 90;

        /**
        * should rotate left by {@link DynamicObject#rotationSpeed} on next step
        * @member {Boolean}
        */
        this.isRotatingLeft = false;

        /**
        * should rotate right by {@link DynamicObject#rotationSpeed} on next step
        * @member {Boolean}
        */
        this.isRotatingRight = false;

        /**
        * should accelerate by {@link DynamicObject#acceleration} on next step
        * @member {Boolean}
        */
        this.isAccelerating = false;

        /**
        * angle rotation per step
        * @member {Number}
        */
        this.rotationSpeed = 2.5;

        /**
        * acceleration per step
        * @member {Number}
        */
        this.acceleration = 0.1;

        this.deceleration = 0.99;
    }

    // convenience getters
    get x() { return this.position.x; }
    get y() { return this.position.y; }

    /**
     * Formatted textual description of the dynamic object.
     * The output of this method is used to describe each instance in the traces,
     * which significantly helps in debugging.
     *
     * @return {String} description - a string describing the DynamicObject
     */
    toString() {
        function round3(x) { return Math.round(x * 1000) / 1000; }
        return `${this.constructor.name}[${this.id}] player${this.playerId} Pos=${this.position} Vel=${this.velocity} angle${round3(this.angle)}`;
    }

    /**
     * Each object class can define its own bending overrides.
     * return an object which can include attributes: position, velocity,
     * and angle.  In each case, you can specify a min value, max
     * value, and a percent value.
     *
     * @return {Object} bending - an object with bending paramters
     */
    get bending() {
        return {
            // example:
            // position: { percent: 0.8, min: 0.0, max: 4.0 },
            // velocity: { percent: 0.4, min: 0.0 },
            // angleLocal: { percent: 0.0 }
        };
    }

    /**
     * Formatted textual description of the game object's current bending properties.
     * @return {String} description - a string description
     */
    bendingToString() {
        if (this.bendingIncrements)
            return `bend=${this.bending} angle=${this.bendingAngle} num_increments=${this.bendingIncrements}`;
        return 'no bending';
    }

    /**
    * The maximum velocity allowed.  If returns null then ignored.
    * @memberof DynamicObject
    * @member {Number} maxSpeed
    */
    get maxSpeed() { return null; }

    syncTo(other) {
        super.syncTo(other);
        this.position.copy(other.position);
        this.velocity.copy(other.velocity);
        this.bendingAngle = other.bendingAngle;
        this.rotationSpeed = other.rotationSpeed;
        this.acceleration = other.acceleration;
        this.deceleration = other.deceleration;
    }

    bendToCurrent(original, percent, worldSettings, isLocal, increments) {

        let bending = { increments, percent };
        // if the object has defined a bending multiples for this object, use them
        let positionBending = Object.assign({}, bending, this.bending.position);
        let velocityBending = Object.assign({}, bending, this.bending.velocity);
        let angleBending = Object.assign({}, bending, this.bending.angle);

        if (isLocal) {
            Object.assign(positionBending, this.bending.positionLocal);
            Object.assign(velocityBending, this.bending.velocityLocal);
            Object.assign(angleBending, this.bending.angleLocal);
        }

        // get the incremental delta position & velocity
        this.incrementScale = percent / increments;
        this.bendingPositionDelta = original.position.getBendingDelta(this.position, positionBending);
        this.bendingVelocityDelta = original.velocity.getBendingDelta(this.velocity, velocityBending);
        this.bendingAngleDelta = MathUtils.interpolateDeltaWithWrapping(original.angle, this.angle, angleBending.percent, 0, 2 * Math.PI) / increments;

        this.bendingTarget = (new this.constructor());
        this.bendingTarget.syncTo(this);

        // revert to original
        this.position.copy(original.position);
        this.velocity.copy(original.velocity);
        this.angle = original.angle;

        // keep parameters
        this.bendingIncrements = increments;
        this.bendingOptions = bending;
    }

    applyIncrementalBending(stepDesc) {
        if (this.bendingIncrements === 0)
            return;

        let timeFactor = 1;
        if (stepDesc && stepDesc.dt)
            timeFactor = stepDesc.dt / (1000 / 60);

        const posDelta = this.bendingPositionDelta.clone().multiplyScalar(timeFactor);
        const velDelta = this.bendingVelocityDelta.clone().multiplyScalar(timeFactor);
        this.position.add(posDelta);
        this.velocity.add(velDelta);
        this.angle += (this.bendingAngleDelta * timeFactor);

        this.bendingIncrements--;
    }

    interpolate(nextObj, playPercentage, worldSettings) {

        let px = this.position.x;
        let py = this.position.y;
        let angle = this.angle;

        // TODO allow netscheme to designate interpolatable attribute (power, shield, etc)
        // first copy all the assignable attributes
        for (let k of Object.keys(this.constructor.netScheme)) {
            let val = nextObj[k];
            if (Serializer.typeCanAssign(this.constructor.netScheme[k].type))
                this[k] = val;
            else if (typeof val.clone === 'function')
                this[k] = val.clone();
        }

        // update other objects with interpolation
        // TODO interpolate using TwoVector methods, including wrap-around
        function calcInterpolate(start, end, wrap, p) {
            if (Math.abs(end - start) > wrap / 2) return end;
            return (end - start) * p + start;
        }
        this.position.x = calcInterpolate(px, nextObj.position.x, worldSettings.width, playPercentage);
        this.position.y = calcInterpolate(py, nextObj.position.y, worldSettings.height, playPercentage);

        var shortestAngle = ((((nextObj.angle - angle) % 360) + 540) % 360) - 180;
        this.angle = angle + shortestAngle * playPercentage;

    }

    getAABB() {
        // todo take rotation into account
        // registration point is in the middle
        return {
            min: [this.x - this.width / 2, this.y - this.height / 2],
            max: [this.x + this.width / 2, this.y + this.height / 2]
        };
    }
}

export default DynamicObject;
