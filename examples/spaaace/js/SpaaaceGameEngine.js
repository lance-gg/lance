const GameEngine = require('../../../src/GameEngine');
const Ship = require('./Ship');
const Point= require('./Point');

class SpaaaceGameEngine extends GameEngine {
    constructor(){
        super();
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
                let ship = this.world.objects[objId];

                if (ship.isRotatingRight){ ship.angle += ship.rotationSpeed; }
                if (ship.isRotatingLeft){ship.angle -= ship.rotationSpeed; }

                if(ship.angle>360){ ship.angle -= 360; }
                if(ship.angle<0){ ship.angle += 360; }

                if (ship.isAccelerating) {
                    ship.temp.accelerationVector.set(
                        Math.cos( ship.angle * (Math.PI / 180) ),
                        Math.sin( ship.angle * (Math.PI / 180) )
                    ).setMagnitude(ship.acceleration);
                }
                else{
                    ship.temp.accelerationVector.set(0,0);
                }

                // console.log(ship.temp.accelerationVector.x,ship.temp.accelerationVector.y);
                // console.log(ship.temp.accelerationVector.x, ship.temp.accelerationVector.y);
                // console.log(ship.temp.accelerationVector.x, ship.temp.accelerationVector.y);
                Point.add(ship.velocity,ship.temp.accelerationVector, ship.velocity);
                ship.velocity.multiply(ship.deceleration, ship.deceleration);

                ship.isAccelerating = false;
                ship.isRotatingLeft = false;
                ship.isRotatingRight = false;
                ship.x = ship.x + ship.velocity.x;
                ship.y = ship.y + ship.velocity.y;

                if (ship.x>=this.worldSettings.width){ ship.x = this.worldSettings.width - ship.x;}
                else if (ship.y>=this.worldSettings.height){ ship.y = this.worldSettings.height - ship.y;}
                else if (ship.x < 0){ ship.x = this.worldSettings.width + ship.x;}
                else if (ship.y<0){ ship.y = this.worldSettings.width + ship.y;}
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

        //todo deal with what goes over the wire
        ship.velocity = new Point();
        ship.temp={
            accelerationVector: new Point()
        };

        return ship;
    };

    processInput(data, playerId){

        //get the player ship tied to the player socket
        var playerShip = this.world.objects[playerId];

        if (playerShip) {
            if (data == "up") {
                playerShip.isAccelerating = true
            }
            else if (data == "right") {
                playerShip.isRotatingRight = true
            }
            else if (data == "left") {
                playerShip.isRotatingLeft = true
            }
        }
    };
}

module.exports = SpaaaceGameEngine;