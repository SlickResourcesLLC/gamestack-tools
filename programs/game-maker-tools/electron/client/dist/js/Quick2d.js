'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by The Blakes on 3/16/2017.
 */

/**
 * Created by The Blakes on 3/16/2017.
 */

/*
 * Vector3
 *
 *    multi instantiator for size, pos, rotation, anything with X,Y, and Z (or just x and y)
 *
 *
 * */

var Sound = function () {
        function Sound(src) {
                _classCallCheck(this, Sound);

                if ((typeof src === 'undefined' ? 'undefined' : _typeof(src)) == 'object') {

                        for (var x in src) {
                                this[x] = src[x];
                        }

                        this.sound = new Audio(src.src);

                        this.onLoad = src.onLoad || function () {};
                } else if (typeof src == 'string') {

                        this.src = src;

                        this.sound = new Audio(this.src);
                }

                this.onLoad = this.onLoad || function () {};

                if (typeof this.onLoad == 'function') {

                        this.onLoad(this.sound);
                }
        }

        _createClass(Sound, [{
                key: 'play',
                value: function play() {
                        if (_typeof(this.sound) == 'object' && typeof this.sound.play == 'function') {

                                this.sound.play();
                        }
                }
        }]);

        return Sound;
}();

var GameImage = function () {
        function GameImage(src, onCreate) {
                _classCallCheck(this, GameImage);

                // Quazar.log('initializing image');

                if (src instanceof Object) {

                        //alert('getting image from image');

                        this.image = document.createElement('IMG');

                        this.image.src = src.src;

                        this.src = src.src;
                } else if (typeof src == 'string') {

                        var ext = src.substring(src.lastIndexOf('.'), src.length);

                        this.image = document.createElement('IMG');

                        this.image.src = src;

                        this.src = this.image.src;
                }

                if (!this.image) {
                        this.image = { error: "Image not instantiated, set to object by default" };
                }

                this.domElement = this.image;

                this.image.onload = function () {

                        if (typeof this.onCreate == 'function') {

                                this.onCreate(this.image);
                        }
                };
        }

        _createClass(GameImage, [{
                key: 'getImage',
                value: function getImage() {

                        return this.image;
                }
        }]);

        return GameImage;
}();

//Quazar: a main / game lib object::


var __gameInstance = __gameInstance || {};

var Quazar = {

        DEBUG: false,

        gui_mode: true,

        __gameWindow: {},

        __sprites: [],

        __animations: [],

        samples: {},

        log_modes: ['reqs', 'info', 'warning'],

        log_mode: "all",

        recursionCount: 0,

        createid: function createid() {
                new Date().getUTCMilliseconds() + "";
        },

        getActionablesCheckList: function getActionablesCheckList() {
                //every unique sound, animation, tweenmotion in the game

                var __inst = {};

                var actionables = [];

                $.each(this.sprites, function (ix, item) {

                        actionables.concat(item.sounds);

                        actionables.concat(item.motionstacks);

                        actionables.concat(item.animations);
                });
        },

        interlog: function interlog(message, div) //recursive safe :: won't go crazy with recursive logs
        {
                this.recursionCount++;

                if (!isNaN(div) && this.recursionCount % div == 0) {
                        //   console.log('Interval Log:'+  message);

                }
        },

        error: function error(quit, message) {

                if (quit) {
                        throw new Error(message);
                } else {
                        console.error('E!' + message);
                }
        },

        info: function info(m) {

                console.info('Info:' + m);
        },

        log: function log(m) {

                //  console.log('Quazar:' + m);


        },

        animate: function animate() {
                TWEEN.update(time);

                requestAnimationFrame(this.animate);

                this.__gameWindow.update();

                this.__gameWindow.ctx.clearRect(0, 0, this.__gameWindow.canvas.width, this.__gameWindow.canvas.height);

                this.__gameWindow.draw();
        },

        start: function start() {

                this.animate();
        },

        mustHave: function mustHave(obj, keytypes, callback) {

                this.each(keytypes, function (ix, item) {

                        callback(false);
                });

                callback(true);
        },

        Collision: {
                spriteRectanglesCollide: function spriteRectanglesCollide(obj1, obj2) {
                        if (obj1.position.x + obj1.size.x > obj2.size.x && obj1.position.x < obj2.size.x + obj2.size.x && obj1.position.y + obj1.size.y > obj2.size.y && obj1.position.y < obj2.size.y + obj2.size.y) {

                                return true;
                        }
                }
        },

        TWEEN: TWEEN,

        _gameWindow: {},

        setGameWindow: function setGameWindow(gameWindow) {

                this._gameWindow = gameWindow;
        },

        getGameWindow: function getGameWindow() {

                return this._gameWindow;
        },

        assignAll: function assignAll(object, args, keys) {
                $Q.each(keys, function (ix, item) {

                        object[ix] = args[ix];
                });
        },

        each: function each(list, onResult, onComplete) {
                for (var i in list) {
                        onResult(i, list[i]);
                }

                if (typeof onComplete === 'function') {
                        onComplete(false, list);
                };
        },

        ready_callstack: [],

        ready: function ready(callback) {

                this.ready_callstack.push(callback);
        },

        onReady: function onReady() {
                var funx = this.ready_callstack;

                var gameWindow = this._gameWindow,
                    lib = this,
                    sprites = this.__gameWindow.sprites;

                this.each(funx, function (ix, call) {

                        call(lib, gameWindow, sprites);
                });

                __gameInstance.isAtPlay = true;
        },

        getArg: function getArg(args, key, fallback) {
                if (args && args.hasOwnProperty(key)) {
                        return args[key];
                } else {
                        return fallback;
                }
        }

};

