import BaseTypes from '../serialize/BaseTypes';

import NetworkedEventFactory from './NetworkedEventFactory';
import NetworkedEventCollection from './NetworkedEventCollection';
import Utils from './../lib/Utils';

export default class NetworkTransmitter {

    constructor(serializer) {
        this.serializer = serializer;

        this.registeredEvents = [];

        this.serializer.registerClass(NetworkedEventCollection);

        this.registerNetworkedEventFactory('objectUpdate', {
            netScheme: {
                stepCount: { type: BaseTypes.TYPES.INT32 },
                objectInstance: { type: BaseTypes.TYPES.CLASSINSTANCE }
            }
        });

        this.registerNetworkedEventFactory('objectCreate', {
            netScheme: {
                stepCount: { type: BaseTypes.TYPES.INT32 },
                objectInstance: { type: BaseTypes.TYPES.CLASSINSTANCE }
            }
        });

        this.registerNetworkedEventFactory('objectDestroy', {
            netScheme: {
                stepCount: { type: BaseTypes.TYPES.INT32 },
                objectInstance: { type: BaseTypes.TYPES.CLASSINSTANCE }
            }
        });

        this.registerNetworkedEventFactory('syncHeader', {
            netScheme: {
                stepCount: { type: BaseTypes.TYPES.INT32 },
                fullUpdate: { type: BaseTypes.TYPES.UINT8 }
            }
        });

        this.networkedEventCollection = new NetworkedEventCollection();
    }

    registerNetworkedEventFactory(eventName, options) {
        options = Object.assign({}, options);

        let classHash = Utils.hashStr(eventName);

        let networkedEventPrototype = function() {};
        networkedEventPrototype.prototype.classId = classHash;
        networkedEventPrototype.prototype.eventName = eventName;
        networkedEventPrototype.netScheme = options.netScheme;

        this.serializer.registerClass(networkedEventPrototype, classHash);

        this.registeredEvents[eventName] = new NetworkedEventFactory(this.serializer, eventName, options);
    }

    addNetworkedEvent(eventName, payload) {
        if (!this.registeredEvents[eventName]) {
            console.error(`NetworkTransmitter: no such event ${eventName}`);
            return null;
        }

        let stagedNetworkedEvent = this.registeredEvents[eventName].create(payload);
        this.networkedEventCollection.events.push(stagedNetworkedEvent);

        return stagedNetworkedEvent;
    }

    serializePayload() {
        if (this.networkedEventCollection.events.length === 0)
            return null;

        let dataBuffer = this.networkedEventCollection.serialize(this.serializer);

        return dataBuffer;
    }

    deserializePayload(payload) {
        return this.serializer.deserialize(payload.dataBuffer).obj;
    }

    clearPayload() {
        this.networkedEventCollection.events = [];
    }

}
