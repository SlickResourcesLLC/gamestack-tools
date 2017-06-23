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

                this.frames = $Q.getArg(args, 'frames', []);

                this.image = new GameImage($Q.getArg(args, 'src', $Q.getArg(args, 'image', false)));

                this.domElement = this.image.domElement;

                this.attack_level = $Q.getArg(args, 'attack_level', 0);

                this.heal_level = $Q.getArg(args, 'heal_level', 0);

                this.type = $Q.getArg(args, 'type', 'basic');

                this.delay = $Q.getArg(args, 'delay', 0);

                this.cix = 0;

                var _anime = this;

                Quazar.each(args, function (ix, item) {

                        if (ix !== 'parent') {
                                _anime[ix] = item;
                        }
                });

                this.frameSize = this.getArg(args, 'frameSize', new Vector3(0, 0, 0));

                this.frameBounds = this.getArg(args, 'frameBounds', new VectorBounds(new Vector3(0, 0, 0), new Vector3(0, 0, 0)));

                this.frameOffset = this.getArg(args, 'frameOffset', new Vector3(0, 0, 0));

                this.apply2DFrames(args.parent || {});

                this.flipX = this.getArg(args, 'flipX', false);

                this.priority = this.getArg(args, 'priority', 0);

                this.cix = 0;

                this.selected_frame = this.frames[0];

                this.earlyTerm = this.getArg(args, 'earlyTerm', false);

                this.hang = this.getArg(args, 'hang', false);

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
                key: 'apply3DFrames',
                value: function apply3DFrames(frames) {

                        this.three_dimen = false;

                        var _a = this;

                        $Q.each(frames, function (ix, frame) {

                                if (typeof frame == 'Frame3D') {

                                        _a.three_dimen = true;

                                        //Assemble a web-gl texture 3D from

                                        Quazar.log('TODO: apply webgl / threejs Texture3D set');
                                }
                        });
                }
        }, {
                key: 'apply2DFrames',
                value: function apply2DFrames(parent) {

                        //this.parent = parent;


                        this.frames = [];

                        var fcount = 0;

                        for (var y = this.frameBounds.min.y; y <= this.frameBounds.max.y; y++) {

                                for (var x = this.frameBounds.min.x; x <= this.frameBounds.max.x; x++) {

                                        //Quazar.log('assembling animation with:' + jstr(this.frameBounds) + ':frames len:' + this.frames.length);


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
                key: 'reset',
                value: function reset() //special reset function:: frames are re-rendered each reset()
                {

                        //1. reset the GameImage


                        //2. apply the frames

                        this.apply2DFrames(this.parent);
                }
        }, {
                key: 'update',
                value: function update() {

                        this.selected_frame = this.frames[this.cix % this.frames.length];
                }
        }, {
                key: 'reset',
                value: function reset() {

                        this.cix = 0;
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
