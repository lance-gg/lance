'use strict';

const SyncStrategy = require('./SyncStrategy');

const defaults = {
    syncsBufferLength: 5,
    maxReEnactSteps: 60,   // maximum number of steps to re-enact
    RTTEstimate: 2,        // estimate the RTT as two steps (for updateRate=6, that's 200ms)
    extrapolate: 2,        // player performs method "X" which means extrapolate to match server time. that 100 + (0..100)
    localObjBending: 0.1,  // amount of bending towards position of sync object
    remoteObjBending: 0.6, // amount of bending towards position of sync object
    bendingIncrements: 10   // the bending should be applied increments (how many steps for entire bend)
};

class ExtrapolateStrategy extends SyncStrategy {

    constructor(clientEngine, inputOptions) {

        const options = Object.assign({}, defaults, inputOptions);
        super(clientEngine, options);

        this.lastSync = null;
        this.recentInputs = {};
        this.gameEngine = this.clientEngine.gameEngine;
        this.gameEngine.on('client__postStep', this.extrapolate.bind(this));
        this.gameEngine.on('client__syncReceived', this.collectSync.bind(this));
        this.gameEngine.on('client__processInput', this.clientInputSave.bind(this));
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

        // ignore syncs which are older than the latest
        if (this.lastSync && this.lastSync.stepCount && this.lastSync.stepCount > e.stepCount)
            return;

        // build new sync object
        let lastSync = this.lastSync = {};
        lastSync.stepCount = e.stepCount;

        // keep a reference of events by object id
        lastSync.syncObjects = {};
        e.syncEvents.forEach(sEvent => {
            let o = sEvent.objectInstance;
            if (!o) return;
            if (!lastSync.syncObjects[o.id]) {
                lastSync.syncObjects[o.id] = [];
            }
            lastSync.syncObjects[o.id].push(sEvent);
        });

        // keep a reference of events by step
        lastSync.syncSteps = {};
        e.syncEvents.forEach(sEvent => {

            // add an entry for this step and event-name
            if (!lastSync.syncSteps[sEvent.stepCount]) lastSync.syncSteps[sEvent.stepCount] = {};
            if (!lastSync.syncSteps[sEvent.stepCount][sEvent.eventName]) lastSync.syncSteps[sEvent.stepCount][sEvent.eventName] = [];
            lastSync.syncSteps[sEvent.stepCount][sEvent.eventName].push(sEvent);
        });

        let objCount = (Object.keys(lastSync.syncObjects)).length;
        let eventCount = e.syncEvents.length;
        let stepCount = (Object.keys(lastSync.syncSteps)).length;
        this.gameEngine.trace.debug(`sync contains ${objCount} objects ${eventCount} events ${stepCount} steps`);
    }

