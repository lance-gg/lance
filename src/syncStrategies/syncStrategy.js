"use strict";

class SyncStrategy{

    constructor(gameEngine, inputOptions){
        this.gameEngine = gameEngine;

        this.options = Object.assign({}, inputOptions);
    }


    /**
     * Defines how to handle an object coming from a worldUpdate originating in the server
     * @param worldSnapshot
     * @param objId
     */
    handleObject(worldSnapshot, objId){}
}

module.exports = SyncStrategy;