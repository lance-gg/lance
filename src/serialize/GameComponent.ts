import { GameObject } from "./GameObject.js";

export default class GameComponent {
    private parentObject: GameObject | null;

    constructor() {
        /**
         * the gameObject this component is attached to. This gets set in the addComponent method
         * @member {GameObject}
         */
        this.parentObject = null;
    }

    static get componentName() {
        return this.constructor.name;
    }

    netScheme() {
        return null;
    }
}