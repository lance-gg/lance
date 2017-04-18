'use strict';

const EventEmitter = require('eventemitter3');

/**
 * The Renderer is the component which must *draw* the game on the client.
 * It will be instantiated once on each client, and must implement the draw
 * method.  The draw method will be invoked on every iteration of the browser's
 * render loop.
 */
class Renderer {

    /**
    * Constructor of the Renderer singleton.
    * @param {GameEngine} gameEngine - Reference to the GameEngine instance.
    * @param {ClientEngine} clientEngine - Reference to the ClientEngine instance.
    */
    constructor(gameEngine, clientEngine) {
        this.gameEngine = gameEngine;
        this.clientEngine = clientEngine;
        gameEngine.on('objectAdded', this.addObject.bind(this));
        gameEngine.on('objectDestroyed', this.removeObject.bind(this));

        // mixin for EventEmitter
        Object.assign(this, EventEmitter.prototype);
    }

    /**
     * Initialize the renderer.
     * @return {Promise} Resolves when renderer is ready.
    */
    init() {
        if ((typeof window === 'undefined') || !document) {
            console.log('renderer invoked on server side.');
        }
        return Promise.resolve(); // eslint-disable-line new-cap
    }

    reportSlowFrameRate() {
        this.gameEngine.emit('client__slowFrameRate');
    }

    /**
     * The main draw function.  This method is called at high frequency,
     * at the rate of the render loop.  Typically this is 60Hz, in WebVR 90Hz.
     */
    draw() {
        this.gameEngine.world.forEachObject((id, o) => {
            if (typeof o.refreshRenderObject === 'function')
                o.refreshRenderObject();
        });
    }

    /**
     * Handle the addition of a new object to the world.
     * @param {Object} obj - The object to be added.
     */
    addObject(obj) {
    }

    /**
     * Handle the removal of an old object from the world.
     * @param {Object} obj - The object to be removed.
     */
    removeObject(obj) {
    }
}

module.exports = Renderer;
