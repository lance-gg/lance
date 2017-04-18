'use strict';
/* globals AFRAME */

const EventEmitter = require('eventemitter3');
const networkedPhysics = require('./aframe/system');


// TODO: this class should extend the base Renderer or explain why it doesn't


/**
 * The A-Frame Renderer
 */
class AFrameRenderer {

    /**
    * Constructor of the Renderer singleton.
    * @param {GameEngine} gameEngine - Reference to the GameEngine instance.
    * @param {ClientEngine} clientEngine - Reference to the ClientEngine instance.
    */
    constructor(gameEngine, clientEngine) {
        this.gameEngine = gameEngine;
        this.clientEngine = clientEngine;

        // mixin for EventEmitter
        Object.assign(this, EventEmitter.prototype);

        // set up the networkedPhysics as an A-Frame system
        networkedPhysics.setGlobals(gameEngine, this);
        AFRAME.registerSystem('networked-physics', networkedPhysics);
    }

    reportSlowFrameRate() {
        this.gameEngine.emit('client__slowFrameRate');
    }

    /**
     * Initialize the renderer.
     * @return {Promise} Resolves when renderer is ready.
    */
    init() {
        if ((typeof window === 'undefined') || !document) {
            console.log('renderer invoked on server side.');
        }

        let sceneElArray = document.getElementsByTagName('a-scene');
        if (sceneElArray.length !== 1) {
            throw new Error('A-Frame scene element not found');
        }
        this.scene = sceneElArray[0];

        this.gameEngine.on('objectRemoved', (o) => {
            o.renderObj.remove();
        });

        return Promise.resolve(); // eslint-disable-line new-cap
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

}

module.exports = AFrameRenderer;
