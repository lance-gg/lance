"use strict";

const Utils = require('./../Utils');

class Serializer {

    constructor(){
        this.registeredClasses = {};
        this.customTypes = {};

        this.netSchemeSizeCache = {}; //used to cache calculated netSchemes sizes
    }

    /**
     * Adds a custom primitive to the serializer instance.
     * This will enable you to use it in an object's netScheme
     * @param customType
     */
    addCustomType(customType){
        this.customTypes[customType.type] = customType;
    }


    /**
     * Registers a new class with the serializer, so it may be deserialized later
     * @param classObj reference to the class (not an instance!)
     * @param [classId] Unit specifying a class ID
     */
    registerClass(classObj, classId){
        //if no classId is specified, hash one from the class name
        classId = classId ? classId : Utils.hashStr(classObj.name);
        if (this.registeredClasses[classId]){
            console.error(`Serializer: accidental override of classId ${classId} when registering class`,classObj);
        }

        this.registeredClasses[classId] = classObj;
    };


    deserialize(dataBuffer, byteOffset){
        byteOffset = byteOffset ? byteOffset : 0;

        let dataView = new DataView(dataBuffer);

        let objectClassId = dataView.getUint8(byteOffset);
        //todo if classId is 0 - take care of dynamic serialization.
        let objectClass = this.registeredClasses[objectClassId];
        // console.log(objectClassId, objectClass);

        byteOffset += Uint8Array.BYTES_PER_ELEMENT; //advance the byteOffset after the classId

        // console.log(objectClass);

        let obj = new objectClass();
        for (let property of Object.keys(objectClass.netScheme)) {
            let read = this.readDataView(dataView, byteOffset, objectClass.netScheme[property]);
            obj[property] = read.data;

            byteOffset += read.bufferSize;

        }
        return obj;
    };

    getNetSchemeBufferSize(netScheme){
        let netSchemeHash = Utils.hash(netScheme);
        //check if this netScheme size is already in the cache
        if (this.netSchemeSizeCache[netSchemeHash]){
            return this.netSchemeSizeCache[netSchemeHash];
        }
        else{
            let netSchemeBufferSize = 0;
            for (let property of Object.keys(netScheme)) {
                //count the bytesize required for the netScheme buffer
                netSchemeBufferSize += this.getTypeByteSize(netScheme[property]);
            }

            this.netSchemeSizeCache[netSchemeHash] = netSchemeBufferSize;

            return netSchemeBufferSize;
        }
    };

    getNetSchemeBufferSizeByClass(objClass){
        if (typeof objClass.netSchemeBufferSize=="undefined"){
            objClass.netSchemeBufferSize = Uint8Array.BYTES_PER_ELEMENT; //every class netscheme starts with the class id
            objClass.netSchemeBufferSize += this.getNetSchemeBufferSize(objClass.netScheme);
        }

        return objClass.netSchemeBufferSize;
    };

    writeDataView(dataView, value, bufferOffset, netSchemProp){

        if (netSchemProp.type == Serializer.TYPES.FLOAT32){
            dataView.setFloat32(bufferOffset, value);
        }
        else if (netSchemProp.type == Serializer.TYPES.INT32){
            dataView.setInt32(bufferOffset, value);
        }
        else if (netSchemProp.type == Serializer.TYPES.INT16){
            dataView.setInt16(bufferOffset, value);
        }
        else if (netSchemProp.type == Serializer.TYPES.INT8){
            dataView.setInt8(bufferOffset, value);
        }
        else if (netSchemProp.type == Serializer.TYPES.UINT8){
            dataView.setUint8(bufferOffset, value);
        }
        else if (netSchemProp.type == Serializer.TYPES.CLASSINSTANCE){
            value.serialize(this, dataView.buffer, bufferOffset);
        }
        //this is a custom data property which needs to define its own write method
        else if(this.customTypes[netSchemProp.type] != null){
            this.customTypes[netSchemProp.type].writeDataView(dataView, value, bufferOffset);
        }
        else{
            console.error(`No custom property ${netSchemProp.type} found!`)
        }

    }

    readDataView(dataView, bufferOffset, netSchemProp){
        let data, bufferSize;
        bufferSize = this.getTypeByteSize(netSchemProp);

        if (netSchemProp.type == Serializer.TYPES.FLOAT32){
            data = dataView.getFloat32(bufferOffset);
        }
        else if (netSchemProp.type == Serializer.TYPES.INT32){
            data = dataView.getInt32(bufferOffset);
        }
        else if (netSchemProp.type == Serializer.TYPES.INT16){
            data = dataView.getInt16(bufferOffset);
        }
        else if (netSchemProp.type == Serializer.TYPES.INT8){
            data = dataView.getInt8(bufferOffset);
        }
        else if (netSchemProp.type == Serializer.TYPES.UINT8){
            data = dataView.getUint8(bufferOffset);
        }
        else if (netSchemProp.type == Serializer.TYPES.CLASSINSTANCE){
            data = this.deserialize(dataView.buffer, bufferOffset);
        }
        //this is a custom data property which needs to define its own read method
        else if(this.customTypes[netSchemProp.type] != null){
            data = this.customTypes[netSchemProp.type].readDataView(dataView, bufferOffset);
        }
        else{
            console.error(`No custom property ${netSchemProp.type} found!`)
        }

        return {data: data, bufferSize: bufferSize}
    }

    getTypeByteSize(netSchemeProp){

        switch (netSchemeProp.type){
            case Serializer.TYPES.FLOAT32: {
                return Float32Array.BYTES_PER_ELEMENT
            }
            case Serializer.TYPES.INT32: {
                return Int32Array.BYTES_PER_ELEMENT
            }
            case Serializer.TYPES.INT16: {
                return Int16Array.BYTES_PER_ELEMENT
            }
            case Serializer.TYPES.INT8: {
                return Int8Array.BYTES_PER_ELEMENT
            }
            case Serializer.TYPES.UINT8: {
                return Uint8Array.BYTES_PER_ELEMENT
            }
            case Serializer.TYPES.CLASSINSTANCE: {
                if (netSchemeProp.classId == null){
                    console.error(`received CLASSINSTANCE but no classId!`)
                }

                let netScheme = this.registeredClasses[netSchemeProp.classId].netScheme;
                //netScheme + class id
                let bufferSize = this.getNetSchemeBufferSize(netScheme) + Uint8Array.BYTES_PER_ELEMENT;
                return bufferSize;
            }

            //not one of the basic properties
            default: {
                if (this.customTypes[netSchemeProp.type] == null){
                    console.error(`netScheme property ${netSchemeProp.type} undefined! Did you forget to add it to the serializer?`);
                    break;
                }
                else{
                    return this.customTypes[netSchemeProp.type].BYTES_PER_ELEMENT;
                }
            }

        }

    }
}

Serializer.TYPES = {
    FLOAT32: "FLOAT32",
    INT32: "INT32",
    INT16: "INT16",
    INT8: "INT8",
    UINT8: "UINT8",
    CLASSINSTANCE: "CLASSINSTANCE"
};

module.exports = Serializer;