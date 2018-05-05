'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// TODO: needs documentation
// I think the API could be simpler
//   - Timer.run(waitSteps, cb)
//   - Timer.repeat(waitSteps, count, cb) // count=null=>forever
//   - Timer.cancel(cb)
var Timer = function () {
    function Timer() {
        _classCallCheck(this, Timer);

        this.currentTime = 0;
        this.isActive = false;
        this.idCounter = 0;

        this.events = {};
    }

    _createClass(Timer, [{
        key: 'play',
        value: function play() {
            this.isActive = true;
        }
    }, {
        key: 'tick',
        value: function tick() {
            var event = void 0;
            var eventId = void 0;

            if (this.isActive) {
                this.currentTime++;

                for (eventId in this.events) {
                    event = this.events[eventId];
                    if (event) {

                        if (event.type == 'repeat') {
                            if ((this.currentTime - event.startOffset) % event.time == 0) {
                                event.callback.apply(event.thisContext, event.args);
                            }
                        }
                        if (event.type == 'single') {
                            if ((this.currentTime - event.startOffset) % event.time == 0) {
                                event.callback.apply(event.thisContext, event.args);
                                event.destroy();
                            }
                        }
                    }
                }
            }
        }
    }, {
        key: 'destroyEvent',
        value: function destroyEvent(eventId) {
            delete this.events[eventId];
        }
    }, {
        key: 'loop',
        value: function loop(time, callback) {
            var timerEvent = new TimerEvent(this, TimerEvent.TYPES.repeat, time, callback);

            this.events[timerEvent.id] = timerEvent;

            return timerEvent;
        }
    }, {
        key: 'add',
        value: function add(time, callback, thisContext, args) {
            var timerEvent = new TimerEvent(this, TimerEvent.TYPES.single, time, callback, thisContext, args);

            this.events[timerEvent.id] = timerEvent;
            return timerEvent;
        }

        // todo implement timer delete all events

    }, {
        key: 'destroy',
        value: function destroy(id) {
            delete this.events[id];
        }
    }]);

    return Timer;
}();

// timer event


exports.default = Timer;

var TimerEvent = function TimerEvent(timer, type, time, callback, thisContext, args) {
    _classCallCheck(this, TimerEvent);

    this.id = ++timer.idCounter;
    this.timer = timer;
    this.type = type;
    this.time = time;
    this.callback = callback;
    this.startOffset = timer.currentTime;
    this.thisContext = thisContext;
    this.args = args;

    this.destroy = function () {
        this.timer.destroy(this.id);
    };
};

TimerEvent.TYPES = {
    repeat: 'repeat',
    single: 'single'
};