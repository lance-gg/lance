const ClientEngine = require('../../../src/ClientEngine');
const GameWorld = require('../../../src/GameWorld');
var Ship = require("./Ship");

class SpaaaceClientEngine extends ClientEngine{
    constructor(socket, gameEngine){         
        super(socket, gameEngine);


        this.worldBuffer=[];

        this.sprites = {};
    }
    
    step(){
        this.gameEngine.step();
        //
        // for (var objId in world.objects) {
        //     if (world.objects.hasOwnProperty(objId)) {
        //         // if (this.playerId == objId){
        //             let objectData = world.objects[objId];
        //
        //             this.sprites[objectData.id].x = objectData.x;
        //             this.sprites[objectData.id].y = objectData.y;
        //             this.sprites[objectData.id].angle = objectData.angle;
        //         }
        //
        //     // }
        // }

        var stepToPlay = this.gameEngine.world.stepCount - 30;
        var previousWorld = null;
        var nextWorld = null;

        for (let x=0; x<this.worldBuffer.length; x++ ){
            if (this.worldBuffer[x].stepCount < stepToPlay){
                previousWorld = this.worldBuffer[x];
            }
            if (this.worldBuffer[x].stepCount >= stepToPlay){
                nextWorld = this.worldBuffer[x];
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
                        this.gameEngine.world.objects[objId] = new Ship(nextObj.id, nextObj.x, nextObj.y);

                        sprite = window.game.add.sprite(300, 300, 'ship');
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

                    if (this.playerId == nextObj.id){
                        let localObj = this.gameEngine.world.objects[objId];

                        this.sprites[objId].x = localObj.x;
                        this.sprites[objId].y = localObj.y;
                        this.sprites[objId].angle = localObj.angle;

                    }
                    else{

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

    onServerStep(worldData){
        var world = GameWorld.deserialize(this.gameEngine, worldData);
        // console.log(world.stepCount - this.gameEngine.world.stepCount);


        this.gameEngine.world.stepCount = world.stepCount;

        this.worldBuffer.push(world);
        if (this.worldBuffer.length >= 10){
            this.worldBuffer.shift();
        }



        //delete objects that weren't updated
        // var objectsToDelete = [];
        // for (var objId in world.objects) {
        //     if (world.objects.hasOwnProperty(objId)) {
        //         if (!touchedIds[objId]){
        //             objectsToDelete.push(objId);
        //         }
        //     }
        // }
        // for (var x=0; x<objectsToDelete.length; x++){
        //     // delete this.sprites[objectsToDelete[x]];
        //     world.objects[objectsToDelete[x]].sprite.destroy();
        //     delete world.objects[objectsToDelete[x]];
        // }


    };
}


module.exports = SpaaaceClientEngine;