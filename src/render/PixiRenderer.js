import Renderer from './Renderer';

/**
 * Pixi Renderer
 */
export default class PixiRenderer extends Renderer {

    /**
     * Returns a dictionary of image assets and their paths
     * E.G. {
                ship: 'assets/ship.png',
                missile: 'assets/missile.png',
            }
     * @returns {{}}
     * @constructor
     */
    get ASSETPATHS() {
        return {};
    }

    constructor(gameEngine, clientEngine) {
        super(gameEngine, clientEngine);
        this.sprites = {};
        this.isReady = false;
    }

    init() {
        // prevent calling init twice
        if (this.initPromise) return this.initPromise;

        this.viewportWidth = window.innerWidth;
        this.viewportHeight = window.innerHeight;
        this.stage = new PIXI.Container();

        if (document.readyState === 'complete' || document.readyState === 'loaded' || document.readyState === 'interactive') {
            this.onDOMLoaded();
        } else {
            document.addEventListener('DOMContentLoaded', ()=>{
                this.onDOMLoaded();
            });
        }

        this.initPromise = new Promise((resolve, reject)=>{
            let onLoadComplete = () => {
                this.isReady = true;
                resolve();
            };

            let resourceList = Object.keys(this.ASSETPATHS).map( x => {
                return {
                    name: x,
                    url: this.ASSETPATHS[x]
                };
            });

            // make sure there are actual resources in the queue
            if (resourceList.length > 0)
                PIXI.loader.add(resourceList).load(onLoadComplete);
            else
                onLoadComplete();
        });

        return this.initPromise;
    }

    onDOMLoaded() {
        this.renderer = PIXI.autoDetectRenderer(this.viewportWidth, this.viewportHeight);
        document.body.querySelector('.pixiContainer').appendChild(this.renderer.view);
    }
    
    draw() {
        super.draw();

        if (!this.isReady) return; // assets might not have been loaded yet

        for (let objId of Object.keys(this.sprites)) {
            let objData = this.gameEngine.world.objects[objId];
            let sprite = this.sprites[objId];

            if (objData) {
                sprite.x = objData.position.x;
                sprite.y = objData.position.y;
                sprite.rotation = this.gameEngine.world.objects[objId].angle * Math.PI/180;
            }
        }

        this.renderer.render(this.stage);
    }

    addObject(objData) {}

    removeObject(objData) {}

}
