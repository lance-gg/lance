import { TwoVector } from './TwoVector.js';
import { GameObject, GameObjectOptions, GameObjectProps } from './GameObject.js';
import BaseTypes from './BaseTypes.js';
import { MathUtils } from '../lib/MathUtils.js';
import { GameEngine } from '../GameEngine.js';

interface DynamicObjectProps extends GameObjectProps {
    position: TwoVector;
    velocity?: TwoVector;
    width?: number;
    height?: number;
    isStatic?: number; // TODO: convert to boolean (number is for serialization purposes)
}

/**
 * DynamicObject is the base class of the game's objects, for 2D games which
 * rely on {@link SimplePhysicsEngine}.  It defines the
 * base object which can move around in the game world.  The
 * extensions of this object (the subclasses)
 * will be periodically synchronized from the server to every client.
 *
 * The dynamic objects have pseudo-physical properties, which
 * allow the client to extrapolate the position
 * of dynamic objects in-between server updates.
 */
class DynamicObject extends GameObject {

    // TODO: should be "protected" ?
    private bendingIncrements: number;
    public position: TwoVector;
    public velocity: TwoVector;
    public friction: TwoVector;
    public width: number;
    public height: number;
    public isStatic: number;
    public angle: number;
    public isRotatingLeft: boolean;
    public isRotatingRight: boolean;
    public isAccelerating: boolean;
    public rotationSpeed: number;
    public acceleration: number;
    public deceleration: number;
    private incrementScale: number;
    private bendingAngle: number;
    private bendingPositionDelta: TwoVector;
    private bendingVelocityDelta: TwoVector;
    private bendingAngleDelta: number;
    private bendingTarget: DynamicObject;
    private bendingOptions: any;

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
    *     netScheme() {
    *       return Object.assign({
    *           mojo: { type: BaseTypes.TYPES.UINT8 },
    *         }, super.netScheme);
    *     }
    */
    netScheme() {
        return Object.assign({
            position: { type: BaseTypes.ClassInstance },
            width: { type: BaseTypes.Int16 },
            height: { type: BaseTypes.Int16 },
            isStatic: { type: BaseTypes.UInt8 },
            velocity: { type: BaseTypes.ClassInstance },
            angle: { type: BaseTypes.Float32 }
        }, super.netScheme()); 
    }

