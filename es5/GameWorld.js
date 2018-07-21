'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * This class represents an instance of the game world,
 * where all data pertaining to the current state of the
 * world is saved.
 */
var GameWorld = function () {

    /**
     * Constructor of the World instance
     */
    function GameWorld() {
        _classCallCheck(this, GameWorld);

        this.stepCount = 0;
        this.objects = {};
        this.playerCount = 0;
        this.idCount = 0;
    }

    /**
     * Gets a new, fresh and unused id that can be used for a new object
     * @return {Number} the new id
     */


    _createClass(GameWorld, [{
        key: 'getNewId',
        value: function getNewId() {
            var possibleId = this.idCount;
            // find a free id
            while (possibleId in this.objects) {
                possibleId++;
            }this.idCount = possibleId + 1;
            return possibleId;
        }

        /**
         * Returns all the game world objects which match a criteria
         * @param {Object} query The query object
         * @param {Object} [query.id] object id
         * @param {Object} [query.playerId] player id
         * @param {Class} [query.instanceType] matches whether `object instanceof instanceType`
         * @param {Array} [query.components] An array of component names
         * @param {Boolean} [query.returnSingle] Return the first object matched
         * @returns {Array | Object} All game objects which match all the query parameters, or the first match if returnSingle was specified
         */

    }, {
        key: 'queryObjects',
        value: function queryObjects(query) {
            var queriedObjects = [];

            // todo this is currently a somewhat inefficient implementation for API testing purposes.
            // It should be implemented with cached dictionaries like in nano-ecs
            this.forEachObject(function (id, object) {
                var conditions = [];

                // object id condition
                conditions.push(!('id' in query) || query.id !== null && object.id === query.id);

                // player id condition
                conditions.push(!('playerId' in query) || query.playerId !== null && object.playerId === query.playerId);

                // instance type conditio
                conditions.push(!('instanceType' in query) || query.instanceType !== null && object instanceof query.instanceType);

                // components conditions
                if ('components' in query) {
                    query.components.forEach(function (componentClass) {
                        conditions.push(object.hasComponent(componentClass));
                    });
                }

                // all conditions are true, object is qualified for the query
                if (conditions.every(function (value) {
                    return value;
                })) {
                    queriedObjects.push(object);
                    if (query.returnSingle) return false;
                }
            });

            // return a single object or null
            if (query.returnSingle) {
                return queriedObjects.length > 0 ? queriedObjects[0] : null;
            }

            return queriedObjects;
        }

        /**
         * Returns The first game object encountered which matches a criteria.
         * Syntactic sugar for {@link queryObject} with `returnSingle: true`
         * @param query See queryObjects
         * @returns {Object}
         */

    }, {
        key: 'queryObject',
        value: function queryObject(query) {
            return this.queryObjects(Object.assign(query, {
                returnSingle: true
            }));
        }

        /**
         * Add an object to the game world
         * @param {Object} object object to add
         */

    }, {
        key: 'addObject',
        value: function addObject(object) {
            this.objects[object.id] = object;
        }

        /**
         * Remove an object from the game world
         * @param {number} id id of the object to remove
         */

    }, {
        key: 'removeObject',
        value: function removeObject(id) {
            delete this.objects[id];
        }

        /**
         * World object iterator.
         * Invoke callback(objId, obj) for each object
         *
         * @param {function} callback function receives id and object. If callback returns false, the iteration will cease
         */

    }, {
        key: 'forEachObject',
        value: function forEachObject(callback) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = Object.keys(this.objects)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var id = _step.value;

                    var returnValue = callback(id, this.objects[id]); // TODO: the key should be Number(id)
                    if (returnValue === false) break;
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

    return GameWorld;
}();

exports.default = GameWorld;