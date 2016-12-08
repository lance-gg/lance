One way to synchronize the server and the clients is known as Interpolation.  In this method, the clients render steps which previously played out on the server.  The diagram below shows a typical sequence in an interpolated game.  Time is advancing downwards.  At the time when the server is playing out step 1026, the players are rendering the older step 1010.

![interpolation](https://cloud.githubusercontent.com/assets/3702763/20984519/47e3f5e8-bcc9-11e6-91a4-8a6af4977aa9.PNG)

This approach has an important advantage, and an important disadvantage.  The advantage is that each player has enough information available about the future in order to render visually smooth object motion.  If a sync arrived at step 1010, and another at step 1020, then the object positions at the intermediate steps can be interpolated.  The resulting visuals are smooth.

The disadvantage of this approach is that when a player input arrives on a client, the consequences of this input will only kick in at a later time, potentially causing noticeable lag between a user’s input and the visual response.  In the diagram above, an input that Player A submitted while Client A was at step 1010, will only get a visual response when Player A starts rendering objects at step 1029.

The time delay between the server and the clients is a tunable parameter.  Ideally one would choose the smallest delay possible such that there is still enough sync data to interpolate to.  A temporary spike in network delays will cause the client to stop rendering and wait for new data.  In order to recover from such spikes, the client should attempt to reduce the delay gradually.

Notes for the game developer:

1. Not all game progress can be interpolated.  Bouncing off walls, shooting, etc. are "atomic" steps which are not interpolatable.

2. Actions which are atomic must be explicitly marked as such, otherwise the game visuals will not make sense.

3. The delay in input response may mean that a given game is not a good match for interpolated synchronization.  In that case, extrapolation should be considered.  However, there are techniques which can make interpolation work nonetheless.  Real-world input delay is about 200ms.  There may be visual tricks that make this delay acceptable.  For example if the input boosts a rocket, the game might show a visual boost light up before the rocket actually starts accelerating.

4. The game engine may not need to run on the client at all, if all the information required for rendering is available in the server sync.

Next: {@tutorial guide_syncextrapolation}
