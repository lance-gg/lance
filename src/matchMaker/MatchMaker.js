'use strict';

const process = require('process');
const http = require('http');
const GAMESTATUS_PATH = '/gameStatus';
const MATCHMAKERSTATUS_PATH = '/matchmakerStatus';
const POST_MATCHMAKER_MARK = 'postMatchmaker';

/**
 * The MatchMaker is a service for redirecting players to available game servers.
 *
 * The architecture is implemented such that there is one matchmaker server, and
 * multiple game servers.  Both the matchmaker and the game servers run the same
 * code, to avoid compatibility issues.
 *
 * The matchmaker regularly polls the game servers to get their status.  Each
 * game server must have a hostname with conforms with a standard hostname template:
 * `<host-name><6-digit-serverID>/<domain-name>`
 * For example, if the host name is 'gameserver' and the domain-name is 'AwesomeShooter.com'
 * the game servers must be accessible at:
 * `gameserver000000.AwesomeShooter.com`
 * `gameserver000001.AwesomeShooter.com`
 * ...
 * `gameserverNNNNNN.AwesomeShooter.com`
 *
 * The matchmaker will regularly poll to see how many game servers are available.
 * Each gameserver reports a status, so the matchmaker can maintain a lookup table
 * which describes the status of each gameserver.
 *
 * When a player opens the URL of the matchmaker, the matchmaker invokes the `chooseGameServer()`
 * method, which must redirect the player to the chosen gameserver, or report an error.
 * The game developer may choose extend the MatchMaker class and override the default
 * implementation of `chooseGameServer()`.
 *
 * Once redirected, the game server adds a `POST_MATCHMAKER_MARK` parameter to the URL
 * query string.  This is one way for the gameserver to understand that the matchmaking
 * has already occurred.  Another way is to provide different paths for matchmaking
 * and for game joining.
 */
class MatchMaker {

    /**
    * Constructor of the MatchMaker singleton.
    * @param {Object} expressServer - Reference to the express app
    * @param {ServerEngine} serverEngine - Reference to the ServerEngine instance
    * @param {Object} options - matchmaker options
    * @param {Number} options.pollPeriod - gameserver polling interval in milliseconds.  Default 10000
    * @param {Number} playersPerServer - maximum number of players per server - used by the default chooser method.  Default 6
    * @param {String} matchmakerPath - path where the matchmaker is activated. By default it is the root path '/'
    * @param {String} domain - game servers domain string
    * @param {String} hostname - game servers hostname string
    * @param {Boolean} verbose - report MatchMaker activity to the console
    */
    constructor(expressServer, serverEngine, options) {
        this.serverEngine = serverEngine;
        this.numServers = 0;
        this.gameServers = {};
        this.shutDownStarted = false;
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
        expressServer.get(GAMESTATUS_PATH, this.gameStatus.bind(this));
        expressServer.get(MATCHMAKERSTATUS_PATH, (req, res) => { res.send(this.matchmakerStatus()); });
        expressServer.use('/', this.matchMake.bind(this));

        // delay shutdown gracefully
        process.on('SIGINT', () => {
            this.shutDownStarted = true;
            console.log('SHUTTING DOWN - PLEASE WAIT - waiting game server poll interval');
            setTimeout(() => { process.exit(); }, this.options.pollPeriod * 2);
        });
    }

    gameStatus(req, res) {
        if (this.shutDownStarted)
            res.sendStatus(404);
        else
            res.send(this.serverEngine.gameStatus());
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

    /**
     * Choose a GameServer
     * The default gameserver chooser selects the first server which did not exceed
     * the maximum number of players.  If you need something different, override this function.
     *
     * @return {String} Full URL of the chosen game server
     */
    chooseGameServer() {
        // choose an appropriate server
        for (let s = 0; s < this.numServers; s++) {
            let server = this.gameServers[s];
            if (server &&
                server.hasOwnProperty('numPlayers') &&
                server.numPlayers < this.options.playersPerServer) {
                return `http://${this.serverName(s)}?${POST_MATCHMAKER_MARK}=true`;
            }
        }
        return null;
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

        // this should be the last function called.
        // either it calls res.redirect() to some server, or it
        // ends in error.
        const redirectURL = this.chooseGameServer(req, res);
        if (redirectURL) {
            if (this.options.verbose)
                console.log(`======> player redirected to server [${redirectURL}]`);
            res.redirect(redirectURL);
        } else {
            console.log('ERROR! MATCHMAKER FAILURE! game server state info:');
            console.log(JSON.stringify(this.gameServers, null, 2));
        }
    }

}

module.exports = MatchMaker;
