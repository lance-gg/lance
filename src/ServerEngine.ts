import fs from 'fs';
import mkdirp from 'mkdirp';
import Utils from './lib/Utils.js';
import { Scheduler } from './lib/Scheduler.js';
import Serializer from './serialize/Serializer.js';
import NetworkTransmitter from './network/NetworkTransmitter.js';
import NetworkMonitor from './network/NetworkMonitor.js';
import { GameEngine, InputDesc } from './GameEngine.js';
import { Server } from 'socket.io';
import { MeasureMemoryMode } from 'vm';

type ServerEngineOptions = Partial<ServerEngineOptionsInternal>;
interface ServerEngineOptionsInternal {
    stepRate: number,
    updateRate: number,
    fullSyncRate: number,
    tracesPath: string,
    updateOnObjectCreation: boolean,
    timeoutInterval: number
}


type PlayerDesc = { socket: any, state: string, roomName: string }

// TODO: move to newer SocketIO which supports typescript natively

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

    private options: ServerEngineOptions;
    private networkTransmitter: NetworkTransmitter;
    private io: any;
    private serializer: Serializer;
    protected gameEngine: GameEngine;
    private networkMonitor: NetworkMonitor;
    private scheduler: Scheduler;
    private serverTime: number;
    private static DEFAULT_ROOM_NAME = '/lobby';
    private rooms: { [key:string]: { syncCounter: number, requestImmediateSync: boolean, requestFullSync: boolean }};
    private connectedPlayers: { [key: string]: PlayerDesc };
    private objMemory: { [key: number]: ArrayBuffer };

    // playerInputQueues maps: { playerID → { a map from step-number → array of users input }}
    private playerInputQueues: { [key: string]: { [key: number]: InputDesc[] }};

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
     * @param {Boolean} options.updateOnObjectCreation - should send update immediately when new object is created
     * @param {Number} options.timeoutInterval=180 - number of seconds after which a player is automatically disconnected if no input is received. Set to 0 for no timeout
     * @return {ServerEngine} serverEngine - self
     */
    constructor(io: Server, gameEngine: GameEngine, options: ServerEngineOptions) {

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
        this.networkMonitor = new NetworkMonitor();

        /**
         * Default room name
         * @member {String} DEFAULT_ROOM_NAME
         */
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
        this.networkTransmitter.syncHeader(world.stepCount, Number(!diffUpdate));
        const roomObjects = Object.keys(world.objects)
            .filter(o => world.objects[o]._roomName === roomName);
        for (let objId of roomObjects) {
            let obj = world.objects[objId];
            let prevObject = this.objMemory[objId];

            // if the object (in serialized form) hasn't changed, move on
            if (diffUpdate) {
                let s = obj.serialize(this.serializer);
                if (prevObject && Utils.arrayBuffersEqual(s.dataBuffer, prevObject))
                    continue;
                else
                    this.objMemory[objId] = s.dataBuffer;

                // prune strings which haven't changed
                obj = obj.prunedStringsClone(this.serializer, prevObject);
            }

            this.networkTransmitter.sendUpdate(world.stepCount, obj);
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
        this.rooms[roomName] = { syncCounter: 0, requestImmediateSync: false, requestFullSync: false };
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
        let player: PlayerDesc | null = null;

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

    // handle the object creation
    onObjectAdded(obj) {
        obj._roomName = obj._roomName || ServerEngine.DEFAULT_ROOM_NAME;
        this.networkTransmitter.sendCreate(this.gameEngine.world.stepCount, obj);

        if (this.options.updateOnObjectCreation) {
            this.rooms[obj._roomName].requestImmediateSync = true;
        }
    }

    // handle the object creation
    onObjectDestroyed(obj) {
        this.networkTransmitter.sendDestroy(this.gameEngine.world.stepCount, obj);
    }

    getPlayerId(socket): number {
        return NaN;
    }

    // handle new player connection
    onPlayerConnected(socket) {
        let that = this;

        console.log('Client connected');

        // save player
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

export { ServerEngine, ServerEngineOptions }