    // add an object to our world
    addNewObject(objId, newObj, options) {

        let curObj = new newObj.constructor();
        curObj.syncTo(newObj);
        this.gameEngine.addObjectToWorld(curObj);
        console.log(`adding new object ${curObj}`);

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

        this.gameEngine.trace.debug('extrapolate applying sync');

        //
        //    scan all the objects in the sync
        //
        // 1. if the object has a local shadow, adopt the server object,
        //    and destroy the shadow
        //
        // 2. if the object exists locally, sync to the server object,
        //    later we will re-enact the missing steps and then bend to
        //    the current position
        //
        // 3. if the object is new, just create it
        //
        let world = this.gameEngine.world;
        let serverStep = this.lastSync.stepCount;
        for (let ids of Object.keys(this.lastSync.syncObjects)) {

            // TODO: we are currently taking only the first event out of
            // the events that may have arrived for this object
            let ev = this.lastSync.syncObjects[ids][0];
            let curObj = world.objects[ev.objectInstance.id];

            let localShadowObj = this.gameEngine.findLocalShadow(ev.objectInstance);
            if (localShadowObj) {

                // case 1: this object has a local shadow object on the client
                this.gameEngine.trace.debug(`object ${ev.objectInstance.id} replacing local shadow ${localShadowObj.id}`);

                if (!world.objects.hasOwnProperty(ev.objectInstance.id)) {
                    let newObj = this.addNewObject(ev.objectInstance.id, ev.objectInstance, { visible: false });
                    newObj.saveState(localShadowObj);
                }
                this.gameEngine.removeObjectFromWorld(localShadowObj.id);

            } else if (curObj) {

                // case 2: this object already exists locally
                this.gameEngine.trace.trace(`object before syncTo: ${curObj.toString()}`);
                curObj.saveState();
                curObj.syncTo(ev.objectInstance);
                this.gameEngine.trace.trace(`object after syncTo: ${curObj.toString()} synced to step[${ev.stepCount}]`);

            } else {

                // case 3: object does not exist.  create it now
                this.addNewObject(ev.objectInstance.id, ev.objectInstance);
            }
        }

        //
        // reenact the steps that we want to extrapolate forwards
        //
        this.cleanRecentInputs();
        this.gameEngine.trace.debug(`extrapolate re-enacting steps from [${serverStep}] to [${world.stepCount}]`);
        if (serverStep < world.stepCount - this.options.maxReEnactSteps) {
            serverStep = world.stepCount - this.options.maxReEnactSteps;
            this.gameEngine.trace.info(`too many steps to re-enact.  Starting from [${serverStep}] to [${world.stepCount}]`);
        }

        let clientStep = world.stepCount;
        for (world.stepCount = serverStep; world.stepCount < clientStep;) {
            if (this.recentInputs[world.stepCount]) {
                this.recentInputs[world.stepCount].forEach(inputData => {

                    // only movement inputs are re-enacted
                    if (!inputData.inputOptions || !inputData.inputOptions.movement) return;

                    this.gameEngine.trace.trace(`extrapolate re-enacting movement input[${inputData.messageIndex}]: ${inputData.input}`);
                    this.gameEngine.processInput(inputData, this.clientEngine.playerId);
                });
            }

            // run the game engine step in "reenact" mode
            this.gameEngine.step(true);
        }

        //
        // bend back to original state
        //
        for (let objId of Object.keys(world.objects)) {

            // shadow objects are not bent
            if (objId >= this.gameEngine.options.clientIDSpace)
                continue;

            // TODO: using == instead of === because of string/number mismatch
            //       These values should always be strings (which contain a number)
            //       Reminder: the reason we use a string is that these
            //       values are sometimes used as object keys
            let obj = world.objects[objId];
            let isLocal = (obj.playerId == this.clientEngine.playerId); // eslint-disable-line eqeqeq
            let bending = isLocal ? this.options.localObjBending : this.options.remoteObjBending;
            obj.bendToCurrentState(bending, this.gameEngine.worldSettings, isLocal, this.options.bendingIncrements);
            if (typeof obj.refreshRenderObject === 'function')
                obj.refreshRenderObject();
            this.gameEngine.trace.trace(`object[${objId}] ${obj.bendingToString()}`);
        }

        // trace object state after sync
        for (let objId of Object.keys(world.objects)) {
            this.gameEngine.trace.trace(`object after extrapolate replay: ${world.objects[objId].toString()}`);
        }

        // destroy objects
        // TODO: use world.forEachObject((id, ob) => {});
        // TODO: identical code is in InterpolateStrategy
        for (let objId of Object.keys(world.objects)) {
            let objEvents = this.lastSync.syncObjects[objId];
            if (!objEvents || objId >= this.gameEngine.options.clientIDSpace)
                continue;

            objEvents.forEach((e) => {
                if (e.eventName === 'objectDestroy') this.gameEngine.removeObjectFromWorld(objId);
            });
        }
    }

    // Perform client-side extrapolation.
    extrapolate() {

        // apply incremental bending
        this.gameEngine.world.forEachObject((id, o) => {
            if (typeof o.applyIncrementalBending === 'function') {
                o.applyIncrementalBending();
                o.refreshToPhysics();
            }
        });

        // if there is a sync from the server, apply it now
        if (this.lastSync)
            this.applySync();
        this.lastSync = null;
    }
}

module.exports = ExtrapolateStrategy;
