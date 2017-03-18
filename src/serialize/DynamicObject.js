'use strict';

const TwoVector = require('./TwoVector');
const GameObject = require('./GameObject');
const Serializer = require('./Serializer');
const MathUtils = require('../lib/MathUtils');

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
    *           mojo: { type: Serializer.TYPES.UINT8 },
    *         }, super.netScheme);
    *     }
    */
    static get netScheme() {
        return Object.assign({
            playerId: { type: Serializer.TYPES.INT16 },
            position: { type: Serializer.TYPES.CLASSINSTANCE },
            velocity: { type: Serializer.TYPES.CLASSINSTANCE },
            angle: { type: Serializer.TYPES.FLOAT32 }
        }, super.netScheme);
    }

    /**
    * Creates an instance of a dynamic object.
    * Override to provide starting values for position, velocity, etc.
    * The object ID should be the next value provided by `world.idCount`
    * @param {String} id - the object id
    * @param {TwoVector} position - position vector
    * @param {TwoVector} velocity - velocity vector
    * @example
    *    // Ship is a subclass of DynamicObject:
    *    Ship(++this.world.idCount);
    */
    constructor(id, position, velocity) {
        super(id);

        /**
        * ID of player who created this object
        * @member {Number}
        */
        this.playerId = 0;

        this.position = new TwoVector(0, 0);
        this.velocity = new TwoVector(0, 0);

        /**
        * position
        * @member {TwoVector}
        */
        if (position) this.position.copy(position);

        /**
        * velocity
        * @member {TwoVector}
        */
        if (velocity) this.velocity.copy(velocity);

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

        this.bending = new TwoVector(0, 0);
        this.bendingAngle = 0;
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
        return `dObj[${this.id}] player${this.playerId} Pos=${this.position} Vel=${this.velocity} angle${round3(this.angle)}`;
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
        this.id = other.id;
        this.playerId = other.playerId;
        this.position.copy(other.position);
        this.velocity.copy(other.velocity);
        this.bending.copy(other.bending);
        this.bendingAngle = other.bendingAngle;
        this.angle = other.angle;
        this.rotationSpeed = other.rotationSpeed;
        this.acceleration = other.acceleration;
        this.deceleration = other.deceleration;
    }

    bendToCurrent(original, bending, worldSettings, isLocal, bendingIncrements) {

        // TODO: the bending parameters should now be an object,
        //     with a single getter bendingMultiples which has local
        //     and remote values for position, velocity, and angle
        this.bendingIncrements = bendingIncrements;

        // if the object has defined a bending multiples for this object, use them
        if (typeof this.bendingMultiple === 'number')
            bending = this.bendingMultiple;

        // velocity bending factor
        let velocityBending = bending;
        if (typeof this.bendingVelocityMultiple === 'number')
            velocityBending = this.bendingVelocityMultiple;

        // angle bending factor
        let angleBending = bending;
        if (typeof this.bendingAngleMultiple === 'number')
            angleBending = this.bendingAngleMultiple;
        if (isLocal && (typeof this.bendingAngleLocalMultiple === 'number'))
            angleBending = this.bendingAngleLocalMultiple;

        // bend to position, velocity, and angle gradually
        // TODO: consider using lerp() method of TwoVector instead.
        //     you will need implement lerpWrapped() first.
        if (worldSettings.worldWrap) {
            this.bending.x = MathUtils.interpolateDeltaWithWrapping(original.position.x, this.position.x, bending, 0, worldSettings.width) / bendingIncrements;
            this.bending.y = MathUtils.interpolateDeltaWithWrapping(original.position.y, this.position.y, bending, 0, worldSettings.height) / bendingIncrements;
        } else {
            this.bending.x = MathUtils.interpolateDelta(original.position.x, this.position.x, bending) / bendingIncrements;
            this.bending.y = MathUtils.interpolateDelta(original.position.y, this.position.y, bending) / bendingIncrements;
        }
        this.bendingAngle = MathUtils.interpolateDeltaWithWrapping(original.angle, this.angle, angleBending, 0, 360) / bendingIncrements;
        this.velocity.x = MathUtils.interpolate(original.velocity.x, this.velocity.x, velocityBending);
        this.velocity.y = MathUtils.interpolate(original.velocity.y, this.velocity.y, velocityBending);

        // revert to original
        this.position.copy(original.position);
        this.angle = original.angle;
    }

    applyIncrementalBending() {
        if (this.bendingIncrements === 0)
            return;

        this.position.add(this.bending);
        this.angle += this.bendingAngle;
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
}

module.exports = DynamicObject;
