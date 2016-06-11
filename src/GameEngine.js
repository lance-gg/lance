class GameEngine{
    constructor(){

    }

    initWorld(){
        this.world = {
            stepCount: 0,
            playerCount: 0,
            objects: {}
        };
    };

    start(){
        this.initWorld();
    };

}

module.exports = GameEngine;