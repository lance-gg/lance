'use strict';

const express = require('express');
const socketIO = require('socket.io');
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'examples/spaaace/index.html');

const server = express();

server.get('/', function (req, res) {
    res.sendFile(INDEX)
});


server.use('/', express.static(path.join(__dirname, 'examples/spaaace')));

var requestHandler = server.listen(PORT, () => console.log(`Listening on ${ PORT }`));

const io = socketIO(requestHandler);


/*
    Game logic
 */

const SpaaaceServerEngine = require(path.join(__dirname, 'examples/spaaace/js/SpaaaceServerEngine.js'));
const SpaaaceGameEngine = require(path.join(__dirname, 'examples/spaaace/js/SpaaaceGameEngine.js'));

const gameEngine = new SpaaaceGameEngine();
const serverEngine = new SpaaaceServerEngine(io, gameEngine);
serverEngine.start();

/*
    Server IO
 */

io.on('connection', onClientConnect);

function onClientConnect(socket){
    serverEngine.onPlayerConnected(socket);
}



// setInterval(() => io.emit('time', new Date().toTimeString()), 1000);
