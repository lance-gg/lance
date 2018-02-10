'use strict';

export default class SyncStrategy {

    constructor(clientEngine, inputOptions) {
        this.clientEngine = clientEngine;
        this.gameEngine = clientEngine.gameEngine;
        this.options = Object.assign({}, inputOptions);
        this.gameEngine.on('client__syncReceived', this.collectSync.bind(this));
        this.requiredSyncs = [];
    }

    // collect a sync and its events
    // maintain a "lastSync" member which describes the last sync we received from
    // the server.  the lastSync object contains:
    //  - syncObjects: all events in the sync indexed by the id of the object involved
    //  - syncSteps: all events in the sync indexed by the step on which they occurred
    //  - objCount
    //  - eventCount
    //  - stepCount
    collectSync(e) {

        // on first connect we need to wait for a full world update
        if (this.needFirstSync) {
            if (!e.fullUpdate)
                return;
        } else {

            // TODO: there is a problem below in the case where the client is 10 steps behind the server,
            // and the syncs that arrive are always in the future and never get processed.  To address this
            // we may need to store more than one sync.

            // ignore syncs which are older than the latest
            if (this.lastSync && this.lastSync.stepCount && this.lastSync.stepCount > e.stepCount)
                return;
        }

        // before we overwrite the last sync, check if it was a required sync
        // syncs that create or delete objects are saved because they must be applied.
        if (this.lastSync && this.lastSync.required) {
            this.requiredSyncs.push(this.lastSync);
        }

        // build new sync object
        let lastSync = this.lastSync = {
            stepCount: e.stepCount,
            fullUpdate: e.fullUpdate,
            syncObjects: {},
            syncSteps: {}
        };

        e.syncEvents.forEach(sEvent => {

            // keep a reference of events by object id
            if (sEvent.objectInstance) {
                let objectId = sEvent.objectInstance.id;
                if (!lastSync.syncObjects[objectId]) lastSync.syncObjects[objectId] = [];
                lastSync.syncObjects[objectId].push(sEvent);
            }

            // keep a reference of events by step
            let stepCount = sEvent.stepCount;
            let eventName = sEvent.eventName;
            if (eventName === 'objectDestroy' || eventName === 'objectCreate')
                lastSync.required = true;

            if (!lastSync.syncSteps[stepCount]) lastSync.syncSteps[stepCount] = {};
            if (!lastSync.syncSteps[stepCount][eventName]) lastSync.syncSteps[stepCount][eventName] = [];
            lastSync.syncSteps[stepCount][eventName].push(sEvent);
        });

        let eventCount = e.syncEvents.length;
        let objCount = (Object.keys(lastSync.syncObjects)).length;
        let stepCount = (Object.keys(lastSync.syncSteps)).length;
        this.gameEngine.trace.debug(() => `sync contains ${objCount} objects ${eventCount} events ${stepCount} steps`);
    }
}
