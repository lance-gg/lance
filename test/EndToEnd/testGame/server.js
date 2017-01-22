'use strict';

const express = require('express');
const socketIO = require('socket.io');
const path = require('path');
const incheon = require('../../../');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, './index.html');

// define routes and socket
const server = express();
server.get('/', function(req, res) { res.sendFile(INDEX); });
server.use('/', express.static(path.join(__dirname, '.')));
let requestHandler = server.listen(PORT, () => console.log(`Listening on ${PORT}`));
const io = socketIO(requestHandler);

// Game Server
const MyServerEngine = require(path.join(__dirname, 'src/server/MyServerEngine.js'));
const MyGameEngine = require(path.join(__dirname, 'src/common/MyGameEngine.js'));
const SimplePhysicsEngine = incheon.physics.SimplePhysicsEngine;

// Game Instances
const physicsEngine = new SimplePhysicsEngine();
const gameEngine = new MyGameEngine({ physicsEngine, traceLevel: 0 });
const serverEngine = new MyServerEngine(io, gameEngine, { debug: {}, updateRate: 6 });

// start the game
function start() {
    serverEngine.start();
    return { gameEngine, serverEngine, physicsEngine };
}

module.exports = { start };
