'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseTypes = function BaseTypes() {
    _classCallCheck(this, BaseTypes);
};

/**
 * Defines Lance's base types which are available for serialization
 */

/**
* The TYPES object defines the supported serialization types
* @constant
*/


BaseTypes.TYPES = {
    FLOAT32: 'FLOAT32',
    INT32: 'INT32',
    INT16: 'INT16',
    INT8: 'INT8',
    UINT8: 'UINT8',
    STRING: 'STRING',
    CLASSINSTANCE: 'CLASSINSTANCE',
    LIST: 'LIST'
};

exports.default = BaseTypes;