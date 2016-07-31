"use strict";

const Serializable= require('./../serialize/Serializable');
const Serializer= require('./../serialize/Serializer');

const NetworkedEventFactory = require('./NetworkedEventFactory');
const Utils = require('./../Utils');

class NetworkTransmitter{

    constructor(serializer){
        this.serializer = serializer;

        this.registeredEvents=[];

        this.payload = [];

        this.registerNetworkedEventFactory("objectUpdate", {
            objectPayload: true
        });

        this.registerNetworkedEventFactory("objectCreate", {
            netScheme: {
                id: { type: Serializer.TYPES.UINT8 },
                x: { type: Serializer.TYPES.INT16 },
                y: { type: Serializer.TYPES.INT16 }
            }
        });
    }


    registerNetworkedEventFactory(eventName, options){
        options = Object.assign({}, options);

        this.registeredEvents[eventName] = new NetworkedEventFactory(this.serializer, eventName, options);
    }

    addNetworkedEvent(eventName, payload){
        let stagedNetworkedEvent = this.registeredEvents[eventName].create(payload);
        this.payload.push(stagedNetworkedEvent);

        //todo increment payload buffer size?
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

modules.exports = NetworkTransmitter;