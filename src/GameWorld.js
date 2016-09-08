"use strict";

class GameWorld {
    constructor() {
        this.stepCount = 0;
        this.objects = {};
        this.playerCount = 0;
        this.idCount = 0;
    }

    // TODO: remove this function
    static deserialize(gameEngine, serializer, worldData) {

        var world = new GameWorld();

        var worldDataDV = new DataView(worldData);
        world.stepCount = worldDataDV.getInt32(0);
        var byteOffset = Int32Array.BYTES_PER_ELEMENT;

        world.lastHandledInput = worldDataDV.getInt16(byteOffset);
        byteOffset += Int16Array.BYTES_PER_ELEMENT;

        // go ever the buffer and deserialize items
        while (byteOffset < worldData.byteLength) {
            let object = serializer.deserialize(worldData, byteOffset);
            var objectByteSize = serializer.getNetSchemeBufferSizeByClass(object.class);

            world.objects[object.id] = object;
            byteOffset += objectByteSize;
        }

        return world;
    }

}

module.exports = GameWorld;
