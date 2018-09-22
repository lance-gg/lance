'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/* global THREE */
var FRAME_HISTORY_SIZE = 20;
var MAX_SLOW_FRAMES = 10;
var CAMERA_OFFSET_VEC = new THREE.Vector3(0, 5, -10);

exports.default = {
    schema: {
        traceLevel: { default: 4 }
    },

    init: function init() {

        // TODO: Sometimes an object is "simple".  For example it uses
        //       existing AFrame assets (an OBJ file and a material)
        //       in this case, we can auto-generate the DOM element,
        //       setting the quaternion, position, material, game-object-id
        //       and obj-model.  Same goes for objects which use primitive
        //       geometric objects.  Remember to also remove them.
        this.frameRateHistory = [];
        for (var i = 0; i < FRAME_HISTORY_SIZE; i++) {
            this.frameRateHistory.push(false);
        }this.frameRateTest = 1000 / 60 * 1.2;

        // capture the chase camera if available
        var chaseCameras = document.getElementsByClassName('chaseCamera');
        if (chaseCameras) this.cameraEl = chaseCameras[0];
    },

    tick: function tick(t, dt) {
        var _this = this;

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

                // if a chase camera is configured, update it
                if (_this.cameraEl && _this.gameEngine.playerId === o.playerId) {
                    var camera = _this.cameraEl.object3D.children[0];
                    var relativeCameraOffset = CAMERA_OFFSET_VEC.clone();
                    var cameraOffset = relativeCameraOffset.applyMatrix4(o.renderEl.object3D.matrixWorld);
                    camera.position.copy(cameraOffset);
                    camera.lookAt(o.renderEl.object3D.position);
                }
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