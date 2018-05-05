'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _eventemitter = require('eventemitter3');

var _eventemitter2 = _interopRequireDefault(_eventemitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var singleton = null;

var TIME_RESET_THRESHOLD = 100;

/**
 * The Renderer is the component which must *draw* the game on the client.
 * It will be instantiated once on each client, and must implement the draw
 * method.  The draw method will be invoked on every iteration of the browser's
 * render loop.
 */

var Renderer = function () {
    _createClass(Renderer, null, [{
        key: 'getInstance',
        value: function getInstance() {
            return singleton;
        }

        /**
        * Constructor of the Renderer singleton.
        * @param {GameEngine} gameEngine - Reference to the GameEngine instance.
        * @param {ClientEngine} clientEngine - Reference to the ClientEngine instance.
        */

    }]);

    function Renderer(gameEngine, clientEngine) {
        var _this = this;

        _classCallCheck(this, Renderer);

        this.gameEngine = gameEngine;
        this.clientEngine = clientEngine;
        this.gameEngine.on('client__stepReset', function () {
            _this.doReset = true;
        });
        gameEngine.on('objectAdded', this.addObject.bind(this));
        gameEngine.on('objectDestroyed', this.removeObject.bind(this));

        // mixin for EventEmitter
        Object.assign(this, _eventemitter2.default.prototype);

        // the singleton renderer has been created
        singleton = this;
    }

    /**
     * Initialize the renderer.
     * @return {Promise} Resolves when renderer is ready.
    */


    _createClass(Renderer, [{
        key: 'init',
        value: function init() {
            if (typeof window === 'undefined' || !document) {
                console.log('renderer invoked on server side.');
            }
            return Promise.resolve(); // eslint-disable-line new-cap
        }
    }, {
        key: 'reportSlowFrameRate',
        value: function reportSlowFrameRate() {
            this.gameEngine.emit('client__slowFrameRate');
        }

        /**
         * The main draw function.  This method is called at high frequency,
         * at the rate of the render loop.  Typically this is 60Hz, in WebVR 90Hz.
         * If the client engine has been configured to render-schedule, then this
         * method must call the clientEngine's step method.
         *
         * @param {Number} t - current time (only required in render-schedule mode)
         * @param {Number} dt - time elapsed since last draw (only required in render-schedule mode)
         */

    }, {
        key: 'draw',
        value: function draw(t, dt) {
            if (this.clientEngine.options.scheduler === 'render-schedule') this.runClientStep(t, dt);
        }

        /**
         * The main draw function.  This method is called at high frequency,
         * at the rate of the render loop.  Typically this is 60Hz, in WebVR 90Hz.
         *
         * @param {Number} t - current time
         * @param {Number} dt - time elapsed since last draw
         */

    }, {
        key: 'runClientStep',
        value: function runClientStep(t, dt) {
            var p = this.clientEngine.options.stepPeriod;

            // reset step time if we passed a threshold
            if (this.doReset || t > this.clientEngine.lastStepTime + TIME_RESET_THRESHOLD) {
                this.doReset = false;
                this.clientEngine.lastStepTime = t - p / 2;
                this.clientEngine.correction = p / 2;
            }

            // catch-up missed steps
            while (t > this.clientEngine.lastStepTime + p) {
                this.clientEngine.step(this.clientEngine.lastStepTime + p, p + this.clientEngine.correction);
                this.clientEngine.lastStepTime += p;
                this.clientEngine.correction = 0;
            }

            // if not ready for a real step yet, retun
            // this might happen after catch up above
            if (t < this.clientEngine.lastStepTime) {
                dt = t - this.clientEngine.lastStepTime + this.clientEngine.correction;
                if (dt < 0) dt = 0;
                this.clientEngine.correction = this.clientEngine.lastStepTime - t;
                this.clientEngine.step(t, dt, true);
                return;
            }

            // render-controlled step
            dt = t - this.clientEngine.lastStepTime + this.clientEngine.correction;
            this.clientEngine.lastStepTime += p;
            this.clientEngine.correction = this.clientEngine.lastStepTime - t;
            this.clientEngine.step(t, dt);
        }

        /**
         * Handle the addition of a new object to the world.
         * @param {Object} obj - The object to be added.
         */

    }, {
        key: 'addObject',
        value: function addObject(obj) {}

        /**
         * Handle the removal of an old object from the world.
         * @param {Object} obj - The object to be removed.
         */

    }, {
        key: 'removeObject',
        value: function removeObject(obj) {}
    }]);

    return Renderer;
}();

exports.default = Renderer;