'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Renderer2 = require('./Renderer');

var _Renderer3 = _interopRequireDefault(_Renderer2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* global THREE */


// TODO: I have mixed feelings about this class.  It doesn't actually provide
// anything useful.  I assume each game will write their own renderer even in THREE.
// we can make it store a list of objects, and provide a Raycaster, and send events.
// But it hijacks the creation of the scene and the THREE.renderer.  It doesn't make
// sense to me that the camera and lights are in the derived class, but the scene and
// renderer are in the base class.  seems like inheritance-abuse.
var ThreeRenderer = function (_Renderer) {
    _inherits(ThreeRenderer, _Renderer);

    // constructor
    function ThreeRenderer() {
        _classCallCheck(this, ThreeRenderer);

        var _this = _possibleConstructorReturn(this, (ThreeRenderer.__proto__ || Object.getPrototypeOf(ThreeRenderer)).call(this));

        _this.scene = null;
        _this.camera = null;
        _this.renderer = null;
        return _this;
    }

    // setup the 3D scene


    _createClass(ThreeRenderer, [{
        key: 'init',
        value: function init() {

            _get(ThreeRenderer.prototype.__proto__ || Object.getPrototypeOf(ThreeRenderer.prototype), 'init', this).call(this);

            // setup the scene
            this.scene = new THREE.Scene();

            // setup the renderer and add the canvas to the body
            this.renderer = new THREE.WebGLRenderer({
                antialias: true
            });
            document.getElementById('viewport').appendChild(this.renderer.domElement);

            // a local raycaster
            this.raycaster = new THREE.Raycaster();

            // TODO: is this still needed?
            this.THREE = THREE;
        }

        // single step

    }, {
        key: 'draw',
        value: function draw() {
            this.renderer.render(this.scene, this.camera);
        }

        // add one object

    }, {
        key: 'addObject',
        value: function addObject(id) {
            // this.scene.add(sphere);
            // return sphere;
        }
    }, {
        key: 'removeObject',
        value: function removeObject(o) {
            this.scene.remove(o);
        }
    }]);

    return ThreeRenderer;
}(_Renderer3.default);

exports.default = ThreeRenderer;