var SyncStrategy = require("./SyncStrategy");

/**
 * Snaps every object to its updated position from the server. Might cause rubber-banding on lagged connections
 */
class PlayerSnap extends SyncStrategy{

    constructor(gameEngine, inputOptions){
        super(gameEngine, inputOptions);
    }

    handleObject(worldSnapshot, objId){
        //update player character
        var localObj = this.gameEngine.world.objects[objId];

        if (localObj && localObj.isPlayerControlled === true) {

            //todo generalize property assignment
            localObj.x = worldSnapshot.objects[objId].x;
            localObj.y = worldSnapshot.objects[objId].y;
            localObj.velX = worldSnapshot.objects[objId].velX;
            localObj.velY = worldSnapshot.objects[objId].velY;
            localObj.velocity.set(worldSnapshot.objects[objId].velX, worldSnapshot.objects[objId].velY);
            localObj.angle = worldSnapshot.objects[objId].angle;
        }
    }

}

module.exports = PlayerSnap;