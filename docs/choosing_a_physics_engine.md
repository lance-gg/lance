
There are many different kinds of multiplayer games, and different games have different approaches to physics.  Lance supports three basic physics models.

* **2D Simple Physics**: A pseudo-physics arcade mode, which only tracks position, velocity, and angle for each object.
* **2D Physics Engine**: A true physics engine mode, based on the engine [P2](https://github.com/schteppe/p2.js).
* **3D Physics Engine**: A true 3D physics engine mode, based on the engine [Cannon](https://github.com/schteppe/cannon.js/).

## 2D Simple Physics

This is probably the most common mode, and is appropriate for 2D games which don't need a real physics engine.  Consider arcade games, fighting/brawler games, dungeon room games, platform, shooter, RPG, RTS, and runners.  In all these cases, the game code doesn't require true physics.  Instead, physical aspects such as position, velocity, and collisions are easily implemented using simple game logic.  Even jumping from one platform to the next can be implemented as a sequence of height changes.

In fact, many of these games are more fun to play using simplified (or pseudo) physics as they become more deterministic and predictable to the player.

In order to use simple physics in Lance, you will need to initialize a `SimplePhysicsEngine` instance in the `GameEngine` constructor.  In addition, all game object classes must extend the `DynamicObject` class.

For example:
```javascript
export default class Simple2DGameEngine extends GameEngine {

    constructor(options) {
        super(options);
        this.physicsEngine = new SimplePhysicsEngine({
            gameEngine: this,
            collisions: {
                type: 'brute'
            }
        });
    }
}
```

See the sample game [Spaaace](https://github.com/lance-gg/spaaace) to see how this is done.

## 2D Real Physics

Games which require true physics in 2D can use this mode.  In order to use real physics in 2D, you will need to initialize an instance of `P2PhysicsEngine` in the `GameEngine` constructor.  The underlying physics engine used in this case is P2.  A very lightweight 2D physics engine.  All game object classes must extend the `PhysicalObject2D` base class.

See the sample game [Asteroids](https://github.com/lance-gg/asteroids) to see how this is done.  Also, you may want to compare Spaaace and Asteroids to see how the game experience changes from pseudo-physics to real physics.


## 3D Real Physics

3D physics games are not common.  In fact, many games which appear to be 3D physics games are in fact 2.5D pseudo-physics games.  In those cases, the map is really a two dimensional map, but the objects are allowed to also have a height.  The lance 3D physics mode uses the native javascript Cannon physics engine, written by Schteppe.

To use 3D real physics, initialize an instance of `P2PhysicsEngine` in the `GameEngine` constructor.  All game object classes must extend the `PhysicalObject3D` base class.

See [SprocketLeague](https://github.com/lance-gg/sprocketleague) for a sample implementation.

Next: {@tutorial guide_gameengine}
