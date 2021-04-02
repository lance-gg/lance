import Serializable from './Serializable';
import BaseTypes from './BaseTypes';

/**
 * A TwoVector is a geometric object which is completely described
 * by two values.
 */
class TwoVector extends Serializable {

    static get netScheme() {
        return {
            x: { type: BaseTypes.TYPES.FLOAT32 },
            y: { type: BaseTypes.TYPES.FLOAT32 }
        };
    }

    /**
    * Creates an instance of a TwoVector.
    * @param {Number} x - first value
    * @param {Number} y - second value
    * @return {TwoVector} v - the new TwoVector
    */
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;

        return this;
    }

    /**
     * Formatted textual description of the TwoVector.
     * @return {String} description
     */
    toString() {
        function round3(x) { return Math.round(x * 1000) / 1000; }
        return `[${round3(this.x)}, ${round3(this.y)}]`;
    }

    /**
     * Set TwoVector values
     *
     * @param {Number} x x-value
     * @param {Number} y y-value
     * @return {TwoVector} returns self
     */
    set(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }

    multiply(other) {
        this.x *= other.x;
        this.y *= other.y;

        return this;
    }

    /**
     * Multiply this TwoVector by a scalar
     *
     * @param {Number} s the scale
     * @return {TwoVector} returns self
     */
    multiplyScalar(s) {
        this.x *= s;
        this.y *= s;

        return this;
    }

    /**
     * Add other vector to this vector
     *
     * @param {TwoVector} other the other vector
     * @return {TwoVector} returns self
     */
    add(other) {
        this.x += other.x;
        this.y += other.y;

        return this;
    }

    /**
     * Subtract other vector to this vector
     *
     * @param {TwoVector} other the other vector
     * @return {TwoVector} returns self
     */
    subtract(other) {
        this.x -= other.x;
        this.y -= other.y;

        return this;
    }

    /**
     * Get vector length
     *
     * @return {Number} length of this vector
     */
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    /**
     * Normalize this vector, in-place
     *
     * @return {TwoVector} returns self
     */
    normalize() {
        this.multiplyScalar(1 / this.length());
        return this;
    }

    /**
     * Copy values from another TwoVector into this TwoVector
     *
     * @param {TwoVector} sourceObj the other vector
     * @return {TwoVector} returns self
     */
    copy(sourceObj) {
        this.x = sourceObj.x;
        this.y = sourceObj.y;

        return this;
    }

    /**
     * Create a clone of this vector
     *
     * @return {TwoVector} returns clone
     */
    clone() {
        return new TwoVector(this.x, this.y);
    }

    /**
     * Apply in-place lerp (linear interpolation) to this TwoVector
     * towards another TwoVector
     * @param {TwoVector} target the target vector
     * @param {Number} p The percentage to interpolate
     * @return {TwoVector} returns self
     */
    lerp(target, p) {
        this.x += (target.x - this.x) * p;
        this.y += (target.y - this.y) * p;

        return this;
    }

    /**
     * Get bending Delta Vector
     * towards another TwoVector
     * @param {TwoVector} target the target vector
     * @param {Object} options bending options
     * @param {Number} options.increments number of increments
     * @param {Number} options.percent The percentage to bend
     * @param {Number} options.min No less than this value
     * @param {Number} options.max No more than this value
     * @return {TwoVector} returns new Incremental Vector
     */
    getBendingDelta(target, options) {
        let increment = target.clone();
        increment.subtract(this);
        increment.multiplyScalar(options.percent);

        // check for max case
        if (((typeof options.max === 'number') && increment.length() > options.max) ||
            ((typeof options.min === 'number') && increment.length() < options.min)) {
            return new TwoVector(0, 0);
        }

        // divide into increments
        increment.multiplyScalar(1 / options.increments);

        return increment;
    }
}

export default TwoVector;
