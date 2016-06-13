"use strict";

const GameEngine = require('../../../src/GameEngine');
const Ship = require('./Ship');
const Point= require('./Point');

class SpaaaceGameEngine extends GameEngine {
    constructor(){
        super();

        this.registerClass(Ship);
    }
    
    start(){
        super.start();

        this.worldSettings = {
            width: 800,
            height: 600
        };
    };

    step(){
        this.world.stepCount++;
        this.updateGameWorld();
    };

    updateGameWorld (){
        for (var objId in this.world.objects) {
            if (this.world.objects.hasOwnProperty(objId)) {
                this.world.objects[objId].step(this.worldSettings);
            }
        }

    };

    makeShip(id) {
        if (id in this.world.objects){
            console.log("warning, object with id ", id, " alraedy exists");
            return null;
        }

        var newShipX = Math.floor(Math.random()*(this.worldSettings.width-200)) + 200;
        var newShipY = Math.floor(Math.random()*(this.worldSettings.height-200)) + 200;

        var ship = new Ship(id, newShipX, newShipY);
        this.world.objects[id]=ship;

        return ship;
    };

    processInput(inputData, playerId){
        //get the player ship tied to the player socket
        var playerShip = this.world.objects[playerId];
        
        if (playerShip) {
            if (inputData.input == "up") {
                playerShip.isAccelerating = true;
            }
            else if (inputData.input == "right") {
                playerShip.isRotatingRight = true;
            }
            else if (inputData.input == "left") {
                playerShip.isRotatingLeft = true;
            }
        }
    };
}

module.exports = SpaaaceGameEngine;