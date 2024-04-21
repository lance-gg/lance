import { ClientEngine } from '../ClientEngine.js';
import { GameWorld } from '../GameWorld.js';
import NetworkTransmitter from '../network/NetworkTransmitter.js';
import { Sync, SyncStrategy, SyncStrategyOptions } from './SyncStrategy.js';

const defaults = {
    clientStepHold: 6,
    localObjBending: 1.0,  // amount of bending towards position of sync object
    remoteObjBending: 1.0, // amount of bending towards position of sync object
    bendingIncrements: 6, // the bending should be applied increments (how many steps for entire bend)
    reflect: false
};

interface InterpolateSyncStrategyOptions extends SyncStrategyOptions {
    localObjBending: number;
    remoteObjBending: number;
    bendingIncrements: number;
}

class InterpolateStrategy extends SyncStrategy {

    static STEP_DRIFT_THRESHOLDS = {
        onServerSync: { MAX_LEAD: -8, MAX_LAG: 16 }, // max step lead/lag allowed after every server sync
        onEveryStep: { MAX_LEAD: -4, MAX_LAG: 24 }, // max step lead/lag allowed at every step
        clientReset: 40 // if we are behind this many steps, just reset the step counter
    };

    private interpolateOptions: InterpolateSyncStrategyOptions;

    constructor(interpolateOptions: InterpolateSyncStrategyOptions) {

        super(interpolateOptions);
        this.interpolateOptions = Object.assign({}, defaults, interpolateOptions);


        this.gameEngine.ignoreInputs = true; // client side engine ignores inputs
        this.gameEngine.ignorePhysics = true; // client side engine ignores physics
    }

    // apply a new sync
    applySync(sync: Sync, required: boolean): string {

        // if sync is in the past we cannot interpolate to it
        if (!required && sync.stepCount <= this.gameEngine.world.stepCount) {
            return SyncStrategy.SYNC_APPLIED;
        }

        this.gameEngine.trace.debug(() => 'interpolate applying sync');
        //
        //    scan all the objects in the sync
        //
        // 1. if the object exists locally, sync to the server object
        // 2. if the object is new, just create it
        //
        this.needFirstSync = false;
        let world: GameWorld = this.gameEngine.world;
        for (let ids of Object.keys(sync.syncObjects)) {

            // TODO: we are currently taking only the first event out of
            // the events that may have arrived for this object
            let ev = sync.syncObjects[ids][0];
            let curObj = world.objects[ev.objectInstance.id];

            if (curObj) {

                // case 1: this object already exists locally
                this.gameEngine.trace.trace(() => `object before syncTo: ${curObj.toString()}`);
                curObj.saveState();
                curObj.syncTo(ev.objectInstance);
                this.gameEngine.trace.trace(() => `object after syncTo: ${curObj.toString()} synced to step[${ev.stepCount}]`);

            } else {

                // case 2: object does not exist.  create it now
                this.addNewObject(ev.objectInstance.id, ev.objectInstance);
            }
        }

        //
        // bend back to original state
        //
        for (let objId of Object.keys(world.objects)) {

            let obj = world.objects[objId];
            let isLocal = (obj.playerId == this.gameEngine.playerId); // eslint-disable-line eqeqeq
            let bending = isLocal ? this.interpolateOptions.localObjBending : this.interpolateOptions.remoteObjBending;
            obj.bendToCurrentState(bending, this.gameEngine.worldSettings, isLocal, this.interpolateOptions.bendingIncrements);
            if (typeof obj.refreshRenderObject === 'function')
                obj.refreshRenderObject();
            this.gameEngine.trace.trace(() => `object[${objId}] ${obj.bendingToString()}`);
        }

        // destroy objects
        // TODO: use world.forEachObject((id, ob) => {});
        // TODO: identical code is in InterpolateStrategy

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

export { InterpolateStrategy, InterpolateSyncStrategyOptions }