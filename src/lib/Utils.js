export default class Utils {

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

    static httpGetPromise(url) {
        return new Promise((resolve, reject) => {
            let req = new XMLHttpRequest();
            req.open('GET', url, true);
            req.onload = () => {
                if (req.status >= 200 && req.status < 400) resolve(JSON.parse(req.responseText));
                else reject();
            };
            req.onerror = () => {};
            req.send();
        });
    }
}