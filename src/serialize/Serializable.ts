import Utils from '../lib/Utils.js';
import BaseTypes from './BaseTypes.js';
import { NetScheme } from './NetScheme.js';
import Serializer from './Serializer.js';


type SerializableOptions = {
    dataBuffer: any,
    bufferOffset: number,
    dry: boolean
}

type SerializedObj = {
    dataBuffer: ArrayBuffer,
    bufferOffset: number
}

class Serializable {

    public classId: number;

    constructor() {}
    
    netScheme(): NetScheme {
        return {};
    }

    /**
     *  Class can be serialized using either:
     * - a class based netScheme
     * - an instance based netScheme
     * - completely dynamically (not implemented yet)
     *
     * @param {Object} serializer - Serializer instance
     * @param {Object} [options] - Options object
     * @param {Object} options.dataBuffer [optional] - Data buffer to write to. If null a new data buffer will be created
     * @param {Number} options.bufferOffset [optional] - The buffer data offset to start writing at. Default: 0
     * @param {Boolean} options.dry [optional] - Does not actually write to the buffer (useful to gather serializeable size)
     * @return {Object} the serialized object.  Contains attributes: dataBuffer - buffer which contains the serialized data;  bufferOffset - offset where the serialized data starts.
     */
    serialize(serializer: Serializer, options: SerializableOptions): SerializedObj {

        options = Object.assign({
            bufferOffset: 0
        }, options);

        let netScheme;
        let dataBuffer;
        let dataView;
        let classId = 0;
        let bufferOffset = options.bufferOffset;
        let localBufferOffset = 0; // used for counting the bufferOffset

        // instance classId
        // TODO: when is this.classId ever populated?
        if (this.classId) {
            classId = this.classId;
        } else {
            classId = Utils.hashStr(this.constructor.name);
        }
        
        netScheme = this.netScheme();

        // TODO: currently we serialize every node twice, once to calculate the size
        //       of the buffers and once to write them out.  This can be reduced to
        //       a single pass by starting with a large (and static) ArrayBuffer and
        //       recursively building it up.
        // buffer has one Uint8Array for class id, then payload
        if (options.dataBuffer == null && options.dry != true) {
            let bufferSize = this.serialize(serializer, { dry: true, dataBuffer: null, bufferOffset: 0 }).bufferOffset;
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

                if (netScheme[property].type === BaseTypes.String) {
                    // derive the size of the string
                    localBufferOffset += Uint16Array.BYTES_PER_ELEMENT;
                    if (this[property] !== null && this[property] !== undefined)
                        localBufferOffset += this[property].length * Uint16Array.BYTES_PER_ELEMENT;
                } else if (netScheme[property].type === BaseTypes.ClassInstance) {
                    // derive the size of the included class
                    let objectInstanceBufferOffset = this[property].serialize(serializer, { dry: true }).bufferOffset;
                    localBufferOffset += objectInstanceBufferOffset;
                } else if (netScheme[property].type === BaseTypes.List) {
                    // derive the size of the list
                    // list starts with number of elements
                    localBufferOffset += Uint16Array.BYTES_PER_ELEMENT;

                    for (let item of this[property]) {
                        // todo inelegant, currently doesn't support list of lists
                        if (netScheme[property].itemType === BaseTypes.ClassInstance) {
                            let listBufferOffset = item.serialize(serializer, { dry: true }).bufferOffset;
                            localBufferOffset += listBufferOffset;
                        } else if (netScheme[property].itemType === BaseTypes.String) {
                            // size includes string length plus double-byte characters
                            localBufferOffset += Uint16Array.BYTES_PER_ELEMENT * (1 + item.length);
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

    // build a clone of this object with pruned strings (if necessary)
    prunedStringsClone(serializer: Serializer, prevObject: Serializable) {

        if (!prevObject) return this;
        prevObject = serializer.deserialize(prevObject).obj;

        // get list of string properties which changed
        // @ts-ignore
        let netScheme = this.netScheme();
        let isString = p => netScheme[p].type === BaseTypes.String;
        let hasChanged = p => prevObject[p] !== this[p];
        let changedStrings = Object.keys(netScheme).filter(isString).filter(hasChanged);
        if (changedStrings.length == 0) return this;

        // build a clone with pruned strings
        let objectClass = serializer.registeredClasses[this.classId];
        let prunedCopy = new objectClass(null, { id: null });
        // let prunedCopy = new this.constructor(null, { id: null });
        for (let p of Object.keys(netScheme))
            prunedCopy[p] = changedStrings.indexOf(p) < 0 ? this[p] : null;

        return prunedCopy;
    }

    syncTo(other: Serializable) {
        let netScheme = this.netScheme();
        for (let p of Object.keys(netScheme)) {

            // ignore classes and lists
            if (netScheme[p].type === BaseTypes.List || netScheme[p].type === BaseTypes.ClassInstance)
                continue;

            // strings might be pruned
            if (netScheme[p].type === BaseTypes.String) {
                if (typeof other[p] === 'string') this[p] = other[p];
                continue;
            }

            // all other values are copied
            this[p] = other[p];
        }
    }

}

export default Serializable;
