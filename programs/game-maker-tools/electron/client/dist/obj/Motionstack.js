'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by The Blakes on 04-13-2017
 *
 */

var Motionstack = function () {
        function Motionstack(args) {
                _classCallCheck(this, Motionstack);

                this.distance = this.getArg(args, 'distance', this.getArg(args, 'distances', false));

                this.curvesList = this.curvesObject();

                this.object_id = [args.object_id] || ["__blank"];

                this.curve = this.getArg(args, 'curve', TWEEN.Easing.Quadratic.InOut);

                this.targetRotation = this.getArg(args, 'targetRotation', 0);

                this.name = this.getArg(args, 'name', "__");

                this.description = this.getArg(args, 'description', false);

                this.curveString = this.getCurveString();

                this.setCurve(this.curveString);

                this.line = this.getArg(args, 'line', false);

                this.duration = this.getArg(args, 'duration', 500);

                this.delay = this.getArg(args, 'delay', 0);

                this.duration = this.getArg(args, 'duration', false);
        }

        _createClass(Motionstack, [{
                key: 'getArg',
                value: function getArg(args, key, fallback) {

                        if (args.hasOwnProperty(key)) {

                                return args[key];
                        } else {
                                return fallback;
                        }
                }
        }, {
                key: 'curvesObject',
                value: function curvesObject() {

                        var c = [];

                        Quazar.each(TWEEN.Easing, function (ix, easing) {

                                Quazar.each(easing, function (iy, easeType) {

                                        if (['in', 'out', 'inout'].indexOf(iy.toLowerCase()) >= 0) {

                                                c.push(ix + "_" + iy);
                                        }
                                });
                        });

                        return c;
                }
        }, {
                key: 'getCurveString',
                value: function getCurveString() {

                        var __inst = this;

                        var c;

                        $.each(TWEEN.Easing, function (ix, easing) {

                                $.each(TWEEN.Easing[ix], function (iy, easeType) {

                                        if (__inst.curve == TWEEN.Easing[ix][iy]) {

                                                c = ix + "_" + iy;
                                        }
                                });
                        });

                        return c;
                }
        }, {
                key: 'setCurve',
                value: function setCurve(c) {

                        var cps = c.split('_');

                        var s1 = cps[0],
                            s2 = cps[1];

                        var curve = TWEEN.Easing.Quadratic.InOut;

                        $.each(TWEEN.Easing, function (ix, easing) {

                                $.each(TWEEN.Easing[ix], function (iy, easeType) {

                                        if (ix == s1 && iy == s2) {

                                                alert('setting curve');

                                                curve = TWEEN.Easing[ix][iy];
                                        }
                                });
                        });

                        this.curve = curve;

                        return curve;
                }
        }, {
                key: 'engage',
                value: function engage() {

                        var tweens = [];

                        //construct a tween::

                        var __inst = this;

                        var objects = {};

                        $.each(Game.sprites, function (ix, item) {

                                $.each(__inst.object_id, function (iy, id_item) {

                                        if (item.id == id_item) {

                                                alert('mathc');

                                                objects[ix] = item;
                                        }
                                });
                        });

                        var target = {

                                x: __inst.distance.x + objects[0].position.x,
                                y: __inst.distance.y + objects[0].position.y,
                                z: __inst.distance.z + objects[0].position.z

                        };

                        if (__inst.targetRotation > 0 || __inst.targetRotation < 0) {

                                var targetR = __inst.targetRotation + objects[0].rotation.x;

                                //we have a target
                                tweens[0] = new TWEEN.Tween(objects[0].rotation).easing(__inst.curve || TWEEN.Easing.Elastic.InOut).to({ x: targetR }, 500).onUpdate(function () {
                                        //console.log(objects[0].position.x,objects[0].position.y);


                                }).onComplete(function () {
                                        //console.log(objects[0].position.x, objects[0].position.y);
                                        if (__inst.complete) {

                                                __inst.complete();
                                        }
                                });
                        }

                        //we have a target
                        tweens.push(new TWEEN.Tween(objects[0].position).easing(__inst.curve || TWEEN.Easing.Elastic.InOut).to(target, 500).onUpdate(function () {
                                //console.log(objects[0].position.x,objects[0].position.y);


                        }).onComplete(function () {
                                //console.log(objects[0].position.x, objects[0].position.y);

                                if (__inst.complete) {

                                        __inst.complete();
                                }
                        }));

                        __inst.delay = !isNaN(__inst.delay) && __inst.delay > 0 ? __inst.delay : 0;

                        return {

                                tweens: tweens,

                                delay: __inst.delay,

                                fire: function fire() {

                                        var __tweenObject = this;

                                        window.setTimeout(function () {

                                                for (var x = 0; x < __tweenObject.tweens.length; x++) {

                                                        __tweenObject.tweens[x].start();
                                                }
                                        }, this.delay);
                                }

                        };
                }
        }, {
                key: 'start',
                value: function start() {
                        this.engage().fire();
                }
        }, {
                key: 'onComplete',
                value: function onComplete(fun) {
                        this.complete = fun;
                }
        }]);

        return Motionstack;
}();

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
//# sourceMappingURL=Motionstack.js.map
