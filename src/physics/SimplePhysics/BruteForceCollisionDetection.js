import TwoVector from '../../serialize/TwoVector';
let differenceVector = new TwoVector();

// The collision detection of SimplePhysicsEngine is a brute-force approach
export default class BruteForceCollisionDetection {
    
    // Might be a good idea to allow limitCollisionTo to allow pairs as well.

    constructor(options) {
        this.options = Object.assign({
            softCollision: {
                limitCollisionTo: [],
                ignore: [],
                ignorePairs: []
            }, 
            hardCollision: {
                limitCollisionTo: [],
                ignore: [],
                ignorePairs: []            
            }
        }, options);

        // Ensure arrays were submitted
        if(!Array.isArray(this.options.softCollision.limitCollisionTo)) { console.log('Invalid limitCollisionTo value - must be array'); return }
        if(!Array.isArray(this.options.softCollision.ignore)) { console.log('Invalid ignore value - must be array'); return }
        if(!Array.isArray(this.options.softCollision.ignorePairs)) { console.log('Invalid ignorePairs value - must be array'); return }
        if(!Array.isArray(this.options.hardCollision.limitCollisionTo)) { console.log('Invalid limitCollisionTo value - must be array'); return }
        if(!Array.isArray(this.options.hardCollision.ignore)) { console.log('Invalid ignore value - must be array'); return }
        if(!Array.isArray(this.options.hardCollision.ignorePairs)) { console.log('Invalid ignorePairs value - must be array'); return }

        // Turn ignore pairs into map
        this.options.softCollision.ignorePairs = new Map(this.options.softCollision.ignorePairs)
        this.options.hardCollision.ignorePairs = new Map(this.options.hardCollision.ignorePairs)
        
        this.collisionPairs = {};
    }

    init(options) {
        this.gameEngine = options.gameEngine;
    }

    findCollision(o1, o2) {
        // static objects don't collide
        if (o1.isStatic && o2.isStatic)
            return false;

        // allow a collision checker function
        if (typeof o1.collidesWith === 'function') {
            if (!o1.collidesWith(o2))
                return false;
        }

        // radius-based collision
        if (this.options.collisionDistance) {
            differenceVector.copy(o1.position).subtract(o2.position);
            return differenceVector.length() < this.options.collisionDistance;
        }

        // check for no-collision first
        let o1Box = getBox(o1);
        let o2Box = getBox(o2);
        if (o1Box.xMin > o2Box.xMax ||
            o1Box.yMin > o2Box.yMax ||
            o2Box.xMin > o1Box.xMax ||
            o2Box.yMin > o1Box.yMax)
            return false;

        // Conditions for hardCollision
        if((this.options.hardCollision.limitCollisionTo.includes(o1.constructor.name) || this.options.hardCollision.limitCollisionTo.includes(o2.constructor.name)) && 
        (!this.options.hardCollision.ignore.includes(o1.constructor.name) && !this.options.hardCollision.ignore.includes(o2.constructor.name))) {

            // Ignore Pairs
            if(Array.isArray(this.options.hardCollision.ignorePairs.get(o1.constructor.name))) {
                this.options.hardCollision.ignorePairs.get(o1.constructor.name).forEach((item)=>{
                    if(item == o1.constructor.name) return 2
                })
            } else {
                if(this.options.hardCollision.ignorePairs.get(o1.constructor.name) == o1.constructor.name) return 2
            }

            // need to auto-resolve
            let shiftY1 = o2Box.yMax - o1Box.yMin;
            let shiftY2 = o1Box.yMax - o2Box.yMin;
            let shiftX1 = o2Box.xMax - o1Box.xMin;
            let shiftX2 = o1Box.xMax - o2Box.xMin;
            let smallestYShift = Math.min(Math.abs(shiftY1), Math.abs(shiftY2));
            let smallestXShift = Math.min(Math.abs(shiftX1), Math.abs(shiftX2));

            // choose to apply the smallest shift which solves the collision
            if (smallestYShift < smallestXShift) {
                if (o1Box.yMin > o2Box.yMin && o1Box.yMin < o2Box.yMax) {
                    if (o2.isStatic) o1.position.y += shiftY1;
                    else if (o1.isStatic) o2.position.y -= shiftY1;
                    else {
                        o1.position.y += shiftY1 / 2;
                        o2.position.y -= shiftY1 / 2;
                    }
                } else if (o1Box.yMax > o2Box.yMin && o1Box.yMax < o2Box.yMax) {
                    if (o2.isStatic) o1.position.y -= shiftY2;
                    else if (o1.isStatic) o2.position.y += shiftY2;
                    else {
                        o1.position.y -= shiftY2 / 2;
                        o2.position.y += shiftY2 / 2;
                    }
                }
                o1.velocity.y = 0;
                o2.velocity.y = 0;
            } else {
                if (o1Box.xMin > o2Box.xMin && o1Box.xMin < o2Box.xMax) {
                    if (o2.isStatic) o1.position.x += shiftX1;
                    else if (o1.isStatic) o2.position.x -= shiftX1;
                    else {
                        o1.position.x += shiftX1 / 2;
                        o2.position.x -= shiftX1 / 2;
                    }
                } else if (o1Box.xMax > o2Box.xMin && o1Box.xMax < o2Box.xMax) {
                    if (o2.isStatic) o1.position.x -= shiftX2;
                    else if (o1.isStatic) o2.position.x += shiftX2;
                    else {
                        o1.position.x -= shiftX2 / 2;
                        o2.position.x += shiftX2 / 2;
                    }
                }
                o1.velocity.x = 0;
                o2.velocity.x = 0;
            }
        }
    
        return true;
    }

