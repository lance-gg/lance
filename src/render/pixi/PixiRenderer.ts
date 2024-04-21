import Renderer from '../Renderer.js';
import PixiRenderableComponent from './PixiRenderableComponent.js';


type SpriteMap = {
    [key: string]: any;
}
/**
 * Pixi Renderer
 */
export default class PixiRenderer extends Renderer {

    private isReady: boolean;
    private viewportWidth: number;
    private viewportHeight: number;
    private stage: any;
    private layers: any;
    private renderer: any;
    private sprites: SpriteMap;
    private initPromise: Promise<void>;

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

    constructor(gameEngine) {
        super(gameEngine);
        this.sprites = {};
        this.isReady = false;
    }

    init() {
        // prevent calling init twice
        if (this.initPromise) return this.initPromise;

        this.viewportWidth = window.innerWidth;
        this.viewportHeight = window.innerHeight;
        this.stage = new PIXI.Container();

        // default layers
        this.layers = {
            base: new PIXI.Container()
        };

        this.stage.addChild(this.layers.base);

        if (document.readyState === 'complete' || document.readyState === 'interactive') {
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
        document.body.querySelector('.pixiContainer')?.appendChild(this.renderer.view);
    }
    
    draw() {
        super.draw(0, 0);

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

    addObject(obj) {
        if (obj.hasComponent(PixiRenderableComponent)){
            let renderable = obj.getComponent(PixiRenderableComponent);
            let sprite = this.sprites[obj.id] = renderable.createRenderable();
            sprite.anchor.set(0.5, 0.5);
            sprite.position.set(obj.position.x, obj.position.y);
            this.layers.base.addChild(sprite);
        }
    }

    removeObject(obj) {
        if (obj.hasComponent(PixiRenderableComponent)){
            let sprite = this.sprites[obj.id];
            if (sprite) {
                this.sprites[obj.id].destroy();
                delete this.sprites[obj.id];
            }
        }
    }

}
