'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**@author
Jordan Edward Blake
 * */

function Squeeze() {
        this.EffectSequence = EffectSequence;

        this.each = function (obj, callback) {
                for (var x in obj) {

                        callback(x, obj[x]);
                }
        };

        this.LayeredAnimation = function (animations) {

                console.log('TODO');
        };

        this.SequencedAnimation = function (animations) {

                console.log('TODO');
        };
}

; /**
  * Takes an object of arguments and returns Animation() object.
  * @param   {Object} args object of arguments
  * @param   {string} args.name optional
  * @param   {string} args.description optional
  * @param   {string} args.type optional
  * @param   {Vector} args.size of the Animation object, has x and y properties
  * @param   {Vector} args.frameSize the size of frames in Animation, having x and y properties
  * @param   {VectorFrameBounds} args.frameBounds the bounds of the Animation having min, max, and termPoint properties
  * @param   {number} args.delay optional, the seconds to delay before running animation when started by the start() function
  
  * @param   {number} args.duration how many milliseconds the animation should take to complete
  *
  * @returns {Animation} an Animation object
  */

var Animation = function () {
        function Animation() {
                var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                _classCallCheck(this, Animation);

                args = args || {};

                var _anime = this;

                this.defaultArgs = {

                        name: "my-animation",

                        description: "my-description",

                        frames: [],

                        type: "none",

                        delay: 0,

                        frameSize: new Vector3(44, 44, 0),

                        frameBounds: new VectorFrameBounds(new Vector3(0, 0, 0), new Vector3(0, 0, 0), new Vector3(0, 0, 0)),

                        frameOffset: new Vector3(0, 0, 0),

                        flipX: false,

                        duration: 1000,

                        size: new Vector3(20, 20, 20)
                };

                for (var x in this.defaultArgs) {
                        if (!args.hasOwnProperty(x)) {
                                args[x] = this.defaultArgs[x];
                        }
                };

                for (var x in this.args) {
                        this[x] = args[x];
                }

                this.name = args.name || "__";

                this.description = args.description || "__";

                this.image = new GameImage(__gameStack.getArg(args, 'src', __gameStack.getArg(args, 'image', false)));

                this.src = this.image.domElement.src;

                this.domElement = this.image.domElement;

                this.frameSize = this.getArg(args, 'frameSize', new Vector3(44, 44, 0));

                this.frameBounds = this.getArg(args, 'frameBounds', new VectorFrameBounds(new Vector3(0, 0, 0), new Vector3(0, 0, 0), new Vector3(0, 0, 0)));

                this.frameOffset = this.getArg(args, 'frameOffset', new Vector3(0, 0, 0));

                this.extras = this.getArg(args, 'extras', false);

                if ((typeof args === 'undefined' ? 'undefined' : _typeof(args)) == 'object' && args.frameBounds && args.frameSize) {
                        this.apply2DFrames(args.parent || {});
                }

                this.flipX = this.getArg(args, 'flipX', false);

                this.cix = 0;

                this.selected_frame = this.frames[0];

                this.timer = 0;

                this.duration = args.duration || 2000;

                this.seesaw_mode = args.seesaw_mode || false;
        }

        _createClass(Animation, [{
                key: 'singleFrame',
                value: function singleFrame(frameSize, size) {

                        this.__frametype = 'single';

                        this.frameSize = frameSize;

                        this.size = size || this.frameSize;

                        this.selected_frame = {
                                image: this.image,
                                frameSize: this.frameSize,
                                framePos: { x: 0, y: 0 }
                        };

                        this.frames[0] = this.selected_frame;

                        return this;
                }
        }, {
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
                value: function apply2DFrames() {

                        this.frames = [];

                        var fcount = 0;

                        var quitLoop = false;

                        for (var y = this.frameBounds.min.y; y <= this.frameBounds.max.y; y++) {

                                for (var x = this.frameBounds.min.x; x <= this.frameBounds.max.x; x++) {

                                        var framePos = { x: x * this.frameSize.x + this.frameOffset.x, y: y * this.frameSize.y + this.frameOffset.y };

                                        this.frames.push({ image: this.image, frameSize: this.frameSize, framePos: framePos });

                                        if (x >= this.frameBounds.termPoint.x && y >= this.frameBounds.termPoint.y) {

                                                quitLoop = true;

                                                break;
                                        }

                                        fcount += 1;

                                        if (quitLoop) break;
                                }
                        }

                        this.frames[0] = !this.frames[0] ? {
                                image: this.image,
                                frameSize: this.frameSize,
                                framePos: { x: this.frameBounds.min.x, y: this.frameBounds.min.y }
                        } : this.frames[0];

                        if (this.seesaw_mode) {
                                console.log('ANIMATION: applying seesaw');

                                var frames_reversed = this.frames.slice().reverse();

                                this.frames.pop();

                                this.frames = this.frames.concat(frames_reversed);
                        }

                        // this.selected_frame = this.frames[this.cix % this.frames.length] || this.frames[0];
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

                        this.selected_frame = this.frames[Math.round(this.cix) % this.frames.length];
                }
        }, {
                key: 'reset',
                value: function reset() {

                        this.resetFrames();

                        this.cix = 0;
                }
        }, {
                key: 'continuous',
                value: function continuous(duration) {

                        if (this.__frametype == 'single') {
                                return 0;
                        }

                        this.apply2DFrames();

                        //update once:
                        this.update();

                        if (this.cix == 0) {

                                this.engage();
                        }
                }
        }, {
                key: 'engage',
                value: function engage(duration, complete) {

                        if (this.__frametype == 'single') {
                                return 0;
                        }

                        var __inst = this;

                        this.complete = complete || this.complete || function () {};

                        duration = duration || typeof this.duration == 'number' ? this.duration : this.frames.length * 20;

                        if (this.cix == 0 && this.extras) {
                                this.extras.call(); //fire any extras attached
                        }

                        //we have a target
                        this.tween = new TWEEN.Tween(this).easing(__inst.curve || TWEEN.Easing.Linear.None).to({ cix: __inst.frames.length - 1 }, duration).onUpdate(function () {
                                //console.log(objects[0].position.x,objects[0].position.y);

                                //   __inst.cix = Math.ceil(__inst.cix);

                                __inst.update();
                        }).onComplete(function () {
                                //console.log(objects[0].position.x, objects[0].position.y);

                                if (__inst.complete) {

                                        __inst.complete();
                                }

                                __inst.cix = 0;

                                __inst.isComplete = true;
                        });

                        this.tween.start();
                }
        }, {
                key: 'onComplete',
                value: function onComplete(fun) {
                        this.complete = fun;
                }
        }, {
                key: 'animate',
                value: function animate() {

                        this.apply2DFrames();

                        this.timer += 1;

                        if (this.delay == 0 || this.timer % this.delay == 0) {

                                if (this.cix == 0 && this.extras) {
                                        this.extras.call(); //fire any extras attached
                                }

                                if (this.cix >= this.frames.length - 1 && typeof this.complete == 'function') {
                                        this.complete(this);
                                }

                                this.cix = this.cix >= this.frames.length - 1 ? this.frameBounds.min.x : this.cix + 1;

                                this.update();
                        }
                }
        }]);

        return Animation;
}();

;

Gamestack.Animation = Animation;; /*
                                  * Canvas
                                  *    draw animations, textures to the screen
                                  * */

