**Incheon is a general purpose low latency game server based on Node.JS and Socket.IO**

Still in early development. Check back with me soon :P

Things to do:

* Separate ClientEngine from SpaaaceEngine
* Generalize client side prediction
* Optimize what goes over the wire:
    * Only dirty items get sent, with periodic sync
    * Option to specify incremental updates
    * client to server should also be binary
* Package as NPM
* seperate Spaace to a different repo using the NPM package