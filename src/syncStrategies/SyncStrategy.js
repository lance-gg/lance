"use strict";

class SyncStrategy {

    constructor(clientEngine, inputOptions) {
        this.clientEngine = clientEngine;
        this.gameEngine = clientEngine.gameEngine;
        this.options = Object.assign({}, inputOptions);

        // the object selector will be overwritten (not overriden)
        // to select the objects that are synced by this strategy
        this.objectSelector = function() {
            return false;
        };
    }

    // iterate over all objects which use this strategy
    // and apply the callback
    forEachSyncObject(cb) {
        let world = this.gameEngine.world;
        for (let objId in world.objects) {
            if (world.objects.hasOwnProperty(objId)) {
                let obj = world.objects[objId];
                if (this.objectSelector(obj)) {
                    cb(obj);
                }
            }
        }
    }
}

module.exports = SyncStrategy;
