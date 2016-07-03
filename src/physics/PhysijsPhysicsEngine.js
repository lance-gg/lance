"use strict";
const PhysicsEngine = require('./PhysicsEngine');
const THREE = require('./lib/three.js');
const Ammo = require('./lib/ammo.js');
const Physijs = require('./lib/physi.js')(THREE, Ammo);



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
