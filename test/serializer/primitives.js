"use strict";

const should = require('should');

const Serializable = require('../../src/serialize/Serializable');
const Serializer = require('../../src/serialize//Serializer');

class TestObject extends Serializable {

    static get netScheme(){
        return {
            float32: { type: Serializer.TYPES.FLOAT32 },
            int32: { type: Serializer.TYPES.INT32 },
            int16: { type: Serializer.TYPES.INT16 },
            int8: { type: Serializer.TYPES.INT8 },
            uint8: { type: Serializer.TYPES.UINT8 }
        }
    }

    constructor(data){
        super();
        if (data) {
            this.float32 = data.float32;
            this.int32 = data.int32;
            this.int16 = data.int16;
            this.int8 = data.int8;
            this.uint8 = data.uint8;
        }
    };
}

var serializer = new Serializer();

var testObject = new TestObject({
    float32: 1/3,
    int32: 2147483646,
    int16: 32766,
    int8: 126,
    uint8: 254
});
serializer.registerClass(TestObject);
testObject.class = TestObject;

describe('Object with primitives serialization/deserialization', function() {
    let serializedTestObject, deserializedTestObject;

    it('Serialize object', function () {
        serializedTestObject = testObject.serialize(serializer);

    });
    it('Deserialize object', function () {
        deserializedTestObject = serializer.deserialize(serializedTestObject.dataBuffer);
        deserializedTestObject.byteOffset.should.equal(1 + 4 + 4 + 2 + 1 + 1);
        //float precision is capped
        (deserializedTestObject.obj.float32 - testObject.float32).should.be.lessThan(0.00000001);
        deserializedTestObject.obj.int32.should.be.equal(testObject.int32);
        deserializedTestObject.obj.int16.should.be.equal(testObject.int16);
        deserializedTestObject.obj.int8.should.be.equal(testObject.int8);
        deserializedTestObject.obj.uint8.should.be.equal(testObject.uint8);
    });

});
