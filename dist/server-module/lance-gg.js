import fs from 'fs';
import path from 'path';
import http from 'http';

/**
 * This class represents an instance of the game world,
 * where all data pertaining to the current state of the
 * world is saved.
 */
class GameWorld {

    /**
     * Constructor of the World instance
     */
    constructor() {
        this.stepCount = 0;
        this.objects = {};
        this.playerCount = 0;
        this.idCount = 0;
    }

    /**
     * Gets a new, fresh and unused id that can be used for a new object
     * @return {Number} the new id
     */
    getNewId() {
        let possibleId = this.idCount;
        // find a free id
        while (possibleId in this.objects)
            possibleId++;

        this.idCount = possibleId + 1;
        return possibleId;
    }

    /**
     * Returns all the game world objects which match a criteria
     * @param {Object} query The query object
     * @param {Object} [query.id] object id
     * @param {Object} [query.playerId] player id
     * @param {Class} [query.instanceType] matches whether `object instanceof instanceType`
     * @param {Array} [query.components] An array of component names
     * @param {Boolean} [query.returnSingle] Return the first object matched
     * @returns {Array | Object} All game objects which match all the query parameters, or the first match if returnSingle was specified
     */
    queryObjects(query) {
        let queriedObjects = [];

        // todo this is currently a somewhat inefficient implementation for API testing purposes.
        // It should be implemented with cached dictionaries like in nano-ecs
        this.forEachObject((id, object) => {
            let conditions = [];

            // object id condition
            conditions.push(!('id' in query) || query.id !== null && object.id === query.id);

            // player id condition
            conditions.push(!('playerId' in query) || query.playerId !== null && object.playerId === query.playerId);

            // instance type conditio
            conditions.push(!('instanceType' in query) || query.instanceType !== null && object instanceof query.instanceType);

            // components conditions
            if ('components' in query) {
                query.components.forEach(componentClass => {
                    conditions.push(object.hasComponent(componentClass));
                });
            }

            // all conditions are true, object is qualified for the query
            if (conditions.every(value => value)) {
                queriedObjects.push(object);
                if (query.returnSingle) return false;
            }
        });

        // return a single object or null
        if (query.returnSingle) {
            return queriedObjects.length > 0 ? queriedObjects[0] : null;
        }

        return queriedObjects;
    }

    /**
     * Returns The first game object encountered which matches a criteria.
     * Syntactic sugar for {@link queryObject} with `returnSingle: true`
     * @param query See queryObjects
     * @returns {Object}
     */
    queryObject(query) {
        return this.queryObjects(Object.assign(query, {
            returnSingle: true
        }));
    }

    /**
     * Add an object to the game world
     * @param {Object} object object to add
     */
    addObject(object) {
        this.objects[object.id] = object;
    }

    /**
     * Remove an object from the game world
     * @param {number} id id of the object to remove
     */
    removeObject(id) {
        delete this.objects[id];
    }

    /**
     * World object iterator.
     * Invoke callback(objId, obj) for each object
     *
     * @param {function} callback function receives id and object. If callback returns false, the iteration will cease
     */
    forEachObject(callback) {
        for (let id of Object.keys(this.objects)) {
            let returnValue = callback(id, this.objects[id]);  // TODO: the key should be Number(id)
            if (returnValue === false) break;
        }
    }

}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

function getCjsExportFromNamespace (n) {
	return n && n.default || n;
}

var isImplemented = function () {
	var assign = Object.assign, obj;
	if (typeof assign !== "function") return false;
	obj = { foo: "raz" };
	assign(obj, { bar: "dwa" }, { trzy: "trzy" });
	return (obj.foo + obj.bar + obj.trzy) === "razdwatrzy";
};

var isImplemented$1 = function () {
	try {
		return true;
	} catch (e) {
		return false;
	}
};

// eslint-disable-next-line no-empty-function
var noop = function () {};

var _undefined = noop(); // Support ES3 engines

var isValue = function (val) {
 return (val !== _undefined) && (val !== null);
};

var keys = Object.keys;

var shim = function (object) { return keys(isValue(object) ? Object(object) : object); };

var keys$1 = isImplemented$1() ? Object.keys : shim;

var validValue = function (value) {
	if (!isValue(value)) throw new TypeError("Cannot use null or undefined");
	return value;
};

var max   = Math.max;

var shim$1 = function (dest, src /*, …srcn*/) {
	var error, i, length = max(arguments.length, 2), assign;
	dest = Object(validValue(dest));
	assign = function (key) {
		try {
			dest[key] = src[key];
		} catch (e) {
			if (!error) error = e;
		}
	};
	for (i = 1; i < length; ++i) {
		src = arguments[i];
		keys$1(src).forEach(assign);
	}
	if (error !== undefined) throw error;
	return dest;
};

var assign = isImplemented()
	? Object.assign
	: shim$1;

var forEach = Array.prototype.forEach, create = Object.create;

var process$1 = function (src, obj) {
	var key;
	for (key in src) obj[key] = src[key];
};

// eslint-disable-next-line no-unused-vars
var normalizeOptions = function (opts1 /*, …options*/) {
	var result = create(null);
	forEach.call(arguments, function (options) {
		if (!isValue(options)) return;
		process$1(Object(options), result);
	});
	return result;
};

// Deprecated

var isCallable = function (obj) {
 return typeof obj === "function";
};

var str = "razdwatrzy";

var isImplemented$2 = function () {
	if (typeof str.contains !== "function") return false;
	return (str.contains("dwa") === true) && (str.contains("foo") === false);
};

var indexOf = String.prototype.indexOf;

var shim$2 = function (searchString/*, position*/) {
	return indexOf.call(this, searchString, arguments[1]) > -1;
};

var contains = isImplemented$2()
	? String.prototype.contains
	: shim$2;

var d_1 = createCommonjsModule(function (module) {

var d;

d = module.exports = function (dscr, value/*, options*/) {
	var c, e, w, options, desc;
	if ((arguments.length < 2) || (typeof dscr !== 'string')) {
		options = value;
		value = dscr;
		dscr = null;
	} else {
		options = arguments[2];
	}
	if (dscr == null) {
		c = w = true;
		e = false;
	} else {
		c = contains.call(dscr, 'c');
		e = contains.call(dscr, 'e');
		w = contains.call(dscr, 'w');
	}

	desc = { value: value, configurable: c, enumerable: e, writable: w };
	return !options ? desc : assign(normalizeOptions(options), desc);
};

d.gs = function (dscr, get, set/*, options*/) {
	var c, e, options, desc;
	if (typeof dscr !== 'string') {
		options = set;
		set = get;
		get = dscr;
		dscr = null;
	} else {
		options = arguments[3];
	}
	if (get == null) {
		get = undefined;
	} else if (!isCallable(get)) {
		options = get;
		get = set = undefined;
	} else if (set == null) {
		set = undefined;
	} else if (!isCallable(set)) {
		options = set;
		set = undefined;
	}
	if (dscr == null) {
		c = true;
		e = false;
	} else {
		c = contains.call(dscr, 'c');
		e = contains.call(dscr, 'e');
	}

	desc = { get: get, set: set, configurable: c, enumerable: e };
	return !options ? desc : assign(normalizeOptions(options), desc);
};
});

var validCallable = function (fn) {
	if (typeof fn !== "function") throw new TypeError(fn + " is not a function");
	return fn;
};

var eventEmitter = createCommonjsModule(function (module, exports) {

var apply = Function.prototype.apply, call = Function.prototype.call
  , create = Object.create, defineProperty = Object.defineProperty
  , defineProperties = Object.defineProperties
  , hasOwnProperty = Object.prototype.hasOwnProperty
  , descriptor = { configurable: true, enumerable: false, writable: true }

  , on, once, off, emit, methods, descriptors, base;

on = function (type, listener) {
	var data;

	validCallable(listener);

	if (!hasOwnProperty.call(this, '__ee__')) {
		data = descriptor.value = create(null);
		defineProperty(this, '__ee__', descriptor);
		descriptor.value = null;
	} else {
		data = this.__ee__;
	}
	if (!data[type]) data[type] = listener;
	else if (typeof data[type] === 'object') data[type].push(listener);
	else data[type] = [data[type], listener];

	return this;
};

once = function (type, listener) {
	var once, self;

	validCallable(listener);
	self = this;
	on.call(this, type, once = function () {
		off.call(self, type, once);
		apply.call(listener, this, arguments);
	});

	once.__eeOnceListener__ = listener;
	return this;
};

off = function (type, listener) {
	var data, listeners, candidate, i;

	validCallable(listener);

	if (!hasOwnProperty.call(this, '__ee__')) return this;
	data = this.__ee__;
	if (!data[type]) return this;
	listeners = data[type];

	if (typeof listeners === 'object') {
		for (i = 0; (candidate = listeners[i]); ++i) {
			if ((candidate === listener) ||
					(candidate.__eeOnceListener__ === listener)) {
				if (listeners.length === 2) data[type] = listeners[i ? 0 : 1];
				else listeners.splice(i, 1);
			}
		}
	} else {
		if ((listeners === listener) ||
				(listeners.__eeOnceListener__ === listener)) {
			delete data[type];
		}
	}

	return this;
};

emit = function (type) {
	var i, l, listener, listeners, args;

	if (!hasOwnProperty.call(this, '__ee__')) return;
	listeners = this.__ee__[type];
	if (!listeners) return;

	if (typeof listeners === 'object') {
		l = arguments.length;
		args = new Array(l - 1);
		for (i = 1; i < l; ++i) args[i - 1] = arguments[i];

		listeners = listeners.slice();
		for (i = 0; (listener = listeners[i]); ++i) {
			apply.call(listener, this, args);
		}
	} else {
		switch (arguments.length) {
		case 1:
			call.call(listeners, this);
			break;
		case 2:
			call.call(listeners, this, arguments[1]);
			break;
		case 3:
			call.call(listeners, this, arguments[1], arguments[2]);
			break;
		default:
			l = arguments.length;
			args = new Array(l - 1);
			for (i = 1; i < l; ++i) {
				args[i - 1] = arguments[i];
			}
			apply.call(listeners, this, args);
		}
	}
};

methods = {
	on: on,
	once: once,
	off: off,
	emit: emit
};

descriptors = {
	on: d_1(on),
	once: d_1(once),
	off: d_1(off),
	emit: d_1(emit)
};

base = defineProperties({}, descriptors);

module.exports = exports = function (o) {
	return (o == null) ? create(base) : defineProperties(Object(o), descriptors);
};
exports.methods = methods;
});
var eventEmitter_1 = eventEmitter.methods;

// TODO: needs documentation
// I think the API could be simpler
//   - Timer.run(waitSteps, cb)
//   - Timer.repeat(waitSteps, count, cb) // count=null=>forever
//   - Timer.cancel(cb)
class Timer {

    constructor() {
        this.currentTime = 0;
        this.isActive = false;
        this.idCounter = 0;

        this.events = {};
    }

    play() {
        this.isActive = true;
    }

    tick() {
        let event;
        let eventId;

        if (this.isActive) {
            this.currentTime++;

            for (eventId in this.events) {
                event = this.events[eventId];
                if (event) {

                    if (event.type == 'repeat') {
                        if ((this.currentTime - event.startOffset) % event.time == 0) {
                            event.callback.apply(event.thisContext, event.args);
                        }
                    }
                    if (event.type == 'single') {
                        if ((this.currentTime - event.startOffset) % event.time == 0) {
                            event.callback.apply(event.thisContext, event.args);
                            event.destroy();
                        }
                    }

                }

            }
        }
    }

    destroyEvent(eventId) {
        delete this.events[eventId];
    }

    loop(time, callback) {
        let timerEvent = new TimerEvent(this,
            TimerEvent.TYPES.repeat,
            time,
            callback
        );

        this.events[timerEvent.id] = timerEvent;

        return timerEvent;
    }

    add(time, callback, thisContext, args) {
        let timerEvent = new TimerEvent(this,
            TimerEvent.TYPES.single,
            time,
            callback,
            thisContext,
            args
        );

        this.events[timerEvent.id] = timerEvent;
        return timerEvent;
    }

    // todo implement timer delete all events

    destroy(id) {
        delete this.events[id];
    }
}

// timer event
class TimerEvent {
    constructor(timer, type, time, callback, thisContext, args) {
        this.id = ++timer.idCounter;
        this.timer = timer;
        this.type = type;
        this.time = time;
        this.callback = callback;
        this.startOffset = timer.currentTime;
        this.thisContext = thisContext;
        this.args = args;

        this.destroy = function() {
            this.timer.destroy(this.id);
        };
    }
}

TimerEvent.TYPES = {
    repeat: 'repeat',
    single: 'single'
};

/**
 * Tracing Services.
 * Use the trace functions to trace game state.  Turn on tracing by
 * specifying the minimum trace level which should be recorded.  For
 * example, setting traceLevel to Trace.TRACE_INFO will cause info,
 * warn, and error traces to be recorded.
 */
class Trace {

    constructor(options) {

        this.options = Object.assign({
            traceLevel: this.TRACE_DEBUG
        }, options);

        this.traceBuffer = [];
        this.step = 'initializing';

        // syntactic sugar functions
        this.error = this.trace.bind(this, Trace.TRACE_ERROR);
        this.warn = this.trace.bind(this, Trace.TRACE_WARN);
        this.info = this.trace.bind(this, Trace.TRACE_INFO);
        this.debug = this.trace.bind(this, Trace.TRACE_DEBUG);
        this.trace = this.trace.bind(this, Trace.TRACE_ALL);
    }

    /**
     * Include all trace levels.
     * @memberof Trace
     * @member {Number} TRACE_ALL
     */
    static get TRACE_ALL() { return 0; }

     /**
      * Include debug traces and higher.
      * @memberof Trace
      * @member {Number} TRACE_DEBUG
      */
    static get TRACE_DEBUG() { return 1; }

     /**
      * Include info traces and higher.
      * @memberof Trace
      * @member {Number} TRACE_INFO
      */
    static get TRACE_INFO() { return 2; }

     /**
      * Include warn traces and higher.
      * @memberof Trace
      * @member {Number} TRACE_WARN
      */
    static get TRACE_WARN() { return 3; }

     /**
      * Include error traces and higher.
      * @memberof Trace
      * @member {Number} TRACE_ERROR
      */
    static get TRACE_ERROR() { return 4; }

     /**
      * Disable all tracing.
      * @memberof Trace
      * @member {Number} TRACE_NONE
      */
    static get TRACE_NONE() { return 1000; }

    trace(level, dataCB) {

         // all traces must be functions which return strings
        if (typeof dataCB !== 'function') {
            throw new Error(`Lance trace was called but instead of passing a function, it received a [${typeof dataCB}]`);
        }

        if (level < this.options.traceLevel)
            return;

        this.traceBuffer.push({ data: dataCB(), level, step: this.step, time: new Date() });
    }

    rotate() {
        let buffer = this.traceBuffer;
        this.traceBuffer = [];
        return buffer;
    }

    get length() {
        return this.traceBuffer.length;
    }

    setStep(s) {
        this.step = s;
    }
}

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
      * Create a game engine instance.  This needs to happen
      * once on the server, and once on each client.
      *
      * @param {Object} options - options object
      * @param {Number} options.traceLevel - the trace level from 0 to 5.  Lower value traces more.
      * @param {Number} options.delayInputCount - client side only.  Introduce an artificial delay on the client to better match the time it will occur on the server.  This value sets the number of steps the client will wait before applying the input locally
      */
    constructor(options) {

        // place the game engine in the LANCE globals
        const isServerSide = (typeof window === 'undefined');
        const glob = isServerSide ? global : window;
        glob.LANCE = { gameEngine: this };

        // set options
        const defaultOpts = { GameWorld: GameWorld, traceLevel: Trace.TRACE_NONE };
        if (!isServerSide) defaultOpts.clientIDSpace = 1000000;
        this.options = Object.assign(defaultOpts, options);

        /**
         * client's player ID, as a string. If running on the client, this is set at runtime by the clientEngine
         * @member {String}
         */
        this.playerId = NaN;

        // set up event emitting and interface
        let eventEmitter$1 = new eventEmitter();

        /**
         * Register a handler for an event
         *
         * @method on
         * @memberof GameEngine
         * @instance
         * @param {String} eventName - name of the event
         * @param {Function} eventHandler - handler function
         */
        this.on = eventEmitter$1.on;

        /**
         * Register a handler for an event, called just once (if at all)
         *
         * @method once
         * @memberof GameEngine
         * @instance
         * @param {String} eventName - name of the event
         * @param {Function} eventHandler - handler function
         */
        this.once = eventEmitter$1.once;

        /**
         * Remove a handler
         *
         * @method removeListener
         * @memberof GameEngine
         * @instance
         * @param {String} eventName - name of the event
         * @param {Function} eventHandler - handler function
         */
        this.removeListener = eventEmitter$1.off;
        this.off = eventEmitter$1.off;

        this.emit = eventEmitter$1.emit;

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

    initWorld(worldSettings) {

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
        this.worldSettings = Object.assign({}, worldSettings);
    }

    /**
      * Start the game. This method runs on both server
      * and client. Extending the start method is useful
      * for setting up the game's worldSettings attribute,
      * and registering methods on the event handler.
      */
    start() {
        this.trace.info(() => '========== game engine started ==========');
        this.initWorld();

        // create the default timer
        this.timer = new Timer();
        this.timer.play();
        this.on('postStep', (step, isReenact) => {
            if (!isReenact) this.timer.tick();
        });

        this.emit('start', { timestamp: (new Date()).getTime() });
    }

    /**
      * Single game step.
      *
      * @param {Boolean} isReenact - is this step a re-enactment of the past.
      * @param {Number} t - the current time (optional)
      * @param {Number} dt - elapsed time since last step was called.  (optional)
      * @param {Boolean} physicsOnly - do a physics step only, no game logic
      */
    step(isReenact, t, dt, physicsOnly) {
        // physics-only step
        if (physicsOnly) {
            if (dt) dt /= 1000; // physics engines work in seconds
            this.physicsEngine.step(dt, objectFilter);
            return;
        }

        // emit preStep event
        if (isReenact === undefined)
            throw new Error('game engine does not forward argument isReenact to super class');

        isReenact = Boolean(isReenact);
        let step = ++this.world.stepCount;
        let clientIDSpace = this.options.clientIDSpace;
        this.emit('preStep', { step, isReenact, dt });

        // skip physics for shadow objects during re-enactment
        function objectFilter(o) {
            return !isReenact || o.id < clientIDSpace;
        }

        // physics step
        if (this.physicsEngine && !this.ignorePhysics) {
            if (dt) dt /= 1000; // physics engines work in seconds
            this.physicsEngine.step(dt, objectFilter);
        }

        // for each object
        // - apply incremental bending
        // - refresh object positions after physics
        this.world.forEachObject((id, o) => {
            if (typeof o.refreshFromPhysics === 'function')
                o.refreshFromPhysics();
            this.trace.trace(() => `object[${id}] after ${isReenact ? 'reenact' : 'step'} : ${o.toString()}`);
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
                if (o.hasOwnProperty('inputId') && o.inputId === object.inputId) {
                    serverCopyArrived = true;
                    return false;
                }
            });
            if (serverCopyArrived) {
                this.trace.info(() => `========== shadow object NOT added ${object.toString()} ==========`);
                return null;
            }
        }

        this.world.addObject(object);

        // tell the object to join the game, by creating
        // its corresponding physical entities and renderer entities.
        if (typeof object.onAddToWorld === 'function')
            object.onAddToWorld(this);

        this.emit('objectAdded', object);
        this.trace.info(() => `========== object added ${object.toString()} ==========`);

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
     * @param {Object} inputDesc - input descriptor object
     * @param {String} inputDesc.input - describe the input (e.g. "up", "down", "fire")
     * @param {Number} inputDesc.messageIndex - input identifier
     * @param {Number} inputDesc.step - the step on which this input occurred
     * @param {Number} playerId - the player ID
     * @param {Boolean} isServer - indicate if this function is being called on the server side
     */
    processInput(inputDesc, playerId, isServer) {
        this.trace.info(() => `game engine processing input[${inputDesc.messageIndex}] <${inputDesc.input}> from playerId ${playerId}`);
    }

    /**
     * Remove an object from the game world.
     *
     * @param {Object|String} objectId - the object or object ID
     */
    removeObjectFromWorld(objectId) {

        if (typeof objectId === 'object') objectId = objectId.id;
        let object = this.world.objects[objectId];

        if (!object) {
            throw new Error(`Game attempted to remove a game object which doesn't (or never did) exist, id=${objectId}`);
        }
        this.trace.info(() => `========== destroying object ${object.toString()} ==========`);

        if (typeof object.onRemoveFromWorld === 'function')
            object.onRemoveFromWorld(this);

        this.emit('objectDestroyed', object);
        this.world.removeObject(objectId);
    }

    /**
     * Check if a given object is owned by the player on this client
     *
     * @param {Object} object the game object to check
     * @return {Boolean} true if the game object is owned by the player on this client
     */
    isOwnedByPlayer(object) {
        return (object.playerId == this.playerId);
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

    /**
     * Decide whether the player game is over by returning an Object, need to be implemented
     *
     * @return {Object} truthful if the game is over for the player and the object is returned as GameOver data
     */
    getPlayerGameOverResult() {
        return null;
    }
}

// The base Physics Engine class defines the expected interface
// for all physics engines
class PhysicsEngine {

    constructor(options) {
        this.options = options;
        this.gameEngine = options.gameEngine;

        if (!options.gameEngine) {
            console.warn('Physics engine initialized without gameEngine!');
        }
    }

    /**
     * A single Physics step.
     *
     * @param {Number} dt - time elapsed since last step
     * @param {Function} objectFilter - a test function which filters which objects should move
     */
    step(dt, objectFilter) {}

}

/* global P2_ARRAY_TYPE */

var Utils_1 = Utils;

/**
 * Misc utility functions
 * @class Utils
 * @constructor
 */
function Utils(){}

/**
 * Append the values in array b to the array a. See <a href="http://stackoverflow.com/questions/1374126/how-to-append-an-array-to-an-existing-javascript-array/1374131#1374131">this</a> for an explanation.
 * @method appendArray
 * @static
 * @param  {Array} a
 * @param  {Array} b
 */
Utils.appendArray = function(a,b){
    if (b.length < 150000) {
        a.push.apply(a, b);
    } else {
        for (var i = 0, len = b.length; i !== len; ++i) {
            a.push(b[i]);
        }
    }
};

/**
 * Garbage free Array.splice(). Does not allocate a new array.
 * @method splice
 * @static
 * @param  {Array} array
 * @param  {Number} index
 * @param  {Number} howmany
 */
Utils.splice = function(array,index,howmany){
    howmany = howmany || 1;
    for (var i=index, len=array.length-howmany; i < len; i++){
        array[i] = array[i + howmany];
    }
    array.length = len;
};

/**
 * The array type to use for internal numeric computations throughout the library. Float32Array is used if it is available, but falls back on Array. If you want to set array type manually, inject it via the global variable P2_ARRAY_TYPE. See example below.
 * @static
 * @property {function} ARRAY_TYPE
 * @example
 *     <script>
 *         <!-- Inject your preferred array type before loading p2.js -->
 *         P2_ARRAY_TYPE = Array;
 *     </script>
 *     <script src="p2.js"></script>
 */
if(typeof P2_ARRAY_TYPE !== 'undefined') {
    Utils.ARRAY_TYPE = P2_ARRAY_TYPE;
} else if (typeof Float32Array !== 'undefined'){
    Utils.ARRAY_TYPE = Float32Array;
} else {
    Utils.ARRAY_TYPE = Array;
}

/**
 * Extend an object with the properties of another
 * @static
 * @method extend
 * @param  {object} a
 * @param  {object} b
 */
Utils.extend = function(a,b){
    for(var key in b){
        a[key] = b[key];
    }
};

/**
 * Extend an options object with default values.
 * @static
 * @method defaults
 * @param  {object} options The options object. May be falsy: in this case, a new object is created and returned.
 * @param  {object} defaults An object containing default values.
 * @return {object} The modified options object.
 */
Utils.defaults = function(options, defaults){
    options = options || {};
    for(var key in defaults){
        if(!(key in options)){
            options[key] = defaults[key];
        }
    }
    return options;
};

var vec2_1 = createCommonjsModule(function (module) {
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * The vec2 object from glMatrix, with some extensions and some removed methods. See http://glmatrix.net.
 * @class vec2
 */

var vec2 = module.exports = {};



/**
 * Make a cross product and only return the z component
 * @method crossLength
 * @static
 * @param  {Array} a
 * @param  {Array} b
 * @return {Number}
 */
vec2.crossLength = function(a,b){
    return a[0] * b[1] - a[1] * b[0];
};

/**
 * Cross product between a vector and the Z component of a vector
 * @method crossVZ
 * @static
 * @param  {Array} out
 * @param  {Array} vec
 * @param  {Number} zcomp
 * @return {Number}
 */
vec2.crossVZ = function(out, vec, zcomp){
    vec2.rotate(out,vec,-Math.PI/2);// Rotate according to the right hand rule
    vec2.scale(out,out,zcomp);      // Scale with z
    return out;
};

/**
 * Cross product between a vector and the Z component of a vector
 * @method crossZV
 * @static
 * @param  {Array} out
 * @param  {Number} zcomp
 * @param  {Array} vec
 * @return {Number}
 */
vec2.crossZV = function(out, zcomp, vec){
    vec2.rotate(out,vec,Math.PI/2); // Rotate according to the right hand rule
    vec2.scale(out,out,zcomp);      // Scale with z
    return out;
};

/**
 * Rotate a vector by an angle
 * @method rotate
 * @static
 * @param  {Array} out
 * @param  {Array} a
 * @param  {Number} angle
 */
vec2.rotate = function(out,a,angle){
    if(angle !== 0){
        var c = Math.cos(angle),
            s = Math.sin(angle),
            x = a[0],
            y = a[1];
        out[0] = c*x -s*y;
        out[1] = s*x +c*y;
    } else {
        out[0] = a[0];
        out[1] = a[1];
    }
};

/**
 * Rotate a vector 90 degrees clockwise
 * @method rotate90cw
 * @static
 * @param  {Array} out
 * @param  {Array} a
 * @param  {Number} angle
 */
vec2.rotate90cw = function(out, a) {
    var x = a[0];
    var y = a[1];
    out[0] = y;
    out[1] = -x;
};

/**
 * Transform a point position to local frame.
 * @method toLocalFrame
 * @param  {Array} out
 * @param  {Array} worldPoint
 * @param  {Array} framePosition
 * @param  {Number} frameAngle
 */
vec2.toLocalFrame = function(out, worldPoint, framePosition, frameAngle){
    vec2.copy(out, worldPoint);
    vec2.sub(out, out, framePosition);
    vec2.rotate(out, out, -frameAngle);
};

/**
 * Transform a point position to global frame.
 * @method toGlobalFrame
 * @param  {Array} out
 * @param  {Array} localPoint
 * @param  {Array} framePosition
 * @param  {Number} frameAngle
 */
vec2.toGlobalFrame = function(out, localPoint, framePosition, frameAngle){
    vec2.copy(out, localPoint);
    vec2.rotate(out, out, frameAngle);
    vec2.add(out, out, framePosition);
};

/**
 * Transform a vector to local frame.
 * @method vectorToLocalFrame
 * @param  {Array} out
 * @param  {Array} worldVector
 * @param  {Number} frameAngle
 */
vec2.vectorToLocalFrame = function(out, worldVector, frameAngle){
    vec2.rotate(out, worldVector, -frameAngle);
};

/**
 * Transform a point position to global frame.
 * @method toGlobalFrame
 * @param  {Array} out
 * @param  {Array} localVector
 * @param  {Number} frameAngle
 */
vec2.vectorToGlobalFrame = function(out, localVector, frameAngle){
    vec2.rotate(out, localVector, frameAngle);
};

/**
 * Compute centroid of a triangle spanned by vectors a,b,c. See http://easycalculation.com/analytical/learn-centroid.php
 * @method centroid
 * @static
 * @param  {Array} out
 * @param  {Array} a
 * @param  {Array} b
 * @param  {Array} c
 * @return  {Array} The out object
 */
vec2.centroid = function(out, a, b, c){
    vec2.add(out, a, b);
    vec2.add(out, out, c);
    vec2.scale(out, out, 1/3);
    return out;
};

/**
 * Creates a new, empty vec2
 * @static
 * @method create
 * @return {Array} a new 2D vector
 */
vec2.create = function() {
    var out = new Utils_1.ARRAY_TYPE(2);
    out[0] = 0;
    out[1] = 0;
    return out;
};

/**
 * Creates a new vec2 initialized with values from an existing vector
 * @static
 * @method clone
 * @param {Array} a vector to clone
 * @return {Array} a new 2D vector
 */
vec2.clone = function(a) {
    var out = new Utils_1.ARRAY_TYPE(2);
    out[0] = a[0];
    out[1] = a[1];
    return out;
};

/**
 * Creates a new vec2 initialized with the given values
 * @static
 * @method fromValues
 * @param {Number} x X component
 * @param {Number} y Y component
 * @return {Array} a new 2D vector
 */
vec2.fromValues = function(x, y) {
    var out = new Utils_1.ARRAY_TYPE(2);
    out[0] = x;
    out[1] = y;
    return out;
};

/**
 * Copy the values from one vec2 to another
 * @static
 * @method copy
 * @param {Array} out the receiving vector
 * @param {Array} a the source vector
 * @return {Array} out
 */
vec2.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    return out;
};

/**
 * Set the components of a vec2 to the given values
 * @static
 * @method set
 * @param {Array} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @return {Array} out
 */
vec2.set = function(out, x, y) {
    out[0] = x;
    out[1] = y;
    return out;
};

/**
 * Adds two vec2's
 * @static
 * @method add
 * @param {Array} out the receiving vector
 * @param {Array} a the first operand
 * @param {Array} b the second operand
 * @return {Array} out
 */
vec2.add = function(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    return out;
};

/**
 * Subtracts two vec2's
 * @static
 * @method subtract
 * @param {Array} out the receiving vector
 * @param {Array} a the first operand
 * @param {Array} b the second operand
 * @return {Array} out
 */
vec2.subtract = function(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    return out;
};

/**
 * Alias for vec2.subtract
 * @static
 * @method sub
 */
vec2.sub = vec2.subtract;

/**
 * Multiplies two vec2's
 * @static
 * @method multiply
 * @param {Array} out the receiving vector
 * @param {Array} a the first operand
 * @param {Array} b the second operand
 * @return {Array} out
 */
vec2.multiply = function(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    return out;
};

/**
 * Alias for vec2.multiply
 * @static
 * @method mul
 */
vec2.mul = vec2.multiply;

/**
 * Divides two vec2's
 * @static
 * @method divide
 * @param {Array} out the receiving vector
 * @param {Array} a the first operand
 * @param {Array} b the second operand
 * @return {Array} out
 */
vec2.divide = function(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    return out;
};

/**
 * Alias for vec2.divide
 * @static
 * @method div
 */
vec2.div = vec2.divide;

/**
 * Scales a vec2 by a scalar number
 * @static
 * @method scale
 * @param {Array} out the receiving vector
 * @param {Array} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @return {Array} out
 */
vec2.scale = function(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    return out;
};

/**
 * Calculates the euclidian distance between two vec2's
 * @static
 * @method distance
 * @param {Array} a the first operand
 * @param {Array} b the second operand
 * @return {Number} distance between a and b
 */
vec2.distance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1];
    return Math.sqrt(x*x + y*y);
};

/**
 * Alias for vec2.distance
 * @static
 * @method dist
 */
vec2.dist = vec2.distance;

/**
 * Calculates the squared euclidian distance between two vec2's
 * @static
 * @method squaredDistance
 * @param {Array} a the first operand
 * @param {Array} b the second operand
 * @return {Number} squared distance between a and b
 */
vec2.squaredDistance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1];
    return x*x + y*y;
};

/**
 * Alias for vec2.squaredDistance
 * @static
 * @method sqrDist
 */
vec2.sqrDist = vec2.squaredDistance;

/**
 * Calculates the length of a vec2
 * @static
 * @method length
 * @param {Array} a vector to calculate length of
 * @return {Number} length of a
 */
vec2.length = function (a) {
    var x = a[0],
        y = a[1];
    return Math.sqrt(x*x + y*y);
};

/**
 * Alias for vec2.length
 * @method len
 * @static
 */
vec2.len = vec2.length;

/**
 * Calculates the squared length of a vec2
 * @static
 * @method squaredLength
 * @param {Array} a vector to calculate squared length of
 * @return {Number} squared length of a
 */
vec2.squaredLength = function (a) {
    var x = a[0],
        y = a[1];
    return x*x + y*y;
};

/**
 * Alias for vec2.squaredLength
 * @static
 * @method sqrLen
 */
vec2.sqrLen = vec2.squaredLength;

/**
 * Negates the components of a vec2
 * @static
 * @method negate
 * @param {Array} out the receiving vector
 * @param {Array} a vector to negate
 * @return {Array} out
 */
vec2.negate = function(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    return out;
};

/**
 * Normalize a vec2
 * @static
 * @method normalize
 * @param {Array} out the receiving vector
 * @param {Array} a vector to normalize
 * @return {Array} out
 */
vec2.normalize = function(out, a) {
    var x = a[0],
        y = a[1];
    var len = x*x + y*y;
    if (len > 0) {
        //TODO: evaluate use of glm_invsqrt here?
        len = 1 / Math.sqrt(len);
        out[0] = a[0] * len;
        out[1] = a[1] * len;
    }
    return out;
};

/**
 * Calculates the dot product of two vec2's
 * @static
 * @method dot
 * @param {Array} a the first operand
 * @param {Array} b the second operand
 * @return {Number} dot product of a and b
 */
vec2.dot = function (a, b) {
    return a[0] * b[0] + a[1] * b[1];
};

/**
 * Returns a string representation of a vector
 * @static
 * @method str
 * @param {Array} vec vector to represent as a string
 * @return {String} string representation of the vector
 */
vec2.str = function (a) {
    return 'vec2(' + a[0] + ', ' + a[1] + ')';
};

/**
 * Linearly interpolate/mix two vectors.
 * @static
 * @method lerp
 * @param {Array} out
 * @param {Array} a First vector
 * @param {Array} b Second vector
 * @param {number} t Lerp factor
 */
vec2.lerp = function (out, a, b, t) {
    var ax = a[0],
        ay = a[1];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    return out;
};

/**
 * Reflect a vector along a normal.
 * @static
 * @method reflect
 * @param {Array} out
 * @param {Array} vector
 * @param {Array} normal
 */
vec2.reflect = function(out, vector, normal){
    var dot = vector[0] * normal[0] + vector[1] * normal[1];
    out[0] = vector[0] - 2 * normal[0] * dot;
    out[1] = vector[1] - 2 * normal[1] * dot;
};

/**
 * Get the intersection point between two line segments.
 * @static
 * @method getLineSegmentsIntersection
 * @param  {Array} out
 * @param  {Array} p0
 * @param  {Array} p1
 * @param  {Array} p2
 * @param  {Array} p3
 * @return {boolean} True if there was an intersection, otherwise false.
 */
vec2.getLineSegmentsIntersection = function(out, p0, p1, p2, p3) {
    var t = vec2.getLineSegmentsIntersectionFraction(p0, p1, p2, p3);
    if(t < 0){
        return false;
    } else {
        out[0] = p0[0] + (t * (p1[0] - p0[0]));
        out[1] = p0[1] + (t * (p1[1] - p0[1]));
        return true;
    }
};

/**
 * Get the intersection fraction between two line segments. If successful, the intersection is at p0 + t * (p1 - p0)
 * @static
 * @method getLineSegmentsIntersectionFraction
 * @param  {Array} p0
 * @param  {Array} p1
 * @param  {Array} p2
 * @param  {Array} p3
 * @return {number} A number between 0 and 1 if there was an intersection, otherwise -1.
 */
vec2.getLineSegmentsIntersectionFraction = function(p0, p1, p2, p3) {
    var s1_x = p1[0] - p0[0];
    var s1_y = p1[1] - p0[1];
    var s2_x = p3[0] - p2[0];
    var s2_y = p3[1] - p2[1];

    var s, t;
    s = (-s1_y * (p0[0] - p2[0]) + s1_x * (p0[1] - p2[1])) / (-s2_x * s1_y + s1_x * s2_y);
    t = ( s2_x * (p0[1] - p2[1]) - s2_y * (p0[0] - p2[0])) / (-s2_x * s1_y + s1_x * s2_y);
    if (s >= 0 && s <= 1 && t >= 0 && t <= 1) { // Collision detected
        return t;
    }
    return -1; // No collision
};
});

var AABB_1 = AABB;

/**
 * Axis aligned bounding box class.
 * @class AABB
 * @constructor
 * @param {Object}  [options]
 * @param {Array}   [options.upperBound]
 * @param {Array}   [options.lowerBound]
 */
function AABB(options){

    /**
     * The lower bound of the bounding box.
     * @property lowerBound
     * @type {Array}
     */
    this.lowerBound = vec2_1.create();
    if(options && options.lowerBound){
        vec2_1.copy(this.lowerBound, options.lowerBound);
    }

    /**
     * The upper bound of the bounding box.
     * @property upperBound
     * @type {Array}
     */
    this.upperBound = vec2_1.create();
    if(options && options.upperBound){
        vec2_1.copy(this.upperBound, options.upperBound);
    }
}

var tmp = vec2_1.create();

/**
 * Set the AABB bounds from a set of points, transformed by the given position and angle.
 * @method setFromPoints
 * @param {Array} points An array of vec2's.
 * @param {Array} position
 * @param {number} angle
 * @param {number} skinSize Some margin to be added to the AABB.
 */
AABB.prototype.setFromPoints = function(points, position, angle, skinSize){
    var l = this.lowerBound,
        u = this.upperBound;

    if(typeof(angle) !== "number"){
        angle = 0;
    }

    // Set to the first point
    if(angle !== 0){
        vec2_1.rotate(l, points[0], angle);
    } else {
        vec2_1.copy(l, points[0]);
    }
    vec2_1.copy(u, l);

    // Compute cosines and sines just once
    var cosAngle = Math.cos(angle),
        sinAngle = Math.sin(angle);
    for(var i = 1; i<points.length; i++){
        var p = points[i];

        if(angle !== 0){
            var x = p[0],
                y = p[1];
            tmp[0] = cosAngle * x -sinAngle * y;
            tmp[1] = sinAngle * x +cosAngle * y;
            p = tmp;
        }

        for(var j=0; j<2; j++){
            if(p[j] > u[j]){
                u[j] = p[j];
            }
            if(p[j] < l[j]){
                l[j] = p[j];
            }
        }
    }

    // Add offset
    if(position){
        vec2_1.add(this.lowerBound, this.lowerBound, position);
        vec2_1.add(this.upperBound, this.upperBound, position);
    }

    if(skinSize){
        this.lowerBound[0] -= skinSize;
        this.lowerBound[1] -= skinSize;
        this.upperBound[0] += skinSize;
        this.upperBound[1] += skinSize;
    }
};

/**
 * Copy bounds from an AABB to this AABB
 * @method copy
 * @param  {AABB} aabb
 */
AABB.prototype.copy = function(aabb){
    vec2_1.copy(this.lowerBound, aabb.lowerBound);
    vec2_1.copy(this.upperBound, aabb.upperBound);
};

/**
 * Extend this AABB so that it covers the given AABB too.
 * @method extend
 * @param  {AABB} aabb
 */
AABB.prototype.extend = function(aabb){
    // Loop over x and y
    var i = 2;
    while(i--){
        // Extend lower bound
        var l = aabb.lowerBound[i];
        if(this.lowerBound[i] > l){
            this.lowerBound[i] = l;
        }

        // Upper
        var u = aabb.upperBound[i];
        if(this.upperBound[i] < u){
            this.upperBound[i] = u;
        }
    }
};

/**
 * Returns true if the given AABB overlaps this AABB.
 * @method overlaps
 * @param  {AABB} aabb
 * @return {Boolean}
 */
AABB.prototype.overlaps = function(aabb){
    var l1 = this.lowerBound,
        u1 = this.upperBound,
        l2 = aabb.lowerBound,
        u2 = aabb.upperBound;

    //      l2        u2
    //      |---------|
    // |--------|
    // l1       u1

    return ((l2[0] <= u1[0] && u1[0] <= u2[0]) || (l1[0] <= u2[0] && u2[0] <= u1[0])) &&
           ((l2[1] <= u1[1] && u1[1] <= u2[1]) || (l1[1] <= u2[1] && u2[1] <= u1[1]));
};

/**
 * @method containsPoint
 * @param  {Array} point
 * @return {boolean}
 */
AABB.prototype.containsPoint = function(point){
    var l = this.lowerBound,
        u = this.upperBound;
    return l[0] <= point[0] && point[0] <= u[0] && l[1] <= point[1] && point[1] <= u[1];
};

/**
 * Check if the AABB is hit by a ray.
 * @method overlapsRay
 * @param  {Ray} ray
 * @return {number} -1 if no hit, a number between 0 and 1 if hit.
 */
AABB.prototype.overlapsRay = function(ray){

    // ray.direction is unit direction vector of ray
    var dirFracX = 1 / ray.direction[0];
    var dirFracY = 1 / ray.direction[1];

    // this.lowerBound is the corner of AABB with minimal coordinates - left bottom, rt is maximal corner
    var t1 = (this.lowerBound[0] - ray.from[0]) * dirFracX;
    var t2 = (this.upperBound[0] - ray.from[0]) * dirFracX;
    var t3 = (this.lowerBound[1] - ray.from[1]) * dirFracY;
    var t4 = (this.upperBound[1] - ray.from[1]) * dirFracY;

    var tmin = Math.max(Math.max(Math.min(t1, t2), Math.min(t3, t4)));
    var tmax = Math.min(Math.min(Math.max(t1, t2), Math.max(t3, t4)));

    // if tmax < 0, ray (line) is intersecting AABB, but whole AABB is behing us
    if (tmax < 0){
        //t = tmax;
        return -1;
    }

    // if tmin > tmax, ray doesn't intersect AABB
    if (tmin > tmax){
        //t = tmax;
        return -1;
    }

    return tmin;
};

var Scalar_1 = Scalar;

/**
 * Scalar functions
 * @class Scalar
 */
function Scalar(){}

/**
 * Check if two scalars are equal
 * @static
 * @method eq
 * @param  {Number} a
 * @param  {Number} b
 * @param  {Number} [precision]
 * @return {Boolean}
 */
Scalar.eq = function(a,b,precision){
    precision = precision || 0;
    return Math.abs(a-b) < precision;
};

var Line_1 = Line;

/**
 * Container for line-related functions
 * @class Line
 */
function Line(){}
/**
 * Compute the intersection between two lines.
 * @static
 * @method lineInt
 * @param  {Array}  l1          Line vector 1
 * @param  {Array}  l2          Line vector 2
 * @param  {Number} precision   Precision to use when checking if the lines are parallel
 * @return {Array}              The intersection point.
 */
Line.lineInt = function(l1,l2,precision){
    precision = precision || 0;
    var i = [0,0]; // point
    var a1, b1, c1, a2, b2, c2, det; // scalars
    a1 = l1[1][1] - l1[0][1];
    b1 = l1[0][0] - l1[1][0];
    c1 = a1 * l1[0][0] + b1 * l1[0][1];
    a2 = l2[1][1] - l2[0][1];
    b2 = l2[0][0] - l2[1][0];
    c2 = a2 * l2[0][0] + b2 * l2[0][1];
    det = a1 * b2 - a2*b1;
    if (!Scalar_1.eq(det, 0, precision)) { // lines are not parallel
        i[0] = (b2 * c1 - b1 * c2) / det;
        i[1] = (a1 * c2 - a2 * c1) / det;
    }
    return i;
};

/**
 * Checks if two line segments intersects.
 * @method segmentsIntersect
 * @param {Array} p1 The start vertex of the first line segment.
 * @param {Array} p2 The end vertex of the first line segment.
 * @param {Array} q1 The start vertex of the second line segment.
 * @param {Array} q2 The end vertex of the second line segment.
 * @return {Boolean} True if the two line segments intersect
 */
Line.segmentsIntersect = function(p1, p2, q1, q2){
   var dx = p2[0] - p1[0];
   var dy = p2[1] - p1[1];
   var da = q2[0] - q1[0];
   var db = q2[1] - q1[1];

   // segments are parallel
   if(da*dy - db*dx == 0)
      return false;

   var s = (dx * (q1[1] - p1[1]) + dy * (p1[0] - q1[0])) / (da * dy - db * dx);
   var t = (da * (p1[1] - q1[1]) + db * (q1[0] - p1[0])) / (db * dx - da * dy);

   return (s>=0 && s<=1 && t>=0 && t<=1);
};

var Point_1 = Point;

/**
 * Point related functions
 * @class Point
 */
function Point(){}
/**
 * Get the area of a triangle spanned by the three given points. Note that the area will be negative if the points are not given in counter-clockwise order.
 * @static
 * @method area
 * @param  {Array} a
 * @param  {Array} b
 * @param  {Array} c
 * @return {Number}
 */
Point.area = function(a,b,c){
    return (((b[0] - a[0])*(c[1] - a[1]))-((c[0] - a[0])*(b[1] - a[1])));
};

Point.left = function(a,b,c){
    return Point.area(a,b,c) > 0;
};

Point.leftOn = function(a,b,c) {
    return Point.area(a, b, c) >= 0;
};

Point.right = function(a,b,c) {
    return Point.area(a, b, c) < 0;
};

Point.rightOn = function(a,b,c) {
    return Point.area(a, b, c) <= 0;
};

var tmpPoint1 = [],
    tmpPoint2 = [];

/**
 * Check if three points are collinear
 * @method collinear
 * @param  {Array} a
 * @param  {Array} b
 * @param  {Array} c
 * @param  {Number} [thresholdAngle=0] Threshold angle to use when comparing the vectors. The function will return true if the angle between the resulting vectors is less than this value. Use zero for max precision.
 * @return {Boolean}
 */
Point.collinear = function(a,b,c,thresholdAngle) {
    if(!thresholdAngle)
        return Point.area(a, b, c) == 0;
    else {
        var ab = tmpPoint1,
            bc = tmpPoint2;

        ab[0] = b[0]-a[0];
        ab[1] = b[1]-a[1];
        bc[0] = c[0]-b[0];
        bc[1] = c[1]-b[1];

        var dot = ab[0]*bc[0] + ab[1]*bc[1],
            magA = Math.sqrt(ab[0]*ab[0] + ab[1]*ab[1]),
            magB = Math.sqrt(bc[0]*bc[0] + bc[1]*bc[1]),
            angle = Math.acos(dot/(magA*magB));
        return angle < thresholdAngle;
    }
};

Point.sqdist = function(a,b){
    var dx = b[0] - a[0];
    var dy = b[1] - a[1];
    return dx * dx + dy * dy;
};

var Polygon_1 = Polygon;

/**
 * Polygon class.
 * @class Polygon
 * @constructor
 */
function Polygon(){

    /**
     * Vertices that this polygon consists of. An array of array of numbers, example: [[0,0],[1,0],..]
     * @property vertices
     * @type {Array}
     */
    this.vertices = [];
}

/**
 * Get a vertex at position i. It does not matter if i is out of bounds, this function will just cycle.
 * @method at
 * @param  {Number} i
 * @return {Array}
 */
Polygon.prototype.at = function(i){
    var v = this.vertices,
        s = v.length;
    return v[i < 0 ? i % s + s : i % s];
};

/**
 * Get first vertex
 * @method first
 * @return {Array}
 */
Polygon.prototype.first = function(){
    return this.vertices[0];
};

/**
 * Get last vertex
 * @method last
 * @return {Array}
 */
Polygon.prototype.last = function(){
    return this.vertices[this.vertices.length-1];
};

/**
 * Clear the polygon data
 * @method clear
 * @return {Array}
 */
Polygon.prototype.clear = function(){
    this.vertices.length = 0;
};

/**
 * Append points "from" to "to"-1 from an other polygon "poly" onto this one.
 * @method append
 * @param {Polygon} poly The polygon to get points from.
 * @param {Number}  from The vertex index in "poly".
 * @param {Number}  to The end vertex index in "poly". Note that this vertex is NOT included when appending.
 * @return {Array}
 */
Polygon.prototype.append = function(poly,from,to){
    if(typeof(from) == "undefined") throw new Error("From is not given!");
    if(typeof(to) == "undefined")   throw new Error("To is not given!");

    if(to-1 < from)                 throw new Error("lol1");
    if(to > poly.vertices.length)   throw new Error("lol2");
    if(from < 0)                    throw new Error("lol3");

    for(var i=from; i<to; i++){
        this.vertices.push(poly.vertices[i]);
    }
};

/**
 * Make sure that the polygon vertices are ordered counter-clockwise.
 * @method makeCCW
 */
Polygon.prototype.makeCCW = function(){
    var br = 0,
        v = this.vertices;

    // find bottom right point
    for (var i = 1; i < this.vertices.length; ++i) {
        if (v[i][1] < v[br][1] || (v[i][1] == v[br][1] && v[i][0] > v[br][0])) {
            br = i;
        }
    }

    // reverse poly if clockwise
    if (!Point_1.left(this.at(br - 1), this.at(br), this.at(br + 1))) {
        this.reverse();
    }
};

/**
 * Reverse the vertices in the polygon
 * @method reverse
 */
Polygon.prototype.reverse = function(){
    var tmp = [];
    for(var i=0, N=this.vertices.length; i!==N; i++){
        tmp.push(this.vertices.pop());
    }
    this.vertices = tmp;
};

/**
 * Check if a point in the polygon is a reflex point
 * @method isReflex
 * @param  {Number}  i
 * @return {Boolean}
 */
Polygon.prototype.isReflex = function(i){
    return Point_1.right(this.at(i - 1), this.at(i), this.at(i + 1));
};

var tmpLine1=[],
    tmpLine2=[];

/**
 * Check if two vertices in the polygon can see each other
 * @method canSee
 * @param  {Number} a Vertex index 1
 * @param  {Number} b Vertex index 2
 * @return {Boolean}
 */
Polygon.prototype.canSee = function(a,b) {
    var p, dist, l1=tmpLine1, l2=tmpLine2;

    if (Point_1.leftOn(this.at(a + 1), this.at(a), this.at(b)) && Point_1.rightOn(this.at(a - 1), this.at(a), this.at(b))) {
        return false;
    }
    dist = Point_1.sqdist(this.at(a), this.at(b));
    for (var i = 0; i !== this.vertices.length; ++i) { // for each edge
        if ((i + 1) % this.vertices.length === a || i === a) // ignore incident edges
            continue;
        if (Point_1.leftOn(this.at(a), this.at(b), this.at(i + 1)) && Point_1.rightOn(this.at(a), this.at(b), this.at(i))) { // if diag intersects an edge
            l1[0] = this.at(a);
            l1[1] = this.at(b);
            l2[0] = this.at(i);
            l2[1] = this.at(i + 1);
            p = Line_1.lineInt(l1,l2);
            if (Point_1.sqdist(this.at(a), p) < dist) { // if edge is blocking visibility to b
                return false;
            }
        }
    }

    return true;
};

/**
 * Copy the polygon from vertex i to vertex j.
 * @method copy
 * @param  {Number} i
 * @param  {Number} j
 * @param  {Polygon} [targetPoly]   Optional target polygon to save in.
 * @return {Polygon}                The resulting copy.
 */
Polygon.prototype.copy = function(i,j,targetPoly){
    var p = targetPoly || new Polygon();
    p.clear();
    if (i < j) {
        // Insert all vertices from i to j
        for(var k=i; k<=j; k++)
            p.vertices.push(this.vertices[k]);

    } else {

        // Insert vertices 0 to j
        for(var k=0; k<=j; k++)
            p.vertices.push(this.vertices[k]);

        // Insert vertices i to end
        for(var k=i; k<this.vertices.length; k++)
            p.vertices.push(this.vertices[k]);
    }

    return p;
};

/**
 * Decomposes the polygon into convex pieces. Returns a list of edges [[p1,p2],[p2,p3],...] that cuts the polygon.
 * Note that this algorithm has complexity O(N^4) and will be very slow for polygons with many vertices.
 * @method getCutEdges
 * @return {Array}
 */
Polygon.prototype.getCutEdges = function() {
    var min=[], tmp1=[], tmp2=[], tmpPoly = new Polygon();
    var nDiags = Number.MAX_VALUE;

    for (var i = 0; i < this.vertices.length; ++i) {
        if (this.isReflex(i)) {
            for (var j = 0; j < this.vertices.length; ++j) {
                if (this.canSee(i, j)) {
                    tmp1 = this.copy(i, j, tmpPoly).getCutEdges();
                    tmp2 = this.copy(j, i, tmpPoly).getCutEdges();

                    for(var k=0; k<tmp2.length; k++)
                        tmp1.push(tmp2[k]);

                    if (tmp1.length < nDiags) {
                        min = tmp1;
                        nDiags = tmp1.length;
                        min.push([this.at(i), this.at(j)]);
                    }
                }
            }
        }
    }

    return min;
};

/**
 * Decomposes the polygon into one or more convex sub-Polygons.
 * @method decomp
 * @return {Array} An array or Polygon objects.
 */
Polygon.prototype.decomp = function(){
    var edges = this.getCutEdges();
    if(edges.length > 0)
        return this.slice(edges);
    else
        return [this];
};

/**
 * Slices the polygon given one or more cut edges. If given one, this function will return two polygons (false on failure). If many, an array of polygons.
 * @method slice
 * @param {Array} cutEdges A list of edges, as returned by .getCutEdges()
 * @return {Array}
 */
Polygon.prototype.slice = function(cutEdges){
    if(cutEdges.length == 0) return [this];
    if(cutEdges instanceof Array && cutEdges.length && cutEdges[0] instanceof Array && cutEdges[0].length==2 && cutEdges[0][0] instanceof Array){

        var polys = [this];

        for(var i=0; i<cutEdges.length; i++){
            var cutEdge = cutEdges[i];
            // Cut all polys
            for(var j=0; j<polys.length; j++){
                var poly = polys[j];
                var result = poly.slice(cutEdge);
                if(result){
                    // Found poly! Cut and quit
                    polys.splice(j,1);
                    polys.push(result[0],result[1]);
                    break;
                }
            }
        }

        return polys;
    } else {

        // Was given one edge
        var cutEdge = cutEdges;
        var i = this.vertices.indexOf(cutEdge[0]);
        var j = this.vertices.indexOf(cutEdge[1]);

        if(i != -1 && j != -1){
            return [this.copy(i,j),
                    this.copy(j,i)];
        } else {
            return false;
        }
    }
};

/**
 * Checks that the line segments of this polygon do not intersect each other.
 * @method isSimple
 * @param  {Array} path An array of vertices e.g. [[0,0],[0,1],...]
 * @return {Boolean}
 * @todo Should it check all segments with all others?
 */
Polygon.prototype.isSimple = function(){
    var path = this.vertices;
    // Check
    for(var i=0; i<path.length-1; i++){
        for(var j=0; j<i-1; j++){
            if(Line_1.segmentsIntersect(path[i], path[i+1], path[j], path[j+1] )){
                return false;
            }
        }
    }

    // Check the segment between the last and the first point to all others
    for(var i=1; i<path.length-2; i++){
        if(Line_1.segmentsIntersect(path[0], path[path.length-1], path[i], path[i+1] )){
            return false;
        }
    }

    return true;
};

function getIntersectionPoint(p1, p2, q1, q2, delta){
    delta = delta || 0;
   var a1 = p2[1] - p1[1];
   var b1 = p1[0] - p2[0];
   var c1 = (a1 * p1[0]) + (b1 * p1[1]);
   var a2 = q2[1] - q1[1];
   var b2 = q1[0] - q2[0];
   var c2 = (a2 * q1[0]) + (b2 * q1[1]);
   var det = (a1 * b2) - (a2 * b1);

   if(!Scalar_1.eq(det,0,delta))
      return [((b2 * c1) - (b1 * c2)) / det, ((a1 * c2) - (a2 * c1)) / det]
   else
      return [0,0]
}

/**
 * Quickly decompose the Polygon into convex sub-polygons.
 * @method quickDecomp
 * @param  {Array} result
 * @param  {Array} [reflexVertices]
 * @param  {Array} [steinerPoints]
 * @param  {Number} [delta]
 * @param  {Number} [maxlevel]
 * @param  {Number} [level]
 * @return {Array}
 */
Polygon.prototype.quickDecomp = function(result,reflexVertices,steinerPoints,delta,maxlevel,level){
    maxlevel = maxlevel || 100;
    level = level || 0;
    delta = delta || 25;
    result = typeof(result)!="undefined" ? result : [];
    reflexVertices = reflexVertices || [];
    steinerPoints = steinerPoints || [];

    var upperInt=[0,0], lowerInt=[0,0], p=[0,0]; // Points
    var upperDist=0, lowerDist=0, d=0, closestDist=0; // scalars
    var upperIndex=0, lowerIndex=0, closestIndex=0; // Integers
    var lowerPoly=new Polygon(), upperPoly=new Polygon(); // polygons
    var poly = this,
        v = this.vertices;

    if(v.length < 3) return result;

    level++;
    if(level > maxlevel){
        console.warn("quickDecomp: max level ("+maxlevel+") reached.");
        return result;
    }

    for (var i = 0; i < this.vertices.length; ++i) {
        if (poly.isReflex(i)) {
            reflexVertices.push(poly.vertices[i]);
            upperDist = lowerDist = Number.MAX_VALUE;


            for (var j = 0; j < this.vertices.length; ++j) {
                if (Point_1.left(poly.at(i - 1), poly.at(i), poly.at(j))
                        && Point_1.rightOn(poly.at(i - 1), poly.at(i), poly.at(j - 1))) { // if line intersects with an edge
                    p = getIntersectionPoint(poly.at(i - 1), poly.at(i), poly.at(j), poly.at(j - 1)); // find the point of intersection
                    if (Point_1.right(poly.at(i + 1), poly.at(i), p)) { // make sure it's inside the poly
                        d = Point_1.sqdist(poly.vertices[i], p);
                        if (d < lowerDist) { // keep only the closest intersection
                            lowerDist = d;
                            lowerInt = p;
                            lowerIndex = j;
                        }
                    }
                }
                if (Point_1.left(poly.at(i + 1), poly.at(i), poly.at(j + 1))
                        && Point_1.rightOn(poly.at(i + 1), poly.at(i), poly.at(j))) {
                    p = getIntersectionPoint(poly.at(i + 1), poly.at(i), poly.at(j), poly.at(j + 1));
                    if (Point_1.left(poly.at(i - 1), poly.at(i), p)) {
                        d = Point_1.sqdist(poly.vertices[i], p);
                        if (d < upperDist) {
                            upperDist = d;
                            upperInt = p;
                            upperIndex = j;
                        }
                    }
                }
            }

            // if there are no vertices to connect to, choose a point in the middle
            if (lowerIndex == (upperIndex + 1) % this.vertices.length) {
                //console.log("Case 1: Vertex("+i+"), lowerIndex("+lowerIndex+"), upperIndex("+upperIndex+"), poly.size("+this.vertices.length+")");
                p[0] = (lowerInt[0] + upperInt[0]) / 2;
                p[1] = (lowerInt[1] + upperInt[1]) / 2;
                steinerPoints.push(p);

                if (i < upperIndex) {
                    //lowerPoly.insert(lowerPoly.end(), poly.begin() + i, poly.begin() + upperIndex + 1);
                    lowerPoly.append(poly, i, upperIndex+1);
                    lowerPoly.vertices.push(p);
                    upperPoly.vertices.push(p);
                    if (lowerIndex != 0){
                        //upperPoly.insert(upperPoly.end(), poly.begin() + lowerIndex, poly.end());
                        upperPoly.append(poly,lowerIndex,poly.vertices.length);
                    }
                    //upperPoly.insert(upperPoly.end(), poly.begin(), poly.begin() + i + 1);
                    upperPoly.append(poly,0,i+1);
                } else {
                    if (i != 0){
                        //lowerPoly.insert(lowerPoly.end(), poly.begin() + i, poly.end());
                        lowerPoly.append(poly,i,poly.vertices.length);
                    }
                    //lowerPoly.insert(lowerPoly.end(), poly.begin(), poly.begin() + upperIndex + 1);
                    lowerPoly.append(poly,0,upperIndex+1);
                    lowerPoly.vertices.push(p);
                    upperPoly.vertices.push(p);
                    //upperPoly.insert(upperPoly.end(), poly.begin() + lowerIndex, poly.begin() + i + 1);
                    upperPoly.append(poly,lowerIndex,i+1);
                }
            } else {
                // connect to the closest point within the triangle
                //console.log("Case 2: Vertex("+i+"), closestIndex("+closestIndex+"), poly.size("+this.vertices.length+")\n");

                if (lowerIndex > upperIndex) {
                    upperIndex += this.vertices.length;
                }
                closestDist = Number.MAX_VALUE;

                if(upperIndex < lowerIndex){
                    return result;
                }

                for (var j = lowerIndex; j <= upperIndex; ++j) {
                    if (Point_1.leftOn(poly.at(i - 1), poly.at(i), poly.at(j))
                            && Point_1.rightOn(poly.at(i + 1), poly.at(i), poly.at(j))) {
                        d = Point_1.sqdist(poly.at(i), poly.at(j));
                        if (d < closestDist) {
                            closestDist = d;
                            closestIndex = j % this.vertices.length;
                        }
                    }
                }

                if (i < closestIndex) {
                    lowerPoly.append(poly,i,closestIndex+1);
                    if (closestIndex != 0){
                        upperPoly.append(poly,closestIndex,v.length);
                    }
                    upperPoly.append(poly,0,i+1);
                } else {
                    if (i != 0){
                        lowerPoly.append(poly,i,v.length);
                    }
                    lowerPoly.append(poly,0,closestIndex+1);
                    upperPoly.append(poly,closestIndex,i+1);
                }
            }

            // solve smallest poly first
            if (lowerPoly.vertices.length < upperPoly.vertices.length) {
                lowerPoly.quickDecomp(result,reflexVertices,steinerPoints,delta,maxlevel,level);
                upperPoly.quickDecomp(result,reflexVertices,steinerPoints,delta,maxlevel,level);
            } else {
                upperPoly.quickDecomp(result,reflexVertices,steinerPoints,delta,maxlevel,level);
                lowerPoly.quickDecomp(result,reflexVertices,steinerPoints,delta,maxlevel,level);
            }

            return result;
        }
    }
    result.push(this);

    return result;
};

/**
 * Remove collinear points in the polygon.
 * @method removeCollinearPoints
 * @param  {Number} [precision] The threshold angle to use when determining whether two edges are collinear. Use zero for finest precision.
 * @return {Number}           The number of points removed
 */
Polygon.prototype.removeCollinearPoints = function(precision){
    var num = 0;
    for(var i=this.vertices.length-1; this.vertices.length>3 && i>=0; --i){
        if(Point_1.collinear(this.at(i-1),this.at(i),this.at(i+1),precision)){
            // Remove the middle point
            this.vertices.splice(i%this.vertices.length,1);
            i--; // Jump one point forward. Otherwise we may get a chain removal
            num++;
        }
    }
    return num;
};

var src = {
    Polygon : Polygon_1,
    Point : Point_1,
};

var Shape_1 = Shape;



/**
 * Base class for shapes.
 * @class Shape
 * @constructor
 * @param {object} [options]
 * @param {array} [options.position]
 * @param {number} [options.angle=0]
 * @param {number} [options.collisionGroup=1]
 * @param {number} [options.collisionMask=1]
 * @param {boolean} [options.sensor=false]
 * @param {boolean} [options.collisionResponse=true]
 * @param {object} [options.type=0]
 */
function Shape(options){
    options = options || {};

    /**
     * The body this shape is attached to. A shape can only be attached to a single body.
     * @property {Body} body
     */
    this.body = null;

    /**
     * Body-local position of the shape.
     * @property {Array} position
     */
    this.position = vec2_1.fromValues(0,0);
    if(options.position){
        vec2_1.copy(this.position, options.position);
    }

    /**
     * Body-local angle of the shape.
     * @property {number} angle
     */
    this.angle = options.angle || 0;

    /**
     * The type of the shape. One of:
     *
     * * {{#crossLink "Shape/CIRCLE:property"}}Shape.CIRCLE{{/crossLink}}
     * * {{#crossLink "Shape/PARTICLE:property"}}Shape.PARTICLE{{/crossLink}}
     * * {{#crossLink "Shape/PLANE:property"}}Shape.PLANE{{/crossLink}}
     * * {{#crossLink "Shape/CONVEX:property"}}Shape.CONVEX{{/crossLink}}
     * * {{#crossLink "Shape/LINE:property"}}Shape.LINE{{/crossLink}}
     * * {{#crossLink "Shape/BOX:property"}}Shape.BOX{{/crossLink}}
     * * {{#crossLink "Shape/CAPSULE:property"}}Shape.CAPSULE{{/crossLink}}
     * * {{#crossLink "Shape/HEIGHTFIELD:property"}}Shape.HEIGHTFIELD{{/crossLink}}
     *
     * @property {number} type
     */
    this.type = options.type || 0;

    /**
     * Shape object identifier.
     * @type {Number}
     * @property id
     */
    this.id = Shape.idCounter++;

    /**
     * Bounding circle radius of this shape
     * @property boundingRadius
     * @type {Number}
     */
    this.boundingRadius = 0;

    /**
     * Collision group that this shape belongs to (bit mask). See <a href="http://www.aurelienribon.com/blog/2011/07/box2d-tutorial-collision-filtering/">this tutorial</a>.
     * @property collisionGroup
     * @type {Number}
     * @example
     *     // Setup bits for each available group
     *     var PLAYER = Math.pow(2,0),
     *         ENEMY =  Math.pow(2,1),
     *         GROUND = Math.pow(2,2)
     *
     *     // Put shapes into their groups
     *     player1Shape.collisionGroup = PLAYER;
     *     player2Shape.collisionGroup = PLAYER;
     *     enemyShape  .collisionGroup = ENEMY;
     *     groundShape .collisionGroup = GROUND;
     *
     *     // Assign groups that each shape collide with.
     *     // Note that the players can collide with ground and enemies, but not with other players.
     *     player1Shape.collisionMask = ENEMY | GROUND;
     *     player2Shape.collisionMask = ENEMY | GROUND;
     *     enemyShape  .collisionMask = PLAYER | GROUND;
     *     groundShape .collisionMask = PLAYER | ENEMY;
     *
     * @example
     *     // How collision check is done
     *     if(shapeA.collisionGroup & shapeB.collisionMask)!=0 && (shapeB.collisionGroup & shapeA.collisionMask)!=0){
     *         // The shapes will collide
     *     }
     */
    this.collisionGroup = options.collisionGroup !== undefined ? options.collisionGroup : 1;

    /**
     * Whether to produce contact forces when in contact with other bodies. Note that contacts will be generated, but they will be disabled. That means that this shape will move through other body shapes, but it will still trigger contact events, etc.
     * @property {Boolean} collisionResponse
     */
    this.collisionResponse = options.collisionResponse !== undefined ? options.collisionResponse : true;

    /**
     * Collision mask of this shape. See .collisionGroup.
     * @property collisionMask
     * @type {Number}
     */
    this.collisionMask = options.collisionMask !== undefined ? options.collisionMask : 1;

    /**
     * Material to use in collisions for this Shape. If this is set to null, the world will use default material properties instead.
     * @property material
     * @type {Material}
     */
    this.material = options.material || null;

    /**
     * Area of this shape.
     * @property area
     * @type {Number}
     */
    this.area = 0;

    /**
     * Set to true if you want this shape to be a sensor. A sensor does not generate contacts, but it still reports contact events. This is good if you want to know if a shape is overlapping another shape, without them generating contacts.
     * @property {Boolean} sensor
     */
    this.sensor = options.sensor !== undefined ? options.sensor : false;

    if(this.type){
        this.updateBoundingRadius();
    }

    this.updateArea();
}

Shape.idCounter = 0;

/**
 * @static
 * @property {Number} CIRCLE
 */
Shape.CIRCLE =      1;

/**
 * @static
 * @property {Number} PARTICLE
 */
Shape.PARTICLE =    2;

/**
 * @static
 * @property {Number} PLANE
 */
Shape.PLANE =       4;

/**
 * @static
 * @property {Number} CONVEX
 */
Shape.CONVEX =      8;

/**
 * @static
 * @property {Number} LINE
 */
Shape.LINE =        16;

/**
 * @static
 * @property {Number} BOX
 */
Shape.BOX =   32;

Object.defineProperty(Shape, 'RECTANGLE', {
    get: function() {
        console.warn('Shape.RECTANGLE is deprecated, use Shape.BOX instead.');
        return Shape.BOX;
    }
});

/**
 * @static
 * @property {Number} CAPSULE
 */
Shape.CAPSULE =     64;

/**
 * @static
 * @property {Number} HEIGHTFIELD
 */
Shape.HEIGHTFIELD = 128;

/**
 * Should return the moment of inertia around the Z axis of the body given the total mass. See <a href="http://en.wikipedia.org/wiki/List_of_moments_of_inertia">Wikipedia's list of moments of inertia</a>.
 * @method computeMomentOfInertia
 * @param  {Number} mass
 * @return {Number} If the inertia is infinity or if the object simply isn't possible to rotate, return 0.
 */
Shape.prototype.computeMomentOfInertia = function(mass){};

/**
 * Returns the bounding circle radius of this shape.
 * @method updateBoundingRadius
 * @return {Number}
 */
Shape.prototype.updateBoundingRadius = function(){};

/**
 * Update the .area property of the shape.
 * @method updateArea
 */
Shape.prototype.updateArea = function(){
    // To be implemented in all subclasses
};

/**
 * Compute the world axis-aligned bounding box (AABB) of this shape.
 * @method computeAABB
 * @param  {AABB} out The resulting AABB.
 * @param  {Array} position World position of the shape.
 * @param  {Number} angle World angle of the shape.
 */
Shape.prototype.computeAABB = function(out, position, angle){
    // To be implemented in each subclass
};

/**
 * Perform raycasting on this shape.
 * @method raycast
 * @param  {RayResult} result Where to store the resulting data.
 * @param  {Ray} ray The Ray that you want to use for raycasting.
 * @param  {array} position World position of the shape (the .position property will be ignored).
 * @param  {number} angle World angle of the shape (the .angle property will be ignored).
 */
Shape.prototype.raycast = function(result, ray, position, angle){
    // To be implemented in each subclass
};

/*
        PolyK library
        url: http://polyk.ivank.net
        Released under MIT licence.

        Copyright (c) 2012 Ivan Kuckir

        Permission is hereby granted, free of charge, to any person
        obtaining a copy of this software and associated documentation
        files (the "Software"), to deal in the Software without
        restriction, including without limitation the rights to use,
        copy, modify, merge, publish, distribute, sublicense, and/or sell
        copies of the Software, and to permit persons to whom the
        Software is furnished to do so, subject to the following
        conditions:

        The above copyright notice and this permission notice shall be
        included in all copies or substantial portions of the Software.

        THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
        EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
        OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
        NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
        HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
        WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
        FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
        OTHER DEALINGS IN THE SOFTWARE.
    */

    var PolyK = {};

    /*
        Is Polygon self-intersecting?

        O(n^2)
    */
    /*
    PolyK.IsSimple = function(p)
    {
        var n = p.length>>1;
        if(n<4) return true;
        var a1 = new PolyK._P(), a2 = new PolyK._P();
        var b1 = new PolyK._P(), b2 = new PolyK._P();
        var c = new PolyK._P();

        for(var i=0; i<n; i++)
        {
            a1.x = p[2*i  ];
            a1.y = p[2*i+1];
            if(i==n-1)  { a2.x = p[0    ];  a2.y = p[1    ]; }
            else        { a2.x = p[2*i+2];  a2.y = p[2*i+3]; }

            for(var j=0; j<n; j++)
            {
                if(Math.abs(i-j) < 2) continue;
                if(j==n-1 && i==0) continue;
                if(i==n-1 && j==0) continue;

                b1.x = p[2*j  ];
                b1.y = p[2*j+1];
                if(j==n-1)  { b2.x = p[0    ];  b2.y = p[1    ]; }
                else        { b2.x = p[2*j+2];  b2.y = p[2*j+3]; }

                if(PolyK._GetLineIntersection(a1,a2,b1,b2,c) != null) return false;
            }
        }
        return true;
    }

    PolyK.IsConvex = function(p)
    {
        if(p.length<6) return true;
        var l = p.length - 4;
        for(var i=0; i<l; i+=2)
            if(!PolyK._convex(p[i], p[i+1], p[i+2], p[i+3], p[i+4], p[i+5])) return false;
        if(!PolyK._convex(p[l  ], p[l+1], p[l+2], p[l+3], p[0], p[1])) return false;
        if(!PolyK._convex(p[l+2], p[l+3], p[0  ], p[1  ], p[2], p[3])) return false;
        return true;
    }
    */
    PolyK.GetArea = function(p)
    {
        if(p.length <6) return 0;
        var l = p.length - 2;
        var sum = 0;
        for(var i=0; i<l; i+=2)
            sum += (p[i+2]-p[i]) * (p[i+1]+p[i+3]);
        sum += (p[0]-p[l]) * (p[l+1]+p[1]);
        return - sum * 0.5;
    };
    /*
    PolyK.GetAABB = function(p)
    {
        var minx = Infinity;
        var miny = Infinity;
        var maxx = -minx;
        var maxy = -miny;
        for(var i=0; i<p.length; i+=2)
        {
            minx = Math.min(minx, p[i  ]);
            maxx = Math.max(maxx, p[i  ]);
            miny = Math.min(miny, p[i+1]);
            maxy = Math.max(maxy, p[i+1]);
        }
        return {x:minx, y:miny, width:maxx-minx, height:maxy-miny};
    }
    */

    PolyK.Triangulate = function(p)
    {
        var n = p.length>>1;
        if(n<3) return [];
        var tgs = [];
        var avl = [];
        for(var i=0; i<n; i++) avl.push(i);

        var i = 0;
        var al = n;
        while(al > 3)
        {
            var i0 = avl[(i+0)%al];
            var i1 = avl[(i+1)%al];
            var i2 = avl[(i+2)%al];

            var ax = p[2*i0],  ay = p[2*i0+1];
            var bx = p[2*i1],  by = p[2*i1+1];
            var cx = p[2*i2],  cy = p[2*i2+1];

            var earFound = false;
            if(PolyK._convex(ax, ay, bx, by, cx, cy))
            {
                earFound = true;
                for(var j=0; j<al; j++)
                {
                    var vi = avl[j];
                    if(vi==i0 || vi==i1 || vi==i2) continue;
                    if(PolyK._PointInTriangle(p[2*vi], p[2*vi+1], ax, ay, bx, by, cx, cy)) {earFound = false; break;}
                }
            }
            if(earFound)
            {
                tgs.push(i0, i1, i2);
                avl.splice((i+1)%al, 1);
                al--;
                i= 0;
            }
            else if(i++ > 3*al) break;      // no convex angles :(
        }
        tgs.push(avl[0], avl[1], avl[2]);
        return tgs;
    };
    /*
    PolyK.ContainsPoint = function(p, px, py)
    {
        var n = p.length>>1;
        var ax, ay, bx = p[2*n-2]-px, by = p[2*n-1]-py;
        var depth = 0;
        for(var i=0; i<n; i++)
        {
            ax = bx;  ay = by;
            bx = p[2*i  ] - px;
            by = p[2*i+1] - py;
            if(ay< 0 && by< 0) continue;    // both "up" or both "donw"
            if(ay>=0 && by>=0) continue;    // both "up" or both "donw"
            if(ax< 0 && bx< 0) continue;

            var lx = ax + (bx-ax)*(-ay)/(by-ay);
            if(lx>0) depth++;
        }
        return (depth & 1) == 1;
    }

    PolyK.Slice = function(p, ax, ay, bx, by)
    {
        if(PolyK.ContainsPoint(p, ax, ay) || PolyK.ContainsPoint(p, bx, by)) return [p.slice(0)];

        var a = new PolyK._P(ax, ay);
        var b = new PolyK._P(bx, by);
        var iscs = [];  // intersections
        var ps = [];    // points
        for(var i=0; i<p.length; i+=2) ps.push(new PolyK._P(p[i], p[i+1]));

        for(var i=0; i<ps.length; i++)
        {
            var isc = new PolyK._P(0,0);
            isc = PolyK._GetLineIntersection(a, b, ps[i], ps[(i+1)%ps.length], isc);

            if(isc)
            {
                isc.flag = true;
                iscs.push(isc);
                ps.splice(i+1,0,isc);
                i++;
            }
        }
        if(iscs.length == 0) return [p.slice(0)];
        var comp = function(u,v) {return PolyK._P.dist(a,u) - PolyK._P.dist(a,v); }
        iscs.sort(comp);

        var pgs = [];
        var dir = 0;
        while(iscs.length > 0)
        {
            var n = ps.length;
            var i0 = iscs[0];
            var i1 = iscs[1];
            var ind0 = ps.indexOf(i0);
            var ind1 = ps.indexOf(i1);
            var solved = false;

            if(PolyK._firstWithFlag(ps, ind0) == ind1) solved = true;
            else
            {
                i0 = iscs[1];
                i1 = iscs[0];
                ind0 = ps.indexOf(i0);
                ind1 = ps.indexOf(i1);
                if(PolyK._firstWithFlag(ps, ind0) == ind1) solved = true;
            }
            if(solved)
            {
                dir--;
                var pgn = PolyK._getPoints(ps, ind0, ind1);
                pgs.push(pgn);
                ps = PolyK._getPoints(ps, ind1, ind0);
                i0.flag = i1.flag = false;
                iscs.splice(0,2);
                if(iscs.length == 0) pgs.push(ps);
            }
            else { dir++; iscs.reverse(); }
            if(dir>1) break;
        }
        var result = [];
        for(var i=0; i<pgs.length; i++)
        {
            var pg = pgs[i];
            var npg = [];
            for(var j=0; j<pg.length; j++) npg.push(pg[j].x, pg[j].y);
            result.push(npg);
        }
        return result;
    }

    PolyK.Raycast = function(p, x, y, dx, dy, isc)
    {
        var l = p.length - 2;
        var tp = PolyK._tp;
        var a1 = tp[0], a2 = tp[1],
        b1 = tp[2], b2 = tp[3], c = tp[4];
        a1.x = x; a1.y = y;
        a2.x = x+dx; a2.y = y+dy;

        if(isc==null) isc = {dist:0, edge:0, norm:{x:0, y:0}, refl:{x:0, y:0}};
        isc.dist = Infinity;

        for(var i=0; i<l; i+=2)
        {
            b1.x = p[i  ];  b1.y = p[i+1];
            b2.x = p[i+2];  b2.y = p[i+3];
            var nisc = PolyK._RayLineIntersection(a1, a2, b1, b2, c);
            if(nisc) PolyK._updateISC(dx, dy, a1, b1, b2, c, i/2, isc);
        }
        b1.x = b2.x;  b1.y = b2.y;
        b2.x = p[0];  b2.y = p[1];
        var nisc = PolyK._RayLineIntersection(a1, a2, b1, b2, c);
        if(nisc) PolyK._updateISC(dx, dy, a1, b1, b2, c, p.length/2, isc);

        return (isc.dist != Infinity) ? isc : null;
    }

    PolyK.ClosestEdge = function(p, x, y, isc)
    {
        var l = p.length - 2;
        var tp = PolyK._tp;
        var a1 = tp[0],
        b1 = tp[2], b2 = tp[3], c = tp[4];
        a1.x = x; a1.y = y;

        if(isc==null) isc = {dist:0, edge:0, point:{x:0, y:0}, norm:{x:0, y:0}};
        isc.dist = Infinity;

        for(var i=0; i<l; i+=2)
        {
            b1.x = p[i  ];  b1.y = p[i+1];
            b2.x = p[i+2];  b2.y = p[i+3];
            PolyK._pointLineDist(a1, b1, b2, i>>1, isc);
        }
        b1.x = b2.x;  b1.y = b2.y;
        b2.x = p[0];  b2.y = p[1];
        PolyK._pointLineDist(a1, b1, b2, l>>1, isc);

        var idst = 1/isc.dist;
        isc.norm.x = (x-isc.point.x)*idst;
        isc.norm.y = (y-isc.point.y)*idst;
        return isc;
    }

    PolyK._pointLineDist = function(p, a, b, edge, isc)
    {
        var x = p.x, y = p.y, x1 = a.x, y1 = a.y, x2 = b.x, y2 = b.y;

        var A = x - x1;
        var B = y - y1;
        var C = x2 - x1;
        var D = y2 - y1;

        var dot = A * C + B * D;
        var len_sq = C * C + D * D;
        var param = dot / len_sq;

        var xx, yy;

        if (param < 0 || (x1 == x2 && y1 == y2)) {
            xx = x1;
            yy = y1;
        }
        else if (param > 1) {
            xx = x2;
            yy = y2;
        }
        else {
            xx = x1 + param * C;
            yy = y1 + param * D;
        }

        var dx = x - xx;
        var dy = y - yy;
        var dst = Math.sqrt(dx * dx + dy * dy);
        if(dst<isc.dist)
        {
            isc.dist = dst;
            isc.edge = edge;
            isc.point.x = xx;
            isc.point.y = yy;
        }
    }

    PolyK._updateISC = function(dx, dy, a1, b1, b2, c, edge, isc)
    {
        var nrl = PolyK._P.dist(a1, c);
        if(nrl<isc.dist)
        {
            var ibl = 1/PolyK._P.dist(b1, b2);
            var nx = -(b2.y-b1.y)*ibl;
            var ny =  (b2.x-b1.x)*ibl;
            var ddot = 2*(dx*nx+dy*ny);
            isc.dist = nrl;
            isc.norm.x = nx;
            isc.norm.y = ny;
            isc.refl.x = -ddot*nx+dx;
            isc.refl.y = -ddot*ny+dy;
            isc.edge = edge;
        }
    }

    PolyK._getPoints = function(ps, ind0, ind1)
    {
        var n = ps.length;
        var nps = [];
        if(ind1<ind0) ind1 += n;
        for(var i=ind0; i<= ind1; i++) nps.push(ps[i%n]);
        return nps;
    }

    PolyK._firstWithFlag = function(ps, ind)
    {
        var n = ps.length;
        while(true)
        {
            ind = (ind+1)%n;
            if(ps[ind].flag) return ind;
        }
    }
    */
    PolyK._PointInTriangle = function(px, py, ax, ay, bx, by, cx, cy)
    {
        var v0x = cx-ax;
        var v0y = cy-ay;
        var v1x = bx-ax;
        var v1y = by-ay;
        var v2x = px-ax;
        var v2y = py-ay;

        var dot00 = v0x*v0x+v0y*v0y;
        var dot01 = v0x*v1x+v0y*v1y;
        var dot02 = v0x*v2x+v0y*v2y;
        var dot11 = v1x*v1x+v1y*v1y;
        var dot12 = v1x*v2x+v1y*v2y;

        var invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
        var u = (dot11 * dot02 - dot01 * dot12) * invDenom;
        var v = (dot00 * dot12 - dot01 * dot02) * invDenom;

        // Check if point is in triangle
        return (u >= 0) && (v >= 0) && (u + v < 1);
    };
    /*
    PolyK._RayLineIntersection = function(a1, a2, b1, b2, c)
    {
        var dax = (a1.x-a2.x), dbx = (b1.x-b2.x);
        var day = (a1.y-a2.y), dby = (b1.y-b2.y);

        var Den = dax*dby - day*dbx;
        if (Den == 0) return null;  // parallel

        var A = (a1.x * a2.y - a1.y * a2.x);
        var B = (b1.x * b2.y - b1.y * b2.x);

        var I = c;
        var iDen = 1/Den;
        I.x = ( A*dbx - dax*B ) * iDen;
        I.y = ( A*dby - day*B ) * iDen;

        if(!PolyK._InRect(I, b1, b2)) return null;
        if((day>0 && I.y>a1.y) || (day<0 && I.y<a1.y)) return null;
        if((dax>0 && I.x>a1.x) || (dax<0 && I.x<a1.x)) return null;
        return I;
    }

    PolyK._GetLineIntersection = function(a1, a2, b1, b2, c)
    {
        var dax = (a1.x-a2.x), dbx = (b1.x-b2.x);
        var day = (a1.y-a2.y), dby = (b1.y-b2.y);

        var Den = dax*dby - day*dbx;
        if (Den == 0) return null;  // parallel

        var A = (a1.x * a2.y - a1.y * a2.x);
        var B = (b1.x * b2.y - b1.y * b2.x);

        var I = c;
        I.x = ( A*dbx - dax*B ) / Den;
        I.y = ( A*dby - day*B ) / Den;

        if(PolyK._InRect(I, a1, a2) && PolyK._InRect(I, b1, b2)) return I;
        return null;
    }

    PolyK._InRect = function(a, b, c)
    {
        if  (b.x == c.x) return (a.y>=Math.min(b.y, c.y) && a.y<=Math.max(b.y, c.y));
        if  (b.y == c.y) return (a.x>=Math.min(b.x, c.x) && a.x<=Math.max(b.x, c.x));

        if(a.x >= Math.min(b.x, c.x) && a.x <= Math.max(b.x, c.x)
        && a.y >= Math.min(b.y, c.y) && a.y <= Math.max(b.y, c.y))
        return true;
        return false;
    }
    */
    PolyK._convex = function(ax, ay, bx, by, cx, cy)
    {
        return (ay-by)*(cx-bx) + (bx-ax)*(cy-by) >= 0;
    };
    /*
    PolyK._P = function(x,y)
    {
        this.x = x;
        this.y = y;
        this.flag = false;
    }
    PolyK._P.prototype.toString = function()
    {
        return "Point ["+this.x+", "+this.y+"]";
    }
    PolyK._P.dist = function(a,b)
    {
        var dx = b.x-a.x;
        var dy = b.y-a.y;
        return Math.sqrt(dx*dx + dy*dy);
    }

    PolyK._tp = [];
    for(var i=0; i<10; i++) PolyK._tp.push(new PolyK._P(0,0));
        */

var polyk = PolyK;

var Convex_1 = Convex;

/**
 * Convex shape class.
 * @class Convex
 * @constructor
 * @extends Shape
 * @param {object} [options] (Note that this options object will be passed on to the {{#crossLink "Shape"}}{{/crossLink}} constructor.)
 * @param {Array} [options.vertices] An array of vertices that span this shape. Vertices are given in counter-clockwise (CCW) direction.
 * @param {Array} [options.axes] An array of unit length vectors, representing the symmetry axes in the convex.
 * @example
 *     // Create a box
 *     var vertices = [[-1,-1], [1,-1], [1,1], [-1,1]];
 *     var convexShape = new Convex({ vertices: vertices });
 *     body.addShape(convexShape);
 */
function Convex(options){
    if(Array.isArray(arguments[0])){
        options = {
            vertices: arguments[0],
            axes: arguments[1]
        };
        console.warn('The Convex constructor signature has changed. Please use the following format: new Convex({ vertices: [...], ... })');
    }
    options = options || {};

    /**
     * Vertices defined in the local frame.
     * @property vertices
     * @type {Array}
     */
    this.vertices = [];

    // Copy the verts
    var vertices = options.vertices !== undefined ? options.vertices : [];
    for(var i=0; i < vertices.length; i++){
        var v = vec2_1.create();
        vec2_1.copy(v, vertices[i]);
        this.vertices.push(v);
    }

    /**
     * Axes defined in the local frame.
     * @property axes
     * @type {Array}
     */
    this.axes = [];

    if(options.axes){

        // Copy the axes
        for(var i=0; i < options.axes.length; i++){
            var axis = vec2_1.create();
            vec2_1.copy(axis, options.axes[i]);
            this.axes.push(axis);
        }

    } else {

        // Construct axes from the vertex data
        for(var i = 0; i < this.vertices.length; i++){
            // Get the world edge
            var worldPoint0 = this.vertices[i];
            var worldPoint1 = this.vertices[(i+1) % this.vertices.length];

            var normal = vec2_1.create();
            vec2_1.sub(normal, worldPoint1, worldPoint0);

            // Get normal - just rotate 90 degrees since vertices are given in CCW
            vec2_1.rotate90cw(normal, normal);
            vec2_1.normalize(normal, normal);

            this.axes.push(normal);
        }

    }

    /**
     * The center of mass of the Convex
     * @property centerOfMass
     * @type {Array}
     */
    this.centerOfMass = vec2_1.fromValues(0,0);

    /**
     * Triangulated version of this convex. The structure is Array of 3-Arrays, and each subarray contains 3 integers, referencing the vertices.
     * @property triangles
     * @type {Array}
     */
    this.triangles = [];

    if(this.vertices.length){
        this.updateTriangles();
        this.updateCenterOfMass();
    }

    /**
     * The bounding radius of the convex
     * @property boundingRadius
     * @type {Number}
     */
    this.boundingRadius = 0;

    options.type = Shape_1.CONVEX;
    Shape_1.call(this, options);

    this.updateBoundingRadius();
    this.updateArea();
    if(this.area < 0){
        throw new Error("Convex vertices must be given in conter-clockwise winding.");
    }
}
Convex.prototype = new Shape_1();
Convex.prototype.constructor = Convex;

var tmpVec1 = vec2_1.create();
var tmpVec2 = vec2_1.create();

/**
 * Project a Convex onto a world-oriented axis
 * @method projectOntoAxis
 * @static
 * @param  {Array} offset
 * @param  {Array} localAxis
 * @param  {Array} result
 */
Convex.prototype.projectOntoLocalAxis = function(localAxis, result){
    var max=null,
        min=null,
        v,
        value,
        localAxis = tmpVec1;

    // Get projected position of all vertices
    for(var i=0; i<this.vertices.length; i++){
        v = this.vertices[i];
        value = vec2_1.dot(v, localAxis);
        if(max === null || value > max){
            max = value;
        }
        if(min === null || value < min){
            min = value;
        }
    }

    if(min > max){
        var t = min;
        min = max;
        max = t;
    }

    vec2_1.set(result, min, max);
};

Convex.prototype.projectOntoWorldAxis = function(localAxis, shapeOffset, shapeAngle, result){
    var worldAxis = tmpVec2;

    this.projectOntoLocalAxis(localAxis, result);

    // Project the position of the body onto the axis - need to add this to the result
    if(shapeAngle !== 0){
        vec2_1.rotate(worldAxis, localAxis, shapeAngle);
    } else {
        worldAxis = localAxis;
    }
    var offset = vec2_1.dot(shapeOffset, worldAxis);

    vec2_1.set(result, result[0] + offset, result[1] + offset);
};


/**
 * Update the .triangles property
 * @method updateTriangles
 */
Convex.prototype.updateTriangles = function(){

    this.triangles.length = 0;

    // Rewrite on polyk notation, array of numbers
    var polykVerts = [];
    for(var i=0; i<this.vertices.length; i++){
        var v = this.vertices[i];
        polykVerts.push(v[0],v[1]);
    }

    // Triangulate
    var triangles = polyk.Triangulate(polykVerts);

    // Loop over all triangles, add their inertia contributions to I
    for(var i=0; i<triangles.length; i+=3){
        var id1 = triangles[i],
            id2 = triangles[i+1],
            id3 = triangles[i+2];

        // Add to triangles
        this.triangles.push([id1,id2,id3]);
    }
};

var updateCenterOfMass_centroid = vec2_1.create(),
    updateCenterOfMass_centroid_times_mass = vec2_1.create(),
    updateCenterOfMass_a = vec2_1.create(),
    updateCenterOfMass_b = vec2_1.create(),
    updateCenterOfMass_c = vec2_1.create(),
    updateCenterOfMass_ac = vec2_1.create(),
    updateCenterOfMass_ca = vec2_1.create(),
    updateCenterOfMass_cb = vec2_1.create(),
    updateCenterOfMass_n = vec2_1.create();

/**
 * Update the .centerOfMass property.
 * @method updateCenterOfMass
 */
Convex.prototype.updateCenterOfMass = function(){
    var triangles = this.triangles,
        verts = this.vertices,
        cm = this.centerOfMass,
        centroid = updateCenterOfMass_centroid,
        a = updateCenterOfMass_a,
        b = updateCenterOfMass_b,
        c = updateCenterOfMass_c,
        centroid_times_mass = updateCenterOfMass_centroid_times_mass;

    vec2_1.set(cm,0,0);
    var totalArea = 0;

    for(var i=0; i!==triangles.length; i++){
        var t = triangles[i],
            a = verts[t[0]],
            b = verts[t[1]],
            c = verts[t[2]];

        vec2_1.centroid(centroid,a,b,c);

        // Get mass for the triangle (density=1 in this case)
        // http://math.stackexchange.com/questions/80198/area-of-triangle-via-vectors
        var m = Convex.triangleArea(a,b,c);
        totalArea += m;

        // Add to center of mass
        vec2_1.scale(centroid_times_mass, centroid, m);
        vec2_1.add(cm, cm, centroid_times_mass);
    }

    vec2_1.scale(cm,cm,1/totalArea);
};

/**
 * Compute the mass moment of inertia of the Convex.
 * @method computeMomentOfInertia
 * @param  {Number} mass
 * @return {Number}
 * @see http://www.gamedev.net/topic/342822-moment-of-inertia-of-a-polygon-2d/
 */
Convex.prototype.computeMomentOfInertia = function(mass){
    var denom = 0.0,
        numer = 0.0,
        N = this.vertices.length;
    for(var j = N-1, i = 0; i < N; j = i, i ++){
        var p0 = this.vertices[j];
        var p1 = this.vertices[i];
        var a = Math.abs(vec2_1.crossLength(p0,p1));
        var b = vec2_1.dot(p1,p1) + vec2_1.dot(p1,p0) + vec2_1.dot(p0,p0);
        denom += a * b;
        numer += a;
    }
    return (mass / 6.0) * (denom / numer);
};

/**
 * Updates the .boundingRadius property
 * @method updateBoundingRadius
 */
Convex.prototype.updateBoundingRadius = function(){
    var verts = this.vertices,
        r2 = 0;

    for(var i=0; i!==verts.length; i++){
        var l2 = vec2_1.squaredLength(verts[i]);
        if(l2 > r2){
            r2 = l2;
        }
    }

    this.boundingRadius = Math.sqrt(r2);
};

/**
 * Get the area of the triangle spanned by the three points a, b, c. The area is positive if the points are given in counter-clockwise order, otherwise negative.
 * @static
 * @method triangleArea
 * @param {Array} a
 * @param {Array} b
 * @param {Array} c
 * @return {Number}
 */
Convex.triangleArea = function(a,b,c){
    return (((b[0] - a[0])*(c[1] - a[1]))-((c[0] - a[0])*(b[1] - a[1]))) * 0.5;
};

/**
 * Update the .area
 * @method updateArea
 */
Convex.prototype.updateArea = function(){
    this.updateTriangles();
    this.area = 0;

    var triangles = this.triangles,
        verts = this.vertices;
    for(var i=0; i!==triangles.length; i++){
        var t = triangles[i],
            a = verts[t[0]],
            b = verts[t[1]],
            c = verts[t[2]];

        // Get mass for the triangle (density=1 in this case)
        var m = Convex.triangleArea(a,b,c);
        this.area += m;
    }
};

/**
 * @method computeAABB
 * @param  {AABB}   out
 * @param  {Array}  position
 * @param  {Number} angle
 */
Convex.prototype.computeAABB = function(out, position, angle){
    out.setFromPoints(this.vertices, position, angle, 0);
};

var intersectConvex_rayStart = vec2_1.create();
var intersectConvex_rayEnd = vec2_1.create();
var intersectConvex_normal = vec2_1.create();

/**
 * @method raycast
 * @param  {RaycastResult} result
 * @param  {Ray} ray
 * @param  {array} position
 * @param  {number} angle
 */
Convex.prototype.raycast = function(result, ray, position, angle){
    var rayStart = intersectConvex_rayStart;
    var rayEnd = intersectConvex_rayEnd;
    var normal = intersectConvex_normal;
    var vertices = this.vertices;

    // Transform to local shape space
    vec2_1.toLocalFrame(rayStart, ray.from, position, angle);
    vec2_1.toLocalFrame(rayEnd, ray.to, position, angle);

    var n = vertices.length;

    for (var i = 0; i < n && !result.shouldStop(ray); i++) {
        var q1 = vertices[i];
        var q2 = vertices[(i+1) % n];
        var delta = vec2_1.getLineSegmentsIntersectionFraction(rayStart, rayEnd, q1, q2);

        if(delta >= 0){
            vec2_1.sub(normal, q2, q1);
            vec2_1.rotate(normal, normal, -Math.PI / 2 + angle);
            vec2_1.normalize(normal, normal);
            ray.reportIntersection(result, delta, normal, i);
        }
    }
};

var Ray_1 = Ray;






/**
 * A line with a start and end point that is used to intersect shapes. For an example, see {{#crossLink "World/raycast:method"}}World.raycast{{/crossLink}}
 * @class Ray
 * @constructor
 * @param {object} [options]
 * @param {array} [options.from]
 * @param {array} [options.to]
 * @param {boolean} [options.checkCollisionResponse=true]
 * @param {boolean} [options.skipBackfaces=false]
 * @param {number} [options.collisionMask=-1]
 * @param {number} [options.collisionGroup=-1]
 * @param {number} [options.mode=Ray.ANY]
 * @param {number} [options.callback]
 */
function Ray(options){
    options = options || {};

    /**
     * Ray start point.
     * @property {array} from
     */
    this.from = options.from ? vec2_1.fromValues(options.from[0], options.from[1]) : vec2_1.create();

    /**
     * Ray end point
     * @property {array} to
     */
    this.to = options.to ? vec2_1.fromValues(options.to[0], options.to[1]) : vec2_1.create();

    /**
     * Set to true if you want the Ray to take .collisionResponse flags into account on bodies and shapes.
     * @property {Boolean} checkCollisionResponse
     */
    this.checkCollisionResponse = options.checkCollisionResponse !== undefined ? options.checkCollisionResponse : true;

    /**
     * If set to true, the ray skips any hits with normal.dot(rayDirection) < 0.
     * @property {Boolean} skipBackfaces
     */
    this.skipBackfaces = !!options.skipBackfaces;

    /**
     * @property {number} collisionMask
     * @default -1
     */
    this.collisionMask = options.collisionMask !== undefined ? options.collisionMask : -1;

    /**
     * @property {number} collisionGroup
     * @default -1
     */
    this.collisionGroup = options.collisionGroup !== undefined ? options.collisionGroup : -1;

    /**
     * The intersection mode. Should be {{#crossLink "Ray/ANY:property"}}Ray.ANY{{/crossLink}}, {{#crossLink "Ray/ALL:property"}}Ray.ALL{{/crossLink}} or {{#crossLink "Ray/CLOSEST:property"}}Ray.CLOSEST{{/crossLink}}.
     * @property {number} mode
     */
    this.mode = options.mode !== undefined ? options.mode : Ray.ANY;

    /**
     * Current, user-provided result callback. Will be used if mode is Ray.ALL.
     * @property {Function} callback
     */
    this.callback = options.callback || function(result){};

    /**
     * @readOnly
     * @property {array} direction
     */
    this.direction = vec2_1.create();

    /**
     * Length of the ray
     * @readOnly
     * @property {number} length
     */
    this.length = 1;

    this.update();
}
Ray.prototype.constructor = Ray;

/**
 * This raycasting mode will make the Ray traverse through all intersection points and only return the closest one.
 * @static
 * @property {Number} CLOSEST
 */
Ray.CLOSEST = 1;

/**
 * This raycasting mode will make the Ray stop when it finds the first intersection point.
 * @static
 * @property {Number} ANY
 */
Ray.ANY = 2;

/**
 * This raycasting mode will traverse all intersection points and executes a callback for each one.
 * @static
 * @property {Number} ALL
 */
Ray.ALL = 4;

/**
 * Should be called if you change the from or to point.
 * @method update
 */
Ray.prototype.update = function(){

    // Update .direction and .length
    var d = this.direction;
    vec2_1.sub(d, this.to, this.from);
    this.length = vec2_1.length(d);
    vec2_1.normalize(d, d);

};

/**
 * @method intersectBodies
 * @param {Array} bodies An array of Body objects.
 */
Ray.prototype.intersectBodies = function (result, bodies) {
    for (var i = 0, l = bodies.length; !result.shouldStop(this) && i < l; i++) {
        var body = bodies[i];
        var aabb = body.getAABB();
        if(aabb.overlapsRay(this) >= 0 || aabb.containsPoint(this.from)){
            this.intersectBody(result, body);
        }
    }
};

var intersectBody_worldPosition = vec2_1.create();

/**
 * Shoot a ray at a body, get back information about the hit.
 * @method intersectBody
 * @private
 * @param {Body} body
 */
Ray.prototype.intersectBody = function (result, body) {
    var checkCollisionResponse = this.checkCollisionResponse;

    if(checkCollisionResponse && !body.collisionResponse){
        return;
    }

    var worldPosition = intersectBody_worldPosition;

    for (var i = 0, N = body.shapes.length; i < N; i++) {
        var shape = body.shapes[i];

        if(checkCollisionResponse && !shape.collisionResponse){
            continue; // Skip
        }

        if((this.collisionGroup & shape.collisionMask) === 0 || (shape.collisionGroup & this.collisionMask) === 0){
            continue;
        }

        // Get world angle and position of the shape
        vec2_1.rotate(worldPosition, shape.position, body.angle);
        vec2_1.add(worldPosition, worldPosition, body.position);
        var worldAngle = shape.angle + body.angle;

        this.intersectShape(
            result,
            shape,
            worldAngle,
            worldPosition,
            body
        );

        if(result.shouldStop(this)){
            break;
        }
    }
};

/**
 * @method intersectShape
 * @private
 * @param {Shape} shape
 * @param {number} angle
 * @param {array} position
 * @param {Body} body
 */
Ray.prototype.intersectShape = function(result, shape, angle, position, body){
    var from = this.from;

    // Checking radius
    var distance = distanceFromIntersectionSquared(from, this.direction, position);
    if (distance > shape.boundingRadius * shape.boundingRadius) {
        return;
    }

    this._currentBody = body;
    this._currentShape = shape;

    shape.raycast(result, this, position, angle);

    this._currentBody = this._currentShape = null;
};

/**
 * Get the AABB of the ray.
 * @method getAABB
 * @param  {AABB} aabb
 */
Ray.prototype.getAABB = function(result){
    var to = this.to;
    var from = this.from;
    vec2_1.set(
        result.lowerBound,
        Math.min(to[0], from[0]),
        Math.min(to[1], from[1])
    );
    vec2_1.set(
        result.upperBound,
        Math.max(to[0], from[0]),
        Math.max(to[1], from[1])
    );
};

var hitPointWorld = vec2_1.create();

/**
 * @method reportIntersection
 * @private
 * @param  {number} fraction
 * @param  {array} normal
 * @param  {number} [faceIndex=-1]
 * @return {boolean} True if the intersections should continue
 */
Ray.prototype.reportIntersection = function(result, fraction, normal, faceIndex){
    var from = this.from;
    var to = this.to;
    var shape = this._currentShape;
    var body = this._currentBody;

    // Skip back faces?
    if(this.skipBackfaces && vec2_1.dot(normal, this.direction) > 0){
        return;
    }

    switch(this.mode){

    case Ray.ALL:
        result.set(
            normal,
            shape,
            body,
            fraction,
            faceIndex
        );
        this.callback(result);
        break;

    case Ray.CLOSEST:

        // Store if closer than current closest
        if(fraction < result.fraction || !result.hasHit()){
            result.set(
                normal,
                shape,
                body,
                fraction,
                faceIndex
            );
        }
        break;

    case Ray.ANY:

        // Report and stop.
        result.set(
            normal,
            shape,
            body,
            fraction,
            faceIndex
        );
        break;
    }
};

var v0 = vec2_1.create(),
    intersect = vec2_1.create();
function distanceFromIntersectionSquared(from, direction, position) {

    // v0 is vector from from to position
    vec2_1.sub(v0, position, from);
    var dot = vec2_1.dot(v0, direction);

    // intersect = direction * dot + from
    vec2_1.scale(intersect, direction, dot);
    vec2_1.add(intersect, intersect, from);

    return vec2_1.squaredDistance(position, intersect);
}

var RaycastResult_1 = RaycastResult;

/**
 * Storage for Ray casting hit data.
 * @class RaycastResult
 * @constructor
 */
function RaycastResult(){

	/**
	 * The normal of the hit, oriented in world space.
	 * @property {array} normal
	 */
	this.normal = vec2_1.create();

	/**
	 * The hit shape, or null.
	 * @property {Shape} shape
	 */
	this.shape = null;

	/**
	 * The hit body, or null.
	 * @property {Body} body
	 */
	this.body = null;

	/**
	 * The index of the hit triangle, if the hit shape was indexable.
	 * @property {number} faceIndex
	 * @default -1
	 */
	this.faceIndex = -1;

	/**
	 * Distance to the hit, as a fraction. 0 is at the "from" point, 1 is at the "to" point. Will be set to -1 if there was no hit yet.
	 * @property {number} fraction
	 * @default -1
	 */
	this.fraction = -1;

	/**
	 * If the ray should stop traversing.
	 * @readonly
	 * @property {Boolean} isStopped
	 */
	this.isStopped = false;
}

/**
 * Reset all result data. Must be done before re-using the result object.
 * @method reset
 */
RaycastResult.prototype.reset = function () {
	vec2_1.set(this.normal, 0, 0);
	this.shape = null;
	this.body = null;
	this.faceIndex = -1;
	this.fraction = -1;
	this.isStopped = false;
};

/**
 * Get the distance to the hit point.
 * @method getHitDistance
 * @param {Ray} ray
 */
RaycastResult.prototype.getHitDistance = function (ray) {
	return vec2_1.distance(ray.from, ray.to) * this.fraction;
};

/**
 * Returns true if the ray hit something since the last reset().
 * @method hasHit
 */
RaycastResult.prototype.hasHit = function () {
	return this.fraction !== -1;
};

/**
 * Get world hit point.
 * @method getHitPoint
 * @param {array} out
 * @param {Ray} ray
 */
RaycastResult.prototype.getHitPoint = function (out, ray) {
	vec2_1.lerp(out, ray.from, ray.to, this.fraction);
};

/**
 * Can be called while iterating over hits to stop searching for hit points.
 * @method stop
 */
RaycastResult.prototype.stop = function(){
	this.isStopped = true;
};

/**
 * @method shouldStop
 * @private
 * @param {Ray} ray
 * @return {boolean}
 */
RaycastResult.prototype.shouldStop = function(ray){
	return this.isStopped || (this.fraction !== -1 && ray.mode === Ray_1.ANY);
};

/**
 * @method set
 * @private
 * @param {array} normal
 * @param {Shape} shape
 * @param {Body} body
 * @param {number} fraction
 */
RaycastResult.prototype.set = function(
	normal,
	shape,
	body,
	fraction,
	faceIndex
){
	vec2_1.copy(this.normal, normal);
	this.shape = shape;
	this.body = body;
	this.fraction = fraction;
	this.faceIndex = faceIndex;
};

/**
 * Base class for objects that dispatches events.
 * @class EventEmitter
 * @constructor
 */
var EventEmitter = function () {};

var EventEmitter_1 = EventEmitter;

EventEmitter.prototype = {
    constructor: EventEmitter,

    /**
     * Add an event listener
     * @method on
     * @param  {String} type
     * @param  {Function} listener
     * @return {EventEmitter} The self object, for chainability.
     */
    on: function ( type, listener, context ) {
        listener.context = context || this;
        if ( this._listeners === undefined ){
            this._listeners = {};
        }
        var listeners = this._listeners;
        if ( listeners[ type ] === undefined ) {
            listeners[ type ] = [];
        }
        if ( listeners[ type ].indexOf( listener ) === - 1 ) {
            listeners[ type ].push( listener );
        }
        return this;
    },

    /**
     * Check if an event listener is added
     * @method has
     * @param  {String} type
     * @param  {Function} listener
     * @return {Boolean}
     */
    has: function ( type, listener ) {
        if ( this._listeners === undefined ){
            return false;
        }
        var listeners = this._listeners;
        if(listener){
            if ( listeners[ type ] !== undefined && listeners[ type ].indexOf( listener ) !== - 1 ) {
                return true;
            }
        } else {
            if ( listeners[ type ] !== undefined ) {
                return true;
            }
        }

        return false;
    },

    /**
     * Remove an event listener
     * @method off
     * @param  {String} type
     * @param  {Function} listener
     * @return {EventEmitter} The self object, for chainability.
     */
    off: function ( type, listener ) {
        if ( this._listeners === undefined ){
            return this;
        }
        var listeners = this._listeners;
        var index = listeners[ type ].indexOf( listener );
        if ( index !== - 1 ) {
            listeners[ type ].splice( index, 1 );
        }
        return this;
    },

    /**
     * Emit an event.
     * @method emit
     * @param  {Object} event
     * @param  {String} event.type
     * @return {EventEmitter} The self object, for chainability.
     */
    emit: function ( event ) {
        if ( this._listeners === undefined ){
            return this;
        }
        var listeners = this._listeners;
        var listenerArray = listeners[ event.type ];
        if ( listenerArray !== undefined ) {
            event.target = this;
            for ( var i = 0, l = listenerArray.length; i < l; i ++ ) {
                var listener = listenerArray[ i ];
                listener.call( listener.context, event );
            }
        }
        return this;
    }
};

var Body_1 = Body;

/**
 * A rigid body. Has got a center of mass, position, velocity and a number of
 * shapes that are used for collisions.
 *
 * @class Body
 * @constructor
 * @extends EventEmitter
 * @param {Object} [options]
 * @param {Array} [options.force]
 * @param {Array} [options.position]
 * @param {Array} [options.velocity]
 * @param {Boolean} [options.allowSleep]
 * @param {Boolean} [options.collisionResponse]
 * @param {Number} [options.angle=0]
 * @param {Number} [options.angularForce=0]
 * @param {Number} [options.angularVelocity=0]
 * @param {Number} [options.ccdIterations=10]
 * @param {Number} [options.ccdSpeedThreshold=-1]
 * @param {Number} [options.fixedRotation=false]
 * @param {Number} [options.gravityScale]
 * @param {Number} [options.id]
 * @param {Number} [options.mass=0] A number >= 0. If zero, the .type will be set to Body.STATIC.
 * @param {Number} [options.sleepSpeedLimit]
 * @param {Number} [options.sleepTimeLimit]
 *
 * @example
 *
 *     // Create a typical dynamic body
 *     var body = new Body({
 *         mass: 1,
 *         position: [0, 0],
 *         angle: 0,
 *         velocity: [0, 0],
 *         angularVelocity: 0
 *     });
 *
 *     // Add a circular shape to the body
 *     body.addShape(new Circle({ radius: 1 }));
 *
 *     // Add the body to the world
 *     world.addBody(body);
 */
function Body(options){
    options = options || {};

    EventEmitter_1.call(this);

    /**
     * The body identifyer
     * @property id
     * @type {Number}
     */
    this.id = options.id || ++Body._idCounter;

    /**
     * The world that this body is added to. This property is set to NULL if the body is not added to any world.
     * @property world
     * @type {World}
     */
    this.world = null;

    /**
     * The shapes of the body.
     *
     * @property shapes
     * @type {Array}
     */
    this.shapes = [];

    /**
     * The mass of the body.
     * @property mass
     * @type {number}
     */
    this.mass = options.mass || 0;

    /**
     * The inverse mass of the body.
     * @property invMass
     * @type {number}
     */
    this.invMass = 0;

    /**
     * The inertia of the body around the Z axis.
     * @property inertia
     * @type {number}
     */
    this.inertia = 0;

    /**
     * The inverse inertia of the body.
     * @property invInertia
     * @type {number}
     */
    this.invInertia = 0;

    this.invMassSolve = 0;
    this.invInertiaSolve = 0;

    /**
     * Set to true if you want to fix the rotation of the body.
     * @property fixedRotation
     * @type {Boolean}
     */
    this.fixedRotation = !!options.fixedRotation;

    /**
     * Set to true if you want to fix the body movement along the X axis. The body will still be able to move along Y.
     * @property {Boolean} fixedX
     */
    this.fixedX = !!options.fixedX;

    /**
     * Set to true if you want to fix the body movement along the Y axis. The body will still be able to move along X.
     * @property {Boolean} fixedY
     */
    this.fixedY = !!options.fixedY;

    /**
     * @private
     * @property {array} massMultiplier
     */
    this.massMultiplier = vec2_1.create();

    /**
     * The position of the body
     * @property position
     * @type {Array}
     */
    this.position = vec2_1.fromValues(0,0);
    if(options.position){
        vec2_1.copy(this.position, options.position);
    }

    /**
     * The interpolated position of the body. Use this for rendering.
     * @property interpolatedPosition
     * @type {Array}
     */
    this.interpolatedPosition = vec2_1.fromValues(0,0);

    /**
     * The interpolated angle of the body. Use this for rendering.
     * @property interpolatedAngle
     * @type {Number}
     */
    this.interpolatedAngle = 0;

    /**
     * The previous position of the body.
     * @property previousPosition
     * @type {Array}
     */
    this.previousPosition = vec2_1.fromValues(0,0);

    /**
     * The previous angle of the body.
     * @property previousAngle
     * @type {Number}
     */
    this.previousAngle = 0;

    /**
     * The current velocity of the body.
     * @property velocity
     * @type {Array}
     */
    this.velocity = vec2_1.fromValues(0,0);
    if(options.velocity){
        vec2_1.copy(this.velocity, options.velocity);
    }

    /**
     * Constraint velocity that was added to the body during the last step.
     * @property vlambda
     * @type {Array}
     */
    this.vlambda = vec2_1.fromValues(0,0);

    /**
     * Angular constraint velocity that was added to the body during last step.
     * @property wlambda
     * @type {Array}
     */
    this.wlambda = 0;

    /**
     * The angle of the body, in radians.
     * @property angle
     * @type {number}
     * @example
     *     // The angle property is not normalized to the interval 0 to 2*pi, it can be any value.
     *     // If you need a value between 0 and 2*pi, use the following function to normalize it.
     *     function normalizeAngle(angle){
     *         angle = angle % (2*Math.PI);
     *         if(angle < 0){
     *             angle += (2*Math.PI);
     *         }
     *         return angle;
     *     }
     */
    this.angle = options.angle || 0;

    /**
     * The angular velocity of the body, in radians per second.
     * @property angularVelocity
     * @type {number}
     */
    this.angularVelocity = options.angularVelocity || 0;

    /**
     * The force acting on the body. Since the body force (and {{#crossLink "Body/angularForce:property"}}{{/crossLink}}) will be zeroed after each step, so you need to set the force before each step.
     * @property force
     * @type {Array}
     *
     * @example
     *     // This produces a forcefield of 1 Newton in the positive x direction.
     *     for(var i=0; i<numSteps; i++){
     *         body.force[0] = 1;
     *         world.step(1/60);
     *     }
     *
     * @example
     *     // This will apply a rotational force on the body
     *     for(var i=0; i<numSteps; i++){
     *         body.angularForce = -3;
     *         world.step(1/60);
     *     }
     */
    this.force = vec2_1.create();
    if(options.force){
        vec2_1.copy(this.force, options.force);
    }

    /**
     * The angular force acting on the body. See {{#crossLink "Body/force:property"}}{{/crossLink}}.
     * @property angularForce
     * @type {number}
     */
    this.angularForce = options.angularForce || 0;

    /**
     * The linear damping acting on the body in the velocity direction. Should be a value between 0 and 1.
     * @property damping
     * @type {Number}
     * @default 0.1
     */
    this.damping = typeof(options.damping) === "number" ? options.damping : 0.1;

    /**
     * The angular force acting on the body. Should be a value between 0 and 1.
     * @property angularDamping
     * @type {Number}
     * @default 0.1
     */
    this.angularDamping = typeof(options.angularDamping) === "number" ? options.angularDamping : 0.1;

    /**
     * The type of motion this body has. Should be one of: {{#crossLink "Body/STATIC:property"}}Body.STATIC{{/crossLink}}, {{#crossLink "Body/DYNAMIC:property"}}Body.DYNAMIC{{/crossLink}} and {{#crossLink "Body/KINEMATIC:property"}}Body.KINEMATIC{{/crossLink}}.
     *
     * * Static bodies do not move, and they do not respond to forces or collision.
     * * Dynamic bodies body can move and respond to collisions and forces.
     * * Kinematic bodies only moves according to its .velocity, and does not respond to collisions or force.
     *
     * @property type
     * @type {number}
     *
     * @example
     *     // Bodies are static by default. Static bodies will never move.
     *     var body = new Body();
     *     console.log(body.type == Body.STATIC); // true
     *
     * @example
     *     // By setting the mass of a body to a nonzero number, the body
     *     // will become dynamic and will move and interact with other bodies.
     *     var dynamicBody = new Body({
     *         mass : 1
     *     });
     *     console.log(dynamicBody.type == Body.DYNAMIC); // true
     *
     * @example
     *     // Kinematic bodies will only move if you change their velocity.
     *     var kinematicBody = new Body({
     *         type: Body.KINEMATIC // Type can be set via the options object.
     *     });
     */
    this.type = Body.STATIC;

    if(typeof(options.type) !== 'undefined'){
        this.type = options.type;
    } else if(!options.mass){
        this.type = Body.STATIC;
    } else {
        this.type = Body.DYNAMIC;
    }

    /**
     * Bounding circle radius.
     * @property boundingRadius
     * @type {Number}
     */
    this.boundingRadius = 0;

    /**
     * Bounding box of this body.
     * @property aabb
     * @type {AABB}
     */
    this.aabb = new AABB_1();

    /**
     * Indicates if the AABB needs update. Update it with {{#crossLink "Body/updateAABB:method"}}.updateAABB(){{/crossLink}}.
     * @property aabbNeedsUpdate
     * @type {Boolean}
     * @see updateAABB
     *
     * @example
     *     // Force update the AABB
     *     body.aabbNeedsUpdate = true;
     *     body.updateAABB();
     *     console.log(body.aabbNeedsUpdate); // false
     */
    this.aabbNeedsUpdate = true;

    /**
     * If true, the body will automatically fall to sleep. Note that you need to enable sleeping in the {{#crossLink "World"}}{{/crossLink}} before anything will happen.
     * @property allowSleep
     * @type {Boolean}
     * @default true
     */
    this.allowSleep = options.allowSleep !== undefined ? options.allowSleep : true;

    this.wantsToSleep = false;

    /**
     * One of {{#crossLink "Body/AWAKE:property"}}Body.AWAKE{{/crossLink}}, {{#crossLink "Body/SLEEPY:property"}}Body.SLEEPY{{/crossLink}} and {{#crossLink "Body/SLEEPING:property"}}Body.SLEEPING{{/crossLink}}.
     *
     * The body is initially Body.AWAKE. If its velocity norm is below .sleepSpeedLimit, the sleepState will become Body.SLEEPY. If the body continues to be Body.SLEEPY for .sleepTimeLimit seconds, it will fall asleep (Body.SLEEPY).
     *
     * @property sleepState
     * @type {Number}
     * @default Body.AWAKE
     */
    this.sleepState = Body.AWAKE;

    /**
     * If the speed (the norm of the velocity) is smaller than this value, the body is considered sleepy.
     * @property sleepSpeedLimit
     * @type {Number}
     * @default 0.2
     */
    this.sleepSpeedLimit = options.sleepSpeedLimit !== undefined ? options.sleepSpeedLimit : 0.2;

    /**
     * If the body has been sleepy for this sleepTimeLimit seconds, it is considered sleeping.
     * @property sleepTimeLimit
     * @type {Number}
     * @default 1
     */
    this.sleepTimeLimit = options.sleepTimeLimit !== undefined ? options.sleepTimeLimit : 1;

    /**
     * Gravity scaling factor. If you want the body to ignore gravity, set this to zero. If you want to reverse gravity, set it to -1.
     * @property {Number} gravityScale
     * @default 1
     */
    this.gravityScale = options.gravityScale !== undefined ? options.gravityScale : 1;

    /**
     * Whether to produce contact forces when in contact with other bodies. Note that contacts will be generated, but they will be disabled. That means that this body will move through other bodies, but it will still trigger contact events, etc.
     * @property {Boolean} collisionResponse
     */
    this.collisionResponse = options.collisionResponse !== undefined ? options.collisionResponse : true;

    /**
     * How long the body has been sleeping.
     * @property {Number} idleTime
     */
    this.idleTime = 0;

    /**
     * The last time when the body went to SLEEPY state.
     * @property {Number} timeLastSleepy
     * @private
     */
    this.timeLastSleepy = 0;

    /**
     * If the body speed exceeds this threshold, CCD (continuous collision detection) will be enabled. Set it to a negative number to disable CCD completely for this body.
     * @property {number} ccdSpeedThreshold
     * @default -1
     */
    this.ccdSpeedThreshold = options.ccdSpeedThreshold !== undefined ? options.ccdSpeedThreshold : -1;

    /**
     * The number of iterations that should be used when searching for the time of impact during CCD. A larger number will assure that there's a small penetration on CCD collision, but a small number will give more performance.
     * @property {number} ccdIterations
     * @default 10
     */
    this.ccdIterations = options.ccdIterations !== undefined ? options.ccdIterations : 10;

    this.concavePath = null;

    this._wakeUpAfterNarrowphase = false;

    this.updateMassProperties();
}
Body.prototype = new EventEmitter_1();
Body.prototype.constructor = Body;

Body._idCounter = 0;

/**
 * @private
 * @method updateSolveMassProperties
 */
Body.prototype.updateSolveMassProperties = function(){
    if(this.sleepState === Body.SLEEPING || this.type === Body.KINEMATIC){
        this.invMassSolve = 0;
        this.invInertiaSolve = 0;
    } else {
        this.invMassSolve = this.invMass;
        this.invInertiaSolve = this.invInertia;
    }
};

/**
 * Set the total density of the body
 * @method setDensity
 * @param {number} density
 */
Body.prototype.setDensity = function(density) {
    var totalArea = this.getArea();
    this.mass = totalArea * density;
    this.updateMassProperties();
};

/**
 * Get the total area of all shapes in the body
 * @method getArea
 * @return {Number}
 */
Body.prototype.getArea = function() {
    var totalArea = 0;
    for(var i=0; i<this.shapes.length; i++){
        totalArea += this.shapes[i].area;
    }
    return totalArea;
};

/**
 * Get the AABB from the body. The AABB is updated if necessary.
 * @method getAABB
 * @return {AABB} The AABB instance (this.aabb)
 */
Body.prototype.getAABB = function(){
    if(this.aabbNeedsUpdate){
        this.updateAABB();
    }
    return this.aabb;
};

var shapeAABB = new AABB_1(),
    tmp$1 = vec2_1.create();

/**
 * Updates the AABB of the Body, and set .aabbNeedsUpdate = false.
 * @method updateAABB
 */
Body.prototype.updateAABB = function() {
    var shapes = this.shapes,
        N = shapes.length,
        offset = tmp$1,
        bodyAngle = this.angle;

    for(var i=0; i!==N; i++){
        var shape = shapes[i],
            angle = shape.angle + bodyAngle;

        // Get shape world offset
        vec2_1.rotate(offset, shape.position, bodyAngle);
        vec2_1.add(offset, offset, this.position);

        // Get shape AABB
        shape.computeAABB(shapeAABB, offset, angle);

        if(i===0){
            this.aabb.copy(shapeAABB);
        } else {
            this.aabb.extend(shapeAABB);
        }
    }

    this.aabbNeedsUpdate = false;
};

/**
 * Update the bounding radius of the body (this.boundingRadius). Should be done if any of the shape dimensions or positions are changed.
 * @method updateBoundingRadius
 */
Body.prototype.updateBoundingRadius = function(){
    var shapes = this.shapes,
        N = shapes.length,
        radius = 0;

    for(var i=0; i!==N; i++){
        var shape = shapes[i],
            offset = vec2_1.length(shape.position),
            r = shape.boundingRadius;
        if(offset + r > radius){
            radius = offset + r;
        }
    }

    this.boundingRadius = radius;
};

/**
 * Add a shape to the body. You can pass a local transform when adding a shape,
 * so that the shape gets an offset and angle relative to the body center of mass.
 * Will automatically update the mass properties and bounding radius.
 *
 * @method addShape
 * @param  {Shape}              shape
 * @param  {Array} [offset] Local body offset of the shape.
 * @param  {Number}             [angle]  Local body angle.
 *
 * @example
 *     var body = new Body(),
 *         shape = new Circle({ radius: 1 });
 *
 *     // Add the shape to the body, positioned in the center
 *     body.addShape(shape);
 *
 *     // Add another shape to the body, positioned 1 unit length from the body center of mass along the local x-axis.
 *     body.addShape(shape,[1,0]);
 *
 *     // Add another shape to the body, positioned 1 unit length from the body center of mass along the local y-axis, and rotated 90 degrees CCW.
 *     body.addShape(shape,[0,1],Math.PI/2);
 */
Body.prototype.addShape = function(shape, offset, angle){
    if(shape.body){
        throw new Error('A shape can only be added to one body.');
    }
    shape.body = this;

    // Copy the offset vector
    if(offset){
        vec2_1.copy(shape.position, offset);
    } else {
        vec2_1.set(shape.position, 0, 0);
    }

    shape.angle = angle || 0;

    this.shapes.push(shape);
    this.updateMassProperties();
    this.updateBoundingRadius();

    this.aabbNeedsUpdate = true;
};

/**
 * Remove a shape
 * @method removeShape
 * @param  {Shape} shape
 * @return {Boolean} True if the shape was found and removed, else false.
 */
Body.prototype.removeShape = function(shape){
    var idx = this.shapes.indexOf(shape);

    if(idx !== -1){
        this.shapes.splice(idx,1);
        this.aabbNeedsUpdate = true;
        shape.body = null;
        return true;
    } else {
        return false;
    }
};

/**
 * Updates .inertia, .invMass, .invInertia for this Body. Should be called when
 * changing the structure or mass of the Body.
 *
 * @method updateMassProperties
 *
 * @example
 *     body.mass += 1;
 *     body.updateMassProperties();
 */
Body.prototype.updateMassProperties = function(){
    if(this.type === Body.STATIC || this.type === Body.KINEMATIC){

        this.mass = Number.MAX_VALUE;
        this.invMass = 0;
        this.inertia = Number.MAX_VALUE;
        this.invInertia = 0;

    } else {

        var shapes = this.shapes,
            N = shapes.length,
            m = this.mass / N,
            I = 0;

        if(!this.fixedRotation){
            for(var i=0; i<N; i++){
                var shape = shapes[i],
                    r2 = vec2_1.squaredLength(shape.position),
                    Icm = shape.computeMomentOfInertia(m);
                I += Icm + m*r2;
            }
            this.inertia = I;
            this.invInertia = I>0 ? 1/I : 0;

        } else {
            this.inertia = Number.MAX_VALUE;
            this.invInertia = 0;
        }

        // Inverse mass properties are easy
        this.invMass = 1 / this.mass;

        vec2_1.set(
            this.massMultiplier,
            this.fixedX ? 0 : 1,
            this.fixedY ? 0 : 1
        );
    }
};

var Body_applyForce_r = vec2_1.create();

/**
 * Apply force to a point relative to the center of mass of the body. This could for example be a point on the RigidBody surface. Applying force this way will add to Body.force and Body.angularForce. If relativePoint is zero, the force will be applied directly on the center of mass, and the torque produced will be zero.
 * @method applyForce
 * @param {Array} force The force to add.
 * @param {Array} [relativePoint] A world point to apply the force on.
 */
Body.prototype.applyForce = function(force, relativePoint){

    // Add linear force
    vec2_1.add(this.force, this.force, force);

    if(relativePoint){

        // Compute produced rotational force
        var rotForce = vec2_1.crossLength(relativePoint,force);

        // Add rotational force
        this.angularForce += rotForce;
    }
};

/**
 * Apply force to a body-local point.
 * @method applyForceLocal
 * @param  {Array} localForce The force vector to add, oriented in local body space.
 * @param  {Array} [localPoint] A point relative to the body in world space. If not given, it is set to zero and all of the impulse will be excerted on the center of mass.
 */
var Body_applyForce_forceWorld = vec2_1.create();
var Body_applyForce_pointWorld = vec2_1.create();
var Body_applyForce_pointLocal = vec2_1.create();
Body.prototype.applyForceLocal = function(localForce, localPoint){
    localPoint = localPoint || Body_applyForce_pointLocal;
    var worldForce = Body_applyForce_forceWorld;
    var worldPoint = Body_applyForce_pointWorld;
    this.vectorToWorldFrame(worldForce, localForce);
    this.vectorToWorldFrame(worldPoint, localPoint);
    this.applyForce(worldForce, worldPoint);
};

/**
 * Apply impulse to a point relative to the body. This could for example be a point on the Body surface. An impulse is a force added to a body during a short period of time (impulse = force * time). Impulses will be added to Body.velocity and Body.angularVelocity.
 * @method applyImpulse
 * @param  {Array} impulse The impulse vector to add, oriented in world space.
 * @param  {Array} [relativePoint] A point relative to the body in world space. If not given, it is set to zero and all of the impulse will be excerted on the center of mass.
 */
var Body_applyImpulse_velo = vec2_1.create();
Body.prototype.applyImpulse = function(impulseVector, relativePoint){
    if(this.type !== Body.DYNAMIC){
        return;
    }

    // Compute produced central impulse velocity
    var velo = Body_applyImpulse_velo;
    vec2_1.scale(velo, impulseVector, this.invMass);
    vec2_1.multiply(velo, this.massMultiplier, velo);

    // Add linear impulse
    vec2_1.add(this.velocity, velo, this.velocity);

    if(relativePoint){
        // Compute produced rotational impulse velocity
        var rotVelo = vec2_1.crossLength(relativePoint, impulseVector);
        rotVelo *= this.invInertia;

        // Add rotational Impulse
        this.angularVelocity += rotVelo;
    }
};

/**
 * Apply impulse to a point relative to the body. This could for example be a point on the Body surface. An impulse is a force added to a body during a short period of time (impulse = force * time). Impulses will be added to Body.velocity and Body.angularVelocity.
 * @method applyImpulseLocal
 * @param  {Array} impulse The impulse vector to add, oriented in world space.
 * @param  {Array} [relativePoint] A point relative to the body in world space. If not given, it is set to zero and all of the impulse will be excerted on the center of mass.
 */
var Body_applyImpulse_impulseWorld = vec2_1.create();
var Body_applyImpulse_pointWorld = vec2_1.create();
var Body_applyImpulse_pointLocal = vec2_1.create();
Body.prototype.applyImpulseLocal = function(localImpulse, localPoint){
    localPoint = localPoint || Body_applyImpulse_pointLocal;
    var worldImpulse = Body_applyImpulse_impulseWorld;
    var worldPoint = Body_applyImpulse_pointWorld;
    this.vectorToWorldFrame(worldImpulse, localImpulse);
    this.vectorToWorldFrame(worldPoint, localPoint);
    this.applyImpulse(worldImpulse, worldPoint);
};

/**
 * Transform a world point to local body frame.
 * @method toLocalFrame
 * @param  {Array} out          The vector to store the result in
 * @param  {Array} worldPoint   The input world point
 */
Body.prototype.toLocalFrame = function(out, worldPoint){
    vec2_1.toLocalFrame(out, worldPoint, this.position, this.angle);
};

/**
 * Transform a local point to world frame.
 * @method toWorldFrame
 * @param  {Array} out          The vector to store the result in
 * @param  {Array} localPoint   The input local point
 */
Body.prototype.toWorldFrame = function(out, localPoint){
    vec2_1.toGlobalFrame(out, localPoint, this.position, this.angle);
};

/**
 * Transform a world point to local body frame.
 * @method vectorToLocalFrame
 * @param  {Array} out          The vector to store the result in
 * @param  {Array} worldVector  The input world vector
 */
Body.prototype.vectorToLocalFrame = function(out, worldVector){
    vec2_1.vectorToLocalFrame(out, worldVector, this.angle);
};

/**
 * Transform a local point to world frame.
 * @method vectorToWorldFrame
 * @param  {Array} out          The vector to store the result in
 * @param  {Array} localVector  The input local vector
 */
Body.prototype.vectorToWorldFrame = function(out, localVector){
    vec2_1.vectorToGlobalFrame(out, localVector, this.angle);
};

/**
 * Reads a polygon shape path, and assembles convex shapes from that and puts them at proper offset points.
 * @method fromPolygon
 * @param {Array} path An array of 2d vectors, e.g. [[0,0],[0,1],...] that resembles a concave or convex polygon. The shape must be simple and without holes.
 * @param {Object} [options]
 * @param {Boolean} [options.optimalDecomp=false]   Set to true if you need optimal decomposition. Warning: very slow for polygons with more than 10 vertices.
 * @param {Boolean} [options.skipSimpleCheck=false] Set to true if you already know that the path is not intersecting itself.
 * @param {Boolean|Number} [options.removeCollinearPoints=false] Set to a number (angle threshold value) to remove collinear points, or false to keep all points.
 * @return {Boolean} True on success, else false.
 */
Body.prototype.fromPolygon = function(path,options){
    options = options || {};

    // Remove all shapes
    for(var i=this.shapes.length; i>=0; --i){
        this.removeShape(this.shapes[i]);
    }

    var p = new src.Polygon();
    p.vertices = path;

    // Make it counter-clockwise
    p.makeCCW();

    if(typeof(options.removeCollinearPoints) === "number"){
        p.removeCollinearPoints(options.removeCollinearPoints);
    }

    // Check if any line segment intersects the path itself
    if(typeof(options.skipSimpleCheck) === "undefined"){
        if(!p.isSimple()){
            return false;
        }
    }

    // Save this path for later
    this.concavePath = p.vertices.slice(0);
    for(var i=0; i<this.concavePath.length; i++){
        var v = [0,0];
        vec2_1.copy(v,this.concavePath[i]);
        this.concavePath[i] = v;
    }

    // Slow or fast decomp?
    var convexes;
    if(options.optimalDecomp){
        convexes = p.decomp();
    } else {
        convexes = p.quickDecomp();
    }

    var cm = vec2_1.create();

    // Add convexes
    for(var i=0; i!==convexes.length; i++){
        // Create convex
        var c = new Convex_1({ vertices: convexes[i].vertices });

        // Move all vertices so its center of mass is in the local center of the convex
        for(var j=0; j!==c.vertices.length; j++){
            var v = c.vertices[j];
            vec2_1.sub(v,v,c.centerOfMass);
        }

        vec2_1.scale(cm,c.centerOfMass,1);
        c.updateTriangles();
        c.updateCenterOfMass();
        c.updateBoundingRadius();

        // Add the shape
        this.addShape(c,cm);
    }

    this.adjustCenterOfMass();

    this.aabbNeedsUpdate = true;

    return true;
};

var adjustCenterOfMass_tmp1 = vec2_1.fromValues(0,0),
    adjustCenterOfMass_tmp2 = vec2_1.fromValues(0,0),
    adjustCenterOfMass_tmp3 = vec2_1.fromValues(0,0),
    adjustCenterOfMass_tmp4 = vec2_1.fromValues(0,0);

/**
 * Moves the shape offsets so their center of mass becomes the body center of mass.
 * @method adjustCenterOfMass
 */
Body.prototype.adjustCenterOfMass = function(){
    var offset_times_area = adjustCenterOfMass_tmp2,
        sum =               adjustCenterOfMass_tmp3,
        cm =                adjustCenterOfMass_tmp4,
        totalArea =         0;
    vec2_1.set(sum,0,0);

    for(var i=0; i!==this.shapes.length; i++){
        var s = this.shapes[i];
        vec2_1.scale(offset_times_area, s.position, s.area);
        vec2_1.add(sum, sum, offset_times_area);
        totalArea += s.area;
    }

    vec2_1.scale(cm,sum,1/totalArea);

    // Now move all shapes
    for(var i=0; i!==this.shapes.length; i++){
        var s = this.shapes[i];
        vec2_1.sub(s.position, s.position, cm);
    }

    // Move the body position too
    vec2_1.add(this.position,this.position,cm);

    // And concave path
    for(var i=0; this.concavePath && i<this.concavePath.length; i++){
        vec2_1.sub(this.concavePath[i], this.concavePath[i], cm);
    }

    this.updateMassProperties();
    this.updateBoundingRadius();
};

/**
 * Sets the force on the body to zero.
 * @method setZeroForce
 */
Body.prototype.setZeroForce = function(){
    vec2_1.set(this.force,0.0,0.0);
    this.angularForce = 0.0;
};

Body.prototype.resetConstraintVelocity = function(){
    var b = this,
        vlambda = b.vlambda;
    vec2_1.set(vlambda,0,0);
    b.wlambda = 0;
};

Body.prototype.addConstraintVelocity = function(){
    var b = this,
        v = b.velocity;
    vec2_1.add( v, v, b.vlambda);
    b.angularVelocity += b.wlambda;
};

/**
 * Apply damping, see <a href="http://code.google.com/p/bullet/issues/detail?id=74">this</a> for details.
 * @method applyDamping
 * @param  {number} dt Current time step
 */
Body.prototype.applyDamping = function(dt){
    if(this.type === Body.DYNAMIC){ // Only for dynamic bodies
        var v = this.velocity;
        vec2_1.scale(v, v, Math.pow(1.0 - this.damping,dt));
        this.angularVelocity *= Math.pow(1.0 - this.angularDamping,dt);
    }
};

/**
 * Wake the body up. Normally you should not need this, as the body is automatically awoken at events such as collisions.
 * Sets the sleepState to {{#crossLink "Body/AWAKE:property"}}Body.AWAKE{{/crossLink}} and emits the wakeUp event if the body wasn't awake before.
 * @method wakeUp
 */
Body.prototype.wakeUp = function(){
    var s = this.sleepState;
    this.sleepState = Body.AWAKE;
    this.idleTime = 0;
    if(s !== Body.AWAKE){
        this.emit(Body.wakeUpEvent);
    }
};

/**
 * Force body sleep
 * @method sleep
 */
Body.prototype.sleep = function(){
    this.sleepState = Body.SLEEPING;
    this.angularVelocity = 0;
    this.angularForce = 0;
    vec2_1.set(this.velocity,0,0);
    vec2_1.set(this.force,0,0);
    this.emit(Body.sleepEvent);
};

/**
 * Called every timestep to update internal sleep timer and change sleep state if needed.
 * @method sleepTick
 * @param {number} time The world time in seconds
 * @param {boolean} dontSleep
 * @param {number} dt
 */
Body.prototype.sleepTick = function(time, dontSleep, dt){
    if(!this.allowSleep || this.type === Body.SLEEPING){
        return;
    }

    this.wantsToSleep = false;

    var sleepState = this.sleepState,
        speedSquared = vec2_1.squaredLength(this.velocity) + Math.pow(this.angularVelocity,2),
        speedLimitSquared = Math.pow(this.sleepSpeedLimit,2);

    // Add to idle time
    if(speedSquared >= speedLimitSquared){
        this.idleTime = 0;
        this.sleepState = Body.AWAKE;
    } else {
        this.idleTime += dt;
        this.sleepState = Body.SLEEPY;
    }
    if(this.idleTime > this.sleepTimeLimit){
        if(!dontSleep){
            this.sleep();
        } else {
            this.wantsToSleep = true;
        }
    }
};

/**
 * Check if the body is overlapping another body. Note that this method only works if the body was added to a World and if at least one step was taken.
 * @method overlaps
 * @param  {Body} body
 * @return {boolean}
 */
Body.prototype.overlaps = function(body){
    return this.world.overlapKeeper.bodiesAreOverlapping(this, body);
};

var integrate_fhMinv = vec2_1.create();
var integrate_velodt = vec2_1.create();

/**
 * Move the body forward in time given its current velocity.
 * @method integrate
 * @param  {Number} dt
 */
Body.prototype.integrate = function(dt){
    var minv = this.invMass,
        f = this.force,
        pos = this.position,
        velo = this.velocity;

    // Save old position
    vec2_1.copy(this.previousPosition, this.position);
    this.previousAngle = this.angle;

    // Velocity update
    if(!this.fixedRotation){
        this.angularVelocity += this.angularForce * this.invInertia * dt;
    }
    vec2_1.scale(integrate_fhMinv, f, dt * minv);
    vec2_1.multiply(integrate_fhMinv, this.massMultiplier, integrate_fhMinv);
    vec2_1.add(velo, integrate_fhMinv, velo);

    // CCD
    if(!this.integrateToTimeOfImpact(dt)){

        // Regular position update
        vec2_1.scale(integrate_velodt, velo, dt);
        vec2_1.add(pos, pos, integrate_velodt);
        if(!this.fixedRotation){
            this.angle += this.angularVelocity * dt;
        }
    }

    this.aabbNeedsUpdate = true;
};

var result = new RaycastResult_1();
var ray = new Ray_1({
    mode: Ray_1.ALL
});
var direction = vec2_1.create();
var end = vec2_1.create();
var startToEnd = vec2_1.create();
var rememberPosition = vec2_1.create();
Body.prototype.integrateToTimeOfImpact = function(dt){

    if(this.ccdSpeedThreshold < 0 || vec2_1.squaredLength(this.velocity) < Math.pow(this.ccdSpeedThreshold, 2)){
        return false;
    }

    vec2_1.normalize(direction, this.velocity);

    vec2_1.scale(end, this.velocity, dt);
    vec2_1.add(end, end, this.position);

    vec2_1.sub(startToEnd, end, this.position);
    var startToEndAngle = this.angularVelocity * dt;
    var len = vec2_1.length(startToEnd);

    var timeOfImpact = 1;

    var hit;
    var that = this;
    result.reset();
    ray.callback = function (result) {
        if(result.body === that){
            return;
        }
        hit = result.body;
        result.getHitPoint(end, ray);
        vec2_1.sub(startToEnd, end, that.position);
        timeOfImpact = vec2_1.length(startToEnd) / len;
        result.stop();
    };
    vec2_1.copy(ray.from, this.position);
    vec2_1.copy(ray.to, end);
    ray.update();
    this.world.raycast(result, ray);

    if(!hit){
        return false;
    }

    var rememberAngle = this.angle;
    vec2_1.copy(rememberPosition, this.position);

    // Got a start and end point. Approximate time of impact using binary search
    var iter = 0;
    var tmin = 0;
    var tmid = 0;
    var tmax = timeOfImpact;
    while (tmax >= tmin && iter < this.ccdIterations) {
        iter++;

        // calculate the midpoint
        tmid = (tmax - tmin) / 2;

        // Move the body to that point
        vec2_1.scale(integrate_velodt, startToEnd, timeOfImpact);
        vec2_1.add(this.position, rememberPosition, integrate_velodt);
        this.angle = rememberAngle + startToEndAngle * timeOfImpact;
        this.updateAABB();

        // check overlap
        var overlaps = this.aabb.overlaps(hit.aabb) && this.world.narrowphase.bodiesOverlap(this, hit);

        if (overlaps) {
            // change min to search upper interval
            tmin = tmid;
        } else {
            // change max to search lower interval
            tmax = tmid;
        }
    }

    timeOfImpact = tmid;

    vec2_1.copy(this.position, rememberPosition);
    this.angle = rememberAngle;

    // move to TOI
    vec2_1.scale(integrate_velodt, startToEnd, timeOfImpact);
    vec2_1.add(this.position, this.position, integrate_velodt);
    if(!this.fixedRotation){
        this.angle += startToEndAngle * timeOfImpact;
    }

    return true;
};

/**
 * Get velocity of a point in the body.
 * @method getVelocityAtPoint
 * @param  {Array} result A vector to store the result in
 * @param  {Array} relativePoint A world oriented vector, indicating the position of the point to get the velocity from
 * @return {Array} The result vector
 */
Body.prototype.getVelocityAtPoint = function(result, relativePoint){
    vec2_1.crossVZ(result, relativePoint, this.angularVelocity);
    vec2_1.subtract(result, this.velocity, result);
    return result;
};

/**
 * @event sleepy
 */
Body.sleepyEvent = {
    type: "sleepy"
};

/**
 * @event sleep
 */
Body.sleepEvent = {
    type: "sleep"
};

/**
 * @event wakeup
 */
Body.wakeUpEvent = {
    type: "wakeup"
};

/**
 * Dynamic body.
 * @property DYNAMIC
 * @type {Number}
 * @static
 */
Body.DYNAMIC = 1;

/**
 * Static body.
 * @property STATIC
 * @type {Number}
 * @static
 */
Body.STATIC = 2;

/**
 * Kinematic body.
 * @property KINEMATIC
 * @type {Number}
 * @static
 */
Body.KINEMATIC = 4;

/**
 * @property AWAKE
 * @type {Number}
 * @static
 */
Body.AWAKE = 0;

/**
 * @property SLEEPY
 * @type {Number}
 * @static
 */
Body.SLEEPY = 1;

/**
 * @property SLEEPING
 * @type {Number}
 * @static
 */
Body.SLEEPING = 2;

var Equation_1 = Equation;



/**
 * Base class for constraint equations.
 * @class Equation
 * @constructor
 * @param {Body} bodyA First body participating in the equation
 * @param {Body} bodyB Second body participating in the equation
 * @param {number} minForce Minimum force to apply. Default: -Number.MAX_VALUE
 * @param {number} maxForce Maximum force to apply. Default: Number.MAX_VALUE
 */
function Equation(bodyA, bodyB, minForce, maxForce){

    /**
     * Minimum force to apply when solving.
     * @property minForce
     * @type {Number}
     */
    this.minForce = typeof(minForce)==="undefined" ? -Number.MAX_VALUE : minForce;

    /**
     * Max force to apply when solving.
     * @property maxForce
     * @type {Number}
     */
    this.maxForce = typeof(maxForce)==="undefined" ? Number.MAX_VALUE : maxForce;

    /**
     * First body participating in the constraint
     * @property bodyA
     * @type {Body}
     */
    this.bodyA = bodyA;

    /**
     * Second body participating in the constraint
     * @property bodyB
     * @type {Body}
     */
    this.bodyB = bodyB;

    /**
     * The stiffness of this equation. Typically chosen to a large number (~1e7), but can be chosen somewhat freely to get a stable simulation.
     * @property stiffness
     * @type {Number}
     */
    this.stiffness = Equation.DEFAULT_STIFFNESS;

    /**
     * The number of time steps needed to stabilize the constraint equation. Typically between 3 and 5 time steps.
     * @property relaxation
     * @type {Number}
     */
    this.relaxation = Equation.DEFAULT_RELAXATION;

    /**
     * The Jacobian entry of this equation. 6 numbers, 3 per body (x,y,angle).
     * @property G
     * @type {Array}
     */
    this.G = new Utils_1.ARRAY_TYPE(6);
    for(var i=0; i<6; i++){
        this.G[i]=0;
    }

    this.offset = 0;

    this.a = 0;
    this.b = 0;
    this.epsilon = 0;
    this.timeStep = 1/60;

    /**
     * Indicates if stiffness or relaxation was changed.
     * @property {Boolean} needsUpdate
     */
    this.needsUpdate = true;

    /**
     * The resulting constraint multiplier from the last solve. This is mostly equivalent to the force produced by the constraint.
     * @property multiplier
     * @type {Number}
     */
    this.multiplier = 0;

    /**
     * Relative velocity.
     * @property {Number} relativeVelocity
     */
    this.relativeVelocity = 0;

    /**
     * Whether this equation is enabled or not. If true, it will be added to the solver.
     * @property {Boolean} enabled
     */
    this.enabled = true;
}
Equation.prototype.constructor = Equation;

/**
 * The default stiffness when creating a new Equation.
 * @static
 * @property {Number} DEFAULT_STIFFNESS
 * @default 1e6
 */
Equation.DEFAULT_STIFFNESS = 1e6;

/**
 * The default relaxation when creating a new Equation.
 * @static
 * @property {Number} DEFAULT_RELAXATION
 * @default 4
 */
Equation.DEFAULT_RELAXATION = 4;

/**
 * Compute SPOOK parameters .a, .b and .epsilon according to the current parameters. See equations 9, 10 and 11 in the <a href="http://www8.cs.umu.se/kurser/5DV058/VT09/lectures/spooknotes.pdf">SPOOK notes</a>.
 * @method update
 */
Equation.prototype.update = function(){
    var k = this.stiffness,
        d = this.relaxation,
        h = this.timeStep;

    this.a = 4.0 / (h * (1 + 4 * d));
    this.b = (4.0 * d) / (1 + 4 * d);
    this.epsilon = 4.0 / (h * h * k * (1 + 4 * d));

    this.needsUpdate = false;
};

/**
 * Multiply a jacobian entry with corresponding positions or velocities
 * @method gmult
 * @return {Number}
 */
Equation.prototype.gmult = function(G,vi,wi,vj,wj){
    return  G[0] * vi[0] +
            G[1] * vi[1] +
            G[2] * wi +
            G[3] * vj[0] +
            G[4] * vj[1] +
            G[5] * wj;
};

/**
 * Computes the RHS of the SPOOK equation
 * @method computeB
 * @return {Number}
 */
Equation.prototype.computeB = function(a,b,h){
    var GW = this.computeGW();
    var Gq = this.computeGq();
    var GiMf = this.computeGiMf();
    return - Gq * a - GW * b - GiMf*h;
};

/**
 * Computes G\*q, where q are the generalized body coordinates
 * @method computeGq
 * @return {Number}
 */
var qi = vec2_1.create(),
    qj = vec2_1.create();
Equation.prototype.computeGq = function(){
    var G = this.G,
        bi = this.bodyA,
        bj = this.bodyB,
        xi = bi.position,
        xj = bj.position,
        ai = bi.angle,
        aj = bj.angle;

    return this.gmult(G, qi, ai, qj, aj) + this.offset;
};

/**
 * Computes G\*W, where W are the body velocities
 * @method computeGW
 * @return {Number}
 */
Equation.prototype.computeGW = function(){
    var G = this.G,
        bi = this.bodyA,
        bj = this.bodyB,
        vi = bi.velocity,
        vj = bj.velocity,
        wi = bi.angularVelocity,
        wj = bj.angularVelocity;
    return this.gmult(G,vi,wi,vj,wj) + this.relativeVelocity;
};

/**
 * Computes G\*Wlambda, where W are the body velocities
 * @method computeGWlambda
 * @return {Number}
 */
Equation.prototype.computeGWlambda = function(){
    var G = this.G,
        bi = this.bodyA,
        bj = this.bodyB,
        vi = bi.vlambda,
        vj = bj.vlambda,
        wi = bi.wlambda,
        wj = bj.wlambda;
    return this.gmult(G,vi,wi,vj,wj);
};

/**
 * Computes G\*inv(M)\*f, where M is the mass matrix with diagonal blocks for each body, and f are the forces on the bodies.
 * @method computeGiMf
 * @return {Number}
 */
var iMfi = vec2_1.create(),
    iMfj = vec2_1.create();
Equation.prototype.computeGiMf = function(){
    var bi = this.bodyA,
        bj = this.bodyB,
        fi = bi.force,
        ti = bi.angularForce,
        fj = bj.force,
        tj = bj.angularForce,
        invMassi = bi.invMassSolve,
        invMassj = bj.invMassSolve,
        invIi = bi.invInertiaSolve,
        invIj = bj.invInertiaSolve,
        G = this.G;

    vec2_1.scale(iMfi, fi, invMassi);
    vec2_1.multiply(iMfi, bi.massMultiplier, iMfi);
    vec2_1.scale(iMfj, fj,invMassj);
    vec2_1.multiply(iMfj, bj.massMultiplier, iMfj);

    return this.gmult(G,iMfi,ti*invIi,iMfj,tj*invIj);
};

/**
 * Computes G\*inv(M)\*G'
 * @method computeGiMGt
 * @return {Number}
 */
Equation.prototype.computeGiMGt = function(){
    var bi = this.bodyA,
        bj = this.bodyB,
        invMassi = bi.invMassSolve,
        invMassj = bj.invMassSolve,
        invIi = bi.invInertiaSolve,
        invIj = bj.invInertiaSolve,
        G = this.G;

    return  G[0] * G[0] * invMassi * bi.massMultiplier[0] +
            G[1] * G[1] * invMassi * bi.massMultiplier[1] +
            G[2] * G[2] *    invIi +
            G[3] * G[3] * invMassj * bj.massMultiplier[0] +
            G[4] * G[4] * invMassj * bj.massMultiplier[1] +
            G[5] * G[5] *    invIj;
};

var addToWlambda_temp = vec2_1.create(),
    addToWlambda_Gi = vec2_1.create(),
    addToWlambda_Gj = vec2_1.create(),
    addToWlambda_ri = vec2_1.create(),
    addToWlambda_rj = vec2_1.create(),
    addToWlambda_Mdiag = vec2_1.create();

/**
 * Add constraint velocity to the bodies.
 * @method addToWlambda
 * @param {Number} deltalambda
 */
Equation.prototype.addToWlambda = function(deltalambda){
    var bi = this.bodyA,
        bj = this.bodyB,
        temp = addToWlambda_temp,
        Gi = addToWlambda_Gi,
        Gj = addToWlambda_Gj,
        invMassi = bi.invMassSolve,
        invMassj = bj.invMassSolve,
        invIi = bi.invInertiaSolve,
        invIj = bj.invInertiaSolve,
        G = this.G;

    Gi[0] = G[0];
    Gi[1] = G[1];
    Gj[0] = G[3];
    Gj[1] = G[4];

    // Add to linear velocity
    // v_lambda += inv(M) * delta_lamba * G
    vec2_1.scale(temp, Gi, invMassi*deltalambda);
    vec2_1.multiply(temp, temp, bi.massMultiplier);
    vec2_1.add( bi.vlambda, bi.vlambda, temp);
    // This impulse is in the offset frame
    // Also add contribution to angular
    //bi.wlambda -= vec2.crossLength(temp,ri);
    bi.wlambda += invIi * G[2] * deltalambda;


    vec2_1.scale(temp, Gj, invMassj*deltalambda);
    vec2_1.multiply(temp, temp, bj.massMultiplier);
    vec2_1.add( bj.vlambda, bj.vlambda, temp);
    //bj.wlambda -= vec2.crossLength(temp,rj);
    bj.wlambda += invIj * G[5] * deltalambda;
};

/**
 * Compute the denominator part of the SPOOK equation: C = G\*inv(M)\*G' + eps
 * @method computeInvC
 * @param  {Number} eps
 * @return {Number}
 */
Equation.prototype.computeInvC = function(eps){
    return 1.0 / (this.computeGiMGt() + eps);
};

var AngleLockEquation_1 = AngleLockEquation;

/**
 * Locks the relative angle between two bodies. The constraint tries to keep the dot product between two vectors, local in each body, to zero. The local angle in body i is a parameter.
 *
 * @class AngleLockEquation
 * @constructor
 * @extends Equation
 * @param {Body} bodyA
 * @param {Body} bodyB
 * @param {Object} [options]
 * @param {Number} [options.angle] Angle to add to the local vector in body A.
 * @param {Number} [options.ratio] Gear ratio
 */
function AngleLockEquation(bodyA, bodyB, options){
    options = options || {};
    Equation_1.call(this,bodyA,bodyB,-Number.MAX_VALUE,Number.MAX_VALUE);
    this.angle = options.angle || 0;

    /**
     * The gear ratio.
     * @property {Number} ratio
     * @private
     * @see setRatio
     */
    this.ratio = typeof(options.ratio)==="number" ? options.ratio : 1;

    this.setRatio(this.ratio);
}
AngleLockEquation.prototype = new Equation_1();
AngleLockEquation.prototype.constructor = AngleLockEquation;

AngleLockEquation.prototype.computeGq = function(){
    return this.ratio * this.bodyA.angle - this.bodyB.angle + this.angle;
};

/**
 * Set the gear ratio for this equation
 * @method setRatio
 * @param {Number} ratio
 */
AngleLockEquation.prototype.setRatio = function(ratio){
    var G = this.G;
    G[2] =  ratio;
    G[5] = -1;
    this.ratio = ratio;
};

/**
 * Set the max force for the equation.
 * @method setMaxTorque
 * @param {Number} torque
 */
AngleLockEquation.prototype.setMaxTorque = function(torque){
    this.maxForce =  torque;
    this.minForce = -torque;
};

var Broadphase_1 = Broadphase;

/**
 * Base class for broadphase implementations.
 * @class Broadphase
 * @constructor
 */
function Broadphase(type){

    this.type = type;

    /**
     * The resulting overlapping pairs. Will be filled with results during .getCollisionPairs().
     * @property result
     * @type {Array}
     */
    this.result = [];

    /**
     * The world to search for collision pairs in. To change it, use .setWorld()
     * @property world
     * @type {World}
     * @readOnly
     */
    this.world = null;

    /**
     * The bounding volume type to use in the broadphase algorithms. Should be set to Broadphase.AABB or Broadphase.BOUNDING_CIRCLE.
     * @property {Number} boundingVolumeType
     */
    this.boundingVolumeType = Broadphase.AABB;
}

/**
 * Axis aligned bounding box type.
 * @static
 * @property {Number} AABB
 */
Broadphase.AABB = 1;

/**
 * Bounding circle type.
 * @static
 * @property {Number} BOUNDING_CIRCLE
 */
Broadphase.BOUNDING_CIRCLE = 2;

/**
 * Set the world that we are searching for collision pairs in.
 * @method setWorld
 * @param  {World} world
 */
Broadphase.prototype.setWorld = function(world){
    this.world = world;
};

/**
 * Get all potential intersecting body pairs.
 * @method getCollisionPairs
 * @param  {World} world The world to search in.
 * @return {Array} An array of the bodies, ordered in pairs. Example: A result of [a,b,c,d] means that the potential pairs are: (a,b), (c,d).
 */
Broadphase.prototype.getCollisionPairs = function(world){};

var dist = vec2_1.create();

/**
 * Check whether the bounding radius of two bodies overlap.
 * @method  boundingRadiusCheck
 * @param  {Body} bodyA
 * @param  {Body} bodyB
 * @return {Boolean}
 */
Broadphase.boundingRadiusCheck = function(bodyA, bodyB){
    vec2_1.sub(dist, bodyA.position, bodyB.position);
    var d2 = vec2_1.squaredLength(dist),
        r = bodyA.boundingRadius + bodyB.boundingRadius;
    return d2 <= r*r;
};

/**
 * Check whether the bounding radius of two bodies overlap.
 * @method  boundingRadiusCheck
 * @param  {Body} bodyA
 * @param  {Body} bodyB
 * @return {Boolean}
 */
Broadphase.aabbCheck = function(bodyA, bodyB){
    return bodyA.getAABB().overlaps(bodyB.getAABB());
};

/**
 * Check whether the bounding radius of two bodies overlap.
 * @method  boundingRadiusCheck
 * @param  {Body} bodyA
 * @param  {Body} bodyB
 * @return {Boolean}
 */
Broadphase.prototype.boundingVolumeCheck = function(bodyA, bodyB){
    var result;

    switch(this.boundingVolumeType){
    case Broadphase.BOUNDING_CIRCLE:
        result =  Broadphase.boundingRadiusCheck(bodyA,bodyB);
        break;
    case Broadphase.AABB:
        result = Broadphase.aabbCheck(bodyA,bodyB);
        break;
    default:
        throw new Error('Bounding volume type not recognized: '+this.boundingVolumeType);
    }
    return result;
};

/**
 * Check whether two bodies are allowed to collide at all.
 * @method  canCollide
 * @param  {Body} bodyA
 * @param  {Body} bodyB
 * @return {Boolean}
 */
Broadphase.canCollide = function(bodyA, bodyB){
    var KINEMATIC = Body_1.KINEMATIC;
    var STATIC = Body_1.STATIC;

    // Cannot collide static bodies
    if(bodyA.type === STATIC && bodyB.type === STATIC){
        return false;
    }

    // Cannot collide static vs kinematic bodies
    if( (bodyA.type === KINEMATIC && bodyB.type === STATIC) ||
        (bodyA.type === STATIC    && bodyB.type === KINEMATIC)){
        return false;
    }

    // Cannot collide kinematic vs kinematic
    if(bodyA.type === KINEMATIC && bodyB.type === KINEMATIC){
        return false;
    }

    // Cannot collide both sleeping bodies
    if(bodyA.sleepState === Body_1.SLEEPING && bodyB.sleepState === Body_1.SLEEPING){
        return false;
    }

    // Cannot collide if one is static and the other is sleeping
    if( (bodyA.sleepState === Body_1.SLEEPING && bodyB.type === STATIC) ||
        (bodyB.sleepState === Body_1.SLEEPING && bodyA.type === STATIC)){
        return false;
    }

    return true;
};

Broadphase.NAIVE = 1;
Broadphase.SAP = 2;

var Capsule_1 = Capsule;

/**
 * Capsule shape class.
 * @class Capsule
 * @constructor
 * @extends Shape
 * @param {object} [options] (Note that this options object will be passed on to the {{#crossLink "Shape"}}{{/crossLink}} constructor.)
 * @param {Number} [options.length=1] The distance between the end points
 * @param {Number} [options.radius=1] Radius of the capsule
 * @example
 *     var capsuleShape = new Capsule({
 *         length: 1,
 *         radius: 2
 *     });
 *     body.addShape(capsuleShape);
 */
function Capsule(options){
    if(typeof(arguments[0]) === 'number' && typeof(arguments[1]) === 'number'){
        options = {
            length: arguments[0],
            radius: arguments[1]
        };
        console.warn('The Capsule constructor signature has changed. Please use the following format: new Capsule({ radius: 1, length: 1 })');
    }
    options = options || {};

    /**
     * The distance between the end points.
     * @property {Number} length
     */
    this.length = options.length || 1;

    /**
     * The radius of the capsule.
     * @property {Number} radius
     */
    this.radius = options.radius || 1;

    options.type = Shape_1.CAPSULE;
    Shape_1.call(this, options);
}
Capsule.prototype = new Shape_1();
Capsule.prototype.constructor = Capsule;

/**
 * Compute the mass moment of inertia of the Capsule.
 * @method conputeMomentOfInertia
 * @param  {Number} mass
 * @return {Number}
 * @todo
 */
Capsule.prototype.computeMomentOfInertia = function(mass){
    // Approximate with rectangle
    var r = this.radius,
        w = this.length + r, // 2*r is too much, 0 is too little
        h = r*2;
    return mass * (h*h + w*w) / 12;
};

/**
 * @method updateBoundingRadius
 */
Capsule.prototype.updateBoundingRadius = function(){
    this.boundingRadius = this.radius + this.length/2;
};

/**
 * @method updateArea
 */
Capsule.prototype.updateArea = function(){
    this.area = Math.PI * this.radius * this.radius + this.radius * 2 * this.length;
};

var r = vec2_1.create();

/**
 * @method computeAABB
 * @param  {AABB}   out      The resulting AABB.
 * @param  {Array}  position
 * @param  {Number} angle
 */
Capsule.prototype.computeAABB = function(out, position, angle){
    var radius = this.radius;

    // Compute center position of one of the the circles, world oriented, but with local offset
    vec2_1.set(r,this.length / 2,0);
    if(angle !== 0){
        vec2_1.rotate(r,r,angle);
    }

    // Get bounds
    vec2_1.set(out.upperBound,  Math.max(r[0]+radius, -r[0]+radius),
                              Math.max(r[1]+radius, -r[1]+radius));
    vec2_1.set(out.lowerBound,  Math.min(r[0]-radius, -r[0]-radius),
                              Math.min(r[1]-radius, -r[1]-radius));

    // Add offset
    vec2_1.add(out.lowerBound, out.lowerBound, position);
    vec2_1.add(out.upperBound, out.upperBound, position);
};

var intersectCapsule_hitPointWorld = vec2_1.create();
var intersectCapsule_normal = vec2_1.create();
var intersectCapsule_l0 = vec2_1.create();
var intersectCapsule_l1 = vec2_1.create();
var intersectCapsule_unit_y = vec2_1.fromValues(0,1);

/**
 * @method raycast
 * @param  {RaycastResult} result
 * @param  {Ray} ray
 * @param  {array} position
 * @param  {number} angle
 */
Capsule.prototype.raycast = function(result, ray, position, angle){
    var from = ray.from;
    var to = ray.to;
    var direction = ray.direction;

    var hitPointWorld = intersectCapsule_hitPointWorld;
    var normal = intersectCapsule_normal;
    var l0 = intersectCapsule_l0;
    var l1 = intersectCapsule_l1;

    // The sides
    var halfLen = this.length / 2;
    for(var i=0; i<2; i++){

        // get start and end of the line
        var y = this.radius * (i*2-1);
        vec2_1.set(l0, -halfLen, y);
        vec2_1.set(l1, halfLen, y);
        vec2_1.toGlobalFrame(l0, l0, position, angle);
        vec2_1.toGlobalFrame(l1, l1, position, angle);

        var delta = vec2_1.getLineSegmentsIntersectionFraction(from, to, l0, l1);
        if(delta >= 0){
            vec2_1.rotate(normal, intersectCapsule_unit_y, angle);
            vec2_1.scale(normal, normal, (i*2-1));
            ray.reportIntersection(result, delta, normal, -1);
            if(result.shouldStop(ray)){
                return;
            }
        }
    }

    // Circles
    var diagonalLengthSquared = Math.pow(this.radius, 2) + Math.pow(halfLen, 2);
    for(var i=0; i<2; i++){
        vec2_1.set(l0, halfLen * (i*2-1), 0);
        vec2_1.toGlobalFrame(l0, l0, position, angle);

        var a = Math.pow(to[0] - from[0], 2) + Math.pow(to[1] - from[1], 2);
        var b = 2 * ((to[0] - from[0]) * (from[0] - l0[0]) + (to[1] - from[1]) * (from[1] - l0[1]));
        var c = Math.pow(from[0] - l0[0], 2) + Math.pow(from[1] - l0[1], 2) - Math.pow(this.radius, 2);
        var delta = Math.pow(b, 2) - 4 * a * c;

        if(delta < 0){
            // No intersection
            continue;

        } else if(delta === 0){
            // single intersection point
            vec2_1.lerp(hitPointWorld, from, to, delta);

            if(vec2_1.squaredDistance(hitPointWorld, position) > diagonalLengthSquared){
                vec2_1.sub(normal, hitPointWorld, l0);
                vec2_1.normalize(normal,normal);
                ray.reportIntersection(result, delta, normal, -1);
                if(result.shouldStop(ray)){
                    return;
                }
            }

        } else {
            var sqrtDelta = Math.sqrt(delta);
            var inv2a = 1 / (2 * a);
            var d1 = (- b - sqrtDelta) * inv2a;
            var d2 = (- b + sqrtDelta) * inv2a;

            if(d1 >= 0 && d1 <= 1){
                vec2_1.lerp(hitPointWorld, from, to, d1);
                if(vec2_1.squaredDistance(hitPointWorld, position) > diagonalLengthSquared){
                    vec2_1.sub(normal, hitPointWorld, l0);
                    vec2_1.normalize(normal,normal);
                    ray.reportIntersection(result, d1, normal, -1);
                    if(result.shouldStop(ray)){
                        return;
                    }
                }
            }

            if(d2 >= 0 && d2 <= 1){
                vec2_1.lerp(hitPointWorld, from, to, d2);
                if(vec2_1.squaredDistance(hitPointWorld, position) > diagonalLengthSquared){
                    vec2_1.sub(normal, hitPointWorld, l0);
                    vec2_1.normalize(normal,normal);
                    ray.reportIntersection(result, d2, normal, -1);
                    if(result.shouldStop(ray)){
                        return;
                    }
                }
            }
        }
    }
};

var Circle_1 = Circle;

/**
 * Circle shape class.
 * @class Circle
 * @extends Shape
 * @constructor
 * @param {options} [options] (Note that this options object will be passed on to the {{#crossLink "Shape"}}{{/crossLink}} constructor.)
 * @param {number} [options.radius=1] The radius of this circle
 *
 * @example
 *     var circleShape = new Circle({ radius: 1 });
 *     body.addShape(circleShape);
 */
function Circle(options){
    if(typeof(arguments[0]) === 'number'){
        options = {
            radius: arguments[0]
        };
        console.warn('The Circle constructor signature has changed. Please use the following format: new Circle({ radius: 1 })');
    }
    options = options || {};

    /**
     * The radius of the circle.
     * @property radius
     * @type {number}
     */
    this.radius = options.radius || 1;

    options.type = Shape_1.CIRCLE;
    Shape_1.call(this, options);
}
Circle.prototype = new Shape_1();
Circle.prototype.constructor = Circle;

/**
 * @method computeMomentOfInertia
 * @param  {Number} mass
 * @return {Number}
 */
Circle.prototype.computeMomentOfInertia = function(mass){
    var r = this.radius;
    return mass * r * r / 2;
};

/**
 * @method updateBoundingRadius
 * @return {Number}
 */
Circle.prototype.updateBoundingRadius = function(){
    this.boundingRadius = this.radius;
};

/**
 * @method updateArea
 * @return {Number}
 */
Circle.prototype.updateArea = function(){
    this.area = Math.PI * this.radius * this.radius;
};

/**
 * @method computeAABB
 * @param  {AABB}   out      The resulting AABB.
 * @param  {Array}  position
 * @param  {Number} angle
 */
Circle.prototype.computeAABB = function(out, position, angle){
    var r = this.radius;
    vec2_1.set(out.upperBound,  r,  r);
    vec2_1.set(out.lowerBound, -r, -r);
    if(position){
        vec2_1.add(out.lowerBound, out.lowerBound, position);
        vec2_1.add(out.upperBound, out.upperBound, position);
    }
};

var Ray_intersectSphere_intersectionPoint = vec2_1.create();
var Ray_intersectSphere_normal = vec2_1.create();

/**
 * @method raycast
 * @param  {RaycastResult} result
 * @param  {Ray} ray
 * @param  {array} position
 * @param  {number} angle
 */
Circle.prototype.raycast = function(result, ray, position, angle){
    var from = ray.from,
        to = ray.to,
        r = this.radius;

    var a = Math.pow(to[0] - from[0], 2) + Math.pow(to[1] - from[1], 2);
    var b = 2 * ((to[0] - from[0]) * (from[0] - position[0]) + (to[1] - from[1]) * (from[1] - position[1]));
    var c = Math.pow(from[0] - position[0], 2) + Math.pow(from[1] - position[1], 2) - Math.pow(r, 2);
    var delta = Math.pow(b, 2) - 4 * a * c;

    var intersectionPoint = Ray_intersectSphere_intersectionPoint;
    var normal = Ray_intersectSphere_normal;

    if(delta < 0){
        // No intersection
        return;

    } else if(delta === 0){
        // single intersection point
        vec2_1.lerp(intersectionPoint, from, to, delta);

        vec2_1.sub(normal, intersectionPoint, position);
        vec2_1.normalize(normal,normal);

        ray.reportIntersection(result, delta, normal, -1);

    } else {
        var sqrtDelta = Math.sqrt(delta);
        var inv2a = 1 / (2 * a);
        var d1 = (- b - sqrtDelta) * inv2a;
        var d2 = (- b + sqrtDelta) * inv2a;

        if(d1 >= 0 && d1 <= 1){
            vec2_1.lerp(intersectionPoint, from, to, d1);

            vec2_1.sub(normal, intersectionPoint, position);
            vec2_1.normalize(normal,normal);

            ray.reportIntersection(result, d1, normal, -1);

            if(result.shouldStop(ray)){
                return;
            }
        }

        if(d2 >= 0 && d2 <= 1){
            vec2_1.lerp(intersectionPoint, from, to, d2);

            vec2_1.sub(normal, intersectionPoint, position);
            vec2_1.normalize(normal,normal);

            ray.reportIntersection(result, d2, normal, -1);
        }
    }
};

var Constraint_1 = Constraint;



/**
 * Base constraint class.
 *
 * @class Constraint
 * @constructor
 * @author schteppe
 * @param {Body} bodyA
 * @param {Body} bodyB
 * @param {Number} type
 * @param {Object} [options]
 * @param {Object} [options.collideConnected=true]
 */
function Constraint(bodyA, bodyB, type, options){

    /**
     * The type of constraint. May be one of Constraint.DISTANCE, Constraint.GEAR, Constraint.LOCK, Constraint.PRISMATIC or Constraint.REVOLUTE.
     * @property {number} type
     */
    this.type = type;

    options = Utils_1.defaults(options,{
        collideConnected : true,
        wakeUpBodies : true,
    });

    /**
     * Equations to be solved in this constraint
     *
     * @property equations
     * @type {Array}
     */
    this.equations = [];

    /**
     * First body participating in the constraint.
     * @property bodyA
     * @type {Body}
     */
    this.bodyA = bodyA;

    /**
     * Second body participating in the constraint.
     * @property bodyB
     * @type {Body}
     */
    this.bodyB = bodyB;

    /**
     * Set to true if you want the connected bodies to collide.
     * @property collideConnected
     * @type {Boolean}
     * @default true
     */
    this.collideConnected = options.collideConnected;

    // Wake up bodies when connected
    if(options.wakeUpBodies){
        if(bodyA){
            bodyA.wakeUp();
        }
        if(bodyB){
            bodyB.wakeUp();
        }
    }
}

/**
 * Updates the internal constraint parameters before solve.
 * @method update
 */
Constraint.prototype.update = function(){
    throw new Error("method update() not implmemented in this Constraint subclass!");
};

/**
 * @static
 * @property {number} DISTANCE
 */
Constraint.DISTANCE = 1;

/**
 * @static
 * @property {number} GEAR
 */
Constraint.GEAR = 2;

/**
 * @static
 * @property {number} LOCK
 */
Constraint.LOCK = 3;

/**
 * @static
 * @property {number} PRISMATIC
 */
Constraint.PRISMATIC = 4;

/**
 * @static
 * @property {number} REVOLUTE
 */
Constraint.REVOLUTE = 5;

/**
 * Set stiffness for this constraint.
 * @method setStiffness
 * @param {Number} stiffness
 */
Constraint.prototype.setStiffness = function(stiffness){
    var eqs = this.equations;
    for(var i=0; i !== eqs.length; i++){
        var eq = eqs[i];
        eq.stiffness = stiffness;
        eq.needsUpdate = true;
    }
};

/**
 * Set relaxation for this constraint.
 * @method setRelaxation
 * @param {Number} relaxation
 */
Constraint.prototype.setRelaxation = function(relaxation){
    var eqs = this.equations;
    for(var i=0; i !== eqs.length; i++){
        var eq = eqs[i];
        eq.relaxation = relaxation;
        eq.needsUpdate = true;
    }
};

var ContactEquation_1 = ContactEquation;

/**
 * Non-penetration constraint equation. Tries to make the contactPointA and contactPointB vectors coincide, while keeping the applied force repulsive.
 *
 * @class ContactEquation
 * @constructor
 * @extends Equation
 * @param {Body} bodyA
 * @param {Body} bodyB
 */
function ContactEquation(bodyA, bodyB){
    Equation_1.call(this, bodyA, bodyB, 0, Number.MAX_VALUE);

    /**
     * Vector from body i center of mass to the contact point.
     * @property contactPointA
     * @type {Array}
     */
    this.contactPointA = vec2_1.create();
    this.penetrationVec = vec2_1.create();

    /**
     * World-oriented vector from body A center of mass to the contact point.
     * @property contactPointB
     * @type {Array}
     */
    this.contactPointB = vec2_1.create();

    /**
     * The normal vector, pointing out of body i
     * @property normalA
     * @type {Array}
     */
    this.normalA = vec2_1.create();

    /**
     * The restitution to use (0=no bounciness, 1=max bounciness).
     * @property restitution
     * @type {Number}
     */
    this.restitution = 0;

    /**
     * This property is set to true if this is the first impact between the bodies (not persistant contact).
     * @property firstImpact
     * @type {Boolean}
     * @readOnly
     */
    this.firstImpact = false;

    /**
     * The shape in body i that triggered this contact.
     * @property shapeA
     * @type {Shape}
     */
    this.shapeA = null;

    /**
     * The shape in body j that triggered this contact.
     * @property shapeB
     * @type {Shape}
     */
    this.shapeB = null;
}
ContactEquation.prototype = new Equation_1();
ContactEquation.prototype.constructor = ContactEquation;
ContactEquation.prototype.computeB = function(a,b,h){
    var bi = this.bodyA,
        bj = this.bodyB,
        ri = this.contactPointA,
        rj = this.contactPointB,
        xi = bi.position,
        xj = bj.position;

    var penetrationVec = this.penetrationVec,
        n = this.normalA,
        G = this.G;

    // Caluclate cross products
    var rixn = vec2_1.crossLength(ri,n),
        rjxn = vec2_1.crossLength(rj,n);

    // G = [-n -rixn n rjxn]
    G[0] = -n[0];
    G[1] = -n[1];
    G[2] = -rixn;
    G[3] = n[0];
    G[4] = n[1];
    G[5] = rjxn;

    // Calculate q = xj+rj -(xi+ri) i.e. the penetration vector
    vec2_1.add(penetrationVec,xj,rj);
    vec2_1.sub(penetrationVec,penetrationVec,xi);
    vec2_1.sub(penetrationVec,penetrationVec,ri);

    // Compute iteration
    var GW, Gq;
    if(this.firstImpact && this.restitution !== 0){
        Gq = 0;
        GW = (1/b)*(1+this.restitution) * this.computeGW();
    } else {
        Gq = vec2_1.dot(n,penetrationVec) + this.offset;
        GW = this.computeGW();
    }

    var GiMf = this.computeGiMf();
    var B = - Gq * a - GW * b - h*GiMf;

    return B;
};

var vi = vec2_1.create();
var vj = vec2_1.create();
var relVel = vec2_1.create();

/**
 * Get the relative velocity along the normal vector.
 * @return {number}
 */
ContactEquation.prototype.getVelocityAlongNormal = function(){

    this.bodyA.getVelocityAtPoint(vi, this.contactPointA);
    this.bodyB.getVelocityAtPoint(vj, this.contactPointB);

    vec2_1.subtract(relVel, vi, vj);

    return vec2_1.dot(this.normalA, relVel);
};

var Pool_1 = Pool;

/**
 * @class Object pooling utility.
 */
function Pool(options) {
	options = options || {};

	/**
	 * @property {Array} objects
	 * @type {Array}
	 */
	this.objects = [];

	if(options.size !== undefined){
		this.resize(options.size);
	}
}

/**
 * @method resize
 * @param {number} size
 * @return {Pool} Self, for chaining
 */
Pool.prototype.resize = function (size) {
	var objects = this.objects;

	while (objects.length > size) {
		objects.pop();
	}

	while (objects.length < size) {
		objects.push(this.create());
	}

	return this;
};

/**
 * Get an object from the pool or create a new instance.
 * @method get
 * @return {Object}
 */
Pool.prototype.get = function () {
	var objects = this.objects;
	return objects.length ? objects.pop() : this.create();
};

/**
 * Clean up and put the object back into the pool for later use.
 * @method release
 * @param {Object} object
 * @return {Pool} Self for chaining
 */
Pool.prototype.release = function (object) {
	this.destroy(object);
	this.objects.push(object);
	return this;
};

var ContactEquationPool_1 = ContactEquationPool;

/**
 * @class
 */
function ContactEquationPool() {
	Pool_1.apply(this, arguments);
}
ContactEquationPool.prototype = new Pool_1();
ContactEquationPool.prototype.constructor = ContactEquationPool;

/**
 * @method create
 * @return {ContactEquation}
 */
ContactEquationPool.prototype.create = function () {
	return new ContactEquation_1();
};

/**
 * @method destroy
 * @param {ContactEquation} equation
 * @return {ContactEquationPool}
 */
ContactEquationPool.prototype.destroy = function (equation) {
	equation.bodyA = equation.bodyB = null;
	return this;
};

var Material_1 = Material;

/**
 * Defines a physics material.
 * @class Material
 * @constructor
 * @param {number} id Material identifier
 * @author schteppe
 */
function Material(id){
    /**
     * The material identifier
     * @property id
     * @type {Number}
     */
    this.id = id || Material.idCounter++;
}

Material.idCounter = 0;

var ContactMaterial_1 = ContactMaterial;

/**
 * Defines what happens when two materials meet, such as what friction coefficient to use. You can also set other things such as restitution, surface velocity and constraint parameters.
 * @class ContactMaterial
 * @constructor
 * @param {Material} materialA
 * @param {Material} materialB
 * @param {Object}   [options]
 * @param {Number}   [options.friction=0.3]       Friction coefficient.
 * @param {Number}   [options.restitution=0]      Restitution coefficient aka "bounciness".
 * @param {Number}   [options.stiffness]          ContactEquation stiffness.
 * @param {Number}   [options.relaxation]         ContactEquation relaxation.
 * @param {Number}   [options.frictionStiffness]  FrictionEquation stiffness.
 * @param {Number}   [options.frictionRelaxation] FrictionEquation relaxation.
 * @param {Number}   [options.surfaceVelocity=0]  Surface velocity.
 * @author schteppe
 */
function ContactMaterial(materialA, materialB, options){
    options = options || {};

    if(!(materialA instanceof Material_1) || !(materialB instanceof Material_1)){
        throw new Error("First two arguments must be Material instances.");
    }

    /**
     * The contact material identifier
     * @property id
     * @type {Number}
     */
    this.id = ContactMaterial.idCounter++;

    /**
     * First material participating in the contact material
     * @property materialA
     * @type {Material}
     */
    this.materialA = materialA;

    /**
     * Second material participating in the contact material
     * @property materialB
     * @type {Material}
     */
    this.materialB = materialB;

    /**
     * Friction coefficient to use in the contact of these two materials. Friction = 0 will make the involved objects super slippery, and friction = 1 will make it much less slippery. A friction coefficient larger than 1 will allow for very large friction forces, which can be convenient for preventing car tires not slip on the ground.
     * @property friction
     * @type {Number}
     * @default 0.3
     */
    this.friction = typeof(options.friction) !== "undefined" ? Number(options.friction) : 0.3;

    /**
     * Restitution, or "bounciness" to use in the contact of these two materials. A restitution of 0 will make no bounce, while restitution=1 will approximately bounce back with the same velocity the object came with.
     * @property restitution
     * @type {Number}
     * @default 0
     */
    this.restitution = typeof(options.restitution) !== "undefined" ? Number(options.restitution) : 0;

    /**
     * Hardness of the contact. Less stiffness will make the objects penetrate more, and will make the contact act more like a spring than a contact force. Default value is {{#crossLink "Equation/DEFAULT_STIFFNESS:property"}}Equation.DEFAULT_STIFFNESS{{/crossLink}}.
     * @property stiffness
     * @type {Number}
     */
    this.stiffness = typeof(options.stiffness) !== "undefined" ? Number(options.stiffness) : Equation_1.DEFAULT_STIFFNESS;

    /**
     * Relaxation of the resulting ContactEquation that this ContactMaterial generate. Default value is {{#crossLink "Equation/DEFAULT_RELAXATION:property"}}Equation.DEFAULT_RELAXATION{{/crossLink}}.
     * @property relaxation
     * @type {Number}
     */
    this.relaxation = typeof(options.relaxation) !== "undefined" ? Number(options.relaxation) : Equation_1.DEFAULT_RELAXATION;

    /**
     * Stiffness of the resulting friction force. For most cases, the value of this property should be a large number. I cannot think of any case where you would want less frictionStiffness. Default value is {{#crossLink "Equation/DEFAULT_STIFFNESS:property"}}Equation.DEFAULT_STIFFNESS{{/crossLink}}.
     * @property frictionStiffness
     * @type {Number}
     */
    this.frictionStiffness = typeof(options.frictionStiffness) !== "undefined" ? Number(options.frictionStiffness) : Equation_1.DEFAULT_STIFFNESS;

    /**
     * Relaxation of the resulting friction force. The default value should be good for most simulations. Default value is {{#crossLink "Equation/DEFAULT_RELAXATION:property"}}Equation.DEFAULT_RELAXATION{{/crossLink}}.
     * @property frictionRelaxation
     * @type {Number}
     */
    this.frictionRelaxation = typeof(options.frictionRelaxation) !== "undefined" ? Number(options.frictionRelaxation)  : Equation_1.DEFAULT_RELAXATION;

    /**
     * Will add surface velocity to this material. If bodyA rests on top if bodyB, and the surface velocity is positive, bodyA will slide to the right.
     * @property {Number} surfaceVelocity
     * @default 0
     */
    this.surfaceVelocity = typeof(options.surfaceVelocity) !== "undefined" ? Number(options.surfaceVelocity) : 0;

    /**
     * Offset to be set on ContactEquations. A positive value will make the bodies penetrate more into each other. Can be useful in scenes where contacts need to be more persistent, for example when stacking. Aka "cure for nervous contacts".
     * @property contactSkinSize
     * @type {Number}
     */
    this.contactSkinSize = 0.005;
}

ContactMaterial.idCounter = 0;

var DistanceConstraint_1 = DistanceConstraint;

/**
 * Constraint that tries to keep the distance between two bodies constant.
 *
 * @class DistanceConstraint
 * @constructor
 * @author schteppe
 * @param {Body} bodyA
 * @param {Body} bodyB
 * @param {object} [options]
 * @param {number} [options.distance] The distance to keep between the anchor points. Defaults to the current distance between the bodies.
 * @param {Array} [options.localAnchorA] The anchor point for bodyA, defined locally in bodyA frame. Defaults to [0,0].
 * @param {Array} [options.localAnchorB] The anchor point for bodyB, defined locally in bodyB frame. Defaults to [0,0].
 * @param {object} [options.maxForce=Number.MAX_VALUE] Maximum force to apply.
 * @extends Constraint
 *
 * @example
 *     // If distance is not given as an option, then the current distance between the bodies is used.
 *     // In this example, the bodies will be constrained to have a distance of 2 between their centers.
 *     var bodyA = new Body({ mass: 1, position: [-1, 0] });
 *     var bodyB = new Body({ mass: 1, position: [1, 0] });
 *     var constraint = new DistanceConstraint(bodyA, bodyB);
 *     world.addConstraint(constraint);
 *
 * @example
 *     // Manually set the distance and anchors
 *     var constraint = new DistanceConstraint(bodyA, bodyB, {
 *         distance: 1,          // Distance to keep between the points
 *         localAnchorA: [1, 0], // Point on bodyA
 *         localAnchorB: [-1, 0] // Point on bodyB
 *     });
 *     world.addConstraint(constraint);
 */
function DistanceConstraint(bodyA,bodyB,options){
    options = Utils_1.defaults(options,{
        localAnchorA:[0,0],
        localAnchorB:[0,0]
    });

    Constraint_1.call(this,bodyA,bodyB,Constraint_1.DISTANCE,options);

    /**
     * Local anchor in body A.
     * @property localAnchorA
     * @type {Array}
     */
    this.localAnchorA = vec2_1.fromValues(options.localAnchorA[0], options.localAnchorA[1]);

    /**
     * Local anchor in body B.
     * @property localAnchorB
     * @type {Array}
     */
    this.localAnchorB = vec2_1.fromValues(options.localAnchorB[0], options.localAnchorB[1]);

    var localAnchorA = this.localAnchorA;
    var localAnchorB = this.localAnchorB;

    /**
     * The distance to keep.
     * @property distance
     * @type {Number}
     */
    this.distance = 0;

    if(typeof(options.distance) === 'number'){
        this.distance = options.distance;
    } else {
        // Use the current world distance between the world anchor points.
        var worldAnchorA = vec2_1.create(),
            worldAnchorB = vec2_1.create(),
            r = vec2_1.create();

        // Transform local anchors to world
        vec2_1.rotate(worldAnchorA, localAnchorA, bodyA.angle);
        vec2_1.rotate(worldAnchorB, localAnchorB, bodyB.angle);

        vec2_1.add(r, bodyB.position, worldAnchorB);
        vec2_1.sub(r, r, worldAnchorA);
        vec2_1.sub(r, r, bodyA.position);

        this.distance = vec2_1.length(r);
    }

    var maxForce;
    if(typeof(options.maxForce)==="undefined" ){
        maxForce = Number.MAX_VALUE;
    } else {
        maxForce = options.maxForce;
    }

    var normal = new Equation_1(bodyA,bodyB,-maxForce,maxForce); // Just in the normal direction
    this.equations = [ normal ];

    /**
     * Max force to apply.
     * @property {number} maxForce
     */
    this.maxForce = maxForce;

    // g = (xi - xj).dot(n)
    // dg/dt = (vi - vj).dot(n) = G*W = [n 0 -n 0] * [vi wi vj wj]'

    // ...and if we were to include offset points:
    // g =
    //      (xj + rj - xi - ri).dot(n) - distance
    //
    // dg/dt =
    //      (vj + wj x rj - vi - wi x ri).dot(n) =
    //      { term 2 is near zero } =
    //      [-n   -ri x n   n   rj x n] * [vi wi vj wj]' =
    //      G * W
    //
    // => G = [-n -rixn n rjxn]

    var r = vec2_1.create();
    var ri = vec2_1.create(); // worldAnchorA
    var rj = vec2_1.create(); // worldAnchorB
    var that = this;
    normal.computeGq = function(){
        var bodyA = this.bodyA,
            bodyB = this.bodyB,
            xi = bodyA.position,
            xj = bodyB.position;

        // Transform local anchors to world
        vec2_1.rotate(ri, localAnchorA, bodyA.angle);
        vec2_1.rotate(rj, localAnchorB, bodyB.angle);

        vec2_1.add(r, xj, rj);
        vec2_1.sub(r, r, ri);
        vec2_1.sub(r, r, xi);

        //vec2.sub(r, bodyB.position, bodyA.position);
        return vec2_1.length(r) - that.distance;
    };

    // Make the contact constraint bilateral
    this.setMaxForce(maxForce);

    /**
     * If the upper limit is enabled or not.
     * @property {Boolean} upperLimitEnabled
     */
    this.upperLimitEnabled = false;

    /**
     * The upper constraint limit.
     * @property {number} upperLimit
     */
    this.upperLimit = 1;

    /**
     * If the lower limit is enabled or not.
     * @property {Boolean} lowerLimitEnabled
     */
    this.lowerLimitEnabled = false;

    /**
     * The lower constraint limit.
     * @property {number} lowerLimit
     */
    this.lowerLimit = 0;

    /**
     * Current constraint position. This is equal to the current distance between the world anchor points.
     * @property {number} position
     */
    this.position = 0;
}
DistanceConstraint.prototype = new Constraint_1();
DistanceConstraint.prototype.constructor = DistanceConstraint;

/**
 * Update the constraint equations. Should be done if any of the bodies changed position, before solving.
 * @method update
 */
var n = vec2_1.create();
var ri = vec2_1.create(); // worldAnchorA
var rj = vec2_1.create(); // worldAnchorB
DistanceConstraint.prototype.update = function(){
    var normal = this.equations[0],
        bodyA = this.bodyA,
        bodyB = this.bodyB,
        distance = this.distance,
        xi = bodyA.position,
        xj = bodyB.position,
        normalEquation = this.equations[0],
        G = normal.G;

    // Transform local anchors to world
    vec2_1.rotate(ri, this.localAnchorA, bodyA.angle);
    vec2_1.rotate(rj, this.localAnchorB, bodyB.angle);

    // Get world anchor points and normal
    vec2_1.add(n, xj, rj);
    vec2_1.sub(n, n, ri);
    vec2_1.sub(n, n, xi);
    this.position = vec2_1.length(n);

    var violating = false;
    if(this.upperLimitEnabled){
        if(this.position > this.upperLimit){
            normalEquation.maxForce = 0;
            normalEquation.minForce = -this.maxForce;
            this.distance = this.upperLimit;
            violating = true;
        }
    }

    if(this.lowerLimitEnabled){
        if(this.position < this.lowerLimit){
            normalEquation.maxForce = this.maxForce;
            normalEquation.minForce = 0;
            this.distance = this.lowerLimit;
            violating = true;
        }
    }

    if((this.lowerLimitEnabled || this.upperLimitEnabled) && !violating){
        // No constraint needed.
        normalEquation.enabled = false;
        return;
    }

    normalEquation.enabled = true;

    vec2_1.normalize(n,n);

    // Caluclate cross products
    var rixn = vec2_1.crossLength(ri, n),
        rjxn = vec2_1.crossLength(rj, n);

    // G = [-n -rixn n rjxn]
    G[0] = -n[0];
    G[1] = -n[1];
    G[2] = -rixn;
    G[3] = n[0];
    G[4] = n[1];
    G[5] = rjxn;
};

/**
 * Set the max force to be used
 * @method setMaxForce
 * @param {Number} maxForce
 */
DistanceConstraint.prototype.setMaxForce = function(maxForce){
    var normal = this.equations[0];
    normal.minForce = -maxForce;
    normal.maxForce =  maxForce;
};

/**
 * Get the max force
 * @method getMaxForce
 * @return {Number}
 */
DistanceConstraint.prototype.getMaxForce = function(){
    var normal = this.equations[0];
    return normal.maxForce;
};

var FrictionEquation_1 = FrictionEquation;

/**
 * Constrains the slipping in a contact along a tangent
 *
 * @class FrictionEquation
 * @constructor
 * @param {Body} bodyA
 * @param {Body} bodyB
 * @param {Number} slipForce
 * @extends Equation
 */
function FrictionEquation(bodyA, bodyB, slipForce){
    Equation_1.call(this, bodyA, bodyB, -slipForce, slipForce);

    /**
     * Relative vector from center of body A to the contact point, world oriented.
     * @property contactPointA
     * @type {Array}
     */
    this.contactPointA = vec2_1.create();

    /**
     * Relative vector from center of body B to the contact point, world oriented.
     * @property contactPointB
     * @type {Array}
     */
    this.contactPointB = vec2_1.create();

    /**
     * Tangent vector that the friction force will act along. World oriented.
     * @property t
     * @type {Array}
     */
    this.t = vec2_1.create();

    /**
     * ContactEquations connected to this friction equation. The contact equations can be used to rescale the max force for the friction. If more than one contact equation is given, then the max force can be set to the average.
     * @property contactEquations
     * @type {ContactEquation}
     */
    this.contactEquations = [];

    /**
     * The shape in body i that triggered this friction.
     * @property shapeA
     * @type {Shape}
     * @todo Needed? The shape can be looked up via contactEquation.shapeA...
     */
    this.shapeA = null;

    /**
     * The shape in body j that triggered this friction.
     * @property shapeB
     * @type {Shape}
     * @todo Needed? The shape can be looked up via contactEquation.shapeB...
     */
    this.shapeB = null;

    /**
     * The friction coefficient to use.
     * @property frictionCoefficient
     * @type {Number}
     */
    this.frictionCoefficient = 0.3;
}
FrictionEquation.prototype = new Equation_1();
FrictionEquation.prototype.constructor = FrictionEquation;

/**
 * Set the slipping condition for the constraint. The friction force cannot be
 * larger than this value.
 * @method setSlipForce
 * @param  {Number} slipForce
 */
FrictionEquation.prototype.setSlipForce = function(slipForce){
    this.maxForce = slipForce;
    this.minForce = -slipForce;
};

/**
 * Get the max force for the constraint.
 * @method getSlipForce
 * @return {Number}
 */
FrictionEquation.prototype.getSlipForce = function(){
    return this.maxForce;
};

FrictionEquation.prototype.computeB = function(a,b,h){
    var bi = this.bodyA,
        bj = this.bodyB,
        ri = this.contactPointA,
        rj = this.contactPointB,
        t = this.t,
        G = this.G;

    // G = [-t -rixt t rjxt]
    // And remember, this is a pure velocity constraint, g is always zero!
    G[0] = -t[0];
    G[1] = -t[1];
    G[2] = -vec2_1.crossLength(ri,t);
    G[3] = t[0];
    G[4] = t[1];
    G[5] = vec2_1.crossLength(rj,t);

    var GW = this.computeGW(),
        GiMf = this.computeGiMf();

    var B = /* - g * a  */ - GW * b - h*GiMf;

    return B;
};

var FrictionEquationPool_1 = FrictionEquationPool;

/**
 * @class
 */
function FrictionEquationPool() {
	Pool_1.apply(this, arguments);
}
FrictionEquationPool.prototype = new Pool_1();
FrictionEquationPool.prototype.constructor = FrictionEquationPool;

/**
 * @method create
 * @return {FrictionEquation}
 */
FrictionEquationPool.prototype.create = function () {
	return new FrictionEquation_1();
};

/**
 * @method destroy
 * @param {FrictionEquation} equation
 * @return {FrictionEquationPool}
 */
FrictionEquationPool.prototype.destroy = function (equation) {
	equation.bodyA = equation.bodyB = null;
	return this;
};

var GearConstraint_1 = GearConstraint;

/**
 * Constrains the angle of two bodies to each other to be equal. If a gear ratio is not one, the angle of bodyA must be a multiple of the angle of bodyB.
 * @class GearConstraint
 * @constructor
 * @author schteppe
 * @param {Body}            bodyA
 * @param {Body}            bodyB
 * @param {Object}          [options]
 * @param {Number}          [options.angle=0] Relative angle between the bodies. Will be set to the current angle between the bodies (the gear ratio is accounted for).
 * @param {Number}          [options.ratio=1] Gear ratio.
 * @param {Number}          [options.maxTorque] Maximum torque to apply.
 * @extends Constraint
 *
 * @example
 *     var constraint = new GearConstraint(bodyA, bodyB);
 *     world.addConstraint(constraint);
 *
 * @example
 *     var constraint = new GearConstraint(bodyA, bodyB, {
 *         ratio: 2,
 *         maxTorque: 1000
 *     });
 *     world.addConstraint(constraint);
 */
function GearConstraint(bodyA, bodyB, options){
    options = options || {};

    Constraint_1.call(this, bodyA, bodyB, Constraint_1.GEAR, options);

    /**
     * The gear ratio.
     * @property ratio
     * @type {Number}
     */
    this.ratio = options.ratio !== undefined ? options.ratio : 1;

    /**
     * The relative angle
     * @property angle
     * @type {Number}
     */
    this.angle = options.angle !== undefined ? options.angle : bodyB.angle - this.ratio * bodyA.angle;

    // Send same parameters to the equation
    options.angle = this.angle;
    options.ratio = this.ratio;

    this.equations = [
        new AngleLockEquation_1(bodyA,bodyB,options),
    ];

    // Set max torque
    if(options.maxTorque !== undefined){
        this.setMaxTorque(options.maxTorque);
    }
}
GearConstraint.prototype = new Constraint_1();
GearConstraint.prototype.constructor = GearConstraint;

GearConstraint.prototype.update = function(){
    var eq = this.equations[0];
    if(eq.ratio !== this.ratio){
        eq.setRatio(this.ratio);
    }
    eq.angle = this.angle;
};

/**
 * Set the max torque for the constraint.
 * @method setMaxTorque
 * @param {Number} torque
 */
GearConstraint.prototype.setMaxTorque = function(torque){
    this.equations[0].setMaxTorque(torque);
};

/**
 * Get the max torque for the constraint.
 * @method getMaxTorque
 * @return {Number}
 */
GearConstraint.prototype.getMaxTorque = function(torque){
    return this.equations[0].maxForce;
};

var Solver_1 = Solver;

/**
 * Base class for constraint solvers.
 * @class Solver
 * @constructor
 * @extends EventEmitter
 */
function Solver(options,type){
    options = options || {};

    EventEmitter_1.call(this);

    this.type = type;

    /**
     * Current equations in the solver.
     *
     * @property equations
     * @type {Array}
     */
    this.equations = [];

    /**
     * Function that is used to sort all equations before each solve.
     * @property equationSortFunction
     * @type {function|boolean}
     */
    this.equationSortFunction = options.equationSortFunction || false;
}
Solver.prototype = new EventEmitter_1();
Solver.prototype.constructor = Solver;

/**
 * Method to be implemented in each subclass
 * @method solve
 * @param  {Number} dt
 * @param  {World} world
 */
Solver.prototype.solve = function(dt,world){
    throw new Error("Solver.solve should be implemented by subclasses!");
};

var mockWorld = {bodies:[]};

/**
 * Solves all constraints in an island.
 * @method solveIsland
 * @param  {Number} dt
 * @param  {Island} island
 */
Solver.prototype.solveIsland = function(dt,island){

    this.removeAllEquations();

    if(island.equations.length){
        // Add equations to solver
        this.addEquations(island.equations);
        mockWorld.bodies.length = 0;
        island.getBodies(mockWorld.bodies);

        // Solve
        if(mockWorld.bodies.length){
            this.solve(dt,mockWorld);
        }
    }
};

/**
 * Sort all equations using the .equationSortFunction. Should be called by subclasses before solving.
 * @method sortEquations
 */
Solver.prototype.sortEquations = function(){
    if(this.equationSortFunction){
        this.equations.sort(this.equationSortFunction);
    }
};

/**
 * Add an equation to be solved.
 *
 * @method addEquation
 * @param {Equation} eq
 */
Solver.prototype.addEquation = function(eq){
    if(eq.enabled){
        this.equations.push(eq);
    }
};

/**
 * Add equations. Same as .addEquation, but this time the argument is an array of Equations
 *
 * @method addEquations
 * @param {Array} eqs
 */
Solver.prototype.addEquations = function(eqs){
    //Utils.appendArray(this.equations,eqs);
    for(var i=0, N=eqs.length; i!==N; i++){
        var eq = eqs[i];
        if(eq.enabled){
            this.equations.push(eq);
        }
    }
};

/**
 * Remove an equation.
 *
 * @method removeEquation
 * @param {Equation} eq
 */
Solver.prototype.removeEquation = function(eq){
    var i = this.equations.indexOf(eq);
    if(i !== -1){
        this.equations.splice(i,1);
    }
};

/**
 * Remove all currently added equations.
 *
 * @method removeAllEquations
 */
Solver.prototype.removeAllEquations = function(){
    this.equations.length=0;
};

Solver.GS = 1;
Solver.ISLAND = 2;

var GSSolver_1 = GSSolver;

/**
 * Iterative Gauss-Seidel constraint equation solver.
 *
 * @class GSSolver
 * @constructor
 * @extends Solver
 * @param {Object} [options]
 * @param {Number} [options.iterations=10]
 * @param {Number} [options.tolerance=0]
 */
function GSSolver(options){
    Solver_1.call(this,options,Solver_1.GS);
    options = options || {};

    /**
     * The max number of iterations to do when solving. More gives better results, but is more expensive.
     * @property iterations
     * @type {Number}
     */
    this.iterations = options.iterations || 10;

    /**
     * The error tolerance, per constraint. If the total error is below this limit, the solver will stop iterating. Set to zero for as good solution as possible, but to something larger than zero to make computations faster.
     * @property tolerance
     * @type {Number}
     * @default 1e-7
     */
    this.tolerance = options.tolerance || 1e-7;

    this.arrayStep = 30;
    this.lambda = new Utils_1.ARRAY_TYPE(this.arrayStep);
    this.Bs =     new Utils_1.ARRAY_TYPE(this.arrayStep);
    this.invCs =  new Utils_1.ARRAY_TYPE(this.arrayStep);

    /**
     * Set to true to set all right hand side terms to zero when solving. Can be handy for a few applications.
     * @property useZeroRHS
     * @type {Boolean}
     * @todo Remove, not used
     */
    this.useZeroRHS = false;

    /**
     * Number of solver iterations that are used to approximate normal forces used for friction (F_friction = mu * F_normal). These friction forces will override any other friction forces that are set. If you set frictionIterations = 0, then this feature will be disabled.
     *
     * Use only frictionIterations > 0 if the approximated normal force (F_normal = mass * gravity) is not good enough. Examples of where it can happen is in space games where gravity is zero, or in tall stacks where the normal force is large at bottom but small at top.
     *
     * @property frictionIterations
     * @type {Number}
     * @default 0
     */
    this.frictionIterations = options.frictionIterations !== undefined ? 0 : options.frictionIterations;

    /**
     * The number of iterations that were made during the last solve. If .tolerance is zero, this value will always be equal to .iterations, but if .tolerance is larger than zero, and the solver can quit early, then this number will be somewhere between 1 and .iterations.
     * @property {Number} usedIterations
     */
    this.usedIterations = 0;
}
GSSolver.prototype = new Solver_1();
GSSolver.prototype.constructor = GSSolver;

function setArrayZero(array){
    var l = array.length;
    while(l--){
        array[l] = +0.0;
    }
}

/**
 * Solve the system of equations
 * @method solve
 * @param  {Number}  h       Time step
 * @param  {World}   world    World to solve
 */
GSSolver.prototype.solve = function(h, world){

    this.sortEquations();

    var iter = 0,
        maxIter = this.iterations,
        maxFrictionIter = this.frictionIterations,
        equations = this.equations,
        Neq = equations.length,
        tolSquared = Math.pow(this.tolerance*Neq, 2),
        bodies = world.bodies,
        Nbodies = world.bodies.length,
        add = vec2_1.add,
        set = vec2_1.set,
        useZeroRHS = this.useZeroRHS,
        lambda = this.lambda;

    this.usedIterations = 0;

    if(Neq){
        for(var i=0; i!==Nbodies; i++){
            var b = bodies[i];

            // Update solve mass
            b.updateSolveMassProperties();
        }
    }

    // Things that does not change during iteration can be computed once
    if(lambda.length < Neq){
        lambda = this.lambda =  new Utils_1.ARRAY_TYPE(Neq + this.arrayStep);
        this.Bs =               new Utils_1.ARRAY_TYPE(Neq + this.arrayStep);
        this.invCs =            new Utils_1.ARRAY_TYPE(Neq + this.arrayStep);
    }
    setArrayZero(lambda);
    var invCs = this.invCs,
        Bs = this.Bs,
        lambda = this.lambda;

    for(var i=0; i!==equations.length; i++){
        var c = equations[i];
        if(c.timeStep !== h || c.needsUpdate){
            c.timeStep = h;
            c.update();
        }
        Bs[i] =     c.computeB(c.a,c.b,h);
        invCs[i] =  c.computeInvC(c.epsilon);
    }

    var c, deltalambdaTot,i,j;

    if(Neq !== 0){

        for(i=0; i!==Nbodies; i++){
            var b = bodies[i];

            // Reset vlambda
            b.resetConstraintVelocity();
        }

        if(maxFrictionIter){
            // Iterate over contact equations to get normal forces
            for(iter=0; iter!==maxFrictionIter; iter++){

                // Accumulate the total error for each iteration.
                deltalambdaTot = 0.0;

                for(j=0; j!==Neq; j++){
                    c = equations[j];

                    var deltalambda = GSSolver.iterateEquation(j,c,c.epsilon,Bs,invCs,lambda,useZeroRHS,h,iter);
                    deltalambdaTot += Math.abs(deltalambda);
                }

                this.usedIterations++;

                // If the total error is small enough - stop iterate
                if(deltalambdaTot*deltalambdaTot <= tolSquared){
                    break;
                }
            }

            GSSolver.updateMultipliers(equations, lambda, 1/h);

            // Set computed friction force
            for(j=0; j!==Neq; j++){
                var eq = equations[j];
                if(eq instanceof FrictionEquation_1){
                    var f = 0.0;
                    for(var k=0; k!==eq.contactEquations.length; k++){
                        f += eq.contactEquations[k].multiplier;
                    }
                    f *= eq.frictionCoefficient / eq.contactEquations.length;
                    eq.maxForce =  f;
                    eq.minForce = -f;
                }
            }
        }

        // Iterate over all equations
        for(iter=0; iter!==maxIter; iter++){

            // Accumulate the total error for each iteration.
            deltalambdaTot = 0.0;

            for(j=0; j!==Neq; j++){
                c = equations[j];

                var deltalambda = GSSolver.iterateEquation(j,c,c.epsilon,Bs,invCs,lambda,useZeroRHS,h,iter);
                deltalambdaTot += Math.abs(deltalambda);
            }

            this.usedIterations++;

            // If the total error is small enough - stop iterate
            if(deltalambdaTot*deltalambdaTot <= tolSquared){
                break;
            }
        }

        // Add result to velocity
        for(i=0; i!==Nbodies; i++){
            bodies[i].addConstraintVelocity();
        }

        GSSolver.updateMultipliers(equations, lambda, 1/h);
    }
};

// Sets the .multiplier property of each equation
GSSolver.updateMultipliers = function(equations, lambda, invDt){
    // Set the .multiplier property of each equation
    var l = equations.length;
    while(l--){
        equations[l].multiplier = lambda[l] * invDt;
    }
};

GSSolver.iterateEquation = function(j,eq,eps,Bs,invCs,lambda,useZeroRHS,dt,iter){
    // Compute iteration
    var B = Bs[j],
        invC = invCs[j],
        lambdaj = lambda[j],
        GWlambda = eq.computeGWlambda();

    var maxForce = eq.maxForce,
        minForce = eq.minForce;

    if(useZeroRHS){
        B = 0;
    }

    var deltalambda = invC * ( B - GWlambda - eps * lambdaj );

    // Clamp if we are not within the min/max interval
    var lambdaj_plus_deltalambda = lambdaj + deltalambda;
    if(lambdaj_plus_deltalambda < minForce*dt){
        deltalambda = minForce*dt - lambdaj;
    } else if(lambdaj_plus_deltalambda > maxForce*dt){
        deltalambda = maxForce*dt - lambdaj;
    }
    lambda[j] += deltalambda;
    eq.addToWlambda(deltalambda);

    return deltalambda;
};

var Heightfield_1 = Heightfield;

/**
 * Heightfield shape class. Height data is given as an array. These data points are spread out evenly with a distance "elementWidth".
 * @class Heightfield
 * @extends Shape
 * @constructor
 * @param {object} [options] (Note that this options object will be passed on to the {{#crossLink "Shape"}}{{/crossLink}} constructor.)
 * @param {array} [options.heights] An array of Y values that will be used to construct the terrain.
 * @param {Number} [options.minValue] Minimum value of the data points in the data array. Will be computed automatically if not given.
 * @param {Number} [options.maxValue] Maximum value.
 * @param {Number} [options.elementWidth=0.1] World spacing between the data points in X direction.
 *
 * @example
 *     // Generate some height data (y-values).
 *     var heights = [];
 *     for(var i = 0; i < 1000; i++){
 *         var y = 0.5 * Math.cos(0.2 * i);
 *         heights.push(y);
 *     }
 *
 *     // Create the heightfield shape
 *     var heightfieldShape = new Heightfield({
 *         heights: heights,
 *         elementWidth: 1 // Distance between the data points in X direction
 *     });
 *     var heightfieldBody = new Body();
 *     heightfieldBody.addShape(heightfieldShape);
 *     world.addBody(heightfieldBody);
 *
 * @todo Should use a scale property with X and Y direction instead of just elementWidth
 */
function Heightfield(options){
    if(Array.isArray(arguments[0])){
        options = {
            heights: arguments[0]
        };

        if(typeof(arguments[1]) === 'object'){
            for(var key in arguments[1]){
                options[key] = arguments[1][key];
            }
        }

        console.warn('The Heightfield constructor signature has changed. Please use the following format: new Heightfield({ heights: [...], ... })');
    }
    options = options || {};

    /**
     * An array of numbers, or height values, that are spread out along the x axis.
     * @property {array} heights
     */
    this.heights = options.heights ? options.heights.slice(0) : [];

    /**
     * Max value of the heights
     * @property {number} maxValue
     */
    this.maxValue = options.maxValue || null;

    /**
     * Max value of the heights
     * @property {number} minValue
     */
    this.minValue = options.minValue || null;

    /**
     * The width of each element
     * @property {number} elementWidth
     */
    this.elementWidth = options.elementWidth || 0.1;

    if(options.maxValue === undefined || options.minValue === undefined){
        this.updateMaxMinValues();
    }

    options.type = Shape_1.HEIGHTFIELD;
    Shape_1.call(this, options);
}
Heightfield.prototype = new Shape_1();
Heightfield.prototype.constructor = Heightfield;

/**
 * Update the .minValue and the .maxValue
 * @method updateMaxMinValues
 */
Heightfield.prototype.updateMaxMinValues = function(){
    var data = this.heights;
    var maxValue = data[0];
    var minValue = data[0];
    for(var i=0; i !== data.length; i++){
        var v = data[i];
        if(v > maxValue){
            maxValue = v;
        }
        if(v < minValue){
            minValue = v;
        }
    }
    this.maxValue = maxValue;
    this.minValue = minValue;
};

/**
 * @method computeMomentOfInertia
 * @param  {Number} mass
 * @return {Number}
 */
Heightfield.prototype.computeMomentOfInertia = function(mass){
    return Number.MAX_VALUE;
};

Heightfield.prototype.updateBoundingRadius = function(){
    this.boundingRadius = Number.MAX_VALUE;
};

Heightfield.prototype.updateArea = function(){
    var data = this.heights,
        area = 0;
    for(var i=0; i<data.length-1; i++){
        area += (data[i]+data[i+1]) / 2 * this.elementWidth;
    }
    this.area = area;
};

var points = [
    vec2_1.create(),
    vec2_1.create(),
    vec2_1.create(),
    vec2_1.create()
];

/**
 * @method computeAABB
 * @param  {AABB}   out      The resulting AABB.
 * @param  {Array}  position
 * @param  {Number} angle
 */
Heightfield.prototype.computeAABB = function(out, position, angle){
    vec2_1.set(points[0], 0, this.maxValue);
    vec2_1.set(points[1], this.elementWidth * this.heights.length, this.maxValue);
    vec2_1.set(points[2], this.elementWidth * this.heights.length, this.minValue);
    vec2_1.set(points[3], 0, this.minValue);
    out.setFromPoints(points, position, angle);
};

/**
 * Get a line segment in the heightfield
 * @method getLineSegment
 * @param  {array} start Where to store the resulting start point
 * @param  {array} end Where to store the resulting end point
 * @param  {number} i
 */
Heightfield.prototype.getLineSegment = function(start, end, i){
    var data = this.heights;
    var width = this.elementWidth;
    vec2_1.set(start, i * width, data[i]);
    vec2_1.set(end, (i + 1) * width, data[i + 1]);
};

Heightfield.prototype.getSegmentIndex = function(position){
    return Math.floor(position[0] / this.elementWidth);
};

Heightfield.prototype.getClampedSegmentIndex = function(position){
    var i = this.getSegmentIndex(position);
    i = Math.min(this.heights.length, Math.max(i, 0)); // clamp
    return i;
};

var intersectHeightfield_hitPointWorld = vec2_1.create();
var intersectHeightfield_worldNormal = vec2_1.create();
var intersectHeightfield_l0 = vec2_1.create();
var intersectHeightfield_l1 = vec2_1.create();
var intersectHeightfield_localFrom = vec2_1.create();
var intersectHeightfield_localTo = vec2_1.create();
var intersectHeightfield_unit_y = vec2_1.fromValues(0,1);

/**
 * @method raycast
 * @param  {RayResult} result
 * @param  {Ray} ray
 * @param  {array} position
 * @param  {number} angle
 */
Heightfield.prototype.raycast = function(result, ray, position, angle){
    var from = ray.from;
    var to = ray.to;
    var direction = ray.direction;
    var worldNormal = intersectHeightfield_worldNormal;
    var l0 = intersectHeightfield_l0;
    var l1 = intersectHeightfield_l1;
    var localFrom = intersectHeightfield_localFrom;
    var localTo = intersectHeightfield_localTo;

    // get local ray start and end
    vec2_1.toLocalFrame(localFrom, from, position, angle);
    vec2_1.toLocalFrame(localTo, to, position, angle);

    // Get the segment range
    var i0 = this.getClampedSegmentIndex(localFrom);
    var i1 = this.getClampedSegmentIndex(localTo);
    if(i0 > i1){
        var tmp = i0;
        i0 = i1;
        i1 = tmp;
    }

    // The segments
    for(var i=0; i<this.heights.length - 1; i++){
        this.getLineSegment(l0, l1, i);
        var t = vec2_1.getLineSegmentsIntersectionFraction(localFrom, localTo, l0, l1);
        if(t >= 0){
            vec2_1.sub(worldNormal, l1, l0);
            vec2_1.rotate(worldNormal, worldNormal, angle + Math.PI / 2);
            vec2_1.normalize(worldNormal, worldNormal);
            ray.reportIntersection(result, t, worldNormal, -1);
            if(result.shouldStop(ray)){
                return;
            }
        }
    }
};

var Line_1$1 = Line$1;

/**
 * Line shape class. The line shape is along the x direction, and stretches from [-length/2, 0] to [length/2,0].
 * @class Line
 * @param {object} [options] (Note that this options object will be passed on to the {{#crossLink "Shape"}}{{/crossLink}} constructor.)
 * @param {Number} [options.length=1] The total length of the line
 * @extends Shape
 * @constructor
 */
function Line$1(options){
    if(typeof(arguments[0]) === 'number'){
        options = {
            length: arguments[0]
        };
        console.warn('The Line constructor signature has changed. Please use the following format: new Line({ length: 1, ... })');
    }
    options = options || {};

    /**
     * Length of this line
     * @property {Number} length
     * @default 1
     */
    this.length = options.length || 1;

    options.type = Shape_1.LINE;
    Shape_1.call(this, options);
}
Line$1.prototype = new Shape_1();
Line$1.prototype.constructor = Line$1;

Line$1.prototype.computeMomentOfInertia = function(mass){
    return mass * Math.pow(this.length,2) / 12;
};

Line$1.prototype.updateBoundingRadius = function(){
    this.boundingRadius = this.length/2;
};

var points$1 = [vec2_1.create(),vec2_1.create()];

/**
 * @method computeAABB
 * @param  {AABB}   out      The resulting AABB.
 * @param  {Array}  position
 * @param  {Number} angle
 */
Line$1.prototype.computeAABB = function(out, position, angle){
    var l2 = this.length / 2;
    vec2_1.set(points$1[0], -l2,  0);
    vec2_1.set(points$1[1],  l2,  0);
    out.setFromPoints(points$1,position,angle,0);
};

var raycast_hitPoint = vec2_1.create();
var raycast_normal = vec2_1.create();
var raycast_l0 = vec2_1.create();
var raycast_l1 = vec2_1.create();
var raycast_unit_y = vec2_1.fromValues(0,1);

/**
 * @method raycast
 * @param  {RaycastResult} result
 * @param  {Ray} ray
 * @param  {number} angle
 * @param  {array} position
 */
Line$1.prototype.raycast = function(result, ray, position, angle){
    var from = ray.from;
    var to = ray.to;

    var l0 = raycast_l0;
    var l1 = raycast_l1;

    // get start and end of the line
    var halfLen = this.length / 2;
    vec2_1.set(l0, -halfLen, 0);
    vec2_1.set(l1, halfLen, 0);
    vec2_1.toGlobalFrame(l0, l0, position, angle);
    vec2_1.toGlobalFrame(l1, l1, position, angle);

    var fraction = vec2_1.getLineSegmentsIntersectionFraction(l0, l1, from, to);
    if(fraction >= 0){
        var normal = raycast_normal;
        vec2_1.rotate(normal, raycast_unit_y, angle); // todo: this should depend on which side the ray comes from
        ray.reportIntersection(result, fraction, normal, -1);
    }
};

var LockConstraint_1 = LockConstraint;

/**
 * Locks the relative position and rotation between two bodies.
 *
 * @class LockConstraint
 * @constructor
 * @author schteppe
 * @param {Body} bodyA
 * @param {Body} bodyB
 * @param {Object} [options]
 * @param {Array}  [options.localOffsetB] The offset of bodyB in bodyA's frame. If not given the offset is computed from current positions.
 * @param {number} [options.localAngleB] The angle of bodyB in bodyA's frame. If not given, the angle is computed from current angles.
 * @param {number} [options.maxForce]
 * @extends Constraint
 *
 * @example
 *     // Locks the relative position and rotation between bodyA and bodyB
 *     var constraint = new LockConstraint(bodyA, bodyB);
 *     world.addConstraint(constraint);
 */
function LockConstraint(bodyA, bodyB, options){
    options = options || {};

    Constraint_1.call(this,bodyA,bodyB,Constraint_1.LOCK,options);

    var maxForce = ( typeof(options.maxForce)==="undefined" ? Number.MAX_VALUE : options.maxForce );

    var localAngleB = options.localAngleB || 0;

    // Use 3 equations:
    // gx =   (xj - xi - l) * xhat = 0
    // gy =   (xj - xi - l) * yhat = 0
    // gr =   (xi - xj + r) * that = 0
    //
    // ...where:
    //   l is the localOffsetB vector rotated to world in bodyA frame
    //   r is the same vector but reversed and rotated from bodyB frame
    //   xhat, yhat are world axis vectors
    //   that is the tangent of r
    //
    // For the first two constraints, we get
    // G*W = (vj - vi - ldot  ) * xhat
    //     = (vj - vi - wi x l) * xhat
    //
    // Since (wi x l) * xhat = (l x xhat) * wi, we get
    // G*W = [ -1   0   (-l x xhat)  1   0   0] * [vi wi vj wj]
    //
    // The last constraint gives
    // GW = (vi - vj + wj x r) * that
    //    = [  that   0  -that  (r x t) ]

    var x =     new Equation_1(bodyA,bodyB,-maxForce,maxForce),
        y =     new Equation_1(bodyA,bodyB,-maxForce,maxForce),
        rot =   new Equation_1(bodyA,bodyB,-maxForce,maxForce);

    var l = vec2_1.create(),
        g = vec2_1.create(),
        that = this;
    x.computeGq = function(){
        vec2_1.rotate(l, that.localOffsetB, bodyA.angle);
        vec2_1.sub(g, bodyB.position, bodyA.position);
        vec2_1.sub(g, g, l);
        return g[0];
    };
    y.computeGq = function(){
        vec2_1.rotate(l, that.localOffsetB, bodyA.angle);
        vec2_1.sub(g, bodyB.position, bodyA.position);
        vec2_1.sub(g, g, l);
        return g[1];
    };
    var r = vec2_1.create(),
        t = vec2_1.create();
    rot.computeGq = function(){
        vec2_1.rotate(r, that.localOffsetB, bodyB.angle - that.localAngleB);
        vec2_1.scale(r,r,-1);
        vec2_1.sub(g,bodyA.position,bodyB.position);
        vec2_1.add(g,g,r);
        vec2_1.rotate(t,r,-Math.PI/2);
        vec2_1.normalize(t,t);
        return vec2_1.dot(g,t);
    };

    /**
     * The offset of bodyB in bodyA's frame.
     * @property {Array} localOffsetB
     */
    this.localOffsetB = vec2_1.create();
    if(options.localOffsetB){
        vec2_1.copy(this.localOffsetB, options.localOffsetB);
    } else {
        // Construct from current positions
        vec2_1.sub(this.localOffsetB, bodyB.position, bodyA.position);
        vec2_1.rotate(this.localOffsetB, this.localOffsetB, -bodyA.angle);
    }

    /**
     * The offset angle of bodyB in bodyA's frame.
     * @property {Number} localAngleB
     */
    this.localAngleB = 0;
    if(typeof(options.localAngleB) === 'number'){
        this.localAngleB = options.localAngleB;
    } else {
        // Construct
        this.localAngleB = bodyB.angle - bodyA.angle;
    }

    this.equations.push(x, y, rot);
    this.setMaxForce(maxForce);
}
LockConstraint.prototype = new Constraint_1();
LockConstraint.prototype.constructor = LockConstraint;

/**
 * Set the maximum force to be applied.
 * @method setMaxForce
 * @param {Number} force
 */
LockConstraint.prototype.setMaxForce = function(force){
    var eqs = this.equations;
    for(var i=0; i<this.equations.length; i++){
        eqs[i].maxForce =  force;
        eqs[i].minForce = -force;
    }
};

/**
 * Get the max force.
 * @method getMaxForce
 * @return {Number}
 */
LockConstraint.prototype.getMaxForce = function(){
    return this.equations[0].maxForce;
};

var l = vec2_1.create();
var r$1 = vec2_1.create();
var t = vec2_1.create();
var xAxis = vec2_1.fromValues(1,0);
var yAxis = vec2_1.fromValues(0,1);
LockConstraint.prototype.update = function(){
    var x =   this.equations[0],
        y =   this.equations[1],
        rot = this.equations[2],
        bodyA = this.bodyA,
        bodyB = this.bodyB;

    vec2_1.rotate(l,this.localOffsetB,bodyA.angle);
    vec2_1.rotate(r$1,this.localOffsetB,bodyB.angle - this.localAngleB);
    vec2_1.scale(r$1,r$1,-1);

    vec2_1.rotate(t,r$1,Math.PI/2);
    vec2_1.normalize(t,t);

    x.G[0] = -1;
    x.G[1] =  0;
    x.G[2] = -vec2_1.crossLength(l,xAxis);
    x.G[3] =  1;

    y.G[0] =  0;
    y.G[1] = -1;
    y.G[2] = -vec2_1.crossLength(l,yAxis);
    y.G[4] =  1;

    rot.G[0] =  -t[0];
    rot.G[1] =  -t[1];
    rot.G[3] =  t[0];
    rot.G[4] =  t[1];
    rot.G[5] =  vec2_1.crossLength(r$1,t);
};

var TupleDictionary_1 = TupleDictionary;

/**
 * @class TupleDictionary
 * @constructor
 */
function TupleDictionary() {

    /**
     * The data storage
     * @property data
     * @type {Object}
     */
    this.data = {};

    /**
     * Keys that are currently used.
     * @property {Array} keys
     */
    this.keys = [];
}

/**
 * Generate a key given two integers
 * @method getKey
 * @param  {number} i
 * @param  {number} j
 * @return {string}
 */
TupleDictionary.prototype.getKey = function(id1, id2) {
    id1 = id1|0;
    id2 = id2|0;

    if ( (id1|0) === (id2|0) ){
        return -1;
    }

    // valid for values < 2^16
    return ((id1|0) > (id2|0) ?
        (id1 << 16) | (id2 & 0xFFFF) :
        (id2 << 16) | (id1 & 0xFFFF))|0
        ;
};

/**
 * @method getByKey
 * @param  {Number} key
 * @return {Object}
 */
TupleDictionary.prototype.getByKey = function(key) {
    key = key|0;
    return this.data[key];
};

/**
 * @method get
 * @param  {Number} i
 * @param  {Number} j
 * @return {Number}
 */
TupleDictionary.prototype.get = function(i, j) {
    return this.data[this.getKey(i, j)];
};

/**
 * Set a value.
 * @method set
 * @param  {Number} i
 * @param  {Number} j
 * @param {Number} value
 */
TupleDictionary.prototype.set = function(i, j, value) {
    if(!value){
        throw new Error("No data!");
    }

    var key = this.getKey(i, j);

    // Check if key already exists
    if(!this.data[key]){
        this.keys.push(key);
    }

    this.data[key] = value;

    return key;
};

/**
 * Remove all data.
 * @method reset
 */
TupleDictionary.prototype.reset = function() {
    var data = this.data,
        keys = this.keys;

    var l = keys.length;
    while(l--) {
        delete data[keys[l]];
    }

    keys.length = 0;
};

/**
 * Copy another TupleDictionary. Note that all data in this dictionary will be removed.
 * @method copy
 * @param {TupleDictionary} dict The TupleDictionary to copy into this one.
 */
TupleDictionary.prototype.copy = function(dict) {
    this.reset();
    Utils_1.appendArray(this.keys, dict.keys);
    var l = dict.keys.length;
    while(l--){
        var key = dict.keys[l];
        this.data[key] = dict.data[key];
    }
};

var Box_1 = Box;

/**
 * Box shape class.
 * @class Box
 * @constructor
 * @param {object} [options] (Note that this options object will be passed on to the {{#crossLink "Shape"}}{{/crossLink}} constructor.)
 * @param {Number} [options.width=1] Total width of the box
 * @param {Number} [options.height=1] Total height of the box
 * @extends Convex
 */
function Box(options){
    if(typeof(arguments[0]) === 'number' && typeof(arguments[1]) === 'number'){
        options = {
            width: arguments[0],
            height: arguments[1]
        };
        console.warn('The Rectangle has been renamed to Box and its constructor signature has changed. Please use the following format: new Box({ width: 1, height: 1, ... })');
    }
    options = options || {};

    /**
     * Total width of the box
     * @property width
     * @type {Number}
     */
    var width = this.width = options.width || 1;

    /**
     * Total height of the box
     * @property height
     * @type {Number}
     */
    var height = this.height = options.height || 1;

    var verts = [
        vec2_1.fromValues(-width/2, -height/2),
        vec2_1.fromValues( width/2, -height/2),
        vec2_1.fromValues( width/2,  height/2),
        vec2_1.fromValues(-width/2,  height/2)
    ];
    var axes = [
        vec2_1.fromValues(1, 0),
        vec2_1.fromValues(0, 1)
    ];

    options.vertices = verts;
    options.axes = axes;
    options.type = Shape_1.BOX;
    Convex_1.call(this, options);
}
Box.prototype = new Convex_1();
Box.prototype.constructor = Box;

/**
 * Compute moment of inertia
 * @method computeMomentOfInertia
 * @param  {Number} mass
 * @return {Number}
 */
Box.prototype.computeMomentOfInertia = function(mass){
    var w = this.width,
        h = this.height;
    return mass * (h*h + w*w) / 12;
};

/**
 * Update the bounding radius
 * @method updateBoundingRadius
 */
Box.prototype.updateBoundingRadius = function(){
    var w = this.width,
        h = this.height;
    this.boundingRadius = Math.sqrt(w*w + h*h) / 2;
};

var corner1 = vec2_1.create(),
    corner2 = vec2_1.create(),
    corner3 = vec2_1.create(),
    corner4 = vec2_1.create();

/**
 * @method computeAABB
 * @param  {AABB}   out      The resulting AABB.
 * @param  {Array}  position
 * @param  {Number} angle
 */
Box.prototype.computeAABB = function(out, position, angle){
    out.setFromPoints(this.vertices,position,angle,0);
};

Box.prototype.updateArea = function(){
    this.area = this.width * this.height;
};

var sub = vec2_1.sub
,   add = vec2_1.add
,   dot = vec2_1.dot;

var Narrowphase_1 = Narrowphase;

// Temp things
var yAxis$1 = vec2_1.fromValues(0,1);

var tmp1 = vec2_1.fromValues(0,0)
,   tmp2 = vec2_1.fromValues(0,0)
,   tmp3 = vec2_1.fromValues(0,0)
,   tmp4 = vec2_1.fromValues(0,0)
,   tmp5 = vec2_1.fromValues(0,0)
,   tmp6 = vec2_1.fromValues(0,0)
,   tmp7 = vec2_1.fromValues(0,0)
,   tmp8 = vec2_1.fromValues(0,0)
,   tmp9 = vec2_1.fromValues(0,0)
,   tmp10 = vec2_1.fromValues(0,0)
,   tmp11 = vec2_1.fromValues(0,0)
,   tmp12 = vec2_1.fromValues(0,0)
,   tmp13 = vec2_1.fromValues(0,0)
,   tmp14 = vec2_1.fromValues(0,0)
,   tmp15 = vec2_1.fromValues(0,0)
,   tmp16 = vec2_1.fromValues(0,0)
,   tmp17 = vec2_1.fromValues(0,0)
,   tmp18 = vec2_1.fromValues(0,0)
,   tmpArray = [];

/**
 * Narrowphase. Creates contacts and friction given shapes and transforms.
 * @class Narrowphase
 * @constructor
 */
function Narrowphase(){

    /**
     * @property contactEquations
     * @type {Array}
     */
    this.contactEquations = [];

    /**
     * @property frictionEquations
     * @type {Array}
     */
    this.frictionEquations = [];

    /**
     * Whether to make friction equations in the upcoming contacts.
     * @property enableFriction
     * @type {Boolean}
     */
    this.enableFriction = true;

    /**
     * Whether to make equations enabled in upcoming contacts.
     * @property enabledEquations
     * @type {Boolean}
     */
    this.enabledEquations = true;

    /**
     * The friction slip force to use when creating friction equations.
     * @property slipForce
     * @type {Number}
     */
    this.slipForce = 10.0;

    /**
     * The friction value to use in the upcoming friction equations.
     * @property frictionCoefficient
     * @type {Number}
     */
    this.frictionCoefficient = 0.3;

    /**
     * Will be the .relativeVelocity in each produced FrictionEquation.
     * @property {Number} surfaceVelocity
     */
    this.surfaceVelocity = 0;

    /**
     * Keeps track of the allocated ContactEquations.
     * @property {ContactEquationPool} contactEquationPool
     *
     * @example
     *
     *     // Allocate a few equations before starting the simulation.
     *     // This way, no contact objects need to be created on the fly in the game loop.
     *     world.narrowphase.contactEquationPool.resize(1024);
     *     world.narrowphase.frictionEquationPool.resize(1024);
     */
    this.contactEquationPool = new ContactEquationPool_1({ size: 32 });

    /**
     * Keeps track of the allocated ContactEquations.
     * @property {FrictionEquationPool} frictionEquationPool
     */
    this.frictionEquationPool = new FrictionEquationPool_1({ size: 64 });

    /**
     * The restitution value to use in the next contact equations.
     * @property restitution
     * @type {Number}
     */
    this.restitution = 0;

    /**
     * The stiffness value to use in the next contact equations.
     * @property {Number} stiffness
     */
    this.stiffness = Equation_1.DEFAULT_STIFFNESS;

    /**
     * The stiffness value to use in the next contact equations.
     * @property {Number} stiffness
     */
    this.relaxation = Equation_1.DEFAULT_RELAXATION;

    /**
     * The stiffness value to use in the next friction equations.
     * @property frictionStiffness
     * @type {Number}
     */
    this.frictionStiffness = Equation_1.DEFAULT_STIFFNESS;

    /**
     * The relaxation value to use in the next friction equations.
     * @property frictionRelaxation
     * @type {Number}
     */
    this.frictionRelaxation = Equation_1.DEFAULT_RELAXATION;

    /**
     * Enable reduction of friction equations. If disabled, a box on a plane will generate 2 contact equations and 2 friction equations. If enabled, there will be only one friction equation. Same kind of simplifications are made  for all collision types.
     * @property enableFrictionReduction
     * @type {Boolean}
     * @deprecated This flag will be removed when the feature is stable enough.
     * @default true
     */
    this.enableFrictionReduction = true;

    /**
     * Keeps track of the colliding bodies last step.
     * @private
     * @property collidingBodiesLastStep
     * @type {TupleDictionary}
     */
    this.collidingBodiesLastStep = new TupleDictionary_1();

    /**
     * Contact skin size value to use in the next contact equations.
     * @property {Number} contactSkinSize
     * @default 0.01
     */
    this.contactSkinSize = 0.01;
}

var bodiesOverlap_shapePositionA = vec2_1.create();
var bodiesOverlap_shapePositionB = vec2_1.create();

/**
 * @method bodiesOverlap
 * @param  {Body} bodyA
 * @param  {Body} bodyB
 * @return {Boolean}
 * @todo shape world transforms are wrong
 */
Narrowphase.prototype.bodiesOverlap = function(bodyA, bodyB){
    var shapePositionA = bodiesOverlap_shapePositionA;
    var shapePositionB = bodiesOverlap_shapePositionB;

    // Loop over all shapes of bodyA
    for(var k=0, Nshapesi=bodyA.shapes.length; k!==Nshapesi; k++){
        var shapeA = bodyA.shapes[k];

        bodyA.toWorldFrame(shapePositionA, shapeA.position);

        // All shapes of body j
        for(var l=0, Nshapesj=bodyB.shapes.length; l!==Nshapesj; l++){
            var shapeB = bodyB.shapes[l];

            bodyB.toWorldFrame(shapePositionB, shapeB.position);

            if(this[shapeA.type | shapeB.type](
                bodyA,
                shapeA,
                shapePositionA,
                shapeA.angle + bodyA.angle,
                bodyB,
                shapeB,
                shapePositionB,
                shapeB.angle + bodyB.angle,
                true
            )){
                return true;
            }
        }
    }

    return false;
};

/**
 * Check if the bodies were in contact since the last reset().
 * @method collidedLastStep
 * @param  {Body} bodyA
 * @param  {Body} bodyB
 * @return {Boolean}
 */
Narrowphase.prototype.collidedLastStep = function(bodyA, bodyB){
    var id1 = bodyA.id|0,
        id2 = bodyB.id|0;
    return !!this.collidingBodiesLastStep.get(id1, id2);
};

/**
 * Throws away the old equations and gets ready to create new
 * @method reset
 */
Narrowphase.prototype.reset = function(){
    this.collidingBodiesLastStep.reset();

    var eqs = this.contactEquations;
    var l = eqs.length;
    while(l--){
        var eq = eqs[l],
            id1 = eq.bodyA.id,
            id2 = eq.bodyB.id;
        this.collidingBodiesLastStep.set(id1, id2, true);
    }

    var ce = this.contactEquations,
        fe = this.frictionEquations;
    for(var i=0; i<ce.length; i++){
        this.contactEquationPool.release(ce[i]);
    }
    for(var i=0; i<fe.length; i++){
        this.frictionEquationPool.release(fe[i]);
    }

    // Reset
    this.contactEquations.length = this.frictionEquations.length = 0;
};

/**
 * Creates a ContactEquation, either by reusing an existing object or creating a new one.
 * @method createContactEquation
 * @param  {Body} bodyA
 * @param  {Body} bodyB
 * @return {ContactEquation}
 */
Narrowphase.prototype.createContactEquation = function(bodyA, bodyB, shapeA, shapeB){
    var c = this.contactEquationPool.get();
    c.bodyA = bodyA;
    c.bodyB = bodyB;
    c.shapeA = shapeA;
    c.shapeB = shapeB;
    c.restitution = this.restitution;
    c.firstImpact = !this.collidedLastStep(bodyA,bodyB);
    c.stiffness = this.stiffness;
    c.relaxation = this.relaxation;
    c.needsUpdate = true;
    c.enabled = this.enabledEquations;
    c.offset = this.contactSkinSize;

    return c;
};

/**
 * Creates a FrictionEquation, either by reusing an existing object or creating a new one.
 * @method createFrictionEquation
 * @param  {Body} bodyA
 * @param  {Body} bodyB
 * @return {FrictionEquation}
 */
Narrowphase.prototype.createFrictionEquation = function(bodyA, bodyB, shapeA, shapeB){
    var c = this.frictionEquationPool.get();
    c.bodyA = bodyA;
    c.bodyB = bodyB;
    c.shapeA = shapeA;
    c.shapeB = shapeB;
    c.setSlipForce(this.slipForce);
    c.frictionCoefficient = this.frictionCoefficient;
    c.relativeVelocity = this.surfaceVelocity;
    c.enabled = this.enabledEquations;
    c.needsUpdate = true;
    c.stiffness = this.frictionStiffness;
    c.relaxation = this.frictionRelaxation;
    c.contactEquations.length = 0;
    return c;
};

/**
 * Creates a FrictionEquation given the data in the ContactEquation. Uses same offset vectors ri and rj, but the tangent vector will be constructed from the collision normal.
 * @method createFrictionFromContact
 * @param  {ContactEquation} contactEquation
 * @return {FrictionEquation}
 */
Narrowphase.prototype.createFrictionFromContact = function(c){
    var eq = this.createFrictionEquation(c.bodyA, c.bodyB, c.shapeA, c.shapeB);
    vec2_1.copy(eq.contactPointA, c.contactPointA);
    vec2_1.copy(eq.contactPointB, c.contactPointB);
    vec2_1.rotate90cw(eq.t, c.normalA);
    eq.contactEquations.push(c);
    return eq;
};

// Take the average N latest contact point on the plane.
Narrowphase.prototype.createFrictionFromAverage = function(numContacts){
    var c = this.contactEquations[this.contactEquations.length - 1];
    var eq = this.createFrictionEquation(c.bodyA, c.bodyB, c.shapeA, c.shapeB);
    var bodyA = c.bodyA;
    var bodyB = c.bodyB;
    vec2_1.set(eq.contactPointA, 0, 0);
    vec2_1.set(eq.contactPointB, 0, 0);
    vec2_1.set(eq.t, 0, 0);
    for(var i=0; i!==numContacts; i++){
        c = this.contactEquations[this.contactEquations.length - 1 - i];
        if(c.bodyA === bodyA){
            vec2_1.add(eq.t, eq.t, c.normalA);
            vec2_1.add(eq.contactPointA, eq.contactPointA, c.contactPointA);
            vec2_1.add(eq.contactPointB, eq.contactPointB, c.contactPointB);
        } else {
            vec2_1.sub(eq.t, eq.t, c.normalA);
            vec2_1.add(eq.contactPointA, eq.contactPointA, c.contactPointB);
            vec2_1.add(eq.contactPointB, eq.contactPointB, c.contactPointA);
        }
        eq.contactEquations.push(c);
    }

    var invNumContacts = 1/numContacts;
    vec2_1.scale(eq.contactPointA, eq.contactPointA, invNumContacts);
    vec2_1.scale(eq.contactPointB, eq.contactPointB, invNumContacts);
    vec2_1.normalize(eq.t, eq.t);
    vec2_1.rotate90cw(eq.t, eq.t);
    return eq;
};

/**
 * Convex/line narrowphase
 * @method convexLine
 * @param  {Body}       convexBody
 * @param  {Convex}     convexShape
 * @param  {Array}      convexOffset
 * @param  {Number}     convexAngle
 * @param  {Body}       lineBody
 * @param  {Line}       lineShape
 * @param  {Array}      lineOffset
 * @param  {Number}     lineAngle
 * @param {boolean}     justTest
 * @todo Implement me!
 */
Narrowphase.prototype[Shape_1.LINE | Shape_1.CONVEX] =
Narrowphase.prototype.convexLine = function(
    convexBody,
    convexShape,
    convexOffset,
    convexAngle,
    lineBody,
    lineShape,
    lineOffset,
    lineAngle,
    justTest
){
    // TODO
    if(justTest){
        return false;
    } else {
        return 0;
    }
};

/**
 * Line/box narrowphase
 * @method lineBox
 * @param  {Body}       lineBody
 * @param  {Line}       lineShape
 * @param  {Array}      lineOffset
 * @param  {Number}     lineAngle
 * @param  {Body}       boxBody
 * @param  {Box}  boxShape
 * @param  {Array}      boxOffset
 * @param  {Number}     boxAngle
 * @param  {Boolean}    justTest
 * @todo Implement me!
 */
Narrowphase.prototype[Shape_1.LINE | Shape_1.BOX] =
Narrowphase.prototype.lineBox = function(
    lineBody,
    lineShape,
    lineOffset,
    lineAngle,
    boxBody,
    boxShape,
    boxOffset,
    boxAngle,
    justTest
){
    // TODO
    if(justTest){
        return false;
    } else {
        return 0;
    }
};

function setConvexToCapsuleShapeMiddle(convexShape, capsuleShape){
    vec2_1.set(convexShape.vertices[0], -capsuleShape.length * 0.5, -capsuleShape.radius);
    vec2_1.set(convexShape.vertices[1],  capsuleShape.length * 0.5, -capsuleShape.radius);
    vec2_1.set(convexShape.vertices[2],  capsuleShape.length * 0.5,  capsuleShape.radius);
    vec2_1.set(convexShape.vertices[3], -capsuleShape.length * 0.5,  capsuleShape.radius);
}

var convexCapsule_tempRect = new Box_1({ width: 1, height: 1 }),
    convexCapsule_tempVec = vec2_1.create();

/**
 * Convex/capsule narrowphase
 * @method convexCapsule
 * @param  {Body}       convexBody
 * @param  {Convex}     convexShape
 * @param  {Array}      convexPosition
 * @param  {Number}     convexAngle
 * @param  {Body}       capsuleBody
 * @param  {Capsule}    capsuleShape
 * @param  {Array}      capsulePosition
 * @param  {Number}     capsuleAngle
 */
Narrowphase.prototype[Shape_1.CAPSULE | Shape_1.CONVEX] =
Narrowphase.prototype[Shape_1.CAPSULE | Shape_1.BOX] =
Narrowphase.prototype.convexCapsule = function(
    convexBody,
    convexShape,
    convexPosition,
    convexAngle,
    capsuleBody,
    capsuleShape,
    capsulePosition,
    capsuleAngle,
    justTest
){

    // Check the circles
    // Add offsets!
    var circlePos = convexCapsule_tempVec;
    vec2_1.set(circlePos, capsuleShape.length/2,0);
    vec2_1.rotate(circlePos,circlePos,capsuleAngle);
    vec2_1.add(circlePos,circlePos,capsulePosition);
    var result1 = this.circleConvex(capsuleBody,capsuleShape,circlePos,capsuleAngle, convexBody,convexShape,convexPosition,convexAngle, justTest, capsuleShape.radius);

    vec2_1.set(circlePos,-capsuleShape.length/2, 0);
    vec2_1.rotate(circlePos,circlePos,capsuleAngle);
    vec2_1.add(circlePos,circlePos,capsulePosition);
    var result2 = this.circleConvex(capsuleBody,capsuleShape,circlePos,capsuleAngle, convexBody,convexShape,convexPosition,convexAngle, justTest, capsuleShape.radius);

    if(justTest && (result1 || result2)){
        return true;
    }

    // Check center rect
    var r = convexCapsule_tempRect;
    setConvexToCapsuleShapeMiddle(r,capsuleShape);
    var result = this.convexConvex(convexBody,convexShape,convexPosition,convexAngle, capsuleBody,r,capsulePosition,capsuleAngle, justTest);

    return result + result1 + result2;
};

/**
 * Capsule/line narrowphase
 * @method lineCapsule
 * @param  {Body}       lineBody
 * @param  {Line}       lineShape
 * @param  {Array}      linePosition
 * @param  {Number}     lineAngle
 * @param  {Body}       capsuleBody
 * @param  {Capsule}    capsuleShape
 * @param  {Array}      capsulePosition
 * @param  {Number}     capsuleAngle
 * @todo Implement me!
 */
Narrowphase.prototype[Shape_1.CAPSULE | Shape_1.LINE] =
Narrowphase.prototype.lineCapsule = function(
    lineBody,
    lineShape,
    linePosition,
    lineAngle,
    capsuleBody,
    capsuleShape,
    capsulePosition,
    capsuleAngle,
    justTest
){
    // TODO
    if(justTest){
        return false;
    } else {
        return 0;
    }
};

var capsuleCapsule_tempVec1 = vec2_1.create();
var capsuleCapsule_tempVec2 = vec2_1.create();
var capsuleCapsule_tempRect1 = new Box_1({ width: 1, height: 1 });

/**
 * Capsule/capsule narrowphase
 * @method capsuleCapsule
 * @param  {Body}       bi
 * @param  {Capsule}    si
 * @param  {Array}      xi
 * @param  {Number}     ai
 * @param  {Body}       bj
 * @param  {Capsule}    sj
 * @param  {Array}      xj
 * @param  {Number}     aj
 */
Narrowphase.prototype[Shape_1.CAPSULE | Shape_1.CAPSULE] =
Narrowphase.prototype.capsuleCapsule = function(bi,si,xi,ai, bj,sj,xj,aj, justTest){

    var enableFrictionBefore;

    // Check the circles
    // Add offsets!
    var circlePosi = capsuleCapsule_tempVec1,
        circlePosj = capsuleCapsule_tempVec2;

    var numContacts = 0;


    // Need 4 circle checks, between all
    for(var i=0; i<2; i++){

        vec2_1.set(circlePosi,(i===0?-1:1)*si.length/2,0);
        vec2_1.rotate(circlePosi,circlePosi,ai);
        vec2_1.add(circlePosi,circlePosi,xi);

        for(var j=0; j<2; j++){

            vec2_1.set(circlePosj,(j===0?-1:1)*sj.length/2, 0);
            vec2_1.rotate(circlePosj,circlePosj,aj);
            vec2_1.add(circlePosj,circlePosj,xj);

            // Temporarily turn off friction
            if(this.enableFrictionReduction){
                enableFrictionBefore = this.enableFriction;
                this.enableFriction = false;
            }

            var result = this.circleCircle(bi,si,circlePosi,ai, bj,sj,circlePosj,aj, justTest, si.radius, sj.radius);

            if(this.enableFrictionReduction){
                this.enableFriction = enableFrictionBefore;
            }

            if(justTest && result){
                return true;
            }

            numContacts += result;
        }
    }

    if(this.enableFrictionReduction){
        // Temporarily turn off friction
        enableFrictionBefore = this.enableFriction;
        this.enableFriction = false;
    }

    // Check circles against the center boxs
    var rect = capsuleCapsule_tempRect1;
    setConvexToCapsuleShapeMiddle(rect,si);
    var result1 = this.convexCapsule(bi,rect,xi,ai, bj,sj,xj,aj, justTest);

    if(this.enableFrictionReduction){
        this.enableFriction = enableFrictionBefore;
    }

    if(justTest && result1){
        return true;
    }
    numContacts += result1;

    if(this.enableFrictionReduction){
        // Temporarily turn off friction
        var enableFrictionBefore = this.enableFriction;
        this.enableFriction = false;
    }

    setConvexToCapsuleShapeMiddle(rect,sj);
    var result2 = this.convexCapsule(bj,rect,xj,aj, bi,si,xi,ai, justTest);

    if(this.enableFrictionReduction){
        this.enableFriction = enableFrictionBefore;
    }

    if(justTest && result2){
        return true;
    }
    numContacts += result2;

    if(this.enableFrictionReduction){
        if(numContacts && this.enableFriction){
            this.frictionEquations.push(this.createFrictionFromAverage(numContacts));
        }
    }

    return numContacts;
};

/**
 * Line/line narrowphase
 * @method lineLine
 * @param  {Body}       bodyA
 * @param  {Line}       shapeA
 * @param  {Array}      positionA
 * @param  {Number}     angleA
 * @param  {Body}       bodyB
 * @param  {Line}       shapeB
 * @param  {Array}      positionB
 * @param  {Number}     angleB
 * @todo Implement me!
 */
Narrowphase.prototype[Shape_1.LINE | Shape_1.LINE] =
Narrowphase.prototype.lineLine = function(
    bodyA,
    shapeA,
    positionA,
    angleA,
    bodyB,
    shapeB,
    positionB,
    angleB,
    justTest
){
    // TODO
    if(justTest){
        return false;
    } else {
        return 0;
    }
};

/**
 * Plane/line Narrowphase
 * @method planeLine
 * @param  {Body}   planeBody
 * @param  {Plane}  planeShape
 * @param  {Array}  planeOffset
 * @param  {Number} planeAngle
 * @param  {Body}   lineBody
 * @param  {Line}   lineShape
 * @param  {Array}  lineOffset
 * @param  {Number} lineAngle
 */
Narrowphase.prototype[Shape_1.PLANE | Shape_1.LINE] =
Narrowphase.prototype.planeLine = function(planeBody, planeShape, planeOffset, planeAngle,
                                           lineBody,  lineShape,  lineOffset,  lineAngle, justTest){
    var worldVertex0 = tmp1,
        worldVertex1 = tmp2,
        worldVertex01 = tmp3,
        worldVertex11 = tmp4,
        worldEdge = tmp5,
        worldEdgeUnit = tmp6,
        dist = tmp7,
        worldNormal = tmp8,
        worldTangent = tmp9,
        verts = tmpArray,
        numContacts = 0;

    // Get start and end points
    vec2_1.set(worldVertex0, -lineShape.length/2, 0);
    vec2_1.set(worldVertex1,  lineShape.length/2, 0);

    // Not sure why we have to use worldVertex*1 here, but it won't work otherwise. Tired.
    vec2_1.rotate(worldVertex01, worldVertex0, lineAngle);
    vec2_1.rotate(worldVertex11, worldVertex1, lineAngle);

    add(worldVertex01, worldVertex01, lineOffset);
    add(worldVertex11, worldVertex11, lineOffset);

    vec2_1.copy(worldVertex0,worldVertex01);
    vec2_1.copy(worldVertex1,worldVertex11);

    // Get vector along the line
    sub(worldEdge, worldVertex1, worldVertex0);
    vec2_1.normalize(worldEdgeUnit, worldEdge);

    // Get tangent to the edge.
    vec2_1.rotate90cw(worldTangent, worldEdgeUnit);

    vec2_1.rotate(worldNormal, yAxis$1, planeAngle);

    // Check line ends
    verts[0] = worldVertex0;
    verts[1] = worldVertex1;
    for(var i=0; i<verts.length; i++){
        var v = verts[i];

        sub(dist, v, planeOffset);

        var d = dot(dist,worldNormal);

        if(d < 0){

            if(justTest){
                return true;
            }

            var c = this.createContactEquation(planeBody,lineBody,planeShape,lineShape);
            numContacts++;

            vec2_1.copy(c.normalA, worldNormal);
            vec2_1.normalize(c.normalA,c.normalA);

            // distance vector along plane normal
            vec2_1.scale(dist, worldNormal, d);

            // Vector from plane center to contact
            sub(c.contactPointA, v, dist);
            sub(c.contactPointA, c.contactPointA, planeBody.position);

            // From line center to contact
            sub(c.contactPointB, v,    lineOffset);
            add(c.contactPointB, c.contactPointB, lineOffset);
            sub(c.contactPointB, c.contactPointB, lineBody.position);

            this.contactEquations.push(c);

            if(!this.enableFrictionReduction){
                if(this.enableFriction){
                    this.frictionEquations.push(this.createFrictionFromContact(c));
                }
            }
        }
    }

    if(justTest){
        return false;
    }

    if(!this.enableFrictionReduction){
        if(numContacts && this.enableFriction){
            this.frictionEquations.push(this.createFrictionFromAverage(numContacts));
        }
    }

    return numContacts;
};

Narrowphase.prototype[Shape_1.PARTICLE | Shape_1.CAPSULE] =
Narrowphase.prototype.particleCapsule = function(
    particleBody,
    particleShape,
    particlePosition,
    particleAngle,
    capsuleBody,
    capsuleShape,
    capsulePosition,
    capsuleAngle,
    justTest
){
    return this.circleLine(particleBody,particleShape,particlePosition,particleAngle, capsuleBody,capsuleShape,capsulePosition,capsuleAngle, justTest, capsuleShape.radius, 0);
};

/**
 * Circle/line Narrowphase
 * @method circleLine
 * @param  {Body} circleBody
 * @param  {Circle} circleShape
 * @param  {Array} circleOffset
 * @param  {Number} circleAngle
 * @param  {Body} lineBody
 * @param  {Line} lineShape
 * @param  {Array} lineOffset
 * @param  {Number} lineAngle
 * @param {Boolean} justTest If set to true, this function will return the result (intersection or not) without adding equations.
 * @param {Number} lineRadius Radius to add to the line. Can be used to test Capsules.
 * @param {Number} circleRadius If set, this value overrides the circle shape radius.
 */
Narrowphase.prototype[Shape_1.CIRCLE | Shape_1.LINE] =
Narrowphase.prototype.circleLine = function(
    circleBody,
    circleShape,
    circleOffset,
    circleAngle,
    lineBody,
    lineShape,
    lineOffset,
    lineAngle,
    justTest,
    lineRadius,
    circleRadius
){
    var lineRadius = lineRadius || 0,
        circleRadius = typeof(circleRadius)!=="undefined" ? circleRadius : circleShape.radius,

        orthoDist = tmp1,
        lineToCircleOrthoUnit = tmp2,
        projectedPoint = tmp3,
        centerDist = tmp4,
        worldTangent = tmp5,
        worldEdge = tmp6,
        worldEdgeUnit = tmp7,
        worldVertex0 = tmp8,
        worldVertex1 = tmp9,
        worldVertex01 = tmp10,
        worldVertex11 = tmp11,
        dist = tmp12,
        lineToCircle = tmp13,
        lineEndToLineRadius = tmp14,

        verts = tmpArray;

    // Get start and end points
    vec2_1.set(worldVertex0, -lineShape.length/2, 0);
    vec2_1.set(worldVertex1,  lineShape.length/2, 0);

    // Not sure why we have to use worldVertex*1 here, but it won't work otherwise. Tired.
    vec2_1.rotate(worldVertex01, worldVertex0, lineAngle);
    vec2_1.rotate(worldVertex11, worldVertex1, lineAngle);

    add(worldVertex01, worldVertex01, lineOffset);
    add(worldVertex11, worldVertex11, lineOffset);

    vec2_1.copy(worldVertex0,worldVertex01);
    vec2_1.copy(worldVertex1,worldVertex11);

    // Get vector along the line
    sub(worldEdge, worldVertex1, worldVertex0);
    vec2_1.normalize(worldEdgeUnit, worldEdge);

    // Get tangent to the edge.
    vec2_1.rotate90cw(worldTangent, worldEdgeUnit);

    // Check distance from the plane spanned by the edge vs the circle
    sub(dist, circleOffset, worldVertex0);
    var d = dot(dist, worldTangent); // Distance from center of line to circle center
    sub(centerDist, worldVertex0, lineOffset);

    sub(lineToCircle, circleOffset, lineOffset);

    var radiusSum = circleRadius + lineRadius;

    if(Math.abs(d) < radiusSum){

        // Now project the circle onto the edge
        vec2_1.scale(orthoDist, worldTangent, d);
        sub(projectedPoint, circleOffset, orthoDist);

        // Add the missing line radius
        vec2_1.scale(lineToCircleOrthoUnit, worldTangent, dot(worldTangent, lineToCircle));
        vec2_1.normalize(lineToCircleOrthoUnit,lineToCircleOrthoUnit);
        vec2_1.scale(lineToCircleOrthoUnit, lineToCircleOrthoUnit, lineRadius);
        add(projectedPoint,projectedPoint,lineToCircleOrthoUnit);

        // Check if the point is within the edge span
        var pos =  dot(worldEdgeUnit, projectedPoint);
        var pos0 = dot(worldEdgeUnit, worldVertex0);
        var pos1 = dot(worldEdgeUnit, worldVertex1);

        if(pos > pos0 && pos < pos1){
            // We got contact!

            if(justTest){
                return true;
            }

            var c = this.createContactEquation(circleBody,lineBody,circleShape,lineShape);

            vec2_1.scale(c.normalA, orthoDist, -1);
            vec2_1.normalize(c.normalA, c.normalA);

            vec2_1.scale( c.contactPointA, c.normalA,  circleRadius);
            add(c.contactPointA, c.contactPointA, circleOffset);
            sub(c.contactPointA, c.contactPointA, circleBody.position);

            sub(c.contactPointB, projectedPoint, lineOffset);
            add(c.contactPointB, c.contactPointB, lineOffset);
            sub(c.contactPointB, c.contactPointB, lineBody.position);

            this.contactEquations.push(c);

            if(this.enableFriction){
                this.frictionEquations.push(this.createFrictionFromContact(c));
            }

            return 1;
        }
    }

    // Add corner
    verts[0] = worldVertex0;
    verts[1] = worldVertex1;

    for(var i=0; i<verts.length; i++){
        var v = verts[i];

        sub(dist, v, circleOffset);

        if(vec2_1.squaredLength(dist) < Math.pow(radiusSum, 2)){

            if(justTest){
                return true;
            }

            var c = this.createContactEquation(circleBody,lineBody,circleShape,lineShape);

            vec2_1.copy(c.normalA, dist);
            vec2_1.normalize(c.normalA,c.normalA);

            // Vector from circle to contact point is the normal times the circle radius
            vec2_1.scale(c.contactPointA, c.normalA, circleRadius);
            add(c.contactPointA, c.contactPointA, circleOffset);
            sub(c.contactPointA, c.contactPointA, circleBody.position);

            sub(c.contactPointB, v, lineOffset);
            vec2_1.scale(lineEndToLineRadius, c.normalA, -lineRadius);
            add(c.contactPointB, c.contactPointB, lineEndToLineRadius);
            add(c.contactPointB, c.contactPointB, lineOffset);
            sub(c.contactPointB, c.contactPointB, lineBody.position);

            this.contactEquations.push(c);

            if(this.enableFriction){
                this.frictionEquations.push(this.createFrictionFromContact(c));
            }

            return 1;
        }
    }

    return 0;
};

/**
 * Circle/capsule Narrowphase
 * @method circleCapsule
 * @param  {Body}   bi
 * @param  {Circle} si
 * @param  {Array}  xi
 * @param  {Number} ai
 * @param  {Body}   bj
 * @param  {Line}   sj
 * @param  {Array}  xj
 * @param  {Number} aj
 */
Narrowphase.prototype[Shape_1.CIRCLE | Shape_1.CAPSULE] =
Narrowphase.prototype.circleCapsule = function(bi,si,xi,ai, bj,sj,xj,aj, justTest){
    return this.circleLine(bi,si,xi,ai, bj,sj,xj,aj, justTest, sj.radius);
};

/**
 * Circle/convex Narrowphase.
 * @method circleConvex
 * @param  {Body} circleBody
 * @param  {Circle} circleShape
 * @param  {Array} circleOffset
 * @param  {Number} circleAngle
 * @param  {Body} convexBody
 * @param  {Convex} convexShape
 * @param  {Array} convexOffset
 * @param  {Number} convexAngle
 * @param  {Boolean} justTest
 * @param  {Number} circleRadius
 */
Narrowphase.prototype[Shape_1.CIRCLE | Shape_1.CONVEX] =
Narrowphase.prototype[Shape_1.CIRCLE | Shape_1.BOX] =
Narrowphase.prototype.circleConvex = function(
    circleBody,
    circleShape,
    circleOffset,
    circleAngle,
    convexBody,
    convexShape,
    convexOffset,
    convexAngle,
    justTest,
    circleRadius
){
    var circleRadius = typeof(circleRadius)==="number" ? circleRadius : circleShape.radius;

    var worldVertex0 = tmp1,
        worldVertex1 = tmp2,
        worldEdge = tmp3,
        worldEdgeUnit = tmp4,
        worldNormal = tmp5,
        dist = tmp10,
        worldVertex = tmp11,

        closestEdgeProjectedPoint = tmp13,
        candidate = tmp14,
        candidateDist = tmp15,
        minCandidate = tmp16,

        found = false,
        minCandidateDistance = Number.MAX_VALUE;

    // New algorithm:
    // 1. Check so center of circle is not inside the polygon. If it is, this wont work...
    // 2. For each edge
    // 2. 1. Get point on circle that is closest to the edge (scale normal with -radius)
    // 2. 2. Check if point is inside.

    var verts = convexShape.vertices;

    // Check all edges first
    for(var i=0; i!==verts.length+1; i++){
        var v0 = verts[i%verts.length],
            v1 = verts[(i+1)%verts.length];

        vec2_1.rotate(worldVertex0, v0, convexAngle);
        vec2_1.rotate(worldVertex1, v1, convexAngle);
        add(worldVertex0, worldVertex0, convexOffset);
        add(worldVertex1, worldVertex1, convexOffset);
        sub(worldEdge, worldVertex1, worldVertex0);

        vec2_1.normalize(worldEdgeUnit, worldEdge);

        // Get tangent to the edge. Points out of the Convex
        vec2_1.rotate90cw(worldNormal, worldEdgeUnit);

        // Get point on circle, closest to the polygon
        vec2_1.scale(candidate,worldNormal,-circleShape.radius);
        add(candidate,candidate,circleOffset);

        if(pointInConvex(candidate,convexShape,convexOffset,convexAngle)){

            vec2_1.sub(candidateDist,worldVertex0,candidate);
            var candidateDistance = Math.abs(vec2_1.dot(candidateDist,worldNormal));

            if(candidateDistance < minCandidateDistance){
                vec2_1.copy(minCandidate,candidate);
                minCandidateDistance = candidateDistance;
                vec2_1.scale(closestEdgeProjectedPoint,worldNormal,candidateDistance);
                vec2_1.add(closestEdgeProjectedPoint,closestEdgeProjectedPoint,candidate);
                found = true;
            }
        }
    }

    if(found){

        if(justTest){
            return true;
        }

        var c = this.createContactEquation(circleBody,convexBody,circleShape,convexShape);
        vec2_1.sub(c.normalA, minCandidate, circleOffset);
        vec2_1.normalize(c.normalA, c.normalA);

        vec2_1.scale(c.contactPointA,  c.normalA, circleRadius);
        add(c.contactPointA, c.contactPointA, circleOffset);
        sub(c.contactPointA, c.contactPointA, circleBody.position);

        sub(c.contactPointB, closestEdgeProjectedPoint, convexOffset);
        add(c.contactPointB, c.contactPointB, convexOffset);
        sub(c.contactPointB, c.contactPointB, convexBody.position);

        this.contactEquations.push(c);

        if(this.enableFriction){
            this.frictionEquations.push( this.createFrictionFromContact(c) );
        }

        return 1;
    }

    // Check all vertices
    if(circleRadius > 0){
        for(var i=0; i<verts.length; i++){
            var localVertex = verts[i];
            vec2_1.rotate(worldVertex, localVertex, convexAngle);
            add(worldVertex, worldVertex, convexOffset);

            sub(dist, worldVertex, circleOffset);
            if(vec2_1.squaredLength(dist) < Math.pow(circleRadius, 2)){

                if(justTest){
                    return true;
                }

                var c = this.createContactEquation(circleBody,convexBody,circleShape,convexShape);

                vec2_1.copy(c.normalA, dist);
                vec2_1.normalize(c.normalA,c.normalA);

                // Vector from circle to contact point is the normal times the circle radius
                vec2_1.scale(c.contactPointA, c.normalA, circleRadius);
                add(c.contactPointA, c.contactPointA, circleOffset);
                sub(c.contactPointA, c.contactPointA, circleBody.position);

                sub(c.contactPointB, worldVertex, convexOffset);
                add(c.contactPointB, c.contactPointB, convexOffset);
                sub(c.contactPointB, c.contactPointB, convexBody.position);

                this.contactEquations.push(c);

                if(this.enableFriction){
                    this.frictionEquations.push(this.createFrictionFromContact(c));
                }

                return 1;
            }
        }
    }

    return 0;
};

var pic_worldVertex0 = vec2_1.create(),
    pic_worldVertex1 = vec2_1.create(),
    pic_r0 = vec2_1.create(),
    pic_r1 = vec2_1.create();

/*
 * Check if a point is in a polygon
 */
function pointInConvex(worldPoint,convexShape,convexOffset,convexAngle){
    var worldVertex0 = pic_worldVertex0,
        worldVertex1 = pic_worldVertex1,
        r0 = pic_r0,
        r1 = pic_r1,
        point = worldPoint,
        verts = convexShape.vertices,
        lastCross = null;
    for(var i=0; i!==verts.length+1; i++){
        var v0 = verts[i%verts.length],
            v1 = verts[(i+1)%verts.length];

        // Transform vertices to world
        // @todo The point should be transformed to local coordinates in the convex, no need to transform each vertex
        vec2_1.rotate(worldVertex0, v0, convexAngle);
        vec2_1.rotate(worldVertex1, v1, convexAngle);
        add(worldVertex0, worldVertex0, convexOffset);
        add(worldVertex1, worldVertex1, convexOffset);

        sub(r0, worldVertex0, point);
        sub(r1, worldVertex1, point);
        var cross = vec2_1.crossLength(r0,r1);

        if(lastCross===null){
            lastCross = cross;
        }

        // If we got a different sign of the distance vector, the point is out of the polygon
        if(cross*lastCross <= 0){
            return false;
        }
        lastCross = cross;
    }
    return true;
}

/**
 * Particle/convex Narrowphase
 * @method particleConvex
 * @param  {Body} particleBody
 * @param  {Particle} particleShape
 * @param  {Array} particleOffset
 * @param  {Number} particleAngle
 * @param  {Body} convexBody
 * @param  {Convex} convexShape
 * @param  {Array} convexOffset
 * @param  {Number} convexAngle
 * @param {Boolean} justTest
 * @todo use pointInConvex and code more similar to circleConvex
 * @todo don't transform each vertex, but transform the particle position to convex-local instead
 */
Narrowphase.prototype[Shape_1.PARTICLE | Shape_1.CONVEX] =
Narrowphase.prototype[Shape_1.PARTICLE | Shape_1.BOX] =
Narrowphase.prototype.particleConvex = function(
    particleBody,
    particleShape,
    particleOffset,
    particleAngle,
    convexBody,
    convexShape,
    convexOffset,
    convexAngle,
    justTest
){
    var worldVertex0 = tmp1,
        worldVertex1 = tmp2,
        worldEdge = tmp3,
        worldEdgeUnit = tmp4,
        worldTangent = tmp5,
        centerDist = tmp6,
        convexToparticle = tmp7,
        dist = tmp10,
        closestEdgeProjectedPoint = tmp13,
        candidateDist = tmp17,
        minEdgeNormal = tmp18,
        minCandidateDistance = Number.MAX_VALUE;

    var found = false,
        verts = convexShape.vertices;

    // Check if the particle is in the polygon at all
    if(!pointInConvex(particleOffset,convexShape,convexOffset,convexAngle)){
        return 0;
    }

    if(justTest){
        return true;
    }
    for(var i=0; i!==verts.length+1; i++){
        var v0 = verts[i%verts.length],
            v1 = verts[(i+1)%verts.length];

        // Transform vertices to world
        vec2_1.rotate(worldVertex0, v0, convexAngle);
        vec2_1.rotate(worldVertex1, v1, convexAngle);
        add(worldVertex0, worldVertex0, convexOffset);
        add(worldVertex1, worldVertex1, convexOffset);

        // Get world edge
        sub(worldEdge, worldVertex1, worldVertex0);
        vec2_1.normalize(worldEdgeUnit, worldEdge);

        // Get tangent to the edge. Points out of the Convex
        vec2_1.rotate90cw(worldTangent, worldEdgeUnit);

        // Check distance from the infinite line (spanned by the edge) to the particle
        sub(dist, particleOffset, worldVertex0);
        var d = dot(dist, worldTangent);
        sub(centerDist, worldVertex0, convexOffset);

        sub(convexToparticle, particleOffset, convexOffset);

        vec2_1.sub(candidateDist,worldVertex0,particleOffset);
        var candidateDistance = Math.abs(vec2_1.dot(candidateDist,worldTangent));

        if(candidateDistance < minCandidateDistance){
            minCandidateDistance = candidateDistance;
            vec2_1.scale(closestEdgeProjectedPoint,worldTangent,candidateDistance);
            vec2_1.add(closestEdgeProjectedPoint,closestEdgeProjectedPoint,particleOffset);
            vec2_1.copy(minEdgeNormal,worldTangent);
            found = true;
        }
    }

    if(found){
        var c = this.createContactEquation(particleBody,convexBody,particleShape,convexShape);

        vec2_1.scale(c.normalA, minEdgeNormal, -1);
        vec2_1.normalize(c.normalA, c.normalA);

        // Particle has no extent to the contact point
        vec2_1.set(c.contactPointA,  0, 0);
        add(c.contactPointA, c.contactPointA, particleOffset);
        sub(c.contactPointA, c.contactPointA, particleBody.position);

        // From convex center to point
        sub(c.contactPointB, closestEdgeProjectedPoint, convexOffset);
        add(c.contactPointB, c.contactPointB, convexOffset);
        sub(c.contactPointB, c.contactPointB, convexBody.position);

        this.contactEquations.push(c);

        if(this.enableFriction){
            this.frictionEquations.push( this.createFrictionFromContact(c) );
        }

        return 1;
    }


    return 0;
};

/**
 * Circle/circle Narrowphase
 * @method circleCircle
 * @param  {Body} bodyA
 * @param  {Circle} shapeA
 * @param  {Array} offsetA
 * @param  {Number} angleA
 * @param  {Body} bodyB
 * @param  {Circle} shapeB
 * @param  {Array} offsetB
 * @param  {Number} angleB
 * @param {Boolean} justTest
 * @param {Number} [radiusA] Optional radius to use for shapeA
 * @param {Number} [radiusB] Optional radius to use for shapeB
 */
Narrowphase.prototype[Shape_1.CIRCLE] =
Narrowphase.prototype.circleCircle = function(
    bodyA,
    shapeA,
    offsetA,
    angleA,
    bodyB,
    shapeB,
    offsetB,
    angleB,
    justTest,
    radiusA,
    radiusB
){

    var dist = tmp1,
        radiusA = radiusA || shapeA.radius,
        radiusB = radiusB || shapeB.radius;

    sub(dist,offsetA,offsetB);
    var r = radiusA + radiusB;
    if(vec2_1.squaredLength(dist) > Math.pow(r,2)){
        return 0;
    }

    if(justTest){
        return true;
    }

    var c = this.createContactEquation(bodyA,bodyB,shapeA,shapeB);
    sub(c.normalA, offsetB, offsetA);
    vec2_1.normalize(c.normalA,c.normalA);

    vec2_1.scale( c.contactPointA, c.normalA,  radiusA);
    vec2_1.scale( c.contactPointB, c.normalA, -radiusB);

    add(c.contactPointA, c.contactPointA, offsetA);
    sub(c.contactPointA, c.contactPointA, bodyA.position);

    add(c.contactPointB, c.contactPointB, offsetB);
    sub(c.contactPointB, c.contactPointB, bodyB.position);

    this.contactEquations.push(c);

    if(this.enableFriction){
        this.frictionEquations.push(this.createFrictionFromContact(c));
    }
    return 1;
};

/**
 * Plane/Convex Narrowphase
 * @method planeConvex
 * @param  {Body} planeBody
 * @param  {Plane} planeShape
 * @param  {Array} planeOffset
 * @param  {Number} planeAngle
 * @param  {Body} convexBody
 * @param  {Convex} convexShape
 * @param  {Array} convexOffset
 * @param  {Number} convexAngle
 * @param {Boolean} justTest
 */
Narrowphase.prototype[Shape_1.PLANE | Shape_1.CONVEX] =
Narrowphase.prototype[Shape_1.PLANE | Shape_1.BOX] =
Narrowphase.prototype.planeConvex = function(
    planeBody,
    planeShape,
    planeOffset,
    planeAngle,
    convexBody,
    convexShape,
    convexOffset,
    convexAngle,
    justTest
){
    var worldVertex = tmp1,
        worldNormal = tmp2,
        dist = tmp3;

    var numReported = 0;
    vec2_1.rotate(worldNormal, yAxis$1, planeAngle);

    for(var i=0; i!==convexShape.vertices.length; i++){
        var v = convexShape.vertices[i];
        vec2_1.rotate(worldVertex, v, convexAngle);
        add(worldVertex, worldVertex, convexOffset);

        sub(dist, worldVertex, planeOffset);

        if(dot(dist,worldNormal) <= 0){

            if(justTest){
                return true;
            }

            // Found vertex
            numReported++;

            var c = this.createContactEquation(planeBody,convexBody,planeShape,convexShape);

            sub(dist, worldVertex, planeOffset);

            vec2_1.copy(c.normalA, worldNormal);

            var d = dot(dist, c.normalA);
            vec2_1.scale(dist, c.normalA, d);

            // rj is from convex center to contact
            sub(c.contactPointB, worldVertex, convexBody.position);


            // ri is from plane center to contact
            sub( c.contactPointA, worldVertex, dist);
            sub( c.contactPointA, c.contactPointA, planeBody.position);

            this.contactEquations.push(c);

            if(!this.enableFrictionReduction){
                if(this.enableFriction){
                    this.frictionEquations.push(this.createFrictionFromContact(c));
                }
            }
        }
    }

    if(this.enableFrictionReduction){
        if(this.enableFriction && numReported){
            this.frictionEquations.push(this.createFrictionFromAverage(numReported));
        }
    }

    return numReported;
};

/**
 * Narrowphase for particle vs plane
 * @method particlePlane
 * @param  {Body}       particleBody
 * @param  {Particle}   particleShape
 * @param  {Array}      particleOffset
 * @param  {Number}     particleAngle
 * @param  {Body}       planeBody
 * @param  {Plane}      planeShape
 * @param  {Array}      planeOffset
 * @param  {Number}     planeAngle
 * @param {Boolean}     justTest
 */
Narrowphase.prototype[Shape_1.PARTICLE | Shape_1.PLANE] =
Narrowphase.prototype.particlePlane = function(
    particleBody,
    particleShape,
    particleOffset,
    particleAngle,
    planeBody,
    planeShape,
    planeOffset,
    planeAngle,
    justTest
){
    var dist = tmp1,
        worldNormal = tmp2;

    planeAngle = planeAngle || 0;

    sub(dist, particleOffset, planeOffset);
    vec2_1.rotate(worldNormal, yAxis$1, planeAngle);

    var d = dot(dist, worldNormal);

    if(d > 0){
        return 0;
    }
    if(justTest){
        return true;
    }

    var c = this.createContactEquation(planeBody,particleBody,planeShape,particleShape);

    vec2_1.copy(c.normalA, worldNormal);
    vec2_1.scale( dist, c.normalA, d );
    // dist is now the distance vector in the normal direction

    // ri is the particle position projected down onto the plane, from the plane center
    sub( c.contactPointA, particleOffset, dist);
    sub( c.contactPointA, c.contactPointA, planeBody.position);

    // rj is from the body center to the particle center
    sub( c.contactPointB, particleOffset, particleBody.position );

    this.contactEquations.push(c);

    if(this.enableFriction){
        this.frictionEquations.push(this.createFrictionFromContact(c));
    }
    return 1;
};

/**
 * Circle/Particle Narrowphase
 * @method circleParticle
 * @param  {Body} circleBody
 * @param  {Circle} circleShape
 * @param  {Array} circleOffset
 * @param  {Number} circleAngle
 * @param  {Body} particleBody
 * @param  {Particle} particleShape
 * @param  {Array} particleOffset
 * @param  {Number} particleAngle
 * @param  {Boolean} justTest
 */
Narrowphase.prototype[Shape_1.CIRCLE | Shape_1.PARTICLE] =
Narrowphase.prototype.circleParticle = function(
    circleBody,
    circleShape,
    circleOffset,
    circleAngle,
    particleBody,
    particleShape,
    particleOffset,
    particleAngle,
    justTest
){
    var dist = tmp1;

    sub(dist, particleOffset, circleOffset);
    if(vec2_1.squaredLength(dist) > Math.pow(circleShape.radius, 2)){
        return 0;
    }
    if(justTest){
        return true;
    }

    var c = this.createContactEquation(circleBody,particleBody,circleShape,particleShape);
    vec2_1.copy(c.normalA, dist);
    vec2_1.normalize(c.normalA,c.normalA);

    // Vector from circle to contact point is the normal times the circle radius
    vec2_1.scale(c.contactPointA, c.normalA, circleShape.radius);
    add(c.contactPointA, c.contactPointA, circleOffset);
    sub(c.contactPointA, c.contactPointA, circleBody.position);

    // Vector from particle center to contact point is zero
    sub(c.contactPointB, particleOffset, particleBody.position);

    this.contactEquations.push(c);

    if(this.enableFriction){
        this.frictionEquations.push(this.createFrictionFromContact(c));
    }

    return 1;
};

var planeCapsule_tmpCircle = new Circle_1({ radius: 1 }),
    planeCapsule_tmp1 = vec2_1.create(),
    planeCapsule_tmp2 = vec2_1.create(),
    planeCapsule_tmp3 = vec2_1.create();

/**
 * @method planeCapsule
 * @param  {Body} planeBody
 * @param  {Circle} planeShape
 * @param  {Array} planeOffset
 * @param  {Number} planeAngle
 * @param  {Body} capsuleBody
 * @param  {Particle} capsuleShape
 * @param  {Array} capsuleOffset
 * @param  {Number} capsuleAngle
 * @param {Boolean} justTest
 */
Narrowphase.prototype[Shape_1.PLANE | Shape_1.CAPSULE] =
Narrowphase.prototype.planeCapsule = function(
    planeBody,
    planeShape,
    planeOffset,
    planeAngle,
    capsuleBody,
    capsuleShape,
    capsuleOffset,
    capsuleAngle,
    justTest
){
    var end1 = planeCapsule_tmp1,
        end2 = planeCapsule_tmp2,
        circle = planeCapsule_tmpCircle;

    // Compute world end positions
    vec2_1.set(end1, -capsuleShape.length/2, 0);
    vec2_1.rotate(end1,end1,capsuleAngle);
    add(end1,end1,capsuleOffset);

    vec2_1.set(end2,  capsuleShape.length/2, 0);
    vec2_1.rotate(end2,end2,capsuleAngle);
    add(end2,end2,capsuleOffset);

    circle.radius = capsuleShape.radius;

    var enableFrictionBefore;

    // Temporarily turn off friction
    if(this.enableFrictionReduction){
        enableFrictionBefore = this.enableFriction;
        this.enableFriction = false;
    }

    // Do Narrowphase as two circles
    var numContacts1 = this.circlePlane(capsuleBody,circle,end1,0, planeBody,planeShape,planeOffset,planeAngle, justTest),
        numContacts2 = this.circlePlane(capsuleBody,circle,end2,0, planeBody,planeShape,planeOffset,planeAngle, justTest);

    // Restore friction
    if(this.enableFrictionReduction){
        this.enableFriction = enableFrictionBefore;
    }

    if(justTest){
        return numContacts1 || numContacts2;
    } else {
        var numTotal = numContacts1 + numContacts2;
        if(this.enableFrictionReduction){
            if(numTotal){
                this.frictionEquations.push(this.createFrictionFromAverage(numTotal));
            }
        }
        return numTotal;
    }
};

/**
 * Creates ContactEquations and FrictionEquations for a collision.
 * @method circlePlane
 * @param  {Body}    bi     The first body that should be connected to the equations.
 * @param  {Circle}  si     The circle shape participating in the collision.
 * @param  {Array}   xi     Extra offset to take into account for the Shape, in addition to the one in circleBody.position. Will *not* be rotated by circleBody.angle (maybe it should, for sake of homogenity?). Set to null if none.
 * @param  {Body}    bj     The second body that should be connected to the equations.
 * @param  {Plane}   sj     The Plane shape that is participating
 * @param  {Array}   xj     Extra offset for the plane shape.
 * @param  {Number}  aj     Extra angle to apply to the plane
 */
Narrowphase.prototype[Shape_1.CIRCLE | Shape_1.PLANE] =
Narrowphase.prototype.circlePlane = function(   bi,si,xi,ai, bj,sj,xj,aj, justTest ){
    var circleBody = bi,
        circleShape = si,
        circleOffset = xi, // Offset from body center, rotated!
        planeBody = bj,
        planeOffset = xj,
        planeAngle = aj;

    planeAngle = planeAngle || 0;

    // Vector from plane to circle
    var planeToCircle = tmp1,
        worldNormal = tmp2,
        temp = tmp3;

    sub(planeToCircle, circleOffset, planeOffset);

    // World plane normal
    vec2_1.rotate(worldNormal, yAxis$1, planeAngle);

    // Normal direction distance
    var d = dot(worldNormal, planeToCircle);

    if(d > circleShape.radius){
        return 0; // No overlap. Abort.
    }

    if(justTest){
        return true;
    }

    // Create contact
    var contact = this.createContactEquation(planeBody,circleBody,sj,si);

    // ni is the plane world normal
    vec2_1.copy(contact.normalA, worldNormal);

    // rj is the vector from circle center to the contact point
    vec2_1.scale(contact.contactPointB, contact.normalA, -circleShape.radius);
    add(contact.contactPointB, contact.contactPointB, circleOffset);
    sub(contact.contactPointB, contact.contactPointB, circleBody.position);

    // ri is the distance from plane center to contact.
    vec2_1.scale(temp, contact.normalA, d);
    sub(contact.contactPointA, planeToCircle, temp ); // Subtract normal distance vector from the distance vector
    add(contact.contactPointA, contact.contactPointA, planeOffset);
    sub(contact.contactPointA, contact.contactPointA, planeBody.position);

    this.contactEquations.push(contact);

    if(this.enableFriction){
        this.frictionEquations.push( this.createFrictionFromContact(contact) );
    }

    return 1;
};

/**
 * Convex/convex Narrowphase.See <a href="http://www.altdevblogaday.com/2011/05/13/contact-generation-between-3d-convex-meshes/">this article</a> for more info.
 * @method convexConvex
 * @param  {Body} bi
 * @param  {Convex} si
 * @param  {Array} xi
 * @param  {Number} ai
 * @param  {Body} bj
 * @param  {Convex} sj
 * @param  {Array} xj
 * @param  {Number} aj
 */
Narrowphase.prototype[Shape_1.CONVEX] =
Narrowphase.prototype[Shape_1.CONVEX | Shape_1.BOX] =
Narrowphase.prototype[Shape_1.BOX] =
Narrowphase.prototype.convexConvex = function(  bi,si,xi,ai, bj,sj,xj,aj, justTest, precision ){
    var sepAxis = tmp1,
        worldPoint = tmp2,
        worldPoint0 = tmp3,
        worldPoint1 = tmp4,
        worldEdge = tmp5,
        penetrationVec = tmp7,
        dist = tmp8,
        worldNormal = tmp9,
        numContacts = 0,
        precision = typeof(precision) === 'number' ? precision : 0;

    var found = Narrowphase.findSeparatingAxis(si,xi,ai,sj,xj,aj,sepAxis);
    if(!found){
        return 0;
    }

    // Make sure the separating axis is directed from shape i to shape j
    sub(dist,xj,xi);
    if(dot(sepAxis,dist) > 0){
        vec2_1.scale(sepAxis,sepAxis,-1);
    }

    // Find edges with normals closest to the separating axis
    var closestEdge1 = Narrowphase.getClosestEdge(si,ai,sepAxis,true), // Flipped axis
        closestEdge2 = Narrowphase.getClosestEdge(sj,aj,sepAxis);

    if(closestEdge1 === -1 || closestEdge2 === -1){
        return 0;
    }

    // Loop over the shapes
    for(var k=0; k<2; k++){

        var closestEdgeA = closestEdge1,
            closestEdgeB = closestEdge2,
            shapeA =  si, shapeB =  sj,
            offsetA = xi, offsetB = xj,
            angleA = ai, angleB = aj,
            bodyA = bi, bodyB = bj;

        if(k === 0){
            // Swap!
            var tmp;
            tmp = closestEdgeA;
            closestEdgeA = closestEdgeB;
            closestEdgeB = tmp;

            tmp = shapeA;
            shapeA = shapeB;
            shapeB = tmp;

            tmp = offsetA;
            offsetA = offsetB;
            offsetB = tmp;

            tmp = angleA;
            angleA = angleB;
            angleB = tmp;

            tmp = bodyA;
            bodyA = bodyB;
            bodyB = tmp;
        }

        // Loop over 2 points in convex B
        for(var j=closestEdgeB; j<closestEdgeB+2; j++){

            // Get world point
            var v = shapeB.vertices[(j+shapeB.vertices.length)%shapeB.vertices.length];
            vec2_1.rotate(worldPoint, v, angleB);
            add(worldPoint, worldPoint, offsetB);

            var insideNumEdges = 0;

            // Loop over the 3 closest edges in convex A
            for(var i=closestEdgeA-1; i<closestEdgeA+2; i++){

                var v0 = shapeA.vertices[(i  +shapeA.vertices.length)%shapeA.vertices.length],
                    v1 = shapeA.vertices[(i+1+shapeA.vertices.length)%shapeA.vertices.length];

                // Construct the edge
                vec2_1.rotate(worldPoint0, v0, angleA);
                vec2_1.rotate(worldPoint1, v1, angleA);
                add(worldPoint0, worldPoint0, offsetA);
                add(worldPoint1, worldPoint1, offsetA);

                sub(worldEdge, worldPoint1, worldPoint0);

                vec2_1.rotate90cw(worldNormal, worldEdge); // Normal points out of convex 1
                vec2_1.normalize(worldNormal,worldNormal);

                sub(dist, worldPoint, worldPoint0);

                var d = dot(worldNormal,dist);

                if((i === closestEdgeA && d <= precision) || (i !== closestEdgeA && d <= 0)){
                    insideNumEdges++;
                }
            }

            if(insideNumEdges >= 3){

                if(justTest){
                    return true;
                }

                // worldPoint was on the "inside" side of each of the 3 checked edges.
                // Project it to the center edge and use the projection direction as normal

                // Create contact
                var c = this.createContactEquation(bodyA,bodyB,shapeA,shapeB);
                numContacts++;

                // Get center edge from body A
                var v0 = shapeA.vertices[(closestEdgeA)   % shapeA.vertices.length],
                    v1 = shapeA.vertices[(closestEdgeA+1) % shapeA.vertices.length];

                // Construct the edge
                vec2_1.rotate(worldPoint0, v0, angleA);
                vec2_1.rotate(worldPoint1, v1, angleA);
                add(worldPoint0, worldPoint0, offsetA);
                add(worldPoint1, worldPoint1, offsetA);

                sub(worldEdge, worldPoint1, worldPoint0);

                vec2_1.rotate90cw(c.normalA, worldEdge); // Normal points out of convex A
                vec2_1.normalize(c.normalA,c.normalA);

                sub(dist, worldPoint, worldPoint0); // From edge point to the penetrating point
                var d = dot(c.normalA,dist);             // Penetration
                vec2_1.scale(penetrationVec, c.normalA, d);     // Vector penetration

                sub(c.contactPointA, worldPoint, offsetA);
                sub(c.contactPointA, c.contactPointA, penetrationVec);
                add(c.contactPointA, c.contactPointA, offsetA);
                sub(c.contactPointA, c.contactPointA, bodyA.position);

                sub(c.contactPointB, worldPoint, offsetB);
                add(c.contactPointB, c.contactPointB, offsetB);
                sub(c.contactPointB, c.contactPointB, bodyB.position);

                this.contactEquations.push(c);

                // Todo reduce to 1 friction equation if we have 2 contact points
                if(!this.enableFrictionReduction){
                    if(this.enableFriction){
                        this.frictionEquations.push(this.createFrictionFromContact(c));
                    }
                }
            }
        }
    }

    if(this.enableFrictionReduction){
        if(this.enableFriction && numContacts){
            this.frictionEquations.push(this.createFrictionFromAverage(numContacts));
        }
    }

    return numContacts;
};

// .projectConvex is called by other functions, need local tmp vectors
var pcoa_tmp1 = vec2_1.fromValues(0,0);

/**
 * Project a Convex onto a world-oriented axis
 * @method projectConvexOntoAxis
 * @static
 * @param  {Convex} convexShape
 * @param  {Array} convexOffset
 * @param  {Number} convexAngle
 * @param  {Array} worldAxis
 * @param  {Array} result
 */
Narrowphase.projectConvexOntoAxis = function(convexShape, convexOffset, convexAngle, worldAxis, result){
    var max=null,
        min=null,
        v,
        value,
        localAxis = pcoa_tmp1;

    // Convert the axis to local coords of the body
    vec2_1.rotate(localAxis, worldAxis, -convexAngle);

    // Get projected position of all vertices
    for(var i=0; i<convexShape.vertices.length; i++){
        v = convexShape.vertices[i];
        value = dot(v,localAxis);
        if(max === null || value > max){
            max = value;
        }
        if(min === null || value < min){
            min = value;
        }
    }

    if(min > max){
        var t = min;
        min = max;
        max = t;
    }

    // Project the position of the body onto the axis - need to add this to the result
    var offset = dot(convexOffset, worldAxis);

    vec2_1.set( result, min + offset, max + offset);
};

// .findSeparatingAxis is called by other functions, need local tmp vectors
var fsa_tmp1 = vec2_1.fromValues(0,0)
,   fsa_tmp2 = vec2_1.fromValues(0,0)
,   fsa_tmp3 = vec2_1.fromValues(0,0)
,   fsa_tmp4 = vec2_1.fromValues(0,0)
,   fsa_tmp5 = vec2_1.fromValues(0,0)
,   fsa_tmp6 = vec2_1.fromValues(0,0);

/**
 * Find a separating axis between the shapes, that maximizes the separating distance between them.
 * @method findSeparatingAxis
 * @static
 * @param  {Convex}     c1
 * @param  {Array}      offset1
 * @param  {Number}     angle1
 * @param  {Convex}     c2
 * @param  {Array}      offset2
 * @param  {Number}     angle2
 * @param  {Array}      sepAxis     The resulting axis
 * @return {Boolean}                Whether the axis could be found.
 */
Narrowphase.findSeparatingAxis = function(c1,offset1,angle1,c2,offset2,angle2,sepAxis){
    var maxDist = null,
        overlap = false,
        found = false,
        edge = fsa_tmp1,
        worldPoint0 = fsa_tmp2,
        worldPoint1 = fsa_tmp3,
        normal = fsa_tmp4,
        span1 = fsa_tmp5,
        span2 = fsa_tmp6;

    if(c1 instanceof Box_1 && c2 instanceof Box_1){

        for(var j=0; j!==2; j++){
            var c = c1,
                angle = angle1;
            if(j===1){
                c = c2;
                angle = angle2;
            }

            for(var i=0; i!==2; i++){

                // Get the world edge
                if(i === 0){
                    vec2_1.set(normal, 0, 1);
                } else if(i === 1) {
                    vec2_1.set(normal, 1, 0);
                }
                if(angle !== 0){
                    vec2_1.rotate(normal, normal, angle);
                }

                // Project hulls onto that normal
                Narrowphase.projectConvexOntoAxis(c1,offset1,angle1,normal,span1);
                Narrowphase.projectConvexOntoAxis(c2,offset2,angle2,normal,span2);

                // Order by span position
                var a=span1,
                    b=span2;
                if(span1[0] > span2[0]){
                    b=span1;
                    a=span2;
                }

                // Get separating distance
                var dist = b[0] - a[1];
                overlap = (dist <= 0);

                if(maxDist===null || dist > maxDist){
                    vec2_1.copy(sepAxis, normal);
                    maxDist = dist;
                    found = overlap;
                }
            }
        }

    } else {

        for(var j=0; j!==2; j++){
            var c = c1,
                angle = angle1;
            if(j===1){
                c = c2;
                angle = angle2;
            }

            for(var i=0; i!==c.vertices.length; i++){
                // Get the world edge
                vec2_1.rotate(worldPoint0, c.vertices[i], angle);
                vec2_1.rotate(worldPoint1, c.vertices[(i+1)%c.vertices.length], angle);

                sub(edge, worldPoint1, worldPoint0);

                // Get normal - just rotate 90 degrees since vertices are given in CCW
                vec2_1.rotate90cw(normal, edge);
                vec2_1.normalize(normal,normal);

                // Project hulls onto that normal
                Narrowphase.projectConvexOntoAxis(c1,offset1,angle1,normal,span1);
                Narrowphase.projectConvexOntoAxis(c2,offset2,angle2,normal,span2);

                // Order by span position
                var a=span1,
                    b=span2;
                if(span1[0] > span2[0]){
                    b=span1;
                    a=span2;
                }

                // Get separating distance
                var dist = b[0] - a[1];
                overlap = (dist <= 0);

                if(maxDist===null || dist > maxDist){
                    vec2_1.copy(sepAxis, normal);
                    maxDist = dist;
                    found = overlap;
                }
            }
        }
    }


    /*
    // Needs to be tested some more
    for(var j=0; j!==2; j++){
        var c = c1,
            angle = angle1;
        if(j===1){
            c = c2;
            angle = angle2;
        }

        for(var i=0; i!==c.axes.length; i++){

            var normal = c.axes[i];

            // Project hulls onto that normal
            Narrowphase.projectConvexOntoAxis(c1, offset1, angle1, normal, span1);
            Narrowphase.projectConvexOntoAxis(c2, offset2, angle2, normal, span2);

            // Order by span position
            var a=span1,
                b=span2,
                swapped = false;
            if(span1[0] > span2[0]){
                b=span1;
                a=span2;
                swapped = true;
            }

            // Get separating distance
            var dist = b[0] - a[1];
            overlap = (dist <= Narrowphase.convexPrecision);

            if(maxDist===null || dist > maxDist){
                vec2.copy(sepAxis, normal);
                maxDist = dist;
                found = overlap;
            }
        }
    }
    */

    return found;
};

// .getClosestEdge is called by other functions, need local tmp vectors
var gce_tmp1 = vec2_1.fromValues(0,0)
,   gce_tmp2 = vec2_1.fromValues(0,0)
,   gce_tmp3 = vec2_1.fromValues(0,0);

/**
 * Get the edge that has a normal closest to an axis.
 * @method getClosestEdge
 * @static
 * @param  {Convex}     c
 * @param  {Number}     angle
 * @param  {Array}      axis
 * @param  {Boolean}    flip
 * @return {Number}             Index of the edge that is closest. This index and the next spans the resulting edge. Returns -1 if failed.
 */
Narrowphase.getClosestEdge = function(c,angle,axis,flip){
    var localAxis = gce_tmp1,
        edge = gce_tmp2,
        normal = gce_tmp3;

    // Convert the axis to local coords of the body
    vec2_1.rotate(localAxis, axis, -angle);
    if(flip){
        vec2_1.scale(localAxis,localAxis,-1);
    }

    var closestEdge = -1,
        N = c.vertices.length,
        maxDot = -1;
    for(var i=0; i!==N; i++){
        // Get the edge
        sub(edge, c.vertices[(i+1)%N], c.vertices[i%N]);

        // Get normal - just rotate 90 degrees since vertices are given in CCW
        vec2_1.rotate90cw(normal, edge);
        vec2_1.normalize(normal,normal);

        var d = dot(normal,localAxis);
        if(closestEdge === -1 || d > maxDot){
            closestEdge = i % N;
            maxDot = d;
        }
    }

    return closestEdge;
};

var circleHeightfield_candidate = vec2_1.create(),
    circleHeightfield_dist = vec2_1.create(),
    circleHeightfield_v0 = vec2_1.create(),
    circleHeightfield_v1 = vec2_1.create(),
    circleHeightfield_minCandidate = vec2_1.create(),
    circleHeightfield_worldNormal = vec2_1.create(),
    circleHeightfield_minCandidateNormal = vec2_1.create();

/**
 * @method circleHeightfield
 * @param  {Body}           bi
 * @param  {Circle}         si
 * @param  {Array}          xi
 * @param  {Body}           bj
 * @param  {Heightfield}    sj
 * @param  {Array}          xj
 * @param  {Number}         aj
 */
Narrowphase.prototype[Shape_1.CIRCLE | Shape_1.HEIGHTFIELD] =
Narrowphase.prototype.circleHeightfield = function( circleBody,circleShape,circlePos,circleAngle,
                                                    hfBody,hfShape,hfPos,hfAngle, justTest, radius ){
    var data = hfShape.heights,
        radius = radius || circleShape.radius,
        w = hfShape.elementWidth,
        dist = circleHeightfield_dist,
        candidate = circleHeightfield_candidate,
        minCandidate = circleHeightfield_minCandidate,
        minCandidateNormal = circleHeightfield_minCandidateNormal,
        worldNormal = circleHeightfield_worldNormal,
        v0 = circleHeightfield_v0,
        v1 = circleHeightfield_v1;

    // Get the index of the points to test against
    var idxA = Math.floor( (circlePos[0] - radius - hfPos[0]) / w ),
        idxB = Math.ceil(  (circlePos[0] + radius - hfPos[0]) / w );

    /*if(idxB < 0 || idxA >= data.length)
        return justTest ? false : 0;*/

    if(idxA < 0){
        idxA = 0;
    }
    if(idxB >= data.length){
        idxB = data.length-1;
    }

    // Get max and min
    var max = data[idxA],
        min = data[idxB];
    for(var i=idxA; i<idxB; i++){
        if(data[i] < min){
            min = data[i];
        }
        if(data[i] > max){
            max = data[i];
        }
    }

    if(circlePos[1]-radius > max){
        return justTest ? false : 0;
    }

    /*
    if(circlePos[1]+radius < min){
        // Below the minimum point... We can just guess.
        // TODO
    }
    */

    // 1. Check so center of circle is not inside the field. If it is, this wont work...
    // 2. For each edge
    // 2. 1. Get point on circle that is closest to the edge (scale normal with -radius)
    // 2. 2. Check if point is inside.

    var found = false;

    // Check all edges first
    for(var i=idxA; i<idxB; i++){

        // Get points
        vec2_1.set(v0,     i*w, data[i]  );
        vec2_1.set(v1, (i+1)*w, data[i+1]);
        vec2_1.add(v0,v0,hfPos);
        vec2_1.add(v1,v1,hfPos);

        // Get normal
        vec2_1.sub(worldNormal, v1, v0);
        vec2_1.rotate(worldNormal, worldNormal, Math.PI/2);
        vec2_1.normalize(worldNormal,worldNormal);

        // Get point on circle, closest to the edge
        vec2_1.scale(candidate,worldNormal,-radius);
        vec2_1.add(candidate,candidate,circlePos);

        // Distance from v0 to the candidate point
        vec2_1.sub(dist,candidate,v0);

        // Check if it is in the element "stick"
        var d = vec2_1.dot(dist,worldNormal);
        if(candidate[0] >= v0[0] && candidate[0] < v1[0] && d <= 0){

            if(justTest){
                return true;
            }

            found = true;

            // Store the candidate point, projected to the edge
            vec2_1.scale(dist,worldNormal,-d);
            vec2_1.add(minCandidate,candidate,dist);
            vec2_1.copy(minCandidateNormal,worldNormal);

            var c = this.createContactEquation(hfBody,circleBody,hfShape,circleShape);

            // Normal is out of the heightfield
            vec2_1.copy(c.normalA, minCandidateNormal);

            // Vector from circle to heightfield
            vec2_1.scale(c.contactPointB,  c.normalA, -radius);
            add(c.contactPointB, c.contactPointB, circlePos);
            sub(c.contactPointB, c.contactPointB, circleBody.position);

            vec2_1.copy(c.contactPointA, minCandidate);
            vec2_1.sub(c.contactPointA, c.contactPointA, hfBody.position);

            this.contactEquations.push(c);

            if(this.enableFriction){
                this.frictionEquations.push( this.createFrictionFromContact(c) );
            }
        }
    }

    // Check all vertices
    found = false;
    if(radius > 0){
        for(var i=idxA; i<=idxB; i++){

            // Get point
            vec2_1.set(v0, i*w, data[i]);
            vec2_1.add(v0,v0,hfPos);

            vec2_1.sub(dist, circlePos, v0);

            if(vec2_1.squaredLength(dist) < Math.pow(radius, 2)){

                if(justTest){
                    return true;
                }

                found = true;

                var c = this.createContactEquation(hfBody,circleBody,hfShape,circleShape);

                // Construct normal - out of heightfield
                vec2_1.copy(c.normalA, dist);
                vec2_1.normalize(c.normalA,c.normalA);

                vec2_1.scale(c.contactPointB, c.normalA, -radius);
                add(c.contactPointB, c.contactPointB, circlePos);
                sub(c.contactPointB, c.contactPointB, circleBody.position);

                sub(c.contactPointA, v0, hfPos);
                add(c.contactPointA, c.contactPointA, hfPos);
                sub(c.contactPointA, c.contactPointA, hfBody.position);

                this.contactEquations.push(c);

                if(this.enableFriction){
                    this.frictionEquations.push(this.createFrictionFromContact(c));
                }
            }
        }
    }

    if(found){
        return 1;
    }

    return 0;

};

var convexHeightfield_v0 = vec2_1.create(),
    convexHeightfield_v1 = vec2_1.create(),
    convexHeightfield_tilePos = vec2_1.create(),
    convexHeightfield_tempConvexShape = new Convex_1({ vertices: [vec2_1.create(),vec2_1.create(),vec2_1.create(),vec2_1.create()] });
/**
 * @method circleHeightfield
 * @param  {Body}           bi
 * @param  {Circle}         si
 * @param  {Array}          xi
 * @param  {Body}           bj
 * @param  {Heightfield}    sj
 * @param  {Array}          xj
 * @param  {Number}         aj
 */
Narrowphase.prototype[Shape_1.BOX | Shape_1.HEIGHTFIELD] =
Narrowphase.prototype[Shape_1.CONVEX | Shape_1.HEIGHTFIELD] =
Narrowphase.prototype.convexHeightfield = function( convexBody,convexShape,convexPos,convexAngle,
                                                    hfBody,hfShape,hfPos,hfAngle, justTest ){
    var data = hfShape.heights,
        w = hfShape.elementWidth,
        v0 = convexHeightfield_v0,
        v1 = convexHeightfield_v1,
        tilePos = convexHeightfield_tilePos,
        tileConvex = convexHeightfield_tempConvexShape;

    // Get the index of the points to test against
    var idxA = Math.floor( (convexBody.aabb.lowerBound[0] - hfPos[0]) / w ),
        idxB = Math.ceil(  (convexBody.aabb.upperBound[0] - hfPos[0]) / w );

    if(idxA < 0){
        idxA = 0;
    }
    if(idxB >= data.length){
        idxB = data.length-1;
    }

    // Get max and min
    var max = data[idxA],
        min = data[idxB];
    for(var i=idxA; i<idxB; i++){
        if(data[i] < min){
            min = data[i];
        }
        if(data[i] > max){
            max = data[i];
        }
    }

    if(convexBody.aabb.lowerBound[1] > max){
        return justTest ? false : 0;
    }
    var numContacts = 0;

    // Loop over all edges
    // TODO: If possible, construct a convex from several data points (need o check if the points make a convex shape)
    for(var i=idxA; i<idxB; i++){

        // Get points
        vec2_1.set(v0,     i*w, data[i]  );
        vec2_1.set(v1, (i+1)*w, data[i+1]);
        vec2_1.add(v0,v0,hfPos);
        vec2_1.add(v1,v1,hfPos);

        // Construct a convex
        var tileHeight = 100; // todo
        vec2_1.set(tilePos, (v1[0] + v0[0])*0.5, (v1[1] + v0[1] - tileHeight)*0.5);

        vec2_1.sub(tileConvex.vertices[0], v1, tilePos);
        vec2_1.sub(tileConvex.vertices[1], v0, tilePos);
        vec2_1.copy(tileConvex.vertices[2], tileConvex.vertices[1]);
        vec2_1.copy(tileConvex.vertices[3], tileConvex.vertices[0]);
        tileConvex.vertices[2][1] -= tileHeight;
        tileConvex.vertices[3][1] -= tileHeight;

        // Do convex collision
        numContacts += this.convexConvex(   convexBody, convexShape, convexPos, convexAngle,
                                            hfBody, tileConvex, tilePos, 0, justTest);
    }

    return numContacts;
};

var Plane_1 = Plane;

/**
 * Plane shape class. The plane is facing in the Y direction.
 * @class Plane
 * @extends Shape
 * @constructor
 * @param {object} [options] (Note that this options object will be passed on to the {{#crossLink "Shape"}}{{/crossLink}} constructor.)
 */
function Plane(options){
    options = options || {};
    options.type = Shape_1.PLANE;
    Shape_1.call(this, options);
}
Plane.prototype = new Shape_1();
Plane.prototype.constructor = Plane;

/**
 * Compute moment of inertia
 * @method computeMomentOfInertia
 */
Plane.prototype.computeMomentOfInertia = function(mass){
    return 0; // Plane is infinite. The inertia should therefore be infinty but by convention we set 0 here
};

/**
 * Update the bounding radius
 * @method updateBoundingRadius
 */
Plane.prototype.updateBoundingRadius = function(){
    this.boundingRadius = Number.MAX_VALUE;
};

/**
 * @method computeAABB
 * @param  {AABB}   out
 * @param  {Array}  position
 * @param  {Number} angle
 */
Plane.prototype.computeAABB = function(out, position, angle){
    var a = angle % (2 * Math.PI);
    var set = vec2_1.set;
    var max = 1e7;
    var lowerBound = out.lowerBound;
    var upperBound = out.upperBound;

    // Set max bounds
    set(lowerBound, -max, -max);
    set(upperBound,  max,  max);

    if(a === 0){
        // y goes from -inf to 0
        upperBound[1] = 0;
        // set(lowerBound, -max, -max);
        // set(upperBound,  max,  0);

    } else if(a === Math.PI / 2){

        // x goes from 0 to inf
        lowerBound[0] = 0;
        // set(lowerBound, 0, -max);
        // set(upperBound,      max,  max);

    } else if(a === Math.PI){

        // y goes from 0 to inf
        lowerBound[1] = 0;
        // set(lowerBound, -max, 0);
        // set(upperBound,  max, max);

    } else if(a === 3*Math.PI/2){

        // x goes from -inf to 0
        upperBound[0] = 0;
        // set(lowerBound, -max,     -max);
        // set(upperBound,  0,  max);

    }
};

Plane.prototype.updateArea = function(){
    this.area = Number.MAX_VALUE;
};

var intersectPlane_planePointToFrom = vec2_1.create();
var intersectPlane_dir_scaled_with_t = vec2_1.create();
var intersectPlane_hitPoint = vec2_1.create();
var intersectPlane_normal = vec2_1.create();
var intersectPlane_len = vec2_1.create();

/**
 * @method raycast
 * @param  {RayResult} result
 * @param  {Ray} ray
 * @param  {array} position
 * @param  {number} angle
 */
Plane.prototype.raycast = function(result, ray, position, angle){
    var from = ray.from;
    var to = ray.to;
    var direction = ray.direction;
    var planePointToFrom = intersectPlane_planePointToFrom;
    var normal = intersectPlane_normal;
    var len = intersectPlane_len;

    // Get plane normal
    vec2_1.set(normal, 0, 1);
    vec2_1.rotate(normal, normal, angle);

    vec2_1.sub(len, from, position);
    var planeToFrom = vec2_1.dot(len, normal);
    vec2_1.sub(len, to, position);
    var planeToTo = vec2_1.dot(len, normal);

    if(planeToFrom * planeToTo > 0){
        // "from" and "to" are on the same side of the plane... bail out
        return;
    }

    if(vec2_1.squaredDistance(from, to) < planeToFrom * planeToFrom){
        return;
    }

    var n_dot_dir = vec2_1.dot(normal, direction);

    vec2_1.sub(planePointToFrom, from, position);
    var t = -vec2_1.dot(normal, planePointToFrom) / n_dot_dir / ray.length;

    ray.reportIntersection(result, t, normal, -1);
};

var Particle_1 = Particle;

/**
 * Particle shape class.
 * @class Particle
 * @constructor
 * @param {object} [options] (Note that this options object will be passed on to the {{#crossLink "Shape"}}{{/crossLink}} constructor.)
 * @extends Shape
 */
function Particle(options){
    options = options || {};
	options.type = Shape_1.PARTICLE;
    Shape_1.call(this, options);
}
Particle.prototype = new Shape_1();
Particle.prototype.constructor = Particle;

Particle.prototype.computeMomentOfInertia = function(mass){
    return 0; // Can't rotate a particle
};

Particle.prototype.updateBoundingRadius = function(){
    this.boundingRadius = 0;
};

/**
 * @method computeAABB
 * @param  {AABB}   out
 * @param  {Array}  position
 * @param  {Number} angle
 */
Particle.prototype.computeAABB = function(out, position, angle){
    vec2_1.copy(out.lowerBound, position);
    vec2_1.copy(out.upperBound, position);
};

var NaiveBroadphase_1 = NaiveBroadphase;

/**
 * Naive broadphase implementation. Does N^2 tests.
 *
 * @class NaiveBroadphase
 * @constructor
 * @extends Broadphase
 */
function NaiveBroadphase(){
    Broadphase_1.call(this, Broadphase_1.NAIVE);
}
NaiveBroadphase.prototype = new Broadphase_1();
NaiveBroadphase.prototype.constructor = NaiveBroadphase;

/**
 * Get the colliding pairs
 * @method getCollisionPairs
 * @param  {World} world
 * @return {Array}
 */
NaiveBroadphase.prototype.getCollisionPairs = function(world){
    var bodies = world.bodies,
        result = this.result;

    result.length = 0;

    for(var i=0, Ncolliding=bodies.length; i!==Ncolliding; i++){
        var bi = bodies[i];

        for(var j=0; j<i; j++){
            var bj = bodies[j];

            if(Broadphase_1.canCollide(bi,bj) && this.boundingVolumeCheck(bi,bj)){
                result.push(bi,bj);
            }
        }
    }

    return result;
};

/**
 * Returns all the bodies within an AABB.
 * @method aabbQuery
 * @param  {World} world
 * @param  {AABB} aabb
 * @param {array} result An array to store resulting bodies in.
 * @return {array}
 */
NaiveBroadphase.prototype.aabbQuery = function(world, aabb, result){
    result = result || [];

    var bodies = world.bodies;
    for(var i = 0; i < bodies.length; i++){
        var b = bodies[i];

        if(b.aabbNeedsUpdate){
            b.updateAABB();
        }

        if(b.aabb.overlaps(aabb)){
            result.push(b);
        }
    }

    return result;
};

var RotationalVelocityEquation_1 = RotationalVelocityEquation;

/**
 * Syncs rotational velocity of two bodies, or sets a relative velocity (motor).
 *
 * @class RotationalVelocityEquation
 * @constructor
 * @extends Equation
 * @param {Body} bodyA
 * @param {Body} bodyB
 */
function RotationalVelocityEquation(bodyA, bodyB){
    Equation_1.call(this, bodyA, bodyB, -Number.MAX_VALUE, Number.MAX_VALUE);
    this.relativeVelocity = 1;
    this.ratio = 1;
}
RotationalVelocityEquation.prototype = new Equation_1();
RotationalVelocityEquation.prototype.constructor = RotationalVelocityEquation;
RotationalVelocityEquation.prototype.computeB = function(a,b,h){
    var G = this.G;
    G[2] = -1;
    G[5] = this.ratio;

    var GiMf = this.computeGiMf();
    var GW = this.computeGW();
    var B = - GW * b - h*GiMf;

    return B;
};

var RotationalLockEquation_1 = RotationalLockEquation;

/**
 * Locks the relative angle between two bodies. The constraint tries to keep the dot product between two vectors, local in each body, to zero. The local angle in body i is a parameter.
 *
 * @class RotationalLockEquation
 * @constructor
 * @extends Equation
 * @param {Body} bodyA
 * @param {Body} bodyB
 * @param {Object} [options]
 * @param {Number} [options.angle] Angle to add to the local vector in bodyA.
 */
function RotationalLockEquation(bodyA, bodyB, options){
    options = options || {};
    Equation_1.call(this, bodyA, bodyB, -Number.MAX_VALUE, Number.MAX_VALUE);

    /**
     * @property {number} angle
     */
    this.angle = options.angle || 0;

    var G = this.G;
    G[2] =  1;
    G[5] = -1;
}
RotationalLockEquation.prototype = new Equation_1();
RotationalLockEquation.prototype.constructor = RotationalLockEquation;

var worldVectorA = vec2_1.create(),
    worldVectorB = vec2_1.create(),
    xAxis$1 = vec2_1.fromValues(1,0),
    yAxis$2 = vec2_1.fromValues(0,1);
RotationalLockEquation.prototype.computeGq = function(){
    vec2_1.rotate(worldVectorA,xAxis$1,this.bodyA.angle+this.angle);
    vec2_1.rotate(worldVectorB,yAxis$2,this.bodyB.angle);
    return vec2_1.dot(worldVectorA,worldVectorB);
};

var RevoluteConstraint_1 = RevoluteConstraint;

var worldPivotA = vec2_1.create(),
    worldPivotB = vec2_1.create(),
    xAxis$2 = vec2_1.fromValues(1,0),
    yAxis$3 = vec2_1.fromValues(0,1),
    g = vec2_1.create();

/**
 * Connects two bodies at given offset points, letting them rotate relative to each other around this point.
 * @class RevoluteConstraint
 * @constructor
 * @author schteppe
 * @param {Body}    bodyA
 * @param {Body}    bodyB
 * @param {Object}  [options]
 * @param {Array}   [options.worldPivot] A pivot point given in world coordinates. If specified, localPivotA and localPivotB are automatically computed from this value.
 * @param {Array}   [options.localPivotA] The point relative to the center of mass of bodyA which bodyA is constrained to.
 * @param {Array}   [options.localPivotB] See localPivotA.
 * @param {Number}  [options.maxForce] The maximum force that should be applied to constrain the bodies.
 * @extends Constraint
 *
 * @example
 *     // This will create a revolute constraint between two bodies with pivot point in between them.
 *     var bodyA = new Body({ mass: 1, position: [-1, 0] });
 *     var bodyB = new Body({ mass: 1, position: [1, 0] });
 *     var constraint = new RevoluteConstraint(bodyA, bodyB, {
 *         worldPivot: [0, 0]
 *     });
 *     world.addConstraint(constraint);
 *
 *     // Using body-local pivot points, the constraint could have been constructed like this:
 *     var constraint = new RevoluteConstraint(bodyA, bodyB, {
 *         localPivotA: [1, 0],
 *         localPivotB: [-1, 0]
 *     });
 */
function RevoluteConstraint(bodyA, bodyB, options){
    options = options || {};
    Constraint_1.call(this,bodyA,bodyB,Constraint_1.REVOLUTE,options);

    var maxForce = this.maxForce = typeof(options.maxForce) !== "undefined" ? options.maxForce : Number.MAX_VALUE;

    /**
     * @property {Array} pivotA
     */
    this.pivotA = vec2_1.create();

    /**
     * @property {Array} pivotB
     */
    this.pivotB = vec2_1.create();

    if(options.worldPivot){
        // Compute pivotA and pivotB
        vec2_1.sub(this.pivotA, options.worldPivot, bodyA.position);
        vec2_1.sub(this.pivotB, options.worldPivot, bodyB.position);
        // Rotate to local coordinate system
        vec2_1.rotate(this.pivotA, this.pivotA, -bodyA.angle);
        vec2_1.rotate(this.pivotB, this.pivotB, -bodyB.angle);
    } else {
        // Get pivotA and pivotB
        vec2_1.copy(this.pivotA, options.localPivotA);
        vec2_1.copy(this.pivotB, options.localPivotB);
    }

    // Equations to be fed to the solver
    var eqs = this.equations = [
        new Equation_1(bodyA,bodyB,-maxForce,maxForce),
        new Equation_1(bodyA,bodyB,-maxForce,maxForce),
    ];

    var x = eqs[0];
    var y = eqs[1];
    var that = this;

    x.computeGq = function(){
        vec2_1.rotate(worldPivotA, that.pivotA, bodyA.angle);
        vec2_1.rotate(worldPivotB, that.pivotB, bodyB.angle);
        vec2_1.add(g, bodyB.position, worldPivotB);
        vec2_1.sub(g, g, bodyA.position);
        vec2_1.sub(g, g, worldPivotA);
        return vec2_1.dot(g,xAxis$2);
    };

    y.computeGq = function(){
        vec2_1.rotate(worldPivotA, that.pivotA, bodyA.angle);
        vec2_1.rotate(worldPivotB, that.pivotB, bodyB.angle);
        vec2_1.add(g, bodyB.position, worldPivotB);
        vec2_1.sub(g, g, bodyA.position);
        vec2_1.sub(g, g, worldPivotA);
        return vec2_1.dot(g,yAxis$3);
    };

    y.minForce = x.minForce = -maxForce;
    y.maxForce = x.maxForce =  maxForce;

    this.motorEquation = new RotationalVelocityEquation_1(bodyA,bodyB);

    /**
     * Indicates whether the motor is enabled. Use .enableMotor() to enable the constraint motor.
     * @property {Boolean} motorEnabled
     * @readOnly
     */
    this.motorEnabled = false;

    /**
     * The constraint position.
     * @property angle
     * @type {Number}
     * @readOnly
     */
    this.angle = 0;

    /**
     * Set to true to enable lower limit
     * @property lowerLimitEnabled
     * @type {Boolean}
     */
    this.lowerLimitEnabled = false;

    /**
     * Set to true to enable upper limit
     * @property upperLimitEnabled
     * @type {Boolean}
     */
    this.upperLimitEnabled = false;

    /**
     * The lower limit on the constraint angle.
     * @property lowerLimit
     * @type {Boolean}
     */
    this.lowerLimit = 0;

    /**
     * The upper limit on the constraint angle.
     * @property upperLimit
     * @type {Boolean}
     */
    this.upperLimit = 0;

    this.upperLimitEquation = new RotationalLockEquation_1(bodyA,bodyB);
    this.lowerLimitEquation = new RotationalLockEquation_1(bodyA,bodyB);
    this.upperLimitEquation.minForce = 0;
    this.lowerLimitEquation.maxForce = 0;
}
RevoluteConstraint.prototype = new Constraint_1();
RevoluteConstraint.prototype.constructor = RevoluteConstraint;

/**
 * Set the constraint angle limits.
 * @method setLimits
 * @param {number} lower Lower angle limit.
 * @param {number} upper Upper angle limit.
 */
RevoluteConstraint.prototype.setLimits = function (lower, upper) {
    if(typeof(lower) === 'number'){
        this.lowerLimit = lower;
        this.lowerLimitEnabled = true;
    } else {
        this.lowerLimit = lower;
        this.lowerLimitEnabled = false;
    }

    if(typeof(upper) === 'number'){
        this.upperLimit = upper;
        this.upperLimitEnabled = true;
    } else {
        this.upperLimit = upper;
        this.upperLimitEnabled = false;
    }
};

RevoluteConstraint.prototype.update = function(){
    var bodyA =  this.bodyA,
        bodyB =  this.bodyB,
        pivotA = this.pivotA,
        pivotB = this.pivotB,
        eqs =    this.equations,
        normal = eqs[0],
        tangent= eqs[1],
        x = eqs[0],
        y = eqs[1],
        upperLimit = this.upperLimit,
        lowerLimit = this.lowerLimit,
        upperLimitEquation = this.upperLimitEquation,
        lowerLimitEquation = this.lowerLimitEquation;

    var relAngle = this.angle = bodyB.angle - bodyA.angle;

    if(this.upperLimitEnabled && relAngle > upperLimit){
        upperLimitEquation.angle = upperLimit;
        if(eqs.indexOf(upperLimitEquation) === -1){
            eqs.push(upperLimitEquation);
        }
    } else {
        var idx = eqs.indexOf(upperLimitEquation);
        if(idx !== -1){
            eqs.splice(idx,1);
        }
    }

    if(this.lowerLimitEnabled && relAngle < lowerLimit){
        lowerLimitEquation.angle = lowerLimit;
        if(eqs.indexOf(lowerLimitEquation) === -1){
            eqs.push(lowerLimitEquation);
        }
    } else {
        var idx = eqs.indexOf(lowerLimitEquation);
        if(idx !== -1){
            eqs.splice(idx,1);
        }
    }

    /*

    The constraint violation is

        g = xj + rj - xi - ri

    ...where xi and xj are the body positions and ri and rj world-oriented offset vectors. Differentiate:

        gdot = vj + wj x rj - vi - wi x ri

    We split this into x and y directions. (let x and y be unit vectors along the respective axes)

        gdot * x = ( vj + wj x rj - vi - wi x ri ) * x
                 = ( vj*x + (wj x rj)*x -vi*x -(wi x ri)*x
                 = ( vj*x + (rj x x)*wj -vi*x -(ri x x)*wi
                 = [ -x   -(ri x x)   x   (rj x x)] * [vi wi vj wj]
                 = G*W

    ...and similar for y. We have then identified the jacobian entries for x and y directions:

        Gx = [ x   (rj x x)   -x   -(ri x x)]
        Gy = [ y   (rj x y)   -y   -(ri x y)]

     */

    vec2_1.rotate(worldPivotA, pivotA, bodyA.angle);
    vec2_1.rotate(worldPivotB, pivotB, bodyB.angle);

    // todo: these are a bit sparse. We could save some computations on making custom eq.computeGW functions, etc

    x.G[0] = -1;
    x.G[1] =  0;
    x.G[2] = -vec2_1.crossLength(worldPivotA,xAxis$2);
    x.G[3] =  1;
    x.G[4] =  0;
    x.G[5] =  vec2_1.crossLength(worldPivotB,xAxis$2);

    y.G[0] =  0;
    y.G[1] = -1;
    y.G[2] = -vec2_1.crossLength(worldPivotA,yAxis$3);
    y.G[3] =  0;
    y.G[4] =  1;
    y.G[5] =  vec2_1.crossLength(worldPivotB,yAxis$3);
};

/**
 * Enable the rotational motor
 * @method enableMotor
 */
RevoluteConstraint.prototype.enableMotor = function(){
    if(this.motorEnabled){
        return;
    }
    this.equations.push(this.motorEquation);
    this.motorEnabled = true;
};

/**
 * Disable the rotational motor
 * @method disableMotor
 */
RevoluteConstraint.prototype.disableMotor = function(){
    if(!this.motorEnabled){
        return;
    }
    var i = this.equations.indexOf(this.motorEquation);
    this.equations.splice(i,1);
    this.motorEnabled = false;
};

/**
 * Check if the motor is enabled.
 * @method motorIsEnabled
 * @deprecated use property motorEnabled instead.
 * @return {Boolean}
 */
RevoluteConstraint.prototype.motorIsEnabled = function(){
    return !!this.motorEnabled;
};

/**
 * Set the speed of the rotational constraint motor
 * @method setMotorSpeed
 * @param  {Number} speed
 */
RevoluteConstraint.prototype.setMotorSpeed = function(speed){
    if(!this.motorEnabled){
        return;
    }
    var i = this.equations.indexOf(this.motorEquation);
    this.equations[i].relativeVelocity = speed;
};

/**
 * Get the speed of the rotational constraint motor
 * @method getMotorSpeed
 * @return {Number} The current speed, or false if the motor is not enabled.
 */
RevoluteConstraint.prototype.getMotorSpeed = function(){
    if(!this.motorEnabled){
        return false;
    }
    return this.motorEquation.relativeVelocity;
};

var PrismaticConstraint_1 = PrismaticConstraint;

/**
 * Constraint that only allows bodies to move along a line, relative to each other. See <a href="http://www.iforce2d.net/b2dtut/joints-prismatic">this tutorial</a>. Also called "slider constraint".
 *
 * @class PrismaticConstraint
 * @constructor
 * @extends Constraint
 * @author schteppe
 * @param {Body}    bodyA
 * @param {Body}    bodyB
 * @param {Object}  [options]
 * @param {Number}  [options.maxForce]                Max force to be applied by the constraint
 * @param {Array}   [options.localAnchorA]            Body A's anchor point, defined in its own local frame.
 * @param {Array}   [options.localAnchorB]            Body B's anchor point, defined in its own local frame.
 * @param {Array}   [options.localAxisA]              An axis, defined in body A frame, that body B's anchor point may slide along.
 * @param {Boolean} [options.disableRotationalLock]   If set to true, bodyB will be free to rotate around its anchor point.
 * @param {Number}  [options.upperLimit]
 * @param {Number}  [options.lowerLimit]
 * @todo Ability to create using only a point and a worldAxis
 */
function PrismaticConstraint(bodyA, bodyB, options){
    options = options || {};
    Constraint_1.call(this,bodyA,bodyB,Constraint_1.PRISMATIC,options);

    // Get anchors
    var localAnchorA = vec2_1.fromValues(0,0),
        localAxisA = vec2_1.fromValues(1,0),
        localAnchorB = vec2_1.fromValues(0,0);
    if(options.localAnchorA){ vec2_1.copy(localAnchorA, options.localAnchorA); }
    if(options.localAxisA){ vec2_1.copy(localAxisA,   options.localAxisA); }
    if(options.localAnchorB){ vec2_1.copy(localAnchorB, options.localAnchorB); }

    /**
     * @property localAnchorA
     * @type {Array}
     */
    this.localAnchorA = localAnchorA;

    /**
     * @property localAnchorB
     * @type {Array}
     */
    this.localAnchorB = localAnchorB;

    /**
     * @property localAxisA
     * @type {Array}
     */
    this.localAxisA = localAxisA;

    /*

    The constraint violation for the common axis point is

        g = ( xj + rj - xi - ri ) * t   :=  gg*t

    where r are body-local anchor points, and t is a tangent to the constraint axis defined in body i frame.

        gdot =  ( vj + wj x rj - vi - wi x ri ) * t + ( xj + rj - xi - ri ) * ( wi x t )

    Note the use of the chain rule. Now we identify the jacobian

        G*W = [ -t      -ri x t + t x gg     t    rj x t ] * [vi wi vj wj]

    The rotational part is just a rotation lock.

     */

    var maxForce = this.maxForce = typeof(options.maxForce)!=="undefined" ? options.maxForce : Number.MAX_VALUE;

    // Translational part
    var trans = new Equation_1(bodyA,bodyB,-maxForce,maxForce);
    var ri = new vec2_1.create(),
        rj = new vec2_1.create(),
        gg = new vec2_1.create(),
        t =  new vec2_1.create();
    trans.computeGq = function(){
        // g = ( xj + rj - xi - ri ) * t
        return vec2_1.dot(gg,t);
    };
    trans.updateJacobian = function(){
        var G = this.G,
            xi = bodyA.position,
            xj = bodyB.position;
        vec2_1.rotate(ri,localAnchorA,bodyA.angle);
        vec2_1.rotate(rj,localAnchorB,bodyB.angle);
        vec2_1.add(gg,xj,rj);
        vec2_1.sub(gg,gg,xi);
        vec2_1.sub(gg,gg,ri);
        vec2_1.rotate(t,localAxisA,bodyA.angle+Math.PI/2);

        G[0] = -t[0];
        G[1] = -t[1];
        G[2] = -vec2_1.crossLength(ri,t) + vec2_1.crossLength(t,gg);
        G[3] = t[0];
        G[4] = t[1];
        G[5] = vec2_1.crossLength(rj,t);
    };
    this.equations.push(trans);

    // Rotational part
    if(!options.disableRotationalLock){
        var rot = new RotationalLockEquation_1(bodyA,bodyB,-maxForce,maxForce);
        this.equations.push(rot);
    }

    /**
     * The position of anchor A relative to anchor B, along the constraint axis.
     * @property position
     * @type {Number}
     */
    this.position = 0;

    // Is this one used at all?
    this.velocity = 0;

    /**
     * Set to true to enable lower limit.
     * @property lowerLimitEnabled
     * @type {Boolean}
     */
    this.lowerLimitEnabled = typeof(options.lowerLimit)!=="undefined" ? true : false;

    /**
     * Set to true to enable upper limit.
     * @property upperLimitEnabled
     * @type {Boolean}
     */
    this.upperLimitEnabled = typeof(options.upperLimit)!=="undefined" ? true : false;

    /**
     * Lower constraint limit. The constraint position is forced to be larger than this value.
     * @property lowerLimit
     * @type {Number}
     */
    this.lowerLimit = typeof(options.lowerLimit)!=="undefined" ? options.lowerLimit : 0;

    /**
     * Upper constraint limit. The constraint position is forced to be smaller than this value.
     * @property upperLimit
     * @type {Number}
     */
    this.upperLimit = typeof(options.upperLimit)!=="undefined" ? options.upperLimit : 1;

    // Equations used for limits
    this.upperLimitEquation = new ContactEquation_1(bodyA,bodyB);
    this.lowerLimitEquation = new ContactEquation_1(bodyA,bodyB);

    // Set max/min forces
    this.upperLimitEquation.minForce = this.lowerLimitEquation.minForce = 0;
    this.upperLimitEquation.maxForce = this.lowerLimitEquation.maxForce = maxForce;

    /**
     * Equation used for the motor.
     * @property motorEquation
     * @type {Equation}
     */
    this.motorEquation = new Equation_1(bodyA,bodyB);

    /**
     * The current motor state. Enable or disable the motor using .enableMotor
     * @property motorEnabled
     * @type {Boolean}
     */
    this.motorEnabled = false;

    /**
     * Set the target speed for the motor.
     * @property motorSpeed
     * @type {Number}
     */
    this.motorSpeed = 0;

    var that = this;
    var motorEquation = this.motorEquation;
    var old = motorEquation.computeGW;
    motorEquation.computeGq = function(){ return 0; };
    motorEquation.computeGW = function(){
        var G = this.G,
            bi = this.bodyA,
            bj = this.bodyB,
            vi = bi.velocity,
            vj = bj.velocity,
            wi = bi.angularVelocity,
            wj = bj.angularVelocity;
        return this.gmult(G,vi,wi,vj,wj) + that.motorSpeed;
    };
}

PrismaticConstraint.prototype = new Constraint_1();
PrismaticConstraint.prototype.constructor = PrismaticConstraint;

var worldAxisA = vec2_1.create(),
    worldAnchorA = vec2_1.create(),
    worldAnchorB = vec2_1.create(),
    orientedAnchorA = vec2_1.create(),
    orientedAnchorB = vec2_1.create(),
    tmp$2 = vec2_1.create();

/**
 * Update the constraint equations. Should be done if any of the bodies changed position, before solving.
 * @method update
 */
PrismaticConstraint.prototype.update = function(){
    var eqs = this.equations,
        trans = eqs[0],
        upperLimit = this.upperLimit,
        lowerLimit = this.lowerLimit,
        upperLimitEquation = this.upperLimitEquation,
        lowerLimitEquation = this.lowerLimitEquation,
        bodyA = this.bodyA,
        bodyB = this.bodyB,
        localAxisA = this.localAxisA,
        localAnchorA = this.localAnchorA,
        localAnchorB = this.localAnchorB;

    trans.updateJacobian();

    // Transform local things to world
    vec2_1.rotate(worldAxisA,      localAxisA,      bodyA.angle);
    vec2_1.rotate(orientedAnchorA, localAnchorA,    bodyA.angle);
    vec2_1.add(worldAnchorA,       orientedAnchorA, bodyA.position);
    vec2_1.rotate(orientedAnchorB, localAnchorB,    bodyB.angle);
    vec2_1.add(worldAnchorB,       orientedAnchorB, bodyB.position);

    var relPosition = this.position = vec2_1.dot(worldAnchorB,worldAxisA) - vec2_1.dot(worldAnchorA,worldAxisA);

    // Motor
    if(this.motorEnabled){
        // G = [ a     a x ri   -a   -a x rj ]
        var G = this.motorEquation.G;
        G[0] = worldAxisA[0];
        G[1] = worldAxisA[1];
        G[2] = vec2_1.crossLength(worldAxisA,orientedAnchorB);
        G[3] = -worldAxisA[0];
        G[4] = -worldAxisA[1];
        G[5] = -vec2_1.crossLength(worldAxisA,orientedAnchorA);
    }

    /*
        Limits strategy:
        Add contact equation, with normal along the constraint axis.
        min/maxForce is set so the constraint is repulsive in the correct direction.
        Some offset is added to either equation.contactPointA or .contactPointB to get the correct upper/lower limit.

                 ^
                 |
      upperLimit x
                 |    ------
         anchorB x<---|  B |
                 |    |    |
        ------   |    ------
        |    |   |
        |  A |-->x anchorA
        ------   |
                 x lowerLimit
                 |
                axis
     */


    if(this.upperLimitEnabled && relPosition > upperLimit){
        // Update contact constraint normal, etc
        vec2_1.scale(upperLimitEquation.normalA, worldAxisA, -1);
        vec2_1.sub(upperLimitEquation.contactPointA, worldAnchorA, bodyA.position);
        vec2_1.sub(upperLimitEquation.contactPointB, worldAnchorB, bodyB.position);
        vec2_1.scale(tmp$2,worldAxisA,upperLimit);
        vec2_1.add(upperLimitEquation.contactPointA,upperLimitEquation.contactPointA,tmp$2);
        if(eqs.indexOf(upperLimitEquation) === -1){
            eqs.push(upperLimitEquation);
        }
    } else {
        var idx = eqs.indexOf(upperLimitEquation);
        if(idx !== -1){
            eqs.splice(idx,1);
        }
    }

    if(this.lowerLimitEnabled && relPosition < lowerLimit){
        // Update contact constraint normal, etc
        vec2_1.scale(lowerLimitEquation.normalA, worldAxisA, 1);
        vec2_1.sub(lowerLimitEquation.contactPointA, worldAnchorA, bodyA.position);
        vec2_1.sub(lowerLimitEquation.contactPointB, worldAnchorB, bodyB.position);
        vec2_1.scale(tmp$2,worldAxisA,lowerLimit);
        vec2_1.sub(lowerLimitEquation.contactPointB,lowerLimitEquation.contactPointB,tmp$2);
        if(eqs.indexOf(lowerLimitEquation) === -1){
            eqs.push(lowerLimitEquation);
        }
    } else {
        var idx = eqs.indexOf(lowerLimitEquation);
        if(idx !== -1){
            eqs.splice(idx,1);
        }
    }
};

/**
 * Enable the motor
 * @method enableMotor
 */
PrismaticConstraint.prototype.enableMotor = function(){
    if(this.motorEnabled){
        return;
    }
    this.equations.push(this.motorEquation);
    this.motorEnabled = true;
};

/**
 * Disable the rotational motor
 * @method disableMotor
 */
PrismaticConstraint.prototype.disableMotor = function(){
    if(!this.motorEnabled){
        return;
    }
    var i = this.equations.indexOf(this.motorEquation);
    this.equations.splice(i,1);
    this.motorEnabled = false;
};

/**
 * Set the constraint limits.
 * @method setLimits
 * @param {number} lower Lower limit.
 * @param {number} upper Upper limit.
 */
PrismaticConstraint.prototype.setLimits = function (lower, upper) {
    if(typeof(lower) === 'number'){
        this.lowerLimit = lower;
        this.lowerLimitEnabled = true;
    } else {
        this.lowerLimit = lower;
        this.lowerLimitEnabled = false;
    }

    if(typeof(upper) === 'number'){
        this.upperLimit = upper;
        this.upperLimitEnabled = true;
    } else {
        this.upperLimit = upper;
        this.upperLimitEnabled = false;
    }
};

var SAPBroadphase_1 = SAPBroadphase;

/**
 * Sweep and prune broadphase along one axis.
 *
 * @class SAPBroadphase
 * @constructor
 * @extends Broadphase
 */
function SAPBroadphase(){
    Broadphase_1.call(this,Broadphase_1.SAP);

    /**
     * List of bodies currently in the broadphase.
     * @property axisList
     * @type {Array}
     */
    this.axisList = [];

    /**
     * The axis to sort along. 0 means x-axis and 1 y-axis. If your bodies are more spread out over the X axis, set axisIndex to 0, and you will gain some performance.
     * @property axisIndex
     * @type {Number}
     */
    this.axisIndex = 0;

    var that = this;
    this._addBodyHandler = function(e){
        that.axisList.push(e.body);
    };

    this._removeBodyHandler = function(e){
        // Remove from list
        var idx = that.axisList.indexOf(e.body);
        if(idx !== -1){
            that.axisList.splice(idx,1);
        }
    };
}
SAPBroadphase.prototype = new Broadphase_1();
SAPBroadphase.prototype.constructor = SAPBroadphase;

/**
 * Change the world
 * @method setWorld
 * @param {World} world
 */
SAPBroadphase.prototype.setWorld = function(world){
    // Clear the old axis array
    this.axisList.length = 0;

    // Add all bodies from the new world
    Utils_1.appendArray(this.axisList, world.bodies);

    // Remove old handlers, if any
    world
        .off("addBody",this._addBodyHandler)
        .off("removeBody",this._removeBodyHandler);

    // Add handlers to update the list of bodies.
    world.on("addBody",this._addBodyHandler).on("removeBody",this._removeBodyHandler);

    this.world = world;
};

/**
 * Sorts bodies along an axis.
 * @method sortAxisList
 * @param {Array} a
 * @param {number} axisIndex
 * @return {Array}
 */
SAPBroadphase.sortAxisList = function(a, axisIndex){
    axisIndex = axisIndex|0;
    for(var i=1,l=a.length; i<l; i++) {
        var v = a[i];
        for(var j=i - 1;j>=0;j--) {
            if(a[j].aabb.lowerBound[axisIndex] <= v.aabb.lowerBound[axisIndex]){
                break;
            }
            a[j+1] = a[j];
        }
        a[j+1] = v;
    }
    return a;
};

SAPBroadphase.prototype.sortList = function(){
    var bodies = this.axisList,
    axisIndex = this.axisIndex;

    // Sort the lists
    SAPBroadphase.sortAxisList(bodies, axisIndex);
};

/**
 * Get the colliding pairs
 * @method getCollisionPairs
 * @param  {World} world
 * @return {Array}
 */
SAPBroadphase.prototype.getCollisionPairs = function(world){
    var bodies = this.axisList,
        result = this.result,
        axisIndex = this.axisIndex;

    result.length = 0;

    // Update all AABBs if needed
    var l = bodies.length;
    while(l--){
        var b = bodies[l];
        if(b.aabbNeedsUpdate){
            b.updateAABB();
        }
    }

    // Sort the lists
    this.sortList();

    // Look through the X list
    for(var i=0, N=bodies.length|0; i!==N; i++){
        var bi = bodies[i];

        for(var j=i+1; j<N; j++){
            var bj = bodies[j];

            // Bounds overlap?
            var overlaps = (bj.aabb.lowerBound[axisIndex] <= bi.aabb.upperBound[axisIndex]);
            if(!overlaps){
                break;
            }

            if(Broadphase_1.canCollide(bi,bj) && this.boundingVolumeCheck(bi,bj)){
                result.push(bi,bj);
            }
        }
    }

    return result;
};

/**
 * Returns all the bodies within an AABB.
 * @method aabbQuery
 * @param  {World} world
 * @param  {AABB} aabb
 * @param {array} result An array to store resulting bodies in.
 * @return {array}
 */
SAPBroadphase.prototype.aabbQuery = function(world, aabb, result){
    result = result || [];

    this.sortList();

    var axisIndex = this.axisIndex;
    var axis = 'x';
    if(axisIndex === 1){ axis = 'y'; }
    if(axisIndex === 2){ axis = 'z'; }

    var axisList = this.axisList;
    var lower = aabb.lowerBound[axis];
    var upper = aabb.upperBound[axis];
    for(var i = 0; i < axisList.length; i++){
        var b = axisList[i];

        if(b.aabbNeedsUpdate){
            b.updateAABB();
        }

        if(b.aabb.overlaps(aabb)){
            result.push(b);
        }
    }

    return result;
};

var Spring_1 = Spring;

/**
 * A spring, connecting two bodies. The Spring explicitly adds force and angularForce to the bodies and does therefore not put load on the constraint solver.
 *
 * @class Spring
 * @constructor
 * @param {Body} bodyA
 * @param {Body} bodyB
 * @param {Object} [options]
 * @param {number} [options.stiffness=100]  Spring constant (see Hookes Law). A number >= 0.
 * @param {number} [options.damping=1]      A number >= 0. Default: 1
 * @param {Array}  [options.localAnchorA]   Where to hook the spring to body A, in local body coordinates. Defaults to the body center.
 * @param {Array}  [options.localAnchorB]
 * @param {Array}  [options.worldAnchorA]   Where to hook the spring to body A, in world coordinates. Overrides the option "localAnchorA" if given.
 * @param {Array}  [options.worldAnchorB]
 */
function Spring(bodyA, bodyB, options){
    options = Utils_1.defaults(options,{
        stiffness: 100,
        damping: 1,
    });

    /**
     * Stiffness of the spring.
     * @property stiffness
     * @type {number}
     */
    this.stiffness = options.stiffness;

    /**
     * Damping of the spring.
     * @property damping
     * @type {number}
     */
    this.damping = options.damping;

    /**
     * First connected body.
     * @property bodyA
     * @type {Body}
     */
    this.bodyA = bodyA;

    /**
     * Second connected body.
     * @property bodyB
     * @type {Body}
     */
    this.bodyB = bodyB;
}

/**
 * Apply the spring force to the connected bodies.
 * @method applyForce
 */
Spring.prototype.applyForce = function(){
    // To be implemented by subclasses
};

var TopDownVehicle_1 = TopDownVehicle;

/**
 * @class TopDownVehicle
 * @constructor
 * @param {Body} chassisBody A dynamic body, already added to the world.
 * @param {Object} [options]
 *
 * @example
 *
 *     // Create a dynamic body for the chassis
 *     var chassisBody = new Body({
 *         mass: 1
 *     });
 *     var boxShape = new Box({ width: 0.5, height: 1 });
 *     chassisBody.addShape(boxShape);
 *     world.addBody(chassisBody);
 *
 *     // Create the vehicle
 *     var vehicle = new TopDownVehicle(chassisBody);
 *
 *     // Add one front wheel and one back wheel - we don't actually need four :)
 *     var frontWheel = vehicle.addWheel({
 *         localPosition: [0, 0.5] // front
 *     });
 *     frontWheel.setSideFriction(4);
 *
 *     // Back wheel
 *     var backWheel = vehicle.addWheel({
 *         localPosition: [0, -0.5] // back
 *     });
 *     backWheel.setSideFriction(3); // Less side friction on back wheel makes it easier to drift
 *     vehicle.addToWorld(world);
 *
 *     // Steer value zero means straight forward. Positive is left and negative right.
 *     frontWheel.steerValue = Math.PI / 16;
 *
 *     // Engine force forward
 *     backWheel.engineForce = 10;
 *     backWheel.setBrakeForce(0);
 */
function TopDownVehicle(chassisBody, options){
    options = options || {};

    /**
     * @property {Body} chassisBody
     */
    this.chassisBody = chassisBody;

    /**
     * @property {Array} wheels
     */
    this.wheels = [];

    // A dummy body to constrain the chassis to
    this.groundBody = new Body_1({ mass: 0 });

    this.world = null;

    var that = this;
    this.preStepCallback = function(){
        that.update();
    };
}

/**
 * @method addToWorld
 * @param {World} world
 */
TopDownVehicle.prototype.addToWorld = function(world){
    this.world = world;
    world.addBody(this.groundBody);
    world.on('preStep', this.preStepCallback);
    for (var i = 0; i < this.wheels.length; i++) {
        var wheel = this.wheels[i];
        world.addConstraint(wheel);
    }
};

/**
 * @method removeFromWorld
 * @param {World} world
 */
TopDownVehicle.prototype.removeFromWorld = function(){
    var world = this.world;
    world.removeBody(this.groundBody);
    world.off('preStep', this.preStepCallback);
    for (var i = 0; i < this.wheels.length; i++) {
        var wheel = this.wheels[i];
        world.removeConstraint(wheel);
    }
    this.world = null;
};

/**
 * @method addWheel
 * @param {object} [wheelOptions]
 * @return {WheelConstraint}
 */
TopDownVehicle.prototype.addWheel = function(wheelOptions){
    var wheel = new WheelConstraint(this,wheelOptions);
    this.wheels.push(wheel);
    return wheel;
};

/**
 * @method update
 */
TopDownVehicle.prototype.update = function(){
    for (var i = 0; i < this.wheels.length; i++) {
        this.wheels[i].update();
    }
};

/**
 * @class WheelConstraint
 * @constructor
 * @extends {Constraint}
 * @param {Vehicle} vehicle
 * @param {object} [options]
 * @param {Array} [options.localForwardVector]The local wheel forward vector in local body space. Default is zero.
 * @param {Array} [options.localPosition] The local position of the wheen in the chassis body. Default is zero - the center of the body.
 * @param {Array} [options.sideFriction=5] The max friction force in the sideways direction.
 */
function WheelConstraint(vehicle, options){
    options = options || {};

    this.vehicle = vehicle;

    this.forwardEquation = new FrictionEquation_1(vehicle.chassisBody, vehicle.groundBody);

    this.sideEquation = new FrictionEquation_1(vehicle.chassisBody, vehicle.groundBody);

    /**
     * @property {number} steerValue
     */
    this.steerValue = 0;

    /**
     * @property {number} engineForce
     */
    this.engineForce = 0;

    this.setSideFriction(options.sideFriction !== undefined ? options.sideFriction : 5);

    /**
     * @property {Array} localForwardVector
     */
    this.localForwardVector = vec2_1.fromValues(0, 1);
    if(options.localForwardVector){
        vec2_1.copy(this.localForwardVector, options.localForwardVector);
    }

    /**
     * @property {Array} localPosition
     */
    this.localPosition = vec2_1.fromValues(0, 0);
    if(options.localPosition){
        vec2_1.copy(this.localPosition, options.localPosition);
    }

    Constraint_1.apply(this, vehicle.chassisBody, vehicle.groundBody);

    this.equations.push(
        this.forwardEquation,
        this.sideEquation
    );

    this.setBrakeForce(0);
}
WheelConstraint.prototype = new Constraint_1();

/**
 * @method setForwardFriction
 */
WheelConstraint.prototype.setBrakeForce = function(force){
    this.forwardEquation.setSlipForce(force);
};

/**
 * @method setSideFriction
 */
WheelConstraint.prototype.setSideFriction = function(force){
    this.sideEquation.setSlipForce(force);
};

var worldVelocity = vec2_1.create();
var relativePoint = vec2_1.create();

/**
 * @method getSpeed
 */
WheelConstraint.prototype.getSpeed = function(){
    this.vehicle.chassisBody.vectorToWorldFrame(relativePoint, this.localForwardVector);
    this.vehicle.chassisBody.getVelocityAtPoint(worldVelocity, relativePoint);
    return vec2_1.dot(worldVelocity, relativePoint);
};

var tmpVec = vec2_1.create();

/**
 * @method update
 */
WheelConstraint.prototype.update = function(){

    // Directional
    this.vehicle.chassisBody.vectorToWorldFrame(this.forwardEquation.t, this.localForwardVector);
    vec2_1.rotate(this.sideEquation.t, this.localForwardVector, Math.PI / 2);
    this.vehicle.chassisBody.vectorToWorldFrame(this.sideEquation.t, this.sideEquation.t);

    vec2_1.rotate(this.forwardEquation.t, this.forwardEquation.t, this.steerValue);
    vec2_1.rotate(this.sideEquation.t, this.sideEquation.t, this.steerValue);

    // Attachment point
    this.vehicle.chassisBody.toWorldFrame(this.forwardEquation.contactPointB, this.localPosition);
    vec2_1.copy(this.sideEquation.contactPointB, this.forwardEquation.contactPointB);

    this.vehicle.chassisBody.vectorToWorldFrame(this.forwardEquation.contactPointA, this.localPosition);
    vec2_1.copy(this.sideEquation.contactPointA, this.forwardEquation.contactPointA);

    // Add engine force
    vec2_1.normalize(tmpVec, this.forwardEquation.t);
    vec2_1.scale(tmpVec, tmpVec, this.engineForce);

    this.vehicle.chassisBody.applyForce(tmpVec, this.forwardEquation.contactPointA);
};

var LinearSpring_1 = LinearSpring;

/**
 * A spring, connecting two bodies.
 *
 * The Spring explicitly adds force and angularForce to the bodies.
 *
 * @class LinearSpring
 * @extends Spring
 * @constructor
 * @param {Body} bodyA
 * @param {Body} bodyB
 * @param {Object} [options]
 * @param {number} [options.restLength]   A number > 0. Default is the current distance between the world anchor points.
 * @param {number} [options.stiffness=100]  Spring constant (see Hookes Law). A number >= 0.
 * @param {number} [options.damping=1]      A number >= 0. Default: 1
 * @param {Array}  [options.worldAnchorA]   Where to hook the spring to body A, in world coordinates. Overrides the option "localAnchorA" if given.
 * @param {Array}  [options.worldAnchorB]
 * @param {Array}  [options.localAnchorA]   Where to hook the spring to body A, in local body coordinates. Defaults to the body center.
 * @param {Array}  [options.localAnchorB]
 */
function LinearSpring(bodyA,bodyB,options){
    options = options || {};

    Spring_1.call(this, bodyA, bodyB, options);

    /**
     * Anchor for bodyA in local bodyA coordinates.
     * @property localAnchorA
     * @type {Array}
     */
    this.localAnchorA = vec2_1.fromValues(0,0);

    /**
     * Anchor for bodyB in local bodyB coordinates.
     * @property localAnchorB
     * @type {Array}
     */
    this.localAnchorB = vec2_1.fromValues(0,0);

    if(options.localAnchorA){ vec2_1.copy(this.localAnchorA, options.localAnchorA); }
    if(options.localAnchorB){ vec2_1.copy(this.localAnchorB, options.localAnchorB); }
    if(options.worldAnchorA){ this.setWorldAnchorA(options.worldAnchorA); }
    if(options.worldAnchorB){ this.setWorldAnchorB(options.worldAnchorB); }

    var worldAnchorA = vec2_1.create();
    var worldAnchorB = vec2_1.create();
    this.getWorldAnchorA(worldAnchorA);
    this.getWorldAnchorB(worldAnchorB);
    var worldDistance = vec2_1.distance(worldAnchorA, worldAnchorB);

    /**
     * Rest length of the spring.
     * @property restLength
     * @type {number}
     */
    this.restLength = typeof(options.restLength) === "number" ? options.restLength : worldDistance;
}
LinearSpring.prototype = new Spring_1();
LinearSpring.prototype.constructor = LinearSpring;

/**
 * Set the anchor point on body A, using world coordinates.
 * @method setWorldAnchorA
 * @param {Array} worldAnchorA
 */
LinearSpring.prototype.setWorldAnchorA = function(worldAnchorA){
    this.bodyA.toLocalFrame(this.localAnchorA, worldAnchorA);
};

/**
 * Set the anchor point on body B, using world coordinates.
 * @method setWorldAnchorB
 * @param {Array} worldAnchorB
 */
LinearSpring.prototype.setWorldAnchorB = function(worldAnchorB){
    this.bodyB.toLocalFrame(this.localAnchorB, worldAnchorB);
};

/**
 * Get the anchor point on body A, in world coordinates.
 * @method getWorldAnchorA
 * @param {Array} result The vector to store the result in.
 */
LinearSpring.prototype.getWorldAnchorA = function(result){
    this.bodyA.toWorldFrame(result, this.localAnchorA);
};

/**
 * Get the anchor point on body B, in world coordinates.
 * @method getWorldAnchorB
 * @param {Array} result The vector to store the result in.
 */
LinearSpring.prototype.getWorldAnchorB = function(result){
    this.bodyB.toWorldFrame(result, this.localAnchorB);
};

var applyForce_r =              vec2_1.create(),
    applyForce_r_unit =         vec2_1.create(),
    applyForce_u =              vec2_1.create(),
    applyForce_f =              vec2_1.create(),
    applyForce_worldAnchorA =   vec2_1.create(),
    applyForce_worldAnchorB =   vec2_1.create(),
    applyForce_ri =             vec2_1.create(),
    applyForce_rj =             vec2_1.create(),
    applyForce_tmp =            vec2_1.create();

/**
 * Apply the spring force to the connected bodies.
 * @method applyForce
 */
LinearSpring.prototype.applyForce = function(){
    var k = this.stiffness,
        d = this.damping,
        l = this.restLength,
        bodyA = this.bodyA,
        bodyB = this.bodyB,
        r = applyForce_r,
        r_unit = applyForce_r_unit,
        u = applyForce_u,
        f = applyForce_f,
        tmp = applyForce_tmp;

    var worldAnchorA = applyForce_worldAnchorA,
        worldAnchorB = applyForce_worldAnchorB,
        ri = applyForce_ri,
        rj = applyForce_rj;

    // Get world anchors
    this.getWorldAnchorA(worldAnchorA);
    this.getWorldAnchorB(worldAnchorB);

    // Get offset points
    vec2_1.sub(ri, worldAnchorA, bodyA.position);
    vec2_1.sub(rj, worldAnchorB, bodyB.position);

    // Compute distance vector between world anchor points
    vec2_1.sub(r, worldAnchorB, worldAnchorA);
    var rlen = vec2_1.len(r);
    vec2_1.normalize(r_unit,r);

    //console.log(rlen)
    //console.log("A",vec2.str(worldAnchorA),"B",vec2.str(worldAnchorB))

    // Compute relative velocity of the anchor points, u
    vec2_1.sub(u, bodyB.velocity, bodyA.velocity);
    vec2_1.crossZV(tmp, bodyB.angularVelocity, rj);
    vec2_1.add(u, u, tmp);
    vec2_1.crossZV(tmp, bodyA.angularVelocity, ri);
    vec2_1.sub(u, u, tmp);

    // F = - k * ( x - L ) - D * ( u )
    vec2_1.scale(f, r_unit, -k*(rlen-l) - d*vec2_1.dot(u,r_unit));

    // Add forces to bodies
    vec2_1.sub( bodyA.force, bodyA.force, f);
    vec2_1.add( bodyB.force, bodyB.force, f);

    // Angular force
    var ri_x_f = vec2_1.crossLength(ri, f);
    var rj_x_f = vec2_1.crossLength(rj, f);
    bodyA.angularForce -= ri_x_f;
    bodyB.angularForce += rj_x_f;
};

var RotationalSpring_1 = RotationalSpring;

/**
 * A rotational spring, connecting two bodies rotation. This spring explicitly adds angularForce (torque) to the bodies.
 *
 * The spring can be combined with a {{#crossLink "RevoluteConstraint"}}{{/crossLink}} to make, for example, a mouse trap.
 *
 * @class RotationalSpring
 * @extends Spring
 * @constructor
 * @param {Body} bodyA
 * @param {Body} bodyB
 * @param {Object} [options]
 * @param {number} [options.restAngle] The relative angle of bodies at which the spring is at rest. If not given, it's set to the current relative angle between the bodies.
 * @param {number} [options.stiffness=100] Spring constant (see Hookes Law). A number >= 0.
 * @param {number} [options.damping=1] A number >= 0.
 */
function RotationalSpring(bodyA, bodyB, options){
    options = options || {};

    Spring_1.call(this, bodyA, bodyB, options);

    /**
     * Rest angle of the spring.
     * @property restAngle
     * @type {number}
     */
    this.restAngle = typeof(options.restAngle) === "number" ? options.restAngle : bodyB.angle - bodyA.angle;
}
RotationalSpring.prototype = new Spring_1();
RotationalSpring.prototype.constructor = RotationalSpring;

/**
 * Apply the spring force to the connected bodies.
 * @method applyForce
 */
RotationalSpring.prototype.applyForce = function(){
    var k = this.stiffness,
        d = this.damping,
        l = this.restAngle,
        bodyA = this.bodyA,
        bodyB = this.bodyB,
        x = bodyB.angle - bodyA.angle,
        u = bodyB.angularVelocity - bodyA.angularVelocity;

    var torque = - k * (x - l) - d * u * 0;

    bodyA.angularForce -= torque;
    bodyB.angularForce += torque;
};

var _args = [
	[
		"p2@0.7.1",
		"/mnt/c/work/git/temp/lance"
	]
];
var _from = "p2@0.7.1";
var _id = "p2@0.7.1";
var _inBundle = false;
var _integrity = "sha1-JfJHTZvDptMUCh2iamfJ4RislUM=";
var _location = "/p2";
var _phantomChildren = {
};
var _requested = {
	type: "version",
	registry: true,
	raw: "p2@0.7.1",
	name: "p2",
	escapedName: "p2",
	rawSpec: "0.7.1",
	saveSpec: null,
	fetchSpec: "0.7.1"
};
var _requiredBy = [
	"/"
];
var _resolved = "https://registry.npmjs.org/p2/-/p2-0.7.1.tgz";
var _spec = "0.7.1";
var _where = "/mnt/c/work/git/temp/lance";
var author = {
	name: "Stefan Hedman",
	email: "schteppe@gmail.com",
	url: "http://steffe.se"
};
var bugs = {
	url: "https://github.com/schteppe/p2.js/issues"
};
var dependencies = {
	"poly-decomp": "0.1.1"
};
var description = "A JavaScript 2D physics engine.";
var devDependencies = {
	grunt: "^0.4.5",
	"grunt-browserify": "~2.0.1",
	"grunt-contrib-concat": "^0.4.0",
	"grunt-contrib-jshint": "^0.11.2",
	"grunt-contrib-nodeunit": "^0.4.1",
	"grunt-contrib-uglify": "~0.4.0",
	"grunt-contrib-watch": "~0.5.0"
};
var engines = {
	node: "*"
};
var homepage = "https://github.com/schteppe/p2.js#readme";
var keywords = [
	"p2.js",
	"p2",
	"physics",
	"engine",
	"2d"
];
var licenses = [
	{
		type: "MIT"
	}
];
var main = "./src/p2.js";
var name = "p2";
var repository = {
	type: "git",
	url: "git+https://github.com/schteppe/p2.js.git"
};
var version = "0.7.1";
var _package = {
	_args: _args,
	_from: _from,
	_id: _id,
	_inBundle: _inBundle,
	_integrity: _integrity,
	_location: _location,
	_phantomChildren: _phantomChildren,
	_requested: _requested,
	_requiredBy: _requiredBy,
	_resolved: _resolved,
	_spec: _spec,
	_where: _where,
	author: author,
	bugs: bugs,
	dependencies: dependencies,
	description: description,
	devDependencies: devDependencies,
	engines: engines,
	homepage: homepage,
	keywords: keywords,
	licenses: licenses,
	main: main,
	name: name,
	repository: repository,
	version: version
};

var _package$1 = /*#__PURE__*/Object.freeze({
    _args: _args,
    _from: _from,
    _id: _id,
    _inBundle: _inBundle,
    _integrity: _integrity,
    _location: _location,
    _phantomChildren: _phantomChildren,
    _requested: _requested,
    _requiredBy: _requiredBy,
    _resolved: _resolved,
    _spec: _spec,
    _where: _where,
    author: author,
    bugs: bugs,
    dependencies: dependencies,
    description: description,
    devDependencies: devDependencies,
    engines: engines,
    homepage: homepage,
    keywords: keywords,
    licenses: licenses,
    main: main,
    name: name,
    repository: repository,
    version: version,
    default: _package
});

var OverlapKeeperRecord_1 = OverlapKeeperRecord;

/**
 * Overlap data container for the OverlapKeeper
 * @class OverlapKeeperRecord
 * @constructor
 * @param {Body} bodyA
 * @param {Shape} shapeA
 * @param {Body} bodyB
 * @param {Shape} shapeB
 */
function OverlapKeeperRecord(bodyA, shapeA, bodyB, shapeB){
    /**
     * @property {Shape} shapeA
     */
    this.shapeA = shapeA;
    /**
     * @property {Shape} shapeB
     */
    this.shapeB = shapeB;
    /**
     * @property {Body} bodyA
     */
    this.bodyA = bodyA;
    /**
     * @property {Body} bodyB
     */
    this.bodyB = bodyB;
}

/**
 * Set the data for the record
 * @method set
 * @param {Body} bodyA
 * @param {Shape} shapeA
 * @param {Body} bodyB
 * @param {Shape} shapeB
 */
OverlapKeeperRecord.prototype.set = function(bodyA, shapeA, bodyB, shapeB){
    OverlapKeeperRecord.call(this, bodyA, shapeA, bodyB, shapeB);
};

var OverlapKeeperRecordPool_1 = OverlapKeeperRecordPool;

/**
 * @class
 */
function OverlapKeeperRecordPool() {
	Pool_1.apply(this, arguments);
}
OverlapKeeperRecordPool.prototype = new Pool_1();
OverlapKeeperRecordPool.prototype.constructor = OverlapKeeperRecordPool;

/**
 * @method create
 * @return {OverlapKeeperRecord}
 */
OverlapKeeperRecordPool.prototype.create = function () {
	return new OverlapKeeperRecord_1();
};

/**
 * @method destroy
 * @param {OverlapKeeperRecord} record
 * @return {OverlapKeeperRecordPool}
 */
OverlapKeeperRecordPool.prototype.destroy = function (record) {
	record.bodyA = record.bodyB = record.shapeA = record.shapeB = null;
	return this;
};

var OverlapKeeper_1 = OverlapKeeper;

/**
 * Keeps track of overlaps in the current state and the last step state.
 * @class OverlapKeeper
 * @constructor
 */
function OverlapKeeper() {
    this.overlappingShapesLastState = new TupleDictionary_1();
    this.overlappingShapesCurrentState = new TupleDictionary_1();
    this.recordPool = new OverlapKeeperRecordPool_1({ size: 16 });
    this.tmpDict = new TupleDictionary_1();
    this.tmpArray1 = [];
}

/**
 * Ticks one step forward in time. This will move the current overlap state to the "old" overlap state, and create a new one as current.
 * @method tick
 */
OverlapKeeper.prototype.tick = function() {
    var last = this.overlappingShapesLastState;
    var current = this.overlappingShapesCurrentState;

    // Save old objects into pool
    var l = last.keys.length;
    while(l--){
        var key = last.keys[l];
        var lastObject = last.getByKey(key);
        var currentObject = current.getByKey(key);
        if(lastObject){
            // The record is only used in the "last" dict, and will be removed. We might as well pool it.
            this.recordPool.release(lastObject);
        }
    }

    // Clear last object
    last.reset();

    // Transfer from new object to old
    last.copy(current);

    // Clear current object
    current.reset();
};

/**
 * @method setOverlapping
 * @param {Body} bodyA
 * @param {Body} shapeA
 * @param {Body} bodyB
 * @param {Body} shapeB
 */
OverlapKeeper.prototype.setOverlapping = function(bodyA, shapeA, bodyB, shapeB) {
    var last = this.overlappingShapesLastState;
    var current = this.overlappingShapesCurrentState;

    // Store current contact state
    if(!current.get(shapeA.id, shapeB.id)){
        var data = this.recordPool.get();
        data.set(bodyA, shapeA, bodyB, shapeB);
        current.set(shapeA.id, shapeB.id, data);
    }
};

OverlapKeeper.prototype.getNewOverlaps = function(result){
    return this.getDiff(this.overlappingShapesLastState, this.overlappingShapesCurrentState, result);
};

OverlapKeeper.prototype.getEndOverlaps = function(result){
    return this.getDiff(this.overlappingShapesCurrentState, this.overlappingShapesLastState, result);
};

/**
 * Checks if two bodies are currently overlapping.
 * @method bodiesAreOverlapping
 * @param  {Body} bodyA
 * @param  {Body} bodyB
 * @return {boolean}
 */
OverlapKeeper.prototype.bodiesAreOverlapping = function(bodyA, bodyB){
    var current = this.overlappingShapesCurrentState;
    var l = current.keys.length;
    while(l--){
        var key = current.keys[l];
        var data = current.data[key];
        if((data.bodyA === bodyA && data.bodyB === bodyB) || data.bodyA === bodyB && data.bodyB === bodyA){
            return true;
        }
    }
    return false;
};

OverlapKeeper.prototype.getDiff = function(dictA, dictB, result){
    var result = result || [];
    var last = dictA;
    var current = dictB;

    result.length = 0;

    var l = current.keys.length;
    while(l--){
        var key = current.keys[l];
        var data = current.data[key];

        if(!data){
            throw new Error('Key '+key+' had no data!');
        }

        var lastData = last.data[key];
        if(!lastData){
            // Not overlapping in last state, but in current.
            result.push(data);
        }
    }

    return result;
};

OverlapKeeper.prototype.isNewOverlap = function(shapeA, shapeB){
    var idA = shapeA.id|0,
        idB = shapeB.id|0;
    var last = this.overlappingShapesLastState;
    var current = this.overlappingShapesCurrentState;
    // Not in last but in new
    return !!!last.get(idA, idB) && !!current.get(idA, idB);
};

OverlapKeeper.prototype.getNewBodyOverlaps = function(result){
    this.tmpArray1.length = 0;
    var overlaps = this.getNewOverlaps(this.tmpArray1);
    return this.getBodyDiff(overlaps, result);
};

OverlapKeeper.prototype.getEndBodyOverlaps = function(result){
    this.tmpArray1.length = 0;
    var overlaps = this.getEndOverlaps(this.tmpArray1);
    return this.getBodyDiff(overlaps, result);
};

OverlapKeeper.prototype.getBodyDiff = function(overlaps, result){
    result = result || [];
    var accumulator = this.tmpDict;

    var l = overlaps.length;

    while(l--){
        var data = overlaps[l];

        // Since we use body id's for the accumulator, these will be a subset of the original one
        accumulator.set(data.bodyA.id|0, data.bodyB.id|0, data);
    }

    l = accumulator.keys.length;
    while(l--){
        var data = accumulator.getByKey(accumulator.keys[l]);
        if(data){
            result.push(data.bodyA, data.bodyB);
        }
    }

    accumulator.reset();

    return result;
};

var Island_1 = Island;

/**
 * An island of bodies connected with equations.
 * @class Island
 * @constructor
 */
function Island(){

    /**
     * Current equations in this island.
     * @property equations
     * @type {Array}
     */
    this.equations = [];

    /**
     * Current bodies in this island.
     * @property bodies
     * @type {Array}
     */
    this.bodies = [];
}

/**
 * Clean this island from bodies and equations.
 * @method reset
 */
Island.prototype.reset = function(){
    this.equations.length = this.bodies.length = 0;
};

var bodyIds = [];

/**
 * Get all unique bodies in this island.
 * @method getBodies
 * @return {Array} An array of Body
 */
Island.prototype.getBodies = function(result){
    var bodies = result || [],
        eqs = this.equations;
    bodyIds.length = 0;
    for(var i=0; i!==eqs.length; i++){
        var eq = eqs[i];
        if(bodyIds.indexOf(eq.bodyA.id)===-1){
            bodies.push(eq.bodyA);
            bodyIds.push(eq.bodyA.id);
        }
        if(bodyIds.indexOf(eq.bodyB.id)===-1){
            bodies.push(eq.bodyB);
            bodyIds.push(eq.bodyB.id);
        }
    }
    return bodies;
};

/**
 * Check if the entire island wants to sleep.
 * @method wantsToSleep
 * @return {Boolean}
 */
Island.prototype.wantsToSleep = function(){
    for(var i=0; i<this.bodies.length; i++){
        var b = this.bodies[i];
        if(b.type === Body_1.DYNAMIC && !b.wantsToSleep){
            return false;
        }
    }
    return true;
};

/**
 * Make all bodies in the island sleep.
 * @method sleep
 */
Island.prototype.sleep = function(){
    for(var i=0; i<this.bodies.length; i++){
        var b = this.bodies[i];
        b.sleep();
    }
    return true;
};

var IslandNode_1 = IslandNode;

/**
 * Holds a body and keeps track of some additional properties needed for graph traversal.
 * @class IslandNode
 * @constructor
 * @param {Body} body
 */
function IslandNode(body){

	/**
	 * The body that is contained in this node.
	 * @property {Body} body
	 */
    this.body = body;

    /**
     * Neighboring IslandNodes
     * @property {Array} neighbors
     */
    this.neighbors = [];

    /**
     * Equations connected to this node.
     * @property {Array} equations
     */
    this.equations = [];

    /**
     * If this node was visiting during the graph traversal.
     * @property visited
     * @type {Boolean}
     */
    this.visited = false;
}

/**
 * Clean this node from bodies and equations.
 * @method reset
 */
IslandNode.prototype.reset = function(){
    this.equations.length = 0;
    this.neighbors.length = 0;
    this.visited = false;
    this.body = null;
};

var IslandNodePool_1 = IslandNodePool;

/**
 * @class
 */
function IslandNodePool() {
	Pool_1.apply(this, arguments);
}
IslandNodePool.prototype = new Pool_1();
IslandNodePool.prototype.constructor = IslandNodePool;

/**
 * @method create
 * @return {IslandNode}
 */
IslandNodePool.prototype.create = function () {
	return new IslandNode_1();
};

/**
 * @method destroy
 * @param {IslandNode} node
 * @return {IslandNodePool}
 */
IslandNodePool.prototype.destroy = function (node) {
	node.reset();
	return this;
};

var IslandPool_1 = IslandPool;

/**
 * @class
 */
function IslandPool() {
	Pool_1.apply(this, arguments);
}
IslandPool.prototype = new Pool_1();
IslandPool.prototype.constructor = IslandPool;

/**
 * @method create
 * @return {Island}
 */
IslandPool.prototype.create = function () {
	return new Island_1();
};

/**
 * @method destroy
 * @param {Island} island
 * @return {IslandPool}
 */
IslandPool.prototype.destroy = function (island) {
	island.reset();
	return this;
};

var IslandManager_1 = IslandManager;

/**
 * Splits the system of bodies and equations into independent islands
 *
 * @class IslandManager
 * @constructor
 * @param {Object} [options]
 * @extends Solver
 */
function IslandManager(options){

    /**
     * @property nodePool
     * @type {IslandNodePool}
     */
    this.nodePool = new IslandNodePool_1({ size: 16 });

    /**
     * @property islandPool
     * @type {IslandPool}
     */
    this.islandPool = new IslandPool_1({ size: 8 });

    /**
     * The equations to split. Manually fill this array before running .split().
     * @property {Array} equations
     */
    this.equations = [];

    /**
     * The resulting {{#crossLink "Island"}}{{/crossLink}}s.
     * @property {Array} islands
     */
    this.islands = [];

    /**
     * The resulting graph nodes.
     * @property {Array} nodes
     */
    this.nodes = [];

    /**
     * The node queue, used when traversing the graph of nodes.
     * @private
     * @property {Array} queue
     */
    this.queue = [];
}

/**
 * Get an unvisited node from a list of nodes.
 * @static
 * @method getUnvisitedNode
 * @param  {Array} nodes
 * @return {IslandNode|boolean} The node if found, else false.
 */
IslandManager.getUnvisitedNode = function(nodes){
    var Nnodes = nodes.length;
    for(var i=0; i!==Nnodes; i++){
        var node = nodes[i];
        if(!node.visited && node.body.type === Body_1.DYNAMIC){
            return node;
        }
    }
    return false;
};

/**
 * Visit a node.
 * @method visit
 * @param  {IslandNode} node
 * @param  {Array} bds
 * @param  {Array} eqs
 */
IslandManager.prototype.visit = function (node,bds,eqs){
    bds.push(node.body);
    var Neqs = node.equations.length;
    for(var i=0; i!==Neqs; i++){
        var eq = node.equations[i];
        if(eqs.indexOf(eq) === -1){ // Already added?
            eqs.push(eq);
        }
    }
};

/**
 * Runs the search algorithm, starting at a root node. The resulting bodies and equations will be stored in the provided arrays.
 * @method bfs
 * @param  {IslandNode} root The node to start from
 * @param  {Array} bds  An array to append resulting Bodies to.
 * @param  {Array} eqs  An array to append resulting Equations to.
 */
IslandManager.prototype.bfs = function(root,bds,eqs){

    // Reset the visit queue
    var queue = this.queue;
    queue.length = 0;

    // Add root node to queue
    queue.push(root);
    root.visited = true;
    this.visit(root,bds,eqs);

    // Process all queued nodes
    while(queue.length) {

        // Get next node in the queue
        var node = queue.pop();

        // Visit unvisited neighboring nodes
        var child;
        while((child = IslandManager.getUnvisitedNode(node.neighbors))) {
            child.visited = true;
            this.visit(child,bds,eqs);

            // Only visit the children of this node if it's dynamic
            if(child.body.type === Body_1.DYNAMIC){
                queue.push(child);
            }
        }
    }
};

/**
 * Split the world into independent islands. The result is stored in .islands.
 * @method split
 * @param  {World} world
 * @return {Array} The generated islands
 */
IslandManager.prototype.split = function(world){
    var bodies = world.bodies,
        nodes = this.nodes,
        equations = this.equations;

    // Move old nodes to the node pool
    while(nodes.length){
        this.nodePool.release(nodes.pop());
    }

    // Create needed nodes, reuse if possible
    for(var i=0; i!==bodies.length; i++){
        var node = this.nodePool.get();
        node.body = bodies[i];
        nodes.push(node);
        // if(this.nodePool.length){
        //     var node = this.nodePool.pop();
        //     node.reset();
        //     node.body = bodies[i];
        //     nodes.push(node);
        // } else {
        //     nodes.push(new IslandNode(bodies[i]));
        // }
    }

    // Add connectivity data. Each equation connects 2 bodies.
    for(var k=0; k!==equations.length; k++){
        var eq=equations[k],
            i=bodies.indexOf(eq.bodyA),
            j=bodies.indexOf(eq.bodyB),
            ni=nodes[i],
            nj=nodes[j];
        ni.neighbors.push(nj);
        nj.neighbors.push(ni);
        ni.equations.push(eq);
        nj.equations.push(eq);
    }

    // Move old islands to the island pool
    var islands = this.islands;
    for(var i=0; i<islands.length; i++){
        this.islandPool.release(islands[i]);
    }
    islands.length = 0;

    // Get islands
    var child;
    while((child = IslandManager.getUnvisitedNode(nodes))){

        // Create new island
        var island = this.islandPool.get();

        // Get all equations and bodies in this island
        this.bfs(child, island.bodies, island.equations);

        islands.push(island);
    }

    return islands;
};

var require$$43 = getCjsExportFromNamespace(_package$1);

var World_1 = World;

/**
 * The dynamics world, where all bodies and constraints live.
 *
 * @class World
 * @constructor
 * @param {Object} [options]
 * @param {Solver} [options.solver] Defaults to GSSolver.
 * @param {Array} [options.gravity] Defaults to y=-9.78.
 * @param {Broadphase} [options.broadphase] Defaults to SAPBroadphase
 * @param {Boolean} [options.islandSplit=true]
 * @extends EventEmitter
 *
 * @example
 *     var world = new World({
 *         gravity: [0, -10],
 *         broadphase: new SAPBroadphase()
 *     });
 *     world.addBody(new Body());
 */
function World(options){
    EventEmitter_1.apply(this);

    options = options || {};

    /**
     * All springs in the world. To add a spring to the world, use {{#crossLink "World/addSpring:method"}}{{/crossLink}}.
     *
     * @property springs
     * @type {Array}
     */
    this.springs = [];

    /**
     * All bodies in the world. To add a body to the world, use {{#crossLink "World/addBody:method"}}{{/crossLink}}.
     * @property {Array} bodies
     */
    this.bodies = [];

    /**
     * Disabled body collision pairs. See {{#crossLink "World/disableBodyCollision:method"}}.
     * @private
     * @property {Array} disabledBodyCollisionPairs
     */
    this.disabledBodyCollisionPairs = [];

    /**
     * The solver used to satisfy constraints and contacts. Default is {{#crossLink "GSSolver"}}{{/crossLink}}.
     * @property {Solver} solver
     */
    this.solver = options.solver || new GSSolver_1();

    /**
     * The narrowphase to use to generate contacts.
     *
     * @property narrowphase
     * @type {Narrowphase}
     */
    this.narrowphase = new Narrowphase_1(this);

    /**
     * The island manager of this world.
     * @property {IslandManager} islandManager
     */
    this.islandManager = new IslandManager_1();

    /**
     * Gravity in the world. This is applied on all bodies in the beginning of each step().
     *
     * @property gravity
     * @type {Array}
     */
    this.gravity = vec2_1.fromValues(0, -9.78);
    if(options.gravity){
        vec2_1.copy(this.gravity, options.gravity);
    }

    /**
     * Gravity to use when approximating the friction max force (mu*mass*gravity).
     * @property {Number} frictionGravity
     */
    this.frictionGravity = vec2_1.length(this.gravity) || 10;

    /**
     * Set to true if you want .frictionGravity to be automatically set to the length of .gravity.
     * @property {Boolean} useWorldGravityAsFrictionGravity
     * @default true
     */
    this.useWorldGravityAsFrictionGravity = true;

    /**
     * If the length of .gravity is zero, and .useWorldGravityAsFrictionGravity=true, then switch to using .frictionGravity for friction instead. This fallback is useful for gravityless games.
     * @property {Boolean} useFrictionGravityOnZeroGravity
     * @default true
     */
    this.useFrictionGravityOnZeroGravity = true;

    /**
     * The broadphase algorithm to use.
     *
     * @property broadphase
     * @type {Broadphase}
     */
    this.broadphase = options.broadphase || new SAPBroadphase_1();
    this.broadphase.setWorld(this);

    /**
     * User-added constraints.
     *
     * @property constraints
     * @type {Array}
     */
    this.constraints = [];

    /**
     * Dummy default material in the world, used in .defaultContactMaterial
     * @property {Material} defaultMaterial
     */
    this.defaultMaterial = new Material_1();

    /**
     * The default contact material to use, if no contact material was set for the colliding materials.
     * @property {ContactMaterial} defaultContactMaterial
     */
    this.defaultContactMaterial = new ContactMaterial_1(this.defaultMaterial,this.defaultMaterial);

    /**
     * For keeping track of what time step size we used last step
     * @property lastTimeStep
     * @type {Number}
     */
    this.lastTimeStep = 1/60;

    /**
     * Enable to automatically apply spring forces each step.
     * @property applySpringForces
     * @type {Boolean}
     * @default true
     */
    this.applySpringForces = true;

    /**
     * Enable to automatically apply body damping each step.
     * @property applyDamping
     * @type {Boolean}
     * @default true
     */
    this.applyDamping = true;

    /**
     * Enable to automatically apply gravity each step.
     * @property applyGravity
     * @type {Boolean}
     * @default true
     */
    this.applyGravity = true;

    /**
     * Enable/disable constraint solving in each step.
     * @property solveConstraints
     * @type {Boolean}
     * @default true
     */
    this.solveConstraints = true;

    /**
     * The ContactMaterials added to the World.
     * @property contactMaterials
     * @type {Array}
     */
    this.contactMaterials = [];

    /**
     * World time.
     * @property time
     * @type {Number}
     */
    this.time = 0.0;
    this.accumulator = 0;

    /**
     * Is true during step().
     * @property {Boolean} stepping
     */
    this.stepping = false;

    /**
     * Bodies that are scheduled to be removed at the end of the step.
     * @property {Array} bodiesToBeRemoved
     * @private
     */
    this.bodiesToBeRemoved = [];

    /**
     * Whether to enable island splitting. Island splitting can be an advantage for both precision and performance. See {{#crossLink "IslandManager"}}{{/crossLink}}.
     * @property {Boolean} islandSplit
     * @default true
     */
    this.islandSplit = typeof(options.islandSplit)!=="undefined" ? !!options.islandSplit : true;

    /**
     * Set to true if you want to the world to emit the "impact" event. Turning this off could improve performance.
     * @property emitImpactEvent
     * @type {Boolean}
     * @default true
     */
    this.emitImpactEvent = true;

    // Id counters
    this._constraintIdCounter = 0;
    this._bodyIdCounter = 0;

    /**
     * Fired after the step().
     * @event postStep
     */
    this.postStepEvent = {
        type : "postStep"
    };

    /**
     * Fired when a body is added to the world.
     * @event addBody
     * @param {Body} body
     */
    this.addBodyEvent = {
        type : "addBody",
        body : null
    };

    /**
     * Fired when a body is removed from the world.
     * @event removeBody
     * @param {Body} body
     */
    this.removeBodyEvent = {
        type : "removeBody",
        body : null
    };

    /**
     * Fired when a spring is added to the world.
     * @event addSpring
     * @param {Spring} spring
     */
    this.addSpringEvent = {
        type : "addSpring",
        spring : null
    };

    /**
     * Fired when a first contact is created between two bodies. This event is fired after the step has been done.
     * @event impact
     * @param {Body} bodyA
     * @param {Body} bodyB
     */
    this.impactEvent = {
        type: "impact",
        bodyA : null,
        bodyB : null,
        shapeA : null,
        shapeB : null,
        contactEquation : null
    };

    /**
     * Fired after the Broadphase has collected collision pairs in the world.
     * Inside the event handler, you can modify the pairs array as you like, to
     * prevent collisions between objects that you don't want.
     * @event postBroadphase
     * @param {Array} pairs An array of collision pairs. If this array is [body1,body2,body3,body4], then the body pairs 1,2 and 3,4 would advance to narrowphase.
     */
    this.postBroadphaseEvent = {
        type: "postBroadphase",
        pairs: null
    };

    /**
     * How to deactivate bodies during simulation. Possible modes are: {{#crossLink "World/NO_SLEEPING:property"}}World.NO_SLEEPING{{/crossLink}}, {{#crossLink "World/BODY_SLEEPING:property"}}World.BODY_SLEEPING{{/crossLink}} and {{#crossLink "World/ISLAND_SLEEPING:property"}}World.ISLAND_SLEEPING{{/crossLink}}.
     * If sleeping is enabled, you might need to {{#crossLink "Body/wakeUp:method"}}wake up{{/crossLink}} the bodies if they fall asleep when they shouldn't. If you want to enable sleeping in the world, but want to disable it for a particular body, see {{#crossLink "Body/allowSleep:property"}}Body.allowSleep{{/crossLink}}.
     * @property sleepMode
     * @type {number}
     * @default World.NO_SLEEPING
     */
    this.sleepMode = World.NO_SLEEPING;

    /**
     * Fired when two shapes starts start to overlap. Fired in the narrowphase, during step.
     * @event beginContact
     * @param {Shape} shapeA
     * @param {Shape} shapeB
     * @param {Body}  bodyA
     * @param {Body}  bodyB
     * @param {Array} contactEquations
     */
    this.beginContactEvent = {
        type: "beginContact",
        shapeA: null,
        shapeB: null,
        bodyA: null,
        bodyB: null,
        contactEquations: []
    };

    /**
     * Fired when two shapes stop overlapping, after the narrowphase (during step).
     * @event endContact
     * @param {Shape} shapeA
     * @param {Shape} shapeB
     * @param {Body}  bodyA
     * @param {Body}  bodyB
     */
    this.endContactEvent = {
        type: "endContact",
        shapeA: null,
        shapeB: null,
        bodyA: null,
        bodyB: null
    };

    /**
     * Fired just before equations are added to the solver to be solved. Can be used to control what equations goes into the solver.
     * @event preSolve
     * @param {Array} contactEquations  An array of contacts to be solved.
     * @param {Array} frictionEquations An array of friction equations to be solved.
     */
    this.preSolveEvent = {
        type: "preSolve",
        contactEquations: null,
        frictionEquations: null
    };

    // For keeping track of overlapping shapes
    this.overlappingShapesLastState = { keys:[] };
    this.overlappingShapesCurrentState = { keys:[] };

    /**
     * @property {OverlapKeeper} overlapKeeper
     */
    this.overlapKeeper = new OverlapKeeper_1();
}
World.prototype = new Object(EventEmitter_1.prototype);
World.prototype.constructor = World;

/**
 * Never deactivate bodies.
 * @static
 * @property {number} NO_SLEEPING
 */
World.NO_SLEEPING = 1;

/**
 * Deactivate individual bodies if they are sleepy.
 * @static
 * @property {number} BODY_SLEEPING
 */
World.BODY_SLEEPING = 2;

/**
 * Deactivates bodies that are in contact, if all of them are sleepy. Note that you must enable {{#crossLink "World/islandSplit:property"}}.islandSplit{{/crossLink}} for this to work.
 * @static
 * @property {number} ISLAND_SLEEPING
 */
World.ISLAND_SLEEPING = 4;

/**
 * Add a constraint to the simulation.
 *
 * @method addConstraint
 * @param {Constraint} constraint
 * @example
 *     var constraint = new LockConstraint(bodyA, bodyB);
 *     world.addConstraint(constraint);
 */
World.prototype.addConstraint = function(constraint){
    this.constraints.push(constraint);
};

/**
 * Add a ContactMaterial to the simulation.
 * @method addContactMaterial
 * @param {ContactMaterial} contactMaterial
 */
World.prototype.addContactMaterial = function(contactMaterial){
    this.contactMaterials.push(contactMaterial);
};

/**
 * Removes a contact material
 *
 * @method removeContactMaterial
 * @param {ContactMaterial} cm
 */
World.prototype.removeContactMaterial = function(cm){
    var idx = this.contactMaterials.indexOf(cm);
    if(idx!==-1){
        Utils_1.splice(this.contactMaterials,idx,1);
    }
};

/**
 * Get a contact material given two materials
 * @method getContactMaterial
 * @param {Material} materialA
 * @param {Material} materialB
 * @return {ContactMaterial} The matching ContactMaterial, or false on fail.
 * @todo Use faster hash map to lookup from material id's
 */
World.prototype.getContactMaterial = function(materialA,materialB){
    var cmats = this.contactMaterials;
    for(var i=0, N=cmats.length; i!==N; i++){
        var cm = cmats[i];
        if( (cm.materialA.id === materialA.id) && (cm.materialB.id === materialB.id) ||
            (cm.materialA.id === materialB.id) && (cm.materialB.id === materialA.id) ){
            return cm;
        }
    }
    return false;
};

/**
 * Removes a constraint
 *
 * @method removeConstraint
 * @param {Constraint} constraint
 */
World.prototype.removeConstraint = function(constraint){
    var idx = this.constraints.indexOf(constraint);
    if(idx!==-1){
        Utils_1.splice(this.constraints,idx,1);
    }
};

var step_r = vec2_1.create(),
    step_runit = vec2_1.create(),
    step_u = vec2_1.create(),
    step_f = vec2_1.create(),
    step_fhMinv = vec2_1.create(),
    step_velodt = vec2_1.create(),
    step_mg = vec2_1.create(),
    xiw = vec2_1.fromValues(0,0),
    xjw = vec2_1.fromValues(0,0),
    zero = vec2_1.fromValues(0,0),
    interpvelo = vec2_1.fromValues(0,0);

/**
 * Step the physics world forward in time.
 *
 * There are two modes. The simple mode is fixed timestepping without interpolation. In this case you only use the first argument. The second case uses interpolation. In that you also provide the time since the function was last used, as well as the maximum fixed timesteps to take.
 *
 * @method step
 * @param {Number} dt                       The fixed time step size to use.
 * @param {Number} [timeSinceLastCalled=0]  The time elapsed since the function was last called.
 * @param {Number} [maxSubSteps=10]         Maximum number of fixed steps to take per function call.
 *
 * @example
 *     // Simple fixed timestepping without interpolation
 *     var fixedTimeStep = 1 / 60;
 *     var world = new World();
 *     var body = new Body({ mass: 1 });
 *     world.addBody(body);
 *
 *     function animate(){
 *         requestAnimationFrame(animate);
 *         world.step(fixedTimeStep);
 *         renderBody(body.position, body.angle);
 *     }
 *
 *     // Start animation loop
 *     requestAnimationFrame(animate);
 *
 * @example
 *     // Fixed timestepping with interpolation
 *     var maxSubSteps = 10;
 *     var lastTimeSeconds;
 *
 *     function animate(t){
 *         requestAnimationFrame(animate);
 *         timeSeconds = t / 1000;
 *         lastTimeSeconds = lastTimeSeconds || timeSeconds;
 *
 *         deltaTime = timeSeconds - lastTimeSeconds;
 *         world.step(fixedTimeStep, deltaTime, maxSubSteps);
 *
 *         renderBody(body.interpolatedPosition, body.interpolatedAngle);
 *     }
 *
 *     // Start animation loop
 *     requestAnimationFrame(animate);
 *
 * @see http://bulletphysics.org/mediawiki-1.5.8/index.php/Stepping_The_World
 */
World.prototype.step = function(dt,timeSinceLastCalled,maxSubSteps){
    maxSubSteps = maxSubSteps || 10;
    timeSinceLastCalled = timeSinceLastCalled || 0;

    if(timeSinceLastCalled === 0){ // Fixed, simple stepping

        this.internalStep(dt);

        // Increment time
        this.time += dt;

    } else {

        this.accumulator += timeSinceLastCalled;
        var substeps = 0;
        while (this.accumulator >= dt && substeps < maxSubSteps) {
            // Do fixed steps to catch up
            this.internalStep(dt);
            this.time += dt;
            this.accumulator -= dt;
            substeps++;
        }

        var t = (this.accumulator % dt) / dt;
        for(var j=0; j!==this.bodies.length; j++){
            var b = this.bodies[j];
            vec2_1.lerp(b.interpolatedPosition, b.previousPosition, b.position, t);
            b.interpolatedAngle = b.previousAngle + t * (b.angle - b.previousAngle);
        }
    }
};

var endOverlaps = [];

/**
 * Make a fixed step.
 * @method internalStep
 * @param  {number} dt
 * @private
 */
World.prototype.internalStep = function(dt){
    this.stepping = true;

    var Nsprings = this.springs.length,
        springs = this.springs,
        bodies = this.bodies,
        g = this.gravity,
        solver = this.solver,
        Nbodies = this.bodies.length,
        broadphase = this.broadphase,
        np = this.narrowphase,
        constraints = this.constraints,
        mg = step_mg,
        scale = vec2_1.scale,
        add = vec2_1.add,
        rotate = vec2_1.rotate,
        islandManager = this.islandManager;

    this.overlapKeeper.tick();

    this.lastTimeStep = dt;

    // Update approximate friction gravity.
    if(this.useWorldGravityAsFrictionGravity){
        var gravityLen = vec2_1.length(this.gravity);
        if(!(gravityLen === 0 && this.useFrictionGravityOnZeroGravity)){
            // Nonzero gravity. Use it.
            this.frictionGravity = gravityLen;
        }
    }

    // Add gravity to bodies
    if(this.applyGravity){
        for(var i=0; i!==Nbodies; i++){
            var b = bodies[i],
                fi = b.force;
            if(b.type !== Body_1.DYNAMIC || b.sleepState === Body_1.SLEEPING){
                continue;
            }
            vec2_1.scale(mg,g,b.mass*b.gravityScale); // F=m*g
            add(fi,fi,mg);
        }
    }

    // Add spring forces
    if(this.applySpringForces){
        for(var i=0; i!==Nsprings; i++){
            var s = springs[i];
            s.applyForce();
        }
    }

    if(this.applyDamping){
        for(var i=0; i!==Nbodies; i++){
            var b = bodies[i];
            if(b.type === Body_1.DYNAMIC){
                b.applyDamping(dt);
            }
        }
    }

    // Broadphase
    var result = broadphase.getCollisionPairs(this);

    // Remove ignored collision pairs
    var ignoredPairs = this.disabledBodyCollisionPairs;
    for(var i=ignoredPairs.length-2; i>=0; i-=2){
        for(var j=result.length-2; j>=0; j-=2){
            if( (ignoredPairs[i]   === result[j] && ignoredPairs[i+1] === result[j+1]) ||
                (ignoredPairs[i+1] === result[j] && ignoredPairs[i]   === result[j+1])){
                result.splice(j,2);
            }
        }
    }

    // Remove constrained pairs with collideConnected == false
    var Nconstraints = constraints.length;
    for(i=0; i!==Nconstraints; i++){
        var c = constraints[i];
        if(!c.collideConnected){
            for(var j=result.length-2; j>=0; j-=2){
                if( (c.bodyA === result[j] && c.bodyB === result[j+1]) ||
                    (c.bodyB === result[j] && c.bodyA === result[j+1])){
                    result.splice(j,2);
                }
            }
        }
    }

    // postBroadphase event
    this.postBroadphaseEvent.pairs = result;
    this.emit(this.postBroadphaseEvent);
    this.postBroadphaseEvent.pairs = null;

    // Narrowphase
    np.reset(this);
    for(var i=0, Nresults=result.length; i!==Nresults; i+=2){
        var bi = result[i],
            bj = result[i+1];

        // Loop over all shapes of body i
        for(var k=0, Nshapesi=bi.shapes.length; k!==Nshapesi; k++){
            var si = bi.shapes[k],
                xi = si.position,
                ai = si.angle;

            // All shapes of body j
            for(var l=0, Nshapesj=bj.shapes.length; l!==Nshapesj; l++){
                var sj = bj.shapes[l],
                    xj = sj.position,
                    aj = sj.angle;

                var cm = this.defaultContactMaterial;
                if(si.material && sj.material){
                    var tmp = this.getContactMaterial(si.material,sj.material);
                    if(tmp){
                        cm = tmp;
                    }
                }

                this.runNarrowphase(np,bi,si,xi,ai,bj,sj,xj,aj,cm,this.frictionGravity);
            }
        }
    }

    // Wake up bodies
    for(var i=0; i!==Nbodies; i++){
        var body = bodies[i];
        if(body._wakeUpAfterNarrowphase){
            body.wakeUp();
            body._wakeUpAfterNarrowphase = false;
        }
    }

    // Emit end overlap events
    if(this.has('endContact')){
        this.overlapKeeper.getEndOverlaps(endOverlaps);
        var e = this.endContactEvent;
        var l = endOverlaps.length;
        while(l--){
            var data = endOverlaps[l];
            e.shapeA = data.shapeA;
            e.shapeB = data.shapeB;
            e.bodyA = data.bodyA;
            e.bodyB = data.bodyB;
            this.emit(e);
        }
        endOverlaps.length = 0;
    }

    var preSolveEvent = this.preSolveEvent;
    preSolveEvent.contactEquations = np.contactEquations;
    preSolveEvent.frictionEquations = np.frictionEquations;
    this.emit(preSolveEvent);
    preSolveEvent.contactEquations = preSolveEvent.frictionEquations = null;

    // update constraint equations
    var Nconstraints = constraints.length;
    for(i=0; i!==Nconstraints; i++){
        constraints[i].update();
    }

    if(np.contactEquations.length || np.frictionEquations.length || Nconstraints){
        if(this.islandSplit){
            // Split into islands
            islandManager.equations.length = 0;
            Utils_1.appendArray(islandManager.equations, np.contactEquations);
            Utils_1.appendArray(islandManager.equations, np.frictionEquations);
            for(i=0; i!==Nconstraints; i++){
                Utils_1.appendArray(islandManager.equations, constraints[i].equations);
            }
            islandManager.split(this);

            for(var i=0; i!==islandManager.islands.length; i++){
                var island = islandManager.islands[i];
                if(island.equations.length){
                    solver.solveIsland(dt,island);
                }
            }

        } else {

            // Add contact equations to solver
            solver.addEquations(np.contactEquations);
            solver.addEquations(np.frictionEquations);

            // Add user-defined constraint equations
            for(i=0; i!==Nconstraints; i++){
                solver.addEquations(constraints[i].equations);
            }

            if(this.solveConstraints){
                solver.solve(dt,this);
            }

            solver.removeAllEquations();
        }
    }

    // Step forward
    for(var i=0; i!==Nbodies; i++){
        var body = bodies[i];

        // if(body.sleepState !== Body.SLEEPING && body.type !== Body.STATIC){
        body.integrate(dt);
        // }
    }

    // Reset force
    for(var i=0; i!==Nbodies; i++){
        bodies[i].setZeroForce();
    }

    // Emit impact event
    if(this.emitImpactEvent && this.has('impact')){
        var ev = this.impactEvent;
        for(var i=0; i!==np.contactEquations.length; i++){
            var eq = np.contactEquations[i];
            if(eq.firstImpact){
                ev.bodyA = eq.bodyA;
                ev.bodyB = eq.bodyB;
                ev.shapeA = eq.shapeA;
                ev.shapeB = eq.shapeB;
                ev.contactEquation = eq;
                this.emit(ev);
            }
        }
    }

    // Sleeping update
    if(this.sleepMode === World.BODY_SLEEPING){
        for(i=0; i!==Nbodies; i++){
            bodies[i].sleepTick(this.time, false, dt);
        }
    } else if(this.sleepMode === World.ISLAND_SLEEPING && this.islandSplit){

        // Tell all bodies to sleep tick but dont sleep yet
        for(i=0; i!==Nbodies; i++){
            bodies[i].sleepTick(this.time, true, dt);
        }

        // Sleep islands
        for(var i=0; i<this.islandManager.islands.length; i++){
            var island = this.islandManager.islands[i];
            if(island.wantsToSleep()){
                island.sleep();
            }
        }
    }

    this.stepping = false;

    // Remove bodies that are scheduled for removal
    var bodiesToBeRemoved = this.bodiesToBeRemoved;
    for(var i=0; i!==bodiesToBeRemoved.length; i++){
        this.removeBody(bodiesToBeRemoved[i]);
    }
    bodiesToBeRemoved.length = 0;

    this.emit(this.postStepEvent);
};

/**
 * Runs narrowphase for the shape pair i and j.
 * @method runNarrowphase
 * @param  {Narrowphase} np
 * @param  {Body} bi
 * @param  {Shape} si
 * @param  {Array} xi
 * @param  {Number} ai
 * @param  {Body} bj
 * @param  {Shape} sj
 * @param  {Array} xj
 * @param  {Number} aj
 * @param  {Number} mu
 */
World.prototype.runNarrowphase = function(np,bi,si,xi,ai,bj,sj,xj,aj,cm,glen){

    // Check collision groups and masks
    if(!((si.collisionGroup & sj.collisionMask) !== 0 && (sj.collisionGroup & si.collisionMask) !== 0)){
        return;
    }

    // Get world position and angle of each shape
    vec2_1.rotate(xiw, xi, bi.angle);
    vec2_1.rotate(xjw, xj, bj.angle);
    vec2_1.add(xiw, xiw, bi.position);
    vec2_1.add(xjw, xjw, bj.position);
    var aiw = ai + bi.angle;
    var ajw = aj + bj.angle;

    np.enableFriction = cm.friction > 0;
    np.frictionCoefficient = cm.friction;
    var reducedMass;
    if(bi.type === Body_1.STATIC || bi.type === Body_1.KINEMATIC){
        reducedMass = bj.mass;
    } else if(bj.type === Body_1.STATIC || bj.type === Body_1.KINEMATIC){
        reducedMass = bi.mass;
    } else {
        reducedMass = (bi.mass*bj.mass)/(bi.mass+bj.mass);
    }
    np.slipForce = cm.friction*glen*reducedMass;
    np.restitution = cm.restitution;
    np.surfaceVelocity = cm.surfaceVelocity;
    np.frictionStiffness = cm.frictionStiffness;
    np.frictionRelaxation = cm.frictionRelaxation;
    np.stiffness = cm.stiffness;
    np.relaxation = cm.relaxation;
    np.contactSkinSize = cm.contactSkinSize;
    np.enabledEquations = bi.collisionResponse && bj.collisionResponse && si.collisionResponse && sj.collisionResponse;

    var resolver = np[si.type | sj.type],
        numContacts = 0;
    if (resolver) {
        var sensor = si.sensor || sj.sensor;
        var numFrictionBefore = np.frictionEquations.length;
        if (si.type < sj.type) {
            numContacts = resolver.call(np, bi,si,xiw,aiw, bj,sj,xjw,ajw, sensor);
        } else {
            numContacts = resolver.call(np, bj,sj,xjw,ajw, bi,si,xiw,aiw, sensor);
        }
        var numFrictionEquations = np.frictionEquations.length - numFrictionBefore;

        if(numContacts){

            if( bi.allowSleep &&
                bi.type === Body_1.DYNAMIC &&
                bi.sleepState  === Body_1.SLEEPING &&
                bj.sleepState  === Body_1.AWAKE &&
                bj.type !== Body_1.STATIC
            ){
                var speedSquaredB = vec2_1.squaredLength(bj.velocity) + Math.pow(bj.angularVelocity,2);
                var speedLimitSquaredB = Math.pow(bj.sleepSpeedLimit,2);
                if(speedSquaredB >= speedLimitSquaredB*2){
                    bi._wakeUpAfterNarrowphase = true;
                }
            }

            if( bj.allowSleep &&
                bj.type === Body_1.DYNAMIC &&
                bj.sleepState  === Body_1.SLEEPING &&
                bi.sleepState  === Body_1.AWAKE &&
                bi.type !== Body_1.STATIC
            ){
                var speedSquaredA = vec2_1.squaredLength(bi.velocity) + Math.pow(bi.angularVelocity,2);
                var speedLimitSquaredA = Math.pow(bi.sleepSpeedLimit,2);
                if(speedSquaredA >= speedLimitSquaredA*2){
                    bj._wakeUpAfterNarrowphase = true;
                }
            }

            this.overlapKeeper.setOverlapping(bi, si, bj, sj);
            if(this.has('beginContact') && this.overlapKeeper.isNewOverlap(si, sj)){

                // Report new shape overlap
                var e = this.beginContactEvent;
                e.shapeA = si;
                e.shapeB = sj;
                e.bodyA = bi;
                e.bodyB = bj;

                // Reset contact equations
                e.contactEquations.length = 0;

                if(typeof(numContacts)==="number"){
                    for(var i=np.contactEquations.length-numContacts; i<np.contactEquations.length; i++){
                        e.contactEquations.push(np.contactEquations[i]);
                    }
                }

                this.emit(e);
            }

            // divide the max friction force by the number of contacts
            if(typeof(numContacts)==="number" && numFrictionEquations > 1){ // Why divide by 1?
                for(var i=np.frictionEquations.length-numFrictionEquations; i<np.frictionEquations.length; i++){
                    var f = np.frictionEquations[i];
                    f.setSlipForce(f.getSlipForce() / numFrictionEquations);
                }
            }
        }
    }

};

/**
 * Add a spring to the simulation
 *
 * @method addSpring
 * @param {Spring} spring
 */
World.prototype.addSpring = function(spring){
    this.springs.push(spring);
    var evt = this.addSpringEvent;
    evt.spring = spring;
    this.emit(evt);
    evt.spring = null;
};

/**
 * Remove a spring
 *
 * @method removeSpring
 * @param {Spring} spring
 */
World.prototype.removeSpring = function(spring){
    var idx = this.springs.indexOf(spring);
    if(idx !== -1){
        Utils_1.splice(this.springs,idx,1);
    }
};

/**
 * Add a body to the simulation
 *
 * @method addBody
 * @param {Body} body
 *
 * @example
 *     var world = new World(),
 *         body = new Body();
 *     world.addBody(body);
 * @todo What if this is done during step?
 */
World.prototype.addBody = function(body){
    if(this.bodies.indexOf(body) === -1){
        this.bodies.push(body);
        body.world = this;
        var evt = this.addBodyEvent;
        evt.body = body;
        this.emit(evt);
        evt.body = null;
    }
};

/**
 * Remove a body from the simulation. If this method is called during step(), the body removal is scheduled to after the step.
 *
 * @method removeBody
 * @param {Body} body
 */
World.prototype.removeBody = function(body){
    if(this.stepping){
        this.bodiesToBeRemoved.push(body);
    } else {
        body.world = null;
        var idx = this.bodies.indexOf(body);
        if(idx!==-1){
            Utils_1.splice(this.bodies,idx,1);
            this.removeBodyEvent.body = body;
            body.resetConstraintVelocity();
            this.emit(this.removeBodyEvent);
            this.removeBodyEvent.body = null;
        }
    }
};

/**
 * Get a body by its id.
 * @method getBodyById
 * @param {number} id
 * @return {Body} The body, or false if it was not found.
 */
World.prototype.getBodyById = function(id){
    var bodies = this.bodies;
    for(var i=0; i<bodies.length; i++){
        var b = bodies[i];
        if(b.id === id){
            return b;
        }
    }
    return false;
};

/**
 * Disable collision between two bodies
 * @method disableBodyCollision
 * @param {Body} bodyA
 * @param {Body} bodyB
 */
World.prototype.disableBodyCollision = function(bodyA,bodyB){
    this.disabledBodyCollisionPairs.push(bodyA,bodyB);
};

/**
 * Enable collisions between the given two bodies
 * @method enableBodyCollision
 * @param {Body} bodyA
 * @param {Body} bodyB
 */
World.prototype.enableBodyCollision = function(bodyA,bodyB){
    var pairs = this.disabledBodyCollisionPairs;
    for(var i=0; i<pairs.length; i+=2){
        if((pairs[i] === bodyA && pairs[i+1] === bodyB) || (pairs[i+1] === bodyA && pairs[i] === bodyB)){
            pairs.splice(i,2);
            return;
        }
    }
};

/**
 * Resets the World, removes all bodies, constraints and springs.
 *
 * @method clear
 */
World.prototype.clear = function(){

    this.time = 0;

    // Remove all solver equations
    if(this.solver && this.solver.equations.length){
        this.solver.removeAllEquations();
    }

    // Remove all constraints
    var cs = this.constraints;
    for(var i=cs.length-1; i>=0; i--){
        this.removeConstraint(cs[i]);
    }

    // Remove all bodies
    var bodies = this.bodies;
    for(var i=bodies.length-1; i>=0; i--){
        this.removeBody(bodies[i]);
    }

    // Remove all springs
    var springs = this.springs;
    for(var i=springs.length-1; i>=0; i--){
        this.removeSpring(springs[i]);
    }

    // Remove all contact materials
    var cms = this.contactMaterials;
    for(var i=cms.length-1; i>=0; i--){
        this.removeContactMaterial(cms[i]);
    }

    World.apply(this);
};

var hitTest_tmp1 = vec2_1.create(),
    hitTest_zero = vec2_1.fromValues(0,0),
    hitTest_tmp2 = vec2_1.fromValues(0,0);

/**
 * Test if a world point overlaps bodies
 * @method hitTest
 * @param  {Array}  worldPoint  Point to use for intersection tests
 * @param  {Array}  bodies      A list of objects to check for intersection
 * @param  {Number} precision   Used for matching against particles and lines. Adds some margin to these infinitesimal objects.
 * @return {Array}              Array of bodies that overlap the point
 * @todo Should use an api similar to the raycast function
 * @todo Should probably implement a .containsPoint method for all shapes. Would be more efficient
 * @todo Should use the broadphase
 */
World.prototype.hitTest = function(worldPoint,bodies,precision){
    precision = precision || 0;

    // Create a dummy particle body with a particle shape to test against the bodies
    var pb = new Body_1({ position:worldPoint }),
        ps = new Particle_1(),
        px = worldPoint,
        pa = 0,
        x = hitTest_tmp1,
        tmp = hitTest_tmp2;
    pb.addShape(ps);

    var n = this.narrowphase,
        result = [];

    // Check bodies
    for(var i=0, N=bodies.length; i!==N; i++){
        var b = bodies[i];

        for(var j=0, NS=b.shapes.length; j!==NS; j++){
            var s = b.shapes[j];

            // Get shape world position + angle
            vec2_1.rotate(x, s.position, b.angle);
            vec2_1.add(x, x, b.position);
            var a = s.angle + b.angle;

            if( (s instanceof Circle_1    && n.circleParticle  (b,s,x,a,     pb,ps,px,pa, true)) ||
                (s instanceof Convex_1    && n.particleConvex  (pb,ps,px,pa, b,s,x,a,     true)) ||
                (s instanceof Plane_1     && n.particlePlane   (pb,ps,px,pa, b,s,x,a,     true)) ||
                (s instanceof Capsule_1   && n.particleCapsule (pb,ps,px,pa, b,s,x,a,     true)) ||
                (s instanceof Particle_1  && vec2_1.squaredLength(vec2_1.sub(tmp,x,worldPoint)) < precision*precision)
                ){
                result.push(b);
            }
        }
    }

    return result;
};

/**
 * Set the stiffness for all equations and contact materials.
 * @method setGlobalStiffness
 * @param {Number} stiffness
 */
World.prototype.setGlobalStiffness = function(stiffness){

    // Set for all constraints
    var constraints = this.constraints;
    for(var i=0; i !== constraints.length; i++){
        var c = constraints[i];
        for(var j=0; j !== c.equations.length; j++){
            var eq = c.equations[j];
            eq.stiffness = stiffness;
            eq.needsUpdate = true;
        }
    }

    // Set for all contact materials
    var contactMaterials = this.contactMaterials;
    for(var i=0; i !== contactMaterials.length; i++){
        var c = contactMaterials[i];
        c.stiffness = c.frictionStiffness = stiffness;
    }

    // Set for default contact material
    var c = this.defaultContactMaterial;
    c.stiffness = c.frictionStiffness = stiffness;
};

/**
 * Set the relaxation for all equations and contact materials.
 * @method setGlobalRelaxation
 * @param {Number} relaxation
 */
World.prototype.setGlobalRelaxation = function(relaxation){

    // Set for all constraints
    for(var i=0; i !== this.constraints.length; i++){
        var c = this.constraints[i];
        for(var j=0; j !== c.equations.length; j++){
            var eq = c.equations[j];
            eq.relaxation = relaxation;
            eq.needsUpdate = true;
        }
    }

    // Set for all contact materials
    for(var i=0; i !== this.contactMaterials.length; i++){
        var c = this.contactMaterials[i];
        c.relaxation = c.frictionRelaxation = relaxation;
    }

    // Set for default contact material
    var c = this.defaultContactMaterial;
    c.relaxation = c.frictionRelaxation = relaxation;
};

var tmpAABB = new AABB_1();
var tmpArray$1 = [];

/**
 * Ray cast against all bodies in the world.
 * @method raycast
 * @param  {RaycastResult} result
 * @param  {Ray} ray
 * @return {boolean} True if any body was hit.
 *
 * @example
 *     var ray = new Ray({
 *         mode: Ray.CLOSEST, // or ANY
 *         from: [0, 0],
 *         to: [10, 0],
 *     });
 *     var result = new RaycastResult();
 *     world.raycast(result, ray);
 *
 *     // Get the hit point
 *     var hitPoint = vec2.create();
 *     result.getHitPoint(hitPoint, ray);
 *     console.log('Hit point: ', hitPoint[0], hitPoint[1], ' at distance ' + result.getHitDistance(ray));
 *
 * @example
 *     var ray = new Ray({
 *         mode: Ray.ALL,
 *         from: [0, 0],
 *         to: [10, 0],
 *         callback: function(result){
 *
 *             // Print some info about the hit
 *             console.log('Hit body and shape: ', result.body, result.shape);
 *
 *             // Get the hit point
 *             var hitPoint = vec2.create();
 *             result.getHitPoint(hitPoint, ray);
 *             console.log('Hit point: ', hitPoint[0], hitPoint[1], ' at distance ' + result.getHitDistance(ray));
 *
 *             // If you are happy with the hits you got this far, you can stop the traversal here:
 *             result.stop();
 *         }
 *     });
 *     var result = new RaycastResult();
 *     world.raycast(result, ray);
 */
World.prototype.raycast = function(result, ray){

    // Get all bodies within the ray AABB
    ray.getAABB(tmpAABB);
    this.broadphase.aabbQuery(this, tmpAABB, tmpArray$1);
    ray.intersectBodies(result, tmpArray$1);
    tmpArray$1.length = 0;

    return result.hasHit();
};

var p2_1 = createCommonjsModule(function (module) {
// Export p2 classes
var p2 = module.exports = {
    AABB :                          AABB_1,
    AngleLockEquation :             AngleLockEquation_1,
    Body :                          Body_1,
    Broadphase :                    Broadphase_1,
    Capsule :                       Capsule_1,
    Circle :                        Circle_1,
    Constraint :                    Constraint_1,
    ContactEquation :               ContactEquation_1,
    ContactEquationPool :           ContactEquationPool_1,
    ContactMaterial :               ContactMaterial_1,
    Convex :                        Convex_1,
    DistanceConstraint :            DistanceConstraint_1,
    Equation :                      Equation_1,
    EventEmitter :                  EventEmitter_1,
    FrictionEquation :              FrictionEquation_1,
    FrictionEquationPool :          FrictionEquationPool_1,
    GearConstraint :                GearConstraint_1,
    GSSolver :                      GSSolver_1,
    Heightfield :                   Heightfield_1,
    Line :                          Line_1$1,
    LockConstraint :                LockConstraint_1,
    Material :                      Material_1,
    Narrowphase :                   Narrowphase_1,
    NaiveBroadphase :               NaiveBroadphase_1,
    Particle :                      Particle_1,
    Plane :                         Plane_1,
    Pool :                          Pool_1,
    RevoluteConstraint :            RevoluteConstraint_1,
    PrismaticConstraint :           PrismaticConstraint_1,
    Ray :                           Ray_1,
    RaycastResult :                 RaycastResult_1,
    Box :                           Box_1,
    RotationalVelocityEquation :    RotationalVelocityEquation_1,
    SAPBroadphase :                 SAPBroadphase_1,
    Shape :                         Shape_1,
    Solver :                        Solver_1,
    Spring :                        Spring_1,
    TopDownVehicle :                TopDownVehicle_1,
    LinearSpring :                  LinearSpring_1,
    RotationalSpring :              RotationalSpring_1,
    Utils :                         Utils_1,
    World :                         World_1,
    vec2 :                          vec2_1,
    version :                       require$$43.version,
};

Object.defineProperty(p2, 'Rectangle', {
    get: function() {
        console.warn('The Rectangle class has been renamed to Box.');
        return this.Box;
    }
});
});
var p2_2 = p2_1.AABB;
var p2_3 = p2_1.AngleLockEquation;
var p2_4 = p2_1.Body;
var p2_5 = p2_1.Broadphase;
var p2_6 = p2_1.Capsule;
var p2_7 = p2_1.Circle;
var p2_8 = p2_1.Constraint;
var p2_9 = p2_1.ContactEquation;
var p2_10 = p2_1.ContactEquationPool;
var p2_11 = p2_1.ContactMaterial;
var p2_12 = p2_1.Convex;
var p2_13 = p2_1.DistanceConstraint;
var p2_14 = p2_1.Equation;
var p2_15 = p2_1.EventEmitter;
var p2_16 = p2_1.FrictionEquation;
var p2_17 = p2_1.FrictionEquationPool;
var p2_18 = p2_1.GearConstraint;
var p2_19 = p2_1.GSSolver;
var p2_20 = p2_1.Heightfield;
var p2_21 = p2_1.Line;
var p2_22 = p2_1.LockConstraint;
var p2_23 = p2_1.Material;
var p2_24 = p2_1.Narrowphase;
var p2_25 = p2_1.NaiveBroadphase;
var p2_26 = p2_1.Particle;
var p2_27 = p2_1.Plane;
var p2_28 = p2_1.Pool;
var p2_29 = p2_1.RevoluteConstraint;
var p2_30 = p2_1.PrismaticConstraint;
var p2_31 = p2_1.Ray;
var p2_32 = p2_1.RaycastResult;
var p2_33 = p2_1.Box;
var p2_34 = p2_1.RotationalVelocityEquation;
var p2_35 = p2_1.SAPBroadphase;
var p2_36 = p2_1.Shape;
var p2_37 = p2_1.Solver;
var p2_38 = p2_1.Spring;
var p2_39 = p2_1.TopDownVehicle;
var p2_40 = p2_1.LinearSpring;
var p2_41 = p2_1.RotationalSpring;
var p2_42 = p2_1.Utils;
var p2_43 = p2_1.World;
var p2_44 = p2_1.vec2;
var p2_45 = p2_1.version;

/**
 * CannonPhysicsEngine is a three-dimensional lightweight physics engine
 */
class P2PhysicsEngine extends PhysicsEngine {

    constructor(options) {
        super(options);

        this.options.dt = this.options.dt || (1 / 60);
        this.world = new p2_1.World({ gravity: [0, 0] });
        this.p2 = p2_1;
    }

    // entry point for a single step of the Simple Physics
    step(dt, objectFilter) {
        this.world.step(dt || this.options.dt);
    }

    // add a circle
    addCircle(radius, mass) {

        // create a body, add shape, add to world
        let body = new p2_1.Body({ mass, position: [0, 0] });
        body.addShape(new p2_1.Circle({ radius }));
        this.world.addBody(body);

        return body;
    }

    addBox(width, height, mass) {

        // create a body, add shape, add to world
        let body = new p2_1.Body({ mass, position: [0, 0] });
        body.addShape(new p2_1.Box({ width, height }));
        this.world.addBody(body);

        return body;
    }

    removeObject(obj) {
        this.world.removeBody(obj);
    }
}

class Utils$1 {

    static hashStr(str, bits) {
        let hash = 5381;
        let i = str.length;
        bits = bits ? bits : 8;

        while (i) {
            hash = (hash * 33) ^ str.charCodeAt(--i);
        }
        hash = hash >>> 0;
        hash = hash % (Math.pow(2, bits) - 1);

        // JavaScript does bitwise operations (like XOR, above) on 32-bit signed
        // integers. Since we want the results to be always positive, convert the
        // signed int to an unsigned by doing an unsigned bitshift. */
        return hash;
    }

    static arrayBuffersEqual(buf1, buf2) {
        if (buf1.byteLength !== buf2.byteLength) return false;
        let dv1 = new Int8Array(buf1);
        let dv2 = new Int8Array(buf2);
        for (let i = 0; i !== buf1.byteLength; i++) {
            if (dv1[i] !== dv2[i]) return false;
        }
        return true;
    }

    static httpGetPromise(url) {
        return new Promise((resolve, reject) => {
            let req = new XMLHttpRequest();
            req.open('GET', url, true);
            req.onload = () => {
                if (req.status >= 200 && req.status < 400) resolve(JSON.parse(req.responseText));
                else reject();
            };
            req.onerror = () => {};
            req.send();
        });
    }
}

/**
 * The BaseTypes class defines the base types used in lance.
 * These are the types which can be used to define an object's netscheme attributes,
 * which can be serialized by lance.
 * @example
 *     static get netScheme() {
 *       return {
 *             strength: { type: BaseTypes.TYPES.FLOAT32 },
 *             shield: { type: BaseTypes.TYPES.INT8 },
 *             name: { type: BaseTypes.TYPES.STRING },
 *             backpack: { type: BaseTypes.TYPES.CLASSINSTANCE },
 *             coins: {
 *                 type: BaseTypes.TYPES.LIST,
 *                 itemType: BaseTypes.TYPES.UINT8
 *             }
 *         };
 *     }
 */
class BaseTypes {}

/**
 * @type {object}
 * @property {string} FLOAT32 Seriablizable float
 * @property {string} INT32 Seriablizable 32-bit integer
 * @property {string} INT16 Seriablizable 16-bit integer
 * @property {string} INT8 Seriablizable 8-bit integer
 * @property {string} UINT8 Seriablizable unsigned 8-bit integer
 * @property {string} STRING Seriablizable string
 * @property {string} CLASSINSTANCE Seriablizable class. Make sure you register all the classes included in this way.
 * @property {string} LIST Seriablizable list.  In the netScheme definition, if an attribute is defined as a list, the itemType should also be defined.
 */
BaseTypes.TYPES = {

  /**
   * Seriablizable float
   * @alias TYPES.FLOAT32
   * @memberof! BaseTypes#
   */
    FLOAT32: 'FLOAT32',

    /**
     * Seriablizable 32-bit int
     * @alias TYPES.INT32
     * @memberof! BaseTypes#
     */
    INT32: 'INT32',

    /**
     * Seriablizable 16-bit int
     * @alias TYPES.INT16
     * @memberof! BaseTypes#
     */
    INT16: 'INT16',

    /**
     * Seriablizable 8-bit int
     * @alias TYPES.INT8
     * @memberof! BaseTypes#
     */
    INT8: 'INT8',

    /**
     * Seriablizable unsigned 8-bit int
     * @alias TYPES.UINT8
     * @memberof! BaseTypes#
     */
    UINT8: 'UINT8',

    /**
     * Seriablizable string
     * @alias TYPES.STRING
     * @memberof! BaseTypes#
     */
    STRING: 'STRING',

    /**
     * Seriablizable class.  Make sure you registered the classes included in this way.
     * @alias TYPES.CLASSINSTANCE
     * @memberof! BaseTypes#
     */
    CLASSINSTANCE: 'CLASSINSTANCE',

    /**
     * Seriablizable list.
     * @alias TYPES.LIST
     * @memberof! BaseTypes#
     */
    LIST: 'LIST'
};

class Serializable {
    /**
     *  Class can be serialized using either:
     * - a class based netScheme
     * - an instance based netScheme
     * - completely dynamically (not implemented yet)
     *
     * @param {Object} serializer - Serializer instance
     * @param {Object} [options] - Options object
     * @param {Object} options.dataBuffer [optional] - Data buffer to write to. If null a new data buffer will be created
     * @param {Number} options.bufferOffset [optional] - The buffer data offset to start writing at. Default: 0
     * @param {String} options.dry [optional] - Does not actually write to the buffer (useful to gather serializeable size)
     * @return {Object} the serialized object.  Contains attributes: dataBuffer - buffer which contains the serialized data;  bufferOffset - offset where the serialized data starts.
     */
    serialize(serializer, options) {
        options = Object.assign({
            bufferOffset: 0
        }, options);

        let netScheme;
        let dataBuffer;
        let dataView;
        let classId = 0;
        let bufferOffset = options.bufferOffset;
        let localBufferOffset = 0; // used for counting the bufferOffset

        // instance classId
        if (this.classId) {
            classId = this.classId;
        } else {
            classId = Utils$1.hashStr(this.constructor.name);
        }

        // instance netScheme
        if (this.netScheme) {
            netScheme = this.netScheme;
        } else if (this.constructor.netScheme) {
            netScheme = this.constructor.netScheme;
        } else {
            // todo define behaviour when a netScheme is undefined
            console.warn('no netScheme defined! This will result in awful performance');
        }

        // TODO: currently we serialize every node twice, once to calculate the size
        //       of the buffers and once to write them out.  This can be reduced to
        //       a single pass by starting with a large (and static) ArrayBuffer and
        //       recursively building it up.
        // buffer has one Uint8Array for class id, then payload
        if (options.dataBuffer == null && options.dry != true) {
            let bufferSize = this.serialize(serializer, { dry: true }).bufferOffset;
            dataBuffer = new ArrayBuffer(bufferSize);
        } else {
            dataBuffer = options.dataBuffer;
        }

        if (options.dry != true) {
            dataView = new DataView(dataBuffer);
            // first set the id of the class, so that the deserializer can fetch information about it
            dataView.setUint8(bufferOffset + localBufferOffset, classId);
        }

        // advance the offset counter
        localBufferOffset += Uint8Array.BYTES_PER_ELEMENT;

        if (netScheme) {
            for (let property of Object.keys(netScheme).sort()) {

                // write the property to buffer
                if (options.dry != true) {
                    serializer.writeDataView(dataView, this[property], bufferOffset + localBufferOffset, netScheme[property]);
                }

                if (netScheme[property].type === BaseTypes.TYPES.STRING) {
                    // derive the size of the string
                    localBufferOffset += Uint16Array.BYTES_PER_ELEMENT;
                    if (this[property] !== null && this[property] !== undefined)
                        localBufferOffset += this[property].length * Uint16Array.BYTES_PER_ELEMENT;
                } else if (netScheme[property].type === BaseTypes.TYPES.CLASSINSTANCE) {
                    // derive the size of the included class
                    let objectInstanceBufferOffset = this[property].serialize(serializer, { dry: true }).bufferOffset;
                    localBufferOffset += objectInstanceBufferOffset;
                } else if (netScheme[property].type === BaseTypes.TYPES.LIST) {
                    // derive the size of the list
                    // list starts with number of elements
                    localBufferOffset += Uint16Array.BYTES_PER_ELEMENT;

                    for (let item of this[property]) {
                        // todo inelegant, currently doesn't support list of lists
                        if (netScheme[property].itemType === BaseTypes.TYPES.CLASSINSTANCE) {
                            let listBufferOffset = item.serialize(serializer, { dry: true }).bufferOffset;
                            localBufferOffset += listBufferOffset;
                        } else if (netScheme[property].itemType === BaseTypes.TYPES.STRING) {
                            // size includes string length plus double-byte characters
                            localBufferOffset += Uint16Array.BYTES_PER_ELEMENT * (1 + item.length);
                        } else {
                            localBufferOffset += serializer.getTypeByteSize(netScheme[property].itemType);
                        }
                    }
                } else {
                    // advance offset
                    localBufferOffset += serializer.getTypeByteSize(netScheme[property].type);
                }

            }
        }

        return { dataBuffer, bufferOffset: localBufferOffset };
    }

    // build a clone of this object with pruned strings (if necessary)
    prunedStringsClone(serializer, prevObject) {

        if (!prevObject) return this;
        prevObject = serializer.deserialize(prevObject).obj;

        // get list of string properties which changed
        let netScheme = this.constructor.netScheme;
        let isString = p => netScheme[p].type === BaseTypes.TYPES.STRING;
        let hasChanged = p => prevObject[p] !== this[p];
        let changedStrings = Object.keys(netScheme).filter(isString).filter(hasChanged);
        if (changedStrings.length == 0) return this;

        // build a clone with pruned strings
        let prunedCopy = new this.constructor(null, { id: null });
        for (let p of Object.keys(netScheme))
            prunedCopy[p] = changedStrings.indexOf(p) < 0 ? this[p] : null;

        return prunedCopy;
    }

    syncTo(other) {
        let netScheme = this.constructor.netScheme;
        for (let p of Object.keys(netScheme)) {

            // ignore classes and lists
            if (netScheme[p].type === BaseTypes.TYPES.LIST || netScheme[p].type === BaseTypes.TYPES.CLASSINSTANCE)
                continue;

            // strings might be pruned
            if (netScheme[p].type === BaseTypes.TYPES.STRING) {
                if (typeof other[p] === 'string') this[p] = other[p];
                continue;
            }

            // all other values are copied
            this[p] = other[p];
        }
    }

}

/**
 * A TwoVector is a geometric object which is completely described
 * by two values.
 */
class TwoVector extends Serializable {

    static get netScheme() {
        return {
            x: { type: BaseTypes.TYPES.FLOAT32 },
            y: { type: BaseTypes.TYPES.FLOAT32 }
        };
    }

    /**
    * Creates an instance of a TwoVector.
    * @param {Number} x - first value
    * @param {Number} y - second value
    * @return {TwoVector} v - the new TwoVector
    */
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;

        return this;
    }

    /**
     * Formatted textual description of the TwoVector.
     * @return {String} description
     */
    toString() {
        function round3(x) { return Math.round(x * 1000) / 1000; }
        return `[${round3(this.x)}, ${round3(this.y)}]`;
    }

    /**
     * Set TwoVector values
     *
     * @param {Number} x x-value
     * @param {Number} y y-value
     * @return {TwoVector} returns self
     */
    set(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }

    multiply(other) {
        this.x *= other.x;
        this.y *= other.y;

        return this;
    }

    /**
     * Multiply this TwoVector by a scalar
     *
     * @param {Number} s the scale
     * @return {TwoVector} returns self
     */
    multiplyScalar(s) {
        this.x *= s;
        this.y *= s;

        return this;
    }

    /**
     * Add other vector to this vector
     *
     * @param {TwoVector} other the other vector
     * @return {TwoVector} returns self
     */
    add(other) {
        this.x += other.x;
        this.y += other.y;

        return this;
    }

    /**
     * Subtract other vector to this vector
     *
     * @param {TwoVector} other the other vector
     * @return {TwoVector} returns self
     */
    subtract(other) {
        this.x -= other.x;
        this.y -= other.y;

        return this;
    }

    /**
     * Get vector length
     *
     * @return {Number} length of this vector
     */
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    /**
     * Normalize this vector, in-place
     *
     * @return {TwoVector} returns self
     */
    normalize() {
        this.multiplyScalar(1 / this.length());
        return this;
    }

    /**
     * Copy values from another TwoVector into this TwoVector
     *
     * @param {TwoVector} sourceObj the other vector
     * @return {TwoVector} returns self
     */
    copy(sourceObj) {
        this.x = sourceObj.x;
        this.y = sourceObj.y;

        return this;
    }

    /**
     * Create a clone of this vector
     *
     * @return {TwoVector} returns clone
     */
    clone() {
        return new TwoVector(this.x, this.y);
    }

    /**
     * Apply in-place lerp (linear interpolation) to this TwoVector
     * towards another TwoVector
     * @param {TwoVector} target the target vector
     * @param {Number} p The percentage to interpolate
     * @return {TwoVector} returns self
     */
    lerp(target, p) {
        this.x += (target.x - this.x) * p;
        this.y += (target.y - this.y) * p;

        return this;
    }

    /**
     * Get bending Delta Vector
     * towards another TwoVector
     * @param {TwoVector} target the target vector
     * @param {Object} options bending options
     * @param {Number} options.increments number of increments
     * @param {Number} options.percent The percentage to bend
     * @param {Number} options.min No less than this value
     * @param {Number} options.max No more than this value
     * @return {TwoVector} returns new Incremental Vector
     */
    getBendingDelta(target, options) {
        let increment = target.clone();
        increment.subtract(this);
        increment.multiplyScalar(options.percent);

        // check for max case
        if (((typeof options.max === 'number') && increment.length() > options.max) ||
            ((typeof options.min === 'number') && increment.length() < options.min)) {
            return new TwoVector(0, 0);
        }

        // divide into increments
        increment.multiplyScalar(1 / options.increments);

        return increment;
    }
}

// Hierarchical Spatial Hash Grid: HSHG
// source: https://gist.github.com/kirbysayshi/1760774

// ---------------------------------------------------------------------
// GLOBAL FUNCTIONS
// ---------------------------------------------------------------------

/**
 * Updates every object's position in the grid, but only if
 * the hash value for that object has changed.
 * This method DOES NOT take into account object expansion or
 * contraction, just position, and does not attempt to change
 * the grid the object is currently in; it only (possibly) changes
 * the cell.
 *
 * If the object has significantly changed in size, the best bet is to
 * call removeObject() and addObject() sequentially, outside of the
 * normal update cycle of HSHG.
 *
 * @return  void   desc
 */
function update_RECOMPUTE() {

    var i,
        obj,
        grid,
        meta,
        objAABB,
        newObjHash;

    // for each object
    for (i = 0; i < this._globalObjects.length; i++) {
        obj = this._globalObjects[i];
        meta = obj.HSHG;
        grid = meta.grid;

        // recompute hash
        objAABB = obj.getAABB();
        newObjHash = grid.toHash(objAABB.min[0], objAABB.min[1]);

        if (newObjHash !== meta.hash) {
            // grid position has changed, update!
            grid.removeObject(obj);
            grid.addObject(obj, newObjHash);
        }
    }
}

// not implemented yet :)
function update_REMOVEALL() {

}

function testAABBOverlap(objA, objB) {
    var a = objA.getAABB(),
        b = objB.getAABB();

    // if(a.min[0] > b.max[0] || a.min[1] > b.max[1] || a.min[2] > b.max[2]
    // || a.max[0] < b.min[0] || a.max[1] < b.min[1] || a.max[2] < b.min[2]){

    if (a.min[0] > b.max[0] || a.min[1] > b.max[1] ||
        a.max[0] < b.min[0] || a.max[1] < b.min[1]) {
        return false;
    }
    return true;

}

function getLongestAABBEdge(min, max) {
    return Math.max(
        Math.abs(max[0] - min[0])
        , Math.abs(max[1] - min[1])
        // ,Math.abs(max[2] - min[2])
    );
}

// ---------------------------------------------------------------------
// ENTITIES
// ---------------------------------------------------------------------

function HSHG() {

    this.MAX_OBJECT_CELL_DENSITY = 1 / 8; // objects / cells
    this.INITIAL_GRID_LENGTH = 256; // 16x16
    this.HIERARCHY_FACTOR = 2;
    this.HIERARCHY_FACTOR_SQRT = Math.SQRT2;
    this.UPDATE_METHOD = update_RECOMPUTE; // or update_REMOVEALL

    this._grids = [];
    this._globalObjects = [];
}

// HSHG.prototype.init = function(){
//	this._grids = [];
//	this._globalObjects = [];
// }

HSHG.prototype.addObject = function (obj) {
    var x, i,
        cellSize,
        objAABB = obj.getAABB(),
        objSize = getLongestAABBEdge(objAABB.min, objAABB.max),
        oneGrid, newGrid;

    // for HSHG metadata
    obj.HSHG = {
        globalObjectsIndex: this._globalObjects.length
    };

    // add to global object array
    this._globalObjects.push(obj);

    if (this._grids.length == 0) {
        // no grids exist yet
        cellSize = objSize * this.HIERARCHY_FACTOR_SQRT;
        newGrid = new Grid(cellSize, this.INITIAL_GRID_LENGTH, this);
        newGrid.initCells();
        newGrid.addObject(obj);

        this._grids.push(newGrid);
    } else {
        x = 0;

        // grids are sorted by cellSize, smallest to largest
        for (i = 0; i < this._grids.length; i++) {
            oneGrid = this._grids[i];
            x = oneGrid.cellSize;
            if (objSize < x) {
                x /= this.HIERARCHY_FACTOR;
                if (objSize < x) {
                    // find appropriate size
                    while (objSize < x) {
                        x /= this.HIERARCHY_FACTOR;
                    }
                    newGrid = new Grid(x * this.HIERARCHY_FACTOR, this.INITIAL_GRID_LENGTH, this);
                    newGrid.initCells();
                    // assign obj to grid
                    newGrid.addObject(obj);
                    // insert grid into list of grids directly before oneGrid
                    this._grids.splice(i, 0, newGrid);
                } else {
                    // insert obj into grid oneGrid
                    oneGrid.addObject(obj);
                }
                return;
            }
        }

        while (objSize >= x) {
            x *= this.HIERARCHY_FACTOR;
        }

        newGrid = new Grid(x, this.INITIAL_GRID_LENGTH, this);
        newGrid.initCells();
        // insert obj into grid
        newGrid.addObject(obj);
        // add newGrid as last element in grid list
        this._grids.push(newGrid);
    }
};

HSHG.prototype.removeObject = function (obj) {
    var meta = obj.HSHG,
        globalObjectsIndex,
        replacementObj;

    if (meta === undefined) {
        throw Error(obj + ' was not in the HSHG.');
        return;
    }

    // remove object from global object list
    globalObjectsIndex = meta.globalObjectsIndex;
    if (globalObjectsIndex === this._globalObjects.length - 1) {
        this._globalObjects.pop();
    } else {
        replacementObj = this._globalObjects.pop();
        replacementObj.HSHG.globalObjectsIndex = globalObjectsIndex;
        this._globalObjects[globalObjectsIndex] = replacementObj;
    }

    meta.grid.removeObject(obj);

    // remove meta data
    delete obj.HSHG;
};

HSHG.prototype.update = function () {
    this.UPDATE_METHOD.call(this);
};

HSHG.prototype.queryForCollisionPairs = function (broadOverlapTestCallback) {

    var i, j, k, l, c,
        grid,
        cell,
        objA,
        objB,
        offset,
        adjacentCell,
        biggerGrid,
        objAAABB,
        objAHashInBiggerGrid,
        possibleCollisions = [];

    // default broad test to internal aabb overlap test
    let broadOverlapTest = broadOverlapTestCallback || testAABBOverlap;

    // for all grids ordered by cell size ASC
    for (i = 0; i < this._grids.length; i++) {
        grid = this._grids[i];

        // for each cell of the grid that is occupied
        for (j = 0; j < grid.occupiedCells.length; j++) {
            cell = grid.occupiedCells[j];

            // collide all objects within the occupied cell
            for (k = 0; k < cell.objectContainer.length; k++) {
                objA = cell.objectContainer[k];
                for (l = k + 1; l < cell.objectContainer.length; l++) {
                    objB = cell.objectContainer[l];
                    if (broadOverlapTest(objA, objB) === true) {
                        possibleCollisions.push([objA, objB]);
                    }
                }
            }

            // for the first half of all adjacent cells (offset 4 is the current cell)
            for (c = 0; c < 4; c++) {
                offset = cell.neighborOffsetArray[c];

                // if(offset === null) { continue; }

                adjacentCell = grid.allCells[cell.allCellsIndex + offset];

                // collide all objects in cell with adjacent cell
                for (k = 0; k < cell.objectContainer.length; k++) {
                    objA = cell.objectContainer[k];
                    for (l = 0; l < adjacentCell.objectContainer.length; l++) {
                        objB = adjacentCell.objectContainer[l];
                        if (broadOverlapTest(objA, objB) === true) {
                            possibleCollisions.push([objA, objB]);
                        }
                    }
                }
            }
        }

        // forall objects that are stored in this grid
        for (j = 0; j < grid.allObjects.length; j++) {
            objA = grid.allObjects[j];
            objAAABB = objA.getAABB();

            // for all grids with cellsize larger than grid
            for (k = i + 1; k < this._grids.length; k++) {
                biggerGrid = this._grids[k];
                objAHashInBiggerGrid = biggerGrid.toHash(objAAABB.min[0], objAAABB.min[1]);
                cell = biggerGrid.allCells[objAHashInBiggerGrid];

                // check objA against every object in all cells in offset array of cell
                // for all adjacent cells...
                for (c = 0; c < cell.neighborOffsetArray.length; c++) {
                    offset = cell.neighborOffsetArray[c];

                    // if(offset === null) { continue; }

                    adjacentCell = biggerGrid.allCells[cell.allCellsIndex + offset];

                    // for all objects in the adjacent cell...
                    for (l = 0; l < adjacentCell.objectContainer.length; l++) {
                        objB = adjacentCell.objectContainer[l];
                        // test against object A
                        if (broadOverlapTest(objA, objB) === true) {
                            possibleCollisions.push([objA, objB]);
                        }
                    }
                }
            }
        }
    }

    // return list of object pairs
    return possibleCollisions;
};

HSHG.update_RECOMPUTE = update_RECOMPUTE;
HSHG.update_REMOVEALL = update_REMOVEALL;

/**
 * Grid
 *
 * @constructor
 * @param    int cellSize  the pixel size of each cell of the grid
 * @param    int cellCount  the total number of cells for the grid (width x height)
 * @param    HSHG parentHierarchy    the HSHG to which this grid belongs
 * @return  void
 */
function Grid(cellSize, cellCount, parentHierarchy) {
    this.cellSize = cellSize;
    this.inverseCellSize = 1 / cellSize;
    this.rowColumnCount = ~~Math.sqrt(cellCount);
    this.xyHashMask = this.rowColumnCount - 1;
    this.occupiedCells = [];
    this.allCells = Array(this.rowColumnCount * this.rowColumnCount);
    this.allObjects = [];
    this.sharedInnerOffsets = [];

    this._parentHierarchy = parentHierarchy || null;
}

Grid.prototype.initCells = function () {

    // TODO: inner/unique offset rows 0 and 2 may need to be
    // swapped due to +y being "down" vs "up"

    var i,
        gridLength = this.allCells.length,
        x, y,
        wh = this.rowColumnCount,
        isOnRightEdge, isOnLeftEdge, isOnTopEdge, isOnBottomEdge,
        innerOffsets = [
            // y+ down offsets
            // -1 + -wh, -wh, -wh + 1,
            // -1, 0, 1,
            // wh - 1, wh, wh + 1

            // y+ up offsets
            wh - 1, wh, wh + 1,
            -1, 0, 1,
            -1 + -wh, -wh, -wh + 1
        ],
        leftOffset, rightOffset, topOffset, bottomOffset,
        uniqueOffsets = [],
        cell;

    this.sharedInnerOffsets = innerOffsets;

    // init all cells, creating offset arrays as needed

    for (i = 0; i < gridLength; i++) {

        cell = new Cell();
        // compute row (y) and column (x) for an index
        y = ~~(i / this.rowColumnCount);
        x = ~~(i - (y * this.rowColumnCount));

        // reset / init
        isOnRightEdge = false;
        isOnLeftEdge = false;
        isOnTopEdge = false;
        isOnBottomEdge = false;

        // right or left edge cell
        if ((x + 1) % this.rowColumnCount == 0) {
            isOnRightEdge = true;
        } else if (x % this.rowColumnCount == 0) {
            isOnLeftEdge = true;
        }

        // top or bottom edge cell
        if ((y + 1) % this.rowColumnCount == 0) {
            isOnTopEdge = true;
        } else if (y % this.rowColumnCount == 0) {
            isOnBottomEdge = true;
        }

        // if cell is edge cell, use unique offsets, otherwise use inner offsets
        if (isOnRightEdge || isOnLeftEdge || isOnTopEdge || isOnBottomEdge) {

            // figure out cardinal offsets first
            rightOffset = isOnRightEdge === true ? -wh + 1 : 1;
            leftOffset = isOnLeftEdge === true ? wh - 1 : -1;
            topOffset = isOnTopEdge === true ? -gridLength + wh : wh;
            bottomOffset = isOnBottomEdge === true ? gridLength - wh : -wh;

            // diagonals are composites of the cardinals
            uniqueOffsets = [
                // y+ down offset
                // leftOffset + bottomOffset, bottomOffset, rightOffset + bottomOffset,
                // leftOffset, 0, rightOffset,
                // leftOffset + topOffset, topOffset, rightOffset + topOffset

                // y+ up offset
                leftOffset + topOffset, topOffset, rightOffset + topOffset,
                leftOffset, 0, rightOffset,
                leftOffset + bottomOffset, bottomOffset, rightOffset + bottomOffset
            ];

            cell.neighborOffsetArray = uniqueOffsets;
        } else {
            cell.neighborOffsetArray = this.sharedInnerOffsets;
        }

        cell.allCellsIndex = i;
        this.allCells[i] = cell;
    }
};

Grid.prototype.toHash = function (x, y, z) {
    var i, xHash, yHash;

    if (x < 0) {
        i = (-x) * this.inverseCellSize;
        xHash = this.rowColumnCount - 1 - (~~i & this.xyHashMask);
    } else {
        i = x * this.inverseCellSize;
        xHash = ~~i & this.xyHashMask;
    }

    if (y < 0) {
        i = (-y) * this.inverseCellSize;
        yHash = this.rowColumnCount - 1 - (~~i & this.xyHashMask);
    } else {
        i = y * this.inverseCellSize;
        yHash = ~~i & this.xyHashMask;
    }

    // if(z < 0){
    //	i = (-z) * this.inverseCellSize;
    //	zHash = this.rowColumnCount - 1 - ( ~~i & this.xyHashMask );
    // } else {
    //	i = z * this.inverseCellSize;
    //	zHash = ~~i & this.xyHashMask;
    // }

    return xHash + yHash * this.rowColumnCount;
    // + zHash * this.rowColumnCount * this.rowColumnCount;
};

Grid.prototype.addObject = function (obj, hash) {
    var objAABB,
        objHash,
        targetCell;

    // technically, passing this in this should save some computational effort when updating objects
    if (hash !== undefined) {
        objHash = hash;
    } else {
        objAABB = obj.getAABB();
        objHash = this.toHash(objAABB.min[0], objAABB.min[1]);
    }
    targetCell = this.allCells[objHash];

    if (targetCell.objectContainer.length === 0) {
        // insert this cell into occupied cells list
        targetCell.occupiedCellsIndex = this.occupiedCells.length;
        this.occupiedCells.push(targetCell);
    }

    // add meta data to obj, for fast update/removal
    obj.HSHG.objectContainerIndex = targetCell.objectContainer.length;
    obj.HSHG.hash = objHash;
    obj.HSHG.grid = this;
    obj.HSHG.allGridObjectsIndex = this.allObjects.length;
    // add obj to cell
    targetCell.objectContainer.push(obj);

    // we can assume that the targetCell is already a member of the occupied list

    // add to grid-global object list
    this.allObjects.push(obj);

    // do test for grid density
    if (this.allObjects.length / this.allCells.length > this._parentHierarchy.MAX_OBJECT_CELL_DENSITY) {
        // grid must be increased in size
        this.expandGrid();
    }
};

Grid.prototype.removeObject = function (obj) {
    var meta = obj.HSHG,
        hash,
        containerIndex,
        allGridObjectsIndex,
        cell,
        replacementCell,
        replacementObj;

    hash = meta.hash;
    containerIndex = meta.objectContainerIndex;
    allGridObjectsIndex = meta.allGridObjectsIndex;
    cell = this.allCells[hash];

    // remove object from cell object container
    if (cell.objectContainer.length === 1) {
        // this is the last object in the cell, so reset it
        cell.objectContainer.length = 0;

        // remove cell from occupied list
        if (cell.occupiedCellsIndex === this.occupiedCells.length - 1) {
            // special case if the cell is the newest in the list
            this.occupiedCells.pop();
        } else {
            replacementCell = this.occupiedCells.pop();
            replacementCell.occupiedCellsIndex = cell.occupiedCellsIndex;
            this.occupiedCells[cell.occupiedCellsIndex] = replacementCell;
        }

        cell.occupiedCellsIndex = null;
    } else {
        // there is more than one object in the container
        if (containerIndex === cell.objectContainer.length - 1) {
            // special case if the obj is the newest in the container
            cell.objectContainer.pop();
        } else {
            replacementObj = cell.objectContainer.pop();
            replacementObj.HSHG.objectContainerIndex = containerIndex;
            cell.objectContainer[containerIndex] = replacementObj;
        }
    }

    // remove object from grid object list
    if (allGridObjectsIndex === this.allObjects.length - 1) {
        this.allObjects.pop();
    } else {
        replacementObj = this.allObjects.pop();
        replacementObj.HSHG.allGridObjectsIndex = allGridObjectsIndex;
        this.allObjects[allGridObjectsIndex] = replacementObj;
    }
};

Grid.prototype.expandGrid = function () {
    var i, currentCellCount = this.allCells.length,
        currentRowColumnCount = this.rowColumnCount,
        currentXYHashMask = this.xyHashMask,

        newCellCount = currentCellCount * 4, // double each dimension
        newRowColumnCount = ~~Math.sqrt(newCellCount),
        newXYHashMask = newRowColumnCount - 1,
        allObjects = this.allObjects.slice(0); // duplicate array, not objects contained

    // remove all objects
    for (i = 0; i < allObjects.length; i++) {
        this.removeObject(allObjects[i]);
    }

    // reset grid values, set new grid to be 4x larger than last
    this.rowColumnCount = newRowColumnCount;
    this.allCells = Array(this.rowColumnCount * this.rowColumnCount);
    this.xyHashMask = newXYHashMask;

    // initialize new cells
    this.initCells();

    // re-add all objects to grid
    for (i = 0; i < allObjects.length; i++) {
        this.addObject(allObjects[i]);
    }
};

/**
 * A cell of the grid
 *
 * @constructor
 * @return  void   desc
 */
function Cell() {
    this.objectContainer = [];
    this.neighborOffsetArray;
    this.occupiedCellsIndex = null;
    this.allCellsIndex = null;
}

// ---------------------------------------------------------------------
// EXPORTS
// ---------------------------------------------------------------------

HSHG._private = {
    Grid: Grid,
    Cell: Cell,
    testAABBOverlap: testAABBOverlap,
    getLongestAABBEdge: getLongestAABBEdge
};

// Collision detection based on Hierarchical Spatial Hash Grid
// uses this implementation https://gist.github.com/kirbysayshi/1760774
class HSHGCollisionDetection {

    constructor(options) {
        this.options = Object.assign({ COLLISION_DISTANCE: 28 }, options);
    }

    init(options) {
        this.gameEngine = options.gameEngine;
        this.grid = new HSHG();
        this.previousCollisionPairs = {};
        this.stepCollidingPairs = {};

        this.gameEngine.on('objectAdded', obj => {
            // add the gameEngine obj the the spatial grid
            this.grid.addObject(obj);
        });

        this.gameEngine.on('objectDestroyed', obj => {
            // add the gameEngine obj the the spatial grid
            this.grid.removeObject(obj);
        });
    }

    detect() {
        this.grid.update();
        this.stepCollidingPairs = this.grid.queryForCollisionPairs().reduce((accumulator, currentValue, i) => {
            let pairId = getArrayPairId(currentValue);
            accumulator[pairId] = { o1: currentValue[0], o2: currentValue[1] };
            return accumulator;
        }, {});

        for (let pairId of Object.keys(this.previousCollisionPairs)) {
            let pairObj = this.previousCollisionPairs[pairId];

            // existed in previous pairs, but not during this step: this pair stopped colliding
            if (pairId in this.stepCollidingPairs === false) {
                this.gameEngine.emit('collisionStop', pairObj);
            }
        }

        for (let pairId of Object.keys(this.stepCollidingPairs)) {
            let pairObj = this.stepCollidingPairs[pairId];

            // didn't exist in previous pairs, but exists now: this is a new colliding pair
            if (pairId in this.previousCollisionPairs === false) {
                this.gameEngine.emit('collisionStart', pairObj);
            }
        }

        this.previousCollisionPairs = this.stepCollidingPairs;
    }

    /**
     * checks wheter two objects are currently colliding
     * @param {Object} o1 first object
     * @param {Object} o2 second object
     * @return {boolean} are the two objects colliding?
     */
    areObjectsColliding(o1, o2) {
        return getArrayPairId([o1, o2]) in this.stepCollidingPairs;
    }

}

function getArrayPairId(arrayPair) {
    // make sure to get the same id regardless of object order
    let sortedArrayPair = arrayPair.slice(0).sort();
    return sortedArrayPair[0].id + '-' + sortedArrayPair[1].id;
}

let differenceVector = new TwoVector();

// The collision detection of SimplePhysicsEngine is a brute-force approach
class BruteForceCollisionDetection {

    constructor(options) {
        this.options = Object.assign({
            autoResolve: true
        }, options);
        this.collisionPairs = {};
    }

    init(options) {
        this.gameEngine = options.gameEngine;
    }

    findCollision(o1, o2) {

        // static objects don't collide
        if (o1.isStatic && o2.isStatic)
            return false;

        // allow a collision checker function
        if (typeof o1.collidesWith === 'function') {
            if (!o1.collidesWith(o2))
                return false;
        }

        // radius-based collision
        if (this.options.collisionDistance) {
            differenceVector.copy(o1.position).subtract(o2.position);
            return differenceVector.length() < this.options.collisionDistance;
        }

        // check for no-collision first
        let o1Box = getBox(o1);
        let o2Box = getBox(o2);
        if (o1Box.xMin > o2Box.xMax ||
            o1Box.yMin > o2Box.yMax ||
            o2Box.xMin > o1Box.xMax ||
            o2Box.yMin > o1Box.yMax)
            return false;

        if (!this.options.autoResolve)
            return true;

        // need to auto-resolve
        let shiftY1 = o2Box.yMax - o1Box.yMin;
        let shiftY2 = o1Box.yMax - o2Box.yMin;
        let shiftX1 = o2Box.xMax - o1Box.xMin;
        let shiftX2 = o1Box.xMax - o2Box.xMin;
        let smallestYShift = Math.min(Math.abs(shiftY1), Math.abs(shiftY2));
        let smallestXShift = Math.min(Math.abs(shiftX1), Math.abs(shiftX2));

        // choose to apply the smallest shift which solves the collision
        if (smallestYShift < smallestXShift) {
            if (o1Box.yMin > o2Box.yMin && o1Box.yMin < o2Box.yMax) {
                if (o2.isStatic) o1.position.y += shiftY1;
                else if (o1.isStatic) o2.position.y -= shiftY1;
                else {
                    o1.position.y += shiftY1 / 2;
                    o2.position.y -= shiftY1 / 2;
                }
            } else if (o1Box.yMax > o2Box.yMin && o1Box.yMax < o2Box.yMax) {
                if (o2.isStatic) o1.position.y -= shiftY2;
                else if (o1.isStatic) o2.position.y += shiftY2;
                else {
                    o1.position.y -= shiftY2 / 2;
                    o2.position.y += shiftY2 / 2;
                }
            }
            o1.velocity.y = 0;
            o2.velocity.y = 0;
        } else {
            if (o1Box.xMin > o2Box.xMin && o1Box.xMin < o2Box.xMax) {
                if (o2.isStatic) o1.position.x += shiftX1;
                else if (o1.isStatic) o2.position.x -= shiftX1;
                else {
                    o1.position.x += shiftX1 / 2;
                    o2.position.x -= shiftX1 / 2;
                }
            } else if (o1Box.xMax > o2Box.xMin && o1Box.xMax < o2Box.xMax) {
                if (o2.isStatic) o1.position.x -= shiftX2;
                else if (o1.isStatic) o2.position.x += shiftX2;
                else {
                    o1.position.x -= shiftX2 / 2;
                    o2.position.x += shiftX2 / 2;
                }
            }
            o1.velocity.x = 0;
            o2.velocity.x = 0;
        }

        return true;
    }

    // check if pair (id1, id2) have collided
    checkPair(id1, id2) {
        let objects = this.gameEngine.world.objects;
        let o1 = objects[id1];
        let o2 = objects[id2];

        // make sure that objects actually exist. might have been destroyed
        if (!o1 || !o2) return;
        let pairId = [id1, id2].join(',');

        if (this.findCollision(o1, o2)) {
            if (!(pairId in this.collisionPairs)) {
                this.collisionPairs[pairId] = true;
                this.gameEngine.emit('collisionStart', { o1, o2 });
            }
        } else if (pairId in this.collisionPairs) {
            this.gameEngine.emit('collisionStop', { o1, o2 });
            delete this.collisionPairs[pairId];
        }
    }

    // detect by checking all pairs
    detect() {
        let objects = this.gameEngine.world.objects;
        let keys = Object.keys(objects);

        // delete non existant object pairs
        for (let pairId in this.collisionPairs)
            if (this.collisionPairs.hasOwnProperty(pairId))
                if (keys.indexOf(pairId.split(',')[0]) === -1 || keys.indexOf(pairId.split(',')[1]) === -1)
                    delete this.collisionPairs[pairId];

        // check all pairs
        for (let k1 of keys)
            for (let k2 of keys)
                if (k2 > k1) this.checkPair(k1, k2);
    }
}

// get bounding box of object o
function getBox(o) {
    return {
        xMin: o.position.x,
        xMax: o.position.x + o.width,
        yMin: o.position.y,
        yMax: o.position.y + o.height
    };
}

let dv = new TwoVector();
let dx = new TwoVector();

/**
 * SimplePhysicsEngine is a pseudo-physics engine which works with
 * objects of class DynamicObject.
 * The Simple Physics Engine is a "fake" physics engine, which is more
 * appropriate for arcade games, and it is sometimes referred to as "arcade"
 * physics. For example if a character is standing at the edge of a platform,
 * with only one foot on the platform, it won't fall over. This is a desired
 * game behaviour in platformer games.
 */
class SimplePhysicsEngine extends PhysicsEngine {

    /**
    * Creates an instance of the Simple Physics Engine.
    * @param {Object} options - physics options
    * @param {Object} options.collisions - collision options
    * @param {String} options.collisions.type - can be set to "HSHG" or "bruteForce".  Default is Brute-Force collision detection.
    * @param {Number} options.collisions.collisionDistance - for brute force, this can be set for a simple distance-based (radius) collision detection.
    * @param {Boolean} options.collisions.autoResolve - for brute force collision, colliding objects should be moved apart
    * @param {TwoVector} options.gravity - TwoVector instance which describes gravity, which will be added to the velocity of all objects at every step.  For example TwoVector(0, -0.01)
    */
    constructor(options) {
        super(options);

        // todo does this mean both modules always get loaded?
        if (options.collisions && options.collisions.type === 'HSHG') {
            this.collisionDetection = new HSHGCollisionDetection(options.collisions);
        } else {
            this.collisionDetection = new BruteForceCollisionDetection(options.collisions);
        }

        /**
         * The actor's name.
         * @memberof SimplePhysicsEngine
         * @member {TwoVector} gravity affecting all objects
         */
        this.gravity = new TwoVector(0, 0);

        if (options.gravity)
            this.gravity.copy(options.gravity);

        let collisionOptions = Object.assign({ gameEngine: this.gameEngine }, options.collisionOptions);
        this.collisionDetection.init(collisionOptions);
    }

    // a single object advances, based on:
    // isRotatingRight, isRotatingLeft, isAccelerating, current velocity
    // wrap-around the world if necessary
    objectStep(o, dt) {

        // calculate factor
        if (dt === 0)
            return;

        if (dt)
            dt /= (1 / 60);
        else
            dt = 1;

        // TODO: worldsettings is a hack.  Find all places which use it in all games
        // and come up with a better solution.  for example an option sent to the physics Engine
        // with a "worldWrap:true" options
        // replace with a "worldBounds" parameter to the PhysicsEngine constructor

        let worldSettings = this.gameEngine.worldSettings;

        // TODO: remove this code in version 4: these attributes are deprecated
        if (o.isRotatingRight) { o.angle += o.rotationSpeed; }
        if (o.isRotatingLeft) { o.angle -= o.rotationSpeed; }

        // TODO: remove this code in version 4: these attributes are deprecated
        if (o.angle >= 360) { o.angle -= 360; }
        if (o.angle < 0) { o.angle += 360; }

        // TODO: remove this code in version 4: these attributes are deprecated
        if (o.isAccelerating) {
            let rad = o.angle * (Math.PI / 180);
            dv.set(Math.cos(rad), Math.sin(rad)).multiplyScalar(o.acceleration).multiplyScalar(dt);
            o.velocity.add(dv);
        }

        // apply gravity
        if (!o.isStatic) o.velocity.add(this.gravity);

        let velMagnitude = o.velocity.length();
        if ((o.maxSpeed !== null) && (velMagnitude > o.maxSpeed)) {
            o.velocity.multiplyScalar(o.maxSpeed / velMagnitude);
        }

        o.isAccelerating = false;
        o.isRotatingLeft = false;
        o.isRotatingRight = false;

        dx.copy(o.velocity).multiplyScalar(dt);
        o.position.add(dx);

        o.velocity.multiply(o.friction);

        // wrap around the world edges
        if (worldSettings.worldWrap) {
            if (o.position.x >= worldSettings.width) { o.position.x -= worldSettings.width; }
            if (o.position.y >= worldSettings.height) { o.position.y -= worldSettings.height; }
            if (o.position.x < 0) { o.position.x += worldSettings.width; }
            if (o.position.y < 0) { o.position.y += worldSettings.height; }
        }
    }

    // entry point for a single step of the Simple Physics
    step(dt, objectFilter) {

        // each object should advance
        let objects = this.gameEngine.world.objects;
        for (let objId of Object.keys(objects)) {

            // shadow objects are not re-enacted
            let ob = objects[objId];
            if (!objectFilter(ob))
                continue;

            // run the object step
            this.objectStep(ob, dt);
        }

        // emit event on collision
        this.collisionDetection.detect(this.gameEngine);
    }
}

/**
 * GameObject is the base class of all game objects.
 * It is created only for the purpose of clearly defining the game
 * object interface.
 * Game developers will use one of the subclasses such as DynamicObject,
 * or PhysicalObject.
 */
class GameObject extends Serializable {

    static get netScheme() {
        return {
            id: { type: BaseTypes.TYPES.INT32 }
        };
    }

    /**
    * Creates an instance of a game object.
    * @param {GameEngine} gameEngine - the gameEngine this object will be used in
    * @param {Object} options - options for instantiation of the GameObject
    * @param {Number} id - if set, the new instantiated object will be set to this id instead of being generated a new one. Use with caution!
    */
    constructor(gameEngine, options) {
        super();
        /**
         * The gameEngine this object will be used in
         * @member {GameEngine}
         */
        this.gameEngine = gameEngine;

        /**
        * ID of this object's instance.
        * There are three cases of instance creation which can occur:
        * 1. In the normal case, the constructor is asked to assign an ID which is unique
        * across the entire game world, including the server and all the clients.
        * 2. In extrapolation mode, the client may have an object instance which does not
        * yet exist on the server, these objects are known as shadow objects.  Their IDs must
        * be allocated from a different range.
        * 3. Also, temporary objects are created on the client side each time a sync is received.
        * These are used for interpolation purposes and as bending targets of position, velocity,
        * angular velocity, and orientation.  In this case the id will be set to null.
        * @member {Number}
        */
        this.id = null;
        if (options && 'id' in options)
            this.id = options.id;
        else if (this.gameEngine)
            this.id = this.gameEngine.world.getNewId();

        this.components = {};
    }

    /**
     * Called after the object is added to to the game world.
     * This is the right place to add renderer sub-objects, physics sub-objects
     * and any other resources that should be created
     * @param {GameEngine} gameEngine the game engine
     */
    onAddToWorld(gameEngine) {}

    /**
     * Called after the object is removed from game-world.
     * This is where renderer sub-objects and any other resources should be freed
     * @param {GameEngine} gameEngine the game engine
     */
    onRemoveFromWorld(gameEngine) {}

    /**
     * Formatted textual description of the game object.
     * @return {String} description - a string description
     */
    toString() {
        return `game-object[${this.id}]`;
    }

    /**
     * Formatted textual description of the game object's current bending properties.
     * @return {String} description - a string description
     */
    bendingToString() {
        return 'no bending';
    }

    saveState(other) {
        this.savedCopy = (new this.constructor(this.gameEngine, { id: null }));
        this.savedCopy.syncTo(other ? other : this);
    }
   /**
    * Bending is defined as the amount of error correction that will be applied
    * on the client side to a given object's physical attributes, incrementally,
    * by the time the next server broadcast is expected to arrive.
    *
    * When this percentage is 0.0, the client always ignores the server object's value.
    * When this percentage is 1.0, the server object's attributes will be applied in full.
    *
    * The GameObject bending attribute is implemented as a getter, and can provide
    * distinct values for position, velocity, angle, and angularVelocity.
    * And in each case, you can also provide overrides for local objects,
    * these attributes will be called, respectively, positionLocal, velocityLocal,
    * angleLocal, angularVelocityLocal.
    *
    * @example
    * get bending() {
    *   return {
    *     position: { percent: 1.0, min: 0.0 },
    *     velocity: { percent: 0.0, min: 0.0 },
    *     angularVelocity: { percent: 0.0 },
    *     angleLocal: { percent: 1.0 }
    *   }
    * };
    *
    * @memberof GameObject
    * @member {Object} bending
    */
    get bending() {
        return {
            position: { percent: 1.0, min: 0.0 },
            velocity: { percent: 0.0, min: 0.0 },
            angularVelocity: { percent: 0.0 },
            angleLocal: { percent: 1.0 }
        };
    }

    // TODO:
    // rather than pass worldSettings on each bend, they could
    // be passed in on the constructor just once.
    bendToCurrentState(bending, worldSettings, isLocal, bendingIncrements) {
        if (this.savedCopy) {
            this.bendToCurrent(this.savedCopy, bending, worldSettings, isLocal, bendingIncrements);
        }
        this.savedCopy = null;
    }

    bendToCurrent(original, bending, worldSettings, isLocal, bendingIncrements) {
    }

    /**
     * synchronize this object to the state of an other object, by copying all the netscheme variables.
     * This is used by the synchronizer to create temporary objects, and must be implemented by all sub-classes as well.
     * @param {GameObject} other the other object to synchronize to
     */
    syncTo(other) {
        super.syncTo(other);
    }

    // copy physical attributes to physics sub-object
    refreshToPhysics() {}

    // copy physical attributes from physics sub-object
    refreshFromPhysics() {}

    // apply a single bending increment
    applyIncrementalBending() { }

    // clean up resources
    destroy() {}

    addComponent(componentInstance) {
        componentInstance.parentObject = this;
        this.components[componentInstance.constructor.name] = componentInstance;

        // a gameEngine might not exist if this class is instantiated by the serializer
        if (this.gameEngine) {
            this.gameEngine.emit('componentAdded', this, componentInstance);
        }
    }

    removeComponent(componentName) {
        // todo cleanup of the component ?
        delete this.components[componentName];

        // a gameEngine might not exist if this class is instantiated by the serializer
        if (this.gameEngine) {
            this.gameEngine.emit('componentRemoved', this, componentName);
        }
    }

    /**
     * Check whether this game object has a certain component
     * @param {Object} componentClass the comp
     * @return {Boolean} true if the gameObject contains this component
     */
    hasComponent(componentClass) {
        return componentClass.name in this.components;
    }

    getComponent(componentClass) {
        return this.components[componentClass.name];
    }

}

class MathUtils {

    // interpolate from start to end, advancing "percent" of the way
    static interpolate(start, end, percent) {
        return (end - start) * percent + start;
    }

    // interpolate from start to end, advancing "percent" of the way
    //
    // returns just the delta. i.e. the value that must be added to the start value
    static interpolateDelta(start, end, percent) {
        return (end - start) * percent;
    }

    // interpolate from start to end, advancing "percent" of the way
    // and noting that the dimension wraps around {x >= wrapMin, x < wrapMax}
    //
    // returns just the delta. i.e. the value that must be added to the start value
    static interpolateDeltaWithWrapping(start, end, percent, wrapMin, wrapMax) {
        let wrapTest = wrapMax - wrapMin;
        if (start - end > wrapTest / 2) end += wrapTest;
        else if (end - start > wrapTest / 2) start += wrapTest;
        if (Math.abs(start - end) > wrapTest / 3) {
            console.log('wrap interpolation is close to limit.  Not sure which edge to wrap to.');
        }
        return (end - start) * percent;
    }

    static interpolateWithWrapping(start, end, percent, wrapMin, wrapMax) {
        let interpolatedVal = start + this.interpolateDeltaWithWrapping(start, end, percent, wrapMin, wrapMax);
        let wrapLength = wrapMax - wrapMin;
        if (interpolatedVal >= wrapLength) interpolatedVal -= wrapLength;
        if (interpolatedVal < 0) interpolatedVal += wrapLength;
        return interpolatedVal;
    }
}

/**
 * DynamicObject is the base class of the game's objects, for games which
 * rely on SimplePhysicsEngine.  It defines the
 * base object which can move around in the game world.  The
 * extensions of this object (the subclasses)
 * will be periodically synchronized from the server to every client.
 *
 * The dynamic objects have pseudo-physical properties, which
 * allow the client to extrapolate the position
 * of dynamic objects in-between server updates.
 */
class DynamicObject extends GameObject {

    /**
    * The netScheme is a dictionary of attributes in this game
    * object.  The attributes listed in the netScheme are those exact
    * attributes which will be serialized and sent from the server
    * to each client on every server update.
    * The netScheme member is implemented as a getter.
    *
    * You may choose not to implement this method, in which
    * case your object only transmits the default attributes
    * which are already part of {@link DynamicObject}.
    * But if you choose to add more attributes, make sure
    * the return value includes the netScheme of the super class.
    *
    * @memberof DynamicObject
    * @member {Object} netScheme
    * @example
    *     static get netScheme() {
    *       return Object.assign({
    *           mojo: { type: BaseTypes.TYPES.UINT8 },
    *         }, super.netScheme);
    *     }
    */
    static get netScheme() {
        return Object.assign({
            playerId: { type: BaseTypes.TYPES.INT16 },
            position: { type: BaseTypes.TYPES.CLASSINSTANCE },
            width: { type: BaseTypes.TYPES.INT16 },
            height: { type: BaseTypes.TYPES.INT16 },
            isStatic: { type: BaseTypes.TYPES.UINT8 },
            velocity: { type: BaseTypes.TYPES.CLASSINSTANCE },
            angle: { type: BaseTypes.TYPES.FLOAT32 }
        }, super.netScheme);
    }

    /**
    * Creates an instance of a dynamic object.
    * NOTE: all subclasses of this class must comply with this constructor signature.
    *       This is required because the engine will create temporary instances when
    *       syncs arrive on the clients.
    * @param {GameEngine} gameEngine - the gameEngine this object will be used in
    * @param {Object} options - options for the new object. See {@link GameObject}
    * @param {Object} props - properties to be set in the new object
    * @param {TwoVector} props.position - position vector
    * @param {TwoVector} props.velocity - velocity vector
    * @param {Number} props.height - object height
    * @param {Number} props.width - object width
    */
    constructor(gameEngine, options, props) {
        super(gameEngine, options);

        /**
        * ID of player who created this object
        * @member {Number}
        */
        this.playerId = (props && props.playerId) ? props.playerId : 0;

        this.bendingIncrements = 0;

        this.position = new TwoVector(0, 0);
        this.velocity = new TwoVector(0, 0);

        /**
         * Object width for collision detection purposes. Default is 1
         * @member {Number}
         */
        this.width = (props && props.width) ? props.width : 1;

        /**
         * Object height for collision detection purposes. Default is 1
         * @member {Number}
         */
        this.height = (props && props.height) ? props.height : 1;

        /**
         * Determine if the object is static (i.e. it never moves, like a wall). The value 0 implies the object is dynamic.  Default is 0 (dynamic).
         * @member {Number}
         */
        this.isStatic = (props && props.isStatic) ? props.isStatic : 0;

        /**
         * The friction coefficient. Velocity is multiplied by this for each step. Default is (1,1)
         * @member {TwoVector}
         */
        this.friction = new TwoVector(1, 1);

        /**
        * playerId
        * @member {Number}
        */
        if (props && props.playerId) this.playerId = props.playerId;

        /**
        * position
        * @member {TwoVector}
        */
        if (props && props.position) this.position.copy(props.position);

        /**
        * velocity
        * @member {TwoVector}
        */
        if (props && props.velocity) this.velocity.copy(props.velocity);

        /**
        * object orientation angle in degrees
        * @member {Number}
        */
        this.angle = 90;

        /**
        * @deprecated since version 3.0.8
        * should rotate left by {@link DynamicObject#rotationSpeed} on next step
        * @member {Boolean}
        */
        this.isRotatingLeft = false;

        /**
        * @deprecated since version 3.0.8
        * should rotate right by {@link DynamicObject#rotationSpeed} on next step
        * @member {Boolean}
        */
        this.isRotatingRight = false;

        /**
        * @deprecated since version 3.0.8
        * should accelerate by {@link DynamicObject#acceleration} on next step
        * @member {Boolean}
        */
        this.isAccelerating = false;

        /**
        * @deprecated since version 3.0.8
        * angle rotation per step
        * @member {Number}
        */
        this.rotationSpeed = 2.5;

        /**
        * @deprecated since version 3.0.8
        * acceleration per step
        * @member {Number}
        */
        this.acceleration = 0.1;

        this.deceleration = 0.99;
    }

    // convenience getters
    get x() { return this.position.x; }
    get y() { return this.position.y; }

    /**
     * Formatted textual description of the dynamic object.
     * The output of this method is used to describe each instance in the traces,
     * which significantly helps in debugging.
     *
     * @return {String} description - a string describing the DynamicObject
     */
    toString() {
        function round3(x) { return Math.round(x * 1000) / 1000; }
        return `${this.constructor.name}[${this.id}] player${this.playerId} Pos=${this.position} Vel=${this.velocity} angle${round3(this.angle)}`;
    }

    /**
     * Each object class can define its own bending overrides.
     * return an object which can include attributes: position, velocity,
     * and angle.  In each case, you can specify a min value, max
     * value, and a percent value.
     *
     * @return {Object} bending - an object with bending paramters
     */
    get bending() {
        return {
            // example:
            // position: { percent: 0.8, min: 0.0, max: 4.0 },
            // velocity: { percent: 0.4, min: 0.0 },
            // angleLocal: { percent: 0.0 }
        };
    }

    /**
    * turn object clock-wise
    * @param {Number} deltaAngle - the angle to turn, in degrees
    * @return {DynamicObject} return this object
    */
    turnRight(deltaAngle) {
        this.angle += deltaAngle;
        if (this.angle >= 360) { this.angle -= 360; }
        if (this.angle < 0) { this.angle += 360; }
        return this;
    }

    /**
    * turn object counter-clock-wise
    * @param {Number} deltaAngle - the angle to turn, in degrees
    * @return {DynamicObject} return this object
    */
    turnLeft(deltaAngle) {
        return this.turnRight(-deltaAngle);
    }

    /**
    * accelerate along the direction that the object is facing
    * @param {Number} acceleration - the acceleration
    * @return {DynamicObject} return this object
    */
    accelerate(acceleration) {
        let rad = this.angle * (Math.PI / 180);
        let dv = new TwoVector(Math.cos(rad), Math.sin(rad));
        dv.multiplyScalar(acceleration);
        this.velocity.add(dv);

        return this;
    }

    /**
     * Formatted textual description of the game object's current bending properties.
     * @return {String} description - a string description
     */
    bendingToString() {
        if (this.bendingIncrements)
            return `ΔPos=${this.bendingPositionDelta} ΔVel=${this.bendingVelocityDelta} ΔAngle=${this.bendingAngleDelta} increments=${this.bendingIncrements}`;
        return 'no bending';
    }

    /**
    * The maximum velocity allowed.  If returns null then ignored.
    * @memberof DynamicObject
    * @member {Number} maxSpeed
    */
    get maxSpeed() { return null; }

    /**
    * Copy the netscheme variables from another DynamicObject
    * This is used by the synchronizer to create temporary objects, and must be implemented by all sub-classes as well.
    * @param {DynamicObject} other DynamicObject
    */
    syncTo(other) {
        super.syncTo(other);
        this.position.copy(other.position);
        this.velocity.copy(other.velocity);
        this.width = other.width;
        this.height = other.height;
        this.bendingAngle = other.bendingAngle;
        this.rotationSpeed = other.rotationSpeed;
        this.acceleration = other.acceleration;
        this.deceleration = other.deceleration;
    }

    bendToCurrent(original, percent, worldSettings, isLocal, increments) {

        let bending = { increments, percent };
        // if the object has defined a bending multiples for this object, use them
        let positionBending = Object.assign({}, bending, this.bending.position);
        let velocityBending = Object.assign({}, bending, this.bending.velocity);
        let angleBending = Object.assign({}, bending, this.bending.angle);

        if (isLocal) {
            Object.assign(positionBending, this.bending.positionLocal);
            Object.assign(velocityBending, this.bending.velocityLocal);
            Object.assign(angleBending, this.bending.angleLocal);
        }

        // get the incremental delta position & velocity
        this.incrementScale = percent / increments;
        this.bendingPositionDelta = original.position.getBendingDelta(this.position, positionBending);
        this.bendingVelocityDelta = original.velocity.getBendingDelta(this.velocity, velocityBending);
        this.bendingAngleDelta = MathUtils.interpolateDeltaWithWrapping(original.angle, this.angle, angleBending.percent, 0, 360) / increments;

        this.bendingTarget = (new this.constructor());
        this.bendingTarget.syncTo(this);

        // revert to original
        this.position.copy(original.position);
        this.velocity.copy(original.velocity);
        this.angle = original.angle;

        // keep parameters
        this.bendingIncrements = increments;
        this.bendingOptions = bending;
    }

    applyIncrementalBending(stepDesc) {
        if (this.bendingIncrements === 0)
            return;

        let timeFactor = 1;
        if (stepDesc && stepDesc.dt)
            timeFactor = stepDesc.dt / (1000 / 60);

        const posDelta = this.bendingPositionDelta.clone().multiplyScalar(timeFactor);
        const velDelta = this.bendingVelocityDelta.clone().multiplyScalar(timeFactor);
        this.position.add(posDelta);
        this.velocity.add(velDelta);
        this.angle += (this.bendingAngleDelta * timeFactor);

        this.bendingIncrements--;
    }

    getAABB() {
        // todo take rotation into account
        // registration point is in the middle
        return {
            min: [this.x - this.width / 2, this.y - this.height / 2],
            max: [this.x + this.width / 2, this.y + this.height / 2]
        };
    }

    /**
    * Determine if this object will collide with another object.
    * Only applicable on "bruteForce" physics engine.
    * @param {DynamicObject} other DynamicObject
    * @return {Boolean} true if the two objects collide
    */
    collidesWith(other) {
        return true;
    }

}

/**
 * The PhysicalObject2D is the base class for physical game objects in 2D Physics
 */
class PhysicalObject2D extends GameObject {

    /**
    * The netScheme is a dictionary of attributes in this game
    * object.  The attributes listed in the netScheme are those exact
    * attributes which will be serialized and sent from the server
    * to each client on every server update.
    * The netScheme member is implemented as a getter.
    *
    * You may choose not to implement this method, in which
    * case your object only transmits the default attributes
    * which are already part of {@link PhysicalObject2D}.
    * But if you choose to add more attributes, make sure
    * the return value includes the netScheme of the super class.
    *
    * @memberof PhysicalObject2D
    * @member {Object} netScheme
    * @example
    *     static get netScheme() {
    *       return Object.assign({
    *           mojo: { type: BaseTypes.TYPES.UINT8 },
    *         }, super.netScheme);
    *     }
    */
    static get netScheme() {
        return Object.assign({
            playerId: { type: BaseTypes.TYPES.INT16 },
            mass: { type: BaseTypes.TYPES.FLOAT32 },
            position: { type: BaseTypes.TYPES.CLASSINSTANCE },
            angle: { type: BaseTypes.TYPES.FLOAT32 },
            velocity: { type: BaseTypes.TYPES.CLASSINSTANCE },
            angularVelocity: { type: BaseTypes.TYPES.FLOAT32 }
        }, super.netScheme);
    }

    /**
    * Creates an instance of a physical object.
    * Override to provide starting values for position, velocity, angle and angular velocity.
    * NOTE: all subclasses of this class must comply with this constructor signature.
    *       This is required because the engine will create temporary instances when
    *       syncs arrive on the clients.
    * @param {GameEngine} gameEngine - the gameEngine this object will be used in
    * @param {Object} options - options for the new object. See {@link GameObject}
    * @param {Object} props - properties to be set in the new object
    * @param {TwoVector} props.position - position vector
    * @param {TwoVector} props.velocity - velocity vector
    * @param {Number} props.angle - orientation angle
    * @param {Number} props.mass - the mass
    * @param {Number} props.angularVelocity - angular velocity
    */
    constructor(gameEngine, options, props) {
        super(gameEngine, options);
        this.playerId = 0;
        this.bendingIncrements = 0;

        // set default position, velocity and quaternion
        this.position = new TwoVector(0, 0);
        this.velocity = new TwoVector(0, 0);
        this.angle = 0;
        this.angularVelocity = 0;
        this.mass = 0;

        // use values if provided
        props = props || {};
        if (props.playerId) this.playerId = props.playerId;
        if (props.position) this.position.copy(props.position);
        if (props.velocity) this.velocity.copy(props.velocity);
        if (props.angle) this.angle = props.angle;
        if (props.angularVelocity) this.angularVelocity = props.angularVelocity;
        if (props.mass) this.mass = props.mass;

        this.class = PhysicalObject2D;
    }

    /**
     * Called after the object is added to to the game world.
     * This is the right place to add renderer sub-objects, physics sub-objects
     * and any other resources that should be created
     */
    onAddToWorld() {}

    /**
     * Formatted textual description of the dynamic object.
     * The output of this method is used to describe each instance in the traces,
     * which significantly helps in debugging.
     *
     * @return {String} description - a string describing the PhysicalObject2D
     */
    toString() {
        let p = this.position.toString();
        let v = this.velocity.toString();
        let a = this.angle;
        let av = this.angularVelocity;
        return `phyObj2D[${this.id}] player${this.playerId} Pos=${p} Vel=${v} Ang=${a} AVel=${av}`;
    }

    /**
     * Each object class can define its own bending overrides.
     * return an object which can include attributes: position, velocity,
     * angle, and angularVelocity.  In each case, you can specify a min value, max
     * value, and a percent value.
     *
     * @return {Object} bending - an object with bending paramters
     */
    get bending() {
        return {
            // example:
            // position: { percent: 0.8, min: 0.0, max: 4.0 },
            // velocity: { percent: 0.4, min: 0.0 },
            // angularVelocity: { percent: 0.0 },
            // angleLocal: { percent: 0.0 }
        };
    }

    // display object's physical attributes as a string
    // for debugging purposes mostly
    bendingToString() {
        if (this.bendingIncrements)
            return `ΔPos=${this.bendingPositionDelta} ΔVel=${this.bendingVelocityDelta} ΔAngle=${this.bendingAngleDelta} increments=${this.bendingIncrements}`;
        return 'no bending';
    }

    // derive and save the bending increment parameters:
    // - bendingPositionDelta
    // - bendingVelocityDelta
    // - bendingAVDelta
    // - bendingAngleDelta
    // these can later be used to "bend" incrementally from the state described
    // by "original" to the state described by "self"
    bendToCurrent(original, percent, worldSettings, isLocal, increments) {

        let bending = { increments, percent };
        // if the object has defined a bending multiples for this object, use them
        let positionBending = Object.assign({}, bending, this.bending.position);
        let velocityBending = Object.assign({}, bending, this.bending.velocity);
        let angleBending = Object.assign({}, bending, this.bending.angle);
        let avBending = Object.assign({}, bending, this.bending.angularVelocity);

        // check for local object overrides to bendingTarget
        if (isLocal) {
            Object.assign(positionBending, this.bending.positionLocal);
            Object.assign(velocityBending, this.bending.velocityLocal);
            Object.assign(angleBending, this.bending.angleLocal);
            Object.assign(avBending, this.bending.angularVelocityLocal);
        }

        // get the incremental delta position & velocity
        this.incrementScale = percent / increments;
        this.bendingPositionDelta = original.position.getBendingDelta(this.position, positionBending);
        this.bendingVelocityDelta = original.velocity.getBendingDelta(this.velocity, velocityBending);

        // get the incremental angular-velocity
        this.bendingAVDelta = (this.angularVelocity - original.angularVelocity) * this.incrementScale * avBending.percent;

        // get the incremental angle correction
        this.bendingAngleDelta = MathUtils.interpolateDeltaWithWrapping(original.angle, this.angle, angleBending.percent, 0, 2 * Math.PI) / increments;

        this.bendingTarget = (new this.constructor());
        this.bendingTarget.syncTo(this);

        // revert to original
        this.position.copy(original.position);
        this.angle = original.angle;
        this.angularVelocity = original.angularVelocity;
        this.velocity.copy(original.velocity);

        this.bendingIncrements = increments;
        this.bendingOptions = bending;

        this.refreshToPhysics();
    }

    syncTo(other, options) {

        super.syncTo(other);

        this.position.copy(other.position);
        this.angle = other.angle;
        this.angularVelocity = other.angularVelocity;

        if (!options || !options.keepVelocity) {
            this.velocity.copy(other.velocity);
        }

        if (this.physicsObj) this.refreshToPhysics();
    }

    // update position, angle, angular velocity, and velocity from new physical state.
    refreshFromPhysics() {
        this.copyVector(this.physicsObj.position, this.position);
        this.copyVector(this.physicsObj.velocity, this.velocity);
        this.angle = this.physicsObj.angle;
        this.angularVelocity = this.physicsObj.angularVelocity;
    }

    // generic vector copy.  We need this because different
    // physics engines have different implementations.
    // TODO: Better implementation: the physics engine implementor
    // should define copyFromLanceVector and copyToLanceVector
    copyVector(source, target) {
        let sourceVec = source;
        if (typeof source[0] === 'number' && typeof source[1] === 'number')
            sourceVec = { x: source[0], y: source[1] };

        if (typeof target.copy === 'function') {
            target.copy(sourceVec);
        } else if (target instanceof Float32Array) {
            target[0] = sourceVec.x;
            target[1] = sourceVec.y;
        } else {
            target.x = sourceVec.x;
            target.y = sourceVec.y;
        }
    }

    // update position, angle, angular velocity, and velocity from new game state.
    refreshToPhysics() {
        this.copyVector(this.position, this.physicsObj.position);
        this.copyVector(this.velocity, this.physicsObj.velocity);
        this.physicsObj.angle = this.angle;
        this.physicsObj.angularVelocity = this.angularVelocity;
    }

    // apply one increment of bending
    applyIncrementalBending(stepDesc) {
        if (this.bendingIncrements === 0)
            return;

        let timeFactor = 1;
        if (stepDesc && stepDesc.dt)
            timeFactor = stepDesc.dt / (1000 / 60);

        const posDelta = this.bendingPositionDelta.clone().multiplyScalar(timeFactor);
        const velDelta = this.bendingVelocityDelta.clone().multiplyScalar(timeFactor);
        this.position.add(posDelta);
        this.velocity.add(velDelta);
        this.angularVelocity += (this.bendingAVDelta * timeFactor);
        this.angle += (this.bendingAngleDelta * timeFactor);

        this.bendingIncrements--;
    }

    // interpolate implementation
    interpolate(nextObj, percent) {

        // slerp to target position
        this.position.lerp(nextObj.position, percent);
        this.angle = MathUtils.interpolateDeltaWithWrapping(this.angle, nextObj.angle, percent, 0, 2 * Math.PI);
    }
}

/**
 * A ThreeVector is a geometric object which is completely described
 * by three values.
 */
class ThreeVector extends Serializable {

    static get netScheme() {
        return {
            x: { type: BaseTypes.TYPES.FLOAT32 },
            y: { type: BaseTypes.TYPES.FLOAT32 },
            z: { type: BaseTypes.TYPES.FLOAT32 }
        };
    }

    /**
    * Creates an instance of a ThreeVector.
    * @param {Number} x - first value
    * @param {Number} y - second value
    * @param {Number} z - second value
    * @return {ThreeVector} v - the new ThreeVector
    */
    constructor(x, y, z) {
        super();
        this.x = x;
        this.y = y;
        this.z = z;

        return this;
    }

    /**
     * Formatted textual description of the ThreeVector.
     * @return {String} description
     */
    toString() {
        function round3(x) { return Math.round(x * 1000) / 1000; }
        return `[${round3(this.x)}, ${round3(this.y)}, ${round3(this.z)}]`;
    }

    /**
     * Multiply this ThreeVector by a scalar
     *
     * @param {Number} s the scale
     * @return {ThreeVector} returns self
     */
    multiplyScalar(s) {
        this.x *= s;
        this.y *= s;
        this.z *= s;
        return this;
    }

    /**
     * Get vector length
     *
     * @return {Number} length of this vector
     */
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    /**
     * Add other vector to this vector
     *
     * @param {ThreeVector} other the other vector
     * @return {ThreeVector} returns self
     */
    add(other) {
        this.x += other.x;
        this.y += other.y;
        this.z += other.z;
        return this;
    }

    /**
     * Subtract other vector from this vector
     *
     * @param {ThreeVector} other the other vector
     * @return {ThreeVector} returns self
     */
    subtract(other) {
        this.x -= other.x;
        this.y -= other.y;
        this.z -= other.z;
        return this;
    }

    /**
     * Normalize this vector, in-place
     *
     * @return {ThreeVector} returns self
     */
    normalize() {
        this.multiplyScalar(1 / this.length());
        return this;
    }

    /**
     * Copy values from another ThreeVector into this ThreeVector
     *
     * @param {ThreeVector} sourceObj the other vector
     * @return {ThreeVector} returns self
     */
    copy(sourceObj) {
        this.x = sourceObj.x;
        this.y = sourceObj.y;
        this.z = sourceObj.z;
        return this;
    }

    /**
     * Set ThreeVector values
     *
     * @param {Number} x x-value
     * @param {Number} y y-value
     * @param {Number} z z-value
     * @return {ThreeVector} returns self
     */
    set(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }

    /**
     * Create a clone of this vector
     *
     * @return {ThreeVector} returns clone
     */
    clone() {
        return new ThreeVector(this.x, this.y, this.z);
    }

    /**
     * Apply in-place lerp (linear interpolation) to this ThreeVector
     * towards another ThreeVector
     * @param {ThreeVector} target the target vector
     * @param {Number} p The percentage to interpolate
     * @return {ThreeVector} returns self
     */
    lerp(target, p) {
        this.x += (target.x - this.x) * p;
        this.y += (target.y - this.y) * p;
        this.z += (target.z - this.z) * p;
        return this;
    }

    /**
     * Get bending Delta Vector
     * towards another ThreeVector
     * @param {ThreeVector} target the target vector
     * @param {Object} options bending options
     * @param {Number} options.increments number of increments
     * @param {Number} options.percent The percentage to bend
     * @param {Number} options.min No less than this value
     * @param {Number} options.max No more than this value
     * @return {ThreeVector} returns new Incremental Vector
     */
    getBendingDelta(target, options) {
        let increment = target.clone();
        increment.subtract(this);
        increment.multiplyScalar(options.percent);

        // check for max case
        if ((options.max && increment.length() > options.max) ||
            (options.max && increment.length() < options.min)) {
            return new ThreeVector(0, 0, 0);
        }

        // divide into increments
        increment.multiplyScalar(1 / options.increments);

        return increment;
    }
}

const MAX_DEL_THETA = 0.2;

/**
 * A Quaternion is a geometric object which can be used to
 * represent a three-dimensional rotation.
 */
class Quaternion extends Serializable {

    static get netScheme() {
        return {
            w: { type: BaseTypes.TYPES.FLOAT32 },
            x: { type: BaseTypes.TYPES.FLOAT32 },
            y: { type: BaseTypes.TYPES.FLOAT32 },
            z: { type: BaseTypes.TYPES.FLOAT32 }
        };
    }

    /**
    * Creates an instance of a Quaternion.
    * @param {Number} w - first value
    * @param {Number} x - second value
    * @param {Number} y - third value
    * @param {Number} z - fourth value
    * @return {Quaternion} v - the new Quaternion
    */
    constructor(w, x, y, z) {
        super();
        this.w = w;
        this.x = x;
        this.y = y;
        this.z = z;

        return this;
    }

    /**
     * Formatted textual description of the Quaternion.
     * @return {String} description
     */
    toString() {
        function round3(x) { return Math.round(x * 1000) / 1000; }
        {
            let axisAngle = this.toAxisAngle();
            return `[${round3(axisAngle.angle)},${axisAngle.axis.toString()}]`;
        }
        return `[${round3(this.w)}, ${round3(this.x)}, ${round3(this.y)}, ${round3(this.z)}]`;
    }

    /**
     * copy values from another quaternion into this quaternion
     *
     * @param {Quaternion} sourceObj the quaternion to copy from
     * @return {Quaternion} returns self
     */
    copy(sourceObj) {
        this.set(sourceObj.w, sourceObj.x, sourceObj.y, sourceObj.z);
        return this;
    }

    /**
     * set quaternion values
     *
     * @param {Number} w w-value
     * @param {Number} x x-value
     * @param {Number} y y-value
     * @param {Number} z z-value
     * @return {Quaternion} returns self
     */
    set(w, x, y, z) {
        this.w = w;
        this.x = x;
        this.y = y;
        this.z = z;

        return this;
    }

    /**
     * return an axis-angle representation of this quaternion
     *
     * @return {Object} contains two attributes: axis (ThreeVector) and angle.
     */
    toAxisAngle() {

        // assuming quaternion normalised then w is less than 1, so term always positive.
        let axis = new ThreeVector(1, 0, 0);
        this.normalize();
        let angle = 2 * Math.acos(this.w);
        let s = Math.sqrt(1 - this.w * this.w);
        if (s > 0.001) {
            let divS = 1 / s;
            axis.x = this.x * divS;
            axis.y = this.y * divS;
            axis.z = this.z * divS;
        }
        if (s > Math.PI) {
            s -= 2 * Math.PI;
        }
        return { axis, angle };
    }

    normalize() {
        let l = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
        if (l === 0) {
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.w = 0;
        } else {
            l = 1 / l;
            this.x *= l;
            this.y *= l;
            this.z *= l;
            this.w *= l;
        }

        return this;
    }

    /**
     * set the values of this quaternion from an axis/angle representation
     *
     * @param {ThreeVector} axis The axis
     * @param {Number} angle angle in radians
     * @return {Quaternion} returns self
     */
    setFromAxisAngle(axis, angle) {

        if (angle < 0)
            angle += Math.PI * 2;
        let halfAngle = angle * 0.5;
        let s = Math.sin(halfAngle);
        this.x = axis.x * s;
        this.y = axis.y * s;
        this.z = axis.z * s;
        this.w = Math.cos(halfAngle);

        return this;
    }

    /**
     * conjugate the quaternion, in-place
     *
     * @return {Quaternion} returns self
     */
    conjugate() {
        this.x *= -1;
        this.y *= -1;
        this.z *= -1;
        return this;
    }

    /* eslint-disable */
    /**
     * multiply this quaternion by another, in-place
     *
     * @param {Quaternion} other The other quaternion
     * @return {Quaternion} returns self
     */
    multiply(other) {
        let aw = this.w, ax = this.x, ay = this.y, az = this.z;
        let bw = other.w, bx = other.x, by = other.y, bz = other.z;

        this.x = ax * bw + aw * bx + ay * bz - az * by;
        this.y = ay * bw + aw * by + az * bx - ax * bz;
        this.z = az * bw + aw * bz + ax * by - ay * bx;
        this.w = aw * bw - ax * bx - ay * by - az * bz;

        return this;
    }
    /* eslint-enable */

    /* eslint-disable */
    /**
     * Apply in-place slerp (spherical linear interpolation) to this quaternion,
     * towards another quaternion.
     *
     * @param {Quaternion} target The target quaternion
     * @param {Number} bending The percentage to interpolate
     * @return {Quaternion} returns self
     */
    slerp(target, bending) {

        if (bending <= 0) return this;
        if (bending >= 1) return this.copy(target);

        let aw = this.w, ax = this.x, ay = this.y, az = this.z;
        let bw = target.w, bx = target.x, by = target.y, bz = target.z;

        let cosHalfTheta = aw*bw + ax*bx + ay*by + az*bz;
        if (cosHalfTheta < 0) {
            this.set(-bw, -bx, -by, -bz);
            cosHalfTheta = -cosHalfTheta;
        } else {
            this.copy(target);
        }

        if (cosHalfTheta >= 1.0) {
            this.set(aw, ax, ay, az);
            return this;
        }

        let sqrSinHalfTheta = 1.0 - cosHalfTheta*cosHalfTheta;
        if (sqrSinHalfTheta < Number.EPSILON) {
            let s = 1 - bending;
            this.set(s*aw + bending*this.w, s*ax + bending*this.x, s*ay + bending*this.y, s*az + bending*this.z);
            return this.normalize();
        }

        let sinHalfTheta = Math.sqrt(sqrSinHalfTheta);
        let halfTheta = Math.atan2(sinHalfTheta, cosHalfTheta);
        let delTheta = bending * halfTheta;
        if (Math.abs(delTheta) > MAX_DEL_THETA)
            delTheta = MAX_DEL_THETA * Math.sign(delTheta);
        let ratioA = Math.sin(halfTheta - delTheta)/sinHalfTheta;
        let ratioB = Math.sin(delTheta)/sinHalfTheta;
        this.set(aw*ratioA + this.w*ratioB,
            ax*ratioA + this.x*ratioB,
            ay*ratioA + this.y*ratioB,
            az*ratioA + this.z*ratioB);
        return this;
    }
    /* eslint-enable */
}

/**
 * The PhysicalObject3D is the base class for physical game objects
 */
class PhysicalObject3D extends GameObject {

    /**
    * The netScheme is a dictionary of attributes in this game
    * object.  The attributes listed in the netScheme are those exact
    * attributes which will be serialized and sent from the server
    * to each client on every server update.
    * The netScheme member is implemented as a getter.
    *
    * You may choose not to implement this method, in which
    * case your object only transmits the default attributes
    * which are already part of {@link PhysicalObject3D}.
    * But if you choose to add more attributes, make sure
    * the return value includes the netScheme of the super class.
    *
    * @memberof PhysicalObject3D
    * @member {Object} netScheme
    * @example
    *     static get netScheme() {
    *       return Object.assign({
    *           mojo: { type: BaseTypes.TYPES.UINT8 },
    *         }, super.netScheme);
    *     }
    */
    static get netScheme() {
        return Object.assign({
            playerId: { type: BaseTypes.TYPES.INT16 },
            position: { type: BaseTypes.TYPES.CLASSINSTANCE },
            quaternion: { type: BaseTypes.TYPES.CLASSINSTANCE },
            velocity: { type: BaseTypes.TYPES.CLASSINSTANCE },
            angularVelocity: { type: BaseTypes.TYPES.CLASSINSTANCE }
        }, super.netScheme);
    }

    /**
    * Creates an instance of a physical object.
    * Override to provide starting values for position, velocity, quaternion and angular velocity.
    * NOTE: all subclasses of this class must comply with this constructor signature.
    *       This is required because the engine will create temporary instances when
    *       syncs arrive on the clients.
    * @param {GameEngine} gameEngine - the gameEngine this object will be used in
    * @param {Object} options - options for the new object. See {@link GameObject}
    * @param {Object} props - properties to be set in the new object
    * @param {ThreeVector} props.position - position vector
    * @param {ThreeVector} props.velocity - velocity vector
    * @param {Quaternion} props.quaternion - orientation quaternion
    * @param {ThreeVector} props.angularVelocity - 3-vector representation of angular velocity
    */
    constructor(gameEngine, options, props) {
        super(gameEngine, options);
        this.playerId = 0;
        this.bendingIncrements = 0;

        // set default position, velocity and quaternion
        this.position = new ThreeVector(0, 0, 0);
        this.velocity = new ThreeVector(0, 0, 0);
        this.quaternion = new Quaternion(1, 0, 0, 0);
        this.angularVelocity = new ThreeVector(0, 0, 0);

        // use values if provided
        props = props || {};
        if (props.position) this.position.copy(props.position);
        if (props.velocity) this.velocity.copy(props.velocity);
        if (props.quaternion) this.quaternion.copy(props.quaternion);
        if (props.angularVelocity) this.angularVelocity.copy(props.angularVelocity);

        this.class = PhysicalObject3D;
    }

    /**
     * Formatted textual description of the dynamic object.
     * The output of this method is used to describe each instance in the traces,
     * which significantly helps in debugging.
     *
     * @return {String} description - a string describing the PhysicalObject3D
     */
    toString() {
        let p = this.position.toString();
        let v = this.velocity.toString();
        let q = this.quaternion.toString();
        let a = this.angularVelocity.toString();
        return `phyObj[${this.id}] player${this.playerId} Pos${p} Vel${v} Dir${q} AVel${a}`;
    }

    // display object's physical attributes as a string
    // for debugging purposes mostly
    bendingToString() {
        if (this.bendingOptions)
            return `bend=${this.bendingOptions.percent} deltaPos=${this.bendingPositionDelta} deltaVel=${this.bendingVelocityDelta} deltaQuat=${this.bendingQuaternionDelta}`;
        return 'no bending';
    }

    // derive and save the bending increment parameters:
    // - bendingPositionDelta
    // - bendingAVDelta
    // - bendingQuaternionDelta
    // these can later be used to "bend" incrementally from the state described
    // by "original" to the state described by "self"
    bendToCurrent(original, percent, worldSettings, isLocal, increments) {

        let bending = { increments, percent };
        // if the object has defined a bending multiples for this object, use them
        let positionBending = Object.assign({}, bending, this.bending.position);
        let velocityBending = Object.assign({}, bending, this.bending.velocity);

        // check for local object overrides to bendingTarget
        if (isLocal) {
            Object.assign(positionBending, this.bending.positionLocal);
            Object.assign(velocityBending, this.bending.velocityLocal);
        }

        // get the incremental delta position & velocity
        this.incrementScale = percent / increments;
        this.bendingPositionDelta = original.position.getBendingDelta(this.position, positionBending);
        this.bendingVelocityDelta = original.velocity.getBendingDelta(this.velocity, velocityBending);
        this.bendingAVDelta = new ThreeVector(0, 0, 0);

        // get the incremental quaternion rotation
        this.bendingQuaternionDelta = (new Quaternion()).copy(original.quaternion).conjugate();
        this.bendingQuaternionDelta.multiply(this.quaternion);

        let axisAngle = this.bendingQuaternionDelta.toAxisAngle();
        axisAngle.angle *= this.incrementScale;
        this.bendingQuaternionDelta.setFromAxisAngle(axisAngle.axis, axisAngle.angle);

        this.bendingTarget = (new this.constructor());
        this.bendingTarget.syncTo(this);

        this.position.copy(original.position);
        this.quaternion.copy(original.quaternion);
        this.angularVelocity.copy(original.angularVelocity);

        this.bendingIncrements = increments;
        this.bendingOptions = bending;

        this.refreshToPhysics();
    }

    syncTo(other, options) {

        super.syncTo(other);

        this.position.copy(other.position);
        this.quaternion.copy(other.quaternion);
        this.angularVelocity.copy(other.angularVelocity);

        if (!options || !options.keepVelocity) {
            this.velocity.copy(other.velocity);
        }

        if (this.physicsObj)
            this.refreshToPhysics();
    }

    // update position, quaternion, and velocity from new physical state.
    refreshFromPhysics() {
        this.position.copy(this.physicsObj.position);
        this.quaternion.copy(this.physicsObj.quaternion);
        this.velocity.copy(this.physicsObj.velocity);
        this.angularVelocity.copy(this.physicsObj.angularVelocity);
    }

    // update position, quaternion, and velocity from new game state.
    refreshToPhysics() {
        this.physicsObj.position.copy(this.position);
        this.physicsObj.quaternion.copy(this.quaternion);
        this.physicsObj.velocity.copy(this.velocity);
        this.physicsObj.angularVelocity.copy(this.angularVelocity);
    }

    // apply one increment of bending
    applyIncrementalBending(stepDesc) {
        if (this.bendingIncrements === 0)
            return;

        if (stepDesc && stepDesc.dt) {
            const timeFactor = stepDesc.dt / (1000 / 60);
            // TODO: use clone() below.  it's cleaner
            const posDelta = (new ThreeVector()).copy(this.bendingPositionDelta).multiplyScalar(timeFactor);
            const avDelta = (new ThreeVector()).copy(this.bendingAVDelta).multiplyScalar(timeFactor);
            this.position.add(posDelta);
            this.angularVelocity.add(avDelta);

            // one approach to orientation bending is slerp:
            this.quaternion.slerp(this.bendingTarget.quaternion, this.incrementScale * timeFactor * 0.8);
        } else {
            this.position.add(this.bendingPositionDelta);
            this.angularVelocity.add(this.bendingAVDelta);
            this.quaternion.slerp(this.bendingTarget.quaternion, this.incrementScale);
        }

        // alternative: fixed delta-quaternion correction
        // TODO: adjust quaternion bending to dt timefactor precision
        // this.quaternion.multiply(this.bendingQuaternionDelta);
        this.bendingIncrements--;
    }

    // interpolate implementation
    interpolate(nextObj, percent) {

        // slerp to target position
        this.position.lerp(nextObj.position, percent);
        this.quaternion.slerp(nextObj.quaternion, percent);
    }
}

var _0777 = parseInt('0777', 8);

var mkdirp = mkdirP.mkdirp = mkdirP.mkdirP = mkdirP;

function mkdirP (p, opts, f, made) {
    if (typeof opts === 'function') {
        f = opts;
        opts = {};
    }
    else if (!opts || typeof opts !== 'object') {
        opts = { mode: opts };
    }
    
    var mode = opts.mode;
    var xfs = opts.fs || fs;
    
    if (mode === undefined) {
        mode = _0777 & (~process.umask());
    }
    if (!made) made = null;
    
    var cb = f || function () {};
    p = path.resolve(p);
    
    xfs.mkdir(p, mode, function (er) {
        if (!er) {
            made = made || p;
            return cb(null, made);
        }
        switch (er.code) {
            case 'ENOENT':
                mkdirP(path.dirname(p), opts, function (er, made) {
                    if (er) cb(er, made);
                    else mkdirP(p, opts, cb, made);
                });
                break;

            // In the case of any other error, just see if there's a dir
            // there already.  If so, then hooray!  If not, then something
            // is borked.
            default:
                xfs.stat(p, function (er2, stat) {
                    // if the stat fails, then that's super weird.
                    // let the original error be the failure reason.
                    if (er2 || !stat.isDirectory()) cb(er, made);
                    else cb(null, made);
                });
                break;
        }
    });
}

mkdirP.sync = function sync (p, opts, made) {
    if (!opts || typeof opts !== 'object') {
        opts = { mode: opts };
    }
    
    var mode = opts.mode;
    var xfs = opts.fs || fs;
    
    if (mode === undefined) {
        mode = _0777 & (~process.umask());
    }
    if (!made) made = null;

    p = path.resolve(p);

    try {
        xfs.mkdirSync(p, mode);
        made = made || p;
    }
    catch (err0) {
        switch (err0.code) {
            case 'ENOENT' :
                made = sync(path.dirname(p), opts, made);
                sync(p, opts, made);
                break;

            // In the case of any other error, just see if there's a dir
            // there already.  If so, then hooray!  If not, then something
            // is borked.
            default:
                var stat;
                try {
                    stat = xfs.statSync(p);
                }
                catch (err1) {
                    throw err0;
                }
                if (!stat.isDirectory()) throw err0;
                break;
        }
    }

    return made;
};

const SIXTY_PER_SEC = 1000 / 60;
const LOOP_SLOW_THRESH = 0.3;
const LOOP_SLOW_COUNT = 10;

/**
 * Scheduler class
 *
 */
class Scheduler {

    /**
     * schedule a function to be called
     *
     * @param {Object} options the options
     * @param {Function} options.tick the function to be called
     * @param {Number} options.period number of milliseconds between each invocation, not including the function's execution time
     * @param {Number} options.delay number of milliseconds to add when delaying or hurrying the execution
     */
    constructor(options) {
        this.options = Object.assign({
            tick: null,
            period: SIXTY_PER_SEC,
            delay: SIXTY_PER_SEC / 3
        }, options);
        this.nextExecTime = null;
        this.requestedDelay = 0;
        this.delayCounter = 0;

        // mixin for EventEmitter
        let eventEmitter$1 = new eventEmitter();
        this.on = eventEmitter$1.on;
        this.once = eventEmitter$1.once;
        this.removeListener = eventEmitter$1.removeListener;
        this.emit = eventEmitter$1.emit;

    }

    // in same cases, setTimeout is ignored by the browser,
    // this is known to happen during the first 100ms of a touch event
    // on android chrome.  Double-check the game loop using requestAnimationFrame
    nextTickChecker() {
        let currentTime = (new Date()).getTime();
        if (currentTime > this.nextExecTime) {
            this.delayCounter++;
            this.callTick();
            this.nextExecTime = currentTime + this.options.stepPeriod;
        }
        window.requestAnimationFrame(this.nextTickChecker.bind(this));
    }

    nextTick() {
        let stepStartTime = (new Date()).getTime();
        if (stepStartTime > this.nextExecTime + this.options.period * LOOP_SLOW_THRESH) {
            this.delayCounter++;
        } else
            this.delayCounter = 0;

        this.callTick();
        this.nextExecTime = stepStartTime + this.options.period + this.requestedDelay;
        this.requestedDelay = 0;
        setTimeout(this.nextTick.bind(this), this.nextExecTime - (new Date()).getTime());
    }

    callTick() {
        if (this.delayCounter >= LOOP_SLOW_COUNT) {
            this.emit('loopRunningSlow');
            this.delayCounter = 0;
        }
        this.options.tick();
    }

    /**
     * start the schedule
     * @return {Scheduler} returns this scheduler instance
     */
    start() {
        setTimeout(this.nextTick.bind(this));
        if (typeof window === 'object' && typeof window.requestAnimationFrame === 'function')
            window.requestAnimationFrame(this.nextTickChecker.bind(this));
        return this;
    }

    /**
     * delay next execution
     */
    delayTick() {
        this.requestedDelay += this.options.delay;
    }

    /**
     * hurry the next execution
     */
    hurryTick() {
        this.requestedDelay -= this.options.delay;
    }
}

const MAX_UINT_16 = 0xFFFF;

/**
 * The Serializer is responsible for serializing the game world and its
 * objects on the server, before they are sent to each client.  On the client side the
 * Serializer deserializes these objects.
 *
 */
class Serializer {

    constructor() {
        this.registeredClasses = {};
        this.customTypes = {};
        this.registerClass(TwoVector);
        this.registerClass(ThreeVector);
        this.registerClass(Quaternion);
    }

    /**
     * Adds a custom primitive to the serializer instance.
     * This will enable you to use it in an object's netScheme
     * @param customType
     */
    // TODO: the function below is not used, and it is not clear what that
    // first argument is supposed to be
    addCustomType(customType) {
        this.customTypes[customType.type] = customType;
    }

    /**
     * Checks if type can be assigned by value.
     * @param {String} type Type to Checks
     * @return {Boolean} True if type can be assigned
     */
    static typeCanAssign(type) {
        return type !== BaseTypes.TYPES.CLASSINSTANCE && type !== BaseTypes.TYPES.LIST;
    }

    /**
     * Registers a new class with the serializer, so it may be deserialized later
     * @param {Function} classObj reference to the class (not an instance!)
     * @param {String} classId Unit specifying a class ID
     */
    registerClass(classObj, classId) {
        // if no classId is specified, hash one from the class name
        classId = classId ? classId : Utils$1.hashStr(classObj.name);
        if (this.registeredClasses[classId]) {
            console.error(`Serializer: accidental override of classId ${classId} when registering class`, classObj);
        }

        this.registeredClasses[classId] = classObj;
    }

    deserialize(dataBuffer, byteOffset) {
        byteOffset = byteOffset ? byteOffset : 0;
        let localByteOffset = 0;

        let dataView = new DataView(dataBuffer);

        let objectClassId = dataView.getUint8(byteOffset + localByteOffset);

        // todo if classId is 0 - take care of dynamic serialization.
        let objectClass = this.registeredClasses[objectClassId];
        if (objectClass == null) {
            console.error('Serializer: Found a class which was not registered.  Please use serializer.registerClass() to register all serialized classes.');
        }

        localByteOffset += Uint8Array.BYTES_PER_ELEMENT; // advance the byteOffset after the classId

        // create de-referenced instance of the class. gameEngine and id will be 'tacked on' later at the sync strategies
        let obj = new objectClass(null, { id: null });
        for (let property of Object.keys(objectClass.netScheme).sort()) {
            let read = this.readDataView(dataView, byteOffset + localByteOffset, objectClass.netScheme[property]);
            obj[property] = read.data;
            localByteOffset += read.bufferSize;
        }

        return { obj, byteOffset: localByteOffset };
    }

    writeDataView(dataView, value, bufferOffset, netSchemProp) {
        if (netSchemProp.type === BaseTypes.TYPES.FLOAT32) {
            dataView.setFloat32(bufferOffset, value);
        } else if (netSchemProp.type === BaseTypes.TYPES.INT32) {
            dataView.setInt32(bufferOffset, value);
        } else if (netSchemProp.type === BaseTypes.TYPES.INT16) {
            dataView.setInt16(bufferOffset, value);
        } else if (netSchemProp.type === BaseTypes.TYPES.INT8) {
            dataView.setInt8(bufferOffset, value);
        } else if (netSchemProp.type === BaseTypes.TYPES.UINT8) {
            dataView.setUint8(bufferOffset, value);
        } else if (netSchemProp.type === BaseTypes.TYPES.STRING) {

            //   MAX_UINT_16 is a reserved (length) value which indicates string hasn't changed
            if (value === null) {
                dataView.setUint16(bufferOffset, MAX_UINT_16);
            } else {
                let strLen = value.length;
                dataView.setUint16(bufferOffset, strLen);
                let localBufferOffset = 2;
                for (let i = 0; i < strLen; i++)
                    dataView.setUint16(bufferOffset + localBufferOffset + i * 2, value.charCodeAt(i));
            }
        } else if (netSchemProp.type === BaseTypes.TYPES.CLASSINSTANCE) {
            value.serialize(this, {
                dataBuffer: dataView.buffer,
                bufferOffset: bufferOffset
            });
        } else if (netSchemProp.type === BaseTypes.TYPES.LIST) {
            let localBufferOffset = 0;

            // a list is comprised of the number of items followed by the items
            dataView.setUint16(bufferOffset + localBufferOffset, value.length);
            localBufferOffset += Uint16Array.BYTES_PER_ELEMENT;

            for (let item of value) {
                // TODO: inelegant, currently doesn't support list of lists
                if (netSchemProp.itemType === BaseTypes.TYPES.CLASSINSTANCE) {
                    let serializedObj = item.serialize(this, {
                        dataBuffer: dataView.buffer,
                        bufferOffset: bufferOffset + localBufferOffset
                    });
                    localBufferOffset += serializedObj.bufferOffset;
                } else if (netSchemProp.itemType === BaseTypes.TYPES.STRING) {
                    //   MAX_UINT_16 is a reserved (length) value which indicates string hasn't changed
                    if (item === null) {
                        dataView.setUint16(bufferOffset + localBufferOffset, MAX_UINT_16);
                        localBufferOffset += Uint16Array.BYTES_PER_ELEMENT;
                    } else {
                        let strLen = item.length;
                        dataView.setUint16(bufferOffset + localBufferOffset, strLen);
                        localBufferOffset += Uint16Array.BYTES_PER_ELEMENT;
                        for (let i = 0; i < strLen; i++)
                            dataView.setUint16(bufferOffset + localBufferOffset + i * 2, item.charCodeAt(i));
                        localBufferOffset += Uint16Array.BYTES_PER_ELEMENT * strLen;
                    }
                } else {
                    this.writeDataView(dataView, item, bufferOffset + localBufferOffset, { type: netSchemProp.itemType });
                    localBufferOffset += this.getTypeByteSize(netSchemProp.itemType);
                }
            }
        } else if (this.customTypes[netSchemProp.type]) {
            // this is a custom data property which needs to define its own write method
            this.customTypes[netSchemProp.type].writeDataView(dataView, value, bufferOffset);
        } else {
            console.error(`No custom property ${netSchemProp.type} found!`);
        }

    }

    readDataView(dataView, bufferOffset, netSchemProp) {
        let data, bufferSize;

        if (netSchemProp.type === BaseTypes.TYPES.FLOAT32) {
            data = dataView.getFloat32(bufferOffset);
            bufferSize = this.getTypeByteSize(netSchemProp.type);
        } else if (netSchemProp.type === BaseTypes.TYPES.INT32) {
            data = dataView.getInt32(bufferOffset);
            bufferSize = this.getTypeByteSize(netSchemProp.type);
        } else if (netSchemProp.type === BaseTypes.TYPES.INT16) {
            data = dataView.getInt16(bufferOffset);
            bufferSize = this.getTypeByteSize(netSchemProp.type);
        } else if (netSchemProp.type === BaseTypes.TYPES.INT8) {
            data = dataView.getInt8(bufferOffset);
            bufferSize = this.getTypeByteSize(netSchemProp.type);
        } else if (netSchemProp.type === BaseTypes.TYPES.UINT8) {
            data = dataView.getUint8(bufferOffset);
            bufferSize = this.getTypeByteSize(netSchemProp.type);
        } else if (netSchemProp.type === BaseTypes.TYPES.STRING) {
            let length = dataView.getUint16(bufferOffset);
            let localBufferOffset = Uint16Array.BYTES_PER_ELEMENT;
            bufferSize = localBufferOffset;
            if (length === MAX_UINT_16) {
                data = null;
            } else {
                let a = [];
                for (let i = 0; i < length; i++)
                    a[i] = dataView.getUint16(bufferOffset + localBufferOffset + i * 2);
                data = String.fromCharCode.apply(null, a);
                bufferSize += length * Uint16Array.BYTES_PER_ELEMENT;
            }
        } else if (netSchemProp.type === BaseTypes.TYPES.CLASSINSTANCE) {
            var deserializeData = this.deserialize(dataView.buffer, bufferOffset);
            data = deserializeData.obj;
            bufferSize = deserializeData.byteOffset;
        } else if (netSchemProp.type === BaseTypes.TYPES.LIST) {
            let localBufferOffset = 0;

            let items = [];
            let itemCount = dataView.getUint16(bufferOffset + localBufferOffset);
            localBufferOffset += Uint16Array.BYTES_PER_ELEMENT;

            for (let x = 0; x < itemCount; x++) {
                let read = this.readDataView(dataView, bufferOffset + localBufferOffset, { type: netSchemProp.itemType });
                items.push(read.data);
                localBufferOffset += read.bufferSize;
            }

            data = items;
            bufferSize = localBufferOffset;
        } else if (this.customTypes[netSchemProp.type] != null) {
            // this is a custom data property which needs to define its own read method
            data = this.customTypes[netSchemProp.type].readDataView(dataView, bufferOffset);
        } else {
            console.error(`No custom property ${netSchemProp.type} found!`);
        }

        return { data: data, bufferSize: bufferSize };
    }

    getTypeByteSize(type) {

        switch (type) {
        case BaseTypes.TYPES.FLOAT32: {
            return Float32Array.BYTES_PER_ELEMENT;
        }
        case BaseTypes.TYPES.INT32: {
            return Int32Array.BYTES_PER_ELEMENT;
        }
        case BaseTypes.TYPES.INT16: {
            return Int16Array.BYTES_PER_ELEMENT;
        }
        case BaseTypes.TYPES.INT8: {
            return Int8Array.BYTES_PER_ELEMENT;
        }
        case BaseTypes.TYPES.UINT8: {
            return Uint8Array.BYTES_PER_ELEMENT;
        }

        // not one of the basic properties
        default: {
            if (type === undefined) {
                throw 'netScheme property declared without type attribute!';
            } else if (this.customTypes[type] === null) {
                throw `netScheme property ${type} undefined! Did you forget to add it to the serializer?`;
            } else {
                return this.customTypes[type].BYTES_PER_ELEMENT;
            }
        }

        }

    }
}

class NetworkedEventFactory {

    constructor(serializer, eventName, options) {
        options = Object.assign({}, options);

        this.seriazlier = serializer;
        this.options = options;

        this.eventName = eventName;
        this.netScheme = options.netScheme;

    }

    /**
     * Creates a new networkedEvent
     * @param {Object} payload an object representing the payload to be transferred over the wire
     * @return {Serializable} the new networkedEvent object
     */
    create(payload) {
        let networkedEvent = new Serializable();
        networkedEvent.classId = Utils$1.hashStr(this.eventName);

        if (this.netScheme) {
            networkedEvent.netScheme = Object.assign({}, this.netScheme);

            // copy properties from the networkedEvent instance to its ad-hoc netsScheme
            for (let property of Object.keys(this.netScheme)) {
                networkedEvent[property] = payload[property];
            }

        }

        return networkedEvent;
    }

}

/**
 * Defines a collection of NetworkEvents to be transmitted over the wire
 */
class NetworkedEventCollection extends Serializable {

    static get netScheme() {
        return {
            events: {
                type: BaseTypes.TYPES.LIST,
                itemType: BaseTypes.TYPES.CLASSINSTANCE
            },
        };
    }

    constructor(events) {
        super();
        this.events = events || [];
    }

}

class NetworkTransmitter {

    constructor(serializer) {
        this.serializer = serializer;

        this.registeredEvents = [];

        this.serializer.registerClass(NetworkedEventCollection);

        this.registerNetworkedEventFactory('objectUpdate', {
            netScheme: {
                stepCount: { type: BaseTypes.TYPES.INT32 },
                objectInstance: { type: BaseTypes.TYPES.CLASSINSTANCE }
            }
        });

        this.registerNetworkedEventFactory('objectCreate', {
            netScheme: {
                stepCount: { type: BaseTypes.TYPES.INT32 },
                objectInstance: { type: BaseTypes.TYPES.CLASSINSTANCE }
            }
        });

        this.registerNetworkedEventFactory('objectDestroy', {
            netScheme: {
                stepCount: { type: BaseTypes.TYPES.INT32 },
                objectInstance: { type: BaseTypes.TYPES.CLASSINSTANCE }
            }
        });

        this.registerNetworkedEventFactory('syncHeader', {
            netScheme: {
                stepCount: { type: BaseTypes.TYPES.INT32 },
                fullUpdate: { type: BaseTypes.TYPES.UINT8 }
            }
        });

        this.networkedEventCollection = new NetworkedEventCollection();
    }

    registerNetworkedEventFactory(eventName, options) {
        options = Object.assign({}, options);

        let classHash = Utils$1.hashStr(eventName);

        let networkedEventPrototype = function() {};
        networkedEventPrototype.prototype.classId = classHash;
        networkedEventPrototype.prototype.eventName = eventName;
        networkedEventPrototype.netScheme = options.netScheme;

        this.serializer.registerClass(networkedEventPrototype, classHash);

        this.registeredEvents[eventName] = new NetworkedEventFactory(this.serializer, eventName, options);
    }

    addNetworkedEvent(eventName, payload) {
        if (!this.registeredEvents[eventName]) {
            console.error(`NetworkTransmitter: no such event ${eventName}`);
            return null;
        }

        let stagedNetworkedEvent = this.registeredEvents[eventName].create(payload);
        this.networkedEventCollection.events.push(stagedNetworkedEvent);

        return stagedNetworkedEvent;
    }

    serializePayload() {
        if (this.networkedEventCollection.events.length === 0)
            return null;

        let dataBuffer = this.networkedEventCollection.serialize(this.serializer);

        return dataBuffer;
    }

    deserializePayload(payload) {
        return this.serializer.deserialize(payload.dataBuffer).obj;
    }

    clearPayload() {
        this.networkedEventCollection.events = [];
    }

}

/**
 * Measures network performance between the client and the server
 * Represents both the client and server portions of NetworkMonitor
 */
class NetworkMonitor {

    constructor(server) {

        // server-side keep game name
        if (server) {
            this.server = server;
            this.gameName = Object.getPrototypeOf(server.gameEngine).constructor.name;
        }

        // mixin for EventEmitter
        let eventEmitter$1 = new eventEmitter();
        this.on = eventEmitter$1.on;
        this.once = eventEmitter$1.once;
        this.removeListener = eventEmitter$1.removeListener;
        this.emit = eventEmitter$1.emit;
    }

    // client
    registerClient(clientEngine) {
        this.queryIdCounter = 0;
        this.RTTQueries = {};

        this.movingRTTAverage = 0;
        this.movingRTTAverageFrame = [];
        this.movingFPSAverageSize = clientEngine.options.healthCheckRTTSample;
        this.clientEngine = clientEngine;
        clientEngine.socket.on('RTTResponse', this.onReceivedRTTQuery.bind(this));
        setInterval(this.sendRTTQuery.bind(this), clientEngine.options.healthCheckInterval);
    }

    sendRTTQuery() {
        // todo implement cleanup of older timestamp
        this.RTTQueries[this.queryIdCounter] = new Date().getTime();
        this.clientEngine.socket.emit('RTTQuery', this.queryIdCounter);
        this.queryIdCounter++;
    }

    onReceivedRTTQuery(queryId) {
        let RTT = (new Date().getTime()) - this.RTTQueries[queryId];

        this.movingRTTAverageFrame.push(RTT);
        if (this.movingRTTAverageFrame.length > this.movingFPSAverageSize) {
            this.movingRTTAverageFrame.shift();
        }
        this.movingRTTAverage = this.movingRTTAverageFrame.reduce((a, b) => a + b) / this.movingRTTAverageFrame.length;
        this.emit('RTTUpdate', {
            RTT: RTT,
            RTTAverage: this.movingRTTAverage
        });
    }

    // server
    registerPlayerOnServer(socket) {
        socket.on('RTTQuery', this.respondToRTTQuery.bind(this, socket));
        if (this.server && this.server.options.countConnections) {
            http.get(`http://ping.games-eu.lance.gg:2000/${this.gameName}`).on('error', () => {});
        }
    }

    respondToRTTQuery(socket, queryId) {
        socket.emit('RTTResponse', queryId);
    }

}

/**
 * ServerEngine is the main server-side singleton code.
 * Extend this class with your own server-side logic, and
 * start a single instance.
 *
 * This class should not be used to contain the actual
 * game logic.  That belongs in the GameEngine class, where the mechanics
 * of the gameplay are actually implemented.
 * The ServerEngine singleton is typically a lightweight
 * implementation, logging gameplay statistics and registering
 * user activity and user data.
 *
 * The base class implementation is responsible for starting
 * the server, initiating each game step, accepting new
 * connections and dis-connections, emitting periodic game-state
 * updates, and capturing remote user inputs.
 */
class ServerEngine {

    /**
     * create a ServerEngine instance
     *
     * @param {SocketIO} io - the SocketIO server
     * @param {GameEngine} gameEngine - instance of GameEngine
     * @param {Object} options - server options
     * @param {Number} options.stepRate - number of steps per second
     * @param {Number} options.updateRate - number of steps in each update (sync)
     * @param {Number} options.fullSyncRate - rate at which full-syncs are sent, in step count
     * @param {String} options.tracesPath - path where traces should go
     * @param {Boolean} options.countConnections - should ping player connections to lance.gg
     * @param {Boolean} options.updateOnObjectCreation - should send update immediately when new object is created
     * @param {Number} options.timeoutInterval=180 - number of seconds after which a player is automatically disconnected if no input is received. Set to 0 for no timeout
     * @return {ServerEngine} serverEngine - self
     */
    constructor(io, gameEngine, options) {
        this.options = Object.assign({
            updateRate: 6,
            stepRate: 60,
            fullSyncRate: 20,
            timeoutInterval: 180,
            updateOnObjectCreation: true,
            tracesPath: '',
            countConnections: true,
            debug: {
                serverSendLag: false
            }
        }, options);
        if (this.options.tracesPath !== '') {
            this.options.tracesPath += '/';
            mkdirp.sync(this.options.tracesPath);
        }

        this.io = io;

        /**
         * reference to game engine
         * @member {GameEngine}
         */
        this.serializer = new Serializer();
        this.gameEngine = gameEngine;
        this.gameEngine.registerClasses(this.serializer);
        this.networkTransmitter = new NetworkTransmitter(this.serializer);
        this.networkMonitor = new NetworkMonitor(this);

        /**
         * Default room name
         * @member {String} DEFAULT_ROOM_NAME
         */
        this.DEFAULT_ROOM_NAME = '/lobby';
        this.rooms = {};
        this.createRoom(this.DEFAULT_ROOM_NAME);
        this.connectedPlayers = {};
        this.playerInputQueues = {};
        this.objMemory = {};

        io.on('connection', this.onPlayerConnected.bind(this));
        this.gameEngine.on('objectAdded', this.onObjectAdded.bind(this));
        this.gameEngine.on('objectDestroyed', this.onObjectDestroyed.bind(this));

        return this;
    }

    // start the ServerEngine
    start() {
        this.gameEngine.start();
        this.gameEngine.emit('server__init');

        let schedulerConfig = {
            tick: this.step.bind(this),
            period: 1000 / this.options.stepRate,
            delay: 4
        };
        this.scheduler = new Scheduler(schedulerConfig).start();
    }

    // every server step starts here
    step() {

        // first update the trace state
        this.gameEngine.trace.setStep(this.gameEngine.world.stepCount + 1);
        this.gameEngine.emit('server__preStep', this.gameEngine.world.stepCount + 1);

        this.serverTime = (new Date().getTime());

        // for each player, replay all the inputs in the oldest step
        for (let playerIdStr of Object.keys(this.playerInputQueues)) {
            let playerId = Number(playerIdStr);
            let inputQueue = this.playerInputQueues[playerId];
            let queueSteps = Object.keys(inputQueue);
            let minStep = Math.min.apply(null, queueSteps);

            // check that there are inputs for this step,
            // and that we have reached/passed this step
            if (queueSteps.length > 0 && minStep <= this.gameEngine.world.stepCount) {
                inputQueue[minStep].forEach(input => {
                    this.gameEngine.emit('server__processInput', { input, playerId });
                    this.gameEngine.emit('processInput', { input, playerId });
                    this.gameEngine.processInput(input, playerId, true);
                });
                delete inputQueue[minStep];
            }
        }

        // run the game engine step
        this.gameEngine.step(false, this.serverTime / 1000);

        // synchronize the state to all clients
        Object.keys(this.rooms).map(this.syncStateToClients.bind(this));

        // remove memory-objects which no longer exist
        for (let objId of Object.keys(this.objMemory)) {
            if (!(objId in this.gameEngine.world.objects)) {
                delete this.objMemory[objId];
            }
        }

        // step is done on the server side
        this.gameEngine.emit('server__postStep', this.gameEngine.world.stepCount);

        if (this.gameEngine.trace.length) {
            let traceData = this.gameEngine.trace.rotate();
            let traceString = '';
            traceData.forEach(t => { traceString += `[${t.time.toISOString()}]${t.step}>${t.data}\n`; });
            fs.appendFile(`${this.options.tracesPath}server.trace`, traceString, err => { if (err) throw err; });
        }
    }

    syncStateToClients(roomName) {

        // update clients only at the specified step interval, as defined in options
        // or if this room needs to sync
        const room = this.rooms[roomName];
        if (room.requestImmediateSync ||
            this.gameEngine.world.stepCount % this.options.updateRate === 0) {

            const roomPlayers = Object.keys(this.connectedPlayers)
                .filter(p => this.connectedPlayers[p].roomName === roomName);

            // if at least one player is new, we should send a full payload
            let diffUpdate = true;
            for (const socketId of roomPlayers) {
                const player = this.connectedPlayers[socketId];
                if (player.state === 'new') {
                    player.state = 'synced';
                    diffUpdate = false;
                }
            }

            // also, one in N syncs is a full update, or a special request
            if ((room.syncCounter++ % this.options.fullSyncRate === 0) || room.requestFullSync)
                diffUpdate = false;

            const payload = this.serializeUpdate(roomName, { diffUpdate });
            this.gameEngine.trace.info(() => `========== sending world update ${this.gameEngine.world.stepCount} to room ${roomName} is delta update: ${diffUpdate} ==========`);
            for (const socketId of roomPlayers)
                this.connectedPlayers[socketId].socket.emit('worldUpdate', payload);
            this.networkTransmitter.clearPayload();
            room.requestImmediateSync = false;
            room.requestFullSync = false;
        }
    }

    // create a serialized package of the game world
    // TODO: this process could be made much much faster if the buffer creation and
    //       size calculation are done in a single phase, along with string pruning.
    serializeUpdate(roomName, options) {
        let world = this.gameEngine.world;
        let diffUpdate = Boolean(options && options.diffUpdate);

        // add this sync header
        // currently this is just the sync step count
        this.networkTransmitter.addNetworkedEvent('syncHeader', {
            stepCount: world.stepCount,
            fullUpdate: Number(!diffUpdate)
        });

        const roomObjects = Object.keys(world.objects)
            .filter(o => world.objects[o]._roomName === roomName);
        for (let objId of roomObjects) {
            let obj = world.objects[objId];
            let prevObject = this.objMemory[objId];

            // if the object (in serialized form) hasn't changed, move on
            if (diffUpdate) {
                let s = obj.serialize(this.serializer);
                if (prevObject && Utils$1.arrayBuffersEqual(s.dataBuffer, prevObject))
                    continue;
                else
                    this.objMemory[objId] = s.dataBuffer;

                // prune strings which haven't changed
                obj = obj.prunedStringsClone(this.serializer, prevObject);
            }

            this.networkTransmitter.addNetworkedEvent('objectUpdate', {
                stepCount: world.stepCount,
                objectInstance: obj
            });
        }

        return this.networkTransmitter.serializePayload();
    }

    /**
     * Create a room
     *
     * There is a default room called "/lobby".  All newly created players
     * and objects are assigned to the default room.  When the server sends
     * periodic syncs to the players, each player is only sent those objects
     * which are present in his room.
     *
     * @param {String} roomName - the new room name
     */
    createRoom(roomName) {
        this.rooms[roomName] = { syncCounter: 0, requestImmediateSync: false };
    }

    /**
     * Assign an object to a room
     *
     * @param {Object} obj - the object to move
     * @param {String} roomName - the target room
     */
    assignObjectToRoom(obj, roomName) {
        obj._roomName = roomName;
    }

    /**
     * Assign a player to a room
     *
     * @param {Number} playerId - the playerId
     * @param {String} roomName - the target room
     */
    assignPlayerToRoom(playerId, roomName) {
        const room = this.rooms[roomName];
        let player = null;
        if (!room) {
            this.gameEngine.trace.error(() => `cannot assign player to non-existant room ${roomName}`);
            console.error(`player ${playerId} assigned to room [${roomName}] which isn't defined`);
            return;
        }
        for (const p of Object.keys(this.connectedPlayers)) {
            if (this.connectedPlayers[p].socket.playerId === playerId)
                player = this.connectedPlayers[p];
        }
        if (!player) {
            this.gameEngine.trace.error(() => `cannot assign non-existant playerId ${playerId} to room ${roomName}`);
        }
        const roomUpdate = { playerId: playerId, from: player.roomName, to: roomName };
        player.socket.emit('roomUpdate', roomUpdate);
        this.gameEngine.emit('server__roomUpdate', roomUpdate);
        this.gameEngine.trace.info(() => `ROOM UPDATE: playerId ${playerId} from room ${player.roomName} to room ${roomName}`);
        player.roomName = roomName;
        room.requestImmediateSync = true;
        room.requestFullSync = true;
    }

    // handle the object creation
    onObjectAdded(obj) {
        obj._roomName = obj._roomName || this.DEFAULT_ROOM_NAME;
        this.networkTransmitter.addNetworkedEvent('objectCreate', {
            stepCount: this.gameEngine.world.stepCount,
            objectInstance: obj
        });

        if (this.options.updateOnObjectCreation) {
            this.rooms[obj._roomName].requestImmediateSync = true;
        }
    }

    // handle the object creation
    onObjectDestroyed(obj) {
        this.networkTransmitter.addNetworkedEvent('objectDestroy', {
            stepCount: this.gameEngine.world.stepCount,
            objectInstance: obj
        });
    }

    getPlayerId(socket) {
    }

    // handle new player connection
    onPlayerConnected(socket) {
        let that = this;

        console.log('Client connected');

        // save player
        this.connectedPlayers[socket.id] = {
            socket: socket,
            state: 'new',
            roomName: this.DEFAULT_ROOM_NAME
        };

        let playerId = this.getPlayerId(socket);
        if (!playerId) {
            playerId = ++this.gameEngine.world.playerCount;
        }
        socket.playerId = playerId;

        socket.lastHandledInput = null;
        socket.joinTime = (new Date()).getTime();
        this.resetIdleTimeout(socket);

        console.log('Client Connected', socket.id);

        let playerEvent = { id: socket.id, playerId, joinTime: socket.joinTime, disconnectTime: 0 };
        this.gameEngine.emit('server__playerJoined', playerEvent);
        this.gameEngine.emit('playerJoined', playerEvent);
        socket.emit('playerJoined', playerEvent);

        socket.on('disconnect', function() {
            playerEvent.disconnectTime = (new Date()).getTime();
            that.onPlayerDisconnected(socket.id, playerId);
            that.gameEngine.emit('server__playerDisconnected', playerEvent);
            that.gameEngine.emit('playerDisconnected', playerEvent);
        });

        // todo rename, use number instead of name
        socket.on('move', function(data) {
            that.onReceivedInput(data, socket);
        });

        // we got a packet of trace data, write it out to a side-file
        socket.on('trace', function(traceData) {
            traceData = JSON.parse(traceData);
            let traceString = '';
            traceData.forEach(t => { traceString += `[${t.time}]${t.step}>${t.data}\n`; });
            fs.appendFile(`${that.options.tracesPath}client.${playerId}.trace`, traceString, err => { if (err) throw err; });
        });

        this.networkMonitor.registerPlayerOnServer(socket);
    }

    // handle player timeout
    onPlayerTimeout(socket) {
        console.log(`Client timed out after ${this.options.timeoutInterval} seconds`, socket.id);
        socket.disconnect();
    }

    // handle player dis-connection
    onPlayerDisconnected(socketId, playerId) {
        delete this.connectedPlayers[socketId];
        console.log('Client disconnected');
    }

    // resets the idle timeout for a given player
    resetIdleTimeout(socket) {
        if (socket.idleTimeout) clearTimeout(socket.idleTimeout);
        if (this.options.timeoutInterval > 0) {
            socket.idleTimeout = setTimeout(() => {
                this.onPlayerTimeout(socket);
            }, this.options.timeoutInterval * 1000);
        }
    }

    // add an input to the input-queue for the specific player
    // each queue is key'd by step, because there may be multiple inputs
    // per step
    queueInputForPlayer(data, playerId) {

        // create an input queue for this player, if one doesn't already exist
        if (!this.playerInputQueues.hasOwnProperty(playerId))
            this.playerInputQueues[playerId] = {};
        let queue = this.playerInputQueues[playerId];

        // create an array of inputs for this step, if one doesn't already exist
        if (!queue[data.step]) queue[data.step] = [];

        // add the input to the player's queue
        queue[data.step].push(data);
    }

    // an input has been received from a client, queue it for next step
    onReceivedInput(data, socket) {
        if (this.connectedPlayers[socket.id]) {
            this.connectedPlayers[socket.id].socket.lastHandledInput = data.messageIndex;
        }

        this.resetIdleTimeout(socket);

        this.queueInputForPlayer(data, socket.playerId);
    }

    /**
     * Report game status
     * This method is only relevant if the game uses MatchMaker functionality.
     * This method must return the game status.
     *
     * @return {String} Stringified game status object.
     */
    gameStatus() {
        let gameStatus = {
            numPlayers: Object.keys(this.connectedPlayers).length,
            upTime: 0,
            cpuLoad: 0,
            memoryLoad: 0,
            players: {}
        };

        for (let p of Object.keys(this.connectedPlayers)) {
            gameStatus.players[p] = {
                frameRate: 0,
            };
        }

        return JSON.stringify(gameStatus);
    }

}

var lib = {
    Trace
};

export { GameEngine, GameWorld, P2PhysicsEngine, SimplePhysicsEngine, BaseTypes, TwoVector, DynamicObject, PhysicalObject2D, PhysicalObject3D, ServerEngine, lib as Lib };
