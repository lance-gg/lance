import { GameEngine } from '../GameEngine.js';
import { ClientEngine } from '../ClientEngine.js';
let singleton: Renderer;

const TIME_RESET_THRESHOLD = 100;

declare global {
    let THREE: any;
}

/**
 * The Renderer is the component which must *draw* the game on the client.
 * It will be instantiated once on each client, and must implement the draw
 * method.  The draw method will be invoked on every iteration of the browser's
 * render loop.
 */
class Renderer {

    protected gameEngine: GameEngine;
    public clientEngine: ClientEngine;
    private doReset: boolean;

    static getInstance() {
        return singleton;
    }

    /**
    * Constructor of the Renderer singleton.
    * @param {GameEngine} gameEngine - Reference to the GameEngine instance.
    */
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.gameEngine.on('client__stepReset', () => { this.doReset = true; });
        gameEngine.on('objectAdded', this.addObject.bind(this));
        gameEngine.on('objectDestroyed', this.removeObject.bind(this));

        // the singleton renderer has been created
        singleton = this;
    }

    /**
     * Initialize the renderer.
     * @return {Promise} Resolves when renderer is ready.
    */
    init(): Promise<void> {
        if ((typeof window === 'undefined') || !document) {
            console.log('renderer invoked on server side.');
        }
        this.gameEngine.emit('client__rendererReady');
        return Promise.resolve(); // eslint-disable-line new-cap
    }

    reportSlowFrameRate() {
        this.gameEngine.emit('client__slowFrameRate');
    }

    // TODO: t and dt args are not always used (see PixiRenderer) so find a cleaner solution
    /**
     * The main draw function.  This method is called at high frequency,
     * at the rate of the render loop.  Typically this is 60Hz, in WebVR 90Hz.
     * If the client engine has been configured to render-schedule, then this
     * method must call the ClientEngine.js's step method.
     *
     * @param {Number} t - current time (only required in render-schedule mode)
     * @param {Number} dt - time elapsed since last draw
     */
    draw(t: number, dt: number) {
        this.gameEngine.emit('client__draw');

        if (this.clientEngine.options.scheduler === 'render-schedule')
            this.runClientStep(t);
    }

    /**
     * The main draw function.  This method is called at high frequency,
     * at the rate of the render loop.  Typically this is 60Hz, in WebVR 90Hz.
     *
     * @param {Number} t - current time
     * @param {Number} dt - time elapsed since last draw
     */
    runClientStep(t: number) {
        let p = this.clientEngine.options.stepPeriod;
        let dt = 0;

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

        // if not ready for a real step yet, return
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
    addObject(obj) {}

    /**
     * Handle the removal of an old object from the world.
     * @param {Object} obj - The object to be removed.
     */
    removeObject(obj) {}

    /**
     * Called when clientEngine has stopped, time to clean up
     */
    stop() {}
}

export default Renderer;