__gameInstance = Quazar;

var QUAZAR = Quazar;

var $q = Quazar;var $Q = Quazar;

Quazar.InputEvents = { //PC input events
        mousemove: [],
        leftclick: [],
        rightclick: [],
        middleclick: [],
        wheelup: [],
        wheelDown: [],
        space: [],
        tab: [],
        shift: [],
        1: [], 2: [], 3: [],
        enter: [],
        extend: function extend(evt_key, callback, onFinish) {

                if (evt_key.toLowerCase().indexOf('key_') >= 0) {
                        //process this as a key event

                        var cleanKey = evt_key.toLowerCase();
                        Quazar.InputEvents[cleanKey] = Quazar.InputEvents[cleanKey] || [];
                        return Quazar.InputEvents[cleanKey].push({ down: callback, up: onFinish });
                } else {

                        Quazar.InputEvents[evt_key] = Quazar.InputEvents[evt_key] || [];
                        return Quazar.InputEvents[evt_key].push({ down: callback, up: onFinish });
                }
        },
        init: function init() {

                function getMousePos(e) {

                        var x;
                        var y;
                        if (e.pageX || e.pageY) {
                                x = e.pageX;
                                y = e.pageY;
                        } else {
                                x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                                y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
                        }
                        x -= Quazar.canvas.offsetLeft;
                        y -= Quazar.canvas.offsetTop;
                        return { x: x, y: y };
                }

                function fullMoveInputEvents(event) {

                        var pos = getMousePos(event);
                        var InputEvents = Quazar.InputEvents;
                        for (var x in InputEvents) {

                                if (InputEvents[x] instanceof Array && x == 'mousemove') {

                                        Quazar.each(InputEvents[x], function (ix, el) {

                                                el.down(pos.x, pos.y);
                                        });
                                }
                        }
                }
                ;
                document.onkeydown = function (e) {

                        //    alert(JSON.stringify(Quazar.InputEvents, true, 2));

                        Quazar.log('Got e');

                        var value = 'key_' + String.fromCharCode(e.keyCode).toLowerCase();
                        if (Quazar.InputEvents[value] instanceof Array) {

                                Quazar.log('Got []');

                                Quazar.each(Quazar.InputEvents[value], function (ix, item) {

                                        if (typeof item.down == 'function') {

                                                //   alert('RUNNING');

                                                item.down();
                                        }
                                });
                        }
                };

                document.onkeyup = function (e) {

                        //    alert(JSON.stringify(Quazar.InputEvents, true, 2));

                        var value = 'key_' + String.fromCharCode(e.keyCode).toLowerCase();
                        if (Quazar.InputEvents[value] instanceof Array) {

                                Quazar.each(Quazar.InputEvents[value], function (ix, item) {

                                        if (typeof item.up == 'function') {

                                                //   alert('RUNNING');

                                                item.up();
                                        }
                                });
                        }
                };

                Quazar.canvas.onmousedown = function (e) {

                        //    alert(JSON.stringify(Quazar.InputEvents, true, 2));

                        var value = e.which;
                        var pos = getMousePos(e);
                        var InputEvents = Quazar.InputEvents;

                        e.preventDefault();

                        switch (e.which) {
                                case 1:

                                        for (var x in InputEvents) {

                                                if (InputEvents[x] instanceof Array && x == 'leftclick') {

                                                        Quazar.each(InputEvents[x], function (ix, el) {

                                                                el.down(pos.x, pos.y);
                                                        });
                                                }
                                        }

                                        break;
                                case 2:
                                        // alert('Middle Mouse button pressed.');


                                        for (var x in Quazar.InputEvents) {

                                                if (InputEvents[x] instanceof Array && x == 'middleclick') {

                                                        Quazar.each(InputEvents[x], function (ix, el) {

                                                                el.down(pos.x, pos.y);
                                                        });
                                                }
                                        }
                                        break;
                                case 3:
                                        //  alert('Right Mouse button pressed.');


                                        for (var x in Quazar.InputEvents) {

                                                if (InputEvents[x] instanceof Array && x == 'rightclick') {

                                                        Quazar.each(InputEvents[x], function (ix, el) {

                                                                el.down(pos.x, pos.y);
                                                        });

                                                        return false;
                                                }
                                        }

                                        break;
                                default:

                                        return 0;
                                //alert('You have a strange Mouse!');

                        }

                        e.preventDefault();
                        return 0;
                };
                Quazar.canvas.onmouseup = function (e) {

                        //    alert(JSON.stringify(Quazar.InputEvents, true, 2));

                        var value = e.which;
                        var pos = getMousePos(e);
                        var InputEvents = Quazar.InputEvents;

                        e.preventDefault();

                        switch (e.which) {
                                case 1:

                                        for (var x in InputEvents) {

                                                if (InputEvents[x] instanceof Array && x == 'leftclick') {

                                                        Quazar.each(InputEvents[x], function (ix, el) {

                                                                el.up(pos.x, pos.y);
                                                        });
                                                }
                                        }

                                        break;
                                case 2:
                                        // alert('Middle Mouse button pressed.');


                                        for (var x in Quazar.InputEvents) {

                                                if (InputEvents[x] instanceof Array && x == 'middleclick') {

                                                        Quazar.each(InputEvents[x], function (ix, el) {

                                                                el.up(pos.x, pos.y);
                                                        });
                                                }
                                        }
                                        break;
                                case 3:
                                        //  alert('Right Mouse button pressed.');


                                        for (var x in Quazar.InputEvents) {

                                                if (InputEvents[x] instanceof Array && x == 'rightclick') {

                                                        Quazar.each(InputEvents[x], function (ix, el) {

                                                                el.up(pos.x, pos.y);
                                                        });

                                                        return false;
                                                }
                                        }

                                        break;
                                default:

                                        return 0;
                                //alert('You have a strange Mouse!');

                        }
                };
                document.addEventListener("mousemove", fullMoveInputEvents);
        }

};

