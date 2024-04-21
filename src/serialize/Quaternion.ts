import Serializable from './Serializable.js';
import BaseTypes from './BaseTypes.js';
import { ThreeVector } from './ThreeVector.js';

const SHOW_AS_AXIS_ANGLE = true;
const MAX_DEL_THETA = 0.2;

/**
 * A Quaternion is a geometric object which can be used to
 * represent a three-dimensional rotation.
 */
class Quaternion extends Serializable {
    private w: number;
    private x: number;
    private y: number;
    private z: number;

    netScheme() {
        return {
            w: { type: BaseTypes.Float32 },
            x: { type: BaseTypes.Float32 },
            y: { type: BaseTypes.Float32 },
            z: { type: BaseTypes.Float32 }
        };
    }

    /**
    * Creates an instance of a Quaternion.
    * @param {Number} w - first value
    * @param {Number} x - second value
    * @param {Number} y - third value
    * @param {Number} z - fourth value
    * @return {Quaternion} v - the new Quaternion
    */
    constructor(w: number, x: number, y: number, z: number) {
        super();
        this.w = w;
        this.x = x;
        this.y = y;
        this.z = z;

        return this;
    }

    /**
     * Formatted textual description of the Quaternion.
     * @return {String} description
     */
    toString(): string {
        function round3(x) { return Math.round(x * 1000) / 1000; }
        if (SHOW_AS_AXIS_ANGLE) {
            let axisAngle = this.toAxisAngle();
            return `[${round3(axisAngle.angle)},${axisAngle.axis.toString()}]`;
        }
        return `[${round3(this.w)}, ${round3(this.x)}, ${round3(this.y)}, ${round3(this.z)}]`;
    }

    /**
     * copy values from another quaternion into this quaternion
     *
     * @param {Quaternion} sourceObj the quaternion to copy from
     * @return {Quaternion} returns self
     */
    copy(sourceObj: Quaternion): this {
        this.set(sourceObj.w, sourceObj.x, sourceObj.y, sourceObj.z);
        return this;
    }

    /**
     * set quaternion values
     *
     * @param {Number} w w-value
     * @param {Number} x x-value
     * @param {Number} y y-value
     * @param {Number} z z-value
     * @return {Quaternion} returns self
     */
    set(w: number, x: number, y: number, z: number): this {
        this.w = w;
        this.x = x;
        this.y = y;
        this.z = z;

        return this;
    }

    /**
     * return an axis-angle representation of this quaternion
     *
     * @return {Object} contains two attributes: axis (ThreeVector) and angle.
     */
    toAxisAngle() : { axis: ThreeVector, angle: number} {

        // assuming quaternion normalised then w is less than 1, so term always positive.
        let axis = new ThreeVector(1, 0, 0);
        this.normalize();
        let angle = 2 * Math.acos(this.w);
        let s = Math.sqrt(1 - this.w * this.w);
        if (s > 0.001) {
            let divS = 1 / s;
            axis.x = this.x * divS;
            axis.y = this.y * divS;
            axis.z = this.z * divS;
        }
        if (s > Math.PI) {
            s -= 2 * Math.PI;
        }
        return { axis, angle };
    }

    normalize(): this {
        let l = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
        if (l === 0) {
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.w = 0;
        } else {
            l = 1 / l;
            this.x *= l;
            this.y *= l;
            this.z *= l;
            this.w *= l;
        }

        return this;
    }

    /**
     * set the values of this quaternion from an axis/angle representation
     *
     * @param {ThreeVector} axis The axis
     * @param {Number} angle angle in radians
     * @return {Quaternion} returns self
     */
    setFromAxisAngle(axis: ThreeVector, angle: number): this {

        if (angle < 0)
            angle += Math.PI * 2;
        let halfAngle = angle * 0.5;
        let s = Math.sin(halfAngle);
        this.x = axis.x * s;
        this.y = axis.y * s;
        this.z = axis.z * s;
        this.w = Math.cos(halfAngle);

        return this;
    }

    /**
     * conjugate the quaternion, in-place
     *
     * @return {Quaternion} returns self
     */
    conjugate(): this {
        this.x *= -1;
        this.y *= -1;
        this.z *= -1;
        return this;
    }

    /* eslint-disable */
    /**
     * multiply this quaternion by another, in-place
     *
     * @param {Quaternion} other The other quaternion
     * @return {Quaternion} returns self
     */
    multiply(other: Quaternion): this {
        let aw = this.w, ax = this.x, ay = this.y, az = this.z;
        let bw = other.w, bx = other.x, by = other.y, bz = other.z;

        this.x = ax * bw + aw * bx + ay * bz - az * by;
        this.y = ay * bw + aw * by + az * bx - ax * bz;
        this.z = az * bw + aw * bz + ax * by - ay * bx;
        this.w = aw * bw - ax * bx - ay * by - az * bz;

        return this;
    }
    /* eslint-enable */

    /* eslint-disable */
    /**
     * Apply in-place slerp (spherical linear interpolation) to this quaternion,
     * towards another quaternion.
     *
     * @param {Quaternion} target The target quaternion
     * @param {Number} bending The percentage to interpolate
     * @return {Quaternion} returns self
     */
    slerp(target: Quaternion, bending: number): this {

        if (bending <= 0) return this;
        if (bending >= 1) return this.copy(target);

        let aw = this.w, ax = this.x, ay = this.y, az = this.z;
        let bw = target.w, bx = target.x, by = target.y, bz = target.z;

        let cosHalfTheta = aw*bw + ax*bx + ay*by + az*bz;
        if (cosHalfTheta < 0) {
            this.set(-bw, -bx, -by, -bz);
            cosHalfTheta = -cosHalfTheta;
        } else {
            this.copy(target);
        }

        if (cosHalfTheta >= 1.0) {
            this.set(aw, ax, ay, az);
            return this;
        }

        let sqrSinHalfTheta = 1.0 - cosHalfTheta*cosHalfTheta;
        if (sqrSinHalfTheta < Number.EPSILON) {
            let s = 1 - bending;
            this.set(s*aw + bending*this.w, s*ax + bending*this.x, s*ay + bending*this.y, s*az + bending*this.z);
            return this.normalize();
        }

        let sinHalfTheta = Math.sqrt(sqrSinHalfTheta);
        let halfTheta = Math.atan2(sinHalfTheta, cosHalfTheta);
        let delTheta = bending * halfTheta;
        if (Math.abs(delTheta) > MAX_DEL_THETA)
            delTheta = MAX_DEL_THETA * Math.sign(delTheta);
        let ratioA = Math.sin(halfTheta - delTheta)/sinHalfTheta;
        let ratioB = Math.sin(delTheta)/sinHalfTheta;
        this.set(aw*ratioA + this.w*ratioB,
            ax*ratioA + this.x*ratioB,
            ay*ratioA + this.y*ratioB,
            az*ratioA + this.z*ratioB);
        return this;
    }
    /* eslint-enable */
}

export default Quaternion;
