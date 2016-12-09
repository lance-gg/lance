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

    /**
     * EVENTS
     */

    /**
     * Marks the beginning of a new game step
     *
     * @event GameEngine#preStep
     * @param {Number} stepNumber - the step number
     */

    /**
     * Marks the end of a game step
     *
     * @event GameEngine#postStep
     * @param {Number} stepNumber - the step number
     */

    /**
     * An object has been added to the world
     *
     * @event GameEngine#objectAdded
     * @param {Object} obj - the new object
     */

    /**
     * An object has been removed from the world
     *
     * @event GameEngine#objectDestroyed
     * @param {Object} obj - the object
     */

    /**
     * A player has joined
     *
     * @event GameEngine#playerJoined
     * @param {Object} playerDesc - player descriptor
     * @param {String} playerDesc.playerId - the player ID
     */

    /**
     * A player has left
     *
     * @event GameEngine#playerDisconnected
     * @param {Object} playerDesc - player descriptor
     * @param {String} playerDesc.playerId - the player ID
     */

    /**
     * A synchronization update arrived from the server
     *
     * @event GameEngine#syncReceived
     * @param {Object} sync - the synchronization object
     */

    /**
      * Create a game engine instance.  This needs to happen
      * once on the server, and once on each client.
      *
      * @param {Object} options - options object
      * @param {Number} options.traceLevel - the trace level from 0 to 5
      * @param {Number} options.delayInputCount - client side only.  Introduce an artificial delay on the client to better match the time it will occur on the server.  This value sets the number of steps the client will delay  the input
      */
    constructor(options) {

        // if no GameWorld is specified, use the default one
        this.options = Object.assign({
            GameWorld: GameWorld,
            traceLevel: Trace.TRACE_NONE
        }, options);

        // get the physics engine and initialize it
        if (this.options.physicsEngine) {
            this.physicsEngine = this.options.physicsEngine;
            this.physicsEngine.init({ gameEngine: this });
        }

        // set up event emitting and interface
        let eventEmitter = new EventEmitter();

        /**
         * Register a handler for an event
         *
         * @method on
         * @memberof GameEngine
         * @instance
         * @param {String} eventName - name of the event
         * @param {Function} eventHandler - handler function
         */
        this.on = eventEmitter.on;

        /**
         * Register a handler for an event, called just once (if at all)
         *
         * @method once
         * @memberof GameEngine
         * @instance
         * @param {String} eventName - name of the event
         * @param {Function} eventHandler - handler function
         */
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

        // TODO: with arrow functions, we no longer need that=this mechanism
        // remove the usage here and in all places in the code
        var that = this;

        this.world = new GameWorld();

        // on the client we have a different ID space
        if (this.options.clientIDSpace) {
            this.world.idCount = this.options.clientIDSpace;
        }

        /**
        * The worldSettings defines the game world constants, such
        * as width, height, depth, etc. such that all other classes
        * can reference these values.
        * @member {Object} worldSettings
        * @memberof GameEngine
        */
        this.worldSettings = {};

        this.timer = new Timer();
        this.timer.play();

        this.on("postStep", function() {
            that.timer.tick();
        });
    }

    /**
      * Start the game. This method runs on both server
      * and client. Extending the start method is useful
      * for setting up the game's worldSettings attribute,
      * and registering methods on the event handler.
      */
    start() {
        this.trace.info(`========== game engine started ==========`);
        this.initWorld();
    }

    step(isReenact) {

        // emit preStep event
        isReenact = Boolean(isReenact);
        let step = ++this.world.stepCount;
        let clientIDSpace = this.options.clientIDSpace;
        this.emit("preStep", { step, isReenact });

        // skip physics for shadow objects during re-enactment
        function objectFilter(o) {
            return !isReenact || o.id < clientIDSpace;
        }

        // physics step
        if (this.physicsEngine)
            this.physicsEngine.step(objectFilter);

        // trace object positions after physics
        for (let objId of Object.keys(this.world.objects)) {
            this.trace.trace(`object[${objId}] after ${isReenact ? "reenact" : "step"} : ${this.world.objects[objId].toString()}`);
        }

        // emit postStep event
        this.emit("postStep", { step, isReenact });
    }

    addObjectToWorld(object) {
        this.world.objects[object.id] = object;

        this.emit("objectAdded", object);
        this.trace.info(`========== object added ${object.toString()} ==========`);
    }

    /**
     * Override this function and implement input handling.
     * This method will be called on the specific client where the
     * input was received, and will also be called on the server
     * when the input reaches the server.
     *
     * @param {Object} inputMsg - input descriptor object
     * @param {String} inputMsg.input - describe the input (e.g. "up", "down", "fire")
     * @param {Number} inputMsg.messageIndex - input identifier
     * @param {String} playerId - the player number (as a string)
     */
    processInput(inputMsg, playerId) {
        // TODO - I don't think we need the playerId as an argument above.
        //    it could be a class member.
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
