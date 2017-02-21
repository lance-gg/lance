In the prologue of this documentation, the complexity of multiplayer network games becomes evident.  But that
is small potatoes compared to debugging multiplayer network games.  The debugging of a multiplayer game
is made difficult by the following reasons:

1. A multiplayer network game consists of several non-symmetric hosts running non-symmetric software, separated by non-symmetric networks.
2. The problem may be very hard to reproduce, and exists only under certain race conditions.
3. The problem may be in the game mechanics as implemented in the game engine.  For example, in the game of Pong, one might forget to check if the left paddle was hit *before* one checks if the left wall was hit (true story).
4. Then again, the problem may be in the configuration of the synchronization.  For example, in the game of Pong, one might forget to disable velocity interpolation, and when the ball's velocity changes direction, the velocity interpolation causes strange visual effects (also, a true story).
5. Then again, the problem may be due to network spikes.
6. And finally, there is always the possibility that the game in question is not a good match for the architecture presented in this
guide, and some of the assumptions in the game may need to be revisited in order to make the multiplayer experience viable with the proposed architecture.

In all the cases above, the game developer sees the same symptom: an object jumps around strangely on the screen!

At first this can be *very* frustrating, because the game developer does not know where to start.  This document
was written to help with the process of debugging multiplayer networked games using an organized process which
help to narrow down the problem efficiently.

## The basic debugging process

The following steps define an efficient debugging process:

1. Is the problem also on the Server, or just when the client tries to render the visuals?
  1. If the problem is on the server, use server traces to see how the objects states change at each step.
  2. If the problem is only on the client, is the problem related to Synchronization?
2. Is the problem caused by unusual network conditions?


## Server or Client

The problem is always first observed on the client.  To determine if the problem
exists on the server as well, the easiest approach is to use the Reflect synchronization
strategy.  The Reflect method is not really a synchronization strategy but rather a degenerate
synchronization method which simply shows the server sync data as it arrives.

To run a game in reflect mode, simply use the URL query string option:

```
http://127.0.0.1:3000/?sync=reflect
```

The problem can also occur in such a way that it usually happens in between syncs.
In this case, one can configure the server to increase the update rate so that
it approaches the client's render rate.

The ServerEngine has options to set the step rate and the sync update rate:
```javascript
const serverEngine = new MyServerEngine(io, gameEngine, {
    updateRate: 6,
    stepRate: 60,
});
```

Lastly, an important technique is to test the game on a local network (i.e. run server
and clients on same host) to make sure that network delay is not a factor.

## Check Server Traces

To enable server traces, set the trace level when the game engine is created:
```javascript
const gameEngine = new MyGameEngine({ traceLevel: 1 });
```

See the Trace class for trace constants.  The trace output file is called `server.trace`
and it will show trace data which looks as follows:

```
[2016-12-04T22:16:15.136Z]719>game engine processing input[10052] <up> from playerId 1
[2016-12-04T22:16:15.153Z]720>game engine processing input[10053] <up> from playerId 1
[2016-12-04T22:16:15.153Z]720>========== sending world update 720 ==========
[2016-12-04T22:16:15.170Z]721>game engine processing input[10054] <up> from playerId 1
[2016-12-04T22:16:15.170Z]721>========== destroying object DynamicObject[2] position(273.854, 304.23, NaN) velocity(-4.529, -2.119, NaN) angle205 ==========
```

Each line starts with a timestamp, and a step number.  The example above shows
steps 719-720.  At the lowest trace level, the service will show each object's
attributes, including position, at the end of every step.

To make debugging easier, you may want to implement your object's `toString()` method,
to show a useful representation of the object.  This will be *very useful* in the long run.

## Check Client Traces

Enabling client traces can be done from the URL's query string, using the *traceLevel*
parameter.  Here is an example:
```
http://127.0.0.1:3000/?sync=reflect&traceLevel=0
```

Since there are multiple clients, there are also multiple trace files, one for each client.  The trace files are named `client.<n>.trace`.

### Client Interpolation

Note that in interpolation, the client actually plays a step which is older than the current
step.  Ensure you check the trace to see which step the interpolation is targeting.
Interpolation runs the client's game engine in passive mode, meaning that the game engine
on the client will not execute the physics steps.

### Client Extrapolation

For extrapolation synchronization, the client will re-enact the required history of steps
each time a new sync is received.  This is traced in low-level detail.  To debug
problems related to bending, look at the position attributes of the relevant object
just before the sync was received, and the result of the re-enactment before bending
was applied, and the final object position after bending was applied.
