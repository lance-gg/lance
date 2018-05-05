'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _GameComponent2 = require('../../serialize/GameComponent');

var _GameComponent3 = _interopRequireDefault(_GameComponent2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PixiRenderableComponent = function (_GameComponent) {
    _inherits(PixiRenderableComponent, _GameComponent);

    function PixiRenderableComponent(options) {
        _classCallCheck(this, PixiRenderableComponent);

        var _this = _possibleConstructorReturn(this, (PixiRenderableComponent.__proto__ || Object.getPrototypeOf(PixiRenderableComponent)).call(this));

        _this.options = options;
        return _this;
    }

    /**
     * Initial creation of the Pixi renderable
     * @returns A pixi container/sprite
     */


    _createClass(PixiRenderableComponent, [{
        key: 'createRenderable',
        value: function createRenderable() {
            var sprite = void 0;
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

    }, {
        key: 'render',
        value: function render() {
            if (this.options.onRender) {
                this.options.onRender();
            }
        }
    }]);

    return PixiRenderableComponent;
}(_GameComponent3.default);

exports.default = PixiRenderableComponent;