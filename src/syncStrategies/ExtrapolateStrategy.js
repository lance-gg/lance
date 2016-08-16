"use strict";

const SyncStrategy = require("./SyncStrategy");

const defaults = {
    syncsBufferLength: 5,
    RTTEstimate: 2,       // estimate the RTT as two steps (for updateRate=6, that's 200ms)
    extrapolate: 2        // player performs method "X" which means extrapolate to match server time. that 100 + (0..100)
};

class ExtrapolateStrategy extends SyncStrategy {

    constructor(clientEngine, inputOptions) {

        const options = Object.assign({}, defaults, inputOptions);
        super(clientEngine, options);

        this.newSync = null;
        this.gameEngine = this.clientEngine.gameEngine;
        this.gameEngine.on('postStep', this.interpolate.bind(this));
        this.gameEngine.on('client.syncReceived', this.collectSync.bind(this));
    }

    collectSync(e) {
        // TODO avoid editing the input event

        // keep a reference of events by object id
        e.syncObjects = {};
        e.syncEvents.forEach(sEvent => {
            let o = sEvent.objectInstance;
            if (!e.syncObjects[o.id]) {
                e.syncObjects[o.id] = [];
            }
            e.syncObjects[o.id].push(sEvent);
        });

        // keep a reference of events by step
        e.syncSteps = {};
        e.syncEvents.forEach(sEvent => {

            // add an entry for this step and event-name
            if (!e.syncSteps[sEvent.stepCount]) e.syncSteps[sEvent.stepCount] = {};
            if (!e.syncSteps[sEvent.stepCount][sEvent.eventName]) e.syncSteps[sEvent.stepCount][sEvent.eventName] = [];
            e.syncSteps[sEvent.stepCount][sEvent.eventName].push(sEvent);
        });

        // remember this sync
        this.newSync = e;
    }

    // add an object to our world
    addNewObject(objId, newObj) {

        console.log(`adding new object ${objId} at (${newObj.x},${newObj.y},${newObj.z}) velocity (${newObj.velX},${newObj.velY},${newObj.velZ})`);

        let curObj = newObj.class.newFrom(newObj);
        this.gameEngine.addObjectToWorld(curObj);
        curObj.initRenderObject(this.gameEngine.renderer);

        // if this game keeps a physics engine on the client side,
        // we need to update it as well
        if (this.gameEngine.physicsEngine) {
            curObj.initPhysicsObject(this.gameEngine.physicsEngine);
        }

        return curObj;
    }

    applySync() {
        if (!this.newSync) {
            return;
        }

        // create objects which are created at this step
        let world = this.gameEngine.world;
        for (let ids in Object.keys(this.newSync.syncObjects)) {
            this.newSync.syncObjects.forEach(ev => {
                let curObj = world.objects[ev.objectInstance.id];
                if (curObj) {
                    // TODO should use the syncStrategy filter function
                    if (!curObj.isPlayerControlled) {
                        curObj.syncTo(ev.objectInstance, stepToPlay);
                    }
                } else {
                    this.addNewObject(ev.objectInstance.id, ev.objectInstance);
                }
            })
        }

        // apply the number of steps that we want to extrapolate forwards
        for (var step=0; step<this.options.extrapolate) {
            for (var objId in Object.keys(this.world.objects)) {
                this.world.objects[objId].step(this.gameEngine.worldSettings);
            }
        }

        // destroy uneeded objects
        // TODO: use this.forEachSyncObject instead of for-loop
        //       you will need to loop over prevObj instead of nextObj
        for (var objId in Object.keys(this.world.objects)) {
            if (objId < this.gameEngine.options.clientIDSpace && !this.newSync.syncObjects.hasOwnProperty(objId)) {
                world.objects[objId].destroy();
                delete this.gameEngine.world.objects[objId];
            }
        }

        this.newSync = null;
    }

    /**
     * Perform client-side extrapolation.
     */
    extrapolate() {

        // if there is a sync from the server, apply it now
        this.applySync();

        // get the step we will perform
        let world = this.gameEngine.world;
        let stepToPlay = world.stepCount + this.options.extrapolate;

        for (var objId in Object.keys(this.world.objects)) {
            this.world.objects[objId].step(this.gameEngine.worldSettings);
        }
    }
}

module.exports = ExtrapolateStrategy;
