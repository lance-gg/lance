import { PhysicsEngine, PhysicsEngineOptions } from './PhysicsEngine.js';
import { TwoVector } from '../serialize/TwoVector.js';
import { HSHGCollisionDetection, HSHGCollisionDetectionOptions } from './SimplePhysics/HSHGCollisionDetection.js';
import { BruteForceCollisionDetection, BruteForceCollisionDetectionOptions } from './SimplePhysics/BruteForceCollisionDetection.js';
import { CollisionDetection } from './SimplePhysics/CollisionDetection.js';
import { GameEngine } from '../GameEngine.js';
import { GameObject } from '../serialize/GameObject.js';
import DynamicObject from '../serialize/DynamicObject.js';

let dv = new TwoVector(0, 0);
let dx = new TwoVector(0, 0);

interface SimplePhysicsEngineOptions extends PhysicsEngineOptions {
    collisionsType?: "HSHG" | "bruteForce",
    collisions?: HSHGCollisionDetectionOptions | BruteForceCollisionDetectionOptions,
    gravity?: TwoVector,
}
/**
 * SimplePhysicsEngine is a pseudo-physics engine which works with
 * objects of class DynamicObject.
 * The Simple Physics Engine is a "fake" physics engine, which is more
 * appropriate for arcade games, and it is sometimes referred to as "arcade"
 * physics. For example if a character is standing at the edge of a platform,
 * with only one foot on the platform, it won't fall over. This is a desired
 * game behaviour in platformer games.
 */
class SimplePhysicsEngine extends PhysicsEngine {

    private collisionDetection: CollisionDetection;
    private gravity: TwoVector;

    /**
    * Creates an instance of the Simple Physics Engine.
    * @param {Object} options - physics options
    * @param {Object} options.collisions - collision options
    * @param {String} options.collisions.type - can be set to "HSHG" or "bruteForce".  Default is Brute-Force collision detection.
    * @param {Number} options.collisions.collisionDistance - for brute force, this can be set for a simple distance-based (radius) collision detection.
    * @param {Boolean} options.collisions.autoResolve - for brute force collision, colliding objects should be moved apart
    * @param {TwoVector} options.gravity - TwoVector instance which describes gravity, which will be added to the velocity of all objects at every step.  For example TwoVector(0, -0.01)
    */
    constructor(options: SimplePhysicsEngineOptions) {
        super(options);


        // todo does this mean both modules always get loaded?
        if (options.collisions && options.collisionsType === 'HSHG') {
            this.collisionDetection = new HSHGCollisionDetection(options.collisions);
        } else {
            this.collisionDetection = new BruteForceCollisionDetection(<BruteForceCollisionDetectionOptions> options.collisions);
        }

        /**
         * The actor's name.
         * @memberof SimplePhysicsEngine
         * @member {TwoVector} gravity affecting all objects
         */
        this.gravity = new TwoVector(0, 0);

        if (options.gravity)
            this.gravity.copy(options.gravity);

        let collisionOptions = Object.assign({ gameEngine: this.gameEngine }, options.collisions);
        this.collisionDetection.init(collisionOptions);
    }

    // a single object advances, based on:
    // isRotatingRight, isRotatingLeft, isAccelerating, current velocity
    // wrap-around the world if necessary
    objectStep(o: DynamicObject, dt: number) {

        // calculate factor
        if (dt === 0)
            return;

        if (dt)
            dt /= (1 / 60);
        else
            dt = 1;

        // TODO: worldsettings is a hack.  Find all places which use it in all games
        // and come up with a better solution.  for example an option sent to the physics Engine
        // with a "worldWrap:true" options
        // replace with a "worldBounds" parameter to the PhysicsEngine constructor

        let worldSettings = this.gameEngine.worldSettings;

        // TODO: remove this code in version 4: these attributes are deprecated
        if (o.isRotatingRight) { o.angle += o.rotationSpeed; }
        if (o.isRotatingLeft) { o.angle -= o.rotationSpeed; }

        // TODO: remove this code in version 4: these attributes are deprecated
        if (o.angle >= 360) { o.angle -= 360; }
        if (o.angle < 0) { o.angle += 360; }

        // TODO: remove this code in version 4: these attributes are deprecated
        if (o.isAccelerating) {
            let rad = o.angle * (Math.PI / 180);
            dv.set(Math.cos(rad), Math.sin(rad)).multiplyScalar(o.acceleration).multiplyScalar(dt);
            o.velocity.add(dv);
        }

        // apply gravity
        if (!o.isStatic) o.velocity.add(this.gravity);

        let velMagnitude = o.velocity.length();
        if ((o.maxSpeed !== null) && (velMagnitude > o.maxSpeed)) {
            o.velocity.multiplyScalar(o.maxSpeed / velMagnitude);
        }

        o.isAccelerating = false;
        o.isRotatingLeft = false;
        o.isRotatingRight = false;

        dx.copy(o.velocity).multiplyScalar(dt);
        o.position.add(dx);

        o.velocity.multiply(o.friction);

        // wrap around the world edges
        if (worldSettings.worldWrap) {
            if (o.position.x >= worldSettings.width) { o.position.x -= worldSettings.width; }
            if (o.position.y >= worldSettings.height) { o.position.y -= worldSettings.height; }
            if (o.position.x < 0) { o.position.x += worldSettings.width; }
            if (o.position.y < 0) { o.position.y += worldSettings.height; }
        }
    }

    // entry point for a single step of the Simple Physics
    step(dt: number, objectFilter: (o: GameObject) => boolean): void {

        // each object should advance
        let objects = this.gameEngine.world.objects;
        for (let objId of Object.keys(objects)) {

            // shadow objects are not re-enacted
            let ob = objects[objId];
            if (!objectFilter(ob))
                continue;

            // run the object step
            this.objectStep(ob, dt);
        }

        // emit event on collision
        this.collisionDetection.detect();
    }
}

export { SimplePhysicsEngine, SimplePhysicsEngineOptions };
