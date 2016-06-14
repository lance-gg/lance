"use strict";

const Gameloop = require('node-gameloop');

class ServerEngine{

    constructor(io, gameEngine){
        this.io = io;
        this.gameEngine = gameEngine;

        this.connectedPlayers = {};

        this.options = {
            updateRate: 6,
            frameRate: 60
        }
    }

    start(){
        var that=this;
        this.gameEngine.start();

        this.gameLoopId = Gameloop.setGameLoop(function(){
            that.step();

        }, 1000 / this.options.frameRate);
    }

    step(){
        this.serverTime = (new Date().getTime());
        this.gameEngine.step();
        if (this.gameEngine.world.stepCount % this.options.updateRate == 0){

            for (let socketId in this.connectedPlayers) {
                if (this.connectedPlayers.hasOwnProperty(socketId)) {
                    let playerMessage =  this.serializeWorld(socketId);
                    this.connectedPlayers[socketId].emit('worldUpdate',playerMessage);
                }
            }


        }
    };

    serializeWorld(socketId){
        var bufferSize = 0;
        var bufferOffset = 0;
        var world = this.gameEngine.world;

        //count the object byte size to determine what buffer size do we need
        for (let objId in world.objects) {
            if (world.objects.hasOwnProperty(objId)) {
                let obj = world.objects[objId];
                let objClass = obj.class;

                //reminder - object is made from its class id (Uint8) and its payload
                bufferSize += objClass.getNetSchemeBufferSize();
            }
        }

        //world buffer starts with step count followed by last handled input for player
        bufferSize += Int32Array.BYTES_PER_ELEMENT + Int16Array.BYTES_PER_ELEMENT;
        var worldBuffer = new ArrayBuffer(bufferSize);
        var worldBufferDV = new DataView(worldBuffer);

        //write step count
        worldBufferDV.setInt32(bufferOffset,world.stepCount);
        bufferOffset += Int32Array.BYTES_PER_ELEMENT;

        //write handled input
        worldBufferDV.setInt16(bufferOffset, this.connectedPlayers[socketId].lastHandledInput);
        bufferOffset += Int16Array.BYTES_PER_ELEMENT;

        for (let objId in world.objects) {
            if (world.objects.hasOwnProperty(objId)) {
                let obj = world.objects[objId];
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

        return worldBuffer;
    };

    onPlayerConnected(socket){
        var that=this;

        console.log('Client connected');

        //save player
        this.connectedPlayers[socket.id] = socket;
        var playerId = socket.playerId = ++this.gameEngine.world.playerCount;
        socket.lastHandledInput = null;

        console.log("Client Connected", socket.id);


        socket.emit('playerJoined',{
            playerId: playerId
        });

        socket.on('disconnect', function(){
            that.onPlayerDisconnected(socket.id, playerId)
        });


        //todo rename, use number instead of name
        socket.on('move', function(data){
            that.onReceivedInput(data, socket)
        });
    };

    onPlayerDisconnected(socketId, playerId){
        delete this.connectedPlayers[socketId];
        console.log('Client disconnected')
    };

    onReceivedInput(data, socket){
        if (this.connectedPlayers[socket.id]) {
            this.connectedPlayers[socket.id].lastHandledInput = data.messageIndex;
        }
        // console.log("last handled input", this.connectedPlayers[socket.id].lastHandledInput);
    }
}

module.exports = ServerEngine;