"use strict";

const SyncStrategy = require("./SyncStrategy");

const defaults = {
    syncsBufferLength: 5,
    clientStepLag: 6
};

class InterpolateStrategy extends SyncStrategy {

    constructor(clientEngine, inputOptions) {

        const options = Object.assign({}, defaults, inputOptions);
        super(clientEngine, options);

        this.syncsBuffer = []; // buffer for server world updates
        this.gameEngine = this.clientEngine.gameEngine;
        this.gameEngine.on('postStep', this.interpolate.bind(this));
        this.gameEngine.on('client.syncReceived', this.updatesyncsBuffer.bind(this));
    }

    updatesyncsBuffer(e) {

        // keep a reference of events by object id
        e.syncObjects = {};
        e.syncEvents.forEach((sEvent) => {
            let o = sEvent.objectInstance;
            if (!e.syncObjects[o.id]) {
                e.syncObjects[o.id] = [];
            }
            e.syncObjects[o.id].push(sEvent);
        });

        // add the sync to the buffer
        this.syncsBuffer.push(e);
        if (this.syncsBuffer.length >= this.options.syncsBufferLength) {
            this.syncsBuffer.shift();
        }
    }

    /**
     * Perform client-side interpolation.
     */
    interpolate() {

        // TODO: alter step count based on lag
        let world = this.gameEngine.world;
        let stepToPlay = world.stepCount - this.options.clientStepLag;
        let prevSync = null;
        let nextSync = null;

        // get two syncs that occur, one before current step,
        // and one equal to or immediately greater than current step
        for (let x = 0; x < this.syncsBuffer.length; x++) {
            if (this.syncsBuffer[x].stepCount < stepToPlay) {
                prevSync = this.syncsBuffer[x];
            }
            if (this.syncsBuffer[x].stepCount >= stepToPlay) {
                nextSync = this.syncsBuffer[x];
                break;
            }
        }

        // we requires two syncs before we proceed
        if (!prevSync || !nextSync)
            return;

        // calculate play percentage
        let playPercentage = (stepToPlay - prevSync.stepCount) / (nextSync.stepCount - prevSync.stepCount);

        // create new objects, interpolate existing objects
        // TODO: use this.forEachSyncObject instead of for-loop
        //       you will need to loop over prevObj instead of nextObj
        // TODO: currently assume degenerate case of one event per object
        nextSync.syncEvents.forEach((ev) => {
            let nextObj = ev.objectInstance;
            let prevObj = null;

            if (prevSync.syncObjects.hasOwnProperty(nextObj.id)) {
                prevObj = prevSync.syncObjects[nextObj.id][0].objectInstance;
            } else {
                prevObj = nextObj;
            }

            this.interpolateOneObject(prevObj, nextObj, nextObj.id, playPercentage);
        });

        // destroy unneeded objects
        // TODO: use this.forEachSyncObject instead of for-loop
        //       you will need to loop over prevObj instead of nextObj
        for (let objId in world.objects) {
            if (!nextSync.syncObjects.hasOwnProperty(objId)) {
                world.objects[objId].destroy();
                delete this.gameEngine.world.objects[objId];
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
