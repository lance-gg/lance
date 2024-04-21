import ee from 'event-emitter';
import P2, { CircleOptions, BodyOptions } from 'p2';
import * as Cannon from 'cannon';
import { Server } from 'socket.io';

type TimerCallback = (args: any) => void;
declare class Timer {
    currentTime: number;
    idCounter: number;
    private isActive;
    private events;
    constructor();
    play(): void;
    tick(): void;
    destroyEvent(eventId: number): void;
    loop(time: number, callback: TimerCallback): TimerEvent;
    add(time: number, callback: TimerCallback, thisContext: any, args: any): TimerEvent;
    destroy(id: number): void;
}
declare class TimerEvent {
    id: number;
    private timer;
    private type;
    private time;
    private callback;
    private startOffset;
    private thisContext;
    private args;
    destroy: () => void;
    constructor(timer: Timer, type: TimerEventType, time: number, callback: any, thisContext?: any, args?: any);
}
type TimerEventType = 'repeat' | 'single';

type NetScheme = {
    [key: string]: {
        'type': string;
        'itemType'?: string;
    };
};

type DataItem = number | string | Object;
type DataDesc = {
    data: DataItem;
    bufferSize: number;
};
declare class Serializer {
    registeredClasses: {
        [key: string]: any;
    };
    customTypes: {
        [key: string]: any;
    };
    constructor();
    addCustomType(customType: any): void;
    static typeCanAssign(type: any): boolean;
    registerClass(classObj: any, classId?: any): void;
    deserialize(dataBuffer: any, byteOffset?: number): {
        obj: any;
        byteOffset: number;
    };
    writeDataView(dataView: any, value: any, bufferOffset: any, netSchemProp: any): void;
    readDataView(dataView: DataView, bufferOffset: any, netSchemProp: any): DataDesc;
    getTypeByteSize(type: any): any;
}

type SerializableOptions = {
    dataBuffer: any;
    bufferOffset: number;
    dry: boolean;
};
type SerializedObj = {
    dataBuffer: ArrayBuffer;
    bufferOffset: number;
};
declare class Serializable {
    classId: number;
    constructor();
    netScheme(): NetScheme;
    serialize(serializer: Serializer, options: SerializableOptions): SerializedObj;
    prunedStringsClone(serializer: Serializer, prevObject: Serializable): any;
    syncTo(other: any): void;
}

declare enum BaseTypes {
    Float32 = "FLOAT32",
    Int32 = "INT32",
    Int16 = "INT16",
    Int8 = "INT8",
    UInt8 = "UINT8",
    String = "STRING",
    ClassInstance = "CLASSINSTANCE",
    List = "List"
}

type GameObjectOptions = {
    id?: number;
};
type GameObjectProps = {
    playerId?: number;
};
declare class GameObject extends Serializable {
    id: number | null;
    protected gameEngine: GameEngine;
    playerId: number;
    private components;
    private savedCopy;
    netScheme(): {
        id: {
            type: BaseTypes;
        };
        playerId: {
            type: BaseTypes;
        };
    };
    constructor(gameEngine: GameEngine, options: GameObjectOptions, props: GameObjectProps);
    onAddToWorld(gameEngine: any): void;
    onRemoveFromWorld(gameEngine: any): void;
    toString(): string;
    bendingToString(): string;
    saveState(other?: any): void;
    get bending(): any;
    bendToCurrentState(bending: any, worldSettings: any, isLocal: any, bendingIncrements: any): void;
    bendToCurrent(original: any, bending: any, worldSettings: any, isLocal: any, bendingIncrements: any): void;
    syncTo(other: any): void;
    refreshToPhysics(): void;
    refreshFromPhysics(): void;
    applyIncrementalBending(stepDesc: any): void;
    destroy(): void;
    addComponent(componentInstance: any): void;
    removeComponent(componentName: any): void;
    hasComponent(componentClass: any): boolean;
    getComponent(componentClass: any): any;
}

