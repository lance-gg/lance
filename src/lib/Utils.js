"use strict";

const crypto = require('crypto');

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

class Utils {

    static hashStr(str, bits) {
        let hash = 5381;
        let i = str.length;
        bits = bits ? bits : 8;

        while (i) {
            hash = (hash * 33) ^ str.charCodeAt(--i);
        }
        hash = hash >>> 0;
        hash = hash % (Math.pow(2, bits) - 1);

        // JavaScript does bitwise operations (like XOR, above) on 32-bit signed
        // integers. Since we want the results to be always positive, convert the
        // signed int to an unsigned by doing an unsigned bitshift. */
        return hash;
    }

    static arrayBuffersEqual(buf1, buf2) {
        if (buf1.byteLength !== buf2.byteLength) return false;
        let dv1 = new Int8Array(buf1);
        let dv2 = new Int8Array(buf2);
        for (let i = 0; i !== buf1.byteLength; i++) {
            if (dv1[i] !== dv2[i]) return false;
        }
        return true;
    }

    // return an array of objects according to key, value, or key and value matching
    // from http://techslides.com/how-to-parse-and-search-json-in-javascript
    static findInObjectByKeyVal(obj, key, val) {
        var objects = [];
        for (var i in obj) {
            if (!obj.hasOwnProperty(i)) continue;
            if (typeof obj[i] === 'object') {
                objects = objects.concat(Utils.findInObjectByKeyVal(obj[i], key, val));
            } else
            // if key matches and value matches or if key matches and value is not passed (eliminating the case where key matches but passed value does not)
            if (i == key && obj[i] == val || i == key && val == '') {
                objects.push(obj);
            } else if (obj[i] == val && key == '') {
                //only add if the object is not already in the array
                if (objects.lastIndexOf(obj) == -1) {
                    objects.push(obj);
                }
            }
        }
        return objects;
    }

    /**
     * Sorts object fields
     * @param {Object} obj Initial object
     * @return {*} sorted object
     */
    static sortedObjectString(obj) {
        if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) == 'object') {
            var _ret = function () {
                if (Array.isArray(obj)) {
                    return {
                        v: '[' + obj.sort().toString() + ']'
                    };
                }
                var sortedObj = new Map();
                var keys = Object.keys(obj).sort();
                keys.forEach(function (key) {
                    sortedObj.set(key, Utils.sortedObjectString(obj[key]));
                });
                return {
                    v: '{' + [].concat(_toConsumableArray(sortedObj)).toString() + '}'
                };
            }();

            if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
        }
        return obj;
    }

    /**
     * Calculates object hash
     * @param {Object} obj Object to hash
     * @param {string} alg Crypto algorithm to use (default="sha256");
     * @param {string=} enc Hash encoding (default="hex")
     * @return {string} Hash string
     */
    static hash(obj, alg, enc) {
        alg = alg ? alg : 'sha256';
        enc = enc ? enc : 'hex';

        const sorted = Utils.sortedObjectString(obj);
        return crypto.createHash(alg)
            .update(sorted)
            .digest(enc);
    }
}

module.exports = Utils;
