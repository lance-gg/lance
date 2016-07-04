"use strict";

// The base Renderer class defines the expected interface
// for all renderers

class Renderer {

    // constructor
    constructor() {}

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
    addObject(id) {
        return NULL;
    }

    // remove an object from the scene
    removeObject(o) {
    }
}

module.exports = Renderer;
