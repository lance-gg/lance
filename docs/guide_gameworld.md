The Game Engine includes a reference to the Game World, which consists of the game state, and a list of Game Objects.  The Game World is essentially the data which is liable to change from one game step to the next, and must be sent on every sync to every client.

The game objects, as implemented in Incheon, are instances of game object classes, which are subclasses of the base DynamicObject class.  This base object is a serializable.  So for example, in a game of breakout, the implementation will have three game object classes: the Paddle, the Ball, and the Brick.  The game objects will include one instance of the Paddle class, one instance of a Ball class, and multiple instances of the Brick class.  (That much is true anyways of the simple version of the game, where there is only a single ball, and a single paddle, and no shooting). The Paddle, the Ball, and the Brick are subclasses of DynamicObject.

A game object class will define its "netscheme", which is a dictionary of attributes for this object.  The attributes listed in the netscheme will be those exact attributes which will be serialized by the server and broadcast to all clients on every sync.  The DynamicObject base class only implements positional attributes, so additional attributes such as power, energy, or health, must be specified in the netscheme.

Notes for the game developer:

1. Game Objects may be "physical".  In this case, the object has a velocity, orientation, and continuous-ranged position (i.e. the position is a floating-point value).

2. Game Objects may be "pseudo-physical".  In this case, the object’s position is a discrete value (i.e. an integer, or low-precision decimal), determined precisely by the count of movement inputs.

3. Some game objects may be user-controlled by a client, in that same client’s engine.  These objects may not need to be synchronized to server sync data, since the client information is always up-to-date.

4. Some game objects can be teleported (position translation) and others cannot.

5. Some game objects can have their velocity change suddenly and others cannot.

It is important for a game developer to understand exactly what types of objects are being used and what properties they have, in order to properly configure the synchronization.
