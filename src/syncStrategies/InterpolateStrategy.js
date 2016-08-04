"use strict";

const SyncStrategy = require("./SyncStrategy");

const defaults = {
    worldBufferLength: 5,
    clientStepLag: 6
};

class InterpolateStrategy extends SyncStrategy {

    constructor(clientEngine, inputOptions) {

        const options = Object.assign({}, defaults, inputOptions);
        super(clientEngine, options);

        this.worldBuffer = []; // buffer for server world updates
        this.gameEngine = this.clientEngine.gameEngine;
        this.gameEngine.on('postStep', this.interpolate.bind(this));
        this.gameEngine.on('client.snapshotReceived', this.updateWorldBuffer.bind(this));
    }

    updateWorldBuffer(e) {
        this.worldBuffer.push(e.snapshot);
        if (this.worldBuffer.length >= this.options.worldBufferLength) {
            this.worldBuffer.shift();
        }
    }

    /**
     * Perform client-side interpolation.
     */
    interpolate() {

        // TODO: alter step count based on lag
        let world = this.gameEngine.world;
        let stepToPlay = world.stepCount - this.options.clientStepLag;
        let previousWorld = null;
        let nextWorld = null;

        // get two world snapshots that occur, one before current step,
        // and one equal to or immediately greater than current step
        for (let x = 0; x < this.worldBuffer.length; x++) {
            if (this.worldBuffer[x].stepCount < stepToPlay) {
                previousWorld = this.worldBuffer[x];
            }
            if (this.worldBuffer[x].stepCount >= stepToPlay) {
                nextWorld = this.worldBuffer[x];
                break;
            }
        }

        // between the two worlds
        // we need two snapshots to interpolate
        if (!previousWorld || !nextWorld)
            return;

        // calculate play percentage
        let playPercentage = (stepToPlay - previousWorld.stepCount) / (nextWorld.stepCount - previousWorld.stepCount);

        // create new objects, interpolate existing objects
        // TODO: use this.forEachSyncObject instead of for-loop
        //       you will need to loop over prevObj instead of nextObj
        for (let objId in nextWorld.objects) {
            if (nextWorld.objects.hasOwnProperty(objId)) {

                // get old version and next version
                let prevObj = previousWorld.objects[objId];
                let nextObj = nextWorld.objects[objId];

                // TODO: refactor
                if (prevObj == null) {
                    prevObj = nextObj;
                }

                this.interpolateOneObject(prevObj, nextObj, objId, playPercentage);
            }
        }

        // destroy unneeded objects
        // TODO: use this.forEachSyncObject instead of for-loop
        //       you will need to loop over prevObj instead of nextObj
        for (let objId in world.objects) {
            if (nextWorld.objects.hasOwnProperty(objId)) {
                if (!nextWorld.objects.hasOwnProperty(objId)) {
                    world.objects[objId].destroy();
                    delete this.gameEngine.world.objects[objId];
                }
            }
        }

    }

    interpolateOneObject(prevObj, nextObj, objId, playPercentage) {

        let curObj = null;
        let world = this.gameEngine.world;

        // if the object is new, add it
        if (!world.objects.hasOwnProperty(objId)) {
            console.log(`adding new object ${objId} at (${nextObj.x},${nextObj.y},${nextObj.z}) velocity (${nextObj.velX},${nextObj.velY},${nextObj.velZ})`);

            curObj = world.objects[objId] = nextObj.class.newFrom(nextObj);
            this.gameEngine.addObjectToWorld(curObj);
            curObj.initRenderObject(this.gameEngine.renderer);

            // if this game keeps a physics engine on the client side,
            // we need to update it as well
            if (this.gameEngine.physicsEngine) {
                curObj.initPhysicsObject(this.gameEngine.physicsEngine);
            }
        }

        // handle step for this object
        curObj = world.objects[objId];
        if (curObj.isPlayerControlled && curObj.physicalObject) {

            // if the object is the self, update render position/rotation from physics
            curObj.updateRenderObject();

        } else if (typeof curObj.interpolate === 'function') {

            // update positions with interpolation
            curObj.interpolate(prevObj, nextObj, playPercentage);

            // if this object has a physics sub-object, it must inherit
            // the position now.
            if (curObj.physicalObject && typeof curObj.updatePhysicsObject === 'function') {
                curObj.updatePhysicsObject();
            }
        }
    }
}

module.exports = InterpolateStrategy;