interface PhysicsEngineOptions {
    gameEngine: GameEngine;
}
declare class PhysicsEngine {
    private options;
    protected gameEngine: GameEngine;
    world?: any;
    constructor(options: PhysicsEngineOptions);
    step(dt: number, objectFilter: (o: GameObject) => boolean): void;
}

declare global {
    interface Window {
        LANCE: any;
    }
}
declare global {
    var LANCE: any;
}
interface GameEngineOptions {
    traceLevel: number;
}
interface InternalOptions extends GameEngineOptions {
    clientIDSpace: number;
}
interface InputDesc {
    input: string;
    messageIndex: number;
    step: number;
    options?: {
        movement: boolean;
    };
}
declare class GameEngine {
    world: any;
    worldSettings: any;
    physicsEngine: PhysicsEngine;
    ignorePhysics: boolean;
    playerId: number;
    highestServerStep: number;
    ignoreInputs: boolean;
    trace: any;
    emit: (event: string, ...arg: any[]) => void;
    on: ee.EmitterMethod;
    once: ee.EmitterMethod;
    removeListener: ee.EmitterMethod;
    off: ee.EmitterMethod;
    options: InternalOptions;
    timer: Timer;
    constructor(options: GameEngineOptions);
    findLocalShadow(serverObj: any): any;
    initWorld(worldSettings?: any): void;
    start(): void;
    step(isReenact: boolean, t?: number, dt?: number, physicsOnly?: boolean): void;
    addObjectToWorld(object: any): any;
    processInput(inputDesc: InputDesc, playerId: number, isServer: boolean): void;
    removeObjectFromWorld(objectId: any): void;
    isOwnedByPlayer(object: any): boolean;
    registerClasses(serializer: any): void;
    getPlayerGameOverResult(): any;
}

interface ObjectQuery {
    id: number;
    playerId: number;
    instanceType: typeof GameObject;
    components: string[];
    returnSingle: boolean;
}
declare class GameWorld {
    objects: {
        [key: number]: GameObject;
    };
    private stepCount;
    private playerCount;
    private idCount;
    constructor();
    getNewId(): number;
    queryObjects(query: ObjectQuery): GameObject | GameObject[];
    queryObject(query: any): GameObject | GameObject[];
    addObject(object: any): void;
    removeObject(id: any): void;
    forEachObject(callback: any): void;
}

interface P2PhysicsEngineOptions extends PhysicsEngineOptions {
    dt?: number;
}
declare class P2PhysicsEngine extends PhysicsEngine {
    private p2PhysicsEngineOptions;
    constructor(options: P2PhysicsEngineOptions);
    step(dt: number, objectFilter: (o: GameObject) => boolean): void;
    addCircle(circleOptions: CircleOptions, bodyOptions: BodyOptions): P2.Body;
    addBox(width: number, height: number, mass: number): P2.Body;
    removeObject(obj: P2.Body): void;
}

declare class SimplePhysicsEngine extends PhysicsEngine {
    private collisionDetection;
    private gravity;
    constructor(options: any);
    objectStep(o: any, dt: any): void;
    step(dt: number, objectFilter: (o: GameObject) => boolean): void;
}

interface CannonPhysicsEngineOptions extends PhysicsEngineOptions {
    dt: number;
}
declare class CannonPhysicsEngine extends PhysicsEngine {
    private cannonPhysicsEngineOptions;
    constructor(options: CannonPhysicsEngineOptions);
    step(dt: number, objectFilter: (o: GameObject) => boolean): void;
    addSphere(radius: number, mass: number): Cannon.Body;
    addBox(x: number, y: number, z: number, mass: number, friction: number): Cannon.Body;
    addCylinder(radiusTop: number, radiusBottom: number, height: number, numSegments: number, mass: number): Cannon.Body;
    removeObject(obj: Cannon.Body): void;
}

