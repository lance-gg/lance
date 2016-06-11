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
            that.processInput(data, socket)
        });

    };

    onPlayerDisconnected(socketId, playerId){
        super.onPlayerDisconnected(socketId, playerId);

        delete this.gameEngine.world.objects[playerId];
    };


    processInput(data, socket){
        //get the player ship tied to the player socket
        var playerShip = this.gameEngine.world.objects[socket.playerId];

        if (playerShip) {
            if (data == "up") {
                playerShip.isAccelerating = true
            }
            else if (data == "right") {
                playerShip.isRotatingRight = true
            }
            else if (data == "left") {
                playerShip.isRotatingLeft = true
            }
        }
    };

}

module.exports = SpaaaceServerEngine;