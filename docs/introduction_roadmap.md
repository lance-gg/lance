
## Current Release

### r4.0.0 - *Noether* - March 2019

* adds rollup-js for native modules
* one-page games
* support for rooms (game object name-spacing)
* upgrade to babel 7.0

## Future Releases

All releases listed here, along with their planned release dates and their listed contents, are a statement of intentions, and are provided with no guarantee whatsoever.  Lance is an open-source project and as such depends on the available time of its developers.  The roadmap is subject to change at any time.

### r5.0.0 - *Noether* - December 2019

## Roadmap Candidates

* entity-component-system redesign
* UDP via WebRTC
* Electron support
* MatterJS support
* Automated Cloud Deploy system for Lance game servers
* Proper testing framework
* Better debug tools:
    * Parses recorded logs
    * shows GUI that allow scrubbing through time to see values over time of client state, server state, interpolated/extrapolated state

## Past Releases

### r3.0.0 - *Majorana* - July 2018
* 2D engine support - P2
* New sample game Asteroids
* Interpolation mode
* Generic bending code

### r2.0.1 - *Spinor* - February 2018
* ES6 Modules support
* Renderer-controller game loop.  The game step delta is tuned to the render draw time
* Full-sync support, providing full data sync to new connections
* Game Object re-architecture: Renderer objects and Physics objects are sub-objects of the Game Object
* New KeyboardControls class
* Smart sync, syncing only changed objects

### r1.0.1 - *Tensor* - March 2017
* Full 3D support
* Pluggable Physics Engine support: cannon.js
* Demonstrate A-Frame support
* Refactor: game objects contain render and physics sub-objects

### r0.9.1 - “Incheon Phase 2” External Beta Release - January 2017

* Games: Pong, Spaaace
* Sync Strategies: Extrapolation, Interpolation
* Complete Documentation
* Spaaace - Online Desktop/Mobile Live Demo
* Refactor event names (remove dot) to make compatible with jsdoc

### r0.2.0 - “Incheon Phase 1” Internal Release - December 2016

* Games: Pong
* Sync Strategies: Extrapolation, Interpolation
* Refactor Renderer
* Lance.gg web site
* Boilerplate Game Repository
* Documentation started.  Tutorials: MyFirstGame, Spaceships


### r0.1.0 - "Incheon" October 2016

* First working model
* Games: Spaaace, Sumo
* Sync Strategies: ServerSync, Interpolation
