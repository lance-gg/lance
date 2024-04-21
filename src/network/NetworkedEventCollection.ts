import BaseTypes from '../serialize/BaseTypes.js';
import Serializable from '../serialize/Serializable.js';

/**
 * Defines a collection of NetworkEvents to be transmitted over the wire
 */
export default class NetworkedEventCollection extends Serializable {
    public events: Serializable[];

    netScheme() {
        return {
            events: {
                type: BaseTypes.List,
                itemType: BaseTypes.ClassInstance
            },
        };
    }

    constructor(events: Serializable[]) {
        super();
        this.events = events;
    }

}
