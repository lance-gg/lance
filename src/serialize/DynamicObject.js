'use strict';

const GameObject = require('./GameObject');
const Serializer = require('./Serializer');
const MathUtils = require('../lib/MathUtils');

/**
 * DynamicObject is the base class of your game's objects.  It defines the
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
            x: { type: Serializer.TYPES.INT16 },
            y: { type: Serializer.TYPES.INT16 },
            velX: { type: Serializer.TYPES.FLOAT32 },
            velY: { type: Serializer.TYPES.FLOAT32 },
            angle: { type: Serializer.TYPES.INT16 }
        }, super.netScheme);
    }

    /**
    * Creates an instance of a dynamic object.
    * Override to provide starting values for position, velocity, etc.
    * The object ID should be the next value provided by `world.idCount`
    * @param {String} id - the object id
    * @param {Number} x - position x-value
    * @param {Number} y - position y-value
    * @example
    *    // Ship is a subclass of DynamicObject:
    *    Ship(++this.world.idCount);
    */
    constructor(id, x, y) {
        super(id);

        /**
        * ID of player who created this object
        * @member {Number}
        */
        this.playerId = 0;

        // TODO instead of storing attributes x,y,velX,velY, consider using
        // new ThreeVector.js
        /**
        * position x-coordinate
        * @member {Number}
        */
        this.x = x;

        /**
        * position y-coordinate
        * @member {Number}
        */
        this.y = y;

        /**
        * object orientation angle
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

        /**
        * velocity x-coordinate
        * @member {Number}
        */
        this.velX = 0;

        /**
        * velocity y-coordinate
        * @member {Number}
        */
        this.velY = 0;
        this.bendingX = 0;
        this.bendingY = 0;
        this.bendingAngle = 0;
        this.deceleration = 0.99;
    }

    /**
     * Formatted textual description of the dynamic object.
     * The output of this method is used to describe each instance in the traces,
     * which significantly helps in debugging.
     *
     * @return {String} description - a string describing the DynamicObject
     */
    toString() {
        function round3(x) { return Math.round(x * 1000) / 1000; }
        function showVec(x, y, z) { return `(${round3(x)}, ${round3(y)}, ${round3(z)})`; }
        return `dObj[${this.id}] player${this.playerId} pos${showVec(this.x, this.y, this.z)} vel${showVec(this.velX, this.velY, this.velZ)} angle${round3(this.angle)}`;
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
        this.x = other.x;
        this.y = other.y;
        this.velX = other.velX;
        this.velY = other.velY;
        this.bendingX = other.bendingX;
        this.bendingY = other.bendingY;
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
        if (worldSettings.worldWrap) {
            this.bendingX = MathUtils.interpolateDeltaWithWrapping(original.x, this.x, bending, 0, worldSettings.width) / bendingIncrements;
            this.bendingY = MathUtils.interpolateDeltaWithWrapping(original.y, this.y, bending, 0, worldSettings.height) / bendingIncrements;
        } else {
            this.bendingX = MathUtils.interpolateDelta(original.x, this.x, bending) / bendingIncrements;
            this.bendingY = MathUtils.interpolateDelta(original.y, this.y, bending) / bendingIncrements;
        }
        this.bendingAngle = MathUtils.interpolateDeltaWithWrapping(original.angle, this.angle, angleBending, 0, 360) / bendingIncrements;
        this.velX = MathUtils.interpolate(original.velX, this.velX, velocityBending);
        this.velY = MathUtils.interpolate(original.velY, this.velY, velocityBending);

        // revert to original
        this.x = original.x;
        this.y = original.y;
        this.angle = original.angle;
    }

    applyIncrementalBending() {
        this.x += this.bendingX;
        this.y += this.bendingY;
        this.angle += this.bendingAngle
    }
}

module.exports = DynamicObject;
