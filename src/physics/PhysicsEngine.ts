import { GameEngine } from '../GameEngine.js';
import { GameObject } from "../serialize/GameObject.js";

// The base Physics Engine class defines the expected interface
// for all physics engines

interface PhysicsEngineOptions {
    gameEngine: GameEngine;
}

class PhysicsEngine {

    private options: PhysicsEngineOptions;
    protected gameEngine: GameEngine;
    public world?: any;

    constructor(options: PhysicsEngineOptions) {
        this.options = options;
        this.gameEngine = options.gameEngine;

        if (!options.gameEngine) {
            console.warn('Physics engine initialized without gameEngine!');
        }
    }

    /**
     * A single Physics step.
     *
     * @param {Number} dt - time elapsed since last step
     * @param {Function} objectFilter - a test function which filters which objects should move
     */
    step(dt: number, objectFilter: (o: GameObject) => boolean) {}

}

export { PhysicsEngine, PhysicsEngineOptions }