var EffectSequence = function () {
        function EffectSequence() {
                var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                _classCallCheck(this, EffectSequence);

                console.log('Effect Sequence');

                for (var x in args) {
                        this[x] = args[x];
                }

                this.animation = args.animation || false;

                this.name = args.name || "__none";

                this.effects = Gamestack.JSManipulate;

                this.setEffect(args.selected_effect_key || args.selected_effect || this.effects.triangleripple);

                console.log('created effect of: ' + this.getSelectedEffectKey());

                this.effects_list = [];

                this.effects_list[0] = this.selected_effect;

                this.effect_guis = [];

                this.numberSteps = 10;

                this.curve = args.curve || TWEEN.Easing.Linear.None;

                this.counter = 0;

                this.duration = 3000;

                this.seesaw_mode = args.seesaw_mode || true; //loop effects back to original state

                this.canvas = document.createElement('canvas');

                this.testCtx = this.canvas.getContext('2d');

                this.values = {};

                this.initValues(args);

                this.minFloat = function (portion) {
                        for (var x in this.startValues) {

                                this.startValues[x] = this.valueRanges[x].max * portion;
                        }
                };

                this.maxFloat = function (portion) {
                        for (var x in this.endValues) {

                                this.endValues[x] = this.valueRanges[x].max * portion;
                        }
                };

                this.iterables = {

                        __canvasList: [],

                        __dataList: []

                };
        }

        _createClass(EffectSequence, [{
                key: 'getSelectedEffectKey',
                value: function getSelectedEffectKey() {
                        return this.selected_effect_key;
                }
        }, {
                key: 'setEffect',
                value: function setEffect(effect) {

                        for (var x in this.effects) {
                                if (x == effect || effect == this.effects[x]) {

                                        this.selected_effect_key = x;

                                        this.selected_effect = this.effects[x];

                                        this.effects_list = [];

                                        this.effects_list[0] = this.selected_effect;
                                }
                        }
                }
        }, {
                key: 'initValues',
                value: function initValues(args) {
                        this.startValues = args.startValues || {};

                        this.endValues = args.endValues || {};

                        for (var x in this.selected_effect.valueRanges) {

                                if (typeof this.startValues[x] !== 'number') {

                                        this.startValues[x] = this.selected_effect.valueRanges[x].min;

                                        this.endValues[x] = this.selected_effect.valueRanges[x].max;
                                }
                        }

                        this.values = JSON.parse(jstr(this.startValues));

                        this.valueRanges = this.selected_effect.valueRanges;
                }
        }, {
                key: 'ondone',
                value: function ondone() {}
        }, {
                key: 'onerror',
                value: function onerror() {}
        }, {
                key: 'onchunk',
                value: function onchunk() {}
        }, {
                key: 'apply',
                value: function apply(sprite, canvas, completeCallback) {
                        var __inst = this;

                        __inst.sprite = sprite;

                        __inst.canvas = canvas;

                        var frames = [];

                        function copyImageData(ctx, src) {
                                var dst = ctx.createImageData(src.width, src.height);
                                dst.data.set(src.data);
                                return dst;
                        };

                        function callCompletion() {
                                if (__inst.ondone) {

                                        __inst.ondone(__inst.iterables);
                                }

                                if (completeCallback) {
                                        completeCallback(__inst.image_data_list);
                                }
                        }

                        function frameToCanvas(img) {
                                if (!__inst.iterables.__canvasList[__inst.counter]) {

                                        var c = document.createElement('CANVAS'),
                                            ct = c.getContext('2d');

                                        c.width = __inst.source_image.width;

                                        c.height = __inst.source_image.height;

                                        c.style.background = "blue";

                                        ct.restore();

                                        ct.save();

                                        ct.putImageData(img, 0, 0);

                                        __inst.iterables.__canvasList.push(c);

                                        __inst.iterables.__dataList.push(img);

                                        if (__inst.onchunk) {
                                                __inst.onchunk(c, img);
                                        }
                                } else {
                                        //do nothing
                                }
                        }

                        if (this.counter == 0) {

                                if (canvas && this.selected_effect && this.selected_effect.hasOwnProperty('filter')) {

                                        this.timer_diff = 0;

                                        var ctx = canvas.getContext('2d');

                                        __inst.values = JSON.parse(jstr(__inst.startValues));

                                        var tween = new TWEEN.Tween(this.values).to(this.endValues, this.duration).easing(this.curve).onUpdate(function () {

                                                if (!__inst.source_image) {

                                                        __inst.source_image = ctx.getImageData(sprite.position.x, sprite.position.y, sprite.size.x, sprite.size.y);

                                                        console.log('image is set');
                                                }

                                                var img = copyImageData(ctx, __inst.source_image);

                                                __inst.selected_effect.filter(img, __inst.values);

                                                sprite.selected_animation.selected_frame.image.data = img;

                                                frameToCanvas(img);

                                                __inst.counter += 1;
                                        }).onComplete(function () {

                                                if (__inst.seesaw_mode) {

                                                        var tween2 = new TWEEN.Tween(__inst.values).to(__inst.startValues, __inst.duration).easing(__inst.curve).onUpdate(function () {

                                                                if (!__inst.source_image) {

                                                                        __inst.source_image = ctx.getImageData(sprite.position.x, sprite.position.y, sprite.size.x, sprite.size.y);

                                                                        console.log('image is set');
                                                                }

                                                                var img = copyImageData(ctx, __inst.source_image);

                                                                __inst.selected_effect.filter(img, __inst.values);

                                                                sprite.selected_animation.selected_frame.image.data = img;

                                                                frameToCanvas(img);

                                                                __inst.counter += 1;
                                                        }).onComplete(function () {

                                                                callCompletion(__inst.source_image);

                                                                __inst.counter = 0;
                                                        }).start();
                                                } else {

                                                        callCompletion(__inst.source_image);

                                                        __inst.counter = 0;
                                                }
                                        }).start();
                                }
                        }
                }
        }]);

        return EffectSequence;
}();

;

/**
 * Takes the min and max vectors of rectangular shape and returns Rectangle Object.
 * @param   {Object} args object of arguments
 * @param   {Vector} args.min the minimum vector point (x,y)
 * @param   {Vector} args.max the maximum vector point (x,y)
 *
 * @returns {Rectangle} a Rectangle object
 */

var Rectangle = function Rectangle(min, max) {
        _classCallCheck(this, Rectangle);

        this.min = min;
        this.max = max;
};

;

var VectorBounds = Rectangle;

Gamestack.Rectangle = Rectangle;

/**
 * Takes the min and max vectors plus termPoint ('termination-point'), returns VectorFrameBounds
 *  *use this to define the bounds of an Animation object.
 * @param   {Object} args object of arguments
 * @param   {Vector} args.min the minimum vector point (x,y)
 * @param   {Vector} args.max the maximum vector point (x,y)
 * @param   {Vector} args.termPoint the termPoint vector point (x,y)
 * -While a min and max Vector(x,y) will describe the grid of Animation frames, the termPoint will indicate the last frame to show on the grid (Animations may stop early on the 'grid')
 * @returns {VectorFrameBounds} a VectorFrameBounds object
 */

var VectorFrameBounds = function (_Rectangle) {
        _inherits(VectorFrameBounds, _Rectangle);

        function VectorFrameBounds(min, max, termPoint) {
                _classCallCheck(this, VectorFrameBounds);

                var _this = _possibleConstructorReturn(this, (VectorFrameBounds.__proto__ || Object.getPrototypeOf(VectorFrameBounds)).call(this, min, max));

                _this.termPoint = termPoint || new Vector3(_this.max.x, _this.max.y, _this.max.z);

                return _this;
        }

        return VectorFrameBounds;
}(Rectangle);

;

Gamestack.VectorFrameBounds = VectorFrameBounds;

var Curves = { //ALL HAVE INPUT AND OUTPUT OF: 0-1.0
        // no easing, no acceleration
        linearNone: function linearNone(t) {
                return t;
        },
        // accelerating from zero velocity
        easeInQuadratic: function easeInQuadratic(t) {
                return t * t;
        },
        // decelerating to zero velocity
        easeOutQuadratic: function easeOutQuadratic(t) {
                return t * (2 - t);
        },
        // acceleration until halfway, then deceleration
        easeInOutQuadratic: function easeInOutQuadratic(t) {
                return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        },
        // accelerating from zero velocity
        easeInCubic: function easeInCubic(t) {
                return t * t * t;
        },
        // decelerating to zero velocity
        easeOutCubic: function easeOutCubic(t) {
                return --t * t * t + 1;
        },
        // acceleration until halfway, then deceleration
        easeInOutCubic: function easeInOutCubic(t) {
                return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        },
        // accelerating from zero velocity
        easeInQuartic: function easeInQuartic(t) {
                return t * t * t * t;
        },
        // decelerating to zero velocity
        easeOutQuartic: function easeOutQuartic(t) {
                return 1 - --t * t * t * t;
        },
        // acceleration until halfway, then deceleration
        easeInOutQuartic: function easeInOutQuartic(t) {
                return t < .5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
        },
        // accelerating from zero velocity
        easeInQuintic: function easeInQuintic(t) {
                return t * t * t * t * t;
        },
        // decelerating to zero velocity
        easeOutQuintic: function easeOutQuintic(t) {
                return 1 + --t * t * t * t * t;
        },
        // acceleration until halfway, then deceleration
        easeInOutQuintic: function easeInOutQuintic(t) {
                return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
        }
};

