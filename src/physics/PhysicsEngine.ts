import GameEngine from '../GameEngine';

interface PhysicsEngineOptions {
    gameEngine: GameEngine
}

// The base Physics Engine class defines the expected interface
// for all physics engines
export default class PhysicsEngine {

    gameEngine: GameEngine;
    options: PhysicsEngineOptions;

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
    step(dt: number, objectFilter) {}

}