$Q = QUAZAR;

window._preQuazar_windowLoad = window.onload;

window.onload = function () {

        //alert('window load');

        if (typeof window._preQuazar_windowLoad == 'function') {
                window._preQuazar_windowLoad();
        }

        $Q.onReady();
};

/*
 * Canvas
 *
 *    draw animations, textures to the screen
 *
 *
 * */

var Canvas = {
        draw: function draw(sprite, ctx) {

                if (sprite.active && sprite.onScreen(Game.WIDTH, Game.HEIGHT)) {

                        this.drawPortion(sprite, ctx);
                }
        },
        drawFrameWithRotation: function drawFrameWithRotation(img, fx, fy, fw, fh, x, y, width, height, deg, canvasContextObj, flip) {

                canvasContextObj.save();
                deg = Math.round(deg);
                deg = deg % 360;
                var rad = deg * Math.PI / 180;
                //Set the origin to the center of the image
                canvasContextObj.translate(x, y);
                canvasContextObj.rotate(rad);
                //Rotate the canvas around the origin

                canvasContextObj.translate(0, canvasContextObj.width);
                if (flip) {

                        canvasContextObj.scale(-1, 1);
                } else {}

                //draw the image
                canvasContextObj.drawImage(img, fx, fy, fw, fh, width / 2 * -1, height / 2 * -1, width, height);
                //reset the canvas

                canvasContextObj.restore();
        },

        /*
         * drawPortion:
         *
         *   expects: (sprite{selected_animation{selected_frame{frameSize, framePos } offset?, gameSize? }  })
         *
         *
         * */

        drawPortion: function drawPortion(sprite, ctx) {

                var frame;

                if (sprite.active) {

                        if (sprite.selected_animation && sprite.selected_animation.selected_frame) {

                                frame = sprite.selected_animation.selected_frame;
                        } else {

                                console.error('Sprite is missing arguments');
                        }

                        var x = sprite.position.x;
                        var y = sprite.position.y;

                        var camera = $Q.camera || { pos: { x: 0, y: 0, z: 0 } };

                        if (true) {

                                if (!isNaN(camera.pos.x)) {

                                        x += camera.pos.x;
                                }

                                if (!isNaN(camera.pos.y)) {

                                        y += camera.pos.y;
                                }
                        }
                        ;

                        //optional animation : gameSize

                        var targetSize = sprite.selected_animation.size ? sprite.selected_animation.size : sprite.size;

                        var realWidth = targetSize.x;
                        var realHeight = targetSize.y;

                        //optional animation : offset

                        if (sprite.selected_animation.offset) {
                                x += sprite.selected_animation.offset.x;

                                y += sprite.selected_animation.offset.y;
                        }

                        var rotation;

                        if (_typeof(sprite.rotation) == 'object') {

                                rotation = sprite.rotation.x;
                        } else {
                                rotation = sprite.rotation;
                        }

                        this.drawFrameWithRotation(sprite.selected_animation.image.domElement, frame.framePos.x, frame.framePos.y, frame.frameSize.x, frame.frameSize.y, Math.round(x + realWidth / 2), Math.round(y + realHeight / 2), realWidth, realHeight, rotation % 360, ctx, sprite.flipX);
                }
        }

};

Quazar.ready(function (lib) {

        Quazar.log('Quazar:lib :: ready');
});

/**
 *
 *  class: Collection:
 *
 *      Defines a Collection of objects
 *      #extended by  class
 *      functions:
 *          add()
 *          remove()GameWindow
 *          next()
 *          all()
 *
 */