interface TwoVectorBendingOptions {
    increments: number;
    percent: number;
    min: number;
    max: number;
}
declare class TwoVector extends Serializable {
    x: number;
    y: number;
    netScheme(): {
        x: {
            type: BaseTypes;
        };
        y: {
            type: BaseTypes;
        };
    };
    constructor(x: number, y: number);
    toString(): string;
    set(x: number, y: number): this;
    multiply(other: TwoVector): this;
    multiplyScalar(s: number): this;
    add(other: TwoVector): this;
    subtract(other: TwoVector): this;
    length(): number;
    normalize(): this;
    copy(sourceObj: TwoVector): this;
    clone(): TwoVector;
    lerp(target: TwoVector, p: number): this;
    getBendingDelta(target: TwoVector, options: TwoVectorBendingOptions): TwoVector;
}

interface ThreeVectorBendingOptions extends TwoVectorBendingOptions {
}
declare class ThreeVector extends Serializable {
    x: number;
    y: number;
    z: number;
    netScheme(): {
        x: {
            type: BaseTypes;
        };
        y: {
            type: BaseTypes;
        };
        z: {
            type: BaseTypes;
        };
    };
    constructor(x: number, y: number, z: number);
    toString(): string;
    multiplyScalar(s: number): ThreeVector;
    length(): number;
    add(other: ThreeVector): ThreeVector;
    subtract(other: ThreeVector): ThreeVector;
    normalize(): ThreeVector;
    copy(sourceObj: ThreeVector): ThreeVector;
    set(x: number, y: number, z: number): ThreeVector;
    clone(): ThreeVector;
    lerp(target: ThreeVector, p: number): ThreeVector;
    getBendingDelta(target: ThreeVector, options: ThreeVectorBendingOptions): ThreeVector;
}

declare class Quaternion extends Serializable {
    private w;
    private x;
    private y;
    private z;
    netScheme(): {
        w: {
            type: BaseTypes;
        };
        x: {
            type: BaseTypes;
        };
        y: {
            type: BaseTypes;
        };
        z: {
            type: BaseTypes;
        };
    };
    constructor(w: number, x: number, y: number, z: number);
    toString(): string;
    copy(sourceObj: Quaternion): this;
    set(w: number, x: number, y: number, z: number): this;
    toAxisAngle(): {
        axis: ThreeVector;
        angle: number;
    };
    normalize(): this;
    setFromAxisAngle(axis: ThreeVector, angle: number): this;
    conjugate(): this;
    multiply(other: Quaternion): this;
    slerp(target: Quaternion, bending: number): this;
}

interface DynamicObjectProps extends GameObjectProps {
    position: TwoVector;
    velocity: TwoVector;
    width: number;
    height: number;
    isStatic: number;
}
declare class DynamicObject extends GameObject {
    private bendingIncrements;
    private position;
    private velocity;
    private friction;
    private width;
    private height;
    private isStatic;
    private angle;
    private isRotatingLeft;
    private isRotatingRight;
    private isAccelerating;
    private rotationSpeed;
    private acceleration;
    private deceleration;
    private incrementScale;
    private bendingAngle;
    private bendingPositionDelta;
    private bendingVelocityDelta;
    private bendingAngleDelta;
    private bendingTarget;
    private bendingOptions;
    netScheme(): {
        position: {
            type: BaseTypes;
        };
        width: {
            type: BaseTypes;
        };
        height: {
            type: BaseTypes;
        };
        isStatic: {
            type: BaseTypes;
        };
        velocity: {
            type: BaseTypes;
        };
        angle: {
            type: BaseTypes;
        };
    } & {
        id: {
            type: BaseTypes;
        };
        playerId: {
            type: BaseTypes;
        };
    };
    constructor(gameEngine: GameEngine, options: GameObjectOptions, props: DynamicObjectProps);
    get x(): number;
    get y(): number;
    toString(): string;
    get bending(): any;
    turnRight(deltaAngle: any): this;
    turnLeft(deltaAngle: any): this;
    accelerate(acceleration: any): this;
    bendingToString(): string;
    get maxSpeed(): any;
    syncTo(other: any): void;
    bendToCurrent(original: any, percent: any, worldSettings: any, isLocal: any, increments: any): void;
    applyIncrementalBending(stepDesc: any): void;
    getAABB(): {
        min: number[];
        max: number[];
    };
    collidesWith(other: any): boolean;
}

