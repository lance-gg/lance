'use strict';

/**
 * This class represents an instance of the game world,
 * where all data pertaining to the current state of the
 * world is saved.
 */
class GameWorld {

    /**
     * Constructor of the World instance
     */
    constructor() {
        this.stepCount = 0;
        this.objects = {};
        this.playerCount = 0;
        this.idCount = 0;
    }

    /**
     * World object iterator.
     * Invoke callback(objId, obj) for each object
     *
     * @param {function} callback function receives id and object
     */
    forEachObject(callback) {
        for (let id of Object.keys(this.objects))
            callback(id, this.objects[id]);  // TODO: the key should be Number(id)
    }

    /**
     * Return the primary game object for a specific player
     *
     * @param {Number} playerId the player ID
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
     * @param {Number} playerId the player ID
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
