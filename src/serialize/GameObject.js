import Serializable from './Serializable';
import Serializer from './Serializer';

/**
 * GameObject is the base class of all game objects.
 * It is created only for the purpose of clearly defining the game
 * object interface.
 * Game developers will use one of the subclasses such as DynamicObject,
 * or PhysicalObject.
 */
export default class GameObject extends Serializable {

    static get netScheme() {
        return {
            id: { type: Serializer.TYPES.INT32 }
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
        * ID of this object's instance.  Each instance has an ID which is unique across the entire
        * game world, including the server and all the clients.  In extrapolation mode,
        * the client may have an object instance which does not yet exist on the server,
        * these objects are known as shadow objects.
        * @member {Number}
        */
        if (options && 'id' in options)
            this.id = options.id;
        else
            this.id = this.gameEngine.world.getNewId();
    }

    /**
     * Initialize the object.
     * Extend this method if you have object initialization logic.
     * @param {Object} options Your object's options
     */
    init(options) {
        Object.assign(this, options);
    }

    /**
     * Add this object to the game-world by creating physics sub-objects
     * renderer sub-objects and any other resources
     * @param {GameEngine} gameEngine the game engine
     */
    onAddToWorld(gameEngine) {}

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
        this.savedCopy = (new this.constructor(this.gameEngine, {id: null}));
        this.savedCopy.syncTo(other ? other : this);
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
    get bendingMultiple() { return null; }

    /**
    * The velocity bending multiple is a getter, which returns the
    * amount of velocity bending.
    * @memberof GameObject
    * @member {Number} bendingVelocityMultiple
    */
    get bendingVelocityMultiple() { return null; }

    /**
     * synchronize this object to the state of an other object
     * @param {GameObject} other the other object to synchronize to
     */
    syncTo(other) {
        super.syncTo(other);
    }

    // copy physical attributes to physics sub-object
    refreshToPhysics() {}

    // copy physical attributes from physics sub-object
    refreshFromPhysics() {}

    // clean up resources
    destroy() {}

    // apply a single bending increment
    applyIncrementalBending() { }
}