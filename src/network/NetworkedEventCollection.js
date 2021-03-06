import BaseTypes from '../serialize/BaseTypes';
import Serializable from '../serialize/Serializable';

/**
 * Defines a collection of NetworkEvents to be transmitted over the wire
 */
export default class NetworkedEventCollection extends Serializable {

    get netScheme() {
        return {
            events: {
                type: BaseTypes.TYPES.LIST,
                itemType: BaseTypes.TYPES.CLASSINSTANCE
            },
        };
    }

    constructor(events) {
        super();
        this.events = events || [];
    }

}
