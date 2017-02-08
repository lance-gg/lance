'use strict';

// TODO: this file doesn't belong in src/network.  Need to think about it.
const NetworkedPhysics = {
    schema: {
        traceLevel: { default: 4 }
    },

    init: () => {

        // TODO: on object added events, add an element dynamically
        // TODO: on object removal events, remove an element dynamically
    },

    tick: () => {
        // for each object in the world, update the corresponding
        // a-frame element
        if (!this.gameEngine)
            return;

        this.gameEngine.world.forEachObject((id, o) => {
            let el = o.renderObj;
            if (el) {
                el.setAttribute('quaternion', o.quaternion);
                el.setAttribute('position', o.position);
            }
        });
    }
};

module.exports = NetworkedPhysics;
