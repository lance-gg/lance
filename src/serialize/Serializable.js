'use strict';

const Utils = require('./../lib/Utils');
const Serializer = require('./Serializer');

class Serializable {
    /**
     *  Class can be serialized using either:
         - a class based netScheme
         - an instance based netScheme
         - completely dynamically (not implemented yet)

     * @param {Object} serializer
     * @param {Object} [options] - Options object
     * @param {Object} options.dataBuffer [optional] - Data buffer to write to. If null a new data buffer will be created
     * @param {Number} options.bufferOffset [optional] - The buffer data offset to start writing at. Default: 0
     * @param {String} options.dry [optional] - Does not actually write to the buffer (useful to gather serializeable size)
     * @returns {Object} the serialized object and the byte offset
     */
    serialize(serializer, options) {
        options = Object.assign({
            bufferOffset: 0
        }, options);

        let netScheme, dataBuffer, dataView;
        let classId = 0;
        let bufferOffset = options.bufferOffset;
        let localBufferOffset = 0; // used for counting the bufferOffset

        // instance classId
        if (this.classId) {
            classId = this.classId;
        } else {
            classId = Utils.hashStr(this.constructor.name);
        }

        // instance netScheme
        if (this.netScheme) {
            netScheme = this.netScheme;
        } else if (this.constructor.netScheme) {
            netScheme = this.constructor.netScheme;
        } else {
            // todo define behaviour when a netScheme is undefined
            console.warn('no netScheme defined! This will result in awful performance');
        }

        // buffer has one Uint8Array for class id, then payload
        if (options.dataBuffer == null && options.dry != true) {
            let bufferSize = this.serialize(serializer, { dry: true }).bufferOffset;
            dataBuffer = new ArrayBuffer(bufferSize);
        } else {
            dataBuffer = options.dataBuffer;
        }

        if (options.dry != true) {
            dataView = new DataView(dataBuffer);
            // first set the id of the class, so that the deserializer can fetch information about it
            dataView.setUint8(bufferOffset + localBufferOffset, classId);
        }

        // advance the offset counter
        localBufferOffset += Uint8Array.BYTES_PER_ELEMENT;

        if (netScheme) {
            for (let property of Object.keys(netScheme).sort()) {
                // write the property to buffer

                if (options.dry != true) {
                    serializer.writeDataView(dataView, this[property], bufferOffset + localBufferOffset, netScheme[property]);
                }

                // derive the size of the included class
                if (netScheme[property].type == Serializer.TYPES.CLASSINSTANCE) {
                    let objectInstanceBufferOffset = this[property].serialize(serializer, { dry: true }).bufferOffset;
                    localBufferOffset += objectInstanceBufferOffset;
                }
                // derive the size of the list
                else if (netScheme[property].type == Serializer.TYPES.LIST) {
                    // list starts with number of elements
                    localBufferOffset += Uint16Array.BYTES_PER_ELEMENT;

                    for (let item of this[property]) {
                        // todo inelegant, currently doesn't support list of lists
                        if (netScheme[property].itemType == Serializer.TYPES.CLASSINSTANCE) {
                            let listBufferOffset = item.serialize(serializer, { dry: true }).bufferOffset;
                            localBufferOffset += listBufferOffset;
                        } else {
                            localBufferOffset += serializer.getTypeByteSize(netScheme[property].itemType);
                        }
                    }
                } else {
                    // advance offset
                    localBufferOffset += serializer.getTypeByteSize(netScheme[property].type);
                }

            }
        } else {
            // TODO no netScheme, dynamic class
        }

        return { dataBuffer, bufferOffset: localBufferOffset };
    }

}

module.exports = Serializable;
