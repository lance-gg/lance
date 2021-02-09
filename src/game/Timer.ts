// TODO: needs documentation
// I think the API could be simpler
//   - Timer.run(waitSteps, cb)
//   - Timer.repeat(waitSteps, count, cb) // count=null=>forever
//   - Timer.cancel(cb)
export default class Timer {

    currentTime: number;
    isActive: boolean;
    idCounter: number;
    events: object;

    constructor() {
        this.currentTime = 0;
        this.isActive = false;
        this.idCounter = 0;
        this.events = {};
    }

    play() {
        this.isActive = true;
    }

    tick() {
        let event;
        let eventId;

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

    destroyEvent(eventId) {
        delete this.events[eventId];
    }

    add(time, callback, thisContext, args) {
        let timerEvent = new TimerEvent(this,
            TimerEventType.Single,
            time,
            callback,
            thisContext,
            args
        );

        this.events[timerEvent.id] = timerEvent;
        return timerEvent;
    }

    // todo implement timer delete all events

    destroy(id) {
        delete this.events[id];
    }
}

enum TimerEventType {
    Repeat, Single
}

// timer event
class TimerEvent {
    id: number;
    timer: Timer;
    type: TimerEventType;
    time: number;
    callback: (context: any, args: any) => void;
    startOffset: number;
    thisContext: any;
    args: any;
    destroy: (id: number) => void;

    constructor(timer: Timer, type: TimerEventType, time: number,
        callback: (context: any, args: any) => void, thisContext: any,
        args:any) {
        this.id = ++timer.idCounter;
        this.timer = timer;
        this.type = type;
        this.time = time;
        this.callback = callback;
        this.startOffset = timer.currentTime;
        this.thisContext = thisContext;
        this.args = args;

        this.destroy = function() {
            this.timer.destroy(this.id);
        };
    }
}
