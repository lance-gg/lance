'use strict';

const Serializable = require('./Serializable');
const Serializer = require('./Serializer');

/**
 * A FourVector is a geometric object which is completely described
 * by four values.
 */
class FourVector extends Serializable {

    static get netScheme() {
        return {
            w: { type: Serializer.TYPES.FLOAT32 },
            x: { type: Serializer.TYPES.FLOAT32 },
            y: { type: Serializer.TYPES.FLOAT32 },
            z: { type: Serializer.TYPES.FLOAT32 }
        };
    }

    /**
    * Creates an instance of a FourVector.
    * @param {Number} w - first value
    * @param {Number} x - second value
    * @param {Number} y - third value
    * @param {Number} z - fourth value
    * @return {FourVector} v - the new FourVector
    */
    constructor(w, x, y, z) {
        super();
        this.w = w;
        this.x = x;
        this.y = y;
        this.z = z;

        return this;
    }

    /**
     * Formatted textual description of the FourVector.
     * @return {String} description
     */
    toString() {
        function round3(x) { return Math.round(x * 1000) / 1000; }
        return `(${round3(this.w)}, ${round3(this.x)}, ${round3(this.y)}, ${round3(this.z)})`;
    }

    copy(sourceObj) {
        this.w = sourceObj.w;
        this.x = sourceObj.x;
        this.y = sourceObj.y;
        this.z = sourceObj.z;
    }
}

module.exports = FourVector;
