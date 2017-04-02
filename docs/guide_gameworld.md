The Game Engine includes a reference to the Game World, which consists of the game state, and a collection of Game Objects.  The Game World is essentially the data which is liable to change from one game step to the next, and whose changes must be sent on every sync to every client.

The game objects, as implemented in Lance, are instances of game object base classes.  There are two supported base object classes: `DynamicObject` and `PhysicalObject`.  DynamicObject is used for 2D games, with simplified physics.  PhysicalObject is used for 3D games, with full-featured physics engine.  For example, in a 2D game, all the game objects will be implemented as sub-classes of DynamicObject.  These objects are serializable, and can be sent over a network.

Take for example a game of 2D Breakout.  The implementation will have three game object classes: the Paddle, the Ball, and the Brick.  The game objects will include one instance of the Paddle class, one instance of a Ball class, and multiple instances of the Brick class.  (That much is true anyways of the simple version of the game, where there is only a single ball, and a single paddle, and no shooting). The Paddle, the Ball, and the Brick are subclasses of DynamicObject.

A game object sub-class will define its "netscheme", which is a dictionary of networked attributes for this object.  The attributes listed in the netscheme will be those exact attributes which will be serialized by the server and broadcast to all clients on every sync.  The DynamicObject base class only implements positional attributes, so additional attributes such as power, energy, or health, must be specified in the netscheme.

Notes for the game developer:

1. PhysicalObject subclasses are "physical".  In this case, each object instance has a velocity, orientation, and continuous-ranged position (i.e. the position is a floating-point value).

2. DynamicObject sub-classes may optionally be "pseudo-physical".  In this case, the object’s position is a discrete value (i.e. an integer, or low-precision decimal), determined precisely by the count of movement inputs.

3. Some game objects may be user-controlled by a client, in that same client’s engine.  These objects may not need to be synchronized to server sync data, since the client information is always up-to-date.  We refer to these objects as "player-controlled objects".

4. Some game objects can be teleported (position translation) and others cannot.

5. Some game objects can have their velocity change suddenly and others cannot.

It is important for a game developer to understand exactly what types of objects are being used and what properties they have, in order to properly configure the synchronization.

### Game Object Sub-Assets
The game objects can keep references to one or more renderable assets which are managed by the Renderer.  Also, a game object can keep references to one or more physical assets (bodies & particles) which are managed by a physics engine.  For example, you may have a car game object.  The car object keeps references to renderable assets such as the car's chassis, antenna, and wheels.  In addition, the car object can keep reference to a single body in the physics object: a simple brick-shape.

See the {@link DynamicObject} implementation in the API Reference.

Next: {@tutorial guide_serialization}
