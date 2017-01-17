"use strict";

const SyncStrategy = require("./SyncStrategy");

const defaults = {
    worldBufferLength: 60,
    clientStepLag: 0
};

class FrameSyncStrategy extends SyncStrategy {

    constructor(clientEngine, inputOptions) {

        super(clientEngine, inputOptions);
        this.options = Object.assign(defaults, inputOptions);

        this.gameEngine = this.clientEngine.gameEngine;
        this.gameEngine.on('postStep', this.frameSync.bind(this));
        this.gameEngine.on('client__syncReceived', this.keepSnapshot.bind(this));
    }

    // keep snapshot if it's the most recent we've seen
    keepSnapshot(e) {
        if (!this.latestSnapshot || e.snapshot.stepCount > this.latestSnapshot.stepCount) {
            this.latestSnapshot = e.snapshot;
        }
    }

    /**
     * Perform client-side interpolation.
     */
    frameSync() {

        let world = this.gameEngine.world;
        let nextWorld = this.latestSnapshot;

        // see if we need to sync
        // TODO: might as well exit this function now if (nextWorld.step == world.step)
        if (!nextWorld) {
            return;
        }

        // create new objects, interpolate existing objects
        for (let objId in nextWorld.objects) {
            if (nextWorld.objects.hasOwnProperty(objId)) {

                let curObj = null;
                let nextObj = nextWorld.objects[objId];

                // if the object is new, add it
                if (!world.objects.hasOwnProperty(objId)) {
                    console.log(`adding new object ${objId} at (${nextObj.x},${nextObj.y},${nextObj.z}) velocity (${nextObj.velX},${nextObj.velY},${nextObj.velZ})`);

                    curObj = new nextObj.constructor();
                    curObj.copyFrom(nextObj);
                    world.objects[objId] = curObj;
                    curObj.init({
                        velX: nextObj.velX,
                        velY: nextObj.velY,
                        velZ: nextObj.velZ
                    });
                    curObj.initRenderObject(this.gameEngine.renderer);

                    // if this game keeps a physics engine on the client side,
                    // we need to update it as well
                    if (this.gameEngine.physicsEngine) {
                        curObj.initPhysicsObject(this.gameEngine.physicsEngine);
                    }
                } else {
                    curObj = world.objects[objId];
                    curObj.copy(nextObj);
                }

                // update render sub-object
                curObj.updateRenderObject();
            }
        }
    }
}

module.exports = FrameSyncStrategy;
