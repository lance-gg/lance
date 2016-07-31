"use strict";


const Serializable = require('./../serialize/Serializable');
const Utils = require('./../Utils');

class NetworkedEventFactory {

    constructor(serializer, eventName, options){
        options = Object.assign({}, options);

        this.seriazlier = serializer;
        this.options = options;

        this.eventName = eventName;
        this.netScheme = options.netScheme;

        if (this.netScheme) {
            this.netSchemeBufferSize = Uint8Array.BYTES_PER_ELEMENT + this.seriazlier.getNetSchemeBufferSize(this.netScheme);
        }

    }

    create(payload){
        let networkedEvent = new Serializable();
        networkedEvent.classId = Utils.hashStr(this.eventName);
        networkedEvent.netScheme = this.netScheme;
        networkedEvent.netSchemeBufferSize = this.netSchemeBufferSize;

        for(let property of Object.keys(this.netScheme)){
            networkedEvent[property] = payload[property];
        }

        //todo take care of the event where no netScheme is defined
        return networkedEvent;
    };


}

module.exports = NetworkedEventFactory;