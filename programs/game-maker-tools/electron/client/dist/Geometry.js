'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by Administrator on 7/15/2017.
 */

var Vector3 = function Vector3(x, y, z, r) {
    _classCallCheck(this, Vector3);

    this.x = x;
    this.y = y;
    this.z = z;
    this.r = r;
};

;

var Vector2 = Vector3,
    Point = Vector3,
    Size = Vector3,
    Vertex = Vector3,
    Rotation = Vector3,
    Rot = Vector3,
    Position = Vector3,
    Pos = Vector3;

var Rectangle = function Rectangle(min, max) {
    _classCallCheck(this, Rectangle);

    this.min = min;
    this.max = max;
};

;

var VectorBounds = Rectangle;

var VectorFrameBounds = function VectorFrameBounds(min, max, termPoint) {
    _classCallCheck(this, VectorFrameBounds);

    this.min = min;
    this.max = max;

    this.termPoint = termPoint || new Vector3(this.max.x, this.max.y, this.max.z);
};

;

var Circle = function () {
    function Circle(args) {
        _classCallCheck(this, Circle);

        this.position = this.getArg(args, 'position', new Vector3(0, 0, 0));

        this.radius = this.getArgs(args, 'radius', 100);
    }

    _createClass(Circle, [{
        key: 'getArg',
        value: function getArg(args, key, fallback) {

            if (args.hasOwnProperty(key)) {

                return args[key];
            } else {
                return fallback;
            }
        }
    }]);

    return Circle;
}();
//# sourceMappingURL=Geometry.js.map
