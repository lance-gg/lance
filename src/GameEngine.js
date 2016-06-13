"use strict";

class GameEngine{
    constructor(){
        this.registeredClasses = {};
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

    registerClass(classObj){
        this.registeredClasses[classObj.properties.id] = classObj;
    };

}

module.exports = GameEngine;