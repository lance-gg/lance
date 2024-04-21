import { GameEngine } from '../../GameEngine.js';

interface CollisionDetectionOptions {
    gameEngine: GameEngine
}

interface CollisionDetection {
    init(options: CollisionDetectionOptions);
    detect();
}

export { CollisionDetection, CollisionDetectionOptions }