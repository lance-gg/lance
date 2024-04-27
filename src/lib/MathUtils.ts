class MathUtils {

    // interpolate from start to end, advancing "percent" of the way
    static interpolate(start: number, end: number, percent: number): number {
        return (end - start) * percent + start;
    }

    // interpolate from start to end, advancing "percent" of the way
    //
    // returns just the delta. i.e. the value that must be added to the start value
    static interpolateDelta(start: number, end: number, percent: number): number {
        return (end - start) * percent;
    }

    // interpolate from start to end, advancing "percent" of the way
    // and noting that the dimension wraps around {x >= wrapMin, x < wrapMax}
    //
    // returns just the delta. i.e. the value that must be added to the start value
    static interpolateDeltaWithWrapping(start: number, end: number, percent: number, wrapMin: number, wrapMax: number): number {
        let wrapTest = wrapMax - wrapMin;
        if (start - end > wrapTest / 2) end += wrapTest;
        else if (end - start > wrapTest / 2) start += wrapTest;
        if (Math.abs(start - end) > wrapTest / 3) {
            console.log('wrap interpolation is close to limit.  Not sure which edge to wrap to.');
        }
        return (end - start) * percent;
    }

    static interpolateWithWrapping(start: number, end: number, percent: number, wrapMin: number, wrapMax: number): number {
        let interpolatedVal = start + this.interpolateDeltaWithWrapping(start, end, percent, wrapMin, wrapMax);
        let wrapLength = wrapMax - wrapMin;
        if (interpolatedVal >= wrapLength) interpolatedVal -= wrapLength;
        if (interpolatedVal < 0) interpolatedVal += wrapLength;
        return interpolatedVal;
    }
}

export { MathUtils }