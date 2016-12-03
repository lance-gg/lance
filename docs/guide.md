# Architecture of a Multiplayer Game



# Overview

The architecture of a multiplayer game must meet the requirements and challenges presented in the prologue "Why is making a multiplayer game so hard".  The architecture cannot wish away these facts: that network delays exist, the delay durations are not consistent or predictable, that players can suddenly disconnect, or that client code cannot be trusted.

These requirements lead to some basic architectural principles:

1. Each game instance will have a single server where the actual game progress and decisions are played out.

2. A client will always be out-of-sync with the server, and will need to be able to adjust itself to server decisions.

3. In order to provide a smooth playing experience, a client will need to implement either some predictive calculation (extrapolation), or otherwise present a somewhat out-of-date state to the end user (interpolation).

The main components of a networked game are:

* The **server**. Represented in Incheon by a singleton instance of the *ServerEngine* class.

* The **clients**. Represented in Incheon by multiple instances of the *ClientEngine* class.

* The **game logic**. Represented in Incheon by the* **GameEngine* class.

* The **game world**, which includes multiple **game objects**. The Incheon *DynamicObject* is the base class for all kinds of game objects.

* The **renderer**.  A component which draws the game visuals on every iteration of the render loop.  In Incheon this is represented by the *Renderer* class.

* **Synchronization**. Incheon provides several ways to synchronize between the server and the clients. The game developer must configure which synchronization method works best for their specific game and use case.

As you develop  your game, you will need to implement your own extensions (sub-classes) of the classes above. The core game logic will be implemented in your extension of GameEngine.

The following diagram shows how these components connect in the overall architecture:

## Basic Flow

The basic flow of a game can be seen as a sequence of *game steps*. Steps will be executed both on the server and the client. Each step is numbered, and depending on the synchronization strategy, clients may be executing a given step before the corresponding server information has arrived at the client (i.e. extrapolation) or after (i.e. interpolation). Ideally, a given step *N* represents the same point in game play on both the server and the client. But this is not always the case.

The core game logic is implemented in the game engine, so a game step is simply a call to the game engine’s *step()* method.

## Server Flow

The server logic is implemented by the server engine, which must do the following: (1) it must initialize the game, (2) it must accept connections from players over a socket, (3) it must execute the game loop, by calling the game engine’s *step()* method at a fixed interval, and (4) it must broadcast regular updates to all the clients at a fixed interval.

The server engine schedules a step function to be called at a regular interval. The flow is:

* ServerEngine - *start of a single server step*

    * GameEngine - read and process any inputs that arrived from clients since the previous step

    * GameEngine - *start of a single game step*

        * PhysicsEngine - handle physics step

    * If it is time to broadcast a new sync

        * players.forEach(transmit a "world update")

## Client Flow

The client is more complicated than the server, for two reasons.  First it must listen to syncs which have arrived from the server, and reconcile the data with its own game state.  Second, it must invoke the renderer to draw the game state.

* ClientEngine - *start of a single client step*

    * check inbound messages / syncs

    * capture inputs that have occurred since previous step

    * transmit inputs to server

    * apply inputs locally

    * GameEngine - *start of a single game step*

        * PhysicsEngine - handle physics step

* ClientEngine - *start of a single render step*

    * Renderer - draw

# Game Engine

The Game Engine contains the core game logic.  It understands user inputs, and applies them to the game.  It will fire missiles, hit aliens, boost spaceships, and apply magic spells.  The primary game engine method is the step method, which progresses the game from step N to step N+1, given the inputs that arrived since step N-1.

When the game engine step has completed, each game object must have it’s new current position updated, along with health, power, and any other game attributes your game derives.

It is important to take note of the following architectural requirements:

1. The Game Engine may include some functions which will only run on the server, and these functions should be called directly by the server engine when necessary.  For example, there may be a function to handle the score reporting.

2. On clients which use extrapolated synchronization, a given game step is often re-enacted following the arrival of a sync from the server.  These "re-enactment" steps are marked with a flag.

Lastly, the game engine also provides a useful event emitter which reports on the progress of the game.  A typical game will use these events to trigger any required logic with specific timing. Events include pre-step, post-step, player-joined, object-added, etc.  Refer to the API for a complete list.

# Server Engine


