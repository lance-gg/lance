/* globals THREE */
'use strict';

// TODO: this file doesn't belong in src/network.  Need to think about it.
//       suggestion: it should be called src/render/aframe/system.js
let NetworkedPhysics = {
    schema: {
        traceLevel: { default: 4 }
    },

    init: () => {

        // TODO: Sometimes an object is "simple".  For example it uses
        //       existing AFrame asstes (an OBJ file and a material)
        //       in this case, we can auto-generate the DOM element,
        //       setting the quaternion, position, material, game-object-id
        //       and obj-model.  Same goes for objects which use primitive
        //       geometric objects.  Then developers don't need to create
        //       a class for each object type.
        //       Remember to also remove them.
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
                el.object3D.quaternion.set(q.x, q.y, q.z, q.w);
            }
        });
    },

    setGameEngine: (gameEngine) => {
        this.gameEngine = gameEngine;
    }
};

module.exports = NetworkedPhysics;
