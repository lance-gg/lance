import GameObject from './GameObject';
import Serializer from './Serializer';
import TwoVector from './TwoVector';
import MathUtils from '../lib/MathUtils';

/**
 * The PhysicalObject2D is the base class for physical game objects in 2D Physics
 */
class PhysicalObject2D extends GameObject {

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
    static get netScheme() {
        return Object.assign({
            playerId: { type: Serializer.TYPES.INT16 },
            position: { type: Serializer.TYPES.CLASSINSTANCE },
            angle: { type: Serializer.TYPES.FLOAT32 },
            velocity: { type: Serializer.TYPES.CLASSINSTANCE },
            angularVelocity: { type: Serializer.TYPES.FLOAT32 }
        }, super.netScheme);
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
    * @param {Number} props.angularVelocity - angular velocity
    */
    constructor(gameEngine, options, props) {
        super(gameEngine, options);
        this.playerId = 0;
        this.bendingIncrements = 0;

        // set default position, velocity and quaternion
        this.position = new TwoVector(0, 0);
        this.velocity = new TwoVector(0, 0);
        this.angle = 0;
        this.angularVelocity = 0;

        // use values if provided
        props = props || {};
        if (props.position) this.position.copy(props.position);
        if (props.velocity) this.velocity.copy(props.velocity);
        if (props.angle) this.angle = props.angle;
        if (props.angularVelocity) this.angularVelocity = props.angularVelocity;

        this.class = PhysicalObject2D;
    }

    /**
     * Formatted textual description of the dynamic object.
     * The output of this method is used to describe each instance in the traces,
     * which significantly helps in debugging.
     *
     * @return {String} description - a string describing the PhysicalObject2D
     */
    toString() {
        let p = this.position.toString();
        let v = this.velocity.toString();
        let a = this.angle;
        let av = this.angularVelocity;
        return `phyObj2D[${this.id}] player${this.playerId} Pos=${p} Vel=${v} Ang=${a} AVel=${av}`;
    }

    // display object's physical attributes as a string
    // for debugging purposes mostly
    bendingToString() {
        if (this.bendingIncrements)
            return `bend=${this.bending} increments=${this.bendingIncrements} deltaPos=${this.bendingPositionDelta} deltaAngle=${this.bendingAngleDelta}`;
        return 'no bending';
    }

    // derive and save the bending increment parameters:
    // - bendingPositionDelta
    // - bendingAVDelta
    // - bendingAngleDelta
    // these can later be used to "bend" incrementally from the state described
    // by "original" to the state described by "self"
    bendToCurrent(original, bending, worldSettings, isLocal, bendingIncrements) {

        // if the object has defined a bending multiples for this object, use them
        if (typeof this.bendingMultiple === 'number')
            bending = this.bendingMultiple;

        // angle bending factor
        let angleBending = bending;
        if (typeof this.bendingAngleMultiple === 'number')
            angleBending = this.bendingAngleMultiple;
        if (isLocal && (typeof this.bendingAngleLocalMultiple === 'number'))
            angleBending = this.bendingAngleLocalMultiple;

        // get the incremental delta position
        this.incrementScale = bending / bendingIncrements;
        this.bendingPositionDelta = this.position.clone();
        this.bendingPositionDelta.subtract(original.position);
        this.bendingPositionDelta.multiplyScalar(this.incrementScale);
        this.bendingVelocityDelta = this.velocity.clone();
        this.bendingVelocityDelta.subtract(original.velocity);
        this.bendingVelocityDelta.multiplyScalar(this.incrementScale);

        // get the incremental angular-velocity
        this.bendingAVDelta = (this.angularVelocity - original.angularVelocity) * this.incrementScale;

        // get the incremental angle correction
        this.bendingAngleDelta = MathUtils.interpolateDeltaWithWrapping(original.angle, this.angle, angleBending, 0, 2 * Math.PI) / bendingIncrements;

        this.bendingTarget = (new this.constructor());
        this.bendingTarget.syncTo(this);
        this.syncTo(original, { keepVelocity: true });
        this.bendingIncrements = bendingIncrements;
        this.bending = bending;

        // TODO: does refreshToPhysics() really belong here?
        //       should refreshToPhysics be decoupled from syncTo
        //       and called explicitly in all cases?
        this.refreshToPhysics();
    }

    syncTo(other, options) {

        super.syncTo(other);

        this.position.copy(other.position);
        this.angle = other.angle;
        this.angularVelocity = other.angularVelocity;

        if (!options || !options.keepVelocity) {
            this.velocity.copy(other.velocity);
        }

        if (this.physicsObj)
            this.refreshToPhysics();
    }

    // update position, angle, angular velocity, and velocity from new physical state.
    refreshFromPhysics() {
        this.copyVector(this.physicsObj.position, this.position);
        this.copyVector(this.physicsObj.velocity, this.velocity);
        this.angle = this.physicsObj.angle;
        this.angularVelocity = this.physicsObj.angularVelocity;
    }

    // generic vector copy.  We need this because different
    // physics engines have different implementations.
    // TODO: Better implementation: the physics engine implementor
    // should define copyFromLanceVector and copyToLanceVector
    copyVector(source, target) {
        let sourceVec = source;
        if (typeof source[0] === 'number' && typeof source[1] === 'number')
            sourceVec = { x: source[0], y: source[1] };

        if (typeof target.copy === 'function') {
            target.copy(sourceVec);
        } else if (Array.isArray(target)) {
            target = [sourceVec.x, sourceVec.y];
        } else {
            target.x = sourceVec.x;
            target.y = sourceVec.y;
        }
    }

    // update position, angle, angular velocity, and velocity from new game state.
    refreshToPhysics() {
        this.copyVector(this.position, this.physicsObj.position);
        this.copyVector(this.velocity, this.physicsObj.velocity);
        this.physicsObj.angle = this.angle;
        this.physicsObj.angularVelocity = this.angularVelocity;
    }

    // apply one increment of bending
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
        this.angularVelocity += (this.bendingAVDelta * timeFactor);
        this.angle += (this.bendingAngleDelta * timeFactor);
        if (this.angle > Math.PI) this.angle -= Math.PI;
        if (this.angle < 0) this.angle += Math.PI;

        this.bendingIncrements--;
    }

    // interpolate implementation
    interpolate(nextObj, percent) {

        // slerp to target position
        this.position.lerp(nextObj.position, percent);
        this.angle = MathUtils.interpolateDeltaWithWrapping(this.angle, nextObj.angle, percent, 0, 2 * Math.PI);
    }
}

export default PhysicalObject2D;
