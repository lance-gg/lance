"use strict";

const NodePhysijs = require('nodejs-physijs');
const PhysicsEngine = require('./PhysicsEngine');
const THREE = NodePhysijs.THREE;
const Ammo = NodePhysijs.Ammo;
let Physijs;

class PhysijsPhysicsEngine extends PhysicsEngine {

    constructor() {
        super();
        Physijs = NodePhysijs.Physijs(THREE, Ammo); // eslint-disable-line
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

}

module.exports = PhysijsPhysicsEngine;
