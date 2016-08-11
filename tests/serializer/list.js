"use strict";

const should = require('should');

const Serializable = require('../../src/serialize/Serializable');
const Serializer = require('../../src/serialize//Serializer');

class TestObject extends Serializable {

    static get netScheme(){
        return {
            playerAges: {
                type: Serializer.TYPES.LIST,
                itemType: Serializer.TYPES.UINT8
            },
        }
    }

    constructor(playerAges){
        super();
        this.playerAges = playerAges;
    };
}

var serializer = new Serializer();

var testObject = new TestObject([1,2,3]);
serializer.registerClass(TestObject);
testObject.class = TestObject;

describe('List serialization/deserialization', function() {
    let serializedTestObject, deserializedTestObject;


    describe('primitives', function() {

        it('Serialize list', function () {
            serializedTestObject = testObject.serialize(serializer);

        });

        it('Deserialize list', function () {
            deserializedTestObject = serializer.deserialize(serializedTestObject.dataBuffer);
            deserializedTestObject.byteOffset.should.equal(6);
            deserializedTestObject.obj.playerAges.should.be.instanceof(Array).and.have.lengthOf(3);
            deserializedTestObject.obj.playerAges[0].should.equal(1);
            deserializedTestObject.obj.playerAges[1].should.equal(2);
            deserializedTestObject.obj.playerAges[2].should.equal(3);
        });

    });

});
