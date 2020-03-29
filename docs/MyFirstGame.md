This tutorial takes about 45 minutes. It will guide you in building the simplest JavaScript multiplayer networked game, [Pong](https://en.wikipedia.org/wiki/Pong). It starts with a walk-through of environment setup, and then proceeds with the writing of client code, server code, and game logic.

![Pong](https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Pong.png/220px-Pong.png)

## Setting up the Environment

The creation of a new game starts by cloning boilerplate code:

```shell
$ git clone https://github.com/lance-gg/tinygames.git
$ cd tinygames/boilerplate
$ npm install
```

The entire tutorial will be limited to editing a single file, `src/common/Game.js` for the sake of simplicity.  All the Pong game logic is implemented in this one file.  However, you may want to look around. The boilerplate directory includes a `dist/index.html` file, which will be served to the clients, and a `main.js` file, which is the entry point of the node.js server.  `src/client/clientEntryPoint.js` is the entry point of the client.  The game code is inside the `src` directory, and more advanced games will take advantage of the sub-directories `client`, `server`, and `common` to structure the code.

Take a look at `webpack.config.js` which shows how the game is packaged for clients, and `babel.config.js` shows how the game is built for the server.


## Step 1: Add additional imports

Open the file `src/common/Game.js` with your favorite editor, and find the `import { GameEngine, BaseTypes, DynamicObject,...` line. Remove the line, and replace it with this instead:

```javascript
import { GameEngine, BaseTypes, DynamicObject, SimplePhysicsEngine, TwoVector, KeyboardControls } from 'lance-gg';
```

This will add `TwoVector` and `KeyboardControls` modules which this pong game uses in later steps.


## Step 2: Create the Game Object Classes

There are only two kinds of objects in Pong, the paddle and the ball.
These classes Paddle and Ball are sub-classes of the `DynamicObject` class, and are quite simple.  Open the file `src/common/Game.js` with your favorite editor, and find the *GAME OBJECTS* section.  Remove the class `YourGameObject` and add the following two classes instead.


### The Paddle Game Object
The Paddle class has a constructor, and a netScheme.  The netScheme lists which attributes need to be synchronized between the server and the clients.  In this game we will synchronize the health of the paddle to all clients.  The `syncTo` method copies netScheme attributes from another object and is required by Lance. Note that we also declared the constants PADDING, WIDTH, HEIGHT, PADDLE_WIDTH and PADDLE_HEIGHT which will be used later in the game logic.

```javascript
const PADDING = 20;
const WIDTH = 400;
const HEIGHT = 400;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 50;
class Paddle extends DynamicObject {

    constructor(gameEngine, options, props) {
        super(gameEngine, options, props);
    }

    static get netScheme() {
        return Object.assign({
            health: { type: BaseTypes.TYPES.INT16 }
        }, super.netScheme);
    }

    syncTo(other) {
        super.syncTo(other);
        this.health = other.health;
    }
}
```

### The Ball Game Object
The Ball class is only slightly more complicated than the Paddle
class.  It has no netScheme attributes, but it does have a *bending* property.  The default bending properties indicate that the client object's position should gradually *bend* towards the server object's position at a rate of 80% each time the server sends position updates.  In the game of Pong, the Ball's velocity *should not* bend at all, because the ball's velocity can change suddenly as it hits a wall or a paddle.

```javascript
class Ball extends DynamicObject {

    constructor(gameEngine, options, props) {
        super(gameEngine, options, props);
    }

    // avoid gradual synchronization of velocity
    get bending() {
        return { velocity: { percent: 0.0 } };
    }

    syncTo(other) {
        super.syncTo(other);
    }
}
```

## Step 3: Implement a GameEngine Sub-Class

The **GameEngine** sub-class is called **Game**. It runs on both the server and the client, and executes the game's logic.  The client runs the game engine to predict what will happen, but the server execution is the true game progress, overriding what the clients might have predicted.

For Pong, we will need to bounce the ball around the board, and check if it hit a paddle.  We will also need to respond to the user's up/down inputs. Find the GAME ENGINE section, which defines the *GameEngine* sub-class.  The *Game* class implements the actual logic of the game.  

### The Constructor and Registering your Game Objects
The methods are **constructor()** and **registerClasses()**. The constructor creates a physics engine, and registers event handler functions for the game. The method **registerClasses()** registers the list of DynamicObject sub-classes with the Lance serializer.

```javascript
constructor(options) {
    super(options);
    this.physicsEngine = new SimplePhysicsEngine({ gameEngine: this });

    // common code
    this.on('postStep', this.gameLogic.bind(this));

    // server-only code
    this.on('server__init', this.serverSideInit.bind(this));
    this.on('server__playerJoined', this.serverSidePlayerJoined.bind(this));
    this.on('server__playerDisconnected', this.serverSidePlayerDisconnected.bind(this));

    // client-only code
    this.on('client__rendererReady', this.clientSideInit.bind(this));
    this.on('client__draw', this.clientSideDraw.bind(this));
}

registerClasses(serializer) {
    serializer.registerClass(Paddle);
    serializer.registerClass(Ball);
}
```

### The Game Logic
Update the method **gameLogic()**, which was registered to run on the **postStep** event, with the code below.  This method is executed after the ball has moved.  It contains **all the core pong game logic**: it runs after every game step, and checks if the ball has hit any wall, or any paddle, and decides if a player has scored.

```javascript
gameLogic() {
    let paddles = this.world.queryObjects({ instanceType: Paddle });
    let ball = this.world.queryObject({ instanceType: Ball });
    if (!ball || paddles.length !== 2) return;

    // CHECK LEFT EDGE:
    if (ball.position.x <= PADDING + PADDLE_WIDTH &&
        ball.position.y >= paddles[0].y && ball.position.y <= paddles[0].position.y + PADDLE_HEIGHT &&
        ball.velocity.x < 0) {

        // ball moving left hit player 1 paddle
        ball.velocity.x *= -1;
        ball.position.x = PADDING + PADDLE_WIDTH + 1;
    } else if (ball.position.x <= 0) {

        // ball hit left wall
        ball.velocity.x *= -1;
        ball.position.x = 0;
        console.log(`player 2 scored`);
        paddles[0].health--;
    }

    // CHECK RIGHT EDGE:
    if (ball.position.x >= WIDTH - PADDING - PADDLE_WIDTH &&
        ball.position.y >= paddles[1].position.y && ball.position.y <= paddles[1].position.y + PADDLE_HEIGHT &&
        ball.velocity.x > 0) {

        // ball moving right hits player 2 paddle
        ball.velocity.x *= -1;
        ball.position.x = WIDTH - PADDING - PADDLE_WIDTH - 1;
    } else if (ball.position.x >= WIDTH ) {

        // ball hit right wall
        ball.velocity.x *= -1;
        ball.position.x = WIDTH - 1;
        console.log(`player 1 scored`);
        paddles[1].health--;
    }

    // ball hits top or bottom edge
    if (ball.position.y <= 0) {
        ball.position.y = 1;
        ball.velocity.y *= -1;
    } else if (ball.position.y >= HEIGHT) {
        ball.position.y = HEIGHT - 1;
        ball.velocity.y *= -1;
    }
}
```

### Handling User Inputs
The method **processInput()** is executed on the server, as it collects inputs from the various clients over the network and applies them to the game.  For example, if it receives the input string "up" from player 1, then it will change the corresponding paddle to move up by 5 pixels. Modify the **processInput()** method to match the following:

```javascript
processInput(inputData, playerId) {
    super.processInput(inputData, playerId);

    // get the player paddle tied to the player socket
    let playerPaddle = this.world.queryObject({ playerId });
    if (playerPaddle) {
        if (inputData.input === 'up') {
            playerPaddle.position.y -= 5;
        } else if (inputData.input === 'down') {
            playerPaddle.position.y += 5;
        }
    }
}
```

## Step 4: Server-Only Code

The server engine will initialize the game engine when the game is started, and handle player connections and "disconnections".

### Server-Side Game Initialization
Create two paddles, a ball, and add these objects to the game world. Provide these objects' positions and velocities. This method will be called only on the server. Add the following **serverSideInit()** method:

```javascript
serverSideInit() {

    // create the paddle objects
    this.addObjectToWorld(new Paddle(this, null, { position: new TwoVector(PADDING, 0) }));
    this.addObjectToWorld(new Paddle(this, null, { position: new TwoVector(WIDTH - PADDING, 0) }));
    this.addObjectToWorld(new Ball(this, null, {
        position: new TwoVector(WIDTH /2, HEIGHT / 2),
        velocity: new TwoVector(2, 2)
    }));

}
```

### New Client Connections
The methods **serverSidePlayerJoined()** and **serverSidePlayerDisconnected()** were previously registered to handle connection events.  They attach players to the paddles when they join or disconnect.  Fill out the following two methods:

```javascript
// attach newly connected player to next available paddle
serverSidePlayerJoined(ev) {
    let paddles = this.world.queryObjects({ instanceType: Paddle });
    if (paddles[0].playerId === 0) {
        paddles[0].playerId = ev.playerId;
    } else if (paddles[1].playerId === 0) {
        paddles[1].playerId = ev.playerId;
    }
}

serverSidePlayerDisconnected(ev) {
    let paddles = this.world.queryObjects({ instanceType: Paddle });
    if (paddles[0].playerId === ev.id) {
        paddles[0].playerId = 0;
    } else if (paddles[1].playerId === ev.id) {
        paddles[1].playerId = 0;
    }
}
```

## Step 5: Client-Only Code

The client-side code must initialize the client, and draw the game on the screen on each render-frame. First, let's add some objects in the HTML file, found in `dist/index.html`.

### HTML Elements

Update the file `dist/index.html` to include DIV elements for the ball and the paddles:

```html
<html>
    <head>
        <title>Another awesome Lance multiplayer network game</title>
        <script src="bundle.js" type="text/javascript"></script>
    </head>
    <body>
        <div style="width: 400px; height: 400px; background: black">
            <div style="position:absolute;width:10px;height:50px;background:white" class="paddle1"></div>
            <div style="position:absolute;width:10px;height:50px;background:white" class="paddle2"></div>
            <div style="position:absolute;width:5px; height:5px;background:white" class="ball"></div>
        </div>
    </body>
</html>
```

The rendering, in our case, will update HTML elements representing the paddles and the ball:

### Initialization and Draw on the Client
Fill out the following two methods.  In `clientSideInit()` we bind the keyboard buttons "up" and "down" to emit events called "up" and "down", respectively. In `clientSideDraw()` we update the positions of HTML elements for the paddles and the ball.

```javascript
clientSideInit() {
    this.controls = new KeyboardControls(this.renderer.clientEngine);
    this.controls.bindKey('up', 'up', { repeat: true } );
    this.controls.bindKey('down', 'down', { repeat: true } );
}

clientSideDraw() {

    function updateEl(el, obj) {
        let health = obj.health>0?obj.health:15;
        el.style.top = obj.position.y + 10 + 'px';
        el.style.left = obj.position.x + 'px';
        el.style.background = `#ff${health.toString(16)}f${health.toString(16)}f`;
    }

    let paddles = this.world.queryObjects({ instanceType: Paddle });
    let ball = this.world.queryObject({ instanceType: Ball });
    if (!ball || paddles.length !== 2) return;
    updateEl(document.querySelector('.ball'), ball);
    updateEl(document.querySelector('.paddle1'), paddles[0]);
    updateEl(document.querySelector('.paddle2'), paddles[1]);
}
```

## Step 6: Running the Game

Once everything has been put together the end result should look like
the pong sub-directory in the same repository.

NOTE: If you prefer to see a clean working copy, go to the pong sub-directory:
```shell
cd ../pong
npm install
```

To run the game you must first build the JavaScript bundle.  The `npm install` command above already did this for you, but we changed the code, so you must rebuild by executing:

```shell
npm run build
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
of a Lance multiplayer networked game.
