'use strict'

const should = require('should');
const BaseTypes = require('../../src/serialize/BaseTypes');
const DynamicObject = require('../../src/serialize/DynamicObject');
const GameEngine = require('../../src/GameEngine');
const SimplePhysicsEngine = require('../../src/physics/SimplePhysicsEngine');

class TestObject extends DynamicObject {

    static get netScheme(){
        return Object.assign({
            height: BaseTypes.TYPES.UINT16,
            width: BaseTypes.TYPES.UINT16
        }, super.netScheme);
    }

    constructor(id){
        super(id);
        this.width = 10;
        this.height = 10;
    };
}

let gameEngine = new GameEngine();
gameEngine.physicsEngine = new SimplePhysicsEngine({
    gameEngine: gameEngine,
    collisionOptions: {
        type: 'HSHG'
    }
});

gameEngine.start();

let obj1 = new TestObject(1);
let obj2 = new TestObject(2);
gameEngine.addObjectToWorld(obj1);
gameEngine.addObjectToWorld(obj2);

describe('HSHG Game Engine collision detection', function() {
    obj1.position.x = 5;
    obj2.position.x = 20;
    obj2.velocity.x = -5;
    console.log(obj1.position, obj2.position);


    it('Step 0 - No collision ', function() {
        // console.log(obj1.position, obj2.position);
        gameEngine.physicsEngine.collisionDetection.areObjectsColliding(obj1, obj2).should.equal(false);
    });

    it('Step 1 - collision ', function() {
        gameEngine.once('collisionStart', pairObj => {
            gameEngine.world.stepCount.should.equal(1);
        });
        gameEngine.step(false);
        console.log(obj1.position, obj2.position);
        gameEngine.physicsEngine.collisionDetection.areObjectsColliding(obj1, obj2).should.equal(true);
    });

    it('Step 2 - collision ', function() {
        gameEngine.step(false);
        console.log(obj1.position, obj2.position);
        gameEngine.physicsEngine.collisionDetection.areObjectsColliding(obj1, obj2).should.equal(true);
    });


    it('Step 3 - collision ', function() {
        gameEngine.step(false);
        console.log(obj1.position, obj2.position);
        gameEngine.physicsEngine.collisionDetection.areObjectsColliding(obj1, obj2).should.equal(true);
    });

    it('Step 4 - collision ', function() {
        gameEngine.step(false);
        console.log(obj1.position, obj2.position);
        gameEngine.physicsEngine.collisionDetection.areObjectsColliding(obj1, obj2).should.equal(true);
    });

    it('Step 5 - collision ', function() {
        gameEngine.step(false);
        console.log(obj1.position, obj2.position);
        gameEngine.physicsEngine.collisionDetection.areObjectsColliding(obj1, obj2).should.equal(true);
    });

    it('Step 6 - no collision ', function() {
        gameEngine.once('collisionStop', pairObj => {
            gameEngine.world.stepCount.should.equal(6);
        });
        console.log(obj1.position, obj2.position);
        gameEngine.step(false);
        gameEngine.physicsEngine.collisionDetection.areObjectsColliding(obj1, obj2).should.equal(false);
    });

});
