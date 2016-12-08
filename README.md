[![Build Status](https://travis-ci.org/OpherV/Incheon.svg?branch=master)](https://travis-ci.org/OpherV/Incheon) [![Inline docs](http://inch-ci.org/github/opherv/incheon.svg?branch=develop)](http://inch-ci.org/github/opherv/incheon)

***Incheon is a real-time multiplayer game engine based on Node.JS***

Incheon makes it possible to write real-time, multiplayer games in javascript.

It provides an extendible server, where the game runs, as well as a client-side library
which synchronizes the client's game state with the server game state.  In order
to provide a smooth visual experience for each connected client, Incheon implements
efficient networking methods, position interpolation and extrapolation, user input
coordination, shadow objects, physics and pseudo-physical movement, automatic
handling of network spikes.

Incheon aims to optimize the player's visual experience, while providing
a simple development model which is highly configurable and easy to analyze
and debug.

**Features:**

* Simple development model
* Optimized networking
    * Communication is packed, binary
    * UDP is still in progress
    * Automatic handling of network spikes with step correction
* Intelligent sync strategies for lag handling
    * Extrapolation with step re-enactment on the clients, or:
    * Interpolation for optimal object motion
* API for dynamic game-world objects
    * game worlds with physics engines (currently only physijs)
    * game worlds with pseudo-physics, which track position, velocity, and orientation
* Proper API documentation, user guide, tutorials, and samples
* Custom tools for debugging and tracing

Things to do:

* UDP
* Full-stack testing suite
