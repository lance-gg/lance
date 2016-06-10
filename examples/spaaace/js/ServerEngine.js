"use strict";

var Gameloop = require('node-gameloop');
var Point= require('./Point');


var SpaaaceEngine = function(io){
    this.io = io;

    this.connectedPlayers = {};
};

SpaaaceEngine.prototype.start = function(){
    this.world = {
        stepCount: 0
    };
    this.initWorld();

    this.gameLoopId = Gameloop.setGameLoop(this.step.bind(this), 1000 / 60);

};

SpaaaceEngine.prototype.onPlayerConnected = function(socket){
    var that=this;

    //save player
    this.connectedPlayers[socket.id] = socket;

    socket.on ('move', this.processInput.bind(this));

};

SpaaaceEngine.prototype.step = function(delta){
    this.world.stepCount++;
    this.updateGameWorld();
    // this.io.emit('worldUpdate',this.world);
    this.io.emit('worldUpdate',this.serializeWorld());
};

SpaaaceEngine.prototype.processInput = function(data){
    if (data=="up") {
        this.world.objects[0].isAccelerating = true
    }
    else if (data=="right") {
        this.world.objects[0].isRotatingRight = true
    }
    else if (data=="left") {
        this.world.objects[0].isRotatingLeft = true
    }
};

SpaaaceEngine.prototype.serializeWorld = function(){
    var bufferSize = 0;
    var bufferIndex = 0;

    for (let x=0; x<this.world.objects.length; x++){
        let obj = this.world.objects[x];
        bufferSize += obj.getNetSchemeBufferSize();
    }

    var worldBuffer = new Int8Array(bufferSize);

    for (let x=0; x<this.world.objects.length; x++){
        let obj = this.world.objects[x];
        let netSchemeBufferSize = obj.getNetSchemeBufferSize();
        var serializedObj = obj.serialize();
        worldBuffer.set(serializedObj, netSchemeBufferSize);
        bufferIndex += netSchemeBufferSize;
    }

    //todo solve buffer concat

    return this.world.objects[0].serialize();
};


// private functions

const path = require('path');
var Ship = require(path.join(__dirname, 'Ship'));

SpaaaceEngine.prototype.initWorld = function(){
    this.world.objects = [];
    this.makeShip();
};

SpaaaceEngine.prototype.makeShip = function(){
    var ship = new Ship(300,300);
    this.world.objects.push(ship);

    //todo deal with what goes over the wire
    ship.velocity = new Point();
    ship.temp={
        accelerationVector: new Point()
    };

};

SpaaaceEngine.prototype.updateGameWorld = function(){
    for (var x=0; x<this.world.objects.length; x++){
        let ship = this.world.objects[x];

        if (ship.isRotatingRight){ ship.angle += ship.rotationSpeed; }
        if (ship.isRotatingLeft){ship.angle -= ship.rotationSpeed; }

        if(ship.angle>360){ ship.angle -= 360; }
        if(ship.angle<0){ ship.angle += 360; }

        if (ship.isAccelerating) {
            ship.temp.accelerationVector.set(
                Math.cos( ship.angle * (Math.PI / 180) ),
                Math.sin( ship.angle * (Math.PI / 180) )
            ).setMagnitude(ship.acceleration);
        }
        else{
            ship.temp.accelerationVector.set(0,0);
        }

        // console.log(ship.temp.accelerationVector.x,ship.temp.accelerationVector.y);
        // console.log(ship.temp.accelerationVector.x, ship.temp.accelerationVector.y);
        // console.log(ship.temp.accelerationVector.x, ship.temp.accelerationVector.y);
        Point.add(ship.velocity,ship.temp.accelerationVector, ship.velocity);
        ship.velocity.multiply(ship.deceleration, ship.deceleration);

        ship.isAccelerating = false;
        ship.isRotatingLeft = false;
        ship.isRotatingRight = false;
        ship.x = ship.x + ship.velocity.x;
        ship.y = ship.y + ship.velocity.y;
    }
};

module.exports = SpaaaceEngine;