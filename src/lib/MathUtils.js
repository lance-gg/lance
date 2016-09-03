"use strict";

class MathUtils {

    // interpolate from start to end, advancing "percent" of the way
    static interpolate(start, end, percent) {
        return (end - start) * percent + start;
    }

    // interpolate from start to end, advancing "percent" of the way
    // and noting that the dimension wraps around {x >= wrapMin, x < wrapMax}
    static interpolateWithWrapping(start, end, percent, wrapMin, wrapMax) {
        let wrapTest = wrapMax - wrapMin;
        if (Math.abs(start - end) > wrapTest / 3) {
            console.log('wrap interpolation is close to limit.  Not sure which edge to wrap to.');
        }
        if (start - end > wrapTest / 2) end += wrapTest;
        else if (end - start > wrapTest / 2) start += wrapTest;
        let interpolatedVal = (end - start) * percent + start;
        if (interpolatedVal > wrapTest) interpolatedVal -= wrapTest;
        return interpolatedVal;
    }
}

module.exports = MathUtils;
