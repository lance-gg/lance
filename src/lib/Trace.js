"use strict";

class Trace {

    constructor(options) {
        // this.TRACE_ALL = 0;
        // this.TRACE_DEBUG = 1;
        // this.TRACE_INFO = 2;
        // this.TRACE_WARN = 3;
        // this.TRACE_ERROR = 4;
        // this.TRACE_NONE = 1000;

        this.options = Object.assign({
            traceLevel: this.TRACE_DEBUG
        }, options);

        this.traceBuffer = [];

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

        this.traceBuffer.push({ data, level, time: new Date() });
    }

    rotate() {
        let buffer = this.traceBuffer;
        this.traceBuffer = [];
        return buffer;
    }

    get length() {
        return this.traceBuffer.length;
    }
}

module.exports = Trace;
