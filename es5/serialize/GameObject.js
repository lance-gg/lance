'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Serializable2 = require('./Serializable');

var _Serializable3 = _interopRequireDefault(_Serializable2);

var _Serializer = require('./Serializer');

var _Serializer2 = _interopRequireDefault(_Serializer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * GameObject is the base class of all game objects.
 * It is created only for the purpose of clearly defining the game
 * object interface.
 * Game developers will use one of the subclasses such as DynamicObject,
 * or PhysicalObject.
 */
var GameObject = function (_Serializable) {
    _inherits(GameObject, _Serializable);

    _createClass(GameObject, null, [{
        key: 'netScheme',
        get: function get() {
            return {
                id: { type: _Serializer2.default.TYPES.INT32 }
            };
        }

        /**
        * Creates an instance of a game object.
        * @param {GameEngine} gameEngine - the gameEngine this object will be used in
        * @param {Object} options - options for instantiation of the GameObject
        * @param {Number} id - if set, the new instantiated object will be set to this id instead of being generated a new one. Use with caution!
        */

    }]);

    function GameObject(gameEngine, options) {
        _classCallCheck(this, GameObject);

        /**
         * The gameEngine this object will be used in
         * @member {GameEngine}
         */
        var _this = _possibleConstructorReturn(this, (GameObject.__proto__ || Object.getPrototypeOf(GameObject)).call(this));

        _this.gameEngine = gameEngine;

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
        _this.id = null;
        if (options && 'id' in options) _this.id = options.id;else if (_this.gameEngine) _this.id = _this.gameEngine.world.getNewId();

        _this.components = {};
        return _this;
    }

    /**
     * Called after the object is added to to the game world.
     * This is the right place to add renderer sub-objects, physics sub-objects
     * and any other resources that should be created
     * @param {GameEngine} gameEngine the game engine
     */


    _createClass(GameObject, [{
        key: 'onAddToWorld',
        value: function onAddToWorld(gameEngine) {}

        /**
         * Called after the object is removed from game-world.
         * This is where renderer sub-objects and any other resources should be freed
         * @param {GameEngine} gameEngine the game engine
         */

    }, {
        key: 'onRemoveFromWorld',
        value: function onRemoveFromWorld(gameEngine) {}

        /**
         * Formatted textual description of the game object.
         * @return {String} description - a string description
         */

    }, {
        key: 'toString',
        value: function toString() {
            return 'game-object[' + this.id + ']';
        }

        /**
         * Formatted textual description of the game object's current bending properties.
         * @return {String} description - a string description
         */

    }, {
        key: 'bendingToString',
        value: function bendingToString() {
            return 'no bending';
        }
    }, {
        key: 'saveState',
        value: function saveState(other) {
            this.savedCopy = new this.constructor(this.gameEngine, { id: null });
            this.savedCopy.syncTo(other ? other : this);
        }

        // TODO:
        // rather than pass worldSettings on each bend, they could
        // be passed in on the constructor just once.

    }, {
        key: 'bendToCurrentState',
        value: function bendToCurrentState(bending, worldSettings, isLocal, bendingIncrements) {
            if (this.savedCopy) {
                this.bendToCurrent(this.savedCopy, bending, worldSettings, isLocal, bendingIncrements);
            }
            this.savedCopy = null;
        }
    }, {
        key: 'bendToCurrent',
        value: function bendToCurrent(original, bending, worldSettings, isLocal, bendingIncrements) {}

        /**
        * The bending multiple is a getter, which returns the
        * amount of bending.
        * Bending is defined as the amount of correction that will be applied
        * on the client side to a given object's position, incrementally, until the next
        * server broadcast is expected to arrive.
        * When this value is 0.0, the client ignores the server object's position.
        * When this value is null, the bending is taken from the synchronization
        * defaults.  Set this to zero for objects whose position
        * jumps suddenly - because the game intended a jump, not a gradual bend.
        * @memberof GameObject
        * @member {Number} bendingMultiple
        */

    }, {
        key: 'syncTo',


        /**
         * synchronize this object to the state of an other object
         * @param {GameObject} other the other object to synchronize to
         */
        value: function syncTo(other) {
            _get(GameObject.prototype.__proto__ || Object.getPrototypeOf(GameObject.prototype), 'syncTo', this).call(this, other);
        }

        // copy physical attributes to physics sub-object

    }, {
        key: 'refreshToPhysics',
        value: function refreshToPhysics() {}

        // copy physical attributes from physics sub-object

    }, {
        key: 'refreshFromPhysics',
        value: function refreshFromPhysics() {}

        // apply a single bending increment

    }, {
        key: 'applyIncrementalBending',
        value: function applyIncrementalBending() {}

        // clean up resources

    }, {
        key: 'destroy',
        value: function destroy() {}
    }, {
        key: 'addComponent',
        value: function addComponent(componentInstance) {
            componentInstance.parentObject = this;
            this.components[componentInstance.constructor.name] = componentInstance;

            // a gameEngine might not exist if this class is instantiated by the serializer
            if (this.gameEngine) {
                this.gameEngine.emit('componentAdded', this, componentInstance);
            }
        }
    }, {
        key: 'removeComponent',
        value: function removeComponent(componentName) {
            // todo cleanup of the component ?
            delete this.components[componentName];

            // a gameEngine might not exist if this class is instantiated by the serializer
            if (this.gameEngine) {
                this.gameEngine.emit('componentRemoved', this, componentName);
            }
        }

        /**
         * Check whether this game object has a certain component
         * @param componentClass the comp
         * @returns {Boolean} true if the gameObject contains this component
         */

    }, {
        key: 'hasComponent',
        value: function hasComponent(componentClass) {
            return componentClass.name in this.components;
        }
    }, {
        key: 'getComponent',
        value: function getComponent(componentClass) {
            return this.components[componentClass.name];
        }
    }, {
        key: 'bendingMultiple',
        get: function get() {
            return null;
        }

        /**
        * The velocity bending multiple is a getter, which returns the
        * amount of velocity bending.
        * @memberof GameObject
        * @member {Number} bendingVelocityMultiple
        */

    }, {
        key: 'bendingVelocityMultiple',
        get: function get() {
            return null;
        }
    }]);

    return GameObject;
}(_Serializable3.default);

exports.default = GameObject;