# Lance Game Tutorial

This 45-minute tutorial will guide you in the building of a
JavaScript networked game.  It is meant as a more advanced
tutorial, a follow-up to {@tutorial MyFirstGame}.
This tutorial repeats the environment setup, but goes further in-depth,
introducing the concepts and basic components of a
networked game,
and sequence flows on the server and the clients.


All the code in this tutorial references the [spaaace](https://github.com/lance-gg/spaaace) repository - so
first, clone that repository to see the referenced files:

```shell
git clone https://github.com/lance-gg/spaaace
cd spaaace
npm install
npm start
```

Open one or more browsers at http://localhost:3000 to see the game running.

## The Components of a Networked Game

The networked game is architected around the following components:

* **The server**.  Represented by the `ServerEngine` class.  The code in this class will run on the authoritative server only.
* **The clients**.  Represented by the `ClientEngine` class.  The code in this class will run on each browser playing the game.
* **The game logic**.  Represented by the `GameEngine` class.  In extrapolation mode, the code in this class runs on the server, but is also executed on each client, as each client attempts to extrapolate what is happening on the authoritative server.
* **Multiple game objects**.  The `GameObject` is the base class for all kinds of game objects.  Each game object will be associated with one or more render objects, as well as one or more physics objects.  For example, in a game of spaceships, each spaceship is a game object, but each spaceship game object will have multiple render objects associated with it, such as the spaceship image, the engine thrust images, and an explosion image which is rendered when the spaceship explodes.  In addition, a single spaceship game object is linked to physical objects in a physics engine.  And the physical object will likely be a very simple shape, like a square or a triangle or a point.
* **Synchronization**.  Lance provides several ways to synchronize between the server and the clients.  The game developer must configure which synchronization method works best for any given game.

As you write your game, you will need to implement
your own extensions (sub-classes) of the classes above.  But most of the interesting
stuff will happen in your extension of GameEngine.

## Basic Flow

The basic flow of the game can be seen as a sequence of *game steps*.
Steps will be executed both on the server and the client.  Each step is numbered,
and depending on the synchronization strategy, clients may be executing a given
step before the corresponding state data has arrived from the server (i.e. extrapolation) or after (i.e. interpolation).
Ideally, a given step _N_ represents the same point in game play on both the server
and the client, and occurs at the same time.  But this is not always the case.

### Server Flow:

The server main entry point is a simple javascript file which initializes an instance of an extended `ServerEngine` class and an instance of an extended `GameEngine` class. In our tutorial the file is called [`main.js`](https://github.com/lance-gg/spaaace/blob/master/main.js).

The server engine schedules a `step` function to be called at a regular interval.  The
flow is:
* **ServerEngine** - start of a single server step
  * GameEngine - **collect inputs from all players:** process any inputs that arrived
  * GameEngine - start of a single game step
    * PhysicsEngine - handle physics step
  * **Broadcast game state to clients:** If a game-state broadcast is due
    * For each connected player P_i_
      * Transmit a "world update" to player P_i_
      * This world update is called a "sync" and contains only the necessary changes to game objects

Note: the flow described above is already implemented in Lance, and the game developer only needs to implement the `ServerEngine` class and the `GameEngine` class.

### Client Flow:

The client flow is actually more complicated than the server flow, because of synchronization strategies and the rendering.  The client consists of three independent work schedules: The game step logic, the render step logic, and the server update sync logic.

* **ClientEngine** - Renderer draw event
  * At the draw event, the client will typically execute one client game step
  * Check inbound messages / world updates
    * if a world update has arrived, parse and store the data
  * Capture local user inputs that have occurred since previous step
  * Transmit inputs to server
  * Handle inputs locally
  * GameEngine - start of a game step
    * PhysicsEngine - handle physics step
  * For each object in the world O_i_:
    * update the associated render objects for O_i_

Note: the flow described above is already implemented in Lance, and the game developer only needs to implement the `ClientEngine` class and the `GameEngine` class.

## Step 1: main.js and the ServerEngine

### Build your own ServerEngine class:

The first step is to build your own ServerEngine-derived class.  For this tutorial
you can look at file [`src/server/SpaaaceServerEngine.js`](https://github.com/lance-gg/spaaace/blob/master/src/server/SpaaaceServerEngine.js)

This file does the following:

1. Handle player-connection logic by creating a ship for the new player.  See method `onPlayerConnected`.
1. handle player-disconnection logic by removing the ship of the disconnected player.  See method `onPlayerDisconnected`.
1. note the `makeBot()` method, it creates AI-controlled spaceships, which are controlled on the server only.  The AI-control code is implemented in the GameEngine, but since it is only called by the ServerEngine class, it will only run on the server.  This is the preferred technique to implement game code which only executes on the server.

### Build the main entry point:

The next step is to write the server entry code.  For this tutorial the corresponding
file is [`main.js`](https://github.com/lance-gg/spaaace/blob/master/main.js)

The file does the following:

1. create an express server and configure the root route '/'
1. create a socketIO handler
1. create an instance of SpaaaceServerEngine
1. create an instance of SpaaaceGameEngine
1. start the serverEngine instance

Sample entry code will look like this:
```javascript
const express = require('express');
const socketIO = require('socket.io');
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, './index.html');

// define routes and socket
const server = express();
server.get('/', function(req, res) { res.sendFile(INDEX); });
server.use('/', express.static(path.join(__dirname, '.')));
let requestHandler = server.listen(PORT, () => console.log(`Listening on ${ PORT }`));
const io = socketIO(requestHandler);

// Game Server
import MyServerEngine from './src/server/SpaaaceServerEngine.js';
import MyGameEngine from './src/common/SpaaaceGameEngine.js';


// Game Instances
const gameEngine = new MyGameEngine();
const serverEngine = new MyServerEngine(io, gameEngine, {
    debug: {},
    updateRate: 6,
    timeoutInterval: 0 // no timeout
});

// start the game
serverEngine.start();
```

## Step 2: the GameEngine

To implement the game logic, you must create a new class which extends
**GameEngine** class.  This is where your game mechanics (a.k.a. game rules,
or business logic) are implemented.
Remember that most of this code is meant to execute on the server
as well as on each client.

For this tutorial, take a look at [`src/common/SpaaaceGameEngine.js`](https://github.com/lance-gg/spaaace/blob/master/src/common/SpaaaceGameEngine.js)
The game engine logic has three major tasks:

1. to extend the `processInput()` method.  This is the logic which handles new user input such as movement, firing, activate ability, etc.  In the sample code the `processInput()` method handles the keyboard inputs "up", "right", "left", "space".  The inputs will cause the spaceship to accelerate, turn right or left, or to fire a missile.
1. `makeShip()`.  Creates a new ship, as a result of a new connection received on the server.
1. `makeMissile()`.  Create a new missile, as a result of one ship firing.
1. `destroyMissile()`.  Remove a missile.

## Step 3: `clientMain.js`, `SpaaaceClientEngine.js`, and `SpaaaceRenderer.js`

The client entry code creates a game engine, a client engine, and their options.  The options configure the synchronization.

The full sample code is in [`src/client/clientMain.js`](https://github.com/lance-gg/spaaace/blob/master/src/client/clientMain.js) and is implemented as follows:

```javascript
import SpaaaceClientEngine from './SpaaaceClientEngine';
import SpaaaceGameEngine from '../common/SpaaaceGameEngine';
import '../../assets/sass/main.scss';

// sent to both game engine and client engine
const options = {
    traceLevel: 1000,
    delayInputCount: 8,
    scheduler: 'render-schedule',
    syncOptions: {
        sync: 'extrapolate',
        localObjBending: 0.2,
        remoteObjBending: 0.5
    }
};

// create a client engine and a game engine
const gameEngine = new SpaaaceGameEngine(options);
const clientEngine = new SpaaaceClientEngine(gameEngine, options);

clientEngine.start();
```

## Step 4: DynamicObjects

Your game objects, including monsters, spaceships, zombies, and bosses, all extend
the `DynamicObject` class.  More advanced games which require a true 3D physics engine will prefer to extend the `PhysicsObject` class, but that is outside the scope of this tutorial.  The `DynamicObject` base class is a
serializable class, meaning that the server can serialize any instance of the class
(and sub-class) into a binary object, and transmit it to the clients.  Instances of dynamic objects (and instances of dynamic object sub-classes)
must be serializable so that the server can send updates to the clients.

The serialization mechanism requires sub-classes to explicitly list which attributes will be serialized. Each object must specify exactly which attribute values need to be serialized and transmitted from the server to the clients on each update.  To describe the added attributes of an extended class, use the `netscheme` mechanism.

Take a look at the `netScheme()` getter in [`src/common/Ship.js`](https://github.com/lance-gg/spaaace/blob/master/src/common/Ship.js) and
[`src/common/Missile.js`](https://github.com/lance-gg/spaaace/blob/master/src/common/Missile.js).  The `netScheme()` getter extends the super-class netScheme.  In both files you will find that the base class provides most of the needed logic for movement,
and synchronization.

## Step 5: Putting it all together

For the full game, you will need to create a [`package.json`](https://github.com/lance-gg/spaaace/blob/master/package.json) file, and [`index.html`](https://github.com/lance-gg/spaaace/blob/master/index.html) file,
examples of which are available in the [spaaace](https://github.com/lance-gg/spaaace) repository.

To run the server run `npm run build` followed by `npm start`.  
Note that the server has two roles: **(1)** it acts as an HTTP server, serving index.html to clients
which connect to the game;
and **(2)** it runs the ServerEngine socket.io entry point, accepting client connections, running the server-authoritative game engine, and broadcasting updates to the clients.  In a published game, you will likely want to store the static files in a CDN, and your game engine will only act in the second role.

## Game Events

It is good programming practice to implement your code using event handlers,
so that it is clear what each chunk of logic is handling.

The full list of events is available in the [API GameEngine reference]{@link GameEngine}, so we will only list the most
important events here.

* `preStep` and `postStep` - emitted by game engine, just before and just after step execution.  The event handlers receive the step number and whether or not this step is a reenactment.
* `objectAdded` and `objectDestroyed` - emitted on object addition/destruction, the handlers receive the object as an argument.
* `syncReceived` - emitted on the client when a sync (e.g world update) is received.
* `playerJoined` and `playerDisconnected` - emitted on player connect/disconnect.  The handlers receive an object describing the player.  The object contains attribute playerId.

## Traces & Debugging

For debugging purposes, the game engine provides a tracing service.  The trace
service exposes functions `trace()`, `debug()`, `info()`, `warn()` and `error()`.
The functions are listed above in increasing order of importance.  When the
game engine is started, it can be passed a minimum trace level option.  For example
a minimum trace level of `TRACE_INFO` will mean that entries of type "trace" and "debug"
will be ignored.

A trace message is usually recorded as follows:
```javascript
gameEngine.trace.info(() => `this just happened: ${foobar()}`);
```

The trace methods receive arrow functions as an input, because if they would receive the template string then this template string will be evaluated even in those cases where no tracing is done.  This has been shown to add a heavy load to the garbage collection.

By default, Lance already traces a lot of information, describing
the progress of the game and each step in detail.
The traces are text files, written on the server side.  The server trace
file is called **server.trace** and the client trace files are called **client._n_.trace**
where **_n_** is the player's id.

### How to enable traces

In our tutorial example, the URL's query-string parameters become options which are
passed to the game engine constructor.  So the client-side traces can be activated from the query string, simply by setting the parameter `&traceLevel=0` on the query
string.  

On the server side traces can be enabled by setting the `traceLevel` option on the `GameEngine`, this option specifies the minimum trace level to record, so by setting this option to 0 you can get all trace messages.
