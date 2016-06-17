var Point = require("../Point");

class Serializable{

    serialize(){
        //todo define behaviour when a netScheme is undefined
        if (typeof this.class.netScheme == "undefined"){
            console.warn("no netScheme defined! This will result in awful performance");
        }

        //buffer has one Uint8Array for class id, then payload
        var dataBuffer = new ArrayBuffer(this.class.getNetSchemeBufferSize(this.class));
        var dataView = new DataView(dataBuffer);

        //first set the id of the class, so that the deserializer can fetch information about it
        dataView.setUint8(0, this.class.properties.id);
        //advance the offset counter
        var dataByteOffset = Uint8Array.BYTES_PER_ELEMENT;

        for (var property in this.class.netScheme) {
            if (this.class.netScheme.hasOwnProperty(property)) {

                Serializable.writeDataView(dataView, this[property], dataByteOffset, this.class.netScheme[property]);

                dataByteOffset += Serializable.getTypeByteSize(this.class.netScheme[property]);
            }
        }

        return dataBuffer;
    };

    static deserialize(classObj, dataBuffer){
        var dataBufferIndex = Uint8Array.BYTES_PER_ELEMENT; //object starts with classId
        var dataView = new DataView(dataBuffer);

        var obj = new classObj();
        for (var property in classObj.netScheme) {
            if (classObj.netScheme.hasOwnProperty(property)) {

                let read = Serializable.readDataView(dataView, dataBufferIndex, classObj.netScheme[property]);
                obj[property] = read.data;

                dataBufferIndex += read.bufferSize;
            }
        }
        return obj;
    };

    static getNetSchemeBufferSize(objClass){
        
        if (typeof objClass.netSchemeBufferSize=="undefined"){
            objClass.netSchemeBufferSize = Uint8Array.BYTES_PER_ELEMENT; //every scheme starts with the class id
            for (var property in objClass.netScheme) {
                if (objClass.netScheme.hasOwnProperty(property)) {
                    //count the bytesize required for the netScheme buffer
                    objClass.netSchemeBufferSize += Serializable.getTypeByteSize(objClass.netScheme[property]);
                }
            }
        }

        return objClass.netSchemeBufferSize;
    };

    static writeDataView(dataView, value, bufferOffset, netSchemProp){

        if (netSchemProp.type == Serializable.TYPES.FLOAT32){
            dataView.setFloat32(bufferOffset, value);
        }
        if (netSchemProp.type == Serializable.TYPES.INT16){
             dataView.setInt16(bufferOffset, value);
        }
        else if (netSchemProp.type == Serializable.TYPES.INT8){
            dataView.setInt8(bufferOffset, value);
        }
        else if (netSchemProp.type == Serializable.TYPES.UINT8){
            dataView.setUint8(bufferOffset, value);
        }
        else if (netSchemProp.type == Serializable.TYPES.POINT){

            //TODO write Point

            // let readX = Serializable.readDataView(dataView,bufferOffset, {type: netSchemProp.valueType});
            // let readY = Serializable.readDataView(dataView, readX.bufferSize , {type: netSchemProp.valueType});
            //
            // data = new Point(readX.value, readY.value);
            // bufferSize = readX.bufferSize*2;
        }
    }

    static readDataView(dataView, bufferIndex, netSchemProp){
        let data, bufferSize;

        if (netSchemProp.type == Serializable.TYPES.FLOAT32){
            data = dataView.getFloat32(bufferIndex);
            bufferSize = Float32Array.BYTES_PER_ELEMENT;
        }
        if (netSchemProp.type == Serializable.TYPES.INT16){
            data = dataView.getInt16(bufferIndex);
            bufferSize = Int16Array.BYTES_PER_ELEMENT;
        }
        else if (netSchemProp.type == Serializable.TYPES.INT8){
            data = dataView.getInt8(bufferIndex);
            bufferSize = bufferSize = Float32Array.BYTES_PER_ELEMENT;
        }
        else if (netSchemProp.type == Serializable.TYPES.UINT8){
            data = dataView.getUint8(bufferIndex);
            bufferSize = Uint8Array.BYTES_PER_ELEMENT;
        }
        else if (netSchemProp.type == Serializable.TYPES.POINT){
            let readX = Serializable.readDataView(dataView,bufferIndex, {type: netSchemProp.valueType});
            let readY = Serializable.readDataView(dataView, readX.bufferSize , {type: netSchemProp.valueType});

            data = new Point(readX.value, readY.value);
            bufferSize = readX.bufferSize*2;
        }

        return {data: data, bufferSize: bufferSize}
    }

    static getTypeByteSize(netSchemeProp){
        switch (netSchemeProp.type){
            case Serializable.TYPES.FLOAT32: {
                return Float32Array.BYTES_PER_ELEMENT
            }
            case Serializable.TYPES.INT16: {
                return Int16Array.BYTES_PER_ELEMENT
            }
            case Serializable.TYPES.INT8: {
                return Int8Array.BYTES_PER_ELEMENT
            }
            case Serializable.TYPES.UINT8: {
                return Uint8Array.BYTES_PER_ELEMENT
            }
            case Serializable.TYPES.POINT: {
                return Serializable.getTypeByteSize({ type: netSchemeProp.valueType}) * 2;

            }

        }

    }
};

Serializable.TYPES = {
    FLOAT32: "FLOAT32",
    INT16: "INT16",
    INT8: "INT8",
    UINT8: "UINT8",
    POINT: "POINT"
};

module.exports = Serializable;