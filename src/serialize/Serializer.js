import Utils from './../lib/Utils';
import TwoVector from './TwoVector';
import ThreeVector from './ThreeVector';
import Quaternion from './Quaternion';
import BaseTypes from './BaseTypes';

const MAX_UINT_16 = 0xFFFF;

/**
 * The Serializer is responsible for serializing the game world and its
 * objects on the server, before they are sent to each client.  On the client side the
 * Serializer deserializes these objects.
 *
 */
class Serializer {

    constructor() {
        this.registeredClasses = {};
        this.customTypes = {};
        this.registerClass(TwoVector);
        this.registerClass(ThreeVector);
        this.registerClass(Quaternion);
    }

    /**
     * Adds a custom primitive to the serializer instance.
     * This will enable you to use it in an object's netScheme
     * @param customType
     */
    // TODO: the function below is not used, and it is not clear what that
    // first argument is supposed to be
    addCustomType(customType) {
        this.customTypes[customType.type] = customType;
    }

    /**
     * Checks if type can be assigned by value.
     * @param {String} type Type to Checks
     * @return {Boolean} True if type can be assigned
     */
    static typeCanAssign(type) {
        return type !== BaseTypes.TYPES.CLASSINSTANCE && type !== BaseTypes.TYPES.LIST;
    }

    /**
     * Registers a new class with the serializer, so it may be deserialized later
     * @param {Function} classObj reference to the class (not an instance!)
     * @param {String} classId Unit specifying a class ID
     */
    registerClass(classObj, classId) {
        // if no classId is specified, hash one from the class name
        classId = classId ? classId : Utils.hashStr(classObj.name);
        if (this.registeredClasses[classId]) {
            console.error(`Serializer: accidental override of classId ${classId} when registering class`, classObj);
        }

        this.registeredClasses[classId] = classObj;
    }

    deserialize(dataBuffer, byteOffset) {
        byteOffset = byteOffset ? byteOffset : 0;
        let localByteOffset = 0;

        let dataView = new DataView(dataBuffer);

        let objectClassId = dataView.getUint8(byteOffset + localByteOffset);

        // todo if classId is 0 - take care of dynamic serialization.
        let objectClass = this.registeredClasses[objectClassId];
        if (objectClass == null) {
            console.error('Serializer: Found a class which was not registered.  Please use serializer.registerClass() to register all serialized classes.');
        }

        localByteOffset += Uint8Array.BYTES_PER_ELEMENT; // advance the byteOffset after the classId

        // create de-referenced instance of the class. gameEngine and id will be 'tacked on' later at the sync strategies
        let obj = new objectClass(null, { id: null });
        for (let property of Object.keys(objectClass.netScheme).sort()) {
            let read = this.readDataView(dataView, byteOffset + localByteOffset, objectClass.netScheme[property]);
            obj[property] = read.data;
            localByteOffset += read.bufferSize;
        }

        return { obj, byteOffset: localByteOffset };
    }

    writeDataView(dataView, value, bufferOffset, netSchemProp) {
        if (netSchemProp.type === BaseTypes.TYPES.FLOAT32) {
            dataView.setFloat32(bufferOffset, value);
        } else if (netSchemProp.type === BaseTypes.TYPES.INT32) {
            dataView.setInt32(bufferOffset, value);
        } else if (netSchemProp.type === BaseTypes.TYPES.INT16) {
            dataView.setInt16(bufferOffset, value);
        } else if (netSchemProp.type === BaseTypes.TYPES.INT8) {
            dataView.setInt8(bufferOffset, value);
        } else if (netSchemProp.type === BaseTypes.TYPES.UINT8) {
            dataView.setUint8(bufferOffset, value);
        } else if (netSchemProp.type === BaseTypes.TYPES.STRING) {

            //   MAX_UINT_16 is a reserved (length) value which indicates string hasn't changed
            if (value === null) {
                dataView.setUint16(bufferOffset, MAX_UINT_16);
            } else {
                let strLen = value.length;
                dataView.setUint16(bufferOffset, strLen);
                let localBufferOffset = 2;
                for (let i = 0; i < strLen; i++)
                    dataView.setUint16(bufferOffset + localBufferOffset + i * 2, value.charCodeAt(i));
            }
        } else if (netSchemProp.type === BaseTypes.TYPES.CLASSINSTANCE) {
            value.serialize(this, {
                dataBuffer: dataView.buffer,
                bufferOffset: bufferOffset
            });
        } else if (netSchemProp.type === BaseTypes.TYPES.LIST) {
            let localBufferOffset = 0;

            // a list is comprised of the number of items followed by the items
            dataView.setUint16(bufferOffset + localBufferOffset, value.length);
            localBufferOffset += Uint16Array.BYTES_PER_ELEMENT;

            for (let item of value) {
                // TODO: inelegant, currently doesn't support list of lists
                if (netSchemProp.itemType === BaseTypes.TYPES.CLASSINSTANCE) {
                    let serializedObj = item.serialize(this, {
                        dataBuffer: dataView.buffer,
                        bufferOffset: bufferOffset + localBufferOffset
                    });
                    localBufferOffset += serializedObj.bufferOffset;
                } else if (netSchemProp.itemType === BaseTypes.TYPES.STRING) {
                    //   MAX_UINT_16 is a reserved (length) value which indicates string hasn't changed
                    if (item === null) {
                        dataView.setUint16(bufferOffset + localBufferOffset, MAX_UINT_16);
                        localBufferOffset += Uint16Array.BYTES_PER_ELEMENT;
                    } else {
                        let strLen = item.length;
                        dataView.setUint16(bufferOffset + localBufferOffset, strLen);
                        localBufferOffset += Uint16Array.BYTES_PER_ELEMENT;
                        for (let i = 0; i < strLen; i++)
                            dataView.setUint16(bufferOffset + localBufferOffset + i * 2, item.charCodeAt(i));
                        localBufferOffset += Uint16Array.BYTES_PER_ELEMENT * strLen;
                    }
                } else {
                    this.writeDataView(dataView, item, bufferOffset + localBufferOffset, { type: netSchemProp.itemType });
                    localBufferOffset += this.getTypeByteSize(netSchemProp.itemType);
                }
            }
        } else if (this.customTypes[netSchemProp.type]) {
            // this is a custom data property which needs to define its own write method
            this.customTypes[netSchemProp.type].writeDataView(dataView, value, bufferOffset);
        } else {
            console.error(`No custom property ${netSchemProp.type} found!`);
        }

    }

