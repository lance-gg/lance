import TwoVector from '../../serialize/TwoVector';
let differenceVector = new TwoVector();

// The collision detection of SimplePhysicsEngine is a brute-force approach
export default class CollisionDetection {

    constructor(options) {
        this.options = Object.assign({ COLLISION_DISTANCE: 28 }, options);
        this.collisionPairs = {};
    }

    init(options) {
        this.gameEngine = options.gameEngine;
    }

    // check if pair (id1, id2) have collided
    checkPair(id1, id2) {
        let objects = this.gameEngine.world.objects;
        let o1 = objects[id1];
        let o2 = objects[id2];

        // make sure that objects actually exist. might have been destroyed
        if (!o1 || !o2) return;
        let pairId = [id1, id2].join(',');
        differenceVector.copy(o1.position).subtract(o2.position);

        if (differenceVector.length() < this.options.COLLISION_DISTANCE) {
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
        let keys = Object.keys(objects);

        //Delete non existed object's pairs
        for (let pairId in this.collisionPairs)
            if (this.collisionPairs.hasOwnProperty(pairId))
                if (keys.indexOf(pairId.split(',')[0]) === -1 || keys.indexOf(pairId.split(',')[1]) === -1)
                    delete this.collisionPairs[pairId];

        for (let k1 of keys)
            for (let k2 of keys)
                if (k2 > k1) this.checkPair(k1, k2);
    }

}