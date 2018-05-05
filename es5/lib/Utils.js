'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Utils = function () {
    function Utils() {
        _classCallCheck(this, Utils);
    }

    _createClass(Utils, null, [{
        key: 'hashStr',
        value: function hashStr(str, bits) {
            var hash = 5381;
            var i = str.length;
            bits = bits ? bits : 8;

            while (i) {
                hash = hash * 33 ^ str.charCodeAt(--i);
            }
            hash = hash >>> 0;
            hash = hash % (Math.pow(2, bits) - 1);

            // JavaScript does bitwise operations (like XOR, above) on 32-bit signed
            // integers. Since we want the results to be always positive, convert the
            // signed int to an unsigned by doing an unsigned bitshift. */
            return hash;
        }
    }, {
        key: 'arrayBuffersEqual',
        value: function arrayBuffersEqual(buf1, buf2) {
            if (buf1.byteLength !== buf2.byteLength) return false;
            var dv1 = new Int8Array(buf1);
            var dv2 = new Int8Array(buf2);
            for (var i = 0; i !== buf1.byteLength; i++) {
                if (dv1[i] !== dv2[i]) return false;
            }
            return true;
        }
    }, {
        key: 'httpGetPromise',
        value: function httpGetPromise(url) {
            return new Promise(function (resolve, reject) {
                var req = new XMLHttpRequest();
                req.open('GET', url, true);
                req.onload = function () {
                    if (req.status >= 200 && req.status < 400) resolve(JSON.parse(req.responseText));else reject();
                };
                req.onerror = function () {};
                req.send();
            });
        }
    }]);

    return Utils;
}();

exports.default = Utils;