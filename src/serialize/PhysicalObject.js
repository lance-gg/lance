'use strict';

const Serializable = require('./Serializable');
const Serializer = require('./Serializer');
const ThreeVector = require('./ThreeVector');
const FourVector = require('./FourVector');

class PhysicalObject extends Serializable {

    static get netScheme() {
        return {
            id: { type: Serializer.TYPES.UINT32 },
            playerId: { type: Serializer.TYPES.UINT8 },
            position: { type: Serializer.TYPES.CLASSINSTANCE },
            velocity: { type: Serializer.TYPES.CLASSINSTANCE },
            quaternion: { type: Serializer.TYPES.CLASSINSTANCE }
        };
    }

    constructor(id, position, velocity, quaternion, physicsBody) {
        super();
        this.id = id;
        this.playerId = 0;
        this.position = new ThreeVector(position.x, position.y, position.z);
        this.velocity = new ThreeVector(velocity.x, velocity.y, velocity.z);
        this.quaternion = new FourVector(quaternion.w, quaternion.x, quaternion.y, quaternion.z);
        this.physicsBody = physicsBody;
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
        this.position.copy(this.physicsBody.position);
        this.quaternion.copy(this.physicsBody.quaternion);
        this.velocity.copy(this.physicsBody.velocity);
    }
}

module.exports = PhysicalObject;
