var Incheon = {
    GameEngine: require("./src/GameEngine"),
    ServerEngine: require("./src/ServerEngine"),
    ClientEngine: require("./src/ClientEngine"),
    GameWorld: require("./src/GameWorld"),
    Point: require("./src/Point"),
    Composables: {
        Serializable: require("./src/composables/Serializable")
    },
    SyncStrategies:{
        playerGradualSnap: require("./src/syncStrategies/PlayerGradualSnap")
    }

};

module.exports = Incheon;
