import { ClientEngine } from '../ClientEngine.js';
import { InputDesc } from '../GameEngine.js';
import { GameWorld } from '../GameWorld.js';
import NetworkTransmitter from '../network/NetworkTransmitter.js';
import { Sync, SyncStrategy, SyncStrategyOptions } from './SyncStrategy.js';

const defaults = {
    syncsBufferLength: 5,
    maxReEnactSteps: 60,   // maximum number of steps to re-enact
    RTTEstimate: 2,        // estimate the RTT as two steps (for updateRate=6, that's 200ms)
    extrapolate: 2,        // player performs method "X" which means extrapolate to match server time. that 100 + (0..100)
    localObjBending: 0.1,  // amount of bending towards position of sync object
    remoteObjBending: 0.6, // amount of bending towards position of sync object
    bendingIncrements: 10   // the bending should be applied increments (how many steps for entire bend)
};

interface ExtrapolateSyncStrategyOptions extends SyncStrategyOptions {
    localObjBending: number;
    remoteObjBending: number;
    bendingIncrements: number;
    maxReEnactSteps?: number;
}

class ExtrapolateStrategy extends SyncStrategy {

    static STEP_DRIFT_THRESHOLDS = {
        onServerSync: { MAX_LEAD: 2, MAX_LAG: 3 }, // max step lead/lag allowed after every server sync
        onEveryStep: { MAX_LEAD: 7, MAX_LAG: 4 }, // max step lead/lag allowed at every step
        clientReset: 40 // if we are behind this many steps, just reset the step counter
    };

    private extrapolateOptions: ExtrapolateSyncStrategyOptions;
    private recentInputs: { [key: number] : InputDesc[] };

    constructor(extrapolateOptions: ExtrapolateSyncStrategyOptions) {

        super(extrapolateOptions);
        this.extrapolateOptions = Object.assign({}, defaults, extrapolateOptions);

        this.lastSync = null;
        this.recentInputs = {};
    }

    initClient(clientEngine: ClientEngine) {
        super.initClient(clientEngine);
        this.gameEngine.on('client__processInput', this.clientInputSave.bind(this));
    }

    // keep a buffer of inputs so that we can replay them on extrapolation
    clientInputSave(inputEvent) {

        // if no inputs have been stored for this step, create an array
        if (!this.recentInputs[inputEvent.input.step]) {
            this.recentInputs[inputEvent.input.step] = [];
        }
        this.recentInputs[inputEvent.input.step].push(inputEvent.input);
    }

    // clean up the input buffer
    cleanRecentInputs(lastServerStep) {
        for (let input of Object.keys(this.recentInputs)) {
            if (this.recentInputs[input][0].step <= lastServerStep) {
                delete this.recentInputs[input];
            }
        }
    }

    // apply a new sync
    applySync(sync: Sync, required: boolean): string {

        // if sync is in the future, we are not ready to apply yet.
        if (!required && sync.stepCount > this.gameEngine.world.stepCount) {
            return '';
        }

        this.gameEngine.trace.debug(() => 'extrapolate applying sync');

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
        this.needFirstSync = false;
        let world = this.gameEngine.world;
        let serverStep = sync.stepCount;
        for (let ids of Object.keys(sync.syncObjects)) {

            // TODO: we are currently taking only the first event out of
            // the events that may have arrived for this object
            let ev = sync.syncObjects[ids][0];
            let curObj = world.objects[ev.objectInstance.id];

            let localShadowObj = this.gameEngine.findLocalShadow(ev.objectInstance);
            if (localShadowObj) {
                // case 1: this object has a local shadow object on the client
                this.gameEngine.trace.debug(() => `object ${ev.objectInstance.id} replacing local shadow ${localShadowObj.id}`);

                if (!world.objects.hasOwnProperty(ev.objectInstance.id)) {
                    let newObj = this.addNewObject(ev.objectInstance.id, ev.objectInstance);
                    newObj.saveState(localShadowObj);
                }
                this.gameEngine.removeObjectFromWorld(localShadowObj.id);

            } else if (curObj) {

                // case 2: this object already exists locally
                this.gameEngine.trace.trace(() => `object before syncTo: ${curObj.toString()}`);
                curObj.saveState();
                curObj.syncTo(ev.objectInstance);
                this.gameEngine.trace.trace(() => `object after syncTo: ${curObj.toString()} synced to step[${ev.stepCount}]`);

            } else {

                // case 3: object does not exist.  create it now
                this.addNewObject(ev.objectInstance.id, ev.objectInstance);
            }
        }

        //
        // reenact the steps that we want to extrapolate forwards
        //
        this.gameEngine.trace.debug(() => `extrapolate re-enacting steps from [${serverStep}] to [${world.stepCount}]`);
        if (serverStep < world.stepCount - this.extrapolateOptions.maxReEnactSteps) {
            serverStep = world.stepCount - this.extrapolateOptions.maxReEnactSteps;
            this.gameEngine.trace.info(() => `too many steps to re-enact.  Starting from [${serverStep}] to [${world.stepCount}]`);
        }

        let clientStep = world.stepCount;
        for (world.stepCount = serverStep; world.stepCount < clientStep;) {

            if (this.recentInputs[world.stepCount]) {
                this.recentInputs[world.stepCount].forEach(inputDesc => {

                    // only movement inputs are re-enacted
                    if (!inputDesc.options || !inputDesc.options.movement) return;

                    this.gameEngine.trace.trace(() => `extrapolate re-enacting movement input[${inputDesc.messageIndex}]: ${inputDesc.input}`);
                    this.gameEngine.processInput(inputDesc, this.gameEngine.playerId, false);
                });
            }

            // run the game engine step in "reenact" mode
            this.gameEngine.step(true);
        }
        this.cleanRecentInputs(serverStep);

        //
        // bend back to original state
        //
        for (let objIdStr of Object.keys(world.objects)) {

            let objId = Number(objIdStr);

            // shadow objects are not bent
            if (objId >= this.gameEngine.options.clientIDSpace)
                continue;

            // TODO: using == instead of === because of string/number mismatch
            //       These values should always be strings (which contain a number)
            //       Reminder: the reason we use a string is that these
            //       values are sometimes used as object keys
            let obj = world.objects[objId];
            let isLocal = (obj.playerId == this.gameEngine.playerId); // eslint-disable-line eqeqeq
            let bending = isLocal ? this.extrapolateOptions.localObjBending : this.extrapolateOptions.remoteObjBending;
            obj.bendToCurrentState(bending, this.gameEngine.worldSettings, isLocal, this.extrapolateOptions.bendingIncrements);
            if (typeof obj.refreshRenderObject === 'function')
                obj.refreshRenderObject();
            this.gameEngine.trace.trace(() => `object[${objId}] ${obj.bendingToString()}`);
        }

        // trace object state after sync
        for (let objId of Object.keys(world.objects)) {
            this.gameEngine.trace.trace(() => `object after extrapolate replay: ${world.objects[objId].toString()}`);
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

export { ExtrapolateStrategy, ExtrapolateSyncStrategyOptions }