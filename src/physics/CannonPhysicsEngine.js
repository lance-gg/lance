'use strict';
const PhysicsEngine = require('./PhysicsEngine');
const CANNON = require('cannon');

/**
 * CannonPhysicsEngine is a three-dimensional lightweight physics engine
 */
class CannonPhysicsEngine extends PhysicsEngine {

    init(options) {
        super.init(options);

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

    addSphere(radius, mass) {
        let shape = new CANNON.Sphere(radius);
        let body = new CANNON.Body({ mass, shape });
        body.position.set(0, 0, 0);
        this.world.addBody(body);
        return body;
    }

    addBox(x, y, z, mass) {
        let shape = new CANNON.Box(x, y, z);
        let body = new CANNON.Body({ mass, shape });
        body.position.set(0, 0, 0);
        this.world.addBody(body);
        return body;
    }

    addCylinder(radiusTop, radiusBottom, height, numSegments, mass) {
        let shape = new CANNON.Cylinder(radiusTop, radiusBottom, height, numSegments);
        let body = new CANNON.Body({ mass, shape });
        this.world.addBody(body);
        return body;
    }

    removeBody(obj) {
        this.world.removeBody(obj);
    }
}

module.exports = CannonPhysicsEngine;
