const EventEmitter = require('eventemitter3');

//todo add all keyboard keys

// keyboard handling
const keyCodeTable = {
    32: 'space',
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    65: 'a',
    87: 'w',
    68: 'd',
    83: 's'
};

/**
 * This class allows easy usage of device keyboard controls
 */
class KeyboardControls{

    constructor(clientEngine){
        Object.assign(this, EventEmitter.prototype);
        this.clientEngine = clientEngine;
        this.gameEngine = clientEngine.gameEngine;

        this.setupListeners();

        // keep a reference for key press state
        this.keyState = {};

        // a list of bound keys and their corresponding actions
        this.boundKeys = {};

        this.gameEngine.on('client__preStep', ()=>{
            for (let keyName of Object.keys(this.boundKeys)){
                if (this.keyState[keyName] && this.keyState[keyName].isDown) {

                    //handle repeat press
                    if (this.boundKeys[keyName].options.repeat || this.keyState[keyName].count == 0) {
                        //todo movement is probably redundant
                        this.clientEngine.sendInput(this.boundKeys[keyName].actionName, {movement: true});
                        this.keyState[keyName].count++;
                    }
                }
            }
        })
    }

    setupListeners(){
        document.addEventListener('keydown', (e) => { this.onKeyChange(e, true);});
        document.addEventListener('keyup', (e) => { this.onKeyChange(e, false);});
    }

    bindKey(keys, actionName, options){
        if (!Array.isArray(keys)) keys = [keys];

        let keyOptions = Object.assign({
            repeat: false
        }, options);

        keys.forEach( keyName => {
            this.boundKeys[keyName] = { actionName, options: keyOptions }
        });
    }

    //todo implement unbindKey

    onKeyChange(e, isDown) {
        e = e || window.event;

        let keyName = keyCodeTable[e.keyCode];
        if (keyName) {
            if (this.keyState[keyName] == null){
                this.keyState[keyName] = {
                    count: 0
                }
            }
            this.keyState[keyName].isDown = isDown;

            //key up, reset press count
            if (!isDown) this.keyState[keyName].count = 0;

            // keep reference to the last key pressed to avoid duplicates
            this.lastKeyPressed = isDown ? e.keyCode : null;
            // this.renderer.onKeyChange({ keyName, isDown });
            e.preventDefault();
        }
    }
}

module.exports = KeyboardControls;