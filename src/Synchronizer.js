"use strict";

const InterpolateStrategy = require('./syncStrategies/InterpolateStrategy');
const ClientPredictionStrategy = require('./syncStrategies/ClientPredictionStrategy');
const FrameSyncStrategy = require('./syncStrategies/FrameSyncStrategy');
const ExtrapolateStrategy = require('./syncStrategies/ExtrapolateStrategy');

class Synchronizer {

    // create a synchronizer instance
    //
    // options have sub-options for each synchronization strategy
    // options = {
    //     interpolate: {},
    //     clientPrediction: {},
    //     frameSync: {},
    //     extrapolate: {}
    // };
    constructor(clientEngine, options) {
        this.clientEngine = clientEngine;
        this.options = options || {};
    }

    // TODO:
    // The code below can surely be folded.  Maybe with a Proxy object.
    // or by adding the methods in a loop over each strategy name.

    set interpolateObjectSelector(selector) {
        if (!this.interpolateStrategy) {
            this.interpolateStrategy = new InterpolateStrategy(this.clientEngine, this.options.interpolate);
        }
        this.interpolateStrategy.objectSelector = selector;
    }

    set clientPredictionSelector(selector) {
        if (!this.clientPredictionStrategy) {
            this.clientPredictionStrategy = new ClientPredictionStrategy(this.clientEngine, this.options.clientPrediction);
        }
        this.clientPredictionStrategy.objectSelector = selector;
    }

    set frameSyncSelector(selector) {
        if (!this.frameSyncStrategy) {
            this.frameSyncStrategy = new FrameSyncStrategy(this.clientEngine, this.options.frameSync);
        }
        this.frameSyncStrategy.objectSelector = selector;
    }

    set extrapolateObjectSelector(selector) {
        if (!this.extrapolateStrategy) {
            this.extrapolateStrategy = new ExtrapolateStrategy(this.clientEngine, this.options.extrapolate);
        }
        this.extrapolateStrategy.objectSelector = selector;
    }

}

module.exports = Synchronizer;
