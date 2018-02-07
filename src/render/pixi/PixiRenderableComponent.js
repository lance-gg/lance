import GameComponent from '../../serialize/GameComponent';

export default class PixiRenderableComponent extends GameComponent {

    constructor(options) {
        super();
        this.options = options;
    }

    /**
     * Initial creation of the Pixi renderable
     * @returns A pixi container/sprite
     */
    createRenderable() {
        let sprite;
        if (this.options.assetName) {
            sprite = new PIXI.Sprite(PIXI.loader.resources[this.options.assetName].texture);
        } else if (this.options.spriteURL) {
            sprite = new PIXI.Sprite.fromImage(this.options.spriteURL);
        }

        if (this.options.width) {
            sprite.width = this.options.width;
        }

        if (this.options.height) {
            sprite.height = this.options.height;
        }

        if (this.options.onRenderableCreated) {
            sprite = this.options.onRenderableCreated(sprite, this);
        }

        return sprite;
    }

    /**
     * This method gets executed on every render step
     * Note - this should only include rendering logic and not game logic
     */
    render() {
        if (this.options.onRender) {
            this.options.onRender();
        }
    }
}
