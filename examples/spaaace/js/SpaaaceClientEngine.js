const ClientEngine = require('../../../src/ClientEngine');
const GameWorld = require('../../../src/GameWorld');
var Ship = require("./Ship");

class SpaaaceClientEngine extends ClientEngine{
    constructor(socket, gameEngine){         
        super(socket, gameEngine);


        this.worldBuffer=[];

        this.sprites = {};
    }

    start(){
        super.start();

        //  Game input
        this.cursors = game.input.keyboard.createCursorKeys();
        game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);
    }

    step(){
        //important to process inputs before running the game engine loop
        this.processInputs();
        super.step();

        //client prediction
        var world = this.gameEngine.world;
        for (var objId in world.objects) {
            if (world.objects.hasOwnProperty(objId)) {
                if (this.playerId == objId){
                    let objectData = world.objects[objId];

                    this.sprites[objectData.id].x = objectData.x;
                    this.sprites[objectData.id].y = objectData.y;
                    this.sprites[objectData.id].angle = objectData.angle;
                }
            }
        }

        //todo alter step count based on lag
        var stepToPlay = this.gameEngine.world.stepCount - 6;
        var previousWorldIndex;
        var nextWorldIndex;
        var previousWorld = null;
        var nextWorld = null;

        for (let x=0; x<this.worldBuffer.length; x++ ){
            if (this.worldBuffer[x].stepCount < stepToPlay){
                previousWorld = this.worldBuffer[x];
                previousWorldIndex = x;
            }
            if (this.worldBuffer[x].stepCount >= stepToPlay){
                nextWorld = this.worldBuffer[x];
                nextWorldIndex = x;
                break;
            }
        }

        
        if (previousWorld && nextWorld){
            let sprite;
            for (let objId in nextWorld.objects) {
                if (nextWorld.objects.hasOwnProperty(objId)) {
                    let prevObj = previousWorld.objects[objId];
                    let nextObj = nextWorld.objects[objId];
                    //todo refactor
                    if (prevObj == null) {
                        prevObj = nextObj;
                    }

                    if (this.sprites[objId] == null){
                        let localObj = this.gameEngine.world.objects[objId] = new Ship(nextObj.id, nextObj.x, nextObj.y);
                        localObj.velocity.set(nextObj.velX, nextObj.velY);

                        sprite = window.game.add.sprite(nextObj.x, nextObj.y, 'ship');
                        this.sprites[objId] = sprite;
                        //if own player's ship - color it
                        if (this.playerId == nextObj.id){
                            sprite.tint = 0XFF00FF;
                        }

                        sprite.anchor.setTo(0.5, 0.5);
                        sprite.width = 50;
                        sprite.height = 45;
                    }
                    else{
                        sprite = this.sprites[objId];
                    }

                    if (this.playerId != nextObj.id){

                        var playPercentage = (stepToPlay - previousWorld.stepCount)/(nextWorld.stepCount - previousWorld.stepCount);

                        if (Math.abs(nextObj.x - prevObj.x) > this.gameEngine.worldSettings.height /2){ //fix for world wraparound
                            sprite.x = nextObj.x;
                        }
                        else{
                            sprite.x = (nextObj.x - prevObj.x) * playPercentage + prevObj.x;
                        }

                        if (Math.abs(nextObj.y - prevObj.y) > this.gameEngine.worldSettings.height/2) { //fix for world wraparound
                            sprite.y = nextObj.y;
                        }
                        else{
                            sprite.y = (nextObj.y - prevObj.y) * playPercentage + prevObj.y;
                        }

                        var shortest_angle=((((nextObj.angle - prevObj.angle) % 360) + 540) % 360) - 180; //todo wrap this in a util
                        sprite.angle = prevObj.angle + shortest_angle *  playPercentage;
                    }

                }
            }

            //go over previous world to remove objects
            for (let objId in previousWorld.objects) {
                if (previousWorld.objects.hasOwnProperty(objId) && !nextWorld.objects.hasOwnProperty(objId)) {
                    delete this.gameEngine.world.objects[objId];
                    if (this.sprites[objId]) {
                        this.sprites[objId].destroy();
                    }
                    delete this.sprites[objId];
                }
            }
        }


    }

    handleInboundMessage(worldData) {
        var worldSnapshot = GameWorld.deserialize(this.gameEngine, worldData);
        // console.log(world.stepCount - this.gameEngine.world.stepCount);
        // console.log("last handled input", world.lastHandledInput);

        this.worldBuffer.push(worldSnapshot);
        if (this.worldBuffer.length >= 5) {
            this.worldBuffer.shift();
        }

        for (var objId in worldSnapshot.objects) {
            if (worldSnapshot.objects.hasOwnProperty(objId)) {

                //update player character
                if (worldSnapshot.objects[objId].id == this.playerId && this.sprites[objId]) {
                    let localObj = this.gameEngine.world.objects[objId];

                    // console.log(worldSnapshot.objects[objId]);
                    localObj.x = worldSnapshot.objects[objId].x;
                    localObj.y = worldSnapshot.objects[objId].y;
                    localObj.velX = worldSnapshot.objects[objId].velX;
                    localObj.velY = worldSnapshot.objects[objId].velY;
                    localObj.velocity.set(worldSnapshot.objects[objId].velX, worldSnapshot.objects[objId].velY);
                    localObj.angle = worldSnapshot.objects[objId].angle;

                    // console.log("velx", worldSnapshot.objects[objId].velX);

                    // Server Reconciliation. Re-apply all the inputs not yet processed by
                    // the server.
                    var j = 0;
                    while (j < this.pendingInput.length) {
                        var message = this.pendingInput[j];
                        if (message.data.messageIndex <= worldSnapshot.lastHandledInput) {
                            // Already processed. Its effect is already taken into account
                            // into the world update we just got, so we can drop it.
                            this.pendingInput.splice(j, 1);
                        } else {
                            // Not processed by the server yet. Re-apply it.
                            // console.log("S last input", worldSnapshot.lastHandledInput ,"rerun input", message.data.messageIndex, "server step ",worldSnapshot.stepCount, "current step", this.gameEngine.world.stepCount);
                            this.gameEngine.processInput(message.data, this.playerId);
                            this.gameEngine.world.objects[this.playerId].step(this.gameEngine.worldSettings);

                            j++;
                        }
                    }

                }
            }
        }

        //finally update the stepCount
        this.gameEngine.world.stepCount = worldSnapshot.stepCount;
    };

    processInputs(){
        if (this.cursors.up.isDown)
        {
            this.sendInput('up');
        }

        if (this.cursors.left.isDown)
        {
            this.sendInput('left');
        }

        if (this.cursors.right.isDown)
        {
            this.sendInput('right');
        }
    }

}


module.exports = SpaaaceClientEngine;