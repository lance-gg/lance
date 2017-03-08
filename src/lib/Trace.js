'use strict';

class Trace {

    constructor(options) {

        this.options = Object.assign({
            traceLevel: this.TRACE_DEBUG
        }, options);

        this.traceBuffer = [];
        this.step = 'initializing';

        // syntactic sugar functions
        this.error = this.trace.bind(this, Trace.TRACE_ERROR);
        this.warn = this.trace.bind(this, Trace.TRACE_WARN);
        this.info = this.trace.bind(this, Trace.TRACE_INFO);
        this.debug = this.trace.bind(this, Trace.TRACE_DEBUG);
        this.trace = this.trace.bind(this, Trace.TRACE_ALL);
    }

    static get TRACE_ALL() { return 0; }
    static get TRACE_DEBUG() { return 1; }
    static get TRACE_INFO() { return 2; }
    static get TRACE_WARN() { return 3; }
    static get TRACE_ERROR() { return 4; }
    static get TRACE_NONE() { return 1000; }

    trace(level, data) {
        if (level < this.options.traceLevel)
            return;

        this.traceBuffer.push({ data, level, step: this.step, time: new Date() });
    }

    rotate() {
        let buffer = this.traceBuffer;
        this.traceBuffer = [];
        return buffer;
    }

    get length() {
        return this.traceBuffer.length;
    }

    setStep(s) {
        this.step = s;
    }
}

module.exports = Trace;
