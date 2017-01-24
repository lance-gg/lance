'use strict';

const incheon = require('../../../../../');
const ClientEngine = incheon.ClientEngine;
const MyRenderer = require('../client/MyRenderer');

class MyClientEngine extends ClientEngine {

    constructor(gameEngine, options) {
        super(gameEngine, options);

        // initialize renderer
        this.renderer = new MyRenderer(gameEngine);
        this.serializer.registerClass(require('../common/PlayerAvatar'));
        this.gameEngine.on('client.preStep', this.preStep.bind(this));

        // keep a reference for key press state
        this.pressedKeys = {
            down: false,
            up: false,
            left: false,
            right: false,
            space: false
        };
    }

    // our pre-step is to process all inputs
    preStep() {

        if (this.pressedKeys.up) {
            this.sendInput('up', { movement: true });
        }

        if (this.pressedKeys.down) {
            this.sendInput('down', { movement: true });
        }

        if (this.pressedKeys.left) {
            this.sendInput('left', { movement: true });
        }

        if (this.pressedKeys.right) {
            this.sendInput('right', { movement: true });
        }

        if (this.pressedKeys.space) {
            this.sendInput('space', { movement: true });
        }
    }

}

module.exports = MyClientEngine;
