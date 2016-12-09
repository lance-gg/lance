'use strict';

// The collision detection of SimplePhysicsEngine is a brute-force approach
class CollisionDetection {

    constructor(options) {
        this.options = Object.assign({
            COLLISION_DISTANCE: 28
        }, options);
        this.collisionPairs = {};
    }

    init(options) {
        this.gameEngine = options.gameEngine;
    }

    distance(o1, o2) {
        let dx = o2.x - o1.x;
        let dy = o2.y - o1.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // check if pair (id1, id2) have collided
    checkPair(id1, id2) {
        if (id1 === id2) return;
        let o1 = this.gameEngine.world.objects[id1];
        let o2 = this.gameEngine.world.objects[id2];
        let pairId = [id1, id2].sort().join(',');

        if (this.distance(o1, o2) < this.options.COLLISION_DISTANCE) {
            if (!(pairId in this.collisionPairs)) {
                this.collisionPairs[pairId] = true;
                this.gameEngine.emit('collisionStart', { o1, o2 });
            }
        } else if (pairId in this.collisionPairs) {
            this.gameEngine.emit('collisionStop', { o1, o2 });
            delete this.collisionPairs[pairId];
        }
    }

    // detect by checking all pairs
    // TODO: loop below checks pair (i,j) as well as redundant (j,i)
    detect() {
        for (let o1 in this.gameEngine.world.objects)
            for (let o2 in this.gameEngine.world.objects)
                this.checkPair(o1, o2);
    }

}

module.exports = CollisionDetection;
