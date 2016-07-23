"use strict";

class SyncStrategy {

    constructor(clientEngine, inputOptions){
        this.clientEngine = clientEngine;
        this.options = Object.assign({}, inputOptions);
    }
}

module.exports = SyncStrategy;
