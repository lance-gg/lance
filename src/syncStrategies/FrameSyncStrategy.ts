import { ClientEngine } from '../ClientEngine.js';
import { GameWorld } from '../GameWorld.js';
import NetworkTransmitter from '../network/NetworkTransmitter.js';
import { Sync, SyncStrategy, SyncStrategyOptions } from './SyncStrategy.js';


const defaults = {
    worldBufferLength: 60,
    clientStepLag: 0
};

class FrameSyncStrategy extends SyncStrategy {

    constructor(options: SyncStrategyOptions) {
        super(options);
    }

    // apply a new sync
    applySync(sync: Sync, required: boolean) {

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
        for (let objIdStr of Object.keys(world.objects)) {

            let objId = Number(objIdStr);
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
                if (NetworkTransmitter.getNetworkEvent(e) == 'objectDestroy') this.gameEngine.removeObjectFromWorld(objId);
            });
        }

        return SyncStrategy.SYNC_APPLIED;
    }

}

export { FrameSyncStrategy }
