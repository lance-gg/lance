import { ClientEngine } from './ClientEngine.js';
import { SyncStrategy, SyncStrategyOptions } from './syncStrategies/SyncStrategy.js';

class Synchronizer {

    public syncStrategy: SyncStrategy;
    private clientEngine: ClientEngine;

    // create a synchronizer instance
    constructor(clientEngine: ClientEngine, syncStrategy: SyncStrategy) {
        this.clientEngine = clientEngine;
        this.syncStrategy = syncStrategy;
    }
}

export { Synchronizer}