"use strict";

// The base Renderer class defines the expected interface
// for all renderers

class Renderer {

    // constructor
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        gameEngine.on('objectAdded', this.addObject.bind(this));
        gameEngine.on('objectDestroyed', this.removeObject.bind(this));
    }

    // setup the scene
    init() {
        if ((typeof window === 'undefined') || !document) {
            console.log('renderer invoked on server side.');
        }
    }

    // single step
    draw() {}

    // add one object
    // return a reference to the object
    addObject(obj) {
        return null;
    }

    // remove an object from the scene
    removeObject(obj) {
    }
}

module.exports = Renderer;
