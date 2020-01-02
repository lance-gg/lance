import SocketIO from 'socket.io';
import CANNON from 'cannon';
import p2 from "p2";

// Type definitions for lance-gg 4.0
// Project: https://github.com/lance-gg/lance#readme
// Definitions by: Tomasz Sterna <https://github.com/smokku>

export class AFrameRenderer<GE extends GameEngine<PhysicsEngine>, CE extends ClientEngine<GE>> extends Renderer<GE, CE> {
    draw(): void;

    init(): Promise<any>;

    reportSlowFrameRate(): void;

    tick(t?: number, dt?: number): void;
}

declare type CannonPhysicsEngineOptions = PhysicsEngineOptions & {
    dt?: number;
}

export class CannonPhysicsEngine extends PhysicsEngine {
    options: CannonPhysicsEngineOptions;

    constructor(options: CannonPhysicsEngineOptions);

    addBox(x: number, y: number, z: number, mass: number, friction: any): typeof CANNON.Body;

    addCylinder(radiusTop: number, radiusBottom: number, height: number, numSegments: number, mass: number): typeof CANNON.Body;

    addSphere(radius: number, mass: number): typeof CANNON.Body;

    removeObject(obj: typeof CANNON.Body): void;

    step(dt: number, objectFilter?: any): void;
}

declare type ClientEngineInputOptions = {
    verbose?: boolean;
    autoConnect?: boolean;
    standaloneMode?: boolean;
    delayInputCount?: number;
    healthCheckInterval?: number;
    healthCheckRTTSample?: number;
    scheduler?: "render-schedule" | "fixed";
    syncOptions?: {
        sync: "interpolate" | "extrapolate" | "frameSync";
        localObjBending?: number;
        remoteObjBending?: number;
    };
    serverURL?: String;
}

export class ClientEngine<GE extends GameEngine<PhysicsEngine>> {
    constructor(gameEngine: GE, inputOptions: ClientEngineInputOptions, rendererClass: { new(...args: any[]): Renderer<GE, ClientEngine<GE>>; });

    applyDelayedInputs(): void;

    checkDrift(checkType: string): void;

    configureSynchronization(): void;

    connect(options: object): Promise<any>;

    disconnect(): void;

    doInputLocal(message: { data: any }): void;

    handleInboundMessage(syncData: object): void;

    handleOutboundInput(): void;

    sendInput(input: string, inputOptions: object): any;

    start(): Promise<any>;

    step(t: number, dt: number, physicsOnly?: boolean): void;
}

export class DynamicObject<GE extends GameEngine<PE>, PE extends PhysicsEngine> extends GameObject<GE, PE> {
    constructor(gameEngine: any, options: any, props: any);

    bendingIncrements: number;

    position: TwoVector;
    velocity: TwoVector;

    width: number;
    height: number;

    isStatic: number;
    friction: TwoVector;

    angle: number;

    isAccelerating: boolean;

    rotationSpeed: number;

    accelerate(acceleration: any): any;

    applyIncrementalBending(stepDesc: any): void;

    bendToCurrent(original: any, percent: any, worldSettings: any, isLocal: any, increments: any): void;

    bendingToString(): string;

    collidesWith(other: any): any;

    getAABB(): any;

    syncTo(other: any): void;

    toString(): string;

    turnLeft(deltaAngle: any): any;

    turnRight(deltaAngle: any): any;

    static netScheme: {
        angle: { type: string; };
        height: { type: string; };
        id: { type: string; };
        isStatic: { type: string; };
        playerId: { type: string; };
        position: { type: string; };
        velocity: { type: string; };
        width: { type: string; };
    } & GameObjectNetScheme;
}

