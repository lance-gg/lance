'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _TwoVector = require('../../serialize/TwoVector');

var _TwoVector2 = _interopRequireDefault(_TwoVector);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var differenceVector = new _TwoVector2.default();

// The collision detection of SimplePhysicsEngine is a brute-force approach

var CollisionDetection = function () {
    function CollisionDetection(options) {
        _classCallCheck(this, CollisionDetection);

        this.options = Object.assign({ COLLISION_DISTANCE: 28 }, options);
        this.collisionPairs = {};
    }

    _createClass(CollisionDetection, [{
        key: 'init',
        value: function init(options) {
            this.gameEngine = options.gameEngine;
        }

        // check if pair (id1, id2) have collided

    }, {
        key: 'checkPair',
        value: function checkPair(id1, id2) {
            var objects = this.gameEngine.world.objects;
            var o1 = objects[id1];
            var o2 = objects[id2];

            // make sure that objects actually exist. might have been destroyed
            if (!o1 || !o2) return;
            var pairId = [id1, id2].join(',');
            differenceVector.copy(o1.position).subtract(o2.position);

            if (differenceVector.length() < this.options.COLLISION_DISTANCE) {
                if (!(pairId in this.collisionPairs)) {
                    this.collisionPairs[pairId] = true;
                    this.gameEngine.emit('collisionStart', { o1: o1, o2: o2 });
                }
            } else if (pairId in this.collisionPairs) {
                this.gameEngine.emit('collisionStop', { o1: o1, o2: o2 });
                delete this.collisionPairs[pairId];
            }
        }

        // detect by checking all pairs

    }, {
        key: 'detect',
        value: function detect() {
            var objects = this.gameEngine.world.objects;
            var keys = Object.keys(objects);

            //Delete non existed object's pairs
            for (var pairId in this.collisionPairs) {
                if (this.collisionPairs.hasOwnProperty(pairId)) if (keys.indexOf(pairId.split(',')[0]) === -1 || keys.indexOf(pairId.split(',')[1]) === -1) delete this.collisionPairs[pairId];
            }var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var k1 = _step.value;
                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                        for (var _iterator2 = keys[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            var k2 = _step2.value;

                            if (k2 > k1) this.checkPair(k1, k2);
                        }
                    } catch (err) {
                        _didIteratorError2 = true;
                        _iteratorError2 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                _iterator2.return();
                            }
                        } finally {
                            if (_didIteratorError2) {
                                throw _iteratorError2;
                            }
                        }
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
        }
    }]);

    return CollisionDetection;
}();

exports.default = CollisionDetection;