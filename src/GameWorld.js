'use strict';

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

    /**
     * Return the primary game object for a specific player
     *
     * @param {String} playerId the player ID
     * @return {Object} game object for this player
     */
    getPlayerObject(playerId) {
        for (let objId of Object.keys(this.objects)) {
            let o = this.objects[objId];
            if (o.playerId === playerId)
                return o;
        }
    }

    /**
     * Return an array of all the game objects owned by a specific player
     *
     * @param {String} playerId the player ID
     * @return {Array} game objects owned by this player
     */
    getOwnedObject(playerId) {
        let owned = [];
        for (let objId of Object.keys(this.objects)) {
            let o = this.objects[objId];
            if (o.ownerId === playerId)
                owned.push(o);
        }
        return owned;
    }

}

module.exports = GameWorld;
