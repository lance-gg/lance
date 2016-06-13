"use strict";

class GameEngine{
    constructor(){
        this.registeredClasses = {};
    }

    initWorld(){
        //TODO use proper world objects
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