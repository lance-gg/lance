"use strict";

// TODO remove this file.
const SyncStrategy = require("./SyncStrategy");
const defaults = {};

class ClientPredictionStrategy extends SyncStrategy {

    constructor(clientEngine, inputOptions) {

        const options = Object.assign({}, defaults, inputOptions);
        super(clientEngine, options);

        this.gameEngine.on('preStep', this.clientPredict.bind(this));
    }

    // Perform client-side prediction
    clientPredict() {
        let that = this;
        this.forEachSyncObject(function(obj) {
            if (!obj.renderObject) {
                obj.initRenderObject(that.gameEngine.renderer);
            }
            obj.updateRenderObject();
        });
    }
}

module.exports = ClientPredictionStrategy;
