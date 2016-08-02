"use strict";

const Serializer= require('./../serialize/Serializer');

const NetworkedEventFactory = require('./NetworkedEventFactory');
const Utils = require('./../Utils');

class NetworkTransmitter{

    constructor(serializer){
        this.serializer = serializer;

        this.registeredEvents=[];

        this.payload = [];

        this.registerNetworkedEventFactory("objectUpdate", {
            netScheme: {
                stepCount: { type: Serializer.TYPES.INT32 },
                objectInstance: { type: Serializer.TYPES.CLASSINSTANCE }
            }
        });

        this.registerNetworkedEventFactory("objectCreate", {
            netScheme: {
                stepCount: { type: Serializer.TYPES.INT32 },
                id: { type: Serializer.TYPES.UINT8 },
                x: { type: Serializer.TYPES.INT16 },
                y: { type: Serializer.TYPES.INT16 }
            }
        });

        this.registerNetworkedEventFactory("objectDestroy", {
            netScheme: {
                stepCount: { type: Serializer.TYPES.INT32 },
                id: { type: Serializer.TYPES.UINT8 }
            }
        });
    }


    registerNetworkedEventFactory(eventName, options){
        options = Object.assign({}, options);

        let networkedEventPrototype = function(){};
        networkedEventPrototype.netScheme = options.netScheme;

        this.serializer.registerClass(networkedEventPrototype, Utils.hashStr(eventName));

        this.registeredEvents[eventName] = new NetworkedEventFactory(this.serializer, eventName, options);;
    }

    addNetworkedEvent(eventName, payload){
        if (this.registeredEvents[eventName]) {

            let stagedNetworkedEvent = this.registeredEvents[eventName].create(payload);
            this.payload.push(stagedNetworkedEvent);

            return stagedNetworkedEvent;
        }
        else{
            console.error(`NetworkTransmitter: no such event ${eventName}`);
        }
    }

    serializePayload(){
        let bufferSize = 0;
        let bufferOffset = 0;

        //count the size of the required dataBuffer for the payload
        for (let stagedNetworkedEvent of this.payload){
            bufferSize += stagedNetworkedEvent.getBufferSize();
        }

        //write to dataBuffer
        let dataBuffer = new ArrayBuffer(bufferSize);
        for (let stagedNetworkedEvent of this.payload) {
            stagedNetworkedEvent.serialize(this.serializer, dataBuffer, bufferOffset);

            bufferOffset += stagedNetworkedEvent.getBufferSize();
        }

        return dataBuffer;
    }

    clearPayload(){
        this.payload = [];
    }

}

module.exports = NetworkTransmitter;