Gamestack.Curves = Curves;

/**
 * Takes several args and returns Line object. Intended for curved-line / trajectory of Projectile Object.
 * @param   {Object} args object of arguments
 * @param   {Easing} args.curve the curve applied to line see TWEEN.Easing , limited options for immediate line-drawing
 * @param   {number} args.duration the millisecond duration of Line
 * @param   {Vector} args.position the position vector
 *
 * @param   {number} args.pointDist the numeric point-distance
 *
 * @param   {Vector} args.size the size vector
 *
 * @param   {number} args.rotation the numeric rotation of -360 - 360
 *
 * @param   {number} args.growth the numeric growth
 *
 * -While a min and max Vector(x,y) will describe the grid of Animation frames, the termPoint will indicate the last frame to show on the grid (Animations may stop early on the 'grid')
 * @returns {VectorFrameBounds} a VectorFrameBounds object
 */

var Line = function () {
        function Line() {
                var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                _classCallCheck(this, Line);

                this.curve_string = args.curve_string || "Linear_None";

                this.curve = this.get_curve_from_string(this.curve_string);

                this.motion_curve = args.motion_curve || TWEEN.Easing.Linear.None;

                if (typeof args.curve == 'function') {
                        this.curve = args.curve;
                }

                this.points = [];

                this.position = args.position || new Vector();

                this.is_highlighted = args.is_highlighted || false;

                this.offset = args.offset || new Vector();

                this.pointDist = 5;

                this.size = args.size || new Vector();

                this.rotation = args.rotation || 0;

                this.iterations = 1;

                this.growth = args.growth || 1.2;

                this.curve_options = Curves;
        }

        _createClass(Line, [{
                key: 'Iterations',
                value: function Iterations(n) {

                        this.iterations = n;
                        return this;
                }
        }, {
                key: 'Growth',
                value: function Growth(n) {
                        this.growth = n;

                        return this;
                }
        }, {
                key: 'Pos',
                value: function Pos(p) {

                        this.position = p;
                        return this;
                }
        }, {
                key: 'PointDisp',
                value: function PointDisp(num) {
                        this.minPointDist = num;
                        return this;
                }
        }, {
                key: 'Curve',
                value: function Curve(c) {
                        this.curve = c;
                        this.curve_string = this.get_curve_string(c);
                        return this;
                }
        }, {
                key: 'Duration',
                value: function Duration(d) {
                        this.duration = d;

                        return this;
                }
        }, {
                key: 'get_curve_from_string',
                value: function get_curve_from_string(str) {

                        for (var x in this.curve_options) {

                                if (x.toLowerCase() == str.toLowerCase().replace('_', '')) {
                                        return this.curve_options[x];
                                }
                        }
                }
        }, {
                key: 'get_curve_string',
                value: function get_curve_string(c) {
                        for (var x in this.curve_options) {

                                if (this.curve_options[x] == c) {
                                        return x;
                                }
                        }
                }
        }, {
                key: 'getGraphCanvas',
                value: function getGraphCanvas(curveCall, existing_canvas) {

                        var canvas = existing_canvas || document.createElement('canvas');

                        canvas.style.position = "relative";

                        canvas.id = 'curve-display';

                        canvas.setAttribute('class', 'motion-curve');

                        canvas.width = 180;
                        canvas.height = 100;

                        canvas.style.background = "black";

                        var context = canvas.getContext('2d');
                        context.fillStyle = "rgb(0,0,0)";
                        context.fillRect(0, 0, 180, 100);

                        context.lineWidth = 0.5;
                        context.strokeStyle = "rgb(230,230,230)";

                        context.beginPath();
                        context.moveTo(0, 20);
                        context.lineTo(180, 20);
                        context.moveTo(0, 80);
                        context.lineTo(180, 80);
                        context.closePath();
                        context.stroke();

                        context.lineWidth = 2;
                        context.strokeStyle = "rgb(255,127,127)";

                        var position = { x: 0, y: 80 };
                        var position_old = { x: 0, y: 80 };

                        this.test_graph_size = new Vector(185, 80 - 20);

                        var points = this.get_line_segment(this.test_graph_size, 5, curveCall);

                        for (var x in points) {
                                var position = new Vector(points[x].x, this.test_graph_size.y + 20 - points[x].y);

                                context.beginPath();
                                context.moveTo(position_old.x, position_old.y);
                                context.lineTo(position.x, position.y);
                                context.closePath();
                                context.stroke();

                                position_old.x = position.x;
                                position_old.y = position.y;
                        }

                        return canvas;
                }
        }, {
                key: 'get_line_segment',
                value: function get_line_segment(size, pointDist, curveCall) {
                        if (!size || !pointDist) //***PREVENT DOUBLE RUN
                                {

                                        return 0;
                                }

                        var points = [];

                        var current_point = new Vector(0, 0, 0);

                        var position = new Vector(current_point),
                            target = new Vector(position.add(size)),
                            start = new Vector(position),
                            curveMethod = curveCall,
                            ptrack = new Vector(start);

                        for (position.x = position.x; position.x < target.x; position.x += 1) {

                                var dist = position.sub(start);

                                var pct = dist.x / size.x;

                                console.log(pct);

                                position.y = Math.round(curveMethod(pct) * size.y);

                                if (ptrack.trig_distance_xy(position) >= pointDist) {

                                        var p = new Vector(Gamestack.GeoMath.rotatePointsXY(position.x, position.y, 0));

                                        points.push(p);

                                        current_point = new Vector(position);

                                        ptrack = new Vector(current_point);
                                }
                        }

                        return points;
                }
        }, {
                key: 'fill',
                value: function fill(size, pointDist) {

                        if (!size || !pointDist) //***PREVENT DOUBLE RUN
                                {

                                        return 0;
                                }

                        this.size = size;

                        this.pointDist = pointDist;

                        var __inst = this;

                        this.points = [];

                        var current_point = new Vector(this.position),
                            yTrack = 0;

                        for (var x = 0; x <= this.iterations; x++) {

                                var position = new Vector(current_point),
                                    target = new Vector(position.add(size)),
                                    start = new Vector(position),
                                    curveMethod = this.curve,
                                    ptrack = new Vector(start);

                                for (position.x = position.x; position.x < target.x; position.x += 1) {

                                        var dist = position.sub(start);

                                        var pct = dist.x / size.x;

                                        position.y = start.y + Math.round(curveMethod(pct) * size.y);

                                        if (current_point.trig_distance_xy(position) >= this.pointDist) {

                                                var p = new Vector(Gamestack.GeoMath.rotatePointsXY(position.x, position.y, this.rotation));

                                                this.points.push(p);

                                                current_point = new Vector(position);
                                        }
                                }

                                size = size.mult(this.growth);
                        }
                }
        }, {
                key: 'transpose',
                value: function transpose(origin) {

                        var t_points = [];

                        for (var x = 0; x < this.points.length; x++) {

                                t_points.push(this.points[x].add(origin));
                        }

                        return t_points;
                }
        }, {
                key: 'add_segment',
                value: function add_segment(next_segment, offset) {
                        for (var x = 0; x < next_segment.length; x++) {

                                next_segment[x] = new Vector(next_segment[x]).add(offset);

                                this.points.push(next_segment[x]);
                        }
                }
        }, {
                key: 'get_flipped_segment',
                value: function get_flipped_segment(points) {

                        var t_points = points.slice(),
                            t_len = t_points.length;

                        for (var x = 0; x < points.length; x++) {

                                t_points[t_len - x].x = points[x].x;
                        }

                        return t_points;
                }
        }, {
                key: 'Highlight',
                value: function Highlight(origin, ctx) {

                        ctx = ctx || Gamestack.ctx;

                        for (var x in this.points) {

                                var point = origin.add(this.points[x]).sub(Gamestack.point_highlighter.size.mult(0.5));

                                var dist = point.sub(Gamestack.point_highlighter.position);

                                var d = Math.sqrt(dist.x * dist.x + dist.y * dist.y);

                                if (d >= 10) {
                                        Gamestack.point_highlighter.position = new Vector2(origin.add(this.points[x]).sub(Gamestack.point_highlighter.size.mult(0.5)));
                                }

                                Canvas.draw(Gamestack.point_highlighter, ctx);
                        }

                        return this;
                }
        }]);

        return Line;
}();

