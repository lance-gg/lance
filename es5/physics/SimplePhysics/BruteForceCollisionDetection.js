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

var BruteForceCollisionDetection = function () {
    function BruteForceCollisionDetection(options) {
        _classCallCheck(this, BruteForceCollisionDetection);

        this.options = Object.assign({}, options);
        this.collisionPairs = {};
    }

    _createClass(BruteForceCollisionDetection, [{
        key: 'init',
        value: function init(options) {
            this.gameEngine = options.gameEngine;
        }
    }, {
        key: 'findCollision',
        value: function findCollision(o1, o2) {

            // static objects don't collide
            if (o1.isStatic && o2.isStatic) return false;

            // radius-based collision
            if (this.options.collisionDistance) {
                differenceVector.copy(o1.position).subtract(o2.position);
                return differenceVector.length() < this.options.collisionDistance;
            }

            var o1Box = getBox(o1);
            var o2Box = getBox(o2);
            if (o1Box.xMin > o2Box.xMax || o1Box.yMin > o2Box.yMax || o2Box.xMin > o1Box.xMax || o2Box.yMin > o1Box.yMax) return false;

            if (!this.options.autoResolve) return true;

            // need to auto-resolve
            // Note 1: check y-axis before x-axis. Because standing on platform should be first check,
            //         to avoid sliding on platform
            // Note 2: overlap of object on top of platform sets y-velocity to zero, to help with
            //         gravity
            if (o1Box.yMin > o2Box.yMin && o1Box.yMin < o2Box.yMax) {
                var shift = o2Box.yMax - o1Box.yMin;
                if (o2.isStatic) {
                    o1.position.y += shift;
                    // as a very special case, landing on static object stop velocity
                    o1.velocity.y = 0;
                } else if (o1.isStatic) {
                    o2.position.y -= shift;
                } else {
                    o1.position.y += shift / 2;
                    o2.position.y -= shift / 2;
                }
            } else if (o1Box.yMax > o2Box.yMin && o1Box.yMax < o2Box.yMax) {
                var _shift = o1Box.yMax - o2Box.yMin;
                if (o2.isStatic) {
                    o1.position.y -= _shift;
                } else if (o1.isStatic) {
                    o2.position.y += _shift;
                    // as a very special case, landing on static object stop velocity
                    o2.velocity.y = 0;
                } else {
                    o1.position.y -= _shift / 2;
                    o2.position.y -= _shift / 2;
                }
            } else if (o1Box.xMin > o2Box.xMin && o1Box.xMin < o2Box.xMax) {
                var _shift2 = o2Box.xMax - o1Box.xMin;
                if (o2.isStatic) {
                    o1.position.x += _shift2;
                } else if (o1.isStatic) {
                    o2.position.x -= _shift2;
                } else {
                    o1.position.x += _shift2 / 2;
                    o2.position.x -= _shift2 / 2;
                }
            } else if (o1Box.xMax > o2Box.xMin && o1Box.xMax < o2Box.xMax) {
                var _shift3 = o1Box.xMax - o2Box.xMin;
                if (o2.isStatic) {
                    o1.position.x -= _shift3;
                } else if (o1.isStatic) {
                    o2.position.x += _shift3;
                } else {
                    o1.position.x -= _shift3 / 2;
                    o2.position.x -= _shift3 / 2;
                }
            }

            return true;
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

            if (this.findCollision(o1, o2)) {
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

            // delete non existant object pairs
            for (var pairId in this.collisionPairs) {
                if (this.collisionPairs.hasOwnProperty(pairId)) if (keys.indexOf(pairId.split(',')[0]) === -1 || keys.indexOf(pairId.split(',')[1]) === -1) delete this.collisionPairs[pairId];
            } // check all pairs
            var _iteratorNormalCompletion = true;
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

    return BruteForceCollisionDetection;
}();

// get bounding box of object o


exports.default = BruteForceCollisionDetection;
function getBox(o) {
    return {
        xMin: o.position.x,
        xMax: o.position.x + o.width,
        yMin: o.position.y,
        yMax: o.position.y + o.height
    };
}