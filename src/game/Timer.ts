
type TimerCallback = (args: any) => void;

// TODO: needs documentation
// I think the API could be simpler
//   - Timer.run(waitSteps, cb)
//   - Timer.repeat(waitSteps, count, cb) // count=null=>forever
//   - Timer.cancel(cb)
class Timer {
    public currentTime: number;
    public idCounter: number;
    private isActive: boolean;
    private events: { [key: number]: TimerEvent }

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

    destroyEvent(eventId: number) {
        delete this.events[eventId];
    }

    loop(time: number, callback: TimerCallback) {
        let timerEvent = new TimerEvent(this,
            'repeat',
            time,
            callback
        );

        this.events[timerEvent.id] = timerEvent;

        return timerEvent;
    }

    add(time: number, callback: TimerCallback, thisContext: any, args: any): TimerEvent {
        let timerEvent = new TimerEvent(this,
            'single',
            time,
            callback,
            thisContext,
            args
        );

        this.events[timerEvent.id] = timerEvent;
        return timerEvent;
    }

    // todo implement timer delete all events

    destroy(id: number) {
        delete this.events[id];
    }
}

// timer event
class TimerEvent {
    public id: number;
    private timer: Timer;
    private type: TimerEventType;
    private time: number;
    private callback: (args: any) => void;
    private startOffset: number;
    private thisContext: any;
    private args: any;
    public destroy: () => void;

    constructor(timer: Timer, type: TimerEventType, time: number, callback, thisContext: any = null, args: any = null) {
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


type TimerEventType = 'repeat' | 'single';

export { Timer, TimerCallback }
