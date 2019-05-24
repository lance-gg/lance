// based on http://keycode.info/

// keyboard handling
const keyCodeTable = {
    3: 'break',
    8: 'backspace', // backspace / delete
    9: 'tab',
    12: 'clear',
    13: 'enter',
    16: 'shift',
    17: 'ctrl',
    18: 'alt',
    19: 'pause/break',
    20: 'caps lock',
    27: 'escape',
    28: 'conversion',
    29: 'non-conversion',
    32: 'space',
    33: 'page up',
    34: 'page down',
    35: 'end',
    36: 'home',
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    41: 'select',
    42: 'print',
    43: 'execute',
    44: 'Print Screen',
    45: 'insert',
    46: 'delete',
    48: '0',
    49: '1',
    50: '2',
    51: '3',
    52: '4',
    53: '5',
    54: '6',
    55: '7',
    56: '8',
    57: '9',
    58: ':',
    59: 'semicolon (firefox), equals',
    60: '<',
    61: 'equals (firefox)',
    63: 'ß',
    64: '@',
    65: 'a',
    66: 'b',
    67: 'c',
    68: 'd',
    69: 'e',
    70: 'f',
    71: 'g',
    72: 'h',
    73: 'i',
    74: 'j',
    75: 'k',
    76: 'l',
    77: 'm',
    78: 'n',
    79: 'o',
    80: 'p',
    81: 'q',
    82: 'r',
    83: 's',
    84: 't',
    85: 'u',
    86: 'v',
    87: 'w',
    88: 'x',
    89: 'y',
    90: 'z',
    91: 'Windows Key / Left ⌘ / Chromebook Search key',
    92: 'right window key',
    93: 'Windows Menu / Right ⌘',
    96: 'numpad 0',
    97: 'numpad 1',
    98: 'numpad 2',
    99: 'numpad 3',
    100: 'numpad 4',
    101: 'numpad 5',
    102: 'numpad 6',
    103: 'numpad 7',
    104: 'numpad 8',
    105: 'numpad 9',
    106: 'multiply',
    107: 'add',
    108: 'numpad period (firefox)',
    109: 'subtract',
    110: 'decimal point',
    111: 'divide',
    112: 'f1',
    113: 'f2',
    114: 'f3',
    115: 'f4',
    116: 'f5',
    117: 'f6',
    118: 'f7',
    119: 'f8',
    120: 'f9',
    121: 'f10',
    122: 'f11',
    123: 'f12',
    124: 'f13',
    125: 'f14',
    126: 'f15',
    127: 'f16',
    128: 'f17',
    129: 'f18',
    130: 'f19',
    131: 'f20',
    132: 'f21',
    133: 'f22',
    134: 'f23',
    135: 'f24',
    144: 'num lock',
    145: 'scroll lock',
    160: '^',
    161: '!',
    163: '#',
    164: '$',
    165: 'ù',
    166: 'page backward',
    167: 'page forward',
    169: 'closing paren (AZERTY)',
    170: '*',
    171: '~ + * key',
    173: 'minus (firefox), mute/unmute',
    174: 'decrease volume level',
    175: 'increase volume level',
    176: 'next',
    177: 'previous',
    178: 'stop',
    179: 'play/pause',
    180: 'e-mail',
    181: 'mute/unmute (firefox)',
    182: 'decrease volume level (firefox)',
    183: 'increase volume level (firefox)',
    186: 'semi-colon / ñ',
    187: 'equal sign',
    188: 'comma',
    189: 'dash',
    190: 'period',
    191: 'forward slash / ç',
    192: 'grave accent / ñ / æ',
    193: '?, / or °',
    194: 'numpad period (chrome)',
    219: 'open bracket',
    220: 'back slash',
    221: 'close bracket / å',
    222: 'single quote / ø',
    223: '`',
    224: 'left or right ⌘ key (firefox)',
    225: 'altgr',
    226: '< /git >',
    230: 'GNOME Compose Key',
    231: 'ç',
    233: 'XF86Forward',
    234: 'XF86Back',
    240: 'alphanumeric',
    242: 'hiragana/katakana',
    243: 'half-width/full-width',
    244: 'kanji',
    255: 'toggle touchpad'
};

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

    constructor(clientEngine) {

        this.clientEngine = clientEngine;
        this.gameEngine = clientEngine.gameEngine;

        this.setupListeners();

        // keep a reference for key press state
        this.keyState = {};

        // a list of bound keys and their corresponding actions
        this.boundKeys = {};

        this.gameEngine.on('client__preStep', () => {
            for (let keyName of Object.keys(this.boundKeys)) {
                if (this.keyState[keyName] && this.keyState[keyName].isDown) {

                    // handle repeat press
                    if (this.boundKeys[keyName].options.repeat || this.keyState[keyName].count == 0) {
                        // todo movement is probably redundant
                        this.clientEngine.sendInput(this.boundKeys[keyName].actionName, { movement: true });
                        this.keyState[keyName].count++;
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
     */
    bindKey(keys, actionName, options) {
        if (!Array.isArray(keys)) keys = [keys];

        let keyOptions = Object.assign({
            repeat: false
        }, options);

        keys.forEach(keyName => {
            this.boundKeys[keyName] = { actionName, options: keyOptions };
        });
    }

    // todo implement unbindKey

    onKeyChange(e, isDown) {
        e = e || window.event;

        let keyName = keyCodeTable[e.keyCode];
        if (keyName && this.boundKeys[keyName]) {
            if (this.keyState[keyName] == null) {
                this.keyState[keyName] = {
                    count: 0
                };
            }
            this.keyState[keyName].isDown = isDown;

            // key up, reset press count
            if (!isDown) this.keyState[keyName].count = 0;

            // keep reference to the last key pressed to avoid duplicates
            this.lastKeyPressed = isDown ? e.keyCode : null;
            // this.renderer.onKeyChange({ keyName, isDown });
            e.preventDefault();
        }
    }
}

export default KeyboardControls;
