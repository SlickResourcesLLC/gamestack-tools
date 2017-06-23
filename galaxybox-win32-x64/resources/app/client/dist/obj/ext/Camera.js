'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by The Blakes on 04-13-2017
 *
 *
 */

var Camera = function () {
    function Camera(position) {
        _classCallCheck(this, Camera);

        this.position = Quazar.getArg(args, 'position', Quazar.getArg(args, 'pos', new Vector3(0, 0, 0)));
    }

    _createClass(Camera, [{
        key: 'follow',
        value: function follow(object, accel, max, distSize) {}
    }, {
        key: 'circle',
        value: function circle(object, accel, max, targetPoint, radius) {}
    }, {
        key: 'lookAt',
        value: function lookAt(pos) {}
    }]);

    return Camera;
}();
//# sourceMappingURL=Camera.js.map
