'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Serializable = require('./../serialize/Serializable');

var _Serializable2 = _interopRequireDefault(_Serializable);

var _Utils = require('./../lib/Utils');

var _Utils2 = _interopRequireDefault(_Utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NetworkedEventFactory = function () {
    function NetworkedEventFactory(serializer, eventName, options) {
        _classCallCheck(this, NetworkedEventFactory);

        options = Object.assign({}, options);

        this.seriazlier = serializer;
        this.options = options;

        this.eventName = eventName;
        this.netScheme = options.netScheme;
    }

    /**
     * Creates a new networkedEvent
     * @param {Object} payload an object representing the payload to be transferred over the wire
     * @return {Serializable} the new networkedEvent object
     */


    _createClass(NetworkedEventFactory, [{
        key: 'create',
        value: function create(payload) {
            var networkedEvent = new _Serializable2.default();
            networkedEvent.classId = _Utils2.default.hashStr(this.eventName);

            if (this.netScheme) {
                networkedEvent.netScheme = Object.assign({}, this.netScheme);

                // copy properties from the networkedEvent instance to its ad-hoc netsScheme
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = Object.keys(this.netScheme)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var property = _step.value;

                        networkedEvent[property] = payload[property];
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            } else {
                // todo take care of the event where no netScheme is defined
            }

            return networkedEvent;
        }
    }]);

    return NetworkedEventFactory;
}();

exports.default = NetworkedEventFactory;