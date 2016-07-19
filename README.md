***Incheon is a general purpose low latency game server based on Node.JS and Socket.IO***

Still in early development. Check back with us soon :P

**Features:**

* Somewhat opinionated, letting you quickly develop your game without much hassle
* Server to client communication:
    * Communication is all binary
    * A game engine can opt-in to which object properties are transported
* Intelligent sync strategies for lag handling:
    * Client side prediction for player-controlled objects (snap, gradual snap)
    * Update interpolation for non-player objects
* Provides API for dynamic game-world objects
    * game worlds with physics engines (currently only physijs)
    * game worlds with reduced-physics, which track position, velocity, orientation, momentum (linear and angular).

Things to do:

* Allow general messages (not just world updates)
* Input validation (check player can control ship)
* Implement more types of lag compensation
* Optimize what goes over the wire:
    * Only dirty items get sent, with periodic sync
    * Option to specify incremental updates
    * client to server should also be binary
* Recording and replaying sessions
* tests tests tests


Caveats:

* Due to websocket limitations, only TCP and no UDP :(

**The Step Sequence**

The fundamental sequence of each (client-side) step is organized as follows:

1. [clientEngine] process inputs
2. [clientEngine] handle all inbound messages
3. [clientEngine] handle outbound inputs
4. [clientEngine:gameEngine] stepCount++
5. [clientEngine:gameEngine] physicsEngine.step
6. [clientEngine:gameEngine] updateGameWorld: for each object->step
7. [clientEngine] render.draw