interface PhysicalObject2DProps extends GameObjectProps {
    position: TwoVector;
    velocity: TwoVector;
    angle: number;
    angularVelocity: number;
    mass: number;
}
declare class PhysicalObject2D extends GameObject {
    protected position: TwoVector;
    protected velocity: TwoVector;
    protected angle: number;
    protected angularVelocity: number;
    protected mass: number;
    protected bendingIncrements: number;
    private incrementScale;
    private bendingPositionDelta;
    private bendingVelocityDelta;
    private bendingAVDelta;
    private bendingAngleDelta;
    private bendingTarget;
    private bendingOptions;
    private class;
    physicsObj: any;
    netScheme(): {
        mass: {
            type: BaseTypes;
        };
        position: {
            type: BaseTypes;
        };
        angle: {
            type: BaseTypes;
        };
        velocity: {
            type: BaseTypes;
        };
        angularVelocity: {
            type: BaseTypes;
        };
    } & {
        id: {
            type: BaseTypes;
        };
        playerId: {
            type: BaseTypes;
        };
    };
    constructor(gameEngine: GameEngine, options: GameObjectOptions, props: PhysicalObject2DProps);
    onAddToWorld(): void;
    toString(): string;
    get bending(): any;
    bendingToString(): string;
    bendToCurrent(original: any, percent: any, worldSettings: any, isLocal: any, increments: any): void;
    syncTo(other: PhysicalObject2D, options?: any): void;
    refreshFromPhysics(): void;
    copyVector(source: any, target: any): void;
    refreshToPhysics(): void;
    applyIncrementalBending(stepDesc: any): void;
    interpolate(nextObj: any, percent: any): void;
}

interface PhysicalObject3DProps extends GameObjectProps {
    position: ThreeVector;
    velocity: ThreeVector;
    quaternion: Quaternion;
    angularVelocity: ThreeVector;
}
declare class PhysicalObject3D extends GameObject {
    protected position: ThreeVector;
    protected velocity: ThreeVector;
    protected quaternion: Quaternion;
    protected angle: number;
    protected angularVelocity: ThreeVector;
    protected bendingIncrements: number;
    private class;
    private incrementScale;
    private bendingPositionDelta;
    private bendingVelocityDelta;
    private bendingQuaternionDelta;
    private bendingAVDelta;
    private bendingTarget;
    private bendingOptions;
    physicsObj: any;
    netScheme(): {
        position: {
            type: BaseTypes;
        };
        quaternion: {
            type: BaseTypes;
        };
        velocity: {
            type: BaseTypes;
        };
        angularVelocity: {
            type: BaseTypes;
        };
    } & {
        id: {
            type: BaseTypes;
        };
        playerId: {
            type: BaseTypes;
        };
    };
    constructor(gameEngine: GameEngine, options: GameObjectOptions, props: PhysicalObject3DProps);
    toString(): string;
    bendingToString(): string;
    bendToCurrent(original: any, percent: any, worldSettings: any, isLocal: any, increments: any): void;
    syncTo(other: PhysicalObject3D, options?: any): void;
    refreshFromPhysics(): void;
    refreshToPhysics(): void;
    applyIncrementalBending(stepDesc: any): void;
    interpolate(nextObj: any, percent: any): void;
}

