'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Tracing Services.
 * Use the trace functions to trace game state.  Turn on tracing by
 * specifying the minimum trace level which should be recorded.  For
 * example, setting traceLevel to Trace.TRACE_INFO will cause info,
 * warn, and error traces to be recorded.
 */
var Trace = function () {
    function Trace(options) {
        _classCallCheck(this, Trace);

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
     * @memberof Trace
     * @member {Number} TRACE_ALL
     */


    _createClass(Trace, [{
        key: 'trace',
        value: function trace(level, dataCB) {

            // all traces must be functions which return strings
            if (typeof dataCB !== 'function') {
                throw new Error('Lance trace was called but instead of passing a function, it received a [' + (typeof dataCB === 'undefined' ? 'undefined' : _typeof(dataCB)) + ']');
            }

            if (level < this.options.traceLevel) return;

            this.traceBuffer.push({ data: dataCB(), level: level, step: this.step, time: new Date() });
        }
    }, {
        key: 'rotate',
        value: function rotate() {
            var buffer = this.traceBuffer;
            this.traceBuffer = [];
            return buffer;
        }
    }, {
        key: 'setStep',
        value: function setStep(s) {
            this.step = s;
        }
    }, {
        key: 'length',
        get: function get() {
            return this.traceBuffer.length;
        }
    }], [{
        key: 'TRACE_ALL',
        get: function get() {
            return 0;
        }

        /**
         * Include debug traces and higher.
         * @memberof Trace
         * @member {Number} TRACE_DEBUG
         */

    }, {
        key: 'TRACE_DEBUG',
        get: function get() {
            return 1;
        }

        /**
         * Include info traces and higher.
         * @memberof Trace
         * @member {Number} TRACE_INFO
         */

    }, {
        key: 'TRACE_INFO',
        get: function get() {
            return 2;
        }

        /**
         * Include warn traces and higher.
         * @memberof Trace
         * @member {Number} TRACE_WARN
         */

    }, {
        key: 'TRACE_WARN',
        get: function get() {
            return 3;
        }

        /**
         * Include error traces and higher.
         * @memberof Trace
         * @member {Number} TRACE_ERROR
         */

    }, {
        key: 'TRACE_ERROR',
        get: function get() {
            return 4;
        }

        /**
         * Disable all tracing.
         * @memberof Trace
         * @member {Number} TRACE_NONE
         */

    }, {
        key: 'TRACE_NONE',
        get: function get() {
            return 1000;
        }
    }]);

    return Trace;
}();

exports.default = Trace;