    /**
    * Creates an instance of a dynamic object.
    * NOTE 1: do not add logic to subcclasses of this function, instead, create an instance and
    *       assign attributes to the new objects.
    * NOTE 2: all subclasses of this class must comply with this constructor signature.
    *       This is required because the engine will create temporary instances when
    *       syncs arrive on the clients.
    * @param {GameEngine} gameEngine - the gameEngine this object will be used in
    * @param {Object} options - options for the new object. See {@link GameObject}
    * @param {Object} props - properties to be set in the new object
    * @param {TwoVector} props.position - position vector
    * @param {TwoVector} props.velocity - velocity vector
    * @param {Number} props.height - object height
    * @param {Number} props.width - object width
    */
    constructor(gameEngine: GameEngine, options: GameObjectOptions, props: DynamicObjectProps) {
        super(gameEngine, options, props);

        this.bendingIncrements = 0;

        this.position = new TwoVector(0, 0);
        this.velocity = new TwoVector(0, 0);

        /**
         * Object width for collision detection purposes. Default is 1
         * @member {Number}
         */
        this.width = (props && props.width) ? props.width : 1;

        /**
         * Object height for collision detection purposes. Default is 1
         * @member {Number}
         */
        this.height = (props && props.height) ? props.height : 1;

        /**
         * Determine if the object is static (i.e. it never moves, like a wall). The value 0 implies the object is dynamic.  Default is 0 (dynamic).
         * @member {Number}
         */
        this.isStatic = (props && props.isStatic) ? props.isStatic : 0;

        /**
         * The friction coefficient. Velocity is multiplied by this for each step. Default is (1,1)
         * @member {TwoVector}
         */
        this.friction = new TwoVector(1, 1);

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
        * @deprecated since version 3.0.8
        * should rotate left by {@link DynamicObject#rotationSpeed} on next step
        * @member {Boolean}
        */
        this.isRotatingLeft = false;

        /**
        * @deprecated since version 3.0.8
        * should rotate right by {@link DynamicObject#rotationSpeed} on next step
        * @member {Boolean}
        */
        this.isRotatingRight = false;

        /**
        * @deprecated since version 3.0.8
        * should accelerate by {@link DynamicObject#acceleration} on next step
        * @member {Boolean}
        */
        this.isAccelerating = false;

        /**
        * @deprecated since version 3.0.8
        * angle rotation per step
        * @member {Number}
        */
        this.rotationSpeed = 2.5;

        /**
        * @deprecated since version 3.0.8
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
     * value, and a percent value.  { @see GameObject.bending }
     *
     * @return {Object} bending - an object with bending paramters
     */
    get bending(): any {
        return {
            // example:
            // position: { percent: 0.8, min: 0.0, max: 4.0 },
            // velocity: { percent: 0.4, min: 0.0 },
            // angleLocal: { percent: 0.0 }
        };
    }

    /**
    * turn object clock-wise
    * @param {Number} deltaAngle - the angle to turn, in degrees
    * @return {DynamicObject} return this object
    */
    turnRight(deltaAngle: number) {
        this.angle += deltaAngle;
        if (this.angle >= 360) { this.angle -= 360; }
        if (this.angle < 0) { this.angle += 360; }
        return this;
    }

    /**
    * turn object counter-clock-wise
    * @param {Number} deltaAngle - the angle to turn, in degrees
    * @return {DynamicObject} return this object
    */
    turnLeft(deltaAngle: number) {
        return this.turnRight(-deltaAngle);
    }

    /**
    * accelerate along the direction that the object is facing
    * @param {Number} acceleration - the acceleration
    * @return {DynamicObject} return this object
    */
    accelerate(acceleration: number) {
        let rad = this.angle * (Math.PI / 180);
        let dv = new TwoVector(Math.cos(rad), Math.sin(rad));
        dv.multiplyScalar(acceleration);
        this.velocity.add(dv);

        return this;
    }

    /**
     * Formatted textual description of the game object's current bending properties.
     * @return {String} description - a string description
     */
    bendingToString() {
        if (this.bendingIncrements)
            return `ΔPos=${this.bendingPositionDelta} ΔVel=${this.bendingVelocityDelta} ΔAngle=${this.bendingAngleDelta} increments=${this.bendingIncrements}`;
        return 'no bending';
    }

    /**
    * The maximum velocity allowed.  If returns null then ignored.
    * @memberof DynamicObject
    * @member {Number} maxSpeed
    */
    get maxSpeed() { return null; }

    /**
    * Copy the netscheme variables from another DynamicObject.
    * This is used by the synchronizer to create temporary objects, and must be implemented by all sub-classes as well.
    * @param {DynamicObject} other DynamicObject
    */
    syncTo(other: DynamicObject) {
        super.syncTo(other);
        this.position.copy(other.position);
        this.velocity.copy(other.velocity);
        this.width = other.width;
        this.height = other.height;
        this.bendingAngle = other.bendingAngle;
        this.rotationSpeed = other.rotationSpeed;
        this.acceleration = other.acceleration;
        this.deceleration = other.deceleration;
    }

    bendToCurrent(original: DynamicObject, percent: number, worldSettings: any, isLocal: boolean, increments: number) {

        let bending = { increments, percent };
        // if the object has defined a bending multiples for this object, use them
        let positionBending = Object.assign({}, bending, this.bending?.position);
        let velocityBending = Object.assign({}, bending, this.bending?.velocity);
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
        this.bendingAngleDelta = MathUtils.interpolateDeltaWithWrapping(original.angle, this.angle, angleBending.percent, 0, 360) / increments;

        this.bendingTarget = new (<any> this.constructor)();
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

    getAABB() {
        // todo take rotation into account
        // registration point is in the middle
        return {
            min: [this.x - this.width / 2, this.y - this.height / 2],
            max: [this.x + this.width / 2, this.y + this.height / 2]
        };
    }

    /**
    * Determine if this object will collide with another object.
    * Only applicable on "bruteForce" physics engine.
    * @param {DynamicObject} other DynamicObject
    * @return {Boolean} true if the two objects collide
    */
    collidesWith(other: DynamicObject) {
        return true;
    }

}

export default DynamicObject;
