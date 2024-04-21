import { ClientEngine } from '../ClientEngine.js'
import { GameEngine } from '../GameEngine.js';

type KeyOptions = {
    repeat: boolean
}

type KeyAction = {
    actionName: string,
    options: KeyOptions, 
    parameters: any
}

type KeyState = {
    isDown: boolean,
    count: number
}

/**
 * This class allows easy usage of device keyboard controls.  Use the method {@link KeyboardControls#bindKey} to
 * generate events whenever a key is pressed.
 *
 * @example
 *    // in the ClientEngine constructor
 *    this.controls = new KeyboardControls(this);
 *    this.controls.bindKey('left', 'left', { repeat: true } );
 *    this.controls.bindKey('right', 'right', { repeat: true } );
 *    this.controls.bindKey('space', 'space');
 *
 */
class KeyboardControls {

    private clientEngine: ClientEngine;
    private gameEngine: GameEngine;
    private boundKeys: { [key: string]: KeyAction };
    private keyStates: { [key: string]: KeyState };
    private lastKeyPressed: string | null;

    constructor(clientEngine: ClientEngine) {

        this.clientEngine = clientEngine;
        this.gameEngine = clientEngine.gameEngine;

        this.setupListeners();

        // keep a reference for key press state
        this.keyStates = {};

        // a list of bound keys and their corresponding actions
        this.boundKeys = {};

        this.gameEngine.on('client__preStep', () => {
            for (let keyName of Object.keys(this.boundKeys)) {
                if (this.keyStates[keyName] && this.keyStates[keyName].isDown) {

                    // handle repeat press
                    if (this.boundKeys[keyName].options.repeat || this.keyStates[keyName].count == 0) {

                        // callback to get live parameters if function
                        let parameters = this.boundKeys[keyName].parameters;
                        if (typeof parameters === "function") {
                            parameters = parameters();
                        }

                        // todo movement is probably redundant
                        let inputOptions = Object.assign({
                            movement: true
                        }, parameters || {});
                        this.clientEngine.sendInput(this.boundKeys[keyName].actionName, inputOptions);
                        this.keyStates[keyName].count++;
                    }
                }
            }
        });
    }

    setupListeners() {
        document.addEventListener('keydown', (e) => { this.onKeyChange(e, true);});
        document.addEventListener('keyup', (e) => { this.onKeyChange(e, false);});
    }

    /**
     * Bind a keyboard key to a Lance client event.  Each time the key is pressed,
     * an event will be transmitted by the client engine, using {@link ClientEngine#sendInput},
     * and the specified event name.
     *
     * Common key names: up, down, left, right, enter, shift, ctrl, alt,
     * escape, space, page up, page down, end, home, 0..9, a..z, A..Z.
     * For a full list, please check the source link above.
     *
     * @param {String} keys - keyboard key (or array of keys) which will cause the event.
     * @param {String} actionName - the event name
     * @param {Object} options - options object
     * @param {Boolean} options.repeat - if set to true, an event continues to be sent on each game step, while the key is pressed
     * @param {Object/Function} parameters - parameters (or function to get parameters) to be sent to
     *                                       the server with sendInput as the inputOptions
     */
    bindKey(keys: string | string[], actionName: string, options?: KeyOptions, parameters?: any) {
        if (!Array.isArray(keys)) keys = [keys];

        let keyOptions = Object.assign({
            repeat: false
        }, options);

        keys.forEach(keyName => {
            this.boundKeys[keyName] = { actionName, options: keyOptions, parameters: parameters };
        });
    }

    // todo implement unbindKey
    onKeyChange(e: KeyboardEvent, isDown: boolean) {
        if (e.code && this.boundKeys[e.code]) {
            if (this.keyStates[e.code] == null) {
                this.keyStates[e.code] = { isDown: false, count: 0 };
            }
            this.keyStates[e.code].isDown = isDown;

            // key up, reset press count
            if (!isDown) this.keyStates[e.code].count = 0;

            // keep reference to the last key pressed to avoid duplicates
            this.lastKeyPressed = isDown ? e.code : null;

            e.preventDefault();
        }
    }
}

export { KeyboardControls };
