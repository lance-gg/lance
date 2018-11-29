import Utils from './../lib/Utils';
import BaseTypes from './BaseTypes';

class Serializable {
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
     * @param {String} options.dry [optional] - Does not actually write to the buffer (useful to gather serializeable size)
     * @return {Object} the serialized object.  Contains attributes: dataBuffer - buffer which contains the serialized data;  bufferOffset - offset where the serialized data starts.
     */
    serialize(serializer, options) {
        return serializer.serialize(this, options)
    }

    // build a clone of this object with pruned strings (if necessary)
    prunedStringsClone(serializer, prevObject) {

        if (!prevObject) return this;
        prevObject = serializer.deserialize(prevObject).obj;

        // get list of string properties which changed
        let netScheme = this.constructor.netScheme;
        let isString = p => netScheme[p].type === BaseTypes.TYPES.STRING;
        let hasChanged = p => prevObject[p] !== this[p];
        let changedStrings = Object.keys(netScheme).filter(isString).filter(hasChanged);
        if (changedStrings.length == 0) return this;

        // build a clone with pruned strings
        let prunedCopy = new this.constructor(null, { id: null });
        for (let p of Object.keys(netScheme))
            prunedCopy[p] = changedStrings.indexOf(p) < 0 ? this[p] : null;

        return prunedCopy;
    }

    syncTo(other) {
        let netScheme = this.constructor.netScheme;
        for (let p of Object.keys(netScheme)) {

            // ignore classes and lists
            if (netScheme[p].type === BaseTypes.TYPES.LIST || netScheme[p].type === BaseTypes.TYPES.CLASSINSTANCE)
                continue;

            // strings might be pruned
            if (netScheme[p].type === BaseTypes.TYPES.STRING) {
                if (typeof other[p] === 'string') this[p] = other[p];
                continue;
            }

            // all other values are copied
            this[p] = other[p];
        }
    }

}

export default Serializable;
