"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by The Blakes on 04-13-2017
 *
 */

var GravityOption = function () {
    function GravityOption(args) {
        _classCallCheck(this, GravityOption);
    }

    _createClass(GravityOption, [{
        key: "getArg",
        value: function getArg(args, key, fallback) {

            if (args.hasOwnProperty(key)) {

                return args[key];
            } else {
                return fallback;
            }
        }
    }, {
        key: "onFire",
        value: function onFire() {}
    }]);

    return GravityOption;
}();
//# sourceMappingURL=GravityOption.js.map
