'use strict';

const Serializable = require('./Serializable');
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
class DynamicObject extends Serializable {

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
        return {
            id: { type: Serializer.TYPES.INT32 },
            playerId: { type: Serializer.TYPES.INT16 },
            x: { type: Serializer.TYPES.INT16 },
            y: { type: Serializer.TYPES.INT16 },
            velX: { type: Serializer.TYPES.FLOAT32 },
            velY: { type: Serializer.TYPES.FLOAT32 },
            angle: { type: Serializer.TYPES.INT16 }
        };
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
        super();

        /**
        * ID of this object's instance.  Each instance has an ID which is unique across the entire
        * game world, including the server and all the clients.  In extrapolation mode,
        * the client may have an object instance which does not yet exist on the server,
        * these objects are known as shadow objects.  The ID value for shadow objects
        * is chosen in the range of values reserved for the client, the clientIDSpace,
        * and is unique only for that client.
        * @member {Number}
        */
        this.id = id;

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

    // TODO: remove this
    copyFrom(sourceObj) {

        // TODO: copyFrom could just look at the netscheme?
        this.id = sourceObj.id;
        this.playerId = sourceObj.playerId;

        this.x = sourceObj.x;
        this.y = sourceObj.y;
        this.velX = sourceObj.velX;
        this.velY = sourceObj.velY;
        this.bendingX = sourceObj.bendingX;
        this.bendingY = sourceObj.bendingY;
        this.bendingAngle = sourceObj.bendingAngle;
        this.angle = sourceObj.angle;
        this.rotationSpeed = sourceObj.rotationSpeed;
        this.acceleration = sourceObj.acceleration;
        this.deceleration = sourceObj.deceleration;
    }

    /**
    * The bending multiple is a getter, which returns the
    * amount of bending.
    * For example, if this value is set to 0.8, then the object's position
    * on the client side will slowly bend (by 20% on every server update) towards
    * the definitive position as indicated by the server.
    * When this value is zero, the object's position
    * on the client will be set to the server's object's position exactly.
    * When this value is 1.0, the client ignores the server object's position.
    * When this value is null, the bending is taken from the synchronization
    * defaults.  Set this to zero for objects whose position
    * jumps suddenly - because the game intended a jump, not a gradual bend.
    * @memberof DynamicObject
    * @member {Number} bendingMultiple
    */
    get bendingMultiple() { return null; }

    /**
    * The velocity bending multiple is a getter, which returns the
    * amount of velocity bending.
    * For example, if this value is set to 0.8, then the object's velocity
    * on the client side will slowly bend (by 20% on every server update) towards the
    * definitive velocity as indicated by the server, on every server update.
    * You will need to set this to 1.0 for objects whose velocity jumps
    * suddenly - because your game intended a jump in velocity, not a gradual
    * bend.
    * @memberof DynamicObject
    * @member {Number} bendingVelocityMultiple
    */
    get bendingVelocityMultiple() { return null; }

    /**
    * The maximum velocity allowed.  If returns null then ignored.
    * @memberof DynamicObject
    * @member {Number} maxSpeed
    */
    get maxSpeed() { return null; }

    /**
     * Initialize the object.
     * Extend this method if you have object initialization logic.
     * @param {Object} options Your object's options
     */
    init(options) {
        Object.assign(this, options);
    }

    saveState(other) {
        this.savedCopy = (new this.constructor());
        this.savedCopy.copyFrom(other ? other : this);
    }

    // TODO:
    // rather than pass worldSettings on each bend, they could
    // be passed in on the constructor just once.
    bendToCurrentState(bending, worldSettings, isLocal, bendingIncrements) {
        if (this.savedCopy) {
            this.bendToCurrent(this.savedCopy, bending, worldSettings, isLocal, bendingIncrements);
        }
        this.savedCopy = null;
    }

    syncTo(other) {
        ['playerId', 'x', 'y', 'velX', 'velY', 'angle']
            .forEach(attr => {
                this[attr] = other[attr];
            });

        // reset bending
        this.bendingX = 0;
        this.bendingY = 0;
        this.bendingAngle = 0;
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

    interpolate(nextObj, playPercentage, worldSettings) {

        // update other objects with interpolation
        // TODO refactor into general interpolation class

        if (Math.abs(nextObj.x - this.x) > worldSettings.height / 2) {
            this.x = nextObj.x;
        } else {
            this.x = (nextObj.x - this.x) * playPercentage + this.x;
        }

        if (Math.abs(nextObj.y - this.y) > worldSettings.height / 2) {
            this.y = nextObj.y;
        } else {
            this.y = (nextObj.y - this.y) * playPercentage + this.y;
        }

        var shortestAngle = ((((nextObj.angle - this.angle) % 360) + 540) % 360) - 180;
        this.angle = this.angle + shortestAngle * playPercentage;

    }

    // TODO: implement incremental bending below
    applyIncrementalBending() { }
}

module.exports = DynamicObject;
