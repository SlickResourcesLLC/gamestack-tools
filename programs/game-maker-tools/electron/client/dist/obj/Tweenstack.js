'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by The Blakes on 04-13-2017
 *
 */

var TweenStack = function () {
        function TweenStack() {
                _classCallCheck(this, TweenStack);

                this.tweens = [];
        }

        _createClass(TweenStack, [{
                key: 'getCurveFromKey',
                value: function getCurveFromKey(key) {

                        var keys = key.split('.');

                        var curves = JSON.parse(JSON.stringify(this.Curves()));

                        for (var x in keys) {

                                if (curves[x]) {
                                        curves = curves[x];
                                }
                        }

                        return curves;
                }
        }, {
                key: 'custom_tween',
                value: function custom_tween(args) {

                        return args;
                }
        }, {
                key: 'add',
                value: function add(args) {

                        // create the tween


                        var property = Quazar.getArg(args, 'prop', Quazar.getArg(args, 'property', false));

                        var target = Quazar.getArg(args, 'target', false);
                        var object = Quazar.getArg(args, 'object', false);

                        var duration = Quazar.getArg(args, 'duration', false);

                        var cancel = Quazar.getArg(args, 'cancel', false);

                        var repeat = Quazar.getArg(args, 'repeat', false);

                        var curve = Quazar.getArg(args, 'curve', 'Linear');

                        var targetObject = {};

                        targetObject[property] = target;

                        this.tweens.push({ object: object, targetObject: targetObject, property: property, duration: duration, curve: curve });
                }
        }, {
                key: 'simultan',
                value: function simultan() {
                        Quazar.each(this.tweens, function (ix, item) {

                                console('');

                                item.start();
                        });
                }
        }, {
                key: 'synchro',
                value: function synchro() {}
        }, {
                key: 'start',
                value: function start() {

                        this.tweenObject.start();
                }
        }, {
                key: 'onUpdate',
                value: function onUpdate(callback) {}
        }, {
                key: 'onComplete',
                value: function onComplete(callback) {}
        }, {
                key: 'resolveCurve',
                value: function resolveCurve(key) {}
        }, {
                key: 'Curves',
                value: function Curves() {

                        return $Q.TWEEN.Easing;
                }
        }, {
                key: 'curveOptionsToArray',
                value: function curveOptionsToArray() {
                        var cs = [];

                        Quazar.each(TWEEN.Easing, function (ix, item) {

                                if (item.hasOwnProperty('In')) {
                                        cs.push(ix + '.In');
                                }

                                if (item.hasOwnProperty('Out')) {
                                        cs.push(ix + '.Out');
                                }
                                if (item.hasOwnProperty('InOut')) {
                                        cs.push(ix + '.InOut');
                                }
                        });

                        return cs;
                }
        }]);

        return TweenStack;
}();

;

var Game = Game || {};

var Motion = function Motion(key_members, value) {

        return {

                add: function add() {
                        this.update = function (obj) {
                                Quazar.each(key_members, function (ix, item) {
                                        obj[item] += value;
                                });
                        };
                },

                update: function update() {
                        console.error('unset update');
                },

                to: function to(obj) {
                        this.update();
                },

                object: object,

                value: value,

                id: id

        };
};

var TweenMotion = function TweenMotion(_ref) {
        var object = _ref.object,
            name = _ref.name,
            speed = _ref.speed,
            direction = _ref.direction,
            accel_curve = _ref.accel_curve,
            dispersionAngle = _ref.dispersionAngle,
            duration = _ref.duration,
            delay = _ref.delay,
            delayPerMember = _ref.delayPerMember;


        var directions_avail = ['up', 'upleft', 'left', 'downleft', 'down', 'downright', 'right', 'upright'];

        if (this.directions_avail.indexOf(direction.replace(' ', '').replace('-', '').replace('_', '').toLowerCase()) >= 0) {

                return {

                        movement_name: movement_name,

                        direction: direction,

                        accel_curve: accel_curve,

                        dispersionAngle: dispersionAngle,

                        delay: delay,

                        delayPerMember: delayPerMember,

                        fire: function fire() {

                                for (var x = 0; x <= speed; x++) {

                                        for (var y = 0; y <= speed; y++) {

                                                for (var z = 0; z <= speed; z++) {}
                                        }
                                }

                                switch (name) {}
                        }

                };
        }
};

Game.motion_actions = {

        zigzag: new MotionAction({
                name: 'zigzag',
                speed: 3,
                direction: 'left',
                accel_curve: TWEEN.Easing().Quadratic.InOut,
                dispersionAngle: 15,
                duration: 20,
                delay: 0,

                delayPerMember: 10,

                repeat: true

        }, 3)

};
//# sourceMappingURL=Tweenstack.js.map
