import GameObject from './GameObject';
import Serializer from './Serializer';
import ThreeVector from './ThreeVector';
import Quaternion from './Quaternion';

/**
 * The PhysicalObject is the base class for physical game objects
 */
export default class PhysicalObject extends GameObject {

    // TODO:
    // this code is not performance optimized, generally speaking.
    // a lot can be done to make it faster, by using temp objects
    // insead of creating new ones, less copying, and removing some redundancy
    // in calculations.

    /**
    * The netScheme is a dictionary of attributes in this game
    * object.  The attributes listed in the netScheme are those exact
    * attributes which will be serialized and sent from the server
    * to each client on every server update.
    * The netScheme member is implemented as a getter.
    *
    * You may choose not to implement this method, in which
    * case your object only transmits the default attributes
    * which are already part of {@link PhysicalObject}.
    * But if you choose to add more attributes, make sure
    * the return value includes the netScheme of the super class.
    *
    * @memberof PhysicalObject
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
            quaternion: { type: Serializer.TYPES.CLASSINSTANCE },
            velocity: { type: Serializer.TYPES.CLASSINSTANCE },
            angularVelocity: { type: Serializer.TYPES.CLASSINSTANCE }
        }, super.netScheme);
    }

    /**
    * Creates an instance of a physical object.
    * Override to provide starting values for position, velocity, quaternion and angular velocity.
    * The object ID should be the next value provided by `world.idCount`
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
    constructor(gameEngine, options, props) {
        super(gameEngine, options);
        this.playerId = 0;
        this.bendingIncrements = 0;

        // set default position, velocity and quaternion
        this.position = new ThreeVector(0, 0, 0);
        this.velocity = new ThreeVector(0, 0, 0);
        this.quaternion = new Quaternion(1, 0, 0, 0);
        this.angularVelocity = new ThreeVector(0, 0, 0);

        // use values if provided
        props = props || {};
        if (props.position) this.position.copy(props.position);
        if (props.velocity) this.velocity.copy(props.velocity);
        if (props.quaternion) this.quaternion.copy(props.quaternion);
        if (props.angularVelocity) this.angularVelocity.copy(props.angularVelocity);

        this.class = PhysicalObject;
    }

    /**
     * Formatted textual description of the dynamic object.
     * The output of this method is used to describe each instance in the traces,
     * which significantly helps in debugging.
     *
     * @return {String} description - a string describing the DynamicObject
     */
    toString() {
        let p = this.position.toString();
        let v = this.velocity.toString();
        let q = this.quaternion.toString();
        let a = this.angularVelocity.toString();
        return `phyObj[${this.id}] player${this.playerId} Pos=${p} Vel=${v} Dir=${q} AVel=${a}`;
    }

    // display object's physical attributes as a string
    // for debugging purposes mostly
    bendingToString() {
        if (this.bendingIncrements)
            return `bend=${this.bending} increments=${this.bendingIncrements} deltaPos=${this.bendingPositionDelta} deltaQuat=${this.bendingQuaternionDelta}`;
        return 'no bending';
    }

    bendToCurrent(original, bending, worldSettings, isLocal, bendingIncrements) {

        // get the incremental delta position
        this.incrementScale = bending / bendingIncrements;
        this.bendingPositionDelta = (new ThreeVector()).copy(this.position);
        this.bendingPositionDelta.subtract(original.position);
        this.bendingPositionDelta.multiplyScalar(this.incrementScale);

        // get the incremental angular-velocity
        this.bendingAVDelta = (new ThreeVector()).copy(this.angularVelocity);
        this.bendingAVDelta.subtract(original.angularVelocity);
        this.bendingAVDelta.multiplyScalar(this.incrementScale);

        // get the incremental quaternion rotation
        let currentConjugate = (new Quaternion()).copy(original.quaternion).conjugate();
        this.bendingQuaternionDelta = (new Quaternion()).copy(this.quaternion);
        this.bendingQuaternionDelta.multiply(currentConjugate);
        let axisAngle = this.bendingQuaternionDelta.toAxisAngle();
        axisAngle.angle *= this.incrementScale;
        this.bendingQuaternionDelta.setFromAxisAngle(axisAngle.axis, axisAngle.angle);

        this.bendingTarget = (new this.constructor());
        this.bendingTarget.syncTo(this);
        this.syncTo(original, { keepVelocity: true });
        this.bendingIncrements = bendingIncrements;
        this.bending = bending;

        // TODO: use configurable physics bending
        // TODO: does refreshToPhysics() really belong here?
        //       should refreshToPhysics be decoupled from syncTo
        //       and called explicitly in all cases?
        this.refreshToPhysics();
    }

    syncTo(other, options) {

        super.syncTo(other);

        this.position.copy(other.position);
        this.quaternion.copy(other.quaternion);
        this.angularVelocity.copy(other.angularVelocity);

        if (!options || !options.keepVelocity) {
            this.velocity.copy(other.velocity);
        }

        if (this.physicsObj)
            this.refreshToPhysics();
    }

    // update position, quaternion, and velocity from new physical state.
    refreshFromPhysics() {
        this.position.copy(this.physicsObj.position);
        this.quaternion.copy(this.physicsObj.quaternion);
        this.velocity.copy(this.physicsObj.velocity);
        this.angularVelocity.copy(this.physicsObj.angularVelocity);
    }

    // update position, quaternion, and velocity from new physical state.
    refreshToPhysics() {
        this.physicsObj.position.copy(this.position);
        this.physicsObj.quaternion.copy(this.quaternion);
        this.physicsObj.velocity.copy(this.velocity);
        this.physicsObj.angularVelocity.copy(this.angularVelocity);
    }

    // apply one increment of bending
    applyIncrementalBending(stepDesc) {
        if (this.bendingIncrements === 0)
            return;

        if (stepDesc && stepDesc.dt) {
            const timeFactor = stepDesc.dt / (1000 / 60);
            const posDelta = (new ThreeVector()).copy(this.bendingPositionDelta).multiplyScalar(timeFactor);
            const avDelta = (new ThreeVector()).copy(this.bendingAVDelta).multiplyScalar(timeFactor);
            this.position.add(posDelta);
            this.angularVelocity.add(avDelta);

            // TODO: this is an unacceptable workaround that must be removed.  It solves the
            // jitter problem by applying only three steps of slerp (thus avoiding slerp to back in time
            // instead of solving the problem with a true differential quaternion
            if (this.bendingIncrements > 3) {
                this.quaternion.slerp(this.bendingTarget.quaternion, this.incrementScale * timeFactor * 0.6);
            }
        } else {
            this.position.add(this.bendingPositionDelta);
            this.angularVelocity.add(this.bendingAVDelta);
            this.quaternion.slerp(this.bendingTarget.quaternion, this.incrementScale);
        }

        // TODO: the following approach is encountering gimbal lock
        // this.quaternion.multiply(this.bendingQuaternionDelta);
        this.bendingIncrements--;
    }
}
