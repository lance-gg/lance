[![Build Status](https://travis-ci.org/OpherV/Incheon.svg?branch=master)](https://travis-ci.org/OpherV/Incheon) [![Inline docs](http://inch-ci.org/github/opherv/incheon.svg?branch=develop)](http://inch-ci.org/github/opherv/incheon)
[![Slack](http://incheongg-slack.herokuapp.com/badge.svg)](http://incheongg-slack.herokuapp.com)

<img src="https://cloud.githubusercontent.com/assets/3951311/21020499/6f125344-bd7d-11e6-86e4-a4bb16b32f2a.png" style="width: 100%" alt="Incheon logo">

# [Incheon](http://incheon.gg) is a real-time multiplayer game server

It provides an extendible Node.JS based server, on which game logic runs, as well as a client-side library
which synchronizes the client's game state with the server game state.  In order
to provide a smooth visual experience for each connected client, Incheon implements
efficient networking methods, position interpolation and extrapolation, user input
coordination, shadow objects, physics and pseudo-physical movement, automatic
handling of network spikes.

Incheon aims to optimize the player's visual experience, while providing
a simple development model which is highly configurable and easy to analyze
and debug.

## See it in action
Check out the official demo: [Spaaace](http://spaaace.herokuapp.com)

![spaaace](https://cloud.githubusercontent.com/assets/3951311/21784604/ffc2d282-d6c4-11e6-97f0-0ada12c4fab7.gif)



## Features:

* Focus on writing your game. Incheon takes care of the netcode
* Can support any type of game or genre  
* Optimized networking
    * TCP via websockets
    * Communication is packed and serialized into binary
    * Automatic handling of network spikes with step correction
* Intelligent sync strategies for lag handling
    * Extrapolation (client side prediction) with step re-enactment or:
    * Interpolation for optimal object motion
* Tools for debugging and tracing

## That's so neat! Where do I start?

To get a bird's eye view on what's Incheon all about and how to use it to make a multiplayer game, we recommend reading the guide: {@tutorial overview_architecture}

If you're more of the learning-by-doing type, you can start with the first tutorial, [My first game: Pong](http://docs.incheon.gg/develop/tutorial-MyFirstGame.html) which contains step-by-step instructions on how to implement a networked version of this classic game.

## Join the fun!

We are working hard to build an active, positive and inclusive {@tutorial introduction_community}

## Need help?

If you're not exactly sure how to do something, [Stack Overflow](http://stackoverflow.com/questions/tagged/incheon) is your friend.

If you've encountered a bug and it's not already in the [issues page](https://github.com/OpherV/Incheon/issues), open a new issue.


## Built something cool with Incheon?

Please [Let us know](http://www.twitter.com/opherv)! We'd love to play it, and feature it on the [Incheon homepage](http://incheon.gg).
