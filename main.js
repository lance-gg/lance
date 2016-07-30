var Incheon = {
    GameEngine: require("./src/GameEngine"),
    ServerEngine: require("./src/ServerEngine"),
    ClientEngine: require("./src/ClientEngine"),
    GameWorld: require("./src/GameWorld"),
    Point: require("./src/Point"),
    serialize: {
        Serializer: require("./src/serialize/Serializer"),
        Serializable: require("./src/serialize/Serializable"),
        PhysicalObject: require("./src/serialize/PhysicalObject"),
        THREEPhysicalObject: require("./src/serialize/THREEPhysicalObject"),
        DynamicObject: require("./src/serialize/DynamicObject")
    },
    physics: {
        PhysicsEngine: require("./src/physics/PhysicsEngine"),
        PhysijsPhysicsEngine: require("./src/physics/PhysijsPhysicsEngine")
    },
    render: {
        Renderer: require("./src/render/Renderer"),
        ThreeRenderer: require("./src/render/ThreeRenderer")
    },
    syncStrategies: {
        playerGradualSnap: require("./src/syncStrategies/PlayerGradualSnap"),
        InterpolateStrategy: require("./src/syncStrategies/InterpolateStrategy"),
        FrameSyncStrategy: require("./src/syncStrategies/FrameSyncStrategy"),
        ClientPredictionStrategy: require("./src/syncStrategies/ClientPredictionStrategy")
    }

};

module.exports = Incheon;
