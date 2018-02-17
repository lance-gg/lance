import Serializable from './Serializable';
import Serializer from './Serializer';

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

    /**
     * Multiply this ThreeVector by a scalar
     *
     * @param {Number} s the scale
     * @return {ThreeVector} returns self
     */
    multiplyScalar(s) {
        this.x *= s;
        this.y *= s;
        this.z *= s;
        return this;
    }

    /**
     * Get vector length
     *
     * @return {Number} length of this vector
     */
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    /**
     * Add other vector to this vector
     *
     * @param {ThreeVector} other the other vector
     * @return {ThreeVector} returns self
     */
    add(other) {
        this.x += other.x;
        this.y += other.y;
        this.z += other.z;
        return this;
    }

    /**
     * Subtract other vector from this vector
     *
     * @param {ThreeVector} other the other vector
     * @return {ThreeVector} returns self
     */
    subtract(other) {
        this.x -= other.x;
        this.y -= other.y;
        this.z -= other.z;
        return this;
    }

    /**
     * Normalize this vector, in-place
     *
     * @return {ThreeVector} returns self
     */
    normalize() {
        this.multiplyScalar(1 / this.length());
        return this;
    }

    /**
     * Copy values from another ThreeVector into this ThreeVector
     *
     * @param {ThreeVector} sourceObj the other vector
     * @return {ThreeVector} returns self
     */
    copy(sourceObj) {
        this.x = sourceObj.x;
        this.y = sourceObj.y;
        this.z = sourceObj.z;
        return this;
    }

    /**
     * Set ThreeVector values
     *
     * @param {Number} x x-value
     * @param {Number} y y-value
     * @param {Number} z z-value
     * @return {ThreeVector} returns self
     */
    set(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }

    /**
     * Apply in-place lerp (linear interpolation) to this ThreeVector
     * towards another ThreeVector
     * @param {ThreeVector} target the target vector
     * @param {Number} p The percentage to interpolate
     * @return {ThreeVector} returns self
     */
    lerp(target, p) {
        this.x += (target.x - this.x) * p;
        this.y += (target.y - this.y) * p;
        this.z += (target.z - this.z) * p;
        return this;
    }
}

export default ThreeVector;
