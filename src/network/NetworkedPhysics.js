'use strict';

// TODO: this file doesn't belong in src/network.  Need to think about it.
//       suggestion: it should be called src/render/aframe/system.js
let NetworkedPhysics = {
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
            let el = o.renderEl;
            if (el) {
                let q = o.quaternion;
                let p = o.position;
                el.setAttribute('position', `${p.x} ${p.y} ${p.z}`);
                el.setAttribute('quaternion', `${q.w} ${q.x} ${q.y} ${q.z}`);
            };
        });
    },

    setGameEngine: (gameEngine) => {
        this.gameEngine = gameEngine;
    }
};

module.exports = NetworkedPhysics;
