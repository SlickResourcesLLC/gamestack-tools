'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by The Blakes on 04-13-2017
 *
 */

var Animation = function () {
        function Animation(args) {
                _classCallCheck(this, Animation);

                args = args || {};

                var _anime = this;

                this.name = $Q.getArg(args, 'name', '_blank'), this.description = $Q.getArg(args, 'description', '_blank');

                this.frames = $Q.getArg(args, 'frames', []);

                this.image = new GameImage($Q.getArg(args, 'src', $Q.getArg(args, 'image', false)));

                this.src = this.image.domElement.src;

                this.domElement = this.image.domElement;

                this.type = $Q.getArg(args, 'type', 'basic');

                this.delay = $Q.getArg(args, 'delay', 0);

                this.cix = 0;

                this.frameSize = this.getArg(args, 'frameSize', new Vector3(0, 0, 0));

                this.frameBounds = this.getArg(args, 'frameBounds', new VectorFrameBounds(new Vector3(0, 0, 0), new Vector3(0, 0, 0), new Vector3(0, 0, 0)));

                this.frameOffset = this.getArg(args, 'frameOffset', new Vector3(0, 0, 0));

                this.apply2DFrames(args.parent || {});

                this.flipX = $Q.getArg(args, 'flipX', false);

                this.priority = $Q.getArg(args, 'priority', 0);

                this.cix = 0;

                this.selected_frame = this.frames[0];

                this.earlyTerm = this.getArg(args, 'earlyTerm', false);

                this.hang = this.getArg(args, 'hang', false);

                this.duration = this.getArg(args, 'duration', false);

                this.effects = [];

                this.timer = 0;
        }

        _createClass(Animation, [{
                key: 'getArg',
                value: function getArg(args, key, fallback) {

                        if (args.hasOwnProperty(key)) {

                                return args[key];
                        } else {
                                return fallback;
                        }
                }
        }, {
                key: 'apply2DFrames',
                value: function apply2DFrames(parent) {

                        this.frames = [];

                        var fcount = 0;

                        for (var y = this.frameBounds.min.y; y <= this.frameBounds.max.y; y++) {

                                for (var x = this.frameBounds.min.x; x <= this.frameBounds.max.x; x++) {

                                        var framePos = { x: x * this.frameSize.x + this.frameOffset.x, y: y * this.frameSize.y + this.frameOffset.y };

                                        this.frames.push({ image: this.image, frameSize: this.frameSize, framePos: framePos });

                                        fcount += 1;

                                        if (!isNaN(this.earlyTerm)) {

                                                if (fcount >= this.earlyTerm) {
                                                        return 0;
                                                }
                                        }
                                }
                        }

                        this.frames[0] = !this.frames[0] ? {
                                image: this.image,
                                frameSize: this.frameSize,
                                framePos: { x: this.frameBounds.min.x, y: this.frameBounds.min.y }
                        } : this.frames[0];

                        this.selected_frame = this.frames[0];
                }
        }, {
                key: 'resetFrames',
                value: function resetFrames() //special reset function:: frames are re-rendered each reset()
                {

                        this.apply2DFrames();
                }
        }, {
                key: 'update',
                value: function update() {

                        this.selected_frame = this.frames[this.cix % this.frames.length];
                }
        }, {
                key: 'reset',
                value: function reset() {

                        this.resetFrames();

                        this.cix = 0;
                }
        }, {
                key: 'engage_once',
                value: function engage_once() {

                        var __inst = this;

                        //we have a target
                        this.tween = new TWEEN.Tween(this).easing(__inst.curve || TWEEN.Easing.Linear).to({ cix: this.frames.length - 1 }, this.duration || this.frames.length * 20).onUpdate(function () {
                                //console.log(objects[0].position.x,objects[0].position.y);


                        }).onComplete(function () {
                                //console.log(objects[0].position.x, objects[0].position.y);

                                if (__inst.complete) {

                                        __inst.complete();
                                }
                        });
                }
        }, {
                key: 'onComplete',
                value: function onComplete(fun) {
                        this.complete = fun;
                }
        }, {
                key: 'animate',
                value: function animate() {

                        this.timer += 1;

                        Quazar.log('ANIMATING with frame count:' + this.frames.length);

                        if (this.timer % this.delay == 0) {

                                if (this.hang) {
                                        this.cix = this.cix + 1;

                                        if (this.cix > this.frames.length - 1) {
                                                this.cix = this.frames.length - 1;
                                        }
                                } else {

                                        this.cix = this.cix >= this.frames.length - 1 ? this.frameBounds.min.x : this.cix + 1;
                                }

                                this.update();
                        }
                }
        }]);

        return Animation;
}();

;
//# sourceMappingURL=Animation.js.map
