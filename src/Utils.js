"use strict";

class Utils {

    static hashStr(str, bits) {
        var hash = 5381,
            i = str.length,
            bits = bits?bits:8;

            while (i) {
                hash = (hash * 33) ^ str.charCodeAt(--i);
            }
            hash = hash >>> 0;
            hash = hash % (Math.pow(2, bits) - 1);

            /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
             * integers. Since we want the results to be always positive, convert the
             * signed int to an unsigned by doing an unsigned bitshift. */
            return hash;
    }
}

module.exports = Utils;