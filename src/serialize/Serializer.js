"use strict";

const Utils = require('./../lib/Utils');

/**
 * The Serializer is responsible for serializing the game world and its
 * objects on the server, before they are sent to each client.  On the client side the
 * Serializer deserializes these objects.
 *
 * The Serializer defines the data types which can be serialized.
 */
class Serializer {

    constructor() {
        this.registeredClasses = {};
        this.customTypes = {};
        this.netSchemeSizeCache = {}; // used to cache calculated netSchemes sizes
        this.registerClass(require('./TwoVector'));
        this.registerClass(require('./ThreeVector'));
        this.registerClass(require('./Quaternion'));
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
        return type !== Serializer.TYPES.CLASSINSTANCE && type !== Serializer.TYPES.LIST;
    }

    /**
     * Registers a new class with the serializer, so it may be deserialized later
     * @param {Function} classObj reference to the class (not an instance!)
     * @param [classId] Unit specifying a class ID
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
            console.error(`Serializer: unable to find class with objectClassId ${objectClassId}`);
        }

        localByteOffset += Uint8Array.BYTES_PER_ELEMENT; // advance the byteOffset after the classId

        let obj = new objectClass();
        for (let property of Object.keys(objectClass.netScheme).sort()) {
            let read = this.readDataView(dataView, byteOffset + localByteOffset, objectClass.netScheme[property]);
            obj[property] = read.data;
            localByteOffset += read.bufferSize;
        }

        return { obj, byteOffset: localByteOffset };
    }

    writeDataView(dataView, value, bufferOffset, netSchemProp) {
        if (netSchemProp.type == Serializer.TYPES.FLOAT32) {
            dataView.setFloat32(bufferOffset, value);
        } else if (netSchemProp.type == Serializer.TYPES.INT32) {
            dataView.setInt32(bufferOffset, value);
        } else if (netSchemProp.type == Serializer.TYPES.INT16) {
            dataView.setInt16(bufferOffset, value);
        } else if (netSchemProp.type == Serializer.TYPES.INT8) {
            dataView.setInt8(bufferOffset, value);
        } else if (netSchemProp.type == Serializer.TYPES.UINT8) {
            dataView.setUint8(bufferOffset, value);
        } else if (netSchemProp.type == Serializer.TYPES.CLASSINSTANCE) {
            value.serialize(this, {
                dataBuffer: dataView.buffer,
                bufferOffset: bufferOffset
            });
        } else if (netSchemProp.type == Serializer.TYPES.LIST) {
            let localBufferOffset = 0;

            // a list is comprised of the number of items followed by the items
            dataView.setUint16(bufferOffset + localBufferOffset, value.length);
            localBufferOffset += Uint16Array.BYTES_PER_ELEMENT;

            for (let item of value) {
                // todo inelegant, currently doesn't support list of lists
                if (netSchemProp.itemType == Serializer.TYPES.CLASSINSTANCE) {
                    let serializedObj = item.serialize(this, {
                        dataBuffer: dataView.buffer,
                        bufferOffset: bufferOffset + localBufferOffset
                    });
                    localBufferOffset += serializedObj.bufferOffset;
                } else {
                    this.writeDataView(dataView, item, bufferOffset + localBufferOffset, { type: netSchemProp.itemType });
                    localBufferOffset += this.getTypeByteSize(netSchemProp.itemType);
                }

            }
        }
        // this is a custom data property which needs to define its own write method
        else if (this.customTypes[netSchemProp.type] != null) {
            this.customTypes[netSchemProp.type].writeDataView(dataView, value, bufferOffset);
        } else {
            console.error(`No custom property ${netSchemProp.type} found!`);
        }

    }

    readDataView(dataView, bufferOffset, netSchemProp) {
        let data, bufferSize;

        if (netSchemProp.type == Serializer.TYPES.FLOAT32) {
            data = dataView.getFloat32(bufferOffset);
            bufferSize = this.getTypeByteSize(netSchemProp.type);
        } else if (netSchemProp.type == Serializer.TYPES.INT32) {
            data = dataView.getInt32(bufferOffset);
            bufferSize = this.getTypeByteSize(netSchemProp.type);
        } else if (netSchemProp.type == Serializer.TYPES.INT16) {
            data = dataView.getInt16(bufferOffset);
            bufferSize = this.getTypeByteSize(netSchemProp.type);
        } else if (netSchemProp.type == Serializer.TYPES.INT8) {
            data = dataView.getInt8(bufferOffset);
            bufferSize = this.getTypeByteSize(netSchemProp.type);
        } else if (netSchemProp.type == Serializer.TYPES.UINT8) {
            data = dataView.getUint8(bufferOffset);
            bufferSize = this.getTypeByteSize(netSchemProp.type);
        } else if (netSchemProp.type == Serializer.TYPES.CLASSINSTANCE) {
            var deserializeData = this.deserialize(dataView.buffer, bufferOffset);
            data = deserializeData.obj;
            bufferSize = deserializeData.byteOffset;
        } else if (netSchemProp.type == Serializer.TYPES.LIST) {
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
        }
        // this is a custom data property which needs to define its own read method
        else if (this.customTypes[netSchemProp.type] != null) {
            data = this.customTypes[netSchemProp.type].readDataView(dataView, bufferOffset);
        } else {
            console.error(`No custom property ${netSchemProp.type} found!`);
        }

        return { data: data, bufferSize: bufferSize };
    }

    getTypeByteSize(type) {

        switch (type) {
        case Serializer.TYPES.FLOAT32: {
            return Float32Array.BYTES_PER_ELEMENT;
        }
        case Serializer.TYPES.INT32: {
            return Int32Array.BYTES_PER_ELEMENT;
        }
        case Serializer.TYPES.INT16: {
            return Int16Array.BYTES_PER_ELEMENT;
        }
        case Serializer.TYPES.INT8: {
            return Int8Array.BYTES_PER_ELEMENT;
        }
        case Serializer.TYPES.UINT8: {
            return Uint8Array.BYTES_PER_ELEMENT;
        }

            // not one of the basic properties
        default: {
            if (this.customTypes[type] == null) {
                console.error(`netScheme property ${type} undefined! Did you forget to add it to the serializer?`);
                break;
            } else {
                return this.customTypes[type].BYTES_PER_ELEMENT;
            }
        }

        }

    }
}

/**
* The TYPES object defines the supported serialization types,
* FLOAT32, INT32, INT16, INT8, UINT8, CLASSINSTANCE and LIST.
* @constant
*/
Serializer.TYPES = {
    FLOAT32: "FLOAT32",
    INT32: "INT32",
    INT16: "INT16",
    INT8: "INT8",
    UINT8: "UINT8",
    CLASSINSTANCE: "CLASSINSTANCE",
    LIST: "LIST"
};

module.exports = Serializer;