var GeoMath = {

        rotatePointsXY: function rotatePointsXY(x, y, angle) {

                var theta = angle * Math.PI / 180;

                var point = {};
                point.x = x * Math.cos(theta) - y * Math.sin(theta);
                point.y = x * Math.sin(theta) + y * Math.cos(theta);

                point.z = 0;

                return point;
        }

};

Gamestack.GeoMath = GeoMath;
; /**
  * Takes an object of arguments and returns Sprite() object. Sprite() is a container for multiple Animations, Motions, and Sounds. Sprites have several behavioral functions for 2d-Game-Objects.
  
  * @param   {Object} args object of arguments
  * @param   {string} args.name optional
  * @param   {string} args.description optional
  
  * @param   {string} args.src the source file for the GameImage:Sprite.image :: use a string / file-path
  
  * @param   {Vector} args.size the size of the Sprite
  * @param   {Vector} args.position the position of the Sprite
  * @param   {Vector} args.padding the 'float-type' Vector of x and y padding to use when processing collision on the Sprite. A padding of new Vector(0.2, 0.2) will result in 1/5 of Sprite size for padding
  
  
  
  * @param   {Animation} args.selected_animation the selected_animation of the Sprite:: pass during creation or use Sprite.setAnimation after created
  *
  * @returns {Sprite} a Sprite object
  */

