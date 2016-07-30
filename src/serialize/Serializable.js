"use strict";

class Serializable{

    serialize(serializer){
        //todo define behaviour when a netScheme is undefined
        if (typeof this.class.netScheme == "undefined"){
            console.warn("no netScheme defined! This will result in awful performance");
        }

        //buffer has one Uint8Array for class id, then payload
        var dataBuffer = new ArrayBuffer(serializer.getNetSchemeBufferSize(this.class));
        var dataView = new DataView(dataBuffer);

        //first set the id of the class, so that the deserializer can fetch information about it
        dataView.setUint8(0, this.class.properties.id);
        //advance the offset counter
        var dataByteOffset = Uint8Array.BYTES_PER_ELEMENT;

        for (var property in this.class.netScheme) {
            if (this.class.netScheme.hasOwnProperty(property)) {

                //write the property to buffer
                serializer.writeDataView(dataView, this[property], dataByteOffset, this.class.netScheme[property]);
                //advance offset
                dataByteOffset += serializer.getTypeByteSize(this.class.netScheme[property]);
            }
        }

        return dataBuffer;
    };
};

module.exports = Serializable;
