

# Release Notes for Lance

## Release 3.0.0 - July 2018

* 2D Physics Support via P2
* New sample game Asteroids
* Interpolation mode
* Common bending code

## Release 2.0.0 - February 2018

### New Features

* new netscheme data type: *STRING*.  Will only be broadcast if it changed since last broadcast.
* PhysicsEngine no longer initialized in two places.  It is initialized in the GameEngine
* Implemented HSHG collision detection for SimplePhysics
* Implemented ClientEngine standaloneMode for network-less testing of game engines
* New KeyboardControls class to help with sending key-based input
* Moved to es6 modules on all games
* ES6 Modules: Modules are imported using the "import from" construct.  For example import GameEngine from 'lance/GameEngine' instead of const GameEngine = require(...)
* ES6 Modules: Games must configure webpack.config.js.  See sample game
* ES6 Modules: Babel must be configured in order to run es6 modules on node server-side, by creating a .babelrc file.  See sample game
* Renderer-controlled game loop support: the physics engine is asked to step forwards by dt, where dt is the time between current frame render and last frame render
* full-sync support for updating all game objects when new player connects
* Renderer refactored as a singleton, and instantiated only on client
* Render objects and Physics objects are now sub-objects of the GameObject

### Breaking Changes

* All classes are now in ES6 format instead of CommonJS
* `PhysicsEngine` should no longer be instantiated in the Server `main.js` and in the client entry point.  Rather, it should be instantiated in the `GameEngine` subclass for your game.
* `PhysicsEngine` constructor now does all initialization. Use of `init` function is deprecated.
* `GameEngine` step method cannot be called without passing the `isReenact` argument.  Games which override the `step` method must pass this argument when calling the super method.
* `GameObject` New `onRemoveFromWorld` to mirror `onAddToWorld`
* Objects are now instantiated with a reference to the gameEngine, and get and ID automatically
* Method `isOwnedByPlayer` moved from `clientEngine` to `GameEngine`, and the `clientEngine` now sets the `playerId` in the `gameEngine`. `GameObject` constructor is therefore: constructor(gameEngine, options, props) and must call the super constructor correspondingly
* The `GameWorld.getPlayerObject()` method has been removed, you can get the player objects using the `GameWorld.query()` method, passing a `playerId` attribute.
* constructors of `DynamicObject` and `PhysicalObject` have changed to the following: gameEngine, options, and props.

## Release 1.0.1

### Breaking Changes

1. Event `preInput` was renamed to `processInput`, `client__processInput`, `server__processInput`.  `postInput`. This is a breaking change but no one actually used these events.

## Release 1.0.0 - March 2017

### New Features

* Server only sends updates for objects which changed
* **A-Frame** support
* **Cannon.js** support
* **3D** support


### Breaking Changes

Note that this is a major release update, which breaks current
games.  To upgrade to this latest major **release 1.0.0**, you will need
to apply the following changes:

1. Option `frameRate` has been renamed to `stepRate`.
2. `ClientEngine` constructor receives a third argument, a `Renderer` class.  Not a `Renderer` instance but the class itself.
3. Class `Point` has been removed.  Replaced by `TwoVector` and `ThreeVector`.
4. `DynamicObject` no longer has attributes `x`, `y`, `velX`, `velY`.  instead it has attributes `position` and `velocity` which are instances of `TwoVector`.  The `DynamicObject` constructor also has changed to receive arguments `position` and `velocity`.
5. The concept of bending has been redefined so that 0.0 means no bending
towards the server value, and 1.0 means total bending towards the server
value until the next server update.
