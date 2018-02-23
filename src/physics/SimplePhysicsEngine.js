'use strict';
import PhysicsEngine from './PhysicsEngine';
import TwoVector from '../serialize/TwoVector';
import HSHGCollisionDetection from './SimplePhysics/HSHGCollisionDetection';
import BruteCollisionDetection from './SimplePhysics/BruteCollisionDetection';

let dv = new TwoVector();
let dx = new TwoVector();
/**
 * SimplePhysicsEngine is a pseudo-physics engine which works with
 * objects of class DynamicObject.
 */
class SimplePhysicsEngine extends PhysicsEngine {

    constructor(initOptions) {
        super(initOptions);

        // todo does this mean both modules always get loaded?
        if (initOptions.collisions && initOptions.collisions.type === 'HSHG') {
            this.collisionDetection = new HSHGCollisionDetection();
        } else {
            this.collisionDetection = new BruteCollisionDetection();
        }

        /**
         * The actor's name.
         * @memberof SimplePhysicsEngine
         * @member {TwoVector} gravity affecting all objects
         */
        this.gravity = new TwoVector(0, 0);

        if (initOptions.gravity)
            this.gravity.copy(initOptions.gravity);

        let collisionOptions = Object.assign({ gameEngine: this.gameEngine }, initOptions.collisionOptions);
        this.collisionDetection.init(collisionOptions);
    }

    // a single object advances, based on:
    // isRotatingRight, isRotatingLeft, isAccelerating, current velocity
    // wrap-around the world if necessary
    objectStep(o, dt) {

        // calculate factor
        if (dt === 0)
            return;

        if (dt)
            dt /= (1 / 60);
        else
            dt = 1;

        let worldSettings = this.gameEngine.worldSettings;

        if (o.isRotatingRight) { o.angle += o.rotationSpeed; }
        if (o.isRotatingLeft) { o.angle -= o.rotationSpeed; }

        if (o.angle >= 360) { o.angle -= 360; }
        if (o.angle < 0) { o.angle += 360; }

        if (o.isAccelerating) {
            let rad = o.angle * (Math.PI / 180);
            dv.set(Math.cos(rad), Math.sin(rad)).multiplyScalar(o.acceleration).multiplyScalar(dt);
            o.velocity.add(dv);
        }

        // apply gravity
        if (o.affectedByGravity) o.velocity.add(this.gravity);

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
    step(dt, objectFilter) {

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
        this.collisionDetection.detect(this.gameEngine);
    }
}

export default SimplePhysicsEngine;