    readDataView(dataView, bufferOffset, netSchemProp) {
        let data, bufferSize;

        if (netSchemProp.type === BaseTypes.TYPES.FLOAT32) {
            data = dataView.getFloat32(bufferOffset);
            bufferSize = this.getTypeByteSize(netSchemProp.type);
        } else if (netSchemProp.type === BaseTypes.TYPES.INT32) {
            data = dataView.getInt32(bufferOffset);
            bufferSize = this.getTypeByteSize(netSchemProp.type);
        } else if (netSchemProp.type === BaseTypes.TYPES.INT16) {
            data = dataView.getInt16(bufferOffset);
            bufferSize = this.getTypeByteSize(netSchemProp.type);
        } else if (netSchemProp.type === BaseTypes.TYPES.INT8) {
            data = dataView.getInt8(bufferOffset);
            bufferSize = this.getTypeByteSize(netSchemProp.type);
        } else if (netSchemProp.type === BaseTypes.TYPES.UINT8) {
            data = dataView.getUint8(bufferOffset);
            bufferSize = this.getTypeByteSize(netSchemProp.type);
        } else if (netSchemProp.type === BaseTypes.TYPES.STRING) {
            let length = dataView.getUint16(bufferOffset);
            let localBufferOffset = Uint16Array.BYTES_PER_ELEMENT;
            bufferSize = localBufferOffset;
            if (length === MAX_UINT_16) {
                data = null;
            } else {
                let a = [];
                for (let i = 0; i < length; i++)
                    a[i] = dataView.getUint16(bufferOffset + localBufferOffset + i * 2);
                data = String.fromCharCode.apply(null, a);
                bufferSize += length * Uint16Array.BYTES_PER_ELEMENT;
            }
        } else if (netSchemProp.type === BaseTypes.TYPES.CLASSINSTANCE) {
            var deserializeData = this.deserialize(dataView.buffer, bufferOffset);
            data = deserializeData.obj;
            bufferSize = deserializeData.byteOffset;
        } else if (netSchemProp.type === BaseTypes.TYPES.LIST) {
            let localBufferOffset = 0;

            let items = [];
            let itemCount = dataView.getUint16(bufferOffset + localBufferOffset);
            localBufferOffset += Uint16Array.BYTES_PER_ELEMENT;

            for (let x = 0; x < itemCount; x++) {
                let read = this.readDataView(dataView, bufferOffset + localBufferOffset, { type: netSchemProp.itemType });
                items.push(read.data);
                localBufferOffset += read.bufferSize;
            }

            data = items;
            bufferSize = localBufferOffset;
        } else if (this.customTypes[netSchemProp.type] != null) {
            // this is a custom data property which needs to define its own read method
            data = this.customTypes[netSchemProp.type].readDataView(dataView, bufferOffset);
        } else {
            console.error(`No custom property ${netSchemProp.type} found!`);
        }

        return { data: data, bufferSize: bufferSize };
    }

    getTypeByteSize(type) {

        switch (type) {
        case BaseTypes.TYPES.FLOAT32: {
            return Float32Array.BYTES_PER_ELEMENT;
        }
        case BaseTypes.TYPES.INT32: {
            return Int32Array.BYTES_PER_ELEMENT;
        }
        case BaseTypes.TYPES.INT16: {
            return Int16Array.BYTES_PER_ELEMENT;
        }
        case BaseTypes.TYPES.INT8: {
            return Int8Array.BYTES_PER_ELEMENT;
        }
        case BaseTypes.TYPES.UINT8: {
            return Uint8Array.BYTES_PER_ELEMENT;
        }

        // not one of the basic properties
        default: {
            if (type === undefined) {
                throw 'netScheme property declared without type attribute!';
            } else if (this.customTypes[type] === null) {
                throw `netScheme property ${type} undefined! Did you forget to add it to the serializer?`;
            } else {
                return this.customTypes[type].BYTES_PER_ELEMENT;
            }
        }

        }

    }
}

export default Serializer;
