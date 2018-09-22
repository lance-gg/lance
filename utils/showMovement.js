const fs = require('fs');
const process = require('process');

//
// this little utility shows the deltas between positions, quaternions, and time on each step
//
let FILENAME = 'server.trace';
let states = {};

if (process.argv.length === 3) FILENAME = process.argv[2];
let fin = fs.readFileSync(FILENAME);
let lines = fin.toString().split('\n');
for (let l of lines) {
    if (l.indexOf('after step') < 0) continue;

    // position match:  Pos[0, -15.4, 0]
    let p = l.match(/Pos\[([0-9.-]*), ([0-9.-]*), ([0-9.-]*)\]/);

    // quaternion match:  Dir[0.34, [0, 1, 0]]
    let q = l.match(/Dir\[([0-9.-]*),[([0-9.-]*), ([0-9.-]*), ([0-9.-]*)\]\]/);

    // match:  2017-06-01T14:25:24.197Z
    let ts = l.match(/^\[([0-9\-T:.Z]*)\]/);
    let t = new Date(ts[1]);

    let step = l.match(/([0-9]*>)/);
    let parts = l.split(' ');
    let objname = parts[4];
    let old = states[objname];
    if (old) {
        let deltaP = `(${Number(p[1]) - Number(old.p[1])},${Number(p[2]) - Number(old.p[2])},${Number(p[3]) - Number(old.p[3])})`;
        let deltaQ = `(${Number(q[1]) - Number(old.q[1])},${Number(q[2]) - Number(old.q[2])},${Number(q[3]) - Number(old.q[3])},${Number(q[4]) - Number(old.q[4])})`;
        console.log(`step ${step[1]} dt=${t - old.t} object ${objname} moved ${deltaP} rotated ${deltaQ}`);
    }
    states[objname] = { p, q, t };
}
