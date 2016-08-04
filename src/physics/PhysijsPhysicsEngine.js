"use strict";

// TODO:
//    require of "nodejs-physijs" here is a disaster, because it adds ammojs and
//    THREEjs to Incheon - specifically to the browserified bundle which will run
//    on the client side.  Thing is - the client typically does not use this
//    huge piece of baggage!
const NodePhysijs = require('nodejs-physijs');
const PhysicsEngine = require('./PhysicsEngine');
const THREE = NodePhysijs.THREE;
const Ammo = NodePhysijs.Ammo;
const Physijs = NodePhysijs.Physijs(THREE, Ammo);

class PhysijsPhysicsEngine extends PhysicsEngine {

    constructor() {
        super();
        this.scene = null;
    }

    init() {
        // TODO: now that we split physics/render is there still a need to
        // store THREE and Physijs in "this"?
        this.scene = new Physijs.Scene();
        this.THREE = THREE;
        this.Physijs = Physijs;
    }

    step() {
        this.scene.simulate();
    }

    addObject() {
    }

    removeObject() {
    }

}

module.exports = PhysijsPhysicsEngine;
