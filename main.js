var Incheon = {
    GameEngine: require("./src/GameEngine"),
    ServerEngine: require("./src/ServerEngine"),
    ClientEngine: require("./src/ClientEngine"),
    GameWorld: require("./src/GameWorld"),
    Point: require("./src/Point"),
    composables: {
        Serializable: require("./src/composables/Serializable")
    },
    physics: {
        PhysicsEngine: require("./src/physics/PhysicsEngine"),
        PhysijsPhysicsEngine: require("./src/physics/PhysijsPhysicsEngine")
    },
    syncStrategies:{
        playerGradualSnap: require("./src/syncStrategies/PlayerGradualSnap")
    }

};

module.exports = Incheon;
