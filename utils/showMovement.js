const fs = require('fs');
const process = require('process');

//
// this little utility shows the deltas between positions on each step
//
let FILENAME = 'server.trace';
let positions = {};
let times = {};

if (process.argv.length === 3) FILENAME = process.argv[2];
let fin = fs.readFileSync(FILENAME);
let lines = fin.toString().split('\n');
for (let l of lines) {
    if (l.indexOf('after step') < 0) continue;

    let p = l.match(/Pos=\(([0-9.-]*), ([0-9.-]*), ([0-9.-]*)\)/);
    let t = l.match(/^\[([0-9\-T:.Z]*)\]/); // 2017-06-01T14:25:24.197Z
    let ts = new Date(t[1]);
    let step = l.match(/([0-9]*>)/);
    let parts = l.split(' ');
    let objname = parts[4];
    let oldp = positions[objname];
    let oldts = times[objname];
    if (oldp) {
        let delta = `(${Number(p[1]) - Number(oldp[1])},${Number(p[2]) - Number(oldp[2])},${Number(p[3]) - Number(oldp[3])})`;
        console.log(`step ${step[1]} dt=${ts - oldts} object ${objname} moved ${delta}`);
    }
    positions[objname] = p;
    times[objname] = ts;
}
