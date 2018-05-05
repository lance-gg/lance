"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GameComponent = function () {
    function GameComponent() {
        _classCallCheck(this, GameComponent);

        /**
         * the gameObject this component is attached to. This gets set in the addComponent method
         * @member {GameObject}
         */
        this.parentObject = null;
    }

    _createClass(GameComponent, null, [{
        key: "name",
        get: function get() {
            return this.constructor.name;
        }
    }, {
        key: "netScheme",
        get: function get() {
            return null;
        }
    }]);

    return GameComponent;
}();

exports.default = GameComponent;