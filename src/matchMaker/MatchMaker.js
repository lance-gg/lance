'use strict';

const http = require('http');
const GAMESTATUS_PATH = '/gameStatus';
const MATCHMAKERSTATUS_PATH = '/matchmakerStatus';
const POST_MATCHMAKER_MARK = 'postMatchmaker';

class MatchMaker {

    constructor(expressServer, serverEngine, options) {

        this.numServers = 0;
        this.gameServers = {};
        this.options = Object.assign({
            pollPeriod: 10000,              // milliseconds between server poll loops
            playersPerServer: 6,            // max players per server
            matchmakerPath: '/',            // path at which matchmaker is used
            domain: 'AwesomeShooter.com',   // domain name of game servers
            hostname: 'gameserver',          // hostname prefix for servers
            verbose: false
        }, options);

        // poll servers at fixed interval
        setTimeout(this.pollGameServers.bind(this), this.options.pollPeriod);

        // create status routes
        expressServer.get(GAMESTATUS_PATH, (req, res) => { res.send(serverEngine.gameStatus()); });
        expressServer.get(MATCHMAKERSTATUS_PATH, (req, res) => { res.send(this.matchmakerStatus()); });
        expressServer.use('/', (req, res, next) => { this.matchMake(req, res, next); });
    }

    serverName(serverNumber) {
        const zeroPaddedNumber = (String(1e15 + serverNumber)).slice(-6);
        return `${this.options.hostname}${zeroPaddedNumber}.${this.options.domain}`;
    }

    matchmakerStatus() {
        let matchmakerStatus = {
            numServers: this.numServers,
            gameServers: this.gameServers
        };

        return JSON.stringify(matchmakerStatus);
    }

    pollEnd(serverNumber) {
        this.pollingLoopRunning = false;
        this.numServers = serverNumber;
        if (this.options.verbose)
            console.log(`total number of servers ${serverNumber}`);
    }

    pollNext(serverNumber) {

        const serverURL = `http://${this.serverName(serverNumber)}${GAMESTATUS_PATH}`;
        let that = this;
        try {
            console.log(`checking server ${serverURL}`);
            http.get(serverURL, (res) => {
                let data = '';
                if (res.statusCode !== 200) {
                    that.pollEnd(serverNumber);
                    return;
                }
                res.on('data', function(d) { data += d; });
                res.on('end', function() {
                    if (that.options.verbose)
                        console.log(`using server ${serverNumber} data = ${data}`);
                    that.gameServers[serverNumber] = JSON.parse(data);
                    that.pollNext(serverNumber + 1);
                    return;
                });
            });
        } catch (e) { that.pollEnd(serverNumber); }
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
        if (req.path !== this.options.matchmakerPath || req.query.hasOwnProperty(POST_MATCHMAKER_MARK)) {
            next();
            return;
        }

        // set the serverName
        if (!this.options.serverName) this.options.serverName = req.hostname;

        // choose an appropriate server
        for (let s = 0; s < this.numServers; s++) {
            let server = this.gameServers[s];
            if (server && server.hasOwnProperty('numPlayers')) {
                if (server.numPlayers < this.options.playersPerServer) {
                    const redirectURL = `http://${this.serverName(s)}?${POST_MATCHMAKER_MARK}=true`;
                    if (this.options.verbose)
                        console.log(`======> player redirected to server ${s} at [${redirectURL}]`);
                    res.redirect(redirectURL);
                    return;
                }
            }
        }

        console.log('ERROR! MATCHMAKER FAILURE! game server info:');
        console.log(JSON.stringify(this.gameServers, null, 2));

    }

}

module.exports = MatchMaker;
