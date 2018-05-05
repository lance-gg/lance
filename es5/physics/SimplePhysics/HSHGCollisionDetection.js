'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _HSHG = require('./HSHG');

var _HSHG2 = _interopRequireDefault(_HSHG);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Collision detection based on Hierarchical Spatial Hash Grid
// uses this implementation https://gist.github.com/kirbysayshi/1760774
var HSHGCollisionDetection = function () {
    function HSHGCollisionDetection(options) {
        _classCallCheck(this, HSHGCollisionDetection);

        this.options = Object.assign({ COLLISION_DISTANCE: 28 }, options);
    }

    _createClass(HSHGCollisionDetection, [{
        key: 'init',
        value: function init(options) {
            var _this = this;

            this.gameEngine = options.gameEngine;
            this.grid = new _HSHG2.default();
            this.previousCollisionPairs = {};
            this.stepCollidingPairs = {};

            this.gameEngine.on('objectAdded', function (obj) {
                // add the gameEngine obj the the spatial grid
                _this.grid.addObject(obj);
            });

            this.gameEngine.on('objectDestroyed', function (obj) {
                // add the gameEngine obj the the spatial grid
                _this.grid.removeObject(obj);
            });
        }
    }, {
        key: 'detect',
        value: function detect() {
            this.grid.update();
            this.stepCollidingPairs = this.grid.queryForCollisionPairs().reduce(function (accumulator, currentValue, i) {
                var pairId = getArrayPairId(currentValue);
                accumulator[pairId] = { o1: currentValue[0], o2: currentValue[1] };
                return accumulator;
            }, {});

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = Object.keys(this.previousCollisionPairs)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var pairId = _step.value;

                    var pairObj = this.previousCollisionPairs[pairId];

                    // existed in previous pairs, but not during this step: this pair stopped colliding
                    if (pairId in this.stepCollidingPairs === false) {
                        this.gameEngine.emit('collisionStop', pairObj);
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

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = Object.keys(this.stepCollidingPairs)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var _pairId = _step2.value;

                    var _pairObj = this.stepCollidingPairs[_pairId];

                    // didn't exist in previous pairs, but exists now: this is a new colliding pair
                    if (_pairId in this.previousCollisionPairs === false) {
                        this.gameEngine.emit('collisionStart', _pairObj);
                    }
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

            this.previousCollisionPairs = this.stepCollidingPairs;
        }

        /**
         * checks wheter two objects are currently colliding
         * @param o1 {Object} first object
         * @param o2 {Object} second object
         * @returns {boolean} are the two objects colliding?
         */

    }, {
        key: 'areObjectsColliding',
        value: function areObjectsColliding(o1, o2) {
            return getArrayPairId([o1, o2]) in this.stepCollidingPairs;
        }
    }]);

    return HSHGCollisionDetection;
}();

exports.default = HSHGCollisionDetection;


function getArrayPairId(arrayPair) {
    // make sure to get the same id regardless of object order
    var sortedArrayPair = arrayPair.slice(0).sort();
    return sortedArrayPair[0].id + '-' + sortedArrayPair[1].id;
}

module.exports = HSHGCollisionDetection;