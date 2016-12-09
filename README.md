[![Build Status](https://travis-ci.org/OpherV/Incheon.svg?branch=master)](https://travis-ci.org/OpherV/Incheon) [![Inline docs](http://inch-ci.org/github/opherv/incheon.svg?branch=develop)](http://inch-ci.org/github/opherv/incheon)

![Incheon Logo](https://cloud.githubusercontent.com/assets/3951311/21020499/6f125344-bd7d-11e6-86e4-a4bb16b32f2a.png)

#[Incheon](http://incheon.gg) is a real-time multiplayer game server#

It provides an extendible Node.JS based server, on which game logic runs, as well as a client-side library
which synchronizes the client's game state with the server game state.  In order
to provide a smooth visual experience for each connected client, Incheon implements
efficient networking methods, position interpolation and extrapolation, user input
coordination, shadow objects, physics and pseudo-physical movement, automatic
handling of network spikes.

Incheon aims to optimize the player's visual experience, while providing
a simple development model which is highly configurable and easy to analyze
and debug.

##See it in action##
An online demo is in the works! Stay tuned

##Features:##

* Focus on writing your game. Incheon takes care of the netcode
* Supports any type of game or genre  
* Optimized networking
    * TCP via websockets / UDP via WebRTC (soon)
    * Communication is packed and serialized into binary
    * Automatic handling of network spikes with step correction
* Intelligent sync strategies for lag handling
    * Extrapolation with step re-enactment on the clients, or:
    * Interpolation for optimal object motion
* API for dynamic game-world objects
    * game worlds with physics engines (currently only physijs)
    * game worlds with pseudo-physics, which track position, velocity, and orientation
* Proper API documentation, user guide, tutorials, and samples
* Tools for debugging and tracing

More features in the pipeline:

* UDP
* Full-stack testing suite
* More physics engines

##That's so neat! Where do I start?##

The official [Incheon documentation](http://docs.incheon.gg) contains articles on theory and rational, as well as the structure and architecture of the project.

If you feel like learning by doing you can start with first tutorial, [My first game: Pong](http://docs.incheon.gg/develop/tutorial-MyFirstGame.html) which contains step-by-step on implementation of a networked version of this classic game.

##Something went wrong! I need help!##

If you're not exactly sure how to do something, [Stack Overflow](http://stackoverflow.com/questions/tagged/incheon) is your friend.

If you've encountered a bug and it's not already in the [issues page](https://github.com/OpherV/Incheon/issues), open a new issue.

##I'd like to join in##

For discussing Incheon, multiplayer games or just hanging out you're invited to join us on [slack](http://incheongg.slack.com).

##Built something cool with Incheon?##

Please [Let us know](http://www.twitter.com/opherv)! We'd love to play it, and feature it on the [Incheon homepage](http://incheon.gg).
