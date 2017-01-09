The Game Engine contains the core game logic.  It understands user inputs, and applies them to the game.  It will fire missiles, hit aliens, boost spaceships, and apply magic spells.  The primary game engine method is the step method, which progresses the game from step *N* to step *N+1*, given the inputs that arrived since step *N-1*.

When the game engine step has completed, each game object must have it’s new current position updated, along with health, power, and any other game attributes your game derives.

It is important to take note of the following architectural requirements:

1. The Game Engine may include some functions which will only run on the server, and these functions should be called directly by the server engine when necessary.  For example, there may be a function to handle the score reporting.  It is important to isolate server-only logic in a clear way.

2. On clients which use extrapolated synchronization, a given game step is often re-enacted following the arrival of a sync from the server.  These "re-enactment" steps are flagged, and the game engine must ensure that the its step method does not have any side-effects when the "re-enactment" flag is set.

Lastly, the game engine also provides a useful event emitter which reports on the progress of the game.  A typical game will use these events to trigger any required logic with specific timing. Events include pre-step, post-step, player-joined, object-added, etc.  Refer to the Events section of the API Reference for a complete list.

See the {@link GameEngine} implementation in the API Reference.

Next: {@tutorial guide_serverengine}
