'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by The Blakes on 04-13-2017
 *
 */

var Callables = function () {
    function Callables(args) {
        _classCallCheck(this, Callables);

        this.list = [];

        if (args instanceof Array) {
            this.list = args;
        } else {
            this.list = this.getArg(args, 'list', []);
        }
    }

    _createClass(Callables, [{
        key: 'getArg',
        value: function getArg(args, key, fallback) {

            if (args.hasOwnProperty(key)) {

                return args[key];
            } else {
                return fallback;
            }
        }
    }, {
        key: 'call',
        value: function call() {
            $.each(this.list, function (ix, item) {

                if (typeof item.fire == 'function') {
                    item.fire();
                }

                if (typeof item.start == 'function') {
                    item.start();
                }

                if (typeof item.run == 'function') {
                    item.run();
                }

                if (typeof item.process == 'function') {
                    item.process();
                }
            });
        }
    }]);

    return Callables;
}();
//# sourceMappingURL=Callables.js.map
