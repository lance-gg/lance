'use strict';

export default class SyncStrategy {

    constructor(clientEngine, inputOptions) {
        this.clientEngine = clientEngine;
        this.gameEngine = clientEngine.gameEngine;
        this.options = Object.assign({}, inputOptions);
        this.gameEngine.on('client__syncReceived', this.collectSync.bind(this));
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
        this.gameEngine.trace.debug(() => `sync contains ${objCount} objects ${eventCount} events ${stepCount} steps`);
    }
}
