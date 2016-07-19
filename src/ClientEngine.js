"use strict";
var io = require("socket.io-client");

class ClientEngine {

    constructor(gameEngine, inputOptions){
        var that = this;

        this.socket = io();
        this.gameEngine = gameEngine;

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
        this.gameEngine.emit("client:preStep");
        while(this.inboundMessages.length>0){
            this.handleInboundMessage(this.inboundMessages.pop());
        }

        this.handleOutboundInput();
        this.gameEngine.emit("preStep",this.gameEngine.world.stepCount);
        this.gameEngine.step();
        this.gameEngine.emit("postStep",this.gameEngine.world.stepCount);

        if (this.gameEngine.renderer) {
            this.gameEngine.renderer.draw();
        }
        this.gameEngine.emit("client:postStep");
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

        // emit that a snapshot has been received
        this.gameEngine.emit('client.snapshotReceived', { snapshot: worldSnapshot });

        // finally update the stepCount
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
