"use strict";
const GameWorld = require('./GameWorld');

class GameEngine{
    constructor(inputOptions){
        //if no GameWorld is specified, use the default one
        this.options = Object.assign({
            GameWorld: GameWorld
        }, inputOptions);

        this.registeredClasses = {};
    }

    initWorld(){
        this.world = new GameWorld();
    };

    start(){
        this.initWorld();
    };

    registerClass(classObj){
        this.registeredClasses[classObj.properties.id] = classObj;
    };

}

module.exports = GameEngine;