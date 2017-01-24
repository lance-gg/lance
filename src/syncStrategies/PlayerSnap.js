"use strict";

var SyncStrategy = require("./SyncStrategy");

/**
 * Snaps every object to its updated position from the server. Might cause rubber-banding on lagged connections
 */
class PlayerSnap extends SyncStrategy {

    constructor(clientEngine, inputOptions) {
        super(clientEngine, inputOptions);

        this.clientEngine.gameEngine.on('client__syncReceived', this.handleSnapshot.bind(this));
    }

    handleSnapshot(e) {

        // update player character
        var world = this.clientEngine.gameEngine.world;

        for (var objId in e.snapshot.objects) {
            var snapshotObj = e.snapshot.objects[objId];

            // TODO: the logic below can be simplified, with the copyFrom()
            //       being called in both if-section and else-section
            if (this.clientEngine.isOwnedByPlayer(snapshotObj)) {

                // object doesn't exist yet - create it
                if (! (objId in world.objects)) {
                    world.objects[objId] = snapshotObj.class.newFrom(snapshotObj);
                } else {
                    world.objects[objId].copyFrom(worldSnapshot.objects[objId]);
                }

            } else {
                let localObj = this.gameEngine.world.objects[objId];
                // copy the most recent object data
                if (localObj && localObj.hasOwnProperty('copyFrom')) {
                    localObj.copyFrom(e.snapshot.objects[objId]);
                }
            }
        }

    }

}

module.exports = PlayerSnap;
