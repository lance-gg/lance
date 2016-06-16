***Incheon is a general purpose low latency game server based on Node.JS and Socket.IO***

Still in early development. Check back with me soon :P

**Features:**

* Somewhat opinionated, letting you quickly develop your game without much hassle

* Server to client communication:
    * Communication is all binary
    * A game engine can opt-in to which object properties are transported
* Intelligent sync strategies for lag handling:
    * Client side prediction for player-controlled objects (snap, gradual snap)
    * Update interpolation for non-player objects

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