const fs = require('fs');
const express = require('express');

const PORT = process.env.PORT || 2000;

// define routes and socket
const app = express();
let data = {};
app.get('/:className', (req, res) => {
    res.send('ok');
    let className = req.params.className;
    if (typeof className === 'string' && className.length < 128) {
        data[className] = data[className] || 0;
        data[className]++;
    }
});
app.listen(PORT, () => console.log(`LanceInfo listening on ${PORT}`));

let syncData = () => {
    const d = new Date();
    fs.writeFile(`lanceInfo-${d.getFullYear()}-${d.getMonth() + 1}.json`, JSON.stringify(data), () => {});
    setTimeout(syncData, 60 * 1000);
};

syncData();
