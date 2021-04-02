// Serializer must be loaded first before Serializable because of circular deps
import Serializer from '../../src/serialize/Serializer';
import Serializable from '../../src/serialize/Serializable';
import BaseTypes from '../../src/serialize/BaseTypes';

class TestObject extends Serializable {

    static get netScheme() {
        return {
            playerAges: {
                type: BaseTypes.TYPES.LIST,
                itemType: BaseTypes.TYPES.UINT8
            },
        };
    }

    constructor(playerAges) {
        super();
        this.playerAges = playerAges;
    }
}

var serializer = new Serializer();

var testObject = new TestObject([1, 2, 3]);
serializer.registerClass(TestObject);
testObject.class = TestObject;

describe('List serialization/deserialization', function() {
    let serializedTestObject = null;
    let deserializedTestObject = null;

    describe('primitives', function() {

        it('Serialize list', function() {
            serializedTestObject = testObject.serialize(serializer);

        });

        it('Deserialize list', function() {
            deserializedTestObject = serializer.deserialize(serializedTestObject.dataBuffer);
            deserializedTestObject.byteOffset.should.equal(6);
            deserializedTestObject.obj.playerAges.should.be.instanceof(Array).and.have.lengthOf(3);
            deserializedTestObject.obj.playerAges[0].should.equal(1);
            deserializedTestObject.obj.playerAges[1].should.equal(2);
            deserializedTestObject.obj.playerAges[2].should.equal(3);
        });

    });

});
