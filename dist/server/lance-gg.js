import fs$1 from 'fs';
import require$$0 from 'path';

class GameWorld {
    constructor() {
        this.stepCount = 0;
        this.objects = {};
        this.playerCount = 0;
        this.idCount = 0;
    }
    getNewId() {
        let possibleId = this.idCount;
        while (possibleId in this.objects)
            possibleId++;
        this.idCount = possibleId + 1;
        return possibleId;
    }
    queryOneObject(query) {
        let objs = this.queryObjects(query);
        return objs.length > 0 ? objs[0] : null;
    }
    queryObjects(query) {
        let queriedObjects = [];
        this.forEachObject((id, object) => {
            let conditions = [];
            conditions.push(!('id' in query) || query.id !== null && object.id === query.id);
            conditions.push(!('playerId' in query) || query.playerId !== null && object.playerId === query.playerId);
            conditions.push(!('instanceType' in query) || query.instanceType !== null && object instanceof query.instanceType);
            if ('components' in query) {
                query.components.forEach(componentClass => {
                    conditions.push(object.hasComponent(componentClass));
                });
            }
            if (conditions.every(value => value)) {
                queriedObjects.push(object);
                if (query.returnSingle)
                    return false;
            }
        });
        return queriedObjects;
    }
    queryObject(query) {
        return this.queryObjects(Object.assign(query, {
            returnSingle: true
        }));
    }
    addObject(object) {
        this.objects[object.id] = object;
    }
    removeObject(id) {
        delete this.objects[id];
    }
    forEachObject(callback) {
        for (let id of Object.keys(this.objects)) {
            let returnValue = callback(id, this.objects[id]);
            if (returnValue === false)
                break;
        }
    }
}

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var eventEmitter = {exports: {}};

var d$1 = {exports: {}};

// ES3 safe
var _undefined$1 = void 0;

var is$4 = function (value) { return value !== _undefined$1 && value !== null; };

var isValue$3 = is$4;

// prettier-ignore
var possibleTypes = { "object": true, "function": true, "undefined": true /* document.all */ };

var is$3 = function (value) {
	if (!isValue$3(value)) return false;
	return hasOwnProperty.call(possibleTypes, typeof value);
};

var isObject = is$3;

var is$2 = function (value) {
	if (!isObject(value)) return false;
	try {
		if (!value.constructor) return false;
		return value.constructor.prototype === value;
	} catch (error) {
		return false;
	}
};

var isPrototype = is$2;

var is$1 = function (value) {
	if (typeof value !== "function") return false;

	if (!hasOwnProperty.call(value, "length")) return false;

	try {
		if (typeof value.length !== "number") return false;
		if (typeof value.call !== "function") return false;
		if (typeof value.apply !== "function") return false;
	} catch (error) {
		return false;
	}

	return !isPrototype(value);
};

var isFunction = is$1;

var classRe = /^\s*class[\s{/}]/, functionToString = Function.prototype.toString;

var is = function (value) {
	if (!isFunction(value)) return false;
	if (classRe.test(functionToString.call(value))) return false;
	return true;
};

var isImplemented$2 = function () {
	var assign = Object.assign, obj;
	if (typeof assign !== "function") return false;
	obj = { foo: "raz" };
	assign(obj, { bar: "dwa" }, { trzy: "trzy" });
	return obj.foo + obj.bar + obj.trzy === "razdwatrzy";
};

var isImplemented$1;
var hasRequiredIsImplemented;

function requireIsImplemented () {
	if (hasRequiredIsImplemented) return isImplemented$1;
	hasRequiredIsImplemented = 1;

	isImplemented$1 = function () {
		try {
			Object.keys("primitive");
			return true;
		} catch (e) {
			return false;
		}
	};
	return isImplemented$1;
}

// eslint-disable-next-line no-empty-function
var noop = function () {};

var _undefined = noop(); // Support ES3 engines

var isValue$2 = function (val) { return val !== _undefined && val !== null; };

var shim$2;
var hasRequiredShim$2;

function requireShim$2 () {
	if (hasRequiredShim$2) return shim$2;
	hasRequiredShim$2 = 1;

	var isValue = isValue$2;

	var keys = Object.keys;

	shim$2 = function (object) { return keys(isValue(object) ? Object(object) : object); };
	return shim$2;
}

var keys;
var hasRequiredKeys;

function requireKeys () {
	if (hasRequiredKeys) return keys;
	hasRequiredKeys = 1;

	keys = requireIsImplemented()() ? Object.keys : requireShim$2();
	return keys;
}

var validValue;
var hasRequiredValidValue;

function requireValidValue () {
	if (hasRequiredValidValue) return validValue;
	hasRequiredValidValue = 1;

	var isValue = isValue$2;

	validValue = function (value) {
		if (!isValue(value)) throw new TypeError("Cannot use null or undefined");
		return value;
	};
	return validValue;
}

var shim$1;
var hasRequiredShim$1;

function requireShim$1 () {
	if (hasRequiredShim$1) return shim$1;
	hasRequiredShim$1 = 1;

	var keys  = requireKeys()
	  , value = requireValidValue()
	  , max   = Math.max;

	shim$1 = function (dest, src /*, …srcn*/) {
		var error, i, length = max(arguments.length, 2), assign;
		dest = Object(value(dest));
		assign = function (key) {
			try {
				dest[key] = src[key];
			} catch (e) {
				if (!error) error = e;
			}
		};
		for (i = 1; i < length; ++i) {
			src = arguments[i];
			keys(src).forEach(assign);
		}
		if (error !== undefined) throw error;
		return dest;
	};
	return shim$1;
}

var assign$1 = isImplemented$2() ? Object.assign : requireShim$1();

var isValue$1 = isValue$2;

var forEach = Array.prototype.forEach, create = Object.create;

var process$1 = function (src, obj) {
	var key;
	for (key in src) obj[key] = src[key];
};

// eslint-disable-next-line no-unused-vars
var normalizeOptions = function (opts1 /*, …options*/) {
	var result = create(null);
	forEach.call(arguments, function (options) {
		if (!isValue$1(options)) return;
		process$1(Object(options), result);
	});
	return result;
};

var str = "razdwatrzy";

var isImplemented = function () {
	if (typeof str.contains !== "function") return false;
	return str.contains("dwa") === true && str.contains("foo") === false;
};

var shim;
var hasRequiredShim;

function requireShim () {
	if (hasRequiredShim) return shim;
	hasRequiredShim = 1;

	var indexOf = String.prototype.indexOf;

	shim = function (searchString /*, position*/) {
		return indexOf.call(this, searchString, arguments[1]) > -1;
	};
	return shim;
}

var contains$1 = isImplemented() ? String.prototype.contains : requireShim();

var isValue         = is$4
  , isPlainFunction = is
  , assign          = assign$1
  , normalizeOpts   = normalizeOptions
  , contains        = contains$1;

var d = (d$1.exports = function (dscr, value/*, options*/) {
	var c, e, w, options, desc;
	if (arguments.length < 2 || typeof dscr !== "string") {
		options = value;
		value = dscr;
		dscr = null;
	} else {
		options = arguments[2];
	}
	if (isValue(dscr)) {
		c = contains.call(dscr, "c");
		e = contains.call(dscr, "e");
		w = contains.call(dscr, "w");
	} else {
		c = w = true;
		e = false;
	}

	desc = { value: value, configurable: c, enumerable: e, writable: w };
	return !options ? desc : assign(normalizeOpts(options), desc);
});

d.gs = function (dscr, get, set/*, options*/) {
	var c, e, options, desc;
	if (typeof dscr !== "string") {
		options = set;
		set = get;
		get = dscr;
		dscr = null;
	} else {
		options = arguments[3];
	}
	if (!isValue(get)) {
		get = undefined;
	} else if (!isPlainFunction(get)) {
		options = get;
		get = set = undefined;
	} else if (!isValue(set)) {
		set = undefined;
	} else if (!isPlainFunction(set)) {
		options = set;
		set = undefined;
	}
	if (isValue(dscr)) {
		c = contains.call(dscr, "c");
		e = contains.call(dscr, "e");
	} else {
		c = true;
		e = false;
	}

	desc = { get: get, set: set, configurable: c, enumerable: e };
	return !options ? desc : assign(normalizeOpts(options), desc);
};

var dExports = d$1.exports;

var validCallable = function (fn) {
	if (typeof fn !== "function") throw new TypeError(fn + " is not a function");
	return fn;
};

(function (module, exports) {

	var d        = dExports
	  , callable = validCallable

	  , apply = Function.prototype.apply, call = Function.prototype.call
	  , create = Object.create, defineProperty = Object.defineProperty
	  , defineProperties = Object.defineProperties
	  , hasOwnProperty = Object.prototype.hasOwnProperty
	  , descriptor = { configurable: true, enumerable: false, writable: true }

	  , on, once, off, emit, methods, descriptors, base;

	on = function (type, listener) {
		var data;

		callable(listener);

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

		callable(listener);
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

		callable(listener);

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
		on: d(on),
		once: d(once),
		off: d(off),
		emit: d(emit)
	};

	base = defineProperties({}, descriptors);

	module.exports = exports = function (o) {
		return (o == null) ? create(base) : defineProperties(Object(o), descriptors);
	};
	exports.methods = methods; 
} (eventEmitter, eventEmitter.exports));

var eventEmitterExports = eventEmitter.exports;
var EventEmitter$4 = /*@__PURE__*/getDefaultExportFromCjs(eventEmitterExports);

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
        let timerEvent = new TimerEvent(this, 'repeat', time, callback);
        this.events[timerEvent.id] = timerEvent;
        return timerEvent;
    }
    add(time, callback, thisContext, args) {
        let timerEvent = new TimerEvent(this, 'single', time, callback, thisContext, args);
        this.events[timerEvent.id] = timerEvent;
        return timerEvent;
    }
    destroy(id) {
        delete this.events[id];
    }
}
class TimerEvent {
    constructor(timer, type, time, callback, thisContext = null, args = null) {
        this.id = ++timer.idCounter;
        this.timer = timer;
        this.type = type;
        this.time = time;
        this.callback = callback;
        this.startOffset = timer.currentTime;
        this.thisContext = thisContext;
        this.args = args;
        this.destroy = function () {
            this.timer.destroy(this.id);
        };
    }
}

class Trace {
    constructor(options) {
        this.options = Object.assign({
            traceLevel: Trace.TRACE_DEBUG
        }, options);
        this.traceBuffer = [];
        this.step = 'initializing';
        this.error = this.trace.bind(this, Trace.TRACE_ERROR);
        this.warn = this.trace.bind(this, Trace.TRACE_WARN);
        this.info = this.trace.bind(this, Trace.TRACE_INFO);
        this.debug = this.trace.bind(this, Trace.TRACE_DEBUG);
        this.trace = this.trace.bind(this, Trace.TRACE_ALL);
    }
    static get TRACE_ALL() { return 0; }
    static get TRACE_DEBUG() { return 1; }
    static get TRACE_INFO() { return 2; }
    static get TRACE_WARN() { return 3; }
    static get TRACE_ERROR() { return 4; }
    static get TRACE_NONE() { return 1000; }
    trace(level, dataCB) {
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

class GameEngine {
    constructor(options) {
        const isServerSide = (typeof window === 'undefined');
        const glob = isServerSide ? global : window;
        glob.LANCE = { gameEngine: this };
        const defaultOpts = { traceLevel: Trace.TRACE_NONE, clientIDSpace: NaN };
        if (!isServerSide)
            defaultOpts.clientIDSpace = 1000000;
        this.options = Object.assign(defaultOpts, options);
        this.playerId = NaN;
        let eventEmitter = EventEmitter$4();
        this.on = eventEmitter.on;
        this.once = eventEmitter.once;
        this.removeListener = eventEmitter.off;
        this.off = eventEmitter.off;
        this.emit = eventEmitter.emit;
        this.trace = new Trace({ traceLevel: this.options.traceLevel });
    }
    findLocalShadow(serverObj) {
        for (let localId of Object.keys(this.world.objects)) {
            if (Number(localId) < this.options.clientIDSpace)
                continue;
            let localObj = this.world.objects[localId];
            if (localObj.hasOwnProperty('inputId') && localObj.inputId === serverObj.inputId)
                return localObj;
        }
        return null;
    }
    initWorld(worldSettings) {
        this.world = new GameWorld();
        if (this.options.clientIDSpace) {
            this.world.idCount = this.options.clientIDSpace;
        }
        this.worldSettings = Object.assign({}, worldSettings);
    }
    start() {
        this.trace.info(() => '========== game engine started ==========');
        this.initWorld();
        this.timer = new Timer();
        this.timer.play();
        this.on('postStep', (step, isReenact) => {
            if (!isReenact)
                this.timer.tick();
        });
        this.emit('start', { timestamp: (new Date()).getTime() });
    }
    step(isReenact, t, dt, physicsOnly) {
        if (physicsOnly && dt) {
            if (dt)
                dt /= 1000;
            this.physicsEngine.step(dt, objectFilter);
            return;
        }
        if (isReenact === undefined)
            throw new Error('game engine does not forward argument isReenact to super class');
        isReenact = Boolean(isReenact);
        let step = ++this.world.stepCount;
        let clientIDSpace = this.options.clientIDSpace;
        this.emit('preStep', { step, isReenact, dt });
        function objectFilter(o) {
            return !isReenact || o.id < clientIDSpace;
        }
        if (this.physicsEngine && !this.ignorePhysics) {
            if (dt)
                dt /= 1000;
            this.physicsEngine.step(dt, objectFilter);
        }
        this.world.forEachObject((id, o) => {
            if (typeof o.refreshFromPhysics === 'function')
                o.refreshFromPhysics();
            this.trace.trace(() => `object[${id}] after ${isReenact ? 'reenact' : 'step'} : ${o.toString()}`);
        });
        this.emit('postStep', { step, isReenact });
    }
    addObjectToWorld(object) {
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
        if (typeof object.onAddToWorld === 'function')
            object.onAddToWorld(this);
        this.emit('objectAdded', object);
        this.trace.info(() => `========== object added ${object.toString()} ==========`);
        return object;
    }
    processInput(inputDesc, playerId, isServer) {
        this.trace.info(() => `game engine processing input[${inputDesc.messageIndex}] <${inputDesc.input}> from playerId ${playerId}`);
    }
    removeObjectFromWorld(objectId) {
        if (typeof objectId === 'object')
            objectId = objectId.id;
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
    isOwnedByPlayer(object) {
        return (object.playerId == this.playerId);
    }
    registerClasses(serializer) {
    }
    getPlayerGameOverResult() {
        return null;
    }
}

class PhysicsEngine {
    constructor(options) {
        this.options = options;
        this.gameEngine = options.gameEngine;
        if (!options.gameEngine) {
            console.warn('Physics engine initialized without gameEngine!');
        }
    }
    step(dt, objectFilter) { }
}

var p2 = {exports: {}};

var vec2$q = {exports: {}};

/* global P2_ARRAY_TYPE */

var Utils_1 = Utils$a;

/**
 * Misc utility functions
 * @class Utils
 * @constructor
 */
function Utils$a(){}

/**
 * Append the values in array b to the array a. See <a href="http://stackoverflow.com/questions/1374126/how-to-append-an-array-to-an-existing-javascript-array/1374131#1374131">this</a> for an explanation.
 * @method appendArray
 * @static
 * @param  {Array} a
 * @param  {Array} b
 */
Utils$a.appendArray = function(a,b){
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
Utils$a.splice = function(array,index,howmany){
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
    Utils$a.ARRAY_TYPE = P2_ARRAY_TYPE;
} else if (typeof Float32Array !== 'undefined'){
    Utils$a.ARRAY_TYPE = Float32Array;
} else {
    Utils$a.ARRAY_TYPE = Array;
}

/**
 * Extend an object with the properties of another
 * @static
 * @method extend
 * @param  {object} a
 * @param  {object} b
 */
Utils$a.extend = function(a,b){
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
Utils$a.defaults = function(options, defaults){
    options = options || {};
    for(var key in defaults){
        if(!(key in options)){
            options[key] = defaults[key];
        }
    }
    return options;
};

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

var vec2$p = vec2$q.exports = {};

var Utils$9 = Utils_1;

/**
 * Make a cross product and only return the z component
 * @method crossLength
 * @static
 * @param  {Array} a
 * @param  {Array} b
 * @return {Number}
 */
vec2$p.crossLength = function(a,b){
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
vec2$p.crossVZ = function(out, vec, zcomp){
    vec2$p.rotate(out,vec,-Math.PI/2);// Rotate according to the right hand rule
    vec2$p.scale(out,out,zcomp);      // Scale with z
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
vec2$p.crossZV = function(out, zcomp, vec){
    vec2$p.rotate(out,vec,Math.PI/2); // Rotate according to the right hand rule
    vec2$p.scale(out,out,zcomp);      // Scale with z
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
vec2$p.rotate = function(out,a,angle){
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
vec2$p.rotate90cw = function(out, a) {
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
vec2$p.toLocalFrame = function(out, worldPoint, framePosition, frameAngle){
    vec2$p.copy(out, worldPoint);
    vec2$p.sub(out, out, framePosition);
    vec2$p.rotate(out, out, -frameAngle);
};

/**
 * Transform a point position to global frame.
 * @method toGlobalFrame
 * @param  {Array} out
 * @param  {Array} localPoint
 * @param  {Array} framePosition
 * @param  {Number} frameAngle
 */
vec2$p.toGlobalFrame = function(out, localPoint, framePosition, frameAngle){
    vec2$p.copy(out, localPoint);
    vec2$p.rotate(out, out, frameAngle);
    vec2$p.add(out, out, framePosition);
};

/**
 * Transform a vector to local frame.
 * @method vectorToLocalFrame
 * @param  {Array} out
 * @param  {Array} worldVector
 * @param  {Number} frameAngle
 */
vec2$p.vectorToLocalFrame = function(out, worldVector, frameAngle){
    vec2$p.rotate(out, worldVector, -frameAngle);
};

/**
 * Transform a point position to global frame.
 * @method toGlobalFrame
 * @param  {Array} out
 * @param  {Array} localVector
 * @param  {Number} frameAngle
 */
vec2$p.vectorToGlobalFrame = function(out, localVector, frameAngle){
    vec2$p.rotate(out, localVector, frameAngle);
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
vec2$p.centroid = function(out, a, b, c){
    vec2$p.add(out, a, b);
    vec2$p.add(out, out, c);
    vec2$p.scale(out, out, 1/3);
    return out;
};

/**
 * Creates a new, empty vec2
 * @static
 * @method create
 * @return {Array} a new 2D vector
 */
vec2$p.create = function() {
    var out = new Utils$9.ARRAY_TYPE(2);
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
vec2$p.clone = function(a) {
    var out = new Utils$9.ARRAY_TYPE(2);
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
vec2$p.fromValues = function(x, y) {
    var out = new Utils$9.ARRAY_TYPE(2);
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
vec2$p.copy = function(out, a) {
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
vec2$p.set = function(out, x, y) {
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
vec2$p.add = function(out, a, b) {
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
vec2$p.subtract = function(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    return out;
};

/**
 * Alias for vec2.subtract
 * @static
 * @method sub
 */
vec2$p.sub = vec2$p.subtract;

/**
 * Multiplies two vec2's
 * @static
 * @method multiply
 * @param {Array} out the receiving vector
 * @param {Array} a the first operand
 * @param {Array} b the second operand
 * @return {Array} out
 */
vec2$p.multiply = function(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    return out;
};

/**
 * Alias for vec2.multiply
 * @static
 * @method mul
 */
vec2$p.mul = vec2$p.multiply;

/**
 * Divides two vec2's
 * @static
 * @method divide
 * @param {Array} out the receiving vector
 * @param {Array} a the first operand
 * @param {Array} b the second operand
 * @return {Array} out
 */
vec2$p.divide = function(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    return out;
};

/**
 * Alias for vec2.divide
 * @static
 * @method div
 */
vec2$p.div = vec2$p.divide;

/**
 * Scales a vec2 by a scalar number
 * @static
 * @method scale
 * @param {Array} out the receiving vector
 * @param {Array} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @return {Array} out
 */
vec2$p.scale = function(out, a, b) {
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
vec2$p.distance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1];
    return Math.sqrt(x*x + y*y);
};

/**
 * Alias for vec2.distance
 * @static
 * @method dist
 */
vec2$p.dist = vec2$p.distance;

/**
 * Calculates the squared euclidian distance between two vec2's
 * @static
 * @method squaredDistance
 * @param {Array} a the first operand
 * @param {Array} b the second operand
 * @return {Number} squared distance between a and b
 */
vec2$p.squaredDistance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1];
    return x*x + y*y;
};

/**
 * Alias for vec2.squaredDistance
 * @static
 * @method sqrDist
 */
vec2$p.sqrDist = vec2$p.squaredDistance;

/**
 * Calculates the length of a vec2
 * @static
 * @method length
 * @param {Array} a vector to calculate length of
 * @return {Number} length of a
 */
vec2$p.length = function (a) {
    var x = a[0],
        y = a[1];
    return Math.sqrt(x*x + y*y);
};

/**
 * Alias for vec2.length
 * @method len
 * @static
 */
vec2$p.len = vec2$p.length;

/**
 * Calculates the squared length of a vec2
 * @static
 * @method squaredLength
 * @param {Array} a vector to calculate squared length of
 * @return {Number} squared length of a
 */
vec2$p.squaredLength = function (a) {
    var x = a[0],
        y = a[1];
    return x*x + y*y;
};

/**
 * Alias for vec2.squaredLength
 * @static
 * @method sqrLen
 */
vec2$p.sqrLen = vec2$p.squaredLength;

/**
 * Negates the components of a vec2
 * @static
 * @method negate
 * @param {Array} out the receiving vector
 * @param {Array} a vector to negate
 * @return {Array} out
 */
vec2$p.negate = function(out, a) {
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
vec2$p.normalize = function(out, a) {
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
vec2$p.dot = function (a, b) {
    return a[0] * b[0] + a[1] * b[1];
};

/**
 * Returns a string representation of a vector
 * @static
 * @method str
 * @param {Array} vec vector to represent as a string
 * @return {String} string representation of the vector
 */
vec2$p.str = function (a) {
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
vec2$p.lerp = function (out, a, b, t) {
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
vec2$p.reflect = function(out, vector, normal){
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
vec2$p.getLineSegmentsIntersection = function(out, p0, p1, p2, p3) {
    var t = vec2$p.getLineSegmentsIntersectionFraction(p0, p1, p2, p3);
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
vec2$p.getLineSegmentsIntersectionFraction = function(p0, p1, p2, p3) {
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

var vec2Exports = vec2$q.exports;

var vec2$o = vec2Exports
;

var AABB_1 = AABB$2;

/**
 * Axis aligned bounding box class.
 * @class AABB
 * @constructor
 * @param {Object}  [options]
 * @param {Array}   [options.upperBound]
 * @param {Array}   [options.lowerBound]
 */
function AABB$2(options){

    /**
     * The lower bound of the bounding box.
     * @property lowerBound
     * @type {Array}
     */
    this.lowerBound = vec2$o.create();
    if(options && options.lowerBound){
        vec2$o.copy(this.lowerBound, options.lowerBound);
    }

    /**
     * The upper bound of the bounding box.
     * @property upperBound
     * @type {Array}
     */
    this.upperBound = vec2$o.create();
    if(options && options.upperBound){
        vec2$o.copy(this.upperBound, options.upperBound);
    }
}

var tmp$2 = vec2$o.create();

/**
 * Set the AABB bounds from a set of points, transformed by the given position and angle.
 * @method setFromPoints
 * @param {Array} points An array of vec2's.
 * @param {Array} position
 * @param {number} angle
 * @param {number} skinSize Some margin to be added to the AABB.
 */
AABB$2.prototype.setFromPoints = function(points, position, angle, skinSize){
    var l = this.lowerBound,
        u = this.upperBound;

    if(typeof(angle) !== "number"){
        angle = 0;
    }

    // Set to the first point
    if(angle !== 0){
        vec2$o.rotate(l, points[0], angle);
    } else {
        vec2$o.copy(l, points[0]);
    }
    vec2$o.copy(u, l);

    // Compute cosines and sines just once
    var cosAngle = Math.cos(angle),
        sinAngle = Math.sin(angle);
    for(var i = 1; i<points.length; i++){
        var p = points[i];

        if(angle !== 0){
            var x = p[0],
                y = p[1];
            tmp$2[0] = cosAngle * x -sinAngle * y;
            tmp$2[1] = sinAngle * x +cosAngle * y;
            p = tmp$2;
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
        vec2$o.add(this.lowerBound, this.lowerBound, position);
        vec2$o.add(this.upperBound, this.upperBound, position);
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
AABB$2.prototype.copy = function(aabb){
    vec2$o.copy(this.lowerBound, aabb.lowerBound);
    vec2$o.copy(this.upperBound, aabb.upperBound);
};

/**
 * Extend this AABB so that it covers the given AABB too.
 * @method extend
 * @param  {AABB} aabb
 */
AABB$2.prototype.extend = function(aabb){
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
AABB$2.prototype.overlaps = function(aabb){
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
AABB$2.prototype.containsPoint = function(point){
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
AABB$2.prototype.overlapsRay = function(ray){

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

var Scalar_1 = Scalar$2;

/**
 * Scalar functions
 * @class Scalar
 */
function Scalar$2(){}

/**
 * Check if two scalars are equal
 * @static
 * @method eq
 * @param  {Number} a
 * @param  {Number} b
 * @param  {Number} [precision]
 * @return {Boolean}
 */
Scalar$2.eq = function(a,b,precision){
    precision = precision || 0;
    return Math.abs(a-b) < precision;
};

var Scalar$1 = Scalar_1;

var Line_1$1 = Line$2;

/**
 * Container for line-related functions
 * @class Line
 */
function Line$2(){}
/**
 * Compute the intersection between two lines.
 * @static
 * @method lineInt
 * @param  {Array}  l1          Line vector 1
 * @param  {Array}  l2          Line vector 2
 * @param  {Number} precision   Precision to use when checking if the lines are parallel
 * @return {Array}              The intersection point.
 */
Line$2.lineInt = function(l1,l2,precision){
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
    if (!Scalar$1.eq(det, 0, precision)) { // lines are not parallel
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
Line$2.segmentsIntersect = function(p1, p2, q1, q2){
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

var Point_1 = Point$1;

/**
 * Point related functions
 * @class Point
 */
function Point$1(){}
/**
 * Get the area of a triangle spanned by the three given points. Note that the area will be negative if the points are not given in counter-clockwise order.
 * @static
 * @method area
 * @param  {Array} a
 * @param  {Array} b
 * @param  {Array} c
 * @return {Number}
 */
Point$1.area = function(a,b,c){
    return (((b[0] - a[0])*(c[1] - a[1]))-((c[0] - a[0])*(b[1] - a[1])));
};

Point$1.left = function(a,b,c){
    return Point$1.area(a,b,c) > 0;
};

Point$1.leftOn = function(a,b,c) {
    return Point$1.area(a, b, c) >= 0;
};

Point$1.right = function(a,b,c) {
    return Point$1.area(a, b, c) < 0;
};

Point$1.rightOn = function(a,b,c) {
    return Point$1.area(a, b, c) <= 0;
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
Point$1.collinear = function(a,b,c,thresholdAngle) {
    if(!thresholdAngle)
        return Point$1.area(a, b, c) == 0;
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

Point$1.sqdist = function(a,b){
    var dx = b[0] - a[0];
    var dy = b[1] - a[1];
    return dx * dx + dy * dy;
};

var Line$1 = Line_1$1
,   Point = Point_1
,   Scalar = Scalar_1;

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
    if (!Point.left(this.at(br - 1), this.at(br), this.at(br + 1))) {
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
    return Point.right(this.at(i - 1), this.at(i), this.at(i + 1));
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

    if (Point.leftOn(this.at(a + 1), this.at(a), this.at(b)) && Point.rightOn(this.at(a - 1), this.at(a), this.at(b))) {
        return false;
    }
    dist = Point.sqdist(this.at(a), this.at(b));
    for (var i = 0; i !== this.vertices.length; ++i) { // for each edge
        if ((i + 1) % this.vertices.length === a || i === a) // ignore incident edges
            continue;
        if (Point.leftOn(this.at(a), this.at(b), this.at(i + 1)) && Point.rightOn(this.at(a), this.at(b), this.at(i))) { // if diag intersects an edge
            l1[0] = this.at(a);
            l1[1] = this.at(b);
            l2[0] = this.at(i);
            l2[1] = this.at(i + 1);
            p = Line$1.lineInt(l1,l2);
            if (Point.sqdist(this.at(a), p) < dist) { // if edge is blocking visibility to b
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
            if(Line$1.segmentsIntersect(path[i], path[i+1], path[j], path[j+1] )){
                return false;
            }
        }
    }

    // Check the segment between the last and the first point to all others
    for(var i=1; i<path.length-2; i++){
        if(Line$1.segmentsIntersect(path[0], path[path.length-1], path[i], path[i+1] )){
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

   if(!Scalar.eq(det,0,delta))
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
                if (Point.left(poly.at(i - 1), poly.at(i), poly.at(j))
                        && Point.rightOn(poly.at(i - 1), poly.at(i), poly.at(j - 1))) { // if line intersects with an edge
                    p = getIntersectionPoint(poly.at(i - 1), poly.at(i), poly.at(j), poly.at(j - 1)); // find the point of intersection
                    if (Point.right(poly.at(i + 1), poly.at(i), p)) { // make sure it's inside the poly
                        d = Point.sqdist(poly.vertices[i], p);
                        if (d < lowerDist) { // keep only the closest intersection
                            lowerDist = d;
                            lowerInt = p;
                            lowerIndex = j;
                        }
                    }
                }
                if (Point.left(poly.at(i + 1), poly.at(i), poly.at(j + 1))
                        && Point.rightOn(poly.at(i + 1), poly.at(i), poly.at(j))) {
                    p = getIntersectionPoint(poly.at(i + 1), poly.at(i), poly.at(j), poly.at(j + 1));
                    if (Point.left(poly.at(i - 1), poly.at(i), p)) {
                        d = Point.sqdist(poly.vertices[i], p);
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
                    if (Point.leftOn(poly.at(i - 1), poly.at(i), poly.at(j))
                            && Point.rightOn(poly.at(i + 1), poly.at(i), poly.at(j))) {
                        d = Point.sqdist(poly.at(i), poly.at(j));
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
        if(Point.collinear(this.at(i-1),this.at(i),this.at(i+1),precision)){
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

var Shape_1 = Shape$9;

var vec2$n = vec2Exports;

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
function Shape$9(options){
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
    this.position = vec2$n.fromValues(0,0);
    if(options.position){
        vec2$n.copy(this.position, options.position);
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
    this.id = Shape$9.idCounter++;

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

Shape$9.idCounter = 0;

/**
 * @static
 * @property {Number} CIRCLE
 */
Shape$9.CIRCLE =      1;

/**
 * @static
 * @property {Number} PARTICLE
 */
Shape$9.PARTICLE =    2;

/**
 * @static
 * @property {Number} PLANE
 */
Shape$9.PLANE =       4;

/**
 * @static
 * @property {Number} CONVEX
 */
Shape$9.CONVEX =      8;

/**
 * @static
 * @property {Number} LINE
 */
Shape$9.LINE =        16;

/**
 * @static
 * @property {Number} BOX
 */
Shape$9.BOX =   32;

Object.defineProperty(Shape$9, 'RECTANGLE', {
    get: function() {
        console.warn('Shape.RECTANGLE is deprecated, use Shape.BOX instead.');
        return Shape$9.BOX;
    }
});

/**
 * @static
 * @property {Number} CAPSULE
 */
Shape$9.CAPSULE =     64;

/**
 * @static
 * @property {Number} HEIGHTFIELD
 */
Shape$9.HEIGHTFIELD = 128;

/**
 * Should return the moment of inertia around the Z axis of the body given the total mass. See <a href="http://en.wikipedia.org/wiki/List_of_moments_of_inertia">Wikipedia's list of moments of inertia</a>.
 * @method computeMomentOfInertia
 * @param  {Number} mass
 * @return {Number} If the inertia is infinity or if the object simply isn't possible to rotate, return 0.
 */
Shape$9.prototype.computeMomentOfInertia = function(mass){};

/**
 * Returns the bounding circle radius of this shape.
 * @method updateBoundingRadius
 * @return {Number}
 */
Shape$9.prototype.updateBoundingRadius = function(){};

/**
 * Update the .area property of the shape.
 * @method updateArea
 */
Shape$9.prototype.updateArea = function(){
    // To be implemented in all subclasses
};

/**
 * Compute the world axis-aligned bounding box (AABB) of this shape.
 * @method computeAABB
 * @param  {AABB} out The resulting AABB.
 * @param  {Array} position World position of the shape.
 * @param  {Number} angle World angle of the shape.
 */
Shape$9.prototype.computeAABB = function(out, position, angle){
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
Shape$9.prototype.raycast = function(result, ray, position, angle){
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

var polyk$1 = PolyK;

var Shape$8 = Shape_1
,   vec2$m = vec2Exports
,   polyk = polyk$1
;

var Convex_1 = Convex$4;

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
function Convex$4(options){
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
        var v = vec2$m.create();
        vec2$m.copy(v, vertices[i]);
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
            var axis = vec2$m.create();
            vec2$m.copy(axis, options.axes[i]);
            this.axes.push(axis);
        }

    } else {

        // Construct axes from the vertex data
        for(var i = 0; i < this.vertices.length; i++){
            // Get the world edge
            var worldPoint0 = this.vertices[i];
            var worldPoint1 = this.vertices[(i+1) % this.vertices.length];

            var normal = vec2$m.create();
            vec2$m.sub(normal, worldPoint1, worldPoint0);

            // Get normal - just rotate 90 degrees since vertices are given in CCW
            vec2$m.rotate90cw(normal, normal);
            vec2$m.normalize(normal, normal);

            this.axes.push(normal);
        }

    }

    /**
     * The center of mass of the Convex
     * @property centerOfMass
     * @type {Array}
     */
    this.centerOfMass = vec2$m.fromValues(0,0);

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

    options.type = Shape$8.CONVEX;
    Shape$8.call(this, options);

    this.updateBoundingRadius();
    this.updateArea();
    if(this.area < 0){
        throw new Error("Convex vertices must be given in conter-clockwise winding.");
    }
}
Convex$4.prototype = new Shape$8();
Convex$4.prototype.constructor = Convex$4;

var tmpVec1 = vec2$m.create();
var tmpVec2 = vec2$m.create();

/**
 * Project a Convex onto a world-oriented axis
 * @method projectOntoAxis
 * @static
 * @param  {Array} offset
 * @param  {Array} localAxis
 * @param  {Array} result
 */
Convex$4.prototype.projectOntoLocalAxis = function(localAxis, result){
    var max=null,
        min=null,
        v,
        value,
        localAxis = tmpVec1;

    // Get projected position of all vertices
    for(var i=0; i<this.vertices.length; i++){
        v = this.vertices[i];
        value = vec2$m.dot(v, localAxis);
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

    vec2$m.set(result, min, max);
};

Convex$4.prototype.projectOntoWorldAxis = function(localAxis, shapeOffset, shapeAngle, result){
    var worldAxis = tmpVec2;

    this.projectOntoLocalAxis(localAxis, result);

    // Project the position of the body onto the axis - need to add this to the result
    if(shapeAngle !== 0){
        vec2$m.rotate(worldAxis, localAxis, shapeAngle);
    } else {
        worldAxis = localAxis;
    }
    var offset = vec2$m.dot(shapeOffset, worldAxis);

    vec2$m.set(result, result[0] + offset, result[1] + offset);
};


/**
 * Update the .triangles property
 * @method updateTriangles
 */
Convex$4.prototype.updateTriangles = function(){

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

var updateCenterOfMass_centroid = vec2$m.create(),
    updateCenterOfMass_centroid_times_mass = vec2$m.create(),
    updateCenterOfMass_a = vec2$m.create(),
    updateCenterOfMass_b = vec2$m.create(),
    updateCenterOfMass_c = vec2$m.create();
    vec2$m.create();
    vec2$m.create();
    vec2$m.create();
    vec2$m.create();

/**
 * Update the .centerOfMass property.
 * @method updateCenterOfMass
 */
Convex$4.prototype.updateCenterOfMass = function(){
    var triangles = this.triangles,
        verts = this.vertices,
        cm = this.centerOfMass,
        centroid = updateCenterOfMass_centroid,
        a = updateCenterOfMass_a,
        b = updateCenterOfMass_b,
        c = updateCenterOfMass_c,
        centroid_times_mass = updateCenterOfMass_centroid_times_mass;

    vec2$m.set(cm,0,0);
    var totalArea = 0;

    for(var i=0; i!==triangles.length; i++){
        var t = triangles[i],
            a = verts[t[0]],
            b = verts[t[1]],
            c = verts[t[2]];

        vec2$m.centroid(centroid,a,b,c);

        // Get mass for the triangle (density=1 in this case)
        // http://math.stackexchange.com/questions/80198/area-of-triangle-via-vectors
        var m = Convex$4.triangleArea(a,b,c);
        totalArea += m;

        // Add to center of mass
        vec2$m.scale(centroid_times_mass, centroid, m);
        vec2$m.add(cm, cm, centroid_times_mass);
    }

    vec2$m.scale(cm,cm,1/totalArea);
};

/**
 * Compute the mass moment of inertia of the Convex.
 * @method computeMomentOfInertia
 * @param  {Number} mass
 * @return {Number}
 * @see http://www.gamedev.net/topic/342822-moment-of-inertia-of-a-polygon-2d/
 */
Convex$4.prototype.computeMomentOfInertia = function(mass){
    var denom = 0.0,
        numer = 0.0,
        N = this.vertices.length;
    for(var j = N-1, i = 0; i < N; j = i, i ++){
        var p0 = this.vertices[j];
        var p1 = this.vertices[i];
        var a = Math.abs(vec2$m.crossLength(p0,p1));
        var b = vec2$m.dot(p1,p1) + vec2$m.dot(p1,p0) + vec2$m.dot(p0,p0);
        denom += a * b;
        numer += a;
    }
    return (mass / 6.0) * (denom / numer);
};

/**
 * Updates the .boundingRadius property
 * @method updateBoundingRadius
 */
Convex$4.prototype.updateBoundingRadius = function(){
    var verts = this.vertices,
        r2 = 0;

    for(var i=0; i!==verts.length; i++){
        var l2 = vec2$m.squaredLength(verts[i]);
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
Convex$4.triangleArea = function(a,b,c){
    return (((b[0] - a[0])*(c[1] - a[1]))-((c[0] - a[0])*(b[1] - a[1]))) * 0.5;
};

/**
 * Update the .area
 * @method updateArea
 */
Convex$4.prototype.updateArea = function(){
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
        var m = Convex$4.triangleArea(a,b,c);
        this.area += m;
    }
};

/**
 * @method computeAABB
 * @param  {AABB}   out
 * @param  {Array}  position
 * @param  {Number} angle
 */
Convex$4.prototype.computeAABB = function(out, position, angle){
    out.setFromPoints(this.vertices, position, angle, 0);
};

var intersectConvex_rayStart = vec2$m.create();
var intersectConvex_rayEnd = vec2$m.create();
var intersectConvex_normal = vec2$m.create();

/**
 * @method raycast
 * @param  {RaycastResult} result
 * @param  {Ray} ray
 * @param  {array} position
 * @param  {number} angle
 */
Convex$4.prototype.raycast = function(result, ray, position, angle){
    var rayStart = intersectConvex_rayStart;
    var rayEnd = intersectConvex_rayEnd;
    var normal = intersectConvex_normal;
    var vertices = this.vertices;

    // Transform to local shape space
    vec2$m.toLocalFrame(rayStart, ray.from, position, angle);
    vec2$m.toLocalFrame(rayEnd, ray.to, position, angle);

    var n = vertices.length;

    for (var i = 0; i < n && !result.shouldStop(ray); i++) {
        var q1 = vertices[i];
        var q2 = vertices[(i+1) % n];
        var delta = vec2$m.getLineSegmentsIntersectionFraction(rayStart, rayEnd, q1, q2);

        if(delta >= 0){
            vec2$m.sub(normal, q2, q1);
            vec2$m.rotate(normal, normal, -Math.PI / 2 + angle);
            vec2$m.normalize(normal, normal);
            ray.reportIntersection(result, delta, normal, i);
        }
    }
};

var Ray_1;
var hasRequiredRay;

function requireRay () {
	if (hasRequiredRay) return Ray_1;
	hasRequiredRay = 1;
	Ray_1 = Ray;

	var vec2 = vec2Exports;
	requireRaycastResult();

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
	    this.from = options.from ? vec2.fromValues(options.from[0], options.from[1]) : vec2.create();

	    /**
	     * Ray end point
	     * @property {array} to
	     */
	    this.to = options.to ? vec2.fromValues(options.to[0], options.to[1]) : vec2.create();

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
	    this.direction = vec2.create();

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
	    vec2.sub(d, this.to, this.from);
	    this.length = vec2.length(d);
	    vec2.normalize(d, d);

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

	var intersectBody_worldPosition = vec2.create();

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
	        vec2.rotate(worldPosition, shape.position, body.angle);
	        vec2.add(worldPosition, worldPosition, body.position);
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
	    vec2.set(
	        result.lowerBound,
	        Math.min(to[0], from[0]),
	        Math.min(to[1], from[1])
	    );
	    vec2.set(
	        result.upperBound,
	        Math.max(to[0], from[0]),
	        Math.max(to[1], from[1])
	    );
	};

	vec2.create();

	/**
	 * @method reportIntersection
	 * @private
	 * @param  {number} fraction
	 * @param  {array} normal
	 * @param  {number} [faceIndex=-1]
	 * @return {boolean} True if the intersections should continue
	 */
	Ray.prototype.reportIntersection = function(result, fraction, normal, faceIndex){
	    this.from;
	    this.to;
	    var shape = this._currentShape;
	    var body = this._currentBody;

	    // Skip back faces?
	    if(this.skipBackfaces && vec2.dot(normal, this.direction) > 0){
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

	var v0 = vec2.create(),
	    intersect = vec2.create();
	function distanceFromIntersectionSquared(from, direction, position) {

	    // v0 is vector from from to position
	    vec2.sub(v0, position, from);
	    var dot = vec2.dot(v0, direction);

	    // intersect = direction * dot + from
	    vec2.scale(intersect, direction, dot);
	    vec2.add(intersect, intersect, from);

	    return vec2.squaredDistance(position, intersect);
	}
	return Ray_1;
}

var RaycastResult_1;
var hasRequiredRaycastResult;

function requireRaycastResult () {
	if (hasRequiredRaycastResult) return RaycastResult_1;
	hasRequiredRaycastResult = 1;
	var vec2 = vec2Exports;
	var Ray = requireRay();

	RaycastResult_1 = RaycastResult;

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
		this.normal = vec2.create();

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
		vec2.set(this.normal, 0, 0);
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
		return vec2.distance(ray.from, ray.to) * this.fraction;
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
		vec2.lerp(out, ray.from, ray.to, this.fraction);
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
		return this.isStopped || (this.fraction !== -1 && ray.mode === Ray.ANY);
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
		vec2.copy(this.normal, normal);
		this.shape = shape;
		this.body = body;
		this.fraction = fraction;
		this.faceIndex = faceIndex;
	};
	return RaycastResult_1;
}

/**
 * Base class for objects that dispatches events.
 * @class EventEmitter
 * @constructor
 */

var EventEmitter$3 = function () {};

var EventEmitter_1 = EventEmitter$3;

EventEmitter$3.prototype = {
    constructor: EventEmitter$3,

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

var vec2$l = vec2Exports
,   decomp = src
,   Convex$3 = Convex_1
,   RaycastResult = requireRaycastResult()
,   Ray = requireRay()
,   AABB$1 = AABB_1
,   EventEmitter$2 = EventEmitter_1;

var Body_1 = Body$5;

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
function Body$5(options){
    options = options || {};

    EventEmitter$2.call(this);

    /**
     * The body identifyer
     * @property id
     * @type {Number}
     */
    this.id = options.id || ++Body$5._idCounter;

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
    this.massMultiplier = vec2$l.create();

    /**
     * The position of the body
     * @property position
     * @type {Array}
     */
    this.position = vec2$l.fromValues(0,0);
    if(options.position){
        vec2$l.copy(this.position, options.position);
    }

    /**
     * The interpolated position of the body. Use this for rendering.
     * @property interpolatedPosition
     * @type {Array}
     */
    this.interpolatedPosition = vec2$l.fromValues(0,0);

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
    this.previousPosition = vec2$l.fromValues(0,0);

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
    this.velocity = vec2$l.fromValues(0,0);
    if(options.velocity){
        vec2$l.copy(this.velocity, options.velocity);
    }

    /**
     * Constraint velocity that was added to the body during the last step.
     * @property vlambda
     * @type {Array}
     */
    this.vlambda = vec2$l.fromValues(0,0);

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
    this.force = vec2$l.create();
    if(options.force){
        vec2$l.copy(this.force, options.force);
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
    this.type = Body$5.STATIC;

    if(typeof(options.type) !== 'undefined'){
        this.type = options.type;
    } else if(!options.mass){
        this.type = Body$5.STATIC;
    } else {
        this.type = Body$5.DYNAMIC;
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
    this.aabb = new AABB$1();

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
    this.sleepState = Body$5.AWAKE;

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
Body$5.prototype = new EventEmitter$2();
Body$5.prototype.constructor = Body$5;

Body$5._idCounter = 0;

/**
 * @private
 * @method updateSolveMassProperties
 */
Body$5.prototype.updateSolveMassProperties = function(){
    if(this.sleepState === Body$5.SLEEPING || this.type === Body$5.KINEMATIC){
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
Body$5.prototype.setDensity = function(density) {
    var totalArea = this.getArea();
    this.mass = totalArea * density;
    this.updateMassProperties();
};

/**
 * Get the total area of all shapes in the body
 * @method getArea
 * @return {Number}
 */
Body$5.prototype.getArea = function() {
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
Body$5.prototype.getAABB = function(){
    if(this.aabbNeedsUpdate){
        this.updateAABB();
    }
    return this.aabb;
};

var shapeAABB = new AABB$1(),
    tmp$1 = vec2$l.create();

/**
 * Updates the AABB of the Body, and set .aabbNeedsUpdate = false.
 * @method updateAABB
 */
Body$5.prototype.updateAABB = function() {
    var shapes = this.shapes,
        N = shapes.length,
        offset = tmp$1,
        bodyAngle = this.angle;

    for(var i=0; i!==N; i++){
        var shape = shapes[i],
            angle = shape.angle + bodyAngle;

        // Get shape world offset
        vec2$l.rotate(offset, shape.position, bodyAngle);
        vec2$l.add(offset, offset, this.position);

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
Body$5.prototype.updateBoundingRadius = function(){
    var shapes = this.shapes,
        N = shapes.length,
        radius = 0;

    for(var i=0; i!==N; i++){
        var shape = shapes[i],
            offset = vec2$l.length(shape.position),
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
Body$5.prototype.addShape = function(shape, offset, angle){
    if(shape.body){
        throw new Error('A shape can only be added to one body.');
    }
    shape.body = this;

    // Copy the offset vector
    if(offset){
        vec2$l.copy(shape.position, offset);
    } else {
        vec2$l.set(shape.position, 0, 0);
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
Body$5.prototype.removeShape = function(shape){
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
Body$5.prototype.updateMassProperties = function(){
    if(this.type === Body$5.STATIC || this.type === Body$5.KINEMATIC){

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
                    r2 = vec2$l.squaredLength(shape.position),
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

        vec2$l.set(
            this.massMultiplier,
            this.fixedX ? 0 : 1,
            this.fixedY ? 0 : 1
        );
    }
};

vec2$l.create();

/**
 * Apply force to a point relative to the center of mass of the body. This could for example be a point on the RigidBody surface. Applying force this way will add to Body.force and Body.angularForce. If relativePoint is zero, the force will be applied directly on the center of mass, and the torque produced will be zero.
 * @method applyForce
 * @param {Array} force The force to add.
 * @param {Array} [relativePoint] A world point to apply the force on.
 */
Body$5.prototype.applyForce = function(force, relativePoint){

    // Add linear force
    vec2$l.add(this.force, this.force, force);

    if(relativePoint){

        // Compute produced rotational force
        var rotForce = vec2$l.crossLength(relativePoint,force);

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
var Body_applyForce_forceWorld = vec2$l.create();
var Body_applyForce_pointWorld = vec2$l.create();
var Body_applyForce_pointLocal = vec2$l.create();
Body$5.prototype.applyForceLocal = function(localForce, localPoint){
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
var Body_applyImpulse_velo = vec2$l.create();
Body$5.prototype.applyImpulse = function(impulseVector, relativePoint){
    if(this.type !== Body$5.DYNAMIC){
        return;
    }

    // Compute produced central impulse velocity
    var velo = Body_applyImpulse_velo;
    vec2$l.scale(velo, impulseVector, this.invMass);
    vec2$l.multiply(velo, this.massMultiplier, velo);

    // Add linear impulse
    vec2$l.add(this.velocity, velo, this.velocity);

    if(relativePoint){
        // Compute produced rotational impulse velocity
        var rotVelo = vec2$l.crossLength(relativePoint, impulseVector);
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
var Body_applyImpulse_impulseWorld = vec2$l.create();
var Body_applyImpulse_pointWorld = vec2$l.create();
var Body_applyImpulse_pointLocal = vec2$l.create();
Body$5.prototype.applyImpulseLocal = function(localImpulse, localPoint){
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
Body$5.prototype.toLocalFrame = function(out, worldPoint){
    vec2$l.toLocalFrame(out, worldPoint, this.position, this.angle);
};

/**
 * Transform a local point to world frame.
 * @method toWorldFrame
 * @param  {Array} out          The vector to store the result in
 * @param  {Array} localPoint   The input local point
 */
Body$5.prototype.toWorldFrame = function(out, localPoint){
    vec2$l.toGlobalFrame(out, localPoint, this.position, this.angle);
};

/**
 * Transform a world point to local body frame.
 * @method vectorToLocalFrame
 * @param  {Array} out          The vector to store the result in
 * @param  {Array} worldVector  The input world vector
 */
Body$5.prototype.vectorToLocalFrame = function(out, worldVector){
    vec2$l.vectorToLocalFrame(out, worldVector, this.angle);
};

/**
 * Transform a local point to world frame.
 * @method vectorToWorldFrame
 * @param  {Array} out          The vector to store the result in
 * @param  {Array} localVector  The input local vector
 */
Body$5.prototype.vectorToWorldFrame = function(out, localVector){
    vec2$l.vectorToGlobalFrame(out, localVector, this.angle);
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
Body$5.prototype.fromPolygon = function(path,options){
    options = options || {};

    // Remove all shapes
    for(var i=this.shapes.length; i>=0; --i){
        this.removeShape(this.shapes[i]);
    }

    var p = new decomp.Polygon();
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
        vec2$l.copy(v,this.concavePath[i]);
        this.concavePath[i] = v;
    }

    // Slow or fast decomp?
    var convexes;
    if(options.optimalDecomp){
        convexes = p.decomp();
    } else {
        convexes = p.quickDecomp();
    }

    var cm = vec2$l.create();

    // Add convexes
    for(var i=0; i!==convexes.length; i++){
        // Create convex
        var c = new Convex$3({ vertices: convexes[i].vertices });

        // Move all vertices so its center of mass is in the local center of the convex
        for(var j=0; j!==c.vertices.length; j++){
            var v = c.vertices[j];
            vec2$l.sub(v,v,c.centerOfMass);
        }

        vec2$l.scale(cm,c.centerOfMass,1);
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

vec2$l.fromValues(0,0);
    var adjustCenterOfMass_tmp2 = vec2$l.fromValues(0,0),
    adjustCenterOfMass_tmp3 = vec2$l.fromValues(0,0),
    adjustCenterOfMass_tmp4 = vec2$l.fromValues(0,0);

/**
 * Moves the shape offsets so their center of mass becomes the body center of mass.
 * @method adjustCenterOfMass
 */
Body$5.prototype.adjustCenterOfMass = function(){
    var offset_times_area = adjustCenterOfMass_tmp2,
        sum =               adjustCenterOfMass_tmp3,
        cm =                adjustCenterOfMass_tmp4,
        totalArea =         0;
    vec2$l.set(sum,0,0);

    for(var i=0; i!==this.shapes.length; i++){
        var s = this.shapes[i];
        vec2$l.scale(offset_times_area, s.position, s.area);
        vec2$l.add(sum, sum, offset_times_area);
        totalArea += s.area;
    }

    vec2$l.scale(cm,sum,1/totalArea);

    // Now move all shapes
    for(var i=0; i!==this.shapes.length; i++){
        var s = this.shapes[i];
        vec2$l.sub(s.position, s.position, cm);
    }

    // Move the body position too
    vec2$l.add(this.position,this.position,cm);

    // And concave path
    for(var i=0; this.concavePath && i<this.concavePath.length; i++){
        vec2$l.sub(this.concavePath[i], this.concavePath[i], cm);
    }

    this.updateMassProperties();
    this.updateBoundingRadius();
};

/**
 * Sets the force on the body to zero.
 * @method setZeroForce
 */
Body$5.prototype.setZeroForce = function(){
    vec2$l.set(this.force,0.0,0.0);
    this.angularForce = 0.0;
};

Body$5.prototype.resetConstraintVelocity = function(){
    var b = this,
        vlambda = b.vlambda;
    vec2$l.set(vlambda,0,0);
    b.wlambda = 0;
};

Body$5.prototype.addConstraintVelocity = function(){
    var b = this,
        v = b.velocity;
    vec2$l.add( v, v, b.vlambda);
    b.angularVelocity += b.wlambda;
};

/**
 * Apply damping, see <a href="http://code.google.com/p/bullet/issues/detail?id=74">this</a> for details.
 * @method applyDamping
 * @param  {number} dt Current time step
 */
Body$5.prototype.applyDamping = function(dt){
    if(this.type === Body$5.DYNAMIC){ // Only for dynamic bodies
        var v = this.velocity;
        vec2$l.scale(v, v, Math.pow(1.0 - this.damping,dt));
        this.angularVelocity *= Math.pow(1.0 - this.angularDamping,dt);
    }
};

/**
 * Wake the body up. Normally you should not need this, as the body is automatically awoken at events such as collisions.
 * Sets the sleepState to {{#crossLink "Body/AWAKE:property"}}Body.AWAKE{{/crossLink}} and emits the wakeUp event if the body wasn't awake before.
 * @method wakeUp
 */
Body$5.prototype.wakeUp = function(){
    var s = this.sleepState;
    this.sleepState = Body$5.AWAKE;
    this.idleTime = 0;
    if(s !== Body$5.AWAKE){
        this.emit(Body$5.wakeUpEvent);
    }
};

/**
 * Force body sleep
 * @method sleep
 */
Body$5.prototype.sleep = function(){
    this.sleepState = Body$5.SLEEPING;
    this.angularVelocity = 0;
    this.angularForce = 0;
    vec2$l.set(this.velocity,0,0);
    vec2$l.set(this.force,0,0);
    this.emit(Body$5.sleepEvent);
};

/**
 * Called every timestep to update internal sleep timer and change sleep state if needed.
 * @method sleepTick
 * @param {number} time The world time in seconds
 * @param {boolean} dontSleep
 * @param {number} dt
 */
Body$5.prototype.sleepTick = function(time, dontSleep, dt){
    if(!this.allowSleep || this.type === Body$5.SLEEPING){
        return;
    }

    this.wantsToSleep = false;

    this.sleepState;
        var speedSquared = vec2$l.squaredLength(this.velocity) + Math.pow(this.angularVelocity,2),
        speedLimitSquared = Math.pow(this.sleepSpeedLimit,2);

    // Add to idle time
    if(speedSquared >= speedLimitSquared){
        this.idleTime = 0;
        this.sleepState = Body$5.AWAKE;
    } else {
        this.idleTime += dt;
        this.sleepState = Body$5.SLEEPY;
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
Body$5.prototype.overlaps = function(body){
    return this.world.overlapKeeper.bodiesAreOverlapping(this, body);
};

var integrate_fhMinv = vec2$l.create();
var integrate_velodt = vec2$l.create();

/**
 * Move the body forward in time given its current velocity.
 * @method integrate
 * @param  {Number} dt
 */
Body$5.prototype.integrate = function(dt){
    var minv = this.invMass,
        f = this.force,
        pos = this.position,
        velo = this.velocity;

    // Save old position
    vec2$l.copy(this.previousPosition, this.position);
    this.previousAngle = this.angle;

    // Velocity update
    if(!this.fixedRotation){
        this.angularVelocity += this.angularForce * this.invInertia * dt;
    }
    vec2$l.scale(integrate_fhMinv, f, dt * minv);
    vec2$l.multiply(integrate_fhMinv, this.massMultiplier, integrate_fhMinv);
    vec2$l.add(velo, integrate_fhMinv, velo);

    // CCD
    if(!this.integrateToTimeOfImpact(dt)){

        // Regular position update
        vec2$l.scale(integrate_velodt, velo, dt);
        vec2$l.add(pos, pos, integrate_velodt);
        if(!this.fixedRotation){
            this.angle += this.angularVelocity * dt;
        }
    }

    this.aabbNeedsUpdate = true;
};

var result = new RaycastResult();
var ray = new Ray({
    mode: Ray.ALL
});
var direction = vec2$l.create();
var end = vec2$l.create();
var startToEnd = vec2$l.create();
var rememberPosition = vec2$l.create();
Body$5.prototype.integrateToTimeOfImpact = function(dt){

    if(this.ccdSpeedThreshold < 0 || vec2$l.squaredLength(this.velocity) < Math.pow(this.ccdSpeedThreshold, 2)){
        return false;
    }

    vec2$l.normalize(direction, this.velocity);

    vec2$l.scale(end, this.velocity, dt);
    vec2$l.add(end, end, this.position);

    vec2$l.sub(startToEnd, end, this.position);
    var startToEndAngle = this.angularVelocity * dt;
    var len = vec2$l.length(startToEnd);

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
        vec2$l.sub(startToEnd, end, that.position);
        timeOfImpact = vec2$l.length(startToEnd) / len;
        result.stop();
    };
    vec2$l.copy(ray.from, this.position);
    vec2$l.copy(ray.to, end);
    ray.update();
    this.world.raycast(result, ray);

    if(!hit){
        return false;
    }

    var rememberAngle = this.angle;
    vec2$l.copy(rememberPosition, this.position);

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
        vec2$l.scale(integrate_velodt, startToEnd, timeOfImpact);
        vec2$l.add(this.position, rememberPosition, integrate_velodt);
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

    vec2$l.copy(this.position, rememberPosition);
    this.angle = rememberAngle;

    // move to TOI
    vec2$l.scale(integrate_velodt, startToEnd, timeOfImpact);
    vec2$l.add(this.position, this.position, integrate_velodt);
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
Body$5.prototype.getVelocityAtPoint = function(result, relativePoint){
    vec2$l.crossVZ(result, relativePoint, this.angularVelocity);
    vec2$l.subtract(result, this.velocity, result);
    return result;
};

/**
 * @event sleepy
 */
Body$5.sleepyEvent = {
    type: "sleepy"
};

/**
 * @event sleep
 */
Body$5.sleepEvent = {
    type: "sleep"
};

/**
 * @event wakeup
 */
Body$5.wakeUpEvent = {
    type: "wakeup"
};

/**
 * Dynamic body.
 * @property DYNAMIC
 * @type {Number}
 * @static
 */
Body$5.DYNAMIC = 1;

/**
 * Static body.
 * @property STATIC
 * @type {Number}
 * @static
 */
Body$5.STATIC = 2;

/**
 * Kinematic body.
 * @property KINEMATIC
 * @type {Number}
 * @static
 */
Body$5.KINEMATIC = 4;

/**
 * @property AWAKE
 * @type {Number}
 * @static
 */
Body$5.AWAKE = 0;

/**
 * @property SLEEPY
 * @type {Number}
 * @static
 */
Body$5.SLEEPY = 1;

/**
 * @property SLEEPING
 * @type {Number}
 * @static
 */
Body$5.SLEEPING = 2;

var Equation_1 = Equation$b;

var vec2$k = vec2Exports,
    Utils$8 = Utils_1;

/**
 * Base class for constraint equations.
 * @class Equation
 * @constructor
 * @param {Body} bodyA First body participating in the equation
 * @param {Body} bodyB Second body participating in the equation
 * @param {number} minForce Minimum force to apply. Default: -Number.MAX_VALUE
 * @param {number} maxForce Maximum force to apply. Default: Number.MAX_VALUE
 */
function Equation$b(bodyA, bodyB, minForce, maxForce){

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
    this.stiffness = Equation$b.DEFAULT_STIFFNESS;

    /**
     * The number of time steps needed to stabilize the constraint equation. Typically between 3 and 5 time steps.
     * @property relaxation
     * @type {Number}
     */
    this.relaxation = Equation$b.DEFAULT_RELAXATION;

    /**
     * The Jacobian entry of this equation. 6 numbers, 3 per body (x,y,angle).
     * @property G
     * @type {Array}
     */
    this.G = new Utils$8.ARRAY_TYPE(6);
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
Equation$b.prototype.constructor = Equation$b;

/**
 * The default stiffness when creating a new Equation.
 * @static
 * @property {Number} DEFAULT_STIFFNESS
 * @default 1e6
 */
Equation$b.DEFAULT_STIFFNESS = 1e6;

/**
 * The default relaxation when creating a new Equation.
 * @static
 * @property {Number} DEFAULT_RELAXATION
 * @default 4
 */
Equation$b.DEFAULT_RELAXATION = 4;

/**
 * Compute SPOOK parameters .a, .b and .epsilon according to the current parameters. See equations 9, 10 and 11 in the <a href="http://www8.cs.umu.se/kurser/5DV058/VT09/lectures/spooknotes.pdf">SPOOK notes</a>.
 * @method update
 */
Equation$b.prototype.update = function(){
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
Equation$b.prototype.gmult = function(G,vi,wi,vj,wj){
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
Equation$b.prototype.computeB = function(a,b,h){
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
var qi = vec2$k.create(),
    qj = vec2$k.create();
Equation$b.prototype.computeGq = function(){
    var G = this.G,
        bi = this.bodyA,
        bj = this.bodyB;
        bi.position;
        bj.position;
        var ai = bi.angle,
        aj = bj.angle;

    return this.gmult(G, qi, ai, qj, aj) + this.offset;
};

/**
 * Computes G\*W, where W are the body velocities
 * @method computeGW
 * @return {Number}
 */
Equation$b.prototype.computeGW = function(){
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
Equation$b.prototype.computeGWlambda = function(){
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
var iMfi = vec2$k.create(),
    iMfj = vec2$k.create();
Equation$b.prototype.computeGiMf = function(){
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

    vec2$k.scale(iMfi, fi, invMassi);
    vec2$k.multiply(iMfi, bi.massMultiplier, iMfi);
    vec2$k.scale(iMfj, fj,invMassj);
    vec2$k.multiply(iMfj, bj.massMultiplier, iMfj);

    return this.gmult(G,iMfi,ti*invIi,iMfj,tj*invIj);
};

/**
 * Computes G\*inv(M)\*G'
 * @method computeGiMGt
 * @return {Number}
 */
Equation$b.prototype.computeGiMGt = function(){
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

var addToWlambda_temp = vec2$k.create(),
    addToWlambda_Gi = vec2$k.create(),
    addToWlambda_Gj = vec2$k.create();
    vec2$k.create();
    vec2$k.create();
    vec2$k.create();

/**
 * Add constraint velocity to the bodies.
 * @method addToWlambda
 * @param {Number} deltalambda
 */
Equation$b.prototype.addToWlambda = function(deltalambda){
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
    vec2$k.scale(temp, Gi, invMassi*deltalambda);
    vec2$k.multiply(temp, temp, bi.massMultiplier);
    vec2$k.add( bi.vlambda, bi.vlambda, temp);
    // This impulse is in the offset frame
    // Also add contribution to angular
    //bi.wlambda -= vec2.crossLength(temp,ri);
    bi.wlambda += invIi * G[2] * deltalambda;


    vec2$k.scale(temp, Gj, invMassj*deltalambda);
    vec2$k.multiply(temp, temp, bj.massMultiplier);
    vec2$k.add( bj.vlambda, bj.vlambda, temp);
    //bj.wlambda -= vec2.crossLength(temp,rj);
    bj.wlambda += invIj * G[5] * deltalambda;
};

/**
 * Compute the denominator part of the SPOOK equation: C = G\*inv(M)\*G' + eps
 * @method computeInvC
 * @param  {Number} eps
 * @return {Number}
 */
Equation$b.prototype.computeInvC = function(eps){
    return 1.0 / (this.computeGiMGt() + eps);
};

var Equation$a = Equation_1;

var AngleLockEquation_1 = AngleLockEquation$1;

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
function AngleLockEquation$1(bodyA, bodyB, options){
    options = options || {};
    Equation$a.call(this,bodyA,bodyB,-Number.MAX_VALUE,Number.MAX_VALUE);
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
AngleLockEquation$1.prototype = new Equation$a();
AngleLockEquation$1.prototype.constructor = AngleLockEquation$1;

AngleLockEquation$1.prototype.computeGq = function(){
    return this.ratio * this.bodyA.angle - this.bodyB.angle + this.angle;
};

/**
 * Set the gear ratio for this equation
 * @method setRatio
 * @param {Number} ratio
 */
AngleLockEquation$1.prototype.setRatio = function(ratio){
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
AngleLockEquation$1.prototype.setMaxTorque = function(torque){
    this.maxForce =  torque;
    this.minForce = -torque;
};

var vec2$j = vec2Exports;
var Body$4 = Body_1;

var Broadphase_1 = Broadphase$2;

/**
 * Base class for broadphase implementations.
 * @class Broadphase
 * @constructor
 */
function Broadphase$2(type){

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
    this.boundingVolumeType = Broadphase$2.AABB;
}

/**
 * Axis aligned bounding box type.
 * @static
 * @property {Number} AABB
 */
Broadphase$2.AABB = 1;

/**
 * Bounding circle type.
 * @static
 * @property {Number} BOUNDING_CIRCLE
 */
Broadphase$2.BOUNDING_CIRCLE = 2;

/**
 * Set the world that we are searching for collision pairs in.
 * @method setWorld
 * @param  {World} world
 */
Broadphase$2.prototype.setWorld = function(world){
    this.world = world;
};

/**
 * Get all potential intersecting body pairs.
 * @method getCollisionPairs
 * @param  {World} world The world to search in.
 * @return {Array} An array of the bodies, ordered in pairs. Example: A result of [a,b,c,d] means that the potential pairs are: (a,b), (c,d).
 */
Broadphase$2.prototype.getCollisionPairs = function(world){};

var dist = vec2$j.create();

/**
 * Check whether the bounding radius of two bodies overlap.
 * @method  boundingRadiusCheck
 * @param  {Body} bodyA
 * @param  {Body} bodyB
 * @return {Boolean}
 */
Broadphase$2.boundingRadiusCheck = function(bodyA, bodyB){
    vec2$j.sub(dist, bodyA.position, bodyB.position);
    var d2 = vec2$j.squaredLength(dist),
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
Broadphase$2.aabbCheck = function(bodyA, bodyB){
    return bodyA.getAABB().overlaps(bodyB.getAABB());
};

/**
 * Check whether the bounding radius of two bodies overlap.
 * @method  boundingRadiusCheck
 * @param  {Body} bodyA
 * @param  {Body} bodyB
 * @return {Boolean}
 */
Broadphase$2.prototype.boundingVolumeCheck = function(bodyA, bodyB){
    var result;

    switch(this.boundingVolumeType){
    case Broadphase$2.BOUNDING_CIRCLE:
        result =  Broadphase$2.boundingRadiusCheck(bodyA,bodyB);
        break;
    case Broadphase$2.AABB:
        result = Broadphase$2.aabbCheck(bodyA,bodyB);
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
Broadphase$2.canCollide = function(bodyA, bodyB){
    var KINEMATIC = Body$4.KINEMATIC;
    var STATIC = Body$4.STATIC;

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
    if(bodyA.sleepState === Body$4.SLEEPING && bodyB.sleepState === Body$4.SLEEPING){
        return false;
    }

    // Cannot collide if one is static and the other is sleeping
    if( (bodyA.sleepState === Body$4.SLEEPING && bodyB.type === STATIC) ||
        (bodyB.sleepState === Body$4.SLEEPING && bodyA.type === STATIC)){
        return false;
    }

    return true;
};

Broadphase$2.NAIVE = 1;
Broadphase$2.SAP = 2;

var Shape$7 = Shape_1
,   vec2$i = vec2Exports;

var Capsule_1 = Capsule$1;

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
function Capsule$1(options){
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

    options.type = Shape$7.CAPSULE;
    Shape$7.call(this, options);
}
Capsule$1.prototype = new Shape$7();
Capsule$1.prototype.constructor = Capsule$1;

/**
 * Compute the mass moment of inertia of the Capsule.
 * @method conputeMomentOfInertia
 * @param  {Number} mass
 * @return {Number}
 * @todo
 */
Capsule$1.prototype.computeMomentOfInertia = function(mass){
    // Approximate with rectangle
    var r = this.radius,
        w = this.length + r, // 2*r is too much, 0 is too little
        h = r*2;
    return mass * (h*h + w*w) / 12;
};

/**
 * @method updateBoundingRadius
 */
Capsule$1.prototype.updateBoundingRadius = function(){
    this.boundingRadius = this.radius + this.length/2;
};

/**
 * @method updateArea
 */
Capsule$1.prototype.updateArea = function(){
    this.area = Math.PI * this.radius * this.radius + this.radius * 2 * this.length;
};

var r$1 = vec2$i.create();

/**
 * @method computeAABB
 * @param  {AABB}   out      The resulting AABB.
 * @param  {Array}  position
 * @param  {Number} angle
 */
Capsule$1.prototype.computeAABB = function(out, position, angle){
    var radius = this.radius;

    // Compute center position of one of the the circles, world oriented, but with local offset
    vec2$i.set(r$1,this.length / 2,0);
    if(angle !== 0){
        vec2$i.rotate(r$1,r$1,angle);
    }

    // Get bounds
    vec2$i.set(out.upperBound,  Math.max(r$1[0]+radius, -r$1[0]+radius),
                              Math.max(r$1[1]+radius, -r$1[1]+radius));
    vec2$i.set(out.lowerBound,  Math.min(r$1[0]-radius, -r$1[0]-radius),
                              Math.min(r$1[1]-radius, -r$1[1]-radius));

    // Add offset
    vec2$i.add(out.lowerBound, out.lowerBound, position);
    vec2$i.add(out.upperBound, out.upperBound, position);
};

var intersectCapsule_hitPointWorld = vec2$i.create();
var intersectCapsule_normal = vec2$i.create();
var intersectCapsule_l0 = vec2$i.create();
var intersectCapsule_l1 = vec2$i.create();
var intersectCapsule_unit_y = vec2$i.fromValues(0,1);

/**
 * @method raycast
 * @param  {RaycastResult} result
 * @param  {Ray} ray
 * @param  {array} position
 * @param  {number} angle
 */
Capsule$1.prototype.raycast = function(result, ray, position, angle){
    var from = ray.from;
    var to = ray.to;
    ray.direction;

    var hitPointWorld = intersectCapsule_hitPointWorld;
    var normal = intersectCapsule_normal;
    var l0 = intersectCapsule_l0;
    var l1 = intersectCapsule_l1;

    // The sides
    var halfLen = this.length / 2;
    for(var i=0; i<2; i++){

        // get start and end of the line
        var y = this.radius * (i*2-1);
        vec2$i.set(l0, -halfLen, y);
        vec2$i.set(l1, halfLen, y);
        vec2$i.toGlobalFrame(l0, l0, position, angle);
        vec2$i.toGlobalFrame(l1, l1, position, angle);

        var delta = vec2$i.getLineSegmentsIntersectionFraction(from, to, l0, l1);
        if(delta >= 0){
            vec2$i.rotate(normal, intersectCapsule_unit_y, angle);
            vec2$i.scale(normal, normal, (i*2-1));
            ray.reportIntersection(result, delta, normal, -1);
            if(result.shouldStop(ray)){
                return;
            }
        }
    }

    // Circles
    var diagonalLengthSquared = Math.pow(this.radius, 2) + Math.pow(halfLen, 2);
    for(var i=0; i<2; i++){
        vec2$i.set(l0, halfLen * (i*2-1), 0);
        vec2$i.toGlobalFrame(l0, l0, position, angle);

        var a = Math.pow(to[0] - from[0], 2) + Math.pow(to[1] - from[1], 2);
        var b = 2 * ((to[0] - from[0]) * (from[0] - l0[0]) + (to[1] - from[1]) * (from[1] - l0[1]));
        var c = Math.pow(from[0] - l0[0], 2) + Math.pow(from[1] - l0[1], 2) - Math.pow(this.radius, 2);
        var delta = Math.pow(b, 2) - 4 * a * c;

        if(delta < 0){
            // No intersection
            continue;

        } else if(delta === 0){
            // single intersection point
            vec2$i.lerp(hitPointWorld, from, to, delta);

            if(vec2$i.squaredDistance(hitPointWorld, position) > diagonalLengthSquared){
                vec2$i.sub(normal, hitPointWorld, l0);
                vec2$i.normalize(normal,normal);
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
                vec2$i.lerp(hitPointWorld, from, to, d1);
                if(vec2$i.squaredDistance(hitPointWorld, position) > diagonalLengthSquared){
                    vec2$i.sub(normal, hitPointWorld, l0);
                    vec2$i.normalize(normal,normal);
                    ray.reportIntersection(result, d1, normal, -1);
                    if(result.shouldStop(ray)){
                        return;
                    }
                }
            }

            if(d2 >= 0 && d2 <= 1){
                vec2$i.lerp(hitPointWorld, from, to, d2);
                if(vec2$i.squaredDistance(hitPointWorld, position) > diagonalLengthSquared){
                    vec2$i.sub(normal, hitPointWorld, l0);
                    vec2$i.normalize(normal,normal);
                    ray.reportIntersection(result, d2, normal, -1);
                    if(result.shouldStop(ray)){
                        return;
                    }
                }
            }
        }
    }
};

var Shape$6 = Shape_1
,    vec2$h = vec2Exports;

var Circle_1 = Circle$2;

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
function Circle$2(options){
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

    options.type = Shape$6.CIRCLE;
    Shape$6.call(this, options);
}
Circle$2.prototype = new Shape$6();
Circle$2.prototype.constructor = Circle$2;

/**
 * @method computeMomentOfInertia
 * @param  {Number} mass
 * @return {Number}
 */
Circle$2.prototype.computeMomentOfInertia = function(mass){
    var r = this.radius;
    return mass * r * r / 2;
};

/**
 * @method updateBoundingRadius
 * @return {Number}
 */
Circle$2.prototype.updateBoundingRadius = function(){
    this.boundingRadius = this.radius;
};

/**
 * @method updateArea
 * @return {Number}
 */
Circle$2.prototype.updateArea = function(){
    this.area = Math.PI * this.radius * this.radius;
};

/**
 * @method computeAABB
 * @param  {AABB}   out      The resulting AABB.
 * @param  {Array}  position
 * @param  {Number} angle
 */
Circle$2.prototype.computeAABB = function(out, position, angle){
    var r = this.radius;
    vec2$h.set(out.upperBound,  r,  r);
    vec2$h.set(out.lowerBound, -r, -r);
    if(position){
        vec2$h.add(out.lowerBound, out.lowerBound, position);
        vec2$h.add(out.upperBound, out.upperBound, position);
    }
};

var Ray_intersectSphere_intersectionPoint = vec2$h.create();
var Ray_intersectSphere_normal = vec2$h.create();

/**
 * @method raycast
 * @param  {RaycastResult} result
 * @param  {Ray} ray
 * @param  {array} position
 * @param  {number} angle
 */
Circle$2.prototype.raycast = function(result, ray, position, angle){
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
        vec2$h.lerp(intersectionPoint, from, to, delta);

        vec2$h.sub(normal, intersectionPoint, position);
        vec2$h.normalize(normal,normal);

        ray.reportIntersection(result, delta, normal, -1);

    } else {
        var sqrtDelta = Math.sqrt(delta);
        var inv2a = 1 / (2 * a);
        var d1 = (- b - sqrtDelta) * inv2a;
        var d2 = (- b + sqrtDelta) * inv2a;

        if(d1 >= 0 && d1 <= 1){
            vec2$h.lerp(intersectionPoint, from, to, d1);

            vec2$h.sub(normal, intersectionPoint, position);
            vec2$h.normalize(normal,normal);

            ray.reportIntersection(result, d1, normal, -1);

            if(result.shouldStop(ray)){
                return;
            }
        }

        if(d2 >= 0 && d2 <= 1){
            vec2$h.lerp(intersectionPoint, from, to, d2);

            vec2$h.sub(normal, intersectionPoint, position);
            vec2$h.normalize(normal,normal);

            ray.reportIntersection(result, d2, normal, -1);
        }
    }
};

var Constraint_1 = Constraint$6;

var Utils$7 = Utils_1;

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
function Constraint$6(bodyA, bodyB, type, options){

    /**
     * The type of constraint. May be one of Constraint.DISTANCE, Constraint.GEAR, Constraint.LOCK, Constraint.PRISMATIC or Constraint.REVOLUTE.
     * @property {number} type
     */
    this.type = type;

    options = Utils$7.defaults(options,{
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
Constraint$6.prototype.update = function(){
    throw new Error("method update() not implmemented in this Constraint subclass!");
};

/**
 * @static
 * @property {number} DISTANCE
 */
Constraint$6.DISTANCE = 1;

/**
 * @static
 * @property {number} GEAR
 */
Constraint$6.GEAR = 2;

/**
 * @static
 * @property {number} LOCK
 */
Constraint$6.LOCK = 3;

/**
 * @static
 * @property {number} PRISMATIC
 */
Constraint$6.PRISMATIC = 4;

/**
 * @static
 * @property {number} REVOLUTE
 */
Constraint$6.REVOLUTE = 5;

/**
 * Set stiffness for this constraint.
 * @method setStiffness
 * @param {Number} stiffness
 */
Constraint$6.prototype.setStiffness = function(stiffness){
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
Constraint$6.prototype.setRelaxation = function(relaxation){
    var eqs = this.equations;
    for(var i=0; i !== eqs.length; i++){
        var eq = eqs[i];
        eq.relaxation = relaxation;
        eq.needsUpdate = true;
    }
};

var Equation$9 = Equation_1,
    vec2$g = vec2Exports;

var ContactEquation_1 = ContactEquation$2;

/**
 * Non-penetration constraint equation. Tries to make the contactPointA and contactPointB vectors coincide, while keeping the applied force repulsive.
 *
 * @class ContactEquation
 * @constructor
 * @extends Equation
 * @param {Body} bodyA
 * @param {Body} bodyB
 */
function ContactEquation$2(bodyA, bodyB){
    Equation$9.call(this, bodyA, bodyB, 0, Number.MAX_VALUE);

    /**
     * Vector from body i center of mass to the contact point.
     * @property contactPointA
     * @type {Array}
     */
    this.contactPointA = vec2$g.create();
    this.penetrationVec = vec2$g.create();

    /**
     * World-oriented vector from body A center of mass to the contact point.
     * @property contactPointB
     * @type {Array}
     */
    this.contactPointB = vec2$g.create();

    /**
     * The normal vector, pointing out of body i
     * @property normalA
     * @type {Array}
     */
    this.normalA = vec2$g.create();

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
ContactEquation$2.prototype = new Equation$9();
ContactEquation$2.prototype.constructor = ContactEquation$2;
ContactEquation$2.prototype.computeB = function(a,b,h){
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
    var rixn = vec2$g.crossLength(ri,n),
        rjxn = vec2$g.crossLength(rj,n);

    // G = [-n -rixn n rjxn]
    G[0] = -n[0];
    G[1] = -n[1];
    G[2] = -rixn;
    G[3] = n[0];
    G[4] = n[1];
    G[5] = rjxn;

    // Calculate q = xj+rj -(xi+ri) i.e. the penetration vector
    vec2$g.add(penetrationVec,xj,rj);
    vec2$g.sub(penetrationVec,penetrationVec,xi);
    vec2$g.sub(penetrationVec,penetrationVec,ri);

    // Compute iteration
    var GW, Gq;
    if(this.firstImpact && this.restitution !== 0){
        Gq = 0;
        GW = (1/b)*(1+this.restitution) * this.computeGW();
    } else {
        Gq = vec2$g.dot(n,penetrationVec) + this.offset;
        GW = this.computeGW();
    }

    var GiMf = this.computeGiMf();
    var B = - Gq * a - GW * b - h*GiMf;

    return B;
};

var vi = vec2$g.create();
var vj = vec2$g.create();
var relVel = vec2$g.create();

/**
 * Get the relative velocity along the normal vector.
 * @return {number}
 */
ContactEquation$2.prototype.getVelocityAlongNormal = function(){

    this.bodyA.getVelocityAtPoint(vi, this.contactPointA);
    this.bodyB.getVelocityAtPoint(vj, this.contactPointB);

    vec2$g.subtract(relVel, vi, vj);

    return vec2$g.dot(this.normalA, relVel);
};

var Pool_1 = Pool$5;

/**
 * @class Object pooling utility.
 */
function Pool$5(options) {
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
Pool$5.prototype.resize = function (size) {
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
Pool$5.prototype.get = function () {
	var objects = this.objects;
	return objects.length ? objects.pop() : this.create();
};

/**
 * Clean up and put the object back into the pool for later use.
 * @method release
 * @param {Object} object
 * @return {Pool} Self for chaining
 */
Pool$5.prototype.release = function (object) {
	this.destroy(object);
	this.objects.push(object);
	return this;
};

var ContactEquation$1 = ContactEquation_1;
var Pool$4 = Pool_1;

var ContactEquationPool_1 = ContactEquationPool$1;

/**
 * @class
 */
function ContactEquationPool$1() {
	Pool$4.apply(this, arguments);
}
ContactEquationPool$1.prototype = new Pool$4();
ContactEquationPool$1.prototype.constructor = ContactEquationPool$1;

/**
 * @method create
 * @return {ContactEquation}
 */
ContactEquationPool$1.prototype.create = function () {
	return new ContactEquation$1();
};

/**
 * @method destroy
 * @param {ContactEquation} equation
 * @return {ContactEquationPool}
 */
ContactEquationPool$1.prototype.destroy = function (equation) {
	equation.bodyA = equation.bodyB = null;
	return this;
};

var Material_1 = Material$2;

/**
 * Defines a physics material.
 * @class Material
 * @constructor
 * @param {number} id Material identifier
 * @author schteppe
 */
function Material$2(id){
    /**
     * The material identifier
     * @property id
     * @type {Number}
     */
    this.id = id || Material$2.idCounter++;
}

Material$2.idCounter = 0;

var Material$1 = Material_1;
var Equation$8 = Equation_1;

var ContactMaterial_1 = ContactMaterial$1;

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
function ContactMaterial$1(materialA, materialB, options){
    options = options || {};

    if(!(materialA instanceof Material$1) || !(materialB instanceof Material$1)){
        throw new Error("First two arguments must be Material instances.");
    }

    /**
     * The contact material identifier
     * @property id
     * @type {Number}
     */
    this.id = ContactMaterial$1.idCounter++;

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
    this.stiffness = typeof(options.stiffness) !== "undefined" ? Number(options.stiffness) : Equation$8.DEFAULT_STIFFNESS;

    /**
     * Relaxation of the resulting ContactEquation that this ContactMaterial generate. Default value is {{#crossLink "Equation/DEFAULT_RELAXATION:property"}}Equation.DEFAULT_RELAXATION{{/crossLink}}.
     * @property relaxation
     * @type {Number}
     */
    this.relaxation = typeof(options.relaxation) !== "undefined" ? Number(options.relaxation) : Equation$8.DEFAULT_RELAXATION;

    /**
     * Stiffness of the resulting friction force. For most cases, the value of this property should be a large number. I cannot think of any case where you would want less frictionStiffness. Default value is {{#crossLink "Equation/DEFAULT_STIFFNESS:property"}}Equation.DEFAULT_STIFFNESS{{/crossLink}}.
     * @property frictionStiffness
     * @type {Number}
     */
    this.frictionStiffness = typeof(options.frictionStiffness) !== "undefined" ? Number(options.frictionStiffness) : Equation$8.DEFAULT_STIFFNESS;

    /**
     * Relaxation of the resulting friction force. The default value should be good for most simulations. Default value is {{#crossLink "Equation/DEFAULT_RELAXATION:property"}}Equation.DEFAULT_RELAXATION{{/crossLink}}.
     * @property frictionRelaxation
     * @type {Number}
     */
    this.frictionRelaxation = typeof(options.frictionRelaxation) !== "undefined" ? Number(options.frictionRelaxation)  : Equation$8.DEFAULT_RELAXATION;

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

ContactMaterial$1.idCounter = 0;

var Constraint$5 = Constraint_1
,   Equation$7 = Equation_1
,   vec2$f = vec2Exports
,   Utils$6 = Utils_1;

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
    options = Utils$6.defaults(options,{
        localAnchorA:[0,0],
        localAnchorB:[0,0]
    });

    Constraint$5.call(this,bodyA,bodyB,Constraint$5.DISTANCE,options);

    /**
     * Local anchor in body A.
     * @property localAnchorA
     * @type {Array}
     */
    this.localAnchorA = vec2$f.fromValues(options.localAnchorA[0], options.localAnchorA[1]);

    /**
     * Local anchor in body B.
     * @property localAnchorB
     * @type {Array}
     */
    this.localAnchorB = vec2$f.fromValues(options.localAnchorB[0], options.localAnchorB[1]);

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
        var worldAnchorA = vec2$f.create(),
            worldAnchorB = vec2$f.create(),
            r = vec2$f.create();

        // Transform local anchors to world
        vec2$f.rotate(worldAnchorA, localAnchorA, bodyA.angle);
        vec2$f.rotate(worldAnchorB, localAnchorB, bodyB.angle);

        vec2$f.add(r, bodyB.position, worldAnchorB);
        vec2$f.sub(r, r, worldAnchorA);
        vec2$f.sub(r, r, bodyA.position);

        this.distance = vec2$f.length(r);
    }

    var maxForce;
    if(typeof(options.maxForce)==="undefined" ){
        maxForce = Number.MAX_VALUE;
    } else {
        maxForce = options.maxForce;
    }

    var normal = new Equation$7(bodyA,bodyB,-maxForce,maxForce); // Just in the normal direction
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

    var r = vec2$f.create();
    var ri = vec2$f.create(); // worldAnchorA
    var rj = vec2$f.create(); // worldAnchorB
    var that = this;
    normal.computeGq = function(){
        var bodyA = this.bodyA,
            bodyB = this.bodyB,
            xi = bodyA.position,
            xj = bodyB.position;

        // Transform local anchors to world
        vec2$f.rotate(ri, localAnchorA, bodyA.angle);
        vec2$f.rotate(rj, localAnchorB, bodyB.angle);

        vec2$f.add(r, xj, rj);
        vec2$f.sub(r, r, ri);
        vec2$f.sub(r, r, xi);

        //vec2.sub(r, bodyB.position, bodyA.position);
        return vec2$f.length(r) - that.distance;
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
DistanceConstraint.prototype = new Constraint$5();
DistanceConstraint.prototype.constructor = DistanceConstraint;

/**
 * Update the constraint equations. Should be done if any of the bodies changed position, before solving.
 * @method update
 */
var n = vec2$f.create();
var ri = vec2$f.create(); // worldAnchorA
var rj = vec2$f.create(); // worldAnchorB
DistanceConstraint.prototype.update = function(){
    var normal = this.equations[0],
        bodyA = this.bodyA,
        bodyB = this.bodyB;
        this.distance;
        var xi = bodyA.position,
        xj = bodyB.position,
        normalEquation = this.equations[0],
        G = normal.G;

    // Transform local anchors to world
    vec2$f.rotate(ri, this.localAnchorA, bodyA.angle);
    vec2$f.rotate(rj, this.localAnchorB, bodyB.angle);

    // Get world anchor points and normal
    vec2$f.add(n, xj, rj);
    vec2$f.sub(n, n, ri);
    vec2$f.sub(n, n, xi);
    this.position = vec2$f.length(n);

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

    vec2$f.normalize(n,n);

    // Caluclate cross products
    var rixn = vec2$f.crossLength(ri, n),
        rjxn = vec2$f.crossLength(rj, n);

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

var vec2$e = vec2Exports
,   Equation$6 = Equation_1
;

var FrictionEquation_1 = FrictionEquation$3;

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
function FrictionEquation$3(bodyA, bodyB, slipForce){
    Equation$6.call(this, bodyA, bodyB, -slipForce, slipForce);

    /**
     * Relative vector from center of body A to the contact point, world oriented.
     * @property contactPointA
     * @type {Array}
     */
    this.contactPointA = vec2$e.create();

    /**
     * Relative vector from center of body B to the contact point, world oriented.
     * @property contactPointB
     * @type {Array}
     */
    this.contactPointB = vec2$e.create();

    /**
     * Tangent vector that the friction force will act along. World oriented.
     * @property t
     * @type {Array}
     */
    this.t = vec2$e.create();

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
FrictionEquation$3.prototype = new Equation$6();
FrictionEquation$3.prototype.constructor = FrictionEquation$3;

/**
 * Set the slipping condition for the constraint. The friction force cannot be
 * larger than this value.
 * @method setSlipForce
 * @param  {Number} slipForce
 */
FrictionEquation$3.prototype.setSlipForce = function(slipForce){
    this.maxForce = slipForce;
    this.minForce = -slipForce;
};

/**
 * Get the max force for the constraint.
 * @method getSlipForce
 * @return {Number}
 */
FrictionEquation$3.prototype.getSlipForce = function(){
    return this.maxForce;
};

FrictionEquation$3.prototype.computeB = function(a,b,h){
    this.bodyA;
        this.bodyB;
        var ri = this.contactPointA,
        rj = this.contactPointB,
        t = this.t,
        G = this.G;

    // G = [-t -rixt t rjxt]
    // And remember, this is a pure velocity constraint, g is always zero!
    G[0] = -t[0];
    G[1] = -t[1];
    G[2] = -vec2$e.crossLength(ri,t);
    G[3] = t[0];
    G[4] = t[1];
    G[5] = vec2$e.crossLength(rj,t);

    var GW = this.computeGW(),
        GiMf = this.computeGiMf();

    var B = /* - g * a  */ - GW * b - h*GiMf;

    return B;
};

var FrictionEquation$2 = FrictionEquation_1;
var Pool$3 = Pool_1;

var FrictionEquationPool_1 = FrictionEquationPool$1;

/**
 * @class
 */
function FrictionEquationPool$1() {
	Pool$3.apply(this, arguments);
}
FrictionEquationPool$1.prototype = new Pool$3();
FrictionEquationPool$1.prototype.constructor = FrictionEquationPool$1;

/**
 * @method create
 * @return {FrictionEquation}
 */
FrictionEquationPool$1.prototype.create = function () {
	return new FrictionEquation$2();
};

/**
 * @method destroy
 * @param {FrictionEquation} equation
 * @return {FrictionEquationPool}
 */
FrictionEquationPool$1.prototype.destroy = function (equation) {
	equation.bodyA = equation.bodyB = null;
	return this;
};

var Constraint$4 = Constraint_1
,   AngleLockEquation = AngleLockEquation_1
;

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

    Constraint$4.call(this, bodyA, bodyB, Constraint$4.GEAR, options);

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
        new AngleLockEquation(bodyA,bodyB,options),
    ];

    // Set max torque
    if(options.maxTorque !== undefined){
        this.setMaxTorque(options.maxTorque);
    }
}
GearConstraint.prototype = new Constraint$4();
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

var EventEmitter$1 = EventEmitter_1;

var Solver_1 = Solver$1;

/**
 * Base class for constraint solvers.
 * @class Solver
 * @constructor
 * @extends EventEmitter
 */
function Solver$1(options,type){
    options = options || {};

    EventEmitter$1.call(this);

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
Solver$1.prototype = new EventEmitter$1();
Solver$1.prototype.constructor = Solver$1;

/**
 * Method to be implemented in each subclass
 * @method solve
 * @param  {Number} dt
 * @param  {World} world
 */
Solver$1.prototype.solve = function(dt,world){
    throw new Error("Solver.solve should be implemented by subclasses!");
};

var mockWorld = {bodies:[]};

/**
 * Solves all constraints in an island.
 * @method solveIsland
 * @param  {Number} dt
 * @param  {Island} island
 */
Solver$1.prototype.solveIsland = function(dt,island){

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
Solver$1.prototype.sortEquations = function(){
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
Solver$1.prototype.addEquation = function(eq){
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
Solver$1.prototype.addEquations = function(eqs){
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
Solver$1.prototype.removeEquation = function(eq){
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
Solver$1.prototype.removeAllEquations = function(){
    this.equations.length=0;
};

Solver$1.GS = 1;
Solver$1.ISLAND = 2;

var vec2$d = vec2Exports
,   Solver = Solver_1
,   Utils$5 = Utils_1
,   FrictionEquation$1 = FrictionEquation_1;

var GSSolver_1 = GSSolver$1;

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
function GSSolver$1(options){
    Solver.call(this,options,Solver.GS);
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
    this.lambda = new Utils$5.ARRAY_TYPE(this.arrayStep);
    this.Bs =     new Utils$5.ARRAY_TYPE(this.arrayStep);
    this.invCs =  new Utils$5.ARRAY_TYPE(this.arrayStep);

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
GSSolver$1.prototype = new Solver();
GSSolver$1.prototype.constructor = GSSolver$1;

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
GSSolver$1.prototype.solve = function(h, world){

    this.sortEquations();

    var iter = 0,
        maxIter = this.iterations,
        maxFrictionIter = this.frictionIterations,
        equations = this.equations,
        Neq = equations.length,
        tolSquared = Math.pow(this.tolerance*Neq, 2),
        bodies = world.bodies,
        Nbodies = world.bodies.length;
        vec2$d.add;
        vec2$d.set;
        var useZeroRHS = this.useZeroRHS,
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
        lambda = this.lambda =  new Utils$5.ARRAY_TYPE(Neq + this.arrayStep);
        this.Bs =               new Utils$5.ARRAY_TYPE(Neq + this.arrayStep);
        this.invCs =            new Utils$5.ARRAY_TYPE(Neq + this.arrayStep);
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

                    var deltalambda = GSSolver$1.iterateEquation(j,c,c.epsilon,Bs,invCs,lambda,useZeroRHS,h,iter);
                    deltalambdaTot += Math.abs(deltalambda);
                }

                this.usedIterations++;

                // If the total error is small enough - stop iterate
                if(deltalambdaTot*deltalambdaTot <= tolSquared){
                    break;
                }
            }

            GSSolver$1.updateMultipliers(equations, lambda, 1/h);

            // Set computed friction force
            for(j=0; j!==Neq; j++){
                var eq = equations[j];
                if(eq instanceof FrictionEquation$1){
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

                var deltalambda = GSSolver$1.iterateEquation(j,c,c.epsilon,Bs,invCs,lambda,useZeroRHS,h,iter);
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

        GSSolver$1.updateMultipliers(equations, lambda, 1/h);
    }
};

// Sets the .multiplier property of each equation
GSSolver$1.updateMultipliers = function(equations, lambda, invDt){
    // Set the .multiplier property of each equation
    var l = equations.length;
    while(l--){
        equations[l].multiplier = lambda[l] * invDt;
    }
};

GSSolver$1.iterateEquation = function(j,eq,eps,Bs,invCs,lambda,useZeroRHS,dt,iter){
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

var Shape$5 = Shape_1
,    vec2$c = vec2Exports
;

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

    options.type = Shape$5.HEIGHTFIELD;
    Shape$5.call(this, options);
}
Heightfield.prototype = new Shape$5();
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

var points$1 = [
    vec2$c.create(),
    vec2$c.create(),
    vec2$c.create(),
    vec2$c.create()
];

/**
 * @method computeAABB
 * @param  {AABB}   out      The resulting AABB.
 * @param  {Array}  position
 * @param  {Number} angle
 */
Heightfield.prototype.computeAABB = function(out, position, angle){
    vec2$c.set(points$1[0], 0, this.maxValue);
    vec2$c.set(points$1[1], this.elementWidth * this.heights.length, this.maxValue);
    vec2$c.set(points$1[2], this.elementWidth * this.heights.length, this.minValue);
    vec2$c.set(points$1[3], 0, this.minValue);
    out.setFromPoints(points$1, position, angle);
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
    vec2$c.set(start, i * width, data[i]);
    vec2$c.set(end, (i + 1) * width, data[i + 1]);
};

Heightfield.prototype.getSegmentIndex = function(position){
    return Math.floor(position[0] / this.elementWidth);
};

Heightfield.prototype.getClampedSegmentIndex = function(position){
    var i = this.getSegmentIndex(position);
    i = Math.min(this.heights.length, Math.max(i, 0)); // clamp
    return i;
};

vec2$c.create();
var intersectHeightfield_worldNormal = vec2$c.create();
var intersectHeightfield_l0 = vec2$c.create();
var intersectHeightfield_l1 = vec2$c.create();
var intersectHeightfield_localFrom = vec2$c.create();
var intersectHeightfield_localTo = vec2$c.create();
vec2$c.fromValues(0,1);

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
    ray.direction;
    var worldNormal = intersectHeightfield_worldNormal;
    var l0 = intersectHeightfield_l0;
    var l1 = intersectHeightfield_l1;
    var localFrom = intersectHeightfield_localFrom;
    var localTo = intersectHeightfield_localTo;

    // get local ray start and end
    vec2$c.toLocalFrame(localFrom, from, position, angle);
    vec2$c.toLocalFrame(localTo, to, position, angle);

    // Get the segment range
    this.getClampedSegmentIndex(localFrom);
    this.getClampedSegmentIndex(localTo);

    // The segments
    for(var i=0; i<this.heights.length - 1; i++){
        this.getLineSegment(l0, l1, i);
        var t = vec2$c.getLineSegmentsIntersectionFraction(localFrom, localTo, l0, l1);
        if(t >= 0){
            vec2$c.sub(worldNormal, l1, l0);
            vec2$c.rotate(worldNormal, worldNormal, angle + Math.PI / 2);
            vec2$c.normalize(worldNormal, worldNormal);
            ray.reportIntersection(result, t, worldNormal, -1);
            if(result.shouldStop(ray)){
                return;
            }
        }
    }
};

var Shape$4 = Shape_1
,   vec2$b = vec2Exports;

var Line_1 = Line;

/**
 * Line shape class. The line shape is along the x direction, and stretches from [-length/2, 0] to [length/2,0].
 * @class Line
 * @param {object} [options] (Note that this options object will be passed on to the {{#crossLink "Shape"}}{{/crossLink}} constructor.)
 * @param {Number} [options.length=1] The total length of the line
 * @extends Shape
 * @constructor
 */
function Line(options){
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

    options.type = Shape$4.LINE;
    Shape$4.call(this, options);
}
Line.prototype = new Shape$4();
Line.prototype.constructor = Line;

Line.prototype.computeMomentOfInertia = function(mass){
    return mass * Math.pow(this.length,2) / 12;
};

Line.prototype.updateBoundingRadius = function(){
    this.boundingRadius = this.length/2;
};

var points = [vec2$b.create(),vec2$b.create()];

/**
 * @method computeAABB
 * @param  {AABB}   out      The resulting AABB.
 * @param  {Array}  position
 * @param  {Number} angle
 */
Line.prototype.computeAABB = function(out, position, angle){
    var l2 = this.length / 2;
    vec2$b.set(points[0], -l2,  0);
    vec2$b.set(points[1],  l2,  0);
    out.setFromPoints(points,position,angle,0);
};

vec2$b.create();
var raycast_normal = vec2$b.create();
var raycast_l0 = vec2$b.create();
var raycast_l1 = vec2$b.create();
var raycast_unit_y = vec2$b.fromValues(0,1);

/**
 * @method raycast
 * @param  {RaycastResult} result
 * @param  {Ray} ray
 * @param  {number} angle
 * @param  {array} position
 */
Line.prototype.raycast = function(result, ray, position, angle){
    var from = ray.from;
    var to = ray.to;

    var l0 = raycast_l0;
    var l1 = raycast_l1;

    // get start and end of the line
    var halfLen = this.length / 2;
    vec2$b.set(l0, -halfLen, 0);
    vec2$b.set(l1, halfLen, 0);
    vec2$b.toGlobalFrame(l0, l0, position, angle);
    vec2$b.toGlobalFrame(l1, l1, position, angle);

    var fraction = vec2$b.getLineSegmentsIntersectionFraction(l0, l1, from, to);
    if(fraction >= 0){
        var normal = raycast_normal;
        vec2$b.rotate(normal, raycast_unit_y, angle); // todo: this should depend on which side the ray comes from
        ray.reportIntersection(result, fraction, normal, -1);
    }
};

var Constraint$3 = Constraint_1
,   vec2$a = vec2Exports
,   Equation$5 = Equation_1;

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

    Constraint$3.call(this,bodyA,bodyB,Constraint$3.LOCK,options);

    var maxForce = ( typeof(options.maxForce)==="undefined" ? Number.MAX_VALUE : options.maxForce );

    options.localAngleB || 0;

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

    var x =     new Equation$5(bodyA,bodyB,-maxForce,maxForce),
        y =     new Equation$5(bodyA,bodyB,-maxForce,maxForce),
        rot =   new Equation$5(bodyA,bodyB,-maxForce,maxForce);

    var l = vec2$a.create(),
        g = vec2$a.create(),
        that = this;
    x.computeGq = function(){
        vec2$a.rotate(l, that.localOffsetB, bodyA.angle);
        vec2$a.sub(g, bodyB.position, bodyA.position);
        vec2$a.sub(g, g, l);
        return g[0];
    };
    y.computeGq = function(){
        vec2$a.rotate(l, that.localOffsetB, bodyA.angle);
        vec2$a.sub(g, bodyB.position, bodyA.position);
        vec2$a.sub(g, g, l);
        return g[1];
    };
    var r = vec2$a.create(),
        t = vec2$a.create();
    rot.computeGq = function(){
        vec2$a.rotate(r, that.localOffsetB, bodyB.angle - that.localAngleB);
        vec2$a.scale(r,r,-1);
        vec2$a.sub(g,bodyA.position,bodyB.position);
        vec2$a.add(g,g,r);
        vec2$a.rotate(t,r,-Math.PI/2);
        vec2$a.normalize(t,t);
        return vec2$a.dot(g,t);
    };

    /**
     * The offset of bodyB in bodyA's frame.
     * @property {Array} localOffsetB
     */
    this.localOffsetB = vec2$a.create();
    if(options.localOffsetB){
        vec2$a.copy(this.localOffsetB, options.localOffsetB);
    } else {
        // Construct from current positions
        vec2$a.sub(this.localOffsetB, bodyB.position, bodyA.position);
        vec2$a.rotate(this.localOffsetB, this.localOffsetB, -bodyA.angle);
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
LockConstraint.prototype = new Constraint$3();
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

var l = vec2$a.create();
var r = vec2$a.create();
var t = vec2$a.create();
var xAxis$2 = vec2$a.fromValues(1,0);
var yAxis$3 = vec2$a.fromValues(0,1);
LockConstraint.prototype.update = function(){
    var x =   this.equations[0],
        y =   this.equations[1],
        rot = this.equations[2],
        bodyA = this.bodyA,
        bodyB = this.bodyB;

    vec2$a.rotate(l,this.localOffsetB,bodyA.angle);
    vec2$a.rotate(r,this.localOffsetB,bodyB.angle - this.localAngleB);
    vec2$a.scale(r,r,-1);

    vec2$a.rotate(t,r,Math.PI/2);
    vec2$a.normalize(t,t);

    x.G[0] = -1;
    x.G[1] =  0;
    x.G[2] = -vec2$a.crossLength(l,xAxis$2);
    x.G[3] =  1;

    y.G[0] =  0;
    y.G[1] = -1;
    y.G[2] = -vec2$a.crossLength(l,yAxis$3);
    y.G[4] =  1;

    rot.G[0] =  -t[0];
    rot.G[1] =  -t[1];
    rot.G[3] =  t[0];
    rot.G[4] =  t[1];
    rot.G[5] =  vec2$a.crossLength(r,t);
};

var Utils$4 = Utils_1;

var TupleDictionary_1 = TupleDictionary$2;

/**
 * @class TupleDictionary
 * @constructor
 */
function TupleDictionary$2() {

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
TupleDictionary$2.prototype.getKey = function(id1, id2) {
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
TupleDictionary$2.prototype.getByKey = function(key) {
    key = key|0;
    return this.data[key];
};

/**
 * @method get
 * @param  {Number} i
 * @param  {Number} j
 * @return {Number}
 */
TupleDictionary$2.prototype.get = function(i, j) {
    return this.data[this.getKey(i, j)];
};

/**
 * Set a value.
 * @method set
 * @param  {Number} i
 * @param  {Number} j
 * @param {Number} value
 */
TupleDictionary$2.prototype.set = function(i, j, value) {
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
TupleDictionary$2.prototype.reset = function() {
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
TupleDictionary$2.prototype.copy = function(dict) {
    this.reset();
    Utils$4.appendArray(this.keys, dict.keys);
    var l = dict.keys.length;
    while(l--){
        var key = dict.keys[l];
        this.data[key] = dict.data[key];
    }
};

var vec2$9 = vec2Exports
,   Shape$3 = Shape_1
,   Convex$2 = Convex_1;

var Box_1 = Box$1;

/**
 * Box shape class.
 * @class Box
 * @constructor
 * @param {object} [options] (Note that this options object will be passed on to the {{#crossLink "Shape"}}{{/crossLink}} constructor.)
 * @param {Number} [options.width=1] Total width of the box
 * @param {Number} [options.height=1] Total height of the box
 * @extends Convex
 */
function Box$1(options){
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
        vec2$9.fromValues(-width/2, -height/2),
        vec2$9.fromValues( width/2, -height/2),
        vec2$9.fromValues( width/2,  height/2),
        vec2$9.fromValues(-width/2,  height/2)
    ];
    var axes = [
        vec2$9.fromValues(1, 0),
        vec2$9.fromValues(0, 1)
    ];

    options.vertices = verts;
    options.axes = axes;
    options.type = Shape$3.BOX;
    Convex$2.call(this, options);
}
Box$1.prototype = new Convex$2();
Box$1.prototype.constructor = Box$1;

/**
 * Compute moment of inertia
 * @method computeMomentOfInertia
 * @param  {Number} mass
 * @return {Number}
 */
Box$1.prototype.computeMomentOfInertia = function(mass){
    var w = this.width,
        h = this.height;
    return mass * (h*h + w*w) / 12;
};

/**
 * Update the bounding radius
 * @method updateBoundingRadius
 */
Box$1.prototype.updateBoundingRadius = function(){
    var w = this.width,
        h = this.height;
    this.boundingRadius = Math.sqrt(w*w + h*h) / 2;
};

vec2$9.create();
    vec2$9.create();
    vec2$9.create();
    vec2$9.create();

/**
 * @method computeAABB
 * @param  {AABB}   out      The resulting AABB.
 * @param  {Array}  position
 * @param  {Number} angle
 */
Box$1.prototype.computeAABB = function(out, position, angle){
    out.setFromPoints(this.vertices,position,angle,0);
};

Box$1.prototype.updateArea = function(){
    this.area = this.width * this.height;
};

var vec2$8 = vec2Exports
,   sub = vec2$8.sub
,   add = vec2$8.add
,   dot = vec2$8.dot
,   ContactEquationPool = ContactEquationPool_1
,   FrictionEquationPool = FrictionEquationPool_1
,   TupleDictionary$1 = TupleDictionary_1
,   Equation$4 = Equation_1
,   Circle$1 = Circle_1
,   Convex$1 = Convex_1
,   Shape$2 = Shape_1
,   Box = Box_1;

var Narrowphase_1 = Narrowphase$1;

// Temp things
var yAxis$2 = vec2$8.fromValues(0,1);

var tmp1 = vec2$8.fromValues(0,0)
,   tmp2 = vec2$8.fromValues(0,0)
,   tmp3 = vec2$8.fromValues(0,0)
,   tmp4 = vec2$8.fromValues(0,0)
,   tmp5 = vec2$8.fromValues(0,0)
,   tmp6 = vec2$8.fromValues(0,0)
,   tmp7 = vec2$8.fromValues(0,0)
,   tmp8 = vec2$8.fromValues(0,0)
,   tmp9 = vec2$8.fromValues(0,0)
,   tmp10 = vec2$8.fromValues(0,0)
,   tmp11 = vec2$8.fromValues(0,0)
,   tmp12 = vec2$8.fromValues(0,0)
,   tmp13 = vec2$8.fromValues(0,0)
,   tmp14 = vec2$8.fromValues(0,0)
,   tmp15 = vec2$8.fromValues(0,0)
,   tmp16 = vec2$8.fromValues(0,0)
,   tmp17 = vec2$8.fromValues(0,0)
,   tmp18 = vec2$8.fromValues(0,0)
,   tmpArray$1 = [];

/**
 * Narrowphase. Creates contacts and friction given shapes and transforms.
 * @class Narrowphase
 * @constructor
 */
function Narrowphase$1(){

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
    this.contactEquationPool = new ContactEquationPool({ size: 32 });

    /**
     * Keeps track of the allocated ContactEquations.
     * @property {FrictionEquationPool} frictionEquationPool
     */
    this.frictionEquationPool = new FrictionEquationPool({ size: 64 });

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
    this.stiffness = Equation$4.DEFAULT_STIFFNESS;

    /**
     * The stiffness value to use in the next contact equations.
     * @property {Number} stiffness
     */
    this.relaxation = Equation$4.DEFAULT_RELAXATION;

    /**
     * The stiffness value to use in the next friction equations.
     * @property frictionStiffness
     * @type {Number}
     */
    this.frictionStiffness = Equation$4.DEFAULT_STIFFNESS;

    /**
     * The relaxation value to use in the next friction equations.
     * @property frictionRelaxation
     * @type {Number}
     */
    this.frictionRelaxation = Equation$4.DEFAULT_RELAXATION;

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
    this.collidingBodiesLastStep = new TupleDictionary$1();

    /**
     * Contact skin size value to use in the next contact equations.
     * @property {Number} contactSkinSize
     * @default 0.01
     */
    this.contactSkinSize = 0.01;
}

var bodiesOverlap_shapePositionA = vec2$8.create();
var bodiesOverlap_shapePositionB = vec2$8.create();

/**
 * @method bodiesOverlap
 * @param  {Body} bodyA
 * @param  {Body} bodyB
 * @return {Boolean}
 * @todo shape world transforms are wrong
 */
Narrowphase$1.prototype.bodiesOverlap = function(bodyA, bodyB){
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
Narrowphase$1.prototype.collidedLastStep = function(bodyA, bodyB){
    var id1 = bodyA.id|0,
        id2 = bodyB.id|0;
    return !!this.collidingBodiesLastStep.get(id1, id2);
};

/**
 * Throws away the old equations and gets ready to create new
 * @method reset
 */
Narrowphase$1.prototype.reset = function(){
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
Narrowphase$1.prototype.createContactEquation = function(bodyA, bodyB, shapeA, shapeB){
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
Narrowphase$1.prototype.createFrictionEquation = function(bodyA, bodyB, shapeA, shapeB){
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
Narrowphase$1.prototype.createFrictionFromContact = function(c){
    var eq = this.createFrictionEquation(c.bodyA, c.bodyB, c.shapeA, c.shapeB);
    vec2$8.copy(eq.contactPointA, c.contactPointA);
    vec2$8.copy(eq.contactPointB, c.contactPointB);
    vec2$8.rotate90cw(eq.t, c.normalA);
    eq.contactEquations.push(c);
    return eq;
};

// Take the average N latest contact point on the plane.
Narrowphase$1.prototype.createFrictionFromAverage = function(numContacts){
    var c = this.contactEquations[this.contactEquations.length - 1];
    var eq = this.createFrictionEquation(c.bodyA, c.bodyB, c.shapeA, c.shapeB);
    var bodyA = c.bodyA;
    c.bodyB;
    vec2$8.set(eq.contactPointA, 0, 0);
    vec2$8.set(eq.contactPointB, 0, 0);
    vec2$8.set(eq.t, 0, 0);
    for(var i=0; i!==numContacts; i++){
        c = this.contactEquations[this.contactEquations.length - 1 - i];
        if(c.bodyA === bodyA){
            vec2$8.add(eq.t, eq.t, c.normalA);
            vec2$8.add(eq.contactPointA, eq.contactPointA, c.contactPointA);
            vec2$8.add(eq.contactPointB, eq.contactPointB, c.contactPointB);
        } else {
            vec2$8.sub(eq.t, eq.t, c.normalA);
            vec2$8.add(eq.contactPointA, eq.contactPointA, c.contactPointB);
            vec2$8.add(eq.contactPointB, eq.contactPointB, c.contactPointA);
        }
        eq.contactEquations.push(c);
    }

    var invNumContacts = 1/numContacts;
    vec2$8.scale(eq.contactPointA, eq.contactPointA, invNumContacts);
    vec2$8.scale(eq.contactPointB, eq.contactPointB, invNumContacts);
    vec2$8.normalize(eq.t, eq.t);
    vec2$8.rotate90cw(eq.t, eq.t);
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
Narrowphase$1.prototype[Shape$2.LINE | Shape$2.CONVEX] =
Narrowphase$1.prototype.convexLine = function(
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
Narrowphase$1.prototype[Shape$2.LINE | Shape$2.BOX] =
Narrowphase$1.prototype.lineBox = function(
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
    vec2$8.set(convexShape.vertices[0], -capsuleShape.length * 0.5, -capsuleShape.radius);
    vec2$8.set(convexShape.vertices[1],  capsuleShape.length * 0.5, -capsuleShape.radius);
    vec2$8.set(convexShape.vertices[2],  capsuleShape.length * 0.5,  capsuleShape.radius);
    vec2$8.set(convexShape.vertices[3], -capsuleShape.length * 0.5,  capsuleShape.radius);
}

var convexCapsule_tempRect = new Box({ width: 1, height: 1 }),
    convexCapsule_tempVec = vec2$8.create();

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
Narrowphase$1.prototype[Shape$2.CAPSULE | Shape$2.CONVEX] =
Narrowphase$1.prototype[Shape$2.CAPSULE | Shape$2.BOX] =
Narrowphase$1.prototype.convexCapsule = function(
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
    vec2$8.set(circlePos, capsuleShape.length/2,0);
    vec2$8.rotate(circlePos,circlePos,capsuleAngle);
    vec2$8.add(circlePos,circlePos,capsulePosition);
    var result1 = this.circleConvex(capsuleBody,capsuleShape,circlePos,capsuleAngle, convexBody,convexShape,convexPosition,convexAngle, justTest, capsuleShape.radius);

    vec2$8.set(circlePos,-capsuleShape.length/2, 0);
    vec2$8.rotate(circlePos,circlePos,capsuleAngle);
    vec2$8.add(circlePos,circlePos,capsulePosition);
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
Narrowphase$1.prototype[Shape$2.CAPSULE | Shape$2.LINE] =
Narrowphase$1.prototype.lineCapsule = function(
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

var capsuleCapsule_tempVec1 = vec2$8.create();
var capsuleCapsule_tempVec2 = vec2$8.create();
var capsuleCapsule_tempRect1 = new Box({ width: 1, height: 1 });

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
Narrowphase$1.prototype[Shape$2.CAPSULE | Shape$2.CAPSULE] =
Narrowphase$1.prototype.capsuleCapsule = function(bi,si,xi,ai, bj,sj,xj,aj, justTest){

    var enableFrictionBefore;

    // Check the circles
    // Add offsets!
    var circlePosi = capsuleCapsule_tempVec1,
        circlePosj = capsuleCapsule_tempVec2;

    var numContacts = 0;


    // Need 4 circle checks, between all
    for(var i=0; i<2; i++){

        vec2$8.set(circlePosi,(i===0?-1:1)*si.length/2,0);
        vec2$8.rotate(circlePosi,circlePosi,ai);
        vec2$8.add(circlePosi,circlePosi,xi);

        for(var j=0; j<2; j++){

            vec2$8.set(circlePosj,(j===0?-1:1)*sj.length/2, 0);
            vec2$8.rotate(circlePosj,circlePosj,aj);
            vec2$8.add(circlePosj,circlePosj,xj);

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
Narrowphase$1.prototype[Shape$2.LINE | Shape$2.LINE] =
Narrowphase$1.prototype.lineLine = function(
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
Narrowphase$1.prototype[Shape$2.PLANE | Shape$2.LINE] =
Narrowphase$1.prototype.planeLine = function(planeBody, planeShape, planeOffset, planeAngle,
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
        verts = tmpArray$1,
        numContacts = 0;

    // Get start and end points
    vec2$8.set(worldVertex0, -lineShape.length/2, 0);
    vec2$8.set(worldVertex1,  lineShape.length/2, 0);

    // Not sure why we have to use worldVertex*1 here, but it won't work otherwise. Tired.
    vec2$8.rotate(worldVertex01, worldVertex0, lineAngle);
    vec2$8.rotate(worldVertex11, worldVertex1, lineAngle);

    add(worldVertex01, worldVertex01, lineOffset);
    add(worldVertex11, worldVertex11, lineOffset);

    vec2$8.copy(worldVertex0,worldVertex01);
    vec2$8.copy(worldVertex1,worldVertex11);

    // Get vector along the line
    sub(worldEdge, worldVertex1, worldVertex0);
    vec2$8.normalize(worldEdgeUnit, worldEdge);

    // Get tangent to the edge.
    vec2$8.rotate90cw(worldTangent, worldEdgeUnit);

    vec2$8.rotate(worldNormal, yAxis$2, planeAngle);

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

            vec2$8.copy(c.normalA, worldNormal);
            vec2$8.normalize(c.normalA,c.normalA);

            // distance vector along plane normal
            vec2$8.scale(dist, worldNormal, d);

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

Narrowphase$1.prototype[Shape$2.PARTICLE | Shape$2.CAPSULE] =
Narrowphase$1.prototype.particleCapsule = function(
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
Narrowphase$1.prototype[Shape$2.CIRCLE | Shape$2.LINE] =
Narrowphase$1.prototype.circleLine = function(
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

        verts = tmpArray$1;

    // Get start and end points
    vec2$8.set(worldVertex0, -lineShape.length/2, 0);
    vec2$8.set(worldVertex1,  lineShape.length/2, 0);

    // Not sure why we have to use worldVertex*1 here, but it won't work otherwise. Tired.
    vec2$8.rotate(worldVertex01, worldVertex0, lineAngle);
    vec2$8.rotate(worldVertex11, worldVertex1, lineAngle);

    add(worldVertex01, worldVertex01, lineOffset);
    add(worldVertex11, worldVertex11, lineOffset);

    vec2$8.copy(worldVertex0,worldVertex01);
    vec2$8.copy(worldVertex1,worldVertex11);

    // Get vector along the line
    sub(worldEdge, worldVertex1, worldVertex0);
    vec2$8.normalize(worldEdgeUnit, worldEdge);

    // Get tangent to the edge.
    vec2$8.rotate90cw(worldTangent, worldEdgeUnit);

    // Check distance from the plane spanned by the edge vs the circle
    sub(dist, circleOffset, worldVertex0);
    var d = dot(dist, worldTangent); // Distance from center of line to circle center
    sub(centerDist, worldVertex0, lineOffset);

    sub(lineToCircle, circleOffset, lineOffset);

    var radiusSum = circleRadius + lineRadius;

    if(Math.abs(d) < radiusSum){

        // Now project the circle onto the edge
        vec2$8.scale(orthoDist, worldTangent, d);
        sub(projectedPoint, circleOffset, orthoDist);

        // Add the missing line radius
        vec2$8.scale(lineToCircleOrthoUnit, worldTangent, dot(worldTangent, lineToCircle));
        vec2$8.normalize(lineToCircleOrthoUnit,lineToCircleOrthoUnit);
        vec2$8.scale(lineToCircleOrthoUnit, lineToCircleOrthoUnit, lineRadius);
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

            vec2$8.scale(c.normalA, orthoDist, -1);
            vec2$8.normalize(c.normalA, c.normalA);

            vec2$8.scale( c.contactPointA, c.normalA,  circleRadius);
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

        if(vec2$8.squaredLength(dist) < Math.pow(radiusSum, 2)){

            if(justTest){
                return true;
            }

            var c = this.createContactEquation(circleBody,lineBody,circleShape,lineShape);

            vec2$8.copy(c.normalA, dist);
            vec2$8.normalize(c.normalA,c.normalA);

            // Vector from circle to contact point is the normal times the circle radius
            vec2$8.scale(c.contactPointA, c.normalA, circleRadius);
            add(c.contactPointA, c.contactPointA, circleOffset);
            sub(c.contactPointA, c.contactPointA, circleBody.position);

            sub(c.contactPointB, v, lineOffset);
            vec2$8.scale(lineEndToLineRadius, c.normalA, -lineRadius);
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
Narrowphase$1.prototype[Shape$2.CIRCLE | Shape$2.CAPSULE] =
Narrowphase$1.prototype.circleCapsule = function(bi,si,xi,ai, bj,sj,xj,aj, justTest){
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
Narrowphase$1.prototype[Shape$2.CIRCLE | Shape$2.CONVEX] =
Narrowphase$1.prototype[Shape$2.CIRCLE | Shape$2.BOX] =
Narrowphase$1.prototype.circleConvex = function(
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

        vec2$8.rotate(worldVertex0, v0, convexAngle);
        vec2$8.rotate(worldVertex1, v1, convexAngle);
        add(worldVertex0, worldVertex0, convexOffset);
        add(worldVertex1, worldVertex1, convexOffset);
        sub(worldEdge, worldVertex1, worldVertex0);

        vec2$8.normalize(worldEdgeUnit, worldEdge);

        // Get tangent to the edge. Points out of the Convex
        vec2$8.rotate90cw(worldNormal, worldEdgeUnit);

        // Get point on circle, closest to the polygon
        vec2$8.scale(candidate,worldNormal,-circleShape.radius);
        add(candidate,candidate,circleOffset);

        if(pointInConvex(candidate,convexShape,convexOffset,convexAngle)){

            vec2$8.sub(candidateDist,worldVertex0,candidate);
            var candidateDistance = Math.abs(vec2$8.dot(candidateDist,worldNormal));

            if(candidateDistance < minCandidateDistance){
                vec2$8.copy(minCandidate,candidate);
                minCandidateDistance = candidateDistance;
                vec2$8.scale(closestEdgeProjectedPoint,worldNormal,candidateDistance);
                vec2$8.add(closestEdgeProjectedPoint,closestEdgeProjectedPoint,candidate);
                found = true;
            }
        }
    }

    if(found){

        if(justTest){
            return true;
        }

        var c = this.createContactEquation(circleBody,convexBody,circleShape,convexShape);
        vec2$8.sub(c.normalA, minCandidate, circleOffset);
        vec2$8.normalize(c.normalA, c.normalA);

        vec2$8.scale(c.contactPointA,  c.normalA, circleRadius);
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
            vec2$8.rotate(worldVertex, localVertex, convexAngle);
            add(worldVertex, worldVertex, convexOffset);

            sub(dist, worldVertex, circleOffset);
            if(vec2$8.squaredLength(dist) < Math.pow(circleRadius, 2)){

                if(justTest){
                    return true;
                }

                var c = this.createContactEquation(circleBody,convexBody,circleShape,convexShape);

                vec2$8.copy(c.normalA, dist);
                vec2$8.normalize(c.normalA,c.normalA);

                // Vector from circle to contact point is the normal times the circle radius
                vec2$8.scale(c.contactPointA, c.normalA, circleRadius);
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

var pic_worldVertex0 = vec2$8.create(),
    pic_worldVertex1 = vec2$8.create(),
    pic_r0 = vec2$8.create(),
    pic_r1 = vec2$8.create();

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
        vec2$8.rotate(worldVertex0, v0, convexAngle);
        vec2$8.rotate(worldVertex1, v1, convexAngle);
        add(worldVertex0, worldVertex0, convexOffset);
        add(worldVertex1, worldVertex1, convexOffset);

        sub(r0, worldVertex0, point);
        sub(r1, worldVertex1, point);
        var cross = vec2$8.crossLength(r0,r1);

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
Narrowphase$1.prototype[Shape$2.PARTICLE | Shape$2.CONVEX] =
Narrowphase$1.prototype[Shape$2.PARTICLE | Shape$2.BOX] =
Narrowphase$1.prototype.particleConvex = function(
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
        vec2$8.rotate(worldVertex0, v0, convexAngle);
        vec2$8.rotate(worldVertex1, v1, convexAngle);
        add(worldVertex0, worldVertex0, convexOffset);
        add(worldVertex1, worldVertex1, convexOffset);

        // Get world edge
        sub(worldEdge, worldVertex1, worldVertex0);
        vec2$8.normalize(worldEdgeUnit, worldEdge);

        // Get tangent to the edge. Points out of the Convex
        vec2$8.rotate90cw(worldTangent, worldEdgeUnit);

        // Check distance from the infinite line (spanned by the edge) to the particle
        sub(dist, particleOffset, worldVertex0);
        dot(dist, worldTangent);
        sub(centerDist, worldVertex0, convexOffset);

        sub(convexToparticle, particleOffset, convexOffset);

        vec2$8.sub(candidateDist,worldVertex0,particleOffset);
        var candidateDistance = Math.abs(vec2$8.dot(candidateDist,worldTangent));

        if(candidateDistance < minCandidateDistance){
            minCandidateDistance = candidateDistance;
            vec2$8.scale(closestEdgeProjectedPoint,worldTangent,candidateDistance);
            vec2$8.add(closestEdgeProjectedPoint,closestEdgeProjectedPoint,particleOffset);
            vec2$8.copy(minEdgeNormal,worldTangent);
            found = true;
        }
    }

    if(found){
        var c = this.createContactEquation(particleBody,convexBody,particleShape,convexShape);

        vec2$8.scale(c.normalA, minEdgeNormal, -1);
        vec2$8.normalize(c.normalA, c.normalA);

        // Particle has no extent to the contact point
        vec2$8.set(c.contactPointA,  0, 0);
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
Narrowphase$1.prototype[Shape$2.CIRCLE] =
Narrowphase$1.prototype.circleCircle = function(
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
    if(vec2$8.squaredLength(dist) > Math.pow(r,2)){
        return 0;
    }

    if(justTest){
        return true;
    }

    var c = this.createContactEquation(bodyA,bodyB,shapeA,shapeB);
    sub(c.normalA, offsetB, offsetA);
    vec2$8.normalize(c.normalA,c.normalA);

    vec2$8.scale( c.contactPointA, c.normalA,  radiusA);
    vec2$8.scale( c.contactPointB, c.normalA, -radiusB);

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
Narrowphase$1.prototype[Shape$2.PLANE | Shape$2.CONVEX] =
Narrowphase$1.prototype[Shape$2.PLANE | Shape$2.BOX] =
Narrowphase$1.prototype.planeConvex = function(
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
    vec2$8.rotate(worldNormal, yAxis$2, planeAngle);

    for(var i=0; i!==convexShape.vertices.length; i++){
        var v = convexShape.vertices[i];
        vec2$8.rotate(worldVertex, v, convexAngle);
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

            vec2$8.copy(c.normalA, worldNormal);

            var d = dot(dist, c.normalA);
            vec2$8.scale(dist, c.normalA, d);

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
Narrowphase$1.prototype[Shape$2.PARTICLE | Shape$2.PLANE] =
Narrowphase$1.prototype.particlePlane = function(
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
    vec2$8.rotate(worldNormal, yAxis$2, planeAngle);

    var d = dot(dist, worldNormal);

    if(d > 0){
        return 0;
    }
    if(justTest){
        return true;
    }

    var c = this.createContactEquation(planeBody,particleBody,planeShape,particleShape);

    vec2$8.copy(c.normalA, worldNormal);
    vec2$8.scale( dist, c.normalA, d );
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
Narrowphase$1.prototype[Shape$2.CIRCLE | Shape$2.PARTICLE] =
Narrowphase$1.prototype.circleParticle = function(
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
    if(vec2$8.squaredLength(dist) > Math.pow(circleShape.radius, 2)){
        return 0;
    }
    if(justTest){
        return true;
    }

    var c = this.createContactEquation(circleBody,particleBody,circleShape,particleShape);
    vec2$8.copy(c.normalA, dist);
    vec2$8.normalize(c.normalA,c.normalA);

    // Vector from circle to contact point is the normal times the circle radius
    vec2$8.scale(c.contactPointA, c.normalA, circleShape.radius);
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

var planeCapsule_tmpCircle = new Circle$1({ radius: 1 }),
    planeCapsule_tmp1 = vec2$8.create(),
    planeCapsule_tmp2 = vec2$8.create();
    vec2$8.create();

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
Narrowphase$1.prototype[Shape$2.PLANE | Shape$2.CAPSULE] =
Narrowphase$1.prototype.planeCapsule = function(
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
    vec2$8.set(end1, -capsuleShape.length/2, 0);
    vec2$8.rotate(end1,end1,capsuleAngle);
    add(end1,end1,capsuleOffset);

    vec2$8.set(end2,  capsuleShape.length/2, 0);
    vec2$8.rotate(end2,end2,capsuleAngle);
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
Narrowphase$1.prototype[Shape$2.CIRCLE | Shape$2.PLANE] =
Narrowphase$1.prototype.circlePlane = function(   bi,si,xi,ai, bj,sj,xj,aj, justTest ){
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
    vec2$8.rotate(worldNormal, yAxis$2, planeAngle);

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
    vec2$8.copy(contact.normalA, worldNormal);

    // rj is the vector from circle center to the contact point
    vec2$8.scale(contact.contactPointB, contact.normalA, -circleShape.radius);
    add(contact.contactPointB, contact.contactPointB, circleOffset);
    sub(contact.contactPointB, contact.contactPointB, circleBody.position);

    // ri is the distance from plane center to contact.
    vec2$8.scale(temp, contact.normalA, d);
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
Narrowphase$1.prototype[Shape$2.CONVEX] =
Narrowphase$1.prototype[Shape$2.CONVEX | Shape$2.BOX] =
Narrowphase$1.prototype[Shape$2.BOX] =
Narrowphase$1.prototype.convexConvex = function(  bi,si,xi,ai, bj,sj,xj,aj, justTest, precision ){
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

    var found = Narrowphase$1.findSeparatingAxis(si,xi,ai,sj,xj,aj,sepAxis);
    if(!found){
        return 0;
    }

    // Make sure the separating axis is directed from shape i to shape j
    sub(dist,xj,xi);
    if(dot(sepAxis,dist) > 0){
        vec2$8.scale(sepAxis,sepAxis,-1);
    }

    // Find edges with normals closest to the separating axis
    var closestEdge1 = Narrowphase$1.getClosestEdge(si,ai,sepAxis,true), // Flipped axis
        closestEdge2 = Narrowphase$1.getClosestEdge(sj,aj,sepAxis);

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
            vec2$8.rotate(worldPoint, v, angleB);
            add(worldPoint, worldPoint, offsetB);

            var insideNumEdges = 0;

            // Loop over the 3 closest edges in convex A
            for(var i=closestEdgeA-1; i<closestEdgeA+2; i++){

                var v0 = shapeA.vertices[(i  +shapeA.vertices.length)%shapeA.vertices.length],
                    v1 = shapeA.vertices[(i+1+shapeA.vertices.length)%shapeA.vertices.length];

                // Construct the edge
                vec2$8.rotate(worldPoint0, v0, angleA);
                vec2$8.rotate(worldPoint1, v1, angleA);
                add(worldPoint0, worldPoint0, offsetA);
                add(worldPoint1, worldPoint1, offsetA);

                sub(worldEdge, worldPoint1, worldPoint0);

                vec2$8.rotate90cw(worldNormal, worldEdge); // Normal points out of convex 1
                vec2$8.normalize(worldNormal,worldNormal);

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
                vec2$8.rotate(worldPoint0, v0, angleA);
                vec2$8.rotate(worldPoint1, v1, angleA);
                add(worldPoint0, worldPoint0, offsetA);
                add(worldPoint1, worldPoint1, offsetA);

                sub(worldEdge, worldPoint1, worldPoint0);

                vec2$8.rotate90cw(c.normalA, worldEdge); // Normal points out of convex A
                vec2$8.normalize(c.normalA,c.normalA);

                sub(dist, worldPoint, worldPoint0); // From edge point to the penetrating point
                var d = dot(c.normalA,dist);             // Penetration
                vec2$8.scale(penetrationVec, c.normalA, d);     // Vector penetration

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
var pcoa_tmp1 = vec2$8.fromValues(0,0);

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
Narrowphase$1.projectConvexOntoAxis = function(convexShape, convexOffset, convexAngle, worldAxis, result){
    var max=null,
        min=null,
        v,
        value,
        localAxis = pcoa_tmp1;

    // Convert the axis to local coords of the body
    vec2$8.rotate(localAxis, worldAxis, -convexAngle);

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

    vec2$8.set( result, min + offset, max + offset);
};

// .findSeparatingAxis is called by other functions, need local tmp vectors
var fsa_tmp1 = vec2$8.fromValues(0,0)
,   fsa_tmp2 = vec2$8.fromValues(0,0)
,   fsa_tmp3 = vec2$8.fromValues(0,0)
,   fsa_tmp4 = vec2$8.fromValues(0,0)
,   fsa_tmp5 = vec2$8.fromValues(0,0)
,   fsa_tmp6 = vec2$8.fromValues(0,0);

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
Narrowphase$1.findSeparatingAxis = function(c1,offset1,angle1,c2,offset2,angle2,sepAxis){
    var maxDist = null,
        overlap = false,
        found = false,
        edge = fsa_tmp1,
        worldPoint0 = fsa_tmp2,
        worldPoint1 = fsa_tmp3,
        normal = fsa_tmp4,
        span1 = fsa_tmp5,
        span2 = fsa_tmp6;

    if(c1 instanceof Box && c2 instanceof Box){

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
                    vec2$8.set(normal, 0, 1);
                } else if(i === 1) {
                    vec2$8.set(normal, 1, 0);
                }
                if(angle !== 0){
                    vec2$8.rotate(normal, normal, angle);
                }

                // Project hulls onto that normal
                Narrowphase$1.projectConvexOntoAxis(c1,offset1,angle1,normal,span1);
                Narrowphase$1.projectConvexOntoAxis(c2,offset2,angle2,normal,span2);

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
                    vec2$8.copy(sepAxis, normal);
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
                vec2$8.rotate(worldPoint0, c.vertices[i], angle);
                vec2$8.rotate(worldPoint1, c.vertices[(i+1)%c.vertices.length], angle);

                sub(edge, worldPoint1, worldPoint0);

                // Get normal - just rotate 90 degrees since vertices are given in CCW
                vec2$8.rotate90cw(normal, edge);
                vec2$8.normalize(normal,normal);

                // Project hulls onto that normal
                Narrowphase$1.projectConvexOntoAxis(c1,offset1,angle1,normal,span1);
                Narrowphase$1.projectConvexOntoAxis(c2,offset2,angle2,normal,span2);

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
                    vec2$8.copy(sepAxis, normal);
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
var gce_tmp1 = vec2$8.fromValues(0,0)
,   gce_tmp2 = vec2$8.fromValues(0,0)
,   gce_tmp3 = vec2$8.fromValues(0,0);

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
Narrowphase$1.getClosestEdge = function(c,angle,axis,flip){
    var localAxis = gce_tmp1,
        edge = gce_tmp2,
        normal = gce_tmp3;

    // Convert the axis to local coords of the body
    vec2$8.rotate(localAxis, axis, -angle);
    if(flip){
        vec2$8.scale(localAxis,localAxis,-1);
    }

    var closestEdge = -1,
        N = c.vertices.length,
        maxDot = -1;
    for(var i=0; i!==N; i++){
        // Get the edge
        sub(edge, c.vertices[(i+1)%N], c.vertices[i%N]);

        // Get normal - just rotate 90 degrees since vertices are given in CCW
        vec2$8.rotate90cw(normal, edge);
        vec2$8.normalize(normal,normal);

        var d = dot(normal,localAxis);
        if(closestEdge === -1 || d > maxDot){
            closestEdge = i % N;
            maxDot = d;
        }
    }

    return closestEdge;
};

var circleHeightfield_candidate = vec2$8.create(),
    circleHeightfield_dist = vec2$8.create(),
    circleHeightfield_v0 = vec2$8.create(),
    circleHeightfield_v1 = vec2$8.create(),
    circleHeightfield_minCandidate = vec2$8.create(),
    circleHeightfield_worldNormal = vec2$8.create(),
    circleHeightfield_minCandidateNormal = vec2$8.create();

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
Narrowphase$1.prototype[Shape$2.CIRCLE | Shape$2.HEIGHTFIELD] =
Narrowphase$1.prototype.circleHeightfield = function( circleBody,circleShape,circlePos,circleAngle,
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
        vec2$8.set(v0,     i*w, data[i]  );
        vec2$8.set(v1, (i+1)*w, data[i+1]);
        vec2$8.add(v0,v0,hfPos);
        vec2$8.add(v1,v1,hfPos);

        // Get normal
        vec2$8.sub(worldNormal, v1, v0);
        vec2$8.rotate(worldNormal, worldNormal, Math.PI/2);
        vec2$8.normalize(worldNormal,worldNormal);

        // Get point on circle, closest to the edge
        vec2$8.scale(candidate,worldNormal,-radius);
        vec2$8.add(candidate,candidate,circlePos);

        // Distance from v0 to the candidate point
        vec2$8.sub(dist,candidate,v0);

        // Check if it is in the element "stick"
        var d = vec2$8.dot(dist,worldNormal);
        if(candidate[0] >= v0[0] && candidate[0] < v1[0] && d <= 0){

            if(justTest){
                return true;
            }

            found = true;

            // Store the candidate point, projected to the edge
            vec2$8.scale(dist,worldNormal,-d);
            vec2$8.add(minCandidate,candidate,dist);
            vec2$8.copy(minCandidateNormal,worldNormal);

            var c = this.createContactEquation(hfBody,circleBody,hfShape,circleShape);

            // Normal is out of the heightfield
            vec2$8.copy(c.normalA, minCandidateNormal);

            // Vector from circle to heightfield
            vec2$8.scale(c.contactPointB,  c.normalA, -radius);
            add(c.contactPointB, c.contactPointB, circlePos);
            sub(c.contactPointB, c.contactPointB, circleBody.position);

            vec2$8.copy(c.contactPointA, minCandidate);
            vec2$8.sub(c.contactPointA, c.contactPointA, hfBody.position);

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
            vec2$8.set(v0, i*w, data[i]);
            vec2$8.add(v0,v0,hfPos);

            vec2$8.sub(dist, circlePos, v0);

            if(vec2$8.squaredLength(dist) < Math.pow(radius, 2)){

                if(justTest){
                    return true;
                }

                found = true;

                var c = this.createContactEquation(hfBody,circleBody,hfShape,circleShape);

                // Construct normal - out of heightfield
                vec2$8.copy(c.normalA, dist);
                vec2$8.normalize(c.normalA,c.normalA);

                vec2$8.scale(c.contactPointB, c.normalA, -radius);
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

var convexHeightfield_v0 = vec2$8.create(),
    convexHeightfield_v1 = vec2$8.create(),
    convexHeightfield_tilePos = vec2$8.create(),
    convexHeightfield_tempConvexShape = new Convex$1({ vertices: [vec2$8.create(),vec2$8.create(),vec2$8.create(),vec2$8.create()] });
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
Narrowphase$1.prototype[Shape$2.BOX | Shape$2.HEIGHTFIELD] =
Narrowphase$1.prototype[Shape$2.CONVEX | Shape$2.HEIGHTFIELD] =
Narrowphase$1.prototype.convexHeightfield = function( convexBody,convexShape,convexPos,convexAngle,
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
        vec2$8.set(v0,     i*w, data[i]  );
        vec2$8.set(v1, (i+1)*w, data[i+1]);
        vec2$8.add(v0,v0,hfPos);
        vec2$8.add(v1,v1,hfPos);

        // Construct a convex
        var tileHeight = 100; // todo
        vec2$8.set(tilePos, (v1[0] + v0[0])*0.5, (v1[1] + v0[1] - tileHeight)*0.5);

        vec2$8.sub(tileConvex.vertices[0], v1, tilePos);
        vec2$8.sub(tileConvex.vertices[1], v0, tilePos);
        vec2$8.copy(tileConvex.vertices[2], tileConvex.vertices[1]);
        vec2$8.copy(tileConvex.vertices[3], tileConvex.vertices[0]);
        tileConvex.vertices[2][1] -= tileHeight;
        tileConvex.vertices[3][1] -= tileHeight;

        // Do convex collision
        numContacts += this.convexConvex(   convexBody, convexShape, convexPos, convexAngle,
                                            hfBody, tileConvex, tilePos, 0, justTest);
    }

    return numContacts;
};

var Shape$1 =  Shape_1
,    vec2$7 =  vec2Exports
;

var Plane_1 = Plane$1;

/**
 * Plane shape class. The plane is facing in the Y direction.
 * @class Plane
 * @extends Shape
 * @constructor
 * @param {object} [options] (Note that this options object will be passed on to the {{#crossLink "Shape"}}{{/crossLink}} constructor.)
 */
function Plane$1(options){
    options = options || {};
    options.type = Shape$1.PLANE;
    Shape$1.call(this, options);
}
Plane$1.prototype = new Shape$1();
Plane$1.prototype.constructor = Plane$1;

/**
 * Compute moment of inertia
 * @method computeMomentOfInertia
 */
Plane$1.prototype.computeMomentOfInertia = function(mass){
    return 0; // Plane is infinite. The inertia should therefore be infinty but by convention we set 0 here
};

/**
 * Update the bounding radius
 * @method updateBoundingRadius
 */
Plane$1.prototype.updateBoundingRadius = function(){
    this.boundingRadius = Number.MAX_VALUE;
};

/**
 * @method computeAABB
 * @param  {AABB}   out
 * @param  {Array}  position
 * @param  {Number} angle
 */
Plane$1.prototype.computeAABB = function(out, position, angle){
    var a = angle % (2 * Math.PI);
    var set = vec2$7.set;
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

Plane$1.prototype.updateArea = function(){
    this.area = Number.MAX_VALUE;
};

var intersectPlane_planePointToFrom = vec2$7.create();
vec2$7.create();
vec2$7.create();
var intersectPlane_normal = vec2$7.create();
var intersectPlane_len = vec2$7.create();

/**
 * @method raycast
 * @param  {RayResult} result
 * @param  {Ray} ray
 * @param  {array} position
 * @param  {number} angle
 */
Plane$1.prototype.raycast = function(result, ray, position, angle){
    var from = ray.from;
    var to = ray.to;
    var direction = ray.direction;
    var planePointToFrom = intersectPlane_planePointToFrom;
    var normal = intersectPlane_normal;
    var len = intersectPlane_len;

    // Get plane normal
    vec2$7.set(normal, 0, 1);
    vec2$7.rotate(normal, normal, angle);

    vec2$7.sub(len, from, position);
    var planeToFrom = vec2$7.dot(len, normal);
    vec2$7.sub(len, to, position);
    var planeToTo = vec2$7.dot(len, normal);

    if(planeToFrom * planeToTo > 0){
        // "from" and "to" are on the same side of the plane... bail out
        return;
    }

    if(vec2$7.squaredDistance(from, to) < planeToFrom * planeToFrom){
        return;
    }

    var n_dot_dir = vec2$7.dot(normal, direction);

    vec2$7.sub(planePointToFrom, from, position);
    var t = -vec2$7.dot(normal, planePointToFrom) / n_dot_dir / ray.length;

    ray.reportIntersection(result, t, normal, -1);
};

var Shape = Shape_1
,   vec2$6 = vec2Exports;

var Particle_1 = Particle$1;

/**
 * Particle shape class.
 * @class Particle
 * @constructor
 * @param {object} [options] (Note that this options object will be passed on to the {{#crossLink "Shape"}}{{/crossLink}} constructor.)
 * @extends Shape
 */
function Particle$1(options){
    options = options || {};
	options.type = Shape.PARTICLE;
    Shape.call(this, options);
}
Particle$1.prototype = new Shape();
Particle$1.prototype.constructor = Particle$1;

Particle$1.prototype.computeMomentOfInertia = function(mass){
    return 0; // Can't rotate a particle
};

Particle$1.prototype.updateBoundingRadius = function(){
    this.boundingRadius = 0;
};

/**
 * @method computeAABB
 * @param  {AABB}   out
 * @param  {Array}  position
 * @param  {Number} angle
 */
Particle$1.prototype.computeAABB = function(out, position, angle){
    vec2$6.copy(out.lowerBound, position);
    vec2$6.copy(out.upperBound, position);
};

var Broadphase$1 = Broadphase_1;

var NaiveBroadphase_1 = NaiveBroadphase;

/**
 * Naive broadphase implementation. Does N^2 tests.
 *
 * @class NaiveBroadphase
 * @constructor
 * @extends Broadphase
 */
function NaiveBroadphase(){
    Broadphase$1.call(this, Broadphase$1.NAIVE);
}
NaiveBroadphase.prototype = new Broadphase$1();
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

            if(Broadphase$1.canCollide(bi,bj) && this.boundingVolumeCheck(bi,bj)){
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

var Equation$3 = Equation_1;

var RotationalVelocityEquation_1 = RotationalVelocityEquation$1;

/**
 * Syncs rotational velocity of two bodies, or sets a relative velocity (motor).
 *
 * @class RotationalVelocityEquation
 * @constructor
 * @extends Equation
 * @param {Body} bodyA
 * @param {Body} bodyB
 */
function RotationalVelocityEquation$1(bodyA, bodyB){
    Equation$3.call(this, bodyA, bodyB, -Number.MAX_VALUE, Number.MAX_VALUE);
    this.relativeVelocity = 1;
    this.ratio = 1;
}
RotationalVelocityEquation$1.prototype = new Equation$3();
RotationalVelocityEquation$1.prototype.constructor = RotationalVelocityEquation$1;
RotationalVelocityEquation$1.prototype.computeB = function(a,b,h){
    var G = this.G;
    G[2] = -1;
    G[5] = this.ratio;

    var GiMf = this.computeGiMf();
    var GW = this.computeGW();
    var B = - GW * b - h*GiMf;

    return B;
};

var Equation$2 = Equation_1,
    vec2$5 = vec2Exports;

var RotationalLockEquation_1 = RotationalLockEquation$2;

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
function RotationalLockEquation$2(bodyA, bodyB, options){
    options = options || {};
    Equation$2.call(this, bodyA, bodyB, -Number.MAX_VALUE, Number.MAX_VALUE);

    /**
     * @property {number} angle
     */
    this.angle = options.angle || 0;

    var G = this.G;
    G[2] =  1;
    G[5] = -1;
}
RotationalLockEquation$2.prototype = new Equation$2();
RotationalLockEquation$2.prototype.constructor = RotationalLockEquation$2;

var worldVectorA = vec2$5.create(),
    worldVectorB = vec2$5.create(),
    xAxis$1 = vec2$5.fromValues(1,0),
    yAxis$1 = vec2$5.fromValues(0,1);
RotationalLockEquation$2.prototype.computeGq = function(){
    vec2$5.rotate(worldVectorA,xAxis$1,this.bodyA.angle+this.angle);
    vec2$5.rotate(worldVectorB,yAxis$1,this.bodyB.angle);
    return vec2$5.dot(worldVectorA,worldVectorB);
};

var Constraint$2 = Constraint_1
,   Equation$1 = Equation_1
,   RotationalVelocityEquation = RotationalVelocityEquation_1
,   RotationalLockEquation$1 = RotationalLockEquation_1
,   vec2$4 = vec2Exports;

var RevoluteConstraint_1 = RevoluteConstraint;

var worldPivotA = vec2$4.create(),
    worldPivotB = vec2$4.create(),
    xAxis = vec2$4.fromValues(1,0),
    yAxis = vec2$4.fromValues(0,1),
    g = vec2$4.create();

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
    Constraint$2.call(this,bodyA,bodyB,Constraint$2.REVOLUTE,options);

    var maxForce = this.maxForce = typeof(options.maxForce) !== "undefined" ? options.maxForce : Number.MAX_VALUE;

    /**
     * @property {Array} pivotA
     */
    this.pivotA = vec2$4.create();

    /**
     * @property {Array} pivotB
     */
    this.pivotB = vec2$4.create();

    if(options.worldPivot){
        // Compute pivotA and pivotB
        vec2$4.sub(this.pivotA, options.worldPivot, bodyA.position);
        vec2$4.sub(this.pivotB, options.worldPivot, bodyB.position);
        // Rotate to local coordinate system
        vec2$4.rotate(this.pivotA, this.pivotA, -bodyA.angle);
        vec2$4.rotate(this.pivotB, this.pivotB, -bodyB.angle);
    } else {
        // Get pivotA and pivotB
        vec2$4.copy(this.pivotA, options.localPivotA);
        vec2$4.copy(this.pivotB, options.localPivotB);
    }

    // Equations to be fed to the solver
    var eqs = this.equations = [
        new Equation$1(bodyA,bodyB,-maxForce,maxForce),
        new Equation$1(bodyA,bodyB,-maxForce,maxForce),
    ];

    var x = eqs[0];
    var y = eqs[1];
    var that = this;

    x.computeGq = function(){
        vec2$4.rotate(worldPivotA, that.pivotA, bodyA.angle);
        vec2$4.rotate(worldPivotB, that.pivotB, bodyB.angle);
        vec2$4.add(g, bodyB.position, worldPivotB);
        vec2$4.sub(g, g, bodyA.position);
        vec2$4.sub(g, g, worldPivotA);
        return vec2$4.dot(g,xAxis);
    };

    y.computeGq = function(){
        vec2$4.rotate(worldPivotA, that.pivotA, bodyA.angle);
        vec2$4.rotate(worldPivotB, that.pivotB, bodyB.angle);
        vec2$4.add(g, bodyB.position, worldPivotB);
        vec2$4.sub(g, g, bodyA.position);
        vec2$4.sub(g, g, worldPivotA);
        return vec2$4.dot(g,yAxis);
    };

    y.minForce = x.minForce = -maxForce;
    y.maxForce = x.maxForce =  maxForce;

    this.motorEquation = new RotationalVelocityEquation(bodyA,bodyB);

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

    this.upperLimitEquation = new RotationalLockEquation$1(bodyA,bodyB);
    this.lowerLimitEquation = new RotationalLockEquation$1(bodyA,bodyB);
    this.upperLimitEquation.minForce = 0;
    this.lowerLimitEquation.maxForce = 0;
}
RevoluteConstraint.prototype = new Constraint$2();
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
        eqs =    this.equations;
        eqs[0];
        eqs[1];
        var x = eqs[0],
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

    vec2$4.rotate(worldPivotA, pivotA, bodyA.angle);
    vec2$4.rotate(worldPivotB, pivotB, bodyB.angle);

    // todo: these are a bit sparse. We could save some computations on making custom eq.computeGW functions, etc

    x.G[0] = -1;
    x.G[1] =  0;
    x.G[2] = -vec2$4.crossLength(worldPivotA,xAxis);
    x.G[3] =  1;
    x.G[4] =  0;
    x.G[5] =  vec2$4.crossLength(worldPivotB,xAxis);

    y.G[0] =  0;
    y.G[1] = -1;
    y.G[2] = -vec2$4.crossLength(worldPivotA,yAxis);
    y.G[3] =  0;
    y.G[4] =  1;
    y.G[5] =  vec2$4.crossLength(worldPivotB,yAxis);
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

var Constraint$1 = Constraint_1
,   ContactEquation = ContactEquation_1
,   Equation = Equation_1
,   vec2$3 = vec2Exports
,   RotationalLockEquation = RotationalLockEquation_1;

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
    Constraint$1.call(this,bodyA,bodyB,Constraint$1.PRISMATIC,options);

    // Get anchors
    var localAnchorA = vec2$3.fromValues(0,0),
        localAxisA = vec2$3.fromValues(1,0),
        localAnchorB = vec2$3.fromValues(0,0);
    if(options.localAnchorA){ vec2$3.copy(localAnchorA, options.localAnchorA); }
    if(options.localAxisA){ vec2$3.copy(localAxisA,   options.localAxisA); }
    if(options.localAnchorB){ vec2$3.copy(localAnchorB, options.localAnchorB); }

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
    var trans = new Equation(bodyA,bodyB,-maxForce,maxForce);
    var ri = new vec2$3.create(),
        rj = new vec2$3.create(),
        gg = new vec2$3.create(),
        t =  new vec2$3.create();
    trans.computeGq = function(){
        // g = ( xj + rj - xi - ri ) * t
        return vec2$3.dot(gg,t);
    };
    trans.updateJacobian = function(){
        var G = this.G,
            xi = bodyA.position,
            xj = bodyB.position;
        vec2$3.rotate(ri,localAnchorA,bodyA.angle);
        vec2$3.rotate(rj,localAnchorB,bodyB.angle);
        vec2$3.add(gg,xj,rj);
        vec2$3.sub(gg,gg,xi);
        vec2$3.sub(gg,gg,ri);
        vec2$3.rotate(t,localAxisA,bodyA.angle+Math.PI/2);

        G[0] = -t[0];
        G[1] = -t[1];
        G[2] = -vec2$3.crossLength(ri,t) + vec2$3.crossLength(t,gg);
        G[3] = t[0];
        G[4] = t[1];
        G[5] = vec2$3.crossLength(rj,t);
    };
    this.equations.push(trans);

    // Rotational part
    if(!options.disableRotationalLock){
        var rot = new RotationalLockEquation(bodyA,bodyB,-maxForce);
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
    this.upperLimitEquation = new ContactEquation(bodyA,bodyB);
    this.lowerLimitEquation = new ContactEquation(bodyA,bodyB);

    // Set max/min forces
    this.upperLimitEquation.minForce = this.lowerLimitEquation.minForce = 0;
    this.upperLimitEquation.maxForce = this.lowerLimitEquation.maxForce = maxForce;

    /**
     * Equation used for the motor.
     * @property motorEquation
     * @type {Equation}
     */
    this.motorEquation = new Equation(bodyA,bodyB);

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
    motorEquation.computeGW;
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

PrismaticConstraint.prototype = new Constraint$1();
PrismaticConstraint.prototype.constructor = PrismaticConstraint;

var worldAxisA = vec2$3.create(),
    worldAnchorA = vec2$3.create(),
    worldAnchorB = vec2$3.create(),
    orientedAnchorA = vec2$3.create(),
    orientedAnchorB = vec2$3.create(),
    tmp = vec2$3.create();

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
    vec2$3.rotate(worldAxisA,      localAxisA,      bodyA.angle);
    vec2$3.rotate(orientedAnchorA, localAnchorA,    bodyA.angle);
    vec2$3.add(worldAnchorA,       orientedAnchorA, bodyA.position);
    vec2$3.rotate(orientedAnchorB, localAnchorB,    bodyB.angle);
    vec2$3.add(worldAnchorB,       orientedAnchorB, bodyB.position);

    var relPosition = this.position = vec2$3.dot(worldAnchorB,worldAxisA) - vec2$3.dot(worldAnchorA,worldAxisA);

    // Motor
    if(this.motorEnabled){
        // G = [ a     a x ri   -a   -a x rj ]
        var G = this.motorEquation.G;
        G[0] = worldAxisA[0];
        G[1] = worldAxisA[1];
        G[2] = vec2$3.crossLength(worldAxisA,orientedAnchorB);
        G[3] = -worldAxisA[0];
        G[4] = -worldAxisA[1];
        G[5] = -vec2$3.crossLength(worldAxisA,orientedAnchorA);
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
        vec2$3.scale(upperLimitEquation.normalA, worldAxisA, -1);
        vec2$3.sub(upperLimitEquation.contactPointA, worldAnchorA, bodyA.position);
        vec2$3.sub(upperLimitEquation.contactPointB, worldAnchorB, bodyB.position);
        vec2$3.scale(tmp,worldAxisA,upperLimit);
        vec2$3.add(upperLimitEquation.contactPointA,upperLimitEquation.contactPointA,tmp);
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
        vec2$3.scale(lowerLimitEquation.normalA, worldAxisA, 1);
        vec2$3.sub(lowerLimitEquation.contactPointA, worldAnchorA, bodyA.position);
        vec2$3.sub(lowerLimitEquation.contactPointB, worldAnchorB, bodyB.position);
        vec2$3.scale(tmp,worldAxisA,lowerLimit);
        vec2$3.sub(lowerLimitEquation.contactPointB,lowerLimitEquation.contactPointB,tmp);
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

var Utils$3 = Utils_1
,   Broadphase = Broadphase_1;

var SAPBroadphase_1 = SAPBroadphase$1;

/**
 * Sweep and prune broadphase along one axis.
 *
 * @class SAPBroadphase
 * @constructor
 * @extends Broadphase
 */
function SAPBroadphase$1(){
    Broadphase.call(this,Broadphase.SAP);

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
SAPBroadphase$1.prototype = new Broadphase();
SAPBroadphase$1.prototype.constructor = SAPBroadphase$1;

/**
 * Change the world
 * @method setWorld
 * @param {World} world
 */
SAPBroadphase$1.prototype.setWorld = function(world){
    // Clear the old axis array
    this.axisList.length = 0;

    // Add all bodies from the new world
    Utils$3.appendArray(this.axisList, world.bodies);

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
SAPBroadphase$1.sortAxisList = function(a, axisIndex){
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

SAPBroadphase$1.prototype.sortList = function(){
    var bodies = this.axisList,
    axisIndex = this.axisIndex;

    // Sort the lists
    SAPBroadphase$1.sortAxisList(bodies, axisIndex);
};

/**
 * Get the colliding pairs
 * @method getCollisionPairs
 * @param  {World} world
 * @return {Array}
 */
SAPBroadphase$1.prototype.getCollisionPairs = function(world){
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

            if(Broadphase.canCollide(bi,bj) && this.boundingVolumeCheck(bi,bj)){
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
SAPBroadphase$1.prototype.aabbQuery = function(world, aabb, result){
    result = result || [];

    this.sortList();

    var axisIndex = this.axisIndex;
    var axis = 'x';
    if(axisIndex === 1){ axis = 'y'; }
    if(axisIndex === 2){ axis = 'z'; }

    var axisList = this.axisList;
    aabb.lowerBound[axis];
    aabb.upperBound[axis];
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

var Utils$2 = Utils_1;

var Spring_1 = Spring$2;

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
function Spring$2(bodyA, bodyB, options){
    options = Utils$2.defaults(options,{
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
Spring$2.prototype.applyForce = function(){
    // To be implemented by subclasses
};

var vec2$2 = vec2Exports;
var Constraint = Constraint_1;
var FrictionEquation = FrictionEquation_1;
var Body$3 = Body_1;

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

    /**
     * @property {Body} chassisBody
     */
    this.chassisBody = chassisBody;

    /**
     * @property {Array} wheels
     */
    this.wheels = [];

    // A dummy body to constrain the chassis to
    this.groundBody = new Body$3({ mass: 0 });

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

    this.forwardEquation = new FrictionEquation(vehicle.chassisBody, vehicle.groundBody);

    this.sideEquation = new FrictionEquation(vehicle.chassisBody, vehicle.groundBody);

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
    this.localForwardVector = vec2$2.fromValues(0, 1);
    if(options.localForwardVector){
        vec2$2.copy(this.localForwardVector, options.localForwardVector);
    }

    /**
     * @property {Array} localPosition
     */
    this.localPosition = vec2$2.fromValues(0, 0);
    if(options.localPosition){
        vec2$2.copy(this.localPosition, options.localPosition);
    }

    Constraint.apply(this, vehicle.chassisBody, vehicle.groundBody);

    this.equations.push(
        this.forwardEquation,
        this.sideEquation
    );

    this.setBrakeForce(0);
}
WheelConstraint.prototype = new Constraint();

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

var worldVelocity = vec2$2.create();
var relativePoint = vec2$2.create();

/**
 * @method getSpeed
 */
WheelConstraint.prototype.getSpeed = function(){
    this.vehicle.chassisBody.vectorToWorldFrame(relativePoint, this.localForwardVector);
    this.vehicle.chassisBody.getVelocityAtPoint(worldVelocity, relativePoint);
    return vec2$2.dot(worldVelocity, relativePoint);
};

var tmpVec = vec2$2.create();

/**
 * @method update
 */
WheelConstraint.prototype.update = function(){

    // Directional
    this.vehicle.chassisBody.vectorToWorldFrame(this.forwardEquation.t, this.localForwardVector);
    vec2$2.rotate(this.sideEquation.t, this.localForwardVector, Math.PI / 2);
    this.vehicle.chassisBody.vectorToWorldFrame(this.sideEquation.t, this.sideEquation.t);

    vec2$2.rotate(this.forwardEquation.t, this.forwardEquation.t, this.steerValue);
    vec2$2.rotate(this.sideEquation.t, this.sideEquation.t, this.steerValue);

    // Attachment point
    this.vehicle.chassisBody.toWorldFrame(this.forwardEquation.contactPointB, this.localPosition);
    vec2$2.copy(this.sideEquation.contactPointB, this.forwardEquation.contactPointB);

    this.vehicle.chassisBody.vectorToWorldFrame(this.forwardEquation.contactPointA, this.localPosition);
    vec2$2.copy(this.sideEquation.contactPointA, this.forwardEquation.contactPointA);

    // Add engine force
    vec2$2.normalize(tmpVec, this.forwardEquation.t);
    vec2$2.scale(tmpVec, tmpVec, this.engineForce);

    this.vehicle.chassisBody.applyForce(tmpVec, this.forwardEquation.contactPointA);
};

var vec2$1 = vec2Exports;
var Spring$1 = Spring_1;

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

    Spring$1.call(this, bodyA, bodyB, options);

    /**
     * Anchor for bodyA in local bodyA coordinates.
     * @property localAnchorA
     * @type {Array}
     */
    this.localAnchorA = vec2$1.fromValues(0,0);

    /**
     * Anchor for bodyB in local bodyB coordinates.
     * @property localAnchorB
     * @type {Array}
     */
    this.localAnchorB = vec2$1.fromValues(0,0);

    if(options.localAnchorA){ vec2$1.copy(this.localAnchorA, options.localAnchorA); }
    if(options.localAnchorB){ vec2$1.copy(this.localAnchorB, options.localAnchorB); }
    if(options.worldAnchorA){ this.setWorldAnchorA(options.worldAnchorA); }
    if(options.worldAnchorB){ this.setWorldAnchorB(options.worldAnchorB); }

    var worldAnchorA = vec2$1.create();
    var worldAnchorB = vec2$1.create();
    this.getWorldAnchorA(worldAnchorA);
    this.getWorldAnchorB(worldAnchorB);
    var worldDistance = vec2$1.distance(worldAnchorA, worldAnchorB);

    /**
     * Rest length of the spring.
     * @property restLength
     * @type {number}
     */
    this.restLength = typeof(options.restLength) === "number" ? options.restLength : worldDistance;
}
LinearSpring.prototype = new Spring$1();
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

var applyForce_r =              vec2$1.create(),
    applyForce_r_unit =         vec2$1.create(),
    applyForce_u =              vec2$1.create(),
    applyForce_f =              vec2$1.create(),
    applyForce_worldAnchorA =   vec2$1.create(),
    applyForce_worldAnchorB =   vec2$1.create(),
    applyForce_ri =             vec2$1.create(),
    applyForce_rj =             vec2$1.create(),
    applyForce_tmp =            vec2$1.create();

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
    vec2$1.sub(ri, worldAnchorA, bodyA.position);
    vec2$1.sub(rj, worldAnchorB, bodyB.position);

    // Compute distance vector between world anchor points
    vec2$1.sub(r, worldAnchorB, worldAnchorA);
    var rlen = vec2$1.len(r);
    vec2$1.normalize(r_unit,r);

    //console.log(rlen)
    //console.log("A",vec2.str(worldAnchorA),"B",vec2.str(worldAnchorB))

    // Compute relative velocity of the anchor points, u
    vec2$1.sub(u, bodyB.velocity, bodyA.velocity);
    vec2$1.crossZV(tmp, bodyB.angularVelocity, rj);
    vec2$1.add(u, u, tmp);
    vec2$1.crossZV(tmp, bodyA.angularVelocity, ri);
    vec2$1.sub(u, u, tmp);

    // F = - k * ( x - L ) - D * ( u )
    vec2$1.scale(f, r_unit, -k*(rlen-l) - d*vec2$1.dot(u,r_unit));

    // Add forces to bodies
    vec2$1.sub( bodyA.force, bodyA.force, f);
    vec2$1.add( bodyB.force, bodyB.force, f);

    // Angular force
    var ri_x_f = vec2$1.crossLength(ri, f);
    var rj_x_f = vec2$1.crossLength(rj, f);
    bodyA.angularForce -= ri_x_f;
    bodyB.angularForce += rj_x_f;
};

var Spring = Spring_1;

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

    Spring.call(this, bodyA, bodyB, options);

    /**
     * Rest angle of the spring.
     * @property restAngle
     * @type {number}
     */
    this.restAngle = typeof(options.restAngle) === "number" ? options.restAngle : bodyB.angle - bodyA.angle;
}
RotationalSpring.prototype = new Spring();
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

var name = "p2";
var version = "0.7.1";
var description = "A JavaScript 2D physics engine.";
var author = "Stefan Hedman <schteppe@gmail.com> (http://steffe.se)";
var keywords = [
	"p2.js",
	"p2",
	"physics",
	"engine",
	"2d"
];
var main = "./src/p2.js";
var engines = {
	node: "*"
};
var repository = {
	type: "git",
	url: "https://github.com/schteppe/p2.js.git"
};
var bugs = {
	url: "https://github.com/schteppe/p2.js/issues"
};
var licenses = [
	{
		type: "MIT"
	}
];
var devDependencies = {
	grunt: "^0.4.5",
	"grunt-contrib-jshint": "^0.11.2",
	"grunt-contrib-nodeunit": "^0.4.1",
	"grunt-contrib-uglify": "~0.4.0",
	"grunt-contrib-watch": "~0.5.0",
	"grunt-browserify": "~2.0.1",
	"grunt-contrib-concat": "^0.4.0"
};
var dependencies = {
	"poly-decomp": "0.1.1"
};
var require$$43 = {
	name: name,
	version: version,
	description: description,
	author: author,
	keywords: keywords,
	main: main,
	engines: engines,
	repository: repository,
	bugs: bugs,
	licenses: licenses,
	devDependencies: devDependencies,
	dependencies: dependencies
};

var OverlapKeeperRecord_1 = OverlapKeeperRecord$1;

/**
 * Overlap data container for the OverlapKeeper
 * @class OverlapKeeperRecord
 * @constructor
 * @param {Body} bodyA
 * @param {Shape} shapeA
 * @param {Body} bodyB
 * @param {Shape} shapeB
 */
function OverlapKeeperRecord$1(bodyA, shapeA, bodyB, shapeB){
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
OverlapKeeperRecord$1.prototype.set = function(bodyA, shapeA, bodyB, shapeB){
    OverlapKeeperRecord$1.call(this, bodyA, shapeA, bodyB, shapeB);
};

var OverlapKeeperRecord = OverlapKeeperRecord_1;
var Pool$2 = Pool_1;

var OverlapKeeperRecordPool_1 = OverlapKeeperRecordPool$1;

/**
 * @class
 */
function OverlapKeeperRecordPool$1() {
	Pool$2.apply(this, arguments);
}
OverlapKeeperRecordPool$1.prototype = new Pool$2();
OverlapKeeperRecordPool$1.prototype.constructor = OverlapKeeperRecordPool$1;

/**
 * @method create
 * @return {OverlapKeeperRecord}
 */
OverlapKeeperRecordPool$1.prototype.create = function () {
	return new OverlapKeeperRecord();
};

/**
 * @method destroy
 * @param {OverlapKeeperRecord} record
 * @return {OverlapKeeperRecordPool}
 */
OverlapKeeperRecordPool$1.prototype.destroy = function (record) {
	record.bodyA = record.bodyB = record.shapeA = record.shapeB = null;
	return this;
};

var TupleDictionary = TupleDictionary_1;
var OverlapKeeperRecordPool = OverlapKeeperRecordPool_1;

var OverlapKeeper_1 = OverlapKeeper$1;

/**
 * Keeps track of overlaps in the current state and the last step state.
 * @class OverlapKeeper
 * @constructor
 */
function OverlapKeeper$1() {
    this.overlappingShapesLastState = new TupleDictionary();
    this.overlappingShapesCurrentState = new TupleDictionary();
    this.recordPool = new OverlapKeeperRecordPool({ size: 16 });
    this.tmpDict = new TupleDictionary();
    this.tmpArray1 = [];
}

/**
 * Ticks one step forward in time. This will move the current overlap state to the "old" overlap state, and create a new one as current.
 * @method tick
 */
OverlapKeeper$1.prototype.tick = function() {
    var last = this.overlappingShapesLastState;
    var current = this.overlappingShapesCurrentState;

    // Save old objects into pool
    var l = last.keys.length;
    while(l--){
        var key = last.keys[l];
        var lastObject = last.getByKey(key);
        current.getByKey(key);
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
OverlapKeeper$1.prototype.setOverlapping = function(bodyA, shapeA, bodyB, shapeB) {
    this.overlappingShapesLastState;
    var current = this.overlappingShapesCurrentState;

    // Store current contact state
    if(!current.get(shapeA.id, shapeB.id)){
        var data = this.recordPool.get();
        data.set(bodyA, shapeA, bodyB, shapeB);
        current.set(shapeA.id, shapeB.id, data);
    }
};

OverlapKeeper$1.prototype.getNewOverlaps = function(result){
    return this.getDiff(this.overlappingShapesLastState, this.overlappingShapesCurrentState, result);
};

OverlapKeeper$1.prototype.getEndOverlaps = function(result){
    return this.getDiff(this.overlappingShapesCurrentState, this.overlappingShapesLastState, result);
};

/**
 * Checks if two bodies are currently overlapping.
 * @method bodiesAreOverlapping
 * @param  {Body} bodyA
 * @param  {Body} bodyB
 * @return {boolean}
 */
OverlapKeeper$1.prototype.bodiesAreOverlapping = function(bodyA, bodyB){
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

OverlapKeeper$1.prototype.getDiff = function(dictA, dictB, result){
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

OverlapKeeper$1.prototype.isNewOverlap = function(shapeA, shapeB){
    var idA = shapeA.id|0,
        idB = shapeB.id|0;
    var last = this.overlappingShapesLastState;
    var current = this.overlappingShapesCurrentState;
    // Not in last but in new
    return !!!last.get(idA, idB) && !!current.get(idA, idB);
};

OverlapKeeper$1.prototype.getNewBodyOverlaps = function(result){
    this.tmpArray1.length = 0;
    var overlaps = this.getNewOverlaps(this.tmpArray1);
    return this.getBodyDiff(overlaps, result);
};

OverlapKeeper$1.prototype.getEndBodyOverlaps = function(result){
    this.tmpArray1.length = 0;
    var overlaps = this.getEndOverlaps(this.tmpArray1);
    return this.getBodyDiff(overlaps, result);
};

OverlapKeeper$1.prototype.getBodyDiff = function(overlaps, result){
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

var Body$2 = Body_1;

var Island_1 = Island$1;

/**
 * An island of bodies connected with equations.
 * @class Island
 * @constructor
 */
function Island$1(){

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
Island$1.prototype.reset = function(){
    this.equations.length = this.bodies.length = 0;
};

var bodyIds = [];

/**
 * Get all unique bodies in this island.
 * @method getBodies
 * @return {Array} An array of Body
 */
Island$1.prototype.getBodies = function(result){
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
Island$1.prototype.wantsToSleep = function(){
    for(var i=0; i<this.bodies.length; i++){
        var b = this.bodies[i];
        if(b.type === Body$2.DYNAMIC && !b.wantsToSleep){
            return false;
        }
    }
    return true;
};

/**
 * Make all bodies in the island sleep.
 * @method sleep
 */
Island$1.prototype.sleep = function(){
    for(var i=0; i<this.bodies.length; i++){
        var b = this.bodies[i];
        b.sleep();
    }
    return true;
};

var IslandNode_1 = IslandNode$1;

/**
 * Holds a body and keeps track of some additional properties needed for graph traversal.
 * @class IslandNode
 * @constructor
 * @param {Body} body
 */
function IslandNode$1(body){

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
IslandNode$1.prototype.reset = function(){
    this.equations.length = 0;
    this.neighbors.length = 0;
    this.visited = false;
    this.body = null;
};

var IslandNode = IslandNode_1;
var Pool$1 = Pool_1;

var IslandNodePool_1 = IslandNodePool$1;

/**
 * @class
 */
function IslandNodePool$1() {
	Pool$1.apply(this, arguments);
}
IslandNodePool$1.prototype = new Pool$1();
IslandNodePool$1.prototype.constructor = IslandNodePool$1;

/**
 * @method create
 * @return {IslandNode}
 */
IslandNodePool$1.prototype.create = function () {
	return new IslandNode();
};

/**
 * @method destroy
 * @param {IslandNode} node
 * @return {IslandNodePool}
 */
IslandNodePool$1.prototype.destroy = function (node) {
	node.reset();
	return this;
};

var Island = Island_1;
var Pool = Pool_1;

var IslandPool_1 = IslandPool$1;

/**
 * @class
 */
function IslandPool$1() {
	Pool.apply(this, arguments);
}
IslandPool$1.prototype = new Pool();
IslandPool$1.prototype.constructor = IslandPool$1;

/**
 * @method create
 * @return {Island}
 */
IslandPool$1.prototype.create = function () {
	return new Island();
};

/**
 * @method destroy
 * @param {Island} island
 * @return {IslandPool}
 */
IslandPool$1.prototype.destroy = function (island) {
	island.reset();
	return this;
};

var IslandNodePool = IslandNodePool_1
,   IslandPool = IslandPool_1
,   Body$1 = Body_1;

var IslandManager_1 = IslandManager$1;

/**
 * Splits the system of bodies and equations into independent islands
 *
 * @class IslandManager
 * @constructor
 * @param {Object} [options]
 * @extends Solver
 */
function IslandManager$1(options){

    /**
     * @property nodePool
     * @type {IslandNodePool}
     */
    this.nodePool = new IslandNodePool({ size: 16 });

    /**
     * @property islandPool
     * @type {IslandPool}
     */
    this.islandPool = new IslandPool({ size: 8 });

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
IslandManager$1.getUnvisitedNode = function(nodes){
    var Nnodes = nodes.length;
    for(var i=0; i!==Nnodes; i++){
        var node = nodes[i];
        if(!node.visited && node.body.type === Body$1.DYNAMIC){
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
IslandManager$1.prototype.visit = function (node,bds,eqs){
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
IslandManager$1.prototype.bfs = function(root,bds,eqs){

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
        while((child = IslandManager$1.getUnvisitedNode(node.neighbors))) {
            child.visited = true;
            this.visit(child,bds,eqs);

            // Only visit the children of this node if it's dynamic
            if(child.body.type === Body$1.DYNAMIC){
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
IslandManager$1.prototype.split = function(world){
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
    while((child = IslandManager$1.getUnvisitedNode(nodes))){

        // Create new island
        var island = this.islandPool.get();

        // Get all equations and bodies in this island
        this.bfs(child, island.bodies, island.equations);

        islands.push(island);
    }

    return islands;
};

var GSSolver = GSSolver_1
;    requireRay()
;    var vec2 = vec2Exports
,    Circle = Circle_1
,    Convex = Convex_1
,    Plane = Plane_1
,    Capsule = Capsule_1
,    Particle = Particle_1
,    EventEmitter = EventEmitter_1
,    Body = Body_1
,    Material = Material_1
,    ContactMaterial = ContactMaterial_1
,    AABB = AABB_1
,    SAPBroadphase = SAPBroadphase_1
,    Narrowphase = Narrowphase_1
,    Utils$1 = Utils_1
,    OverlapKeeper = OverlapKeeper_1
,    IslandManager = IslandManager_1
;

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
    EventEmitter.apply(this);

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
    this.solver = options.solver || new GSSolver();

    /**
     * The narrowphase to use to generate contacts.
     *
     * @property narrowphase
     * @type {Narrowphase}
     */
    this.narrowphase = new Narrowphase();

    /**
     * The island manager of this world.
     * @property {IslandManager} islandManager
     */
    this.islandManager = new IslandManager();

    /**
     * Gravity in the world. This is applied on all bodies in the beginning of each step().
     *
     * @property gravity
     * @type {Array}
     */
    this.gravity = vec2.fromValues(0, -9.78);
    if(options.gravity){
        vec2.copy(this.gravity, options.gravity);
    }

    /**
     * Gravity to use when approximating the friction max force (mu*mass*gravity).
     * @property {Number} frictionGravity
     */
    this.frictionGravity = vec2.length(this.gravity) || 10;

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
    this.broadphase = options.broadphase || new SAPBroadphase();
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
    this.defaultMaterial = new Material();

    /**
     * The default contact material to use, if no contact material was set for the colliding materials.
     * @property {ContactMaterial} defaultContactMaterial
     */
    this.defaultContactMaterial = new ContactMaterial(this.defaultMaterial,this.defaultMaterial);

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
    this.overlapKeeper = new OverlapKeeper();
}
World.prototype = new Object(EventEmitter.prototype);
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
        Utils$1.splice(this.contactMaterials,idx,1);
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
        Utils$1.splice(this.constraints,idx,1);
    }
};

vec2.create();
    vec2.create();
    vec2.create();
    vec2.create();
    vec2.create();
    vec2.create();
    var step_mg = vec2.create(),
    xiw = vec2.fromValues(0,0),
    xjw = vec2.fromValues(0,0);
    vec2.fromValues(0,0);
    vec2.fromValues(0,0);

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
            vec2.lerp(b.interpolatedPosition, b.previousPosition, b.position, t);
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
        mg = step_mg;
        vec2.scale;
        var add = vec2.add;
        vec2.rotate;
        var islandManager = this.islandManager;

    this.overlapKeeper.tick();

    this.lastTimeStep = dt;

    // Update approximate friction gravity.
    if(this.useWorldGravityAsFrictionGravity){
        var gravityLen = vec2.length(this.gravity);
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
            if(b.type !== Body.DYNAMIC || b.sleepState === Body.SLEEPING){
                continue;
            }
            vec2.scale(mg,g,b.mass*b.gravityScale); // F=m*g
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
            if(b.type === Body.DYNAMIC){
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
            Utils$1.appendArray(islandManager.equations, np.contactEquations);
            Utils$1.appendArray(islandManager.equations, np.frictionEquations);
            for(i=0; i!==Nconstraints; i++){
                Utils$1.appendArray(islandManager.equations, constraints[i].equations);
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
    vec2.rotate(xiw, xi, bi.angle);
    vec2.rotate(xjw, xj, bj.angle);
    vec2.add(xiw, xiw, bi.position);
    vec2.add(xjw, xjw, bj.position);
    var aiw = ai + bi.angle;
    var ajw = aj + bj.angle;

    np.enableFriction = cm.friction > 0;
    np.frictionCoefficient = cm.friction;
    var reducedMass;
    if(bi.type === Body.STATIC || bi.type === Body.KINEMATIC){
        reducedMass = bj.mass;
    } else if(bj.type === Body.STATIC || bj.type === Body.KINEMATIC){
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
                bi.type === Body.DYNAMIC &&
                bi.sleepState  === Body.SLEEPING &&
                bj.sleepState  === Body.AWAKE &&
                bj.type !== Body.STATIC
            ){
                var speedSquaredB = vec2.squaredLength(bj.velocity) + Math.pow(bj.angularVelocity,2);
                var speedLimitSquaredB = Math.pow(bj.sleepSpeedLimit,2);
                if(speedSquaredB >= speedLimitSquaredB*2){
                    bi._wakeUpAfterNarrowphase = true;
                }
            }

            if( bj.allowSleep &&
                bj.type === Body.DYNAMIC &&
                bj.sleepState  === Body.SLEEPING &&
                bi.sleepState  === Body.AWAKE &&
                bi.type !== Body.STATIC
            ){
                var speedSquaredA = vec2.squaredLength(bi.velocity) + Math.pow(bi.angularVelocity,2);
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
        Utils$1.splice(this.springs,idx,1);
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
            Utils$1.splice(this.bodies,idx,1);
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

var hitTest_tmp1 = vec2.create();
    vec2.fromValues(0,0);
    var hitTest_tmp2 = vec2.fromValues(0,0);

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
    var pb = new Body({ position:worldPoint }),
        ps = new Particle(),
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
            vec2.rotate(x, s.position, b.angle);
            vec2.add(x, x, b.position);
            var a = s.angle + b.angle;

            if( (s instanceof Circle    && n.circleParticle  (b,s,x,a,     pb,ps,px,pa, true)) ||
                (s instanceof Convex    && n.particleConvex  (pb,ps,px,pa, b,s,x,a,     true)) ||
                (s instanceof Plane     && n.particlePlane   (pb,ps,px,pa, b,s,x,a,     true)) ||
                (s instanceof Capsule   && n.particleCapsule (pb,ps,px,pa, b,s,x,a,     true)) ||
                (s instanceof Particle  && vec2.squaredLength(vec2.sub(tmp,x,worldPoint)) < precision*precision)
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

var tmpAABB = new AABB();
var tmpArray = [];

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
    this.broadphase.aabbQuery(this, tmpAABB, tmpArray);
    ray.intersectBodies(result, tmpArray);
    tmpArray.length = 0;

    return result.hasHit();
};

// Export p2 classes
p2.exports = {
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
    Line :                          Line_1,
    LockConstraint :                LockConstraint_1,
    Material :                      Material_1,
    Narrowphase :                   Narrowphase_1,
    NaiveBroadphase :               NaiveBroadphase_1,
    Particle :                      Particle_1,
    Plane :                         Plane_1,
    Pool :                          Pool_1,
    RevoluteConstraint :            RevoluteConstraint_1,
    PrismaticConstraint :           PrismaticConstraint_1,
    Ray :                           requireRay(),
    RaycastResult :                 requireRaycastResult(),
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
    vec2 :                          vec2Exports,
    version :                       require$$43.version,
};

var p2Exports = p2.exports;
var P2 = /*@__PURE__*/getDefaultExportFromCjs(p2Exports);

class P2PhysicsEngine extends PhysicsEngine {
    constructor(options) {
        super(options);
        this.p2PhysicsEngineOptions = options;
        this.p2PhysicsEngineOptions.dt = this.p2PhysicsEngineOptions.dt || (1 / 60);
        this.world = new P2.World({ gravity: [0, 0] });
    }
    step(dt, objectFilter) {
        this.world.step(dt || this.p2PhysicsEngineOptions.dt);
    }
    addCircle(circleOptions, bodyOptions) {
        let body = new P2.Body(bodyOptions);
        body.addShape(new P2.Circle(circleOptions));
        this.world.addBody(body);
        return body;
    }
    addBox(width, height, mass) {
        let body = new P2.Body({ mass, position: [0, 0] });
        body.addShape(new P2.Box({ width, height }));
        this.world.addBody(body);
        return body;
    }
    removeObject(obj) {
        this.world.removeBody(obj);
    }
}

class Utils {
    static hashStr(str, bits = 8) {
        let hash = 5381;
        let i = str.length;
        while (i) {
            hash = (hash * 33) ^ str.charCodeAt(--i);
        }
        hash = hash >>> 0;
        hash = hash % (Math.pow(2, bits) - 1);
        return hash;
    }
    static arrayBuffersEqual(buf1, buf2) {
        if (buf1.byteLength !== buf2.byteLength)
            return false;
        let dv1 = new Int8Array(buf1);
        let dv2 = new Int8Array(buf2);
        for (let i = 0; i !== buf1.byteLength; i++) {
            if (dv1[i] !== dv2[i])
                return false;
        }
        return true;
    }
    static httpGetPromise(url) {
        return new Promise((resolve, reject) => {
            let req = new XMLHttpRequest();
            req.open('GET', url, true);
            req.onload = () => {
                if (req.status >= 200 && req.status < 400)
                    resolve(JSON.parse(req.responseText));
                else
                    reject();
            };
            req.onerror = () => { };
            req.send();
        });
    }
}

var BaseTypes;
(function (BaseTypes) {
    BaseTypes["Float32"] = "FLOAT32";
    BaseTypes["Int32"] = "INT32";
    BaseTypes["Int16"] = "INT16";
    BaseTypes["Int8"] = "INT8";
    BaseTypes["UInt8"] = "UINT8";
    BaseTypes["String"] = "STRING";
    BaseTypes["ClassInstance"] = "CLASSINSTANCE";
    BaseTypes["List"] = "List";
})(BaseTypes || (BaseTypes = {}));
var BaseTypes$1 = BaseTypes;

class Serializable {
    constructor() { }
    netScheme() {
        return {};
    }
    serialize(serializer, options) {
        options = Object.assign({
            bufferOffset: 0
        }, options);
        let netScheme;
        let dataBuffer;
        let dataView;
        let classId = 0;
        let bufferOffset = options.bufferOffset;
        let localBufferOffset = 0;
        if (this.classId) {
            classId = this.classId;
        }
        else {
            classId = Utils.hashStr(this.constructor.name);
        }
        netScheme = this.netScheme();
        if (options.dataBuffer == null && options.dry != true) {
            let bufferSize = this.serialize(serializer, { dry: true, dataBuffer: null, bufferOffset: 0 }).bufferOffset;
            dataBuffer = new ArrayBuffer(bufferSize);
        }
        else {
            dataBuffer = options.dataBuffer;
        }
        if (options.dry != true) {
            dataView = new DataView(dataBuffer);
            dataView.setUint8(bufferOffset + localBufferOffset, classId);
        }
        localBufferOffset += Uint8Array.BYTES_PER_ELEMENT;
        if (netScheme) {
            for (let property of Object.keys(netScheme).sort()) {
                if (options.dry != true) {
                    serializer.writeDataView(dataView, this[property], bufferOffset + localBufferOffset, netScheme[property]);
                }
                if (netScheme[property].type === BaseTypes$1.String) {
                    localBufferOffset += Uint16Array.BYTES_PER_ELEMENT;
                    if (this[property] !== null && this[property] !== undefined)
                        localBufferOffset += this[property].length * Uint16Array.BYTES_PER_ELEMENT;
                }
                else if (netScheme[property].type === BaseTypes$1.ClassInstance) {
                    let objectInstanceBufferOffset = this[property].serialize(serializer, { dry: true }).bufferOffset;
                    localBufferOffset += objectInstanceBufferOffset;
                }
                else if (netScheme[property].type === BaseTypes$1.List) {
                    localBufferOffset += Uint16Array.BYTES_PER_ELEMENT;
                    for (let item of this[property]) {
                        if (netScheme[property].itemType === BaseTypes$1.ClassInstance) {
                            let listBufferOffset = item.serialize(serializer, { dry: true }).bufferOffset;
                            localBufferOffset += listBufferOffset;
                        }
                        else if (netScheme[property].itemType === BaseTypes$1.String) {
                            localBufferOffset += Uint16Array.BYTES_PER_ELEMENT * (1 + item.length);
                        }
                        else {
                            localBufferOffset += serializer.getTypeByteSize(netScheme[property].itemType);
                        }
                    }
                }
                else {
                    localBufferOffset += serializer.getTypeByteSize(netScheme[property].type);
                }
            }
        }
        return { dataBuffer, bufferOffset: localBufferOffset };
    }
    prunedStringsClone(serializer, prevObject) {
        if (!prevObject)
            return this;
        prevObject = serializer.deserialize(prevObject).obj;
        let netScheme = this.netScheme();
        let isString = p => netScheme[p].type === BaseTypes$1.String;
        let hasChanged = p => prevObject[p] !== this[p];
        let changedStrings = Object.keys(netScheme).filter(isString).filter(hasChanged);
        if (changedStrings.length == 0)
            return this;
        let objectClass = serializer.registeredClasses[this.classId];
        let prunedCopy = new objectClass(null, { id: null });
        for (let p of Object.keys(netScheme))
            prunedCopy[p] = changedStrings.indexOf(p) < 0 ? this[p] : null;
        return prunedCopy;
    }
    syncTo(other) {
        let netScheme = this.netScheme();
        for (let p of Object.keys(netScheme)) {
            if (netScheme[p].type === BaseTypes$1.List || netScheme[p].type === BaseTypes$1.ClassInstance)
                continue;
            if (netScheme[p].type === BaseTypes$1.String) {
                if (typeof other[p] === 'string')
                    this[p] = other[p];
                continue;
            }
            this[p] = other[p];
        }
    }
}

class TwoVector extends Serializable {
    netScheme() {
        return {
            x: { type: BaseTypes$1.Float32 },
            y: { type: BaseTypes$1.Float32 }
        };
    }
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        return this;
    }
    toString() {
        function round3(x) { return Math.round(x * 1000) / 1000; }
        return `[${round3(this.x)}, ${round3(this.y)}]`;
    }
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
    multiplyScalar(s) {
        this.x *= s;
        this.y *= s;
        return this;
    }
    add(other) {
        this.x += other.x;
        this.y += other.y;
        return this;
    }
    subtract(other) {
        this.x -= other.x;
        this.y -= other.y;
        return this;
    }
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    normalize() {
        this.multiplyScalar(1 / this.length());
        return this;
    }
    copy(sourceObj) {
        this.x = sourceObj.x;
        this.y = sourceObj.y;
        return this;
    }
    clone() {
        return new TwoVector(this.x, this.y);
    }
    lerp(target, p) {
        this.x += (target.x - this.x) * p;
        this.y += (target.y - this.y) * p;
        return this;
    }
    getBendingDelta(target, options) {
        let increment = target.clone();
        increment.subtract(this);
        increment.multiplyScalar(options.percent);
        if (((typeof options.max === 'number') && increment.length() > options.max) ||
            ((typeof options.min === 'number') && increment.length() < options.min)) {
            return new TwoVector(0, 0);
        }
        increment.multiplyScalar(1 / options.increments);
        return increment;
    }
}

function update_RECOMPUTE() {
    var i, obj, grid, meta, objAABB, newObjHash;
    for (i = 0; i < this._globalObjects.length; i++) {
        obj = this._globalObjects[i];
        meta = obj.HSHG;
        grid = meta.grid;
        objAABB = obj.getAABB();
        newObjHash = grid.toHash(objAABB.min[0], objAABB.min[1]);
        if (newObjHash !== meta.hash) {
            grid.removeObject(obj);
            grid.addObject(obj, newObjHash);
        }
    }
}
function update_REMOVEALL() {
}
function testAABBOverlap(objA, objB) {
    var a = objA.getAABB(), b = objB.getAABB();
    if (a.min[0] > b.max[0] || a.min[1] > b.max[1] ||
        a.max[0] < b.min[0] || a.max[1] < b.min[1]) {
        return false;
    }
    return true;
}
function getLongestAABBEdge(min, max) {
    return Math.max(Math.abs(max[0] - min[0]), Math.abs(max[1] - min[1]));
}
function HSHG() {
    this.MAX_OBJECT_CELL_DENSITY = 1 / 8;
    this.INITIAL_GRID_LENGTH = 256;
    this.HIERARCHY_FACTOR = 2;
    this.HIERARCHY_FACTOR_SQRT = Math.SQRT2;
    this.UPDATE_METHOD = update_RECOMPUTE;
    this._grids = [];
    this._globalObjects = [];
}
HSHG.prototype.addObject = function (obj) {
    var x, i, cellSize, objAABB = obj.getAABB(), objSize = getLongestAABBEdge(objAABB.min, objAABB.max), oneGrid, newGrid;
    obj.HSHG = {
        globalObjectsIndex: this._globalObjects.length
    };
    this._globalObjects.push(obj);
    if (this._grids.length == 0) {
        cellSize = objSize * this.HIERARCHY_FACTOR_SQRT;
        newGrid = new Grid(cellSize, this.INITIAL_GRID_LENGTH, this);
        newGrid.initCells();
        newGrid.addObject(obj);
        this._grids.push(newGrid);
    }
    else {
        x = 0;
        for (i = 0; i < this._grids.length; i++) {
            oneGrid = this._grids[i];
            x = oneGrid.cellSize;
            if (objSize < x) {
                x /= this.HIERARCHY_FACTOR;
                if (objSize < x) {
                    while (objSize < x) {
                        x /= this.HIERARCHY_FACTOR;
                    }
                    newGrid = new Grid(x * this.HIERARCHY_FACTOR, this.INITIAL_GRID_LENGTH, this);
                    newGrid.initCells();
                    newGrid.addObject(obj);
                    this._grids.splice(i, 0, newGrid);
                }
                else {
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
        newGrid.addObject(obj);
        this._grids.push(newGrid);
    }
};
HSHG.prototype.removeObject = function (obj) {
    var meta = obj.HSHG, globalObjectsIndex, replacementObj;
    if (meta === undefined) {
        throw Error(obj + ' was not in the HSHG.');
    }
    globalObjectsIndex = meta.globalObjectsIndex;
    if (globalObjectsIndex === this._globalObjects.length - 1) {
        this._globalObjects.pop();
    }
    else {
        replacementObj = this._globalObjects.pop();
        replacementObj.HSHG.globalObjectsIndex = globalObjectsIndex;
        this._globalObjects[globalObjectsIndex] = replacementObj;
    }
    meta.grid.removeObject(obj);
    delete obj.HSHG;
};
HSHG.prototype.update = function () {
    this.UPDATE_METHOD.call(this);
};
HSHG.prototype.queryForCollisionPairs = function (broadOverlapTestCallback) {
    var i, j, k, l, c, grid, cell, objA, objB, offset, adjacentCell, biggerGrid, objAAABB, objAHashInBiggerGrid, possibleCollisions = [];
    let broadOverlapTest = broadOverlapTestCallback || testAABBOverlap;
    for (i = 0; i < this._grids.length; i++) {
        grid = this._grids[i];
        for (j = 0; j < grid.occupiedCells.length; j++) {
            cell = grid.occupiedCells[j];
            for (k = 0; k < cell.objectContainer.length; k++) {
                objA = cell.objectContainer[k];
                for (l = k + 1; l < cell.objectContainer.length; l++) {
                    objB = cell.objectContainer[l];
                    if (broadOverlapTest(objA, objB) === true) {
                        possibleCollisions.push([objA, objB]);
                    }
                }
            }
            for (c = 0; c < 4; c++) {
                offset = cell.neighborOffsetArray[c];
                adjacentCell = grid.allCells[cell.allCellsIndex + offset];
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
        for (j = 0; j < grid.allObjects.length; j++) {
            objA = grid.allObjects[j];
            objAAABB = objA.getAABB();
            for (k = i + 1; k < this._grids.length; k++) {
                biggerGrid = this._grids[k];
                objAHashInBiggerGrid = biggerGrid.toHash(objAAABB.min[0], objAAABB.min[1]);
                cell = biggerGrid.allCells[objAHashInBiggerGrid];
                for (c = 0; c < cell.neighborOffsetArray.length; c++) {
                    offset = cell.neighborOffsetArray[c];
                    adjacentCell = biggerGrid.allCells[cell.allCellsIndex + offset];
                    for (l = 0; l < adjacentCell.objectContainer.length; l++) {
                        objB = adjacentCell.objectContainer[l];
                        if (broadOverlapTest(objA, objB) === true) {
                            possibleCollisions.push([objA, objB]);
                        }
                    }
                }
            }
        }
    }
    return possibleCollisions;
};
HSHG.update_RECOMPUTE = update_RECOMPUTE;
HSHG.update_REMOVEALL = update_REMOVEALL;
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
    var i, gridLength = this.allCells.length, x, y, wh = this.rowColumnCount, isOnRightEdge, isOnLeftEdge, isOnTopEdge, isOnBottomEdge, innerOffsets = [
        wh - 1, wh, wh + 1,
        -1, 0, 1,
        -1 + -wh, -wh, -wh + 1
    ], leftOffset, rightOffset, topOffset, bottomOffset, uniqueOffsets = [], cell;
    this.sharedInnerOffsets = innerOffsets;
    for (i = 0; i < gridLength; i++) {
        cell = new Cell();
        y = ~~(i / this.rowColumnCount);
        x = ~~(i - (y * this.rowColumnCount));
        isOnRightEdge = false;
        isOnLeftEdge = false;
        isOnTopEdge = false;
        isOnBottomEdge = false;
        if ((x + 1) % this.rowColumnCount == 0) {
            isOnRightEdge = true;
        }
        else if (x % this.rowColumnCount == 0) {
            isOnLeftEdge = true;
        }
        if ((y + 1) % this.rowColumnCount == 0) {
            isOnTopEdge = true;
        }
        else if (y % this.rowColumnCount == 0) {
            isOnBottomEdge = true;
        }
        if (isOnRightEdge || isOnLeftEdge || isOnTopEdge || isOnBottomEdge) {
            rightOffset = isOnRightEdge === true ? -wh + 1 : 1;
            leftOffset = isOnLeftEdge === true ? wh - 1 : -1;
            topOffset = isOnTopEdge === true ? -gridLength + wh : wh;
            bottomOffset = isOnBottomEdge === true ? gridLength - wh : -wh;
            uniqueOffsets = [
                leftOffset + topOffset, topOffset, rightOffset + topOffset,
                leftOffset, 0, rightOffset,
                leftOffset + bottomOffset, bottomOffset, rightOffset + bottomOffset
            ];
            cell.neighborOffsetArray = uniqueOffsets;
        }
        else {
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
    }
    else {
        i = x * this.inverseCellSize;
        xHash = ~~i & this.xyHashMask;
    }
    if (y < 0) {
        i = (-y) * this.inverseCellSize;
        yHash = this.rowColumnCount - 1 - (~~i & this.xyHashMask);
    }
    else {
        i = y * this.inverseCellSize;
        yHash = ~~i & this.xyHashMask;
    }
    return xHash + yHash * this.rowColumnCount;
};
Grid.prototype.addObject = function (obj, hash) {
    var objAABB, objHash, targetCell;
    if (hash !== undefined) {
        objHash = hash;
    }
    else {
        objAABB = obj.getAABB();
        objHash = this.toHash(objAABB.min[0], objAABB.min[1]);
    }
    targetCell = this.allCells[objHash];
    if (targetCell.objectContainer.length === 0) {
        targetCell.occupiedCellsIndex = this.occupiedCells.length;
        this.occupiedCells.push(targetCell);
    }
    obj.HSHG.objectContainerIndex = targetCell.objectContainer.length;
    obj.HSHG.hash = objHash;
    obj.HSHG.grid = this;
    obj.HSHG.allGridObjectsIndex = this.allObjects.length;
    targetCell.objectContainer.push(obj);
    this.allObjects.push(obj);
    if (this.allObjects.length / this.allCells.length > this._parentHierarchy.MAX_OBJECT_CELL_DENSITY) {
        this.expandGrid();
    }
};
Grid.prototype.removeObject = function (obj) {
    var meta = obj.HSHG, hash, containerIndex, allGridObjectsIndex, cell, replacementCell, replacementObj;
    hash = meta.hash;
    containerIndex = meta.objectContainerIndex;
    allGridObjectsIndex = meta.allGridObjectsIndex;
    cell = this.allCells[hash];
    if (cell.objectContainer.length === 1) {
        cell.objectContainer.length = 0;
        if (cell.occupiedCellsIndex === this.occupiedCells.length - 1) {
            this.occupiedCells.pop();
        }
        else {
            replacementCell = this.occupiedCells.pop();
            replacementCell.occupiedCellsIndex = cell.occupiedCellsIndex;
            this.occupiedCells[cell.occupiedCellsIndex] = replacementCell;
        }
        cell.occupiedCellsIndex = null;
    }
    else {
        if (containerIndex === cell.objectContainer.length - 1) {
            cell.objectContainer.pop();
        }
        else {
            replacementObj = cell.objectContainer.pop();
            replacementObj.HSHG.objectContainerIndex = containerIndex;
            cell.objectContainer[containerIndex] = replacementObj;
        }
    }
    if (allGridObjectsIndex === this.allObjects.length - 1) {
        this.allObjects.pop();
    }
    else {
        replacementObj = this.allObjects.pop();
        replacementObj.HSHG.allGridObjectsIndex = allGridObjectsIndex;
        this.allObjects[allGridObjectsIndex] = replacementObj;
    }
};
Grid.prototype.expandGrid = function () {
    var i, currentCellCount = this.allCells.length; this.rowColumnCount; this.xyHashMask; var newCellCount = currentCellCount * 4, newRowColumnCount = ~~Math.sqrt(newCellCount), newXYHashMask = newRowColumnCount - 1, allObjects = this.allObjects.slice(0);
    for (i = 0; i < allObjects.length; i++) {
        this.removeObject(allObjects[i]);
    }
    this.rowColumnCount = newRowColumnCount;
    this.allCells = Array(this.rowColumnCount * this.rowColumnCount);
    this.xyHashMask = newXYHashMask;
    this.initCells();
    for (i = 0; i < allObjects.length; i++) {
        this.addObject(allObjects[i]);
    }
};
function Cell() {
    this.objectContainer = [];
    this.neighborOffsetArray;
    this.occupiedCellsIndex = null;
    this.allCellsIndex = null;
}
HSHG._private = {
    Grid: Grid,
    Cell: Cell,
    testAABBOverlap: testAABBOverlap,
    getLongestAABBEdge: getLongestAABBEdge
};
class HSHGDetector {
    constructor() {
        this.hshg = new HSHG();
    }
    addObject(o) {
        this.hshg.addObject(o);
    }
    removeObject(o) {
        this.hshg.removeObject(o);
    }
    update() {
        this.hshg.update();
    }
    queryForCollisionPairs() {
        return this.hshg.queryForCollisionPairs();
    }
}

class HSHGCollisionDetection {
    constructor(options) {
        this.options = Object.assign({ COLLISION_DISTANCE: 28 }, options);
    }
    init(options) {
        this.gameEngine = options.gameEngine;
        this.grid = new HSHGDetector();
        this.previousCollisionPairs = {};
        this.stepCollidingPairs = {};
        this.gameEngine.on('objectAdded', obj => {
            this.grid.addObject(obj);
        });
        this.gameEngine.on('objectDestroyed', obj => {
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
            if (pairId in this.stepCollidingPairs === false) {
                this.gameEngine.emit('collisionStop', pairObj);
            }
        }
        for (let pairId of Object.keys(this.stepCollidingPairs)) {
            let pairObj = this.stepCollidingPairs[pairId];
            if (pairId in this.previousCollisionPairs === false) {
                this.gameEngine.emit('collisionStart', pairObj);
            }
        }
        this.previousCollisionPairs = this.stepCollidingPairs;
    }
    areObjectsColliding(o1, o2) {
        return getArrayPairId([o1, o2]) in this.stepCollidingPairs;
    }
}
function getArrayPairId(arrayPair) {
    let sortedArrayPair = arrayPair.slice(0).sort();
    return sortedArrayPair[0].id + '-' + sortedArrayPair[1].id;
}

let differenceVector = new TwoVector(0, 0);
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
        if (o1.isStatic && o2.isStatic)
            return false;
        if (typeof o1.collidesWith === 'function') {
            if (!o1.collidesWith(o2))
                return false;
        }
        if (this.options.collisionDistance) {
            differenceVector.copy(o1.position).subtract(o2.position);
            return differenceVector.length() < this.options.collisionDistance;
        }
        let o1Box = getBox(o1);
        let o2Box = getBox(o2);
        if (o1Box.xMin > o2Box.xMax ||
            o1Box.yMin > o2Box.yMax ||
            o2Box.xMin > o1Box.xMax ||
            o2Box.yMin > o1Box.yMax)
            return false;
        if (!this.options.autoResolve)
            return true;
        let shiftY1 = o2Box.yMax - o1Box.yMin;
        let shiftY2 = o1Box.yMax - o2Box.yMin;
        let shiftX1 = o2Box.xMax - o1Box.xMin;
        let shiftX2 = o1Box.xMax - o2Box.xMin;
        let smallestYShift = Math.min(Math.abs(shiftY1), Math.abs(shiftY2));
        let smallestXShift = Math.min(Math.abs(shiftX1), Math.abs(shiftX2));
        if (smallestYShift < smallestXShift) {
            if (o1Box.yMin > o2Box.yMin && o1Box.yMin < o2Box.yMax) {
                if (o2.isStatic)
                    o1.position.y += shiftY1;
                else if (o1.isStatic)
                    o2.position.y -= shiftY1;
                else {
                    o1.position.y += shiftY1 / 2;
                    o2.position.y -= shiftY1 / 2;
                }
            }
            else if (o1Box.yMax > o2Box.yMin && o1Box.yMax < o2Box.yMax) {
                if (o2.isStatic)
                    o1.position.y -= shiftY2;
                else if (o1.isStatic)
                    o2.position.y += shiftY2;
                else {
                    o1.position.y -= shiftY2 / 2;
                    o2.position.y += shiftY2 / 2;
                }
            }
            o1.velocity.y = 0;
            o2.velocity.y = 0;
        }
        else {
            if (o1Box.xMin > o2Box.xMin && o1Box.xMin < o2Box.xMax) {
                if (o2.isStatic)
                    o1.position.x += shiftX1;
                else if (o1.isStatic)
                    o2.position.x -= shiftX1;
                else {
                    o1.position.x += shiftX1 / 2;
                    o2.position.x -= shiftX1 / 2;
                }
            }
            else if (o1Box.xMax > o2Box.xMin && o1Box.xMax < o2Box.xMax) {
                if (o2.isStatic)
                    o1.position.x -= shiftX2;
                else if (o1.isStatic)
                    o2.position.x += shiftX2;
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
    checkPair(id1, id2) {
        let objects = this.gameEngine.world.objects;
        let o1 = objects[id1];
        let o2 = objects[id2];
        if (!o1 || !o2)
            return;
        let pairId = [id1, id2].join(',');
        if (this.findCollision(o1, o2)) {
            if (!(pairId in this.collisionPairs)) {
                this.collisionPairs[pairId] = true;
                this.gameEngine.emit('collisionStart', { o1, o2 });
            }
        }
        else if (pairId in this.collisionPairs) {
            this.gameEngine.emit('collisionStop', { o1, o2 });
            delete this.collisionPairs[pairId];
        }
    }
    detect() {
        let objects = this.gameEngine.world.objects;
        let keys = Object.keys(objects);
        for (let pairId in this.collisionPairs)
            if (this.collisionPairs.hasOwnProperty(pairId))
                if (keys.indexOf(pairId.split(',')[0]) === -1 || keys.indexOf(pairId.split(',')[1]) === -1)
                    delete this.collisionPairs[pairId];
        for (let k1 of keys)
            for (let k2 of keys)
                if (k2 > k1)
                    this.checkPair(k1, k2);
    }
}
function getBox(o) {
    return {
        xMin: o.position.x,
        xMax: o.position.x + o.width,
        yMin: o.position.y,
        yMax: o.position.y + o.height
    };
}

let dv = new TwoVector(0, 0);
let dx = new TwoVector(0, 0);
class SimplePhysicsEngine extends PhysicsEngine {
    constructor(options) {
        super(options);
        if (options.collisions && options.collisionsType === 'HSHG') {
            this.collisionDetection = new HSHGCollisionDetection(options.collisions);
        }
        else {
            this.collisionDetection = new BruteForceCollisionDetection(options.collisions);
        }
        this.gravity = new TwoVector(0, 0);
        if (options.gravity)
            this.gravity.copy(options.gravity);
        let collisionOptions = Object.assign({ gameEngine: this.gameEngine }, options.collisions);
        this.collisionDetection.init(collisionOptions);
    }
    objectStep(o, dt) {
        if (dt === 0)
            return;
        if (dt)
            dt /= (1 / 60);
        else
            dt = 1;
        let worldSettings = this.gameEngine.worldSettings;
        if (o.isRotatingRight) {
            o.angle += o.rotationSpeed;
        }
        if (o.isRotatingLeft) {
            o.angle -= o.rotationSpeed;
        }
        if (o.angle >= 360) {
            o.angle -= 360;
        }
        if (o.angle < 0) {
            o.angle += 360;
        }
        if (o.isAccelerating) {
            let rad = o.angle * (Math.PI / 180);
            dv.set(Math.cos(rad), Math.sin(rad)).multiplyScalar(o.acceleration).multiplyScalar(dt);
            o.velocity.add(dv);
        }
        if (!o.isStatic)
            o.velocity.add(this.gravity);
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
        if (worldSettings.worldWrap) {
            if (o.position.x >= worldSettings.width) {
                o.position.x -= worldSettings.width;
            }
            if (o.position.y >= worldSettings.height) {
                o.position.y -= worldSettings.height;
            }
            if (o.position.x < 0) {
                o.position.x += worldSettings.width;
            }
            if (o.position.y < 0) {
                o.position.y += worldSettings.height;
            }
        }
    }
    step(dt, objectFilter) {
        let objects = this.gameEngine.world.objects;
        for (let objId of Object.keys(objects)) {
            let ob = objects[objId];
            if (!objectFilter(ob))
                continue;
            this.objectStep(ob, dt);
        }
        this.collisionDetection.detect();
    }
}

function commonjsRequire(path) {
	throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}

var cannon = {exports: {}};

/*
 * Copyright (c) 2015 cannon.js Authors
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use, copy,
 * modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

(function (module, exports) {
	!function(e){module.exports=e();}(function(){return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof commonjsRequire=="function"&&commonjsRequire;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r);}return n[o].exports}var i=typeof commonjsRequire=="function"&&commonjsRequire;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
	module.exports={
	  "name": "cannon",
	  "version": "0.6.2",
	  "description": "A lightweight 3D physics engine written in JavaScript.",
	  "homepage": "https://github.com/schteppe/cannon.js",
	  "author": "Stefan Hedman <schteppe@gmail.com> (http://steffe.se)",
	  "keywords": [
	    "cannon.js",
	    "cannon",
	    "physics",
	    "engine",
	    "3d"
	  ],
	  "main": "./build/cannon.js",
	  "engines": {
	    "node": "*"
	  },
	  "repository": {
	    "type": "git",
	    "url": "https://github.com/schteppe/cannon.js.git"
	  },
	  "bugs": {
	    "url": "https://github.com/schteppe/cannon.js/issues"
	  },
	  "licenses": [
	    {
	      "type": "MIT"
	    }
	  ],
	  "devDependencies": {
	    "jshint": "latest",
	    "uglify-js": "latest",
	    "nodeunit": "^0.9.0",
	    "grunt": "~0.4.0",
	    "grunt-contrib-jshint": "~0.1.1",
	    "grunt-contrib-nodeunit": "^0.4.1",
	    "grunt-contrib-concat": "~0.1.3",
	    "grunt-contrib-uglify": "^0.5.1",
	    "grunt-browserify": "^2.1.4",
	    "grunt-contrib-yuidoc": "^0.5.2",
	    "browserify": "*"
	  },
	  "dependencies": {}
	};

	},{}],2:[function(_dereq_,module,exports){
	// Export classes
	module.exports = {
	    version :                       _dereq_('../package.json').version,

	    AABB :                          _dereq_('./collision/AABB'),
	    ArrayCollisionMatrix :          _dereq_('./collision/ArrayCollisionMatrix'),
	    Body :                          _dereq_('./objects/Body'),
	    Box :                           _dereq_('./shapes/Box'),
	    Broadphase :                    _dereq_('./collision/Broadphase'),
	    Constraint :                    _dereq_('./constraints/Constraint'),
	    ContactEquation :               _dereq_('./equations/ContactEquation'),
	    Narrowphase :                   _dereq_('./world/Narrowphase'),
	    ConeTwistConstraint :           _dereq_('./constraints/ConeTwistConstraint'),
	    ContactMaterial :               _dereq_('./material/ContactMaterial'),
	    ConvexPolyhedron :              _dereq_('./shapes/ConvexPolyhedron'),
	    Cylinder :                      _dereq_('./shapes/Cylinder'),
	    DistanceConstraint :            _dereq_('./constraints/DistanceConstraint'),
	    Equation :                      _dereq_('./equations/Equation'),
	    EventTarget :                   _dereq_('./utils/EventTarget'),
	    FrictionEquation :              _dereq_('./equations/FrictionEquation'),
	    GSSolver :                      _dereq_('./solver/GSSolver'),
	    GridBroadphase :                _dereq_('./collision/GridBroadphase'),
	    Heightfield :                   _dereq_('./shapes/Heightfield'),
	    HingeConstraint :               _dereq_('./constraints/HingeConstraint'),
	    LockConstraint :                _dereq_('./constraints/LockConstraint'),
	    Mat3 :                          _dereq_('./math/Mat3'),
	    Material :                      _dereq_('./material/Material'),
	    NaiveBroadphase :               _dereq_('./collision/NaiveBroadphase'),
	    ObjectCollisionMatrix :         _dereq_('./collision/ObjectCollisionMatrix'),
	    Pool :                          _dereq_('./utils/Pool'),
	    Particle :                      _dereq_('./shapes/Particle'),
	    Plane :                         _dereq_('./shapes/Plane'),
	    PointToPointConstraint :        _dereq_('./constraints/PointToPointConstraint'),
	    Quaternion :                    _dereq_('./math/Quaternion'),
	    Ray :                           _dereq_('./collision/Ray'),
	    RaycastVehicle :                _dereq_('./objects/RaycastVehicle'),
	    RaycastResult :                 _dereq_('./collision/RaycastResult'),
	    RigidVehicle :                  _dereq_('./objects/RigidVehicle'),
	    RotationalEquation :            _dereq_('./equations/RotationalEquation'),
	    RotationalMotorEquation :       _dereq_('./equations/RotationalMotorEquation'),
	    SAPBroadphase :                 _dereq_('./collision/SAPBroadphase'),
	    SPHSystem :                     _dereq_('./objects/SPHSystem'),
	    Shape :                         _dereq_('./shapes/Shape'),
	    Solver :                        _dereq_('./solver/Solver'),
	    Sphere :                        _dereq_('./shapes/Sphere'),
	    SplitSolver :                   _dereq_('./solver/SplitSolver'),
	    Spring :                        _dereq_('./objects/Spring'),
	    Trimesh :                       _dereq_('./shapes/Trimesh'),
	    Vec3 :                          _dereq_('./math/Vec3'),
	    Vec3Pool :                      _dereq_('./utils/Vec3Pool'),
	    World :                         _dereq_('./world/World'),
	};

	},{"../package.json":1,"./collision/AABB":3,"./collision/ArrayCollisionMatrix":4,"./collision/Broadphase":5,"./collision/GridBroadphase":6,"./collision/NaiveBroadphase":7,"./collision/ObjectCollisionMatrix":8,"./collision/Ray":9,"./collision/RaycastResult":10,"./collision/SAPBroadphase":11,"./constraints/ConeTwistConstraint":12,"./constraints/Constraint":13,"./constraints/DistanceConstraint":14,"./constraints/HingeConstraint":15,"./constraints/LockConstraint":16,"./constraints/PointToPointConstraint":17,"./equations/ContactEquation":19,"./equations/Equation":20,"./equations/FrictionEquation":21,"./equations/RotationalEquation":22,"./equations/RotationalMotorEquation":23,"./material/ContactMaterial":24,"./material/Material":25,"./math/Mat3":27,"./math/Quaternion":28,"./math/Vec3":30,"./objects/Body":31,"./objects/RaycastVehicle":32,"./objects/RigidVehicle":33,"./objects/SPHSystem":34,"./objects/Spring":35,"./shapes/Box":37,"./shapes/ConvexPolyhedron":38,"./shapes/Cylinder":39,"./shapes/Heightfield":40,"./shapes/Particle":41,"./shapes/Plane":42,"./shapes/Shape":43,"./shapes/Sphere":44,"./shapes/Trimesh":45,"./solver/GSSolver":46,"./solver/Solver":47,"./solver/SplitSolver":48,"./utils/EventTarget":49,"./utils/Pool":51,"./utils/Vec3Pool":54,"./world/Narrowphase":55,"./world/World":56}],3:[function(_dereq_,module,exports){
	var Vec3 = _dereq_('../math/Vec3');
	_dereq_('../utils/Utils');

	module.exports = AABB;

	/**
	 * Axis aligned bounding box class.
	 * @class AABB
	 * @constructor
	 * @param {Object} [options]
	 * @param {Vec3}   [options.upperBound]
	 * @param {Vec3}   [options.lowerBound]
	 */
	function AABB(options){
	    options = options || {};

	    /**
	     * The lower bound of the bounding box.
	     * @property lowerBound
	     * @type {Vec3}
	     */
	    this.lowerBound = new Vec3();
	    if(options.lowerBound){
	        this.lowerBound.copy(options.lowerBound);
	    }

	    /**
	     * The upper bound of the bounding box.
	     * @property upperBound
	     * @type {Vec3}
	     */
	    this.upperBound = new Vec3();
	    if(options.upperBound){
	        this.upperBound.copy(options.upperBound);
	    }
	}

	var tmp = new Vec3();

	/**
	 * Set the AABB bounds from a set of points.
	 * @method setFromPoints
	 * @param {Array} points An array of Vec3's.
	 * @param {Vec3} position
	 * @param {Quaternion} quaternion
	 * @param {number} skinSize
	 * @return {AABB} The self object
	 */
	AABB.prototype.setFromPoints = function(points, position, quaternion, skinSize){
	    var l = this.lowerBound,
	        u = this.upperBound,
	        q = quaternion;

	    // Set to the first point
	    l.copy(points[0]);
	    if(q){
	        q.vmult(l, l);
	    }
	    u.copy(l);

	    for(var i = 1; i<points.length; i++){
	        var p = points[i];

	        if(q){
	            q.vmult(p, tmp);
	            p = tmp;
	        }

	        if(p.x > u.x){ u.x = p.x; }
	        if(p.x < l.x){ l.x = p.x; }
	        if(p.y > u.y){ u.y = p.y; }
	        if(p.y < l.y){ l.y = p.y; }
	        if(p.z > u.z){ u.z = p.z; }
	        if(p.z < l.z){ l.z = p.z; }
	    }

	    // Add offset
	    if (position) {
	        position.vadd(l, l);
	        position.vadd(u, u);
	    }

	    if(skinSize){
	        l.x -= skinSize;
	        l.y -= skinSize;
	        l.z -= skinSize;
	        u.x += skinSize;
	        u.y += skinSize;
	        u.z += skinSize;
	    }

	    return this;
	};

	/**
	 * Copy bounds from an AABB to this AABB
	 * @method copy
	 * @param  {AABB} aabb Source to copy from
	 * @return {AABB} The this object, for chainability
	 */
	AABB.prototype.copy = function(aabb){
	    this.lowerBound.copy(aabb.lowerBound);
	    this.upperBound.copy(aabb.upperBound);
	    return this;
	};

	/**
	 * Clone an AABB
	 * @method clone
	 */
	AABB.prototype.clone = function(){
	    return new AABB().copy(this);
	};

	/**
	 * Extend this AABB so that it covers the given AABB too.
	 * @method extend
	 * @param  {AABB} aabb
	 */
	AABB.prototype.extend = function(aabb){
	    // Extend lower bound
	    var l = aabb.lowerBound.x;
	    if(this.lowerBound.x > l){
	        this.lowerBound.x = l;
	    }

	    // Upper
	    var u = aabb.upperBound.x;
	    if(this.upperBound.x < u){
	        this.upperBound.x = u;
	    }

	    // Extend lower bound
	    var l = aabb.lowerBound.y;
	    if(this.lowerBound.y > l){
	        this.lowerBound.y = l;
	    }

	    // Upper
	    var u = aabb.upperBound.y;
	    if(this.upperBound.y < u){
	        this.upperBound.y = u;
	    }

	    // Extend lower bound
	    var l = aabb.lowerBound.z;
	    if(this.lowerBound.z > l){
	        this.lowerBound.z = l;
	    }

	    // Upper
	    var u = aabb.upperBound.z;
	    if(this.upperBound.z < u){
	        this.upperBound.z = u;
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

	    return ((l2.x <= u1.x && u1.x <= u2.x) || (l1.x <= u2.x && u2.x <= u1.x)) &&
	           ((l2.y <= u1.y && u1.y <= u2.y) || (l1.y <= u2.y && u2.y <= u1.y)) &&
	           ((l2.z <= u1.z && u1.z <= u2.z) || (l1.z <= u2.z && u2.z <= u1.z));
	};

	/**
	 * Returns true if the given AABB is fully contained in this AABB.
	 * @method contains
	 * @param {AABB} aabb
	 * @return {Boolean}
	 */
	AABB.prototype.contains = function(aabb){
	    var l1 = this.lowerBound,
	        u1 = this.upperBound,
	        l2 = aabb.lowerBound,
	        u2 = aabb.upperBound;

	    //      l2        u2
	    //      |---------|
	    // |---------------|
	    // l1              u1

	    return (
	        (l1.x <= l2.x && u1.x >= u2.x) &&
	        (l1.y <= l2.y && u1.y >= u2.y) &&
	        (l1.z <= l2.z && u1.z >= u2.z)
	    );
	};

	/**
	 * @method getCorners
	 * @param {Vec3} a
	 * @param {Vec3} b
	 * @param {Vec3} c
	 * @param {Vec3} d
	 * @param {Vec3} e
	 * @param {Vec3} f
	 * @param {Vec3} g
	 * @param {Vec3} h
	 */
	AABB.prototype.getCorners = function(a, b, c, d, e, f, g, h){
	    var l = this.lowerBound,
	        u = this.upperBound;

	    a.copy(l);
	    b.set( u.x, l.y, l.z );
	    c.set( u.x, u.y, l.z );
	    d.set( l.x, u.y, u.z );
	    e.set( u.x, l.y, l.z );
	    f.set( l.x, u.y, l.z );
	    g.set( l.x, l.y, u.z );
	    h.copy(u);
	};

	var transformIntoFrame_corners = [
	    new Vec3(),
	    new Vec3(),
	    new Vec3(),
	    new Vec3(),
	    new Vec3(),
	    new Vec3(),
	    new Vec3(),
	    new Vec3()
	];

	/**
	 * Get the representation of an AABB in another frame.
	 * @method toLocalFrame
	 * @param  {Transform} frame
	 * @param  {AABB} target
	 * @return {AABB} The "target" AABB object.
	 */
	AABB.prototype.toLocalFrame = function(frame, target){

	    var corners = transformIntoFrame_corners;
	    var a = corners[0];
	    var b = corners[1];
	    var c = corners[2];
	    var d = corners[3];
	    var e = corners[4];
	    var f = corners[5];
	    var g = corners[6];
	    var h = corners[7];

	    // Get corners in current frame
	    this.getCorners(a, b, c, d, e, f, g, h);

	    // Transform them to new local frame
	    for(var i=0; i !== 8; i++){
	        var corner = corners[i];
	        frame.pointToLocal(corner, corner);
	    }

	    return target.setFromPoints(corners);
	};

	/**
	 * Get the representation of an AABB in the global frame.
	 * @method toWorldFrame
	 * @param  {Transform} frame
	 * @param  {AABB} target
	 * @return {AABB} The "target" AABB object.
	 */
	AABB.prototype.toWorldFrame = function(frame, target){

	    var corners = transformIntoFrame_corners;
	    var a = corners[0];
	    var b = corners[1];
	    var c = corners[2];
	    var d = corners[3];
	    var e = corners[4];
	    var f = corners[5];
	    var g = corners[6];
	    var h = corners[7];

	    // Get corners in current frame
	    this.getCorners(a, b, c, d, e, f, g, h);

	    // Transform them to new local frame
	    for(var i=0; i !== 8; i++){
	        var corner = corners[i];
	        frame.pointToWorld(corner, corner);
	    }

	    return target.setFromPoints(corners);
	};

	},{"../math/Vec3":30,"../utils/Utils":53}],4:[function(_dereq_,module,exports){
	module.exports = ArrayCollisionMatrix;

	/**
	 * Collision "matrix". It's actually a triangular-shaped array of whether two bodies are touching this step, for reference next step
	 * @class ArrayCollisionMatrix
	 * @constructor
	 */
	function ArrayCollisionMatrix() {

	    /**
	     * The matrix storage
	     * @property matrix
	     * @type {Array}
	     */
		this.matrix = [];
	}

	/**
	 * Get an element
	 * @method get
	 * @param  {Number} i
	 * @param  {Number} j
	 * @return {Number}
	 */
	ArrayCollisionMatrix.prototype.get = function(i, j) {
		i = i.index;
		j = j.index;
	    if (j > i) {
	        var temp = j;
	        j = i;
	        i = temp;
	    }
		return this.matrix[(i*(i + 1)>>1) + j-1];
	};

	/**
	 * Set an element
	 * @method set
	 * @param {Number} i
	 * @param {Number} j
	 * @param {Number} value
	 */
	ArrayCollisionMatrix.prototype.set = function(i, j, value) {
		i = i.index;
		j = j.index;
	    if (j > i) {
	        var temp = j;
	        j = i;
	        i = temp;
	    }
		this.matrix[(i*(i + 1)>>1) + j-1] = value ? 1 : 0;
	};

	/**
	 * Sets all elements to zero
	 * @method reset
	 */
	ArrayCollisionMatrix.prototype.reset = function() {
		for (var i=0, l=this.matrix.length; i!==l; i++) {
			this.matrix[i]=0;
		}
	};

	/**
	 * Sets the max number of objects
	 * @method setNumObjects
	 * @param {Number} n
	 */
	ArrayCollisionMatrix.prototype.setNumObjects = function(n) {
		this.matrix.length = n*(n-1)>>1;
	};

	},{}],5:[function(_dereq_,module,exports){
	var Body = _dereq_('../objects/Body');
	var Vec3 = _dereq_('../math/Vec3');
	var Quaternion = _dereq_('../math/Quaternion');
	_dereq_('../shapes/Shape');
	_dereq_('../shapes/Plane');

	module.exports = Broadphase;

	/**
	 * Base class for broadphase implementations
	 * @class Broadphase
	 * @constructor
	 * @author schteppe
	 */
	function Broadphase(){
	    /**
	    * The world to search for collisions in.
	    * @property world
	    * @type {World}
	    */
	    this.world = null;

	    /**
	     * If set to true, the broadphase uses bounding boxes for intersection test, else it uses bounding spheres.
	     * @property useBoundingBoxes
	     * @type {Boolean}
	     */
	    this.useBoundingBoxes = false;

	    /**
	     * Set to true if the objects in the world moved.
	     * @property {Boolean} dirty
	     */
	    this.dirty = true;
	}

	/**
	 * Get the collision pairs from the world
	 * @method collisionPairs
	 * @param {World} world The world to search in
	 * @param {Array} p1 Empty array to be filled with body objects
	 * @param {Array} p2 Empty array to be filled with body objects
	 */
	Broadphase.prototype.collisionPairs = function(world,p1,p2){
	    throw new Error("collisionPairs not implemented for this BroadPhase class!");
	};

	/**
	 * Check if a body pair needs to be intersection tested at all.
	 * @method needBroadphaseCollision
	 * @param {Body} bodyA
	 * @param {Body} bodyB
	 * @return {bool}
	 */
	var Broadphase_needBroadphaseCollision_STATIC_OR_KINEMATIC = Body.STATIC | Body.KINEMATIC;
	Broadphase.prototype.needBroadphaseCollision = function(bodyA,bodyB){

	    // Check collision filter masks
	    if( (bodyA.collisionFilterGroup & bodyB.collisionFilterMask)===0 || (bodyB.collisionFilterGroup & bodyA.collisionFilterMask)===0){
	        return false;
	    }

	    // Check types
	    if(((bodyA.type & Broadphase_needBroadphaseCollision_STATIC_OR_KINEMATIC)!==0 || bodyA.sleepState === Body.SLEEPING) &&
	       ((bodyB.type & Broadphase_needBroadphaseCollision_STATIC_OR_KINEMATIC)!==0 || bodyB.sleepState === Body.SLEEPING)) {
	        // Both bodies are static, kinematic or sleeping. Skip.
	        return false;
	    }

	    return true;
	};

	/**
	 * Check if the bounding volumes of two bodies intersect.
	 * @method intersectionTest
	 * @param {Body} bodyA
	 * @param {Body} bodyB
	 * @param {array} pairs1
	 * @param {array} pairs2
	  */
	Broadphase.prototype.intersectionTest = function(bodyA, bodyB, pairs1, pairs2){
	    if(this.useBoundingBoxes){
	        this.doBoundingBoxBroadphase(bodyA,bodyB,pairs1,pairs2);
	    } else {
	        this.doBoundingSphereBroadphase(bodyA,bodyB,pairs1,pairs2);
	    }
	};

	/**
	 * Check if the bounding spheres of two bodies are intersecting.
	 * @method doBoundingSphereBroadphase
	 * @param {Body} bodyA
	 * @param {Body} bodyB
	 * @param {Array} pairs1 bodyA is appended to this array if intersection
	 * @param {Array} pairs2 bodyB is appended to this array if intersection
	 */
	var Broadphase_collisionPairs_r = new Vec3(); // Temp objects
	    new Vec3();
	    new Quaternion();
	    new Vec3();
	Broadphase.prototype.doBoundingSphereBroadphase = function(bodyA,bodyB,pairs1,pairs2){
	    var r = Broadphase_collisionPairs_r;
	    bodyB.position.vsub(bodyA.position,r);
	    var boundingRadiusSum2 = Math.pow(bodyA.boundingRadius + bodyB.boundingRadius, 2);
	    var norm2 = r.norm2();
	    if(norm2 < boundingRadiusSum2){
	        pairs1.push(bodyA);
	        pairs2.push(bodyB);
	    }
	};

	/**
	 * Check if the bounding boxes of two bodies are intersecting.
	 * @method doBoundingBoxBroadphase
	 * @param {Body} bodyA
	 * @param {Body} bodyB
	 * @param {Array} pairs1
	 * @param {Array} pairs2
	 */
	Broadphase.prototype.doBoundingBoxBroadphase = function(bodyA,bodyB,pairs1,pairs2){
	    if(bodyA.aabbNeedsUpdate){
	        bodyA.computeAABB();
	    }
	    if(bodyB.aabbNeedsUpdate){
	        bodyB.computeAABB();
	    }

	    // Check AABB / AABB
	    if(bodyA.aabb.overlaps(bodyB.aabb)){
	        pairs1.push(bodyA);
	        pairs2.push(bodyB);
	    }
	};

	/**
	 * Removes duplicate pairs from the pair arrays.
	 * @method makePairsUnique
	 * @param {Array} pairs1
	 * @param {Array} pairs2
	 */
	var Broadphase_makePairsUnique_temp = { keys:[] },
	    Broadphase_makePairsUnique_p1 = [],
	    Broadphase_makePairsUnique_p2 = [];
	Broadphase.prototype.makePairsUnique = function(pairs1,pairs2){
	    var t = Broadphase_makePairsUnique_temp,
	        p1 = Broadphase_makePairsUnique_p1,
	        p2 = Broadphase_makePairsUnique_p2,
	        N = pairs1.length;

	    for(var i=0; i!==N; i++){
	        p1[i] = pairs1[i];
	        p2[i] = pairs2[i];
	    }

	    pairs1.length = 0;
	    pairs2.length = 0;

	    for(var i=0; i!==N; i++){
	        var id1 = p1[i].id,
	            id2 = p2[i].id;
	        var key = id1 < id2 ? id1+","+id2 :  id2+","+id1;
	        t[key] = i;
	        t.keys.push(key);
	    }

	    for(var i=0; i!==t.keys.length; i++){
	        var key = t.keys.pop(),
	            pairIndex = t[key];
	        pairs1.push(p1[pairIndex]);
	        pairs2.push(p2[pairIndex]);
	        delete t[key];
	    }
	};

	/**
	 * To be implemented by subcasses
	 * @method setWorld
	 * @param {World} world
	 */
	Broadphase.prototype.setWorld = function(world){
	};

	/**
	 * Check if the bounding spheres of two bodies overlap.
	 * @method boundingSphereCheck
	 * @param {Body} bodyA
	 * @param {Body} bodyB
	 * @return {boolean}
	 */
	var bsc_dist = new Vec3();
	Broadphase.boundingSphereCheck = function(bodyA,bodyB){
	    var dist = bsc_dist;
	    bodyA.position.vsub(bodyB.position,dist);
	    return Math.pow(bodyA.shape.boundingSphereRadius + bodyB.shape.boundingSphereRadius,2) > dist.norm2();
	};

	/**
	 * Returns all the bodies within the AABB.
	 * @method aabbQuery
	 * @param  {World} world
	 * @param  {AABB} aabb
	 * @param  {array} result An array to store resulting bodies in.
	 * @return {array}
	 */
	Broadphase.prototype.aabbQuery = function(world, aabb, result){
	    console.warn('.aabbQuery is not implemented in this Broadphase subclass.');
	    return [];
	};
	},{"../math/Quaternion":28,"../math/Vec3":30,"../objects/Body":31,"../shapes/Plane":42,"../shapes/Shape":43}],6:[function(_dereq_,module,exports){
	module.exports = GridBroadphase;

	var Broadphase = _dereq_('./Broadphase');
	var Vec3 = _dereq_('../math/Vec3');
	var Shape = _dereq_('../shapes/Shape');

	/**
	 * Axis aligned uniform grid broadphase.
	 * @class GridBroadphase
	 * @constructor
	 * @extends Broadphase
	 * @todo Needs support for more than just planes and spheres.
	 * @param {Vec3} aabbMin
	 * @param {Vec3} aabbMax
	 * @param {Number} nx Number of boxes along x
	 * @param {Number} ny Number of boxes along y
	 * @param {Number} nz Number of boxes along z
	 */
	function GridBroadphase(aabbMin,aabbMax,nx,ny,nz){
	    Broadphase.apply(this);
	    this.nx = nx || 10;
	    this.ny = ny || 10;
	    this.nz = nz || 10;
	    this.aabbMin = aabbMin || new Vec3(100,100,100);
	    this.aabbMax = aabbMax || new Vec3(-100,-100,-100);
		var nbins = this.nx * this.ny * this.nz;
		if (nbins <= 0) {
			throw "GridBroadphase: Each dimension's n must be >0";
		}
	    this.bins = [];
		this.binLengths = []; //Rather than continually resizing arrays (thrashing the memory), just record length and allow them to grow
		this.bins.length = nbins;
		this.binLengths.length = nbins;
		for (var i=0;i<nbins;i++) {
			this.bins[i]=[];
			this.binLengths[i]=0;
		}
	}
	GridBroadphase.prototype = new Broadphase();
	GridBroadphase.prototype.constructor = GridBroadphase;

	/**
	 * Get all the collision pairs in the physics world
	 * @method collisionPairs
	 * @param {World} world
	 * @param {Array} pairs1
	 * @param {Array} pairs2
	 */
	var GridBroadphase_collisionPairs_d = new Vec3();
	new Vec3();
	GridBroadphase.prototype.collisionPairs = function(world,pairs1,pairs2){
	    var N = world.numObjects(),
	        bodies = world.bodies;

	    var max = this.aabbMax,
	        min = this.aabbMin,
	        nx = this.nx,
	        ny = this.ny,
	        nz = this.nz;

		var xstep = ny*nz;
		var ystep = nz;
		var zstep = 1;

	    var xmax = max.x,
	        ymax = max.y,
	        zmax = max.z,
	        xmin = min.x,
	        ymin = min.y,
	        zmin = min.z;

	    var xmult = nx / (xmax-xmin),
	        ymult = ny / (ymax-ymin),
	        zmult = nz / (zmax-zmin);

	    var binsizeX = (xmax - xmin) / nx,
	        binsizeY = (ymax - ymin) / ny,
	        binsizeZ = (zmax - zmin) / nz;

		var binRadius = Math.sqrt(binsizeX*binsizeX + binsizeY*binsizeY + binsizeZ*binsizeZ) * 0.5;

	    var types = Shape.types;
	    var SPHERE =            types.SPHERE,
	        PLANE =             types.PLANE;
	        types.BOX;
	        types.COMPOUND;
	        types.CONVEXPOLYHEDRON;

	    var bins=this.bins,
			binLengths=this.binLengths,
	        Nbins=this.bins.length;

	    // Reset bins
	    for(var i=0; i!==Nbins; i++){
	        binLengths[i] = 0;
	    }

	    var ceil = Math.ceil;
		var min = Math.min;
		var max = Math.max;

		function addBoxToBins(x0,y0,z0,x1,y1,z1,bi) {
			var xoff0 = ((x0 - xmin) * xmult)|0,
				yoff0 = ((y0 - ymin) * ymult)|0,
				zoff0 = ((z0 - zmin) * zmult)|0,
				xoff1 = ceil((x1 - xmin) * xmult),
				yoff1 = ceil((y1 - ymin) * ymult),
				zoff1 = ceil((z1 - zmin) * zmult);

			if (xoff0 < 0) { xoff0 = 0; } else if (xoff0 >= nx) { xoff0 = nx - 1; }
			if (yoff0 < 0) { yoff0 = 0; } else if (yoff0 >= ny) { yoff0 = ny - 1; }
			if (zoff0 < 0) { zoff0 = 0; } else if (zoff0 >= nz) { zoff0 = nz - 1; }
			if (xoff1 < 0) { xoff1 = 0; } else if (xoff1 >= nx) { xoff1 = nx - 1; }
			if (yoff1 < 0) { yoff1 = 0; } else if (yoff1 >= ny) { yoff1 = ny - 1; }
			if (zoff1 < 0) { zoff1 = 0; } else if (zoff1 >= nz) { zoff1 = nz - 1; }

			xoff0 *= xstep;
			yoff0 *= ystep;
			zoff0 *= zstep;
			xoff1 *= xstep;
			yoff1 *= ystep;
			zoff1 *= zstep;

			for (var xoff = xoff0; xoff <= xoff1; xoff += xstep) {
				for (var yoff = yoff0; yoff <= yoff1; yoff += ystep) {
					for (var zoff = zoff0; zoff <= zoff1; zoff += zstep) {
						var idx = xoff+yoff+zoff;
						bins[idx][binLengths[idx]++] = bi;
					}
				}
			}
		}

	    // Put all bodies into the bins
	    for(var i=0; i!==N; i++){
	        var bi = bodies[i];
	        var si = bi.shape;

	        switch(si.type){
	        case SPHERE:
	            // Put in bin
	            // check if overlap with other bins
	            var x = bi.position.x,
	                y = bi.position.y,
	                z = bi.position.z;
	            var r = si.radius;

				addBoxToBins(x-r, y-r, z-r, x+r, y+r, z+r, bi);
	            break;

	        case PLANE:
	            if(si.worldNormalNeedsUpdate){
	                si.computeWorldNormal(bi.quaternion);
	            }
	            var planeNormal = si.worldNormal;

				//Relative position from origin of plane object to the first bin
				//Incremented as we iterate through the bins
				var xreset = xmin + binsizeX*0.5 - bi.position.x,
					yreset = ymin + binsizeY*0.5 - bi.position.y,
					zreset = zmin + binsizeZ*0.5 - bi.position.z;

	            var d = GridBroadphase_collisionPairs_d;
				d.set(xreset, yreset, zreset);

				for (var xi = 0, xoff = 0; xi !== nx; xi++, xoff += xstep, d.y = yreset, d.x += binsizeX) {
					for (var yi = 0, yoff = 0; yi !== ny; yi++, yoff += ystep, d.z = zreset, d.y += binsizeY) {
						for (var zi = 0, zoff = 0; zi !== nz; zi++, zoff += zstep, d.z += binsizeZ) {
							if (d.dot(planeNormal) < binRadius) {
								var idx = xoff + yoff + zoff;
								bins[idx][binLengths[idx]++] = bi;
							}
						}
					}
				}
	            break;

	        default:
				if (bi.aabbNeedsUpdate) {
					bi.computeAABB();
				}

				addBoxToBins(
					bi.aabb.lowerBound.x,
					bi.aabb.lowerBound.y,
					bi.aabb.lowerBound.z,
					bi.aabb.upperBound.x,
					bi.aabb.upperBound.y,
					bi.aabb.upperBound.z,
					bi);
	            break;
	        }
	    }

	    // Check each bin
	    for(var i=0; i!==Nbins; i++){
			var binLength = binLengths[i];
			//Skip bins with no potential collisions
			if (binLength > 1) {
				var bin = bins[i];

				// Do N^2 broadphase inside
				for(var xi=0; xi!==binLength; xi++){
					var bi = bin[xi];
					for(var yi=0; yi!==xi; yi++){
						var bj = bin[yi];
						if(this.needBroadphaseCollision(bi,bj)){
							this.intersectionTest(bi,bj,pairs1,pairs2);
						}
					}
				}
			}
	    }

	//	for (var zi = 0, zoff=0; zi < nz; zi++, zoff+= zstep) {
	//		console.log("layer "+zi);
	//		for (var yi = 0, yoff=0; yi < ny; yi++, yoff += ystep) {
	//			var row = '';
	//			for (var xi = 0, xoff=0; xi < nx; xi++, xoff += xstep) {
	//				var idx = xoff + yoff + zoff;
	//				row += ' ' + binLengths[idx];
	//			}
	//			console.log(row);
	//		}
	//	}

	    this.makePairsUnique(pairs1,pairs2);
	};

	},{"../math/Vec3":30,"../shapes/Shape":43,"./Broadphase":5}],7:[function(_dereq_,module,exports){
	module.exports = NaiveBroadphase;

	var Broadphase = _dereq_('./Broadphase');
	var AABB = _dereq_('./AABB');

	/**
	 * Naive broadphase implementation, used in lack of better ones.
	 * @class NaiveBroadphase
	 * @constructor
	 * @description The naive broadphase looks at all possible pairs without restriction, therefore it has complexity N^2 (which is bad)
	 * @extends Broadphase
	 */
	function NaiveBroadphase(){
	    Broadphase.apply(this);
	}
	NaiveBroadphase.prototype = new Broadphase();
	NaiveBroadphase.prototype.constructor = NaiveBroadphase;

	/**
	 * Get all the collision pairs in the physics world
	 * @method collisionPairs
	 * @param {World} world
	 * @param {Array} pairs1
	 * @param {Array} pairs2
	 */
	NaiveBroadphase.prototype.collisionPairs = function(world,pairs1,pairs2){
	    var bodies = world.bodies,
	        n = bodies.length,
	        i,j,bi,bj;

	    // Naive N^2 ftw!
	    for(i=0; i!==n; i++){
	        for(j=0; j!==i; j++){

	            bi = bodies[i];
	            bj = bodies[j];

	            if(!this.needBroadphaseCollision(bi,bj)){
	                continue;
	            }

	            this.intersectionTest(bi,bj,pairs1,pairs2);
	        }
	    }
	};

	new AABB();

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

	    for(var i = 0; i < world.bodies.length; i++){
	        var b = world.bodies[i];

	        if(b.aabbNeedsUpdate){
	            b.computeAABB();
	        }

	        // Ugly hack until Body gets aabb
	        if(b.aabb.overlaps(aabb)){
	            result.push(b);
	        }
	    }

	    return result;
	};
	},{"./AABB":3,"./Broadphase":5}],8:[function(_dereq_,module,exports){
	module.exports = ObjectCollisionMatrix;

	/**
	 * Records what objects are colliding with each other
	 * @class ObjectCollisionMatrix
	 * @constructor
	 */
	function ObjectCollisionMatrix() {

	    /**
	     * The matrix storage
	     * @property matrix
	     * @type {Object}
	     */
		this.matrix = {};
	}

	/**
	 * @method get
	 * @param  {Number} i
	 * @param  {Number} j
	 * @return {Number}
	 */
	ObjectCollisionMatrix.prototype.get = function(i, j) {
		i = i.id;
		j = j.id;
	    if (j > i) {
	        var temp = j;
	        j = i;
	        i = temp;
	    }
		return i+'-'+j in this.matrix;
	};

	/**
	 * @method set
	 * @param  {Number} i
	 * @param  {Number} j
	 * @param {Number} value
	 */
	ObjectCollisionMatrix.prototype.set = function(i, j, value) {
		i = i.id;
		j = j.id;
	    if (j > i) {
	        var temp = j;
	        j = i;
	        i = temp;
		}
		if (value) {
			this.matrix[i+'-'+j] = true;
		}
		else {
			delete this.matrix[i+'-'+j];
		}
	};

	/**
	 * Empty the matrix
	 * @method reset
	 */
	ObjectCollisionMatrix.prototype.reset = function() {
		this.matrix = {};
	};

	/**
	 * Set max number of objects
	 * @method setNumObjects
	 * @param {Number} n
	 */
	ObjectCollisionMatrix.prototype.setNumObjects = function(n) {
	};

	},{}],9:[function(_dereq_,module,exports){
	module.exports = Ray;

	var Vec3 = _dereq_('../math/Vec3');
	var Quaternion = _dereq_('../math/Quaternion');
	var Transform = _dereq_('../math/Transform');
	_dereq_('../shapes/ConvexPolyhedron');
	_dereq_('../shapes/Box');
	var RaycastResult = _dereq_('../collision/RaycastResult');
	var Shape = _dereq_('../shapes/Shape');
	var AABB = _dereq_('../collision/AABB');

	/**
	 * A line in 3D space that intersects bodies and return points.
	 * @class Ray
	 * @constructor
	 * @param {Vec3} from
	 * @param {Vec3} to
	 */
	function Ray(from, to){
	    /**
	     * @property {Vec3} from
	     */
	    this.from = from ? from.clone() : new Vec3();

	    /**
	     * @property {Vec3} to
	     */
	    this.to = to ? to.clone() : new Vec3();

	    /**
	     * @private
	     * @property {Vec3} _direction
	     */
	    this._direction = new Vec3();

	    /**
	     * The precision of the ray. Used when checking parallelity etc.
	     * @property {Number} precision
	     */
	    this.precision = 0.0001;

	    /**
	     * Set to true if you want the Ray to take .collisionResponse flags into account on bodies and shapes.
	     * @property {Boolean} checkCollisionResponse
	     */
	    this.checkCollisionResponse = true;

	    /**
	     * If set to true, the ray skips any hits with normal.dot(rayDirection) < 0.
	     * @property {Boolean} skipBackfaces
	     */
	    this.skipBackfaces = false;

	    /**
	     * @property {number} collisionFilterMask
	     * @default -1
	     */
	    this.collisionFilterMask = -1;

	    /**
	     * @property {number} collisionFilterGroup
	     * @default -1
	     */
	    this.collisionFilterGroup = -1;

	    /**
	     * The intersection mode. Should be Ray.ANY, Ray.ALL or Ray.CLOSEST.
	     * @property {number} mode
	     */
	    this.mode = Ray.ANY;

	    /**
	     * Current result object.
	     * @property {RaycastResult} result
	     */
	    this.result = new RaycastResult();

	    /**
	     * Will be set to true during intersectWorld() if the ray hit anything.
	     * @property {Boolean} hasHit
	     */
	    this.hasHit = false;

	    /**
	     * Current, user-provided result callback. Will be used if mode is Ray.ALL.
	     * @property {Function} callback
	     */
	    this.callback = function(result){};
	}
	Ray.prototype.constructor = Ray;

	Ray.CLOSEST = 1;
	Ray.ANY = 2;
	Ray.ALL = 4;

	var tmpAABB = new AABB();
	var tmpArray = [];

	/**
	 * Do itersection against all bodies in the given World.
	 * @method intersectWorld
	 * @param  {World} world
	 * @param  {object} options
	 * @return {Boolean} True if the ray hit anything, otherwise false.
	 */
	Ray.prototype.intersectWorld = function (world, options) {
	    this.mode = options.mode || Ray.ANY;
	    this.result = options.result || new RaycastResult();
	    this.skipBackfaces = !!options.skipBackfaces;
	    this.collisionFilterMask = typeof(options.collisionFilterMask) !== 'undefined' ? options.collisionFilterMask : -1;
	    this.collisionFilterGroup = typeof(options.collisionFilterGroup) !== 'undefined' ? options.collisionFilterGroup : -1;
	    if(options.from){
	        this.from.copy(options.from);
	    }
	    if(options.to){
	        this.to.copy(options.to);
	    }
	    this.callback = options.callback || function(){};
	    this.hasHit = false;

	    this.result.reset();
	    this._updateDirection();

	    this.getAABB(tmpAABB);
	    tmpArray.length = 0;
	    world.broadphase.aabbQuery(world, tmpAABB, tmpArray);
	    this.intersectBodies(tmpArray);

	    return this.hasHit;
	};

	var v1 = new Vec3(),
	    v2 = new Vec3();

	/*
	 * As per "Barycentric Technique" as named here http://www.blackpawn.com/texts/pointinpoly/default.html But without the division
	 */
	Ray.pointInTriangle = pointInTriangle;
	function pointInTriangle(p, a, b, c) {
	    c.vsub(a,v0);
	    b.vsub(a,v1);
	    p.vsub(a,v2);

	    var dot00 = v0.dot( v0 );
	    var dot01 = v0.dot( v1 );
	    var dot02 = v0.dot( v2 );
	    var dot11 = v1.dot( v1 );
	    var dot12 = v1.dot( v2 );

	    var u,v;

	    return  ( (u = dot11 * dot02 - dot01 * dot12) >= 0 ) &&
	            ( (v = dot00 * dot12 - dot01 * dot02) >= 0 ) &&
	            ( u + v < ( dot00 * dot11 - dot01 * dot01 ) );
	}

	/**
	 * Shoot a ray at a body, get back information about the hit.
	 * @method intersectBody
	 * @private
	 * @param {Body} body
	 * @param {RaycastResult} [result] Deprecated - set the result property of the Ray instead.
	 */
	var intersectBody_xi = new Vec3();
	var intersectBody_qi = new Quaternion();
	Ray.prototype.intersectBody = function (body, result) {
	    if(result){
	        this.result = result;
	        this._updateDirection();
	    }
	    var checkCollisionResponse = this.checkCollisionResponse;

	    if(checkCollisionResponse && !body.collisionResponse){
	        return;
	    }

	    if((this.collisionFilterGroup & body.collisionFilterMask)===0 || (body.collisionFilterGroup & this.collisionFilterMask)===0){
	        return;
	    }

	    var xi = intersectBody_xi;
	    var qi = intersectBody_qi;

	    for (var i = 0, N = body.shapes.length; i < N; i++) {
	        var shape = body.shapes[i];

	        if(checkCollisionResponse && !shape.collisionResponse){
	            continue; // Skip
	        }

	        body.quaternion.mult(body.shapeOrientations[i], qi);
	        body.quaternion.vmult(body.shapeOffsets[i], xi);
	        xi.vadd(body.position, xi);

	        this.intersectShape(
	            shape,
	            qi,
	            xi,
	            body
	        );

	        if(this.result._shouldStop){
	            break;
	        }
	    }
	};

	/**
	 * @method intersectBodies
	 * @param {Array} bodies An array of Body objects.
	 * @param {RaycastResult} [result] Deprecated
	 */
	Ray.prototype.intersectBodies = function (bodies, result) {
	    if(result){
	        this.result = result;
	        this._updateDirection();
	    }

	    for ( var i = 0, l = bodies.length; !this.result._shouldStop && i < l; i ++ ) {
	        this.intersectBody(bodies[i]);
	    }
	};

	/**
	 * Updates the _direction vector.
	 * @private
	 * @method _updateDirection
	 */
	Ray.prototype._updateDirection = function(){
	    this.to.vsub(this.from, this._direction);
	    this._direction.normalize();
	};

	/**
	 * @method intersectShape
	 * @private
	 * @param {Shape} shape
	 * @param {Quaternion} quat
	 * @param {Vec3} position
	 * @param {Body} body
	 */
	Ray.prototype.intersectShape = function(shape, quat, position, body){
	    var from = this.from;


	    // Checking boundingSphere
	    var distance = distanceFromIntersection(from, this._direction, position);
	    if ( distance > shape.boundingSphereRadius ) {
	        return;
	    }

	    var intersectMethod = this[shape.type];
	    if(intersectMethod){
	        intersectMethod.call(this, shape, quat, position, body);
	    }
	};

	new Vec3();
	new Vec3();
	var intersectPoint = new Vec3();

	var a = new Vec3();
	var b = new Vec3();
	var c = new Vec3();
	new Vec3();

	new RaycastResult();

	/**
	 * @method intersectBox
	 * @private
	 * @param  {Shape} shape
	 * @param  {Quaternion} quat
	 * @param  {Vec3} position
	 * @param  {Body} body
	 */
	Ray.prototype.intersectBox = function(shape, quat, position, body){
	    return this.intersectConvex(shape.convexPolyhedronRepresentation, quat, position, body);
	};
	Ray.prototype[Shape.types.BOX] = Ray.prototype.intersectBox;

	/**
	 * @method intersectPlane
	 * @private
	 * @param  {Shape} shape
	 * @param  {Quaternion} quat
	 * @param  {Vec3} position
	 * @param  {Body} body
	 */
	Ray.prototype.intersectPlane = function(shape, quat, position, body){
	    var from = this.from;
	    var to = this.to;
	    var direction = this._direction;

	    // Get plane normal
	    var worldNormal = new Vec3(0, 0, 1);
	    quat.vmult(worldNormal, worldNormal);

	    var len = new Vec3();
	    from.vsub(position, len);
	    var planeToFrom = len.dot(worldNormal);
	    to.vsub(position, len);
	    var planeToTo = len.dot(worldNormal);

	    if(planeToFrom * planeToTo > 0){
	        // "from" and "to" are on the same side of the plane... bail out
	        return;
	    }

	    if(from.distanceTo(to) < planeToFrom){
	        return;
	    }

	    var n_dot_dir = worldNormal.dot(direction);

	    if (Math.abs(n_dot_dir) < this.precision) {
	        // No intersection
	        return;
	    }

	    var planePointToFrom = new Vec3();
	    var dir_scaled_with_t = new Vec3();
	    var hitPointWorld = new Vec3();

	    from.vsub(position, planePointToFrom);
	    var t = -worldNormal.dot(planePointToFrom) / n_dot_dir;
	    direction.scale(t, dir_scaled_with_t);
	    from.vadd(dir_scaled_with_t, hitPointWorld);

	    this.reportIntersection(worldNormal, hitPointWorld, shape, body, -1);
	};
	Ray.prototype[Shape.types.PLANE] = Ray.prototype.intersectPlane;

	/**
	 * Get the world AABB of the ray.
	 * @method getAABB
	 * @param  {AABB} aabb
	 */
	Ray.prototype.getAABB = function(result){
	    var to = this.to;
	    var from = this.from;
	    result.lowerBound.x = Math.min(to.x, from.x);
	    result.lowerBound.y = Math.min(to.y, from.y);
	    result.lowerBound.z = Math.min(to.z, from.z);
	    result.upperBound.x = Math.max(to.x, from.x);
	    result.upperBound.y = Math.max(to.y, from.y);
	    result.upperBound.z = Math.max(to.z, from.z);
	};

	var intersectConvexOptions = {
	    faceList: [0]
	};

	/**
	 * @method intersectHeightfield
	 * @private
	 * @param  {Shape} shape
	 * @param  {Quaternion} quat
	 * @param  {Vec3} position
	 * @param  {Body} body
	 */
	Ray.prototype.intersectHeightfield = function(shape, quat, position, body){
	    shape.data;
	        shape.elementSize;
	        var worldPillarOffset = new Vec3();

	    // Convert the ray to local heightfield coordinates
	    var localRay = new Ray(this.from, this.to);
	    Transform.pointToLocalFrame(position, quat, localRay.from, localRay.from);
	    Transform.pointToLocalFrame(position, quat, localRay.to, localRay.to);

	    // Get the index of the data points to test against
	    var index = [];
	    var iMinX = null;
	    var iMinY = null;
	    var iMaxX = null;
	    var iMaxY = null;

	    var inside = shape.getIndexOfPosition(localRay.from.x, localRay.from.y, index, false);
	    if(inside){
	        iMinX = index[0];
	        iMinY = index[1];
	        iMaxX = index[0];
	        iMaxY = index[1];
	    }
	    inside = shape.getIndexOfPosition(localRay.to.x, localRay.to.y, index, false);
	    if(inside){
	        if (iMinX === null || index[0] < iMinX) { iMinX = index[0]; }
	        if (iMaxX === null || index[0] > iMaxX) { iMaxX = index[0]; }
	        if (iMinY === null || index[1] < iMinY) { iMinY = index[1]; }
	        if (iMaxY === null || index[1] > iMaxY) { iMaxY = index[1]; }
	    }

	    if(iMinX === null){
	        return;
	    }

	    var minMax = [];
	    shape.getRectMinMax(iMinX, iMinY, iMaxX, iMaxY, minMax);
	    minMax[0];
	    minMax[1];

	    // // Bail out if the ray can't touch the bounding box
	    // // TODO
	    // var aabb = new AABB();
	    // this.getAABB(aabb);
	    // if(aabb.intersects()){
	    //     return;
	    // }

	    for(var i = iMinX; i <= iMaxX; i++){
	        for(var j = iMinY; j <= iMaxY; j++){

	            if(this.result._shouldStop){
	                return;
	            }

	            // Lower triangle
	            shape.getConvexTrianglePillar(i, j, false);
	            Transform.pointToWorldFrame(position, quat, shape.pillarOffset, worldPillarOffset);
	            this.intersectConvex(shape.pillarConvex, quat, worldPillarOffset, body, intersectConvexOptions);

	            if(this.result._shouldStop){
	                return;
	            }

	            // Upper triangle
	            shape.getConvexTrianglePillar(i, j, true);
	            Transform.pointToWorldFrame(position, quat, shape.pillarOffset, worldPillarOffset);
	            this.intersectConvex(shape.pillarConvex, quat, worldPillarOffset, body, intersectConvexOptions);
	        }
	    }
	};
	Ray.prototype[Shape.types.HEIGHTFIELD] = Ray.prototype.intersectHeightfield;

	var Ray_intersectSphere_intersectionPoint = new Vec3();
	var Ray_intersectSphere_normal = new Vec3();

	/**
	 * @method intersectSphere
	 * @private
	 * @param  {Shape} shape
	 * @param  {Quaternion} quat
	 * @param  {Vec3} position
	 * @param  {Body} body
	 */
	Ray.prototype.intersectSphere = function(shape, quat, position, body){
	    var from = this.from,
	        to = this.to,
	        r = shape.radius;

	    var a = Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2) + Math.pow(to.z - from.z, 2);
	    var b = 2 * ((to.x - from.x) * (from.x - position.x) + (to.y - from.y) * (from.y - position.y) + (to.z - from.z) * (from.z - position.z));
	    var c = Math.pow(from.x - position.x, 2) + Math.pow(from.y - position.y, 2) + Math.pow(from.z - position.z, 2) - Math.pow(r, 2);

	    var delta = Math.pow(b, 2) - 4 * a * c;

	    var intersectionPoint = Ray_intersectSphere_intersectionPoint;
	    var normal = Ray_intersectSphere_normal;

	    if(delta < 0){
	        // No intersection
	        return;

	    } else if(delta === 0){
	        // single intersection point
	        from.lerp(to, delta, intersectionPoint);

	        intersectionPoint.vsub(position, normal);
	        normal.normalize();

	        this.reportIntersection(normal, intersectionPoint, shape, body, -1);

	    } else {
	        var d1 = (- b - Math.sqrt(delta)) / (2 * a);
	        var d2 = (- b + Math.sqrt(delta)) / (2 * a);

	        if(d1 >= 0 && d1 <= 1){
	            from.lerp(to, d1, intersectionPoint);
	            intersectionPoint.vsub(position, normal);
	            normal.normalize();
	            this.reportIntersection(normal, intersectionPoint, shape, body, -1);
	        }

	        if(this.result._shouldStop){
	            return;
	        }

	        if(d2 >= 0 && d2 <= 1){
	            from.lerp(to, d2, intersectionPoint);
	            intersectionPoint.vsub(position, normal);
	            normal.normalize();
	            this.reportIntersection(normal, intersectionPoint, shape, body, -1);
	        }
	    }
	};
	Ray.prototype[Shape.types.SPHERE] = Ray.prototype.intersectSphere;


	var intersectConvex_normal = new Vec3();
	new Vec3();
	new Vec3();
	var intersectConvex_vector = new Vec3();

	/**
	 * @method intersectConvex
	 * @private
	 * @param  {Shape} shape
	 * @param  {Quaternion} quat
	 * @param  {Vec3} position
	 * @param  {Body} body
	 * @param {object} [options]
	 * @param {array} [options.faceList]
	 */
	Ray.prototype.intersectConvex = function intersectConvex(
	    shape,
	    quat,
	    position,
	    body,
	    options
	){
	    var normal = intersectConvex_normal;
	    var vector = intersectConvex_vector;
	    var faceList = (options && options.faceList) || null;

	    // Checking faces
	    var faces = shape.faces,
	        vertices = shape.vertices,
	        normals = shape.faceNormals;
	    var direction = this._direction;

	    var from = this.from;
	    var to = this.to;
	    var fromToDistance = from.distanceTo(to);
	    var Nfaces = faceList ? faceList.length : faces.length;
	    var result = this.result;

	    for (var j = 0; !result._shouldStop && j < Nfaces; j++) {
	        var fi = faceList ? faceList[j] : j;

	        var face = faces[fi];
	        var faceNormal = normals[fi];
	        var q = quat;
	        var x = position;

	        // determine if ray intersects the plane of the face
	        // note: this works regardless of the direction of the face normal

	        // Get plane point in world coordinates...
	        vector.copy(vertices[face[0]]);
	        q.vmult(vector,vector);
	        vector.vadd(x,vector);

	        // ...but make it relative to the ray from. We'll fix this later.
	        vector.vsub(from,vector);

	        // Get plane normal
	        q.vmult(faceNormal,normal);

	        // If this dot product is negative, we have something interesting
	        var dot = direction.dot(normal);

	        // Bail out if ray and plane are parallel
	        if ( Math.abs( dot ) < this.precision ){
	            continue;
	        }

	        // calc distance to plane
	        var scalar = normal.dot(vector) / dot;

	        // if negative distance, then plane is behind ray
	        if (scalar < 0){
	            continue;
	        }

	        // if (dot < 0) {

	        // Intersection point is from + direction * scalar
	        direction.mult(scalar,intersectPoint);
	        intersectPoint.vadd(from,intersectPoint);

	        // a is the point we compare points b and c with.
	        a.copy(vertices[face[0]]);
	        q.vmult(a,a);
	        x.vadd(a,a);

	        for(var i = 1; !result._shouldStop && i < face.length - 1; i++){
	            // Transform 3 vertices to world coords
	            b.copy(vertices[face[i]]);
	            c.copy(vertices[face[i+1]]);
	            q.vmult(b,b);
	            q.vmult(c,c);
	            x.vadd(b,b);
	            x.vadd(c,c);

	            var distance = intersectPoint.distanceTo(from);

	            if(!(pointInTriangle(intersectPoint, a, b, c) || pointInTriangle(intersectPoint, b, a, c)) || distance > fromToDistance){
	                continue;
	            }

	            this.reportIntersection(normal, intersectPoint, shape, body, fi);
	        }
	        // }
	    }
	};
	Ray.prototype[Shape.types.CONVEXPOLYHEDRON] = Ray.prototype.intersectConvex;

	var intersectTrimesh_normal = new Vec3();
	var intersectTrimesh_localDirection = new Vec3();
	var intersectTrimesh_localFrom = new Vec3();
	var intersectTrimesh_localTo = new Vec3();
	var intersectTrimesh_worldNormal = new Vec3();
	var intersectTrimesh_worldIntersectPoint = new Vec3();
	new AABB();
	var intersectTrimesh_triangles = [];
	var intersectTrimesh_treeTransform = new Transform();

	/**
	 * @method intersectTrimesh
	 * @private
	 * @param  {Shape} shape
	 * @param  {Quaternion} quat
	 * @param  {Vec3} position
	 * @param  {Body} body
	 * @param {object} [options]
	 * @todo Optimize by transforming the world to local space first.
	 * @todo Use Octree lookup
	 */
	Ray.prototype.intersectTrimesh = function intersectTrimesh(
	    mesh,
	    quat,
	    position,
	    body,
	    options
	){
	    var normal = intersectTrimesh_normal;
	    var triangles = intersectTrimesh_triangles;
	    var treeTransform = intersectTrimesh_treeTransform;
	    var vector = intersectConvex_vector;
	    var localDirection = intersectTrimesh_localDirection;
	    var localFrom = intersectTrimesh_localFrom;
	    var localTo = intersectTrimesh_localTo;
	    var worldIntersectPoint = intersectTrimesh_worldIntersectPoint;
	    var worldNormal = intersectTrimesh_worldNormal;
	    (options && options.faceList) || null;

	    // Checking faces
	    var indices = mesh.indices;
	        mesh.vertices;
	        mesh.faceNormals;

	    var from = this.from;
	    var to = this.to;
	    var direction = this._direction;
	    treeTransform.position.copy(position);
	    treeTransform.quaternion.copy(quat);

	    // Transform ray to local space!
	    Transform.vectorToLocalFrame(position, quat, direction, localDirection);
	    //body.vectorToLocalFrame(direction, localDirection);
	    Transform.pointToLocalFrame(position, quat, from, localFrom);
	    //body.pointToLocalFrame(from, localFrom);
	    Transform.pointToLocalFrame(position, quat, to, localTo);
	    //body.pointToLocalFrame(to, localTo);
	    var fromToDistanceSquared = localFrom.distanceSquared(localTo);

	    mesh.tree.rayQuery(this, treeTransform, triangles);

	    for (var i = 0, N = triangles.length; !this.result._shouldStop && i !== N; i++) {
	        var trianglesIndex = triangles[i];

	        mesh.getNormal(trianglesIndex, normal);

	        // determine if ray intersects the plane of the face
	        // note: this works regardless of the direction of the face normal

	        // Get plane point in world coordinates...
	        mesh.getVertex(indices[trianglesIndex * 3], a);

	        // ...but make it relative to the ray from. We'll fix this later.
	        a.vsub(localFrom,vector);

	        // Get plane normal
	        // quat.vmult(normal, normal);

	        // If this dot product is negative, we have something interesting
	        var dot = localDirection.dot(normal);

	        // Bail out if ray and plane are parallel
	        // if (Math.abs( dot ) < this.precision){
	        //     continue;
	        // }

	        // calc distance to plane
	        var scalar = normal.dot(vector) / dot;

	        // if negative distance, then plane is behind ray
	        if (scalar < 0){
	            continue;
	        }

	        // Intersection point is from + direction * scalar
	        localDirection.scale(scalar,intersectPoint);
	        intersectPoint.vadd(localFrom,intersectPoint);

	        // Get triangle vertices
	        mesh.getVertex(indices[trianglesIndex * 3 + 1], b);
	        mesh.getVertex(indices[trianglesIndex * 3 + 2], c);

	        var squaredDistance = intersectPoint.distanceSquared(localFrom);

	        if(!(pointInTriangle(intersectPoint, b, a, c) || pointInTriangle(intersectPoint, a, b, c)) || squaredDistance > fromToDistanceSquared){
	            continue;
	        }

	        // transform intersectpoint and normal to world
	        Transform.vectorToWorldFrame(quat, normal, worldNormal);
	        //body.vectorToWorldFrame(normal, worldNormal);
	        Transform.pointToWorldFrame(position, quat, intersectPoint, worldIntersectPoint);
	        //body.pointToWorldFrame(intersectPoint, worldIntersectPoint);
	        this.reportIntersection(worldNormal, worldIntersectPoint, mesh, body, trianglesIndex);
	    }
	    triangles.length = 0;
	};
	Ray.prototype[Shape.types.TRIMESH] = Ray.prototype.intersectTrimesh;


	/**
	 * @method reportIntersection
	 * @private
	 * @param  {Vec3} normal
	 * @param  {Vec3} hitPointWorld
	 * @param  {Shape} shape
	 * @param  {Body} body
	 * @return {boolean} True if the intersections should continue
	 */
	Ray.prototype.reportIntersection = function(normal, hitPointWorld, shape, body, hitFaceIndex){
	    var from = this.from;
	    var to = this.to;
	    var distance = from.distanceTo(hitPointWorld);
	    var result = this.result;

	    // Skip back faces?
	    if(this.skipBackfaces && normal.dot(this._direction) > 0){
	        return;
	    }

	    result.hitFaceIndex = typeof(hitFaceIndex) !== 'undefined' ? hitFaceIndex : -1;

	    switch(this.mode){
	    case Ray.ALL:
	        this.hasHit = true;
	        result.set(
	            from,
	            to,
	            normal,
	            hitPointWorld,
	            shape,
	            body,
	            distance
	        );
	        result.hasHit = true;
	        this.callback(result);
	        break;

	    case Ray.CLOSEST:

	        // Store if closer than current closest
	        if(distance < result.distance || !result.hasHit){
	            this.hasHit = true;
	            result.hasHit = true;
	            result.set(
	                from,
	                to,
	                normal,
	                hitPointWorld,
	                shape,
	                body,
	                distance
	            );
	        }
	        break;

	    case Ray.ANY:

	        // Report and stop.
	        this.hasHit = true;
	        result.hasHit = true;
	        result.set(
	            from,
	            to,
	            normal,
	            hitPointWorld,
	            shape,
	            body,
	            distance
	        );
	        result._shouldStop = true;
	        break;
	    }
	};

	var v0 = new Vec3(),
	    intersect = new Vec3();
	function distanceFromIntersection(from, direction, position) {

	    // v0 is vector from from to position
	    position.vsub(from,v0);
	    var dot = v0.dot(direction);

	    // intersect = direction*dot + from
	    direction.mult(dot,intersect);
	    intersect.vadd(from,intersect);

	    var distance = position.distanceTo(intersect);

	    return distance;
	}


	},{"../collision/AABB":3,"../collision/RaycastResult":10,"../math/Quaternion":28,"../math/Transform":29,"../math/Vec3":30,"../shapes/Box":37,"../shapes/ConvexPolyhedron":38,"../shapes/Shape":43}],10:[function(_dereq_,module,exports){
	var Vec3 = _dereq_('../math/Vec3');

	module.exports = RaycastResult;

	/**
	 * Storage for Ray casting data.
	 * @class RaycastResult
	 * @constructor
	 */
	function RaycastResult(){

		/**
		 * @property {Vec3} rayFromWorld
		 */
		this.rayFromWorld = new Vec3();

		/**
		 * @property {Vec3} rayToWorld
		 */
		this.rayToWorld = new Vec3();

		/**
		 * @property {Vec3} hitNormalWorld
		 */
		this.hitNormalWorld = new Vec3();

		/**
		 * @property {Vec3} hitPointWorld
		 */
		this.hitPointWorld = new Vec3();

		/**
		 * @property {boolean} hasHit
		 */
		this.hasHit = false;

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
		 * The index of the hit triangle, if the hit shape was a trimesh.
		 * @property {number} hitFaceIndex
		 * @default -1
		 */
		this.hitFaceIndex = -1;

		/**
		 * Distance to the hit. Will be set to -1 if there was no hit.
		 * @property {number} distance
		 * @default -1
		 */
		this.distance = -1;

		/**
		 * If the ray should stop traversing the bodies.
		 * @private
		 * @property {Boolean} _shouldStop
		 * @default false
		 */
		this._shouldStop = false;
	}

	/**
	 * Reset all result data.
	 * @method reset
	 */
	RaycastResult.prototype.reset = function () {
		this.rayFromWorld.setZero();
		this.rayToWorld.setZero();
		this.hitNormalWorld.setZero();
		this.hitPointWorld.setZero();
		this.hasHit = false;
		this.shape = null;
		this.body = null;
		this.hitFaceIndex = -1;
		this.distance = -1;
		this._shouldStop = false;
	};

	/**
	 * @method abort
	 */
	RaycastResult.prototype.abort = function(){
		this._shouldStop = true;
	};

	/**
	 * @method set
	 * @param {Vec3} rayFromWorld
	 * @param {Vec3} rayToWorld
	 * @param {Vec3} hitNormalWorld
	 * @param {Vec3} hitPointWorld
	 * @param {Shape} shape
	 * @param {Body} body
	 * @param {number} distance
	 */
	RaycastResult.prototype.set = function(
		rayFromWorld,
		rayToWorld,
		hitNormalWorld,
		hitPointWorld,
		shape,
		body,
		distance
	){
		this.rayFromWorld.copy(rayFromWorld);
		this.rayToWorld.copy(rayToWorld);
		this.hitNormalWorld.copy(hitNormalWorld);
		this.hitPointWorld.copy(hitPointWorld);
		this.shape = shape;
		this.body = body;
		this.distance = distance;
	};
	},{"../math/Vec3":30}],11:[function(_dereq_,module,exports){
	_dereq_('../shapes/Shape');
	var Broadphase = _dereq_('../collision/Broadphase');

	module.exports = SAPBroadphase;

	/**
	 * Sweep and prune broadphase along one axis.
	 *
	 * @class SAPBroadphase
	 * @constructor
	 * @param {World} [world]
	 * @extends Broadphase
	 */
	function SAPBroadphase(world){
	    Broadphase.apply(this);

	    /**
	     * List of bodies currently in the broadphase.
	     * @property axisList
	     * @type {Array}
	     */
	    this.axisList = [];

	    /**
	     * The world to search in.
	     * @property world
	     * @type {World}
	     */
	    this.world = null;

	    /**
	     * Axis to sort the bodies along. Set to 0 for x axis, and 1 for y axis. For best performance, choose an axis that the bodies are spread out more on.
	     * @property axisIndex
	     * @type {Number}
	     */
	    this.axisIndex = 0;

	    var axisList = this.axisList;

	    this._addBodyHandler = function(e){
	        axisList.push(e.body);
	    };

	    this._removeBodyHandler = function(e){
	        var idx = axisList.indexOf(e.body);
	        if(idx !== -1){
	            axisList.splice(idx,1);
	        }
	    };

	    if(world){
	        this.setWorld(world);
	    }
	}
	SAPBroadphase.prototype = new Broadphase();

	/**
	 * Change the world
	 * @method setWorld
	 * @param  {World} world
	 */
	SAPBroadphase.prototype.setWorld = function(world){
	    // Clear the old axis array
	    this.axisList.length = 0;

	    // Add all bodies from the new world
	    for(var i=0; i<world.bodies.length; i++){
	        this.axisList.push(world.bodies[i]);
	    }

	    // Remove old handlers, if any
	    world.removeEventListener("addBody", this._addBodyHandler);
	    world.removeEventListener("removeBody", this._removeBodyHandler);

	    // Add handlers to update the list of bodies.
	    world.addEventListener("addBody", this._addBodyHandler);
	    world.addEventListener("removeBody", this._removeBodyHandler);

	    this.world = world;
	    this.dirty = true;
	};

	/**
	 * @static
	 * @method insertionSortX
	 * @param  {Array} a
	 * @return {Array}
	 */
	SAPBroadphase.insertionSortX = function(a) {
	    for(var i=1,l=a.length;i<l;i++) {
	        var v = a[i];
	        for(var j=i - 1;j>=0;j--) {
	            if(a[j].aabb.lowerBound.x <= v.aabb.lowerBound.x){
	                break;
	            }
	            a[j+1] = a[j];
	        }
	        a[j+1] = v;
	    }
	    return a;
	};

	/**
	 * @static
	 * @method insertionSortY
	 * @param  {Array} a
	 * @return {Array}
	 */
	SAPBroadphase.insertionSortY = function(a) {
	    for(var i=1,l=a.length;i<l;i++) {
	        var v = a[i];
	        for(var j=i - 1;j>=0;j--) {
	            if(a[j].aabb.lowerBound.y <= v.aabb.lowerBound.y){
	                break;
	            }
	            a[j+1] = a[j];
	        }
	        a[j+1] = v;
	    }
	    return a;
	};

	/**
	 * @static
	 * @method insertionSortZ
	 * @param  {Array} a
	 * @return {Array}
	 */
	SAPBroadphase.insertionSortZ = function(a) {
	    for(var i=1,l=a.length;i<l;i++) {
	        var v = a[i];
	        for(var j=i - 1;j>=0;j--) {
	            if(a[j].aabb.lowerBound.z <= v.aabb.lowerBound.z){
	                break;
	            }
	            a[j+1] = a[j];
	        }
	        a[j+1] = v;
	    }
	    return a;
	};

	/**
	 * Collect all collision pairs
	 * @method collisionPairs
	 * @param  {World} world
	 * @param  {Array} p1
	 * @param  {Array} p2
	 */
	SAPBroadphase.prototype.collisionPairs = function(world,p1,p2){
	    var bodies = this.axisList,
	        N = bodies.length,
	        axisIndex = this.axisIndex,
	        i, j;

	    if(this.dirty){
	        this.sortList();
	        this.dirty = false;
	    }

	    // Look through the list
	    for(i=0; i !== N; i++){
	        var bi = bodies[i];

	        for(j=i+1; j < N; j++){
	            var bj = bodies[j];

	            if(!this.needBroadphaseCollision(bi,bj)){
	                continue;
	            }

	            if(!SAPBroadphase.checkBounds(bi,bj,axisIndex)){
	                break;
	            }

	            this.intersectionTest(bi,bj,p1,p2);
	        }
	    }
	};

	SAPBroadphase.prototype.sortList = function(){
	    var axisList = this.axisList;
	    var axisIndex = this.axisIndex;
	    var N = axisList.length;

	    // Update AABBs
	    for(var i = 0; i!==N; i++){
	        var bi = axisList[i];
	        if(bi.aabbNeedsUpdate){
	            bi.computeAABB();
	        }
	    }

	    // Sort the list
	    if(axisIndex === 0){
	        SAPBroadphase.insertionSortX(axisList);
	    } else if(axisIndex === 1){
	        SAPBroadphase.insertionSortY(axisList);
	    } else if(axisIndex === 2){
	        SAPBroadphase.insertionSortZ(axisList);
	    }
	};

	/**
	 * Check if the bounds of two bodies overlap, along the given SAP axis.
	 * @static
	 * @method checkBounds
	 * @param  {Body} bi
	 * @param  {Body} bj
	 * @param  {Number} axisIndex
	 * @return {Boolean}
	 */
	SAPBroadphase.checkBounds = function(bi, bj, axisIndex){
	    var biPos;
	    var bjPos;

	    if(axisIndex === 0){
	        biPos = bi.position.x;
	        bjPos = bj.position.x;
	    } else if(axisIndex === 1){
	        biPos = bi.position.y;
	        bjPos = bj.position.y;
	    } else if(axisIndex === 2){
	        biPos = bi.position.z;
	        bjPos = bj.position.z;
	    }

	    var ri = bi.boundingRadius,
	        rj = bj.boundingRadius,
	        boundA2 = biPos + ri,
	        boundB1 = bjPos - rj;

	    return boundB1 < boundA2;
	};

	/**
	 * Computes the variance of the body positions and estimates the best
	 * axis to use. Will automatically set property .axisIndex.
	 * @method autoDetectAxis
	 */
	SAPBroadphase.prototype.autoDetectAxis = function(){
	    var sumX=0,
	        sumX2=0,
	        sumY=0,
	        sumY2=0,
	        sumZ=0,
	        sumZ2=0,
	        bodies = this.axisList,
	        N = bodies.length,
	        invN=1/N;

	    for(var i=0; i!==N; i++){
	        var b = bodies[i];

	        var centerX = b.position.x;
	        sumX += centerX;
	        sumX2 += centerX*centerX;

	        var centerY = b.position.y;
	        sumY += centerY;
	        sumY2 += centerY*centerY;

	        var centerZ = b.position.z;
	        sumZ += centerZ;
	        sumZ2 += centerZ*centerZ;
	    }

	    var varianceX = sumX2 - sumX*sumX*invN,
	        varianceY = sumY2 - sumY*sumY*invN,
	        varianceZ = sumZ2 - sumZ*sumZ*invN;

	    if(varianceX > varianceY){
	        if(varianceX > varianceZ){
	            this.axisIndex = 0;
	        } else {
	            this.axisIndex = 2;
	        }
	    } else if(varianceY > varianceZ){
	        this.axisIndex = 1;
	    } else {
	        this.axisIndex = 2;
	    }
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

	    if(this.dirty){
	        this.sortList();
	        this.dirty = false;
	    }

	    var axisIndex = this.axisIndex, axis = 'x';
	    if(axisIndex === 1){ axis = 'y'; }
	    if(axisIndex === 2){ axis = 'z'; }

	    var axisList = this.axisList;
	    aabb.lowerBound[axis];
	    aabb.upperBound[axis];
	    for(var i = 0; i < axisList.length; i++){
	        var b = axisList[i];

	        if(b.aabbNeedsUpdate){
	            b.computeAABB();
	        }

	        if(b.aabb.overlaps(aabb)){
	            result.push(b);
	        }
	    }

	    return result;
	};
	},{"../collision/Broadphase":5,"../shapes/Shape":43}],12:[function(_dereq_,module,exports){
	module.exports = ConeTwistConstraint;

	_dereq_('./Constraint');
	var PointToPointConstraint = _dereq_('./PointToPointConstraint');
	var ConeEquation = _dereq_('../equations/ConeEquation');
	var RotationalEquation = _dereq_('../equations/RotationalEquation');
	_dereq_('../equations/ContactEquation');
	var Vec3 = _dereq_('../math/Vec3');

	/**
	 * @class ConeTwistConstraint
	 * @constructor
	 * @author schteppe
	 * @param {Body} bodyA
	 * @param {Body} bodyB
	 * @param {object} [options]
	 * @param {Vec3} [options.pivotA]
	 * @param {Vec3} [options.pivotB]
	 * @param {Vec3} [options.axisA]
	 * @param {Vec3} [options.axisB]
	 * @param {Number} [options.maxForce=1e6]
	 * @extends PointToPointConstraint
	 */
	function ConeTwistConstraint(bodyA, bodyB, options){
	    options = options || {};
	    var maxForce = typeof(options.maxForce) !== 'undefined' ? options.maxForce : 1e6;

	    // Set pivot point in between
	    var pivotA = options.pivotA ? options.pivotA.clone() : new Vec3();
	    var pivotB = options.pivotB ? options.pivotB.clone() : new Vec3();
	    this.axisA = options.axisA ? options.axisA.clone() : new Vec3();
	    this.axisB = options.axisB ? options.axisB.clone() : new Vec3();

	    PointToPointConstraint.call(this, bodyA, pivotA, bodyB, pivotB, maxForce);

	    this.collideConnected = !!options.collideConnected;

	    this.angle = typeof(options.angle) !== 'undefined' ? options.angle : 0;

	    /**
	     * @property {ConeEquation} coneEquation
	     */
	    var c = this.coneEquation = new ConeEquation(bodyA,bodyB,options);

	    /**
	     * @property {RotationalEquation} twistEquation
	     */
	    var t = this.twistEquation = new RotationalEquation(bodyA,bodyB,options);
	    this.twistAngle = typeof(options.twistAngle) !== 'undefined' ? options.twistAngle : 0;

	    // Make the cone equation push the bodies toward the cone axis, not outward
	    c.maxForce = 0;
	    c.minForce = -maxForce;

	    // Make the twist equation add torque toward the initial position
	    t.maxForce = 0;
	    t.minForce = -maxForce;

	    this.equations.push(c, t);
	}
	ConeTwistConstraint.prototype = new PointToPointConstraint();
	ConeTwistConstraint.constructor = ConeTwistConstraint;

	new Vec3();
	new Vec3();

	ConeTwistConstraint.prototype.update = function(){
	    var bodyA = this.bodyA,
	        bodyB = this.bodyB,
	        cone = this.coneEquation,
	        twist = this.twistEquation;

	    PointToPointConstraint.prototype.update.call(this);

	    // Update the axes to the cone constraint
	    bodyA.vectorToWorldFrame(this.axisA, cone.axisA);
	    bodyB.vectorToWorldFrame(this.axisB, cone.axisB);

	    // Update the world axes in the twist constraint
	    this.axisA.tangents(twist.axisA, twist.axisA);
	    bodyA.vectorToWorldFrame(twist.axisA, twist.axisA);

	    this.axisB.tangents(twist.axisB, twist.axisB);
	    bodyB.vectorToWorldFrame(twist.axisB, twist.axisB);

	    cone.angle = this.angle;
	    twist.maxAngle = this.twistAngle;
	};


	},{"../equations/ConeEquation":18,"../equations/ContactEquation":19,"../equations/RotationalEquation":22,"../math/Vec3":30,"./Constraint":13,"./PointToPointConstraint":17}],13:[function(_dereq_,module,exports){
	module.exports = Constraint;

	var Utils = _dereq_('../utils/Utils');

	/**
	 * Constraint base class
	 * @class Constraint
	 * @author schteppe
	 * @constructor
	 * @param {Body} bodyA
	 * @param {Body} bodyB
	 * @param {object} [options]
	 * @param {boolean} [options.collideConnected=true]
	 * @param {boolean} [options.wakeUpBodies=true]
	 */
	function Constraint(bodyA, bodyB, options){
	    options = Utils.defaults(options,{
	        collideConnected : true,
	        wakeUpBodies : true,
	    });

	    /**
	     * Equations to be solved in this constraint
	     * @property equations
	     * @type {Array}
	     */
	    this.equations = [];

	    /**
	     * @property {Body} bodyA
	     */
	    this.bodyA = bodyA;

	    /**
	     * @property {Body} bodyB
	     */
	    this.bodyB = bodyB;

	    /**
	     * @property {Number} id
	     */
	    this.id = Constraint.idCounter++;

	    /**
	     * Set to true if you want the bodies to collide when they are connected.
	     * @property collideConnected
	     * @type {boolean}
	     */
	    this.collideConnected = options.collideConnected;

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
	 * Update all the equations with data.
	 * @method update
	 */
	Constraint.prototype.update = function(){
	    throw new Error("method update() not implmemented in this Constraint subclass!");
	};

	/**
	 * Enables all equations in the constraint.
	 * @method enable
	 */
	Constraint.prototype.enable = function(){
	    var eqs = this.equations;
	    for(var i=0; i<eqs.length; i++){
	        eqs[i].enabled = true;
	    }
	};

	/**
	 * Disables all equations in the constraint.
	 * @method disable
	 */
	Constraint.prototype.disable = function(){
	    var eqs = this.equations;
	    for(var i=0; i<eqs.length; i++){
	        eqs[i].enabled = false;
	    }
	};

	Constraint.idCounter = 0;

	},{"../utils/Utils":53}],14:[function(_dereq_,module,exports){
	module.exports = DistanceConstraint;

	var Constraint = _dereq_('./Constraint');
	var ContactEquation = _dereq_('../equations/ContactEquation');

	/**
	 * Constrains two bodies to be at a constant distance from each others center of mass.
	 * @class DistanceConstraint
	 * @constructor
	 * @author schteppe
	 * @param {Body} bodyA
	 * @param {Body} bodyB
	 * @param {Number} [distance] The distance to keep. If undefined, it will be set to the current distance between bodyA and bodyB
	 * @param {Number} [maxForce=1e6]
	 * @extends Constraint
	 */
	function DistanceConstraint(bodyA,bodyB,distance,maxForce){
	    Constraint.call(this,bodyA,bodyB);

	    if(typeof(distance)==="undefined") {
	        distance = bodyA.position.distanceTo(bodyB.position);
	    }

	    if(typeof(maxForce)==="undefined") {
	        maxForce = 1e6;
	    }

	    /**
	     * @property {number} distance
	     */
	    this.distance = distance;

	    /**
	     * @property {ContactEquation} distanceEquation
	     */
	    var eq = this.distanceEquation = new ContactEquation(bodyA, bodyB);
	    this.equations.push(eq);

	    // Make it bidirectional
	    eq.minForce = -maxForce;
	    eq.maxForce =  maxForce;
	}
	DistanceConstraint.prototype = new Constraint();

	DistanceConstraint.prototype.update = function(){
	    var bodyA = this.bodyA;
	    var bodyB = this.bodyB;
	    var eq = this.distanceEquation;
	    var halfDist = this.distance * 0.5;
	    var normal = eq.ni;

	    bodyB.position.vsub(bodyA.position, normal);
	    normal.normalize();
	    normal.mult(halfDist, eq.ri);
	    normal.mult(-halfDist, eq.rj);
	};
	},{"../equations/ContactEquation":19,"./Constraint":13}],15:[function(_dereq_,module,exports){
	module.exports = HingeConstraint;

	_dereq_('./Constraint');
	var PointToPointConstraint = _dereq_('./PointToPointConstraint');
	var RotationalEquation = _dereq_('../equations/RotationalEquation');
	var RotationalMotorEquation = _dereq_('../equations/RotationalMotorEquation');
	_dereq_('../equations/ContactEquation');
	var Vec3 = _dereq_('../math/Vec3');

	/**
	 * Hinge constraint. Think of it as a door hinge. It tries to keep the door in the correct place and with the correct orientation.
	 * @class HingeConstraint
	 * @constructor
	 * @author schteppe
	 * @param {Body} bodyA
	 * @param {Body} bodyB
	 * @param {object} [options]
	 * @param {Vec3} [options.pivotA] A point defined locally in bodyA. This defines the offset of axisA.
	 * @param {Vec3} [options.axisA] An axis that bodyA can rotate around, defined locally in bodyA.
	 * @param {Vec3} [options.pivotB]
	 * @param {Vec3} [options.axisB]
	 * @param {Number} [options.maxForce=1e6]
	 * @extends PointToPointConstraint
	 */
	function HingeConstraint(bodyA, bodyB, options){
	    options = options || {};
	    var maxForce = typeof(options.maxForce) !== 'undefined' ? options.maxForce : 1e6;
	    var pivotA = options.pivotA ? options.pivotA.clone() : new Vec3();
	    var pivotB = options.pivotB ? options.pivotB.clone() : new Vec3();

	    PointToPointConstraint.call(this, bodyA, pivotA, bodyB, pivotB, maxForce);

	    /**
	     * Rotation axis, defined locally in bodyA.
	     * @property {Vec3} axisA
	     */
	    var axisA = this.axisA = options.axisA ? options.axisA.clone() : new Vec3(1,0,0);
	    axisA.normalize();

	    /**
	     * Rotation axis, defined locally in bodyB.
	     * @property {Vec3} axisB
	     */
	    var axisB = this.axisB = options.axisB ? options.axisB.clone() : new Vec3(1,0,0);
	    axisB.normalize();

	    /**
	     * @property {RotationalEquation} rotationalEquation1
	     */
	    var r1 = this.rotationalEquation1 = new RotationalEquation(bodyA,bodyB,options);

	    /**
	     * @property {RotationalEquation} rotationalEquation2
	     */
	    var r2 = this.rotationalEquation2 = new RotationalEquation(bodyA,bodyB,options);

	    /**
	     * @property {RotationalMotorEquation} motorEquation
	     */
	    var motor = this.motorEquation = new RotationalMotorEquation(bodyA,bodyB,maxForce);
	    motor.enabled = false; // Not enabled by default

	    // Equations to be fed to the solver
	    this.equations.push(
	        r1, // rotational1
	        r2, // rotational2
	        motor
	    );
	}
	HingeConstraint.prototype = new PointToPointConstraint();
	HingeConstraint.constructor = HingeConstraint;

	/**
	 * @method enableMotor
	 */
	HingeConstraint.prototype.enableMotor = function(){
	    this.motorEquation.enabled = true;
	};

	/**
	 * @method disableMotor
	 */
	HingeConstraint.prototype.disableMotor = function(){
	    this.motorEquation.enabled = false;
	};

	/**
	 * @method setMotorSpeed
	 * @param {number} speed
	 */
	HingeConstraint.prototype.setMotorSpeed = function(speed){
	    this.motorEquation.targetVelocity = speed;
	};

	/**
	 * @method setMotorMaxForce
	 * @param {number} maxForce
	 */
	HingeConstraint.prototype.setMotorMaxForce = function(maxForce){
	    this.motorEquation.maxForce = maxForce;
	    this.motorEquation.minForce = -maxForce;
	};

	var HingeConstraint_update_tmpVec1 = new Vec3();
	var HingeConstraint_update_tmpVec2 = new Vec3();

	HingeConstraint.prototype.update = function(){
	    var bodyA = this.bodyA,
	        bodyB = this.bodyB,
	        motor = this.motorEquation,
	        r1 = this.rotationalEquation1,
	        r2 = this.rotationalEquation2,
	        worldAxisA = HingeConstraint_update_tmpVec1,
	        worldAxisB = HingeConstraint_update_tmpVec2;

	    var axisA = this.axisA;
	    var axisB = this.axisB;

	    PointToPointConstraint.prototype.update.call(this);

	    // Get world axes
	    bodyA.quaternion.vmult(axisA, worldAxisA);
	    bodyB.quaternion.vmult(axisB, worldAxisB);

	    worldAxisA.tangents(r1.axisA, r2.axisA);
	    r1.axisB.copy(worldAxisB);
	    r2.axisB.copy(worldAxisB);

	    if(this.motorEquation.enabled){
	        bodyA.quaternion.vmult(this.axisA, motor.axisA);
	        bodyB.quaternion.vmult(this.axisB, motor.axisB);
	    }
	};


	},{"../equations/ContactEquation":19,"../equations/RotationalEquation":22,"../equations/RotationalMotorEquation":23,"../math/Vec3":30,"./Constraint":13,"./PointToPointConstraint":17}],16:[function(_dereq_,module,exports){
	module.exports = LockConstraint;

	_dereq_('./Constraint');
	var PointToPointConstraint = _dereq_('./PointToPointConstraint');
	var RotationalEquation = _dereq_('../equations/RotationalEquation');
	_dereq_('../equations/RotationalMotorEquation');
	_dereq_('../equations/ContactEquation');
	var Vec3 = _dereq_('../math/Vec3');

	/**
	 * Lock constraint. Will remove all degrees of freedom between the bodies.
	 * @class LockConstraint
	 * @constructor
	 * @author schteppe
	 * @param {Body} bodyA
	 * @param {Body} bodyB
	 * @param {object} [options]
	 * @param {Number} [options.maxForce=1e6]
	 * @extends PointToPointConstraint
	 */
	function LockConstraint(bodyA, bodyB, options){
	    options = options || {};
	    var maxForce = typeof(options.maxForce) !== 'undefined' ? options.maxForce : 1e6;

	    // Set pivot point in between
	    var pivotA = new Vec3();
	    var pivotB = new Vec3();
	    var halfWay = new Vec3();
	    bodyA.position.vadd(bodyB.position, halfWay);
	    halfWay.scale(0.5, halfWay);
	    bodyB.pointToLocalFrame(halfWay, pivotB);
	    bodyA.pointToLocalFrame(halfWay, pivotA);
	    PointToPointConstraint.call(this, bodyA, pivotA, bodyB, pivotB, maxForce);

	    /**
	     * @property {RotationalEquation} rotationalEquation1
	     */
	    var r1 = this.rotationalEquation1 = new RotationalEquation(bodyA,bodyB,options);

	    /**
	     * @property {RotationalEquation} rotationalEquation2
	     */
	    var r2 = this.rotationalEquation2 = new RotationalEquation(bodyA,bodyB,options);

	    /**
	     * @property {RotationalEquation} rotationalEquation3
	     */
	    var r3 = this.rotationalEquation3 = new RotationalEquation(bodyA,bodyB,options);

	    this.equations.push(r1, r2, r3);
	}
	LockConstraint.prototype = new PointToPointConstraint();
	LockConstraint.constructor = LockConstraint;

	new Vec3();
	new Vec3();

	LockConstraint.prototype.update = function(){
	    var bodyA = this.bodyA,
	        bodyB = this.bodyB;
	        this.motorEquation;
	        var r1 = this.rotationalEquation1,
	        r2 = this.rotationalEquation2,
	        r3 = this.rotationalEquation3;

	    PointToPointConstraint.prototype.update.call(this);

	    bodyA.vectorToWorldFrame(Vec3.UNIT_X, r1.axisA);
	    bodyB.vectorToWorldFrame(Vec3.UNIT_Y, r1.axisB);

	    bodyA.vectorToWorldFrame(Vec3.UNIT_Y, r2.axisA);
	    bodyB.vectorToWorldFrame(Vec3.UNIT_Z, r2.axisB);

	    bodyA.vectorToWorldFrame(Vec3.UNIT_Z, r3.axisA);
	    bodyB.vectorToWorldFrame(Vec3.UNIT_X, r3.axisB);
	};


	},{"../equations/ContactEquation":19,"../equations/RotationalEquation":22,"../equations/RotationalMotorEquation":23,"../math/Vec3":30,"./Constraint":13,"./PointToPointConstraint":17}],17:[function(_dereq_,module,exports){
	module.exports = PointToPointConstraint;

	var Constraint = _dereq_('./Constraint');
	var ContactEquation = _dereq_('../equations/ContactEquation');
	var Vec3 = _dereq_('../math/Vec3');

	/**
	 * Connects two bodies at given offset points.
	 * @class PointToPointConstraint
	 * @extends Constraint
	 * @constructor
	 * @param {Body} bodyA
	 * @param {Vec3} pivotA The point relative to the center of mass of bodyA which bodyA is constrained to.
	 * @param {Body} bodyB Body that will be constrained in a similar way to the same point as bodyA. We will therefore get a link between bodyA and bodyB. If not specified, bodyA will be constrained to a static point.
	 * @param {Vec3} pivotB See pivotA.
	 * @param {Number} maxForce The maximum force that should be applied to constrain the bodies.
	 *
	 * @example
	 *     var bodyA = new Body({ mass: 1 });
	 *     var bodyB = new Body({ mass: 1 });
	 *     bodyA.position.set(-1, 0, 0);
	 *     bodyB.position.set(1, 0, 0);
	 *     bodyA.addShape(shapeA);
	 *     bodyB.addShape(shapeB);
	 *     world.addBody(bodyA);
	 *     world.addBody(bodyB);
	 *     var localPivotA = new Vec3(1, 0, 0);
	 *     var localPivotB = new Vec3(-1, 0, 0);
	 *     var constraint = new PointToPointConstraint(bodyA, localPivotA, bodyB, localPivotB);
	 *     world.addConstraint(constraint);
	 */
	function PointToPointConstraint(bodyA,pivotA,bodyB,pivotB,maxForce){
	    Constraint.call(this,bodyA,bodyB);

	    maxForce = typeof(maxForce) !== 'undefined' ? maxForce : 1e6;

	    /**
	     * Pivot, defined locally in bodyA.
	     * @property {Vec3} pivotA
	     */
	    this.pivotA = pivotA ? pivotA.clone() : new Vec3();

	    /**
	     * Pivot, defined locally in bodyB.
	     * @property {Vec3} pivotB
	     */
	    this.pivotB = pivotB ? pivotB.clone() : new Vec3();

	    /**
	     * @property {ContactEquation} equationX
	     */
	    var x = this.equationX = new ContactEquation(bodyA,bodyB);

	    /**
	     * @property {ContactEquation} equationY
	     */
	    var y = this.equationY = new ContactEquation(bodyA,bodyB);

	    /**
	     * @property {ContactEquation} equationZ
	     */
	    var z = this.equationZ = new ContactEquation(bodyA,bodyB);

	    // Equations to be fed to the solver
	    this.equations.push(x, y, z);

	    // Make the equations bidirectional
	    x.minForce = y.minForce = z.minForce = -maxForce;
	    x.maxForce = y.maxForce = z.maxForce =  maxForce;

	    x.ni.set(1, 0, 0);
	    y.ni.set(0, 1, 0);
	    z.ni.set(0, 0, 1);
	}
	PointToPointConstraint.prototype = new Constraint();

	PointToPointConstraint.prototype.update = function(){
	    var bodyA = this.bodyA;
	    var bodyB = this.bodyB;
	    var x = this.equationX;
	    var y = this.equationY;
	    var z = this.equationZ;

	    // Rotate the pivots to world space
	    bodyA.quaternion.vmult(this.pivotA,x.ri);
	    bodyB.quaternion.vmult(this.pivotB,x.rj);

	    y.ri.copy(x.ri);
	    y.rj.copy(x.rj);
	    z.ri.copy(x.ri);
	    z.rj.copy(x.rj);
	};
	},{"../equations/ContactEquation":19,"../math/Vec3":30,"./Constraint":13}],18:[function(_dereq_,module,exports){
	module.exports = ConeEquation;

	var Vec3 = _dereq_('../math/Vec3');
	_dereq_('../math/Mat3');
	var Equation = _dereq_('./Equation');

	/**
	 * Cone equation. Works to keep the given body world vectors aligned, or tilted within a given angle from each other.
	 * @class ConeEquation
	 * @constructor
	 * @author schteppe
	 * @param {Body} bodyA
	 * @param {Body} bodyB
	 * @param {Vec3} [options.axisA] Local axis in A
	 * @param {Vec3} [options.axisB] Local axis in B
	 * @param {Vec3} [options.angle] The "cone angle" to keep
	 * @param {number} [options.maxForce=1e6]
	 * @extends Equation
	 */
	function ConeEquation(bodyA, bodyB, options){
	    options = options || {};
	    var maxForce = typeof(options.maxForce) !== 'undefined' ? options.maxForce : 1e6;

	    Equation.call(this,bodyA,bodyB,-maxForce, maxForce);

	    this.axisA = options.axisA ? options.axisA.clone() : new Vec3(1, 0, 0);
	    this.axisB = options.axisB ? options.axisB.clone() : new Vec3(0, 1, 0);

	    /**
	     * The cone angle to keep
	     * @property {number} angle
	     */
	    this.angle = typeof(options.angle) !== 'undefined' ? options.angle : 0;
	}

	ConeEquation.prototype = new Equation();
	ConeEquation.prototype.constructor = ConeEquation;

	var tmpVec1 = new Vec3();
	var tmpVec2 = new Vec3();

	ConeEquation.prototype.computeB = function(h){
	    var a = this.a,
	        b = this.b,

	        ni = this.axisA,
	        nj = this.axisB,

	        nixnj = tmpVec1,
	        njxni = tmpVec2,

	        GA = this.jacobianElementA,
	        GB = this.jacobianElementB;

	    // Caluclate cross products
	    ni.cross(nj, nixnj);
	    nj.cross(ni, njxni);

	    // The angle between two vector is:
	    // cos(theta) = a * b / (length(a) * length(b) = { len(a) = len(b) = 1 } = a * b

	    // g = a * b
	    // gdot = (b x a) * wi + (a x b) * wj
	    // G = [0 bxa 0 axb]
	    // W = [vi wi vj wj]
	    GA.rotational.copy(njxni);
	    GB.rotational.copy(nixnj);

	    var g = Math.cos(this.angle) - ni.dot(nj),
	        GW = this.computeGW(),
	        GiMf = this.computeGiMf();

	    var B = - g * a - GW * b - h * GiMf;

	    return B;
	};


	},{"../math/Mat3":27,"../math/Vec3":30,"./Equation":20}],19:[function(_dereq_,module,exports){
	module.exports = ContactEquation;

	var Equation = _dereq_('./Equation');
	var Vec3 = _dereq_('../math/Vec3');
	_dereq_('../math/Mat3');

	/**
	 * Contact/non-penetration constraint equation
	 * @class ContactEquation
	 * @constructor
	 * @author schteppe
	 * @param {Body} bodyA
	 * @param {Body} bodyB
	 * @extends Equation
	 */
	function ContactEquation(bodyA, bodyB, maxForce){
	    maxForce = typeof(maxForce) !== 'undefined' ? maxForce : 1e6;
	    Equation.call(this, bodyA, bodyB, 0, maxForce);

	    /**
	     * @property restitution
	     * @type {Number}
	     */
	    this.restitution = 0.0; // "bounciness": u1 = -e*u0

	    /**
	     * World-oriented vector that goes from the center of bi to the contact point.
	     * @property {Vec3} ri
	     */
	    this.ri = new Vec3();

	    /**
	     * World-oriented vector that starts in body j position and goes to the contact point.
	     * @property {Vec3} rj
	     */
	    this.rj = new Vec3();

	    /**
	     * Contact normal, pointing out of body i.
	     * @property {Vec3} ni
	     */
	    this.ni = new Vec3();
	}

	ContactEquation.prototype = new Equation();
	ContactEquation.prototype.constructor = ContactEquation;

	var ContactEquation_computeB_temp1 = new Vec3(); // Temp vectors
	var ContactEquation_computeB_temp2 = new Vec3();
	var ContactEquation_computeB_temp3 = new Vec3();
	ContactEquation.prototype.computeB = function(h){
	    var a = this.a,
	        b = this.b,
	        bi = this.bi,
	        bj = this.bj,
	        ri = this.ri,
	        rj = this.rj,
	        rixn = ContactEquation_computeB_temp1,
	        rjxn = ContactEquation_computeB_temp2,

	        vi = bi.velocity,
	        wi = bi.angularVelocity;
	        bi.force;
	        bi.torque;

	        var vj = bj.velocity,
	        wj = bj.angularVelocity;
	        bj.force;
	        bj.torque;

	        var penetrationVec = ContactEquation_computeB_temp3,

	        GA = this.jacobianElementA,
	        GB = this.jacobianElementB,

	        n = this.ni;

	    // Caluclate cross products
	    ri.cross(n,rixn);
	    rj.cross(n,rjxn);

	    // g = xj+rj -(xi+ri)
	    // G = [ -ni  -rixn  ni  rjxn ]
	    n.negate(GA.spatial);
	    rixn.negate(GA.rotational);
	    GB.spatial.copy(n);
	    GB.rotational.copy(rjxn);

	    // Calculate the penetration vector
	    penetrationVec.copy(bj.position);
	    penetrationVec.vadd(rj,penetrationVec);
	    penetrationVec.vsub(bi.position,penetrationVec);
	    penetrationVec.vsub(ri,penetrationVec);

	    var g = n.dot(penetrationVec);

	    // Compute iteration
	    var ePlusOne = this.restitution + 1;
	    var GW = ePlusOne * vj.dot(n) - ePlusOne * vi.dot(n) + wj.dot(rjxn) - wi.dot(rixn);
	    var GiMf = this.computeGiMf();

	    var B = - g * a - GW * b - h*GiMf;

	    return B;
	};

	var ContactEquation_getImpactVelocityAlongNormal_vi = new Vec3();
	var ContactEquation_getImpactVelocityAlongNormal_vj = new Vec3();
	var ContactEquation_getImpactVelocityAlongNormal_xi = new Vec3();
	var ContactEquation_getImpactVelocityAlongNormal_xj = new Vec3();
	var ContactEquation_getImpactVelocityAlongNormal_relVel = new Vec3();

	/**
	 * Get the current relative velocity in the contact point.
	 * @method getImpactVelocityAlongNormal
	 * @return {number}
	 */
	ContactEquation.prototype.getImpactVelocityAlongNormal = function(){
	    var vi = ContactEquation_getImpactVelocityAlongNormal_vi;
	    var vj = ContactEquation_getImpactVelocityAlongNormal_vj;
	    var xi = ContactEquation_getImpactVelocityAlongNormal_xi;
	    var xj = ContactEquation_getImpactVelocityAlongNormal_xj;
	    var relVel = ContactEquation_getImpactVelocityAlongNormal_relVel;

	    this.bi.position.vadd(this.ri, xi);
	    this.bj.position.vadd(this.rj, xj);

	    this.bi.getVelocityAtWorldPoint(xi, vi);
	    this.bj.getVelocityAtWorldPoint(xj, vj);

	    vi.vsub(vj, relVel);

	    return this.ni.dot(relVel);
	};


	},{"../math/Mat3":27,"../math/Vec3":30,"./Equation":20}],20:[function(_dereq_,module,exports){
	module.exports = Equation;

	var JacobianElement = _dereq_('../math/JacobianElement'),
	    Vec3 = _dereq_('../math/Vec3');

	/**
	 * Equation base class
	 * @class Equation
	 * @constructor
	 * @author schteppe
	 * @param {Body} bi
	 * @param {Body} bj
	 * @param {Number} minForce Minimum (read: negative max) force to be applied by the constraint.
	 * @param {Number} maxForce Maximum (read: positive max) force to be applied by the constraint.
	 */
	function Equation(bi,bj,minForce,maxForce){
	    this.id = Equation.id++;

	    /**
	     * @property {number} minForce
	     */
	    this.minForce = typeof(minForce)==="undefined" ? -1e6 : minForce;

	    /**
	     * @property {number} maxForce
	     */
	    this.maxForce = typeof(maxForce)==="undefined" ? 1e6 : maxForce;

	    /**
	     * @property bi
	     * @type {Body}
	     */
	    this.bi = bi;

	    /**
	     * @property bj
	     * @type {Body}
	     */
	    this.bj = bj;

	    /**
	     * SPOOK parameter
	     * @property {number} a
	     */
	    this.a = 0.0;

	    /**
	     * SPOOK parameter
	     * @property {number} b
	     */
	    this.b = 0.0;

	    /**
	     * SPOOK parameter
	     * @property {number} eps
	     */
	    this.eps = 0.0;

	    /**
	     * @property {JacobianElement} jacobianElementA
	     */
	    this.jacobianElementA = new JacobianElement();

	    /**
	     * @property {JacobianElement} jacobianElementB
	     */
	    this.jacobianElementB = new JacobianElement();

	    /**
	     * @property {boolean} enabled
	     * @default true
	     */
	    this.enabled = true;

	    // Set typical spook params
	    this.setSpookParams(1e7,4,1/60);
	}
	Equation.prototype.constructor = Equation;

	Equation.id = 0;

	/**
	 * Recalculates a,b,eps.
	 * @method setSpookParams
	 */
	Equation.prototype.setSpookParams = function(stiffness,relaxation,timeStep){
	    var d = relaxation,
	        k = stiffness,
	        h = timeStep;
	    this.a = 4.0 / (h * (1 + 4 * d));
	    this.b = (4.0 * d) / (1 + 4 * d);
	    this.eps = 4.0 / (h * h * k * (1 + 4 * d));
	};

	/**
	 * Computes the RHS of the SPOOK equation
	 * @method computeB
	 * @return {Number}
	 */
	Equation.prototype.computeB = function(a,b,h){
	    var GW = this.computeGW(),
	        Gq = this.computeGq(),
	        GiMf = this.computeGiMf();
	    return - Gq * a - GW * b - GiMf*h;
	};

	/**
	 * Computes G*q, where q are the generalized body coordinates
	 * @method computeGq
	 * @return {Number}
	 */
	Equation.prototype.computeGq = function(){
	    var GA = this.jacobianElementA,
	        GB = this.jacobianElementB,
	        bi = this.bi,
	        bj = this.bj,
	        xi = bi.position,
	        xj = bj.position;
	    return GA.spatial.dot(xi) + GB.spatial.dot(xj);
	};

	var zero = new Vec3();

	/**
	 * Computes G*W, where W are the body velocities
	 * @method computeGW
	 * @return {Number}
	 */
	Equation.prototype.computeGW = function(){
	    var GA = this.jacobianElementA,
	        GB = this.jacobianElementB,
	        bi = this.bi,
	        bj = this.bj,
	        vi = bi.velocity,
	        vj = bj.velocity,
	        wi = bi.angularVelocity || zero,
	        wj = bj.angularVelocity || zero;
	    return GA.multiplyVectors(vi,wi) + GB.multiplyVectors(vj,wj);
	};


	/**
	 * Computes G*Wlambda, where W are the body velocities
	 * @method computeGWlambda
	 * @return {Number}
	 */
	Equation.prototype.computeGWlambda = function(){
	    var GA = this.jacobianElementA,
	        GB = this.jacobianElementB,
	        bi = this.bi,
	        bj = this.bj,
	        vi = bi.vlambda,
	        vj = bj.vlambda,
	        wi = bi.wlambda || zero,
	        wj = bj.wlambda || zero;
	    return GA.multiplyVectors(vi,wi) + GB.multiplyVectors(vj,wj);
	};

	/**
	 * Computes G*inv(M)*f, where M is the mass matrix with diagonal blocks for each body, and f are the forces on the bodies.
	 * @method computeGiMf
	 * @return {Number}
	 */
	var iMfi = new Vec3(),
	    iMfj = new Vec3(),
	    invIi_vmult_taui = new Vec3(),
	    invIj_vmult_tauj = new Vec3();
	Equation.prototype.computeGiMf = function(){
	    var GA = this.jacobianElementA,
	        GB = this.jacobianElementB,
	        bi = this.bi,
	        bj = this.bj,
	        fi = bi.force,
	        ti = bi.torque,
	        fj = bj.force,
	        tj = bj.torque,
	        invMassi = bi.invMassSolve,
	        invMassj = bj.invMassSolve;

	    if(bi.invInertiaWorldSolve){ bi.invInertiaWorldSolve.vmult(ti,invIi_vmult_taui); }
	    else { invIi_vmult_taui.set(0,0,0); }
	    if(bj.invInertiaWorldSolve){ bj.invInertiaWorldSolve.vmult(tj,invIj_vmult_tauj); }
	    else { invIj_vmult_tauj.set(0,0,0); }

	    fi.mult(invMassi,iMfi);
	    fj.mult(invMassj,iMfj);

	    return GA.multiplyVectors(iMfi,invIi_vmult_taui) + GB.multiplyVectors(iMfj,invIj_vmult_tauj);
	};

	/**
	 * Computes G*inv(M)*G'
	 * @method computeGiMGt
	 * @return {Number}
	 */
	var tmp = new Vec3();
	Equation.prototype.computeGiMGt = function(){
	    var GA = this.jacobianElementA,
	        GB = this.jacobianElementB,
	        bi = this.bi,
	        bj = this.bj,
	        invMassi = bi.invMassSolve,
	        invMassj = bj.invMassSolve,
	        invIi = bi.invInertiaWorldSolve,
	        invIj = bj.invInertiaWorldSolve,
	        result = invMassi + invMassj;

	    if(invIi){
	        invIi.vmult(GA.rotational,tmp);
	        result += tmp.dot(GA.rotational);
	    }

	    if(invIj){
	        invIj.vmult(GB.rotational,tmp);
	        result += tmp.dot(GB.rotational);
	    }

	    return  result;
	};

	var addToWlambda_temp = new Vec3();
	    new Vec3();
	    new Vec3();
	    new Vec3();
	    new Vec3();
	    new Vec3();

	/**
	 * Add constraint velocity to the bodies.
	 * @method addToWlambda
	 * @param {Number} deltalambda
	 */
	Equation.prototype.addToWlambda = function(deltalambda){
	    var GA = this.jacobianElementA,
	        GB = this.jacobianElementB,
	        bi = this.bi,
	        bj = this.bj,
	        temp = addToWlambda_temp;

	    // Add to linear velocity
	    // v_lambda += inv(M) * delta_lamba * G
	    GA.spatial.mult(bi.invMassSolve * deltalambda,temp);
	    bi.vlambda.vadd(temp, bi.vlambda);

	    GB.spatial.mult(bj.invMassSolve * deltalambda,temp);
	    bj.vlambda.vadd(temp, bj.vlambda);

	    // Add to angular velocity
	    if(bi.invInertiaWorldSolve){
	        bi.invInertiaWorldSolve.vmult(GA.rotational,temp);
	        temp.mult(deltalambda,temp);
	        bi.wlambda.vadd(temp,bi.wlambda);
	    }

	    if(bj.invInertiaWorldSolve){
	        bj.invInertiaWorldSolve.vmult(GB.rotational,temp);
	        temp.mult(deltalambda,temp);
	        bj.wlambda.vadd(temp,bj.wlambda);
	    }
	};

	/**
	 * Compute the denominator part of the SPOOK equation: C = G*inv(M)*G' + eps
	 * @method computeInvC
	 * @param  {Number} eps
	 * @return {Number}
	 */
	Equation.prototype.computeC = function(){
	    return this.computeGiMGt() + this.eps;
	};

	},{"../math/JacobianElement":26,"../math/Vec3":30}],21:[function(_dereq_,module,exports){
	module.exports = FrictionEquation;

	var Equation = _dereq_('./Equation');
	var Vec3 = _dereq_('../math/Vec3');
	_dereq_('../math/Mat3');

	/**
	 * Constrains the slipping in a contact along a tangent
	 * @class FrictionEquation
	 * @constructor
	 * @author schteppe
	 * @param {Body} bodyA
	 * @param {Body} bodyB
	 * @param {Number} slipForce should be +-F_friction = +-mu * F_normal = +-mu * m * g
	 * @extends Equation
	 */
	function FrictionEquation(bodyA, bodyB, slipForce){
	    Equation.call(this,bodyA, bodyB, -slipForce, slipForce);
	    this.ri = new Vec3();
	    this.rj = new Vec3();
	    this.t = new Vec3(); // tangent
	}

	FrictionEquation.prototype = new Equation();
	FrictionEquation.prototype.constructor = FrictionEquation;

	var FrictionEquation_computeB_temp1 = new Vec3();
	var FrictionEquation_computeB_temp2 = new Vec3();
	FrictionEquation.prototype.computeB = function(h){
	    this.a;
	        var b = this.b;
	        this.bi;
	        this.bj;
	        var ri = this.ri,
	        rj = this.rj,
	        rixt = FrictionEquation_computeB_temp1,
	        rjxt = FrictionEquation_computeB_temp2,
	        t = this.t;

	    // Caluclate cross products
	    ri.cross(t,rixt);
	    rj.cross(t,rjxt);

	    // G = [-t -rixt t rjxt]
	    // And remember, this is a pure velocity constraint, g is always zero!
	    var GA = this.jacobianElementA,
	        GB = this.jacobianElementB;
	    t.negate(GA.spatial);
	    rixt.negate(GA.rotational);
	    GB.spatial.copy(t);
	    GB.rotational.copy(rjxt);

	    var GW = this.computeGW();
	    var GiMf = this.computeGiMf();

	    var B = - GW * b - h * GiMf;

	    return B;
	};

	},{"../math/Mat3":27,"../math/Vec3":30,"./Equation":20}],22:[function(_dereq_,module,exports){
	module.exports = RotationalEquation;

	var Vec3 = _dereq_('../math/Vec3');
	_dereq_('../math/Mat3');
	var Equation = _dereq_('./Equation');

	/**
	 * Rotational constraint. Works to keep the local vectors orthogonal to each other in world space.
	 * @class RotationalEquation
	 * @constructor
	 * @author schteppe
	 * @param {Body} bodyA
	 * @param {Body} bodyB
	 * @param {Vec3} [options.axisA]
	 * @param {Vec3} [options.axisB]
	 * @param {number} [options.maxForce]
	 * @extends Equation
	 */
	function RotationalEquation(bodyA, bodyB, options){
	    options = options || {};
	    var maxForce = typeof(options.maxForce) !== 'undefined' ? options.maxForce : 1e6;

	    Equation.call(this,bodyA,bodyB,-maxForce, maxForce);

	    this.axisA = options.axisA ? options.axisA.clone() : new Vec3(1, 0, 0);
	    this.axisB = options.axisB ? options.axisB.clone() : new Vec3(0, 1, 0);

	    this.maxAngle = Math.PI / 2;
	}

	RotationalEquation.prototype = new Equation();
	RotationalEquation.prototype.constructor = RotationalEquation;

	var tmpVec1 = new Vec3();
	var tmpVec2 = new Vec3();

	RotationalEquation.prototype.computeB = function(h){
	    var a = this.a,
	        b = this.b,

	        ni = this.axisA,
	        nj = this.axisB,

	        nixnj = tmpVec1,
	        njxni = tmpVec2,

	        GA = this.jacobianElementA,
	        GB = this.jacobianElementB;

	    // Caluclate cross products
	    ni.cross(nj, nixnj);
	    nj.cross(ni, njxni);

	    // g = ni * nj
	    // gdot = (nj x ni) * wi + (ni x nj) * wj
	    // G = [0 njxni 0 nixnj]
	    // W = [vi wi vj wj]
	    GA.rotational.copy(njxni);
	    GB.rotational.copy(nixnj);

	    var g = Math.cos(this.maxAngle) - ni.dot(nj),
	        GW = this.computeGW(),
	        GiMf = this.computeGiMf();

	    var B = - g * a - GW * b - h * GiMf;

	    return B;
	};


	},{"../math/Mat3":27,"../math/Vec3":30,"./Equation":20}],23:[function(_dereq_,module,exports){
	module.exports = RotationalMotorEquation;

	var Vec3 = _dereq_('../math/Vec3');
	_dereq_('../math/Mat3');
	var Equation = _dereq_('./Equation');

	/**
	 * Rotational motor constraint. Tries to keep the relative angular velocity of the bodies to a given value.
	 * @class RotationalMotorEquation
	 * @constructor
	 * @author schteppe
	 * @param {Body} bodyA
	 * @param {Body} bodyB
	 * @param {Number} maxForce
	 * @extends Equation
	 */
	function RotationalMotorEquation(bodyA, bodyB, maxForce){
	    maxForce = typeof(maxForce)!=='undefined' ? maxForce : 1e6;
	    Equation.call(this,bodyA,bodyB,-maxForce,maxForce);

	    /**
	     * World oriented rotational axis
	     * @property {Vec3} axisA
	     */
	    this.axisA = new Vec3();

	    /**
	     * World oriented rotational axis
	     * @property {Vec3} axisB
	     */
	    this.axisB = new Vec3(); // World oriented rotational axis

	    /**
	     * Motor velocity
	     * @property {Number} targetVelocity
	     */
	    this.targetVelocity = 0;
	}

	RotationalMotorEquation.prototype = new Equation();
	RotationalMotorEquation.prototype.constructor = RotationalMotorEquation;

	RotationalMotorEquation.prototype.computeB = function(h){
	    this.a;
	        var b = this.b;
	        this.bi;
	        this.bj;

	        var axisA = this.axisA,
	        axisB = this.axisB,

	        GA = this.jacobianElementA,
	        GB = this.jacobianElementB;

	    // g = 0
	    // gdot = axisA * wi - axisB * wj
	    // gdot = G * W = G * [vi wi vj wj]
	    // =>
	    // G = [0 axisA 0 -axisB]

	    GA.rotational.copy(axisA);
	    axisB.negate(GB.rotational);

	    var GW = this.computeGW() - this.targetVelocity,
	        GiMf = this.computeGiMf();

	    var B = - GW * b - h * GiMf;

	    return B;
	};

	},{"../math/Mat3":27,"../math/Vec3":30,"./Equation":20}],24:[function(_dereq_,module,exports){
	var Utils = _dereq_('../utils/Utils');

	module.exports = ContactMaterial;

	/**
	 * Defines what happens when two materials meet.
	 * @class ContactMaterial
	 * @constructor
	 * @param {Material} m1
	 * @param {Material} m2
	 * @param {object} [options]
	 * @param {Number} [options.friction=0.3]
	 * @param {Number} [options.restitution=0.3]
	 * @param {number} [options.contactEquationStiffness=1e7]
	 * @param {number} [options.contactEquationRelaxation=3]
	 * @param {number} [options.frictionEquationStiffness=1e7]
	 * @param {Number} [options.frictionEquationRelaxation=3]
	 */
	function ContactMaterial(m1, m2, options){
	    options = Utils.defaults(options, {
	        friction: 0.3,
	        restitution: 0.3,
	        contactEquationStiffness: 1e7,
	        contactEquationRelaxation: 3,
	        frictionEquationStiffness: 1e7,
	        frictionEquationRelaxation: 3
	    });

	    /**
	     * Identifier of this material
	     * @property {Number} id
	     */
	    this.id = ContactMaterial.idCounter++;

	    /**
	     * Participating materials
	     * @property {Array} materials
	     * @todo  Should be .materialA and .materialB instead
	     */
	    this.materials = [m1, m2];

	    /**
	     * Friction coefficient
	     * @property {Number} friction
	     */
	    this.friction = options.friction;

	    /**
	     * Restitution coefficient
	     * @property {Number} restitution
	     */
	    this.restitution = options.restitution;

	    /**
	     * Stiffness of the produced contact equations
	     * @property {Number} contactEquationStiffness
	     */
	    this.contactEquationStiffness = options.contactEquationStiffness;

	    /**
	     * Relaxation time of the produced contact equations
	     * @property {Number} contactEquationRelaxation
	     */
	    this.contactEquationRelaxation = options.contactEquationRelaxation;

	    /**
	     * Stiffness of the produced friction equations
	     * @property {Number} frictionEquationStiffness
	     */
	    this.frictionEquationStiffness = options.frictionEquationStiffness;

	    /**
	     * Relaxation time of the produced friction equations
	     * @property {Number} frictionEquationRelaxation
	     */
	    this.frictionEquationRelaxation = options.frictionEquationRelaxation;
	}

	ContactMaterial.idCounter = 0;

	},{"../utils/Utils":53}],25:[function(_dereq_,module,exports){
	module.exports = Material;

	/**
	 * Defines a physics material.
	 * @class Material
	 * @constructor
	 * @param {object} [options]
	 * @author schteppe
	 */
	function Material(options){
	    var name = '';
	    options = options || {};

	    // Backwards compatibility fix
	    if(typeof(options) === 'string'){
	        name = options;
	        options = {};
	    } else if(typeof(options) === 'object') {
	        name = '';
	    }

	    /**
	     * @property name
	     * @type {String}
	     */
	    this.name = name;

	    /**
	     * material id.
	     * @property id
	     * @type {number}
	     */
	    this.id = Material.idCounter++;

	    /**
	     * Friction for this material. If non-negative, it will be used instead of the friction given by ContactMaterials. If there's no matching ContactMaterial, the value from .defaultContactMaterial in the World will be used.
	     * @property {number} friction
	     */
	    this.friction = typeof(options.friction) !== 'undefined' ? options.friction : -1;

	    /**
	     * Restitution for this material. If non-negative, it will be used instead of the restitution given by ContactMaterials. If there's no matching ContactMaterial, the value from .defaultContactMaterial in the World will be used.
	     * @property {number} restitution
	     */
	    this.restitution = typeof(options.restitution) !== 'undefined' ? options.restitution : -1;
	}

	Material.idCounter = 0;

	},{}],26:[function(_dereq_,module,exports){
	module.exports = JacobianElement;

	var Vec3 = _dereq_('./Vec3');

	/**
	 * An element containing 6 entries, 3 spatial and 3 rotational degrees of freedom.
	 * @class JacobianElement
	 * @constructor
	 */
	function JacobianElement(){

	    /**
	     * @property {Vec3} spatial
	     */
	    this.spatial = new Vec3();

	    /**
	     * @property {Vec3} rotational
	     */
	    this.rotational = new Vec3();
	}

	/**
	 * Multiply with other JacobianElement
	 * @method multiplyElement
	 * @param  {JacobianElement} element
	 * @return {Number}
	 */
	JacobianElement.prototype.multiplyElement = function(element){
	    return element.spatial.dot(this.spatial) + element.rotational.dot(this.rotational);
	};

	/**
	 * Multiply with two vectors
	 * @method multiplyVectors
	 * @param  {Vec3} spatial
	 * @param  {Vec3} rotational
	 * @return {Number}
	 */
	JacobianElement.prototype.multiplyVectors = function(spatial,rotational){
	    return spatial.dot(this.spatial) + rotational.dot(this.rotational);
	};

	},{"./Vec3":30}],27:[function(_dereq_,module,exports){
	module.exports = Mat3;

	var Vec3 = _dereq_('./Vec3');

	/**
	 * A 3x3 matrix.
	 * @class Mat3
	 * @constructor
	 * @param array elements Array of nine elements. Optional.
	 * @author schteppe / http://github.com/schteppe
	 */
	function Mat3(elements){
	    /**
	     * A vector of length 9, containing all matrix elements
	     * @property {Array} elements
	     */
	    if(elements){
	        this.elements = elements;
	    } else {
	        this.elements = [0,0,0,0,0,0,0,0,0];
	    }
	}

	/**
	 * Sets the matrix to identity
	 * @method identity
	 * @todo Should perhaps be renamed to setIdentity() to be more clear.
	 * @todo Create another function that immediately creates an identity matrix eg. eye()
	 */
	Mat3.prototype.identity = function(){
	    var e = this.elements;
	    e[0] = 1;
	    e[1] = 0;
	    e[2] = 0;

	    e[3] = 0;
	    e[4] = 1;
	    e[5] = 0;

	    e[6] = 0;
	    e[7] = 0;
	    e[8] = 1;
	};

	/**
	 * Set all elements to zero
	 * @method setZero
	 */
	Mat3.prototype.setZero = function(){
	    var e = this.elements;
	    e[0] = 0;
	    e[1] = 0;
	    e[2] = 0;
	    e[3] = 0;
	    e[4] = 0;
	    e[5] = 0;
	    e[6] = 0;
	    e[7] = 0;
	    e[8] = 0;
	};

	/**
	 * Sets the matrix diagonal elements from a Vec3
	 * @method setTrace
	 * @param {Vec3} vec3
	 */
	Mat3.prototype.setTrace = function(vec3){
	    var e = this.elements;
	    e[0] = vec3.x;
	    e[4] = vec3.y;
	    e[8] = vec3.z;
	};

	/**
	 * Gets the matrix diagonal elements
	 * @method getTrace
	 * @return {Vec3}
	 */
	Mat3.prototype.getTrace = function(target){
	    var target = target || new Vec3();
	    var e = this.elements;
	    target.x = e[0];
	    target.y = e[4];
	    target.z = e[8];
	};

	/**
	 * Matrix-Vector multiplication
	 * @method vmult
	 * @param {Vec3} v The vector to multiply with
	 * @param {Vec3} target Optional, target to save the result in.
	 */
	Mat3.prototype.vmult = function(v,target){
	    target = target || new Vec3();

	    var e = this.elements,
	        x = v.x,
	        y = v.y,
	        z = v.z;
	    target.x = e[0]*x + e[1]*y + e[2]*z;
	    target.y = e[3]*x + e[4]*y + e[5]*z;
	    target.z = e[6]*x + e[7]*y + e[8]*z;

	    return target;
	};

	/**
	 * Matrix-scalar multiplication
	 * @method smult
	 * @param {Number} s
	 */
	Mat3.prototype.smult = function(s){
	    for(var i=0; i<this.elements.length; i++){
	        this.elements[i] *= s;
	    }
	};

	/**
	 * Matrix multiplication
	 * @method mmult
	 * @param {Mat3} m Matrix to multiply with from left side.
	 * @return {Mat3} The result.
	 */
	Mat3.prototype.mmult = function(m,target){
	    var r = target || new Mat3();
	    for(var i=0; i<3; i++){
	        for(var j=0; j<3; j++){
	            var sum = 0.0;
	            for(var k=0; k<3; k++){
	                sum += m.elements[i+k*3] * this.elements[k+j*3];
	            }
	            r.elements[i+j*3] = sum;
	        }
	    }
	    return r;
	};

	/**
	 * Scale each column of the matrix
	 * @method scale
	 * @param {Vec3} v
	 * @return {Mat3} The result.
	 */
	Mat3.prototype.scale = function(v,target){
	    target = target || new Mat3();
	    var e = this.elements,
	        t = target.elements;
	    for(var i=0; i!==3; i++){
	        t[3*i + 0] = v.x * e[3*i + 0];
	        t[3*i + 1] = v.y * e[3*i + 1];
	        t[3*i + 2] = v.z * e[3*i + 2];
	    }
	    return target;
	};

	/**
	 * Solve Ax=b
	 * @method solve
	 * @param {Vec3} b The right hand side
	 * @param {Vec3} target Optional. Target vector to save in.
	 * @return {Vec3} The solution x
	 * @todo should reuse arrays
	 */
	Mat3.prototype.solve = function(b,target){
	    target = target || new Vec3();

	    // Construct equations
	    var nr = 3; // num rows
	    var nc = 4; // num cols
	    var eqns = [];
	    for(var i=0; i<nr*nc; i++){
	        eqns.push(0);
	    }
	    var i,j;
	    for(i=0; i<3; i++){
	        for(j=0; j<3; j++){
	            eqns[i+nc*j] = this.elements[i+3*j];
	        }
	    }
	    eqns[3+4*0] = b.x;
	    eqns[3+4*1] = b.y;
	    eqns[3+4*2] = b.z;

	    // Compute right upper triangular version of the matrix - Gauss elimination
	    var n = 3, k = n, np;
	    var kp = 4; // num rows
	    var p;
	    do {
	        i = k - n;
	        if (eqns[i+nc*i] === 0) {
	            // the pivot is null, swap lines
	            for (j = i + 1; j < k; j++) {
	                if (eqns[i+nc*j] !== 0) {
	                    np = kp;
	                    do {  // do ligne( i ) = ligne( i ) + ligne( k )
	                        p = kp - np;
	                        eqns[p+nc*i] += eqns[p+nc*j];
	                    } while (--np);
	                    break;
	                }
	            }
	        }
	        if (eqns[i+nc*i] !== 0) {
	            for (j = i + 1; j < k; j++) {
	                var multiplier = eqns[i+nc*j] / eqns[i+nc*i];
	                np = kp;
	                do {  // do ligne( k ) = ligne( k ) - multiplier * ligne( i )
	                    p = kp - np;
	                    eqns[p+nc*j] = p <= i ? 0 : eqns[p+nc*j] - eqns[p+nc*i] * multiplier ;
	                } while (--np);
	            }
	        }
	    } while (--n);

	    // Get the solution
	    target.z = eqns[2*nc+3] / eqns[2*nc+2];
	    target.y = (eqns[1*nc+3] - eqns[1*nc+2]*target.z) / eqns[1*nc+1];
	    target.x = (eqns[0*nc+3] - eqns[0*nc+2]*target.z - eqns[0*nc+1]*target.y) / eqns[0*nc+0];

	    if(isNaN(target.x) || isNaN(target.y) || isNaN(target.z) || target.x===Infinity || target.y===Infinity || target.z===Infinity){
	        throw "Could not solve equation! Got x=["+target.toString()+"], b=["+b.toString()+"], A=["+this.toString()+"]";
	    }

	    return target;
	};

	/**
	 * Get an element in the matrix by index. Index starts at 0, not 1!!!
	 * @method e
	 * @param {Number} row
	 * @param {Number} column
	 * @param {Number} value Optional. If provided, the matrix element will be set to this value.
	 * @return {Number}
	 */
	Mat3.prototype.e = function( row , column ,value){
	    if(value===undefined){
	        return this.elements[column+3*row];
	    } else {
	        // Set value
	        this.elements[column+3*row] = value;
	    }
	};

	/**
	 * Copy another matrix into this matrix object.
	 * @method copy
	 * @param {Mat3} source
	 * @return {Mat3} this
	 */
	Mat3.prototype.copy = function(source){
	    for(var i=0; i < source.elements.length; i++){
	        this.elements[i] = source.elements[i];
	    }
	    return this;
	};

	/**
	 * Returns a string representation of the matrix.
	 * @method toString
	 * @return string
	 */
	Mat3.prototype.toString = function(){
	    var r = "";
	    var sep = ",";
	    for(var i=0; i<9; i++){
	        r += this.elements[i] + sep;
	    }
	    return r;
	};

	/**
	 * reverse the matrix
	 * @method reverse
	 * @param {Mat3} target Optional. Target matrix to save in.
	 * @return {Mat3} The solution x
	 */
	Mat3.prototype.reverse = function(target){

	    target = target || new Mat3();

	    // Construct equations
	    var nr = 3; // num rows
	    var nc = 6; // num cols
	    var eqns = [];
	    for(var i=0; i<nr*nc; i++){
	        eqns.push(0);
	    }
	    var i,j;
	    for(i=0; i<3; i++){
	        for(j=0; j<3; j++){
	            eqns[i+nc*j] = this.elements[i+3*j];
	        }
	    }
	    eqns[3+6*0] = 1;
	    eqns[3+6*1] = 0;
	    eqns[3+6*2] = 0;
	    eqns[4+6*0] = 0;
	    eqns[4+6*1] = 1;
	    eqns[4+6*2] = 0;
	    eqns[5+6*0] = 0;
	    eqns[5+6*1] = 0;
	    eqns[5+6*2] = 1;

	    // Compute right upper triangular version of the matrix - Gauss elimination
	    var n = 3, k = n, np;
	    var kp = nc; // num rows
	    var p;
	    do {
	        i = k - n;
	        if (eqns[i+nc*i] === 0) {
	            // the pivot is null, swap lines
	            for (j = i + 1; j < k; j++) {
	                if (eqns[i+nc*j] !== 0) {
	                    np = kp;
	                    do { // do line( i ) = line( i ) + line( k )
	                        p = kp - np;
	                        eqns[p+nc*i] += eqns[p+nc*j];
	                    } while (--np);
	                    break;
	                }
	            }
	        }
	        if (eqns[i+nc*i] !== 0) {
	            for (j = i + 1; j < k; j++) {
	                var multiplier = eqns[i+nc*j] / eqns[i+nc*i];
	                np = kp;
	                do { // do line( k ) = line( k ) - multiplier * line( i )
	                    p = kp - np;
	                    eqns[p+nc*j] = p <= i ? 0 : eqns[p+nc*j] - eqns[p+nc*i] * multiplier ;
	                } while (--np);
	            }
	        }
	    } while (--n);

	    // eliminate the upper left triangle of the matrix
	    i = 2;
	    do {
	        j = i-1;
	        do {
	            var multiplier = eqns[i+nc*j] / eqns[i+nc*i];
	            np = nc;
	            do {
	                p = nc - np;
	                eqns[p+nc*j] =  eqns[p+nc*j] - eqns[p+nc*i] * multiplier ;
	            } while (--np);
	        } while (j--);
	    } while (--i);

	    // operations on the diagonal
	    i = 2;
	    do {
	        var multiplier = 1 / eqns[i+nc*i];
	        np = nc;
	        do {
	            p = nc - np;
	            eqns[p+nc*i] = eqns[p+nc*i] * multiplier ;
	        } while (--np);
	    } while (i--);

	    i = 2;
	    do {
	        j = 2;
	        do {
	            p = eqns[nr+j+nc*i];
	            if( isNaN( p ) || p ===Infinity ){
	                throw "Could not reverse! A=["+this.toString()+"]";
	            }
	            target.e( i , j , p );
	        } while (j--);
	    } while (i--);

	    return target;
	};

	/**
	 * Set the matrix from a quaterion
	 * @method setRotationFromQuaternion
	 * @param {Quaternion} q
	 */
	Mat3.prototype.setRotationFromQuaternion = function( q ) {
	    var x = q.x, y = q.y, z = q.z, w = q.w,
	        x2 = x + x, y2 = y + y, z2 = z + z,
	        xx = x * x2, xy = x * y2, xz = x * z2,
	        yy = y * y2, yz = y * z2, zz = z * z2,
	        wx = w * x2, wy = w * y2, wz = w * z2,
	        e = this.elements;

	    e[3*0 + 0] = 1 - ( yy + zz );
	    e[3*0 + 1] = xy - wz;
	    e[3*0 + 2] = xz + wy;

	    e[3*1 + 0] = xy + wz;
	    e[3*1 + 1] = 1 - ( xx + zz );
	    e[3*1 + 2] = yz - wx;

	    e[3*2 + 0] = xz - wy;
	    e[3*2 + 1] = yz + wx;
	    e[3*2 + 2] = 1 - ( xx + yy );

	    return this;
	};

	/**
	 * Transpose the matrix
	 * @method transpose
	 * @param  {Mat3} target Where to store the result.
	 * @return {Mat3} The target Mat3, or a new Mat3 if target was omitted.
	 */
	Mat3.prototype.transpose = function( target ) {
	    target = target || new Mat3();

	    var Mt = target.elements,
	        M = this.elements;

	    for(var i=0; i!==3; i++){
	        for(var j=0; j!==3; j++){
	            Mt[3*i + j] = M[3*j + i];
	        }
	    }

	    return target;
	};

	},{"./Vec3":30}],28:[function(_dereq_,module,exports){
	module.exports = Quaternion;

	var Vec3 = _dereq_('./Vec3');

	/**
	 * A Quaternion describes a rotation in 3D space. The Quaternion is mathematically defined as Q = x*i + y*j + z*k + w, where (i,j,k) are imaginary basis vectors. (x,y,z) can be seen as a vector related to the axis of rotation, while the real multiplier, w, is related to the amount of rotation.
	 * @class Quaternion
	 * @constructor
	 * @param {Number} x Multiplier of the imaginary basis vector i.
	 * @param {Number} y Multiplier of the imaginary basis vector j.
	 * @param {Number} z Multiplier of the imaginary basis vector k.
	 * @param {Number} w Multiplier of the real part.
	 * @see http://en.wikipedia.org/wiki/Quaternion
	 */
	function Quaternion(x,y,z,w){
	    /**
	     * @property {Number} x
	     */
	    this.x = x!==undefined ? x : 0;

	    /**
	     * @property {Number} y
	     */
	    this.y = y!==undefined ? y : 0;

	    /**
	     * @property {Number} z
	     */
	    this.z = z!==undefined ? z : 0;

	    /**
	     * The multiplier of the real quaternion basis vector.
	     * @property {Number} w
	     */
	    this.w = w!==undefined ? w : 1;
	}

	/**
	 * Set the value of the quaternion.
	 * @method set
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} z
	 * @param {Number} w
	 */
	Quaternion.prototype.set = function(x,y,z,w){
	    this.x = x;
	    this.y = y;
	    this.z = z;
	    this.w = w;
	};

	/**
	 * Convert to a readable format
	 * @method toString
	 * @return string
	 */
	Quaternion.prototype.toString = function(){
	    return this.x+","+this.y+","+this.z+","+this.w;
	};

	/**
	 * Convert to an Array
	 * @method toArray
	 * @return Array
	 */
	Quaternion.prototype.toArray = function(){
	    return [this.x, this.y, this.z, this.w];
	};

	/**
	 * Set the quaternion components given an axis and an angle.
	 * @method setFromAxisAngle
	 * @param {Vec3} axis
	 * @param {Number} angle in radians
	 */
	Quaternion.prototype.setFromAxisAngle = function(axis,angle){
	    var s = Math.sin(angle*0.5);
	    this.x = axis.x * s;
	    this.y = axis.y * s;
	    this.z = axis.z * s;
	    this.w = Math.cos(angle*0.5);
	};

	/**
	 * Converts the quaternion to axis/angle representation.
	 * @method toAxisAngle
	 * @param {Vec3} targetAxis Optional. A vector object to reuse for storing the axis.
	 * @return Array An array, first elemnt is the axis and the second is the angle in radians.
	 */
	Quaternion.prototype.toAxisAngle = function(targetAxis){
	    targetAxis = targetAxis || new Vec3();
	    this.normalize(); // if w>1 acos and sqrt will produce errors, this cant happen if quaternion is normalised
	    var angle = 2 * Math.acos(this.w);
	    var s = Math.sqrt(1-this.w*this.w); // assuming quaternion normalised then w is less than 1, so term always positive.
	    if (s < 0.001) { // test to avoid divide by zero, s is always positive due to sqrt
	        // if s close to zero then direction of axis not important
	        targetAxis.x = this.x; // if it is important that axis is normalised then replace with x=1; y=z=0;
	        targetAxis.y = this.y;
	        targetAxis.z = this.z;
	    } else {
	        targetAxis.x = this.x / s; // normalise axis
	        targetAxis.y = this.y / s;
	        targetAxis.z = this.z / s;
	    }
	    return [targetAxis,angle];
	};

	var sfv_t1 = new Vec3(),
	    sfv_t2 = new Vec3();

	/**
	 * Set the quaternion value given two vectors. The resulting rotation will be the needed rotation to rotate u to v.
	 * @method setFromVectors
	 * @param {Vec3} u
	 * @param {Vec3} v
	 */
	Quaternion.prototype.setFromVectors = function(u,v){
	    if(u.isAntiparallelTo(v)){
	        var t1 = sfv_t1;
	        var t2 = sfv_t2;

	        u.tangents(t1,t2);
	        this.setFromAxisAngle(t1,Math.PI);
	    } else {
	        var a = u.cross(v);
	        this.x = a.x;
	        this.y = a.y;
	        this.z = a.z;
	        this.w = Math.sqrt(Math.pow(u.norm(),2) * Math.pow(v.norm(),2)) + u.dot(v);
	        this.normalize();
	    }
	};

	/**
	 * Quaternion multiplication
	 * @method mult
	 * @param {Quaternion} q
	 * @param {Quaternion} target Optional.
	 * @return {Quaternion}
	 */
	var Quaternion_mult_va = new Vec3();
	var Quaternion_mult_vb = new Vec3();
	var Quaternion_mult_vaxvb = new Vec3();
	Quaternion.prototype.mult = function(q,target){
	    target = target || new Quaternion();
	    var w = this.w,
	        va = Quaternion_mult_va,
	        vb = Quaternion_mult_vb,
	        vaxvb = Quaternion_mult_vaxvb;

	    va.set(this.x,this.y,this.z);
	    vb.set(q.x,q.y,q.z);
	    target.w = w*q.w - va.dot(vb);
	    va.cross(vb,vaxvb);

	    target.x = w * vb.x + q.w*va.x + vaxvb.x;
	    target.y = w * vb.y + q.w*va.y + vaxvb.y;
	    target.z = w * vb.z + q.w*va.z + vaxvb.z;

	    return target;
	};

	/**
	 * Get the inverse quaternion rotation.
	 * @method inverse
	 * @param {Quaternion} target
	 * @return {Quaternion}
	 */
	Quaternion.prototype.inverse = function(target){
	    var x = this.x, y = this.y, z = this.z, w = this.w;
	    target = target || new Quaternion();

	    this.conjugate(target);
	    var inorm2 = 1/(x*x + y*y + z*z + w*w);
	    target.x *= inorm2;
	    target.y *= inorm2;
	    target.z *= inorm2;
	    target.w *= inorm2;

	    return target;
	};

	/**
	 * Get the quaternion conjugate
	 * @method conjugate
	 * @param {Quaternion} target
	 * @return {Quaternion}
	 */
	Quaternion.prototype.conjugate = function(target){
	    target = target || new Quaternion();

	    target.x = -this.x;
	    target.y = -this.y;
	    target.z = -this.z;
	    target.w = this.w;

	    return target;
	};

	/**
	 * Normalize the quaternion. Note that this changes the values of the quaternion.
	 * @method normalize
	 */
	Quaternion.prototype.normalize = function(){
	    var l = Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w);
	    if ( l === 0 ) {
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
	};

	/**
	 * Approximation of quaternion normalization. Works best when quat is already almost-normalized.
	 * @method normalizeFast
	 * @see http://jsperf.com/fast-quaternion-normalization
	 * @author unphased, https://github.com/unphased
	 */
	Quaternion.prototype.normalizeFast = function () {
	    var f = (3.0-(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w))/2.0;
	    if ( f === 0 ) {
	        this.x = 0;
	        this.y = 0;
	        this.z = 0;
	        this.w = 0;
	    } else {
	        this.x *= f;
	        this.y *= f;
	        this.z *= f;
	        this.w *= f;
	    }
	};

	/**
	 * Multiply the quaternion by a vector
	 * @method vmult
	 * @param {Vec3} v
	 * @param {Vec3} target Optional
	 * @return {Vec3}
	 */
	Quaternion.prototype.vmult = function(v,target){
	    target = target || new Vec3();

	    var x = v.x,
	        y = v.y,
	        z = v.z;

	    var qx = this.x,
	        qy = this.y,
	        qz = this.z,
	        qw = this.w;

	    // q*v
	    var ix =  qw * x + qy * z - qz * y,
	    iy =  qw * y + qz * x - qx * z,
	    iz =  qw * z + qx * y - qy * x,
	    iw = -qx * x - qy * y - qz * z;

	    target.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
	    target.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
	    target.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;

	    return target;
	};

	/**
	 * Copies value of source to this quaternion.
	 * @method copy
	 * @param {Quaternion} source
	 * @return {Quaternion} this
	 */
	Quaternion.prototype.copy = function(source){
	    this.x = source.x;
	    this.y = source.y;
	    this.z = source.z;
	    this.w = source.w;
	    return this;
	};

	/**
	 * Convert the quaternion to euler angle representation. Order: YZX, as this page describes: http://www.euclideanspace.com/maths/standards/index.htm
	 * @method toEuler
	 * @param {Vec3} target
	 * @param string order Three-character string e.g. "YZX", which also is default.
	 */
	Quaternion.prototype.toEuler = function(target,order){
	    order = order || "YZX";

	    var heading, attitude, bank;
	    var x = this.x, y = this.y, z = this.z, w = this.w;

	    switch(order){
	    case "YZX":
	        var test = x*y + z*w;
	        if (test > 0.499) { // singularity at north pole
	            heading = 2 * Math.atan2(x,w);
	            attitude = Math.PI/2;
	            bank = 0;
	        }
	        if (test < -0.499) { // singularity at south pole
	            heading = -2 * Math.atan2(x,w);
	            attitude = - Math.PI/2;
	            bank = 0;
	        }
	        if(isNaN(heading)){
	            var sqx = x*x;
	            var sqy = y*y;
	            var sqz = z*z;
	            heading = Math.atan2(2*y*w - 2*x*z , 1 - 2*sqy - 2*sqz); // Heading
	            attitude = Math.asin(2*test); // attitude
	            bank = Math.atan2(2*x*w - 2*y*z , 1 - 2*sqx - 2*sqz); // bank
	        }
	        break;
	    default:
	        throw new Error("Euler order "+order+" not supported yet.");
	    }

	    target.y = heading;
	    target.z = attitude;
	    target.x = bank;
	};

	/**
	 * See http://www.mathworks.com/matlabcentral/fileexchange/20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors/content/SpinCalc.m
	 * @method setFromEuler
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} z
	 * @param {String} order The order to apply angles: 'XYZ' or 'YXZ' or any other combination
	 */
	Quaternion.prototype.setFromEuler = function ( x, y, z, order ) {
	    order = order || "XYZ";

	    var c1 = Math.cos( x / 2 );
	    var c2 = Math.cos( y / 2 );
	    var c3 = Math.cos( z / 2 );
	    var s1 = Math.sin( x / 2 );
	    var s2 = Math.sin( y / 2 );
	    var s3 = Math.sin( z / 2 );

	    if ( order === 'XYZ' ) {

	        this.x = s1 * c2 * c3 + c1 * s2 * s3;
	        this.y = c1 * s2 * c3 - s1 * c2 * s3;
	        this.z = c1 * c2 * s3 + s1 * s2 * c3;
	        this.w = c1 * c2 * c3 - s1 * s2 * s3;

	    } else if ( order === 'YXZ' ) {

	        this.x = s1 * c2 * c3 + c1 * s2 * s3;
	        this.y = c1 * s2 * c3 - s1 * c2 * s3;
	        this.z = c1 * c2 * s3 - s1 * s2 * c3;
	        this.w = c1 * c2 * c3 + s1 * s2 * s3;

	    } else if ( order === 'ZXY' ) {

	        this.x = s1 * c2 * c3 - c1 * s2 * s3;
	        this.y = c1 * s2 * c3 + s1 * c2 * s3;
	        this.z = c1 * c2 * s3 + s1 * s2 * c3;
	        this.w = c1 * c2 * c3 - s1 * s2 * s3;

	    } else if ( order === 'ZYX' ) {

	        this.x = s1 * c2 * c3 - c1 * s2 * s3;
	        this.y = c1 * s2 * c3 + s1 * c2 * s3;
	        this.z = c1 * c2 * s3 - s1 * s2 * c3;
	        this.w = c1 * c2 * c3 + s1 * s2 * s3;

	    } else if ( order === 'YZX' ) {

	        this.x = s1 * c2 * c3 + c1 * s2 * s3;
	        this.y = c1 * s2 * c3 + s1 * c2 * s3;
	        this.z = c1 * c2 * s3 - s1 * s2 * c3;
	        this.w = c1 * c2 * c3 - s1 * s2 * s3;

	    } else if ( order === 'XZY' ) {

	        this.x = s1 * c2 * c3 - c1 * s2 * s3;
	        this.y = c1 * s2 * c3 - s1 * c2 * s3;
	        this.z = c1 * c2 * s3 + s1 * s2 * c3;
	        this.w = c1 * c2 * c3 + s1 * s2 * s3;

	    }

	    return this;

	};

	Quaternion.prototype.clone = function(){
	    return new Quaternion(this.x, this.y, this.z, this.w);
	};
	},{"./Vec3":30}],29:[function(_dereq_,module,exports){
	var Vec3 = _dereq_('./Vec3');
	var Quaternion = _dereq_('./Quaternion');

	module.exports = Transform;

	/**
	 * @class Transform
	 * @constructor
	 */
	function Transform(options) {
	    options = options || {};

		/**
		 * @property {Vec3} position
		 */
		this.position = new Vec3();
	    if(options.position){
	        this.position.copy(options.position);
	    }

		/**
		 * @property {Quaternion} quaternion
		 */
		this.quaternion = new Quaternion();
	    if(options.quaternion){
	        this.quaternion.copy(options.quaternion);
	    }
	}

	var tmpQuat = new Quaternion();

	/**
	 * @static
	 * @method pointToLocaFrame
	 * @param {Vec3} position
	 * @param {Quaternion} quaternion
	 * @param {Vec3} worldPoint
	 * @param {Vec3} result
	 */
	Transform.pointToLocalFrame = function(position, quaternion, worldPoint, result){
	    var result = result || new Vec3();
	    worldPoint.vsub(position, result);
	    quaternion.conjugate(tmpQuat);
	    tmpQuat.vmult(result, result);
	    return result;
	};

	/**
	 * Get a global point in local transform coordinates.
	 * @method pointToLocal
	 * @param  {Vec3} point
	 * @param  {Vec3} result
	 * @return {Vec3} The "result" vector object
	 */
	Transform.prototype.pointToLocal = function(worldPoint, result){
	    return Transform.pointToLocalFrame(this.position, this.quaternion, worldPoint, result);
	};

	/**
	 * @static
	 * @method pointToWorldFrame
	 * @param {Vec3} position
	 * @param {Vec3} quaternion
	 * @param {Vec3} localPoint
	 * @param {Vec3} result
	 */
	Transform.pointToWorldFrame = function(position, quaternion, localPoint, result){
	    var result = result || new Vec3();
	    quaternion.vmult(localPoint, result);
	    result.vadd(position, result);
	    return result;
	};

	/**
	 * Get a local point in global transform coordinates.
	 * @method pointToWorld
	 * @param  {Vec3} point
	 * @param  {Vec3} result
	 * @return {Vec3} The "result" vector object
	 */
	Transform.prototype.pointToWorld = function(localPoint, result){
	    return Transform.pointToWorldFrame(this.position, this.quaternion, localPoint, result);
	};


	Transform.prototype.vectorToWorldFrame = function(localVector, result){
	    var result = result || new Vec3();
	    this.quaternion.vmult(localVector, result);
	    return result;
	};

	Transform.vectorToWorldFrame = function(quaternion, localVector, result){
	    quaternion.vmult(localVector, result);
	    return result;
	};

	Transform.vectorToLocalFrame = function(position, quaternion, worldVector, result){
	    var result = result || new Vec3();
	    quaternion.w *= -1;
	    quaternion.vmult(worldVector, result);
	    quaternion.w *= -1;
	    return result;
	};

	},{"./Quaternion":28,"./Vec3":30}],30:[function(_dereq_,module,exports){
	module.exports = Vec3;

	var Mat3 = _dereq_('./Mat3');

	/**
	 * 3-dimensional vector
	 * @class Vec3
	 * @constructor
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} z
	 * @author schteppe
	 * @example
	 *     var v = new Vec3(1, 2, 3);
	 *     console.log('x=' + v.x); // x=1
	 */
	function Vec3(x,y,z){
	    /**
	     * @property x
	     * @type {Number}
	     */
	    this.x = x||0.0;

	    /**
	     * @property y
	     * @type {Number}
	     */
	    this.y = y||0.0;

	    /**
	     * @property z
	     * @type {Number}
	     */
	    this.z = z||0.0;
	}

	/**
	 * @static
	 * @property {Vec3} ZERO
	 */
	Vec3.ZERO = new Vec3(0, 0, 0);

	/**
	 * @static
	 * @property {Vec3} UNIT_X
	 */
	Vec3.UNIT_X = new Vec3(1, 0, 0);

	/**
	 * @static
	 * @property {Vec3} UNIT_Y
	 */
	Vec3.UNIT_Y = new Vec3(0, 1, 0);

	/**
	 * @static
	 * @property {Vec3} UNIT_Z
	 */
	Vec3.UNIT_Z = new Vec3(0, 0, 1);

	/**
	 * Vector cross product
	 * @method cross
	 * @param {Vec3} v
	 * @param {Vec3} target Optional. Target to save in.
	 * @return {Vec3}
	 */
	Vec3.prototype.cross = function(v,target){
	    var vx=v.x, vy=v.y, vz=v.z, x=this.x, y=this.y, z=this.z;
	    target = target || new Vec3();

	    target.x = (y * vz) - (z * vy);
	    target.y = (z * vx) - (x * vz);
	    target.z = (x * vy) - (y * vx);

	    return target;
	};

	/**
	 * Set the vectors' 3 elements
	 * @method set
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} z
	 * @return Vec3
	 */
	Vec3.prototype.set = function(x,y,z){
	    this.x = x;
	    this.y = y;
	    this.z = z;
	    return this;
	};

	/**
	 * Set all components of the vector to zero.
	 * @method setZero
	 */
	Vec3.prototype.setZero = function(){
	    this.x = this.y = this.z = 0;
	};

	/**
	 * Vector addition
	 * @method vadd
	 * @param {Vec3} v
	 * @param {Vec3} target Optional.
	 * @return {Vec3}
	 */
	Vec3.prototype.vadd = function(v,target){
	    if(target){
	        target.x = v.x + this.x;
	        target.y = v.y + this.y;
	        target.z = v.z + this.z;
	    } else {
	        return new Vec3(this.x + v.x,
	                               this.y + v.y,
	                               this.z + v.z);
	    }
	};

	/**
	 * Vector subtraction
	 * @method vsub
	 * @param {Vec3} v
	 * @param {Vec3} target Optional. Target to save in.
	 * @return {Vec3}
	 */
	Vec3.prototype.vsub = function(v,target){
	    if(target){
	        target.x = this.x - v.x;
	        target.y = this.y - v.y;
	        target.z = this.z - v.z;
	    } else {
	        return new Vec3(this.x-v.x,
	                               this.y-v.y,
	                               this.z-v.z);
	    }
	};

	/**
	 * Get the cross product matrix a_cross from a vector, such that a x b = a_cross * b = c
	 * @method crossmat
	 * @see http://www8.cs.umu.se/kurser/TDBD24/VT06/lectures/Lecture6.pdf
	 * @return {Mat3}
	 */
	Vec3.prototype.crossmat = function(){
	    return new Mat3([     0,  -this.z,   this.y,
	                            this.z,        0,  -this.x,
	                           -this.y,   this.x,        0]);
	};

	/**
	 * Normalize the vector. Note that this changes the values in the vector.
	 * @method normalize
	 * @return {Number} Returns the norm of the vector
	 */
	Vec3.prototype.normalize = function(){
	    var x=this.x, y=this.y, z=this.z;
	    var n = Math.sqrt(x*x + y*y + z*z);
	    if(n>0.0){
	        var invN = 1/n;
	        this.x *= invN;
	        this.y *= invN;
	        this.z *= invN;
	    } else {
	        // Make something up
	        this.x = 0;
	        this.y = 0;
	        this.z = 0;
	    }
	    return n;
	};

	/**
	 * Get the version of this vector that is of length 1.
	 * @method unit
	 * @param {Vec3} target Optional target to save in
	 * @return {Vec3} Returns the unit vector
	 */
	Vec3.prototype.unit = function(target){
	    target = target || new Vec3();
	    var x=this.x, y=this.y, z=this.z;
	    var ninv = Math.sqrt(x*x + y*y + z*z);
	    if(ninv>0.0){
	        ninv = 1.0/ninv;
	        target.x = x * ninv;
	        target.y = y * ninv;
	        target.z = z * ninv;
	    } else {
	        target.x = 1;
	        target.y = 0;
	        target.z = 0;
	    }
	    return target;
	};

	/**
	 * Get the length of the vector
	 * @method norm
	 * @return {Number}
	 * @deprecated Use .length() instead
	 */
	Vec3.prototype.norm = function(){
	    var x=this.x, y=this.y, z=this.z;
	    return Math.sqrt(x*x + y*y + z*z);
	};

	/**
	 * Get the length of the vector
	 * @method length
	 * @return {Number}
	 */
	Vec3.prototype.length = Vec3.prototype.norm;

	/**
	 * Get the squared length of the vector
	 * @method norm2
	 * @return {Number}
	 * @deprecated Use .lengthSquared() instead.
	 */
	Vec3.prototype.norm2 = function(){
	    return this.dot(this);
	};

	/**
	 * Get the squared length of the vector.
	 * @method lengthSquared
	 * @return {Number}
	 */
	Vec3.prototype.lengthSquared = Vec3.prototype.norm2;

	/**
	 * Get distance from this point to another point
	 * @method distanceTo
	 * @param  {Vec3} p
	 * @return {Number}
	 */
	Vec3.prototype.distanceTo = function(p){
	    var x=this.x, y=this.y, z=this.z;
	    var px=p.x, py=p.y, pz=p.z;
	    return Math.sqrt((px-x)*(px-x)+
	                     (py-y)*(py-y)+
	                     (pz-z)*(pz-z));
	};

	/**
	 * Get squared distance from this point to another point
	 * @method distanceSquared
	 * @param  {Vec3} p
	 * @return {Number}
	 */
	Vec3.prototype.distanceSquared = function(p){
	    var x=this.x, y=this.y, z=this.z;
	    var px=p.x, py=p.y, pz=p.z;
	    return (px-x)*(px-x) + (py-y)*(py-y) + (pz-z)*(pz-z);
	};

	/**
	 * Multiply all the components of the vector with a scalar.
	 * @deprecated Use .scale instead
	 * @method mult
	 * @param {Number} scalar
	 * @param {Vec3} target The vector to save the result in.
	 * @return {Vec3}
	 * @deprecated Use .scale() instead
	 */
	Vec3.prototype.mult = function(scalar,target){
	    target = target || new Vec3();
	    var x = this.x,
	        y = this.y,
	        z = this.z;
	    target.x = scalar * x;
	    target.y = scalar * y;
	    target.z = scalar * z;
	    return target;
	};

	/**
	 * Multiply the vector with a scalar.
	 * @method scale
	 * @param {Number} scalar
	 * @param {Vec3} target
	 * @return {Vec3}
	 */
	Vec3.prototype.scale = Vec3.prototype.mult;

	/**
	 * Calculate dot product
	 * @method dot
	 * @param {Vec3} v
	 * @return {Number}
	 */
	Vec3.prototype.dot = function(v){
	    return this.x * v.x + this.y * v.y + this.z * v.z;
	};

	/**
	 * @method isZero
	 * @return bool
	 */
	Vec3.prototype.isZero = function(){
	    return this.x===0 && this.y===0 && this.z===0;
	};

	/**
	 * Make the vector point in the opposite direction.
	 * @method negate
	 * @param {Vec3} target Optional target to save in
	 * @return {Vec3}
	 */
	Vec3.prototype.negate = function(target){
	    target = target || new Vec3();
	    target.x = -this.x;
	    target.y = -this.y;
	    target.z = -this.z;
	    return target;
	};

	/**
	 * Compute two artificial tangents to the vector
	 * @method tangents
	 * @param {Vec3} t1 Vector object to save the first tangent in
	 * @param {Vec3} t2 Vector object to save the second tangent in
	 */
	var Vec3_tangents_n = new Vec3();
	var Vec3_tangents_randVec = new Vec3();
	Vec3.prototype.tangents = function(t1,t2){
	    var norm = this.norm();
	    if(norm>0.0){
	        var n = Vec3_tangents_n;
	        var inorm = 1/norm;
	        n.set(this.x*inorm,this.y*inorm,this.z*inorm);
	        var randVec = Vec3_tangents_randVec;
	        if(Math.abs(n.x) < 0.9){
	            randVec.set(1,0,0);
	            n.cross(randVec,t1);
	        } else {
	            randVec.set(0,1,0);
	            n.cross(randVec,t1);
	        }
	        n.cross(t1,t2);
	    } else {
	        // The normal length is zero, make something up
	        t1.set(1, 0, 0);
	        t2.set(0, 1, 0);
	    }
	};

	/**
	 * Converts to a more readable format
	 * @method toString
	 * @return string
	 */
	Vec3.prototype.toString = function(){
	    return this.x+","+this.y+","+this.z;
	};

	/**
	 * Converts to an array
	 * @method toArray
	 * @return Array
	 */
	Vec3.prototype.toArray = function(){
	    return [this.x, this.y, this.z];
	};

	/**
	 * Copies value of source to this vector.
	 * @method copy
	 * @param {Vec3} source
	 * @return {Vec3} this
	 */
	Vec3.prototype.copy = function(source){
	    this.x = source.x;
	    this.y = source.y;
	    this.z = source.z;
	    return this;
	};


	/**
	 * Do a linear interpolation between two vectors
	 * @method lerp
	 * @param {Vec3} v
	 * @param {Number} t A number between 0 and 1. 0 will make this function return u, and 1 will make it return v. Numbers in between will generate a vector in between them.
	 * @param {Vec3} target
	 */
	Vec3.prototype.lerp = function(v,t,target){
	    var x=this.x, y=this.y, z=this.z;
	    target.x = x + (v.x-x)*t;
	    target.y = y + (v.y-y)*t;
	    target.z = z + (v.z-z)*t;
	};

	/**
	 * Check if a vector equals is almost equal to another one.
	 * @method almostEquals
	 * @param {Vec3} v
	 * @param {Number} precision
	 * @return bool
	 */
	Vec3.prototype.almostEquals = function(v,precision){
	    if(precision===undefined){
	        precision = 1e-6;
	    }
	    if( Math.abs(this.x-v.x)>precision ||
	        Math.abs(this.y-v.y)>precision ||
	        Math.abs(this.z-v.z)>precision){
	        return false;
	    }
	    return true;
	};

	/**
	 * Check if a vector is almost zero
	 * @method almostZero
	 * @param {Number} precision
	 */
	Vec3.prototype.almostZero = function(precision){
	    if(precision===undefined){
	        precision = 1e-6;
	    }
	    if( Math.abs(this.x)>precision ||
	        Math.abs(this.y)>precision ||
	        Math.abs(this.z)>precision){
	        return false;
	    }
	    return true;
	};

	var antip_neg = new Vec3();

	/**
	 * Check if the vector is anti-parallel to another vector.
	 * @method isAntiparallelTo
	 * @param  {Vec3}  v
	 * @param  {Number}  precision Set to zero for exact comparisons
	 * @return {Boolean}
	 */
	Vec3.prototype.isAntiparallelTo = function(v,precision){
	    this.negate(antip_neg);
	    return antip_neg.almostEquals(v,precision);
	};

	/**
	 * Clone the vector
	 * @method clone
	 * @return {Vec3}
	 */
	Vec3.prototype.clone = function(){
	    return new Vec3(this.x, this.y, this.z);
	};
	},{"./Mat3":27}],31:[function(_dereq_,module,exports){
	module.exports = Body;

	var EventTarget = _dereq_('../utils/EventTarget');
	_dereq_('../shapes/Shape');
	var Vec3 = _dereq_('../math/Vec3');
	var Mat3 = _dereq_('../math/Mat3');
	var Quaternion = _dereq_('../math/Quaternion');
	_dereq_('../material/Material');
	var AABB = _dereq_('../collision/AABB');
	var Box = _dereq_('../shapes/Box');

	/**
	 * Base class for all body types.
	 * @class Body
	 * @constructor
	 * @extends EventTarget
	 * @param {object} [options]
	 * @param {Vec3} [options.position]
	 * @param {Vec3} [options.velocity]
	 * @param {Vec3} [options.angularVelocity]
	 * @param {Quaternion} [options.quaternion]
	 * @param {number} [options.mass]
	 * @param {Material} [options.material]
	 * @param {number} [options.type]
	 * @param {number} [options.linearDamping=0.01]
	 * @param {number} [options.angularDamping=0.01]
	 * @param {boolean} [options.allowSleep=true]
	 * @param {number} [options.sleepSpeedLimit=0.1]
	 * @param {number} [options.sleepTimeLimit=1]
	 * @param {number} [options.collisionFilterGroup=1]
	 * @param {number} [options.collisionFilterMask=1]
	 * @param {boolean} [options.fixedRotation=false]
	 * @param {Body} [options.shape]
	 * @example
	 *     var body = new Body({
	 *         mass: 1
	 *     });
	 *     var shape = new Sphere(1);
	 *     body.addShape(shape);
	 *     world.add(body);
	 */
	function Body(options){
	    options = options || {};

	    EventTarget.apply(this);

	    this.id = Body.idCounter++;

	    /**
	     * Reference to the world the body is living in
	     * @property world
	     * @type {World}
	     */
	    this.world = null;

	    /**
	     * Callback function that is used BEFORE stepping the system. Use it to apply forces, for example. Inside the function, "this" will refer to this Body object.
	     * @property preStep
	     * @type {Function}
	     * @deprecated Use World events instead
	     */
	    this.preStep = null;

	    /**
	     * Callback function that is used AFTER stepping the system. Inside the function, "this" will refer to this Body object.
	     * @property postStep
	     * @type {Function}
	     * @deprecated Use World events instead
	     */
	    this.postStep = null;

	    this.vlambda = new Vec3();

	    /**
	     * @property {Number} collisionFilterGroup
	     */
	    this.collisionFilterGroup = typeof(options.collisionFilterGroup) === 'number' ? options.collisionFilterGroup : 1;

	    /**
	     * @property {Number} collisionFilterMask
	     */
	    this.collisionFilterMask = typeof(options.collisionFilterMask) === 'number' ? options.collisionFilterMask : 1;

	    /**
	     * Whether to produce contact forces when in contact with other bodies. Note that contacts will be generated, but they will be disabled.
	     * @property {Number} collisionResponse
	     */
		this.collisionResponse = true;

	    /**
	     * @property position
	     * @type {Vec3}
	     */
	    this.position = new Vec3();

	    if(options.position){
	        this.position.copy(options.position);
	    }

	    /**
	     * @property {Vec3} previousPosition
	     */
	    this.previousPosition = new Vec3();

	    /**
	     * Initial position of the body
	     * @property initPosition
	     * @type {Vec3}
	     */
	    this.initPosition = new Vec3();

	    /**
	     * @property velocity
	     * @type {Vec3}
	     */
	    this.velocity = new Vec3();

	    if(options.velocity){
	        this.velocity.copy(options.velocity);
	    }

	    /**
	     * @property initVelocity
	     * @type {Vec3}
	     */
	    this.initVelocity = new Vec3();

	    /**
	     * Linear force on the body
	     * @property force
	     * @type {Vec3}
	     */
	    this.force = new Vec3();

	    var mass = typeof(options.mass) === 'number' ? options.mass : 0;

	    /**
	     * @property mass
	     * @type {Number}
	     * @default 0
	     */
	    this.mass = mass;

	    /**
	     * @property invMass
	     * @type {Number}
	     */
	    this.invMass = mass > 0 ? 1.0 / mass : 0;

	    /**
	     * @property material
	     * @type {Material}
	     */
	    this.material = options.material || null;

	    /**
	     * @property linearDamping
	     * @type {Number}
	     */
	    this.linearDamping = typeof(options.linearDamping) === 'number' ? options.linearDamping : 0.01;

	    /**
	     * One of: Body.DYNAMIC, Body.STATIC and Body.KINEMATIC.
	     * @property type
	     * @type {Number}
	     */
	    this.type = (mass <= 0.0 ? Body.STATIC : Body.DYNAMIC);
	    if(typeof(options.type) === typeof(Body.STATIC)){
	        this.type = options.type;
	    }

	    /**
	     * If true, the body will automatically fall to sleep.
	     * @property allowSleep
	     * @type {Boolean}
	     * @default true
	     */
	    this.allowSleep = typeof(options.allowSleep) !== 'undefined' ? options.allowSleep : true;

	    /**
	     * Current sleep state.
	     * @property sleepState
	     * @type {Number}
	     */
	    this.sleepState = 0;

	    /**
	     * If the speed (the norm of the velocity) is smaller than this value, the body is considered sleepy.
	     * @property sleepSpeedLimit
	     * @type {Number}
	     * @default 0.1
	     */
	    this.sleepSpeedLimit = typeof(options.sleepSpeedLimit) !== 'undefined' ? options.sleepSpeedLimit : 0.1;

	    /**
	     * If the body has been sleepy for this sleepTimeLimit seconds, it is considered sleeping.
	     * @property sleepTimeLimit
	     * @type {Number}
	     * @default 1
	     */
	    this.sleepTimeLimit = typeof(options.sleepTimeLimit) !== 'undefined' ? options.sleepTimeLimit : 1;

	    this.timeLastSleepy = 0;

	    this._wakeUpAfterNarrowphase = false;


	    /**
	     * Rotational force on the body, around center of mass
	     * @property {Vec3} torque
	     */
	    this.torque = new Vec3();

	    /**
	     * Orientation of the body
	     * @property quaternion
	     * @type {Quaternion}
	     */
	    this.quaternion = new Quaternion();

	    if(options.quaternion){
	        this.quaternion.copy(options.quaternion);
	    }

	    /**
	     * @property initQuaternion
	     * @type {Quaternion}
	     */
	    this.initQuaternion = new Quaternion();

	    /**
	     * @property angularVelocity
	     * @type {Vec3}
	     */
	    this.angularVelocity = new Vec3();

	    if(options.angularVelocity){
	        this.angularVelocity.copy(options.angularVelocity);
	    }

	    /**
	     * @property initAngularVelocity
	     * @type {Vec3}
	     */
	    this.initAngularVelocity = new Vec3();

	    this.interpolatedPosition = new Vec3();
	    this.interpolatedQuaternion = new Quaternion();

	    /**
	     * @property shapes
	     * @type {array}
	     */
	    this.shapes = [];

	    /**
	     * @property shapeOffsets
	     * @type {array}
	     */
	    this.shapeOffsets = [];

	    /**
	     * @property shapeOrientations
	     * @type {array}
	     */
	    this.shapeOrientations = [];

	    /**
	     * @property inertia
	     * @type {Vec3}
	     */
	    this.inertia = new Vec3();

	    /**
	     * @property {Vec3} invInertia
	     */
	    this.invInertia = new Vec3();

	    /**
	     * @property {Mat3} invInertiaWorld
	     */
	    this.invInertiaWorld = new Mat3();

	    this.invMassSolve = 0;

	    /**
	     * @property {Vec3} invInertiaSolve
	     */
	    this.invInertiaSolve = new Vec3();

	    /**
	     * @property {Mat3} invInertiaWorldSolve
	     */
	    this.invInertiaWorldSolve = new Mat3();

	    /**
	     * Set to true if you don't want the body to rotate. Make sure to run .updateMassProperties() after changing this.
	     * @property {Boolean} fixedRotation
	     * @default false
	     */
	    this.fixedRotation = typeof(options.fixedRotation) !== "undefined" ? options.fixedRotation : false;

	    /**
	     * @property {Number} angularDamping
	     */
	    this.angularDamping = typeof(options.angularDamping) !== 'undefined' ? options.angularDamping : 0.01;

	    /**
	     * @property aabb
	     * @type {AABB}
	     */
	    this.aabb = new AABB();

	    /**
	     * Indicates if the AABB needs to be updated before use.
	     * @property aabbNeedsUpdate
	     * @type {Boolean}
	     */
	    this.aabbNeedsUpdate = true;

	    this.wlambda = new Vec3();

	    if(options.shape){
	        this.addShape(options.shape);
	    }

	    this.updateMassProperties();
	}
	Body.prototype = new EventTarget();
	Body.prototype.constructor = Body;

	/**
	 * A dynamic body is fully simulated. Can be moved manually by the user, but normally they move according to forces. A dynamic body can collide with all body types. A dynamic body always has finite, non-zero mass.
	 * @static
	 * @property DYNAMIC
	 * @type {Number}
	 */
	Body.DYNAMIC = 1;

	/**
	 * A static body does not move during simulation and behaves as if it has infinite mass. Static bodies can be moved manually by setting the position of the body. The velocity of a static body is always zero. Static bodies do not collide with other static or kinematic bodies.
	 * @static
	 * @property STATIC
	 * @type {Number}
	 */
	Body.STATIC = 2;

	/**
	 * A kinematic body moves under simulation according to its velocity. They do not respond to forces. They can be moved manually, but normally a kinematic body is moved by setting its velocity. A kinematic body behaves as if it has infinite mass. Kinematic bodies do not collide with other static or kinematic bodies.
	 * @static
	 * @property KINEMATIC
	 * @type {Number}
	 */
	Body.KINEMATIC = 4;



	/**
	 * @static
	 * @property AWAKE
	 * @type {number}
	 */
	Body.AWAKE = 0;

	/**
	 * @static
	 * @property SLEEPY
	 * @type {number}
	 */
	Body.SLEEPY = 1;

	/**
	 * @static
	 * @property SLEEPING
	 * @type {number}
	 */
	Body.SLEEPING = 2;

	Body.idCounter = 0;

	/**
	 * Wake the body up.
	 * @method wakeUp
	 */
	Body.prototype.wakeUp = function(){
	    var s = this.sleepState;
	    this.sleepState = 0;
	    if(s === Body.SLEEPING){
	        this.dispatchEvent({type:"wakeup"});
	    }
	};

	/**
	 * Force body sleep
	 * @method sleep
	 */
	Body.prototype.sleep = function(){
	    this.sleepState = Body.SLEEPING;
	    this.velocity.set(0,0,0);
	    this.angularVelocity.set(0,0,0);
	};

	Body.sleepyEvent = {
	    type: "sleepy"
	};

	Body.sleepEvent = {
	    type: "sleep"
	};

	/**
	 * Called every timestep to update internal sleep timer and change sleep state if needed.
	 * @method sleepTick
	 * @param {Number} time The world time in seconds
	 */
	Body.prototype.sleepTick = function(time){
	    if(this.allowSleep){
	        var sleepState = this.sleepState;
	        var speedSquared = this.velocity.norm2() + this.angularVelocity.norm2();
	        var speedLimitSquared = Math.pow(this.sleepSpeedLimit,2);
	        if(sleepState===Body.AWAKE && speedSquared < speedLimitSquared){
	            this.sleepState = Body.SLEEPY; // Sleepy
	            this.timeLastSleepy = time;
	            this.dispatchEvent(Body.sleepyEvent);
	        } else if(sleepState===Body.SLEEPY && speedSquared > speedLimitSquared){
	            this.wakeUp(); // Wake up
	        } else if(sleepState===Body.SLEEPY && (time - this.timeLastSleepy ) > this.sleepTimeLimit){
	            this.sleep(); // Sleeping
	            this.dispatchEvent(Body.sleepEvent);
	        }
	    }
	};

	/**
	 * If the body is sleeping, it should be immovable / have infinite mass during solve. We solve it by having a separate "solve mass".
	 * @method updateSolveMassProperties
	 */
	Body.prototype.updateSolveMassProperties = function(){
	    if(this.sleepState === Body.SLEEPING || this.type === Body.KINEMATIC){
	        this.invMassSolve = 0;
	        this.invInertiaSolve.setZero();
	        this.invInertiaWorldSolve.setZero();
	    } else {
	        this.invMassSolve = this.invMass;
	        this.invInertiaSolve.copy(this.invInertia);
	        this.invInertiaWorldSolve.copy(this.invInertiaWorld);
	    }
	};

	/**
	 * Convert a world point to local body frame.
	 * @method pointToLocalFrame
	 * @param  {Vec3} worldPoint
	 * @param  {Vec3} result
	 * @return {Vec3}
	 */
	Body.prototype.pointToLocalFrame = function(worldPoint,result){
	    var result = result || new Vec3();
	    worldPoint.vsub(this.position,result);
	    this.quaternion.conjugate().vmult(result,result);
	    return result;
	};

	/**
	 * Convert a world vector to local body frame.
	 * @method vectorToLocalFrame
	 * @param  {Vec3} worldPoint
	 * @param  {Vec3} result
	 * @return {Vec3}
	 */
	Body.prototype.vectorToLocalFrame = function(worldVector, result){
	    var result = result || new Vec3();
	    this.quaternion.conjugate().vmult(worldVector,result);
	    return result;
	};

	/**
	 * Convert a local body point to world frame.
	 * @method pointToWorldFrame
	 * @param  {Vec3} localPoint
	 * @param  {Vec3} result
	 * @return {Vec3}
	 */
	Body.prototype.pointToWorldFrame = function(localPoint,result){
	    var result = result || new Vec3();
	    this.quaternion.vmult(localPoint,result);
	    result.vadd(this.position,result);
	    return result;
	};

	/**
	 * Convert a local body point to world frame.
	 * @method vectorToWorldFrame
	 * @param  {Vec3} localVector
	 * @param  {Vec3} result
	 * @return {Vec3}
	 */
	Body.prototype.vectorToWorldFrame = function(localVector, result){
	    var result = result || new Vec3();
	    this.quaternion.vmult(localVector, result);
	    return result;
	};

	var tmpVec = new Vec3();
	var tmpQuat = new Quaternion();

	/**
	 * Add a shape to the body with a local offset and orientation.
	 * @method addShape
	 * @param {Shape} shape
	 * @param {Vec3} offset
	 * @param {Quaternion} quaternion
	 * @return {Body} The body object, for chainability.
	 */
	Body.prototype.addShape = function(shape, _offset, _orientation){
	    var offset = new Vec3();
	    var orientation = new Quaternion();

	    if(_offset){
	        offset.copy(_offset);
	    }
	    if(_orientation){
	        orientation.copy(_orientation);
	    }

	    this.shapes.push(shape);
	    this.shapeOffsets.push(offset);
	    this.shapeOrientations.push(orientation);
	    this.updateMassProperties();
	    this.updateBoundingRadius();

	    this.aabbNeedsUpdate = true;

	    return this;
	};

	/**
	 * Update the bounding radius of the body. Should be done if any of the shapes are changed.
	 * @method updateBoundingRadius
	 */
	Body.prototype.updateBoundingRadius = function(){
	    var shapes = this.shapes,
	        shapeOffsets = this.shapeOffsets,
	        N = shapes.length,
	        radius = 0;

	    for(var i=0; i!==N; i++){
	        var shape = shapes[i];
	        shape.updateBoundingSphereRadius();
	        var offset = shapeOffsets[i].norm(),
	            r = shape.boundingSphereRadius;
	        if(offset + r > radius){
	            radius = offset + r;
	        }
	    }

	    this.boundingRadius = radius;
	};

	var computeAABB_shapeAABB = new AABB();

	/**
	 * Updates the .aabb
	 * @method computeAABB
	 * @todo rename to updateAABB()
	 */
	Body.prototype.computeAABB = function(){
	    var shapes = this.shapes,
	        shapeOffsets = this.shapeOffsets,
	        shapeOrientations = this.shapeOrientations,
	        N = shapes.length,
	        offset = tmpVec,
	        orientation = tmpQuat,
	        bodyQuat = this.quaternion,
	        aabb = this.aabb,
	        shapeAABB = computeAABB_shapeAABB;

	    for(var i=0; i!==N; i++){
	        var shape = shapes[i];

	        // Get shape world quaternion
	        shapeOrientations[i].mult(bodyQuat, orientation);

	        // Get shape world position
	        orientation.vmult(shapeOffsets[i], offset);
	        offset.vadd(this.position, offset);

	        // vec2.rotate(offset, shapeOffsets[i], bodyAngle);
	        // vec2.add(offset, offset, this.position);

	        // Get shape AABB
	        shape.calculateWorldAABB(offset, orientation, shapeAABB.lowerBound, shapeAABB.upperBound);

	        if(i === 0){
	            aabb.copy(shapeAABB);
	        } else {
	            aabb.extend(shapeAABB);
	        }
	    }

	    this.aabbNeedsUpdate = false;
	};

	var uiw_m1 = new Mat3(),
	    uiw_m2 = new Mat3();
	    new Mat3();

	/**
	 * Update .inertiaWorld and .invInertiaWorld
	 * @method updateInertiaWorld
	 */
	Body.prototype.updateInertiaWorld = function(force){
	    var I = this.invInertia;
	    if (I.x === I.y && I.y === I.z && !force) ; else {
	        var m1 = uiw_m1,
	            m2 = uiw_m2;
	        m1.setRotationFromQuaternion(this.quaternion);
	        m1.transpose(m2);
	        m1.scale(I,m1);
	        m1.mmult(m2,this.invInertiaWorld);
	        //m3.getTrace(this.invInertiaWorld);
	    }

	    /*
	    this.quaternion.vmult(this.inertia,this.inertiaWorld);
	    this.quaternion.vmult(this.invInertia,this.invInertiaWorld);
	    */
	};

	/**
	 * Apply force to a world point. This could for example be a point on the Body surface. Applying force this way will add to Body.force and Body.torque.
	 * @method applyForce
	 * @param  {Vec3} force The amount of force to add.
	 * @param  {Vec3} worldPoint A world point to apply the force on.
	 */
	var Body_applyForce_r = new Vec3();
	var Body_applyForce_rotForce = new Vec3();
	Body.prototype.applyForce = function(force,worldPoint){
	    if(this.type !== Body.DYNAMIC){
	        return;
	    }

	    // Compute point position relative to the body center
	    var r = Body_applyForce_r;
	    worldPoint.vsub(this.position,r);

	    // Compute produced rotational force
	    var rotForce = Body_applyForce_rotForce;
	    r.cross(force,rotForce);

	    // Add linear force
	    this.force.vadd(force,this.force);

	    // Add rotational force
	    this.torque.vadd(rotForce,this.torque);
	};

	/**
	 * Apply force to a local point in the body.
	 * @method applyLocalForce
	 * @param  {Vec3} force The force vector to apply, defined locally in the body frame.
	 * @param  {Vec3} localPoint A local point in the body to apply the force on.
	 */
	var Body_applyLocalForce_worldForce = new Vec3();
	var Body_applyLocalForce_worldPoint = new Vec3();
	Body.prototype.applyLocalForce = function(localForce, localPoint){
	    if(this.type !== Body.DYNAMIC){
	        return;
	    }

	    var worldForce = Body_applyLocalForce_worldForce;
	    var worldPoint = Body_applyLocalForce_worldPoint;

	    // Transform the force vector to world space
	    this.vectorToWorldFrame(localForce, worldForce);
	    this.pointToWorldFrame(localPoint, worldPoint);

	    this.applyForce(worldForce, worldPoint);
	};

	/**
	 * Apply impulse to a world point. This could for example be a point on the Body surface. An impulse is a force added to a body during a short period of time (impulse = force * time). Impulses will be added to Body.velocity and Body.angularVelocity.
	 * @method applyImpulse
	 * @param  {Vec3} impulse The amount of impulse to add.
	 * @param  {Vec3} worldPoint A world point to apply the force on.
	 */
	var Body_applyImpulse_r = new Vec3();
	var Body_applyImpulse_velo = new Vec3();
	var Body_applyImpulse_rotVelo = new Vec3();
	Body.prototype.applyImpulse = function(impulse, worldPoint){
	    if(this.type !== Body.DYNAMIC){
	        return;
	    }

	    // Compute point position relative to the body center
	    var r = Body_applyImpulse_r;
	    worldPoint.vsub(this.position,r);

	    // Compute produced central impulse velocity
	    var velo = Body_applyImpulse_velo;
	    velo.copy(impulse);
	    velo.mult(this.invMass,velo);

	    // Add linear impulse
	    this.velocity.vadd(velo, this.velocity);

	    // Compute produced rotational impulse velocity
	    var rotVelo = Body_applyImpulse_rotVelo;
	    r.cross(impulse,rotVelo);

	    /*
	    rotVelo.x *= this.invInertia.x;
	    rotVelo.y *= this.invInertia.y;
	    rotVelo.z *= this.invInertia.z;
	    */
	    this.invInertiaWorld.vmult(rotVelo,rotVelo);

	    // Add rotational Impulse
	    this.angularVelocity.vadd(rotVelo, this.angularVelocity);
	};

	/**
	 * Apply locally-defined impulse to a local point in the body.
	 * @method applyLocalImpulse
	 * @param  {Vec3} force The force vector to apply, defined locally in the body frame.
	 * @param  {Vec3} localPoint A local point in the body to apply the force on.
	 */
	var Body_applyLocalImpulse_worldImpulse = new Vec3();
	var Body_applyLocalImpulse_worldPoint = new Vec3();
	Body.prototype.applyLocalImpulse = function(localImpulse, localPoint){
	    if(this.type !== Body.DYNAMIC){
	        return;
	    }

	    var worldImpulse = Body_applyLocalImpulse_worldImpulse;
	    var worldPoint = Body_applyLocalImpulse_worldPoint;

	    // Transform the force vector to world space
	    this.vectorToWorldFrame(localImpulse, worldImpulse);
	    this.pointToWorldFrame(localPoint, worldPoint);

	    this.applyImpulse(worldImpulse, worldPoint);
	};

	var Body_updateMassProperties_halfExtents = new Vec3();

	/**
	 * Should be called whenever you change the body shape or mass.
	 * @method updateMassProperties
	 */
	Body.prototype.updateMassProperties = function(){
	    var halfExtents = Body_updateMassProperties_halfExtents;

	    this.invMass = this.mass > 0 ? 1.0 / this.mass : 0;
	    var I = this.inertia;
	    var fixed = this.fixedRotation;

	    // Approximate with AABB box
	    this.computeAABB();
	    halfExtents.set(
	        (this.aabb.upperBound.x-this.aabb.lowerBound.x) / 2,
	        (this.aabb.upperBound.y-this.aabb.lowerBound.y) / 2,
	        (this.aabb.upperBound.z-this.aabb.lowerBound.z) / 2
	    );
	    Box.calculateInertia(halfExtents, this.mass, I);

	    this.invInertia.set(
	        I.x > 0 && !fixed ? 1.0 / I.x : 0,
	        I.y > 0 && !fixed ? 1.0 / I.y : 0,
	        I.z > 0 && !fixed ? 1.0 / I.z : 0
	    );
	    this.updateInertiaWorld(true);
	};

	/**
	 * Get world velocity of a point in the body.
	 * @method getVelocityAtWorldPoint
	 * @param  {Vec3} worldPoint
	 * @param  {Vec3} result
	 * @return {Vec3} The result vector.
	 */
	Body.prototype.getVelocityAtWorldPoint = function(worldPoint, result){
	    var r = new Vec3();
	    worldPoint.vsub(this.position, r);
	    this.angularVelocity.cross(r, result);
	    this.velocity.vadd(result, result);
	    return result;
	};

	},{"../collision/AABB":3,"../material/Material":25,"../math/Mat3":27,"../math/Quaternion":28,"../math/Vec3":30,"../shapes/Box":37,"../shapes/Shape":43,"../utils/EventTarget":49}],32:[function(_dereq_,module,exports){
	_dereq_('./Body');
	var Vec3 = _dereq_('../math/Vec3');
	var Quaternion = _dereq_('../math/Quaternion');
	_dereq_('../collision/RaycastResult');
	var Ray = _dereq_('../collision/Ray');
	var WheelInfo = _dereq_('../objects/WheelInfo');

	module.exports = RaycastVehicle;

	/**
	 * Vehicle helper class that casts rays from the wheel positions towards the ground and applies forces.
	 * @class RaycastVehicle
	 * @constructor
	 * @param {object} [options]
	 * @param {Body} [options.chassisBody] The car chassis body.
	 * @param {integer} [options.indexRightAxis] Axis to use for right. x=0, y=1, z=2
	 * @param {integer} [options.indexLeftAxis]
	 * @param {integer} [options.indexUpAxis]
	 */
	function RaycastVehicle(options){

	    /**
	     * @property {Body} chassisBody
	     */
	    this.chassisBody = options.chassisBody;

	    /**
	     * An array of WheelInfo objects.
	     * @property {array} wheelInfos
	     */
	    this.wheelInfos = [];

	    /**
	     * Will be set to true if the car is sliding.
	     * @property {boolean} sliding
	     */
	    this.sliding = false;

	    /**
	     * @property {World} world
	     */
	    this.world = null;

	    /**
	     * Index of the right axis, 0=x, 1=y, 2=z
	     * @property {integer} indexRightAxis
	     * @default 1
	     */
	    this.indexRightAxis = typeof(options.indexRightAxis) !== 'undefined' ? options.indexRightAxis : 1;

	    /**
	     * Index of the forward axis, 0=x, 1=y, 2=z
	     * @property {integer} indexForwardAxis
	     * @default 0
	     */
	    this.indexForwardAxis = typeof(options.indexForwardAxis) !== 'undefined' ? options.indexForwardAxis : 0;

	    /**
	     * Index of the up axis, 0=x, 1=y, 2=z
	     * @property {integer} indexUpAxis
	     * @default 2
	     */
	    this.indexUpAxis = typeof(options.indexUpAxis) !== 'undefined' ? options.indexUpAxis : 2;
	}

	new Vec3();
	new Vec3();
	new Vec3();
	var tmpVec4 = new Vec3();
	var tmpVec5 = new Vec3();
	var tmpVec6 = new Vec3();
	new Ray();

	/**
	 * Add a wheel. For information about the options, see WheelInfo.
	 * @method addWheel
	 * @param {object} [options]
	 */
	RaycastVehicle.prototype.addWheel = function(options){
	    options = options || {};

	    var info = new WheelInfo(options);
	    var index = this.wheelInfos.length;
	    this.wheelInfos.push(info);

	    return index;
	};

	/**
	 * Set the steering value of a wheel.
	 * @method setSteeringValue
	 * @param {number} value
	 * @param {integer} wheelIndex
	 */
	RaycastVehicle.prototype.setSteeringValue = function(value, wheelIndex){
	    var wheel = this.wheelInfos[wheelIndex];
	    wheel.steering = value;
	};

	new Vec3();

	/**
	 * Set the wheel force to apply on one of the wheels each time step
	 * @method applyEngineForce
	 * @param  {number} value
	 * @param  {integer} wheelIndex
	 */
	RaycastVehicle.prototype.applyEngineForce = function(value, wheelIndex){
	    this.wheelInfos[wheelIndex].engineForce = value;
	};

	/**
	 * Set the braking force of a wheel
	 * @method setBrake
	 * @param {number} brake
	 * @param {integer} wheelIndex
	 */
	RaycastVehicle.prototype.setBrake = function(brake, wheelIndex){
	    this.wheelInfos[wheelIndex].brake = brake;
	};

	/**
	 * Add the vehicle including its constraints to the world.
	 * @method addToWorld
	 * @param {World} world
	 */
	RaycastVehicle.prototype.addToWorld = function(world){
	    this.constraints;
	    world.add(this.chassisBody);
	    var that = this;
	    this.preStepCallback = function(){
	        that.updateVehicle(world.dt);
	    };
	    world.addEventListener('preStep', this.preStepCallback);
	    this.world = world;
	};

	/**
	 * Get one of the wheel axles, world-oriented.
	 * @private
	 * @method getVehicleAxisWorld
	 * @param  {integer} axisIndex
	 * @param  {Vec3} result
	 */
	RaycastVehicle.prototype.getVehicleAxisWorld = function(axisIndex, result){
	    result.set(
	        axisIndex === 0 ? 1 : 0,
	        axisIndex === 1 ? 1 : 0,
	        axisIndex === 2 ? 1 : 0
	    );
	    this.chassisBody.vectorToWorldFrame(result, result);
	};

	RaycastVehicle.prototype.updateVehicle = function(timeStep){
	    var wheelInfos = this.wheelInfos;
	    var numWheels = wheelInfos.length;
	    var chassisBody = this.chassisBody;

	    for (var i = 0; i < numWheels; i++) {
	        this.updateWheelTransform(i);
	    }

	    this.currentVehicleSpeedKmHour = 3.6 * chassisBody.velocity.norm();

	    var forwardWorld = new Vec3();
	    this.getVehicleAxisWorld(this.indexForwardAxis, forwardWorld);

	    if (forwardWorld.dot(chassisBody.velocity) < 0){
	        this.currentVehicleSpeedKmHour *= -1;
	    }

	    // simulate suspension
	    for (var i = 0; i < numWheels; i++) {
	        this.castRay(wheelInfos[i]);
	    }

	    this.updateSuspension(timeStep);

	    var impulse = new Vec3();
	    var relpos = new Vec3();
	    for (var i = 0; i < numWheels; i++) {
	        //apply suspension force
	        var wheel = wheelInfos[i];
	        var suspensionForce = wheel.suspensionForce;
	        if (suspensionForce > wheel.maxSuspensionForce) {
	            suspensionForce = wheel.maxSuspensionForce;
	        }
	        wheel.raycastResult.hitNormalWorld.scale(suspensionForce * timeStep, impulse);

	        wheel.raycastResult.hitPointWorld.vsub(chassisBody.position, relpos);
	        chassisBody.applyImpulse(impulse, wheel.raycastResult.hitPointWorld/*relpos*/);
	    }

	    this.updateFriction(timeStep);

	    var hitNormalWorldScaledWithProj = new Vec3();
	    var fwd  = new Vec3();
	    var vel = new Vec3();
	    for (i = 0; i < numWheels; i++) {
	        var wheel = wheelInfos[i];
	        //var relpos = new Vec3();
	        //wheel.chassisConnectionPointWorld.vsub(chassisBody.position, relpos);
	        chassisBody.getVelocityAtWorldPoint(wheel.chassisConnectionPointWorld, vel);

	        // Hack to get the rotation in the correct direction
	        var m = 1;
	        switch(this.indexUpAxis){
	        case 1:
	            m = -1;
	            break;
	        }

	        if (wheel.isInContact) {

	            this.getVehicleAxisWorld(this.indexForwardAxis, fwd);
	            var proj = fwd.dot(wheel.raycastResult.hitNormalWorld);
	            wheel.raycastResult.hitNormalWorld.scale(proj, hitNormalWorldScaledWithProj);

	            fwd.vsub(hitNormalWorldScaledWithProj, fwd);

	            var proj2 = fwd.dot(vel);
	            wheel.deltaRotation = m * proj2 * timeStep / wheel.radius;
	        }

	        if((wheel.sliding || !wheel.isInContact) && wheel.engineForce !== 0 && wheel.useCustomSlidingRotationalSpeed){
	            // Apply custom rotation when accelerating and sliding
	            wheel.deltaRotation = (wheel.engineForce > 0 ? 1 : -1) * wheel.customSlidingRotationalSpeed * timeStep;
	        }

	        // Lock wheels
	        if(Math.abs(wheel.brake) > Math.abs(wheel.engineForce)){
	            wheel.deltaRotation = 0;
	        }

	        wheel.rotation += wheel.deltaRotation; // Use the old value
	        wheel.deltaRotation *= 0.99; // damping of rotation when not in contact
	    }
	};

	RaycastVehicle.prototype.updateSuspension = function(deltaTime) {
	    var chassisBody = this.chassisBody;
	    var chassisMass = chassisBody.mass;
	    var wheelInfos = this.wheelInfos;
	    var numWheels = wheelInfos.length;

	    for (var w_it = 0; w_it < numWheels; w_it++){
	        var wheel = wheelInfos[w_it];

	        if (wheel.isInContact){
	            var force;

	            // Spring
	            var susp_length = wheel.suspensionRestLength;
	            var current_length = wheel.suspensionLength;
	            var length_diff = (susp_length - current_length);

	            force = wheel.suspensionStiffness * length_diff * wheel.clippedInvContactDotSuspension;

	            // Damper
	            var projected_rel_vel = wheel.suspensionRelativeVelocity;
	            var susp_damping;
	            if (projected_rel_vel < 0) {
	                susp_damping = wheel.dampingCompression;
	            } else {
	                susp_damping = wheel.dampingRelaxation;
	            }
	            force -= susp_damping * projected_rel_vel;

	            wheel.suspensionForce = force * chassisMass;
	            if (wheel.suspensionForce < 0) {
	                wheel.suspensionForce = 0;
	            }
	        } else {
	            wheel.suspensionForce = 0;
	        }
	    }
	};

	/**
	 * Remove the vehicle including its constraints from the world.
	 * @method removeFromWorld
	 * @param {World} world
	 */
	RaycastVehicle.prototype.removeFromWorld = function(world){
	    this.constraints;
	    world.remove(this.chassisBody);
	    world.removeEventListener('preStep', this.preStepCallback);
	    this.world = null;
	};

	var castRay_rayvector = new Vec3();
	var castRay_target = new Vec3();
	RaycastVehicle.prototype.castRay = function(wheel) {
	    var rayvector = castRay_rayvector;
	    var target = castRay_target;

	    this.updateWheelTransformWorld(wheel);
	    var chassisBody = this.chassisBody;

	    var depth = -1;

	    var raylen = wheel.suspensionRestLength + wheel.radius;

	    wheel.directionWorld.scale(raylen, rayvector);
	    var source = wheel.chassisConnectionPointWorld;
	    source.vadd(rayvector, target);
	    var raycastResult = wheel.raycastResult;

	    raycastResult.reset();
	    // Turn off ray collision with the chassis temporarily
	    var oldState = chassisBody.collisionResponse;
	    chassisBody.collisionResponse = false;

	    // Cast ray against world
	    this.world.rayTest(source, target, raycastResult);
	    chassisBody.collisionResponse = oldState;

	    var object = raycastResult.body;

	    wheel.raycastResult.groundObject = 0;

	    if (object) {
	        depth = raycastResult.distance;
	        wheel.raycastResult.hitNormalWorld  = raycastResult.hitNormalWorld;
	        wheel.isInContact = true;

	        var hitDistance = raycastResult.distance;
	        wheel.suspensionLength = hitDistance - wheel.radius;

	        // clamp on max suspension travel
	        var minSuspensionLength = wheel.suspensionRestLength - wheel.maxSuspensionTravel;
	        var maxSuspensionLength = wheel.suspensionRestLength + wheel.maxSuspensionTravel;
	        if (wheel.suspensionLength < minSuspensionLength) {
	            wheel.suspensionLength = minSuspensionLength;
	        }
	        if (wheel.suspensionLength > maxSuspensionLength) {
	            wheel.suspensionLength = maxSuspensionLength;
	            wheel.raycastResult.reset();
	        }

	        var denominator = wheel.raycastResult.hitNormalWorld.dot(wheel.directionWorld);

	        var chassis_velocity_at_contactPoint = new Vec3();
	        chassisBody.getVelocityAtWorldPoint(wheel.raycastResult.hitPointWorld, chassis_velocity_at_contactPoint);

	        var projVel = wheel.raycastResult.hitNormalWorld.dot( chassis_velocity_at_contactPoint );

	        if (denominator >= -0.1) {
	            wheel.suspensionRelativeVelocity = 0;
	            wheel.clippedInvContactDotSuspension = 1 / 0.1;
	        } else {
	            var inv = -1 / denominator;
	            wheel.suspensionRelativeVelocity = projVel * inv;
	            wheel.clippedInvContactDotSuspension = inv;
	        }

	    } else {

	        //put wheel info as in rest position
	        wheel.suspensionLength = wheel.suspensionRestLength + 0 * wheel.maxSuspensionTravel;
	        wheel.suspensionRelativeVelocity = 0.0;
	        wheel.directionWorld.scale(-1, wheel.raycastResult.hitNormalWorld);
	        wheel.clippedInvContactDotSuspension = 1.0;
	    }

	    return depth;
	};

	RaycastVehicle.prototype.updateWheelTransformWorld = function(wheel){
	    wheel.isInContact = false;
	    var chassisBody = this.chassisBody;
	    chassisBody.pointToWorldFrame(wheel.chassisConnectionPointLocal, wheel.chassisConnectionPointWorld);
	    chassisBody.vectorToWorldFrame(wheel.directionLocal, wheel.directionWorld);
	    chassisBody.vectorToWorldFrame(wheel.axleLocal, wheel.axleWorld);
	};


	/**
	 * Update one of the wheel transform.
	 * Note when rendering wheels: during each step, wheel transforms are updated BEFORE the chassis; ie. their position becomes invalid after the step. Thus when you render wheels, you must update wheel transforms before rendering them. See raycastVehicle demo for an example.
	 * @method updateWheelTransform
	 * @param {integer} wheelIndex The wheel index to update.
	 */
	RaycastVehicle.prototype.updateWheelTransform = function(wheelIndex){
	    var up = tmpVec4;
	    var right = tmpVec5;
	    var fwd = tmpVec6;

	    var wheel = this.wheelInfos[wheelIndex];
	    this.updateWheelTransformWorld(wheel);

	    wheel.directionLocal.scale(-1, up);
	    right.copy(wheel.axleLocal);
	    up.cross(right, fwd);
	    fwd.normalize();
	    right.normalize();

	    // Rotate around steering over the wheelAxle
	    var steering = wheel.steering;
	    var steeringOrn = new Quaternion();
	    steeringOrn.setFromAxisAngle(up, steering);

	    var rotatingOrn = new Quaternion();
	    rotatingOrn.setFromAxisAngle(right, wheel.rotation);

	    // World rotation of the wheel
	    var q = wheel.worldTransform.quaternion;
	    this.chassisBody.quaternion.mult(steeringOrn, q);
	    q.mult(rotatingOrn, q);

	    q.normalize();

	    // world position of the wheel
	    var p = wheel.worldTransform.position;
	    p.copy(wheel.directionWorld);
	    p.scale(wheel.suspensionLength, p);
	    p.vadd(wheel.chassisConnectionPointWorld, p);
	};

	var directions = [
	    new Vec3(1, 0, 0),
	    new Vec3(0, 1, 0),
	    new Vec3(0, 0, 1)
	];

	/**
	 * Get the world transform of one of the wheels
	 * @method getWheelTransformWorld
	 * @param  {integer} wheelIndex
	 * @return {Transform}
	 */
	RaycastVehicle.prototype.getWheelTransformWorld = function(wheelIndex) {
	    return this.wheelInfos[wheelIndex].worldTransform;
	};


	var updateFriction_surfNormalWS_scaled_proj = new Vec3();
	var updateFriction_axle = [];
	var updateFriction_forwardWS = [];
	var sideFrictionStiffness2 = 1;
	RaycastVehicle.prototype.updateFriction = function(timeStep) {
	    var surfNormalWS_scaled_proj = updateFriction_surfNormalWS_scaled_proj;

	    //calculate the impulse, so that the wheels don't move sidewards
	    var wheelInfos = this.wheelInfos;
	    var numWheels = wheelInfos.length;
	    var chassisBody = this.chassisBody;
	    var forwardWS = updateFriction_forwardWS;
	    var axle = updateFriction_axle;

	    for (var i = 0; i < numWheels; i++) {
	        var wheel = wheelInfos[i];

	        var groundObject = wheel.raycastResult.body;

	        wheel.sideImpulse = 0;
	        wheel.forwardImpulse = 0;
	        if(!forwardWS[i]){
	            forwardWS[i] = new Vec3();
	        }
	        if(!axle[i]){
	            axle[i] = new Vec3();
	        }
	    }

	    for (var i = 0; i < numWheels; i++){
	        var wheel = wheelInfos[i];

	        var groundObject = wheel.raycastResult.body;

	        if (groundObject) {
	            var axlei = axle[i];
	            var wheelTrans = this.getWheelTransformWorld(i);

	            // Get world axle
	            wheelTrans.vectorToWorldFrame(directions[this.indexRightAxis], axlei);

	            var surfNormalWS = wheel.raycastResult.hitNormalWorld;
	            var proj = axlei.dot(surfNormalWS);
	            surfNormalWS.scale(proj, surfNormalWS_scaled_proj);
	            axlei.vsub(surfNormalWS_scaled_proj, axlei);
	            axlei.normalize();

	            surfNormalWS.cross(axlei, forwardWS[i]);
	            forwardWS[i].normalize();

	            wheel.sideImpulse = resolveSingleBilateral(
	                chassisBody,
	                wheel.raycastResult.hitPointWorld,
	                groundObject,
	                wheel.raycastResult.hitPointWorld,
	                axlei
	            );

	            wheel.sideImpulse *= sideFrictionStiffness2;
	        }
	    }

	    var sideFactor = 1;
	    var fwdFactor = 0.5;

	    this.sliding = false;
	    for (var i = 0; i < numWheels; i++) {
	        var wheel = wheelInfos[i];
	        var groundObject = wheel.raycastResult.body;

	        var rollingFriction = 0;

	        wheel.slipInfo = 1;
	        if (groundObject) {
	            var defaultRollingFrictionImpulse = 0;
	            var maxImpulse = wheel.brake ? wheel.brake : defaultRollingFrictionImpulse;

	            // btWheelContactPoint contactPt(chassisBody,groundObject,wheelInfraycastInfo.hitPointWorld,forwardWS[wheel],maxImpulse);
	            // rollingFriction = calcRollingFriction(contactPt);
	            rollingFriction = calcRollingFriction(chassisBody, groundObject, wheel.raycastResult.hitPointWorld, forwardWS[i], maxImpulse);

	            rollingFriction += wheel.engineForce * timeStep;

	            // rollingFriction = 0;
	            var factor = maxImpulse / rollingFriction;
	            wheel.slipInfo *= factor;
	        }

	        //switch between active rolling (throttle), braking and non-active rolling friction (nthrottle/break)

	        wheel.forwardImpulse = 0;
	        wheel.skidInfo = 1;

	        if (groundObject) {
	            wheel.skidInfo = 1;

	            var maximp = wheel.suspensionForce * timeStep * wheel.frictionSlip;
	            var maximpSide = maximp;

	            var maximpSquared = maximp * maximpSide;

	            wheel.forwardImpulse = rollingFriction;//wheelInfo.engineForce* timeStep;

	            var x = wheel.forwardImpulse * fwdFactor;
	            var y = wheel.sideImpulse * sideFactor;

	            var impulseSquared = x * x + y * y;

	            wheel.sliding = false;
	            if (impulseSquared > maximpSquared) {
	                this.sliding = true;
	                wheel.sliding = true;

	                var factor = maximp / Math.sqrt(impulseSquared);

	                wheel.skidInfo *= factor;
	            }
	        }
	    }

	    if (this.sliding) {
	        for (var i = 0; i < numWheels; i++) {
	            var wheel = wheelInfos[i];
	            if (wheel.sideImpulse !== 0) {
	                if (wheel.skidInfo < 1){
	                    wheel.forwardImpulse *= wheel.skidInfo;
	                    wheel.sideImpulse *= wheel.skidInfo;
	                }
	            }
	        }
	    }

	    // apply the impulses
	    for (var i = 0; i < numWheels; i++) {
	        var wheel = wheelInfos[i];

	        var rel_pos = new Vec3();
	        //wheel.raycastResult.hitPointWorld.vsub(chassisBody.position, rel_pos);
	        // cannons applyimpulse is using world coord for the position
	        rel_pos.copy(wheel.raycastResult.hitPointWorld);

	        if (wheel.forwardImpulse !== 0) {
	            var impulse = new Vec3();
	            forwardWS[i].scale(wheel.forwardImpulse, impulse);
	            chassisBody.applyImpulse(impulse, rel_pos);
	        }

	        if (wheel.sideImpulse !== 0){
	            var groundObject = wheel.raycastResult.body;

	            var rel_pos2 = new Vec3();
	            //wheel.raycastResult.hitPointWorld.vsub(groundObject.position, rel_pos2);
	            rel_pos2.copy(wheel.raycastResult.hitPointWorld);
	            var sideImp = new Vec3();
	            axle[i].scale(wheel.sideImpulse, sideImp);

	            // Scale the relative position in the up direction with rollInfluence.
	            // If rollInfluence is 1, the impulse will be applied on the hitPoint (easy to roll over), if it is zero it will be applied in the same plane as the center of mass (not easy to roll over).
	            chassisBody.pointToLocalFrame(rel_pos, rel_pos);
	            rel_pos['xyz'[this.indexUpAxis]] *= wheel.rollInfluence;
	            chassisBody.pointToWorldFrame(rel_pos, rel_pos);
	            chassisBody.applyImpulse(sideImp, rel_pos);

	            //apply friction impulse on the ground
	            sideImp.scale(-1, sideImp);
	            groundObject.applyImpulse(sideImp, rel_pos2);
	        }
	    }
	};

	var calcRollingFriction_vel1 = new Vec3();
	var calcRollingFriction_vel2 = new Vec3();
	var calcRollingFriction_vel = new Vec3();

	function calcRollingFriction(body0, body1, frictionPosWorld, frictionDirectionWorld, maxImpulse) {
	    var j1 = 0;
	    var contactPosWorld = frictionPosWorld;

	    // var rel_pos1 = new Vec3();
	    // var rel_pos2 = new Vec3();
	    var vel1 = calcRollingFriction_vel1;
	    var vel2 = calcRollingFriction_vel2;
	    var vel = calcRollingFriction_vel;
	    // contactPosWorld.vsub(body0.position, rel_pos1);
	    // contactPosWorld.vsub(body1.position, rel_pos2);

	    body0.getVelocityAtWorldPoint(contactPosWorld, vel1);
	    body1.getVelocityAtWorldPoint(contactPosWorld, vel2);
	    vel1.vsub(vel2, vel);

	    var vrel = frictionDirectionWorld.dot(vel);

	    var denom0 = computeImpulseDenominator(body0, frictionPosWorld, frictionDirectionWorld);
	    var denom1 = computeImpulseDenominator(body1, frictionPosWorld, frictionDirectionWorld);
	    var relaxation = 1;
	    var jacDiagABInv = relaxation / (denom0 + denom1);

	    // calculate j that moves us to zero relative velocity
	    j1 = -vrel * jacDiagABInv;

	    if (maxImpulse < j1) {
	        j1 = maxImpulse;
	    }
	    if (j1 < -maxImpulse) {
	        j1 = -maxImpulse;
	    }

	    return j1;
	}

	var computeImpulseDenominator_r0 = new Vec3();
	var computeImpulseDenominator_c0 = new Vec3();
	var computeImpulseDenominator_vec = new Vec3();
	var computeImpulseDenominator_m = new Vec3();
	function computeImpulseDenominator(body, pos, normal) {
	    var r0 = computeImpulseDenominator_r0;
	    var c0 = computeImpulseDenominator_c0;
	    var vec = computeImpulseDenominator_vec;
	    var m = computeImpulseDenominator_m;

	    pos.vsub(body.position, r0);
	    r0.cross(normal, c0);
	    body.invInertiaWorld.vmult(c0, m);
	    m.cross(r0, vec);

	    return body.invMass + normal.dot(vec);
	}


	var resolveSingleBilateral_vel1 = new Vec3();
	var resolveSingleBilateral_vel2 = new Vec3();
	var resolveSingleBilateral_vel = new Vec3();

	//bilateral constraint between two dynamic objects
	function resolveSingleBilateral(body1, pos1, body2, pos2, normal, impulse){
	    var normalLenSqr = normal.norm2();
	    if (normalLenSqr > 1.1){
	        return 0; // no impulse
	    }
	    // var rel_pos1 = new Vec3();
	    // var rel_pos2 = new Vec3();
	    // pos1.vsub(body1.position, rel_pos1);
	    // pos2.vsub(body2.position, rel_pos2);

	    var vel1 = resolveSingleBilateral_vel1;
	    var vel2 = resolveSingleBilateral_vel2;
	    var vel = resolveSingleBilateral_vel;
	    body1.getVelocityAtWorldPoint(pos1, vel1);
	    body2.getVelocityAtWorldPoint(pos2, vel2);

	    vel1.vsub(vel2, vel);

	    var rel_vel = normal.dot(vel);

	    var contactDamping = 0.2;
	    var massTerm = 1 / (body1.invMass + body2.invMass);
	    var impulse = - contactDamping * rel_vel * massTerm;

	    return impulse;
	}
	},{"../collision/Ray":9,"../collision/RaycastResult":10,"../math/Quaternion":28,"../math/Vec3":30,"../objects/WheelInfo":36,"./Body":31}],33:[function(_dereq_,module,exports){
	var Body = _dereq_('./Body');
	var Sphere = _dereq_('../shapes/Sphere');
	var Box = _dereq_('../shapes/Box');
	var Vec3 = _dereq_('../math/Vec3');
	var HingeConstraint = _dereq_('../constraints/HingeConstraint');

	module.exports = RigidVehicle;

	/**
	 * Simple vehicle helper class with spherical rigid body wheels.
	 * @class RigidVehicle
	 * @constructor
	 * @param {Body} [options.chassisBody]
	 */
	function RigidVehicle(options){
	    this.wheelBodies = [];

	    /**
	     * @property coordinateSystem
	     * @type {Vec3}
	     */
	    this.coordinateSystem = typeof(options.coordinateSystem)==='undefined' ? new Vec3(1, 2, 3) : options.coordinateSystem.clone();

	    /**
	     * @property {Body} chassisBody
	     */
	    this.chassisBody = options.chassisBody;

	    if(!this.chassisBody){
	        // No chassis body given. Create it!
	        var chassisShape = new Box(new Vec3(5, 2, 0.5));
	        this.chassisBody = new Body(1, chassisShape);
	    }

	    /**
	     * @property constraints
	     * @type {Array}
	     */
	    this.constraints = [];

	    this.wheelAxes = [];
	    this.wheelForces = [];
	}

	/**
	 * Add a wheel
	 * @method addWheel
	 * @param {object} options
	 * @param {boolean} [options.isFrontWheel]
	 * @param {Vec3} [options.position] Position of the wheel, locally in the chassis body.
	 * @param {Vec3} [options.direction] Slide direction of the wheel along the suspension.
	 * @param {Vec3} [options.axis] Axis of rotation of the wheel, locally defined in the chassis.
	 * @param {Body} [options.body] The wheel body.
	 */
	RigidVehicle.prototype.addWheel = function(options){
	    options = options || {};
	    var wheelBody = options.body;
	    if(!wheelBody){
	        wheelBody =  new Body(1, new Sphere(1.2));
	    }
	    this.wheelBodies.push(wheelBody);
	    this.wheelForces.push(0);

	    // Position constrain wheels
	    new Vec3();
	    var position = typeof(options.position) !== 'undefined' ? options.position.clone() : new Vec3();

	    // Set position locally to the chassis
	    var worldPosition = new Vec3();
	    this.chassisBody.pointToWorldFrame(position, worldPosition);
	    wheelBody.position.set(worldPosition.x, worldPosition.y, worldPosition.z);

	    // Constrain wheel
	    var axis = typeof(options.axis) !== 'undefined' ? options.axis.clone() : new Vec3(0, 1, 0);
	    this.wheelAxes.push(axis);

	    var hingeConstraint = new HingeConstraint(this.chassisBody, wheelBody, {
	        pivotA: position,
	        axisA: axis,
	        pivotB: Vec3.ZERO,
	        axisB: axis,
	        collideConnected: false
	    });
	    this.constraints.push(hingeConstraint);

	    return this.wheelBodies.length - 1;
	};

	/**
	 * Set the steering value of a wheel.
	 * @method setSteeringValue
	 * @param {number} value
	 * @param {integer} wheelIndex
	 * @todo check coordinateSystem
	 */
	RigidVehicle.prototype.setSteeringValue = function(value, wheelIndex){
	    // Set angle of the hinge axis
	    var axis = this.wheelAxes[wheelIndex];

	    var c = Math.cos(value),
	        s = Math.sin(value),
	        x = axis.x,
	        y = axis.y;
	    this.constraints[wheelIndex].axisA.set(
	        c*x -s*y,
	        s*x +c*y,
	        0
	    );
	};

	/**
	 * Set the target rotational speed of the hinge constraint.
	 * @method setMotorSpeed
	 * @param {number} value
	 * @param {integer} wheelIndex
	 */
	RigidVehicle.prototype.setMotorSpeed = function(value, wheelIndex){
	    var hingeConstraint = this.constraints[wheelIndex];
	    hingeConstraint.enableMotor();
	    hingeConstraint.motorTargetVelocity = value;
	};

	/**
	 * Set the target rotational speed of the hinge constraint.
	 * @method disableMotor
	 * @param {number} value
	 * @param {integer} wheelIndex
	 */
	RigidVehicle.prototype.disableMotor = function(wheelIndex){
	    var hingeConstraint = this.constraints[wheelIndex];
	    hingeConstraint.disableMotor();
	};

	var torque = new Vec3();

	/**
	 * Set the wheel force to apply on one of the wheels each time step
	 * @method setWheelForce
	 * @param  {number} value
	 * @param  {integer} wheelIndex
	 */
	RigidVehicle.prototype.setWheelForce = function(value, wheelIndex){
	    this.wheelForces[wheelIndex] = value;
	};

	/**
	 * Apply a torque on one of the wheels.
	 * @method applyWheelForce
	 * @param  {number} value
	 * @param  {integer} wheelIndex
	 */
	RigidVehicle.prototype.applyWheelForce = function(value, wheelIndex){
	    var axis = this.wheelAxes[wheelIndex];
	    var wheelBody = this.wheelBodies[wheelIndex];
	    var bodyTorque = wheelBody.torque;

	    axis.scale(value, torque);
	    wheelBody.vectorToWorldFrame(torque, torque);
	    bodyTorque.vadd(torque, bodyTorque);
	};

	/**
	 * Add the vehicle including its constraints to the world.
	 * @method addToWorld
	 * @param {World} world
	 */
	RigidVehicle.prototype.addToWorld = function(world){
	    var constraints = this.constraints;
	    var bodies = this.wheelBodies.concat([this.chassisBody]);

	    for (var i = 0; i < bodies.length; i++) {
	        world.add(bodies[i]);
	    }

	    for (var i = 0; i < constraints.length; i++) {
	        world.addConstraint(constraints[i]);
	    }

	    world.addEventListener('preStep', this._update.bind(this));
	};

	RigidVehicle.prototype._update = function(){
	    var wheelForces = this.wheelForces;
	    for (var i = 0; i < wheelForces.length; i++) {
	        this.applyWheelForce(wheelForces[i], i);
	    }
	};

	/**
	 * Remove the vehicle including its constraints from the world.
	 * @method removeFromWorld
	 * @param {World} world
	 */
	RigidVehicle.prototype.removeFromWorld = function(world){
	    var constraints = this.constraints;
	    var bodies = this.wheelBodies.concat([this.chassisBody]);

	    for (var i = 0; i < bodies.length; i++) {
	        world.remove(bodies[i]);
	    }

	    for (var i = 0; i < constraints.length; i++) {
	        world.removeConstraint(constraints[i]);
	    }
	};

	var worldAxis = new Vec3();

	/**
	 * Get current rotational velocity of a wheel
	 * @method getWheelSpeed
	 * @param {integer} wheelIndex
	 */
	RigidVehicle.prototype.getWheelSpeed = function(wheelIndex){
	    var axis = this.wheelAxes[wheelIndex];
	    var wheelBody = this.wheelBodies[wheelIndex];
	    var w = wheelBody.angularVelocity;
	    this.chassisBody.vectorToWorldFrame(axis, worldAxis);
	    return w.dot(worldAxis);
	};

	},{"../constraints/HingeConstraint":15,"../math/Vec3":30,"../shapes/Box":37,"../shapes/Sphere":44,"./Body":31}],34:[function(_dereq_,module,exports){
	module.exports = SPHSystem;

	_dereq_('../shapes/Shape');
	var Vec3 = _dereq_('../math/Vec3');
	_dereq_('../math/Quaternion');
	_dereq_('../shapes/Particle');
	_dereq_('../objects/Body');
	_dereq_('../material/Material');

	/**
	 * Smoothed-particle hydrodynamics system
	 * @class SPHSystem
	 * @constructor
	 */
	function SPHSystem(){
	    this.particles = [];
		
	    /**
	     * Density of the system (kg/m3).
	     * @property {number} density
	     */
	    this.density = 1;
		
	    /**
	     * Distance below which two particles are considered to be neighbors.
	     * It should be adjusted so there are about 15-20 neighbor particles within this radius.
	     * @property {number} smoothingRadius
	     */
	    this.smoothingRadius = 1;
	    this.speedOfSound = 1;
		
	    /**
	     * Viscosity of the system.
	     * @property {number} viscosity
	     */
	    this.viscosity = 0.01;
	    this.eps = 0.000001;

	    // Stuff Computed per particle
	    this.pressures = [];
	    this.densities = [];
	    this.neighbors = [];
	}

	/**
	 * Add a particle to the system.
	 * @method add
	 * @param {Body} particle
	 */
	SPHSystem.prototype.add = function(particle){
	    this.particles.push(particle);
	    if(this.neighbors.length < this.particles.length){
	        this.neighbors.push([]);
	    }
	};

	/**
	 * Remove a particle from the system.
	 * @method remove
	 * @param {Body} particle
	 */
	SPHSystem.prototype.remove = function(particle){
	    var idx = this.particles.indexOf(particle);
	    if(idx !== -1){
	        this.particles.splice(idx,1);
	        if(this.neighbors.length > this.particles.length){
	            this.neighbors.pop();
	        }
	    }
	};

	/**
	 * Get neighbors within smoothing volume, save in the array neighbors
	 * @method getNeighbors
	 * @param {Body} particle
	 * @param {Array} neighbors
	 */
	var SPHSystem_getNeighbors_dist = new Vec3();
	SPHSystem.prototype.getNeighbors = function(particle,neighbors){
	    var N = this.particles.length,
	        id = particle.id,
	        R2 = this.smoothingRadius * this.smoothingRadius,
	        dist = SPHSystem_getNeighbors_dist;
	    for(var i=0; i!==N; i++){
	        var p = this.particles[i];
	        p.position.vsub(particle.position,dist);
	        if(id!==p.id && dist.norm2() < R2){
	            neighbors.push(p);
	        }
	    }
	};

	// Temp vectors for calculation
	var SPHSystem_update_dist = new Vec3(),
	    SPHSystem_update_a_pressure = new Vec3(),
	    SPHSystem_update_a_visc = new Vec3(),
	    SPHSystem_update_gradW = new Vec3(),
	    SPHSystem_update_r_vec = new Vec3(),
	    SPHSystem_update_u = new Vec3(); // Relative velocity
	SPHSystem.prototype.update = function(){
	    var N = this.particles.length,
	        dist = SPHSystem_update_dist,
	        cs = this.speedOfSound,
	        eps = this.eps;

	    for(var i=0; i!==N; i++){
	        var p = this.particles[i]; // Current particle
	        var neighbors = this.neighbors[i];

	        // Get neighbors
	        neighbors.length = 0;
	        this.getNeighbors(p,neighbors);
	        neighbors.push(this.particles[i]); // Add current too
	        var numNeighbors = neighbors.length;

	        // Accumulate density for the particle
	        var sum = 0.0;
	        for(var j=0; j!==numNeighbors; j++){

	            //printf("Current particle has position %f %f %f\n",objects[id].pos.x(),objects[id].pos.y(),objects[id].pos.z());
	            p.position.vsub(neighbors[j].position, dist);
	            var len = dist.norm();

	            var weight = this.w(len);
	            sum += neighbors[j].mass * weight;
	        }

	        // Save
	        this.densities[i] = sum;
	        this.pressures[i] = cs * cs * (this.densities[i] - this.density);
	    }

	    // Add forces

	    // Sum to these accelerations
	    var a_pressure= SPHSystem_update_a_pressure;
	    var a_visc =    SPHSystem_update_a_visc;
	    var gradW =     SPHSystem_update_gradW;
	    var r_vec =     SPHSystem_update_r_vec;
	    var u =         SPHSystem_update_u;

	    for(var i=0; i!==N; i++){

	        var particle = this.particles[i];

	        a_pressure.set(0,0,0);
	        a_visc.set(0,0,0);

	        // Init vars
	        var Pij;
	        var nabla;

	        // Sum up for all other neighbors
	        var neighbors = this.neighbors[i];
	        var numNeighbors = neighbors.length;

	        //printf("Neighbors: ");
	        for(var j=0; j!==numNeighbors; j++){

	            var neighbor = neighbors[j];
	            //printf("%d ",nj);

	            // Get r once for all..
	            particle.position.vsub(neighbor.position,r_vec);
	            var r = r_vec.norm();

	            // Pressure contribution
	            Pij = -neighbor.mass * (this.pressures[i] / (this.densities[i]*this.densities[i] + eps) + this.pressures[j] / (this.densities[j]*this.densities[j] + eps));
	            this.gradw(r_vec, gradW);
	            // Add to pressure acceleration
	            gradW.mult(Pij , gradW);
	            a_pressure.vadd(gradW, a_pressure);

	            // Viscosity contribution
	            neighbor.velocity.vsub(particle.velocity, u);
	            u.mult( 1.0 / (0.0001+this.densities[i] * this.densities[j]) * this.viscosity * neighbor.mass , u );
	            nabla = this.nablaw(r);
	            u.mult(nabla,u);
	            // Add to viscosity acceleration
	            a_visc.vadd( u, a_visc );
	        }

	        // Calculate force
	        a_visc.mult(particle.mass, a_visc);
	        a_pressure.mult(particle.mass, a_pressure);

	        // Add force to particles
	        particle.force.vadd(a_visc, particle.force);
	        particle.force.vadd(a_pressure, particle.force);
	    }
	};

	// Calculate the weight using the W(r) weightfunction
	SPHSystem.prototype.w = function(r){
	    // 315
	    var h = this.smoothingRadius;
	    return 315.0/(64.0*Math.PI*Math.pow(h,9)) * Math.pow(h*h-r*r,3);
	};

	// calculate gradient of the weight function
	SPHSystem.prototype.gradw = function(rVec,resultVec){
	    var r = rVec.norm(),
	        h = this.smoothingRadius;
	    rVec.mult(945.0/(32.0*Math.PI*Math.pow(h,9)) * Math.pow((h*h-r*r),2) , resultVec);
	};

	// Calculate nabla(W)
	SPHSystem.prototype.nablaw = function(r){
	    var h = this.smoothingRadius;
	    var nabla = 945.0/(32.0*Math.PI*Math.pow(h,9)) * (h*h-r*r)*(7*r*r - 3*h*h);
	    return nabla;
	};

	},{"../material/Material":25,"../math/Quaternion":28,"../math/Vec3":30,"../objects/Body":31,"../shapes/Particle":41,"../shapes/Shape":43}],35:[function(_dereq_,module,exports){
	var Vec3 = _dereq_('../math/Vec3');

	module.exports = Spring;

	/**
	 * A spring, connecting two bodies.
	 *
	 * @class Spring
	 * @constructor
	 * @param {Body} bodyA
	 * @param {Body} bodyB
	 * @param {Object} [options]
	 * @param {number} [options.restLength]   A number > 0. Default: 1
	 * @param {number} [options.stiffness]    A number >= 0. Default: 100
	 * @param {number} [options.damping]      A number >= 0. Default: 1
	 * @param {Vec3}  [options.worldAnchorA] Where to hook the spring to body A, in world coordinates.
	 * @param {Vec3}  [options.worldAnchorB]
	 * @param {Vec3}  [options.localAnchorA] Where to hook the spring to body A, in local body coordinates.
	 * @param {Vec3}  [options.localAnchorB]
	 */
	function Spring(bodyA,bodyB,options){
	    options = options || {};

	    /**
	     * Rest length of the spring.
	     * @property restLength
	     * @type {number}
	     */
	    this.restLength = typeof(options.restLength) === "number" ? options.restLength : 1;

	    /**
	     * Stiffness of the spring.
	     * @property stiffness
	     * @type {number}
	     */
	    this.stiffness = options.stiffness || 100;

	    /**
	     * Damping of the spring.
	     * @property damping
	     * @type {number}
	     */
	    this.damping = options.damping || 1;

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

	    /**
	     * Anchor for bodyA in local bodyA coordinates.
	     * @property localAnchorA
	     * @type {Vec3}
	     */
	    this.localAnchorA = new Vec3();

	    /**
	     * Anchor for bodyB in local bodyB coordinates.
	     * @property localAnchorB
	     * @type {Vec3}
	     */
	    this.localAnchorB = new Vec3();

	    if(options.localAnchorA){
	        this.localAnchorA.copy(options.localAnchorA);
	    }
	    if(options.localAnchorB){
	        this.localAnchorB.copy(options.localAnchorB);
	    }
	    if(options.worldAnchorA){
	        this.setWorldAnchorA(options.worldAnchorA);
	    }
	    if(options.worldAnchorB){
	        this.setWorldAnchorB(options.worldAnchorB);
	    }
	}

	/**
	 * Set the anchor point on body A, using world coordinates.
	 * @method setWorldAnchorA
	 * @param {Vec3} worldAnchorA
	 */
	Spring.prototype.setWorldAnchorA = function(worldAnchorA){
	    this.bodyA.pointToLocalFrame(worldAnchorA,this.localAnchorA);
	};

	/**
	 * Set the anchor point on body B, using world coordinates.
	 * @method setWorldAnchorB
	 * @param {Vec3} worldAnchorB
	 */
	Spring.prototype.setWorldAnchorB = function(worldAnchorB){
	    this.bodyB.pointToLocalFrame(worldAnchorB,this.localAnchorB);
	};

	/**
	 * Get the anchor point on body A, in world coordinates.
	 * @method getWorldAnchorA
	 * @param {Vec3} result The vector to store the result in.
	 */
	Spring.prototype.getWorldAnchorA = function(result){
	    this.bodyA.pointToWorldFrame(this.localAnchorA,result);
	};

	/**
	 * Get the anchor point on body B, in world coordinates.
	 * @method getWorldAnchorB
	 * @param {Vec3} result The vector to store the result in.
	 */
	Spring.prototype.getWorldAnchorB = function(result){
	    this.bodyB.pointToWorldFrame(this.localAnchorB,result);
	};

	var applyForce_r =              new Vec3(),
	    applyForce_r_unit =         new Vec3(),
	    applyForce_u =              new Vec3(),
	    applyForce_f =              new Vec3(),
	    applyForce_worldAnchorA =   new Vec3(),
	    applyForce_worldAnchorB =   new Vec3(),
	    applyForce_ri =             new Vec3(),
	    applyForce_rj =             new Vec3(),
	    applyForce_ri_x_f =         new Vec3(),
	    applyForce_rj_x_f =         new Vec3(),
	    applyForce_tmp =            new Vec3();

	/**
	 * Apply the spring force to the connected bodies.
	 * @method applyForce
	 */
	Spring.prototype.applyForce = function(){
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
	        rj = applyForce_rj,
	        ri_x_f = applyForce_ri_x_f,
	        rj_x_f = applyForce_rj_x_f;

	    // Get world anchors
	    this.getWorldAnchorA(worldAnchorA);
	    this.getWorldAnchorB(worldAnchorB);

	    // Get offset points
	    worldAnchorA.vsub(bodyA.position,ri);
	    worldAnchorB.vsub(bodyB.position,rj);

	    // Compute distance vector between world anchor points
	    worldAnchorB.vsub(worldAnchorA,r);
	    var rlen = r.norm();
	    r_unit.copy(r);
	    r_unit.normalize();

	    // Compute relative velocity of the anchor points, u
	    bodyB.velocity.vsub(bodyA.velocity,u);
	    // Add rotational velocity

	    bodyB.angularVelocity.cross(rj,tmp);
	    u.vadd(tmp,u);
	    bodyA.angularVelocity.cross(ri,tmp);
	    u.vsub(tmp,u);

	    // F = - k * ( x - L ) - D * ( u )
	    r_unit.mult(-k*(rlen-l) - d*u.dot(r_unit), f);

	    // Add forces to bodies
	    bodyA.force.vsub(f,bodyA.force);
	    bodyB.force.vadd(f,bodyB.force);

	    // Angular force
	    ri.cross(f,ri_x_f);
	    rj.cross(f,rj_x_f);
	    bodyA.torque.vsub(ri_x_f,bodyA.torque);
	    bodyB.torque.vadd(rj_x_f,bodyB.torque);
	};

	},{"../math/Vec3":30}],36:[function(_dereq_,module,exports){
	var Vec3 = _dereq_('../math/Vec3');
	var Transform = _dereq_('../math/Transform');
	var RaycastResult = _dereq_('../collision/RaycastResult');
	var Utils = _dereq_('../utils/Utils');

	module.exports = WheelInfo;

	/**
	 * @class WheelInfo
	 * @constructor
	 * @param {Object} [options]
	 *
	 * @param {Vec3} [options.chassisConnectionPointLocal]
	 * @param {Vec3} [options.chassisConnectionPointWorld]
	 * @param {Vec3} [options.directionLocal]
	 * @param {Vec3} [options.directionWorld]
	 * @param {Vec3} [options.axleLocal]
	 * @param {Vec3} [options.axleWorld]
	 * @param {number} [options.suspensionRestLength=1]
	 * @param {number} [options.suspensionMaxLength=2]
	 * @param {number} [options.radius=1]
	 * @param {number} [options.suspensionStiffness=100]
	 * @param {number} [options.dampingCompression=10]
	 * @param {number} [options.dampingRelaxation=10]
	 * @param {number} [options.frictionSlip=10000]
	 * @param {number} [options.steering=0]
	 * @param {number} [options.rotation=0]
	 * @param {number} [options.deltaRotation=0]
	 * @param {number} [options.rollInfluence=0.01]
	 * @param {number} [options.maxSuspensionForce]
	 * @param {boolean} [options.isFrontWheel=true]
	 * @param {number} [options.clippedInvContactDotSuspension=1]
	 * @param {number} [options.suspensionRelativeVelocity=0]
	 * @param {number} [options.suspensionForce=0]
	 * @param {number} [options.skidInfo=0]
	 * @param {number} [options.suspensionLength=0]
	 * @param {number} [options.maxSuspensionTravel=1]
	 * @param {boolean} [options.useCustomSlidingRotationalSpeed=false]
	 * @param {number} [options.customSlidingRotationalSpeed=-0.1]
	 */
	function WheelInfo(options){
	    options = Utils.defaults(options, {
	        chassisConnectionPointLocal: new Vec3(),
	        chassisConnectionPointWorld: new Vec3(),
	        directionLocal: new Vec3(),
	        directionWorld: new Vec3(),
	        axleLocal: new Vec3(),
	        axleWorld: new Vec3(),
	        suspensionRestLength: 1,
	        suspensionMaxLength: 2,
	        radius: 1,
	        suspensionStiffness: 100,
	        dampingCompression: 10,
	        dampingRelaxation: 10,
	        frictionSlip: 10000,
	        steering: 0,
	        rotation: 0,
	        deltaRotation: 0,
	        rollInfluence: 0.01,
	        maxSuspensionForce: Number.MAX_VALUE,
	        isFrontWheel: true,
	        clippedInvContactDotSuspension: 1,
	        suspensionRelativeVelocity: 0,
	        suspensionForce: 0,
	        skidInfo: 0,
	        suspensionLength: 0,
	        maxSuspensionTravel: 1,
	        useCustomSlidingRotationalSpeed: false,
	        customSlidingRotationalSpeed: -0.1
	    });

	    /**
	     * Max travel distance of the suspension, in meters.
	     * @property {number} maxSuspensionTravel
	     */
	    this.maxSuspensionTravel = options.maxSuspensionTravel;

	    /**
	     * Speed to apply to the wheel rotation when the wheel is sliding.
	     * @property {number} customSlidingRotationalSpeed
	     */
	    this.customSlidingRotationalSpeed = options.customSlidingRotationalSpeed;

	    /**
	     * If the customSlidingRotationalSpeed should be used.
	     * @property {Boolean} useCustomSlidingRotationalSpeed
	     */
	    this.useCustomSlidingRotationalSpeed = options.useCustomSlidingRotationalSpeed;

	    /**
	     * @property {Boolean} sliding
	     */
	    this.sliding = false;

	    /**
	     * Connection point, defined locally in the chassis body frame.
	     * @property {Vec3} chassisConnectionPointLocal
	     */
	    this.chassisConnectionPointLocal = options.chassisConnectionPointLocal.clone();

	    /**
	     * @property {Vec3} chassisConnectionPointWorld
	     */
	    this.chassisConnectionPointWorld = options.chassisConnectionPointWorld.clone();

	    /**
	     * @property {Vec3} directionLocal
	     */
	    this.directionLocal = options.directionLocal.clone();

	    /**
	     * @property {Vec3} directionWorld
	     */
	    this.directionWorld = options.directionWorld.clone();

	    /**
	     * @property {Vec3} axleLocal
	     */
	    this.axleLocal = options.axleLocal.clone();

	    /**
	     * @property {Vec3} axleWorld
	     */
	    this.axleWorld = options.axleWorld.clone();

	    /**
	     * @property {number} suspensionRestLength
	     */
	    this.suspensionRestLength = options.suspensionRestLength;

	    /**
	     * @property {number} suspensionMaxLength
	     */
	    this.suspensionMaxLength = options.suspensionMaxLength;

	    /**
	     * @property {number} radius
	     */
	    this.radius = options.radius;

	    /**
	     * @property {number} suspensionStiffness
	     */
	    this.suspensionStiffness = options.suspensionStiffness;

	    /**
	     * @property {number} dampingCompression
	     */
	    this.dampingCompression = options.dampingCompression;

	    /**
	     * @property {number} dampingRelaxation
	     */
	    this.dampingRelaxation = options.dampingRelaxation;

	    /**
	     * @property {number} frictionSlip
	     */
	    this.frictionSlip = options.frictionSlip;

	    /**
	     * @property {number} steering
	     */
	    this.steering = 0;

	    /**
	     * Rotation value, in radians.
	     * @property {number} rotation
	     */
	    this.rotation = 0;

	    /**
	     * @property {number} deltaRotation
	     */
	    this.deltaRotation = 0;

	    /**
	     * @property {number} rollInfluence
	     */
	    this.rollInfluence = options.rollInfluence;

	    /**
	     * @property {number} maxSuspensionForce
	     */
	    this.maxSuspensionForce = options.maxSuspensionForce;

	    /**
	     * @property {number} engineForce
	     */
	    this.engineForce = 0;

	    /**
	     * @property {number} brake
	     */
	    this.brake = 0;

	    /**
	     * @property {number} isFrontWheel
	     */
	    this.isFrontWheel = options.isFrontWheel;

	    /**
	     * @property {number} clippedInvContactDotSuspension
	     */
	    this.clippedInvContactDotSuspension = 1;

	    /**
	     * @property {number} suspensionRelativeVelocity
	     */
	    this.suspensionRelativeVelocity = 0;

	    /**
	     * @property {number} suspensionForce
	     */
	    this.suspensionForce = 0;

	    /**
	     * @property {number} skidInfo
	     */
	    this.skidInfo = 0;

	    /**
	     * @property {number} suspensionLength
	     */
	    this.suspensionLength = 0;

	    /**
	     * @property {number} sideImpulse
	     */
	    this.sideImpulse = 0;

	    /**
	     * @property {number} forwardImpulse
	     */
	    this.forwardImpulse = 0;

	    /**
	     * The result from raycasting
	     * @property {RaycastResult} raycastResult
	     */
	    this.raycastResult = new RaycastResult();

	    /**
	     * Wheel world transform
	     * @property {Transform} worldTransform
	     */
	    this.worldTransform = new Transform();

	    /**
	     * @property {boolean} isInContact
	     */
	    this.isInContact = false;
	}

	var chassis_velocity_at_contactPoint = new Vec3();
	var relpos = new Vec3();
	var chassis_velocity_at_contactPoint = new Vec3();
	WheelInfo.prototype.updateWheel = function(chassis){
	    var raycastResult = this.raycastResult;

	    if (this.isInContact){
	        var project= raycastResult.hitNormalWorld.dot(raycastResult.directionWorld);
	        raycastResult.hitPointWorld.vsub(chassis.position, relpos);
	        chassis.getVelocityAtWorldPoint(relpos, chassis_velocity_at_contactPoint);
	        var projVel = raycastResult.hitNormalWorld.dot( chassis_velocity_at_contactPoint );
	        if (project >= -0.1) {
	            this.suspensionRelativeVelocity = 0.0;
	            this.clippedInvContactDotSuspension = 1.0 / 0.1;
	        } else {
	            var inv = -1 / project;
	            this.suspensionRelativeVelocity = projVel * inv;
	            this.clippedInvContactDotSuspension = inv;
	        }

	    } else {
	        // Not in contact : position wheel in a nice (rest length) position
	        raycastResult.suspensionLength = this.suspensionRestLength;
	        this.suspensionRelativeVelocity = 0.0;
	        raycastResult.directionWorld.scale(-1, raycastResult.hitNormalWorld);
	        this.clippedInvContactDotSuspension = 1.0;
	    }
	};
	},{"../collision/RaycastResult":10,"../math/Transform":29,"../math/Vec3":30,"../utils/Utils":53}],37:[function(_dereq_,module,exports){
	module.exports = Box;

	var Shape = _dereq_('./Shape');
	var Vec3 = _dereq_('../math/Vec3');
	var ConvexPolyhedron = _dereq_('./ConvexPolyhedron');

	/**
	 * A 3d box shape.
	 * @class Box
	 * @constructor
	 * @param {Vec3} halfExtents
	 * @author schteppe
	 * @extends Shape
	 */
	function Box(halfExtents){
	    Shape.call(this);

	    this.type = Shape.types.BOX;

	    /**
	     * @property halfExtents
	     * @type {Vec3}
	     */
	    this.halfExtents = halfExtents;

	    /**
	     * Used by the contact generator to make contacts with other convex polyhedra for example
	     * @property convexPolyhedronRepresentation
	     * @type {ConvexPolyhedron}
	     */
	    this.convexPolyhedronRepresentation = null;

	    this.updateConvexPolyhedronRepresentation();
	    this.updateBoundingSphereRadius();
	}
	Box.prototype = new Shape();
	Box.prototype.constructor = Box;

	/**
	 * Updates the local convex polyhedron representation used for some collisions.
	 * @method updateConvexPolyhedronRepresentation
	 */
	Box.prototype.updateConvexPolyhedronRepresentation = function(){
	    var sx = this.halfExtents.x;
	    var sy = this.halfExtents.y;
	    var sz = this.halfExtents.z;
	    var V = Vec3;

	    var vertices = [
	        new V(-sx,-sy,-sz),
	        new V( sx,-sy,-sz),
	        new V( sx, sy,-sz),
	        new V(-sx, sy,-sz),
	        new V(-sx,-sy, sz),
	        new V( sx,-sy, sz),
	        new V( sx, sy, sz),
	        new V(-sx, sy, sz)
	    ];

	    var indices = [
	        [3,2,1,0], // -z
	        [4,5,6,7], // +z
	        [5,4,0,1], // -y
	        [2,3,7,6], // +y
	        [0,4,7,3], // -x
	        [1,2,6,5], // +x
	    ];

	    [
	        new V(0, 0, 1),
	        new V(0, 1, 0),
	        new V(1, 0, 0)
	    ];

	    var h = new ConvexPolyhedron(vertices, indices);
	    this.convexPolyhedronRepresentation = h;
	    h.material = this.material;
	};

	/**
	 * @method calculateLocalInertia
	 * @param  {Number} mass
	 * @param  {Vec3} target
	 * @return {Vec3}
	 */
	Box.prototype.calculateLocalInertia = function(mass,target){
	    target = target || new Vec3();
	    Box.calculateInertia(this.halfExtents, mass, target);
	    return target;
	};

	Box.calculateInertia = function(halfExtents,mass,target){
	    var e = halfExtents;
	    target.x = 1.0 / 12.0 * mass * (   2*e.y*2*e.y + 2*e.z*2*e.z );
	    target.y = 1.0 / 12.0 * mass * (   2*e.x*2*e.x + 2*e.z*2*e.z );
	    target.z = 1.0 / 12.0 * mass * (   2*e.y*2*e.y + 2*e.x*2*e.x );
	};

	/**
	 * Get the box 6 side normals
	 * @method getSideNormals
	 * @param {array}      sixTargetVectors An array of 6 vectors, to store the resulting side normals in.
	 * @param {Quaternion} quat             Orientation to apply to the normal vectors. If not provided, the vectors will be in respect to the local frame.
	 * @return {array}
	 */
	Box.prototype.getSideNormals = function(sixTargetVectors,quat){
	    var sides = sixTargetVectors;
	    var ex = this.halfExtents;
	    sides[0].set(  ex.x,     0,     0);
	    sides[1].set(     0,  ex.y,     0);
	    sides[2].set(     0,     0,  ex.z);
	    sides[3].set( -ex.x,     0,     0);
	    sides[4].set(     0, -ex.y,     0);
	    sides[5].set(     0,     0, -ex.z);

	    if(quat!==undefined){
	        for(var i=0; i!==sides.length; i++){
	            quat.vmult(sides[i],sides[i]);
	        }
	    }

	    return sides;
	};

	Box.prototype.volume = function(){
	    return 8.0 * this.halfExtents.x * this.halfExtents.y * this.halfExtents.z;
	};

	Box.prototype.updateBoundingSphereRadius = function(){
	    this.boundingSphereRadius = this.halfExtents.norm();
	};

	var worldCornerTempPos = new Vec3();
	new Vec3();
	Box.prototype.forEachWorldCorner = function(pos,quat,callback){

	    var e = this.halfExtents;
	    var corners = [[  e.x,  e.y,  e.z],
	                   [ -e.x,  e.y,  e.z],
	                   [ -e.x, -e.y,  e.z],
	                   [ -e.x, -e.y, -e.z],
	                   [  e.x, -e.y, -e.z],
	                   [  e.x,  e.y, -e.z],
	                   [ -e.x,  e.y, -e.z],
	                   [  e.x, -e.y,  e.z]];
	    for(var i=0; i<corners.length; i++){
	        worldCornerTempPos.set(corners[i][0],corners[i][1],corners[i][2]);
	        quat.vmult(worldCornerTempPos,worldCornerTempPos);
	        pos.vadd(worldCornerTempPos,worldCornerTempPos);
	        callback(worldCornerTempPos.x,
	                 worldCornerTempPos.y,
	                 worldCornerTempPos.z);
	    }
	};

	var worldCornersTemp = [
	    new Vec3(),
	    new Vec3(),
	    new Vec3(),
	    new Vec3(),
	    new Vec3(),
	    new Vec3(),
	    new Vec3(),
	    new Vec3()
	];
	Box.prototype.calculateWorldAABB = function(pos,quat,min,max){

	    var e = this.halfExtents;
	    worldCornersTemp[0].set(e.x, e.y, e.z);
	    worldCornersTemp[1].set(-e.x,  e.y, e.z);
	    worldCornersTemp[2].set(-e.x, -e.y, e.z);
	    worldCornersTemp[3].set(-e.x, -e.y, -e.z);
	    worldCornersTemp[4].set(e.x, -e.y, -e.z);
	    worldCornersTemp[5].set(e.x,  e.y, -e.z);
	    worldCornersTemp[6].set(-e.x,  e.y, -e.z);
	    worldCornersTemp[7].set(e.x, -e.y,  e.z);

	    var wc = worldCornersTemp[0];
	    quat.vmult(wc, wc);
	    pos.vadd(wc, wc);
	    max.copy(wc);
	    min.copy(wc);
	    for(var i=1; i<8; i++){
	        var wc = worldCornersTemp[i];
	        quat.vmult(wc, wc);
	        pos.vadd(wc, wc);
	        var x = wc.x;
	        var y = wc.y;
	        var z = wc.z;
	        if(x > max.x){
	            max.x = x;
	        }
	        if(y > max.y){
	            max.y = y;
	        }
	        if(z > max.z){
	            max.z = z;
	        }

	        if(x < min.x){
	            min.x = x;
	        }
	        if(y < min.y){
	            min.y = y;
	        }
	        if(z < min.z){
	            min.z = z;
	        }
	    }

	    // Get each axis max
	    // min.set(Infinity,Infinity,Infinity);
	    // max.set(-Infinity,-Infinity,-Infinity);
	    // this.forEachWorldCorner(pos,quat,function(x,y,z){
	    //     if(x > max.x){
	    //         max.x = x;
	    //     }
	    //     if(y > max.y){
	    //         max.y = y;
	    //     }
	    //     if(z > max.z){
	    //         max.z = z;
	    //     }

	    //     if(x < min.x){
	    //         min.x = x;
	    //     }
	    //     if(y < min.y){
	    //         min.y = y;
	    //     }
	    //     if(z < min.z){
	    //         min.z = z;
	    //     }
	    // });
	};

	},{"../math/Vec3":30,"./ConvexPolyhedron":38,"./Shape":43}],38:[function(_dereq_,module,exports){
	module.exports = ConvexPolyhedron;

	var Shape = _dereq_('./Shape');
	var Vec3 = _dereq_('../math/Vec3');
	_dereq_('../math/Quaternion');
	var Transform = _dereq_('../math/Transform');

	/**
	 * A set of polygons describing a convex shape.
	 * @class ConvexPolyhedron
	 * @constructor
	 * @extends Shape
	 * @description The shape MUST be convex for the code to work properly. No polygons may be coplanar (contained
	 * in the same 3D plane), instead these should be merged into one polygon.
	 *
	 * @param {array} points An array of Vec3's
	 * @param {array} faces Array of integer arrays, describing which vertices that is included in each face.
	 *
	 * @author qiao / https://github.com/qiao (original author, see https://github.com/qiao/three.js/commit/85026f0c769e4000148a67d45a9e9b9c5108836f)
	 * @author schteppe / https://github.com/schteppe
	 * @see http://www.altdevblogaday.com/2011/05/13/contact-generation-between-3d-convex-meshes/
	 * @see http://bullet.googlecode.com/svn/trunk/src/BulletCollision/NarrowPhaseCollision/btPolyhedralContactClipping.cpp
	 *
	 * @todo Move the clipping functions to ContactGenerator?
	 * @todo Automatically merge coplanar polygons in constructor.
	 */
	function ConvexPolyhedron(points, faces, uniqueAxes) {
	    Shape.call(this);
	    this.type = Shape.types.CONVEXPOLYHEDRON;

	    /**
	     * Array of Vec3
	     * @property vertices
	     * @type {Array}
	     */
	    this.vertices = points||[];

	    this.worldVertices = []; // World transformed version of .vertices
	    this.worldVerticesNeedsUpdate = true;

	    /**
	     * Array of integer arrays, indicating which vertices each face consists of
	     * @property faces
	     * @type {Array}
	     */
	    this.faces = faces||[];

	    /**
	     * Array of Vec3
	     * @property faceNormals
	     * @type {Array}
	     */
	    this.faceNormals = [];
	    this.computeNormals();

	    this.worldFaceNormalsNeedsUpdate = true;
	    this.worldFaceNormals = []; // World transformed version of .faceNormals

	    /**
	     * Array of Vec3
	     * @property uniqueEdges
	     * @type {Array}
	     */
	    this.uniqueEdges = [];

	    /**
	     * If given, these locally defined, normalized axes are the only ones being checked when doing separating axis check.
	     * @property {Array} uniqueAxes
	     */
	    this.uniqueAxes = uniqueAxes ? uniqueAxes.slice() : null;

	    this.computeEdges();
	    this.updateBoundingSphereRadius();
	}
	ConvexPolyhedron.prototype = new Shape();
	ConvexPolyhedron.prototype.constructor = ConvexPolyhedron;

	var computeEdges_tmpEdge = new Vec3();
	/**
	 * Computes uniqueEdges
	 * @method computeEdges
	 */
	ConvexPolyhedron.prototype.computeEdges = function(){
	    var faces = this.faces;
	    var vertices = this.vertices;
	    vertices.length;
	    var edges = this.uniqueEdges;

	    edges.length = 0;

	    var edge = computeEdges_tmpEdge;

	    for(var i=0; i !== faces.length; i++){
	        var face = faces[i];
	        var numVertices = face.length;
	        for(var j = 0; j !== numVertices; j++){
	            var k = ( j+1 ) % numVertices;
	            vertices[face[j]].vsub(vertices[face[k]], edge);
	            edge.normalize();
	            var found = false;
	            for(var p=0; p !== edges.length; p++){
	                if (edges[p].almostEquals(edge) || edges[p].almostEquals(edge)){
	                    found = true;
	                    break;
	                }
	            }

	            if (!found){
	                edges.push(edge.clone());
	            }
	        }
	    }
	};

	/**
	 * Compute the normals of the faces. Will reuse existing Vec3 objects in the .faceNormals array if they exist.
	 * @method computeNormals
	 */
	ConvexPolyhedron.prototype.computeNormals = function(){
	    this.faceNormals.length = this.faces.length;

	    // Generate normals
	    for(var i=0; i<this.faces.length; i++){

	        // Check so all vertices exists for this face
	        for(var j=0; j<this.faces[i].length; j++){
	            if(!this.vertices[this.faces[i][j]]){
	                throw new Error("Vertex "+this.faces[i][j]+" not found!");
	            }
	        }

	        var n = this.faceNormals[i] || new Vec3();
	        this.getFaceNormal(i,n);
	        n.negate(n);
	        this.faceNormals[i] = n;
	        var vertex = this.vertices[this.faces[i][0]];
	        if(n.dot(vertex) < 0){
	            console.error(".faceNormals[" + i + "] = Vec3("+n.toString()+") looks like it points into the shape? The vertices follow. Make sure they are ordered CCW around the normal, using the right hand rule.");
	            for(var j=0; j<this.faces[i].length; j++){
	                console.warn(".vertices["+this.faces[i][j]+"] = Vec3("+this.vertices[this.faces[i][j]].toString()+")");
	            }
	        }
	    }
	};

	/**
	 * Get face normal given 3 vertices
	 * @static
	 * @method getFaceNormal
	 * @param {Vec3} va
	 * @param {Vec3} vb
	 * @param {Vec3} vc
	 * @param {Vec3} target
	 */
	var cb = new Vec3();
	var ab = new Vec3();
	ConvexPolyhedron.computeNormal = function ( va, vb, vc, target ) {
	    vb.vsub(va,ab);
	    vc.vsub(vb,cb);
	    cb.cross(ab,target);
	    if ( !target.isZero() ) {
	        target.normalize();
	    }
	};

	/**
	 * Compute the normal of a face from its vertices
	 * @method getFaceNormal
	 * @param  {Number} i
	 * @param  {Vec3} target
	 */
	ConvexPolyhedron.prototype.getFaceNormal = function(i,target){
	    var f = this.faces[i];
	    var va = this.vertices[f[0]];
	    var vb = this.vertices[f[1]];
	    var vc = this.vertices[f[2]];
	    return ConvexPolyhedron.computeNormal(va,vb,vc,target);
	};

	/**
	 * @method clipAgainstHull
	 * @param {Vec3} posA
	 * @param {Quaternion} quatA
	 * @param {ConvexPolyhedron} hullB
	 * @param {Vec3} posB
	 * @param {Quaternion} quatB
	 * @param {Vec3} separatingNormal
	 * @param {Number} minDist Clamp distance
	 * @param {Number} maxDist
	 * @param {array} result The an array of contact point objects, see clipFaceAgainstHull
	 * @see http://bullet.googlecode.com/svn/trunk/src/BulletCollision/NarrowPhaseCollision/btPolyhedralContactClipping.cpp
	 */
	var cah_WorldNormal = new Vec3();
	ConvexPolyhedron.prototype.clipAgainstHull = function(posA,quatA,hullB,posB,quatB,separatingNormal,minDist,maxDist,result){
	    var WorldNormal = cah_WorldNormal;
	    var closestFaceB = -1;
	    var dmax = -Number.MAX_VALUE;
	    for(var face=0; face < hullB.faces.length; face++){
	        WorldNormal.copy(hullB.faceNormals[face]);
	        quatB.vmult(WorldNormal,WorldNormal);
	        //posB.vadd(WorldNormal,WorldNormal);
	        var d = WorldNormal.dot(separatingNormal);
	        if (d > dmax){
	            dmax = d;
	            closestFaceB = face;
	        }
	    }
	    var worldVertsB1 = [];
	    var polyB = hullB.faces[closestFaceB];
	    var numVertices = polyB.length;
	    for(var e0=0; e0<numVertices; e0++){
	        var b = hullB.vertices[polyB[e0]];
	        var worldb = new Vec3();
	        worldb.copy(b);
	        quatB.vmult(worldb,worldb);
	        posB.vadd(worldb,worldb);
	        worldVertsB1.push(worldb);
	    }

	    if (closestFaceB>=0){
	        this.clipFaceAgainstHull(separatingNormal,
	                                 posA,
	                                 quatA,
	                                 worldVertsB1,
	                                 minDist,
	                                 maxDist,
	                                 result);
	    }
	};

	/**
	 * Find the separating axis between this hull and another
	 * @method findSeparatingAxis
	 * @param {ConvexPolyhedron} hullB
	 * @param {Vec3} posA
	 * @param {Quaternion} quatA
	 * @param {Vec3} posB
	 * @param {Quaternion} quatB
	 * @param {Vec3} target The target vector to save the axis in
	 * @return {bool} Returns false if a separation is found, else true
	 */
	var fsa_faceANormalWS3 = new Vec3(),
	    fsa_Worldnormal1 = new Vec3(),
	    fsa_deltaC = new Vec3(),
	    fsa_worldEdge0 = new Vec3(),
	    fsa_worldEdge1 = new Vec3(),
	    fsa_Cross = new Vec3();
	ConvexPolyhedron.prototype.findSeparatingAxis = function(hullB,posA,quatA,posB,quatB,target, faceListA, faceListB){
	    var faceANormalWS3 = fsa_faceANormalWS3,
	        Worldnormal1 = fsa_Worldnormal1,
	        deltaC = fsa_deltaC,
	        worldEdge0 = fsa_worldEdge0,
	        worldEdge1 = fsa_worldEdge1,
	        Cross = fsa_Cross;

	    var dmin = Number.MAX_VALUE;
	    var hullA = this;

	    if(!hullA.uniqueAxes){

	        var numFacesA = faceListA ? faceListA.length : hullA.faces.length;

	        // Test face normals from hullA
	        for(var i=0; i<numFacesA; i++){
	            var fi = faceListA ? faceListA[i] : i;

	            // Get world face normal
	            faceANormalWS3.copy(hullA.faceNormals[fi]);
	            quatA.vmult(faceANormalWS3,faceANormalWS3);

	            var d = hullA.testSepAxis(faceANormalWS3, hullB, posA, quatA, posB, quatB);
	            if(d===false){
	                return false;
	            }

	            if(d<dmin){
	                dmin = d;
	                target.copy(faceANormalWS3);
	            }
	        }

	    } else {

	        // Test unique axes
	        for(var i = 0; i !== hullA.uniqueAxes.length; i++){

	            // Get world axis
	            quatA.vmult(hullA.uniqueAxes[i],faceANormalWS3);

	            var d = hullA.testSepAxis(faceANormalWS3, hullB, posA, quatA, posB, quatB);
	            if(d===false){
	                return false;
	            }

	            if(d<dmin){
	                dmin = d;
	                target.copy(faceANormalWS3);
	            }
	        }
	    }

	    if(!hullB.uniqueAxes){

	        // Test face normals from hullB
	        var numFacesB = faceListB ? faceListB.length : hullB.faces.length;
	        for(var i=0;i<numFacesB;i++){

	            var fi = faceListB ? faceListB[i] : i;

	            Worldnormal1.copy(hullB.faceNormals[fi]);
	            quatB.vmult(Worldnormal1,Worldnormal1);
	            var d = hullA.testSepAxis(Worldnormal1, hullB,posA,quatA,posB,quatB);
	            if(d===false){
	                return false;
	            }

	            if(d<dmin){
	                dmin = d;
	                target.copy(Worldnormal1);
	            }
	        }
	    } else {

	        // Test unique axes in B
	        for(var i = 0; i !== hullB.uniqueAxes.length; i++){
	            quatB.vmult(hullB.uniqueAxes[i],Worldnormal1);
	            var d = hullA.testSepAxis(Worldnormal1, hullB,posA,quatA,posB,quatB);
	            if(d===false){
	                return false;
	            }

	            if(d<dmin){
	                dmin = d;
	                target.copy(Worldnormal1);
	            }
	        }
	    }

	    // Test edges
	    for(var e0=0; e0 !== hullA.uniqueEdges.length; e0++){

	        // Get world edge
	        quatA.vmult(hullA.uniqueEdges[e0],worldEdge0);

	        for(var e1=0; e1 !== hullB.uniqueEdges.length; e1++){

	            // Get world edge 2
	            quatB.vmult(hullB.uniqueEdges[e1], worldEdge1);
	            worldEdge0.cross(worldEdge1,Cross);

	            if(!Cross.almostZero()){
	                Cross.normalize();
	                var dist = hullA.testSepAxis(Cross, hullB, posA, quatA, posB, quatB);
	                if(dist === false){
	                    return false;
	                }
	                if(dist < dmin){
	                    dmin = dist;
	                    target.copy(Cross);
	                }
	            }
	        }
	    }

	    posB.vsub(posA,deltaC);
	    if((deltaC.dot(target))>0.0){
	        target.negate(target);
	    }

	    return true;
	};

	var maxminA=[], maxminB=[];

	/**
	 * Test separating axis against two hulls. Both hulls are projected onto the axis and the overlap size is returned if there is one.
	 * @method testSepAxis
	 * @param {Vec3} axis
	 * @param {ConvexPolyhedron} hullB
	 * @param {Vec3} posA
	 * @param {Quaternion} quatA
	 * @param {Vec3} posB
	 * @param {Quaternion} quatB
	 * @return {number} The overlap depth, or FALSE if no penetration.
	 */
	ConvexPolyhedron.prototype.testSepAxis = function(axis, hullB, posA, quatA, posB, quatB){
	    var hullA=this;
	    ConvexPolyhedron.project(hullA, axis, posA, quatA, maxminA);
	    ConvexPolyhedron.project(hullB, axis, posB, quatB, maxminB);
	    var maxA = maxminA[0];
	    var minA = maxminA[1];
	    var maxB = maxminB[0];
	    var minB = maxminB[1];
	    var d0 = maxA - minB;
	    var d1 = maxB - minA;
	    var depth = d0<d1 ? d0:d1;
	    return depth;
	};

	var cli_aabbmin = new Vec3(),
	    cli_aabbmax = new Vec3();

	/**
	 * @method calculateLocalInertia
	 * @param  {Number} mass
	 * @param  {Vec3} target
	 */
	ConvexPolyhedron.prototype.calculateLocalInertia = function(mass,target){
	    // Approximate with box inertia
	    // Exact inertia calculation is overkill, but see http://geometrictools.com/Documentation/PolyhedralMassProperties.pdf for the correct way to do it
	    this.computeLocalAABB(cli_aabbmin,cli_aabbmax);
	    var x = cli_aabbmax.x - cli_aabbmin.x,
	        y = cli_aabbmax.y - cli_aabbmin.y,
	        z = cli_aabbmax.z - cli_aabbmin.z;
	    target.x = 1.0 / 12.0 * mass * ( 2*y*2*y + 2*z*2*z );
	    target.y = 1.0 / 12.0 * mass * ( 2*x*2*x + 2*z*2*z );
	    target.z = 1.0 / 12.0 * mass * ( 2*y*2*y + 2*x*2*x );
	};

	/**
	 * @method getPlaneConstantOfFace
	 * @param  {Number} face_i Index of the face
	 * @return {Number}
	 */
	ConvexPolyhedron.prototype.getPlaneConstantOfFace = function(face_i){
	    var f = this.faces[face_i];
	    var n = this.faceNormals[face_i];
	    var v = this.vertices[f[0]];
	    var c = -n.dot(v);
	    return c;
	};

	/**
	 * Clip a face against a hull.
	 * @method clipFaceAgainstHull
	 * @param {Vec3} separatingNormal
	 * @param {Vec3} posA
	 * @param {Quaternion} quatA
	 * @param {Array} worldVertsB1 An array of Vec3 with vertices in the world frame.
	 * @param {Number} minDist Distance clamping
	 * @param {Number} maxDist
	 * @param Array result Array to store resulting contact points in. Will be objects with properties: point, depth, normal. These are represented in world coordinates.
	 */
	var cfah_faceANormalWS = new Vec3(),
	    cfah_edge0 = new Vec3(),
	    cfah_WorldEdge0 = new Vec3(),
	    cfah_worldPlaneAnormal1 = new Vec3(),
	    cfah_planeNormalWS1 = new Vec3(),
	    cfah_worldA1 = new Vec3(),
	    cfah_localPlaneNormal = new Vec3(),
	    cfah_planeNormalWS = new Vec3();
	ConvexPolyhedron.prototype.clipFaceAgainstHull = function(separatingNormal, posA, quatA, worldVertsB1, minDist, maxDist,result){
	    var faceANormalWS = cfah_faceANormalWS,
	        edge0 = cfah_edge0,
	        WorldEdge0 = cfah_WorldEdge0,
	        worldPlaneAnormal1 = cfah_worldPlaneAnormal1,
	        planeNormalWS1 = cfah_planeNormalWS1,
	        worldA1 = cfah_worldA1,
	        localPlaneNormal = cfah_localPlaneNormal,
	        planeNormalWS = cfah_planeNormalWS;

	    var hullA = this;
	    var worldVertsB2 = [];
	    var pVtxIn = worldVertsB1;
	    var pVtxOut = worldVertsB2;
	    // Find the face with normal closest to the separating axis
	    var closestFaceA = -1;
	    var dmin = Number.MAX_VALUE;
	    for(var face=0; face<hullA.faces.length; face++){
	        faceANormalWS.copy(hullA.faceNormals[face]);
	        quatA.vmult(faceANormalWS,faceANormalWS);
	        //posA.vadd(faceANormalWS,faceANormalWS);
	        var d = faceANormalWS.dot(separatingNormal);
	        if (d < dmin){
	            dmin = d;
	            closestFaceA = face;
	        }
	    }
	    if (closestFaceA < 0){
	        // console.log("--- did not find any closest face... ---");
	        return;
	    }
	    //console.log("closest A: ",closestFaceA);
	    // Get the face and construct connected faces
	    var polyA = hullA.faces[closestFaceA];
	    polyA.connectedFaces = [];
	    for(var i=0; i<hullA.faces.length; i++){
	        for(var j=0; j<hullA.faces[i].length; j++){
	            if(polyA.indexOf(hullA.faces[i][j])!==-1 /* Sharing a vertex*/ && i!==closestFaceA /* Not the one we are looking for connections from */ && polyA.connectedFaces.indexOf(i)===-1 /* Not already added */ ){
	                polyA.connectedFaces.push(i);
	            }
	        }
	    }
	    // Clip the polygon to the back of the planes of all faces of hull A, that are adjacent to the witness face
	    pVtxIn.length;
	    var numVerticesA = polyA.length;
	    for(var e0=0; e0<numVerticesA; e0++){
	        var a = hullA.vertices[polyA[e0]];
	        var b = hullA.vertices[polyA[(e0+1)%numVerticesA]];
	        a.vsub(b,edge0);
	        WorldEdge0.copy(edge0);
	        quatA.vmult(WorldEdge0,WorldEdge0);
	        posA.vadd(WorldEdge0,WorldEdge0);
	        worldPlaneAnormal1.copy(this.faceNormals[closestFaceA]);//transA.getBasis()* btVector3(polyA.m_plane[0],polyA.m_plane[1],polyA.m_plane[2]);
	        quatA.vmult(worldPlaneAnormal1,worldPlaneAnormal1);
	        posA.vadd(worldPlaneAnormal1,worldPlaneAnormal1);
	        WorldEdge0.cross(worldPlaneAnormal1,planeNormalWS1);
	        planeNormalWS1.negate(planeNormalWS1);
	        worldA1.copy(a);
	        quatA.vmult(worldA1,worldA1);
	        posA.vadd(worldA1,worldA1);
	        -worldA1.dot(planeNormalWS1);
	        var planeEqWS;
	        {
	            var otherFace = polyA.connectedFaces[e0];
	            localPlaneNormal.copy(this.faceNormals[otherFace]);
	            var localPlaneEq = this.getPlaneConstantOfFace(otherFace);

	            planeNormalWS.copy(localPlaneNormal);
	            quatA.vmult(planeNormalWS,planeNormalWS);
	            //posA.vadd(planeNormalWS,planeNormalWS);
	            var planeEqWS = localPlaneEq - planeNormalWS.dot(posA);
	        }

	        // Clip face against our constructed plane
	        this.clipFaceAgainstPlane(pVtxIn, pVtxOut, planeNormalWS, planeEqWS);

	        // Throw away all clipped points, but save the reamining until next clip
	        while(pVtxIn.length){
	            pVtxIn.shift();
	        }
	        while(pVtxOut.length){
	            pVtxIn.push(pVtxOut.shift());
	        }
	    }

	    //console.log("Resulting points after clip:",pVtxIn);

	    // only keep contact points that are behind the witness face
	    localPlaneNormal.copy(this.faceNormals[closestFaceA]);

	    var localPlaneEq = this.getPlaneConstantOfFace(closestFaceA);
	    planeNormalWS.copy(localPlaneNormal);
	    quatA.vmult(planeNormalWS,planeNormalWS);

	    var planeEqWS = localPlaneEq - planeNormalWS.dot(posA);
	    for (var i=0; i<pVtxIn.length; i++){
	        var depth = planeNormalWS.dot(pVtxIn[i]) + planeEqWS; //???
	        /*console.log("depth calc from normal=",planeNormalWS.toString()," and constant "+planeEqWS+" and vertex ",pVtxIn[i].toString()," gives "+depth);*/
	        if (depth <=minDist){
	            console.log("clamped: depth="+depth+" to minDist="+(minDist+""));
	            depth = minDist;
	        }

	        if (depth <=maxDist){
	            var point = pVtxIn[i];
	            if(depth<=0){
	                /*console.log("Got contact point ",point.toString(),
	                  ", depth=",depth,
	                  "contact normal=",separatingNormal.toString(),
	                  "plane",planeNormalWS.toString(),
	                  "planeConstant",planeEqWS);*/
	                var p = {
	                    point:point,
	                    normal:planeNormalWS,
	                    depth: depth,
	                };
	                result.push(p);
	            }
	        }
	    }
	};

	/**
	 * Clip a face in a hull against the back of a plane.
	 * @method clipFaceAgainstPlane
	 * @param {Array} inVertices
	 * @param {Array} outVertices
	 * @param {Vec3} planeNormal
	 * @param {Number} planeConstant The constant in the mathematical plane equation
	 */
	ConvexPolyhedron.prototype.clipFaceAgainstPlane = function(inVertices,outVertices, planeNormal, planeConstant){
	    var n_dot_first, n_dot_last;
	    var numVerts = inVertices.length;

	    if(numVerts < 2){
	        return outVertices;
	    }

	    var firstVertex = inVertices[inVertices.length-1],
	        lastVertex =   inVertices[0];

	    n_dot_first = planeNormal.dot(firstVertex) + planeConstant;

	    for(var vi = 0; vi < numVerts; vi++){
	        lastVertex = inVertices[vi];
	        n_dot_last = planeNormal.dot(lastVertex) + planeConstant;
	        if(n_dot_first < 0){
	            if(n_dot_last < 0){
	                // Start < 0, end < 0, so output lastVertex
	                var newv = new Vec3();
	                newv.copy(lastVertex);
	                outVertices.push(newv);
	            } else {
	                // Start < 0, end >= 0, so output intersection
	                var newv = new Vec3();
	                firstVertex.lerp(lastVertex,
	                                 n_dot_first / (n_dot_first - n_dot_last),
	                                 newv);
	                outVertices.push(newv);
	            }
	        } else {
	            if(n_dot_last<0){
	                // Start >= 0, end < 0 so output intersection and end
	                var newv = new Vec3();
	                firstVertex.lerp(lastVertex,
	                                 n_dot_first / (n_dot_first - n_dot_last),
	                                 newv);
	                outVertices.push(newv);
	                outVertices.push(lastVertex);
	            }
	        }
	        firstVertex = lastVertex;
	        n_dot_first = n_dot_last;
	    }
	    return outVertices;
	};

	// Updates .worldVertices and sets .worldVerticesNeedsUpdate to false.
	ConvexPolyhedron.prototype.computeWorldVertices = function(position,quat){
	    var N = this.vertices.length;
	    while(this.worldVertices.length < N){
	        this.worldVertices.push( new Vec3() );
	    }

	    var verts = this.vertices,
	        worldVerts = this.worldVertices;
	    for(var i=0; i!==N; i++){
	        quat.vmult( verts[i] , worldVerts[i] );
	        position.vadd( worldVerts[i] , worldVerts[i] );
	    }

	    this.worldVerticesNeedsUpdate = false;
	};

	new Vec3();
	ConvexPolyhedron.prototype.computeLocalAABB = function(aabbmin,aabbmax){
	    var n = this.vertices.length,
	        vertices = this.vertices;

	    aabbmin.set(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
	    aabbmax.set(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);

	    for(var i=0; i<n; i++){
	        var v = vertices[i];
	        if     (v.x < aabbmin.x){
	            aabbmin.x = v.x;
	        } else if(v.x > aabbmax.x){
	            aabbmax.x = v.x;
	        }
	        if     (v.y < aabbmin.y){
	            aabbmin.y = v.y;
	        } else if(v.y > aabbmax.y){
	            aabbmax.y = v.y;
	        }
	        if     (v.z < aabbmin.z){
	            aabbmin.z = v.z;
	        } else if(v.z > aabbmax.z){
	            aabbmax.z = v.z;
	        }
	    }
	};

	/**
	 * Updates .worldVertices and sets .worldVerticesNeedsUpdate to false.
	 * @method computeWorldFaceNormals
	 * @param  {Quaternion} quat
	 */
	ConvexPolyhedron.prototype.computeWorldFaceNormals = function(quat){
	    var N = this.faceNormals.length;
	    while(this.worldFaceNormals.length < N){
	        this.worldFaceNormals.push( new Vec3() );
	    }

	    var normals = this.faceNormals,
	        worldNormals = this.worldFaceNormals;
	    for(var i=0; i!==N; i++){
	        quat.vmult( normals[i] , worldNormals[i] );
	    }

	    this.worldFaceNormalsNeedsUpdate = false;
	};

	/**
	 * @method updateBoundingSphereRadius
	 */
	ConvexPolyhedron.prototype.updateBoundingSphereRadius = function(){
	    // Assume points are distributed with local (0,0,0) as center
	    var max2 = 0;
	    var verts = this.vertices;
	    for(var i=0, N=verts.length; i!==N; i++) {
	        var norm2 = verts[i].norm2();
	        if(norm2 > max2){
	            max2 = norm2;
	        }
	    }
	    this.boundingSphereRadius = Math.sqrt(max2);
	};

	var tempWorldVertex = new Vec3();

	/**
	 * @method calculateWorldAABB
	 * @param {Vec3}        pos
	 * @param {Quaternion}  quat
	 * @param {Vec3}        min
	 * @param {Vec3}        max
	 */
	ConvexPolyhedron.prototype.calculateWorldAABB = function(pos,quat,min,max){
	    var n = this.vertices.length, verts = this.vertices;
	    var minx,miny,minz,maxx,maxy,maxz;
	    for(var i=0; i<n; i++){
	        tempWorldVertex.copy(verts[i]);
	        quat.vmult(tempWorldVertex,tempWorldVertex);
	        pos.vadd(tempWorldVertex,tempWorldVertex);
	        var v = tempWorldVertex;
	        if     (v.x < minx || minx===undefined){
	            minx = v.x;
	        } else if(v.x > maxx || maxx===undefined){
	            maxx = v.x;
	        }

	        if     (v.y < miny || miny===undefined){
	            miny = v.y;
	        } else if(v.y > maxy || maxy===undefined){
	            maxy = v.y;
	        }

	        if     (v.z < minz || minz===undefined){
	            minz = v.z;
	        } else if(v.z > maxz || maxz===undefined){
	            maxz = v.z;
	        }
	    }
	    min.set(minx,miny,minz);
	    max.set(maxx,maxy,maxz);
	};

	/**
	 * Get approximate convex volume
	 * @method volume
	 * @return {Number}
	 */
	ConvexPolyhedron.prototype.volume = function(){
	    return 4.0 * Math.PI * this.boundingSphereRadius / 3.0;
	};

	/**
	 * Get an average of all the vertices positions
	 * @method getAveragePointLocal
	 * @param  {Vec3} target
	 * @return {Vec3}
	 */
	ConvexPolyhedron.prototype.getAveragePointLocal = function(target){
	    target = target || new Vec3();
	    var n = this.vertices.length,
	        verts = this.vertices;
	    for(var i=0; i<n; i++){
	        target.vadd(verts[i],target);
	    }
	    target.mult(1/n,target);
	    return target;
	};

	/**
	 * Transform all local points. Will change the .vertices
	 * @method transformAllPoints
	 * @param  {Vec3} offset
	 * @param  {Quaternion} quat
	 */
	ConvexPolyhedron.prototype.transformAllPoints = function(offset,quat){
	    var n = this.vertices.length,
	        verts = this.vertices;

	    // Apply rotation
	    if(quat){
	        // Rotate vertices
	        for(var i=0; i<n; i++){
	            var v = verts[i];
	            quat.vmult(v,v);
	        }
	        // Rotate face normals
	        for(var i=0; i<this.faceNormals.length; i++){
	            var v = this.faceNormals[i];
	            quat.vmult(v,v);
	        }
	        /*
	        // Rotate edges
	        for(var i=0; i<this.uniqueEdges.length; i++){
	            var v = this.uniqueEdges[i];
	            quat.vmult(v,v);
	        }*/
	    }

	    // Apply offset
	    if(offset){
	        for(var i=0; i<n; i++){
	            var v = verts[i];
	            v.vadd(offset,v);
	        }
	    }
	};

	/**
	 * Checks whether p is inside the polyhedra. Must be in local coords. The point lies outside of the convex hull of the other points if and only if the direction of all the vectors from it to those other points are on less than one half of a sphere around it.
	 * @method pointIsInside
	 * @param  {Vec3} p      A point given in local coordinates
	 * @return {Boolean}
	 */
	var ConvexPolyhedron_pointIsInside = new Vec3();
	var ConvexPolyhedron_vToP = new Vec3();
	var ConvexPolyhedron_vToPointInside = new Vec3();
	ConvexPolyhedron.prototype.pointIsInside = function(p){
	    var n = this.vertices.length,
	        verts = this.vertices,
	        faces = this.faces,
	        normals = this.faceNormals;
	    var positiveResult = null;
	    var N = this.faces.length;
	    var pointInside = ConvexPolyhedron_pointIsInside;
	    this.getAveragePointLocal(pointInside);
	    for(var i=0; i<N; i++){
	        this.faces[i].length;
	        var n = normals[i];
	        var v = verts[faces[i][0]]; // We only need one point in the face

	        // This dot product determines which side of the edge the point is
	        var vToP = ConvexPolyhedron_vToP;
	        p.vsub(v,vToP);
	        var r1 = n.dot(vToP);

	        var vToPointInside = ConvexPolyhedron_vToPointInside;
	        pointInside.vsub(v,vToPointInside);
	        var r2 = n.dot(vToPointInside);

	        if((r1<0 && r2>0) || (r1>0 && r2<0)){
	            return false; // Encountered some other sign. Exit.
	        }
	    }

	    // If we got here, all dot products were of the same sign.
	    return positiveResult ? 1 : -1;
	};

	/**
	 * Get max and min dot product of a convex hull at position (pos,quat) projected onto an axis. Results are saved in the array maxmin.
	 * @static
	 * @method project
	 * @param {ConvexPolyhedron} hull
	 * @param {Vec3} axis
	 * @param {Vec3} pos
	 * @param {Quaternion} quat
	 * @param {array} result result[0] and result[1] will be set to maximum and minimum, respectively.
	 */
	new Vec3();
	var project_localAxis = new Vec3();
	var project_localOrigin = new Vec3();
	ConvexPolyhedron.project = function(hull, axis, pos, quat, result){
	    var n = hull.vertices.length,
	        localAxis = project_localAxis,
	        max = 0,
	        min = 0,
	        localOrigin = project_localOrigin,
	        vs = hull.vertices;

	    localOrigin.setZero();

	    // Transform the axis to local
	    Transform.vectorToLocalFrame(pos, quat, axis, localAxis);
	    Transform.pointToLocalFrame(pos, quat, localOrigin, localOrigin);
	    var add = localOrigin.dot(localAxis);

	    min = max = vs[0].dot(localAxis);

	    for(var i = 1; i < n; i++){
	        var val = vs[i].dot(localAxis);

	        if(val > max){
	            max = val;
	        }

	        if(val < min){
	            min = val;
	        }
	    }

	    min -= add;
	    max -= add;

	    if(min > max){
	        // Inconsistent - swap
	        var temp = min;
	        min = max;
	        max = temp;
	    }
	    // Output
	    result[0] = max;
	    result[1] = min;
	};

	},{"../math/Quaternion":28,"../math/Transform":29,"../math/Vec3":30,"./Shape":43}],39:[function(_dereq_,module,exports){
	module.exports = Cylinder;

	var Shape = _dereq_('./Shape');
	var Vec3 = _dereq_('../math/Vec3');
	_dereq_('../math/Quaternion');
	var ConvexPolyhedron = _dereq_('./ConvexPolyhedron');

	/**
	 * @class Cylinder
	 * @constructor
	 * @extends ConvexPolyhedron
	 * @author schteppe / https://github.com/schteppe
	 * @param {Number} radiusTop
	 * @param {Number} radiusBottom
	 * @param {Number} height
	 * @param {Number} numSegments The number of segments to build the cylinder out of
	 */
	function Cylinder( radiusTop, radiusBottom, height , numSegments ) {
	    var N = numSegments,
	        verts = [],
	        axes = [],
	        faces = [],
	        bottomface = [],
	        topface = [],
	        cos = Math.cos,
	        sin = Math.sin;

	    // First bottom point
	    verts.push(new Vec3(radiusBottom*cos(0),
	                               radiusBottom*sin(0),
	                               -height*0.5));
	    bottomface.push(0);

	    // First top point
	    verts.push(new Vec3(radiusTop*cos(0),
	                               radiusTop*sin(0),
	                               height*0.5));
	    topface.push(1);

	    for(var i=0; i<N; i++){
	        var theta = 2*Math.PI/N * (i+1);
	        var thetaN = 2*Math.PI/N * (i+0.5);
	        if(i<N-1){
	            // Bottom
	            verts.push(new Vec3(radiusBottom*cos(theta),
	                                       radiusBottom*sin(theta),
	                                       -height*0.5));
	            bottomface.push(2*i+2);
	            // Top
	            verts.push(new Vec3(radiusTop*cos(theta),
	                                       radiusTop*sin(theta),
	                                       height*0.5));
	            topface.push(2*i+3);

	            // Face
	            faces.push([2*i+2, 2*i+3, 2*i+1,2*i]);
	        } else {
	            faces.push([0,1, 2*i+1, 2*i]); // Connect
	        }

	        // Axis: we can cut off half of them if we have even number of segments
	        if(N % 2 === 1 || i < N / 2){
	            axes.push(new Vec3(cos(thetaN), sin(thetaN), 0));
	        }
	    }
	    faces.push(topface);
	    axes.push(new Vec3(0,0,1));

	    // Reorder bottom face
	    var temp = [];
	    for(var i=0; i<bottomface.length; i++){
	        temp.push(bottomface[bottomface.length - i - 1]);
	    }
	    faces.push(temp);

	    this.type = Shape.types.CONVEXPOLYHEDRON;
	    ConvexPolyhedron.call( this, verts, faces, axes );
	}

	Cylinder.prototype = new ConvexPolyhedron();

	},{"../math/Quaternion":28,"../math/Vec3":30,"./ConvexPolyhedron":38,"./Shape":43}],40:[function(_dereq_,module,exports){
	var Shape = _dereq_('./Shape');
	var ConvexPolyhedron = _dereq_('./ConvexPolyhedron');
	var Vec3 = _dereq_('../math/Vec3');
	var Utils = _dereq_('../utils/Utils');

	module.exports = Heightfield;

	/**
	 * Heightfield shape class. Height data is given as an array. These data points are spread out evenly with a given distance.
	 * @class Heightfield
	 * @extends Shape
	 * @constructor
	 * @param {Array} data An array of Y values that will be used to construct the terrain.
	 * @param {object} options
	 * @param {Number} [options.minValue] Minimum value of the data points in the data array. Will be computed automatically if not given.
	 * @param {Number} [options.maxValue] Maximum value.
	 * @param {Number} [options.elementSize=0.1] World spacing between the data points in X direction.
	 * @todo Should be possible to use along all axes, not just y
	 *
	 * @example
	 *     // Generate some height data (y-values).
	 *     var data = [];
	 *     for(var i = 0; i < 1000; i++){
	 *         var y = 0.5 * Math.cos(0.2 * i);
	 *         data.push(y);
	 *     }
	 *
	 *     // Create the heightfield shape
	 *     var heightfieldShape = new Heightfield(data, {
	 *         elementSize: 1 // Distance between the data points in X and Y directions
	 *     });
	 *     var heightfieldBody = new Body();
	 *     heightfieldBody.addShape(heightfieldShape);
	 *     world.addBody(heightfieldBody);
	 */
	function Heightfield(data, options){
	    options = Utils.defaults(options, {
	        maxValue : null,
	        minValue : null,
	        elementSize : 1
	    });

	    /**
	     * An array of numbers, or height values, that are spread out along the x axis.
	     * @property {array} data
	     */
	    this.data = data;

	    /**
	     * Max value of the data
	     * @property {number} maxValue
	     */
	    this.maxValue = options.maxValue;

	    /**
	     * Max value of the data
	     * @property {number} minValue
	     */
	    this.minValue = options.minValue;

	    /**
	     * The width of each element
	     * @property {number} elementSize
	     * @todo elementSizeX and Y
	     */
	    this.elementSize = options.elementSize;

	    if(options.minValue === null){
	        this.updateMinValue();
	    }
	    if(options.maxValue === null){
	        this.updateMaxValue();
	    }

	    this.cacheEnabled = true;

	    Shape.call(this);

	    this.pillarConvex = new ConvexPolyhedron();
	    this.pillarOffset = new Vec3();

	    this.type = Shape.types.HEIGHTFIELD;
	    this.updateBoundingSphereRadius();

	    // "i_j_isUpper" => { convex: ..., offset: ... }
	    // for example:
	    // _cachedPillars["0_2_1"]
	    this._cachedPillars = {};
	}
	Heightfield.prototype = new Shape();

	/**
	 * Call whenever you change the data array.
	 * @method update
	 */
	Heightfield.prototype.update = function(){
	    this._cachedPillars = {};
	};

	/**
	 * Update the .minValue property
	 * @method updateMinValue
	 */
	Heightfield.prototype.updateMinValue = function(){
	    var data = this.data;
	    var minValue = data[0][0];
	    for(var i=0; i !== data.length; i++){
	        for(var j=0; j !== data[i].length; j++){
	            var v = data[i][j];
	            if(v < minValue){
	                minValue = v;
	            }
	        }
	    }
	    this.minValue = minValue;
	};

	/**
	 * Update the .maxValue property
	 * @method updateMaxValue
	 */
	Heightfield.prototype.updateMaxValue = function(){
	    var data = this.data;
	    var maxValue = data[0][0];
	    for(var i=0; i !== data.length; i++){
	        for(var j=0; j !== data[i].length; j++){
	            var v = data[i][j];
	            if(v > maxValue){
	                maxValue = v;
	            }
	        }
	    }
	    this.maxValue = maxValue;
	};

	/**
	 * Set the height value at an index. Don't forget to update maxValue and minValue after you're done.
	 * @method setHeightValueAtIndex
	 * @param {integer} xi
	 * @param {integer} yi
	 * @param {number} value
	 */
	Heightfield.prototype.setHeightValueAtIndex = function(xi, yi, value){
	    var data = this.data;
	    data[xi][yi] = value;

	    // Invalidate cache
	    this.clearCachedConvexTrianglePillar(xi, yi, false);
	    if(xi > 0){
	        this.clearCachedConvexTrianglePillar(xi - 1, yi, true);
	        this.clearCachedConvexTrianglePillar(xi - 1, yi, false);
	    }
	    if(yi > 0){
	        this.clearCachedConvexTrianglePillar(xi, yi - 1, true);
	        this.clearCachedConvexTrianglePillar(xi, yi - 1, false);
	    }
	    if(yi > 0 && xi > 0){
	        this.clearCachedConvexTrianglePillar(xi - 1, yi - 1, true);
	    }
	};

	/**
	 * Get max/min in a rectangle in the matrix data
	 * @method getRectMinMax
	 * @param  {integer} iMinX
	 * @param  {integer} iMinY
	 * @param  {integer} iMaxX
	 * @param  {integer} iMaxY
	 * @param  {array} [result] An array to store the results in.
	 * @return {array} The result array, if it was passed in. Minimum will be at position 0 and max at 1.
	 */
	Heightfield.prototype.getRectMinMax = function (iMinX, iMinY, iMaxX, iMaxY, result) {
	    result = result || [];

	    // Get max and min of the data
	    var data = this.data,
	        max = this.minValue; // Set first value
	    for(var i = iMinX; i <= iMaxX; i++){
	        for(var j = iMinY; j <= iMaxY; j++){
	            var height = data[i][j];
	            if(height > max){
	                max = height;
	            }
	        }
	    }

	    result[0] = this.minValue;
	    result[1] = max;
	};

	/**
	 * Get the index of a local position on the heightfield. The indexes indicate the rectangles, so if your terrain is made of N x N height data points, you will have rectangle indexes ranging from 0 to N-1.
	 * @method getIndexOfPosition
	 * @param  {number} x
	 * @param  {number} y
	 * @param  {array} result Two-element array
	 * @param  {boolean} clamp If the position should be clamped to the heightfield edge.
	 * @return {boolean}
	 */
	Heightfield.prototype.getIndexOfPosition = function (x, y, result, clamp) {

	    // Get the index of the data points to test against
	    var w = this.elementSize;
	    var data = this.data;
	    var xi = Math.floor(x / w);
	    var yi = Math.floor(y / w);

	    result[0] = xi;
	    result[1] = yi;

	    if(clamp){
	        // Clamp index to edges
	        if(xi < 0){ xi = 0; }
	        if(yi < 0){ yi = 0; }
	        if(xi >= data.length - 1){ xi = data.length - 1; }
	        if(yi >= data[0].length - 1){ yi = data[0].length - 1; }
	    }

	    // Bail out if we are out of the terrain
	    if(xi < 0 || yi < 0 || xi >= data.length-1 || yi >= data[0].length-1){
	        return false;
	    }

	    return true;
	};

	Heightfield.prototype.getHeightAt = function(x, y, edgeClamp){
	    var idx = [];
	    this.getIndexOfPosition(x, y, idx, edgeClamp);

	    // TODO: get upper or lower triangle, then use barycentric interpolation to get the height in the triangle.
	    var minmax = [];
	    this.getRectMinMax(idx[0], idx[1] + 1, idx[0], idx[1] + 1, minmax);

	    return (minmax[0] + minmax[1]) / 2; // average
	};

	Heightfield.prototype.getCacheConvexTrianglePillarKey = function(xi, yi, getUpperTriangle){
	    return xi + '_' + yi + '_' + (getUpperTriangle ? 1 : 0);
	};

	Heightfield.prototype.getCachedConvexTrianglePillar = function(xi, yi, getUpperTriangle){
	    return this._cachedPillars[this.getCacheConvexTrianglePillarKey(xi, yi, getUpperTriangle)];
	};

	Heightfield.prototype.setCachedConvexTrianglePillar = function(xi, yi, getUpperTriangle, convex, offset){
	    this._cachedPillars[this.getCacheConvexTrianglePillarKey(xi, yi, getUpperTriangle)] = {
	        convex: convex,
	        offset: offset
	    };
	};

	Heightfield.prototype.clearCachedConvexTrianglePillar = function(xi, yi, getUpperTriangle){
	    delete this._cachedPillars[this.getCacheConvexTrianglePillarKey(xi, yi, getUpperTriangle)];
	};

	/**
	 * Get a triangle in the terrain in the form of a triangular convex shape.
	 * @method getConvexTrianglePillar
	 * @param  {integer} i
	 * @param  {integer} j
	 * @param  {boolean} getUpperTriangle
	 */
	Heightfield.prototype.getConvexTrianglePillar = function(xi, yi, getUpperTriangle){
	    var result = this.pillarConvex;
	    var offsetResult = this.pillarOffset;

	    if(this.cacheEnabled){
	        var data = this.getCachedConvexTrianglePillar(xi, yi, getUpperTriangle);
	        if(data){
	            this.pillarConvex = data.convex;
	            this.pillarOffset = data.offset;
	            return;
	        }

	        result = new ConvexPolyhedron();
	        offsetResult = new Vec3();

	        this.pillarConvex = result;
	        this.pillarOffset = offsetResult;
	    }

	    var data = this.data;
	    var elementSize = this.elementSize;
	    var faces = result.faces;

	    // Reuse verts if possible
	    result.vertices.length = 6;
	    for (var i = 0; i < 6; i++) {
	        if(!result.vertices[i]){
	            result.vertices[i] = new Vec3();
	        }
	    }

	    // Reuse faces if possible
	    faces.length = 5;
	    for (var i = 0; i < 5; i++) {
	        if(!faces[i]){
	            faces[i] = [];
	        }
	    }

	    var verts = result.vertices;

	    var h = (Math.min(
	        data[xi][yi],
	        data[xi+1][yi],
	        data[xi][yi+1],
	        data[xi+1][yi+1]
	    ) - this.minValue ) / 2 + this.minValue;

	    if (!getUpperTriangle) {

	        // Center of the triangle pillar - all polygons are given relative to this one
	        offsetResult.set(
	            (xi + 0.25) * elementSize, // sort of center of a triangle
	            (yi + 0.25) * elementSize,
	            h // vertical center
	        );

	        // Top triangle verts
	        verts[0].set(
	            -0.25 * elementSize,
	            -0.25 * elementSize,
	            data[xi][yi] - h
	        );
	        verts[1].set(
	            0.75 * elementSize,
	            -0.25 * elementSize,
	            data[xi + 1][yi] - h
	        );
	        verts[2].set(
	            -0.25 * elementSize,
	            0.75 * elementSize,
	            data[xi][yi + 1] - h
	        );

	        // bottom triangle verts
	        verts[3].set(
	            -0.25 * elementSize,
	            -0.25 * elementSize,
	            -h-1
	        );
	        verts[4].set(
	            0.75 * elementSize,
	            -0.25 * elementSize,
	            -h-1
	        );
	        verts[5].set(
	            -0.25 * elementSize,
	            0.75  * elementSize,
	            -h-1
	        );

	        // top triangle
	        faces[0][0] = 0;
	        faces[0][1] = 1;
	        faces[0][2] = 2;

	        // bottom triangle
	        faces[1][0] = 5;
	        faces[1][1] = 4;
	        faces[1][2] = 3;

	        // -x facing quad
	        faces[2][0] = 0;
	        faces[2][1] = 2;
	        faces[2][2] = 5;
	        faces[2][3] = 3;

	        // -y facing quad
	        faces[3][0] = 1;
	        faces[3][1] = 0;
	        faces[3][2] = 3;
	        faces[3][3] = 4;

	        // +xy facing quad
	        faces[4][0] = 4;
	        faces[4][1] = 5;
	        faces[4][2] = 2;
	        faces[4][3] = 1;


	    } else {

	        // Center of the triangle pillar - all polygons are given relative to this one
	        offsetResult.set(
	            (xi + 0.75) * elementSize, // sort of center of a triangle
	            (yi + 0.75) * elementSize,
	            h // vertical center
	        );

	        // Top triangle verts
	        verts[0].set(
	            0.25 * elementSize,
	            0.25 * elementSize,
	            data[xi + 1][yi + 1] - h
	        );
	        verts[1].set(
	            -0.75 * elementSize,
	            0.25 * elementSize,
	            data[xi][yi + 1] - h
	        );
	        verts[2].set(
	            0.25 * elementSize,
	            -0.75 * elementSize,
	            data[xi + 1][yi] - h
	        );

	        // bottom triangle verts
	        verts[3].set(
	            0.25 * elementSize,
	            0.25 * elementSize,
	            - h-1
	        );
	        verts[4].set(
	            -0.75 * elementSize,
	            0.25 * elementSize,
	            - h-1
	        );
	        verts[5].set(
	            0.25 * elementSize,
	            -0.75 * elementSize,
	            - h-1
	        );

	        // Top triangle
	        faces[0][0] = 0;
	        faces[0][1] = 1;
	        faces[0][2] = 2;

	        // bottom triangle
	        faces[1][0] = 5;
	        faces[1][1] = 4;
	        faces[1][2] = 3;

	        // +x facing quad
	        faces[2][0] = 2;
	        faces[2][1] = 5;
	        faces[2][2] = 3;
	        faces[2][3] = 0;

	        // +y facing quad
	        faces[3][0] = 3;
	        faces[3][1] = 4;
	        faces[3][2] = 1;
	        faces[3][3] = 0;

	        // -xy facing quad
	        faces[4][0] = 1;
	        faces[4][1] = 4;
	        faces[4][2] = 5;
	        faces[4][3] = 2;
	    }

	    result.computeNormals();
	    result.computeEdges();
	    result.updateBoundingSphereRadius();

	    this.setCachedConvexTrianglePillar(xi, yi, getUpperTriangle, result, offsetResult);
	};

	Heightfield.prototype.calculateLocalInertia = function(mass, target){
	    target = target || new Vec3();
	    target.set(0, 0, 0);
	    return target;
	};

	Heightfield.prototype.volume = function(){
	    return Number.MAX_VALUE; // The terrain is infinite
	};

	Heightfield.prototype.calculateWorldAABB = function(pos, quat, min, max){
	    // TODO: do it properly
	    min.set(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
	    max.set(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
	};

	Heightfield.prototype.updateBoundingSphereRadius = function(){
	    // Use the bounding box of the min/max values
	    var data = this.data,
	        s = this.elementSize;
	    this.boundingSphereRadius = new Vec3(data.length * s, data[0].length * s, Math.max(Math.abs(this.maxValue), Math.abs(this.minValue))).norm();
	};

	},{"../math/Vec3":30,"../utils/Utils":53,"./ConvexPolyhedron":38,"./Shape":43}],41:[function(_dereq_,module,exports){
	module.exports = Particle;

	var Shape = _dereq_('./Shape');
	var Vec3 = _dereq_('../math/Vec3');

	/**
	 * Particle shape.
	 * @class Particle
	 * @constructor
	 * @author schteppe
	 * @extends Shape
	 */
	function Particle(){
	    Shape.call(this);

	    this.type = Shape.types.PARTICLE;
	}
	Particle.prototype = new Shape();
	Particle.prototype.constructor = Particle;

	/**
	 * @method calculateLocalInertia
	 * @param  {Number} mass
	 * @param  {Vec3} target
	 * @return {Vec3}
	 */
	Particle.prototype.calculateLocalInertia = function(mass,target){
	    target = target || new Vec3();
	    target.set(0, 0, 0);
	    return target;
	};

	Particle.prototype.volume = function(){
	    return 0;
	};

	Particle.prototype.updateBoundingSphereRadius = function(){
	    this.boundingSphereRadius = 0;
	};

	Particle.prototype.calculateWorldAABB = function(pos,quat,min,max){
	    // Get each axis max
	    min.copy(pos);
	    max.copy(pos);
	};

	},{"../math/Vec3":30,"./Shape":43}],42:[function(_dereq_,module,exports){
	module.exports = Plane;

	var Shape = _dereq_('./Shape');
	var Vec3 = _dereq_('../math/Vec3');

	/**
	 * A plane, facing in the Z direction. The plane has its surface at z=0 and everything below z=0 is assumed to be solid plane. To make the plane face in some other direction than z, you must put it inside a RigidBody and rotate that body. See the demos.
	 * @class Plane
	 * @constructor
	 * @extends Shape
	 * @author schteppe
	 */
	function Plane(){
	    Shape.call(this);
	    this.type = Shape.types.PLANE;

	    // World oriented normal
	    this.worldNormal = new Vec3();
	    this.worldNormalNeedsUpdate = true;

	    this.boundingSphereRadius = Number.MAX_VALUE;
	}
	Plane.prototype = new Shape();
	Plane.prototype.constructor = Plane;

	Plane.prototype.computeWorldNormal = function(quat){
	    var n = this.worldNormal;
	    n.set(0,0,1);
	    quat.vmult(n,n);
	    this.worldNormalNeedsUpdate = false;
	};

	Plane.prototype.calculateLocalInertia = function(mass,target){
	    target = target || new Vec3();
	    return target;
	};

	Plane.prototype.volume = function(){
	    return Number.MAX_VALUE; // The plane is infinite...
	};

	var tempNormal = new Vec3();
	Plane.prototype.calculateWorldAABB = function(pos, quat, min, max){
	    // The plane AABB is infinite, except if the normal is pointing along any axis
	    tempNormal.set(0,0,1); // Default plane normal is z
	    quat.vmult(tempNormal,tempNormal);
	    var maxVal = Number.MAX_VALUE;
	    min.set(-maxVal, -maxVal, -maxVal);
	    max.set(maxVal, maxVal, maxVal);

	    if(tempNormal.x === 1){ max.x = pos.x; }
	    if(tempNormal.y === 1){ max.y = pos.y; }
	    if(tempNormal.z === 1){ max.z = pos.z; }

	    if(tempNormal.x === -1){ min.x = pos.x; }
	    if(tempNormal.y === -1){ min.y = pos.y; }
	    if(tempNormal.z === -1){ min.z = pos.z; }
	};

	Plane.prototype.updateBoundingSphereRadius = function(){
	    this.boundingSphereRadius = Number.MAX_VALUE;
	};
	},{"../math/Vec3":30,"./Shape":43}],43:[function(_dereq_,module,exports){
	module.exports = Shape;

	var Shape = _dereq_('./Shape');
	_dereq_('../math/Vec3');
	_dereq_('../math/Quaternion');
	_dereq_('../material/Material');

	/**
	 * Base class for shapes
	 * @class Shape
	 * @constructor
	 * @author schteppe
	 * @todo Should have a mechanism for caching bounding sphere radius instead of calculating it each time
	 */
	function Shape(){

	    /**
	     * Identifyer of the Shape.
	     * @property {number} id
	     */
	    this.id = Shape.idCounter++;

	    /**
	     * The type of this shape. Must be set to an int > 0 by subclasses.
	     * @property type
	     * @type {Number}
	     * @see Shape.types
	     */
	    this.type = 0;

	    /**
	     * The local bounding sphere radius of this shape.
	     * @property {Number} boundingSphereRadius
	     */
	    this.boundingSphereRadius = 0;

	    /**
	     * Whether to produce contact forces when in contact with other bodies. Note that contacts will be generated, but they will be disabled.
	     * @property {boolean} collisionResponse
	     */
	    this.collisionResponse = true;

	    /**
	     * @property {Material} material
	     */
	    this.material = null;
	}
	Shape.prototype.constructor = Shape;

	/**
	 * Computes the bounding sphere radius. The result is stored in the property .boundingSphereRadius
	 * @method updateBoundingSphereRadius
	 * @return {Number}
	 */
	Shape.prototype.updateBoundingSphereRadius = function(){
	    throw "computeBoundingSphereRadius() not implemented for shape type "+this.type;
	};

	/**
	 * Get the volume of this shape
	 * @method volume
	 * @return {Number}
	 */
	Shape.prototype.volume = function(){
	    throw "volume() not implemented for shape type "+this.type;
	};

	/**
	 * Calculates the inertia in the local frame for this shape.
	 * @method calculateLocalInertia
	 * @return {Vec3}
	 * @see http://en.wikipedia.org/wiki/List_of_moments_of_inertia
	 */
	Shape.prototype.calculateLocalInertia = function(mass,target){
	    throw "calculateLocalInertia() not implemented for shape type "+this.type;
	};

	Shape.idCounter = 0;

	/**
	 * The available shape types.
	 * @static
	 * @property types
	 * @type {Object}
	 */
	Shape.types = {
	    SPHERE:1,
	    PLANE:2,
	    BOX:4,
	    COMPOUND:8,
	    CONVEXPOLYHEDRON:16,
	    HEIGHTFIELD:32,
	    PARTICLE:64,
	    CYLINDER:128,
	    TRIMESH:256
	};


	},{"../material/Material":25,"../math/Quaternion":28,"../math/Vec3":30,"./Shape":43}],44:[function(_dereq_,module,exports){
	module.exports = Sphere;

	var Shape = _dereq_('./Shape');
	var Vec3 = _dereq_('../math/Vec3');

	/**
	 * Spherical shape
	 * @class Sphere
	 * @constructor
	 * @extends Shape
	 * @param {Number} radius The radius of the sphere, a non-negative number.
	 * @author schteppe / http://github.com/schteppe
	 */
	function Sphere(radius){
	    Shape.call(this);

	    /**
	     * @property {Number} radius
	     */
	    this.radius = radius!==undefined ? Number(radius) : 1.0;
	    this.type = Shape.types.SPHERE;

	    if(this.radius < 0){
	        throw new Error('The sphere radius cannot be negative.');
	    }

	    this.updateBoundingSphereRadius();
	}
	Sphere.prototype = new Shape();
	Sphere.prototype.constructor = Sphere;

	Sphere.prototype.calculateLocalInertia = function(mass,target){
	    target = target || new Vec3();
	    var I = 2.0*mass*this.radius*this.radius/5.0;
	    target.x = I;
	    target.y = I;
	    target.z = I;
	    return target;
	};

	Sphere.prototype.volume = function(){
	    return 4.0 * Math.PI * this.radius / 3.0;
	};

	Sphere.prototype.updateBoundingSphereRadius = function(){
	    this.boundingSphereRadius = this.radius;
	};

	Sphere.prototype.calculateWorldAABB = function(pos,quat,min,max){
	    var r = this.radius;
	    var axes = ['x','y','z'];
	    for(var i=0; i<axes.length; i++){
	        var ax = axes[i];
	        min[ax] = pos[ax] - r;
	        max[ax] = pos[ax] + r;
	    }
	};

	},{"../math/Vec3":30,"./Shape":43}],45:[function(_dereq_,module,exports){
	module.exports = Trimesh;

	var Shape = _dereq_('./Shape');
	var Vec3 = _dereq_('../math/Vec3');
	_dereq_('../math/Quaternion');
	var Transform = _dereq_('../math/Transform');
	var AABB = _dereq_('../collision/AABB');
	var Octree = _dereq_('../utils/Octree');

	/**
	 * @class Trimesh
	 * @constructor
	 * @param {array} vertices
	 * @param {array} indices
	 * @extends Shape
	 * @example
	 *     // How to make a mesh with a single triangle
	 *     var vertices = [
	 *         0, 0, 0, // vertex 0
	 *         1, 0, 0, // vertex 1
	 *         0, 1, 0  // vertex 2
	 *     ];
	 *     var indices = [
	 *         0, 1, 2  // triangle 0
	 *     ];
	 *     var trimeshShape = new Trimesh(vertices, indices);
	 */
	function Trimesh(vertices, indices) {
	    Shape.call(this);
	    this.type = Shape.types.TRIMESH;

	    /**
	     * @property vertices
	     * @type {Array}
	     */
	    this.vertices = new Float32Array(vertices);

	    /**
	     * Array of integers, indicating which vertices each triangle consists of. The length of this array is thus 3 times the number of triangles.
	     * @property indices
	     * @type {Array}
	     */
	    this.indices = new Int16Array(indices);

	    /**
	     * The normals data.
	     * @property normals
	     * @type {Array}
	     */
	    this.normals = new Float32Array(indices.length);

	    /**
	     * The local AABB of the mesh.
	     * @property aabb
	     * @type {Array}
	     */
	    this.aabb = new AABB();

	    /**
	     * References to vertex pairs, making up all unique edges in the trimesh.
	     * @property {array} edges
	     */
	    this.edges = null;

	    /**
	     * Local scaling of the mesh. Use .setScale() to set it.
	     * @property {Vec3} scale
	     */
	    this.scale = new Vec3(1, 1, 1);

	    /**
	     * The indexed triangles. Use .updateTree() to update it.
	     * @property {Octree} tree
	     */
	    this.tree = new Octree();

	    this.updateEdges();
	    this.updateNormals();
	    this.updateAABB();
	    this.updateBoundingSphereRadius();
	    this.updateTree();
	}
	Trimesh.prototype = new Shape();
	Trimesh.prototype.constructor = Trimesh;

	var computeNormals_n = new Vec3();

	/**
	 * @method updateTree
	 */
	Trimesh.prototype.updateTree = function(){
	    var tree = this.tree;

	    tree.reset();
	    tree.aabb.copy(this.aabb);
	    var scale = this.scale; // The local mesh AABB is scaled, but the octree AABB should be unscaled
	    tree.aabb.lowerBound.x *= 1 / scale.x;
	    tree.aabb.lowerBound.y *= 1 / scale.y;
	    tree.aabb.lowerBound.z *= 1 / scale.z;
	    tree.aabb.upperBound.x *= 1 / scale.x;
	    tree.aabb.upperBound.y *= 1 / scale.y;
	    tree.aabb.upperBound.z *= 1 / scale.z;

	    // Insert all triangles
	    var triangleAABB = new AABB();
	    var a = new Vec3();
	    var b = new Vec3();
	    var c = new Vec3();
	    var points = [a, b, c];
	    for (var i = 0; i < this.indices.length / 3; i++) {
	        //this.getTriangleVertices(i, a, b, c);

	        // Get unscaled triangle verts
	        var i3 = i * 3;
	        this._getUnscaledVertex(this.indices[i3], a);
	        this._getUnscaledVertex(this.indices[i3 + 1], b);
	        this._getUnscaledVertex(this.indices[i3 + 2], c);

	        triangleAABB.setFromPoints(points);
	        tree.insert(triangleAABB, i);
	    }
	    tree.removeEmptyNodes();
	};

	var unscaledAABB = new AABB();

	/**
	 * Get triangles in a local AABB from the trimesh.
	 * @method getTrianglesInAABB
	 * @param  {AABB} aabb
	 * @param  {array} result An array of integers, referencing the queried triangles.
	 */
	Trimesh.prototype.getTrianglesInAABB = function(aabb, result){
	    unscaledAABB.copy(aabb);

	    // Scale it to local
	    var scale = this.scale;
	    var isx = scale.x;
	    var isy = scale.y;
	    var isz = scale.z;
	    var l = unscaledAABB.lowerBound;
	    var u = unscaledAABB.upperBound;
	    l.x /= isx;
	    l.y /= isy;
	    l.z /= isz;
	    u.x /= isx;
	    u.y /= isy;
	    u.z /= isz;

	    return this.tree.aabbQuery(unscaledAABB, result);
	};

	/**
	 * @method setScale
	 * @param {Vec3} scale
	 */
	Trimesh.prototype.setScale = function(scale){
	    var wasUniform = this.scale.x === this.scale.y === this.scale.z;
	    var isUniform = scale.x === scale.y === scale.z;

	    if(!(wasUniform && isUniform)){
	        // Non-uniform scaling. Need to update normals.
	        this.updateNormals();
	    }
	    this.scale.copy(scale);
	    this.updateAABB();
	    this.updateBoundingSphereRadius();
	};

	/**
	 * Compute the normals of the faces. Will save in the .normals array.
	 * @method updateNormals
	 */
	Trimesh.prototype.updateNormals = function(){
	    var n = computeNormals_n;

	    // Generate normals
	    var normals = this.normals;
	    for(var i=0; i < this.indices.length / 3; i++){
	        var i3 = i * 3;

	        var a = this.indices[i3],
	            b = this.indices[i3 + 1],
	            c = this.indices[i3 + 2];

	        this.getVertex(a, va);
	        this.getVertex(b, vb);
	        this.getVertex(c, vc);

	        Trimesh.computeNormal(vb, va, vc, n);

	        normals[i3] = n.x;
	        normals[i3 + 1] = n.y;
	        normals[i3 + 2] = n.z;
	    }
	};

	/**
	 * Update the .edges property
	 * @method updateEdges
	 */
	Trimesh.prototype.updateEdges = function(){
	    var edges = {};
	    var add = function(indexA, indexB){
	        var key = a < b ? a + '_' + b : b + '_' + a;
	        edges[key] = true;
	    };
	    for(var i=0; i < this.indices.length / 3; i++){
	        var i3 = i * 3;
	        var a = this.indices[i3],
	            b = this.indices[i3 + 1];
	            this.indices[i3 + 2];
	        add();
	        add();
	        add();
	    }
	    var keys = Object.keys(edges);
	    this.edges = new Int16Array(keys.length * 2);
	    for (var i = 0; i < keys.length; i++) {
	        var indices = keys[i].split('_');
	        this.edges[2 * i] = parseInt(indices[0], 10);
	        this.edges[2 * i + 1] = parseInt(indices[1], 10);
	    }
	};

	/**
	 * Get an edge vertex
	 * @method getEdgeVertex
	 * @param  {number} edgeIndex
	 * @param  {number} firstOrSecond 0 or 1, depending on which one of the vertices you need.
	 * @param  {Vec3} vertexStore Where to store the result
	 */
	Trimesh.prototype.getEdgeVertex = function(edgeIndex, firstOrSecond, vertexStore){
	    var vertexIndex = this.edges[edgeIndex * 2 + (firstOrSecond ? 1 : 0)];
	    this.getVertex(vertexIndex, vertexStore);
	};

	var getEdgeVector_va = new Vec3();
	var getEdgeVector_vb = new Vec3();

	/**
	 * Get a vector along an edge.
	 * @method getEdgeVector
	 * @param  {number} edgeIndex
	 * @param  {Vec3} vectorStore
	 */
	Trimesh.prototype.getEdgeVector = function(edgeIndex, vectorStore){
	    var va = getEdgeVector_va;
	    var vb = getEdgeVector_vb;
	    this.getEdgeVertex(edgeIndex, 0, va);
	    this.getEdgeVertex(edgeIndex, 1, vb);
	    vb.vsub(va, vectorStore);
	};

	/**
	 * Get face normal given 3 vertices
	 * @static
	 * @method computeNormal
	 * @param {Vec3} va
	 * @param {Vec3} vb
	 * @param {Vec3} vc
	 * @param {Vec3} target
	 */
	var cb = new Vec3();
	var ab = new Vec3();
	Trimesh.computeNormal = function ( va, vb, vc, target ) {
	    vb.vsub(va,ab);
	    vc.vsub(vb,cb);
	    cb.cross(ab,target);
	    if ( !target.isZero() ) {
	        target.normalize();
	    }
	};

	var va = new Vec3();
	var vb = new Vec3();
	var vc = new Vec3();

	/**
	 * Get vertex i.
	 * @method getVertex
	 * @param  {number} i
	 * @param  {Vec3} out
	 * @return {Vec3} The "out" vector object
	 */
	Trimesh.prototype.getVertex = function(i, out){
	    var scale = this.scale;
	    this._getUnscaledVertex(i, out);
	    out.x *= scale.x;
	    out.y *= scale.y;
	    out.z *= scale.z;
	    return out;
	};

	/**
	 * Get raw vertex i
	 * @private
	 * @method _getUnscaledVertex
	 * @param  {number} i
	 * @param  {Vec3} out
	 * @return {Vec3} The "out" vector object
	 */
	Trimesh.prototype._getUnscaledVertex = function(i, out){
	    var i3 = i * 3;
	    var vertices = this.vertices;
	    return out.set(
	        vertices[i3],
	        vertices[i3 + 1],
	        vertices[i3 + 2]
	    );
	};

	/**
	 * Get a vertex from the trimesh,transformed by the given position and quaternion.
	 * @method getWorldVertex
	 * @param  {number} i
	 * @param  {Vec3} pos
	 * @param  {Quaternion} quat
	 * @param  {Vec3} out
	 * @return {Vec3} The "out" vector object
	 */
	Trimesh.prototype.getWorldVertex = function(i, pos, quat, out){
	    this.getVertex(i, out);
	    Transform.pointToWorldFrame(pos, quat, out, out);
	    return out;
	};

	/**
	 * Get the three vertices for triangle i.
	 * @method getTriangleVertices
	 * @param  {number} i
	 * @param  {Vec3} a
	 * @param  {Vec3} b
	 * @param  {Vec3} c
	 */
	Trimesh.prototype.getTriangleVertices = function(i, a, b, c){
	    var i3 = i * 3;
	    this.getVertex(this.indices[i3], a);
	    this.getVertex(this.indices[i3 + 1], b);
	    this.getVertex(this.indices[i3 + 2], c);
	};

	/**
	 * Compute the normal of triangle i.
	 * @method getNormal
	 * @param  {Number} i
	 * @param  {Vec3} target
	 * @return {Vec3} The "target" vector object
	 */
	Trimesh.prototype.getNormal = function(i, target){
	    var i3 = i * 3;
	    return target.set(
	        this.normals[i3],
	        this.normals[i3 + 1],
	        this.normals[i3 + 2]
	    );
	};

	var cli_aabb = new AABB();

	/**
	 * @method calculateLocalInertia
	 * @param  {Number} mass
	 * @param  {Vec3} target
	 * @return {Vec3} The "target" vector object
	 */
	Trimesh.prototype.calculateLocalInertia = function(mass,target){
	    // Approximate with box inertia
	    // Exact inertia calculation is overkill, but see http://geometrictools.com/Documentation/PolyhedralMassProperties.pdf for the correct way to do it
	    this.computeLocalAABB(cli_aabb);
	    var x = cli_aabb.upperBound.x - cli_aabb.lowerBound.x,
	        y = cli_aabb.upperBound.y - cli_aabb.lowerBound.y,
	        z = cli_aabb.upperBound.z - cli_aabb.lowerBound.z;
	    return target.set(
	        1.0 / 12.0 * mass * ( 2*y*2*y + 2*z*2*z ),
	        1.0 / 12.0 * mass * ( 2*x*2*x + 2*z*2*z ),
	        1.0 / 12.0 * mass * ( 2*y*2*y + 2*x*2*x )
	    );
	};

	var computeLocalAABB_worldVert = new Vec3();

	/**
	 * Compute the local AABB for the trimesh
	 * @method computeLocalAABB
	 * @param  {AABB} aabb
	 */
	Trimesh.prototype.computeLocalAABB = function(aabb){
	    var l = aabb.lowerBound,
	        u = aabb.upperBound,
	        n = this.vertices.length;
	        this.vertices;
	        var v = computeLocalAABB_worldVert;

	    this.getVertex(0, v);
	    l.copy(v);
	    u.copy(v);

	    for(var i=0; i !== n; i++){
	        this.getVertex(i, v);

	        if(v.x < l.x){
	            l.x = v.x;
	        } else if(v.x > u.x){
	            u.x = v.x;
	        }

	        if(v.y < l.y){
	            l.y = v.y;
	        } else if(v.y > u.y){
	            u.y = v.y;
	        }

	        if(v.z < l.z){
	            l.z = v.z;
	        } else if(v.z > u.z){
	            u.z = v.z;
	        }
	    }
	};


	/**
	 * Update the .aabb property
	 * @method updateAABB
	 */
	Trimesh.prototype.updateAABB = function(){
	    this.computeLocalAABB(this.aabb);
	};

	/**
	 * Will update the .boundingSphereRadius property
	 * @method updateBoundingSphereRadius
	 */
	Trimesh.prototype.updateBoundingSphereRadius = function(){
	    // Assume points are distributed with local (0,0,0) as center
	    var max2 = 0;
	    var vertices = this.vertices;
	    var v = new Vec3();
	    for(var i=0, N=vertices.length / 3; i !== N; i++) {
	        this.getVertex(i, v);
	        var norm2 = v.norm2();
	        if(norm2 > max2){
	            max2 = norm2;
	        }
	    }
	    this.boundingSphereRadius = Math.sqrt(max2);
	};

	new Vec3();
	var calculateWorldAABB_frame = new Transform();
	var calculateWorldAABB_aabb = new AABB();

	/**
	 * @method calculateWorldAABB
	 * @param {Vec3}        pos
	 * @param {Quaternion}  quat
	 * @param {Vec3}        min
	 * @param {Vec3}        max
	 */
	Trimesh.prototype.calculateWorldAABB = function(pos,quat,min,max){
	    /*
	    var n = this.vertices.length / 3,
	        verts = this.vertices;
	    var minx,miny,minz,maxx,maxy,maxz;

	    var v = tempWorldVertex;
	    for(var i=0; i<n; i++){
	        this.getVertex(i, v);
	        quat.vmult(v, v);
	        pos.vadd(v, v);
	        if (v.x < minx || minx===undefined){
	            minx = v.x;
	        } else if(v.x > maxx || maxx===undefined){
	            maxx = v.x;
	        }

	        if (v.y < miny || miny===undefined){
	            miny = v.y;
	        } else if(v.y > maxy || maxy===undefined){
	            maxy = v.y;
	        }

	        if (v.z < minz || minz===undefined){
	            minz = v.z;
	        } else if(v.z > maxz || maxz===undefined){
	            maxz = v.z;
	        }
	    }
	    min.set(minx,miny,minz);
	    max.set(maxx,maxy,maxz);
	    */

	    // Faster approximation using local AABB
	    var frame = calculateWorldAABB_frame;
	    var result = calculateWorldAABB_aabb;
	    frame.position = pos;
	    frame.quaternion = quat;
	    this.aabb.toWorldFrame(frame, result);
	    min.copy(result.lowerBound);
	    max.copy(result.upperBound);
	};

	/**
	 * Get approximate volume
	 * @method volume
	 * @return {Number}
	 */
	Trimesh.prototype.volume = function(){
	    return 4.0 * Math.PI * this.boundingSphereRadius / 3.0;
	};

	/**
	 * Create a Trimesh instance, shaped as a torus.
	 * @static
	 * @method createTorus
	 * @param  {number} [radius=1]
	 * @param  {number} [tube=0.5]
	 * @param  {number} [radialSegments=8]
	 * @param  {number} [tubularSegments=6]
	 * @param  {number} [arc=6.283185307179586]
	 * @return {Trimesh} A torus
	 */
	Trimesh.createTorus = function (radius, tube, radialSegments, tubularSegments, arc) {
	    radius = radius || 1;
	    tube = tube || 0.5;
	    radialSegments = radialSegments || 8;
	    tubularSegments = tubularSegments || 6;
	    arc = arc || Math.PI * 2;

	    var vertices = [];
	    var indices = [];

	    for ( var j = 0; j <= radialSegments; j ++ ) {
	        for ( var i = 0; i <= tubularSegments; i ++ ) {
	            var u = i / tubularSegments * arc;
	            var v = j / radialSegments * Math.PI * 2;

	            var x = ( radius + tube * Math.cos( v ) ) * Math.cos( u );
	            var y = ( radius + tube * Math.cos( v ) ) * Math.sin( u );
	            var z = tube * Math.sin( v );

	            vertices.push( x, y, z );
	        }
	    }

	    for ( var j = 1; j <= radialSegments; j ++ ) {
	        for ( var i = 1; i <= tubularSegments; i ++ ) {
	            var a = ( tubularSegments + 1 ) * j + i - 1;
	            var b = ( tubularSegments + 1 ) * ( j - 1 ) + i - 1;
	            var c = ( tubularSegments + 1 ) * ( j - 1 ) + i;
	            var d = ( tubularSegments + 1 ) * j + i;

	            indices.push(a, b, d);
	            indices.push(b, c, d);
	        }
	    }

	    return new Trimesh(vertices, indices);
	};

	},{"../collision/AABB":3,"../math/Quaternion":28,"../math/Transform":29,"../math/Vec3":30,"../utils/Octree":50,"./Shape":43}],46:[function(_dereq_,module,exports){
	module.exports = GSSolver;

	_dereq_('../math/Vec3');
	_dereq_('../math/Quaternion');
	var Solver = _dereq_('./Solver');

	/**
	 * Constraint equation Gauss-Seidel solver.
	 * @class GSSolver
	 * @constructor
	 * @todo The spook parameters should be specified for each constraint, not globally.
	 * @author schteppe / https://github.com/schteppe
	 * @see https://www8.cs.umu.se/kurser/5DV058/VT09/lectures/spooknotes.pdf
	 * @extends Solver
	 */
	function GSSolver(){
	    Solver.call(this);

	    /**
	     * The number of solver iterations determines quality of the constraints in the world. The more iterations, the more correct simulation. More iterations need more computations though. If you have a large gravity force in your world, you will need more iterations.
	     * @property iterations
	     * @type {Number}
	     * @todo write more about solver and iterations in the wiki
	     */
	    this.iterations = 10;

	    /**
	     * When tolerance is reached, the system is assumed to be converged.
	     * @property tolerance
	     * @type {Number}
	     */
	    this.tolerance = 1e-7;
	}
	GSSolver.prototype = new Solver();

	var GSSolver_solve_lambda = []; // Just temporary number holders that we want to reuse each solve.
	var GSSolver_solve_invCs = [];
	var GSSolver_solve_Bs = [];
	GSSolver.prototype.solve = function(dt,world){
	    var iter = 0,
	        maxIter = this.iterations,
	        tolSquared = this.tolerance*this.tolerance,
	        equations = this.equations,
	        Neq = equations.length,
	        bodies = world.bodies,
	        Nbodies = bodies.length,
	        h = dt,
	        B, invC, deltalambda, deltalambdaTot, GWlambda, lambdaj;

	    // Update solve mass
	    if(Neq !== 0){
	        for(var i=0; i!==Nbodies; i++){
	            bodies[i].updateSolveMassProperties();
	        }
	    }

	    // Things that does not change during iteration can be computed once
	    var invCs = GSSolver_solve_invCs,
	        Bs = GSSolver_solve_Bs,
	        lambda = GSSolver_solve_lambda;
	    invCs.length = Neq;
	    Bs.length = Neq;
	    lambda.length = Neq;
	    for(var i=0; i!==Neq; i++){
	        var c = equations[i];
	        lambda[i] = 0.0;
	        Bs[i] = c.computeB(h);
	        invCs[i] = 1.0 / c.computeC();
	    }

	    if(Neq !== 0){

	        // Reset vlambda
	        for(var i=0; i!==Nbodies; i++){
	            var b=bodies[i],
	                vlambda=b.vlambda,
	                wlambda=b.wlambda;
	            vlambda.set(0,0,0);
	            if(wlambda){
	                wlambda.set(0,0,0);
	            }
	        }

	        // Iterate over equations
	        for(iter=0; iter!==maxIter; iter++){

	            // Accumulate the total error for each iteration.
	            deltalambdaTot = 0.0;

	            for(var j=0; j!==Neq; j++){

	                var c = equations[j];

	                // Compute iteration
	                B = Bs[j];
	                invC = invCs[j];
	                lambdaj = lambda[j];
	                GWlambda = c.computeGWlambda();
	                deltalambda = invC * ( B - GWlambda - c.eps * lambdaj );

	                // Clamp if we are not within the min/max interval
	                if(lambdaj + deltalambda < c.minForce){
	                    deltalambda = c.minForce - lambdaj;
	                } else if(lambdaj + deltalambda > c.maxForce){
	                    deltalambda = c.maxForce - lambdaj;
	                }
	                lambda[j] += deltalambda;

	                deltalambdaTot += deltalambda > 0.0 ? deltalambda : -deltalambda; // abs(deltalambda)

	                c.addToWlambda(deltalambda);
	            }

	            // If the total error is small enough - stop iterate
	            if(deltalambdaTot*deltalambdaTot < tolSquared){
	                break;
	            }
	        }

	        // Add result to velocity
	        for(var i=0; i!==Nbodies; i++){
	            var b=bodies[i],
	                v=b.velocity,
	                w=b.angularVelocity;
	            v.vadd(b.vlambda, v);
	            if(w){
	                w.vadd(b.wlambda, w);
	            }
	        }
	    }

	    return iter;
	};

	},{"../math/Quaternion":28,"../math/Vec3":30,"./Solver":47}],47:[function(_dereq_,module,exports){
	module.exports = Solver;

	/**
	 * Constraint equation solver base class.
	 * @class Solver
	 * @constructor
	 * @author schteppe / https://github.com/schteppe
	 */
	function Solver(){
	    /**
	     * All equations to be solved
	     * @property {Array} equations
	     */
	    this.equations = [];
	}

	/**
	 * Should be implemented in subclasses!
	 * @method solve
	 * @param  {Number} dt
	 * @param  {World} world
	 */
	Solver.prototype.solve = function(dt,world){
	    // Should return the number of iterations done!
	    return 0;
	};

	/**
	 * Add an equation
	 * @method addEquation
	 * @param {Equation} eq
	 */
	Solver.prototype.addEquation = function(eq){
	    if (eq.enabled) {
	        this.equations.push(eq);
	    }
	};

	/**
	 * Remove an equation
	 * @method removeEquation
	 * @param {Equation} eq
	 */
	Solver.prototype.removeEquation = function(eq){
	    var eqs = this.equations;
	    var i = eqs.indexOf(eq);
	    if(i !== -1){
	        eqs.splice(i,1);
	    }
	};

	/**
	 * Add all equations
	 * @method removeAllEquations
	 */
	Solver.prototype.removeAllEquations = function(){
	    this.equations.length = 0;
	};


	},{}],48:[function(_dereq_,module,exports){
	module.exports = SplitSolver;

	_dereq_('../math/Vec3');
	_dereq_('../math/Quaternion');
	var Solver = _dereq_('./Solver');
	var Body = _dereq_('../objects/Body');

	/**
	 * Splits the equations into islands and solves them independently. Can improve performance.
	 * @class SplitSolver
	 * @constructor
	 * @extends Solver
	 * @param {Solver} subsolver
	 */
	function SplitSolver(subsolver){
	    Solver.call(this);
	    this.iterations = 10;
	    this.tolerance = 1e-7;
	    this.subsolver = subsolver;
	    this.nodes = [];
	    this.nodePool = [];

	    // Create needed nodes, reuse if possible
	    while(this.nodePool.length < 128){
	        this.nodePool.push(this.createNode());
	    }
	}
	SplitSolver.prototype = new Solver();

	// Returns the number of subsystems
	var SplitSolver_solve_nodes = []; // All allocated node objects
	var SplitSolver_solve_eqs = [];   // Temp array
	var SplitSolver_solve_dummyWorld = {bodies:[]}; // Temp object

	var STATIC = Body.STATIC;
	function getUnvisitedNode(nodes){
	    var Nnodes = nodes.length;
	    for(var i=0; i!==Nnodes; i++){
	        var node = nodes[i];
	        if(!node.visited && !(node.body.type & STATIC)){
	            return node;
	        }
	    }
	    return false;
	}

	var queue = [];
	function bfs(root,visitFunc,bds,eqs){
	    queue.push(root);
	    root.visited = true;
	    visitFunc(root,bds,eqs);
	    while(queue.length) {
	        var node = queue.pop();
	        // Loop over unvisited child nodes
	        var child;
	        while((child = getUnvisitedNode(node.children))) {
	            child.visited = true;
	            visitFunc(child,bds,eqs);
	            queue.push(child);
	        }
	    }
	}

	function visitFunc(node,bds,eqs){
	    bds.push(node.body);
	    var Neqs = node.eqs.length;
	    for(var i=0; i!==Neqs; i++){
	        var eq = node.eqs[i];
	        if(eqs.indexOf(eq) === -1){
	            eqs.push(eq);
	        }
	    }
	}

	SplitSolver.prototype.createNode = function(){
	    return { body:null, children:[], eqs:[], visited:false };
	};

	/**
	 * Solve the subsystems
	 * @method solve
	 * @param  {Number} dt
	 * @param  {World} world
	 */
	SplitSolver.prototype.solve = function(dt,world){
	    var nodes=SplitSolver_solve_nodes,
	        nodePool=this.nodePool,
	        bodies=world.bodies,
	        equations=this.equations,
	        Neq=equations.length,
	        Nbodies=bodies.length,
	        subsolver=this.subsolver;

	    // Create needed nodes, reuse if possible
	    while(nodePool.length < Nbodies){
	        nodePool.push(this.createNode());
	    }
	    nodes.length = Nbodies;
	    for (var i = 0; i < Nbodies; i++) {
	        nodes[i] = nodePool[i];
	    }

	    // Reset node values
	    for(var i=0; i!==Nbodies; i++){
	        var node = nodes[i];
	        node.body = bodies[i];
	        node.children.length = 0;
	        node.eqs.length = 0;
	        node.visited = false;
	    }
	    for(var k=0; k!==Neq; k++){
	        var eq=equations[k],
	            i=bodies.indexOf(eq.bi),
	            j=bodies.indexOf(eq.bj),
	            ni=nodes[i],
	            nj=nodes[j];
	        ni.children.push(nj);
	        ni.eqs.push(eq);
	        nj.children.push(ni);
	        nj.eqs.push(eq);
	    }

	    var child, n=0, eqs=SplitSolver_solve_eqs;

	    subsolver.tolerance = this.tolerance;
	    subsolver.iterations = this.iterations;

	    var dummyWorld = SplitSolver_solve_dummyWorld;
	    while((child = getUnvisitedNode(nodes))){
	        eqs.length = 0;
	        dummyWorld.bodies.length = 0;
	        bfs(child, visitFunc, dummyWorld.bodies, eqs);

	        var Neqs = eqs.length;

	        eqs = eqs.sort(sortById);

	        for(var i=0; i!==Neqs; i++){
	            subsolver.addEquation(eqs[i]);
	        }

	        subsolver.solve(dt,dummyWorld);
	        subsolver.removeAllEquations();
	        n++;
	    }

	    return n;
	};

	function sortById(a, b){
	    return b.id - a.id;
	}
	},{"../math/Quaternion":28,"../math/Vec3":30,"../objects/Body":31,"./Solver":47}],49:[function(_dereq_,module,exports){
	/**
	 * Base class for objects that dispatches events.
	 * @class EventTarget
	 * @constructor
	 */
	var EventTarget = function () {

	};

	module.exports = EventTarget;

	EventTarget.prototype = {
	    constructor: EventTarget,

	    /**
	     * Add an event listener
	     * @method addEventListener
	     * @param  {String} type
	     * @param  {Function} listener
	     * @return {EventTarget} The self object, for chainability.
	     */
	    addEventListener: function ( type, listener ) {
	        if ( this._listeners === undefined ){ this._listeners = {}; }
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
	     * @method hasEventListener
	     * @param  {String} type
	     * @param  {Function} listener
	     * @return {Boolean}
	     */
	    hasEventListener: function ( type, listener ) {
	        if ( this._listeners === undefined ){ return false; }
	        var listeners = this._listeners;
	        if ( listeners[ type ] !== undefined && listeners[ type ].indexOf( listener ) !== - 1 ) {
	            return true;
	        }
	        return false;
	    },

	    /**
	     * Remove an event listener
	     * @method removeEventListener
	     * @param  {String} type
	     * @param  {Function} listener
	     * @return {EventTarget} The self object, for chainability.
	     */
	    removeEventListener: function ( type, listener ) {
	        if ( this._listeners === undefined ){ return this; }
	        var listeners = this._listeners;
	        if ( listeners[type] === undefined ){ return this; }
	        var index = listeners[ type ].indexOf( listener );
	        if ( index !== - 1 ) {
	            listeners[ type ].splice( index, 1 );
	        }
	        return this;
	    },

	    /**
	     * Emit an event.
	     * @method dispatchEvent
	     * @param  {Object} event
	     * @param  {String} event.type
	     * @return {EventTarget} The self object, for chainability.
	     */
	    dispatchEvent: function ( event ) {
	        if ( this._listeners === undefined ){ return this; }
	        var listeners = this._listeners;
	        var listenerArray = listeners[ event.type ];
	        if ( listenerArray !== undefined ) {
	            event.target = this;
	            for ( var i = 0, l = listenerArray.length; i < l; i ++ ) {
	                listenerArray[ i ].call( this, event );
	            }
	        }
	        return this;
	    }
	};

	},{}],50:[function(_dereq_,module,exports){
	var AABB = _dereq_('../collision/AABB');
	var Vec3 = _dereq_('../math/Vec3');

	module.exports = Octree;

	/**
	 * @class OctreeNode
	 * @param {object} [options]
	 * @param {Octree} [options.root]
	 * @param {AABB} [options.aabb]
	 */
	function OctreeNode(options){
	    options = options || {};

	    /**
	     * The root node
	     * @property {OctreeNode} root
	     */
	    this.root = options.root || null;

	    /**
	     * Boundary of this node
	     * @property {AABB} aabb
	     */
	    this.aabb = options.aabb ? options.aabb.clone() : new AABB();

	    /**
	     * Contained data at the current node level.
	     * @property {Array} data
	     */
	    this.data = [];

	    /**
	     * Children to this node
	     * @property {Array} children
	     */
	    this.children = [];
	}

	/**
	 * @class Octree
	 * @param {AABB} aabb The total AABB of the tree
	 * @param {object} [options]
	 * @param {number} [options.maxDepth=8]
	 * @extends OctreeNode
	 */
	function Octree(aabb, options){
	    options = options || {};
	    options.root = null;
	    options.aabb = aabb;
	    OctreeNode.call(this, options);

	    /**
	     * Maximum subdivision depth
	     * @property {number} maxDepth
	     */
	    this.maxDepth = typeof(options.maxDepth) !== 'undefined' ? options.maxDepth : 8;
	}
	Octree.prototype = new OctreeNode();

	OctreeNode.prototype.reset = function(aabb, options){
	    this.children.length = this.data.length = 0;
	};

	/**
	 * Insert data into this node
	 * @method insert
	 * @param  {AABB} aabb
	 * @param  {object} elementData
	 * @return {boolean} True if successful, otherwise false
	 */
	OctreeNode.prototype.insert = function(aabb, elementData, level){
	    var nodeData = this.data;
	    level = level || 0;

	    // Ignore objects that do not belong in this node
	    if (!this.aabb.contains(aabb)){
	        return false; // object cannot be added
	    }

	    var children = this.children;

	    if(level < (this.maxDepth || this.root.maxDepth)){
	        // Subdivide if there are no children yet
	        var subdivided = false;
	        if (!children.length){
	            this.subdivide();
	            subdivided = true;
	        }

	        // add to whichever node will accept it
	        for (var i = 0; i !== 8; i++) {
	            if (children[i].insert(aabb, elementData, level + 1)){
	                return true;
	            }
	        }

	        if(subdivided){
	            // No children accepted! Might as well just remove em since they contain none
	            children.length = 0;
	        }
	    }

	    // Too deep, or children didnt want it. add it in current node
	    nodeData.push(elementData);

	    return true;
	};

	var halfDiagonal = new Vec3();

	/**
	 * Create 8 equally sized children nodes and put them in the .children array.
	 * @method subdivide
	 */
	OctreeNode.prototype.subdivide = function() {
	    var aabb = this.aabb;
	    var l = aabb.lowerBound;
	    var u = aabb.upperBound;

	    var children = this.children;

	    children.push(
	        new OctreeNode({ aabb: new AABB({ lowerBound: new Vec3(0,0,0) }) }),
	        new OctreeNode({ aabb: new AABB({ lowerBound: new Vec3(1,0,0) }) }),
	        new OctreeNode({ aabb: new AABB({ lowerBound: new Vec3(1,1,0) }) }),
	        new OctreeNode({ aabb: new AABB({ lowerBound: new Vec3(1,1,1) }) }),
	        new OctreeNode({ aabb: new AABB({ lowerBound: new Vec3(0,1,1) }) }),
	        new OctreeNode({ aabb: new AABB({ lowerBound: new Vec3(0,0,1) }) }),
	        new OctreeNode({ aabb: new AABB({ lowerBound: new Vec3(1,0,1) }) }),
	        new OctreeNode({ aabb: new AABB({ lowerBound: new Vec3(0,1,0) }) })
	    );

	    u.vsub(l, halfDiagonal);
	    halfDiagonal.scale(0.5, halfDiagonal);

	    var root = this.root || this;

	    for (var i = 0; i !== 8; i++) {
	        var child = children[i];

	        // Set current node as root
	        child.root = root;

	        // Compute bounds
	        var lowerBound = child.aabb.lowerBound;
	        lowerBound.x *= halfDiagonal.x;
	        lowerBound.y *= halfDiagonal.y;
	        lowerBound.z *= halfDiagonal.z;

	        lowerBound.vadd(l, lowerBound);

	        // Upper bound is always lower bound + halfDiagonal
	        lowerBound.vadd(halfDiagonal, child.aabb.upperBound);
	    }
	};

	/**
	 * Get all data, potentially within an AABB
	 * @method aabbQuery
	 * @param  {AABB} aabb
	 * @param  {array} result
	 * @return {array} The "result" object
	 */
	OctreeNode.prototype.aabbQuery = function(aabb, result) {

	    this.data;

	    // abort if the range does not intersect this node
	    // if (!this.aabb.overlaps(aabb)){
	    //     return result;
	    // }

	    // Add objects at this level
	    // Array.prototype.push.apply(result, nodeData);

	    // Add child data
	    // @todo unwrap recursion into a queue / loop, that's faster in JS
	    this.children;


	    // for (var i = 0, N = this.children.length; i !== N; i++) {
	    //     children[i].aabbQuery(aabb, result);
	    // }

	    var queue = [this];
	    while (queue.length) {
	        var node = queue.pop();
	        if (node.aabb.overlaps(aabb)){
	            Array.prototype.push.apply(result, node.data);
	        }
	        Array.prototype.push.apply(queue, node.children);
	    }

	    return result;
	};

	var tmpAABB = new AABB();

	/**
	 * Get all data, potentially intersected by a ray.
	 * @method rayQuery
	 * @param  {Ray} ray
	 * @param  {Transform} treeTransform
	 * @param  {array} result
	 * @return {array} The "result" object
	 */
	OctreeNode.prototype.rayQuery = function(ray, treeTransform, result) {

	    // Use aabb query for now.
	    // @todo implement real ray query which needs less lookups
	    ray.getAABB(tmpAABB);
	    tmpAABB.toLocalFrame(treeTransform, tmpAABB);
	    this.aabbQuery(tmpAABB, result);

	    return result;
	};

	/**
	 * @method removeEmptyNodes
	 */
	OctreeNode.prototype.removeEmptyNodes = function() {
	    var queue = [this];
	    while (queue.length) {
	        var node = queue.pop();
	        for (var i = node.children.length - 1; i >= 0; i--) {
	            if(!node.children[i].data.length){
	                node.children.splice(i, 1);
	            }
	        }
	        Array.prototype.push.apply(queue, node.children);
	    }
	};

	},{"../collision/AABB":3,"../math/Vec3":30}],51:[function(_dereq_,module,exports){
	module.exports = Pool;

	/**
	 * For pooling objects that can be reused.
	 * @class Pool
	 * @constructor
	 */
	function Pool(){
	    /**
	     * The pooled objects
	     * @property {Array} objects
	     */
	    this.objects = [];

	    /**
	     * Constructor of the objects
	     * @property {mixed} type
	     */
	    this.type = Object;
	}

	/**
	 * Release an object after use
	 * @method release
	 * @param {Object} obj
	 */
	Pool.prototype.release = function(){
	    var Nargs = arguments.length;
	    for(var i=0; i!==Nargs; i++){
	        this.objects.push(arguments[i]);
	    }
	};

	/**
	 * Get an object
	 * @method get
	 * @return {mixed}
	 */
	Pool.prototype.get = function(){
	    if(this.objects.length===0){
	        return this.constructObject();
	    } else {
	        return this.objects.pop();
	    }
	};

	/**
	 * Construct an object. Should be implmented in each subclass.
	 * @method constructObject
	 * @return {mixed}
	 */
	Pool.prototype.constructObject = function(){
	    throw new Error("constructObject() not implemented in this Pool subclass yet!");
	};

	},{}],52:[function(_dereq_,module,exports){
	module.exports = TupleDictionary;

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
	    this.data = { keys:[] };
	}

	/**
	 * @method get
	 * @param  {Number} i
	 * @param  {Number} j
	 * @return {Number}
	 */
	TupleDictionary.prototype.get = function(i, j) {
	    if (i > j) {
	        // swap
	        var temp = j;
	        j = i;
	        i = temp;
	    }
	    return this.data[i+'-'+j];
	};

	/**
	 * @method set
	 * @param  {Number} i
	 * @param  {Number} j
	 * @param {Number} value
	 */
	TupleDictionary.prototype.set = function(i, j, value) {
	    if (i > j) {
	        var temp = j;
	        j = i;
	        i = temp;
	    }
	    var key = i+'-'+j;

	    // Check if key already exists
	    if(!this.get(i,j)){
	        this.data.keys.push(key);
	    }

	    this.data[key] = value;
	};

	/**
	 * @method reset
	 */
	TupleDictionary.prototype.reset = function() {
	    var data = this.data,
	        keys = data.keys;
	    while(keys.length > 0){
	        var key = keys.pop();
	        delete data[key];
	    }
	};

	},{}],53:[function(_dereq_,module,exports){
	function Utils(){}

	module.exports = Utils;

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

	},{}],54:[function(_dereq_,module,exports){
	module.exports = Vec3Pool;

	var Vec3 = _dereq_('../math/Vec3');
	var Pool = _dereq_('./Pool');

	/**
	 * @class Vec3Pool
	 * @constructor
	 * @extends Pool
	 */
	function Vec3Pool(){
	    Pool.call(this);
	    this.type = Vec3;
	}
	Vec3Pool.prototype = new Pool();

	/**
	 * Construct a vector
	 * @method constructObject
	 * @return {Vec3}
	 */
	Vec3Pool.prototype.constructObject = function(){
	    return new Vec3();
	};

	},{"../math/Vec3":30,"./Pool":51}],55:[function(_dereq_,module,exports){
	module.exports = Narrowphase;

	var AABB = _dereq_('../collision/AABB');
	var Shape = _dereq_('../shapes/Shape');
	var Ray = _dereq_('../collision/Ray');
	var Vec3 = _dereq_('../math/Vec3');
	var Transform = _dereq_('../math/Transform');
	_dereq_('../shapes/ConvexPolyhedron');
	var Quaternion = _dereq_('../math/Quaternion');
	_dereq_('../solver/Solver');
	var Vec3Pool = _dereq_('../utils/Vec3Pool');
	var ContactEquation = _dereq_('../equations/ContactEquation');
	var FrictionEquation = _dereq_('../equations/FrictionEquation');

	/**
	 * Helper class for the World. Generates ContactEquations.
	 * @class Narrowphase
	 * @constructor
	 * @todo Sphere-ConvexPolyhedron contacts
	 * @todo Contact reduction
	 * @todo  should move methods to prototype
	 */
	function Narrowphase(world){

	    /**
	     * Internal storage of pooled contact points.
	     * @property {Array} contactPointPool
	     */
	    this.contactPointPool = [];

	    this.frictionEquationPool = [];

	    this.result = [];
	    this.frictionResult = [];

	    /**
	     * Pooled vectors.
	     * @property {Vec3Pool} v3pool
	     */
	    this.v3pool = new Vec3Pool();

	    this.world = world;
	    this.currentContactMaterial = null;

	    /**
	     * @property {Boolean} enableFrictionReduction
	     */
	    this.enableFrictionReduction = false;
	}

	/**
	 * Make a contact object, by using the internal pool or creating a new one.
	 * @method createContactEquation
	 * @return {ContactEquation}
	 */
	Narrowphase.prototype.createContactEquation = function(bi, bj, si, sj, rsi, rsj){
	    var c;
	    if(this.contactPointPool.length){
	        c = this.contactPointPool.pop();
	        c.bi = bi;
	        c.bj = bj;
	    } else {
	        c = new ContactEquation(bi, bj);
	    }

	    c.enabled = bi.collisionResponse && bj.collisionResponse && si.collisionResponse && sj.collisionResponse;

	    var cm = this.currentContactMaterial;

	    c.restitution = cm.restitution;

	    c.setSpookParams(
	        cm.contactEquationStiffness,
	        cm.contactEquationRelaxation,
	        this.world.dt
	    );

	    var matA = si.material || bi.material;
	    var matB = sj.material || bj.material;
	    if(matA && matB && matA.restitution >= 0 && matB.restitution >= 0){
	        c.restitution = matA.restitution * matB.restitution;
	    }

	    c.si = rsi || si;
	    c.sj = rsj || sj;

	    return c;
	};

	Narrowphase.prototype.createFrictionEquationsFromContact = function(contactEquation, outArray){
	    var bodyA = contactEquation.bi;
	    var bodyB = contactEquation.bj;
	    var shapeA = contactEquation.si;
	    var shapeB = contactEquation.sj;

	    var world = this.world;
	    var cm = this.currentContactMaterial;

	    // If friction or restitution were specified in the material, use them
	    var friction = cm.friction;
	    var matA = shapeA.material || bodyA.material;
	    var matB = shapeB.material || bodyB.material;
	    if(matA && matB && matA.friction >= 0 && matB.friction >= 0){
	        friction = matA.friction * matB.friction;
	    }

	    if(friction > 0){

	        // Create 2 tangent equations
	        var mug = friction * world.gravity.length();
	        var reducedMass = (bodyA.invMass + bodyB.invMass);
	        if(reducedMass > 0){
	            reducedMass = 1/reducedMass;
	        }
	        var pool = this.frictionEquationPool;
	        var c1 = pool.length ? pool.pop() : new FrictionEquation(bodyA,bodyB,mug*reducedMass);
	        var c2 = pool.length ? pool.pop() : new FrictionEquation(bodyA,bodyB,mug*reducedMass);

	        c1.bi = c2.bi = bodyA;
	        c1.bj = c2.bj = bodyB;
	        c1.minForce = c2.minForce = -mug*reducedMass;
	        c1.maxForce = c2.maxForce = mug*reducedMass;

	        // Copy over the relative vectors
	        c1.ri.copy(contactEquation.ri);
	        c1.rj.copy(contactEquation.rj);
	        c2.ri.copy(contactEquation.ri);
	        c2.rj.copy(contactEquation.rj);

	        // Construct tangents
	        contactEquation.ni.tangents(c1.t, c2.t);

	        // Set spook params
	        c1.setSpookParams(cm.frictionEquationStiffness, cm.frictionEquationRelaxation, world.dt);
	        c2.setSpookParams(cm.frictionEquationStiffness, cm.frictionEquationRelaxation, world.dt);

	        c1.enabled = c2.enabled = contactEquation.enabled;

	        outArray.push(c1, c2);

	        return true;
	    }

	    return false;
	};

	var averageNormal = new Vec3();
	var averageContactPointA = new Vec3();
	var averageContactPointB = new Vec3();

	// Take the average N latest contact point on the plane.
	Narrowphase.prototype.createFrictionFromAverage = function(numContacts){
	    // The last contactEquation
	    var c = this.result[this.result.length - 1];

	    // Create the result: two "average" friction equations
	    if (!this.createFrictionEquationsFromContact(c, this.frictionResult) || numContacts === 1) {
	        return;
	    }

	    var f1 = this.frictionResult[this.frictionResult.length - 2];
	    var f2 = this.frictionResult[this.frictionResult.length - 1];

	    averageNormal.setZero();
	    averageContactPointA.setZero();
	    averageContactPointB.setZero();

	    var bodyA = c.bi;
	    c.bj;
	    for(var i=0; i!==numContacts; i++){
	        c = this.result[this.result.length - 1 - i];
	        if(c.bodyA !== bodyA){
	            averageNormal.vadd(c.ni, averageNormal); // vec2.add(eq.t, eq.t, c.normalA);
	            averageContactPointA.vadd(c.ri, averageContactPointA); // vec2.add(eq.contactPointA, eq.contactPointA, c.contactPointA);
	            averageContactPointB.vadd(c.rj, averageContactPointB);
	        } else {
	            averageNormal.vsub(c.ni, averageNormal); // vec2.sub(eq.t, eq.t, c.normalA);
	            averageContactPointA.vadd(c.rj, averageContactPointA); // vec2.add(eq.contactPointA, eq.contactPointA, c.contactPointA);
	            averageContactPointB.vadd(c.ri, averageContactPointB);
	        }
	    }

	    var invNumContacts = 1 / numContacts;
	    averageContactPointA.scale(invNumContacts, f1.ri); // vec2.scale(eq.contactPointA, eq.contactPointA, invNumContacts);
	    averageContactPointB.scale(invNumContacts, f1.rj); // vec2.scale(eq.contactPointB, eq.contactPointB, invNumContacts);
	    f2.ri.copy(f1.ri); // Should be the same
	    f2.rj.copy(f1.rj);
	    averageNormal.normalize();
	    averageNormal.tangents(f1.t, f2.t);
	    // return eq;
	};


	var tmpVec1 = new Vec3();
	var tmpVec2 = new Vec3();
	var tmpQuat1 = new Quaternion();
	var tmpQuat2 = new Quaternion();

	/**
	 * Generate all contacts between a list of body pairs
	 * @method getContacts
	 * @param {array} p1 Array of body indices
	 * @param {array} p2 Array of body indices
	 * @param {World} world
	 * @param {array} result Array to store generated contacts
	 * @param {array} oldcontacts Optional. Array of reusable contact objects
	 */
	Narrowphase.prototype.getContacts = function(p1, p2, world, result, oldcontacts, frictionResult, frictionPool){
	    // Save old contact objects
	    this.contactPointPool = oldcontacts;
	    this.frictionEquationPool = frictionPool;
	    this.result = result;
	    this.frictionResult = frictionResult;

	    var qi = tmpQuat1;
	    var qj = tmpQuat2;
	    var xi = tmpVec1;
	    var xj = tmpVec2;

	    for(var k=0, N=p1.length; k!==N; k++){

	        // Get current collision bodies
	        var bi = p1[k],
	            bj = p2[k];

	        // Get contact material
	        var bodyContactMaterial = null;
	        if(bi.material && bj.material){
	            bodyContactMaterial = world.getContactMaterial(bi.material,bj.material) || null;
	        }

	        for (var i = 0; i < bi.shapes.length; i++) {
	            bi.quaternion.mult(bi.shapeOrientations[i], qi);
	            bi.quaternion.vmult(bi.shapeOffsets[i], xi);
	            xi.vadd(bi.position, xi);
	            var si = bi.shapes[i];

	            for (var j = 0; j < bj.shapes.length; j++) {

	                // Compute world transform of shapes
	                bj.quaternion.mult(bj.shapeOrientations[j], qj);
	                bj.quaternion.vmult(bj.shapeOffsets[j], xj);
	                xj.vadd(bj.position, xj);
	                var sj = bj.shapes[j];

	                if(xi.distanceTo(xj) > si.boundingSphereRadius + sj.boundingSphereRadius){
	                    continue;
	                }

	                // Get collision material
	                var shapeContactMaterial = null;
	                if(si.material && sj.material){
	                    shapeContactMaterial = world.getContactMaterial(si.material,sj.material) || null;
	                }

	                this.currentContactMaterial = shapeContactMaterial || bodyContactMaterial || world.defaultContactMaterial;

	                // Get contacts
	                var resolver = this[si.type | sj.type];
	                if(resolver){
	                    if (si.type < sj.type) {
	                        resolver.call(this, si, sj, xi, xj, qi, qj, bi, bj, si, sj);
	                    } else {
	                        resolver.call(this, sj, si, xj, xi, qj, qi, bj, bi, si, sj);
	                    }
	                }
	            }
	        }
	    }
	};

	Narrowphase.prototype[Shape.types.BOX | Shape.types.BOX] =
	Narrowphase.prototype.boxBox = function(si,sj,xi,xj,qi,qj,bi,bj){
	    si.convexPolyhedronRepresentation.material = si.material;
	    sj.convexPolyhedronRepresentation.material = sj.material;
	    si.convexPolyhedronRepresentation.collisionResponse = si.collisionResponse;
	    sj.convexPolyhedronRepresentation.collisionResponse = sj.collisionResponse;
	    this.convexConvex(si.convexPolyhedronRepresentation,sj.convexPolyhedronRepresentation,xi,xj,qi,qj,bi,bj,si,sj);
	};

	Narrowphase.prototype[Shape.types.BOX | Shape.types.CONVEXPOLYHEDRON] =
	Narrowphase.prototype.boxConvex = function(si,sj,xi,xj,qi,qj,bi,bj){
	    si.convexPolyhedronRepresentation.material = si.material;
	    si.convexPolyhedronRepresentation.collisionResponse = si.collisionResponse;
	    this.convexConvex(si.convexPolyhedronRepresentation,sj,xi,xj,qi,qj,bi,bj,si,sj);
	};

	Narrowphase.prototype[Shape.types.BOX | Shape.types.PARTICLE] =
	Narrowphase.prototype.boxParticle = function(si,sj,xi,xj,qi,qj,bi,bj){
	    si.convexPolyhedronRepresentation.material = si.material;
	    si.convexPolyhedronRepresentation.collisionResponse = si.collisionResponse;
	    this.convexParticle(si.convexPolyhedronRepresentation,sj,xi,xj,qi,qj,bi,bj,si,sj);
	};

	/**
	 * @method sphereSphere
	 * @param  {Shape}      si
	 * @param  {Shape}      sj
	 * @param  {Vec3}       xi
	 * @param  {Vec3}       xj
	 * @param  {Quaternion} qi
	 * @param  {Quaternion} qj
	 * @param  {Body}       bi
	 * @param  {Body}       bj
	 */
	Narrowphase.prototype[Shape.types.SPHERE] =
	Narrowphase.prototype.sphereSphere = function(si,sj,xi,xj,qi,qj,bi,bj){
	    // We will have only one contact in this case
	    var r = this.createContactEquation(bi,bj,si,sj);

	    // Contact normal
	    xj.vsub(xi, r.ni);
	    r.ni.normalize();

	    // Contact point locations
	    r.ri.copy(r.ni);
	    r.rj.copy(r.ni);
	    r.ri.mult(si.radius, r.ri);
	    r.rj.mult(-sj.radius, r.rj);

	    r.ri.vadd(xi, r.ri);
	    r.ri.vsub(bi.position, r.ri);

	    r.rj.vadd(xj, r.rj);
	    r.rj.vsub(bj.position, r.rj);

	    this.result.push(r);

	    this.createFrictionEquationsFromContact(r, this.frictionResult);
	};

	/**
	 * @method planeTrimesh
	 * @param  {Shape}      si
	 * @param  {Shape}      sj
	 * @param  {Vec3}       xi
	 * @param  {Vec3}       xj
	 * @param  {Quaternion} qi
	 * @param  {Quaternion} qj
	 * @param  {Body}       bi
	 * @param  {Body}       bj
	 */
	var planeTrimesh_normal = new Vec3();
	var planeTrimesh_relpos = new Vec3();
	var planeTrimesh_projected = new Vec3();
	Narrowphase.prototype[Shape.types.PLANE | Shape.types.TRIMESH] =
	Narrowphase.prototype.planeTrimesh = function(
	    planeShape,
	    trimeshShape,
	    planePos,
	    trimeshPos,
	    planeQuat,
	    trimeshQuat,
	    planeBody,
	    trimeshBody
	){
	    // Make contacts!
	    var v = new Vec3();

	    var normal = planeTrimesh_normal;
	    normal.set(0,0,1);
	    planeQuat.vmult(normal,normal); // Turn normal according to plane

	    for(var i=0; i<trimeshShape.vertices.length / 3; i++){

	        // Get world vertex from trimesh
	        trimeshShape.getVertex(i, v);

	        // Safe up
	        var v2 = new Vec3();
	        v2.copy(v);
	        Transform.pointToWorldFrame(trimeshPos, trimeshQuat, v2, v);

	        // Check plane side
	        var relpos = planeTrimesh_relpos;
	        v.vsub(planePos, relpos);
	        var dot = normal.dot(relpos);

	        if(dot <= 0.0){
	            var r = this.createContactEquation(planeBody,trimeshBody,planeShape,trimeshShape);

	            r.ni.copy(normal); // Contact normal is the plane normal

	            // Get vertex position projected on plane
	            var projected = planeTrimesh_projected;
	            normal.scale(relpos.dot(normal), projected);
	            v.vsub(projected,projected);

	            // ri is the projected world position minus plane position
	            r.ri.copy(projected);
	            r.ri.vsub(planeBody.position, r.ri);

	            r.rj.copy(v);
	            r.rj.vsub(trimeshBody.position, r.rj);

	            // Store result
	            this.result.push(r);
	            this.createFrictionEquationsFromContact(r, this.frictionResult);
	        }
	    }
	};

	/**
	 * @method sphereTrimesh
	 * @param  {Shape}      sphereShape
	 * @param  {Shape}      trimeshShape
	 * @param  {Vec3}       spherePos
	 * @param  {Vec3}       trimeshPos
	 * @param  {Quaternion} sphereQuat
	 * @param  {Quaternion} trimeshQuat
	 * @param  {Body}       sphereBody
	 * @param  {Body}       trimeshBody
	 */
	var sphereTrimesh_normal = new Vec3();
	var sphereTrimesh_relpos = new Vec3();
	new Vec3();
	var sphereTrimesh_v = new Vec3();
	var sphereTrimesh_v2 = new Vec3();
	var sphereTrimesh_edgeVertexA = new Vec3();
	var sphereTrimesh_edgeVertexB = new Vec3();
	var sphereTrimesh_edgeVector = new Vec3();
	var sphereTrimesh_edgeVectorUnit = new Vec3();
	var sphereTrimesh_localSpherePos = new Vec3();
	var sphereTrimesh_tmp = new Vec3();
	var sphereTrimesh_va = new Vec3();
	var sphereTrimesh_vb = new Vec3();
	var sphereTrimesh_vc = new Vec3();
	var sphereTrimesh_localSphereAABB = new AABB();
	var sphereTrimesh_triangles = [];
	Narrowphase.prototype[Shape.types.SPHERE | Shape.types.TRIMESH] =
	Narrowphase.prototype.sphereTrimesh = function (
	    sphereShape,
	    trimeshShape,
	    spherePos,
	    trimeshPos,
	    sphereQuat,
	    trimeshQuat,
	    sphereBody,
	    trimeshBody
	) {

	    var edgeVertexA = sphereTrimesh_edgeVertexA;
	    var edgeVertexB = sphereTrimesh_edgeVertexB;
	    var edgeVector = sphereTrimesh_edgeVector;
	    var edgeVectorUnit = sphereTrimesh_edgeVectorUnit;
	    var localSpherePos = sphereTrimesh_localSpherePos;
	    var tmp = sphereTrimesh_tmp;
	    var localSphereAABB = sphereTrimesh_localSphereAABB;
	    var v2 = sphereTrimesh_v2;
	    var relpos = sphereTrimesh_relpos;
	    var triangles = sphereTrimesh_triangles;

	    // Convert sphere position to local in the trimesh
	    Transform.pointToLocalFrame(trimeshPos, trimeshQuat, spherePos, localSpherePos);

	    // Get the aabb of the sphere locally in the trimesh
	    var sphereRadius = sphereShape.radius;
	    localSphereAABB.lowerBound.set(
	        localSpherePos.x - sphereRadius,
	        localSpherePos.y - sphereRadius,
	        localSpherePos.z - sphereRadius
	    );
	    localSphereAABB.upperBound.set(
	        localSpherePos.x + sphereRadius,
	        localSpherePos.y + sphereRadius,
	        localSpherePos.z + sphereRadius
	    );

	    trimeshShape.getTrianglesInAABB(localSphereAABB, triangles);
	    //for (var i = 0; i < trimeshShape.indices.length / 3; i++) triangles.push(i); // All

	    // Vertices
	    var v = sphereTrimesh_v;
	    var radiusSquared = sphereShape.radius * sphereShape.radius;
	    for(var i=0; i<triangles.length; i++){
	        for (var j = 0; j < 3; j++) {

	            trimeshShape.getVertex(trimeshShape.indices[triangles[i] * 3 + j], v);

	            // Check vertex overlap in sphere
	            v.vsub(localSpherePos, relpos);

	            if(relpos.norm2() <= radiusSquared){

	                // Safe up
	                v2.copy(v);
	                Transform.pointToWorldFrame(trimeshPos, trimeshQuat, v2, v);

	                v.vsub(spherePos, relpos);

	                var r = this.createContactEquation(sphereBody,trimeshBody,sphereShape,trimeshShape);
	                r.ni.copy(relpos);
	                r.ni.normalize();

	                // ri is the vector from sphere center to the sphere surface
	                r.ri.copy(r.ni);
	                r.ri.scale(sphereShape.radius, r.ri);
	                r.ri.vadd(spherePos, r.ri);
	                r.ri.vsub(sphereBody.position, r.ri);

	                r.rj.copy(v);
	                r.rj.vsub(trimeshBody.position, r.rj);

	                // Store result
	                this.result.push(r);
	                this.createFrictionEquationsFromContact(r, this.frictionResult);
	            }
	        }
	    }

	    // Check all edges
	    for(var i=0; i<triangles.length; i++){
	        for (var j = 0; j < 3; j++) {

	            trimeshShape.getVertex(trimeshShape.indices[triangles[i] * 3 + j], edgeVertexA);
	            trimeshShape.getVertex(trimeshShape.indices[triangles[i] * 3 + ((j+1)%3)], edgeVertexB);
	            edgeVertexB.vsub(edgeVertexA, edgeVector);

	            // Project sphere position to the edge
	            localSpherePos.vsub(edgeVertexB, tmp);
	            var positionAlongEdgeB = tmp.dot(edgeVector);

	            localSpherePos.vsub(edgeVertexA, tmp);
	            var positionAlongEdgeA = tmp.dot(edgeVector);

	            if(positionAlongEdgeA > 0 && positionAlongEdgeB < 0){

	                // Now check the orthogonal distance from edge to sphere center
	                localSpherePos.vsub(edgeVertexA, tmp);

	                edgeVectorUnit.copy(edgeVector);
	                edgeVectorUnit.normalize();
	                positionAlongEdgeA = tmp.dot(edgeVectorUnit);

	                edgeVectorUnit.scale(positionAlongEdgeA, tmp);
	                tmp.vadd(edgeVertexA, tmp);

	                // tmp is now the sphere center position projected to the edge, defined locally in the trimesh frame
	                var dist = tmp.distanceTo(localSpherePos);
	                if(dist < sphereShape.radius){
	                    var r = this.createContactEquation(sphereBody, trimeshBody, sphereShape, trimeshShape);

	                    tmp.vsub(localSpherePos, r.ni);
	                    r.ni.normalize();
	                    r.ni.scale(sphereShape.radius, r.ri);

	                    Transform.pointToWorldFrame(trimeshPos, trimeshQuat, tmp, tmp);
	                    tmp.vsub(trimeshBody.position, r.rj);

	                    Transform.vectorToWorldFrame(trimeshQuat, r.ni, r.ni);
	                    Transform.vectorToWorldFrame(trimeshQuat, r.ri, r.ri);

	                    this.result.push(r);
	                    this.createFrictionEquationsFromContact(r, this.frictionResult);
	                }
	            }
	        }
	    }

	    // Triangle faces
	    var va = sphereTrimesh_va;
	    var vb = sphereTrimesh_vb;
	    var vc = sphereTrimesh_vc;
	    var normal = sphereTrimesh_normal;
	    for(var i=0, N = triangles.length; i !== N; i++){
	        trimeshShape.getTriangleVertices(triangles[i], va, vb, vc);
	        trimeshShape.getNormal(triangles[i], normal);
	        localSpherePos.vsub(va, tmp);
	        var dist = tmp.dot(normal);
	        normal.scale(dist, tmp);
	        localSpherePos.vsub(tmp, tmp);

	        // tmp is now the sphere position projected to the triangle plane
	        dist = tmp.distanceTo(localSpherePos);
	        if(Ray.pointInTriangle(tmp, va, vb, vc) && dist < sphereShape.radius){
	            var r = this.createContactEquation(sphereBody, trimeshBody, sphereShape, trimeshShape);

	            tmp.vsub(localSpherePos, r.ni);
	            r.ni.normalize();
	            r.ni.scale(sphereShape.radius, r.ri);

	            Transform.pointToWorldFrame(trimeshPos, trimeshQuat, tmp, tmp);
	            tmp.vsub(trimeshBody.position, r.rj);

	            Transform.vectorToWorldFrame(trimeshQuat, r.ni, r.ni);
	            Transform.vectorToWorldFrame(trimeshQuat, r.ri, r.ri);

	            this.result.push(r);
	            this.createFrictionEquationsFromContact(r, this.frictionResult);
	        }
	    }

	    triangles.length = 0;
	};

	var point_on_plane_to_sphere = new Vec3();
	var plane_to_sphere_ortho = new Vec3();

	/**
	 * @method spherePlane
	 * @param  {Shape}      si
	 * @param  {Shape}      sj
	 * @param  {Vec3}       xi
	 * @param  {Vec3}       xj
	 * @param  {Quaternion} qi
	 * @param  {Quaternion} qj
	 * @param  {Body}       bi
	 * @param  {Body}       bj
	 */
	Narrowphase.prototype[Shape.types.SPHERE | Shape.types.PLANE] =
	Narrowphase.prototype.spherePlane = function(si,sj,xi,xj,qi,qj,bi,bj){
	    // We will have one contact in this case
	    var r = this.createContactEquation(bi,bj,si,sj);

	    // Contact normal
	    r.ni.set(0,0,1);
	    qj.vmult(r.ni, r.ni);
	    r.ni.negate(r.ni); // body i is the sphere, flip normal
	    r.ni.normalize(); // Needed?

	    // Vector from sphere center to contact point
	    r.ni.mult(si.radius, r.ri);

	    // Project down sphere on plane
	    xi.vsub(xj, point_on_plane_to_sphere);
	    r.ni.mult(r.ni.dot(point_on_plane_to_sphere), plane_to_sphere_ortho);
	    point_on_plane_to_sphere.vsub(plane_to_sphere_ortho,r.rj); // The sphere position projected to plane

	    if(-point_on_plane_to_sphere.dot(r.ni) <= si.radius){

	        // Make it relative to the body
	        var ri = r.ri;
	        var rj = r.rj;
	        ri.vadd(xi, ri);
	        ri.vsub(bi.position, ri);
	        rj.vadd(xj, rj);
	        rj.vsub(bj.position, rj);

	        this.result.push(r);
	        this.createFrictionEquationsFromContact(r, this.frictionResult);
	    }
	};

	// See http://bulletphysics.com/Bullet/BulletFull/SphereTriangleDetector_8cpp_source.html
	var pointInPolygon_edge = new Vec3();
	var pointInPolygon_edge_x_normal = new Vec3();
	var pointInPolygon_vtp = new Vec3();
	function pointInPolygon(verts, normal, p){
	    var positiveResult = null;
	    var N = verts.length;
	    for(var i=0; i!==N; i++){
	        var v = verts[i];

	        // Get edge to the next vertex
	        var edge = pointInPolygon_edge;
	        verts[(i+1) % (N)].vsub(v,edge);

	        // Get cross product between polygon normal and the edge
	        var edge_x_normal = pointInPolygon_edge_x_normal;
	        //var edge_x_normal = new Vec3();
	        edge.cross(normal,edge_x_normal);

	        // Get vector between point and current vertex
	        var vertex_to_p = pointInPolygon_vtp;
	        p.vsub(v,vertex_to_p);

	        // This dot product determines which side of the edge the point is
	        var r = edge_x_normal.dot(vertex_to_p);

	        // If all such dot products have same sign, we are inside the polygon.
	        if(positiveResult===null || (r>0 && positiveResult===true) || (r<=0 && positiveResult===false)){
	            if(positiveResult===null){
	                positiveResult = r>0;
	            }
	            continue;
	        } else {
	            return false; // Encountered some other sign. Exit.
	        }
	    }

	    // If we got here, all dot products were of the same sign.
	    return true;
	}

	var box_to_sphere = new Vec3();
	var sphereBox_ns = new Vec3();
	var sphereBox_ns1 = new Vec3();
	var sphereBox_ns2 = new Vec3();
	var sphereBox_sides = [new Vec3(),new Vec3(),new Vec3(),new Vec3(),new Vec3(),new Vec3()];
	var sphereBox_sphere_to_corner = new Vec3();
	var sphereBox_side_ns = new Vec3();
	var sphereBox_side_ns1 = new Vec3();
	var sphereBox_side_ns2 = new Vec3();

	/**
	 * @method sphereBox
	 * @param  {Shape}      si
	 * @param  {Shape}      sj
	 * @param  {Vec3}       xi
	 * @param  {Vec3}       xj
	 * @param  {Quaternion} qi
	 * @param  {Quaternion} qj
	 * @param  {Body}       bi
	 * @param  {Body}       bj
	 */
	Narrowphase.prototype[Shape.types.SPHERE | Shape.types.BOX] =
	Narrowphase.prototype.sphereBox = function(si,sj,xi,xj,qi,qj,bi,bj){
	    var v3pool = this.v3pool;

	    // we refer to the box as body j
	    var sides = sphereBox_sides;
	    xi.vsub(xj,box_to_sphere);
	    sj.getSideNormals(sides,qj);
	    var R =     si.radius;

	    // Check side (plane) intersections
	    var found = false;

	    // Store the resulting side penetration info
	    var side_ns = sphereBox_side_ns;
	    var side_ns1 = sphereBox_side_ns1;
	    var side_ns2 = sphereBox_side_ns2;
	    var side_h = null;
	    var side_penetrations = 0;
	    var side_dot1 = 0;
	    var side_dot2 = 0;
	    var side_distance = null;
	    for(var idx=0,nsides=sides.length; idx!==nsides && found===false; idx++){
	        // Get the plane side normal (ns)
	        var ns = sphereBox_ns;
	        ns.copy(sides[idx]);

	        var h = ns.norm();
	        ns.normalize();

	        // The normal/distance dot product tells which side of the plane we are
	        var dot = box_to_sphere.dot(ns);

	        if(dot<h+R && dot>0){
	            // Intersects plane. Now check the other two dimensions
	            var ns1 = sphereBox_ns1;
	            var ns2 = sphereBox_ns2;
	            ns1.copy(sides[(idx+1)%3]);
	            ns2.copy(sides[(idx+2)%3]);
	            var h1 = ns1.norm();
	            var h2 = ns2.norm();
	            ns1.normalize();
	            ns2.normalize();
	            var dot1 = box_to_sphere.dot(ns1);
	            var dot2 = box_to_sphere.dot(ns2);
	            if(dot1<h1 && dot1>-h1 && dot2<h2 && dot2>-h2){
	                var dist = Math.abs(dot-h-R);
	                if(side_distance===null || dist < side_distance){
	                    side_distance = dist;
	                    side_dot1 = dot1;
	                    side_dot2 = dot2;
	                    side_h = h;
	                    side_ns.copy(ns);
	                    side_ns1.copy(ns1);
	                    side_ns2.copy(ns2);
	                    side_penetrations++;
	                }
	            }
	        }
	    }
	    if(side_penetrations){
	        found = true;
	        var r = this.createContactEquation(bi,bj,si,sj);
	        side_ns.mult(-R,r.ri); // Sphere r
	        r.ni.copy(side_ns);
	        r.ni.negate(r.ni); // Normal should be out of sphere
	        side_ns.mult(side_h,side_ns);
	        side_ns1.mult(side_dot1,side_ns1);
	        side_ns.vadd(side_ns1,side_ns);
	        side_ns2.mult(side_dot2,side_ns2);
	        side_ns.vadd(side_ns2,r.rj);

	        // Make relative to bodies
	        r.ri.vadd(xi, r.ri);
	        r.ri.vsub(bi.position, r.ri);
	        r.rj.vadd(xj, r.rj);
	        r.rj.vsub(bj.position, r.rj);

	        this.result.push(r);
	        this.createFrictionEquationsFromContact(r, this.frictionResult);
	    }

	    // Check corners
	    var rj = v3pool.get();
	    var sphere_to_corner = sphereBox_sphere_to_corner;
	    for(var j=0; j!==2 && !found; j++){
	        for(var k=0; k!==2 && !found; k++){
	            for(var l=0; l!==2 && !found; l++){
	                rj.set(0,0,0);
	                if(j){
	                    rj.vadd(sides[0],rj);
	                } else {
	                    rj.vsub(sides[0],rj);
	                }
	                if(k){
	                    rj.vadd(sides[1],rj);
	                } else {
	                    rj.vsub(sides[1],rj);
	                }
	                if(l){
	                    rj.vadd(sides[2],rj);
	                } else {
	                    rj.vsub(sides[2],rj);
	                }

	                // World position of corner
	                xj.vadd(rj,sphere_to_corner);
	                sphere_to_corner.vsub(xi,sphere_to_corner);

	                if(sphere_to_corner.norm2() < R*R){
	                    found = true;
	                    var r = this.createContactEquation(bi,bj,si,sj);
	                    r.ri.copy(sphere_to_corner);
	                    r.ri.normalize();
	                    r.ni.copy(r.ri);
	                    r.ri.mult(R,r.ri);
	                    r.rj.copy(rj);

	                    // Make relative to bodies
	                    r.ri.vadd(xi, r.ri);
	                    r.ri.vsub(bi.position, r.ri);
	                    r.rj.vadd(xj, r.rj);
	                    r.rj.vsub(bj.position, r.rj);

	                    this.result.push(r);
	                    this.createFrictionEquationsFromContact(r, this.frictionResult);
	                }
	            }
	        }
	    }
	    v3pool.release(rj);
	    rj = null;

	    // Check edges
	    var edgeTangent = v3pool.get();
	    var edgeCenter = v3pool.get();
	    var r = v3pool.get(); // r = edge center to sphere center
	    var orthogonal = v3pool.get();
	    var dist = v3pool.get();
	    var Nsides = sides.length;
	    for(var j=0; j!==Nsides && !found; j++){
	        for(var k=0; k!==Nsides && !found; k++){
	            if(j%3 !== k%3){
	                // Get edge tangent
	                sides[k].cross(sides[j],edgeTangent);
	                edgeTangent.normalize();
	                sides[j].vadd(sides[k], edgeCenter);
	                r.copy(xi);
	                r.vsub(edgeCenter,r);
	                r.vsub(xj,r);
	                var orthonorm = r.dot(edgeTangent); // distance from edge center to sphere center in the tangent direction
	                edgeTangent.mult(orthonorm,orthogonal); // Vector from edge center to sphere center in the tangent direction

	                // Find the third side orthogonal to this one
	                var l = 0;
	                while(l===j%3 || l===k%3){
	                    l++;
	                }

	                // vec from edge center to sphere projected to the plane orthogonal to the edge tangent
	                dist.copy(xi);
	                dist.vsub(orthogonal,dist);
	                dist.vsub(edgeCenter,dist);
	                dist.vsub(xj,dist);

	                // Distances in tangent direction and distance in the plane orthogonal to it
	                var tdist = Math.abs(orthonorm);
	                var ndist = dist.norm();

	                if(tdist < sides[l].norm() && ndist<R){
	                    found = true;
	                    var res = this.createContactEquation(bi,bj,si,sj);
	                    edgeCenter.vadd(orthogonal,res.rj); // box rj
	                    res.rj.copy(res.rj);
	                    dist.negate(res.ni);
	                    res.ni.normalize();

	                    res.ri.copy(res.rj);
	                    res.ri.vadd(xj,res.ri);
	                    res.ri.vsub(xi,res.ri);
	                    res.ri.normalize();
	                    res.ri.mult(R,res.ri);

	                    // Make relative to bodies
	                    res.ri.vadd(xi, res.ri);
	                    res.ri.vsub(bi.position, res.ri);
	                    res.rj.vadd(xj, res.rj);
	                    res.rj.vsub(bj.position, res.rj);

	                    this.result.push(res);
	                    this.createFrictionEquationsFromContact(res, this.frictionResult);
	                }
	            }
	        }
	    }
	    v3pool.release(edgeTangent,edgeCenter,r,orthogonal,dist);
	};

	var convex_to_sphere = new Vec3();
	var sphereConvex_edge = new Vec3();
	var sphereConvex_edgeUnit = new Vec3();
	var sphereConvex_sphereToCorner = new Vec3();
	var sphereConvex_worldCorner = new Vec3();
	var sphereConvex_worldNormal = new Vec3();
	var sphereConvex_worldPoint = new Vec3();
	var sphereConvex_worldSpherePointClosestToPlane = new Vec3();
	var sphereConvex_penetrationVec = new Vec3();
	var sphereConvex_sphereToWorldPoint = new Vec3();

	/**
	 * @method sphereConvex
	 * @param  {Shape}      si
	 * @param  {Shape}      sj
	 * @param  {Vec3}       xi
	 * @param  {Vec3}       xj
	 * @param  {Quaternion} qi
	 * @param  {Quaternion} qj
	 * @param  {Body}       bi
	 * @param  {Body}       bj
	 */
	Narrowphase.prototype[Shape.types.SPHERE | Shape.types.CONVEXPOLYHEDRON] =
	Narrowphase.prototype.sphereConvex = function(si,sj,xi,xj,qi,qj,bi,bj){
	    var v3pool = this.v3pool;
	    xi.vsub(xj,convex_to_sphere);
	    var normals = sj.faceNormals;
	    var faces = sj.faces;
	    var verts = sj.vertices;
	    var R =     si.radius;

	    // if(convex_to_sphere.norm2() > si.boundingSphereRadius + sj.boundingSphereRadius){
	    //     return;
	    // }

	    // Check corners
	    for(var i=0; i!==verts.length; i++){
	        var v = verts[i];

	        // World position of corner
	        var worldCorner = sphereConvex_worldCorner;
	        qj.vmult(v,worldCorner);
	        xj.vadd(worldCorner,worldCorner);
	        var sphere_to_corner = sphereConvex_sphereToCorner;
	        worldCorner.vsub(xi, sphere_to_corner);
	        if(sphere_to_corner.norm2() < R * R){
	            found = true;
	            var r = this.createContactEquation(bi,bj,si,sj);
	            r.ri.copy(sphere_to_corner);
	            r.ri.normalize();
	            r.ni.copy(r.ri);
	            r.ri.mult(R,r.ri);
	            worldCorner.vsub(xj,r.rj);

	            // Should be relative to the body.
	            r.ri.vadd(xi, r.ri);
	            r.ri.vsub(bi.position, r.ri);

	            // Should be relative to the body.
	            r.rj.vadd(xj, r.rj);
	            r.rj.vsub(bj.position, r.rj);

	            this.result.push(r);
	            this.createFrictionEquationsFromContact(r, this.frictionResult);
	            return;
	        }
	    }

	    // Check side (plane) intersections
	    var found = false;
	    for(var i=0, nfaces=faces.length; i!==nfaces && found===false; i++){
	        var normal = normals[i];
	        var face = faces[i];

	        // Get world-transformed normal of the face
	        var worldNormal = sphereConvex_worldNormal;
	        qj.vmult(normal,worldNormal);

	        // Get a world vertex from the face
	        var worldPoint = sphereConvex_worldPoint;
	        qj.vmult(verts[face[0]],worldPoint);
	        worldPoint.vadd(xj,worldPoint);

	        // Get a point on the sphere, closest to the face normal
	        var worldSpherePointClosestToPlane = sphereConvex_worldSpherePointClosestToPlane;
	        worldNormal.mult(-R, worldSpherePointClosestToPlane);
	        xi.vadd(worldSpherePointClosestToPlane, worldSpherePointClosestToPlane);

	        // Vector from a face point to the closest point on the sphere
	        var penetrationVec = sphereConvex_penetrationVec;
	        worldSpherePointClosestToPlane.vsub(worldPoint,penetrationVec);

	        // The penetration. Negative value means overlap.
	        var penetration = penetrationVec.dot(worldNormal);

	        var worldPointToSphere = sphereConvex_sphereToWorldPoint;
	        xi.vsub(worldPoint, worldPointToSphere);

	        if(penetration < 0 && worldPointToSphere.dot(worldNormal)>0){
	            // Intersects plane. Now check if the sphere is inside the face polygon
	            var faceVerts = []; // Face vertices, in world coords
	            for(var j=0, Nverts=face.length; j!==Nverts; j++){
	                var worldVertex = v3pool.get();
	                qj.vmult(verts[face[j]], worldVertex);
	                xj.vadd(worldVertex,worldVertex);
	                faceVerts.push(worldVertex);
	            }

	            if(pointInPolygon(faceVerts,worldNormal,xi)){ // Is the sphere center in the face polygon?
	                found = true;
	                var r = this.createContactEquation(bi,bj,si,sj);

	                worldNormal.mult(-R, r.ri); // Contact offset, from sphere center to contact
	                worldNormal.negate(r.ni); // Normal pointing out of sphere

	                var penetrationVec2 = v3pool.get();
	                worldNormal.mult(-penetration, penetrationVec2);
	                var penetrationSpherePoint = v3pool.get();
	                worldNormal.mult(-R, penetrationSpherePoint);

	                //xi.vsub(xj).vadd(penetrationSpherePoint).vadd(penetrationVec2 , r.rj);
	                xi.vsub(xj,r.rj);
	                r.rj.vadd(penetrationSpherePoint,r.rj);
	                r.rj.vadd(penetrationVec2 , r.rj);

	                // Should be relative to the body.
	                r.rj.vadd(xj, r.rj);
	                r.rj.vsub(bj.position, r.rj);

	                // Should be relative to the body.
	                r.ri.vadd(xi, r.ri);
	                r.ri.vsub(bi.position, r.ri);

	                v3pool.release(penetrationVec2);
	                v3pool.release(penetrationSpherePoint);

	                this.result.push(r);
	                this.createFrictionEquationsFromContact(r, this.frictionResult);

	                // Release world vertices
	                for(var j=0, Nfaceverts=faceVerts.length; j!==Nfaceverts; j++){
	                    v3pool.release(faceVerts[j]);
	                }

	                return; // We only expect *one* face contact
	            } else {
	                // Edge?
	                for(var j=0; j!==face.length; j++){

	                    // Get two world transformed vertices
	                    var v1 = v3pool.get();
	                    var v2 = v3pool.get();
	                    qj.vmult(verts[face[(j+1)%face.length]], v1);
	                    qj.vmult(verts[face[(j+2)%face.length]], v2);
	                    xj.vadd(v1, v1);
	                    xj.vadd(v2, v2);

	                    // Construct edge vector
	                    var edge = sphereConvex_edge;
	                    v2.vsub(v1,edge);

	                    // Construct the same vector, but normalized
	                    var edgeUnit = sphereConvex_edgeUnit;
	                    edge.unit(edgeUnit);

	                    // p is xi projected onto the edge
	                    var p = v3pool.get();
	                    var v1_to_xi = v3pool.get();
	                    xi.vsub(v1, v1_to_xi);
	                    var dot = v1_to_xi.dot(edgeUnit);
	                    edgeUnit.mult(dot, p);
	                    p.vadd(v1, p);

	                    // Compute a vector from p to the center of the sphere
	                    var xi_to_p = v3pool.get();
	                    p.vsub(xi, xi_to_p);

	                    // Collision if the edge-sphere distance is less than the radius
	                    // AND if p is in between v1 and v2
	                    if(dot > 0 && dot*dot<edge.norm2() && xi_to_p.norm2() < R*R){ // Collision if the edge-sphere distance is less than the radius
	                        // Edge contact!
	                        var r = this.createContactEquation(bi,bj,si,sj);
	                        p.vsub(xj,r.rj);

	                        p.vsub(xi,r.ni);
	                        r.ni.normalize();

	                        r.ni.mult(R,r.ri);

	                        // Should be relative to the body.
	                        r.rj.vadd(xj, r.rj);
	                        r.rj.vsub(bj.position, r.rj);

	                        // Should be relative to the body.
	                        r.ri.vadd(xi, r.ri);
	                        r.ri.vsub(bi.position, r.ri);

	                        this.result.push(r);
	                        this.createFrictionEquationsFromContact(r, this.frictionResult);

	                        // Release world vertices
	                        for(var j=0, Nfaceverts=faceVerts.length; j!==Nfaceverts; j++){
	                            v3pool.release(faceVerts[j]);
	                        }

	                        v3pool.release(v1);
	                        v3pool.release(v2);
	                        v3pool.release(p);
	                        v3pool.release(xi_to_p);
	                        v3pool.release(v1_to_xi);

	                        return;
	                    }

	                    v3pool.release(v1);
	                    v3pool.release(v2);
	                    v3pool.release(p);
	                    v3pool.release(xi_to_p);
	                    v3pool.release(v1_to_xi);
	                }
	            }

	            // Release world vertices
	            for(var j=0, Nfaceverts=faceVerts.length; j!==Nfaceverts; j++){
	                v3pool.release(faceVerts[j]);
	            }
	        }
	    }
	};

	new Vec3();
	new Vec3();

	/**
	 * @method planeBox
	 * @param  {Array}      result
	 * @param  {Shape}      si
	 * @param  {Shape}      sj
	 * @param  {Vec3}       xi
	 * @param  {Vec3}       xj
	 * @param  {Quaternion} qi
	 * @param  {Quaternion} qj
	 * @param  {Body}       bi
	 * @param  {Body}       bj
	 */
	Narrowphase.prototype[Shape.types.PLANE | Shape.types.BOX] =
	Narrowphase.prototype.planeBox = function(si,sj,xi,xj,qi,qj,bi,bj){
	    sj.convexPolyhedronRepresentation.material = sj.material;
	    sj.convexPolyhedronRepresentation.collisionResponse = sj.collisionResponse;
	    this.planeConvex(si,sj.convexPolyhedronRepresentation,xi,xj,qi,qj,bi,bj);
	};

	var planeConvex_v = new Vec3();
	var planeConvex_normal = new Vec3();
	var planeConvex_relpos = new Vec3();
	var planeConvex_projected = new Vec3();

	/**
	 * @method planeConvex
	 * @param  {Shape}      si
	 * @param  {Shape}      sj
	 * @param  {Vec3}       xi
	 * @param  {Vec3}       xj
	 * @param  {Quaternion} qi
	 * @param  {Quaternion} qj
	 * @param  {Body}       bi
	 * @param  {Body}       bj
	 */
	Narrowphase.prototype[Shape.types.PLANE | Shape.types.CONVEXPOLYHEDRON] =
	Narrowphase.prototype.planeConvex = function(
	    planeShape,
	    convexShape,
	    planePosition,
	    convexPosition,
	    planeQuat,
	    convexQuat,
	    planeBody,
	    convexBody
	){
	    // Simply return the points behind the plane.
	    var worldVertex = planeConvex_v,
	        worldNormal = planeConvex_normal;
	    worldNormal.set(0,0,1);
	    planeQuat.vmult(worldNormal,worldNormal); // Turn normal according to plane orientation

	    var numContacts = 0;
	    var relpos = planeConvex_relpos;
	    for(var i = 0; i !== convexShape.vertices.length; i++){

	        // Get world convex vertex
	        worldVertex.copy(convexShape.vertices[i]);
	        convexQuat.vmult(worldVertex, worldVertex);
	        convexPosition.vadd(worldVertex, worldVertex);
	        worldVertex.vsub(planePosition, relpos);

	        var dot = worldNormal.dot(relpos);
	        if(dot <= 0.0){

	            var r = this.createContactEquation(planeBody, convexBody, planeShape, convexShape);

	            // Get vertex position projected on plane
	            var projected = planeConvex_projected;
	            worldNormal.mult(worldNormal.dot(relpos),projected);
	            worldVertex.vsub(projected, projected);
	            projected.vsub(planePosition, r.ri); // From plane to vertex projected on plane

	            r.ni.copy(worldNormal); // Contact normal is the plane normal out from plane

	            // rj is now just the vector from the convex center to the vertex
	            worldVertex.vsub(convexPosition, r.rj);

	            // Make it relative to the body
	            r.ri.vadd(planePosition, r.ri);
	            r.ri.vsub(planeBody.position, r.ri);
	            r.rj.vadd(convexPosition, r.rj);
	            r.rj.vsub(convexBody.position, r.rj);

	            this.result.push(r);
	            numContacts++;
	            if(!this.enableFrictionReduction){
	                this.createFrictionEquationsFromContact(r, this.frictionResult);
	            }
	        }
	    }

	    if(this.enableFrictionReduction && numContacts){
	        this.createFrictionFromAverage(numContacts);
	    }
	};

	var convexConvex_sepAxis = new Vec3();
	var convexConvex_q = new Vec3();

	/**
	 * @method convexConvex
	 * @param  {Shape}      si
	 * @param  {Shape}      sj
	 * @param  {Vec3}       xi
	 * @param  {Vec3}       xj
	 * @param  {Quaternion} qi
	 * @param  {Quaternion} qj
	 * @param  {Body}       bi
	 * @param  {Body}       bj
	 */
	Narrowphase.prototype[Shape.types.CONVEXPOLYHEDRON] =
	Narrowphase.prototype.convexConvex = function(si,sj,xi,xj,qi,qj,bi,bj,rsi,rsj,faceListA,faceListB){
	    var sepAxis = convexConvex_sepAxis;

	    if(xi.distanceTo(xj) > si.boundingSphereRadius + sj.boundingSphereRadius){
	        return;
	    }

	    if(si.findSeparatingAxis(sj,xi,qi,xj,qj,sepAxis,faceListA,faceListB)){
	        var res = [];
	        var q = convexConvex_q;
	        si.clipAgainstHull(xi,qi,sj,xj,qj,sepAxis,-100,100,res);
	        var numContacts = 0;
	        for(var j = 0; j !== res.length; j++){
	            var r = this.createContactEquation(bi,bj,si,sj,rsi,rsj),
	                ri = r.ri,
	                rj = r.rj;
	            sepAxis.negate(r.ni);
	            res[j].normal.negate(q);
	            q.mult(res[j].depth, q);
	            res[j].point.vadd(q, ri);
	            rj.copy(res[j].point);

	            // Contact points are in world coordinates. Transform back to relative
	            ri.vsub(xi,ri);
	            rj.vsub(xj,rj);

	            // Make relative to bodies
	            ri.vadd(xi, ri);
	            ri.vsub(bi.position, ri);
	            rj.vadd(xj, rj);
	            rj.vsub(bj.position, rj);

	            this.result.push(r);
	            numContacts++;
	            if(!this.enableFrictionReduction){
	                this.createFrictionEquationsFromContact(r, this.frictionResult);
	            }
	        }
	        if(this.enableFrictionReduction && numContacts){
	            this.createFrictionFromAverage(numContacts);
	        }
	    }
	};


	/**
	 * @method convexTrimesh
	 * @param  {Array}      result
	 * @param  {Shape}      si
	 * @param  {Shape}      sj
	 * @param  {Vec3}       xi
	 * @param  {Vec3}       xj
	 * @param  {Quaternion} qi
	 * @param  {Quaternion} qj
	 * @param  {Body}       bi
	 * @param  {Body}       bj
	 */
	// Narrowphase.prototype[Shape.types.CONVEXPOLYHEDRON | Shape.types.TRIMESH] =
	// Narrowphase.prototype.convexTrimesh = function(si,sj,xi,xj,qi,qj,bi,bj,rsi,rsj,faceListA,faceListB){
	//     var sepAxis = convexConvex_sepAxis;

	//     if(xi.distanceTo(xj) > si.boundingSphereRadius + sj.boundingSphereRadius){
	//         return;
	//     }

	//     // Construct a temp hull for each triangle
	//     var hullB = new ConvexPolyhedron();

	//     hullB.faces = [[0,1,2]];
	//     var va = new Vec3();
	//     var vb = new Vec3();
	//     var vc = new Vec3();
	//     hullB.vertices = [
	//         va,
	//         vb,
	//         vc
	//     ];

	//     for (var i = 0; i < sj.indices.length / 3; i++) {

	//         var triangleNormal = new Vec3();
	//         sj.getNormal(i, triangleNormal);
	//         hullB.faceNormals = [triangleNormal];

	//         sj.getTriangleVertices(i, va, vb, vc);

	//         var d = si.testSepAxis(triangleNormal, hullB, xi, qi, xj, qj);
	//         if(!d){
	//             triangleNormal.scale(-1, triangleNormal);
	//             d = si.testSepAxis(triangleNormal, hullB, xi, qi, xj, qj);

	//             if(!d){
	//                 continue;
	//             }
	//         }

	//         var res = [];
	//         var q = convexConvex_q;
	//         si.clipAgainstHull(xi,qi,hullB,xj,qj,triangleNormal,-100,100,res);
	//         for(var j = 0; j !== res.length; j++){
	//             var r = this.createContactEquation(bi,bj,si,sj,rsi,rsj),
	//                 ri = r.ri,
	//                 rj = r.rj;
	//             r.ni.copy(triangleNormal);
	//             r.ni.negate(r.ni);
	//             res[j].normal.negate(q);
	//             q.mult(res[j].depth, q);
	//             res[j].point.vadd(q, ri);
	//             rj.copy(res[j].point);

	//             // Contact points are in world coordinates. Transform back to relative
	//             ri.vsub(xi,ri);
	//             rj.vsub(xj,rj);

	//             // Make relative to bodies
	//             ri.vadd(xi, ri);
	//             ri.vsub(bi.position, ri);
	//             rj.vadd(xj, rj);
	//             rj.vsub(bj.position, rj);

	//             result.push(r);
	//         }
	//     }
	// };

	var particlePlane_normal = new Vec3();
	var particlePlane_relpos = new Vec3();
	var particlePlane_projected = new Vec3();

	/**
	 * @method particlePlane
	 * @param  {Array}      result
	 * @param  {Shape}      si
	 * @param  {Shape}      sj
	 * @param  {Vec3}       xi
	 * @param  {Vec3}       xj
	 * @param  {Quaternion} qi
	 * @param  {Quaternion} qj
	 * @param  {Body}       bi
	 * @param  {Body}       bj
	 */
	Narrowphase.prototype[Shape.types.PLANE | Shape.types.PARTICLE] =
	Narrowphase.prototype.planeParticle = function(sj,si,xj,xi,qj,qi,bj,bi){
	    var normal = particlePlane_normal;
	    normal.set(0,0,1);
	    bj.quaternion.vmult(normal,normal); // Turn normal according to plane orientation
	    var relpos = particlePlane_relpos;
	    xi.vsub(bj.position,relpos);
	    var dot = normal.dot(relpos);
	    if(dot <= 0.0){
	        var r = this.createContactEquation(bi,bj,si,sj);
	        r.ni.copy(normal); // Contact normal is the plane normal
	        r.ni.negate(r.ni);
	        r.ri.set(0,0,0); // Center of particle

	        // Get particle position projected on plane
	        var projected = particlePlane_projected;
	        normal.mult(normal.dot(xi),projected);
	        xi.vsub(projected,projected);
	        //projected.vadd(bj.position,projected);

	        // rj is now the projected world position minus plane position
	        r.rj.copy(projected);
	        this.result.push(r);
	        this.createFrictionEquationsFromContact(r, this.frictionResult);
	    }
	};

	var particleSphere_normal = new Vec3();

	/**
	 * @method particleSphere
	 * @param  {Array}      result
	 * @param  {Shape}      si
	 * @param  {Shape}      sj
	 * @param  {Vec3}       xi
	 * @param  {Vec3}       xj
	 * @param  {Quaternion} qi
	 * @param  {Quaternion} qj
	 * @param  {Body}       bi
	 * @param  {Body}       bj
	 */
	Narrowphase.prototype[Shape.types.PARTICLE | Shape.types.SPHERE] =
	Narrowphase.prototype.sphereParticle = function(sj,si,xj,xi,qj,qi,bj,bi){
	    // The normal is the unit vector from sphere center to particle center
	    var normal = particleSphere_normal;
	    normal.set(0,0,1);
	    xi.vsub(xj,normal);
	    var lengthSquared = normal.norm2();

	    if(lengthSquared <= sj.radius * sj.radius){
	        var r = this.createContactEquation(bi,bj,si,sj);
	        normal.normalize();
	        r.rj.copy(normal);
	        r.rj.mult(sj.radius,r.rj);
	        r.ni.copy(normal); // Contact normal
	        r.ni.negate(r.ni);
	        r.ri.set(0,0,0); // Center of particle
	        this.result.push(r);
	        this.createFrictionEquationsFromContact(r, this.frictionResult);
	    }
	};

	// WIP
	var cqj = new Quaternion();
	var convexParticle_local = new Vec3();
	new Vec3();
	var convexParticle_penetratedFaceNormal = new Vec3();
	var convexParticle_vertexToParticle = new Vec3();
	var convexParticle_worldPenetrationVec = new Vec3();

	/**
	 * @method convexParticle
	 * @param  {Array}      result
	 * @param  {Shape}      si
	 * @param  {Shape}      sj
	 * @param  {Vec3}       xi
	 * @param  {Vec3}       xj
	 * @param  {Quaternion} qi
	 * @param  {Quaternion} qj
	 * @param  {Body}       bi
	 * @param  {Body}       bj
	 */
	Narrowphase.prototype[Shape.types.PARTICLE | Shape.types.CONVEXPOLYHEDRON] =
	Narrowphase.prototype.convexParticle = function(sj,si,xj,xi,qj,qi,bj,bi){
	    var penetratedFaceIndex = -1;
	    var penetratedFaceNormal = convexParticle_penetratedFaceNormal;
	    var worldPenetrationVec = convexParticle_worldPenetrationVec;
	    var minPenetration = null;

	    // Convert particle position xi to local coords in the convex
	    var local = convexParticle_local;
	    local.copy(xi);
	    local.vsub(xj,local); // Convert position to relative the convex origin
	    qj.conjugate(cqj);
	    cqj.vmult(local,local);

	    if(sj.pointIsInside(local)){

	        if(sj.worldVerticesNeedsUpdate){
	            sj.computeWorldVertices(xj,qj);
	        }
	        if(sj.worldFaceNormalsNeedsUpdate){
	            sj.computeWorldFaceNormals(qj);
	        }

	        // For each world polygon in the polyhedra
	        for(var i=0,nfaces=sj.faces.length; i!==nfaces; i++){

	            // Construct world face vertices
	            var verts = [ sj.worldVertices[ sj.faces[i][0] ] ];
	            var normal = sj.worldFaceNormals[i];

	            // Check how much the particle penetrates the polygon plane.
	            xi.vsub(verts[0],convexParticle_vertexToParticle);
	            var penetration = -normal.dot(convexParticle_vertexToParticle);
	            if(minPenetration===null || Math.abs(penetration)<Math.abs(minPenetration)){
	                minPenetration = penetration;
	                penetratedFaceIndex = i;
	                penetratedFaceNormal.copy(normal);
	            }
	        }

	        if(penetratedFaceIndex!==-1){
	            // Setup contact
	            var r = this.createContactEquation(bi,bj,si,sj);
	            penetratedFaceNormal.mult(minPenetration, worldPenetrationVec);

	            // rj is the particle position projected to the face
	            worldPenetrationVec.vadd(xi,worldPenetrationVec);
	            worldPenetrationVec.vsub(xj,worldPenetrationVec);
	            r.rj.copy(worldPenetrationVec);
	            //var projectedToFace = xi.vsub(xj).vadd(worldPenetrationVec);
	            //projectedToFace.copy(r.rj);

	            //qj.vmult(r.rj,r.rj);
	            penetratedFaceNormal.negate( r.ni ); // Contact normal
	            r.ri.set(0,0,0); // Center of particle

	            var ri = r.ri,
	                rj = r.rj;

	            // Make relative to bodies
	            ri.vadd(xi, ri);
	            ri.vsub(bi.position, ri);
	            rj.vadd(xj, rj);
	            rj.vsub(bj.position, rj);

	            this.result.push(r);
	            this.createFrictionEquationsFromContact(r, this.frictionResult);
	        } else {
	            console.warn("Point found inside convex, but did not find penetrating face!");
	        }
	    }
	};

	Narrowphase.prototype[Shape.types.BOX | Shape.types.HEIGHTFIELD] =
	Narrowphase.prototype.boxHeightfield = function (si,sj,xi,xj,qi,qj,bi,bj){
	    si.convexPolyhedronRepresentation.material = si.material;
	    si.convexPolyhedronRepresentation.collisionResponse = si.collisionResponse;
	    this.convexHeightfield(si.convexPolyhedronRepresentation,sj,xi,xj,qi,qj,bi,bj);
	};

	var convexHeightfield_tmp1 = new Vec3();
	var convexHeightfield_tmp2 = new Vec3();
	var convexHeightfield_faceList = [0];

	/**
	 * @method convexHeightfield
	 */
	Narrowphase.prototype[Shape.types.CONVEXPOLYHEDRON | Shape.types.HEIGHTFIELD] =
	Narrowphase.prototype.convexHeightfield = function (
	    convexShape,
	    hfShape,
	    convexPos,
	    hfPos,
	    convexQuat,
	    hfQuat,
	    convexBody,
	    hfBody
	){
	    var data = hfShape.data,
	        w = hfShape.elementSize,
	        radius = convexShape.boundingSphereRadius,
	        worldPillarOffset = convexHeightfield_tmp2,
	        faceList = convexHeightfield_faceList;

	    // Get sphere position to heightfield local!
	    var localConvexPos = convexHeightfield_tmp1;
	    Transform.pointToLocalFrame(hfPos, hfQuat, convexPos, localConvexPos);

	    // Get the index of the data points to test against
	    var iMinX = Math.floor((localConvexPos.x - radius) / w) - 1,
	        iMaxX = Math.ceil((localConvexPos.x + radius) / w) + 1,
	        iMinY = Math.floor((localConvexPos.y - radius) / w) - 1,
	        iMaxY = Math.ceil((localConvexPos.y + radius) / w) + 1;

	    // Bail out if we are out of the terrain
	    if(iMaxX < 0 || iMaxY < 0 || iMinX > data.length || iMinY > data[0].length){
	        return;
	    }

	    // Clamp index to edges
	    if(iMinX < 0){ iMinX = 0; }
	    if(iMaxX < 0){ iMaxX = 0; }
	    if(iMinY < 0){ iMinY = 0; }
	    if(iMaxY < 0){ iMaxY = 0; }
	    if(iMinX >= data.length){ iMinX = data.length - 1; }
	    if(iMaxX >= data.length){ iMaxX = data.length - 1; }
	    if(iMaxY >= data[0].length){ iMaxY = data[0].length - 1; }
	    if(iMinY >= data[0].length){ iMinY = data[0].length - 1; }

	    var minMax = [];
	    hfShape.getRectMinMax(iMinX, iMinY, iMaxX, iMaxY, minMax);
	    var min = minMax[0];
	    var max = minMax[1];

	    // Bail out if we're cant touch the bounding height box
	    if(localConvexPos.z - radius > max || localConvexPos.z + radius < min){
	        return;
	    }

	    for(var i = iMinX; i < iMaxX; i++){
	        for(var j = iMinY; j < iMaxY; j++){

	            // Lower triangle
	            hfShape.getConvexTrianglePillar(i, j, false);
	            Transform.pointToWorldFrame(hfPos, hfQuat, hfShape.pillarOffset, worldPillarOffset);
	            if (convexPos.distanceTo(worldPillarOffset) < hfShape.pillarConvex.boundingSphereRadius + convexShape.boundingSphereRadius) {
	                this.convexConvex(convexShape, hfShape.pillarConvex, convexPos, worldPillarOffset, convexQuat, hfQuat, convexBody, hfBody, null, null, faceList, null);
	            }

	            // Upper triangle
	            hfShape.getConvexTrianglePillar(i, j, true);
	            Transform.pointToWorldFrame(hfPos, hfQuat, hfShape.pillarOffset, worldPillarOffset);
	            if (convexPos.distanceTo(worldPillarOffset) < hfShape.pillarConvex.boundingSphereRadius + convexShape.boundingSphereRadius) {
	                this.convexConvex(convexShape, hfShape.pillarConvex, convexPos, worldPillarOffset, convexQuat, hfQuat, convexBody, hfBody, null, null, faceList, null);
	            }
	        }
	    }
	};

	var sphereHeightfield_tmp1 = new Vec3();
	var sphereHeightfield_tmp2 = new Vec3();

	/**
	 * @method sphereHeightfield
	 */
	Narrowphase.prototype[Shape.types.SPHERE | Shape.types.HEIGHTFIELD] =
	Narrowphase.prototype.sphereHeightfield = function (
	    sphereShape,
	    hfShape,
	    spherePos,
	    hfPos,
	    sphereQuat,
	    hfQuat,
	    sphereBody,
	    hfBody
	){
	    var data = hfShape.data,
	        radius = sphereShape.radius,
	        w = hfShape.elementSize,
	        worldPillarOffset = sphereHeightfield_tmp2;

	    // Get sphere position to heightfield local!
	    var localSpherePos = sphereHeightfield_tmp1;
	    Transform.pointToLocalFrame(hfPos, hfQuat, spherePos, localSpherePos);

	    // Get the index of the data points to test against
	    var iMinX = Math.floor((localSpherePos.x - radius) / w) - 1,
	        iMaxX = Math.ceil((localSpherePos.x + radius) / w) + 1,
	        iMinY = Math.floor((localSpherePos.y - radius) / w) - 1,
	        iMaxY = Math.ceil((localSpherePos.y + radius) / w) + 1;

	    // Bail out if we are out of the terrain
	    if(iMaxX < 0 || iMaxY < 0 || iMinX > data.length || iMaxY > data[0].length){
	        return;
	    }

	    // Clamp index to edges
	    if(iMinX < 0){ iMinX = 0; }
	    if(iMaxX < 0){ iMaxX = 0; }
	    if(iMinY < 0){ iMinY = 0; }
	    if(iMaxY < 0){ iMaxY = 0; }
	    if(iMinX >= data.length){ iMinX = data.length - 1; }
	    if(iMaxX >= data.length){ iMaxX = data.length - 1; }
	    if(iMaxY >= data[0].length){ iMaxY = data[0].length - 1; }
	    if(iMinY >= data[0].length){ iMinY = data[0].length - 1; }

	    var minMax = [];
	    hfShape.getRectMinMax(iMinX, iMinY, iMaxX, iMaxY, minMax);
	    var min = minMax[0];
	    var max = minMax[1];

	    // Bail out if we're cant touch the bounding height box
	    if(localSpherePos.z - radius > max || localSpherePos.z + radius < min){
	        return;
	    }

	    var result = this.result;
	    for(var i = iMinX; i < iMaxX; i++){
	        for(var j = iMinY; j < iMaxY; j++){

	            var numContactsBefore = result.length;

	            // Lower triangle
	            hfShape.getConvexTrianglePillar(i, j, false);
	            Transform.pointToWorldFrame(hfPos, hfQuat, hfShape.pillarOffset, worldPillarOffset);
	            if (spherePos.distanceTo(worldPillarOffset) < hfShape.pillarConvex.boundingSphereRadius + sphereShape.boundingSphereRadius) {
	                this.sphereConvex(sphereShape, hfShape.pillarConvex, spherePos, worldPillarOffset, sphereQuat, hfQuat, sphereBody, hfBody);
	            }

	            // Upper triangle
	            hfShape.getConvexTrianglePillar(i, j, true);
	            Transform.pointToWorldFrame(hfPos, hfQuat, hfShape.pillarOffset, worldPillarOffset);
	            if (spherePos.distanceTo(worldPillarOffset) < hfShape.pillarConvex.boundingSphereRadius + sphereShape.boundingSphereRadius) {
	                this.sphereConvex(sphereShape, hfShape.pillarConvex, spherePos, worldPillarOffset, sphereQuat, hfQuat, sphereBody, hfBody);
	            }

	            var numContacts = result.length - numContactsBefore;

	            if(numContacts > 2){
	                return;
	            }
	            /*
	            // Skip all but 1
	            for (var k = 0; k < numContacts - 1; k++) {
	                result.pop();
	            }
	            */
	        }
	    }
	};

	},{"../collision/AABB":3,"../collision/Ray":9,"../equations/ContactEquation":19,"../equations/FrictionEquation":21,"../math/Quaternion":28,"../math/Transform":29,"../math/Vec3":30,"../shapes/ConvexPolyhedron":38,"../shapes/Shape":43,"../solver/Solver":47,"../utils/Vec3Pool":54}],56:[function(_dereq_,module,exports){
	/* global performance */

	module.exports = World;

	var Shape = _dereq_('../shapes/Shape');
	var Vec3 = _dereq_('../math/Vec3');
	var Quaternion = _dereq_('../math/Quaternion');
	var GSSolver = _dereq_('../solver/GSSolver');
	_dereq_('../utils/Vec3Pool');
	_dereq_('../equations/ContactEquation');
	_dereq_('../equations/FrictionEquation');
	var Narrowphase = _dereq_('./Narrowphase');
	var EventTarget = _dereq_('../utils/EventTarget');
	var ArrayCollisionMatrix = _dereq_('../collision/ArrayCollisionMatrix');
	var Material = _dereq_('../material/Material');
	var ContactMaterial = _dereq_('../material/ContactMaterial');
	var Body = _dereq_('../objects/Body');
	var TupleDictionary = _dereq_('../utils/TupleDictionary');
	var RaycastResult = _dereq_('../collision/RaycastResult');
	var AABB = _dereq_('../collision/AABB');
	var Ray = _dereq_('../collision/Ray');
	var NaiveBroadphase = _dereq_('../collision/NaiveBroadphase');

	/**
	 * The physics world
	 * @class World
	 * @constructor
	 * @extends EventTarget
	 */
	function World(){
	    EventTarget.apply(this);

	    /**
	     * Currently / last used timestep. Is set to -1 if not available. This value is updated before each internal step, which means that it is "fresh" inside event callbacks.
	     * @property {Number} dt
	     */
	    this.dt = -1;

	    /**
	     * Makes bodies go to sleep when they've been inactive
	     * @property allowSleep
	     * @type {Boolean}
	     */
	    this.allowSleep = false;

	    /**
	     * All the current contacts (instances of ContactEquation) in the world.
	     * @property contacts
	     * @type {Array}
	     */
	    this.contacts = [];
	    this.frictionEquations = [];

	    /**
	     * How often to normalize quaternions. Set to 0 for every step, 1 for every second etc.. A larger value increases performance. If bodies tend to explode, set to a smaller value (zero to be sure nothing can go wrong).
	     * @property quatNormalizeSkip
	     * @type {Number}
	     */
	    this.quatNormalizeSkip = 0;

	    /**
	     * Set to true to use fast quaternion normalization. It is often enough accurate to use. If bodies tend to explode, set to false.
	     * @property quatNormalizeFast
	     * @type {Boolean}
	     * @see Quaternion.normalizeFast
	     * @see Quaternion.normalize
	     */
	    this.quatNormalizeFast = false;

	    /**
	     * The wall-clock time since simulation start
	     * @property time
	     * @type {Number}
	     */
	    this.time = 0.0;

	    /**
	     * Number of timesteps taken since start
	     * @property stepnumber
	     * @type {Number}
	     */
	    this.stepnumber = 0;

	    /// Default and last timestep sizes
	    this.default_dt = 1/60;

	    this.nextId = 0;
	    /**
	     * @property gravity
	     * @type {Vec3}
	     */
	    this.gravity = new Vec3();

	    /**
	     * @property broadphase
	     * @type {Broadphase}
	     */
	    this.broadphase = new NaiveBroadphase();

	    /**
	     * @property bodies
	     * @type {Array}
	     */
	    this.bodies = [];

	    /**
	     * @property solver
	     * @type {Solver}
	     */
	    this.solver = new GSSolver();

	    /**
	     * @property constraints
	     * @type {Array}
	     */
	    this.constraints = [];

	    /**
	     * @property narrowphase
	     * @type {Narrowphase}
	     */
	    this.narrowphase = new Narrowphase(this);

	    /**
	     * @property {ArrayCollisionMatrix} collisionMatrix
		 * @type {ArrayCollisionMatrix}
		 */
		this.collisionMatrix = new ArrayCollisionMatrix();

	    /**
	     * CollisionMatrix from the previous step.
	     * @property {ArrayCollisionMatrix} collisionMatrixPrevious
		 * @type {ArrayCollisionMatrix}
		 */
		this.collisionMatrixPrevious = new ArrayCollisionMatrix();

	    /**
	     * All added materials
	     * @property materials
	     * @type {Array}
	     */
	    this.materials = [];

	    /**
	     * @property contactmaterials
	     * @type {Array}
	     */
	    this.contactmaterials = [];

	    /**
	     * Used to look up a ContactMaterial given two instances of Material.
	     * @property {TupleDictionary} contactMaterialTable
	     */
	    this.contactMaterialTable = new TupleDictionary();

	    this.defaultMaterial = new Material("default");

	    /**
	     * This contact material is used if no suitable contactmaterial is found for a contact.
	     * @property defaultContactMaterial
	     * @type {ContactMaterial}
	     */
	    this.defaultContactMaterial = new ContactMaterial(this.defaultMaterial, this.defaultMaterial, { friction: 0.3, restitution: 0.0 });

	    /**
	     * @property doProfiling
	     * @type {Boolean}
	     */
	    this.doProfiling = false;

	    /**
	     * @property profile
	     * @type {Object}
	     */
	    this.profile = {
	        solve:0,
	        makeContactConstraints:0,
	        broadphase:0,
	        integrate:0,
	        narrowphase:0,
	    };

	    /**
	     * @property subsystems
	     * @type {Array}
	     */
	    this.subsystems = [];

	    this.addBodyEvent = {
	        type:"addBody",
	        body : null,
	    };

	    this.removeBodyEvent = {
	        type:"removeBody",
	        body : null,
	    };
	}
	World.prototype = new EventTarget();

	// Temp stuff
	new AABB();
	var tmpRay = new Ray();

	/**
	 * Get the contact material between materials m1 and m2
	 * @method getContactMaterial
	 * @param {Material} m1
	 * @param {Material} m2
	 * @return {ContactMaterial} The contact material if it was found.
	 */
	World.prototype.getContactMaterial = function(m1,m2){
	    return this.contactMaterialTable.get(m1.id,m2.id); //this.contactmaterials[this.mats2cmat[i+j*this.materials.length]];
	};

	/**
	 * Get number of objects in the world.
	 * @method numObjects
	 * @return {Number}
	 * @deprecated
	 */
	World.prototype.numObjects = function(){
	    return this.bodies.length;
	};

	/**
	 * Store old collision state info
	 * @method collisionMatrixTick
	 */
	World.prototype.collisionMatrixTick = function(){
		var temp = this.collisionMatrixPrevious;
		this.collisionMatrixPrevious = this.collisionMatrix;
		this.collisionMatrix = temp;
		this.collisionMatrix.reset();
	};

	/**
	 * Add a rigid body to the simulation.
	 * @method add
	 * @param {Body} body
	 * @todo If the simulation has not yet started, why recrete and copy arrays for each body? Accumulate in dynamic arrays in this case.
	 * @todo Adding an array of bodies should be possible. This would save some loops too
	 * @deprecated Use .addBody instead
	 */
	World.prototype.add = World.prototype.addBody = function(body){
	    if(this.bodies.indexOf(body) !== -1){
	        return;
	    }
	    body.index = this.bodies.length;
	    this.bodies.push(body);
	    body.world = this;
	    body.initPosition.copy(body.position);
	    body.initVelocity.copy(body.velocity);
	    body.timeLastSleepy = this.time;
	    if(body instanceof Body){
	        body.initAngularVelocity.copy(body.angularVelocity);
	        body.initQuaternion.copy(body.quaternion);
	    }
		this.collisionMatrix.setNumObjects(this.bodies.length);
	    this.addBodyEvent.body = body;
	    this.dispatchEvent(this.addBodyEvent);
	};

	/**
	 * Add a constraint to the simulation.
	 * @method addConstraint
	 * @param {Constraint} c
	 */
	World.prototype.addConstraint = function(c){
	    this.constraints.push(c);
	};

	/**
	 * Removes a constraint
	 * @method removeConstraint
	 * @param {Constraint} c
	 */
	World.prototype.removeConstraint = function(c){
	    var idx = this.constraints.indexOf(c);
	    if(idx!==-1){
	        this.constraints.splice(idx,1);
	    }
	};

	/**
	 * Raycast test
	 * @method rayTest
	 * @param {Vec3} from
	 * @param {Vec3} to
	 * @param {Function|RaycastResult} result
	 * @deprecated Use .raycastAll, .raycastClosest or .raycastAny instead.
	 */
	World.prototype.rayTest = function(from, to, result){
	    if(result instanceof RaycastResult){
	        // Do raycastclosest
	        this.raycastClosest(from, to, {
	            skipBackfaces: true
	        }, result);
	    } else {
	        // Do raycastAll
	        this.raycastAll(from, to, {
	            skipBackfaces: true
	        }, result);
	    }
	};

	/**
	 * Ray cast against all bodies. The provided callback will be executed for each hit with a RaycastResult as single argument.
	 * @method raycastAll
	 * @param  {Vec3} from
	 * @param  {Vec3} to
	 * @param  {Object} options
	 * @param  {number} [options.collisionFilterMask=-1]
	 * @param  {number} [options.collisionFilterGroup=-1]
	 * @param  {boolean} [options.skipBackfaces=false]
	 * @param  {boolean} [options.checkCollisionResponse=true]
	 * @param  {Function} callback
	 * @return {boolean} True if any body was hit.
	 */
	World.prototype.raycastAll = function(from, to, options, callback){
	    options.mode = Ray.ALL;
	    options.from = from;
	    options.to = to;
	    options.callback = callback;
	    return tmpRay.intersectWorld(this, options);
	};

	/**
	 * Ray cast, and stop at the first result. Note that the order is random - but the method is fast.
	 * @method raycastAny
	 * @param  {Vec3} from
	 * @param  {Vec3} to
	 * @param  {Object} options
	 * @param  {number} [options.collisionFilterMask=-1]
	 * @param  {number} [options.collisionFilterGroup=-1]
	 * @param  {boolean} [options.skipBackfaces=false]
	 * @param  {boolean} [options.checkCollisionResponse=true]
	 * @param  {RaycastResult} result
	 * @return {boolean} True if any body was hit.
	 */
	World.prototype.raycastAny = function(from, to, options, result){
	    options.mode = Ray.ANY;
	    options.from = from;
	    options.to = to;
	    options.result = result;
	    return tmpRay.intersectWorld(this, options);
	};

	/**
	 * Ray cast, and return information of the closest hit.
	 * @method raycastClosest
	 * @param  {Vec3} from
	 * @param  {Vec3} to
	 * @param  {Object} options
	 * @param  {number} [options.collisionFilterMask=-1]
	 * @param  {number} [options.collisionFilterGroup=-1]
	 * @param  {boolean} [options.skipBackfaces=false]
	 * @param  {boolean} [options.checkCollisionResponse=true]
	 * @param  {RaycastResult} result
	 * @return {boolean} True if any body was hit.
	 */
	World.prototype.raycastClosest = function(from, to, options, result){
	    options.mode = Ray.CLOSEST;
	    options.from = from;
	    options.to = to;
	    options.result = result;
	    return tmpRay.intersectWorld(this, options);
	};

	/**
	 * Remove a rigid body from the simulation.
	 * @method remove
	 * @param {Body} body
	 * @deprecated Use .removeBody instead
	 */
	World.prototype.remove = function(body){
	    body.world = null;
	    var n = this.bodies.length-1,
	        bodies = this.bodies,
	        idx = bodies.indexOf(body);
	    if(idx !== -1){
	        bodies.splice(idx, 1); // Todo: should use a garbage free method

	        // Recompute index
	        for(var i=0; i!==bodies.length; i++){
	            bodies[i].index = i;
	        }

	        this.collisionMatrix.setNumObjects(n);
	        this.removeBodyEvent.body = body;
	        this.dispatchEvent(this.removeBodyEvent);
	    }
	};

	/**
	 * Remove a rigid body from the simulation.
	 * @method removeBody
	 * @param {Body} body
	 */
	World.prototype.removeBody = World.prototype.remove;

	/**
	 * Adds a material to the World.
	 * @method addMaterial
	 * @param {Material} m
	 * @todo Necessary?
	 */
	World.prototype.addMaterial = function(m){
	    this.materials.push(m);
	};

	/**
	 * Adds a contact material to the World
	 * @method addContactMaterial
	 * @param {ContactMaterial} cmat
	 */
	World.prototype.addContactMaterial = function(cmat) {

	    // Add contact material
	    this.contactmaterials.push(cmat);

	    // Add current contact material to the material table
	    this.contactMaterialTable.set(cmat.materials[0].id,cmat.materials[1].id,cmat);
	};

	// performance.now()
	if(typeof performance === 'undefined'){
	    performance = {};
	}
	if(!performance.now){
	    var nowOffset = Date.now();
	    if (performance.timing && performance.timing.navigationStart){
	        nowOffset = performance.timing.navigationStart;
	    }
	    performance.now = function(){
	        return Date.now() - nowOffset;
	    };
	}

	var step_tmp1 = new Vec3();

	/**
	 * Step the physics world forward in time.
	 *
	 * There are two modes. The simple mode is fixed timestepping without interpolation. In this case you only use the first argument. The second case uses interpolation. In that you also provide the time since the function was last used, as well as the maximum fixed timesteps to take.
	 *
	 * @method step
	 * @param {Number} dt                       The fixed time step size to use.
	 * @param {Number} [timeSinceLastCalled]    The time elapsed since the function was last called.
	 * @param {Number} [maxSubSteps=10]         Maximum number of fixed steps to take per function call.
	 *
	 * @example
	 *     // fixed timestepping without interpolation
	 *     world.step(1/60);
	 *
	 * @see http://bulletphysics.org/mediawiki-1.5.8/index.php/Stepping_The_World
	 */
	World.prototype.step = function(dt, timeSinceLastCalled, maxSubSteps){
	    maxSubSteps = maxSubSteps || 10;
	    timeSinceLastCalled = timeSinceLastCalled || 0;

	    if(timeSinceLastCalled === 0){ // Fixed, simple stepping

	        this.internalStep(dt);

	        // Increment time
	        this.time += dt;

	    } else {

	        // Compute the number of fixed steps we should have taken since the last step
	        var internalSteps = Math.floor((this.time + timeSinceLastCalled) / dt) - Math.floor(this.time / dt);
	        internalSteps = Math.min(internalSteps,maxSubSteps);

	        // Do some fixed steps to catch up
	        var t0 = performance.now();
	        for(var i=0; i!==internalSteps; i++){
	            this.internalStep(dt);
	            if(performance.now() - t0 > dt * 1000){
	                // We are slower than real-time. Better bail out.
	                break;
	            }
	        }

	        // Increment internal clock
	        this.time += timeSinceLastCalled;

	        // Compute "Left over" time step
	        var h = this.time % dt;
	        var h_div_dt = h / dt;
	        var interpvelo = step_tmp1;
	        var bodies = this.bodies;

	        for(var j=0; j !== bodies.length; j++){
	            var b = bodies[j];
	            if(b.type !== Body.STATIC && b.sleepState !== Body.SLEEPING){

	                // Interpolate
	                b.position.vsub(b.previousPosition, interpvelo);
	                interpvelo.scale(h_div_dt, interpvelo);
	                b.position.vadd(interpvelo, b.interpolatedPosition);

	                // TODO: interpolate quaternion
	                // b.interpolatedAngle = b.angle + (b.angle - b.previousAngle) * h_div_dt;

	            } else {

	                // For static bodies, just copy. Who else will do it?
	                b.interpolatedPosition.copy(b.position);
	                b.interpolatedQuaternion.copy(b.quaternion);
	            }
	        }
	    }
	};

	/**
	 * Step the simulation
	 * @method step
	 * @param {Number} dt
	 */
	var World_step_postStepEvent = {type:"postStep"}, // Reusable event objects to save memory
	    World_step_preStepEvent = {type:"preStep"},
	    World_step_collideEvent = {type:"collide", body:null, contact:null },
	    World_step_oldContacts = [], // Pools for unused objects
	    World_step_frictionEquationPool = [],
	    World_step_p1 = [], // Reusable arrays for collision pairs
	    World_step_p2 = [];
	    new Vec3(); // Temporary vectors and quats
	    new Vec3();
	    new Vec3();
	    new Vec3();
	    new Vec3();
	    new Vec3();
	    new Vec3();
	    new Vec3();
	    new Vec3();
	    new Quaternion();
	    var World_step_step_w = new Quaternion(),
	    World_step_step_wq = new Quaternion(),
	    invI_tau_dt = new Vec3();
	World.prototype.internalStep = function(dt){
	    this.dt = dt;

	    var contacts = this.contacts,
	        p1 = World_step_p1,
	        p2 = World_step_p2,
	        N = this.numObjects(),
	        bodies = this.bodies,
	        solver = this.solver,
	        gravity = this.gravity,
	        doProfiling = this.doProfiling,
	        profile = this.profile,
	        DYNAMIC = Body.DYNAMIC,
	        profilingStart,
	        constraints = this.constraints,
	        frictionEquationPool = World_step_frictionEquationPool;
	        gravity.norm();
	        var gx = gravity.x,
	        gy = gravity.y,
	        gz = gravity.z,
	        i=0;

	    if(doProfiling){
	        profilingStart = performance.now();
	    }

	    // Add gravity to all objects
	    for(i=0; i!==N; i++){
	        var bi = bodies[i];
	        if(bi.type & DYNAMIC){ // Only for dynamic bodies
	            var f = bi.force, m = bi.mass;
	            f.x += m*gx;
	            f.y += m*gy;
	            f.z += m*gz;
	        }
	    }

	    // Update subsystems
	    for(var i=0, Nsubsystems=this.subsystems.length; i!==Nsubsystems; i++){
	        this.subsystems[i].update();
	    }

	    // Collision detection
	    if(doProfiling){ profilingStart = performance.now(); }
	    p1.length = 0; // Clean up pair arrays from last step
	    p2.length = 0;
	    this.broadphase.collisionPairs(this,p1,p2);
	    if(doProfiling){ profile.broadphase = performance.now() - profilingStart; }

	    // Remove constrained pairs with collideConnected == false
	    var Nconstraints = constraints.length;
	    for(i=0; i!==Nconstraints; i++){
	        var c = constraints[i];
	        if(!c.collideConnected){
	            for(var j = p1.length-1; j>=0; j-=1){
	                if( (c.bodyA === p1[j] && c.bodyB === p2[j]) ||
	                    (c.bodyB === p1[j] && c.bodyA === p2[j])){
	                    p1.splice(j, 1);
	                    p2.splice(j, 1);
	                }
	            }
	        }
	    }

	    this.collisionMatrixTick();

	    // Generate contacts
	    if(doProfiling){ profilingStart = performance.now(); }
	    var oldcontacts = World_step_oldContacts;
	    var NoldContacts = contacts.length;

	    for(i=0; i!==NoldContacts; i++){
	        oldcontacts.push(contacts[i]);
	    }
	    contacts.length = 0;

	    // Transfer FrictionEquation from current list to the pool for reuse
	    var NoldFrictionEquations = this.frictionEquations.length;
	    for(i=0; i!==NoldFrictionEquations; i++){
	        frictionEquationPool.push(this.frictionEquations[i]);
	    }
	    this.frictionEquations.length = 0;

	    this.narrowphase.getContacts(
	        p1,
	        p2,
	        this,
	        contacts,
	        oldcontacts, // To be reused
	        this.frictionEquations,
	        frictionEquationPool
	    );

	    if(doProfiling){
	        profile.narrowphase = performance.now() - profilingStart;
	    }

	    // Loop over all collisions
	    if(doProfiling){
	        profilingStart = performance.now();
	    }

	    // Add all friction eqs
	    for (var i = 0; i < this.frictionEquations.length; i++) {
	        solver.addEquation(this.frictionEquations[i]);
	    }

	    var ncontacts = contacts.length;
	    for(var k=0; k!==ncontacts; k++){

	        // Current contact
	        var c = contacts[k];

	        // Get current collision indeces
	        var bi = c.bi,
	            bj = c.bj;
	            c.si;
	            c.sj;

	        // Get collision properties
	        var cm;
	        if(bi.material && bj.material){
	            cm = this.getContactMaterial(bi.material,bj.material) || this.defaultContactMaterial;
	        } else {
	            cm = this.defaultContactMaterial;
	        }

	        // c.enabled = bi.collisionResponse && bj.collisionResponse && si.collisionResponse && sj.collisionResponse;

	        cm.friction;
	        // c.restitution = cm.restitution;

	        // If friction or restitution were specified in the material, use them
	        if(bi.material && bj.material){
	            if(bi.material.friction >= 0 && bj.material.friction >= 0){
	                bi.material.friction * bj.material.friction;
	            }

	            if(bi.material.restitution >= 0 && bj.material.restitution >= 0){
	                c.restitution = bi.material.restitution * bj.material.restitution;
	            }
	        }

			// c.setSpookParams(
	  //           cm.contactEquationStiffness,
	  //           cm.contactEquationRelaxation,
	  //           dt
	  //       );

			solver.addEquation(c);

			// // Add friction constraint equation
			// if(mu > 0){

			// 	// Create 2 tangent equations
			// 	var mug = mu * gnorm;
			// 	var reducedMass = (bi.invMass + bj.invMass);
			// 	if(reducedMass > 0){
			// 		reducedMass = 1/reducedMass;
			// 	}
			// 	var pool = frictionEquationPool;
			// 	var c1 = pool.length ? pool.pop() : new FrictionEquation(bi,bj,mug*reducedMass);
			// 	var c2 = pool.length ? pool.pop() : new FrictionEquation(bi,bj,mug*reducedMass);
			// 	this.frictionEquations.push(c1, c2);

			// 	c1.bi = c2.bi = bi;
			// 	c1.bj = c2.bj = bj;
			// 	c1.minForce = c2.minForce = -mug*reducedMass;
			// 	c1.maxForce = c2.maxForce = mug*reducedMass;

			// 	// Copy over the relative vectors
			// 	c1.ri.copy(c.ri);
			// 	c1.rj.copy(c.rj);
			// 	c2.ri.copy(c.ri);
			// 	c2.rj.copy(c.rj);

			// 	// Construct tangents
			// 	c.ni.tangents(c1.t, c2.t);

	  //           // Set spook params
	  //           c1.setSpookParams(cm.frictionEquationStiffness, cm.frictionEquationRelaxation, dt);
	  //           c2.setSpookParams(cm.frictionEquationStiffness, cm.frictionEquationRelaxation, dt);

	  //           c1.enabled = c2.enabled = c.enabled;

			// 	// Add equations to solver
			// 	solver.addEquation(c1);
			// 	solver.addEquation(c2);
			// }

	        if( bi.allowSleep &&
	            bi.type === Body.DYNAMIC &&
	            bi.sleepState  === Body.SLEEPING &&
	            bj.sleepState  === Body.AWAKE &&
	            bj.type !== Body.STATIC
	        ){
	            var speedSquaredB = bj.velocity.norm2() + bj.angularVelocity.norm2();
	            var speedLimitSquaredB = Math.pow(bj.sleepSpeedLimit,2);
	            if(speedSquaredB >= speedLimitSquaredB*2){
	                bi._wakeUpAfterNarrowphase = true;
	            }
	        }

	        if( bj.allowSleep &&
	            bj.type === Body.DYNAMIC &&
	            bj.sleepState  === Body.SLEEPING &&
	            bi.sleepState  === Body.AWAKE &&
	            bi.type !== Body.STATIC
	        ){
	            var speedSquaredA = bi.velocity.norm2() + bi.angularVelocity.norm2();
	            var speedLimitSquaredA = Math.pow(bi.sleepSpeedLimit,2);
	            if(speedSquaredA >= speedLimitSquaredA*2){
	                bj._wakeUpAfterNarrowphase = true;
	            }
	        }

	        // Now we know that i and j are in contact. Set collision matrix state
			this.collisionMatrix.set(bi, bj, true);

	        if (!this.collisionMatrixPrevious.get(bi, bj)) {
	            // First contact!
	            // We reuse the collideEvent object, otherwise we will end up creating new objects for each new contact, even if there's no event listener attached.
	            World_step_collideEvent.body = bj;
	            World_step_collideEvent.contact = c;
	            bi.dispatchEvent(World_step_collideEvent);

	            World_step_collideEvent.body = bi;
	            bj.dispatchEvent(World_step_collideEvent);
	        }
	    }
	    if(doProfiling){
	        profile.makeContactConstraints = performance.now() - profilingStart;
	        profilingStart = performance.now();
	    }

	    // Wake up bodies
	    for(i=0; i!==N; i++){
	        var bi = bodies[i];
	        if(bi._wakeUpAfterNarrowphase){
	            bi.wakeUp();
	            bi._wakeUpAfterNarrowphase = false;
	        }
	    }

	    // Add user-added constraints
	    var Nconstraints = constraints.length;
	    for(i=0; i!==Nconstraints; i++){
	        var c = constraints[i];
	        c.update();
	        for(var j=0, Neq=c.equations.length; j!==Neq; j++){
	            var eq = c.equations[j];
	            solver.addEquation(eq);
	        }
	    }

	    // Solve the constrained system
	    solver.solve(dt,this);

	    if(doProfiling){
	        profile.solve = performance.now() - profilingStart;
	    }

	    // Remove all contacts from solver
	    solver.removeAllEquations();

	    // Apply damping, see http://code.google.com/p/bullet/issues/detail?id=74 for details
	    var pow = Math.pow;
	    for(i=0; i!==N; i++){
	        var bi = bodies[i];
	        if(bi.type & DYNAMIC){ // Only for dynamic bodies
	            var ld = pow(1.0 - bi.linearDamping,dt);
	            var v = bi.velocity;
	            v.mult(ld,v);
	            var av = bi.angularVelocity;
	            if(av){
	                var ad = pow(1.0 - bi.angularDamping,dt);
	                av.mult(ad,av);
	            }
	        }
	    }

	    this.dispatchEvent(World_step_preStepEvent);

	    // Invoke pre-step callbacks
	    for(i=0; i!==N; i++){
	        var bi = bodies[i];
	        if(bi.preStep){
	            bi.preStep.call(bi);
	        }
	    }

	    // Leap frog
	    // vnew = v + h*f/m
	    // xnew = x + h*vnew
	    if(doProfiling){
	        profilingStart = performance.now();
	    }
	    var w = World_step_step_w;
	    var wq = World_step_step_wq;
	    var stepnumber = this.stepnumber;
	    var DYNAMIC_OR_KINEMATIC = Body.DYNAMIC | Body.KINEMATIC;
	    var quatNormalize = stepnumber % (this.quatNormalizeSkip+1) === 0;
	    var quatNormalizeFast = this.quatNormalizeFast;
	    var half_dt = dt * 0.5;
	    Shape.types.PLANE;
	        Shape.types.CONVEXPOLYHEDRON;

	    for(i=0; i!==N; i++){
	        var b = bodies[i],
	            force = b.force,
	            tau = b.torque;
	        if((b.type & DYNAMIC_OR_KINEMATIC) && b.sleepState !== Body.SLEEPING){ // Only for dynamic
	            var velo = b.velocity,
	                angularVelo = b.angularVelocity,
	                pos = b.position,
	                quat = b.quaternion,
	                invMass = b.invMass,
	                invInertia = b.invInertiaWorld;

	            velo.x += force.x * invMass * dt;
	            velo.y += force.y * invMass * dt;
	            velo.z += force.z * invMass * dt;

	            if(b.angularVelocity){
	                invInertia.vmult(tau,invI_tau_dt);
	                invI_tau_dt.mult(dt,invI_tau_dt);
	                invI_tau_dt.vadd(angularVelo,angularVelo);
	            }

	            // Use new velocity  - leap frog
	            pos.x += velo.x * dt;
	            pos.y += velo.y * dt;
	            pos.z += velo.z * dt;

	            if(b.angularVelocity){
	                w.set(angularVelo.x, angularVelo.y, angularVelo.z, 0);
	                w.mult(quat,wq);
	                quat.x += half_dt * wq.x;
	                quat.y += half_dt * wq.y;
	                quat.z += half_dt * wq.z;
	                quat.w += half_dt * wq.w;
	                if(quatNormalize){
	                    if(quatNormalizeFast){
	                        quat.normalizeFast();
	                    } else {
	                        quat.normalize();
	                    }
	                }
	            }

	            if(b.aabb){
	                b.aabbNeedsUpdate = true;
	            }

	            // Update world inertia
	            if(b.updateInertiaWorld){
	                b.updateInertiaWorld();
	            }
	        }
	    }
	    this.clearForces();

	    this.broadphase.dirty = true;

	    if(doProfiling){
	        profile.integrate = performance.now() - profilingStart;
	    }

	    // Update world time
	    this.time += dt;
	    this.stepnumber += 1;

	    this.dispatchEvent(World_step_postStepEvent);

	    // Invoke post-step callbacks
	    for(i=0; i!==N; i++){
	        var bi = bodies[i];
	        var postStep = bi.postStep;
	        if(postStep){
	            postStep.call(bi);
	        }
	    }

	    // Sleeping update
	    if(this.allowSleep){
	        for(i=0; i!==N; i++){
	            bodies[i].sleepTick(this.time);
	        }
	    }
	};

	/**
	 * Sets all body forces in the world to zero.
	 * @method clearForces
	 */
	World.prototype.clearForces = function(){
	    var bodies = this.bodies;
	    var N = bodies.length;
	    for(var i=0; i !== N; i++){
	        var b = bodies[i];
	            b.force;
	            b.torque;

	        b.force.set(0,0,0);
	        b.torque.set(0,0,0);
	    }
	};

	},{"../collision/AABB":3,"../collision/ArrayCollisionMatrix":4,"../collision/NaiveBroadphase":7,"../collision/Ray":9,"../collision/RaycastResult":10,"../equations/ContactEquation":19,"../equations/FrictionEquation":21,"../material/ContactMaterial":24,"../material/Material":25,"../math/Quaternion":28,"../math/Vec3":30,"../objects/Body":31,"../shapes/Shape":43,"../solver/GSSolver":46,"../utils/EventTarget":49,"../utils/TupleDictionary":52,"../utils/Vec3Pool":54,"./Narrowphase":55}]},{},[2])
	(2)
	}); 
} (cannon));

var cannonExports = cannon.exports;

class CannonPhysicsEngine extends PhysicsEngine {
    constructor(options) {
        super(options);
        this.cannonPhysicsEngineOptions = options;
        this.cannonPhysicsEngineOptions.dt = this.cannonPhysicsEngineOptions.dt || (1 / 60);
        let world = this.world = new cannonExports.World();
        world.quatNormalizeSkip = 0;
        world.quatNormalizeFast = false;
        world.gravity.set(0, -10, 0);
        world.broadphase = new cannonExports.NaiveBroadphase();
    }
    step(dt, objectFilter) {
        this.world.step(dt || this.cannonPhysicsEngineOptions.dt);
    }
    addSphere(radius, mass) {
        let shape = new cannonExports.Sphere(radius);
        let body = new cannonExports.Body({ mass, shape });
        body.position.set(0, 0, 0);
        this.world.addBody(body);
        return body;
    }
    addBox(x, y, z, mass, friction) {
        let shape = new cannonExports.Box(new cannonExports.Vec3(x, y, z));
        let options = { mass, shape };
        if (friction !== undefined)
            options.material = new cannonExports.Material('material');
        let body = new cannonExports.Body(options);
        body.position.set(0, 0, 0);
        this.world.addBody(body);
        return body;
    }
    addCylinder(radiusTop, radiusBottom, height, numSegments, mass) {
        let shape = new cannonExports.Cylinder(radiusTop, radiusBottom, height, numSegments);
        let body = new cannonExports.Body({ mass, shape });
        this.world.addBody(body);
        return body;
    }
    removeObject(obj) {
        this.world.remove(obj);
    }
}

class ThreeVector extends Serializable {
    netScheme() {
        return {
            x: { type: BaseTypes$1.Float32 },
            y: { type: BaseTypes$1.Float32 },
            z: { type: BaseTypes$1.Float32 }
        };
    }
    constructor(x, y, z) {
        super();
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }
    toString() {
        function round3(x) { return Math.round(x * 1000) / 1000; }
        return `[${round3(this.x)}, ${round3(this.y)}, ${round3(this.z)}]`;
    }
    multiplyScalar(s) {
        this.x *= s;
        this.y *= s;
        this.z *= s;
        return this;
    }
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
    add(other) {
        this.x += other.x;
        this.y += other.y;
        this.z += other.z;
        return this;
    }
    subtract(other) {
        this.x -= other.x;
        this.y -= other.y;
        this.z -= other.z;
        return this;
    }
    normalize() {
        this.multiplyScalar(1 / this.length());
        return this;
    }
    copy(sourceObj) {
        this.x = sourceObj.x;
        this.y = sourceObj.y;
        this.z = sourceObj.z;
        return this;
    }
    set(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }
    clone() {
        return new ThreeVector(this.x, this.y, this.z);
    }
    lerp(target, p) {
        this.x += (target.x - this.x) * p;
        this.y += (target.y - this.y) * p;
        this.z += (target.z - this.z) * p;
        return this;
    }
    getBendingDelta(target, options) {
        let increment = target.clone();
        increment.subtract(this);
        increment.multiplyScalar(options.percent);
        if ((options.max && increment.length() > options.max) ||
            (options.max && increment.length() < options.min)) {
            return new ThreeVector(0, 0, 0);
        }
        increment.multiplyScalar(1 / options.increments);
        return increment;
    }
}

const MAX_DEL_THETA = 0.2;
class Quaternion extends Serializable {
    netScheme() {
        return {
            w: { type: BaseTypes$1.Float32 },
            x: { type: BaseTypes$1.Float32 },
            y: { type: BaseTypes$1.Float32 },
            z: { type: BaseTypes$1.Float32 }
        };
    }
    constructor(w, x, y, z) {
        super();
        this.w = w;
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }
    toString() {
        function round3(x) { return Math.round(x * 1000) / 1000; }
        {
            let axisAngle = this.toAxisAngle();
            return `[${round3(axisAngle.angle)},${axisAngle.axis.toString()}]`;
        }
    }
    copy(sourceObj) {
        this.set(sourceObj.w, sourceObj.x, sourceObj.y, sourceObj.z);
        return this;
    }
    set(w, x, y, z) {
        this.w = w;
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }
    toAxisAngle() {
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
        }
        else {
            l = 1 / l;
            this.x *= l;
            this.y *= l;
            this.z *= l;
            this.w *= l;
        }
        return this;
    }
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
    conjugate() {
        this.x *= -1;
        this.y *= -1;
        this.z *= -1;
        return this;
    }
    multiply(other) {
        let aw = this.w, ax = this.x, ay = this.y, az = this.z;
        let bw = other.w, bx = other.x, by = other.y, bz = other.z;
        this.x = ax * bw + aw * bx + ay * bz - az * by;
        this.y = ay * bw + aw * by + az * bx - ax * bz;
        this.z = az * bw + aw * bz + ax * by - ay * bx;
        this.w = aw * bw - ax * bx - ay * by - az * bz;
        return this;
    }
    slerp(target, bending) {
        if (bending <= 0)
            return this;
        if (bending >= 1)
            return this.copy(target);
        let aw = this.w, ax = this.x, ay = this.y, az = this.z;
        let bw = target.w, bx = target.x, by = target.y, bz = target.z;
        let cosHalfTheta = aw * bw + ax * bx + ay * by + az * bz;
        if (cosHalfTheta < 0) {
            this.set(-bw, -bx, -by, -bz);
            cosHalfTheta = -cosHalfTheta;
        }
        else {
            this.copy(target);
        }
        if (cosHalfTheta >= 1.0) {
            this.set(aw, ax, ay, az);
            return this;
        }
        let sqrSinHalfTheta = 1.0 - cosHalfTheta * cosHalfTheta;
        if (sqrSinHalfTheta < Number.EPSILON) {
            let s = 1 - bending;
            this.set(s * aw + bending * this.w, s * ax + bending * this.x, s * ay + bending * this.y, s * az + bending * this.z);
            return this.normalize();
        }
        let sinHalfTheta = Math.sqrt(sqrSinHalfTheta);
        let halfTheta = Math.atan2(sinHalfTheta, cosHalfTheta);
        let delTheta = bending * halfTheta;
        if (Math.abs(delTheta) > MAX_DEL_THETA)
            delTheta = MAX_DEL_THETA * Math.sign(delTheta);
        let ratioA = Math.sin(halfTheta - delTheta) / sinHalfTheta;
        let ratioB = Math.sin(delTheta) / sinHalfTheta;
        this.set(aw * ratioA + this.w * ratioB, ax * ratioA + this.x * ratioB, ay * ratioA + this.y * ratioB, az * ratioA + this.z * ratioB);
        return this;
    }
}

class GameObject extends Serializable {
    netScheme() {
        return {
            id: { type: BaseTypes$1.Float32 },
            playerId: { type: BaseTypes$1.Int16 }
        };
    }
    constructor(gameEngine, options, props) {
        super();
        this.gameEngine = gameEngine;
        this.id = null;
        if (options && options.id)
            this.id = options.id;
        else if (this.gameEngine)
            this.id = this.gameEngine.world.getNewId();
        this.playerId = (props && props.playerId) ? props.playerId : 0;
        this.components = {};
    }
    onAddToWorld(gameEngine) { }
    onRemoveFromWorld(gameEngine) { }
    toString() {
        return `game-object[${this.id}]`;
    }
    bendingToString() {
        return 'no bending';
    }
    saveState(other) {
        var _a;
        this.savedCopy = (new this.constructor(this.gameEngine, { id: null }));
        (_a = this.savedCopy) === null || _a === void 0 ? void 0 : _a.syncTo(other ? other : this);
    }
    get bending() {
        return {};
    }
    bendToCurrentState(bending, worldSettings, isLocal, bendingIncrements) {
        if (this.savedCopy) {
            this.bendToCurrent(this.savedCopy, bending, worldSettings, isLocal, bendingIncrements);
        }
        this.savedCopy = null;
    }
    bendToCurrent(original, bending, worldSettings, isLocal, bendingIncrements) {
    }
    syncTo(other) {
        super.syncTo(other);
        this.playerId = other.playerId;
    }
    refreshToPhysics() { }
    refreshFromPhysics() { }
    applyIncrementalBending(stepDesc) { }
    destroy() { }
    addComponent(componentInstance) {
        componentInstance.parentObject = this;
        this.components[componentInstance.constructor.name] = componentInstance;
        if (this.gameEngine) {
            this.gameEngine.emit('componentAdded', this, componentInstance);
        }
    }
    removeComponent(componentName) {
        delete this.components[componentName];
        if (this.gameEngine) {
            this.gameEngine.emit('componentRemoved', this, componentName);
        }
    }
    hasComponent(componentClass) {
        return componentClass.name in this.components;
    }
    getComponent(componentClass) {
        return this.components[componentClass.name];
    }
}

class MathUtils {
    static interpolate(start, end, percent) {
        return (end - start) * percent + start;
    }
    static interpolateDelta(start, end, percent) {
        return (end - start) * percent;
    }
    static interpolateDeltaWithWrapping(start, end, percent, wrapMin, wrapMax) {
        let wrapTest = wrapMax - wrapMin;
        if (start - end > wrapTest / 2)
            end += wrapTest;
        else if (end - start > wrapTest / 2)
            start += wrapTest;
        if (Math.abs(start - end) > wrapTest / 3) {
            console.log('wrap interpolation is close to limit.  Not sure which edge to wrap to.');
        }
        return (end - start) * percent;
    }
    static interpolateWithWrapping(start, end, percent, wrapMin, wrapMax) {
        let interpolatedVal = start + this.interpolateDeltaWithWrapping(start, end, percent, wrapMin, wrapMax);
        let wrapLength = wrapMax - wrapMin;
        if (interpolatedVal >= wrapLength)
            interpolatedVal -= wrapLength;
        if (interpolatedVal < 0)
            interpolatedVal += wrapLength;
        return interpolatedVal;
    }
}

class DynamicObject extends GameObject {
    netScheme() {
        return Object.assign({
            position: { type: BaseTypes$1.ClassInstance },
            width: { type: BaseTypes$1.Int16 },
            height: { type: BaseTypes$1.Int16 },
            isStatic: { type: BaseTypes$1.UInt8 },
            velocity: { type: BaseTypes$1.ClassInstance },
            angle: { type: BaseTypes$1.Float32 }
        }, super.netScheme());
    }
    constructor(gameEngine, options, props) {
        super(gameEngine, options, props);
        this.bendingIncrements = 0;
        this.position = new TwoVector(0, 0);
        this.velocity = new TwoVector(0, 0);
        this.width = (props && props.width) ? props.width : 1;
        this.height = (props && props.height) ? props.height : 1;
        this.isStatic = (props && props.isStatic) ? props.isStatic : 0;
        this.friction = new TwoVector(1, 1);
        if (props && props.position)
            this.position.copy(props.position);
        if (props && props.velocity)
            this.velocity.copy(props.velocity);
        this.angle = 90;
        this.isRotatingLeft = false;
        this.isRotatingRight = false;
        this.isAccelerating = false;
        this.rotationSpeed = 2.5;
        this.acceleration = 0.1;
        this.deceleration = 0.99;
    }
    get x() { return this.position.x; }
    get y() { return this.position.y; }
    toString() {
        function round3(x) { return Math.round(x * 1000) / 1000; }
        return `${this.constructor.name}[${this.id}] player${this.playerId} Pos=${this.position} Vel=${this.velocity} angle${round3(this.angle)}`;
    }
    get bending() {
        return {};
    }
    turnRight(deltaAngle) {
        this.angle += deltaAngle;
        if (this.angle >= 360) {
            this.angle -= 360;
        }
        if (this.angle < 0) {
            this.angle += 360;
        }
        return this;
    }
    turnLeft(deltaAngle) {
        return this.turnRight(-deltaAngle);
    }
    accelerate(acceleration) {
        let rad = this.angle * (Math.PI / 180);
        let dv = new TwoVector(Math.cos(rad), Math.sin(rad));
        dv.multiplyScalar(acceleration);
        this.velocity.add(dv);
        return this;
    }
    bendingToString() {
        if (this.bendingIncrements)
            return `ΔPos=${this.bendingPositionDelta} ΔVel=${this.bendingVelocityDelta} ΔAngle=${this.bendingAngleDelta} increments=${this.bendingIncrements}`;
        return 'no bending';
    }
    get maxSpeed() { return null; }
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
        var _a, _b;
        let bending = { increments, percent };
        let positionBending = Object.assign({}, bending, (_a = this.bending) === null || _a === void 0 ? void 0 : _a.position);
        let velocityBending = Object.assign({}, bending, (_b = this.bending) === null || _b === void 0 ? void 0 : _b.velocity);
        let angleBending = Object.assign({}, bending, this.bending.angle);
        if (isLocal) {
            Object.assign(positionBending, this.bending.positionLocal);
            Object.assign(velocityBending, this.bending.velocityLocal);
            Object.assign(angleBending, this.bending.angleLocal);
        }
        this.incrementScale = percent / increments;
        this.bendingPositionDelta = original.position.getBendingDelta(this.position, positionBending);
        this.bendingVelocityDelta = original.velocity.getBendingDelta(this.velocity, velocityBending);
        this.bendingAngleDelta = MathUtils.interpolateDeltaWithWrapping(original.angle, this.angle, angleBending.percent, 0, 360) / increments;
        this.bendingTarget = new (this.constructor());
        this.bendingTarget.syncTo(this);
        this.position.copy(original.position);
        this.velocity.copy(original.velocity);
        this.angle = original.angle;
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
        return {
            min: [this.x - this.width / 2, this.y - this.height / 2],
            max: [this.x + this.width / 2, this.y + this.height / 2]
        };
    }
    collidesWith(other) {
        return true;
    }
}

class PhysicalObject2D extends GameObject {
    netScheme() {
        return Object.assign({
            mass: { type: BaseTypes$1.Float32 },
            position: { type: BaseTypes$1.ClassInstance },
            angle: { type: BaseTypes$1.Float32 },
            velocity: { type: BaseTypes$1.ClassInstance },
            angularVelocity: { type: BaseTypes$1.Float32 }
        }, super.netScheme());
    }
    constructor(gameEngine, options, props) {
        super(gameEngine, options, props);
        this.bendingIncrements = 0;
        this.position = new TwoVector(0, 0);
        this.velocity = new TwoVector(0, 0);
        this.angle = 0;
        this.angularVelocity = 0;
        this.mass = 0;
        if (props === null || props === void 0 ? void 0 : props.position)
            this.position.copy(props.position);
        if (props === null || props === void 0 ? void 0 : props.velocity)
            this.velocity.copy(props.velocity);
        if (props === null || props === void 0 ? void 0 : props.angle)
            this.angle = props.angle;
        if (props === null || props === void 0 ? void 0 : props.angularVelocity)
            this.angularVelocity = props.angularVelocity;
        if (props === null || props === void 0 ? void 0 : props.mass)
            this.mass = props.mass;
        this.class = PhysicalObject2D;
    }
    onAddToWorld() { }
    toString() {
        let p = this.position.toString();
        let v = this.velocity.toString();
        let a = this.angle;
        let av = this.angularVelocity;
        return `phyObj2D[${this.id}] player${this.playerId} Pos=${p} Vel=${v} Ang=${a} AVel=${av}`;
    }
    get bending() {
        return {};
    }
    bendingToString() {
        if (this.bendingIncrements)
            return `ΔPos=${this.bendingPositionDelta} ΔVel=${this.bendingVelocityDelta} ΔAngle=${this.bendingAngleDelta} increments=${this.bendingIncrements}`;
        return 'no bending';
    }
    bendToCurrent(original, percent, worldSettings, isLocal, increments) {
        let bending = { increments, percent };
        let positionBending = Object.assign({}, bending, this.bending.position);
        let velocityBending = Object.assign({}, bending, this.bending.velocity);
        let angleBending = Object.assign({}, bending, this.bending.angle);
        let avBending = Object.assign({}, bending, this.bending.angularVelocity);
        if (isLocal) {
            Object.assign(positionBending, this.bending.positionLocal);
            Object.assign(velocityBending, this.bending.velocityLocal);
            Object.assign(angleBending, this.bending.angleLocal);
            Object.assign(avBending, this.bending.angularVelocityLocal);
        }
        this.incrementScale = percent / increments;
        this.bendingPositionDelta = original.position.getBendingDelta(this.position, positionBending);
        this.bendingVelocityDelta = original.velocity.getBendingDelta(this.velocity, velocityBending);
        this.bendingAVDelta = (this.angularVelocity - original.angularVelocity) * this.incrementScale * avBending.percent;
        this.bendingAngleDelta = MathUtils.interpolateDeltaWithWrapping(original.angle, this.angle, angleBending.percent, 0, 2 * Math.PI) / increments;
        this.bendingTarget = new this.constructor();
        this.bendingTarget.syncTo(this);
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
        if (this.physicsObj)
            this.refreshToPhysics();
    }
    refreshFromPhysics() {
        this.copyVector(this.physicsObj.position, this.position);
        this.copyVector(this.physicsObj.velocity, this.velocity);
        this.angle = this.physicsObj.angle;
        this.angularVelocity = this.physicsObj.angularVelocity;
    }
    copyVector(source, target) {
        let sourceVec = source;
        if (typeof source[0] === 'number' && typeof source[1] === 'number')
            sourceVec = { x: source[0], y: source[1] };
        if (typeof target.copy === 'function') {
            target.copy(sourceVec);
        }
        else if (target instanceof Float32Array) {
            target[0] = sourceVec.x;
            target[1] = sourceVec.y;
        }
        else {
            target.x = sourceVec.x;
            target.y = sourceVec.y;
        }
    }
    refreshToPhysics() {
        this.copyVector(this.position, this.physicsObj.position);
        this.copyVector(this.velocity, this.physicsObj.velocity);
        this.physicsObj.angle = this.angle;
        this.physicsObj.angularVelocity = this.angularVelocity;
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
        this.angularVelocity += (this.bendingAVDelta * timeFactor);
        this.angle += (this.bendingAngleDelta * timeFactor);
        this.bendingIncrements--;
    }
    interpolate(nextObj, percent) {
        this.position.lerp(nextObj.position, percent);
        this.angle = MathUtils.interpolateDeltaWithWrapping(this.angle, nextObj.angle, percent, 0, 2 * Math.PI);
    }
}

class PhysicalObject3D extends GameObject {
    netScheme() {
        return Object.assign({
            position: { type: BaseTypes$1.ClassInstance },
            quaternion: { type: BaseTypes$1.ClassInstance },
            velocity: { type: BaseTypes$1.ClassInstance },
            angularVelocity: { type: BaseTypes$1.ClassInstance }
        }, super.netScheme());
    }
    constructor(gameEngine, options, props) {
        super(gameEngine, options, props);
        this.bendingIncrements = 0;
        this.position = new ThreeVector(0, 0, 0);
        this.velocity = new ThreeVector(0, 0, 0);
        this.quaternion = new Quaternion(1, 0, 0, 0);
        this.angularVelocity = new ThreeVector(0, 0, 0);
        if (props.position)
            this.position.copy(props.position);
        if (props.velocity)
            this.velocity.copy(props.velocity);
        if (props.quaternion)
            this.quaternion.copy(props.quaternion);
        if (props.angularVelocity)
            this.angularVelocity.copy(props.angularVelocity);
        this.class = PhysicalObject3D;
    }
    toString() {
        let p = this.position.toString();
        let v = this.velocity.toString();
        let q = this.quaternion.toString();
        let a = this.angularVelocity.toString();
        return `phyObj[${this.id}] player${this.playerId} Pos${p} Vel${v} Dir${q} AVel${a}`;
    }
    bendingToString() {
        if (this.bendingOptions)
            return `bend=${this.bendingOptions.percent} deltaPos=${this.bendingPositionDelta} deltaVel=${this.bendingVelocityDelta} deltaQuat=${this.bendingQuaternionDelta}`;
        return 'no bending';
    }
    bendToCurrent(original, percent, worldSettings, isLocal, increments) {
        let bending = { increments, percent };
        let positionBending = Object.assign({}, bending, this.bending.position);
        let velocityBending = Object.assign({}, bending, this.bending.velocity);
        if (isLocal) {
            Object.assign(positionBending, this.bending.positionLocal);
            Object.assign(velocityBending, this.bending.velocityLocal);
        }
        this.incrementScale = percent / increments;
        this.bendingPositionDelta = original.position.getBendingDelta(this.position, positionBending);
        this.bendingVelocityDelta = original.velocity.getBendingDelta(this.velocity, velocityBending);
        this.bendingAVDelta = new ThreeVector(0, 0, 0);
        this.bendingQuaternionDelta = (new Quaternion)().copy(original.quaternion).conjugate();
        this.bendingQuaternionDelta.multiply(this.quaternion);
        let axisAngle = this.bendingQuaternionDelta.toAxisAngle();
        axisAngle.angle *= this.incrementScale;
        this.bendingQuaternionDelta.setFromAxisAngle(axisAngle.axis, axisAngle.angle);
        this.bendingTarget = new this.constructor();
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
    refreshFromPhysics() {
        this.position.copy(this.physicsObj.position);
        this.quaternion.copy(this.physicsObj.quaternion);
        this.velocity.copy(this.physicsObj.velocity);
        this.angularVelocity.copy(this.physicsObj.angularVelocity);
    }
    refreshToPhysics() {
        this.physicsObj.position.copy(this.position);
        this.physicsObj.quaternion.copy(this.quaternion);
        this.physicsObj.velocity.copy(this.velocity);
        this.physicsObj.angularVelocity.copy(this.angularVelocity);
    }
    applyIncrementalBending(stepDesc) {
        if (this.bendingIncrements === 0)
            return;
        if (stepDesc && stepDesc.dt) {
            const timeFactor = stepDesc.dt / (1000 / 60);
            const posDelta = (new ThreeVector()).copy(this.bendingPositionDelta).multiplyScalar(timeFactor);
            const avDelta = (new ThreeVector()).copy(this.bendingAVDelta).multiplyScalar(timeFactor);
            this.position.add(posDelta);
            this.angularVelocity.add(avDelta);
            this.quaternion.slerp(this.bendingTarget.quaternion, this.incrementScale * timeFactor * 0.8);
        }
        else {
            this.position.add(this.bendingPositionDelta);
            this.angularVelocity.add(this.bendingAVDelta);
            this.quaternion.slerp(this.bendingTarget.quaternion, this.incrementScale);
        }
        this.bendingIncrements--;
    }
    interpolate(nextObj, percent) {
        this.position.lerp(nextObj.position, percent);
        this.quaternion.slerp(nextObj.quaternion, percent);
    }
}

var path = require$$0;
var fs = fs$1;
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
                if (path.dirname(p) === p) return cb(er);
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

var mkdirp$1 = /*@__PURE__*/getDefaultExportFromCjs(mkdirp);

const SIXTY_PER_SEC = 1000 / 60;
const LOOP_SLOW_THRESH = 0.3;
const LOOP_SLOW_COUNT = 10;
class Scheduler {
    constructor(options) {
        this.options = Object.assign({
            tick: null,
            period: SIXTY_PER_SEC,
            delay: SIXTY_PER_SEC / 3
        }, options);
        this.nextExecTime = 0;
        this.requestedDelay = 0;
        this.delayCounter = 0;
        let eventEmitter = EventEmitter$4();
        this.on = eventEmitter.on;
        this.once = eventEmitter.once;
        this.emit = eventEmitter.emit;
    }
    nextTickChecker() {
        let currentTime = (new Date()).getTime();
        if (currentTime > this.nextExecTime) {
            this.delayCounter++;
            this.callTick();
            this.nextExecTime = currentTime + this.options.period;
        }
        window.requestAnimationFrame(this.nextTickChecker.bind(this));
    }
    nextTick() {
        let stepStartTime = (new Date()).getTime();
        if (stepStartTime > this.nextExecTime + this.options.period * LOOP_SLOW_THRESH) {
            this.delayCounter++;
        }
        else
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
    start() {
        setTimeout(this.nextTick.bind(this));
        if (typeof window === 'object' && typeof window.requestAnimationFrame === 'function')
            window.requestAnimationFrame(this.nextTickChecker.bind(this));
        return this;
    }
    delayTick() {
        this.requestedDelay += this.options.delay;
    }
    hurryTick() {
        this.requestedDelay -= this.options.delay;
    }
}

const MAX_UINT_16 = 0xFFFF;
class Serializer {
    constructor() {
        this.registeredClasses = {};
        this.customTypes = {};
        this.registerClass(TwoVector);
        this.registerClass(ThreeVector);
        this.registerClass(Quaternion);
    }
    addCustomType(customType) {
        this.customTypes[customType.type] = customType;
    }
    static typeCanAssign(type) {
        return type !== BaseTypes$1.ClassInstance && type !== BaseTypes$1.List;
    }
    registerClass(classObj, classId) {
        classId = classId ? classId : Utils.hashStr(classObj.name);
        if (this.registeredClasses[classId]) {
            console.error(`Serializer: accidental override of classId ${classId} when registering class`, classObj);
        }
        this.registeredClasses[classId] = classObj;
    }
    deserialize(dataBuffer, byteOffset = 0) {
        let localByteOffset = 0;
        let dataView = new DataView(dataBuffer);
        let objectClassId = dataView.getUint8(byteOffset + localByteOffset);
        let objectClass = this.registeredClasses[objectClassId];
        if (objectClass == null) {
            console.error('Serializer: Found a class which was not registered.  Please use serializer.registerClass() to register all serialized classes.');
        }
        localByteOffset += Uint8Array.BYTES_PER_ELEMENT;
        let obj = new objectClass(null, {}, {});
        for (let property of Object.keys(obj.netScheme()).sort()) {
            let read = this.readDataView(dataView, byteOffset + localByteOffset, obj.netScheme()[property]);
            obj[property] = read.data;
            localByteOffset += read.bufferSize;
        }
        return { obj, byteOffset: localByteOffset };
    }
    writeDataView(dataView, value, bufferOffset, netSchemProp) {
        if (netSchemProp.type === BaseTypes$1.Float32) {
            dataView.setFloat32(bufferOffset, value);
        }
        else if (netSchemProp.type === BaseTypes$1.Int32) {
            dataView.setInt32(bufferOffset, value);
        }
        else if (netSchemProp.type === BaseTypes$1.Int16) {
            dataView.setInt16(bufferOffset, value);
        }
        else if (netSchemProp.type === BaseTypes$1.Int8) {
            dataView.setInt8(bufferOffset, value);
        }
        else if (netSchemProp.type === BaseTypes$1.UInt8) {
            dataView.setUint8(bufferOffset, value);
        }
        else if (netSchemProp.type === BaseTypes$1.String) {
            if (value === null) {
                dataView.setUint16(bufferOffset, MAX_UINT_16);
            }
            else {
                let strLen = value.length;
                dataView.setUint16(bufferOffset, strLen);
                let localBufferOffset = 2;
                for (let i = 0; i < strLen; i++)
                    dataView.setUint16(bufferOffset + localBufferOffset + i * 2, value.charCodeAt(i));
            }
        }
        else if (netSchemProp.type === BaseTypes$1.ClassInstance) {
            value.serialize(this, {
                dataBuffer: dataView.buffer,
                bufferOffset: bufferOffset
            });
        }
        else if (netSchemProp.type === BaseTypes$1.List) {
            let localBufferOffset = 0;
            dataView.setUint16(bufferOffset + localBufferOffset, value.length);
            localBufferOffset += Uint16Array.BYTES_PER_ELEMENT;
            for (let item of value) {
                if (netSchemProp.itemType === BaseTypes$1.ClassInstance) {
                    let serializedObj = item.serialize(this, {
                        dataBuffer: dataView.buffer,
                        bufferOffset: bufferOffset + localBufferOffset
                    });
                    localBufferOffset += serializedObj.bufferOffset;
                }
                else if (netSchemProp.itemType === BaseTypes$1.String) {
                    if (item === null) {
                        dataView.setUint16(bufferOffset + localBufferOffset, MAX_UINT_16);
                        localBufferOffset += Uint16Array.BYTES_PER_ELEMENT;
                    }
                    else {
                        let strLen = item.length;
                        dataView.setUint16(bufferOffset + localBufferOffset, strLen);
                        localBufferOffset += Uint16Array.BYTES_PER_ELEMENT;
                        for (let i = 0; i < strLen; i++)
                            dataView.setUint16(bufferOffset + localBufferOffset + i * 2, item.charCodeAt(i));
                        localBufferOffset += Uint16Array.BYTES_PER_ELEMENT * strLen;
                    }
                }
                else {
                    this.writeDataView(dataView, item, bufferOffset + localBufferOffset, { type: netSchemProp.itemType });
                    localBufferOffset += this.getTypeByteSize(netSchemProp.itemType);
                }
            }
        }
        else if (this.customTypes[netSchemProp.type]) {
            this.customTypes[netSchemProp.type].writeDataView(dataView, value, bufferOffset);
        }
        else {
            console.error(`No custom property ${netSchemProp.type} found!`);
        }
    }
    readDataView(dataView, bufferOffset, netSchemProp) {
        let data, bufferSize;
        if (netSchemProp.type === BaseTypes$1.Float32) {
            data = dataView.getFloat32(bufferOffset);
            bufferSize = this.getTypeByteSize(netSchemProp.type);
        }
        else if (netSchemProp.type === BaseTypes$1.Int32) {
            data = dataView.getInt32(bufferOffset);
            bufferSize = this.getTypeByteSize(netSchemProp.type);
        }
        else if (netSchemProp.type === BaseTypes$1.Int16) {
            data = dataView.getInt16(bufferOffset);
            bufferSize = this.getTypeByteSize(netSchemProp.type);
        }
        else if (netSchemProp.type === BaseTypes$1.Int8) {
            data = dataView.getInt8(bufferOffset);
            bufferSize = this.getTypeByteSize(netSchemProp.type);
        }
        else if (netSchemProp.type === BaseTypes$1.UInt8) {
            data = dataView.getUint8(bufferOffset);
            bufferSize = this.getTypeByteSize(netSchemProp.type);
        }
        else if (netSchemProp.type === BaseTypes$1.String) {
            let length = dataView.getUint16(bufferOffset);
            let localBufferOffset = Uint16Array.BYTES_PER_ELEMENT;
            bufferSize = localBufferOffset;
            if (length === MAX_UINT_16) {
                data = null;
            }
            else {
                let a = [];
                for (let i = 0; i < length; i++)
                    a[i] = dataView.getUint16(bufferOffset + localBufferOffset + i * 2);
                data = String.fromCharCode.apply(null, a);
                bufferSize += length * Uint16Array.BYTES_PER_ELEMENT;
            }
        }
        else if (netSchemProp.type === BaseTypes$1.ClassInstance) {
            var deserializeData = this.deserialize(dataView.buffer, bufferOffset);
            data = deserializeData.obj;
            bufferSize = deserializeData.byteOffset;
        }
        else if (netSchemProp.type === BaseTypes$1.List) {
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
        }
        else if (this.customTypes[netSchemProp.type] != null) {
            data = this.customTypes[netSchemProp.type].readDataView(dataView, bufferOffset);
        }
        else {
            console.error(`No custom property ${netSchemProp.type} found!`);
        }
        return { data: data, bufferSize: bufferSize };
    }
    getTypeByteSize(type) {
        switch (type) {
            case BaseTypes$1.Float32: {
                return Float32Array.BYTES_PER_ELEMENT;
            }
            case BaseTypes$1.Int32: {
                return Int32Array.BYTES_PER_ELEMENT;
            }
            case BaseTypes$1.Int16: {
                return Int16Array.BYTES_PER_ELEMENT;
            }
            case BaseTypes$1.Int8: {
                return Int8Array.BYTES_PER_ELEMENT;
            }
            case BaseTypes$1.UInt8: {
                return Uint8Array.BYTES_PER_ELEMENT;
            }
            default: {
                if (type === undefined) {
                    throw 'netScheme property declared without type attribute!';
                }
                else if (this.customTypes[type] === null) {
                    throw `netScheme property ${type} undefined! Did you forget to add it to the serializer?`;
                }
                else {
                    return this.customTypes[type].BYTES_PER_ELEMENT;
                }
            }
        }
    }
}

class NetworkedEventCollection extends Serializable {
    netScheme() {
        return {
            events: {
                type: BaseTypes$1.List,
                itemType: BaseTypes$1.ClassInstance
            },
        };
    }
    constructor(events) {
        super();
        this.events = events;
    }
}

class ObjectUpdate extends Serializable {
    netScheme() {
        return {
            stepCount: { type: BaseTypes$1.Int32 },
            objectInstance: { type: BaseTypes$1.ClassInstance }
        };
    }
    constructor(stepCount, objectInstance) {
        super();
        this.stepCount = stepCount;
        this.objectInstance = objectInstance;
    }
}
class ObjectCreate extends Serializable {
    netScheme() {
        return {
            stepCount: { type: BaseTypes$1.Int32 },
            objectInstance: { type: BaseTypes$1.ClassInstance }
        };
    }
    constructor(stepCount, objectInstance) {
        super();
        this.stepCount = stepCount;
        this.objectInstance = objectInstance;
    }
}
class ObjectDestroy extends Serializable {
    netScheme() {
        return {
            stepCount: { type: BaseTypes$1.Int32 },
            objectInstance: { type: BaseTypes$1.ClassInstance }
        };
    }
    constructor(stepCount, objectInstance) {
        super();
        this.stepCount = stepCount;
        this.objectInstance = objectInstance;
    }
}
class SyncHeader extends Serializable {
    netScheme() {
        return {
            stepCount: { type: BaseTypes$1.Int32 },
            fullUpdate: { type: BaseTypes$1.Int8 }
        };
    }
    constructor(stepCount, fullUpdate) {
        super();
        this.stepCount = stepCount;
        this.fullUpdate = fullUpdate;
    }
}
class NetworkTransmitter {
    constructor(serializer) {
        this.serializer = serializer;
        this.serializer.registerClass(NetworkedEventCollection);
        this.serializer.registerClass(ObjectUpdate);
        this.serializer.registerClass(ObjectCreate);
        this.serializer.registerClass(ObjectDestroy);
        this.serializer.registerClass(SyncHeader);
        this.networkedEventCollection = new NetworkedEventCollection([]);
    }
    sendUpdate(stepCount, obj) {
        this.networkedEventCollection.events.push(new ObjectUpdate(stepCount, obj));
    }
    sendCreate(stepCount, obj) {
        this.networkedEventCollection.events.push(new ObjectCreate(stepCount, obj));
    }
    sendDestroy(stepCount, obj) {
        this.networkedEventCollection.events.push(new ObjectDestroy(stepCount, obj));
    }
    syncHeader(stepCount, fullUpdate) {
        this.networkedEventCollection.events.push(new SyncHeader(stepCount, fullUpdate));
    }
    serializePayload() {
        if (this.networkedEventCollection.events.length === 0)
            return null;
        let dataBuffer = this.networkedEventCollection.serialize(this.serializer, { dry: false, dataBuffer: null, bufferOffset: 0 });
        return dataBuffer;
    }
    deserializePayload(payload) {
        return this.serializer.deserialize(payload.dataBuffer, 0).obj;
    }
    clearPayload() {
        this.networkedEventCollection.events = [];
    }
    static getNetworkEvent(event) {
        if (event instanceof ObjectUpdate)
            return 'objectUpdate';
        else if (event instanceof ObjectCreate)
            return 'objectCreate';
        else if (event instanceof ObjectDestroy)
            return 'objectDestroy';
        else if (event instanceof SyncHeader)
            return 'syncHeader';
        return 'unknown';
    }
}

class NetworkMonitor {
    constructor() {
        let eventEmitter = EventEmitter$4();
        this.on = eventEmitter.on;
        this.once = eventEmitter.once;
        this.emit = eventEmitter.emit;
    }
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
    registerPlayerOnServer(socket) {
        socket.on('RTTQuery', this.respondToRTTQuery.bind(this, socket));
    }
    respondToRTTQuery(socket, queryId) {
        socket.emit('RTTResponse', queryId);
    }
}

class ServerEngine {
    constructor(io, gameEngine, options) {
        this.options = Object.assign({
            updateRate: 6,
            stepRate: 60,
            fullSyncRate: 20,
            timeoutInterval: 180,
            updateOnObjectCreation: true,
            tracesPath: '',
            countConnections: false,
            debug: {
                serverSendLag: false
            }
        }, options);
        if (this.options.tracesPath !== '') {
            this.options.tracesPath += '/';
            mkdirp$1.sync(this.options.tracesPath);
        }
        this.io = io;
        this.serializer = new Serializer();
        this.gameEngine = gameEngine;
        this.gameEngine.registerClasses(this.serializer);
        this.networkTransmitter = new NetworkTransmitter(this.serializer);
        this.networkMonitor = new NetworkMonitor();
        this.rooms = {};
        this.createRoom(ServerEngine.DEFAULT_ROOM_NAME);
        this.connectedPlayers = {};
        this.playerInputQueues = {};
        this.objMemory = {};
        io.on('connection', this.onPlayerConnected.bind(this));
        this.gameEngine.on('objectAdded', this.onObjectAdded.bind(this));
        this.gameEngine.on('objectDestroyed', this.onObjectDestroyed.bind(this));
        return this;
    }
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
    step() {
        this.gameEngine.trace.setStep(this.gameEngine.world.stepCount + 1);
        this.gameEngine.emit('server__preStep', this.gameEngine.world.stepCount + 1);
        this.serverTime = (new Date().getTime());
        for (let playerIdStr of Object.keys(this.playerInputQueues)) {
            let playerId = Number(playerIdStr);
            let inputQueue = this.playerInputQueues[playerId];
            let queueSteps = Object.keys(inputQueue);
            let minStep = Math.min.apply(null, queueSteps);
            if (queueSteps.length > 0 && minStep <= this.gameEngine.world.stepCount) {
                inputQueue[minStep].forEach(input => {
                    this.gameEngine.emit('server__processInput', { input, playerId });
                    this.gameEngine.emit('processInput', { input, playerId });
                    this.gameEngine.processInput(input, playerId, true);
                });
                delete inputQueue[minStep];
            }
        }
        this.gameEngine.step(false, this.serverTime / 1000);
        Object.keys(this.rooms).map(this.syncStateToClients.bind(this));
        for (let objId of Object.keys(this.objMemory)) {
            if (!(objId in this.gameEngine.world.objects)) {
                delete this.objMemory[objId];
            }
        }
        this.gameEngine.emit('server__postStep', this.gameEngine.world.stepCount);
        if (this.gameEngine.trace.length) {
            let traceData = this.gameEngine.trace.rotate();
            let traceString = '';
            traceData.forEach(t => { traceString += `[${t.time.toISOString()}]${t.step}>${t.data}\n`; });
            fs$1.appendFile(`${this.options.tracesPath}server.trace`, traceString, err => { if (err)
                throw err; });
        }
    }
    syncStateToClients(roomName) {
        const room = this.rooms[roomName];
        if (room.requestImmediateSync ||
            this.gameEngine.world.stepCount % this.options.updateRate === 0) {
            const roomPlayers = Object.keys(this.connectedPlayers)
                .filter(p => this.connectedPlayers[p].roomName === roomName);
            let diffUpdate = true;
            for (const socketId of roomPlayers) {
                const player = this.connectedPlayers[socketId];
                if (player.state === 'new') {
                    player.state = 'synced';
                    diffUpdate = false;
                }
            }
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
    serializeUpdate(roomName, options) {
        let world = this.gameEngine.world;
        let diffUpdate = Boolean(options && options.diffUpdate);
        this.networkTransmitter.syncHeader(world.stepCount, Number(!diffUpdate));
        const roomObjects = Object.keys(world.objects)
            .filter(o => world.objects[o]._roomName === roomName);
        for (let objId of roomObjects) {
            let obj = world.objects[objId];
            let prevObject = this.objMemory[objId];
            if (diffUpdate) {
                let s = obj.serialize(this.serializer);
                if (prevObject && Utils.arrayBuffersEqual(s.dataBuffer, prevObject))
                    continue;
                else
                    this.objMemory[objId] = s.dataBuffer;
                obj = obj.prunedStringsClone(this.serializer, prevObject);
            }
            this.networkTransmitter.sendUpdate(world.stepCount, obj);
        }
        return this.networkTransmitter.serializePayload();
    }
    createRoom(roomName) {
        this.rooms[roomName] = { syncCounter: 0, requestImmediateSync: false, requestFullSync: false };
    }
    assignObjectToRoom(obj, roomName) {
        obj._roomName = roomName;
    }
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
            return;
        }
        const roomUpdate = { playerId: playerId, from: player.roomName, to: roomName };
        player.socket.emit('roomUpdate', roomUpdate);
        this.gameEngine.emit('server__roomUpdate', roomUpdate);
        this.gameEngine.trace.info(() => `ROOM UPDATE: playerId ${playerId} from room ${roomUpdate.from} to room ${roomName}`);
        player.roomName = roomName;
        room.requestImmediateSync = true;
        room.requestFullSync = true;
    }
    onObjectAdded(obj) {
        obj._roomName = obj._roomName || ServerEngine.DEFAULT_ROOM_NAME;
        this.networkTransmitter.sendCreate(this.gameEngine.world.stepCount, obj);
        if (this.options.updateOnObjectCreation) {
            this.rooms[obj._roomName].requestImmediateSync = true;
        }
    }
    onObjectDestroyed(obj) {
        this.networkTransmitter.sendDestroy(this.gameEngine.world.stepCount, obj);
    }
    getPlayerId(socket) {
        return NaN;
    }
    onPlayerConnected(socket) {
        let that = this;
        console.log('Client connected');
        this.connectedPlayers[socket.id] = {
            socket: socket,
            state: 'new',
            roomName: ServerEngine.DEFAULT_ROOM_NAME
        };
        let playerId = this.getPlayerId(socket);
        if (isNaN(playerId)) {
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
        socket.on('disconnect', function () {
            playerEvent.disconnectTime = (new Date()).getTime();
            that.onPlayerDisconnected(socket.id, playerId);
            that.gameEngine.emit('server__playerDisconnected', playerEvent);
            that.gameEngine.emit('playerDisconnected', playerEvent);
        });
        socket.on('move', function (data) {
            that.onReceivedInput(data, socket);
        });
        socket.on('trace', function (traceData) {
            traceData = JSON.parse(traceData);
            let traceString = '';
            traceData.forEach(t => { traceString += `[${t.time}]${t.step}>${t.data}\n`; });
            fs$1.appendFile(`${that.options.tracesPath}client.${playerId}.trace`, traceString, err => { if (err)
                throw err; });
        });
        this.networkMonitor.registerPlayerOnServer(socket);
    }
    onPlayerTimeout(socket) {
        console.log(`Client timed out after ${this.options.timeoutInterval} seconds`, socket.id);
        socket.disconnect();
    }
    onPlayerDisconnected(socketId, playerId) {
        delete this.connectedPlayers[socketId];
        console.log('Client disconnected');
    }
    resetIdleTimeout(socket) {
        if (socket.idleTimeout)
            clearTimeout(socket.idleTimeout);
        if (this.options.timeoutInterval > 0) {
            socket.idleTimeout = setTimeout(() => {
                this.onPlayerTimeout(socket);
            }, this.options.timeoutInterval * 1000);
        }
    }
    queueInputForPlayer(data, playerId) {
        if (!this.playerInputQueues.hasOwnProperty(playerId))
            this.playerInputQueues[playerId] = {};
        let queue = this.playerInputQueues[playerId];
        if (!queue[data.step])
            queue[data.step] = [];
        queue[data.step].push(data);
    }
    onReceivedInput(data, socket) {
        if (this.connectedPlayers[socket.id]) {
            this.connectedPlayers[socket.id].socket.lastHandledInput = data.messageIndex;
        }
        this.resetIdleTimeout(socket);
        this.queueInputForPlayer(data, socket.playerId);
    }
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
ServerEngine.DEFAULT_ROOM_NAME = '/lobby';

var lib = {
    Trace
};

export { BaseTypes$1 as BaseTypes, CannonPhysicsEngine, DynamicObject, GameEngine, GameObject, GameWorld, lib as Lib, P2PhysicsEngine, PhysicalObject2D, PhysicalObject3D, Quaternion, ServerEngine, SimplePhysicsEngine, ThreeVector, TwoVector };
