'use strict';

/**
 * Scheduler class
 *
 */
class Scheduler {

    /**
     * schedule a function to be called
     *
     * @param {Object} options the options
     * @param {Function} options.tick the function to be called
     * @param {Number} options.period number of milliseconds between each invocation, not including the function's execution time
     * @param {Number} options.delay number of milliseconds to add when delaying or hurrying the execution
     */
    constructor(options) {

        this.options = options;
        this.nextExecTime = null;
        this.requestedDelay = 0;

    }

    // in same cases, setTimeout is ignored by the browser,
    // this is known to happen during the first 100ms of a touch event
    // on android chrome.  Double-check the game loop using requestAnimationFrame
    nextTickChecker() {
        let currentTime = (new Date()).getTime();
        if (currentTime > this.nextExecTime) {
            this.options.tick();
            this.nextExecTime = currentTime + this.options.stepPeriod;
        }
        window.requestAnimationFrame(this.nextTickChecker.bind(this));
    }

    nextTick() {
        let stepStartTime = (new Date()).getTime();
        this.options.tick();
        this.nextExecTime = stepStartTime + this.options.period + this.requestedDelay;
        this.requestedDelay = 0;
        setTimeout(this.nextTick.bind(this), this.nextExecTime - (new Date()).getTime());
    }

    /**
     * start the schedule
     */
    start() {
        setTimeout(this.nextTick.bind(this));
        if (typeof window === 'object' && typeof window.requestAnimationFrame === 'function')
            window.requestAnimationFrame(this.nextTickChecker.bind(this));
    }

    /**
     * delay next execution
     */
    delayTick() {
        this.requestedDelay += this.options.delay;
    }

    /**
     * hurry the next execution
     */
    hurryTick() {
        this.requestedDelay -= this.options.delay;
    }
}

module.exports = Scheduler;
