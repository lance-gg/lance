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
 * A TwoVector is a geometric object which is completely described
 * by two values.
 */
var TwoVector = function (_Serializable) {
    _inherits(TwoVector, _Serializable);

    _createClass(TwoVector, null, [{
        key: 'netScheme',
        get: function get() {
            return {
                x: { type: _BaseTypes2.default.TYPES.FLOAT32 },
                y: { type: _BaseTypes2.default.TYPES.FLOAT32 }
            };
        }

        /**
        * Creates an instance of a TwoVector.
        * @param {Number} x - first value
        * @param {Number} y - second value
        * @return {TwoVector} v - the new TwoVector
        */

    }]);

    function TwoVector(x, y) {
        var _ret;

        _classCallCheck(this, TwoVector);

        var _this = _possibleConstructorReturn(this, (TwoVector.__proto__ || Object.getPrototypeOf(TwoVector)).call(this));

        _this.x = x;
        _this.y = y;

        return _ret = _this, _possibleConstructorReturn(_this, _ret);
    }

    /**
     * Formatted textual description of the TwoVector.
     * @return {String} description
     */


    _createClass(TwoVector, [{
        key: 'toString',
        value: function toString() {
            function round3(x) {
                return Math.round(x * 1000) / 1000;
            }
            return '(' + round3(this.x) + ', ' + round3(this.y) + ')';
        }

        /**
         * Set TwoVector values
         *
         * @param {Number} x x-value
         * @param {Number} y y-value
         * @return {TwoVector} returns self
         */

    }, {
        key: 'set',
        value: function set(x, y) {
            this.x = x;
            this.y = y;
            return this;
        }
    }, {
        key: 'multiply',
        value: function multiply(other) {
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

    }, {
        key: 'multiplyScalar',
        value: function multiplyScalar(s) {
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

    }, {
        key: 'add',
        value: function add(other) {
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

    }, {
        key: 'subtract',
        value: function subtract(other) {
            this.x -= other.x;
            this.y -= other.y;

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
            return Math.sqrt(this.x * this.x + this.y * this.y);
        }

        /**
         * Normalize this vector, in-place
         *
         * @return {TwoVector} returns self
         */

    }, {
        key: 'normalize',
        value: function normalize() {
            this.multiplyScalar(1 / this.length());
            return this;
        }

        /**
         * Copy values from another TwoVector into this TwoVector
         *
         * @param {TwoVector} sourceObj the other vector
         * @return {TwoVector} returns self
         */

    }, {
        key: 'copy',
        value: function copy(sourceObj) {
            this.x = sourceObj.x;
            this.y = sourceObj.y;

            return this;
        }

        /**
         * Create a clone of this vector
         *
         * @return {TwoVector} returns clone
         */

    }, {
        key: 'clone',
        value: function clone() {
            return new TwoVector(this.x, this.y);
        }

        /**
         * Apply in-place lerp (linear interpolation) to this TwoVector
         * towards another TwoVector
         * @param {TwoVector} target the target vector
         * @param {Number} p The percentage to interpolate
         * @return {TwoVector} returns self
         */

    }, {
        key: 'lerp',
        value: function lerp(target, p) {
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
         * @param {Number} options.min No less than this value (not implemented yet)
         * @param {Number} options.max No more than this value
         * @return {TwoVector} returns new Incremental Vector
         */

    }, {
        key: 'getBendingDelta',
        value: function getBendingDelta(target, options) {
            var increment = target.clone();
            increment.subtract(this);
            increment.multiplyScalar(options.percent);

            // check for max case
            if (typeof options.max === 'number' && increment.length() > options.max || typeof options.min === 'number' && increment.length() < options.min) {
                return new TwoVector(0, 0);
            }

            // divide into increments
            increment.multiplyScalar(1 / options.increments);

            return increment;
        }
    }]);

    return TwoVector;
}(_Serializable3.default);

exports.default = TwoVector;