var ClientEngine = function(socket){
    this.socket = socket;
    this.currentFrame = 0;

    this.outboundInput = [];
};

ClientEngine.prototype.start = function(){
    var that = this;

    this.world={
        stepCount: 0
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


//TODO deserialize world
ClientEngine.prototype.onWorldStep = function(worldData){
    var worldDataDV = new DataView(worldData);
    var stepCount =  worldDataDV.getInt32(0);

    //if packet is out of date, ignore
    if (stepCount > this.world.stepCount) {
        this.world.stepCount = stepCount;


        var byteOffset = Int32Array.BYTES_PER_ELEMENT;

        //go ever the buffer and deserialize items
        while (byteOffset < worldData.byteLength) {
            var objectClassId = worldDataDV.getUint8(byteOffset);

            var objectByteSize = Ship.getNetSchemeBufferSize() - 1; //remove the class id

            var objectData = Ship.deserialize(worldData.slice(byteOffset + Uint8Array.BYTES_PER_ELEMENT, byteOffset + Uint8Array.BYTES_PER_ELEMENT + objectByteSize));
            byteOffset += (Int16Array.BYTES_PER_ELEMENT + objectByteSize);

            sprite.x = objectData.x;
            sprite.y = objectData.y;
            sprite.angle = objectData.angle;
        }
    }
};

// ClientEngine.prototype.onWorldStep = function(worldData){
//     if (worldData.stepCount > this.world.stepCount){
//         this.world.stepCount = worldData.stepCount;
//         sprite.x = worldData.objects[0].x;
//         sprite.y = worldData.objects[0].y;
//         sprite.angle = worldData.objects[0].angle;
//     }
// };