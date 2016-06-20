"use strict";
const GameWorld = require('./GameWorld');
const Timer = require('./Timer');
const EventEmitter = require('eventemitter3');

class GameEngine{
    constructor(inputOptions){
        //if no GameWorld is specified, use the default one
        this.options = Object.assign({
            GameWorld: GameWorld
        }, inputOptions);

        this.registeredClasses = {}; //todo be refactored into the serializer

        //set up event emitting and interface
        let eventEmitter = new EventEmitter();
        this.on = eventEmitter.on;
        this.once = eventEmitter.once;
        this.emit = eventEmitter.emit;
    }

    initWorld(){
        var that = this;

        this.world = new GameWorld();

        this.timer = new Timer();
        this.timer.play();

        this.on("step", function(){
            that.timer.tick();
        });
    };

    start(){
        this.initWorld();
    };

    step(){
        this.world.stepCount++;
        this.emit("step",this.world.stepCount);
    }

    registerClass(classObj){
        this.registeredClasses[classObj.properties.id] = classObj;
    };

}

module.exports = GameEngine;