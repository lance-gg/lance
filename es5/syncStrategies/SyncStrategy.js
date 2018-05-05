'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SyncStrategy = function () {
    function SyncStrategy(clientEngine, inputOptions) {
        _classCallCheck(this, SyncStrategy);

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
    }]);

    return SyncStrategy;
}();

exports.default = SyncStrategy;