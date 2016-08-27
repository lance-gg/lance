"use strict";
const GameWorld = require('./GameWorld');
const Timer = require('./lib/Timer');
const EventEmitter = require('eventemitter3');
const Trace = require('./lib/Trace');

class GameEngine {
    constructor(inputOptions) {
        // if no GameWorld is specified, use the default one
        this.options = Object.assign({
            GameWorld: GameWorld,
            traceLevel: Trace.TRACE_NONE
        }, inputOptions);

        // get the physics engine and initialize it
        if (this.options.physicsEngine) {
            this.physicsEngine = this.options.physicsEngine;
            this.physicsEngine.init();
        }

        // get the renderer and initialize it
        if (this.options.renderer) {
            this.renderer = this.options.renderer;
            this.renderer.init();
        }

        // set up event emitting and interface
        let eventEmitter = new EventEmitter();
        this.on = eventEmitter.on;
        this.once = eventEmitter.once;
        this.emit = eventEmitter.emit;

        // set up trace
        console.log('trace leve is ' + this.options.traceLevel);
        this.trace = new Trace({ traceLevel: this.options.traceLevel });
    }

    initWorld() {
        var that = this;

        this.world = new GameWorld();

        // on the client we have a different ID space
        if (this.options.clientIDSpace && this.renderer) {
            this.world.idCount = this.options.clientIDSpace;
        }

        this.worldSettings = {};

        this.timer = new Timer();
        this.timer.play();

        this.on("postStep", function() {
            that.timer.tick();
        });
    }

    start() {
        this.initWorld();
    }

    step() {
        this.world.stepCount++;
        this.trace.info(`========== starting step ${this.world.stepCount}`);

        // physics step
        if (this.physicsEngine) {
            this.physicsEngine.step();
        }

        // handle post-physics business logic
        this.updateGameWorld();
    }

    updateGameWorld() {
        for (var objId in this.world.objects) {
            if (this.world.objects.hasOwnProperty(objId)) {
                let ob = this.world.objects[objId];
                this.trace.debug(ob.toString());
                ob.step(this.worldSettings);
                if (ob.renderObject) {
                    ob.updateRenderObject();
                }
            }
        }
    }

    addObjectToWorld(object) {
        this.world.objects[object.id] = object;
        this.emit("objectAdded", object);
    }

    // the base input processing logic
    // game must implement the actual input logic in this function,
    // as it will be called on both client and server.
    processInput(inputMsg, playerId) {}

    removeObjectFromWorld(id) {
        this.emit("objectDestroyed", this.world.objects[id]);
        this.world.objects[id].destroy();
        delete this.world.objects[id];
    }

}

module.exports = GameEngine;
