'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Serializable2 = require('./Serializable');

var _Serializable3 = _interopRequireDefault(_Serializable2);

var _BaseTypes = require('./BaseTypes');

var _BaseTypes2 = _interopRequireDefault(_BaseTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * A ThreeVector is a geometric object which is completely described
 * by three values.
 */
var ThreeVector = function (_Serializable) {
    _inherits(ThreeVector, _Serializable);

    _createClass(ThreeVector, null, [{
        key: 'netScheme',
        get: function get() {
            return {
                x: { type: _BaseTypes2.default.TYPES.FLOAT32 },
                y: { type: _BaseTypes2.default.TYPES.FLOAT32 },
                z: { type: _BaseTypes2.default.TYPES.FLOAT32 }
            };
        }

        /**
        * Creates an instance of a ThreeVector.
        * @param {Number} x - first value
        * @param {Number} y - second value
        * @param {Number} z - second value
        * @return {ThreeVector} v - the new ThreeVector
        */

    }]);

    function ThreeVector(x, y, z) {
        var _ret;

        _classCallCheck(this, ThreeVector);

        var _this = _possibleConstructorReturn(this, (ThreeVector.__proto__ || Object.getPrototypeOf(ThreeVector)).call(this));

        _this.x = x;
        _this.y = y;
        _this.z = z;

        return _ret = _this, _possibleConstructorReturn(_this, _ret);
    }

    /**
     * Formatted textual description of the ThreeVector.
     * @return {String} description
     */


    _createClass(ThreeVector, [{
        key: 'toString',
        value: function toString() {
            function round3(x) {
                return Math.round(x * 1000) / 1000;
            }
            return '[' + round3(this.x) + ', ' + round3(this.y) + ', ' + round3(this.z) + ']';
        }

        /**
         * Multiply this ThreeVector by a scalar
         *
         * @param {Number} s the scale
         * @return {ThreeVector} returns self
         */

    }, {
        key: 'multiplyScalar',
        value: function multiplyScalar(s) {
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

    }, {
        key: 'length',
        value: function length() {
            return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        }

        /**
         * Add other vector to this vector
         *
         * @param {ThreeVector} other the other vector
         * @return {ThreeVector} returns self
         */

    }, {
        key: 'add',
        value: function add(other) {
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

    }, {
        key: 'subtract',
        value: function subtract(other) {
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

    }, {
        key: 'normalize',
        value: function normalize() {
            this.multiplyScalar(1 / this.length());
            return this;
        }

        /**
         * Copy values from another ThreeVector into this ThreeVector
         *
         * @param {ThreeVector} sourceObj the other vector
         * @return {ThreeVector} returns self
         */

    }, {
        key: 'copy',
        value: function copy(sourceObj) {
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

    }, {
        key: 'set',
        value: function set(x, y, z) {
            this.x = x;
            this.y = y;
            this.z = z;
            return this;
        }

        /**
         * Create a clone of this vector
         *
         * @return {ThreeVector} returns clone
         */

    }, {
        key: 'clone',
        value: function clone() {
            return new ThreeVector(this.x, this.y, this.z);
        }

        /**
         * Apply in-place lerp (linear interpolation) to this ThreeVector
         * towards another ThreeVector
         * @param {ThreeVector} target the target vector
         * @param {Number} p The percentage to interpolate
         * @return {ThreeVector} returns self
         */

    }, {
        key: 'lerp',
        value: function lerp(target, p) {
            this.x += (target.x - this.x) * p;
            this.y += (target.y - this.y) * p;
            this.z += (target.z - this.z) * p;
            return this;
        }

        /**
         * Get bending Delta Vector
         * towards another ThreeVector
         * @param {ThreeVector} target the target vector
         * @param {Object} options bending options
         * @param {Number} options.increments number of increments
         * @param {Number} options.percent The percentage to bend
         * @param {Number} options.min No less than this value
         * @param {Number} options.max No more than this value
         * @return {ThreeVector} returns new Incremental Vector
         */

    }, {
        key: 'getBendingDelta',
        value: function getBendingDelta(target, options) {
            var increment = target.clone();
            increment.subtract(this);
            increment.multiplyScalar(options.percent);

            // check for max case
            if (options.max && increment.length() > options.max || options.max && increment.length() < options.min) {
                return new ThreeVector(0, 0, 0);
            }

            // divide into increments
            increment.multiplyScalar(1 / options.increments);

            return increment;
        }
    }]);

    return ThreeVector;
}(_Serializable3.default);

exports.default = ThreeVector;