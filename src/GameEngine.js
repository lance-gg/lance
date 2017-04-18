'use strict';
const GameWorld = require('./GameWorld');
const EventEmitter = require('eventemitter3');
const Trace = require('./lib/Trace');

/**
 * The GameEngine contains the game logic.  Extend this class
 * to implement game mechanics.  The GameEngine derived
 * instance runs once on the server, where the final decisions
 * are always taken, and one instance will run on each client as well,
 * where the client emulates what it expects to be happening
 * on the server.
 *
 * The game engine's logic must listen to user inputs and
 * act on these inputs to change the game state.  For example,
 * the game engine listens to controller/keyboard inputs to infer
 * movement for the player/ship/first-person.  The game engine listens
 * to clicks, button-presses to infer firing, etc..
 *
 * Note that the game engine runs on both the server and on the
 * clients - but the server decisions always have the final say,
 * and therefore clients must resolve server updates which conflict
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
     * @param {Boolean} isReenact - is this step a re-enactment
     */

    /**
     * Marks the end of a game step
     *
     * @event GameEngine#postStep
     * @param {Number} stepNumber - the step number
     * @param {Boolean} isReenact - is this step a re-enactment
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
     * A player has joined on the server
     *
     * @event GameEngine#server__playerJoined
     * @param {Object} playerDesc - player descriptor
     * @param {String} playerDesc.playerId - the player ID
     */

    /**
      * A player has left on the server
      *
      * @event GameEngine#server__playerDisconnected
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
      * Marks the beginning of a game step on the client
      *
      * @event GameEngine#client__preStep
      */

     /**
      * Marks the end of a game step on the client
      *
      * @event GameEngine#client__postStep
      */

    /**
     * An input needs to be handled.  Emitted just before the GameEngine
     * method processInput is invoked.
     *
     * @event GameEngine#processInput
     * @param {Object} input - input descriptor object
     * @param {String} input.input - describe the input (e.g. "up", "down", "fire")
     * @param {Number} input.messageIndex - input identifier
     * @param {Number} input.step - input execution step
     * @param {Number} playerId - the player ID
     */

    /**
     * An input needs to be handled.
     * This event is emitted on the server only, just before the
     * general processInput event.
     *
     * @event GameEngine#server__processInput
     * @param {Object} input - input descriptor object
     * @param {String} input.input - describe the input (e.g. "up", "down", "fire")
     * @param {Number} input.messageIndex - input identifier
     * @param {Number} input.step - input execution step
     * @param {Number} playerId - the player ID
     */

    /**
     * An input needs to be handled.
     * This event is emitted on the client only, just before the
     * general processInput event.
     *
     * @event GameEngine#client__processInput
     * @param {Object} input - input descriptor object
     * @param {String} input.input - describe the input (e.g. "up", "down", "fire")
     * @param {Number} input.messageIndex - input identifier
     * @param {Number} input.step - input execution step
     * @param {Number} playerId - the player ID
     */

    /**
     * Client received a sync from the server
     *
     * @event GameEngine#client__syncReceived
     * @param {Object} sync - sync from the server
     * @param {Array} syncEvents - array of events in the sync
     * @param {Number} maxStepCount - highest step in the sync
     */

    /**
     * Marks the beginning of a game step on the server
     *
     * @event GameEngine#server__preStep
     * @param {Number} stepNumber - the step number
     */

    /**
     * Marks the end of a game step on the server
     *
     * @event GameEngine#server__postStep
     * @param {Number} stepNumber - the step number
     */

    /**
     * User input received on the server
     *
     * @event GameEngine#server__inputReceived
     * @param {Object} input - input descriptor
     * @param {Object} input.data - input descriptor
     * @param {String} input.playerId - player that sent the input
     */

     /**
      * Report slow frame rate on the browser.
      * The browser did not achieve a reasonable frame rate
      *
      * @event GameEngine#client__slowFrameRate
      */


    /**
      * Create a game engine instance.  This needs to happen
      * once on the server, and once on each client.
      *
      * @param {Object} options - options object
      * @param {Number} options.traceLevel - the trace level from 0 to 5.  Lower value traces more.
      * @param {Number} options.delayInputCount - client side only.  Introduce an artificial delay on the client to better match the time it will occur on the server.  This value sets the number of steps the client will wait before applying the input locally
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

        /**
         * Remove a handler
         *
         * @method removeListener
         * @memberof GameEngine
         * @instance
         * @param {String} eventName - name of the event
         * @param {Function} eventHandler - handler function
         */
        this.removeListener = eventEmitter.removeListener;

        this.emit = eventEmitter.emit;

        // set up trace
        this.trace = new Trace({ traceLevel: this.options.traceLevel });
    }

    findLocalShadow(serverObj) {

        for (let localId of Object.keys(this.world.objects)) {
            if (Number(localId) < this.options.clientIDSpace) continue;
            let localObj = this.world.objects[localId];
            if (localObj.hasOwnProperty('inputId') && localObj.inputId === serverObj.inputId)
                return localObj;
        }

        return null;
    }

    initWorld() {

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
    }

    /**
      * Start the game. This method runs on both server
      * and client. Extending the start method is useful
      * for setting up the game's worldSettings attribute,
      * and registering methods on the event handler.
      */
    start() {
        this.trace.info('========== game engine started ==========');
        this.initWorld();
    }

    step(isReenact) {

        // emit preStep event
        isReenact = Boolean(isReenact);
        let step = ++this.world.stepCount;
        let clientIDSpace = this.options.clientIDSpace;
        this.emit('preStep', { step, isReenact });

        // skip physics for shadow objects during re-enactment
        function objectFilter(o) {
            return !isReenact || o.id < clientIDSpace;
        }

        // physics step
        if (this.physicsEngine)
            this.physicsEngine.step(objectFilter);

        // for each object
        // - apply incremental bending
        // - refresh object positions after physics
        this.world.forEachObject((id, o) => {
            if (typeof o.refreshFromPhysics === 'function')
                o.refreshFromPhysics();
            this.trace.trace(`object[${id}] after ${isReenact ? 'reenact' : 'step'} : ${o.toString()}`);
        });

        // emit postStep event
        this.emit('postStep', { step, isReenact });
    }

    /**
     * Add object to the game world.
     * On the client side, the object may not be created, if the server copy
     * of this object is already in the game world.  This could happen when the client
     * is using delayed-input, and the RTT is very low.
     *
     * @param {Object} object - the object.
     * @return {Object} object - the final object.
     */
    addObjectToWorld(object) {

        // if we are asked to create a local shadow object
        // the server copy may already have arrived.
        if (Number(object.id) >= this.options.clientIDSpace) {
            let serverCopyArrived = false;
            this.world.forEachObject((id, o) => {
                if (o.hasOwnProperty('inputId') && o.inputId === object.inputId)
                    serverCopyArrived = true;
            });
            if (serverCopyArrived) {
                this.trace.info(`========== shadow object NOT added ${object.toString()} ==========`);
                return null;
            }
        }

        this.world.objects[object.id] = object;

        // tell the object to join the game, by creating
        // its corresponding physical entities and renderer entities.
        if (typeof object.onAddToWorld === 'function')
            object.onAddToWorld(this);

        this.emit('objectAdded', object);
        this.trace.info(`========== object added ${object.toString()} ==========`);

        return object;
    }

    /**
     * Override this function to implement input handling.
     * This method will be called on the specific client where the
     * input was received, and will also be called on the server
     * when the input reaches the server.  The client does not call this
     * method directly, rather the client calls {@link ClientEngine#sendInput}
     * so that the input is sent to both server and client, and so that
     * the input is delayed artificially if so configured.
     *
     * The input is described by a short string, and is given an index.
     * The index is used internally to keep track of inputs which have already been applied
     * on the client during synchronization.  The input is also associated with
     * the ID of a player.
     *
     * @param {Object} inputMsg - input descriptor object
     * @param {String} inputMsg.input - describe the input (e.g. "up", "down", "fire")
     * @param {Number} inputMsg.messageIndex - input identifier
     * @param {Number} playerId - the player ID
     * @param {Boolean} isServer - indicate if this function is being called on the server side
     */
    processInput(inputMsg, playerId, isServer) {
        this.trace.info(`game engine processing input[${inputMsg.messageIndex}] <${inputMsg.input}> from playerId ${playerId}`);
    }

    /**
     * Remove an object from the game world.
     *
     * @param {String} id - the object ID
     */
    removeObjectFromWorld(id) {
        let ob = this.world.objects[id];
        if (!ob)
            throw new Error(`Game attempted to remove a game object which doesn't (or never did) exist, id=${id}`);
        this.trace.info(`========== destroying object ${ob.toString()} ==========`);
        this.emit('objectDestroyed', ob);
        ob.destroy();
        delete this.world.objects[id];
    }

    /**
     * Register Game Object Classes
     *
     * @example
     * registerClasses(serializer) {
     *   serializer.registerClass(require('../common/Paddle'));
     *   serializer.registerClass(require('../common/Ball'));
     * }
     *
     * @param {Serializer} serializer - the serializer
     */
    registerClasses(serializer) {
    }

}

module.exports = GameEngine;
