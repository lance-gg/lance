

# Release Notes for Lance

## Release 1.0.1

### Breaking Changes

1. Event `preInput` was renamed to `processInput`, `client__processInput`, `server__processInput`.  `postInput`. This is a breaking change but no one actually used these events.

## Release 1.0.0 - March 2017

### New Features

* Server only sends updates for objects which changed
* **A-Frame** support
* **Cannon.js** support
* **3D** support


### Breaking Changes

Note that this is a major release update, which breaks current
games.  To upgrade to this latest major **release 1.0.0**, you will need
to apply the following changes:

1. Option `frameRate` has been renamed to `stepRate`.
2. `ClientEngine` constructor receives a third argument, a `Renderer` class.  Not a `Renderer` instance but the class itself.
3. Class `Point` has been removed.  Replaced by `TwoVector` and `ThreeVector`.
4. `DynamicObject` no longer has attributes `x`, `y`, `velX`, `velY`.  instead it has attributes `position` and `velocity` which are instances of `TwoVector`.  The `DynamicObject` constructor also has changed to receive arguments `position` and `velocity`.
5. The concept of bending has been redefined so that 0.0 means no bending
towards the server value, and 1.0 means total bending towards the server
value until the next server update.
