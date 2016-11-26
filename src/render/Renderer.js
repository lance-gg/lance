'use strict';

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
    */
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        gameEngine.on('objectAdded', this.addObject.bind(this));
        gameEngine.on('objectDestroyed', this.removeObject.bind(this));
    }

    /**
     * Initialize the renderer.
    */
    init() {
        if ((typeof window === 'undefined') || !document) {
            console.log('renderer invoked on server side.');
        }
    }

    /**
     * The main draw function.  This method is called at high frequency,
     * at the rate of the render loop, which can be 60Hz - 90Hz depending
     * on the context.
     */
    draw() {}

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