The Server Engine is a relatively simple component.  As mentioned in the introduction, the server engine must do the following: (1) it must initialize the game, (2) it must accept connections from players over a socket, (3) it must execute the game loop, by calling the game engine’s *step()* method at a fixed interval, and (4) it must broadcast regular updates to all the clients at a fixed interval.

The game developer will extend this logic, by adding functions that log gameplay statistics, registering user activity, wins, losses, achievements.

Care must be taken on the following point: the server engine should not be used to contain game logic - that belongs in the game engine class.

# Client Engine


The Client Engine must run the game loop, just like the server engine.  However it also needs to handle game syncs which arrive from the server, and execute a render loop.

A deeper exploration of the game synchronization methods is addressed in a separate chapter.  The client will let the synchronization method take care of updating the game world in a way which appears visually smooth to the player.

Additionally, the client engine handles the following functions:

1. Apply user inputs locally, with a delay if so configured

2. Transmit user inputs to server

3. Handle changes in network delay, and step drift.  If the server is running faster (or slower) than the client, then the server is applying steps faster (or slower) than the client.  The client engine handles these situations by skipping steps or hurrying steps as required



# Renderer


The Renderer is a fully user-implemented component.  In the architecture of an Incheon multiplayer game, the renderer must render frames at the rate of the render-loop, as defined by the browser.  Incheon provides a full description of the game state in a list of game objects.  The renderer must then scan the game objects and render them, based on position attributes, and any other object attributes which are prescribed by the game.

# Game World and Game Objects


The Game Engine includes a reference to the Game World, which consists of the game state, and a list of Game Objects.  The Game World is essentially the data which is liable to change from one game step to the next, and must be sent on every sync to every client.

The game objects, as implemented in Incheon, are instances of game object classes, which are subclasses of the base DynamicObject class.  This base object is a serializable.  So for example, in a game of breakout, the implementation will have three game object classes: the Paddle, the Ball, and the Brick.  The game objects will include one instance of the Paddle class, one instance of a Ball class, and multiple instances of the Brick class.  (That much is true anyways of the simple version of the game, where there is only a single ball, and a single paddle, and no shooting). The Paddle, the Ball, and the Brick are subclasses of DynamicObject.

A game object class will define its "netscheme", which is a dictionary of attributes for this object.  The attributes listed in the netscheme will be those exact attributes which will be serialized by the server and broadcast to all clients on every sync.  The DynamicObject base class only implements positional attributes, so additional attributes such as power, energy, or health, must be specified in the netscheme.

Notes for the game developer:

1. Game Objects may be "physical".  In this case, the object has a velocity, orientation, and continuous-ranged position (i.e. the position is a floating-point value).

2. Game Objects may be "pseudo-physical".  In this case, the object’s position is a discrete value (i.e. an integer, or low-precision decimal), determined precisely by the count of movement inputs.

3. Some game objects may be user-controlled by a client, in that same client’s engine.  These objects may not need to be synchronized to server sync data, since the client information is always up-to-date.

4. Some game objects can be teleported (position translation) and others cannot.

5. Some game objects can have their velocity change suddenly and others cannot.

It is important for a game developer to understand exactly what types of objects are being used and what properties they have, in order to properly configure the synchronization.

# Serialization and Communication


As mentioned in previous chapters, the game world and its associated game objects must be packed on the server side, serialized, and broadcast to all clients at regular intervals.  These game world update are called syncs.

Serialization requires that each game object define those attributes which must be serialized on every sync.  This attribute list is known as the game object’s netscheme.  The larger a netscheme is, the more data will need to be transferred on every sync.  Therefore care should be taken to minimize the amount of data in the netscheme.

The serialization process allows for a hierarchy of objects.  This means that the netscheme of one object may include another object which has its own netscheme.

# Synchronization Methods: Interpolation


One way to synchronize the server and the clients is known as Interpolation.  In this method, the clients render steps which previously played out on the server.  The diagram below shows a typical sequence in an interpolated game.  Time is advancing downwards.  At the time when the server is playing out step 1026, the players are rendering the older step 1010.

This approach has an important advantage, and an important disadvantage.  The advantage is that each player has enough information available about the future in order to render visually smooth object motion.  If a sync arrived at step 1010, and another at step 1020, then the object positions at the intermediate steps can be interpolated.  The resulting visuals are smooth.

