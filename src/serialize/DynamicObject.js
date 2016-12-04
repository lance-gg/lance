"use strict";

const Point = require('../Point');
const Serializable = require('./Serializable');
const Serializer = require('./Serializer');
const MathUtils = require('../lib/MathUtils');

/**
 * DynamicObject is the base class of your game's objects.  It defines the
 * base object which can move around in the game world.  The
 * extensions of this object (the subclasses)
 * will be periodically ynchronized from the server to every client.
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
    * which are already part of DynamicObject.
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
            id: { type: Serializer.TYPES.UINT8 },
            playerId: { type: Serializer.TYPES.UINT8 },
            x: { type: Serializer.TYPES.INT16 },
            y: { type: Serializer.TYPES.INT16 },
            velX: { type: Serializer.TYPES.FLOAT32 },
            velY: { type: Serializer.TYPES.FLOAT32 },
            angle: { type: Serializer.TYPES.INT16 }
        };
    }

    /**
    * Creates an instance of a dynamic object.
    * Provide starting values for position, acceleration, etc.
    * @param {String} id - the object id
    * @param {Number} x - position x-value
    * @param {Number} y - position y-value
    */
    constructor(id, x, y) {
        super();
        this.id = id; // instance id
        this.playerId = 0;
        this.x = x;
        this.y = y;
        this.velX = 0;
        this.velY = 0;
        this.bendingX = 0;
        this.bendingY = 0;
        this.angle = 90;
        this.bendingAngle = 0;
        this.rotationSpeed = 2.5;
        this.acceleration = 0.1;
        this.deceleration = 0.99;
        this.maxSpeed = 5;

        // todo deal with what goes over the wire
        this.velocity = new Point();
        this.temp = {
            accelerationVector: new Point()
        };

    }

    /**
     * Formatted description of the dynamic object, for debugging purposes.
     *
     * @return {String} description - a string describing the DynamicObject
     */
    toString() {
        function round3(x) { return Math.round(x * 1000) / 1000; }
        function showVec(x, y, z) { return `(${round3(x)}, ${round3(y)}, ${round3(z)})`; }
        return `DynamicObject[${this.id}] position${showVec(this.x, this.y, this.z)} velocity${showVec(this.velX, this.velY, this.velZ)} angle${round3(this.angle)}`;
    }

    copyFrom(sourceObj) {

        // TODO: copyFrom could just look at the netscheme?
        this.id = sourceObj.id;
        this.playerId = sourceObj.playerId;
        this.isPlayerControlled = sourceObj.isPlayerControlled;

        this.x = sourceObj.x;
        this.y = sourceObj.y;
        this.velX = sourceObj.velX;
        this.velY = sourceObj.velY;
        this.bendingX = sourceObj.bendingX;
        this.bendingY = sourceObj.bendingY;
        this.bendingAngle = sourceObj.bendingAngle;
        this.velocity.set(sourceObj.velX, sourceObj.velY);
        this.angle = sourceObj.angle;
        this.rotationSpeed = sourceObj.rotationSpeed;
        this.acceleration = sourceObj.acceleration;
        this.deceleration = sourceObj.deceleration;
        this.maxSpeed = sourceObj.maxSpeed;
    }

    /**
    * The bending multiple is a getter, which returns the
    * amount of bending.
    * For example, if this value is set to 0.2, then the object's position
    * on the client side will slowly bend (by 20% on every server update) towards
    * the definitive position as indicated by the server.
    * When this value is 1, the object's position
    * on the client will be set to the server's object's position exactly.
    * When this value is zero, the client ignores the server object's position.
    * When this value is null, the bending is taken from the synchronization
    * defaults.  You will need to set this to zero for objects whose position
    * jumps suddenly - because your game intended a jump, not a gradual bend.
    * @memberof DynamicObject
    * @member {Number} bendingMultiple
    */
    get bendingMultiple() { return null; }

    /**
    * The velocity bending multiple is a getter, which returns the
    * amount of velocity bending.
    * For example, if this value is set to 0.2, then the object's velocity
    * on the client side will slowly bend (by 20% on every server update) towards the
    * definitive velocity as indicated by the server, on every server update.
    * You will need to set this to zero for objects whose velocity jumps
    * suddenly - because your game intended a jump in velocity, not a gradual
    * bend.
    * @memberof DynamicObject
    * @member {Number} velocityBendingMultiple
    */
    get velocityBendingMultiple() { return null; }

    step(worldSettings) {

        if (this.isRotatingRight) { this.angle += this.rotationSpeed; }
        if (this.isRotatingLeft) { this.angle -= this.rotationSpeed; }
        this.angle += this.bendingAngle;

        if (this.angle >= 360) { this.angle -= 360; }
        if (this.angle < 0) { this.angle += 360; }

        if (this.isAccelerating) {
            this.temp.accelerationVector.set(
                Math.cos(this.angle * (Math.PI / 180)),
                Math.sin(this.angle * (Math.PI / 180))
            ).setMagnitude(this.acceleration);
        } else {
            this.temp.accelerationVector.set(0, 0);
        }

        // acceleration
        Point.add(this.velocity, this.temp.accelerationVector, this.velocity);

        // this.velocity.multiply(this.deceleration, this.deceleration);
        this.velocity.x = Math.round(this.velocity.x * 100) / 100;
        this.velocity.y = Math.round(this.velocity.y * 100) / 100;

        if (this.velocity.getMagnitude() > this.maxSpeed) this.velocity.setMagnitude(this.maxSpeed);

        this.velX = this.velocity.x;
        this.velY = this.velocity.y;

        this.isAccelerating = false;
        this.isRotatingLeft = false;
        this.isRotatingRight = false;

        this.x = this.x + this.velocity.x + this.bendingX;
        this.y = this.y + this.velocity.y + this.bendingY;

        // wrap around the world edges
        if (worldSettings.worldWrap) {
            if (this.x >= worldSettings.width) { this.x -= worldSettings.width; }
            if (this.y >= worldSettings.height) { this.y -= worldSettings.height; }
            if (this.x < 0) { this.x += worldSettings.width; }
            if (this.y < 0) { this.y += worldSettings.height; }
        }
    }

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
    bendToSavedState(bending, worldSettings) {
        if (this.savedCopy) {
            this.bendTo(this.savedCopy, bending, worldSettings);
        }
        this.savedCopy = null;
    }

    syncTo(other) {
        ['x', 'y', 'velX', 'velY', 'angle']
            .forEach(attr => {
                this[attr] = other[attr];
            });
        this.velocity.x = this.velX;
        this.velocity.y = this.velY;

        // resent bending
        this.bendingX = 0;
        this.bendingY = 0;
        this.bendingAngle = 0;
    }

    bendTo(original, bending, worldSettings) {

        // if the object has defined a bending multiples for this object, use them
        if (this.bendingMultiple !== null)
            bending = this.bendingMultiple;
        let velocityBending = bending;
        if (this.velocityBendingMultiple !== null)
            velocityBending = this.velocityBendingMultiple;

        // bend to position, velocity, and angle gradually
        if (worldSettings.worldWrap) {
            this.bendingX = MathUtils.interpolateDeltaWithWrapping(original.x, this.x, bending, 0, worldSettings.width) / 10;
            this.bendingY = MathUtils.interpolateDeltaWithWrapping(original.y, this.y, bending, 0, worldSettings.height) / 10;
        } else {
            this.bendingX = MathUtils.interpolateDelta(original.x, this.x, bending) / 10;
            this.bendingY = MathUtils.interpolateDelta(original.y, this.y, bending) / 10;
        }
        this.bendingAngle = MathUtils.interpolateDeltaWithWrapping(original.angle, this.angle, bending, 0, 360) / 10;
        this.velX = MathUtils.interpolate(original.velX, this.velX, velocityBending);
        this.velY = MathUtils.interpolate(original.velY, this.velY, velocityBending);

        // revert to original
        this.x = original.x;
        this.y = original.y;
        this.angle = original.angle;

        // TODO: these next two lines are a side-effect of the fact
        // that velocity is stored both in attribute "velocity" and in velX/velY
        // which is redundant now that we can set a Point instance over the network
        this.velocity.x = this.velX;
        this.velocity.y = this.velY;
    }

    interpolate(nextObj, playPercentage, worldSettings) {

        // update other objects with interpolation
        // TODO refactor into general interpolation class
        //if (this.isPlayerControlled !== true) {

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
        //}
    }

    // release resources
    destroy() {
        console.log(`destroying object ${this.id}`);
    }
}

module.exports = DynamicObject;
