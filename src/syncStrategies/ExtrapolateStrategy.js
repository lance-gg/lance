"use strict";

var SyncStrategy = require("./SyncStrategy");

class ExtrapolateStrategy extends SyncStrategy {

    constructor(clientEngine, inputOptions) {

        super(clientEngine, inputOptions);

        this.clientEngine.gameEngine.on('preStep', this.extrapolate.bind(this));
    }

    // Perform client-side extrapolation.
    extrapolate() {}
}

module.exports = ExtrapolateStrategy;
