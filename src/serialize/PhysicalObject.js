'use strict';

const GameObject = require('./GameObject');
const Serializer = require('./Serializer');
const ThreeVector = require('./ThreeVector');
const Quaternion = require('./Quaternion');

/**
 * The PhysicalObject is the base class for physical game objects
 */
class PhysicalObject extends GameObject {

    // TODO:
    // this code is not performance optimized, generally speaking.
    // a lot can be done to make it faster, by using temp objects
    // insead of creating new ones, less copying, and removing some redundancy
    // in calculations.

    static get netScheme() {
        return Object.assign({
            playerId: { type: Serializer.TYPES.INT16 },
            position: { type: Serializer.TYPES.CLASSINSTANCE },
            quaternion: { type: Serializer.TYPES.CLASSINSTANCE },
            velocity: { type: Serializer.TYPES.CLASSINSTANCE },
            angularVelocity: { type: Serializer.TYPES.CLASSINSTANCE }
        }, super.netScheme);
    }

    constructor(id, position, velocity, quaternion, angularVelocity) {
        super(id);
        this.playerId = 0;
        this.bendingIncrements = 0;

        // set default position, velocity and quaternion
        this.position = new ThreeVector(0, 0, 0);
        this.velocity = new ThreeVector(0, 0, 0);
        this.quaternion = new Quaternion(1, 0, 0, 0);
        this.angularVelocity = new ThreeVector(0, 0, 0);

        // use values if provided
        if (position) this.position.copy(position);
        if (velocity) this.velocity.copy(velocity);
        if (quaternion) this.quaternion.copy(quaternion);
        if (angularVelocity) this.angularVelocity.copy(angularVelocity);

        this.class = PhysicalObject;
    }

    // display object's physical attributes as a string
    // for debugging purposes mostly
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

        // get the incremental quaternion rotation
        let currentConjugate = (new Quaternion()).copy(original.quaternion).conjugate();
        this.bendingQuaternionDelta = (new Quaternion()).copy(this.quaternion);
        this.bendingQuaternionDelta.multiply(currentConjugate);
        let axisAngle = this.bendingQuaternionDelta.toAxisAngle();
        axisAngle.angle *= this.incrementScale;
        this.bendingQuaternionDelta.setFromAxisAngle(axisAngle.axis, axisAngle.angle);

        this.bendingTarget = (new this.constructor());
        this.bendingTarget.syncTo(this);
        this.syncTo(original, { keepVelocities: true });
        this.bendingIncrements = bendingIncrements;
        this.bending = bending;

        // TODO: use configurable physics bending
        // TODO: does refreshToPhysics() really belong here?
        //       should refreshToPhysics be decoupled from syncTo
        //       and called explicitly in all cases?
        this.refreshToPhysics();
    }

    syncTo(other, options) {
        this.id = other.id;
        this.playerId = other.playerId;

        this.position.copy(other.position);
        this.quaternion.copy(other.quaternion);

        if (!options || !options.keepVelocities) {
            this.velocity.copy(other.velocity);
            this.angularVelocity.copy(other.angularVelocity);
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

    // TODO: remove this.  It shouldn't be part of the
    //    physical object, and it shouldn't be called by the ExtrapolationStrategy logic
    //    Correct approach:
    //       render object should be refreshed only at the next iteration of the renderer's
    //       draw function.  And then it should be smart about positions (it should interpolate)
    // refresh the renderable position
    refreshRenderObject() {
        if (this.renderObj) {
            this.renderObj.position.copy(this.physicsObj.position);
            this.renderObj.quaternion.copy(this.physicsObj.quaternion);
        }
    }

    // apply one increment of bending
    applyIncrementalBending() {
        if (this.bendingIncrements === 0)
            return;

        this.position.add(this.bendingPositionDelta);
        this.quaternion.slerp(this.bendingTarget.quaternion, this.incrementScale);
        // TODO: the following approach is encountering gimbal lock
        // this.quaternion.multiply(this.bendingQuaternionDelta);
        this.bendingIncrements--;
    }
}

module.exports = PhysicalObject;
