"use strict";

const InterpolateStrategy = require('./syncStrategies/InterpolateStrategy');
const ClientPredictionStrategy = require('./syncStrategies/ClientPredictionStrategy');
const FrameSyncStrategy = require('./syncStrategies/FrameSyncStrategy');
const ExtrapolateStrategy = require('./syncStrategies/ExtrapolateStrategy');

class Synchronizer {

    constructor(clientEngine) {
        this.clientEngine = clientEngine;
    }

    // TODO:
    // The code below can surely be folded.  Maybe with a Proxy object.
    // or by adding the methods in a loop over each strategy name.

    set interpolateObjectSelector(selector) {
        if (!this.interpolateStrategy) {
            this.interpolateStrategy = new InterpolateStrategy(this.clientEngine);
        }
        this.interpolateStrategy.objectSelector = selector;
    }

    set clientPredictionSelector(selector) {
        if (!this.clientPredictionStrategy) {
            this.clientPredictionStrategy = new ClientPredictionStrategy(this.clientEngine);
        }
        this.clientPredictionStrategy.objectSelector = selector;
    }

    set frameSyncSelector(selector) {
        if (!this.frameSyncStrategy) {
            this.frameSyncStrategy = new FrameSyncStrategy(this.clientEngine);
        }
        this.frameSyncStrategy.objectSelector = selector;
    }

    set extrapolateObjectSelector(selector) {
        if (!this.extrapolateStrategy) {
            this.extrapolateStrategy = new ExtrapolateStrategy(this.clientEngine);
        }
        this.extrapolateStrategy.objectSelector = selector;
    }

}

module.exports = Synchronizer;
