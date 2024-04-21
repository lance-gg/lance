import { GameObject } from '../serialize/GameObject.js';
import { PhysicsEngine, PhysicsEngineOptions } from './PhysicsEngine.js';
import * as Cannon from 'cannon';

interface CannonPhysicsEngineOptions extends PhysicsEngineOptions {
    dt: number
}

/**
 * CannonPhysicsEngine is a three-dimensional lightweight physics engine
 */
class CannonPhysicsEngine extends PhysicsEngine {

    private cannonPhysicsEngineOptions: CannonPhysicsEngineOptions;

    constructor(options: CannonPhysicsEngineOptions) {
        super(options);

        this.cannonPhysicsEngineOptions = options;
        this.cannonPhysicsEngineOptions.dt = this.cannonPhysicsEngineOptions.dt || (1 / 60);
        let world = this.world = new Cannon.World();
        world.quatNormalizeSkip = 0;
        world.quatNormalizeFast = false;
        world.gravity.set(0, -10, 0);
        world.broadphase = new Cannon.NaiveBroadphase();
    }

    // entry point for a single step of the Simple Physics
    step(dt: number, objectFilter: (o: GameObject) => boolean): void {
        this.world.step(dt || this.cannonPhysicsEngineOptions.dt);
    }

    addSphere(radius: number, mass: number): Cannon.Body {
        let shape = new Cannon.Sphere(radius);
        let body = new Cannon.Body({ mass, shape });
        body.position.set(0, 0, 0);
        this.world.addBody(body);
        return body;
    }

    addBox(x: number, y: number, z: number, mass: number, friction: number): Cannon.Body {
        let shape = new Cannon.Box(new Cannon.Vec3(x, y, z));
        let options: Cannon.IBodyOptions = { mass, shape };
        if (friction !== undefined)
            options.material = new Cannon.Material('material');
        let body = new Cannon.Body(options);
        body.position.set(0, 0, 0);
        this.world.addBody(body);
        return body;
    }

    addCylinder(radiusTop: number, radiusBottom: number, height: number, numSegments: number, mass: number): Cannon.Body {
        let shape = new Cannon.Cylinder(radiusTop, radiusBottom, height, numSegments);
        let body = new Cannon.Body({ mass, shape });
        this.world.addBody(body);
        return body;
    }

    removeObject(obj: Cannon.Body): void {
        this.world.remove(obj);
    }
}

export { CannonPhysicsEngine, CannonPhysicsEngineOptions }