var Collection = function () {
        function Collection(list, type) {
                _classCallCheck(this, Collection);

                this.list = list;

                //if type is undefined, then no type profile is needed (assume basic array, object types)

                //else the type profile must exist ::


                this.type = type;

                this.__flyingIndex = 0;
        }

        _createClass(Collection, [{
                key: 'add',
                value: function add(object) {

                        this.list.push(object);
                }
        }, {
                key: 'remove',
                value: function remove(object) {

                        var ix = this.list.indexOf(object);

                        if (ix >= 0) this.list = this.list.splice(ix, 1);
                }
        }, {
                key: 'next',
                value: function next(callback) {
                        var object = this.list(this.__flyingIndex % this.list.length);

                        if (callback) {
                                return callback(object);
                        } //run callback with reference to the object

                }
        }, {
                key: 'all',
                value: function all(callback) {
                        Quazar.each(this.list, function (ix, item) {

                                callback(item); //run callback with reference to the object
                        });
                }
        }, {
                key: 'toCheckableGui',
                value: function toCheckableGui(gui, list, key) {

                        var fui = gui.addFolder(this.type);

                        Quazar.each(this.list, function (ix, el) {

                                // store this reference somewhere reasonable or just look it up in
                                // __controllers or __folders like other examples show

                                var testObject = {};

                                testObject[key] = {};

                                var o = fui.add(testObject, key).onChange(function (value) {

                                        //  alert('Value changed to:' + value);

                                        list.push(value);
                                });

                                // some later time you manually update
                                o.updateDisplay();
                                o.__prev = o.__checkbox.checked;
                        });

                        return gui;
                }
        }]);

        return Collection;
}();

;

/**
 *
 *  class: GameWindow:
 *
 *      Requires a canvas, all sprites on canvas, and physical collective_forces on screen
 *
 *
 */

var GameWindow = function () {
        function GameWindow(_ref) {
                var canvas = _ref.canvas,
                    ctx = _ref.ctx,
                    sprites = _ref.sprites,
                    backgrounds = _ref.backgrounds,
                    interactives = _ref.interactives,
                    forces = _ref.forces,
                    update = _ref.update;

                _classCallCheck(this, GameWindow);

                this.sprite_set = new Collection(sprites || [], 'Sprite');

                this.background_set = new Collection(backgrounds || [], 'Sprite');

                this.interactive_set = new Collection(interactives || [], 'Sprite');

                this.force_set = new Collection(forces || [], 'Force');

                this.actionstack_set = new Collection(forces || [], 'ActionStack');

                this.canvas = canvas;

                this.ctx = ctx;

                Quazar.canvas = canvas;

                Quazar.ctx = ctx;

                this.camera = new Vector3(0, 0, 0);

                this.spriteOptions = this.uniques(this.sprite_set.list);

                this.extraUpdate = update || function () {};

                Quazar.__gameWindow = this;
        }

        _createClass(GameWindow, [{
                key: 'uniques',
                value: function uniques(list) {

                        var listout = [];

                        $.each(list, function (ix, item) {

                                if (!listout.indexOf(item.id) >= 0) {

                                        var str = item.name;

                                        listout.push({ "sprite": item });
                                }
                        });

                        return listout;
                }
        }, {
                key: 'extraUpdate',
                value: function extraUpdate() {}
        }, {
                key: 'setPlayer',
                value: function setPlayer(player) {

                        this.player = player;

                        if (!this.sprite_set.list.indexOf(player) >= 0) {
                                this.sprite_set.list.push(player);
                        }
                }
        }, {
                key: 'update',
                value: function update() {

                        Quazar.each(this.sprite_set.list, function (ix, item) {

                                if (typeof item.update == 'function') {
                                        item.update(item);
                                }

                                if (typeof item.def_update == 'function') {
                                        //  console.log('def_update');

                                        item.def_update(item);
                                }
                        });
                }
        }, {
                key: 'add',
                value: function add(obj) {
                        if (obj instanceof Sprite) {}
                }
        }, {
                key: 'onUpdate',
                value: function onUpdate(arg) {
                        if (typeof arg == 'function') {
                                var up = this.update;

                                this.update = function (sprites) {
                                        arg(sprites);up(sprites);
                                };
                        }
                }
        }, {
                key: 'draw',
                value: function draw() {

                        var _gw = this;

                        Quazar.each(this.sprite_set.list, function (ix, item) {

                                Canvas.draw(item, _gw.ctx);
                        });
                }
        }]);

        return GameWindow;
}();

;

var TextDisplay //show a text element
= function () {
        function TextDisplay(_ref2) {
                var font = _ref2.font,
                    size = _ref2.size,
                    text = _ref2.text,
                    color = _ref2.color;

                _classCallCheck(this, TextDisplay);
        }

        _createClass(TextDisplay, [{
                key: 'next',
                value: function next() {}
        }, {
                key: 'show',
                value: function show() {}
        }]);

        return TextDisplay;
}();

