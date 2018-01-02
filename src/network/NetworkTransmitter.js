'use strict';

const Serializer = require('./../serialize/Serializer');

const NetworkedEvents = require('./NetworkedEvents');
const Utils = require('./../lib/Utils');

class NetworkTransmitter {

    constructor(serializer) {
        this.serializer = serializer;

        this.serializer.registerClass(NetworkedEvents.Collection);
        this.serializer.registerClass(NetworkedEvents.SyncHeader);
        this.serializer.registerClass(NetworkedEvents.ObjectCreate);
        this.serializer.registerClass(NetworkedEvents.ObjectUpdate);
        this.serializer.registerClass(NetworkedEvents.ObjectDestroy);

        this.networkedEventCollection = new NetworkedEvents.Collection();
    }

    addNetworkedEvent(event) {
        this.networkedEventCollection.events.push(event);
        return event;
    }

    serializePayload() {
        if (this.networkedEventCollection.events.length === 0)
            return null;
        return this.networkedEventCollection.serialize(this.serializer);
    }

    deserializePayload(payload) {
        return this.serializer.deserialize(payload.dataBuffer).obj;
    }

    clearPayload() {
        this.networkedEventCollection.events = [];
    }

}

module.exports = NetworkTransmitter;
