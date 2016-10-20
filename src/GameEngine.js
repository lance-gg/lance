"use strict";
const GameWorld = require('./GameWorld');
const Timer = require('./lib/Timer');
const EventEmitter = require('eventemitter3');
const Trace = require('./lib/Trace');

/**
 * The GameEngine contains the game logic.  Extend this class
 * to implement your game mechanics.  The GameEngine derived
 * instance runs once on the server, where the final decisions
 * are always taken, and one instance will run on each client as well,
 * where the client emulates what it expects to have happening
 * on the server.
 *
 * The game engine's logic must listen to user inputs and
 * act on these inputs to change the game state.  For example,
 * the game engine listens to controller/keyboard inputs to infer
 * movement for the player/ship/first-person.  The game engine listens
 * to clicks/button-presses to infer firing. etc..
 *
 * Note that the game engine runs on both the server and on the
 * clients - but the server decisions are always the final say,
 * and therefore clients must note that server updates may conflict
 * with client-side predictions.
 */
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

    findLocalShadow(serverObj) {

        for (let localId of Object.keys(this.world.objects)) {
            let localObj = this.world.objects[localId];
            if (localObj.hasOwnProperty('inputId') && localObj.inputId === serverObj.inputId)
                return localObj;
        }

        return null;
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

        // TODO: use for ... of Object.keys()
        for (let objId in this.world.objects) {
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

    addObjectToWorld(object, options) {
        this.world.objects[object.id] = object;

        // it may need a renderer sub-object
        if (this.renderer) {
            object.initRenderObject(this.renderer, options);
        }

        this.emit("objectAdded", object);
        this.trace.info(`========== object added ${object.toString()} ==========`);
    }

    /**
     * Override this function and implement input handling.
     * this function will be called on the client where the
     * input was received, and will also be called on the server
     * when the input reaches the server.
     *
     * @param {Object} inputMsg - must contain attributes input (a string describing the input) messageIndex (a counter)
     * @param {String} playerId - the player number (as a string)
     */
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
