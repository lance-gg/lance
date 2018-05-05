'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Serializer = require('./../serialize/Serializer');

var _Serializer2 = _interopRequireDefault(_Serializer);

var _NetworkedEventFactory = require('./NetworkedEventFactory');

var _NetworkedEventFactory2 = _interopRequireDefault(_NetworkedEventFactory);

var _NetworkedEventCollection = require('./NetworkedEventCollection');

var _NetworkedEventCollection2 = _interopRequireDefault(_NetworkedEventCollection);

var _Utils = require('./../lib/Utils');

var _Utils2 = _interopRequireDefault(_Utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NetworkTransmitter = function () {
    function NetworkTransmitter(serializer) {
        _classCallCheck(this, NetworkTransmitter);

        this.serializer = serializer;

        this.registeredEvents = [];

        this.serializer.registerClass(_NetworkedEventCollection2.default);

        this.registerNetworkedEventFactory('objectUpdate', {
            netScheme: {
                stepCount: { type: _Serializer2.default.TYPES.INT32 },
                objectInstance: { type: _Serializer2.default.TYPES.CLASSINSTANCE }
            }
        });

        this.registerNetworkedEventFactory('objectCreate', {
            netScheme: {
                stepCount: { type: _Serializer2.default.TYPES.INT32 },
                objectInstance: { type: _Serializer2.default.TYPES.CLASSINSTANCE }
            }
        });

        this.registerNetworkedEventFactory('objectDestroy', {
            netScheme: {
                stepCount: { type: _Serializer2.default.TYPES.INT32 },
                objectInstance: { type: _Serializer2.default.TYPES.CLASSINSTANCE }
            }
        });

        this.registerNetworkedEventFactory('syncHeader', {
            netScheme: {
                stepCount: { type: _Serializer2.default.TYPES.INT32 },
                fullUpdate: { type: _Serializer2.default.TYPES.UINT8 }
            }
        });

        this.networkedEventCollection = new _NetworkedEventCollection2.default();
    }

    _createClass(NetworkTransmitter, [{
        key: 'registerNetworkedEventFactory',
        value: function registerNetworkedEventFactory(eventName, options) {
            options = Object.assign({}, options);

            var classHash = _Utils2.default.hashStr(eventName);

            var networkedEventPrototype = function networkedEventPrototype() {};
            networkedEventPrototype.prototype.classId = classHash;
            networkedEventPrototype.prototype.eventName = eventName;
            networkedEventPrototype.netScheme = options.netScheme;

            this.serializer.registerClass(networkedEventPrototype, classHash);

            this.registeredEvents[eventName] = new _NetworkedEventFactory2.default(this.serializer, eventName, options);
        }
    }, {
        key: 'addNetworkedEvent',
        value: function addNetworkedEvent(eventName, payload) {
            if (!this.registeredEvents[eventName]) {
                console.error('NetworkTransmitter: no such event ' + eventName);
                return null;
            }

            var stagedNetworkedEvent = this.registeredEvents[eventName].create(payload);
            this.networkedEventCollection.events.push(stagedNetworkedEvent);

            return stagedNetworkedEvent;
        }
    }, {
        key: 'serializePayload',
        value: function serializePayload() {
            if (this.networkedEventCollection.events.length === 0) return null;

            var dataBuffer = this.networkedEventCollection.serialize(this.serializer);

            return dataBuffer;
        }
    }, {
        key: 'deserializePayload',
        value: function deserializePayload(payload) {
            return this.serializer.deserialize(payload.dataBuffer).obj;
        }
    }, {
        key: 'clearPayload',
        value: function clearPayload() {
            this.networkedEventCollection.events = [];
        }
    }]);

    return NetworkTransmitter;
}();

exports.default = NetworkTransmitter;