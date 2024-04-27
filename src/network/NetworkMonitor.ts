import EventEmitter from 'event-emitter';
import http from 'http';
import { ClientEngine } from '../ClientEngine.js';
import { Socket } from 'socket.io-client';

/**
 * Measures network performance between the client and the server
 * Represents both the client and server portions of NetworkMonitor
 */
export default class NetworkMonitor {

    public emit: (event: string, arg?: any) => void; 
    public on: (event: string, handler: any) => void;
    public once: (event: string, handler: any) => void;
    private queryIdCounter: number;
    private RTTQueries: { [key: number]: number};
    private movingRTTAverage: number;
    private movingRTTAverageFrame: number[];
    private movingFPSAverageSize: number;
    private clientEngine: ClientEngine;

    constructor() {

        // mixin for EventEmitter
        let eventEmitter = EventEmitter();
        this.on = eventEmitter.on;
        this.once = eventEmitter.once;
        this.emit = eventEmitter.emit;
    }

    // client
    registerClient(clientEngine: ClientEngine) {
        this.queryIdCounter = 0;
        this.RTTQueries = {};

        this.movingRTTAverage = 0;
        this.movingRTTAverageFrame = [];
        this.movingFPSAverageSize = clientEngine.options.healthCheckRTTSample;
        this.clientEngine = clientEngine;
        clientEngine.socket.on('RTTResponse', this.onReceivedRTTQuery.bind(this));
        setInterval(this.sendRTTQuery.bind(this), clientEngine.options.healthCheckInterval);
    }

    sendRTTQuery() {
        // todo implement cleanup of older timestamp
        this.RTTQueries[this.queryIdCounter] = new Date().getTime();
        this.clientEngine.socket.emit('RTTQuery', this.queryIdCounter);
        this.queryIdCounter++;
    }

    onReceivedRTTQuery(queryId: number) {
        let RTT = (new Date().getTime()) - this.RTTQueries[queryId];

        this.movingRTTAverageFrame.push(RTT);
        if (this.movingRTTAverageFrame.length > this.movingFPSAverageSize) {
            this.movingRTTAverageFrame.shift();
        }
        this.movingRTTAverage = this.movingRTTAverageFrame.reduce((a, b) => a + b) / this.movingRTTAverageFrame.length;
        this.emit('RTTUpdate', {
            RTT: RTT,
            RTTAverage: this.movingRTTAverage
        });
    }

    // server
    registerPlayerOnServer(socket: Socket) {
        socket.on('RTTQuery', this.respondToRTTQuery.bind(this, socket));
    }

    respondToRTTQuery(socket: Socket, queryId: number) {
        socket.emit('RTTResponse', queryId);
    }

}
