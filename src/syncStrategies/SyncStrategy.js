"use strict";

// TODO: make this class non-trivial, or remove it
class SyncStrategy {

    constructor(clientEngine, inputOptions) {
        this.clientEngine = clientEngine;
        this.gameEngine = clientEngine.gameEngine;
        this.options = Object.assign({}, inputOptions);
    }

}

module.exports = SyncStrategy;
