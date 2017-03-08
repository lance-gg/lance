As mentioned in previous chapters, the game world and its associated game objects must be packed on the server side, serialized, and broadcast to all clients at regular intervals.  These game world update are called syncs.

Serialization requires that each game object define those attributes which must be serialized on every sync.  This attribute list is known as the game object’s netscheme.  The larger a netscheme is, the more data will need to be transferred on every sync.  Therefore care should be taken to minimize the amount of data in the netscheme.

The serialization process allows for a hierarchy of objects.  This means that the netscheme of one object may include another object which has its own netscheme.

Synchronizations of the game state occurs at regular intervals, which are less frequent than the game steps.  For example there may be 1 sync for every 10 steps.  However
this can be problematic for game events which occur at a very specific step.  For example, a sync that describes the game evolution from step *N* to step *N+10* may
need to report that a projectile was fired at step *N+5*.  In order to handle this requirement the game must create "atomic" events.

Next: {@tutorial guide_syncinterpolation}
