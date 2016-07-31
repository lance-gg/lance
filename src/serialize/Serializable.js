"use strict";

class Serializable{
    /*
        Class can be serialized using either:
            - a class based netScheme
            - an instance based netScheme
            - completely dynamically (not implemented yet
     */
    serialize(serializer, dataBuffer, dataByteOffset){
        let netScheme;
        let netSchemeBufferSize;
        let classId = 0;

        //instance classId
        if (this.classId){
            classId = this.classId;
        }
        else if (this.class.properties && this.class.properties.id){
            classId = this.class.properties.id;
        }
        else {
            //todo define behaviour for dynamic classes
            console.warn("no classId defined!");
        }


        //instance netScheme
        if (this.netScheme){
            netScheme = this.netScheme;
        }
        else if (this.class.netScheme){
            netScheme = this.class.netScheme;
        }
        else {
            //todo define behaviour when a netScheme is undefined
            console.warn("no netScheme defined! This will result in awful performance");
        }

        //instance bufferSize for netScheme
        if (this.netSchemeBufferSize){
            netSchemeBufferSize = this.netSchemeBufferSize;
        }
        else{
            //todo extra case?
            netSchemeBufferSize = serializer.getNetSchemeBufferSizeByClass(this.class);
        }

        //buffer has one Uint8Array for class id, then payload
        if (dataBuffer == null) {
            dataBuffer = new ArrayBuffer(netSchemeBufferSize);
        }
        var dataView = new DataView(dataBuffer);

        //first set the id of the class, so that the deserializer can fetch information about it
        dataView.setUint8(0, classId);

        //advance the offset counter
        dataByteOffset = dataByteOffset ? dataByteOffset : 0; // might be writing into an existing buffer
        dataByteOffset += Uint8Array.BYTES_PER_ELEMENT;


        if (netScheme) {
            for (let property of Object.keys(netScheme)) {
                //write the property to buffer
                serializer.writeDataView(dataView, this[property], dataByteOffset, netScheme[property]);
                //advance offset
                dataByteOffset += serializer.getTypeByteSize(netScheme[property]);
            }
        }
        else{
            //TODO no netScheme, dynamic class
        }

        return dataBuffer;
    };
};

module.exports = Serializable;