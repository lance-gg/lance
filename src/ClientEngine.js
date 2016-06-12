class ClientEngine {

    constructor(socket, gameEngine){
        var that = this;
        this.socket = socket;
        this.gameEngine = gameEngine;

        this.outboundInput = [];

        this.socket.on('playerJoined', function(playerData) {
            that.playerId = playerData.playerId;
        });
    }

    start(){
        var that = this;

        this.socket.on('worldUpdate', function(worldData) {
            that.onServerStep(worldData);
        });

        this.outboundInputInterval = setInterval(this.handleOutboundInput.bind(this),16);

        this.gameEngine.start();
    }

    sendInput(input){
        this.gameEngine.processInput(input, this.playerId);

        this.outboundInput.push({
            command: 'move',
            params:  input
        });
    };

    handleOutboundInput (){
        for (var x=0; x<this.outboundInput.length; x++){
            this.socket.emit(this.outboundInput[x].command, this.outboundInput[x].params);
        }
        this.outboundInput = [];
    };

}

module.exports = ClientEngine;