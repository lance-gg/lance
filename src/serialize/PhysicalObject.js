'use strict';

const Serializable = require('./Serializable');
const Serializer = require('./Serializer');
const ThreeVector = require('./ThreeVector');
const FourVector = require('./FourVector');

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

    // for debugging purposes mostly
    toString() {
        let p = this.position.toString();
        let v = this.velocity.toString();
        let q = this.quaternion.toString();
        return `phyObj[${this.id}] player${this.playerId} pos${p} vel${v} quat${q}`;
    }

    refreshPhysics() {
        this.position.copy(this.physicsObj.position);
        this.quaternion.copy(this.physicsObj.quaternion);
        this.velocity.copy(this.physicsObj.velocity);

        if (this.renderObj) {
            this.renderObj.position.copy(this.physicsObj.position);
            this.renderObj.quaternion.copy(this.physicsObj.quaternion);
            this.renderObj.velocity.copy(this.physicsObj.velocity);
        }
    }
}

module.exports = PhysicalObject;