declare type GameEngineOptions = {
    traceLevel?: number;
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
export class GameEngine<PE extends PhysicsEngine> {
    options: GameEngineOptions;

    /**
     * client's player ID, as a string. If running on the client, this is set at runtime by the clientEngine
     */
    playerId: string;

    world: GameWorld;

    /**
    * The worldSettings defines the game world constants, such
    * as width, height, depth, etc. such that all other classes
    * can reference these values.
    */
    worldSettings: object;

    physicsEngine: PE;

    ignorePhysics: boolean;

    constructor(options: GameEngineOptions);

    /**
     * Add object to the game world.
     * On the client side, the object may not be created, if the server copy
     * of this object is already in the game world.  This could happen when the client
     * is using delayed-input, and the RTT is very low.
     *
     * @param object - the object.
     * @return the final object.
     */
    addObjectToWorld(object: GameObject<GameEngine<PE>, PE>): GameObject<GameEngine<PE>, PE>;

    findLocalShadow(serverObj: GameObject<GameEngine<PE>, PE>): GameObject<GameEngine<PE>, PE> | null;

    /**
     * Decide whether the player game is over by returning an Object, need to be implemented
     *
     * @return truthful if the game is over for the player and the object is returned as GameOver data
     */
    getPlayerGameOverResult(): object | void;

    initWorld(worldSettings: object): void;

    /**
     * Check if a given object is owned by the player on this client
     *
     * @param object the game object to check
     * @return true if the game object is owned by the player on this client
     */
    isOwnedByPlayer(object: GameObject<GameEngine<PE>, PE>): boolean;

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
     * @param inputDesc - input descriptor object
     * @param playerId - the player ID
     * @param isServer - indicate if this function is being called on the server side
     */
    processInput(inputDesc: InputData, playerId: number, isServer?: boolean): void;

    /**
     * Register Game Object Classes
     *
     * @example
     * registerClasses(serializer) {
     *   serializer.registerClass(Paddle);
     *   serializer.registerClass(Ball);
     * }
     *
     * @param serializer - the serializer
     */
    registerClasses(serializer: Serializer): void;

    /**
     * Remove an object from the game world.
     *
     * @param objectId - the object or object ID
     */
    removeObjectFromWorld(objectId: GameObject<GameEngine<PE>, PE> | string): void;

    /**
      * Start the game. This method runs on both server
      * and client. Extending the start method is useful
      * for setting up the game's worldSettings attribute,
      * and registering methods on the event handler.
      */
    start(): void;

    /**
      * Single game step.
      *
      * @param isReenact - is this step a re-enactment of the past.
      * @param t - the current time (optional)
      * @param dt - elapsed time since last step was called.  (optional)
      * @param physicsOnly - do a physics step only, no game logic
      */
    step(isReenact: boolean, t: number, dt: number, physicsOnly: boolean): void;

    /**
     * Register a handler for an event
     *
     * @param eventName - name of the event
     * @param eventHandler - handler function
     */
    on(eventName: string, eventHandler: Function): void;

    /**
     * Register a handler for an event, called just once (if at all)
     *
     * @param eventName - name of the event
     * @param eventHandler - handler function
     */
    once(eventName: string, eventHandler: Function): void;

    /**
     * Remove a handler
     *
     * @param eventName - name of the event
     * @param eventHandler - handler function
     */
    off(eventName: string, eventHandler: Function): void;
    /**
     * @alias off
     */
    removeListener(eventName: string, eventHandler: Function): void;

    emit(eventName: string, data?: any): void;

    trace: Lib.Trace;
}

declare type SerializedObject = {
    dataBuffer: ArrayBuffer;
    bufferOffset: number;
}

declare type SerializableNetScheme = NetSchemeProps;

export class Serializable {
    classId: string;

    static netScheme: NetSchemeProps;

    serialize(serializer: object, options: object): { dataBuffer: object; bufferOffset: number };

    prunedStringsClone(serializer: object, prevObject: object): Serializable;

    syncTo(other: object): void;
}

declare type GameObjectOptions = {
    id?: number;
}

declare type GameObjectProps = {
    playerId?: number;
}

declare type GameObjectNetScheme = {
    id: { type: string; };
    playerId: { type: string; };
} & SerializableNetScheme;

export class GameObject<GE extends GameEngine<PE>, PE extends PhysicsEngine> extends Serializable {
    gameEngine: GE;

    id: number;
    playerId: number;

    components: object;

    constructor(gameEngine: GE, options: GameObjectOptions, props: GameObjectProps);

    addComponent(componentInstance: any): void;

    applyIncrementalBending(stepDesc: any): void;

    bendToCurrent(original: any, bending: any, worldSettings: any, isLocal: any, bendingIncrements: any): void;

    bendToCurrentState(bending: any, worldSettings: any, isLocal: any, bendingIncrements: any): void;

    bendingToString(): string;

    destroy(): void;

    getComponent(componentClass: any): any;

    hasComponent(componentClass: any): any;

    onAddToWorld(gameEngine: any): void;

    onRemoveFromWorld(gameEngine: any): void;

    refreshFromPhysics(): void;

    refreshToPhysics(): void;

    removeComponent(componentName: any): void;

    saveState(other: any): void;

    syncTo(other: any): void;

    toString(): string;

    static netScheme: GameObjectNetScheme;
}

export class GameWorld {
    constructor();

    addObject(object: any): void;

    forEachObject(callback: any): void;

    getNewId(): any;

    queryObject(query: any): any;

    queryObjects(query: any): any;

    removeObject(id: any): void;
}

/**
 * @param input - describe the input (e.g. "up", "down", "fire")
 * @param messageIndex - input identifier
 * @param step - the step on which this input occurred
 */
declare type InputData = {
    input: string;
    messageIndex: number;
    step: number;
}

export class KeyboardControls {
    constructor(clientEngine: any);

    bindKey(keys: string, actionName: string, options?: object): void;

    onKeyChange(e: any, isDown: any): void;

    setupListeners(): void;
}

declare type PhysicsEngineOptions = {
    gameEngine: GameEngine<PhysicsEngine>;
}

export class PhysicsEngine {
    options: PhysicsEngineOptions;

    gameEngine: GameEngine<PhysicsEngine>;

    constructor(options: PhysicsEngineOptions);

    step(dt: number, objectFilter: Function): void;
}

declare type P2PhysicsEngineOptions = PhysicsEngineOptions & {
    dt?: number;
}

export class P2PhysicsEngine extends PhysicsEngine {
    p2: p2;

    world: { [key: string]: any };

    constructor(options: P2PhysicsEngineOptions);

    addBox(width: number, height: number, mass: number): typeof p2.Body;

    addCircle(radius: number, mass: number): typeof p2.Body;

    removeObject(obj: typeof p2.Body): void;

    step(dt: number, objectFilter: Function): void;
}

/**
 * @param position - position vector
 * @param velocity - velocity vector
 * @param angle - orientation angle
 * @param mass - the mass
 * @param angularVelocity - angular velocity
 */
declare type PhysicalObject2DProps = GameObjectProps & {
    position?: TwoVector;
    velocity?: TwoVector;
    angle?: number;
    mass?: number;
    angularVelocity?: number;
}

declare type PhysicalObject2DSyncToOptions = {
    keepVelocity?: boolean;
}

export class PhysicalObject2D<GE extends GameEngine<PE>, PE extends PhysicsEngine> extends GameObject<GE, PE> {
    position: TwoVector;
    velocity: TwoVector;
    angle: number;
    angularVelocity: number;
    mass: number;

    physicsObj: typeof p2.Body;

    /**
    * Creates an instance of a physical object.
    * Override to provide starting values for position, velocity, angle and angular velocity.
    * NOTE: all subclasses of this class must comply with this constructor signature.
    *       This is required because the engine will create temporary instances when
    *       syncs arrive on the clients.
    * @param gameEngine - the gameEngine this object will be used in
    * @param options - options for the new object. See {@link GameObject}
    * @param props - properties to be set in the new object
    */
    constructor(gameEngine: GameEngine<PE>, options?: GameObjectOptions, props?: PhysicalObject2DProps);

    /// apply one increment of bending
    applyIncrementalBending(stepDesc?: { dt?: number }): void;

    /// derive and save the bending increment parameters:
    /// - bendingPositionDelta
    /// - bendingVelocityDelta
    /// - bendingAVDelta
    /// - bendingAngleDelta
    /// these can later be used to "bend" incrementally from the state described
    /// by "original" to the state described by "self"
    bendToCurrent(original: any, percent: any, worldSettings: any, isLocal: any, increments: any): void;

    /**
     * Each object class can define its own bending overrides.
     * return an object which can include attributes: position, velocity,
     * angle, and angularVelocity.  In each case, you can specify a min value, max
     * value, and a percent value.
     *
     * example:
     * position: { percent: 0.8, min: 0.0, max: 4.0 },
     * velocity: { percent: 0.4, min: 0.0 },
     * angularVelocity: { percent: 0.0 },
     * angleLocal: { percent: 0.0 }
     *
     * @return bending - an object with bending parameters
     */
    bending: {
        [key: string]: { percent?: number, min?: number, max?: number };
    }

    /// display object's physical attributes as a string
    /// for debugging purposes mostly
    bendingToString(): string;

    /// generic vector copy.  We need this because different
    /// physics engines have different implementations.
    copyVector(source: TwoVector, target: Function | Float32Array | TwoVector): void;

    /// interpolate implementation
    interpolate(nextObj: PhysicalObject2D<GE, PE>, percent: number): void;

    /**
     * Called after the object is added to to the game world.
     * This is the right place to add renderer sub-objects, physics sub-objects
     * and any other resources that should be created
     */
    onAddToWorld(): void;

    /// update position, angle, angular velocity, and velocity from new physical state.
    refreshFromPhysics(): void;

    /// update position, angle, angular velocity, and velocity from new game state.
    refreshToPhysics(): void;

    syncTo(other: PhysicalObject2D<GE, PE>, options?: PhysicalObject2DSyncToOptions): void;

    /**
     * Formatted textual description of the dynamic object.
     * The output of this method is used to describe each instance in the traces,
     * which significantly helps in debugging.
     *
     * @return description - a string describing the PhysicalObject2D
     */
    toString(): string;

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
    * @example
    *     static get netScheme() {
    *       return Object.assign({
    *           mojo: { type: BaseTypes.TYPES.UINT8 },
    *         }, super.netScheme);
    *     }
    */
    static netScheme: {
        angle: { type: string; };
        angularVelocity: { type: string; };
        id: { type: string; };
        mass: { type: string; };
        playerId: { type: string; };
        position: { type: string; };
        velocity: { type: string; };
    } & GameObjectNetScheme;
}

declare type PhysicalObject3DProps = GameObjectProps & {
}

declare type PhysicalObject3DSyncToOptions = {
}

export class PhysicalObject3D<GE extends GameEngine<PE>, PE extends PhysicsEngine> extends GameObject<GE, PE> {
    physicsObj: typeof CANNON.Body;

    constructor(gameEngine: any, options: any, props: any);

    applyIncrementalBending(stepDesc: any): void;

    bendToCurrent(original: any, percent: any, worldSettings: any, isLocal: any, increments: any): void;

    bendingToString(): string;

    interpolate(nextObj: any, percent: any): void;

    refreshFromPhysics(): void;

    refreshToPhysics(): void;

    syncTo(other: PhysicalObject3D<GE, PE>, options?: PhysicalObject3DSyncToOptions): void;

    toString(): string;

    static netScheme: {
        angularVelocity: { type: string; };
        id: { type: string; };
        playerId: { type: string; };
        position: { type: string; };
        quaternion: { type: string; };
        velocity: { type: string; };
    } & GameObjectNetScheme;
}

export class Quaternion extends Serializable {
    constructor(w: any, x: any, y: any, z: any);

    conjugate(): any;

    copy(sourceObj: any): any;

    multiply(other: any): any;

    normalize(): any;

    set(w: any, x: any, y: any, z: any): any;

    setFromAxisAngle(axis: any, angle: any): any;

    slerp(target: any, bending: any): any;

    toAxisAngle(): any;

    toString(): string;

    static netScheme: {
        w: { type: string; };
        x: { type: string; };
        y: { type: string; };
        z: { type: string; };
    } & SerializableNetScheme;
}

export class Renderer<GE extends GameEngine<PhysicsEngine>, CE extends ClientEngine<GE>> {
    static getInstance<R extends Renderer<GameEngine<PhysicsEngine>, ClientEngine<GameEngine<PhysicsEngine>>>>(): R;

    gameEngine: GE;
    clientEngine: CE;

    constructor(gameEngine: GE, clientEngine: CE);

    addObject(obj: GameObject<GE, PhysicsEngine>): void;

    draw(t: number, dt?: number): void;

    init(): Promise<any>;

    removeObject(obj: GameObject<GE, PhysicsEngine>): void;

    reportSlowFrameRate(): void;

    runClientStep(t: number): void;

    stop(): void;
}

declare type NetSchemeProp = {
    type: string;
}

declare type NetSchemeProps = {
    [key: string]: NetSchemeProp;
}

/**
 * The Serializer is responsible for serializing the game world and its
 * objects on the server, before they are sent to each client.  On the client side the
 * Serializer deserializes these objects.
 *
 */
export class Serializer {
    constructor();

    /**
     * Checks if type can be assigned by value.
     * @param type Type to Checks
     * @return True if type can be assigned
     */
    static typeCanAssign(type: string): boolean;

    /**
     * Registers a new class with the serializer, so it may be deserialized later
     * @param classObj reference to the class (not an instance!)
     * @param classId Unit specifying a class ID
     */
    registerClass(classObj: { new(...args: any[]): Serializable; }, classId?: string): void;

    deserialize(dataBuffer: ArrayBuffer, byteOffset: number): { obj: Serializable, byteOffset: number };

    writeDataView(dataView: DataView, value: any, bufferOffset: number, netSchemProp: NetSchemeProp): void;

    readDataView(dataView: DataView, bufferOffset: number, netSchemProp: NetSchemeProp): { data: any, bufferSize: number };

    getTypeByteSize(type: string): void;
}

declare type ServerEngineOptions = {
    stepRate?: number;
    updateRate?: number;
    fullSyncRate?: number;
    tracesPath?: string;
    countConnections?: boolean;
    updateOnObjectCreation?: boolean;
    timeoutInterval?: number;
    debug?: {
        serverSendLag?: boolean;
    };
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
export class ServerEngine<PE extends PhysicsEngine = PhysicsEngine> {
    gameEngine: GameEngine<PE>;
    DEFAULT_ROOM_NAME: string;
    rooms: {};
    connectedPlayers: {};
    playerInputQueues: {};
    objMemory: {};

    constructor(io: SocketIO, gameEngine: GameEngine<PE>, options?: ServerEngineOptions);

    /**
     * Assign an object to a room
     *
     * @param obj - the object to move
     * @param roomName - the target room
     */
    assignObjectToRoom(obj: GameObject<GameEngine<PE>, PE>, roomName: string): void;

    /**
     * Assign a player to a room
     *
     * @param playerId - the playerId
     * @param roomName - the target room
     */
    assignPlayerToRoom(playerId: number, roomName: string): void;

    /**
     * Create a room
     *
     * There is a default room called "/lobby".  All newly created players
     * and objects are assigned to the default room.  When the server sends
     * periodic syncs to the players, each player is only sent those objects
     * which are present in his room.
     *
     * @param roomName - the new room name
     */
    createRoom(roomName: string): void;

    /**
     * Report game status
     * This method is only relevant if the game uses MatchMaker functionality.
     * This method must return the game status.
     *
     * @return Stringified game status object.
     */
    gameStatus(): string;

    getPlayerId(socket: SocketIO.Socket): void;

    onObjectAdded(obj: GameObject<GameEngine<PE>, PE>): void;

    onObjectDestroyed(obj: GameObject<GameEngine<PE>, PE>): void;

    onPlayerConnected(socket: SocketIO.Socket): void;

    onPlayerDisconnected(socketId: string, playerId: string): void;

    onPlayerTimeout(socket: SocketIO.Socket): void;

    onReceivedInput(data: InputData, socket: SocketIO.Socket): void;

    queueInputForPlayer(data: InputData, playerId: string): void;

    resetIdleTimeout(socket: SocketIO.Socket): void;

    serializeUpdate(roomName: string, options: { diffUpdate: boolean }): SerializedObject;

    start(): void;

    step(): void;

    syncStateToClients(roomName: string): void;
}

declare type SimplePhysicsEngineOptions = PhysicsEngineOptions & {
    collisions: {
        type: "HSHG";
    } | {
        type: "bruteForce";
        collisionDistance?: number;
        autoResolve?: boolean;
    },
    gravity: TwoVector;
}

export class SimplePhysicsEngine extends PhysicsEngine {
    options: SimplePhysicsEngineOptions;

    constructor(options: SimplePhysicsEngineOptions);

    objectStep(o: any, dt: any): void;

    step(dt: any, objectFilter: any): void;
}

export class ThreeVector extends Serializable {
    constructor(x: any, y: any, z: any);

    add(other: any): any;

    clone(): any;

    copy(sourceObj: any): any;

    getBendingDelta(target: any, options: any): any;

    length(): any;

    lerp(target: any, p: any): any;

    multiplyScalar(s: any): any;

    normalize(): any;

    set(x: any, y: any, z: any): any;

    subtract(other: any): any;

    toString(): string;

    static netScheme: {
        x: { type: string; };
        y: { type: string; };
        z: { type: string; };
    } & SerializableNetScheme;
}

export class TwoVector extends Serializable {
    x: number;
    y: number;

    constructor(x: number, y: number);

    add(other: TwoVector): TwoVector;

    clone(): TwoVector;

    copy(source: TwoVector): TwoVector;

    getBendingDelta(target: TwoVector, options: object): TwoVector;

    length(): number;

    lerp(target: TwoVector, p: number): TwoVector;

    multiply(other: TwoVector): TwoVector;

    multiplyScalar(s: number): TwoVector;

    normalize(): TwoVector;

    set(x: number, y: number): TwoVector;

    subtract(other: TwoVector): TwoVector;

    toString(): string;

    static netScheme: {
        x: { type: string; };
        y: { type: string; };
    } & SerializableNetScheme;
}

export namespace BaseTypes {
    const TYPES: {
        CLASSINSTANCE: string;
        FLOAT32: string;
        INT16: string;
        INT32: string;
        INT8: string;
        LIST: string;
        STRING: string;
        UINT8: string;
    };
}

export namespace Lib {
    class Trace {
        constructor(options: any);

        rotate(): any;

        setStep(s: any): void;

        trace(level: any, dataCB: any): void;

        static TRACE_ALL: number;

        static TRACE_DEBUG: number;

        static TRACE_ERROR: number;

        static TRACE_INFO: number;

        static TRACE_NONE: number;

        static TRACE_WARN: number;
    }
}
