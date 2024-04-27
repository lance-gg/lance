/* globals AFRAME */

import { GameEngine } from '../GameEngine.js';
import Renderer from './Renderer.js';
import networkedPhysics from './aframe/system.js';

declare global {
    let AFRAME: any;
}

/**
 * The A-Frame Renderer
 */
class AFrameRenderer extends Renderer {

    protected scene: any;

    /**
    * Constructor of the Renderer singleton.
    * @param {GameEngine} gameEngine - Reference to the GameEngine instance.
    * @param {ClientEngine} clientEngine - Reference to the ClientEngine instance.
    */
    constructor(gameEngine: GameEngine) {
        super(gameEngine);

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

        let p = super.init();

        let sceneElArray = document.getElementsByTagName('a-scene');
        if (sceneElArray.length !== 1) {
            throw new Error('A-Frame scene element not found');
        }
        this.scene = sceneElArray[0];

        this.gameEngine.on('objectRemoved', (o) => {
            o.renderObj.remove();
        });

        return p; // eslint-disable-line new-cap
    }

    /**
     * In AFrame, we set the draw method (which is called at requestAnimationFrame)
     * to a NO-OP. See tick() instead
     */
    draw() {}

    tick(t: number, dt: number) {
        super.draw(t, dt);
    }

}

export default AFrameRenderer;
