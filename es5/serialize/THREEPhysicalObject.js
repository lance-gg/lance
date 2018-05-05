'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _PhysicalObject2 = require('./PhysicalObject');

var _PhysicalObject3 = _interopRequireDefault(_PhysicalObject2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var THREEPhysicalObject = function (_PhysicalObject) {
    _inherits(THREEPhysicalObject, _PhysicalObject);

    _createClass(THREEPhysicalObject, null, [{
        key: 'properties',
        get: function get() {
            return {
                id: 9, // class id //TODO this should hashed from the class name
                name: "THREEPhysicalObject"
            };
        }
    }]);

    function THREEPhysicalObject(id, x, y, z, rx, ry, rz) {
        _classCallCheck(this, THREEPhysicalObject);

        // note: calling apply with arguments array doesn't work on constructor
        var _this = _possibleConstructorReturn(this, (THREEPhysicalObject.__proto__ || Object.getPrototypeOf(THREEPhysicalObject)).call(this, id, x, y, z, rx, ry, rz));

        _this.class = THREEPhysicalObject;
        return _this;
    }

    // update the physics object with current position/rotation


    _createClass(THREEPhysicalObject, [{
        key: 'updateRenderObject',
        value: function updateRenderObject() {
            this.renderObject.position.set(this.x, this.y, this.z);
            this.renderObject.rotation.set(this.rx, this.ry, this.rz);
        }

        // synchronize using interpolation

    }, {
        key: 'interpolate',
        value: function interpolate(obj1, obj2, percent) {
            // TODO: switch from three parameters (x,y,z) to a single Point instance
            // TODO: switch from three parameters (rx,ry,rz) to a single Euler instance
            // interpolate the position coordinate values
            this.x = (obj2.x - obj1.x) * percent + obj1.x;
            this.y = (obj2.y - obj1.y) * percent + obj1.y;
            this.z = (obj2.z - obj1.z) * percent + obj1.z;

            // interpolate the rotation values
            var eRotationPrev = new THREE.Euler(obj1.rx, obj1.ry, obj1.rz, 'XYZ');
            var eRotationNext = new THREE.Euler(obj2.rx, obj2.ry, obj2.rz, 'XYZ');
            var qPrev = new THREE.Quaternion().setFromEuler(eRotationPrev);
            var qNext = new THREE.Quaternion().setFromEuler(eRotationNext);
            qPrev.slerp(qNext, percent);
            var eRotationNow = new THREE.Euler().setFromQuaternion(qPrev, 'XYZ');
            this.rx = eRotationNow.x;
            this.ry = eRotationNow.y;
            this.rz = eRotationNow.z;

            // update the renderer-specific data structures
            this.renderObject.position.set(this.x, this.y, this.z);
            this.renderObject.rotation.set(this.rx, this.ry, this.rz);
        }
    }]);

    return THREEPhysicalObject;
}(_PhysicalObject3.default);

exports.default = THREEPhysicalObject;