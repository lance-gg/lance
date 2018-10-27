
The architecture of a multiplayer game must meet the requirements and challenges presented in the {@tutorial prologue} "why is making a multiplayer game so hard".  The architecture cannot wish away these facts: that network delays exist, the delay durations are not consistent or predictable, that players can suddenly disconnect, or that client code cannot be trusted.

These requirements lead to some basic architectural principles:

1. Each game instance will have a single server where the actual game progress and decisions are played out.

2. A client will always be out-of-sync with the server, and will need to be able to adjust itself to server decisions.

3. In order to provide a smooth playing experience, a client will need to implement either some predictive calculation (extrapolation), or otherwise present a somewhat out-of-date state to the end user (interpolation).

The main components of a networked game are:

* The **clients**. Represented in Lance by multiple instances of the **ClientEngine** class.  Clients collect inputs from the player and send them to the server.

* The **server**. Represented in Lance by a singleton instance of the **ServerEngine** class.  The server handles the user inputs, and sends updates to all clients.

* The **game logic**. Represented in Lance by the  **GameEngine** class.

* The **game world**, which includes multiple **game objects**. The Lance **GameObject** is the base class for all kinds of game objects.

* The **renderer**.  A component which draws the game visuals on every iteration of the render loop.  In Lance this is represented by the **Renderer** class.

* **Synchronization**. Lance provides several ways to synchronize between the server and the clients. The game developer must configure which synchronization method works best for their specific game and use case.

As you develop  your game, you will need to implement your own extensions (sub-classes) of the classes above. The core game logic will be implemented in your extension of GameEngine.

The following diagram shows how these components connect in the overall architecture:

![architecture](https://user-images.githubusercontent.com/3702763/36915030-e4612af8-1e57-11e8-81d5-fca3855d6fe5.jpg)

## The Game as a Sequence of Steps

The basic flow of a game can be seen as a sequence of *game steps*.  This is a basic concept which is true
for game development generally, and the concept works well for networked games as well.  During a single step, the
game progresses from time *T* to time *T + δt*.  The game engine will have to determine the state of the game
at time *T + δt* by applying physics, taking account of new user inputs, and applying the game mechanics logic.

In the context of multiplayer, networked games, the steps will be executed both on the server and the client. Each step is numbered, and depending on the synchronization strategy, clients may be executing a given step before the corresponding server information has arrived at the client (i.e. extrapolation) or after (i.e. interpolation). Ideally, a given step *N* represents the same point in game play on both the server and the client.

The core game logic is implemented in the game engine, so a game step is simply a call to the game engine’s `GameEngine::step()` method.

## Server Flow

The server logic is implemented by the server engine, which must do the following: (1) it must initialize the game, (2) it must accept connections from players over a socket, (3) it must execute the game loop, by calling the game engine’s `GameEngine::step()` method at a fixed interval, and (4) it must broadcast regular updates to all the clients at a fixed interval.

The server engine schedules a step function to be called at a regular interval. The flow is:

* ServerEngine - *start of a single server step*

    * GameEngine - read and process any inputs that arrived from clients since the previous step.  The inputs are handled by the `GameEngine::processInput()` method.

    * GameEngine - *start of a single game step*

        * PhysicsEngine - handle physics step

    * If it is time to broadcast a new sync

        * for each player: transmit a "world update"

## Client Flow

The client flow is more complicated than the server, for two reasons.  First it must listen to syncs which have arrived from the server, and reconcile the data with its own game state.  Second, it must invoke the renderer to draw the game state.

* ClientEngine - *start of a single client step*

    * check inbound messages / syncs

    * capture user inputs that have occurred since previous step.  Inputs are sent to the server by calling the method `ClientEngine::sendInput()`.

    * transmit user inputs to server

    * apply user inputs locally



* ClientEngine - *start of a single render step*

    * Renderer - draw event

        * GameEngine - *start of a single game step* - may need to be executed zero or more times, depending on the number of steps which should have taken place since the last render draw event

            * PhysicsEngine - handle physics step

Next: {@tutorial choosing_a_physics_engine}
