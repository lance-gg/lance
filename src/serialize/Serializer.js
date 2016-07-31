"use strict";


class Serializer {

    constructor(){
        this.customTypes = {};
    }

    addCustomType(customType){
        this.customTypes[customType.type] = customType;
    }

    deserialize(classObj, dataBuffer, byteOffset){
        byteOffset += Uint8Array.BYTES_PER_ELEMENT; //object starts with classId
        var dataView = new DataView(dataBuffer);

        var obj = new classObj();
        for (var property in classObj.netScheme) {
            if (classObj.netScheme.hasOwnProperty(property)) {

                let read = this.readDataView(dataView, byteOffset, classObj.netScheme[property]);
                obj[property] = read.data;

                byteOffset += read.bufferSize;
            }
        }
        return obj;
    };

    getNetSchemeBufferSize(netScheme){
        let netSchemeBufferSize = 0;
        for (let property of Object.keys(netScheme)) {
            //count the bytesize required for the netScheme buffer
            netSchemeBufferSize += this.getTypeByteSize(netScheme[property]);
        }

        return netSchemeBufferSize;
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
            setClassInstance(dataView, bufferOffset, value);
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
            data = getClassInstance(bufferOffset)
        }
        //this is a custom data property which needs to define its own read method
        else if(this.customTypes[netSchemProp.type] != null){
            data = this.customTypes[netSchemProp.type].readDataView(dataView, bufferOffset);
        }
        else{
            console.error(`No custom property ${netSchemProp.type} found!`)
        }
        // else if (netSchemProp.type == Serializer.TYPES.POINT){
        //     let readX = Serializable.readDataView(dataView,bufferOffset, {type: netSchemProp.valueType});
        //     let readY = Serializable.readDataView(dataView, readX.bufferSize , {type: netSchemProp.valueType});
        //
        //     data = new Point(readX.value, readY.value);
        //     bufferSize = readX.bufferSize*2;
        // }

        return {data: data, bufferSize: bufferSize}
    }

    getTypeByteSize(netSchemeProp){
        switch (netSchemeProp.type){
            case Serializer.TYPES.FLOAT32: {
                return Float32Array.BYTES_PER_ELEMENT
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

function setClassInstance(dataView, bufferOffset, value){

}

function getClassInstance(dataView, bufferOffset){


    // deserialize(classObj, dataBuffer, byteOffset){
    //     byteOffset += Uint8Array.BYTES_PER_ELEMENT; //object starts with classId
    //     var dataView = new DataView(dataBuffer);
    //
    //     var obj = new classObj();
    //     for (var property in classObj.netScheme) {
    //         if (classObj.netScheme.hasOwnProperty(property)) {
    //
    //             let read = this.readDataView(dataView, byteOffset, classObj.netScheme[property]);
    //             obj[property] = read.data;
    //
    //             byteOffset += read.bufferSize;
    //         }
    //     }
    //     return obj;
    // };

}

Serializer.TYPES = {
    FLOAT32: "FLOAT32",
    INT16: "INT16",
    INT8: "INT8",
    UINT8: "UINT8",
    CLASSINSTANCE: "CLASSINSTANCE"
};

module.exports = Serializer;