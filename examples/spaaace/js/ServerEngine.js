"use strict";

var Gameloop = require('node-gameloop');
var Point= require('./Point');


var SpaaaceEngine = function(io){
    this.io = io;

    this.connectedPlayers = {};
    this.registeredClasses = {};
};

SpaaaceEngine.prototype.start = function(){
    this.world = {
        stepCount: 0
    };

    this.registerClass(Ship);

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

SpaaaceEngine.prototype.registerClass = function(classObj){
    this.registeredClasses[classObj.properties.id] = classObj;
};

SpaaaceEngine.prototype.serializeWorld = function(){
    var bufferSize = 0;
    var bufferOffset = 0;

    //count the object byte size to determine what buffer size do we need
    for (let x=0; x<this.world.objects.length; x++){
        let obj = this.world.objects[x];
        let objClass = obj.class;

        //reminder - object is made from its class id (Uint8) and its payload
        bufferSize += objClass.getNetSchemeBufferSize();
    }

    bufferSize += Int32Array.BYTES_PER_ELEMENT; //world buffer starts with step count
    var worldBuffer = new ArrayBuffer(bufferSize);
    var worldBufferDV = new DataView(worldBuffer);

    //write step count
    worldBufferDV.setInt32(0,this.world.stepCount);
    bufferOffset += Int32Array.BYTES_PER_ELEMENT;

    for (let x=0; x<this.world.objects.length; x++){
        let obj = this.world.objects[x];
        let objClass = obj.class;
        let netSchemeBufferSize = objClass.getNetSchemeBufferSize();

        var serializedObj = obj.serialize();
        let serializedObjDV = new DataView(serializedObj);

        //go over the serialized object, writing it byte by byte to the world buffer
        for (let y=0; y<netSchemeBufferSize; y++){
            worldBufferDV.setInt8(bufferOffset + y , serializedObjDV.getInt8(y));
        }
        bufferOffset += netSchemeBufferSize;
    }

    // var dv = new DataView(serializedObj);
      // console.log(dv.getInt16(5));

      // var dv = new DataView(worldBuffer);
      // console.log(this.registeredClasses[dv.getUint8(4)].getNetSchemeBufferSize());


    return worldBuffer;
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