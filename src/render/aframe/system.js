'use strict';

const FRAME_HISTORY_SIZE = 20;
const MAX_SLOW_FRAMES = 10;

let AFrameSystem = {
    schema: {
        traceLevel: { default: 4 }
    },

    init: function() {

        // TODO: Sometimes an object is "simple".  For example it uses
        //       existing AFrame asstes (an OBJ file and a material)
        //       in this case, we can auto-generate the DOM element,
        //       setting the quaternion, position, material, game-object-id
        //       and obj-model.  Same goes for objects which use primitive
        //       geometric objects.  Then developers don't need to create
        //       a class for each simple object type.
        //
        //       Remember to also remove them.
        this.frameRateHistory = [];
        for (let i=0; i<FRAME_HISTORY_SIZE; i++)
            this.frameRateHistory.push(false);
        this.frameRateTest = (1000 / 60) * 1.2;
    },

    tick: function(t, dt) {
        if (!this.gameEngine)
            return;

        let frh = this.frameRateHistory;
        frh.push(dt > this.frameRateTest);
        frh.shift();
        const slowFrames = frh.filter(x => x);
        if (slowFrames.length > MAX_SLOW_FRAMES) {
            this.frameRateHistory = frh.map(x => false);
            this.renderer.reportSlowFrameRate();
        }

        // for each object in the world, update the a-frame element
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

    // NOTE: webpack generated incorrect code if you use arrow notation below
    //       it sets "this" to "undefined"
    setGlobals: function(gameEngine, renderer) {
        this.gameEngine = gameEngine;
        this.renderer = renderer;
    }
};

module.exports = AFrameSystem;
