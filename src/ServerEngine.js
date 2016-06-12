const Gameloop = require('node-gameloop');

class ServerEngine{

    constructor(io, gameEngine){
        this.io = io;
        this.gameEngine = gameEngine;

        this.connectedPlayers = {};

        this.options = {
            updateRate: 20,
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
            this.io.emit('worldUpdate',this.serializeWorld());
        }
    };

    serializeWorld(){
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

        bufferSize += Int32Array.BYTES_PER_ELEMENT; //world buffer starts with step count
        var worldBuffer = new ArrayBuffer(bufferSize);
        var worldBufferDV = new DataView(worldBuffer);

        //write step count
        worldBufferDV.setInt32(0,world.stepCount);
        bufferOffset += Int32Array.BYTES_PER_ELEMENT;

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
        console.log("Client Connected", socket.id);


        socket.emit('playerJoined',{
            playerId: playerId
        });


        socket.on('disconnect', function(){
            that.onPlayerDisconnected(socket.id, playerId)
        });
    };

    onPlayerDisconnected(socketId, playerId){
        delete this.connectedPlayers[socketId];
        console.log('Client disconnected')
    };
}

module.exports = ServerEngine;