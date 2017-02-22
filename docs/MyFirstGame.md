This tutorial will guide you in building the simplest
javascript networked game, [Pong](https://en.wikipedia.org/wiki/Pong).  It starts with a walk-through of environment setup,
then proceeds with the writing of client code, server
code, and game logic.

![Pong](https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Pong.png/220px-Pong.png)

## Setting up the Environment

The creation of a new game starts by cloning boilerplate code:

```shell
git clone https://github.com/namel/incheongame.git
cd incheongame
npm install
```

You now have the basic directory structure of a game.  Look around.
The boilerplate includes an `index.html` file, which will be served
to the clients, and a `main.js` file, which is the entry point of the node server.
The game code is inside the `src` directory, divided into
sub-directories `client`, `server`, and `common`.

## Step 1: Create the Game Object Classes

We have two kinds of objects in Pong, the paddle and the ball.
These files extend the `DynamicObject` class, but are quite simple.
The boilerplate includes a sample game object class, in the file
`src/common/PlayerAvatar.js`

Create the following two classes in the `src/common` directory:

### src/common/Paddle.js
The Paddle class is a bare-bones object.  It is similar to
the sample `PlayerAvatar.js` object, except that it is called `Paddle`.

```javascript
'use strict';

const DynamicObject = require('incheon').serialize.DynamicObject;

class Paddle extends DynamicObject {

    static newFrom(sourceObj){
        let newPaddle = new Paddle();
        newPaddle.copyFrom(sourceObj);

        return newPaddle;
    }

    constructor(id, x, y) {
        super(id, x, y);
        this.class = Paddle;
    };
}
module.exports = Paddle;
```

### src/common/Ball.js
The Ball class is only slightly more complicated than the Paddle
class.  It adds two getters, which define "bending" properties.
The bending properties below indicate that the client object's position should
gradually *bend* towards the server object's position at a rate of 0.8
(80%) each time the server sends position updates.  The client object's
velocity should not bend at all, because the ball's velocity can change
suddenly as it hits a wall or a paddle.
We also give the Ball an initial velocity when it is created.
```javascript
'use strict';

const DynamicObject = require('incheon').serialize.DynamicObject;

class Ball extends DynamicObject {

    static newFrom(sourceObj){
        let newBall = new Ball();
        newBall.copyFrom(sourceObj);

        return newBall;
    }

    get bendingMultiple() { return 0.8; }
    get bendingVelocityMultiple() { return 0; }

    constructor(id, x, y) {
        super(id, x, y);
        this.class = Ball;
        this.velocity.set(2, 2);
    };
}
module.exports = Ball;
```

## Step 2: Implement the MyGameEngine class

The game engine class runs on both the server and the client,
and executes the game's logic.  The client runs the game engine to
predict what will happen, but the server execution is the true
game progress, overriding what the clients might have predicted.

For Pong, we will need to bounce the ball around the board, and check if it
hit a paddle.  We will also need to respond to the up/down inputs.

### src/common/MyGameEngine.js
The MyGameEngine class implements the actual logic of the game.
It does the following:
* **start**: define the "world" settings, and register the game logic to run as a post-step function.
Modify the start method to match the following:

```javascript
start() {

    super.start();

    this.worldSettings = {
        width: 400,
        height: 400,
        paddleWidth: 10,
        paddleHeight: 50,
        paddlePadding: 20
    };

    this.on('postStep', () => { this.postStepHandleBall(); });
}
```

* **processInput**: handle user inputs by moving the paddle up or down.
Modify the processInput method to match the following:

```javascript
processInput(inputData, playerId) {

    super.processInput(inputData, playerId);

    // get the player paddle tied to the player socket
    let playerPaddle;

    for (let objId in this.world.objects) {
        let o = this.world.objects[objId];
        if (o.playerId == playerId && o.class == Paddle) {
            playerPaddle = this.world.objects[objId];
            break;
        }
    }
    if (playerPaddle) {
        if (inputData.input === 'up') {
            playerPaddle.y -= 5;
        } else if (inputData.input === 'down') {
            playerPaddle.y += 5;
        }
    }
}
```

* **initGame**: create two paddles, a ball, and add these objects to the game world.  This method will be called only on the server.  Add the following initGame method:

```javascript
initGame() {
    // create the paddle objects
    this.player1Paddle = new Paddle(++this.world.idCount, this.worldSettings.paddlePadding, 0);
    this.player2Paddle = new Paddle(++this.world.idCount, this.worldSettings.width - this.worldSettings.paddlePadding, 0);
    this.ball = new Ball(++this.world.idCount, this.worldSettings.width / 2, this.worldSettings.height / 2);

    // associate paddels with the right players
    this.player1Paddle.playerId = 0;
    this.player2Paddle.playerId = 1;

    // add paddle objects to the game world
    this.addObjectToWorld(this.player1Paddle);
    this.addObjectToWorld(this.player2Paddle);
    this.addObjectToWorld(this.ball);
}
```

* **attachPaddle**: when the first player connects, he becomes the left paddle.  When a second player connects he becomes the right paddle.  Add the following method:

```javascript
attachPaddle(paddleId, playerId) {
    // which player?
    if (paddleId === 0) {
        this.player1Paddle.playerId = playerId;
    } else if (paddleId === 1) {
        this.player2Paddle.playerId = playerId;
    }
}
```

* **postStepHandleBall**: this method is executed after the ball has moved.  Check if the ball has hit a wall, or a paddle, and if a player has scored.  First add the object constructors at the top of the file:

```javascript
const Paddle = require('./Paddle');
const Ball = require('./Ball');
```

Now add the following methods:

```javascript
postStepHandleBall() {
    if (this.ball) {

        // LEFT EDGE:
        if (this.ball.x <= this.worldSettings.paddlePadding + this.worldSettings.paddleWidth &&
                this.ball.y >= this.player1Paddle.y &&
                this.ball.y <= this.player1Paddle.y + this.worldSettings.paddleHeight &&
                this.ball.velocity.x < 0) {

            // ball moving left hit player 1 paddle
            this.ball.velocity.x *= -1;
            this.ball.x = this.worldSettings.paddlePadding + this.worldSettings.paddleWidth + 1;
        } else if (this.ball.x <= 0) {

            // ball hit left wall
            this.ball.velocity.x *= -1;
            this.ball.x = 0;
            this.player2Score();
            console.log(`player 2 scored`);
        }

        // RIGHT EDGE:
        if (this.ball.x >= this.worldSettings.width - this.worldSettings.paddlePadding - this.worldSettings.paddleWidth &&
            this.ball.y >= this.player2Paddle.y &&
            this.ball.y <= this.player2Paddle.y + this.worldSettings.paddleHeight &&
            this.ball.velocity.x > 0) {

            // ball moving right hits player 2 paddle
            this.ball.velocity.x *= -1;
            this.ball.x = this.worldSettings.width - this.worldSettings.paddlePadding - this.worldSettings.paddleWidth - 1;
        } else if (this.ball.x >= this.worldSettings.width ) {

            // ball hit right wall
            this.ball.velocity.x *= -1;
            this.ball.x = this.worldSettings.width - 1;
            this.player1Score();
            console.log(`player 1 scored`);
        }

        // ball hits top
        if (this.ball.y <= 0) {
            this.ball.y = 1;
            this.ball.velocity.y *= -1;
        } else if (this.ball.y >= this.worldSettings.height) {
            // ball hits bottom
            this.ball.y = this.worldSettings.height - 1;
            this.ball.velocity.y *= -1;
        }
    }
}

player1Score() {}
player2Score() {}
```

The end result should be this [file](https://github.com/OpherV/netpong/blob/master/src/common/NetpongGameEngine.js).

## Step 3: Extend the MyServerEngine Class

The server engine will need to register the classes (`Ball` and `Paddle`)
with the serializer, so that they can be sent over the network.
This happens in the constructor.  It must initialize the game engine
when the game is started, and handle player connections and disconnections.

### src/server/MyServerEngine.js
```javascript
'use strict';

const ServerEngine = require('incheon').ServerEngine;

class MyServerEngine extends ServerEngine {

    constructor(io, gameEngine, inputOptions) {
        super(io, gameEngine, inputOptions);

        this.serializer.registerClass(require('../common/Paddle'));
        this.serializer.registerClass(require('../common/Ball'));
    }

    start(){
        super.start();

        this.gameEngine.initGame();

        this.players = {
            player1: null,
            player2: null
        };
    }

    onPlayerConnected(socket) {
        super.onPlayerConnected(socket);

        // attach newly connected player an available paddle
        if (this.players.player1 === null) {
            this.players.player1 = socket.id;
            this.gameEngine.attachPaddle(0, socket.playerId);
        } else if (this.players.player2 === null) {
            this.players.player2 = socket.id;
            this.gameEngine.attachPaddle(1, socket.playerId);
        }
    }

    onPlayerDisconnected(socketId, playerId) {
        super.onPlayerDisconnected(socketId, playerId);

        if (this.players.player1 == socketId) {
            console.log('Player 1 disconnected');
            this.players.player1 = null;
        } else if (this.players.player2 == socketId) {
            console.log('Player 2 disconnected');
            this.players.player2 = null;
        }
    }
}

module.exports = MyServerEngine;
```

## Step 4: the Client Code

The client-side code must implement a renderer, and a client engine.

The renderer, in our case, will simply update HTML elements created for
each paddle and the ball:

### src/client/MyRenderer.js
```js
'use strict';

const Renderer = require('incheon').render.Renderer;
const Paddle = require('../common/Paddle');
const Ball = require('../common/Ball');

class MyRenderer extends Renderer {

    constructor(gameEngine) {

        super(gameEngine);
        this.sprites = {};

        this.worldSettings = {
            width: 400,
            height: 400
        };
    }

    draw() {
        super.draw();

        // note - animating via the top attribute of a DOM element is a usually
        // bad practice, but used here for code brevity
        for (let objId of Object.keys(this.sprites)) {
            if (this.sprites[objId].el) {
                this.sprites[objId].el.style.top = this.gameEngine.world.objects[objId].y + 'px';
                this.sprites[objId].el.style.left = this.gameEngine.world.objects[objId].x + 'px';
            }
        }
    }

    addObject(objData, options) {
        let sprite = {};

        if (objData.class == Paddle) {
            sprite.playerId = objData.playerId;

            console.log(objData);

            if (objData.id == 1) {
                sprite.el = document.querySelector('.player1Paddle');
            } else if (objData.id == 2) {
                sprite.el = document.querySelector('.player2Paddle');
            }
        } else if (objData.class == Ball) {
            sprite.el = document.querySelector('.ball');
        }

        this.sprites[objData.id] = sprite;
        return sprite;
    }

    removeObject(obj) {
    }

}

module.exports = MyRenderer;
```

The client engine must register the Paddle and Ball classes just like the
server did, and keep references to the objects created.

### src/client/MyClientEngine.js
```javascript
const ClientEngine = require('incheon').ClientEngine;
const MyRenderer = require('../client/MyRenderer');
const Synchronizer = require('incheon').Synchronizer;

const Ball = require('../common/Ball');


class MyClientEngine extends ClientEngine{
    constructor(gameEngine, options) {
        super(gameEngine, options);

        // initialize renderer
        this.renderer = new MyRenderer(gameEngine);

        this.serializer.registerClass(require('../common/Paddle'));
        this.serializer.registerClass(require('../common/Ball'));

        this.gameEngine.on('client__preStep', this.preStep.bind(this));

        this.gameEngine.on('objectAdded', (object) => {
            if (object.id == 1) {
                this.gameEngine.player1Paddle = object;
            } else if (object.id == 2) {
                this.gameEngine.player2Paddle = object;
            } else if (object.class == Ball) {
                this.gameEngine.ball = object;
            }

        });

        // keep a reference for key press state
        this.pressedKeys = {
            down: false,
            up: false
        };

        let that = this;
        document.onkeydown = (e) => { that.onKeyChange(e, true); };
        document.onkeyup = (e) => { that.onKeyChange(e, false); };
    }

    // our pre-step is to process all inputs
    preStep() {
        // continuous press
        if (this.pressedKeys.up) {
            this.sendInput('up');
        }

        if (this.pressedKeys.down) {
            this.sendInput('down');
        }
    }

    onKeyChange(e, isDown) {
        e = e || window.event;

        if (e.keyCode == '38') {
            this.pressedKeys.up = isDown;
        } else if (e.keyCode == '40') {
            this.pressedKeys.down = isDown;
        } else if (e.keyCode == '37') {
            this.pressedKeys.left = isDown;
        } else if (e.keyCode == '39') {
            this.pressedKeys.right = isDown;
        }
    }

}

module.exports = MyClientEngine;

```

## Step 4: the Client Visuals

The client visuals code are simple HTML objects so we don't discuss them in detail.  See the  [HTML](https://github.com/namel/incheongame/blob/netpong/index.html)  and [CSS](https://github.com/namel/incheongame/blob/netpong/stylesheets/style.css).


## Step 5: Running the Game

Once everything has been put together the end result should look like
the following [repository](https://github.com/opherv/netpong).

To get a working copy, run:
```shell
git clone https://github.com/opherv/netpong.git
cd netpong
npm install
```

To run the game you must first build the javascript bundle.  The `npm install`
command above already did this for you, but if you change code, you can rebuild by
executing:
```shell
npm run postinstall
```

To run the game, type:
```shell
npm start
```

Open two browser windows and point them to the local host.  The URL is
`http://127.0.0.1:3000/` on windows, and `http://localhost:3000/`
on a Mac.

## Next Steps

Your next steps might be to get a deeper understanding by going through
the Spaceships Tutorial, which introduces the concepts and components
of an Incheon networked game.
