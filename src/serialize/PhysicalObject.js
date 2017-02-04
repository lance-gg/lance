'use strict';

const Serializable = require('./Serializable');
const Serializer = require('./Serializer');
const ThreeVector = require('./ThreeVector');
const FourVector = require('./FourVector');

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
 * - refreshPhysics() - the physical sub-entities may have changed, this
 *   function must update the object's attributes accordingly.
 */
class PhysicalObject extends Serializable {

    static get netScheme() {
        return {
            id: { type: Serializer.TYPES.INT32 },
            playerId: { type: Serializer.TYPES.UINT8 },
            position: { type: Serializer.TYPES.CLASSINSTANCE },
            velocity: { type: Serializer.TYPES.CLASSINSTANCE },
            quaternion: { type: Serializer.TYPES.CLASSINSTANCE }
        };
    }

    constructor(id, position, velocity, quaternion) {
        super();
        this.id = id;
        this.playerId = 0;

        // set default position, velocity and quaternion
        this.position = new ThreeVector(0, 0, 0);
        this.velocity = new ThreeVector(0, 0, 0);
        this.quaternion = new FourVector(0, 0, 0, 0);

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
        return `phyObj[${this.id}] player${this.playerId} pos${p} vel${v} quat${q}`;
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

    // TODO: implement
    bendToCurrent(original, bending, worldSettings, isLocal, bendingIncrements) {

    }

    syncTo(other) {
        this.id = other.id;
        this.playerId = other.playerId;

        this.position.copy(other.position);
        this.quaternion.copy(other.quaternion);
        this.velocity.copy(other.velocity);
    }

    // remove copyFrom method
    copyFrom(other) {
        this.syncTo(other);
    }

    // update position, quaternion, and velocity according to
    // new physical state.
    refreshPhysics() {
        this.position.copy(this.physicsObj.position);
        this.quaternion.copy(this.physicsObj.quaternion);
        this.velocity.copy(this.physicsObj.velocity);

        if (this.renderObj) {
            this.renderObj.position.copy(this.physicsObj.position);
            this.renderObj.quaternion.copy(this.physicsObj.quaternion);
        }
    }
}

module.exports = PhysicalObject;
