'use strict';
const Point = require('../Point');
const PhysicsEngine = require('./PhysicsEngine');
const CollisionDetection = require('./SimplePhysics/CollisionDetection');

/**
 * SimplePhysicsEngine is a pseudo-physics engine which works with
 * objects of class DynamicObject.
 */
class SimplePhysicsEngine extends PhysicsEngine {

    init(initOptions) {
        super.init(initOptions);
        this.collisionDetection = new CollisionDetection();

        let collisionOptions = Object.assign({ gameEngine: this.gameEngine }, initOptions.collisionOptions);
        this.collisionDetection.init(collisionOptions);
    }

    // a single object advances, based on:
    // isRotatingRight, isRotatingLeft, isAccelerating, current velocity, current bending
    // wrap-around the world if necessary
    objectStep(o) {
        let worldSettings = this.gameEngine.worldSettings;

        if (o.isRotatingRight) { o.angle += o.rotationSpeed; }
        if (o.isRotatingLeft) { o.angle -= o.rotationSpeed; }
        o.angle += o.bendingAngle;

        if (o.angle >= 360) { o.angle -= 360; }
        if (o.angle < 0) { o.angle += 360; }

        if (o.isAccelerating) {
            o.temp.accelerationVector.set(
                Math.cos(o.angle * (Math.PI / 180)),
                Math.sin(o.angle * (Math.PI / 180))
            ).setMagnitude(o.acceleration);
        } else {
            o.temp.accelerationVector.set(0, 0);
        }

        // acceleration
        Point.add(o.velocity, o.temp.accelerationVector, o.velocity);

        // o.velocity.multiply(o.deceleration, o.deceleration);
        o.velocity.x = Math.round(o.velocity.x * 100) / 100;
        o.velocity.y = Math.round(o.velocity.y * 100) / 100;

        if ((o.maxSpeed !== null) && (o.velocity.getMagnitude() > o.maxSpeed))
            o.velocity.setMagnitude(o.maxSpeed);

        o.velX = o.velocity.x;
        o.velY = o.velocity.y;

        o.isAccelerating = false;
        o.isRotatingLeft = false;
        o.isRotatingRight = false;

        o.x = o.x + o.velocity.x + o.bendingX;
        o.y = o.y + o.velocity.y + o.bendingY;

        // wrap around the world edges
        if (worldSettings.worldWrap) {
            if (o.x >= worldSettings.width) { o.x -= worldSettings.width; }
            if (o.y >= worldSettings.height) { o.y -= worldSettings.height; }
            if (o.x < 0) { o.x += worldSettings.width; }
            if (o.y < 0) { o.y += worldSettings.height; }
        }
    }

    // entry point for a single step of the Simple Physics
    step(objectFilter) {

        // each object should advance
        let objects = this.gameEngine.world.objects;
        for (let objId of Object.keys(objects)) {

            // shadow objects are not re-enacted
            let ob = objects[objId];
            if (!objectFilter(ob))
                continue;

            // run the object step
            this.objectStep(ob);
        }

        // emit event on collision
        this.collisionDetection.detect(this.gameEngine);
    }
}

module.exports = SimplePhysicsEngine;
