var Ship = require("../examples/spaaace/js/Ship");


class GameWorld{
    constructor(){
        this.stepCount = 0;
        this.objects = {};
    }

    static deserialize(gameEngine, worldData){

        var world = new GameWorld();

        var worldDataDV = new DataView(worldData);
        world.stepCount = worldDataDV.getInt32(0);

        var byteOffset = Int32Array.BYTES_PER_ELEMENT;

        //go ever the buffer and deserialize items
        while (byteOffset < worldData.byteLength) {
            var objectClassId = worldDataDV.getUint8(byteOffset);
            var objectClass = gameEngine.registeredClasses[objectClassId];

            var objectByteSize = objectClass.getNetSchemeBufferSize();

            var objectData = objectClass.deserialize(worldData.slice(byteOffset, byteOffset + objectByteSize));
            byteOffset += objectByteSize;

            //todo generalize ship
            var localObj = world.objects[objectData.id]= new Ship(objectData.id, objectData.x, objectData.y)
            // localObj.velocity.set(objectData.velX, objectData.velY);
            localObj.angle = objectData.angle;
        }

        return world;
    }

}

module.exports = GameWorld;