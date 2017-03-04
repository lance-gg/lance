'use strict';

const Serializable = require('./Serializable');
const Serializer = require('./Serializer');

/**
 * A ThreeVector is a geometric object which is completely described
 * by three values.
 */
class ThreeVector extends Serializable {

    static get netScheme() {
        return {
            x: { type: Serializer.TYPES.FLOAT32 },
            y: { type: Serializer.TYPES.FLOAT32 },
            z: { type: Serializer.TYPES.FLOAT32 }
        };
    }

    /**
    * Creates an instance of a ThreeVector.
    * @param {Number} x - first value
    * @param {Number} y - second value
    * @param {Number} z - second value
    * @return {ThreeVector} v - the new ThreeVector
    */
    constructor(x, y, z) {
        super();
        this.x = x;
        this.y = y;
        this.z = z;

        return this;
    }

    /**
     * Formatted textual description of the ThreeVector.
     * @return {String} description
     */
    toString() {
        function round3(x) { return Math.round(x * 1000) / 1000; }
        return `(${round3(this.x)}, ${round3(this.y)}, ${round3(this.z)})`;
    }

    multiplyScalar(s) {
        this.x *= s;
        this.y *= s;
        this.z *= s;
        return this;
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    add(other) {
        this.x += other.x;
        this.y += other.y;
        this.z += other.z;
        return this;
    }

    subtract(other) {
        this.x -= other.x;
        this.y -= other.y;
        this.z -= other.z;
        return this;
    }

    normalize() {
        this.multiplyScalar(1 / this.length());
        return this;
    }

    copy(sourceObj) {
        this.x = sourceObj.x;
        this.y = sourceObj.y;
        this.z = sourceObj.z;
        return this;
    }

    set(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }

    lerp(target, p) {
        this.x += (target.x - this.x) * p;
        this.y += (target.y - this.y) * p;
        this.z += (target.z - this.z) * p;
        return this;
    }
}

module.exports = ThreeVector;
