'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _eventemitter = require('eventemitter3');

var _eventemitter2 = _interopRequireDefault(_eventemitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SIXTY_PER_SEC = 1000 / 60;
var LOOP_SLOW_THRESH = 0.3;
var LOOP_SLOW_COUNT = 10;

/**
 * Scheduler class
 *
 */

var Scheduler = function () {

    /**
     * schedule a function to be called
     *
     * @param {Object} options the options
     * @param {Function} options.tick the function to be called
     * @param {Number} options.period number of milliseconds between each invocation, not including the function's execution time
     * @param {Number} options.delay number of milliseconds to add when delaying or hurrying the execution
     */
    function Scheduler(options) {
        _classCallCheck(this, Scheduler);

        this.options = Object.assign({
            tick: null,
            period: SIXTY_PER_SEC,
            delay: SIXTY_PER_SEC / 3
        }, options);
        this.nextExecTime = null;
        this.requestedDelay = 0;
        this.delayCounter = 0;

        // build an event emitter
        var eventEmitter = new _eventemitter2.default();
        this.on = eventEmitter.on;
        this.once = eventEmitter.once;
        this.removeListener = eventEmitter.removeListener;
        this.emit = eventEmitter.emit;
    }

    // in same cases, setTimeout is ignored by the browser,
    // this is known to happen during the first 100ms of a touch event
    // on android chrome.  Double-check the game loop using requestAnimationFrame


    _createClass(Scheduler, [{
        key: 'nextTickChecker',
        value: function nextTickChecker() {
            var currentTime = new Date().getTime();
            if (currentTime > this.nextExecTime) {
                this.delayCounter++;
                this.callTick();
                this.nextExecTime = currentTime + this.options.stepPeriod;
            }
            window.requestAnimationFrame(this.nextTickChecker.bind(this));
        }
    }, {
        key: 'nextTick',
        value: function nextTick() {
            var stepStartTime = new Date().getTime();
            if (stepStartTime > this.nextExecTime + this.options.period * LOOP_SLOW_THRESH) {
                this.delayCounter++;
            } else this.delayCounter = 0;

            this.callTick();
            this.nextExecTime = stepStartTime + this.options.period + this.requestedDelay;
            this.requestedDelay = 0;
            setTimeout(this.nextTick.bind(this), this.nextExecTime - new Date().getTime());
        }
    }, {
        key: 'callTick',
        value: function callTick() {
            if (this.delayCounter >= LOOP_SLOW_COUNT) {
                this.emit('loopRunningSlow');
                this.delayCounter = 0;
            }
            this.options.tick();
        }

        /**
         * start the schedule
         * @return {Scheduler} returns this scheduler instance
         */

    }, {
        key: 'start',
        value: function start() {
            setTimeout(this.nextTick.bind(this));
            if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && typeof window.requestAnimationFrame === 'function') window.requestAnimationFrame(this.nextTickChecker.bind(this));
            return this;
        }

        /**
         * delay next execution
         */

    }, {
        key: 'delayTick',
        value: function delayTick() {
            this.requestedDelay += this.options.delay;
        }

        /**
         * hurry the next execution
         */

    }, {
        key: 'hurryTick',
        value: function hurryTick() {
            this.requestedDelay -= this.options.delay;
        }
    }]);

    return Scheduler;
}();

exports.default = Scheduler;