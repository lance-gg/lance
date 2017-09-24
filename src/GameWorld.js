/**
 * This class represents an instance of the game world,
 * where all data pertaining to the current state of the
 * world is saved.
 */
export default class GameWorld {

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
     * Gets a new, fresh and unused id that can be used for a new object
     * @return {Number} the new id
     */
    getNewId() {
        let possibleId = this.idCount;
        // find a free id
        while (possibleId in this.objects)
            possibleId++;

        this.idCount = possibleId;
        return possibleId;
    }

    // todo document
    queryObjects(query){
        let queriedObjects = [];

        // todo this is currently a very inefficient implementation for API testing purposes.
        // It should be implemented with dictionaries like in nano-ecs
        this.forEachObject( object => {
            let conditions = [];

            // id condition
            conditions.push( !('id' in query) || query.id && object.id === query.id );

            // components conditions
            if ('components' in query) {
                query.components.forEach(componentClass => {
                    conditions.push(object.hasComponent(componentClass));
                });
            }

            // all conditions are true, object is qualified for the query
            if (conditions.every( value => value )){
                queriedObjects.push(object);
            }
        });

        return queriedObjects;
    }

    // todo document
    addObject(object){
        this.objects[object.id] = object;
    }

    // todo document
    removeObject(id){
        delete this.objects[id];
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