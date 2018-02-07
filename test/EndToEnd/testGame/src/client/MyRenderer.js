'use strict';

const incheon = require('../../../../../');
const Renderer = incheon.render.Renderer;

class MyRenderer extends Renderer {

    constructor(gameEngine, clientEngine) {
        super(gameEngine, clientEngine);
        this.sprites = {};
    }

    draw() {
        super.draw();
    }

    addObject(objData, options) {
        let sprite = {};
        
        // add this object to the renderer:
        // if (objData instanceof PlayerAvatar) {
        //     ...
        // }

        Object.assign(sprite, options);
        this.sprites[objData.id] = sprite;

        return sprite;
    }

    removeObject(obj) {
        obj.destroy();
        delete this.sprites[obj.id];
    }

}

module.exports = MyRenderer;
