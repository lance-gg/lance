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
        stepCount: 0,
        playerCount: 0
    };

    this.worldSettings = {
        width: 800,
        height: 600
    };

    this.registerClass(Ship);

    this.initWorld();

    this.gameLoopId = Gameloop.setGameLoop(this.step.bind(this), 1000 / 60);
};

SpaaaceEngine.prototype.onPlayerConnected = function(socket){
    var that=this;

    console.log('Client connected');

    //save player
    this.connectedPlayers[socket.id] = socket;
    var playerId = socket.playerId = ++this.world.playerCount;
    console.log("Client Connected", socket.id);

    this.makeShip(socket.playerId);

    socket.emit('playerJoined',{
        playerId: playerId
    });

    socket.on('move', function(data){
        that.processInput(data, socket)
    });

    socket.on('disconnect', function(){
        that.onPlayerDisconnected(socket.id, playerId)
    });
};

SpaaaceEngine.prototype.onPlayerDisconnected = function(socketId, playerId){
    delete this.world.objects[playerId];
    delete this.connectedPlayers[socketId];
    console.log('Client disconnected')
};

SpaaaceEngine.prototype.step = function(delta){
    this.world.stepCount++;
    this.updateGameWorld();
    this.io.emit('worldUpdate',this.serializeWorld());
    // console.log(Object.keys(this.world.objects));
};

SpaaaceEngine.prototype.processInput = function(data, socket){

    //get the player ship tied to the player socket
    var playerShip = this.world.objects[socket.playerId];

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

SpaaaceEngine.prototype.registerClass = function(classObj){
    this.registeredClasses[classObj.properties.id] = classObj;
};

SpaaaceEngine.prototype.serializeWorld = function(){
    var bufferSize = 0;
    var bufferOffset = 0;

    //count the object byte size to determine what buffer size do we need
    for (let objId in this.world.objects) {
        if (this.world.objects.hasOwnProperty(objId)) {
            let obj = this.world.objects[objId];
            let objClass = obj.class;

            //reminder - object is made from its class id (Uint8) and its payload
            bufferSize += objClass.getNetSchemeBufferSize();
        }
    }

    bufferSize += Int32Array.BYTES_PER_ELEMENT; //world buffer starts with step count
    var worldBuffer = new ArrayBuffer(bufferSize);
    var worldBufferDV = new DataView(worldBuffer);

    //write step count
    worldBufferDV.setInt32(0,this.world.stepCount);
    bufferOffset += Int32Array.BYTES_PER_ELEMENT;

    for (let objId in this.world.objects) {
        if (this.world.objects.hasOwnProperty(objId)) {
            let obj = this.world.objects[objId];
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
    this.world.objects = {};
};

SpaaaceEngine.prototype.makeShip = function(id) {
    if (id in this.world.objects){
        console.log("warning, object with id ", id, " alraedy exists");
        return null;
    };

    var newShipX = Math.floor(Math.random()*(this.worldSettings.width-200)) + 200;
    var newShipY = Math.floor(Math.random()*(this.worldSettings.height-200)) + 200;

    var ship = new Ship(id, newShipX, newShipY);
    this.world.objects[id]=ship;

    //todo deal with what goes over the wire
    ship.velocity = new Point();
    ship.temp={
        accelerationVector: new Point()
    };

    return ship;
};

SpaaaceEngine.prototype.updateGameWorld = function(){
    for (var objId in this.world.objects) {
        if (this.world.objects.hasOwnProperty(objId)) {
            let ship = this.world.objects[objId];

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

            if (ship.x>=this.worldSettings.width){ ship.x = this.worldSettings.width - ship.x;}
            else if (ship.y>=this.worldSettings.height){ ship.y = this.worldSettings.height - ship.y;}
            else if (ship.x < 0){ ship.x = this.worldSettings.width + ship.x;}
            else if (ship.y<0){ ship.y = this.worldSettings.width + ship.y;}
        }
    }

};

module.exports = SpaaaceEngine;