import BaseTypes from '../serialize/BaseTypes.js';
import NetworkedEventCollection from './NetworkedEventCollection.js';
import Serializer from '../serialize/Serializer.js';
import Serializable from '../serialize/Serializable.js';


class ObjectUpdate extends Serializable {
    stepCount: number;
    objectInstance: Serializable;

    netScheme() {
        return {
            stepCount: { type: BaseTypes.Int32 },
            objectInstance: { type: BaseTypes.ClassInstance }
        };
    }
    constructor(stepCount: number, objectInstance: Serializable) {
        super();
        this.stepCount = stepCount;
        this.objectInstance = objectInstance;
    }
}

class ObjectCreate extends Serializable {
    stepCount: number;
    objectInstance: Serializable;

    netScheme() {
        return {
            stepCount: { type: BaseTypes.Int32 },
            objectInstance: { type: BaseTypes.ClassInstance }
        }
    }
    constructor(stepCount: number, objectInstance: Serializable) {
        super();
        this.stepCount = stepCount;
        this.objectInstance = objectInstance;
    }
}

class ObjectDestroy extends Serializable {
    stepCount: number;
    objectInstance: Serializable;

    netScheme() {
        return {
            stepCount: { type: BaseTypes.Int32 },
            objectInstance: { type: BaseTypes.ClassInstance }
        }
    }
    constructor(stepCount: number, objectInstance: Serializable) {
        super();
        this.stepCount = stepCount;
        this.objectInstance = objectInstance;
    }
}

class SyncHeader extends Serializable {
    stepCount: number;
    fullUpdate: number;
    netScheme() {
        return {
            stepCount: { type: BaseTypes.Int32 },
            fullUpdate: { type: BaseTypes.Int8 }
        }
    }
    constructor(stepCount: number, fullUpdate: number) {
        super();
        this.stepCount = stepCount;
        this.fullUpdate = fullUpdate;
    }
}

export default class NetworkTransmitter {

    private serializer: Serializer;
    private networkedEventCollection: NetworkedEventCollection;


    constructor(serializer: Serializer) {
        this.serializer = serializer;
        this.serializer.registerClass(NetworkedEventCollection);
        this.serializer.registerClass(ObjectUpdate);
        this.serializer.registerClass(ObjectCreate);
        this.serializer.registerClass(ObjectDestroy);
        this.serializer.registerClass(SyncHeader);
        this.networkedEventCollection = new NetworkedEventCollection([]);
    }

    sendUpdate(stepCount: number, obj: Serializable) {
        this.networkedEventCollection.events.push(new ObjectUpdate(stepCount, obj));
    }

    sendCreate(stepCount: number, obj: Serializable) {
        this.networkedEventCollection.events.push(new ObjectCreate(stepCount, obj));
    }

    sendDestroy(stepCount: number, obj: Serializable) {
        this.networkedEventCollection.events.push(new ObjectDestroy(stepCount, obj));
    }

    syncHeader(stepCount: number, fullUpdate: number) {
        this.networkedEventCollection.events.push(new SyncHeader(stepCount, fullUpdate));
    }


    serializePayload() {
        if (this.networkedEventCollection.events.length === 0)
            return null;

        let dataBuffer = this.networkedEventCollection.serialize(this.serializer, { dry: false, dataBuffer: null, bufferOffset: 0 });

        return dataBuffer;
    }

    deserializePayload(payload) {
        return this.serializer.deserialize(payload.dataBuffer, 0).obj;
    }

    clearPayload() {
        this.networkedEventCollection.events = [];
    }

    // TODO: there must be a better way than this
    static getNetworkEvent(event: Serializable): string {
        if (event instanceof ObjectUpdate) return 'objectUpdate';
        else if (event instanceof ObjectCreate) return 'objectCreate';
        else if (event instanceof ObjectDestroy) return 'objectDestroy';
        else if (event instanceof SyncHeader) return 'syncHeader';
        return 'unknown'; // raise an error here
    }

}
