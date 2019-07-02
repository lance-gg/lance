import SyncStrategy from './SyncStrategy'

const defaults = {
    worldBufferLength: 60,
    clientStepLag: 0
};

export default class FrameSyncStrategy extends SyncStrategy {

    constructor(clientEngine, inputOptions) {

        const options = Object.assign({}, defaults, inputOptions);
        super(clientEngine, options);

        this.gameEngine = this.clientEngine.gameEngine;
    }

    // apply a new sync
    applySync(sync, required) {

        this.needFirstSync = false;
        this.gameEngine.trace.debug(() => 'framySync applying sync');
        let world = this.gameEngine.world;

        for (let ids of Object.keys(sync.syncObjects)) {
            let ev = sync.syncObjects[ids][0];
            let curObj = world.objects[ev.objectInstance.id];
            if (curObj) {
                curObj.syncTo(ev.objectInstance);
            } else {
                this.addNewObject(ev.objectInstance.id, ev.objectInstance);
            }
        }

        // destroy objects
        for (let objId of Object.keys(world.objects)) {

            let objEvents = sync.syncObjects[objId];

            // if this was a full sync, and we did not get a corresponding object,
            // remove the local object
            if (sync.fullUpdate && !objEvents && objId < this.gameEngine.options.clientIDSpace) {
                this.gameEngine.removeObjectFromWorld(objId);
                continue;
            }

            if (!objEvents || objId >= this.gameEngine.options.clientIDSpace)
                continue;

            // if we got an objectDestroy event, destroy the object
            objEvents.forEach((e) => {
                if (e.eventName === 'objectDestroy') this.gameEngine.removeObjectFromWorld(objId);
            });
        }

        return this.SYNC_APPLIED;
    }

}