var VideoDisplay //show a video sequence
= function () {
        function VideoDisplay(_ref3) {
                var src = _ref3.src,
                    size = _ref3.size;

                _classCallCheck(this, VideoDisplay);

                this.domElement = undefined;

                this.src = src || "__NO-SRC!";

                this.size = new Vector3(size.x, size.y, size.z || 0);

                Quazar.log('VideoDisplay():: TODO: create dom element');
        }

        _createClass(VideoDisplay, [{
                key: 'play',
                value: function play() {}
        }]);

        return VideoDisplay;
}();

var Animation_Samples = [function () {
        return new Animation({
                src: "../assets/texture/2d/char/frogman1.png",
                duration: 1000, repeat: true,
                parent: {},
                frameSize: new Vector2(100, 120),
                frameBounds: new VectorBounds(new Vector2(0, 0), new Vector2(0, 0))
        });
}, function () {
        return new Animation({
                src: "../assets/texture/2d/char/frogman1.png",
                duration: 1000, repeat: true,
                parent: {},
                frameSize: new Vector2(100, 120),
                frameBounds: new VectorBounds(new Vector2(0, 0), new Vector2(0, 0))
        });
}];

var Sprite_Samples = [function () {

        var frog = new Sprite('frog', 'a frog sprite');

        frog.setAnimation(new Animation({
                src: "../assets/texture/2d/char/frogman1.png",
                duration: 1000, repeat: true,
                parent: {},
                frameSize: new Vector2(100, 120),
                frameBounds: new VectorBounds(new Vector2(0, 0), new Vector2(9, 0))
        }));

        return frog;
}, function () {

        var barrel = new Sprite('barrel', 'a barrel, interactive sprite');

        barrel.setAnimation(new Animation({
                src: "../assets/texture/2d/object/barrel1.png",
                duration: 1000, repeat: true,
                parent: {},
                frameSize: new Vector2(100, 100),
                frameBounds: new VectorBounds(new Vector2(0, 0), new Vector2(0, 0))
        }));

        return barrel;
}];

__gameInstance.event_args_list = [];; /**
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

; /**
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

                if ((typeof args === 'undefined' ? 'undefined' : _typeof(args)) == 'object' && args.frameBounds && args.frameSize) {
                        this.apply2DFrames(args.parent || {});
                };

                this.flipX = $Q.getArg(args, 'flipX', false);

                this.priority = $Q.getArg(args, 'priority', 0);

                this.cix = 0;

                this.selected_frame = this.frames[0];

                this.earlyTerm = this.getArg(args, 'earlyTerm', false);

                this.hang = this.getArg(args, 'hang', false);

                this.duration = this.getArg(args, 'duration', 1000);

                this.size = this.getArg(args, 'size', new Vector3(20, 20, 20));

                this.effects = [];

                this.timer = 0;

                this.__gameLogic = false;

                this.setType = function () {};
        }

        _createClass(Animation, [{
                key: 'singleFrame',
                value: function singleFrame(frameSize, size) {

                        this.__frametype = 'single';

                        this.frameSize = frameSize;

                        this.size = size;

                        this.selected_frame = {
                                image: this.image,
                                frameSize: this.frameSize,
                                framePos: { x: 0, y: 0 }
                        };

                        this.frames[0] = this.selected_frame;
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

                        var duration = duration || typeof this.duration == 'number' ? this.duration : this.frames.length * 20;

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
; /**
  * Created by The Blakes on 04-13-2017
  *
  */

var Callables = function () {
        function Callables(args) {
                _classCallCheck(this, Callables);

                this.list = [];

                if (args instanceof Array) {
                        this.list = args;
                } else {
                        this.list = this.getArg(args, 'list', []);
                }
        }

        _createClass(Callables, [{
                key: 'getArg',
                value: function getArg(args, key, fallback) {

                        if (args.hasOwnProperty(key)) {

                                return args[key];
                        } else {
                                return fallback;
                        }
                }
        }, {
                key: 'add',
                value: function add(item) {

                        if (typeof item.engage == 'function') {
                                this.list.push(item);
                        } else if (typeof item.fire == 'function') {
                                this.list.push(item);
                        } else if (typeof item.start == 'function') {
                                this.list.push(item);
                        } else if (typeof item.run == 'function') {
                                this.list.push(item);
                        } else if (typeof item.process == 'function') {
                                this.list.push(item);
                        }
                }
        }, {
                key: 'call',
                value: function call() {
                        $.each(this.list, function (ix, item) {

                                if (typeof item.engage == 'function') {
                                        item.engage();
                                }

                                if (typeof item.fire == 'function') {
                                        item.fire();
                                }

                                if (typeof item.start == 'function') {
                                        item.start();
                                }

                                if (typeof item.run == 'function') {
                                        item.run();
                                }

                                if (typeof item.process == 'function') {
                                        item.process();
                                }
                        });
                }
        }]);

        return Callables;
}();

; /**
  * Created by The Blakes on 04-13-2017
  *
  * Camera : has simple x, y, z, position / Vector, follows a specific sprite
  *
  * *incomplete as of 07-20-2017
  */

