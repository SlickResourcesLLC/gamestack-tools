"use strict";

/**
 * Created by The Blakes on 04-13-2017
 *
 */

var ControlOptions = function ControlOptions(_ref) {
    var object = _ref.object,
        ctrl_key = _ref.ctrl_key;


    this.left_stick_rotate = function (_ref2) {
        var max_speed = _ref2.max_speed,
            accel = _ref2.accel;
    };

    this.right_stick_rotate = function (_ref3) {
        var max_speed = _ref3.max_speed,
            accel = _ref3.accel;
    };

    this.left_stick_cruise = function (_ref4) {
        var max_speed_vector = _ref4.max_speed_vector,
            accel = _ref4.accel;
    };

    this.right_stick_cruise = function (_ref5) {
        var max_speed_vector = _ref5.max_speed_vector,
            accel = _ref5.accel;
    };

    this.jump = function (_ref6) {
        var button_key = _ref6.button_key;
    };

    this.flight = function (_ref7) {
        var button_key = _ref7.button_key;
    };
};
//# sourceMappingURL=ControlOption.js.map
