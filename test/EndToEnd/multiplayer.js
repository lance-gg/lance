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

// set all clients in a certain direction
function setDirection(direction, value) {
    state.clients.forEach(c => {
        c.clientEngine.pressedKeys[direction] = value;
    });
}

describe('multiplayer-game', function() {

    it('start server', function(done) {
        let s = state.server = testGameServer.start();
        assert.instanceOf(s.gameEngine, incheon.GameEngine);
        assert.instanceOf(s.serverEngine, incheon.ServerEngine);
        assert.instanceOf(s.physicsEngine, incheon.physics.PhysicsEngine);
        done();
    });

    it('start five clients', function(done) {
        while (state.numClients < 5) {
            let c = state.clients[state.numClients++] = testGameClient.start();
            assert.instanceOf(c.gameEngine, incheon.GameEngine);
            assert.instanceOf(c.clientEngine, incheon.ClientEngine);
            assert.instanceOf(c.physicsEngine, incheon.physics.PhysicsEngine);
        }
        done();
    });

    it('everybody go up', function(done) {
        this.timeout(10000);
        setDirection('up', true);
        setTimeout(() => {
            setDirection('up', false);
            setDirection('down', true);
            setTimeout(() => {
                setDirection('down', false);
                done();
            }, 4000);
        }, 4000);
    });

});
