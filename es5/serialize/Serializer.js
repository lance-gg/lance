'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Utils = require('./../lib/Utils');

var _Utils2 = _interopRequireDefault(_Utils);

var _TwoVector = require('./TwoVector');

var _TwoVector2 = _interopRequireDefault(_TwoVector);

var _ThreeVector = require('./ThreeVector');

var _ThreeVector2 = _interopRequireDefault(_ThreeVector);

var _Quaternion = require('./Quaternion');

var _Quaternion2 = _interopRequireDefault(_Quaternion);

var _BaseTypes = require('./BaseTypes');

var _BaseTypes2 = _interopRequireDefault(_BaseTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MAX_UINT_16 = 0xFFFF;

/**
 * The Serializer is responsible for serializing the game world and its
 * objects on the server, before they are sent to each client.  On the client side the
 * Serializer deserializes these objects.
 *
 */

var Serializer = function () {
    function Serializer() {
        _classCallCheck(this, Serializer);

        this.registeredClasses = {};
        this.customTypes = {};
        this.registerClass(_TwoVector2.default);
        this.registerClass(_ThreeVector2.default);
        this.registerClass(_Quaternion2.default);
    }

    /**
     * Adds a custom primitive to the serializer instance.
     * This will enable you to use it in an object's netScheme
     * @param customType
     */
    // TODO: the function below is not used, and it is not clear what that
    // first argument is supposed to be


    _createClass(Serializer, [{
        key: 'addCustomType',
        value: function addCustomType(customType) {
            this.customTypes[customType.type] = customType;
        }

        /**
         * Checks if type can be assigned by value.
         * @param {String} type Type to Checks
         * @return {Boolean} True if type can be assigned
         */

    }, {
        key: 'registerClass',


        /**
         * Registers a new class with the serializer, so it may be deserialized later
         * @param {Function} classObj reference to the class (not an instance!)
         * @param {String} classId Unit specifying a class ID
         */
        value: function registerClass(classObj, classId) {
            // if no classId is specified, hash one from the class name
            classId = classId ? classId : _Utils2.default.hashStr(classObj.name);
            if (this.registeredClasses[classId]) {
                console.error('Serializer: accidental override of classId ' + classId + ' when registering class', classObj);
            }

            this.registeredClasses[classId] = classObj;
        }
    }, {
        key: 'deserialize',
        value: function deserialize(dataBuffer, byteOffset) {
            byteOffset = byteOffset ? byteOffset : 0;
            var localByteOffset = 0;

            var dataView = new DataView(dataBuffer);

            var objectClassId = dataView.getUint8(byteOffset + localByteOffset);

            // todo if classId is 0 - take care of dynamic serialization.
            var objectClass = this.registeredClasses[objectClassId];
            if (objectClass == null) {
                console.error('Serializer: Found a class which was not registered.  Please use serializer.registerClass() to register all serialized classes.');
            }

            localByteOffset += Uint8Array.BYTES_PER_ELEMENT; // advance the byteOffset after the classId

            // create de-referenced instance of the class. gameEngine and id will be 'tacked on' later at the sync strategies
            var obj = new objectClass(null, { id: null });
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = Object.keys(objectClass.netScheme).sort()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var property = _step.value;

                    var read = this.readDataView(dataView, byteOffset + localByteOffset, objectClass.netScheme[property]);
                    obj[property] = read.data;
                    localByteOffset += read.bufferSize;
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

            return { obj: obj, byteOffset: localByteOffset };
        }
    }, {
        key: 'writeDataView',
        value: function writeDataView(dataView, value, bufferOffset, netSchemProp) {
            if (netSchemProp.type == _BaseTypes2.default.TYPES.FLOAT32) {
                dataView.setFloat32(bufferOffset, value);
            } else if (netSchemProp.type == _BaseTypes2.default.TYPES.INT32) {
                dataView.setInt32(bufferOffset, value);
            } else if (netSchemProp.type == _BaseTypes2.default.TYPES.INT16) {
                dataView.setInt16(bufferOffset, value);
            } else if (netSchemProp.type == _BaseTypes2.default.TYPES.INT8) {
                dataView.setInt8(bufferOffset, value);
            } else if (netSchemProp.type == _BaseTypes2.default.TYPES.UINT8) {
                dataView.setUint8(bufferOffset, value);
            } else if (netSchemProp.type == _BaseTypes2.default.TYPES.STRING) {

                //   MAX_UINT_16 is a reserved (length) value which indicates string hasn't changed
                if (value === null) {
                    dataView.setUint16(bufferOffset, MAX_UINT_16);
                } else {
                    var strLen = value.length;
                    dataView.setUint16(bufferOffset, strLen);
                    var localBufferOffset = 2;
                    for (var i = 0; i < strLen; i++) {
                        dataView.setUint16(bufferOffset + localBufferOffset + i * 2, value.charCodeAt(i));
                    }
                }
            } else if (netSchemProp.type == _BaseTypes2.default.TYPES.CLASSINSTANCE) {
                value.serialize(this, {
                    dataBuffer: dataView.buffer,
                    bufferOffset: bufferOffset
                });
            } else if (netSchemProp.type == _BaseTypes2.default.TYPES.LIST) {
                var _localBufferOffset = 0;

                // a list is comprised of the number of items followed by the items
                dataView.setUint16(bufferOffset + _localBufferOffset, value.length);
                _localBufferOffset += Uint16Array.BYTES_PER_ELEMENT;

                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = value[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var item = _step2.value;

                        // TODO: inelegant, currently doesn't support list of lists
                        if (netSchemProp.itemType == _BaseTypes2.default.TYPES.CLASSINSTANCE) {
                            var serializedObj = item.serialize(this, {
                                dataBuffer: dataView.buffer,
                                bufferOffset: bufferOffset + _localBufferOffset
                            });
                            _localBufferOffset += serializedObj.bufferOffset;
                        } else {
                            this.writeDataView(dataView, item, bufferOffset + _localBufferOffset, { type: netSchemProp.itemType });
                            _localBufferOffset += this.getTypeByteSize(netSchemProp.itemType);
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
            } else if (this.customTypes[netSchemProp.type]) {
                // this is a custom data property which needs to define its own write method
                this.customTypes[netSchemProp.type].writeDataView(dataView, value, bufferOffset);
            } else {
                console.error('No custom property ' + netSchemProp.type + ' found!');
            }
        }
    }, {
        key: 'readDataView',
        value: function readDataView(dataView, bufferOffset, netSchemProp) {
            var data = void 0,
                bufferSize = void 0;

            if (netSchemProp.type == _BaseTypes2.default.TYPES.FLOAT32) {
                data = dataView.getFloat32(bufferOffset);
                bufferSize = this.getTypeByteSize(netSchemProp.type);
            } else if (netSchemProp.type == _BaseTypes2.default.TYPES.INT32) {
                data = dataView.getInt32(bufferOffset);
                bufferSize = this.getTypeByteSize(netSchemProp.type);
            } else if (netSchemProp.type == _BaseTypes2.default.TYPES.INT16) {
                data = dataView.getInt16(bufferOffset);
                bufferSize = this.getTypeByteSize(netSchemProp.type);
            } else if (netSchemProp.type == _BaseTypes2.default.TYPES.INT8) {
                data = dataView.getInt8(bufferOffset);
                bufferSize = this.getTypeByteSize(netSchemProp.type);
            } else if (netSchemProp.type == _BaseTypes2.default.TYPES.UINT8) {
                data = dataView.getUint8(bufferOffset);
                bufferSize = this.getTypeByteSize(netSchemProp.type);
            } else if (netSchemProp.type == _BaseTypes2.default.TYPES.STRING) {
                var length = dataView.getUint16(bufferOffset);
                var localBufferOffset = Uint16Array.BYTES_PER_ELEMENT;
                bufferSize = localBufferOffset;
                if (length === MAX_UINT_16) {
                    data = null;
                } else {
                    var a = [];
                    for (var i = 0; i < length; i++) {
                        a[i] = dataView.getUint16(bufferOffset + localBufferOffset + i * 2);
                    }data = String.fromCharCode.apply(null, a);
                    bufferSize += length * Uint16Array.BYTES_PER_ELEMENT;
                }
            } else if (netSchemProp.type == _BaseTypes2.default.TYPES.CLASSINSTANCE) {
                var deserializeData = this.deserialize(dataView.buffer, bufferOffset);
                data = deserializeData.obj;
                bufferSize = deserializeData.byteOffset;
            } else if (netSchemProp.type == _BaseTypes2.default.TYPES.LIST) {
                var _localBufferOffset2 = 0;

                var items = [];
                var itemCount = dataView.getUint16(bufferOffset + _localBufferOffset2);
                _localBufferOffset2 += Uint16Array.BYTES_PER_ELEMENT;

                for (var x = 0; x < itemCount; x++) {
                    var read = this.readDataView(dataView, bufferOffset + _localBufferOffset2, { type: netSchemProp.itemType });
                    items.push(read.data);
                    _localBufferOffset2 += read.bufferSize;
                }

                data = items;
                bufferSize = _localBufferOffset2;
            }
            // this is a custom data property which needs to define its own read method
            else if (this.customTypes[netSchemProp.type] != null) {
                    data = this.customTypes[netSchemProp.type].readDataView(dataView, bufferOffset);
                } else {
                    console.error('No custom property ' + netSchemProp.type + ' found!');
                }

            return { data: data, bufferSize: bufferSize };
        }
    }, {
        key: 'getTypeByteSize',
        value: function getTypeByteSize(type) {

            switch (type) {
                case _BaseTypes2.default.TYPES.FLOAT32:
                    {
                        return Float32Array.BYTES_PER_ELEMENT;
                    }
                case _BaseTypes2.default.TYPES.INT32:
                    {
                        return Int32Array.BYTES_PER_ELEMENT;
                    }
                case _BaseTypes2.default.TYPES.INT16:
                    {
                        return Int16Array.BYTES_PER_ELEMENT;
                    }
                case _BaseTypes2.default.TYPES.INT8:
                    {
                        return Int8Array.BYTES_PER_ELEMENT;
                    }
                case _BaseTypes2.default.TYPES.UINT8:
                    {
                        return Uint8Array.BYTES_PER_ELEMENT;
                    }

                // not one of the basic properties
                default:
                    {
                        if (this.customTypes[type] == null) {
                            console.error('netScheme property ' + type + ' undefined! Did you forget to add it to the serializer?');
                            break;
                        } else {
                            return this.customTypes[type].BYTES_PER_ELEMENT;
                        }
                    }

            }
        }
    }], [{
        key: 'typeCanAssign',
        value: function typeCanAssign(type) {
            return type !== _BaseTypes2.default.TYPES.CLASSINSTANCE && type !== _BaseTypes2.default.TYPES.LIST;
        }
    }]);

    return Serializer;
}();

exports.default = Serializer;