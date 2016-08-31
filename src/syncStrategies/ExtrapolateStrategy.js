"use strict";

const SyncStrategy = require("./SyncStrategy");

const defaults = {
    syncsBufferLength: 5,
    RTTEstimate: 2,       // estimate the RTT as two steps (for updateRate=6, that's 200ms)
    extrapolate: 2,       // player performs method "X" which means extrapolate to match server time. that 100 + (0..100)
    bending: 0.8          // amount of bending towards position of sync object
};

class ExtrapolateStrategy extends SyncStrategy {

    constructor(clientEngine, inputOptions) {

        const options = Object.assign({}, defaults, inputOptions);
        super(clientEngine, options);

        this.newSync = null;
        this.recentInputs = {};
        this.gameEngine = this.clientEngine.gameEngine;
        this.gameEngine.on('postStep', this.extrapolate.bind(this));
        this.gameEngine.on('client.syncReceived', this.collectSync.bind(this));
        this.gameEngine.on('client.preInput', this.clientInputSave.bind(this));
    }

    // keep a buffer of inputs so that we can replay them on extrapolation
    clientInputSave(inputData) {

        // if no inputs have been stored for this step, create an array
        if (!this.recentInputs[inputData.step]) {
            this.recentInputs[inputData.step] = [];
        }
        this.recentInputs[inputData.step].push(inputData);
    }

    // collect a sync and its events
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

        let curObj = newObj.class.newFrom(newObj);
        this.gameEngine.addObjectToWorld(curObj);
        curObj.initRenderObject(this.gameEngine.renderer);
        console.log(`adding new object ${curObj}`);

        // if this game keeps a physics engine on the client side,
        // we need to update it as well
        if (this.gameEngine.physicsEngine) {
            curObj.initPhysicsObject(this.gameEngine.physicsEngine);
        }

        return curObj;
    }

    // clean up the input buffer
    cleanRecentInputs() {
        let firstReplayStep = this.gameEngine.world.stepCount - this.options.extrapolate;
        for (let input of Object.keys(this.recentInputs)) {
            if (this.recentInputs[input].step < firstReplayStep) {
                delete this.recentInputs[input];
            }
        }
    }

    // apply a new sync
    applySync() {
        if (!this.newSync) {
            return;
        }

        this.gameEngine.trace.debug('extrapolate applying sync');

        // create objects which are created at this step
        let world = this.gameEngine.world;
        let serverStep = -1;
        for (let ids of Object.keys(this.newSync.syncObjects)) {
            this.newSync.syncObjects[ids].forEach(ev => {
                let curObj = world.objects[ev.objectInstance.id];
                serverStep = Math.max(serverStep, ev.stepCount);

                if (curObj) {
                    this.gameEngine.trace.trace(`object before syncTo: ${curObj.toString()}`);
                    curObj.saveState();
                    curObj.syncTo(ev.objectInstance);
                    this.gameEngine.trace.trace(`object after syncTo: ${curObj.toString()} synced to step[${ev.stepCount}]`);
                } else {
                    this.addNewObject(ev.objectInstance.id, ev.objectInstance);
                }
            });
        }

        // re-apply the number of steps that we want to extrapolate forwards
        this.cleanRecentInputs();
        this.gameEngine.trace.debug(`extrapolate re-enacting steps from [${serverStep}] to [${world.stepCount}]`);
        for (; serverStep < world.stepCount; serverStep++) {
            if (this.recentInputs[serverStep]) {
                this.recentInputs[serverStep].forEach(inputData => {
                    this.gameEngine.trace.trace(`extrapolate re-enacting input [${inputData.input}]`);
                    this.gameEngine.processInput(inputData, this.clientEngine.playerId);
                });
            }

            for (let objId of Object.keys(world.objects)) {
                this.gameEngine.trace.trace(`extrapolate re-enacting step on obj[${objId}]`);
                world.objects[objId].step(this.gameEngine.worldSettings);
            }
        }

        // bend back to original state
        for (let objId of Object.keys(world.objects)) {
            this.gameEngine.trace.trace(`bending to original state on obj[${objId}]`);
            world.objects[objId].bendToSavedState(this.options.bending);
        }

        // trace object state after sync
        for (let objId of Object.keys(world.objects)) {
            this.gameEngine.trace.trace(`object after extrapolate replay: ${world.objects[objId].toString()}`);
        }

        // destroy uneeded objects
        // TODO: use this.forEachSyncObject instead of for-loop
        //       you will need to loop over prevObj instead of nextObj
        for (let objId of Object.keys(world.objects)) {
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
    }
}

module.exports = ExtrapolateStrategy;
