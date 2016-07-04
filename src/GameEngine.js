"use strict";
const GameWorld = require('./GameWorld');
const Timer = require('./Timer');
const EventEmitter = require('eventemitter3');

class GameEngine{
    constructor(inputOptions, physicsEngine){
        //if no GameWorld is specified, use the default one
        this.options = Object.assign({
            GameWorld: GameWorld
        }, inputOptions);

        this.registeredClasses = {}; //todo be refactored into the serializer

        if (physicsEngine) {
            this.physicsEngine = physicsEngine;
            this.physicsEngine.init();
        }

        //set up event emitting and interface
        let eventEmitter = new EventEmitter();
        this.on = eventEmitter.on;
        this.once = eventEmitter.once;
        this.emit = eventEmitter.emit;
    }

    initWorld(){
        var that = this;

        this.world = new GameWorld();

        this.worldSettings = {};

        this.timer = new Timer();
        this.timer.play();

        this.on("poststep", function(){
            that.timer.tick();
        });
    };

    start(){
        this.initWorld();
    };

    step(){
        this.world.stepCount++;
        this.updateGameWorld();
    }

    updateGameWorld (){
        for (var objId in this.world.objects) {
            if (this.world.objects.hasOwnProperty(objId)) {
                this.world.objects[objId].step(this.worldSettings);
            }
        }

    };

    addObjectToWorld(object){
        this.world.objects[object.id] = object;
        this.emit("objectAdded", object);
    }

    registerClass(classObj){
        this.registeredClasses[classObj.properties.id] = classObj;
    };

}

module.exports = GameEngine;
