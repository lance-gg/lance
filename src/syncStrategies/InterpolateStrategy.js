"use strict";

const SyncStrategy = require("./SyncStrategy");

const defaults = {
    syncsBufferLength: 5,
    clientStepHold: 10,
    reflect: false
};

class InterpolateStrategy extends SyncStrategy {

    constructor(clientEngine, inputOptions) {

        const options = Object.assign({}, defaults, inputOptions);
        super(clientEngine, options);

        this.syncsBuffer = []; // buffer for server world updates
        this.gameEngine = this.clientEngine.gameEngine;
        this.gameEngine.passive = true; // client side engine ignores inputs
        this.gameEngine.on('client__postStep', this.interpolate.bind(this));
        this.gameEngine.on('client__syncReceived', this.updatesyncsBuffer.bind(this));
    }

    updatesyncsBuffer(e) {
        // TODO avoid editing the input event
        // TODO the event sorting code below is used in one way or another
        //    by interpolate, extrapolate and reflect.  Consider placing
        //    it in the base class.

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

        // add the sync to the buffer
        this.syncsBuffer.push(e);
        if (this.syncsBuffer.length >= this.options.syncsBufferLength) {
            this.syncsBuffer.shift();
        }
    }

    // add an object to our world
    addNewObject(objId, newObj, stepCount) {

        let curObj = new newObj.constructor();
        curObj.copyFrom(newObj);
        curObj.passive = true;
        this.gameEngine.addObjectToWorld(curObj);

        // if this game keeps a physics engine on the client side,
        // we need to update it as well
        if (this.gameEngine.physicsEngine && typeof curObj.initPhysicsObject === 'function') {
            curObj.initPhysicsObject(this.gameEngine.physicsEngine);
        }

        if (stepCount) {
            curObj.lastUpdateStep = stepCount;
        }

        return curObj;
    }

    /**
     * Perform client-side interpolation.
     */
    interpolate() {

        // get the step we will perform
        let world = this.gameEngine.world;
        let stepToPlay = world.stepCount - this.options.clientStepHold;
        let nextSync = null;

        // get the closest sync to our next step
        for (let x = 0; x < this.syncsBuffer.length; x++) {
            if (this.syncsBuffer[x].stepCount >= stepToPlay) {
                nextSync = this.syncsBuffer[x];
                break;
            }
        }

        // we requires a sync before we proceed
        if (!nextSync) {
            this.gameEngine.trace.debug('interpolate lacks future sync - requesting step skip');
            this.clientEngine.skipOneStep = true;
            return;
        }

        this.gameEngine.trace.debug(`interpolate step ${stepToPlay} towards sync at step ${nextSync.stepCount}`);

        // TODO: events of type objectCreate were never
        //      implemented.  possibly for a good reason.
        // create objects which are created at this step
        let stepEvents = nextSync.syncSteps[stepToPlay];
        if (stepEvents && stepEvents.objectCreate) {
            stepEvents.objectCreate.forEach(ev => {
                // TODO maybe separate addNewObject into two generate/add methods
                this.addNewObject(ev.objectInstance.id, ev.objectInstance, stepToPlay);
            });
        }

        // create objects for events that imply a create-object
        if (stepEvents && stepEvents.objectUpdate) {
            stepEvents.objectUpdate.forEach(ev => {
                if (!world.objects[ev.objectInstance.id])
                    this.addNewObject(ev.objectInstance.id, ev.objectInstance, stepToPlay);
            });
        }

        // remove objects which are removed at this step
        if (stepEvents && stepEvents.objectDestroy) {
            stepEvents.objectDestroy.forEach(ev => {
                world.objects[ev.id].destroy();
                delete this.gameEngine.world.objects[ev.id];
            });
        }

        // interpolate values for all objects in this world
        for (let id of Object.keys(world.objects)) {
            let ob = world.objects[id];
            let nextObj = null;
            let nextStep = null;

            // if we already handled this object, continue
            // TODO maybe call it lastUpdatedStep
            if (ob.lastUpdateStep === stepToPlay) {
                continue;
            }

            // get the nearest object we can interpolate to
            if (!nextSync.syncObjects.hasOwnProperty(id)) {
                continue;
            }
            nextSync.syncObjects[id].forEach(ev => {
                if (!nextObj && ev.stepCount >= stepToPlay) {
                    nextObj = ev.objectInstance;
                    nextStep = ev.stepCount;
                }
            });
            if (nextObj) {
                let playPercentage = 1 / (nextStep + 1 - stepToPlay);
                if (this.options.reflect)
                    playPercentage = 1.0;
                this.interpolateOneObject(ob, nextObj, id, playPercentage);
            }
        }

        // destroy unneeded objects
        // TODO: use this.forEachSyncObject instead of for-loop
        //       you will need to loop over prevObj instead of nextObj
        for (let objId in world.objects) {
            if (objId < this.gameEngine.options.clientIDSpace && !nextSync.syncObjects.hasOwnProperty(objId)) {
                world.objects[objId].destroy();
                delete this.gameEngine.world.objects[objId];
            }
        }

    }

    // TODO: prevObj is now just curObj
    //       and playPercentage is 1/(nextObj.step - now)
    //       so the code below should be easy to simplify now
    interpolateOneObject(prevObj, nextObj, objId, playPercentage) {

        // handle step for this object
        let curObj = this.gameEngine.world.objects[objId];
        if (typeof curObj.interpolate === 'function') {

            // update positions with interpolation
            this.gameEngine.trace.trace(`object ${objId} before ${playPercentage} interpolate: ${curObj.toString()}`);
            curObj.interpolate(nextObj, playPercentage, this.gameEngine.worldSettings);
            this.gameEngine.trace.trace(`object ${objId} after interpolate: ${curObj.toString()}`);

            // if this object has a physics sub-object, it must inherit
            // the position now.
            if (curObj.physicalObject && typeof curObj.updatePhysicsObject === 'function') {
                curObj.updatePhysicsObject();
            }
        }
    }
}

module.exports = InterpolateStrategy;
