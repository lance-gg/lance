'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _PhysicsEngine2 = require('./PhysicsEngine');

var _PhysicsEngine3 = _interopRequireDefault(_PhysicsEngine2);

var _cannon = require('cannon');

var _cannon2 = _interopRequireDefault(_cannon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * CannonPhysicsEngine is a three-dimensional lightweight physics engine
 */
var CannonPhysicsEngine = function (_PhysicsEngine) {
    _inherits(CannonPhysicsEngine, _PhysicsEngine);

    function CannonPhysicsEngine(options) {
        _classCallCheck(this, CannonPhysicsEngine);

        var _this = _possibleConstructorReturn(this, (CannonPhysicsEngine.__proto__ || Object.getPrototypeOf(CannonPhysicsEngine)).call(this, options));

        _this.options.dt = _this.options.dt || 1 / 60;
        var world = _this.world = new _cannon2.default.World();
        world.quatNormalizeSkip = 0;
        world.quatNormalizeFast = false;
        world.gravity.set(0, -10, 0);
        world.broadphase = new _cannon2.default.NaiveBroadphase();
        _this.CANNON = _cannon2.default;
        return _this;
    }

    // entry point for a single step of the Simple Physics


    _createClass(CannonPhysicsEngine, [{
        key: 'step',
        value: function step(dt, objectFilter) {
            this.world.step(dt || this.options.dt);
        }
    }, {
        key: 'addSphere',
        value: function addSphere(radius, mass) {
            var shape = new _cannon2.default.Sphere(radius);
            var body = new _cannon2.default.Body({ mass: mass, shape: shape });
            body.position.set(0, 0, 0);
            this.world.addBody(body);
            return body;
        }
    }, {
        key: 'addBox',
        value: function addBox(x, y, z, mass, friction) {
            var shape = new _cannon2.default.Box(new _cannon2.default.Vec3(x, y, z));
            var options = { mass: mass, shape: shape };
            if (friction !== undefined) options.material = new _cannon2.default.Material({ friction: friction });

            var body = new _cannon2.default.Body(options);
            body.position.set(0, 0, 0);
            this.world.addBody(body);
            return body;
        }
    }, {
        key: 'addCylinder',
        value: function addCylinder(radiusTop, radiusBottom, height, numSegments, mass) {
            var shape = new _cannon2.default.Cylinder(radiusTop, radiusBottom, height, numSegments);
            var body = new _cannon2.default.Body({ mass: mass, shape: shape });
            this.world.addBody(body);
            return body;
        }
    }, {
        key: 'removeObject',
        value: function removeObject(obj) {
            this.world.removeBody(obj);
        }
    }]);

    return CannonPhysicsEngine;
}(_PhysicsEngine3.default);

exports.default = CannonPhysicsEngine;