var Sprite = function () {
        function Sprite(args) {
                _classCallCheck(this, Sprite);

                if (!args) {
                        args = {};
                }

                if (args instanceof Animation) {

                        args = { selected_animation: args, size: new Vector(args.frameSize) };
                }

                this.active = true; //active sprites are visible

                this.name = args.name || "__";

                this.description = args.description || "__";

                this.gravity = "medium";

                this.__initializers = __gameStack.getArg(args, '__initializers', []);

                var _spr = this;

                Gamestack.each(args, function (ix, item) {
                        //apply all args

                        if (ix !== 'parent') {
                                _spr[ix] = item;
                        }
                });

                this.type = __gameStack.getArg(args, 'type', 'basic');

                this.animations = __gameStack.getArg(args, 'animations', []);

                this.motions = __gameStack.getArg(args, 'motions', []);

                this.projectiles = __gameStack.getArg(args, 'projectiles', []);

                var __inst = this;

                this.id = __gameStack.getArg(args, 'id', this.create_id());

                this.sounds = __gameStack.getArg(args, 'sounds', []);

                this.image = new GameImage(__gameStack.getArg(args, 'src', __gameStack.getArg(args, 'image', false)));

                this.size = new Vector(__gameStack.getArg(args, 'size', new Vector3(100, 100)));

                this.position = new Vector(__gameStack.getArg(args, 'position', new Vector3(0, 0, 0)));

                this.collision_bounds = __gameStack.getArg(args, 'collision_bounds', new VectorBounds(new Vector3(0, 0, 0), new Vector3(0, 0, 0)));

                this.rotation = new Vector(__gameStack.getArg(args, 'rotation', new Vector3(0, 0, 0)));

                this.selected_animation = {};

                this.speed = __gameStack.getArg(args, 'speed', new Vector3(0, 0, 0));

                this.acceleration = __gameStack.getArg(args, 'acceleration', new Vector3(0, 0, 0));

                this.rot_speed = __gameStack.getArg(args, 'rot_speed', new Vector3(0, 0, 0));

                this.rot_accel = __gameStack.getArg(args, 'rot_accel', new Vector3(0, 0, 0));

                this.padding = __gameStack.getArg(args, 'padding', new Vector3(0, 0, 0));

                //Apply / instantiate Sound(), Motion(), and Animation() args...

                GameStack.each(this.sounds, function (ix, item) {

                        __inst.sounds[ix] = new Sound(item);
                });

                GameStack.each(this.motions, function (ix, item) {

                        __inst.motions[ix] = new Motion(item);
                });

                GameStack.each(this.animations, function (ix, item) {

                        __inst.animations[ix] = new Animation(item);
                });

                GameStack.each(this.projectiles, function (ix, item) {

                        __inst.projectiles[ix] = new Projectile(item);
                });

                //Apply initializers:

                GameStack.each(this.__initializers, function (ix, item) {

                        __inst.onInit(item);
                });

                if (args.selected_animation) {
                        this.selected_animation = new Animation(args.selected_animation);
                } else {

                        this.image.domElement.onload = function () {

                                __inst.setAnimation(__inst.animations[0] || new Animation({

                                        image: __inst.image,

                                        frameSize: new Vector3(__inst.image.domElement.width, __inst.image.domElement.height),

                                        frameBounds: new VectorFrameBounds(new Vector3(), new Vector3())

                                }));
                        };
                }
        }

        /**
         * This function initializes sprites. Call to trigger all functions previously passed to onInit().
         *
         * @function
         * @memberof Sprite
         **********/

        _createClass(Sprite, [{
                key: 'init',
                value: function init() {}

                /**
                 * This function extends the init() function. Takes single function() argument OR single string argument
                 * @function
                 * @memberof Sprite
                 * @param {function} fun the function to be passed into the init() event of the Sprite()
                 **********/

        }, {
                key: 'onInit',
                value: function onInit(fun) {

                        if (typeof fun == 'string') {

                                if (this.__initializers.indexOf(fun) < 0) {

                                        this.__initializers.push(fun);
                                }
                                ;

                                var __inst = this;

                                var keys = fun.split('.');

                                console.log('finding init from string:' + fun);

                                if (!keys.length >= 2) {
                                        return console.error('need min 2 string keys separated by "."');
                                }

                                var f = GameStack.options.SpriteInitializers[keys[0]][keys[1]];

                                if (typeof f == 'function') {

                                        var __inst = this;

                                        var f_init = this.init;

                                        this.init = function () {

                                                f_init(__inst);

                                                f(__inst);
                                        };
                                }
                        } else if (typeof fun == 'function') {

                                console.log('extending init:');

                                var f_init = this.init;
                                var __inst = this;

                                this.init = function () {

                                        f_init(__inst);

                                        fun(__inst);
                                };
                        } else if ((typeof fun === 'undefined' ? 'undefined' : _typeof(fun)) == 'object') {

                                console.log('extending init:');

                                console.info('Quick2D does not yet implement onInit() from arg of object type');
                        }
                }

                /*****************************
                 * Getters
                 ***************************/

                /**
                 * This function gets the 'id' of the Sprite()
                 * @function
                 * @memberof Sprite
                 * @returns {string}
                 **********/

        }, {
                key: 'get_id',
                value: function get_id() {
                        return this.id;
                }
        }, {
                key: 'to_map_object',
                value: function to_map_object(size, framesize) {

                        this.__mapSize = new Vector3(size || this.size);

                        this.frameSize = new Vector3(framesize || this.size);

                        return this;
                }

                /*****************************
                 * Setters and Creators
                 ***************************/

                /**
                 * This function creates the 'id' of the Sprite():Called automatically on constructor()
                 * @function
                 * @memberof Sprite
                 * @returns {string}
                 **********/

        }, {
                key: 'create_id',
                value: function create_id() {

                        return Quick2d.create_id();
                }

                /**
                 * This function sets the size of the Sprite()
                 * @function
                 * @memberof Sprite
                 **********/

        }, {
                key: 'setSize',
                value: function setSize(size) {

                        this.size = new Vector3(size.x, size.y, size.z);
                }

                /**
                 * This function sets the position of the Sprite()
                 * @function
                 * @memberof Sprite
                 **********/

        }, {
                key: 'setPos',
                value: function setPos(pos) {
                        this.position = new Vector3(pos.x, pos.y, pos.z || 0);
                }

                /**
                 * This function sizes the Sprite according to minimum dimensions and existing w/h ratios
                 * @param {number} mx the maximum size.x for the resize
                 * @param {number} my the maximum size.y for the resize
                 * @function
                 * @memberof Sprite
                 **********/

        }, {
                key: 'getCappedSizeXY',
                value: function getCappedSizeXY(mx, my, currentSize) {

                        var size = new Vector3(currentSize || this.size);

                        var wth = size.y / size.x;

                        var htw = size.x / size.y;

                        if (size.x > mx) {
                                size.x = mx;

                                size.y = size.x * wth;
                        }

                        if (size.y > my) {
                                size.y = my;

                                size.x = size.y * htw;
                        }

                        return size;
                }

                /*****************************
                 *  assertSpeed()
                 *  -assert the existence of a speed{} object
                 ***************************/

        }, {
                key: 'assertSpeed',
                value: function assertSpeed() {
                        if (!this.speed) {

                                this.speed = new Vector3(0, 0, 0);
                        }
                }

                /*****************************
                 *  setAnimation(anime)
                 *  -set the select_animation of this sprite
                 ***************************/

                /**
                 * This function sets the 'selected_animation' property of the Sprite():: *all Sprites must have a 'selected_animation'
                 * @function
                 * @memberof Sprite
                 * @param {Animation}
                 **********/

        }, {
                key: 'setAnimation',
                value: function setAnimation(anime) {

                        if (anime instanceof Animation && this.animations.indexOf(anime) < 0) {
                                this.animations.push(anime);
                        }

                        this.selected_animation = anime;

                        Gamestack.log('declared default animation');

                        return this;
                }

                /**
                 * This function indicates if this Sprite is onScreen within the Gamestack.WIDTH && Gamestack.HEIGHT dimensions, OR any w & h passed as arguments
                 * @function
                 * @memberof Sprite
                 * @param {number} w optional WIDTH argument, defaults to Gamestack.WIDTH
                 * @param {number} h optional HEIGHT argument, defaults to Gamestack.HEIGHT
                 **********/

        }, {
                key: 'onScreen',
                value: function onScreen(w, h) {

                        w = w || __gameStack.WIDTH;

                        h = h || __gameStack.HEIGHT;

                        var camera = __gameStack.camera || __gameStack.__gameWindow.camera || new Vector3(0, 0, 0);

                        var p = new Vector3(this.position.x - camera.position.x, this.position.y - camera.position.y, this.position.z - camera.position.z);

                        var onScreen = p.x > 0 - this.size.x && p.x < w + this.size.x && p.y > 0 - this.size.x && p.y < h + this.size.y ? true : false;

                        return onScreen;
                }

                /*****************************
                 * Updates
                 ***************************/

                /*****************************
                 * update()
                 * -starts empty:: is used by Quick2d.js as the main sprite update
                 ***************************/

                /**
                 * This function is the main update() function for the Sprite
                 * @function
                 * @memberof Sprite
                 **********/

        }, {
                key: 'update',
                value: function update(sprite) {}

                /*****************************
                 * def_update()
                 * -applies speed and other default factors of movement::
                 * -is used by Quick2d.js as the system def_update (default update)
                 ***************************/

                /**
                 * This function updates various speed and rotational-speed properties for the Sprite()
                 * @function
                 * @memberof Sprite
                 **********/

        }, {
                key: 'def_update',
                value: function def_update(sprite) {

                        for (var x in this.speed) {

                                if (this.speed[x] > 0 || this.speed[x] < 0) {

                                        this.position[x] += this.speed[x];
                                }
                        }

                        for (var x in this.acceleration) {

                                if (this.acceleration[x] > 0 || this.acceleration[x] < 0) {

                                        this.speed[x] += this.acceleration[x];
                                }
                        }

                        for (var x in this.rot_speed) {

                                if (this.rot_speed[x] > 0 || this.rot_speed[x] < 0) {

                                        this.rotation[x] += this.rot_speed[x];
                                }
                        }

                        for (var x in this.rot_accel) {

                                if (this.rot_accel[x] > 0 || this.rot_accel[x] < 0) {

                                        this.rot_speed[x] += this.rot_accel[x];
                                }
                        }
                }

                /**
                 * This function resolves a function nested in an object, from a string-key, and it is applied by Gamestack.js for persistence of data and Sprite() behaviors
                 * @function
                 * @memberof Sprite
                 **********/

        }, {
                key: 'resolveFunctionFromDoubleKeys',
                value: function resolveFunctionFromDoubleKeys(keyString1, keyString2, obj, callback) {

                        callback(typeof obj[keyString1][keyString2] == 'function' ? obj[keyString1][keyString2] : {});
                }

                /**
                 * This function extends an existing function, and is applied by Gamestack in onInit();
                 * @function
                 * @memberof Sprite
                 **********/

        }, {
                key: 'extendFunc',
                value: function extendFunc(fun, extendedFunc) {

                        console.log('extending func');

                        var ef = extendedFunc;

                        var __inst = this;

                        return function () {

                                ef(__inst);

                                //any new function comes after

                                fun(__inst);
                        };
                }

                /*****************************
                 *  onUpdate(fun)
                 * -args: 1 function(sprite){ } //the self-instance/sprite is passed into the function()
                 * -overrides and maintains existing code for update(){} function
                 ***************************/

                /**
                 * Extends the update() of this sprite with a new function to be called during update()
                 * @function
                 * @memberof Sprite
                 * @param {function} the function to apply to the Sprite:update()
                 **********/

        }, {
                key: 'onUpdate',
                value: function onUpdate(fun) {
                        fun = fun || function () {};

                        var update = this.update;

                        var __inst = this;

                        this.update = function (__inst) {
                                update(__inst);
                                fun(__inst);
                        };
                }

                /**
                 *
                 * <ul>
                 *     <li>A rectangular style position</li>
                 *      <li>Takes another sprite as argument</li>
                 *       <li>Returns basic true || false during runtime</li>
                 * </ul>
                 * @function
                 * @memberof Sprite
                 * @param {sprite}
                 **********/

                /**
                 * Get the true || false results of a Collision between two Sprites(), based on their position Vectors and Sizes
                 * @function
                 * @memberof Sprite
                 * @param {Sprite} sprite the alternate Sprite to process collision with
                 **********/

        }, {
                key: 'collidesRectangular',
                value: function collidesRectangular(sprite) {

                        return Gamestack.Collision.spriteRectanglesCollide(this, sprite);
                }

                /*****************************
                 *  shoot(sprite)
                 *  -fire a shot from the sprite:: as in a firing gun or spaceship
                 *  -takes options{} for number of shots anglePerShot etc...
                 *  -TODO: complete and test this code
                 ***************************/

                /**
                 * Sprite fires a projectile object
                 * <ul>
                 *     <li>Easy instantiator for bullets and propelled objects in GameStack</li>
                 *     <li>*TODO: This function is not-yet implemented in GameStack</li>
                 * </ul>
                 * @function
                 * @memberof Sprite
                 * @param {options} *numerous args
                 **********/

                /**
                 * fire a projectile-subSprite from the Sprite
                 * @function
                 * @memberof Sprite
                 * @param {Object} options an object of arguments
                 * @param {Animation} animation the animation to fire from the Sprite
                 * @param {number} speed the speed of the shot that is projected
                 * @param {Vector} position the initial position of the shot: defaults to current Sprite position
                 * @param {Vector} size the Vector size of the shot
                 * @param {Vector} rot_offset the rotational offset to apply: controls direction of the shot
                 **********/

        }, {
                key: 'shoot',
                value: function shoot(options) {
                        //character shoots an animation

                        this.prep_key = 'shoot';

                        var animation = options.bullet || options.animation || new Animation();

                        var speed = options.speed || 1;

                        var position = options.position || new Vector3(this.position);

                        var size = options.size || new Vector3(10, 10, 0);

                        var rot_offset = options.rot_offset || new Vector3(0, 0, 0);

                        if (__gameInstance.isAtPlay) {

                                var bx = position.x,
                                    by = position.y,
                                    bw = size.x,
                                    bh = size.y;

                                var shot = __gameStack.add(new Sprite({

                                        active: true,

                                        position: position,

                                        size: size,

                                        image: animation.image,

                                        rotation: new Vector3(0, 0, 0),

                                        flipX: false

                                }));

                                shot.setAnimation(animation);

                                if (typeof rot_offset == 'number') {
                                        rot_offset = new Vector3(rot_offset, 0, 0);
                                }

                                shot.position.x = bx, shot.position.y = by;
                                shot.rotation.x = 0 + rot_offset.x;

                                shot.stats = {
                                        damage: 1

                                };

                                shot.speed.x = Math.cos(shot.rotation.x * 3.14 / 180) * speed;

                                shot.speed.y = Math.sin(shot.rotation.x * 3.14 / 180) * speed;

                                return shot;
                        }

                        return new Error("game was not in motion: Gamestack.isAtPlay must be true to create a shot.");
                }

                /**
                 * create a subsprite of Sprite belonging to the current Sprite
                 * @function
                 * @memberof Sprite
                 * @param {Object} options an object of arguments
                 * @param {Animation} animation the animation to fire from the Sprite
                 * @param {number} speed the speed of the shot that is projected
                 * @param {Vector} position the initial position of the shot: defaults to current Sprite position
                 * @param {Vector} size the Vector size of the shot
                 * @param {Vector} offset the positional offset to apply
                 **********/

        }, {
                key: 'subsprite',
                value: function subsprite(options) {

                        var animation = options.animation || new Animation();

                        var position = options.position || new Vector3(this.position);

                        var offset = options.offset || new Vector3(0, 0, 0);

                        var size = options.size || this.size;

                        if (__gameInstance.isAtPlay) {

                                var subsprite = __gameStack.add(new Sprite({

                                        active: true,

                                        position: position,

                                        size: size,

                                        offset: offset,

                                        image: animation.image,

                                        rotation: new Vector3(0, 0, 0),

                                        flipX: false

                                }));

                                subsprite.setAnimation(animation);

                                return subsprite;
                        } else {
                                alert('No subsprite when not at play');
                        }
                }

                /**
                 * animate Sprite.selected_animation  by one frame
                 * @function
                 * @memberof Sprite
                 * @param {Animation} animation to use, defaults to Sprite.selected_animation
                 **********/

        }, {
                key: 'animate',
                value: function animate(animation) {

                        if (__gameInstance.isAtPlay) {

                                if (animation) {
                                        this.setAnimation(animation);
                                }

                                this.selected_animation.animate();
                        }
                }

                /**
                 * run a function when the Sprite.selected_animation is complete
                 *
                 * @function
                 * @memberof Sprite
                 * @param {Function} fun the function to call when the animation is complete
                 *
                 **********/

        }, {
                key: 'onAnimationComplete',
                value: function onAnimationComplete(fun) {
                        this.selected_animation.onComplete(fun);
                }

                /*****************************
                 *  accelY
                 *  -accelerate on Y-Axis with 'accel' and 'max' (speed) arguments
                 *  -example-use: gravitation of sprite || up / down movement
                 ***************************/

                /**
                 * accelerate speed on the Y-Axis
                 *
                 * @function
                 * @memberof Sprite
                 * @param {number} accel the increment of acceleration
                 * @param {number} max the maximum for speed
                 *
                 **********/

        }, {
                key: 'accelY',
                value: function accelY(accel, max) {

                        accel = Math.abs(accel);

                        if (typeof max == 'number') {
                                max = { y: max };
                        }

                        this.assertSpeed();

                        var diff = max.y - this.speed.y;

                        if (diff > 0) {
                                this.speed.y += Math.abs(diff) >= accel ? accel : diff;
                        }
                        ;

                        if (diff < 0) {
                                this.speed.y -= Math.abs(diff) >= accel ? accel : diff;
                        }
                        ;
                }

                /*****************************
                 *  accelX
                 *  -accelerate on X-Axis with 'accel' and 'max' (speed) arguments
                 *  -example-use: running of sprite || left / right movement
                 ***************************/

                /**
                 * accelerate speed on the X-Axis
                 *
                 * @function
                 * @memberof Sprite
                 * @param {number} accel the increment of acceleration
                 * @param {number} max the maximum for speed
                 *
                 **********/

        }, {
                key: 'accelX',
                value: function accelX(accel, max) {

                        accel = Math.abs(accel);

                        if (typeof max == 'number') {
                                max = { x: max };
                        }

                        this.assertSpeed();

                        var diff = max.x - this.speed.x;

                        if (diff > 0) {
                                this.speed.x += Math.abs(diff) >= accel ? accel : diff;
                        }
                        ;

                        if (diff < 0) {
                                this.speed.x -= Math.abs(diff) >= accel ? accel : diff;
                        }
                        ;
                }

                /*****************************
                 *  accel
                 *  -accelerate any acceleration -key
                 ***************************/

                /**
                 * accelerate toward a max value on any object-property:: intended for self-use
                 *
                 * @function
                 * @memberof Sprite
                 * @param {Object} prop The object to control
                 * @param {string} key the property-key for targeted property of prop argument
                 *
                 * @param {number} accel the increment of acceleration
                 *
                 * @param {number} max the max value to accelerate towards
                 *
                 *
                 **********/

        }, {
                key: 'accel',
                value: function accel(prop, key, _accel, max) {

                        _accel = Math.abs(_accel);

                        if (typeof max == 'number') {
                                max = { x: max };
                        }

                        var speed = prop[key];

                        // this.assertSpeed();

                        var diff = max.x - prop[key];

                        if (diff > 0) {
                                prop[key] += Math.abs(diff) >= _accel ? _accel : diff;
                        }
                        ;

                        if (diff < 0) {
                                prop[key] -= Math.abs(diff) >= _accel ? _accel : diff;
                        }
                        ;
                }

                /*****************************
                 *  decel
                 *  -deceleration -key
                 ***************************/

                /**
                 * decelerate toward a max value on any object-property:: intended for self-use
                 *
                 * @function
                 * @memberof Sprite
                 * @param {Object} prop The object to control
                 * @param {string} key the property-key for targeted property of prop argument
                 *
                 * @param {number} decel the increment of deceleration
                 *
                 * @param {number} max the max value to decelerate towards
                 *
                 *
                 **********/

        }, {
                key: 'decel',
                value: function decel(prop, key, rate) {
                        if ((typeof rate === 'undefined' ? 'undefined' : _typeof(rate)) == 'object') {

                                rate = rate.rate;
                        }

                        rate = Math.abs(rate);

                        if (Math.abs(prop[key]) <= rate) {
                                prop[key] = 0;
                        } else if (prop[key] > 0) {
                                prop[key] -= rate;
                        } else if (prop[key] < 0) {
                                prop[key] += rate;
                        } else {

                                prop[key] = 0;
                        }
                }

                /*****************************
                 *  decelY
                 *  -decelerate on the Y axis
                 *  -args: 1 float:amt
                 ***************************/

                /**
                 * decelerate speed on the Y-Axis, toward zero
                 *
                 * @function
                 * @memberof Sprite
                 * @param {number} amt the increment of deceleration, negatives ignored
                 *
                 **********/

        }, {
                key: 'decelY',
                value: function decelY(amt) {

                        amt = Math.abs(amt);

                        if (Math.abs(this.speed.y) <= amt) {
                                this.speed.y = 0;
                        } else if (this.speed.y > amt) {

                                this.speed.y -= amt;
                        } else if (this.speed.y < amt * -1) {

                                this.speed.y += amt;
                        }
                }

                /*****************************
                 *  decelX
                 *  -decelerate on the X axis
                 *  -args: 1 float:amt
                 ***************************/

                /**
                 * decelerate speed on the X-Axis, toward zero
                 *
                 * @function
                 * @memberof Sprite
                 * @param {number} amt the increment of deceleration, negatives ignored
                 *
                 **********/

        }, {
                key: 'decelX',
                value: function decelX(amt) {

                        amt = Math.abs(amt);

                        if (this.speed.x > amt) {

                                this.speed.x -= amt;
                        } else if (this.speed.x < amt * -1) {

                                this.speed.x += amt;
                        }

                        if (Math.abs(this.speed.x) <= amt) {

                                this.speed.x = 0;
                        }
                }
        }, {
                key: 'shortest_stop',
                value: function shortest_stop(item, callback) {
                        var diff_min_y = item.min ? item.min.y : Math.abs(item.position.y - this.position.y + this.size.y);

                        var diff_min_x = item.min ? item.min.x : Math.abs(item.position.x - this.position.x + this.size.x);

                        var diff_max_y = item.max ? item.max.y : Math.abs(item.position.y + item.size.y - this.position.y);

                        var diff_max_x = item.max ? item.max.x : Math.abs(item.position.x + item.size.x - this.position.y);

                        var dimens = { top: diff_min_y, left: diff_min_x, bottom: diff_max_y, right: diff_max_x };

                        var minkey = "",
                            min = 10000000;

                        for (var x in dimens) {
                                if (dimens[x] < min) {
                                        min = dimens[x];
                                        minkey = x; // a key of top left bottom or right
                                }
                        }

                        callback(minkey);
                }

                /**
                 * get the center of a Sprite
                 *
                 * @function
                 * @memberof Sprite
                 *
                 * @returns (Vector)
                 *
                 **********/

        }, {
                key: 'center',
                value: function center() {

                        return new Vector(this.position.x + this.size.x / 2, this.position.y + this.size.y / 2, 0);
                }

                /*************
                 * #BE CAREFUL
                 * -with this function :: change sensitive / tricky / 4 way collision
                 * *************/

                /**
                 * determine if Sprite overlaps on X axis with another Sprite
                 *
                 * @function
                 * @memberof Sprite
                 * @param {Sprite} item the Sprite to compare with
                 * @param {number} padding the 0-1.0 float value of padding to use on self when testing overlap
                 * @returns {var} a true || false var
                 *
                 **********/

        }, {
                key: 'overlap_x',
                value: function overlap_x(item, padding) {
                        if (!padding) {
                                padding = 0;
                        }

                        var paddingX = Math.round(padding * this.size.x),
                            paddingY = Math.round(padding * this.size.y),
                            left = this.position.x + paddingX,
                            right = this.position.x + this.size.x - paddingX,
                            top = this.position.y + paddingY,
                            bottom = this.position.y + this.size.y - paddingY;

                        return right > item.position.x && left < item.position.x + item.size.x;
                }

                /*************
                 * #BE CAREFUL
                 * -with this function :: change sensitive / tricky / 4 way collision
                 * *************/

                /**
                 * determine if Sprite overlaps on Y axis with another Sprite
                 *
                 * @function
                 * @memberof Sprite
                 * @param {Sprite} item the Sprite to compare with
                 * @param {number} padding the 0-1.0 float value of padding to use on self when testing overlap
                 * @returns (true || false}
                 *
                 **********/

        }, {
                key: 'overlap_y',
                value: function overlap_y(item, padding) {
                        if (!padding) {
                                padding = 0;
                        }

                        var paddingX = Math.round(padding * this.size.x),
                            paddingY = Math.round(padding * this.size.y),
                            left = this.position.x + paddingX,
                            right = this.position.x + this.size.x - paddingX,
                            top = this.position.y + paddingY,
                            bottom = this.position.y + this.size.y - paddingY;

                        return bottom > item.position.y && top < item.position.y + item.size.y;
                }

                /*************
                 * #BE CAREFUL
                 * -with this function :: change sensitive / tricky / 4 way collision
                 * *************/

        }, {
                key: 'collide_stop_x',
                value: function collide_stop_x(item) {

                        var apart = false;

                        var ct = 10000;

                        while (!apart && ct > 0) {

                                ct--;

                                var diffX = this.center().sub(item.center()).x;

                                var distX = Math.abs(this.size.x / 2 + item.size.x / 2 - Math.round(this.size.x * this.padding.x));

                                if (Math.abs(diffX) < distX) {

                                        this.position.x -= diffX > 0 ? -1 : 1;
                                } else {

                                        apart = true;
                                }
                        }
                }

                /*************
                 * #BE CAREFUL
                 * -with this function :: change sensitive / tricky / 4 way collision
                 * *************/

                /**
                 * cause a fourway collision-stop between this and another Sprite :: objects will behave clastically and resist passing through one another
                 *
                 * @function
                 * @memberof Sprite
                 * @param {Sprite} item the Sprite to compare with
                 *
                 **********/

        }, {
                key: 'collide_stop',
                value: function collide_stop(item) {

                        if (this.id == item.id) {
                                return false;
                        }

                        // this.position = this.position.sub(this.speed);

                        if (this.collidesRectangular(item)) {

                                var diff = this.center().sub(item.center());

                                if (this.overlap_x(item, this.padding.x + 0.1) && Math.abs(diff.x) < Math.abs(diff.y)) {

                                        var apart = false;

                                        var ct = 10000;

                                        while (!apart && ct > 0) {

                                                ct--;

                                                var diffY = this.center().sub(item.center()).y;

                                                var distY = Math.abs(this.size.y / 2 + item.size.y / 2 - Math.round(this.size.y * this.padding.y));

                                                if (Math.abs(diffY) < distY) {

                                                        this.position.y -= diffY > 0 ? -1 : diffY < 0 ? 1 : 0;

                                                        this.position.y = Math.round(this.position.y);
                                                } else {

                                                        if (diffY <= 0) {
                                                                this.__inAir = false;
                                                        };

                                                        return apart = true;
                                                }
                                        }
                                }

                                if (this.overlap_y(item, this.padding.y) && Math.abs(diff.y) < Math.abs(diff.x)) {

                                        this.collide_stop_x(item);
                                }
                        }
                }
        }, {
                key: 'collide_stop_top',
                value: function collide_stop_top(item) {

                        if (this.id == item.id) {
                                return false;
                        }

                        if (this.overlap_x(item, this.padding.x + 0.1)) {

                                console.log('OVERLAP_X');

                                var paddingY = this.padding.y * this.size.y;

                                if (this.position.y + this.size.y - paddingY <= item.position.y) {

                                        this.groundMaxY = item.position.y - this.size.y + paddingY;
                                }
                        }
                }

                /**
                 * Restore a sprite from saved .json data
                 *
                 * @function
                 * @memberof Sprite
                 *
                 * @returns (Sprite)
                 **********/

        }, {
                key: 'restoreFrom',
                value: function restoreFrom(data) {
                        data.image = new GameImage(data.src || data.image.src);

                        return new Sprite(data);
                }

                /*****************************
                 *  fromFile(file_path)
                 *  -TODO : complete this function based on code to load Sprite() from file, located in the spritemaker.html file
                 *  -TODO: test this function
                 ***************************/

        }, {
                key: 'fromFile',
                value: function fromFile(file_path) {

                        if (typeof file_path == 'string') {

                                var __inst = this;

                                $.getJSON(file_path, function (data) {

                                        __inst = new Sprite(data);
                                });
                        }
                }
        }]);

        return Sprite;
}();

