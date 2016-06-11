***Incheon is a general purpose low latency game server based on Node.JS and Socket.IO***

Still in early development. Check back with me soon :P

**Features:**

* Somewhat opinionated, letting you quickly develop your game without much hassle

* Server to client communication:
    * Communication is all binary
    * A game engine can opt-in to which object properties are transported

Things to do:

* Separate ClientEngine from SpaaaceEngine
* Generalize client side prediction
* Input validation (check player can control ship)
* Optimize what goes over the wire:
    * Only dirty items get sent, with periodic sync
    * Option to specify incremental updates
    * client to server should also be binary
* Package as NPM
* seperate Spaace to a different repo using the NPM package
* Recording and replaying sessions
* tests tests tests