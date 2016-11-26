"use strict";

/**
 * Represents both the client and server portions of NetworkMonitor
 */
class NetworkMonitor {

    constructor(){
    }

    //client

    registerClient(clientEngine){
        this.queryIdCounter = 0;
        this.RTTQueries = {};

        this.movingRTTAverage = 0;
        this.movingRTTAverageFrame=[];
        this.movingFPSAverageSize = 10; //todo should be configurable

        this.clientEngine = clientEngine;
        clientEngine.socket.on("RTTResponse", this.onReceivedRTTQuery.bind(this));
        setInterval(this.sendRTTQuery.bind(this), 1000); //todo should be configurable

    }

    sendRTTQuery(){
        //todo implement cleanup of older timestamp
        this.RTTQueries[this.queryIdCounter] = new Date().getTime();
        this.clientEngine.socket.emit('RTTQuery', this.queryIdCounter);
        this.queryIdCounter++;
    }

    onReceivedRTTQuery(queryId){
        let RTT = (new Date().getTime()) - this.RTTQueries[queryId];

        this.movingRTTAverageFrame.push(RTT);
        if (this.movingRTTAverageFrame.length > this.movingFPSAverageSize){
            this.movingRTTAverageFrame.shift();
        }
        this.movingRTTAverage = this.movingRTTAverageFrame.reduce(sumArray)/this.movingRTTAverageFrame.length;

        // console.log(RTT, this.movingRTTAverage);
    }

    //server

    registerPlayerOnServer(socket){
        socket.on('RTTQuery', this.respondToRTTQuery.bind(this,socket));
    }

    respondToRTTQuery(socket,queryId){
        socket.emit("RTTResponse", queryId);
    }


}

function sumArray(a, b) {
    return a + b;
};

module.exports = NetworkMonitor;