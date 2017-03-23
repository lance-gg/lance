'use strict';

const http = require('http');

class MatchMaker {

    constructor(expressServer, serverEngine, options) {

        this.numServers = 0;
        this.options = Object.assign({
            pollPeriod: 10,
            playersPerServer: 6,
            matchmakerPath: '/',
            domain: 'awesomeShooter.com',
            hostname: 'gameserver'
        }, options);

        // poll servers at fixed interval
        setTimeout(this.pollGameServers.bind(this), this.options.pollPeriod);

        // create status routes
        expressServer.get('/gameStatus', (req, res) => { res.send(serverEngine.gameStatus()); });
        expressServer.get('/matchmakerStatus', (req, res) => { res.send(this.matchmakerStatus()); });
        expressServer.use('/', (req, res, next) => { this.matchMake(req, res, next); });
    }

    serverName(serverNumber) {
        const zeroPaddedNumber = (String(1e15 + serverNumber)).slice(-6);
        return `${this.options.hostname}${zeroPaddedNumber}${this.options.domain}`;
    }

    matchmakerStatus() {
        let matchmakerStatus = {
            numServers: this.numServers,
            gameServers: {}
        };

        return JSON.stringify(matchmakerStatus);
    }

    pollNext(serverNumber) {

        try {
            http.get(this.serverName(serverNumber), (res) => {
                let data = '';
                if (res.statusCode !== 200) { throw new Error(`status=${res.statusCode}`); }
                res.on('data', function(d) { data += d; });
                res.on('end', function() {
                    this.servers[serverNumber] = JSON.parse(data);
                    this.pollNext(serverNumber + 1);
                    return;
                });
            });
        } catch (e) {
            this.pollingLoopRunning = false;
            this.numServers = serverNumber;
        }
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

        // check for matchmaker path
        // also, if matchmaking already happened, let the game server running
        if (req.path !== this.options.matchmakerPath || req.query.hasOwnProperty('matchFound')) {
            next();
            return;
        }

        // set the serverName
        if (!this.options.serverName) this.options.serverName = req.hostname;

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
