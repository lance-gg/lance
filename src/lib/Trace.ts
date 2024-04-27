type TraceOptions = {
    traceLevel: number
}

type StepDesc = 'initializing' | number;

type TraceEntry = {
    data: string,
    level: number,
    step: StepDesc,
    time: Date
}

type TraceDataCollector = () => string;

/**
 * Tracing Services.
 * Use the trace functions to trace game state.  Turn on tracing by
 * specifying the minimum trace level which should be recorded.  For
 * example, setting traceLevel to Trace.TRACE_INFO will cause info,
 * warn, and error traces to be recorded.
 */
class Trace {
    private options: TraceOptions;
    private traceBuffer: TraceEntry[];
    private step: StepDesc;
    public error: (tdc: TraceDataCollector) => void;
    public warn: (tdc: TraceDataCollector) => void;
    public info: (tdc: TraceDataCollector) => void;
    public debug: (tdc: TraceDataCollector) => void;

    constructor(options: TraceOptions) {

        this.options = Object.assign({
            traceLevel: Trace.TRACE_DEBUG
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

    /**
     * Include all trace levels.
     * @memberof Trace
     * @member {Number} TRACE_ALL
     */
    static get TRACE_ALL() { return 0; }

     /**
      * Include debug traces and higher.
      * @memberof Trace
      * @member {Number} TRACE_DEBUG
      */
    static get TRACE_DEBUG() { return 1; }

     /**
      * Include info traces and higher.
      * @memberof Trace
      * @member {Number} TRACE_INFO
      */
    static get TRACE_INFO() { return 2; }

     /**
      * Include warn traces and higher.
      * @memberof Trace
      * @member {Number} TRACE_WARN
      */
    static get TRACE_WARN() { return 3; }

     /**
      * Include error traces and higher.
      * @memberof Trace
      * @member {Number} TRACE_ERROR
      */
    static get TRACE_ERROR() { return 4; }

     /**
      * Disable all tracing.
      * @memberof Trace
      * @member {Number} TRACE_NONE
      */
    static get TRACE_NONE() { return 1000; }

    trace(level: number, dataCB: TraceDataCollector) {

        if (level < this.options.traceLevel)
            return;

        this.traceBuffer.push({ data: dataCB(), level, step: this.step, time: new Date() });
    }

    rotate() {
        let buffer = this.traceBuffer;
        this.traceBuffer = [];
        return buffer;
    }

    get length(): number {
        return this.traceBuffer.length;
    }

    setStep(s: StepDesc) {
        this.step = s;
    }
}

export default Trace;
