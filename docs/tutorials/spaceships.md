***Incheon Game Tutorial***

**The Components of a Networked Game**

The networked game is architected around the following components:

* **The server**.  Represented by the `ServerEngine` class.
* **The client**.  Represented by the `ClientEngine` class.
* **The game logic**.  Represented by the `GameEngine` class.
* **The game object**.  Represented by the `DynamicObject` class.

In order to implement your game, you will need to implement
your own extensions to the classes above.  Most of the interesting
stuff will happen in your extension of GameEngine.

**Basic Flow**

The basic flow of the game can be seen as a sequence of steps.
Steps will be executed both on the server and the client.

**Step 1: main.js and the ServerEngine**

Implement a server engine  (worked example)

**Step 2: the GameEngine**

Implement a game engine

**Step 3: clientMain.js, ClientEngine, and RenderEngine**

Implement a client engine
```javascript
// create a client engine, a game engine, a synchronizer, and a renderer
const renderer = new SpaaaceRenderer();
const gameOptions = Object.assign({ renderer }, options);
const gameEngine = new SpaaaceGameEngine(gameOptions);
const spaaaceClientEngine = new SpaaaceClientEngine(gameEngine, options);
const synchronizer = new Synchronizer(spaaaceClientEngine);
```

**Step 4: DynamicObjects**

Implement dynamic objects

**Step 5: Putting it all together**

package.json, index.html

**Game Events**

**Traces & Debugging**

**Configuration Options**
