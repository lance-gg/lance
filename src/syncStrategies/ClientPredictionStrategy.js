"use strict";

const SyncStrategy = require("./SyncStrategy");
const defaults = {};


class ClientPredictionStrategy extends SyncStrategy {

    constructor(clientEngine, inputOptions){

        const options = Object.assign({}, defaults, inputOptions);
        super(clientEngine, options);

        this.gameEngine = this.clientEngine.gameEngine;
        this.gameEngine.on('preStep', this.clientPredict.bind(this));
    }

    /**
     * Perform client-side prediction.
     * TODO: rather than test if this is player-controller
     *       we should handle all objects which implemented
     *       the ClientPredictStrategyObjectInterface, and this protocol
     *       should have an updateRenderObject() method
     */
    clientPredict() {
        var world = this.gameEngine.world;
        for (var objId in world.objects) {
            if (world.objects.hasOwnProperty(objId)) {
                let localObj = world.objects[objId];
                if (!localObj.isPlayerControlled) {
                    continue;
                }
                if (!localObj.renderObject) {
                    localObj.initRenderObject(this.gameEngine.renderer);
                }
                localObj.updateRenderObject();
            }
        }
    }
}

module.exports = ClientPredictionStrategy;
