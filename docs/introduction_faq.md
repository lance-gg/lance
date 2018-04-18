
## Lance Basics

This list of questions is derived mostly from recurring questions and discussions on our slack group.  The list is meant as a high-level starting point, but you are encouraged to join in the conversation. Auto-join the [Lance Slack group with this link](http://slack.lance.gg).

### 1. What is Lance?

Lance is an open-source project which makes it easier to write multiplayer physics networked games in JavaScript.  Lance implements some components of the multiplayer game, so that a game developer can focus on the game itself.  The components which Lance implements are networking, client-side prediction of object positions, extrapolation, 3D/2D networked physics, and more.

### 2. What is the basic structure of an Lance game?
Lance uses a client-server model.  There is a single authoritative server, and multiple clients in each networked game.  A game based on Lance will have server code, client code, and common code.  The game logic is common code, and can run on the authoritative server as well as on every client.

### 3. What is client-side prediction?
Client-side prediction is the logic which runs on every client, and extrapolates the state of the game.  In the Lance implementation, client-side prediction uses physical attributes such as position, velocity, orientation, and angular velocity to predict the game state on each client.  This provides a smooth playing experience for each client, hiding the side-effects of network lag and network spikes.

### 4. What is bending?
Bending is the process of gradually correcting the positions and orientations of game objects on the client, which have drifted from their authoritative positions and orientations on the server.  Bending is applied incrementally on each renderer draw event.

## Lance Usage

### 1. Does Lance scale?
The answer to this question highly depends on the game type.  For games where a few players join separate rooms or “zones” within the game, an Lance server can be used for each room.  This is the simple case.

In the case of large worlds, where hundreds of players join a single space, Lance needs to separate the single space into subspaces such that each Lance server is responsible for one of the subspaces.  This feature has not been implemented yet.  If you’re interested in this feature please upvote the following [feature request](https://github.com/lance-gg/lance/issues/30).

### 2. Does Lance preserve state?
Since Lance is designed for real-time calculation of position, running typically at 60 steps per second, state-preservation is not a primary concern.  However, this has been requested in the past.  If you’re interested in this feature please upvote the following [feature request](https://github.com/lance-gg/lance/issues/31).

### 3. How do I implement chat services with Lance?
It’s preferred that non-real time communication is handled by a different server than the one which runs the game state, therefore chat services are outside the scope of Lance. The preferred approach is to use an existing chat service together with Lance in your game.  There is a feature request to provide a sample game which demonstrates Lance working together with a third-party chat service. If you’re interested in this feature please upvote the following [feature request](https://github.com/lance-gg/lance/issues/32).

### 4. What is in the Lance Roadmap?
See the Roadmap: {@tutorial introduction_roadmap}.  Some of the major planned features include UDP support, and Visual Debugging.

## Lance Packaging / Transpiling

### 1. Can I use Lance with babel?
Yes! Lance exports es6 code, so you will need to include it in your babel configuration so that it gets transpiled with the rest of your code. This can be done using the include option in your .babelrc or webpack.config file.  See the sample games provided in the Github Lance-gg organization.  
