'use strict';

class MatchMaker {

    constructor(expressServer, serverEngine, options) {

        this.numServers = 0;
        this.options = Object.assign({
            pollPeriod: 10,
            playersPerServer: 6
        }, options);

        // poll servers at fixed interval
        setTimeout(this.pollGameServers.bind(this), this.options.pollPeriod);

        // create status routes
        expressServer.use('/', (req, res, next) => { this.matchMake(req, res, next); });
        expressServer.get('/gameStatus', (req, res) => { serverEngine.gameStatus(); });
        expressServer.get('/matchmakerStatus', (req, res) => { this.matchmakerStatus(); });
    }

    serverName(serverNumber) {
        return (String(1e15 + serverNumber)).slice(-6) + this.options.serverName;
    }

    matchmakerStatus() {
        let matchmakerStatus = {
            numServers: this.numServers,
            gameServers: {}
        };

        return JSON.stringify(matchmakerStatus);
    }

    pollNext(serverNumber) {
        let request = new XMLHttpRequest();
        request.open('GET', this.serverName(serverNumber), true);
        request.onload = () => {
            if (request.status >= 200 && request.status < 400) {
                this.servers[serverNumber] = JSON.parse(request.responseText);
                this.pollNext(serverNumber + 1);
                return;
            }
            this.pollingLoopRunning = false;
            this.numServers = serverNumber;
        };
        request.onerror = () => {
            this.pollingLoopRunning = false;
            this.numServers = serverNumber;
        };
        request.send();
    }

    pollGameServers() {
        if (this.pollingLoopRunning) {
            console.log('MatchMaker: previous polling loop still running');
            setTimeout(this.pollGameServers.bind(this), this.options.pollPeriod);
            return;
        }
        this.pollingLoopRunning = true;
        this.pollNext(0);
        setTimeout(this.pollGameServers.bind(this), this.options.pollPeriod);
    }

    matchMake(req, res, next) {

        // if matchmaking already happened, let the game server running
        if (req.query.matchFound) {
            next();
            return;
        }

        // choose an appropriate server
        for (let s = 0; s < this.numServers; s++) {
            let server = this.servers[s];
            if (server && server.numPlayers) {
                if (server.numPlayers < this.options.playersPerServer) {
                    res.redirect(this.serverName(s));
                    return;
                }
            }
        }

        console.log('ERROR! MATCHMAKER FAILURE! game server info:');
        console.log(JSON.stringify(this.servers, null, 2));

    }

}

module.exports = MatchMaker;
