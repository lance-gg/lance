"use strict";


const Serializable= require('./../serialize/Serializable');
const Utils= require('./../Utils');

class NetworkedEventFactory extends Serializable {

    constructor(serializer, eventName, netScheme){
        this.seriazlier = serializer;
        this.eventName = eventName;
        this.netScheme = netScheme;
        this.netSchemeBufferSize = this.seriazlier.getNetSchemeBufferSize(this.netScheme);
    }

    create(payload){
        let networkedEvent = new Serializable();
        networkedEvent.netScheme = this.netScheme;
        networkedEvent.netSchemeBufferSize = this.netSchemeBufferSize;

        for(let property of Object.keys(this.netScheme)){
            networkedEvent[property] = payload[property];
        }

        networkedEvent.classId = Utils.hashString(this.eventName);

        //todo take care of the event where no netScheme is defined
    };

    deserialize(){

    }


}

module.exports = NetworkedEventFactory;