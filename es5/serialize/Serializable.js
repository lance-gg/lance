'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Utils = require('./../lib/Utils');

var _Utils2 = _interopRequireDefault(_Utils);

var _BaseTypes = require('./BaseTypes');

var _BaseTypes2 = _interopRequireDefault(_BaseTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Serializable = function () {
    function Serializable() {
        _classCallCheck(this, Serializable);
    }

    _createClass(Serializable, [{
        key: 'serialize',

        /**
         *  Class can be serialized using either:
         * - a class based netScheme
         * - an instance based netScheme
         * - completely dynamically (not implemented yet)
         *
         * @param {Object} serializer - Serializer instance
         * @param {Object} [options] - Options object
         * @param {Object} options.dataBuffer [optional] - Data buffer to write to. If null a new data buffer will be created
         * @param {Number} options.bufferOffset [optional] - The buffer data offset to start writing at. Default: 0
         * @param {String} options.dry [optional] - Does not actually write to the buffer (useful to gather serializeable size)
         * @return {Object} the serialized object.  Contains attributes: dataBuffer - buffer which contains the serialized data;  bufferOffset - offset where the serialized data starts.
         */
        value: function serialize(serializer, options) {
            options = Object.assign({
                bufferOffset: 0
            }, options);

            var netScheme = void 0;
            var dataBuffer = void 0;
            var dataView = void 0;
            var classId = 0;
            var bufferOffset = options.bufferOffset;
            var localBufferOffset = 0; // used for counting the bufferOffset

            // instance classId
            if (this.classId) {
                classId = this.classId;
            } else {
                classId = _Utils2.default.hashStr(this.constructor.name);
            }

            // instance netScheme
            if (this.netScheme) {
                netScheme = this.netScheme;
            } else if (this.constructor.netScheme) {
                netScheme = this.constructor.netScheme;
            } else {
                // todo define behaviour when a netScheme is undefined
                console.warn('no netScheme defined! This will result in awful performance');
            }

            // TODO: currently we serialize every node twice, once to calculate the size
            //       of the buffers and once to write them out.  This can be reduced to
            //       a single pass by starting with a large (and static) ArrayBuffer and
            //       recursively building it up.
            // buffer has one Uint8Array for class id, then payload
            if (options.dataBuffer == null && options.dry != true) {
                var bufferSize = this.serialize(serializer, { dry: true }).bufferOffset;
                dataBuffer = new ArrayBuffer(bufferSize);
            } else {
                dataBuffer = options.dataBuffer;
            }

            if (options.dry != true) {
                dataView = new DataView(dataBuffer);
                // first set the id of the class, so that the deserializer can fetch information about it
                dataView.setUint8(bufferOffset + localBufferOffset, classId);
            }

            // advance the offset counter
            localBufferOffset += Uint8Array.BYTES_PER_ELEMENT;

            if (netScheme) {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = Object.keys(netScheme).sort()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var property = _step.value;


                        // write the property to buffer
                        if (options.dry != true) {
                            serializer.writeDataView(dataView, this[property], bufferOffset + localBufferOffset, netScheme[property]);
                        }

                        if (netScheme[property].type === _BaseTypes2.default.TYPES.STRING) {
                            // derive the size of the string
                            localBufferOffset += Uint16Array.BYTES_PER_ELEMENT;
                            if (this[property] !== null) localBufferOffset += this[property].length * Uint16Array.BYTES_PER_ELEMENT;
                        } else if (netScheme[property].type === _BaseTypes2.default.TYPES.CLASSINSTANCE) {
                            // derive the size of the included class
                            var objectInstanceBufferOffset = this[property].serialize(serializer, { dry: true }).bufferOffset;
                            localBufferOffset += objectInstanceBufferOffset;
                        } else if (netScheme[property].type === _BaseTypes2.default.TYPES.LIST) {
                            // derive the size of the list
                            // list starts with number of elements
                            localBufferOffset += Uint16Array.BYTES_PER_ELEMENT;

                            var _iteratorNormalCompletion2 = true;
                            var _didIteratorError2 = false;
                            var _iteratorError2 = undefined;

                            try {
                                for (var _iterator2 = this[property][Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                    var item = _step2.value;

                                    // todo inelegant, currently doesn't support list of lists
                                    if (netScheme[property].itemType === _BaseTypes2.default.TYPES.CLASSINSTANCE) {
                                        var listBufferOffset = item.serialize(serializer, { dry: true }).bufferOffset;
                                        localBufferOffset += listBufferOffset;
                                    } else if (netScheme[property].itemType === _BaseTypes2.default.TYPES.STRING) {
                                        // size includes string length plus double-byte characters
                                        localBufferOffset += Uint16Array.BYTES_PER_ELEMENT * (1 + item.length);
                                    } else {
                                        localBufferOffset += serializer.getTypeByteSize(netScheme[property].itemType);
                                    }
                                }
                            } catch (err) {
                                _didIteratorError2 = true;
                                _iteratorError2 = err;
                            } finally {
                                try {
                                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                        _iterator2.return();
                                    }
                                } finally {
                                    if (_didIteratorError2) {
                                        throw _iteratorError2;
                                    }
                                }
                            }
                        } else {
                            // advance offset
                            localBufferOffset += serializer.getTypeByteSize(netScheme[property].type);
                        }
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
                // TODO no netScheme, dynamic class
            }

            return { dataBuffer: dataBuffer, bufferOffset: localBufferOffset };
        }

        // build a clone of this object with pruned strings (if necessary)

    }, {
        key: 'prunedStringsClone',
        value: function prunedStringsClone(serializer, prevObject) {
            var _this = this;

            if (!prevObject) return this;
            prevObject = serializer.deserialize(prevObject).obj;

            // get list of string properties which changed
            var netScheme = this.constructor.netScheme;
            var isString = function isString(p) {
                return netScheme[p].type === _BaseTypes2.default.TYPES.STRING;
            };
            var hasChanged = function hasChanged(p) {
                return prevObject[p] !== _this[p];
            };
            var changedStrings = Object.keys(netScheme).filter(isString).filter(hasChanged);
            if (changedStrings.length == 0) return this;

            // build a clone with pruned strings
            var prunedCopy = new this.constructor(null, { id: null });
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = Object.keys(netScheme)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var p = _step3.value;

                    prunedCopy[p] = changedStrings.indexOf(p) < 0 ? this[p] : null;
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }

            return prunedCopy;
        }
    }, {
        key: 'syncTo',
        value: function syncTo(other) {
            var netScheme = this.constructor.netScheme;
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = Object.keys(netScheme)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var p = _step4.value;


                    // ignore classes and lists
                    if (netScheme[p].type === _BaseTypes2.default.TYPES.LIST || netScheme[p].type === _BaseTypes2.default.TYPES.CLASSINSTANCE) continue;

                    // strings might be pruned
                    if (netScheme[p].type === _BaseTypes2.default.TYPES.STRING) {
                        if (typeof other[p] === 'string') this[p] = other[p];
                        continue;
                    }

                    // all other values are copied
                    this[p] = other[p];
                }
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }
        }
    }]);

    return Serializable;
}();

exports.default = Serializable;