'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MathUtils = function () {
    function MathUtils() {
        _classCallCheck(this, MathUtils);
    }

    _createClass(MathUtils, null, [{
        key: 'interpolate',


        // interpolate from start to end, advancing "percent" of the way
        value: function interpolate(start, end, percent) {
            return (end - start) * percent + start;
        }

        // interpolate from start to end, advancing "percent" of the way
        //
        // returns just the delta. i.e. the value that must be added to the start value

    }, {
        key: 'interpolateDelta',
        value: function interpolateDelta(start, end, percent) {
            return (end - start) * percent;
        }

        // interpolate from start to end, advancing "percent" of the way
        // and noting that the dimension wraps around {x >= wrapMin, x < wrapMax}
        //
        // returns just the delta. i.e. the value that must be added to the start value

    }, {
        key: 'interpolateDeltaWithWrapping',
        value: function interpolateDeltaWithWrapping(start, end, percent, wrapMin, wrapMax) {
            var wrapTest = wrapMax - wrapMin;
            if (start - end > wrapTest / 2) end += wrapTest;else if (end - start > wrapTest / 2) start += wrapTest;
            if (Math.abs(start - end) > wrapTest / 3) {
                console.log('wrap interpolation is close to limit.  Not sure which edge to wrap to.');
            }
            return (end - start) * percent;
        }
    }, {
        key: 'interpolateWithWrapping',
        value: function interpolateWithWrapping(start, end, percent, wrapMin, wrapMax) {
            var interpolatedVal = start + this.interpolateDeltaWithWrapping(start, end, percent, wrapMin, wrapMax);
            var wrapLength = wrapMax - wrapMin;
            if (interpolatedVal >= wrapLength) interpolatedVal -= wrapLength;
            if (interpolatedVal < 0) interpolatedVal += wrapLength;
            return interpolatedVal;
        }
    }]);

    return MathUtils;
}();

exports.default = MathUtils;