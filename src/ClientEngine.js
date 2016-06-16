var io = require("socket.io-client");

class ClientEngine {

    constructor(gameEngine){
        var that = this;
        this.socket = io();
        this.gameEngine = gameEngine;


        this.messageIndex = 1; // server "already accepted" 0, so this has to be larger
        this.pendingInput = []; //holds all the input yet to be processed by the server
        this.inboundMessages = [];
        this.outboundMessages = [];


        this.socket.on('playerJoined', function(playerData) {
            that.playerId = playerData.playerId;
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
        this.gameEngine.step();
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
        this.pendingInput.push(message);

        this.messageIndex++;
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