'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Serializable2 = require('./Serializable');

var _Serializable3 = _interopRequireDefault(_Serializable2);

var _Serializer = require('./Serializer');

var _Serializer2 = _interopRequireDefault(_Serializer);

var _ThreeVector = require('./ThreeVector');

var _ThreeVector2 = _interopRequireDefault(_ThreeVector);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * A Quaternion is a geometric object which can be used to
 * represent a three-dimensional rotation.
 */
var Quaternion = function (_Serializable) {
    _inherits(Quaternion, _Serializable);

    _createClass(Quaternion, null, [{
        key: 'netScheme',
        get: function get() {
            return {
                w: { type: _Serializer2.default.TYPES.FLOAT32 },
                x: { type: _Serializer2.default.TYPES.FLOAT32 },
                y: { type: _Serializer2.default.TYPES.FLOAT32 },
                z: { type: _Serializer2.default.TYPES.FLOAT32 }
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

    }]);

    function Quaternion(w, x, y, z) {
        var _ret;

        _classCallCheck(this, Quaternion);

        var _this = _possibleConstructorReturn(this, (Quaternion.__proto__ || Object.getPrototypeOf(Quaternion)).call(this));

        _this.w = w;
        _this.x = x;
        _this.y = y;
        _this.z = z;

        return _ret = _this, _possibleConstructorReturn(_this, _ret);
    }

    /**
     * Formatted textual description of the Quaternion.
     * @return {String} description
     */


    _createClass(Quaternion, [{
        key: 'toString',
        value: function toString() {
            function round3(x) {
                return Math.round(x * 1000) / 1000;
            }
            return 'quaternion(' + round3(this.w) + ', ' + round3(this.x) + ', ' + round3(this.y) + ', ' + round3(this.z) + ')';
        }

        /**
         * copy values from another quaternion into this quaternion
         *
         * @param {Quaternion} sourceObj the quaternion to copy from
         * @return {Quaternion} returns self
         */

    }, {
        key: 'copy',
        value: function copy(sourceObj) {
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

    }, {
        key: 'set',
        value: function set(w, x, y, z) {
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

    }, {
        key: 'toAxisAngle',
        value: function toAxisAngle() {

            // assuming quaternion normalised then w is less than 1, so term always positive.
            var axis = new _ThreeVector2.default(1, 0, 0);
            var angle = 2 * Math.acos(this.w);
            var s = Math.sqrt(1 - this.w * this.w);
            if (s > 0.001) {
                var divS = 1 / s;
                axis.x = this.x * divS;
                axis.y = this.y * divS;
                axis.z = this.z * divS;
            }
            return { axis: axis, angle: angle };
        }

        /**
         * set the values of this quaternion from an axis/angle representation
         *
         * @param {ThreeVector} axis The axis
         * @param {Number} angle angle in radians
         * @return {Quaternion} returns self
         */

    }, {
        key: 'setFromAxisAngle',
        value: function setFromAxisAngle(axis, angle) {

            var halfAngle = angle * 0.5;
            var s = Math.sin(halfAngle);
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

    }, {
        key: 'conjugate',
        value: function conjugate() {
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

    }, {
        key: 'multiply',
        value: function multiply(other) {
            var aw = this.w,
                ax = this.x,
                ay = this.y,
                az = this.z;
            var bw = other.w,
                bx = other.x,
                by = other.y,
                bz = other.z;

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

    }, {
        key: 'slerp',
        value: function slerp(target, bending) {
            var aw = this.w,
                ax = this.x,
                ay = this.y,
                az = this.z;
            var bw = target.w,
                bx = target.x,
                by = target.y,
                bz = target.z;

            var cosHalfTheta = aw * bw + ax * bx + ay * by + az * bz;
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

            var sinHalfTheta = Math.sqrt(1.0 - cosHalfTheta * cosHalfTheta);
            if (Math.abs(sinHalfTheta) < 0.001) {
                this.set(0.5 * (aw + this.w), 0.5 * (ax + this.x), 0.5 * (ay + this.y), 0.5 * (az + this.z));
                return this;
            }

            var halfTheta = Math.atan2(sinHalfTheta, cosHalfTheta);
            var ratioA = Math.sin((1 - bending) * halfTheta) / sinHalfTheta;
            var ratioB = Math.sin(bending * halfTheta) / sinHalfTheta;
            this.set(aw * ratioA + this.w * ratioB, ax * ratioA + this.x * ratioB, ay * ratioA + this.y * ratioB, az * ratioA + this.z * ratioB);
            return this;
        }
        /* eslint-enable */

    }]);

    return Quaternion;
}(_Serializable3.default);

exports.default = Quaternion;