The disadvantage of this approach is that when a player input arrives on a client, the consequences of this input will only kick in at a later time, potentially causing noticeable lag between a user’s input and the visual response.  In the diagram above, an input that Player A submitted while Client A was at step 1010, will only get a visual response when Player A starts rendering objects at step 1029.

The time delay between the server and the clients is a tunable parameter.  Ideally one would choose the smallest delay possible such that there is still enough sync data to interpolate to.  A temporary spike in network delays will cause the client to stop rendering and wait for new data.  In order to recover from such spikes, the client should attempt to reduce the delay gradually.

Notes for the game developer:

1. Not all game progress can be interpolated.  Bouncing off walls, shooting, etc. are "atomic" steps which are not interpolatable.

2. Actions which are atomic must be explicitly marked as such, otherwise the game visuals will not make sense.

3. The delay in input response may mean that a given game is not a good match for interpolated synchronization.  In that case, extrapolation should be considered.  However, there are techniques which can make interpolation work nonetheless.  Real-world input delay is about 200ms.  There may be visual tricks that make this delay acceptable.  For example if the input boosts a rocket, the game might show a visual boost light up before the rocket actually starts accelerating.

4. The game engine may not need to run on the client at all, if all the information required for rendering is available in the server sync.

# Synchronization Methods: Extrapolation


A different approach to synchronization is to extrapolate the game’s progress on the client, in the absence of sync data from the server.  Once sync data does arrive from the server, a client must reconcile between the game state predicted on the client, and the game state that actually occurred on the server.

In the diagram above, while the server is playing out step 1026, the clients are simultaneously rendering step 1030, which didn’t happen yet on the server.  This implies that the clients used extrapolation to predict the future.

Extrapolation is tunable, just like interpolation, by setting the number of steps that a client should be ahead of the server.  Ideally, the client is just a little bit ahead, just enough so that when sync data arrives, the highest step information in the sync matches the current step played out on the client.

An input which is sent by a client may arrive before the server has started playing the corresponding step.  In this case the Server can be configured to wait for the input’s step.  Since the server will process the input at a later step, the client may want to impose an artificial delay before actually enacting the input locally.  This is another tunable parameter.

When a sync arrives at the client, the client must reconcile the predicted game state with the actual (server) game state.  This is performed as follows:

1. Client is at step N.

2. Roll back the state to the step described by the server in the sync, step M.

3. Re-enact all the steps between M and N by invoking the game engine’s step() method.

4. The game objects positions have shifted from the predicted value.  Revert back to the client’s expected position, but remember the required delta between the client and the server.

5. Apply the delta so that the object on the client gradually bends towards the correct position as indicated by the server.

    1. Not all the delta is applied.  A "bending factor" must be specified, to indicate how much of the delta should be applied.  A bending factor of 30% means that 30% of the correction will be applied until the next sync data arrives.

    2. The delta is not applied in a single step.  Rather, split the correction into incremental corrections that are applied until the next sync data arrives.

Notes for the game developer: Multiple complications arise from the extrapolation method.

1. **Re-enactment**.  Interpolation re-enacts the game steps, and sometimes it may re-enact many steps.  This means that the game engine must be capable of stepping through the same step multiple times.  These are known as re-enactment steps.  The step() method is passed an argument so that it can know when a step is a re-enactment step.

2. **Bending**.  The client’s objects positions gradually bend towards the server’s positions.  Velocity can also bend.  The game designer must choose bending values carefully.  Objects whose position can change suddenly (teleporting objects) will not bend well.  Objects whose velocity can change suddenly (impulse) should not have velocity bending.

3. **Shadow Objects.** The client may create an object which does not yet exist on the server.  For example, if a ship fires a missile, the client must render a missile, even though the missile object is yet to exist on the server.  Until the true missile object will be created on the server, the client will model the missile with a shadow object.

# Fine-Tuning and Debugging


<<< User must understand how to debug and investigate.  Seeing that the game objects are behaving in an unusual way can be very frustrating for the game developer, because the developer does not even know how to start the investigation.  The process involves narrowing down the problem to server-side or client-side, to a bug in the user’s code, to a mis-use of configuration, or network conditions. >>>
