export default class GameComponent {
    
    constructor(){
        /**
         * the gameObject this component is attached to. This gets set in the addComponent method
         * @member {GameObject}
         */
        this.parentObject = null;
    }

    static get name(){
        return this.constructor.name;
    }

    static get netScheme(){
        return null;
    }
}