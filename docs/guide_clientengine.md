The Client Engine must run the game loop, just like the server engine.  However it also needs to handle game syncs which arrive from the server, and execute a render loop.

A deeper exploration of the game synchronization methods is addressed in a separate chapter.  The client will let the synchronization method take care of updating the game world in a way which appears visually smooth to the player.

Additionally, the client engine handles the following functions:

1. Apply user inputs locally, with a delay if so configured

2. Transmit user inputs to server

3. Handle changes in network delay, and step drift.  If the server is running faster (or slower) than the client, then the server is applying steps faster (or slower) than the client.  The client engine handles these situations by skipping steps or hurrying steps as required
