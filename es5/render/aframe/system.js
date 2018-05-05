'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var FRAME_HISTORY_SIZE = 20;
var MAX_SLOW_FRAMES = 10;

exports.default = {
    schema: {
        traceLevel: { default: 4 }
    },

    init: function init() {

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
        for (var i = 0; i < FRAME_HISTORY_SIZE; i++) {
            this.frameRateHistory.push(false);
        }this.frameRateTest = 1000 / 60 * 1.2;
    },

    tick: function tick(t, dt) {
        if (!this.gameEngine) return;

        this.renderer.tick(t, dt);

        var frh = this.frameRateHistory;
        frh.push(dt > this.frameRateTest);
        frh.shift();
        var slowFrames = frh.filter(function (x) {
            return x;
        });
        if (slowFrames.length > MAX_SLOW_FRAMES) {
            this.frameRateHistory = frh.map(function (x) {
                return false;
            });
            this.renderer.reportSlowFrameRate();
        }

        // for each object in the world, update the a-frame element
        this.gameEngine.world.forEachObject(function (id, o) {
            var el = o.renderEl;
            if (el) {
                var q = o.quaternion;
                var p = o.position;
                el.setAttribute('position', p.x + ' ' + p.y + ' ' + p.z);
                el.object3D.quaternion.set(q.x, q.y, q.z, q.w);
            }
        });
    },

    // NOTE: webpack generated incorrect code if you use arrow notation below
    //       it sets "this" to "undefined"
    setGlobals: function setGlobals(gameEngine, renderer) {
        this.gameEngine = gameEngine;
        this.renderer = renderer;
    }
};