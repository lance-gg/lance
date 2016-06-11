var Ship = require("./Ship");

var ClientEngine = function(socket){
    var that = this;
    this.socket = socket;
    this.currentFrame = 0;

    this.outboundInput = [];

    this.socket.on('playerJoined', function(playerData) {
        that.playerId = playerData.playerId;
    });
};

ClientEngine.prototype.start = function(){
    var that = this;

    this.world={
        stepCount: 0,
        objects: {}
    };

   this.socket.on('worldUpdate', function(worldData) {
         that.onWorldStep(worldData);
   });

    this.outboundInputInterval = setInterval(this.handleOutboundInput.bind(this),16);

    // this.onAnimationFrame();
};


//input

ClientEngine.prototype.sendInput = function(input){
    this.outboundInput.push({
        command: 'move',
        params:  input
    });
};

ClientEngine.prototype.handleOutboundInput = function(){
    for (var x=0; x<this.outboundInput.length; x++){
        this.socket.emit(this.outboundInput[x].command, this.outboundInput[x].params);
    }
    this.outboundInput = [];
};

// clientEngine.prototype.onAnimationFrame = function(){
//     this.currentFrame++;
//     requestAnimationFrame(this.onAnimationFrame);
// };


//IO

ClientEngine.prototype.onWorldStep = function(worldData){
    var worldDataDV = new DataView(worldData);
    var stepCount =  worldDataDV.getInt32(0);

    var touchedIds ={}; //a temp object to figure out if some objects need to be removed

    //if packet is out of date, ignore
    if (stepCount > this.world.stepCount) {
        this.world.stepCount = stepCount;


        var byteOffset = Int32Array.BYTES_PER_ELEMENT;


        //go ever the buffer and deserialize items
        while (byteOffset < worldData.byteLength) {
            var objectClassId = worldDataDV.getUint8(byteOffset);

            var objectByteSize = Ship.getNetSchemeBufferSize();

            var objectData = Ship.deserialize(worldData.slice(byteOffset, byteOffset + objectByteSize));
            byteOffset += objectByteSize;

            var localObj;
            var sprite;

            if (this.world.objects[objectData.id]){
                localObj = this.world.objects[objectData.id];
                sprite = localObj.sprite;
            }
            else{
                localObj = this.world.objects[objectData.id] = new Ship(objectData.id, objectData.x, objectData.y);
                sprite = localObj.sprite = window.game.add.sprite(localObj.x, localObj.y, 'ship');

                //if own player's ship - color it
                if (this.playerId == objectData.id){
                    sprite.tint = 0XFF00FF;
                }

                sprite.anchor.setTo(0.5, 0.5);
                sprite.width = 50;
                sprite.height = 45;
            }

            touchedIds[objectData.id] = true; //mark as updated

            sprite.x = objectData.x;
            sprite.y = objectData.y;
            sprite.angle = objectData.angle;
            
        }


        //delete objects that weren't updated
        var objectsToDelete = [];
        for (var objId in this.world.objects) {
            if (this.world.objects.hasOwnProperty(objId)) {
                if (!touchedIds[objId]){
                    objectsToDelete.push(objId);
                }
            }
        }
        for (var x=0; x<objectsToDelete.length; x++){
            this.world.objects[objectsToDelete[x]].sprite.destroy();
            delete this.world.objects[objectsToDelete[x]];
        }

    }
};

module.exports = ClientEngine;