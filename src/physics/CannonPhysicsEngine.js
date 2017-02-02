/* global CANNON */
'use strict';
const PhysicsEngine = require('./PhysicsEngine');

/**
 * CannonPhysicsEngine is a three-dimensional lightweight physics engine
 */
class CannonPhysicsEngine extends PhysicsEngine {

    init(options) {
        super(options);

        this.options.dt = this.options.dt || (1 / 60);
        let world = this.world = new CANNON.World();
        world.quatNormalizeSkip = 0;
        world.quatNormalizeFast = false;
        world.gravity.set(0, -10, 0);
        world.broadphase = new CANNON.NaiveBroadphase();
    }

    // entry point for a single step of the Simple Physics
    step(objectFilter) {
        this.world.step(this.options.dt);
    }

    addSphere(r) {
        let s = new CANNON.Sphere(r);
        this.world.addBody(s);
        return s;
    }

    addBox(x, y, z) {
        let b = new CANNON.Box(x, y, z);
        this.world.addBody(b);
        return b;
    }

    addCylinder(radiusTop, radiusBottom, height, numSegments) {
        let c = new CANNON.Cylinder(radiusTop, radiusBottom, height, numSegments);
        this.world.addBody(c);
        return c;
    }

    removeBody(obj) {
        this.world.removeBody(obj);
    }
}

module.exports = CannonPhysicsEngine;
