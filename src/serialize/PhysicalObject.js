'use strict';

const Serializable = require('./Serializable');
const Serializer = require('./Serializer');
const ThreeVector = require('./ThreeVector');
const Quaternion = require('./Quaternion');

/**
 * The PhysicalObject is the base class for physical game objects.
 *
 * Each sub-class of PhysicalObject must override the following methods
 * if necessary:
 *
 * - static get netScheme() - base attributes which must be broadcast
 *   to all clients, on every update.  Make sure you extend the existing
 *   netScheme, don't start from scratch.
 * - constructor() - creates a simple object, temporary in nature.
 * - onAddToWorld() - the object should now join the game, by creating
 *   physical entities in the physics engine, and by creating renderable
 *   objects in the renderer.  The object becomes part of the game.
 * - toString() - a textual representation of the object which can help
 *   in debugging and traces
 * - copyFrom() - adopt values from another object. Used to update an
 *   object on the client with new values that arrived from the server.
 * - refreshFromPhysics() - the physical sub-entities may have changed, this
 *   function must update the object's attributes accordingly.
 */
class PhysicalObject extends Serializable {

    static get netScheme() {
        return {
            id: { type: Serializer.TYPES.INT32 },
            playerId: { type: Serializer.TYPES.INT16 },
            position: { type: Serializer.TYPES.CLASSINSTANCE },
            velocity: { type: Serializer.TYPES.CLASSINSTANCE },
            quaternion: { type: Serializer.TYPES.CLASSINSTANCE }
        };
    }

    constructor(id, position, velocity, quaternion) {
        super();
        this.id = id;
        this.playerId = 0;
        this.bendingIncrements = 0;

        // set default position, velocity and quaternion
        this.position = new ThreeVector(0, 0, 0);
        this.velocity = new ThreeVector(0, 0, 0);
        this.quaternion = new Quaternion(0, 0, 0, 0);

        // use values if provided
        if (position) this.position.copy(position);
        if (velocity) this.position.copy(velocity);
        if (quaternion) this.position.copy(quaternion);

        this.class = PhysicalObject;
    }

    // add this object to the game-world by creating physics sub-objects,
    // and renderer sub-objects
    onAddToWorld(gameEngine) {}

    // for debugging purposes mostly
    toString() {
        let p = this.position.toString();
        let v = this.velocity.toString();
        let q = this.quaternion.toString();
        return `phyObj[${this.id}] player${this.playerId} pos${p} vel${v} ${q}`;
    }

    saveState(other) {
        this.savedCopy = (new this.constructor());
        this.savedCopy.copyFrom(other ? other : this);
    }

    bendToCurrentState(bending, worldSettings, isLocal, bendingIncrements) {
        if (this.savedCopy) {
            this.bendToCurrent(this.savedCopy, bending, worldSettings, isLocal, bendingIncrements);
        }
        this.savedCopy = null;
    }

    bendToCurrent(original, bending, worldSettings, isLocal, bendingIncrements) {
        this.bendingTarget = (new this.constructor());
        this.bendingTarget.copyFrom(this);
        this.copyFrom(original);
        this.bendingIncrements = bendingIncrements;
        this.bendingDelta = bending / bendingIncrements;

        // TODO: use configurable physics bending
        // TODO: does refreshToPhysics() really belong here?
        //       should refreshToPhysics be decoupled from syncTo
        //       and called explicitly in all cases?
        // currently velocity bending is a constant 0.8
        this.velocity.lerp(this.bendingTarget.velocity, 0.8);
        this.refreshToPhysics();
    }

    syncTo(other) {
        this.id = other.id;
        this.playerId = other.playerId;

        this.position.copy(other.position);
        this.quaternion.copy(other.quaternion);
        this.velocity.copy(other.velocity);

        if (this.physicsObj)
            this.refreshToPhysics();
    }

    // remove copyFrom method
    copyFrom(other) {
        this.syncTo(other);
    }

    // update position, quaternion, and velocity from new physical state.
    refreshFromPhysics() {
        this.position.copy(this.physicsObj.position);
        this.quaternion.copy(this.physicsObj.quaternion);
        this.velocity.copy(this.physicsObj.velocity);
    }

    // update position, quaternion, and velocity from new physical state.
    refreshToPhysics() {
        this.physicsObj.position.copy(this.position);
        this.physicsObj.quaternion.copy(this.quaternion);
        this.physicsObj.velocity.copy(this.velocity);
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

    // apply incremental bending
    applyIncrementalBending() {
        if (this.bendingIncrements === 0)
            return;

        this.bendingIncrements--;
        this.position.lerp(this.bendingTarget.position, this.bendingDelta);
        this.quaternion.slerp(this.bendingTarget.quaternion, this.bendingDelta);
        // TODO: mathematically, it's incorrect to apply the same delta each
        // iteration because we are starting from a different state.  A correct
        // calculation would reduce the bendingDelta after each application.
        // I'm ok with this for now because it is simply bending less than
        // expected.
    }
}

module.exports = PhysicalObject;
