var Incheon = {
    GameEngine: require("./src/GameEngine"),
    ServerEngine: require("./src/ServerEngine"),
    ClientEngine: require("./src/ClientEngine"),
    GameWorld: require("./src/GameWorld"),
    Point: require("./src/Point"),
    Composables: {
        Serializable: require("./src/Composables/Serializable")
    },
    SyncStrategies:{
        playerGradualSnap: require("./src/SyncStrategies/PlayerGradualSnap")
    }

};

module.exports = Incheon;