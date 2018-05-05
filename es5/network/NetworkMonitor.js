'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _eventemitter = require('eventemitter3');

var _eventemitter2 = _interopRequireDefault(_eventemitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Measures network performance between the client and the server
 * Represents both the client and server portions of NetworkMonitor
 */
var NetworkMonitor = function () {
    function NetworkMonitor() {
        _classCallCheck(this, NetworkMonitor);

        // mixin for EventEmitter
        Object.assign(this, _eventemitter2.default.prototype);
    }

    // client


    _createClass(NetworkMonitor, [{
        key: 'registerClient',
        value: function registerClient(clientEngine) {
            this.queryIdCounter = 0;
            this.RTTQueries = {};

            this.movingRTTAverage = 0;
            this.movingRTTAverageFrame = [];
            this.movingFPSAverageSize = clientEngine.options.healthCheckRTTSample;
            this.clientEngine = clientEngine;
            clientEngine.socket.on("RTTResponse", this.onReceivedRTTQuery.bind(this));
            setInterval(this.sendRTTQuery.bind(this), clientEngine.options.healthCheckInterval);
        }
    }, {
        key: 'sendRTTQuery',
        value: function sendRTTQuery() {
            // todo implement cleanup of older timestamp
            this.RTTQueries[this.queryIdCounter] = new Date().getTime();
            this.clientEngine.socket.emit('RTTQuery', this.queryIdCounter);
            this.queryIdCounter++;
        }
    }, {
        key: 'onReceivedRTTQuery',
        value: function onReceivedRTTQuery(queryId) {
            var RTT = new Date().getTime() - this.RTTQueries[queryId];

            this.movingRTTAverageFrame.push(RTT);
            if (this.movingRTTAverageFrame.length > this.movingFPSAverageSize) {
                this.movingRTTAverageFrame.shift();
            }
            this.movingRTTAverage = this.movingRTTAverageFrame.reduce(function (a, b) {
                return a + b;
            }) / this.movingRTTAverageFrame.length;
            this.emit('RTTUpdate', {
                RTT: RTT,
                RTTAverage: this.movingRTTAverage
            });
        }

        // server

    }, {
        key: 'registerPlayerOnServer',
        value: function registerPlayerOnServer(socket) {
            socket.on('RTTQuery', this.respondToRTTQuery.bind(this, socket));
        }
    }, {
        key: 'respondToRTTQuery',
        value: function respondToRTTQuery(socket, queryId) {
            socket.emit("RTTResponse", queryId);
        }
    }]);

    return NetworkMonitor;
}();

exports.default = NetworkMonitor;