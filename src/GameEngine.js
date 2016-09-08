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
        this.trace.info(`========== game engine started ==========`);
        this.initWorld();
    }

    step() {
        this.world.stepCount++;
        this.trace.info(`========== starting step ${this.world.stepCount} ==========`);

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
                ob.step(this.worldSettings);
                this.trace.debug(`after object step: ${ob.toString()}`);
                if (ob.renderObject) {
                    ob.updateRenderObject();
                }
            }
        }
    }

    addObjectToWorld(object) {
        this.world.objects[object.id] = object;

        // it may need a renderer sub-object
        if (this.renderer) {
            object.initRenderObject(this.renderer);
        }

        this.emit("objectAdded", object);
        this.trace.info(`========== object added ${object.toString()} ==========`);
    }

    // the base input processing logic
    // game must implement the actual input logic in this function,
    // as it will be called on both client and server.
    processInput(inputMsg, playerId) {
        this.trace.info(`game engine processing input[${inputMsg.messageIndex}] <${inputMsg.input}> from playerId ${playerId}`);
    }

    removeObjectFromWorld(id) {
        let ob = this.world.objects[id];
        this.trace.info(`========== destroying object ${ob.toString()} ==========`);
        this.emit("objectDestroyed", ob);
        ob.destroy();
        delete this.world.objects[id];
    }

}

module.exports = GameEngine;
