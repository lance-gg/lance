'use strict';

const TwoVector = require('../../serialize/TwoVector');
const HSHG = require('./HSHG');

// The collision detection of SimplePhysicsEngine is a brute-force approach
class CollisionDetection {

    constructor(options) {
        this.options = Object.assign({ COLLISION_DISTANCE: 28 }, options);
    }

    init(options) {
        this.gameEngine = options.gameEngine;
        this.grid = new HSHG();
        this.previousCollisionPairs = {};

        this.gameEngine.on('objectAdded', obj => {
            // add the gameEngine obj the the spatial grid
            this.grid.addObject(obj);
        });

        this.gameEngine.on('objectDestroyed', obj => {
            // add the gameEngine obj the the spatial grid
            this.grid.removeObject(obj);
        });
    }

    detect() {
        this.grid.update();
        let stepCollidingPairs = this.grid.queryForCollisionPairs().reduce((accumulator, currentValue, i) => {
            let pairId = getArrayPairId(currentValue);
            accumulator[pairId] = { o1: currentValue[0], o2: currentValue[1] };
            return accumulator;
        }, {});

        for (let pairId of Object.keys(this.previousCollisionPairs)){
            let pairObj = this.previousCollisionPairs[pairId];

            // existed in previous pairs, but not during this step: this pair stopped colliding
            if (pairId in stepCollidingPairs === false) {
                this.gameEngine.emit('collisionStop', pairObj);
            }
        }

        for (let pairId of Object.keys(stepCollidingPairs)) {
            let pairObj = stepCollidingPairs[pairId];

            // didn't exist in previous pairs, but exists now: this is a new colliding pair
            if (pairId in this.previousCollisionPairs === false) {
                this.gameEngine.emit('collisionStart', pairObj);
            }
        }

        this.previousCollisionPairs = stepCollidingPairs;
    }

}

function getArrayPairId(arrayPair){
    return arrayPair[0].id + '-' + arrayPair[1].id;
}

module.exports = CollisionDetection;