var Camera = function () {
        function Camera(position) {
                _classCallCheck(this, Camera);

                this.position = Quazar.getArg(args, 'position', Quazar.getArg(args, 'pos', new Vector3(0, 0, 0)));
        }

        _createClass(Camera, [{
                key: 'follow',
                value: function follow(object, accel, max, distSize) {}
        }]);

        return Camera;
}();

; /**
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
                key: 'getArg',
                value: function getArg(args, key, fallback) {

                        if (args.hasOwnProperty(key)) {

                                return args[key];
                        } else {
                                return fallback;
                        }
                }
        }, {
                key: 'gravitateY',
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

; /**
  * Created by The Blakes on 7/27/2017.
  */

var StatEffect = function () {
        function StatEffect(name, value, onEffect) {
                _classCallCheck(this, StatEffect);

                this.__is = "a game logic effect";

                this.name = name;

                this.value = value;

                this.onEffect = onEffect || function () {};
        }

        _createClass(StatEffect, [{
                key: 'limit',
                value: function limit(numberTimes, withinDuration) {}
        }, {
                key: 'process',
                value: function process(object) {
                        //if the object has any property by effect.name, the property is incremenented by effect value
                        //a health decrease is triggered by Effect('health', -10);


                        for (var x in object) {
                                if (x.toLowerCase() == this.name.toLowerCase() && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == _typeof(object[x])) {

                                        object[x] += this.value;
                                }
                        }
                }
        }, {
                key: 'onEffect',
                value: function onEffect() {}
        }]);

        return StatEffect;
}();

;

var GameEffect = function () {
        function GameEffect(args) {
                _classCallCheck(this, GameEffect);

                var myChance = this.chance(args.chance || 1.0); //the chance the effect will happen

                this.trigger = args.trigger || 'always' || 'collide';

                this.parent = args.parent || false;

                if (!this.parent) {
                        console.error('GameEffect Must have valid parent sprite');
                }

                this.objects = args.objects || [];

                for (var x in args) {

                        if (x instanceof Animation) {

                                //trigger the Animation

                        }

                        if (x instanceof StatEffect) {

                                //trigger the StatEffect


                        }
                }
        }

        _createClass(GameEffect, [{
                key: 'chance',
                value: function chance(floatPrecision) {}
        }, {
                key: 'collide',
                value: function collide(object, collidables) {}
        }]);

        return GameEffect;
}();

var GameLogic = function () {
        function GameLogic(gameEffectList) {
                _classCallCheck(this, GameLogic);

                if (!gameEffectList instanceof Array) {

                        console.info('GameLogic: gameEffectList was not an array');

                        gameEffectList = [];
                }

                this.gameEffects = gameEffectList;
        }

        _createClass(GameLogic, [{
                key: 'process_all',
                value: function process_all() {

                        //process all game logic objects::


                }
        }, {
                key: 'add',
                value: function add(effect) {

                        this.gameEffects.push(effect);
                }
        }]);

        return GameLogic;
}();

