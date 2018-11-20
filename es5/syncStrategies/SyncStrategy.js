'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SyncStrategy = function () {
    function SyncStrategy(clientEngine, inputOptions) {
        _classCallCheck(this, SyncStrategy);

        this.clientEngine = clientEngine;
        this.gameEngine = clientEngine.gameEngine;
        this.options = Object.assign({}, inputOptions);
        this.gameEngine.on('client__postStep', this.syncStep.bind(this));
        this.gameEngine.on('client__syncReceived', this.collectSync.bind(this));
        this.requiredSyncs = [];
        this.SYNC_APPLIED = 'SYNC_APPLIED';
        this.STEP_DRIFT_THRESHOLDS = {
            onServerSync: { MAX_LEAD: 1, MAX_LAG: 3 }, // max step lead/lag allowed after every server sync
            onEveryStep: { MAX_LEAD: 7, MAX_LAG: 8 }, // max step lead/lag allowed at every step
            clientReset: 20 // if we are behind this many steps, just reset the step counter
        };
    }

    // collect a sync and its events
    // maintain a "lastSync" member which describes the last sync we received from
    // the server.  the lastSync object contains:
    //  - syncObjects: all events in the sync indexed by the id of the object involved
    //  - syncSteps: all events in the sync indexed by the step on which they occurred
    //  - objCount
    //  - eventCount
    //  - stepCount


    _createClass(SyncStrategy, [{
        key: 'collectSync',
        value: function collectSync(e) {

            // on first connect we need to wait for a full world update
            if (this.needFirstSync) {
                if (!e.fullUpdate) return;
            } else {

                // TODO: there is a problem below in the case where the client is 10 steps behind the server,
                // and the syncs that arrive are always in the future and never get processed.  To address this
                // we may need to store more than one sync.

                // ignore syncs which are older than the latest
                if (this.lastSync && this.lastSync.stepCount && this.lastSync.stepCount > e.stepCount) return;
            }

            // before we overwrite the last sync, check if it was a required sync
            // syncs that create or delete objects are saved because they must be applied.
            if (this.lastSync && this.lastSync.required) {
                this.requiredSyncs.push(this.lastSync);
            }

            // build new sync object
            var lastSync = this.lastSync = {
                stepCount: e.stepCount,
                fullUpdate: e.fullUpdate,
                syncObjects: {},
                syncSteps: {}
            };

            e.syncEvents.forEach(function (sEvent) {

                // keep a reference of events by object id
                if (sEvent.objectInstance) {
                    var objectId = sEvent.objectInstance.id;
                    if (!lastSync.syncObjects[objectId]) lastSync.syncObjects[objectId] = [];
                    lastSync.syncObjects[objectId].push(sEvent);
                }

                // keep a reference of events by step
                var stepCount = sEvent.stepCount;
                var eventName = sEvent.eventName;
                if (eventName === 'objectDestroy' || eventName === 'objectCreate') lastSync.required = true;

                if (!lastSync.syncSteps[stepCount]) lastSync.syncSteps[stepCount] = {};
                if (!lastSync.syncSteps[stepCount][eventName]) lastSync.syncSteps[stepCount][eventName] = [];
                lastSync.syncSteps[stepCount][eventName].push(sEvent);
            });

            var eventCount = e.syncEvents.length;
            var objCount = Object.keys(lastSync.syncObjects).length;
            var stepCount = Object.keys(lastSync.syncSteps).length;
            this.gameEngine.trace.debug(function () {
                return 'sync contains ' + objCount + ' objects ' + eventCount + ' events ' + stepCount + ' steps';
            });
        }

        // add an object to our world

    }, {
        key: 'addNewObject',
        value: function addNewObject(objId, newObj, options) {

            var curObj = new newObj.constructor(this.gameEngine, {
                id: objId
            });

            // enforce object implementations of syncTo
            if (!curObj.__proto__.hasOwnProperty('syncTo')) {
                throw 'GameObject of type ' + curObj.class + ' does not implement the syncTo() method, which must copy the netscheme';
            }

            curObj.syncTo(newObj);
            this.gameEngine.addObjectToWorld(curObj);
            if (this.clientEngine.options.verbose) console.log('adding new object ' + curObj);

            return curObj;
        }

        // sync to step, by applying bending, and applying the latest sync

    }, {
        key: 'syncStep',
        value: function syncStep(stepDesc) {
            var _this = this;

            // apply incremental bending
            this.gameEngine.world.forEachObject(function (id, o) {
                if (typeof o.applyIncrementalBending === 'function') {
                    o.applyIncrementalBending(stepDesc);
                    o.refreshToPhysics();
                }
            });

            // apply all pending required syncs

            var _loop = function _loop() {

                var requiredStep = _this.requiredSyncs[0].stepCount;

                // if we haven't reached the corresponding step, it's too soon to apply syncs
                if (requiredStep > _this.gameEngine.world.stepCount) return {
                        v: void 0
                    };

                _this.gameEngine.trace.trace(function () {
                    return 'applying a required sync ' + requiredStep;
                });
                _this.applySync(_this.requiredSyncs.shift(), true);
            };

            while (this.requiredSyncs.length) {
                var _ret = _loop();

                if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
            }

            // apply the sync and delete it on success
            if (this.lastSync) {
                var rc = this.applySync(this.lastSync, false);
                if (rc === this.SYNC_APPLIED) this.lastSync = null;
            }
        }
    }]);

    return SyncStrategy;
}();

exports.default = SyncStrategy;