type ServerEngineOptions = Partial<ServerEngineOptionsInternal>;
interface ServerEngineOptionsInternal {
    stepRate: number;
    updateRate: number;
    fullSyncRate: number;
    tracesPath: string;
    updateOnObjectCreation: boolean;
    timeoutInterval: number;
}
declare class ServerEngine {
    private options;
    private networkTransmitter;
    private io;
    private serializer;
    protected gameEngine: GameEngine;
    private networkMonitor;
    private scheduler;
    private serverTime;
    private static DEFAULT_ROOM_NAME;
    private rooms;
    private connectedPlayers;
    private objMemory;
    private playerInputQueues;
    constructor(io: Server, gameEngine: GameEngine, options: ServerEngineOptions);
    start(): void;
    step(): void;
    syncStateToClients(roomName: any): void;
    serializeUpdate(roomName: any, options: any): {
        dataBuffer: ArrayBuffer;
        bufferOffset: number;
    };
    createRoom(roomName: any): void;
    assignObjectToRoom(obj: any, roomName: any): void;
    assignPlayerToRoom(playerId: any, roomName: any): void;
    onObjectAdded(obj: any): void;
    onObjectDestroyed(obj: any): void;
    getPlayerId(socket: any): number;
    onPlayerConnected(socket: any): void;
    onPlayerTimeout(socket: any): void;
    onPlayerDisconnected(socketId: any, playerId: any): void;
    resetIdleTimeout(socket: any): void;
    queueInputForPlayer(data: any, playerId: any): void;
    onReceivedInput(data: any, socket: any): void;
    gameStatus(): string;
}

declare global {
    let THREE: any;
}
declare class Renderer {
    protected gameEngine: GameEngine;
    clientEngine: ClientEngine;
    private doReset;
    static getInstance(): Renderer;
    constructor(gameEngine: any);
    init(): Promise<void>;
    reportSlowFrameRate(): void;
    draw(t: any, dt: any): void;
    runClientStep(t: any): void;
    addObject(obj: any): void;
    removeObject(obj: any): void;
    stop(): void;
}

interface SyncStrategyOptions {
}
type Sync = {
    stepCount: number;
    fullUpdate: boolean;
    required: boolean;
    syncObjects: {
        [key: number]: Serializable[];
    };
    syncSteps: {
        [key: number]: {
            [key: string]: Serializable[];
        };
    };
};
declare class SyncStrategy {
    protected clientEngine: ClientEngine;
    protected gameEngine: GameEngine;
    protected needFirstSync: boolean;
    private requiredSyncs;
    protected lastSync: Sync | null;
    private options;
    static SYNC_APPLIED: string;
    static STEP_DRIFT_THRESHOLDS: {
        onServerSync: {
            MAX_LEAD: number;
            MAX_LAG: number;
        };
        onEveryStep: {
            MAX_LEAD: number;
            MAX_LAG: number;
        };
        clientReset: number;
    };
    constructor(inputOptions: SyncStrategyOptions);
    initClient(clientEngine: ClientEngine): void;
    collectSync(e: any): void;
    addNewObject(objId: any, newObj: any): any;
    applySync(sync: Sync, required: boolean): string;
    syncStep(stepDesc: any): void;
}

type ClientEngineOptions = {
    verbose: boolean;
    autoConnect: boolean;
    standaloneMode: boolean;
    delayInputCount: number;
    healthCheckInterval: number;
    healthCheckRTTSample: number;
    stepPeriod: number;
    scheduler: string;
    serverURL: string;
    matchmaker: any;
};
declare class ClientEngine {
    options: ClientEngineOptions;
    private serializer;
    gameEngine: GameEngine;
    private networkTransmitter;
    private networkMonitor;
    private syncStrategy;
    private inboundMessages;
    private outboundMessages;
    private delayedInputs;
    private renderer;
    private scheduler;
    lastStepTime: number;
    correction: number;
    socket: any;
    private messageIndex;
    private stopped;
    private resolved;
    private lastTimestamp;
    private skipOneStep;
    private resolveGame;
    constructor(gameEngine: GameEngine, syncStrategy: SyncStrategy, inputOptions: ClientEngineOptions, renderer: Renderer);
    connect(options?: {}): Promise<unknown>;
    start(): Promise<unknown>;
    disconnect(): void;
    checkDrift(checkType: any): void;
    step(t: any, dt: any, physicsOnly?: boolean): void;
    doInputLocal(message: any): void;
    applyDelayedInputs(): void;
    sendInput(input: any, inputOptions: any): void;
    handleInboundMessage(syncData: any): void;
    handleOutboundInput(): void;
}

