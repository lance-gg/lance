'use strict';

const Serializer = require('./../serialize/Serializer');

const NetworkedEventFactory = require('./NetworkedEventFactory');
const NetworkedEventCollection = require('./NetworkedEventCollection');
const Utils = require('./../lib/Utils');

class NetworkTransmitter {

    constructor(serializer) {
        this.serializer = serializer;

        this.registeredEvents = [];

        this.payload = [];

        this.serializer.registerClass(NetworkedEventCollection);

        this.registerNetworkedEventFactory('objectUpdate', {
            netScheme: {
                stepCount: { type: Serializer.TYPES.INT32 },
                objectInstance: { type: Serializer.TYPES.CLASSINSTANCE }
            }
        });

        this.registerNetworkedEventFactory('objectCreate', {
            netScheme: {
                stepCount: { type: Serializer.TYPES.INT32 },
                objectInstance: { type: Serializer.TYPES.CLASSINSTANCE }
            }
        });

        this.registerNetworkedEventFactory('objectDestroy', {
            netScheme: {
                stepCount: { type: Serializer.TYPES.INT32 },
                objectInstance: { type: Serializer.TYPES.CLASSINSTANCE }
            }
        });

        this.registerNetworkedEventFactory('syncHeader', {
            netScheme: {
                stepCount: { type: Serializer.TYPES.INT32 }
            }
        });
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
        this.payload.push(stagedNetworkedEvent);

        return stagedNetworkedEvent;
    }

    serializePayload() {
        if (this.payload.length === 0)
            return null;

        let networkedEventCollection = new NetworkedEventCollection(this.payload);
        let dataBuffer = networkedEventCollection.serialize(this.serializer);

        return dataBuffer;
    }

    deserializePayload(payload) {
        return this.serializer.deserialize(payload.dataBuffer).obj;
    }

    clearPayload() {
        this.payload = [];
    }

}

module.exports = NetworkTransmitter;
