const ClientEngine = require('../../../src/ClientEngine');
var Ship = require("./Ship");

class SpaaaceClientEngine extends ClientEngine{
    constructor(socket, gameEngine){         
        super(socket, gameEngine);
    }
    
    step(){
        return;
        //TODO need velocity to calculate other players prediction

        var world = this.gameEngine.world;
        this.gameEngine.step();

        for (var objId in world.objects) {
            if (world.objects.hasOwnProperty(objId)) {
                let objectData = world.objects[objId];

                objectData.sprite.x = objectData.x;
                objectData.sprite.y = objectData.y;
                objectData.sprite.angle = objectData.angle;

            }
        }
    }

    onServerStep(worldData){

        var world = this.gameEngine.world;
        var worldDataDV = new DataView(worldData);
        var stepCount =  worldDataDV.getInt32(0);

        var touchedIds ={}; //a temp object to figure out if some objects need to be removed

        //if packet is out of date, ignore
        if (stepCount > world.stepCount) {
            world.stepCount = stepCount;


            var byteOffset = Int32Array.BYTES_PER_ELEMENT;


            //go ever the buffer and deserialize items
            while (byteOffset < worldData.byteLength) {
                var objectClassId = worldDataDV.getUint8(byteOffset);

                var objectByteSize = Ship.getNetSchemeBufferSize();

                var objectData = Ship.deserialize(worldData.slice(byteOffset, byteOffset + objectByteSize));
                byteOffset += objectByteSize;

                var localObj;
                var sprite;

                if (world.objects[objectData.id]){
                    localObj = world.objects[objectData.id];
                    sprite = localObj.sprite;

                    localObj.x = objectData.x;
                    localObj.y = objectData.y;
                    localObj.angle = objectData.angle;
                }
                else{
                    localObj = this.gameEngine.makeShip(objectData.id, objectData.x, objectData.y);
                    sprite = localObj.sprite = window.game.add.sprite(localObj.x, localObj.y, 'ship');

                    //if own player's ship - color it
                    if (this.playerId == objectData.id){
                        sprite.tint = 0XFF00FF;
                    }

                    sprite.anchor.setTo(0.5, 0.5);
                    sprite.width = 50;
                    sprite.height = 45;
                }

                touchedIds[objectData.id] = true; //mark as updated

                sprite.x = objectData.x;
                sprite.y = objectData.y;
                sprite.angle = objectData.angle;

            }


            //delete objects that weren't updated
            var objectsToDelete = [];
            for (var objId in world.objects) {
                if (world.objects.hasOwnProperty(objId)) {
                    if (!touchedIds[objId]){
                        objectsToDelete.push(objId);
                    }
                }
            }
            for (var x=0; x<objectsToDelete.length; x++){
                world.objects[objectsToDelete[x]].sprite.destroy();
                delete world.objects[objectsToDelete[x]];
            }

        }
    };
}


module.exports = SpaaaceClientEngine;