type KeyOptions = {
    repeat: boolean;
};
declare class KeyboardControls {
    private clientEngine;
    private gameEngine;
    private boundKeys;
    private keyStates;
    private lastKeyPressed;
    constructor(clientEngine: ClientEngine);
    setupListeners(): void;
    bindKey(keys: string | string[], actionName: string, options?: KeyOptions, parameters?: any): void;
    onKeyChange(e: KeyboardEvent, isDown: boolean): void;
}

declare global {
    let AFRAME: any;
}
declare class AFrameRenderer extends Renderer {
    protected scene: any;
    constructor(gameEngine: any);
    reportSlowFrameRate(): void;
    init(): Promise<void>;
    draw(): void;
    tick(t: any, dt: any): void;
}

interface ExtrapolateSyncStrategyOptions extends SyncStrategyOptions {
    localObjBending: number;
    remoteObjBending: number;
    bendingIncrements: number;
    maxReEnactSteps?: number;
}
declare class ExtrapolateStrategy extends SyncStrategy {
    static STEP_DRIFT_THRESHOLDS: {
        onServerSync: {
            MAX_LEAD: number;
            MAX_LAG: number;
        };
        onEveryStep: {
            MAX_LEAD: number;
            MAX_LAG: number;
        };
        clientReset: number;
    };
    private extrapolateOptions;
    private recentInputs;
    constructor(extrapolateOptions: ExtrapolateSyncStrategyOptions);
    initClient(clientEngine: ClientEngine): void;
    clientInputSave(inputEvent: any): void;
    cleanRecentInputs(lastServerStep: any): void;
    applySync(sync: Sync, required: boolean): string;
}

type TraceOptions = {
    traceLevel: number;
};
type StepDesc = 'initializing' | number;
type TraceEntry = {
    data: string;
    level: number;
    step: StepDesc;
    time: Date;
};
type TraceDataCollector = () => string;
declare class Trace {
    private options;
    private traceBuffer;
    private step;
    error: (tdc: TraceDataCollector) => void;
    warn: (tdc: TraceDataCollector) => void;
    info: (tdc: TraceDataCollector) => void;
    debug: (tdc: TraceDataCollector) => void;
    constructor(options: TraceOptions);
    static get TRACE_ALL(): number;
    static get TRACE_DEBUG(): number;
    static get TRACE_INFO(): number;
    static get TRACE_WARN(): number;
    static get TRACE_ERROR(): number;
    static get TRACE_NONE(): number;
    trace(level: number, dataCB: TraceDataCollector): void;
    rotate(): TraceEntry[];
    get length(): number;
    setStep(s: StepDesc): void;
}

declare const _default: {
    Trace: typeof Trace;
};

declare class FrameSyncStrategy extends SyncStrategy {
    constructor(options: SyncStrategyOptions);
    applySync(sync: Sync, required: boolean): string;
}

export { AFrameRenderer, BaseTypes, CannonPhysicsEngine, ClientEngine, type ClientEngineOptions, DynamicObject, ExtrapolateStrategy, type ExtrapolateSyncStrategyOptions, FrameSyncStrategy, GameEngine, type GameEngineOptions, GameObject, GameWorld, type InputDesc, KeyboardControls, _default as Lib, P2PhysicsEngine, PhysicalObject2D, PhysicalObject3D, Quaternion, Renderer, ServerEngine, type ServerEngineOptions, SimplePhysicsEngine, SyncStrategy, type SyncStrategyOptions, ThreeVector, TwoVector };
