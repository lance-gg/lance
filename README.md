<img src="https://cloud.githubusercontent.com/assets/3951311/24590344/0b7748b8-17f4-11e7-84fc-d24c44c7a27a.jpg" style="width: 100%" alt="Lance logo">

# [Lance](https://lance-gg.github.io/) is a real-time multiplayer game server

It provides an extendible Node.JS based server, on which game logic runs, as well as a client-side library
which synchronizes the client's game state with the server game state.  In order
to provide a smooth visual experience for each connected client, Lance implements
efficient networking methods, position interpolation and extrapolation, user input
coordination, shadow objects, physics and pseudo-physical movement, automatic
handling of network spikes.

Lance aims to optimize the player's visual experience, while providing
a simple development model which is highly configurable and easy to analyze
and debug.

## Features:

* Focus on writing your game. Lance takes care of the netcode
* Can support any type of game or genre  
* Optimized networking
    * TCP via websockets
    * Communication is packed and serialized into binary
    * Automatic handling of network spikes with step correction
* Intelligent sync strategies for lag handling
    * Extrapolation (client side prediction) with step re-enactment or:
    * Interpolation for optimal object motion
* Tools for debugging and tracing

More features in the pipeline:

* UDP via WebRTC
* Full-stack testing suite
* Replay saving
* More physics engines

## That's so neat! Where do I start?

The official [Lance documentation](https://lance-gg.github.io/docs_out/index.html) contains articles on theory and rationale, as well as the structure and architecture of the project.

## Something went wrong! I need help!

If you're not exactly sure how to do something, [Stack Overflow](http://stackoverflow.com/questions/tagged/lance) is your friend.

If you've encountered a bug and it's not already in the [issues page](https://github.com/lance-gg/lance/issues), open a new issue.

