'use strict';

// The base Physics Engine class defines the expected interface
// for all physics engines
class PhysicsEngine {

    init(initOptions) {
        this.gameEngine = initOptions.gameEngine;
    }

    /**
     * A single Physics step.
     *
     * @param {Function} objectFilter - a test function which filters which objects should move
     */
    step(objectFilter) {}

    addObject() {}

    removeObject() {}

}

module.exports = PhysicsEngine;
