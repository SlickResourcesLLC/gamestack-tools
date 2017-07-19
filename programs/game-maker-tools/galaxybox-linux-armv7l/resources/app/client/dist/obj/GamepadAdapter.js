"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Game = __gameInstance || {};

var GamepadAdapter = function () {
        function GamepadAdapter() {
                _classCallCheck(this, GamepadAdapter);

                this.__gamepads = [];

                this.intervals = [];

                var controller_stack = this;

                var _gpinst = this;

                window.setInterval(function () {

                        var gps = navigator.getGamepads();

                        _gpinst.gps = gps;

                        for (var x = 0; x < gps.length; x++) {

                                var events = _gpinst.__gamepads[x] ? _gpinst.__gamepads[x] : {};

                                _gpinst.process(gps[x], events);
                        }
                }, 20);
        }

        _createClass(GamepadAdapter, [{
                key: "gamepads",
                value: function gamepads() {

                        return navigator.getGamepads();
                }
        }, {
                key: "disconnect_all",
                value: function disconnect_all() {

                        for (var x = 0; x < this.intervals.length; x++) {

                                window.clearInterval(this.intervals[x]);
                        }
                }
        }, {
                key: "disconnect_by_index",
                value: function disconnect_by_index(game_pad_index) {

                        window.clearInterval(this.intervals[game_pad_index]);
                }
        }, {
                key: "hasAnyPad",
                value: function hasAnyPad() {
                        return "getGamepads" in navigator;
                }
        }, {
                key: "Event",
                value: function Event(key, game_pad, callback) {
                        return {

                                key: key, game_pad: game_pad, callback: callback

                        };
                }
        }, {
                key: "GamepadEvents",
                value: function GamepadEvents(args) {

                        var gp = {};

                        gp.stick_left = args.stick_left || function (x, y) {

                                //  console.log('Def call');

                        };

                        gp.stick_right = args.stick_right || function (x, y) {};

                        gp.buttons = [];

                        if (args.buttons) {
                                gp.buttons = args.buttons;
                        }

                        gp.on = function (key, callback) {

                                if (this[key] && key !== "on") {

                                        this[key] = callback;
                                } else if (key.indexOf('button') >= 0 && key.indexOf('_') >= 0) {
                                        var parts = key.split('_');

                                        var number;

                                        try {

                                                number = parseInt(parts[1]);

                                                gp['buttons'][number] = callback;
                                        } catch (e) {
                                                console.error('could not parse "on" event with ' + key);
                                        }
                                }
                        };

                        this.__gamepads.push(gp);

                        return gp;
                }
        }, {
                key: "process",
                value: function process(gp, gpEvents) {

                        this.process_buttons(gp, gpEvents);

                        this.process_axes(gp, gpEvents);
                }
        }, {
                key: "process_axes",
                value: function process_axes(gp, events) {

                        if (!gp || !gp['axes']) {

                                return false;
                        }

                        for (var i = 0; i < gp.axes.length; i += 2) {
                                var axis1 = gp.axes[i],
                                    axia2 = gp.axes[i + 1];

                                var ix = Math.ceil(i / 2) + 1,
                                    x = gp.axes[i],
                                    y = gp.axes[i + 1];

                                if (ix == 1 && events.stick_left) {
                                        events.stick_left(x, y);
                                }

                                if (ix == 2 && events.stick_right) {
                                        events.stick_right(x, y);
                                }

                                if (this.events && this.events['stick_' + i] && typeof this.events['stick_' + i].callback == 'function') {
                                        this.events['stick_' + i].callback();
                                }
                        }
                }
        }, {
                key: "process_buttons",
                value: function process_buttons(gp, events) {

                        if (!gp || !gp['buttons']) {
                                return false;
                        }

                        for (var i = 0; i < gp.buttons.length; i++) {

                                if (gp.buttons[i].pressed) {

                                        // console.log('button:' + i);

                                        if (typeof events.buttons[i] == 'function') {
                                                events.buttons[i](gp.buttons[i].pressed);
                                        } else if (_typeof(events.buttons[i]) == 'object' && typeof events.buttons[i].update == 'function') {
                                                events.buttons[i].update(events.buttons[i].pressed);
                                        }

                                        var clearance_1 = this.events && this.events[i],
                                            gpc,
                                            bkey = "button_" + i;

                                        if (clearance_1) {
                                                gpc = this.events[bkey] && !isNaN(this.events[bkey].game_pad) ? this.gamepads[this.events[bkey].game_pad] : this.events[bkey].game_pad;
                                        }
                                        ;

                                        if (clearance_1 && gpc && typeof this.events[bkey].callback == 'function') {
                                                //call the callback
                                                this.events[i].callback();
                                        }
                                }
                        }
                }
        }, {
                key: "on",
                value: function on(key, gpix, callback) {

                        if (typeof this[key] == 'function') {}

                        this.events.push(this.Event(key, gpix, callback));
                }
        }]);

        return GamepadAdapter;
}();

;

if (!__gameInstance.GamepadAdapter) {
        __gameInstance.GamepadAdapter = new GamepadAdapter();

        __gameInstance.gamepads = [];

        var gamepad = __gameInstance.GamepadAdapter.GamepadEvents({

                stick_left: function stick_left() {
                        // console.log('Left Stick callback');

                }

        });

        __gameInstance.gamepads.push(gamepad);
};
//# sourceMappingURL=GamepadAdapter.js.map