    // check if pair (id1, id2) have collided
    checkPair(id1, id2) {
        let objects = this.gameEngine.world.objects;
        let o1 = objects[id1];
        let o2 = objects[id2];

        // make sure that objects actually exist. might have been destroyed
        if (!o1 || !o2) return;
        let pairId = [id1, id2].join(',');

        if (this.findCollision(o1, o2)) {
            if (!(pairId in this.collisionPairs)) {
                this.collisionPairs[pairId] = true;
                this.gameEngine.emit('collisionStart', { o1, o2 });
                
                // Limit Collision To
                if(this.options.softCollision.limitCollisionTo.length && !this.options.softCollision.limitCollisionTo.includes(o1.constructor.name) && !this.options.softCollision.limitCollisionTo.includes(o2.constructor.name)) return 2

                // Ignore
                if(this.options.softCollision.ignore.includes(o1.constructor.name) || this.options.softCollision.ignore.includes(o2.constructor.name)) return 2

                // Ignore Pairs
                if(Array.isArray(this.options.softCollision.ignorePairs.get(o1.constructor.name))) {
                    this.options.softCollision.ignorePairs.get(o1.constructor.name).forEach((item)=>{
                        if(item == o1.constructor.name) return 3
                    })
                } else {
                    if(this.options.softCollision.ignorePairs.get(o1.constructor.name) == o1.constructor.name) return 2
                }

                // Trigger collision function
                if(o1.collidedWith) o1.collidedWith(o2)
                if(o2.collidedWith) o2.collidedWith(o1)

                console.log(o1.constructor.name + ' collided with ' + o2.constructor.name)

                // Release collision on object
                setTimeout(() => {
                    this.gameEngine.emit('collisionStop', { o1, o2 });
                    delete this.collisionPairs[pairId];
                }, 200);
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

        // delete non existant object pairs
        for (let pairId in this.collisionPairs)
            if (this.collisionPairs.hasOwnProperty(pairId))
                if (keys.indexOf(pairId.split(',')[0]) === -1 || keys.indexOf(pairId.split(',')[1]) === -1)
                    delete this.collisionPairs[pairId];

        // check all pairs
        for (let k1 of keys)
            for (let k2 of keys)
                if (k2 > k1) this.checkPair(k1, k2);
    }
}

// get bounding box of object o
function getBox(o) {
    return {
        xMin: o.position.x,
        xMax: o.position.x + o.width,
        yMin: o.position.y,
        yMax: o.position.y + o.height
    };
}