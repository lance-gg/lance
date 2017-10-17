/**
 * Tracing Services.
 * Use the trace functions to trace game state.  Turn on tracing by
 * specifying the minimum trace level which should be recorded.  For
 * example, setting traceLevel to Trace.TRACE_INFO will cause info,
 * warn, and error traces to be recorded.
 */
 export default class Trace {

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

    /**
     * Include all trace levels.
     * @member {Number} TRACE_ALL
     */
     static get TRACE_ALL() { return 0; }

     /**
      * Include debug traces and higher.
      * @member {Number} TRACE_DEBUG
      */
     static get TRACE_DEBUG() { return 1; }

     /**
      * Include info traces and higher.
      * @member {Number} TRACE_INFO
      */
     static get TRACE_INFO() { return 2; }

     /**
      * Include warn traces and higher.
      * @member {Number} TRACE_WARN
      */
     static get TRACE_WARN() { return 3; }

     /**
      * Include error traces and higher.
      * @member {Number} TRACE_ERROR
      */
     static get TRACE_ERROR() { return 4; }

     /**
      * Disable all tracing.
      * @member {Number} TRACE_NONE
      */
     static get TRACE_NONE() { return 1000; }

     trace(level, dataCB) {
         if (level < this.options.traceLevel)
             return;

         this.traceBuffer.push({ data: dataCB(), level, step: this.step, time: new Date() });
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
