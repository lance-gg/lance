'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Renderer2 = require('../Renderer');

var _Renderer3 = _interopRequireDefault(_Renderer2);

var _PixiRenderableComponent = require('./PixiRenderableComponent');

var _PixiRenderableComponent2 = _interopRequireDefault(_PixiRenderableComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Pixi Renderer
 */
var PixiRenderer = function (_Renderer) {
    _inherits(PixiRenderer, _Renderer);

    _createClass(PixiRenderer, [{
        key: 'ASSETPATHS',


        /**
         * Returns a dictionary of image assets and their paths
         * E.G. {
                    ship: 'assets/ship.png',
                    missile: 'assets/missile.png',
                }
         * @returns {{}}
         * @constructor
         */
        get: function get() {
            return {};
        }
    }]);

    function PixiRenderer(gameEngine, clientEngine) {
        _classCallCheck(this, PixiRenderer);

        var _this = _possibleConstructorReturn(this, (PixiRenderer.__proto__ || Object.getPrototypeOf(PixiRenderer)).call(this, gameEngine, clientEngine));

        _this.sprites = {};
        _this.isReady = false;
        return _this;
    }

    _createClass(PixiRenderer, [{
        key: 'init',
        value: function init() {
            var _this2 = this;

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

            if (document.readyState === 'complete' || document.readyState === 'loaded' || document.readyState === 'interactive') {
                this.onDOMLoaded();
            } else {
                document.addEventListener('DOMContentLoaded', function () {
                    _this2.onDOMLoaded();
                });
            }

            this.initPromise = new Promise(function (resolve, reject) {
                var onLoadComplete = function onLoadComplete() {
                    _this2.isReady = true;
                    resolve();
                };

                var resourceList = Object.keys(_this2.ASSETPATHS).map(function (x) {
                    return {
                        name: x,
                        url: _this2.ASSETPATHS[x]
                    };
                });

                // make sure there are actual resources in the queue
                if (resourceList.length > 0) PIXI.loader.add(resourceList).load(onLoadComplete);else onLoadComplete();
            });

            return this.initPromise;
        }
    }, {
        key: 'onDOMLoaded',
        value: function onDOMLoaded() {
            this.renderer = PIXI.autoDetectRenderer(this.viewportWidth, this.viewportHeight);
            document.body.querySelector('.pixiContainer').appendChild(this.renderer.view);
        }
    }, {
        key: 'draw',
        value: function draw() {
            _get(PixiRenderer.prototype.__proto__ || Object.getPrototypeOf(PixiRenderer.prototype), 'draw', this).call(this);

            if (!this.isReady) return; // assets might not have been loaded yet

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = Object.keys(this.sprites)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var objId = _step.value;

                    var objData = this.gameEngine.world.objects[objId];
                    var sprite = this.sprites[objId];

                    if (objData) {
                        sprite.x = objData.position.x;
                        sprite.y = objData.position.y;
                        sprite.rotation = this.gameEngine.world.objects[objId].angle * Math.PI / 180;
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            this.renderer.render(this.stage);
        }
    }, {
        key: 'addObject',
        value: function addObject(obj) {
            if (obj.hasComponent(_PixiRenderableComponent2.default)) {
                var renderable = obj.getComponent(_PixiRenderableComponent2.default);
                var sprite = this.sprites[obj.id] = renderable.createRenderable();
                sprite.anchor.set(0.5, 0.5);
                sprite.position.set(obj.position.x, obj.position.y);
                this.layers.base.addChild(sprite);
            }
        }
    }, {
        key: 'removeObject',
        value: function removeObject(obj) {
            if (obj.hasComponent(_PixiRenderableComponent2.default)) {
                var sprite = this.sprites[obj.id];
                if (sprite) {
                    this.sprites[obj.id].destroy();
                    delete this.sprites[obj.id];
                }
            }
        }
    }]);

    return PixiRenderer;
}(_Renderer3.default);

exports.default = PixiRenderer;