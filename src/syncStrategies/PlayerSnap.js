"use strict";

var SyncStrategy = require("./SyncStrategy");

/**
 * Snaps every object to its updated position from the server. Might cause rubber-banding on lagged connections
 */
class PlayerSnap extends SyncStrategy{

    constructor(clientEngine, inputOptions){
        super(clientEngine, inputOptions);
    }

    handleObject(worldSnapshot, objId){
        //update player character
        var world = this.clientEngine.gameEngine.world;
        var snapshotObj = worldSnapshot.objects[objId];
        snapshotObj.isPlayerControlled = this.clientEngine.playerId == snapshotObj.playerId;

        //we only care about player controlled objects
        if (snapshotObj.isPlayerControlled){

            //object doesn't exist yet - create it
            if (! (objId in world.objects)){
                world.objects[objId] = worldSnapshot.objects[objId].class.newFrom(snapshotObj);

            }
            else{
                world.objects[objId].copyFrom(worldSnapshot.objects[objId]);
            }

        }

    }

}

module.exports = PlayerSnap;