"use strict";

var gameloop = require('node-gameloop');


var SpaaaceEngine = function(io){
    this.io = io;

    this.connectedPlayers = {};
};

SpaaaceEngine.prototype.start = function(){
    this.world = {
        stepCount: 0
    };
    this.initWorld();

    this.gameLoopId = gameloop.setGameLoop(this.step.bind(this), 1000 / 60);

};

SpaaaceEngine.prototype.onPlayerConnected = function(socket){
    var that=this;

    //save player
    this.connectedPlayers[socket.id] = socket;

    socket.on ('move', function (data) {
        // io.sockets.emit ('updatePlayer', msg);
        that.world.ships[0].isAccelerating = true
    });

};

SpaaaceEngine.prototype.step = function(delta){
    this.world.stepCount++;
    this.updateGameWorld();
    this.io.emit('worldUpdate',this.world);
};

SpaaaceEngine.prototype.processInput = function(input){
    
};

SpaaaceEngine.prototype.getWorld = function(){
    
};


// private functions

const path = require('path');
var Ship = require(path.join(__dirname, 'Ship'));

SpaaaceEngine.prototype.initWorld = function(){
    this.world.ships = [];
    this.makeShip();
};

SpaaaceEngine.prototype.makeShip = function(){
    this.world.ships.push(new Ship(300,300));
};

SpaaaceEngine.prototype.updateGameWorld = function(){
    for (var x=0; x<this.world.ships.length; x++){
        let ship = this.world.ships[x];
        if (ship.isAccelerating) {
            ship.velocity = Math.min(ship.velocity + ship.acceleration, ship.maxSpeed);
        }
        else{
            ship.velocity = Math.max(ship.velocity - ship.deceleration, 0);
        }
        ship.isAccelerating = false;
        ship.x = ship.x + ship.velocity;
    }
};

module.exports = SpaaaceEngine;