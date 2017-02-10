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

        function rad2deg(r) {
            let d = r * 180 / Math.PI;
            d = Math.round(d * 100000) / 100000; // TODO: horrible performace impact
            if (d < 0) d += 360;
            return d;
        }

        this.gameEngine.world.forEachObject((id, o) => {
            let el = o.renderEl;
            if (el) {
                let q = o.quaternion;
                let p = o.position;
                let euler = (new THREE.Euler()).setFromQuaternion(q, 'YXZ');
                let r = { x: rad2deg(euler.x), y: rad2deg(euler.y), z: rad2deg(euler.z) };

                el.setAttribute('position', `${p.x} ${p.y} ${p.z}`);
                // el.setAttribute('quaternion', `${q.w} ${q.x} ${q.y} ${q.z}`);
                el.setAttribute('rotation', `${r.x} ${r.y} ${r.z}`);

            }
        });
    },

    setGameEngine: (gameEngine) => {
        this.gameEngine = gameEngine;
    }
};

module.exports = NetworkedPhysics;