;

/****************
 * TODO : Complete SpritePresetsOptions::
 *  Use these as options for Sprite Control, etc...
 ****************/

Gamestack.Sprite = Sprite;

var SpriteInitializersOptions = {

        Clastics: {

                top_collideable: function top_collideable(sprite) {

                        for (var x in Gamestack.__gameWindow.forces) {
                                var force = Gamestack.__gameWindow.forces[x];

                                force.topClastics.push(sprite);
                        }

                        sprite.onUpdate(function () {});
                },

                fourside_collideable: function fourside_collideable(sprite) {

                        for (var x in Gamestack.__gameWindow.forces) {
                                var force = Gamestack.__gameWindow.forces[x];

                                force.clasticObjects.push(sprite);
                        }

                        sprite.onUpdate(function () {});
                }
        },

        MainGravity: {

                very_light: function very_light(sprite) {
                        //Add a gravity to the game

                        var gravity = Gamestack.add(new Force({
                                name: "very_light_grav",
                                accel: 0.05,
                                max: new Vector3(0, 3.5, 0),
                                subjects: [sprite], //sprite is the subject of this Force, sprite is pulled by this force
                                clasticObjects: [] //an empty array of collideable objects

                        }));

                        sprite.onUpdate(function () {});
                },

                light: function light(sprite) {

                        var gravity = Gamestack.add(new Force({
                                name: "light_grav",
                                accel: 0.1,
                                max: new Vector3(0, 4.5, 0),
                                subjects: [sprite], //sprite is the subject of this Force, sprite is pulled by this force
                                clasticObjects: [] //an empty array of collideable objects

                        }));

                        sprite.onUpdate(function () {});
                },

                medium: function medium(sprite) {

                        var gravity = Gamestack.add(new Force({
                                name: "medium_grav",
                                accel: 0.2,
                                max: new Vector3(0, 7.5, 0),
                                subjects: [sprite], //sprite is the subject of this Force, sprite is pulled by this force
                                clasticObjects: [] //an empty array of collideable objects

                        }));

                        sprite.onUpdate(function () {});
                },

                strong: function strong(sprite) {

                        var gravity = Gamestack.add(new Force({
                                name: "strong_grav",
                                accel: 0.4,
                                max: new Vector3(0, 10.5, 0),
                                subjects: [sprite], //sprite is the subject of this Force, sprite is pulled by this force
                                clasticObjects: [] //an empty array of collideable objects

                        }));

                        sprite.onUpdate(function () {});
                },

                very_strong: function very_strong(sprite) {

                        var gravity = Gamestack.add(new Force({
                                name: "strong_grav",
                                accel: 0.5,
                                max: new Vector3(0, 12.5, 0),
                                subjects: [sprite], //sprite is the subject of this Force, sprite is pulled by this force
                                clasticObjects: [] //an empty array of collideable objects

                        }));

                        sprite.onUpdate(function () {});
                }

        },

        ControllerStickMotion: {

                player_move_x: function player_move_x(sprite) {

                        alert('applying initializer');

                        console.log('side_scroll_player_run:init-ing');

                        var __lib = Gamestack || Quick2d;

                        Gamestack.GamepadAdapter.on('stick_left', 0, function (x, y) {

                                console.log('stick-x:' + x);

                                if (Math.abs(x) < 0.2) {
                                        return 0;
                                }

                                var accel = 0.2; //todo : options for accel
                                var max = 7;

                                sprite.accelX(accel, x * max);

                                if (x < -0.2) {
                                        sprite.flipX = true;
                                } else if (x > 0.2) {
                                        sprite.flipX = false;
                                }
                        });

                        sprite.onUpdate(function (spr) {

                                spr.decelX(0.1);

                                if (!spr.__falling) {
                                        spr.decelY(0.2);
                                }
                                ;
                        });
                },

                player_move_xy: function player_move_xy(sprite) {

                        alert('applying initializer');

                        console.log('side_scroll_player_run:init-ing');

                        var __lib = Gamestack || Quick2d;

                        Gamestack.GamepadAdapter.on('stick_left', 0, function (x, y) {

                                console.log('stick-x:' + x);

                                if (Math.abs(x) < 0.2) {
                                        x = 0;
                                }

                                if (Math.abs(y) < 0.2) {
                                        y = 0;
                                }

                                var accel = 0.2; //todo : options for accel
                                var max = 7;

                                sprite.accelX(accel, x * max);

                                sprite.accelY(accel, y * max);

                                if (x < -0.2) {
                                        sprite.flipX = true;
                                } else if (x > 0.2) {
                                        sprite.flipX = false;
                                }
                        });

                        sprite.onUpdate(function (spr) {

                                sprite.decel(sprite.speed, 'x', 0.1);

                                sprite.decel(sprite.speed, 'y', 0.1);
                        });
                },

                player_rotate_x: function player_rotate_x(sprite) {

                        var __lib = Gamestack || Quick2d;

                        Gamestack.GamepadAdapter.on('stick_left', 0, function (x, y) {

                                console.log('stick-x:' + x);

                                if (Math.abs(x) < 0.2) {
                                        return 0;
                                }

                                var accel = 0.25; //todo : options for accel
                                var max = 7;

                                sprite.accel(sprite.rot_speed, 'x', accel, x * max);

                                if (x < -0.2) {
                                        sprite.flipX = true;
                                } else if (x > 0.2) {
                                        sprite.flipX = false;
                                }
                        });

                        sprite.onUpdate(function (spr) {

                                sprite.decel(sprite.rot_speed, 'x', 0.1);

                                if (!spr.__falling) {
                                        spr.decelY(0.2);
                                }
                                ;
                        });
                }

        }

};

