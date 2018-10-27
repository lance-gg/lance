The Client Engine must run the game loop, just like the server engine.  However it also needs to handle game syncs which arrive from the server.  Also, the client engine executes a render loop, which can run at a different rate from the game loop.  The render loop frequency is determined by the display hardware available, and so it may be faster or slower than the game loop frequency.

A deeper exploration of the game world synchronization algorithms is addressed in separate chapters.  The client will let the synchronization method take care of updating the client's game world in a way which appears visually smooth to the player.

The client collects the player's inputs, such as mouse clicks, keyboard presses, and submits them to the server by calling `ClientEngine::sendInput()` method.

Additionally, the client engine handles the following functions:

1. In the case of extrapolation mode, the client will not wait for the server to apply the inputs.  Instead, it will apply the inputs locall as well, with a delay if so configured

2. Transmit user inputs to server

3. Handle changes in network delay, and step drift.  If the server runs faster (or slower) than the client, then the server is executing steps faster (or slower) than the
 client.  The client engine handles these situations by skipping steps or hurrying steps as required.  Step adjustment is also necessary to recover from a spike in network traffic.

The Client Engine has many options which must be chosen carefully.  There is an option to auto-connect.  If this is not set, then the client should at some point call the `connect()` method explicitly.
Another important option is the sync-options.  Here the client specifies the desired synchronization method and its options.  The available synchronization methods and their options will be described in a separate chapter: {@tutorial guide_synchronization_methods}.

See the {@link ClientEngine} implementation in the API Reference.

Next: {@tutorial guide_renderer}
