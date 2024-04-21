import { GameObject } from '../serialize/GameObject.js';
import { PhysicsEngine, PhysicsEngineOptions } from './PhysicsEngine.js';
import P2, { BodyOptions, CircleOptions } from 'p2';

interface P2PhysicsEngineOptions extends PhysicsEngineOptions {
    dt?: number
}

/**
 * P2PhysicsEngine is a three-dimensional lightweight physics engine
 */
class P2PhysicsEngine extends PhysicsEngine {
    private p2PhysicsEngineOptions: P2PhysicsEngineOptions;

    constructor(options: P2PhysicsEngineOptions) {
        super(options);
        this.p2PhysicsEngineOptions = options;
        this.p2PhysicsEngineOptions.dt = this.p2PhysicsEngineOptions.dt || (1 / 60);
        this.world = new P2.World({ gravity: [0, 0] });
    }

    // entry point for a single step of the P2 Physics
    step(dt: number, objectFilter: (o: GameObject) => boolean): void {
        this.world.step(dt || this.p2PhysicsEngineOptions.dt);
    }

    // add a circle
    addCircle(circleOptions: CircleOptions, bodyOptions: BodyOptions): P2.Body {

        // create a body, add shape, add to world
        let body = new P2.Body(bodyOptions);
        body.addShape(new P2.Circle(circleOptions));
        this.world.addBody(body);

        return body;
    }

    addBox(width: number, height: number, mass: number) {

        // create a body, add shape, add to world
        let body = new P2.Body({ mass, position: [0, 0] });
        body.addShape(new P2.Box({ width, height }));
        this.world.addBody(body);

        return body;
    }

    removeObject(obj: P2.Body) {
        this.world.removeBody(obj);
    }
}

export { P2PhysicsEngine, P2PhysicsEngineOptions }