Gamestack.options = Gamestack.options || {};

Gamestack.options.SpriteInitializers = SpriteInitializersOptions;;
/**
 * Takes arguments of x, y, and (optionally) z, instantiates Vector object

 <ul>
 <li>Optional: use a Vector as the 'x' argument, and instantiate new distinct Vector from the argument</li>
 </ul>

 * @param   {number} x the x coordinate
 * @param   {number} y the y coordinate
 * @param   {number} z the z coordinate
 * @returns {Vector} a Vector object
 */

var Vector = function () {
        function Vector(x, y, z, r) {
                _classCallCheck(this, Vector);

                if ((typeof x === 'undefined' ? 'undefined' : _typeof(x)) == 'object' && x.hasOwnProperty('x') && x.hasOwnProperty('y')) //optionally pass vector3
                        {
                                this.x = x.x;
                                this.y = x.y;
                                this.z = x.z || 0;

                                if (this.z == null) {
                                        this.z = 0;
                                }

                                return this;
                        }

                if (z == null) {
                        z = 0;
                }

                this.x = x;
                this.y = y;
                this.z = z;
                this.r = r;
        }

        _createClass(Vector, [{
                key: 'sub',
                value: function sub(v) {
                        if (typeof v == 'number') {
                                v = { x: v, y: v, z: v };
                        }

                        return new Vector(this.x - v.x, this.y - v.y, this.z - v.z);
                }
        }, {
                key: 'add',
                value: function add(v) {
                        if (typeof v == 'number') {
                                v = { x: v, y: v, z: v };
                        }

                        return new Vector(this.x + v.x, this.y + v.y, this.z + v.z);
                }
        }, {
                key: 'mult',
                value: function mult(v) {
                        if (typeof v == 'number') {
                                v = { x: v, y: v, z: v };
                        }

                        return new Vector(this.x * v.x, this.y * v.y, this.z * v.z);
                }
        }, {
                key: 'div',
                value: function div(v) {
                        if (typeof v == 'number') {
                                v = { x: v, y: v, z: v };
                        }

                        return new Vector(this.x / v.x, this.y / v.y, this.z / v.z);
                }
        }, {
                key: 'round',
                value: function round() {
                        return new Vector(Math.round(this.x), Math.round(this.y), Math.round(this.z));
                }
        }, {
                key: 'floor',
                value: function floor() {
                        return new Vector(Math.floor(this.x), Math.floor(this.y), Math.floor(this.z));
                }
        }, {
                key: 'ceil',
                value: function ceil() {
                        return new Vector(Math.ceil(this.x), Math.ceil(this.y), Math.ceil(this.z));
                }
        }, {
                key: 'equals',
                value: function equals(v) {

                        return this.x == v.x && this.y == v.y && this.z == v.z;
                }
        }, {
                key: 'trig_distance_xy',
                value: function trig_distance_xy(v) {

                        var dist = this.sub(v);

                        return Math.sqrt(dist.x * dist.x + dist.y * dist.y);
                }
        }, {
                key: 'diff',
                value: function diff() {
                        //TODO:this function


                }
        }, {
                key: 'abs_diff',
                value: function abs_diff() {
                        //TODO:this function

                }
        }, {
                key: 'is_between',
                value: function is_between(v1, v2) {
                        //TODO : overlap vectors return boolean

                        return this.x >= v1.x && this.x <= v2.x && this.y >= v1.y && this.y <= v2.y && this.z >= v1.z && this.z <= v2.z;
                }
        }]);

        return Vector;
}();

var Vector3 = Vector,
    Pos = Vector,
    Size = Vector,
    Position = Vector,
    Vector2 = Vector,
    Rotation = Vector;

Gamestack.Vector = Vector;

//The above are a list of synonymous expressions for Vector. All of these do the same thing in this library (store x,y,z values)
; /**
  * AsyncSteps : Calls an eventual function of steps
     -use functional args for error(), done(), promise()
  * @returns {Promise) a Promise object
  */

var AsyncSteps = function AsyncSteps(mainObject, options) {
        _classCallCheck(this, AsyncSteps);

        var error = options.error || options.err || options.onerror;
        var ondone = options.done || options.ondone;

        var chunk = options.chunk || options.onchunk;

        var promise = new Promise(function (done, error) {

                mainObject.onerror = function () {
                        return error(mainObject.__errorMessage);
                };

                mainObject.onchunk = function () {
                        return chunk(mainObject.iterables);
                };

                mainObject.ondone = function () {
                        return ondone(mainObject.iterables);
                };
        });

        this.__promise = promise;
};
//# sourceMappingURL=Squeeze.js.map
