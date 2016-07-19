"use strict";
var io = require("socket.io-client");
var PlayerSnap = require("./syncStrategies/PlayerSnap");

class ClientEngine {

    constructor(gameEngine, inputOptions){
        var that = this;

        this.options = Object.assign({
            syncStrategy: new PlayerSnap(this) //default sync strategy
        }, inputOptions);

        this.socket = io();
        this.gameEngine = gameEngine;


        this.worldBuffer=[]; // buffer for server world updates
        this.inboundMessages = [];
        this.outboundMessages = [];


        this.socket.on('playerJoined', function(playerData) {
            that.playerId = playerData.playerId;
        });

        //when objects get added, tag them as playerControlled if necessary
        this.gameEngine.on('objectAdded', function(object){
            object.isPlayerControlled = that.playerId == object.playerId;
        });
    }

    start(){
        var that = this;
        this.socket.on('worldUpdate', function(worldData) {
            that.inboundMessages.push(worldData);
        });

        this.gameEngine.start();
    }

    step(){
        while(this.inboundMessages.length>0){
            this.handleInboundMessage(this.inboundMessages.pop());
        }

        this.handleOutboundInput();
        this.gameEngine.emit("prestep",this.gameEngine.world.stepCount);
        this.gameEngine.step();
        this.gameEngine.emit("poststep",this.gameEngine.world.stepCount);

        if (this.gameEngine.renderer) {
            this.gameEngine.renderer.draw();
        }
    }

    sendInput(input){
        var message = {
            command: 'move',
            data: {
                messageIndex: this.messageIndex,
                step: this.gameEngine.world.stepCount,
                input: input
            }
        };

        this.gameEngine.processInput(message.data, this.playerId);

        this.outboundMessages.push(message);

        this.messageIndex++;
    };

    handleInboundMessage(worldData) {
        var worldSnapshot = this.gameEngine.options.GameWorld.deserialize(this.gameEngine, worldData);
        // console.log(world.stepCount - this.gameEngine.world.stepCount);
        // console.log("last handled input", world.lastHandledInput);

        this.worldBuffer.push(worldSnapshot);
        if (this.worldBuffer.length >= 5) { //pick a proper buffer length, make it configurable
            this.worldBuffer.shift();
        }

        for (var objId in worldSnapshot.objects) {
            if (worldSnapshot.objects.hasOwnProperty(objId)) {
                this.options.syncStrategy.handleObject(worldSnapshot, objId);
            }

            //todo refactor into the other player controlled sync strategy
            var isPlayerControlled = this.playerId == worldSnapshot.objects[objId].playerId;
            if (isPlayerControlled == false){
                let localObj = this.gameEngine.world.objects[objId];
                //copy the most recent object data
                if(localObj && localObj.hasOwnProperty('copyFrom')){
                    localObj.copyFrom(worldSnapshot.objects[objId]);
                }
            }
        }

        //finally update the stepCount
        this.gameEngine.world.stepCount = worldSnapshot.stepCount;
    };

    handleOutboundInput (){
        for (var x=0; x<this.outboundMessages.length; x++){
            // console.log("sent", this.outboundMessages[x].data.messageIndex, "step", this.outboundMessages[x].data.step);
            this.socket.emit(this.outboundMessages[x].command, this.outboundMessages[x].data);
        }
        this.outboundMessages = [];
    };

}

module.exports = ClientEngine;
