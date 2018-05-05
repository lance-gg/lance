'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Renderer2 = require('./Renderer');

var _Renderer3 = _interopRequireDefault(_Renderer2);

var _system = require('./aframe/system');

var _system2 = _interopRequireDefault(_system);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* globals AFRAME */

/**
 * The A-Frame Renderer
 */
var AFrameRenderer = function (_Renderer) {
    _inherits(AFrameRenderer, _Renderer);

    /**
    * Constructor of the Renderer singleton.
    * @param {GameEngine} gameEngine - Reference to the GameEngine instance.
    * @param {ClientEngine} clientEngine - Reference to the ClientEngine instance.
    */
    function AFrameRenderer(gameEngine, clientEngine) {
        _classCallCheck(this, AFrameRenderer);

        // set up the networkedPhysics as an A-Frame system
        var _this = _possibleConstructorReturn(this, (AFrameRenderer.__proto__ || Object.getPrototypeOf(AFrameRenderer)).call(this, gameEngine, clientEngine));

        _system2.default.setGlobals(gameEngine, _this);
        AFRAME.registerSystem('networked-physics', _system2.default);
        return _this;
    }

    _createClass(AFrameRenderer, [{
        key: 'reportSlowFrameRate',
        value: function reportSlowFrameRate() {
            this.gameEngine.emit('client__slowFrameRate');
        }

        /**
         * Initialize the renderer.
         * @return {Promise} Resolves when renderer is ready.
        */

    }, {
        key: 'init',
        value: function init() {

            var p = _get(AFrameRenderer.prototype.__proto__ || Object.getPrototypeOf(AFrameRenderer.prototype), 'init', this).call(this);

            var sceneElArray = document.getElementsByTagName('a-scene');
            if (sceneElArray.length !== 1) {
                throw new Error('A-Frame scene element not found');
            }
            this.scene = sceneElArray[0];

            this.gameEngine.on('objectRemoved', function (o) {
                o.renderObj.remove();
            });

            return p; // eslint-disable-line new-cap
        }

        /**
         * In AFrame, we set the draw method (which is called at requestAnimationFrame)
         * to a NO-OP. See tick() instead
         */

    }, {
        key: 'draw',
        value: function draw() {}
    }, {
        key: 'tick',
        value: function tick(t, dt) {
            _get(AFrameRenderer.prototype.__proto__ || Object.getPrototypeOf(AFrameRenderer.prototype), 'draw', this).call(this, t, dt);
        }
    }]);

    return AFrameRenderer;
}(_Renderer3.default);

exports.default = AFrameRenderer;