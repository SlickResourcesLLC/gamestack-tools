"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by The Blakes on 04-13-2017
 *
 */

var Force = function () {
        function Force(args) {
                _classCallCheck(this, Force);

                this.name = args.name || "";

                this.description = args.description || "";

                this.subjects = args.subjects || [];
                this.origin = args.origin || {};
                this.massObjects = args.massObjects || [];

                this.minSpeed = args.minSpeed || new Vector3(1, 1, 1);

                this.max = args.max || new Vector3(3, 3, 3);
                this.accel = args.accel || new Vector3(1.3, 1.3, 1.3);

                for (var x in args) {
                        this[x] = args[x];
                }
        }

        _createClass(Force, [{
                key: "getArg",
                value: function getArg(args, key, fallback) {

                        if (args.hasOwnProperty(key)) {

                                return args[key];
                        } else {
                                return fallback;
                        }
                }
        }, {
                key: "gravitateY",
                value: function gravitateY() {

                        var subjects = this.subjects;

                        var origin = this.origin || {};

                        var massObjects = this.massObjects;

                        var accel = this.accel || {};

                        var max = this.max || {};

                        $.each(subjects, function (ix, itemx) {

                                itemx.velocityY(accel, max);

                                $.each(massObjects, function (iy, itemy) {

                                        itemx.collide(itemy);
                                });
                        });
                }
        }]);

        return Force;
}();

;
//# sourceMappingURL=Force.js.map
