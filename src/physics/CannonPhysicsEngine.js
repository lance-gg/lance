import PhysicsEngine from './PhysicsEngine';
const CANNON = require('cannon');

/**
 * CannonPhysicsEngine is a three-dimensional lightweight physics engine
 */
class CannonPhysicsEngine extends PhysicsEngine {

    constructor(options) {
        super(options);

        this.options.dt = this.options.dt || (1 / 60);
        let world = this.world = new CANNON.World();
        world.quatNormalizeSkip = 0;
        world.quatNormalizeFast = false;
        world.gravity.set(0, -10, 0);
        world.broadphase = new CANNON.NaiveBroadphase();
        this.CANNON = CANNON;
    }

    // entry point for a single step of the Simple Physics
    step(dt, objectFilter) {
        this.world.step(dt || this.options.dt);
    }

    addSphere(radius, mass) {
        let shape = new CANNON.Sphere(radius);
        let body = new CANNON.Body({ mass, shape });
        body.position.set(0, 0, 0);
        this.world.addBody(body);
        return body;
    }

    addBox(x, y, z, mass, friction) {
        let shape = new CANNON.Box(new CANNON.Vec3(x, y, z));
        let options = { mass, shape };
        if (friction !== undefined)
            options.material = new CANNON.Material({ friction });

        let body = new CANNON.Body(options);
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

    removeObject(obj) {
        this.world.removeBody(obj);
    }
}

export default CannonPhysicsEngine;
