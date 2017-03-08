A different approach to synchronization is to extrapolate the game’s progress on the client, in the absence of sync data from the server.  Once sync data does arrive from the server, a client must reconcile between the game state predicted on the client, and the game state that actually occurred on the server.

![extrapolation](https://cloud.githubusercontent.com/assets/3702763/20984522/4d5af6de-bcc9-11e6-86f4-116d3d5af237.PNG)

In the diagram above, while the server is playing out step 1026, the clients are simultaneously rendering step 1030, which didn’t happen yet on the server.  This implies that the clients used extrapolation to predict the future.

Extrapolation is tunable, just like interpolation, by setting the number of steps that a client should be ahead of the server.  Ideally, the client is just a little bit ahead, just enough so that when sync data arrives, the highest step information in the sync matches the current step played out on the client.

An input which is sent by a client may arrive before the server has started playing the corresponding step.  In this case the Server can be configured to wait for the input’s step.  Since the server will process the input at a later step, the client may want to impose an artificial delay before actually enacting the input locally.  This is another tunable parameter.

When a sync arrives at the client, the client must reconcile the predicted game state with the actual (server) game state.  This is performed as follows:

1. Client is at step N.

2. Roll back the state to the step described by the server in the sync, step M.

3. Re-enact all the steps between M and N by invoking the game engine’s step() method.

4. The game objects positions have shifted from the predicted value.  Revert back to the client’s expected position, but remember the required delta between the client and the server.

5. Apply the delta so that the object on the client gradually bends towards the correct position as indicated by the server.

    1. Not all the delta is applied.  A "bending factor" must be specified, to indicate how much of the delta should be applied.

    2. The delta is not applied in a single step.  Rather, split the correction into incremental corrections that are applied until the next sync data arrives.

Notes for the game developer: Multiple complications arise from the extrapolation method.

1. **Re-enactment**.  Extrapolation re-enacts the game steps, and sometimes it may re-enact many steps.  This means that the game engine must be capable of stepping through the same step multiple times.  These are known as re-enactment steps.  The step() method is passed an argument so that it can know when a step is a re-enactment step.

2. **Bending**.  The client’s objects positions gradually bend towards the server’s positions.  Velocity can also bend.  The game designer must choose bending values carefully.  Objects whose position can change suddenly (teleporting objects) will not bend well.  Objects whose velocity can change suddenly (impulse) should not have velocity bending.

3. **Shadow Objects**. The client may create an object which does not yet exist on the server.  For example, if a ship fires a missile, the client must render a missile, even though the missile object is yet to exist on the server.  Until the true missile object will be created on the server, the client will model the missile with a shadow object.

To select this synchronization method, the Client Engine syncOptions must be set to "extrapolate".  The option "localObjBending" describes the amount of bending (0.0 to 1.0) for local objects, and "remoteObjBending" describes the amount of bending (0.0 to 1.0) for remote objects.  See the client engine options as described in the API Reference: {@link ClientEngine}.

Next: {@tutorial tutorials}
