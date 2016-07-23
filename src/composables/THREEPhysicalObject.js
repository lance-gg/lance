"use strict";

const PhysicalObject = require('./PhysicalObject');


class THREEPhysicalObject extends PhysicalObject {

    static get properties() {
        return {
            id: 9, // class id //TODO this should hashed from the class name
            name: "THREEPhysicalObject"
        }
    }

    constructor(id, x, y, z, rx, ry, rz) {
        super(id, x, y, z, rx, ry, rz); // note: calling apply with arguments array doesn't work on constructor
        this.class = THREEPhysicalObject;
    }

    // update the physics object with current position/rotation
    updateRenderObject() {
        this.renderObject.position.set(this.x, this.y, this.z);
        this.renderObject.rotation.set(this.rx, this.ry, this.rz);
    }

    // synchronize using interpolation
    interpolate(obj1, obj2, percent) {
        // TODO: switch from three parameters (x,y,z) to a single Point instance
        // TODO: switch from three parameters (rx,ry,rz) to a single Euler instance
        // interpolate the position coordinate values
        this.x = (obj2.x - obj1.x) * percent + obj1.x;
        this.y = (obj2.y - obj1.y) * percent + obj1.y;
        this.z = (obj2.z - obj1.z) * percent + obj1.z;

        // interpolate the rotation values
        var eRotationPrev = new THREE.Euler(obj1.rx, obj1.ry, obj1.rz, 'XYZ');
        var eRotationNext = new THREE.Euler(obj2.rx, obj2.ry, obj2.rz, 'XYZ');
        var qPrev = (new THREE.Quaternion()).setFromEuler(eRotationPrev);
        var qNext = (new THREE.Quaternion()).setFromEuler(eRotationNext);
        qPrev.slerp(qNext, percent);
        var eRotationNow = new THREE.Euler().setFromQuaternion(qPrev, 'XYZ');
        this.rx = eRotationNow.x;
        this.ry = eRotationNow.y;
        this.rz = eRotationNow.z;

        // update the renderer-specific data structures
        this.renderObject.position.set(this.x, this.y, this.z);
        this.renderObject.rotation.set(this.rx, this.ry, this.rz);
    }

}

module.exports = THREEPhysicalObject;
