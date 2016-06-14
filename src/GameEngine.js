"use strict";
const GameWorld = require('./GameWorld');

class GameEngine{
    constructor(){
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