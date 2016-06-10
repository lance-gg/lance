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

const ServerEngine = require(path.join(__dirname, 'examples/spaaace/js/ServerEngine.js'));
const serverEngine = new ServerEngine(io);
serverEngine.start();

/*
    Server IO
 */

io.on('connection', onClientConnect);

function onClientConnect(socket){
    console.log('Client connected');

    serverEngine.onPlayerConnected(socket);

    socket.on('disconnect', onClientDisconnect);
}

function onClientDisconnect(socket){
    console.log('Client disconnected')
}


// setInterval(() => io.emit('time', new Date().toTimeString()), 1000);
