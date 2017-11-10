import TwoVector from '../../serialize/TwoVector';
let differenceVector = new TwoVector();

// The collision detection of SimplePhysicsEngine is a brute-force approach
export default class CollisionDetection {

    constructor(options) {
        this.options = Object.assign({ COLLISION_DISTANCE: 28 }, options);
        this.collisionPairs = {};
        this.visitHash = Math.floor(Math.random()*10000);
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
                this.collisionPairs[pairId] = {collision: true, visit:this.visitHash};
                this.gameEngine.emit('collisionStart', { o1, o2 });
            }else{
                this.collisionPairs[pairId].visit = this.visitHash;
                this.gameEngine.emit('collisionStay', { o1, o2 });
            }
        } else if (pairId in this.collisionPairs) {
            this.gameEngine.emit('collisionStop', { o1, o2 });
            delete this.collisionPairs[pairId];
        }
    }

    // detect by checking all pairs
    detect() {
        this.visitHash = Math.floor(Math.random()*10000);

        let objects = this.gameEngine.world.objects;
        for (let k1 of Object.keys(objects))
            for (let k2 of Object.keys(objects))
                if (k2 > k1) this.checkPair(k1, k2);

        //Delete non visited pairs
        for (let pair in this.collisionPairs) {
            if(this.collisionPairs[pair].visit !== this.visitHash)
                delete this.collisionPairs[pair];
        }
    }

}
