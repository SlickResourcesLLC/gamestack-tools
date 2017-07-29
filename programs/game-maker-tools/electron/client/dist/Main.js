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

__gameInstance.event_args_list = [];
//# sourceMappingURL=Main.js.map
