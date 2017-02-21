'use strict';

const Serializer = require('./../serialize/Serializer');
const Serializable = require('./../serialize/Serializable');

/**
 * Defines a collection of NetworkEvents to be transmitted over the wire
 */
class NetworkedEventCollection extends Serializable {

    static get netScheme() {
        return {
            events: {
                type: Serializer.TYPES.LIST,
                itemType: Serializer.TYPES.CLASSINSTANCE
            },
        };
    }

    constructor(events) {
        super();
        this.events = events;
    }

}

module.exports = NetworkedEventCollection;