;
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
                key: 'gamepads',
                value: function gamepads() {

                        return navigator.getGamepads();
                }
        }, {
                key: 'disconnect_all',
                value: function disconnect_all() {

                        for (var x = 0; x < this.intervals.length; x++) {

                                window.clearInterval(this.intervals[x]);
                        }
                }
        }, {
                key: 'disconnect_by_index',
                value: function disconnect_by_index(game_pad_index) {

                        window.clearInterval(this.intervals[game_pad_index]);
                }
        }, {
                key: 'hasAnyPad',
                value: function hasAnyPad() {
                        return "getGamepads" in navigator;
                }
        }, {
                key: 'Event',
                value: function Event(key, game_pad, callback) {
                        return {

                                key: key, game_pad: game_pad, callback: callback

                        };
                }
        }, {
                key: 'GamepadEvents',
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
                key: 'process',
                value: function process(gp, gpEvents) {

                        this.process_buttons(gp, gpEvents);

                        this.process_axes(gp, gpEvents);
                }
        }, {
                key: 'process_axes',
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
                key: 'process_buttons',
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
                key: 'on',
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

; /**
  * Created by The Blakes on 04-13-2017
  *
  */

var Motion = function () {
        function Motion(args) {
                _classCallCheck(this, Motion);

                this.distance = this.getArg(args, 'distance', this.getArg(args, 'distances', false));

                this.curvesList = this.curvesObject();

                this.parent_id = args.parent_id || "__blank";

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

        _createClass(Motion, [{
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

                                                // alert('setting curve');

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

                                if (item.id == __inst.parent_id) {

                                        objects[ix] = item;
                                }
                        });

                        var target = {

                                x: __inst.distance.x + objects[0].position.x,
                                y: __inst.distance.y + objects[0].position.y,
                                z: __inst.distance.z + objects[0].position.z

                        };

                        if (__inst.targetRotation > 0 || __inst.targetRotation < 0) {

                                var targetR = __inst.targetRotation + objects[0].rotation.x;

                                //we have a target
                                tweens[0] = new TWEEN.Tween(objects[0].rotation).easing(__inst.curve || TWEEN.Easing.Elastic.InOut).to({ x: targetR }, __inst.duration).onUpdate(function () {
                                        //console.log(objects[0].position.x,objects[0].position.y);


                                }).onComplete(function () {
                                        //console.log(objects[0].position.x, objects[0].position.y);
                                        if (__inst.complete) {

                                                __inst.complete();
                                        }
                                });
                        }

                        //we have a target
                        tweens.push(new TWEEN.Tween(objects[0].position).easing(__inst.curve || TWEEN.Easing.Elastic.InOut).to(target, __inst.duration).onUpdate(function () {
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

                // obj.getGraphCanvas( $(c.domElement), value.replace('_', '.'), TWEEN.Easing[parts[0]][parts[1]] );

        }, {
                key: 'getGraphCanvas',
                value: function getGraphCanvas(t, f, c) {

                        var canvas = document.createElement('canvas');

                        canvas.id = 'curve-display';

                        canvas.width = 180;
                        canvas.height = 100;

                        var context = canvas.getContext('2d');
                        context.fillStyle = "rgb(250,250,250)";
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

                        var position = { x: 5, y: 80 };
                        var position_old = { x: 5, y: 80 };

                        new TWEEN.Tween(position).to({ x: 175 }, 2000).easing(TWEEN.Easing.Linear.None).start();
                        new TWEEN.Tween(position).to({ y: 20 }, 2000).easing(f).onUpdate(function () {

                                context.beginPath();
                                context.moveTo(position_old.x, position_old.y);
                                context.lineTo(position.x, position.y);
                                context.closePath();
                                context.stroke();

                                position_old.x = position.x;
                                position_old.y = position.y;
                        }).start();

                        return canvas;
                }
        }]);

        return Motion;
}();

;

var Sprite = function () {
        function Sprite(name, description, args) {
                _classCallCheck(this, Sprite);

                this.name = name || "__";

                this.description = description || "__";

                this.active = true;

                if ((typeof name === 'undefined' ? 'undefined' : _typeof(name)) == 'object') {
                        args = name;
                }

                var _spr = this;

                Quazar.each(args, function (ix, item) {

                        if (ix !== 'parent') {
                                _spr[ix] = item;
                        }
                });

                this.type = $Q.getArg(args, 'type', 'basic');

                this.animations = $Q.getArg(args, 'animations', []);

                this.motions = $Q.getArg(args, 'motions', []);

                var __inst = this;

                this.id = $Q.getArg(args, 'id', this.setid());

                this.sounds = $Q.getArg(args, 'sounds', []);

                this.image = $Q.getArg(args, 'image', new GameImage($Q.getArg(args, 'src', false)));

                this.size = $Q.getArg(args, 'size', new Vector2(100, 100));

                this.position = $Q.getArg(args, 'position', new Vector3(0, 0, 0));

                this.collision_bounds = $Q.getArg(args, 'collision_bounds', new VectorBounds(new Vector3(0, 0, 0), new Vector3(0, 0, 0)));

                this.rotation = $Q.getArg(args, 'rotation', new Vector3(0, 0, 0));

                this.selected_animation = {};

                this.selected_motionstack = {};

                this.selected_physics = {};

                this.onGround = false;

                this.clasticTo = []; //an array of sprite types


                this.damagedBy = []; //an array of animation types


                this.speed = $Q.getArg(args, 'speed', new Vector3(0, 0, 0)); //store constant speed value

                this.accel = $Q.getArg(args, 'accel', new Vector3(0, 0, 0)); //store constant accel value


                this.rot_speed = $Q.getArg(args, 'rot_speed', new Vector3(0, 0, 0));

                this.rot_accel = $Q.getArg(args, 'rot_accel', new Vector3(0, 0, 0));

                this.actionlists = $Q.getArg(args, 'actionlists', []);

                $.each(this.sounds, function (ix, item) {

                        __inst.sounds[ix] = new Sound(item);
                });

                $.each(this.motions, function (ix, item) {

                        __inst.motions[ix] = new Motion(item);
                });

                $.each(this.animations, function (ix, item) {

                        __inst.animations[ix] = new Animation(item);
                });
        }

        _createClass(Sprite, [{
                key: 'setSize',
                value: function setSize(size) {
                        this.size = new Vector3(size.x, size.y, size.z || 0);

                        this.selected_animation.size = this.size;
                }
        }, {
                key: 'setid',
                value: function setid() {
                        return new Date().getUTCMilliseconds();
                }
        }, {
                key: 'get_id',
                value: function get_id() {

                        return this.id;
                }
        }, {
                key: 'onScreen',
                value: function onScreen(w, h) {
                        return this.position.x + this.size.x >= 0 && this.position.x < w && this.position.y + this.size.y >= 0 && this.position.y < h;
                }
        }, {
                key: 'type_options',
                value: function type_options() {

                        return ['player', 'enemy', 'powerup', 'attachment', 'projectile'];
                }
        }, {
                key: 'update',
                value: function update() {}
        }, {
                key: 'def_update',
                value: function def_update() {

                        for (var x in this.speed) {

                                if (this.speed[x] > 0 || this.speed[x] < 0) {

                                        this.position[x] += this.speed[x];
                                }
                        }

                        for (var x in this.accel) {

                                if (this.accel[x] > 0 || this.accel[x] < 0) {

                                        this.speed[x] += this.accel[x];
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
        }, {
                key: 'collidesRectangular',
                value: function collidesRectangular(sprite) {

                        return Quazar.Collision.spriteRectanglesCollide(sprite);
                }
        }, {
                key: 'shoot',
                value: function shoot(options) {
                        //character shoots an animation


                        this.prep_key = 'shoot';

                        var spread = options.spread || options.angleSpread || false;

                        var total = options.total || options.totalBullets || options.numberBullets || false;

                        var animation = options.bullet || options.animation || false;

                        var duration = options.duration || options.screenDuration || false;

                        var speed = options.speed || false;

                        if (__gameInstance.isAtPlay) {} else {

                                this.event_arg(this.prep_key, '_', options);
                        }

                        return this;
                }
        }, {
                key: 'allow',
                value: function allow(options) {
                        this.prep_key = 'animate';

                        this.event_arg(this.prep_key, '_', options);
                }
        }, {
                key: 'animate',
                value: function animate(animation) {

                        alert('calling animation');

                        if (__gameInstance.isAtPlay) {

                                this.setAnimation(animation);

                                return this;
                        } else {
                                var evt = __gameInstance.event_args_list[__gameInstance.event_args_list.length - 1];

                                evt.animation = animation;

                                return this;
                        }

                        return this;
                }
        }, {
                key: 'velocityY',
                value: function velocityY(accel, max) {

                        this.assertSpeed();

                        if (this.speed.y < max.y) {
                                this.speed.y += accel;
                        }

                        this.position.y += this.speed.y;
                }
        }, {
                key: 'collide',
                value: function collide(item) {

                        var max_y = item.max ? item.max.y : item.position.y;

                        if (this.position.y + this.size.y >= max_y) {

                                this.position.y = max_y - this.size.y;
                        }
                }
        }, {
                key: 'assertSpeed',
                value: function assertSpeed() {
                        if (!this.speed) {

                                this.speed = new Vector3(0, 0, 0);
                        }
                }
        }, {
                key: 'swing',
                value: function swing() {}
        }, {
                key: 'accel',
                value: function accel(options) {

                        this.prep_key = 'accel';

                        //targeting position

                        if (__gameInstance.isAtPlay) {

                                this.assertSpeed();

                                if (options.hasOwnProperty('switch') && this[options.switch] !== true) {
                                        return false;
                                } else {

                                        //  this[options.switch] = false;

                                }

                                if (options.extras && options.speed !== 0) {

                                        for (var x in options.extras) {
                                                this[x] = options.extras[x];
                                        }
                                }

                                if (this.speed[options.key] < options.speed) {

                                        this.speed[options.key] += options.accel;
                                } else if (this.speed[options.key] > options.speed) {

                                        this.speed[options.key] -= options.accel;
                                } else if (options.speed == 0) {
                                        this.speed[options.key] = 0;
                                }
                        } else {

                                this.event_arg(this.prep_key, '_', options);
                        }

                        return this;
                }
        }, {
                key: 'deccelX',
                value: function deccelX(rate) {
                        if ((typeof rate === 'undefined' ? 'undefined' : _typeof(rate)) == 'object') {

                                rate = rate.rate;
                        }

                        if (this.speed['x'] > rate) {
                                this.speed['x'] -= rate;
                        } else if (this.speed['x'] < rate) {
                                this.speed['x'] += rate;
                        } else {

                                this.speed['x'] = 0;
                        }
                }
        }, {
                key: 'setAnimation',
                value: function setAnimation(anime) {

                        this.animations['default'] = anime;

                        this.selected_animation = anime;

                        Quazar.log('declared default animation');

                        return this;
                }
        }, {
                key: 'defaultAnimation',
                value: function defaultAnimation(anime) {

                        this.animations['default'] = anime;

                        Quazar.log('declared default animation');

                        return this;
                }
        }, {
                key: 'fromFile',
                value: function fromFile(file_path) {
                        var __inst = this;

                        $.getJSON(file_path, function (data) {

                                __inst = new Sprite(data);
                        });
                }
        }]);

        return Sprite;
}();

var GameObjects = {

        init: function init() {

                var BlockTile = new Sprite();

                this.sprites = [];
        }

};

;

var BlockSprite = function BlockSprite(sprite) {
        _classCallCheck(this, BlockSprite);

        this.__subType = "block";

        //todo: apply a sprite that collides on both sides
};

var PowerContainer = function () {
        function PowerContainer(sprite) {
                _classCallCheck(this, PowerContainer);

                this.__subType = "block";

                //todo: apply a sprite that collides on both sides
        }

        _createClass(PowerContainer, [{
                key: 'onStrike',
                value: function onStrike() {}
        }]);

        return PowerContainer;
}();

var SideScrollerSprite = function SideScrollerSprite(sprite) {
        _classCallCheck(this, SideScrollerSprite);

        this.__subType = "block";

        //todo: apply a sprite that collides on both sides
};
//# sourceMappingURL=Quick2d.js.map
