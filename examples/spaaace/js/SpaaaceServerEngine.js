"use strict";

const path = require('path');
const Ship = require('./Ship');
const ServerEngine = require('../../../src/ServerEngine');

class SpaaaceServerEngine extends ServerEngine{
    constructor(io, gameEngine){
        super(io, gameEngine);
    };

    start(){
        super.start();

        this.registerClass(Ship);
    };

    onPlayerConnected(socket){
        super.onPlayerConnected(socket);

        var that=this;

        this.gameEngine.makeShip(socket.playerId);

        socket.on('move', function(data){
            that.gameEngine.processInput(data, socket.playerId)
        });

    };

    onPlayerDisconnected(socketId, playerId){
        super.onPlayerDisconnected(socketId, playerId);

        delete this.gameEngine.world.objects[playerId];
    };

}

module.exports = SpaaaceServerEngine;