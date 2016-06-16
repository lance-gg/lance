var Incheon = {
    GameEngine: require("./src/GameEngine"),
    ServerEngine: require("./src/ServerEngine"),
    ClientEngine: require("./src/ClientEngine"),
    GameWorld: require("./src/GameWorld"),
    syncStrategies:{
        playerGradualSnap: require("./src/syncStrategies/PlayerGradualSnap")
    }
};

module.exports = Incheon;