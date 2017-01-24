# Incheon Game Tutorial

This tutorial will guide you in the building of a relatively simple
javascript networked game.  It is meant as a more advanced
tutorial, a follow-up to [My First Incheon Game](https://incheon.gg/docs/tutorials/MyFirstIncheonGame.html).
This tutorial repeats the environment setup, but goes further in-depth,
introducing the concepts and basic components of a
networked game,
and sequence flows on the server and the clients.


All the code in this tutorial references the **tutorial** branch of the [spaaace](https://github.com/OpherV/spaaace/tree/tutorial) repository - so
clone that branch repository to see the referenced files:

```shell
git clone https://github.com/OpherV/spaaace --branch tutorial
```

## The Components of a Networked Game

The networked game is architected around the following components:

* **The server**.  Represented by the `ServerEngine` class.
* **The clients**.  Represented by the `ClientEngine` class.
* **The game logic**.  Represented by the `GameEngine` class.
* **Multiple game objects**.  The `DynamicObject` is the base class for all kinds of game objects.
* **Synchronization**.  Incheon provides several ways to synchronize between the server and the clients.  The game developer must configure which synchronization method works best for any given game.

As you write your game, you will need to implement
your own extensions (sub-classes) of the classes above.  But most of the interesting
stuff will happen in your extension of GameEngine.

## Basic Flow

The basic flow of the game can be seen as a sequence of *game steps*.
Steps will be executed both on the server and the client.  Each step is numbered,
and depending on the synchronization strategy, clients may be executing a given
step before the server has executed it (i.e. extrapolation) or after (i.e. interpolation).
Ideally, a given step _N_ represents the same point in game play on both the server
and the client.  But this is not always the case.

### Server Flow:

The server main entry point is a simple javascript file which initializes an instance of an extended `ServerEngine` class and an instance of an extended `GameEngine` class. In our tutorial the file is called [`main.js`](https://github.com/OpherV/spaaace/blob/tutorial/main.js).  The entry point starts the serverEngine instance.

The server engine schedules a `step` function to be called at a regular interval.  The
flow is:
* ServerEngine - start of a single server step
  * GameEngine - process any inputs that arrived
  * GameEngine - start of a single game step
    * PhysicsEngine - handle physics step
  * For each connected player P_i_
    * transmit a "world update" to player P_i_

### Client Flow:
* ClientEngine - start of a single client step
  * check inbound messages / world updates
  * capture inputs that have occurred since previous step
  * transmit inputs to server
  * handle inputs locally
  * GameEngine - start of a single game step
    * PhysicsEngine - handle physics step
      * For each object in the world O_i_:
        * update the render object for O_i_
    * Renderer - do render

## Step 1: main.js and the ServerEngine

### Build your own ServerEngine class:

The first step is to build your own ServerEngine-derived class.  For this tutorial
you can look at file [`src/server/SpaaaceServerEngine.js`](https://github.com/OpherV/spaaace/blob/tutorial/src/server/SpaaaceServerEngine.js)

This file does the following:

1. handle player-connected logic by creating a ship for the new player
1. handle player-disconnected logic by removing the ship of the disconnected player

### Build your the main entry point:

The next step is to write the server entry code.  For this tutorial the corresponding
file is [`main.js`](https://github.com/OpherV/spaaace/blob/tutorial/main.js)

The file does the following:

1. create an express server and configure the root route '/'
1. create a socketIO handler
1. create an instance of SpaaaceServerEngine
1. create an instance of SpaaaceGameEngine
1. start the serverEngine instance

Sample entry code will look like this:
```javascript
'use strict';

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
const SpaaaceServerEngine = require(path.join(__dirname, 'src/server/SpaaaceServerEngine.js'));
const SpaaaceGameEngine = require(path.join(__dirname, 'src/common/SpaaaceGameEngine.js'));
const SimplePhysicsEngine = require('incheon').physics.SimplePhysicsEngine;

// Game Instances
const physicsEngine = new SimplePhysicsEngine({ collisionOptions: { COLLISION_DISTANCE: 40 } });
const gameEngine = new SpaaaceGameEngine({ physicsEngine, traceLevel: 1 });
const serverEngine = new SpaaaceServerEngine(io, gameEngine, { debug: {} });

// start the game
serverEngine.start();
```

## Step 2: the GameEngine

To implement the game logic, you must create a new class which extends
GameEngine class.  This is where your game mechanics (a.k.a. game rules,
    a.k.a.  business logic) are implemented.
Remember that this code will execute on the server
as well as on each client.

For this tutorial, take a look at [`src/common/SpaaaceGameEngine.js`](https://github.com/OpherV/spaaace/blob/tutorial/src/common/SpaaaceGameEngine.js)
The game engine logic has three major tasks:

1. to extend the `processInput()` method.  This is the logic which handles new user input such as movement, firing, activate ability, etc.  In the sample code the `processInput()` method handles the keyboard inputs "up", "right", "left", "space".  The inputs will cause the spaceship to accelerate, turn right or left, or to fire a missile.
1. `makeShip()`.  Creates a new ship, as a result of a new connection received on the server.
1. `makeMissile()`.  Create a new missile, as a result of one ship firing.
1. `destroyMissile()`.  Remove a missile.

## Step 3: `clientMain.js`, `ClientEngine`, and `Renderer`

The client entry code is different in several ways from the server.  First
it will need a renderer, it will need to configure a synchronization strategy,
and it will create and start a client engine instance.

The full sample code is in [`src/client/clientMain.js`](https://github.com/OpherV/spaaace/blob/tutorial/src/client/clientMain.js) and is roughly implemented as follows:

```javascript
// default options, overwritten by query-string options
// is sent to both game engine and client engine
const defaults = {
    traceLevel: 1,
    delayInputCount: 3,
    clientIDSpace: 1000000,
    syncOptions: {
        sync: qsOptions.sync || 'extrapolate',
        localObjBending: 0.6,
        remoteObjBending: 0.6
    }
};
let options = Object.assign(defaults, qsOptions);

// create a client engine and a game engine
const physicsEngine = new SimplePhysicsEngine({ collisionOptions: { COLLISION_DISTANCE: 25 } });
const gameOptions = Object.assign({ physicsEngine }, options);
const gameEngine = new SpaaaceGameEngine(gameOptions);
const clientEngine = new SpaaaceClientEngine(gameEngine, options);
```

## Step 4: DynamicObjects

Your game objects, including monsters, spaceships, zombies, and bosses, all extend
the `DynamicObject` class.  This base class is a
serializable class, meaning that the server can serialize any instance of the class
(or sub-classes) into a binary object, transmit it to the clients.  The dynamic
object instances
must be serializable so that the server can send updates to the clients.

Take a look at [`src/common/Ship.js`](https://github.com/OpherV/spaaace/blob/tutorial/src/common/Ship.js) and
[`src/common/Missile.js`](https://github.com/OpherV/spaaace/blob/tutorial/src/common/Missile.js).  In both files
you will find that the base class provides most of the needed logic for movement,
synchronization, and that the extended classes can be quite simple.

## Step 5: Putting it all together

For the full game, you will need to create a [`package.json`](https://github.com/OpherV/spaaace/blob/tutorial/package.json) file, and [`index.html`](https://github.com/OpherV/spaaace/blob/tutorial/index.html) file,
examples of which are available in the **tutorial** branch of the [spaaace](https://github.com/OpherV/spaaace/tree/tutorial) repository.

To run the server, you simply run `npm start`.  
The server has two roles: **(1)** it acts as an HTTP server, serving index.html to clients
which connect to the game;
and **(2)** it also handles communication on a socket, and synchronizes the game on that
socket.

## Game Events

It is good programming practice to implement your code using event handlers,
so that it is clear what each chunk of logic is handling.

The full list of events is available in the API, so we will only list the most
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
gameEngine.trace.info(`this just happened: ${foobar()}`);
```

By default, Incheon already traces a lot of information, describing
the progress of the game and each step in detail.
The traces are text files, written on the server side.  The server trace
file is called **server.trace** and the client trace files are called **client._n_.trace**
where **_n_** is the player's id.

In our tutorial example, the query-string parameters become options which are
passed to the game engine constructor.  So the client-side trace can be activated
from the query string, simply by setting the parameter `&traceLevel=0` on the query
string.


## Configuration Options

Not written yet.
