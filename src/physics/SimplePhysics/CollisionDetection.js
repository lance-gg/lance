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
        let objects = this.gameEngine.world.objects;
        let o1 = objects[id1];
        let o2 = objects[id2];

        // make sure that objects actually exist. might have been destroyed
        if (!o1 || !o2) return;
        let pairId = [id1, id2].join(',');

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
    detect() {
        let objects = this.gameEngine.world.objects;
        for (let k1 of Object.keys(objects))
            for (let k2 of Object.keys(objects))
                if (k2 > k1) this.checkPair(k1, k2);
    }

}

module.exports = CollisionDetection;
