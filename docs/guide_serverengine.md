The Server Engine is a relatively simple component.  As mentioned in the introduction, the server engine must do the following: (1) it must initialize the game, (2) it must accept connections from players over a socket, (3) it must execute the game loop, by calling the game engine’s `step()` method at a fixed interval, (4) it must apply the player inputs from all connections, and (5) it must broadcast regular updates to all the clients at a fixed interval.

The game developer will extend this logic, by adding functions that log gameplay statistics, registering user activity, wins, losses, achievements.  One of the extended methods is `GameEngine::processInput()` which applies a player's input to change the game state.

Care must be taken on the following point: the server engine should not be used to contain game logic - that belongs in the game engine class.

See the {@link ServerEngine} implementation in the API Reference.

Next: {@tutorial guide_clientengine}
