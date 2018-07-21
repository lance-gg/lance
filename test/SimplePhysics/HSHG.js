'use strict'

const should = require('should');
const BaseTypes = require('../../src/serialize/BaseTypes');
const DynamicObject = require('../../src/serialize/DynamicObject');
const HSHG = require('../../src/physics/SimplePhysics/HSHG');

class TestObject extends DynamicObject {

    static get netScheme(){
        return {
            height: BaseTypes.TYPES.UINT16,
            width: BaseTypes.TYPES.UINT16
        };
    }

    constructor(){
        super();
        this.width = 100;
        this.height = 100;
    };
}

let grid = new HSHG();

let obj1 = new TestObject(1);
let obj2 = new TestObject(2);

grid.addObject(obj1);
grid.addObject(obj2);

describe('HSHG collision detection', function() {

    it('No collision 1', function() {
        obj1.position.x = 0;
        obj2.position.x = 101;
        grid.update();
        let collisionPairs = grid.queryForCollisionPairs();
        collisionPairs.length.should.equal(0);
    });

    it('Partial overlap Collision', function() {
        obj1.position.x = 0;
        obj2.position.x = 50;
        grid.update();
        let collisionPairs = grid.queryForCollisionPairs();
        collisionPairs.length.should.equal(1);
    });

    it('No collision 2', function() {
        obj1.position.x = 0;
        obj2.position.x = 101;
        grid.update();
        let collisionPairs = grid.queryForCollisionPairs();
        collisionPairs.length.should.equal(0);
    });


    it('Full overlap collision', function() {
        obj1.position.x = 0;
        obj2.position.x = 0;
        obj2.position.width = 50;
        obj2.position.height = 50;
        grid.update();
        let collisionPairs = grid.queryForCollisionPairs();
        collisionPairs.length.should.equal(1);
    });

});
