'use strict';

const assert = require('chai').assert;
const incheon = require('../../');
const testGameServer = require('./testGame/server');
const testGameClient = require('./testGame/client');

let state = {
    server: null,
    clients: [],
    numClients: 0
};

describe('multiplayer-game', function() {

    it('start server', function(done) {
        state.server = testGameServer.start();
        assert.instanceOf(state.server.gameEngine, incheon.GameEngine);
        assert.instanceOf(state.server.serverEngine, incheon.ServerEngine);
        assert.instanceOf(state.server.physicsEngine, incheon.physics.PhysicsEngine);
        done();
    });

    it('start five clients', function() {
        while (state.numClients < 5) {
            state.clients[state.numClients++] = testGameClient.start();
        }
    });

});
