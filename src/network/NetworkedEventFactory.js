"use strict";


const Serializer = require('./../serialize/Serializer');
const Serializable = require('./../serialize/Serializable');
const Utils = require('./../Utils');

class NetworkedEventFactory {

    constructor(serializer, eventName, options){
        options = Object.assign({}, options);

        this.seriazlier = serializer;
        this.options = options;

        this.eventName = eventName;
        this.netScheme = options.netScheme;

    }

    /**
     * Creates a new networkedEvent
     * @param payload an object representing the payload to be transferred over the wire
     * @returns {Serializable} the new networkedEvent object
     */
    create(payload){
        let networkedEvent = new Serializable();
        networkedEvent.classId = Utils.hashStr(this.eventName);


        if (this.netScheme) {
            networkedEvent.netScheme = Object.assign({}, this.netScheme);

            //copy properties from the networkedEvent instance to its ad-hoc netsScheme
            for(let property of Object.keys(this.netScheme)){
                networkedEvent[property] = payload[property];
            }

            //assign classIds to the netScheme, discover netSchemeBuffersize (since the event is dynamic)
            for(let property of Object.keys(this.netScheme)){
                if (this.netScheme[property].type == Serializer.TYPES.CLASSINSTANCE){
                    //assign the proper classId to the netScheme
                    networkedEvent.netScheme[property].classId = Utils.hashStr(networkedEvent[property].class.name);
                }
            }
            networkedEvent.netSchemeBufferSize = Uint8Array.BYTES_PER_ELEMENT + this.seriazlier.getNetSchemeBufferSize(this.netScheme);
        }
        else{
            //todo take care of the event where no netScheme is defined

        }


        return networkedEvent;
    };


}

module.exports = NetworkedEventFactory;