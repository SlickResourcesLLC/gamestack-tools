'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Sound
 * :Simple Sound object:: uses Jquery: audio
 * @param   {string} src : source path / name of the targeted sound-file

 * @returns {Sound} object of Sound()
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

/**
 * GameImage
 *
 * Simple GameImage
 * @param   {string} src : source path / name of the targeted image-file

 * @returns {GameImage} object of GameImage()

 * */

var GameImage = function () {
        function GameImage(src, onCreate) {
                _classCallCheck(this, GameImage);

                // GameStack.log('initializing image');

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
                } else {
                        this.image.onerror = function () {
                                this.__error = true;
                        };
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

var GameStackLibrary = function GameStackLibrary() {

        var lib = {

                DEBUG: false,

                gui_mode: true,

                __gameWindow: {},

                __sprites: [],

                __animations: [],

                samples: {},

                log_modes: ['reqs', 'info', 'warning'],

                log_mode: "all",

                recursionCount: 0,

                __gameWindowList: [],

                create_id: function create_id() {

                        var d = new Date().getTime();
                        if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
                                d += performance.now(); //use high-precision timer if available
                        }
                        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                                var r = (d + Math.random() * 16) % 16 | 0;
                                d = Math.floor(d / 16);
                                return (c === 'x' ? r : r & 0x3 | 0x8).toString(16);
                        });
                },

                getActionablesCheckList: function getActionablesCheckList() {
                        //every unique sound, animation, tweenmotion in the game

                        var __inst = {};

                        var actionables = [];

                        $Q.each(this.sprites, function (ix, item) {

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

                        if (GameStack.DEBUG) {

                                console.info('Info:' + m);
                        }
                },

                log: function log(m) {

                        if (GameStack.DEBUG) {

                                console.log('GameStack:' + m);
                        }
                },

                //animate() : main animation call, run the once and it will recurse with requestAnimationFrame(this.animate);

                animate: function animate(time) {

                        __gameStack.isAtPlay = true;

                        TWEEN.update(time);

                        requestAnimationFrame(__gameStack.animate);

                        __gameStack.__gameWindow.update();

                        __gameStack.__gameWindow.ctx.clearRect(0, 0, __gameStack.__gameWindow.canvas.width, __gameStack.__gameWindow.canvas.height);

                        __gameStack.__gameWindow.draw();
                },

                start: function start() {

                        this.animate();
                },

                Collision: {
                        spriteRectanglesCollide: function spriteRectanglesCollide(obj1, obj2, padding) {
                                if (!padding) {
                                        padding = 0;
                                }

                                var paddingX = padding * obj1.size.x,
                                    paddingY = padding * obj1.size.y,
                                    left = obj1.position.x + paddingX,
                                    right = obj1.position.x + obj1.size.x - paddingX,
                                    top = obj1.position.y + paddingY,
                                    bottom = obj1.position.y + obj1.size.y - paddingY;

                                if (right > obj2.position.x && left < obj2.position.x + obj2.size.x && bottom > obj2.position.y && top < obj2.position.y + obj2.size.y) {

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

                        __gameStack.each(keys, function (ix, item) {

                                object[ix] = args[ix];
                        });
                },

                each: function each(list, onResult, onComplete) {
                        for (var i in list) {
                                onResult(i, list[i]);
                        }

                        if (typeof onComplete === 'function') {
                                onComplete(false, list);
                        }
                        ;
                },

                ready_callstack: [],

                ready: function ready(callback) {

                        this.ready_callstack.push(callback);
                },

                callReady: function callReady() {

                        var funx = this.ready_callstack;

                        var gameWindow = this._gameWindow,
                            lib = this,
                            sprites = this.__gameWindow.sprites;

                        //call every function in the ready_callstack

                        this.each(funx, function (ix, call) {

                                call(lib, gameWindow, sprites);
                        });

                        this.InputEvents.init();
                },

                getArg: function getArg(args, key, fallback) {
                        if (args && args.hasOwnProperty(key)) {
                                return args[key];
                        } else {
                                return fallback;
                        }
                },

                add: function add(obj) {
                        //1: if Sprite(), Add object to the existing __gameWindow

                        if (obj instanceof GameWindow) {

                                this.__gameWindow = obj;
                        }

                        if (obj instanceof Force) {

                                this.__gameWindow.forces.push(obj);
                        }

                        if (obj instanceof Camera) {

                                this.__gameWindow.camera = obj;
                        }

                        if (obj instanceof Sprite) {

                                this.__gameWindow.sprites.push(obj);
                        }

                        this.collect(obj);

                        return obj;
                },

                remove: function remove(obj) {
                        //1: if Sprite(), Add object to the existing __gameWindow


                        if (obj instanceof Sprite) {

                                var ix = this.__gameWindow.sprites.indexOf(obj);

                                this.__gameWindow.sprites.splice(ix, 1);
                        }
                },

                all_objects: [],

                collect: function collect(obj) {

                        this.all_objects.push(obj);
                },

                isNormalStringMatch: function isNormalStringMatch(str1, str2) {

                        return str1.toLowerCase().replace(' ', '') == str2.toLowerCase().replace(' ', '');
                },

                instance_type_pairs: function instance_type_pairs() {
                        //get an array of all instance/type pairs added to the library

                        //example : [ {constructor_name:Sprite, type:enemy_basic}, {constructor_name:Animation, type:enemy_attack}  ];

                        var objectList = [];

                        this.each(this.all_objects, function (ix, item) {

                                objectList.push({ constructor_name: item.constructor.name, type: item.type });
                        });

                        return objectList;
                },

                select: function select(constructor_name, name, type /*ignoring spaces and CAPS/CASE on type match*/) {

                        var objects_out = [];

                        var normalizedType;

                        var __inst = this;

                        this.each(this.all_objects, function (ix, item) {

                                if (constructor_name == '*' || item.constructor.name == constructor_name) {

                                        if (type == '*' || __inst.isNormalStringMatch(type, item.type)) {

                                                if (name == '*' || __inst.isNormalStringMatch(name, item.name)) {

                                                        objects_out.push(item);
                                                }
                                        }
                                }
                        });

                        return objects_out;
                }

        };

        return lib;
};

//GameStack: a main / game lib object::
//TODO: fix the following set of mixed references:: only need to refer to (1) lib instance

var GameStack = new GameStackLibrary();
var __gameStack = GameStack;

var Quick2d = GameStack; //Exposing 'Quick2d' as synonymous reference to GameStack

var Quazar = GameStack; //Exposing 'Quazar' as synonymous reference to GameStack

var QUAZAR = GameStack; //Exposing 'QUAZAR' as synonymous reference to GameStack

var __gameInstance = GameStack;

/***************
 * TODO : fix the above duplicate references, which exist now for backward compatibility with previouslyh authored code
 *
 *  -apply find and replace accross the codebase
 *
 * ****************/

/********
 * jstr() : public function for stringified objects and arrays (uses pretty print style)
 * *********/

function jstr(obj) {

        return JSON.stringify(obj);
};

/**********
 * $Q : Selector Function *in development
 *  -allows string selection of library collections, etc...
 * Example Calls
 * **********/

function $Q(selector) {

        //declare events:


        var $GFunx = {};

        $GFunx.each = function (callback) {

                var objects = [];

                for (var x = 0; x < this.length; x++) {
                        if (typeof x == 'number') {

                                callback(x, this[x]);
                        }
                }
        };

        $GFunx.on = function (evt_key, selectorObject, controller_ix, callback) //handle each event such as on('collide') OR on('stick_left_0') << first controller stick_left
        {

                if (__gameStack.isAtPlay) {
                        return console.error('Cannot call $Q().on while game is at play. Please rig your events before gameplay.');
                }

                var criterion = $Q.between('[', ']', evt_key);

                if (criterion.indexOf('===') >= 0) {
                        criterion = criterion.replace('===', '=');
                }

                if (criterion.indexOf('==') >= 0) {
                        criterion = criterion.replace('==', '=').replace('==', 0);
                }

                var cparts = criterion.split('=');

                var __targetType = "*",
                    __targetName = "*";

                if (evt_key.indexOf('[') >= 0) {
                        evt_key = $Q.before('[', evt_key).trim();
                }

                var padding = 0;

                if (cparts[0].toLowerCase() == 'padding') {

                        padding = parseFloat(cparts[1]);

                        alert('padding:' + padding);
                }

                //if controller_ix is function, and callback not present, then controller_ix is the callback aka optional argument

                if (controller_ix && typeof controller_ix == 'function' && !callback) {
                        callback = controller_ix;
                        controller_ix = 0;
                }

                //if controller_ix is function, and callback not present, then selectorObject is the callback aka optional argument

                if (selectorObject && typeof selectorObject == 'function' && !callback) {

                        callback = selectorObject;

                        selectorObject = $Q('*');

                        controller_ix = 0;
                };

                var evt_profile = {};

                //which controller?

                evt_profile.cix = controller_ix;

                //Need the control key: 'left_stick', 'button_0', etc..

                evt_profile.evt_key = evt_key;

                if ($Q.contains_any(['stick', 'button', 'click', 'key'], evt_profile.evt_key)) {

                        var button_mode = evt_profile.evt_key.indexOf('button') >= 0;

                        Quazar.GamepadAdapter.on(evt_profile.evt_key, 0, function (x, y) {

                                if (!button_mode) {
                                        callback(x, y);
                                } else if (x) {
                                        callback(x);
                                };
                        });

                        console.info('detected input event key in:' + evt_profile.evt_key);

                        console.info('TODO: rig events');
                }

                //TODO: test collision events:

                else if ($Q.contains_any(['collide', 'collision', 'hit', 'touch'], evt_profile.evt_key)) {

                                console.info('Rigging a collision event');

                                console.info('detected collision event key in:' + evt_profile.evt_key);

                                console.info('TODO: rig collision events');

                                this.each(function (ix, item1) {

                                        selectorObject.each(function (iy, item2) {

                                                if (typeof item1.onUpdate == 'function') {

                                                        item1.onUpdate(function (sprite) {

                                                                if (item1.collidesRectangular(item2, padding)) {

                                                                        callback(item1, item2);
                                                                };
                                                        });
                                                }
                                        });
                                });
                        } else {
                                console.info('Rigging a property event');

                                //TODO: test property-watch events:

                                console.info('detected property threshhold event key in:' + evt_profile.evt_key);

                                console.info('TODO: rig property events');

                                var condition = "_",
                                    key = evt_profile.evt_key;

                                if (key.indexOf('[') >= 0 || key.indexOf(']') >= 0) {
                                        key = key.replace('[', '').replace('[', ']');
                                }

                                var evt_parts = [];

                                var run = function run() {
                                        console.error('Sprite property check was not set correctly');
                                };

                                if (key.indexOf('>=') >= 0) {
                                        condition = ">=";
                                } else if (key.indexOf('<=') >= 0) {
                                        condition = "<=";
                                } else if (key.indexOf('>') >= 0) {
                                        condition = ">";
                                } else if (key.indexOf('<') >= 0) {
                                        condition = "<";
                                } else if (key.indexOf('=') >= 0) {
                                        condition = "=";
                                }

                                evt_parts = key.split(condition);

                                for (var x = 0; x < evt_parts.length; x++) {
                                        evt_parts[x] = evt_parts[x].replace('=', '').replace('=', '').trim(); //remove any trailing equals and trim()
                                }

                                var mykey, number;

                                // alert(evt_parts[0]);

                                try {

                                        mykey = evt_parts[0];

                                        number = parseFloat(evt_parts[1]);
                                } catch (e) {
                                        console.log(e);
                                }

                                console.info('Processing condition with:' + condition);

                                switch (condition) {

                                        case ">=":

                                                run = function run(obj, key) {
                                                        if (obj[key] >= number) {
                                                                callback();
                                                        }
                                                };

                                                break;

                                        case "<=":

                                                run = function run(obj, key) {
                                                        if (obj[key] <= number) {
                                                                callback();
                                                        }
                                                };

                                                break;

                                        case ">":

                                                run = function run(obj, key) {
                                                        if (obj[key] > number) {
                                                                callback();
                                                        }
                                                };

                                                break;

                                        case "<":

                                                run = function run(obj, key) {
                                                        if (obj[key] < number) {
                                                                callback();
                                                        }
                                                };

                                                break;

                                        case "=":

                                                run = function run(obj, key) {
                                                        if (obj[key] == number) {
                                                                callback();
                                                        }
                                                };

                                                break;

                                }

                                /************
                                 * Attach update to each member
                                 *
                                 * **************/

                                var keys = mykey.split('.'),
                                    propkey = "";

                                this.each(function (ix, item) {

                                        var object = {};

                                        if (keys.length == 1) {
                                                object = item;

                                                propkey = mykey;
                                        } else if (keys.length == 2) {
                                                object = item[keys[0]];

                                                propkey = keys[1];
                                        } else if (keys.length == 3) {
                                                object = item[keys[0]][keys[1]];

                                                propkey = keys[2];
                                        } else {
                                                console.error(":length of '.' notation out of range. We use max length of 3 or prop.prop.key.");
                                        }

                                        if (typeof item.onUpdate == 'function') {

                                                var spr = item;

                                                item.onUpdate(function (sprite) {

                                                        run(object, propkey);
                                                });
                                        }
                                });
                        }
        };

        var object_out = {};

        //handle selector / selection of objects:

        if (selector && selector !== '*') {

                var s = selector || '';

                console.info('selector:' + s);

                var mainSelector = $Q.before('[', s).trim(),
                    msfChar = mainSelector.substring(0, 1);

                var __targetClassName = "*";

                var output = [];

                var cleanSelectorString = function cleanSelectorString(str) {
                        return str.replace(",", "");
                };

                switch (msfChar.toLowerCase()) {
                        case ".":

                                console.info('Selecting by "." or class');

                                __targetClassName = cleanSelectorString($Q.after('.', mainSelector));

                                console.info('Target class is:' + __targetClassName);

                                break;

                        case "*":

                                console.info('Selecting by "*" or ANY object in the library instance');

                                __targetClassName = "*";

                                break;

                }

                var criterion = $Q.between('[', ']', s),
                    cparts = criterion.split('=');

                var __targetType = "*",
                    __targetName = "*";

                var getParts = function getParts() {

                        if (cparts.length >= 2) {

                                switch (cparts[0].toLowerCase()) {

                                        case "name":

                                                //get all objects according to name=name

                                                console.log('Detected parts in selector:' + jstr(cparts));

                                                __targetName = cleanSelectorString(cparts[1]);

                                                break;

                                        case "type":

                                                console.log('Detected parts in selector:' + jstr(cparts));

                                                __targetType = cleanSelectorString(cparts[1]);

                                                break;

                                }
                        }

                        if (cparts.length >= 4) {

                                cparts[2] = cparts[2].replace(",", "");

                                switch (cparts[2].toLowerCase()) {

                                        case "name":

                                                //get all objects according to name=name

                                                console.log('Detected parts in selector:' + jstr(cparts));

                                                __targetName = cleanSelectorString(cparts[3]);

                                                break;

                                        case "type":

                                                console.log('Detected parts in selector:' + jstr(cparts));

                                                __targetType = cleanSelectorString(cparts[3]);

                                                break;

                                }
                        }
                };

                getParts(cparts);

                object_out = GameStack.select(__targetClassName, __targetName, __targetType);
        } else if (selector == '*') {
                object_out = GameStack.all_objects;
        }

        for (var x in $GFunx) {
                object_out[x] = $GFunx[x];
        };

        return object_out;
}

$Q.each = function (obj, callback, complete) {

        for (var x in obj) {
                callback(obj);
        }

        if (typeof complete == 'function') {
                complete(obj);
        }
};

$Q.before = function (c1, test_str) {
        var start_pos = 0;
        var end_pos = test_str.indexOf(c1, start_pos);
        return test_str.substring(start_pos, end_pos);
};

$Q.contains = function (c1, test_str) {
        return test_str.indexOf(c1) >= 0;
};

$Q.contains_all = function (cList, test_str) {
        for (var x = 0; x < cList.length; x++) {
                if (test_str.indexOf(cList[x]) < 0) {
                        return false;
                }
        }

        return true;
};

$Q.contains_any = function (cList, test_str) {

        for (var x = 0; x < cList.length; x++) {
                if (test_str.indexOf(cList[x]) >= 0) {
                        return true;
                }
        }

        return false;
};

$Q.after = function (c1, test_str) {
        var start_pos = test_str.indexOf(c1) + 1;
        var end_pos = test_str.length;
        return test_str.substring(start_pos, end_pos);
};

$Q.between = function (c1, c2, test_str) {
        var start_pos = test_str.indexOf(c1) + 1;
        var end_pos = test_str.indexOf(c2, start_pos);
        return test_str.substring(start_pos, end_pos);
};

$Q.test_selector_method = function () {
        var Q_TestStrings = ['*', '.Sprite', '*[type="enemy_type_0"]', '.Sprite[type="enemy_type_0"]'];

        for (var x = 0; x < Q_TestStrings.length; x++) {
                var test = Q_TestStrings[x];

                console.info('testing:' + test);

                $Q(test);
        }

        console.log('Testing stick left');

        this.on('stick_left_0');

        console.log('Testing button');

        this.on('button_0');

        console.log('Testing collide');

        this.on('collide');

        console.log('Testing button');

        this.on('collide');

        console.log('Testing prop');

        this.on('health>=0');
};

/********************
 * GameStack.InputEvents
 * -Various PC Input Events
 ********************/

GameStack.InputEvents = { //PC input events
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
                        GameStack.InputEvents[cleanKey] = GameStack.InputEvents[cleanKey] || [];
                        return GameStack.InputEvents[cleanKey].push({ down: callback, up: onFinish });
                } else {

                        GameStack.InputEvents[evt_key] = GameStack.InputEvents[evt_key] || [];
                        return GameStack.InputEvents[evt_key].push({ down: callback, up: onFinish });
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
                        x -= GameStack.canvas.offsetLeft;
                        y -= GameStack.canvas.style.top;
                        return { x: x, y: y };
                }

                function fullMoveInputEvents(event) {

                        var pos = getMousePos(event);
                        var InputEvents = GameStack.InputEvents;
                        for (var x in InputEvents) {

                                if (InputEvents[x] instanceof Array && x == 'mousemove') {

                                        GameStack.each(InputEvents[x], function (ix, el) {

                                                el.down(pos.x, pos.y);
                                        });
                                }
                        }
                }
                ;
                document.onkeydown = function (e) {

                        //    alert(JSON.stringify(GameStack.InputEvents, true, 2));

                        GameStack.log('Got e');

                        var value = 'key_' + String.fromCharCode(e.keyCode).toLowerCase();
                        if (GameStack.InputEvents[value] instanceof Array) {

                                GameStack.log('Got []');

                                GameStack.each(GameStack.InputEvents[value], function (ix, item) {

                                        if (typeof item.down == 'function') {

                                                //   alert('RUNNING');

                                                item.down();
                                        }
                                });
                        }
                };

                document.onkeyup = function (e) {

                        //    alert(JSON.stringify(GameStack.InputEvents, true, 2));

                        var value = 'key_' + String.fromCharCode(e.keyCode).toLowerCase();
                        if (GameStack.InputEvents[value] instanceof Array) {

                                GameStack.each(GameStack.InputEvents[value], function (ix, item) {

                                        if (typeof item.up == 'function') {

                                                //   alert('RUNNING');

                                                item.up();
                                        }
                                });
                        }
                };

                GameStack.canvas.onmousedown = function (e) {

                        //    alert(JSON.stringify(GameStack.InputEvents, true, 2));

                        var value = e.which;
                        var pos = getMousePos(e);
                        var InputEvents = GameStack.InputEvents;

                        e.preventDefault();

                        switch (e.which) {
                                case 1:

                                        for (var x in InputEvents) {

                                                if (InputEvents[x] instanceof Array && x == 'leftclick') {

                                                        GameStack.each(InputEvents[x], function (ix, el) {

                                                                el.down(pos.x, pos.y);
                                                        });
                                                }
                                        }

                                        break;
                                case 2:
                                        // alert('Middle Mouse button pressed.');


                                        for (var x in GameStack.InputEvents) {

                                                if (InputEvents[x] instanceof Array && x == 'middleclick') {

                                                        GameStack.each(InputEvents[x], function (ix, el) {

                                                                el.down(pos.x, pos.y);
                                                        });
                                                }
                                        }
                                        break;
                                case 3:
                                        //  alert('Right Mouse button pressed.');


                                        for (var x in GameStack.InputEvents) {

                                                if (InputEvents[x] instanceof Array && x == 'rightclick') {

                                                        GameStack.each(InputEvents[x], function (ix, el) {

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
                GameStack.canvas.onmouseup = function (e) {

                        //    alert(JSON.stringify(GameStack.InputEvents, true, 2));

                        var value = e.which;
                        var pos = getMousePos(e);
                        var InputEvents = GameStack.InputEvents;

                        e.preventDefault();

                        switch (e.which) {
                                case 1:

                                        for (var x in InputEvents) {

                                                if (InputEvents[x] instanceof Array && x == 'leftclick') {

                                                        GameStack.each(InputEvents[x], function (ix, el) {

                                                                el.up(pos.x, pos.y);
                                                        });
                                                }
                                        }

                                        break;
                                case 2:
                                        // alert('Middle Mouse button pressed.');


                                        for (var x in GameStack.InputEvents) {

                                                if (InputEvents[x] instanceof Array && x == 'middleclick') {

                                                        GameStack.each(InputEvents[x], function (ix, el) {

                                                                el.up(pos.x, pos.y);
                                                        });
                                                }
                                        }
                                        break;
                                case 3:
                                        //  alert('Right Mouse button pressed.');


                                        for (var x in GameStack.InputEvents) {

                                                if (InputEvents[x] instanceof Array && x == 'rightclick') {

                                                        GameStack.each(InputEvents[x], function (ix, el) {

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

__gameStack = QUAZAR;

//Override the existing window.onload function

window._preGameStack_windowLoad = window.onload;

window.onload = function () {

        if (typeof window._preGameStack_windowLoad == 'function') {
                window._preGameStack_windowLoad();
        }

        __gameStack.callReady();
};

/*
 * Canvas
 *    draw animations, textures to the screen
 * */

var Canvas = {

        __levelMaker: false,

        draw: function draw(sprite, ctx) {

                if (sprite.active && (this.__levelMaker || sprite.onScreen(__gameStack.WIDTH, __gameStack.HEIGHT))) {

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

                        var p = sprite.position;

                        var camera = __gameStack.__gameWindow.camera || { pos: { x: 0, y: 0, z: 0 } };

                        var x = p.x,
                            y = p.y;

                        x -= camera.position.x || 0;
                        y -= camera.position.y || 0;
                        //optional animation : gameSize

                        var targetSize = sprite.size || sprite.selected_animation.size;

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

GameStack.ready(function (lib) {

        GameStack.log('GameStack:lib :: ready');
});

/**
 *
 *  class: GameWindow:
 *  args{canvas, ctx, sprites, backgrounds, interactives, forces, update}
 */

var GameWindow = function () {
        function GameWindow() {
                var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
                    canvas = _ref.canvas,
                    ctx = _ref.ctx,
                    sprites = _ref.sprites,
                    backgrounds = _ref.backgrounds,
                    interactives = _ref.interactives,
                    forces = _ref.forces,
                    update = _ref.update,
                    camera = _ref.camera;

                _classCallCheck(this, GameWindow);

                this.sprites = sprites instanceof Array ? sprites : [];

                this.backgrounds = backgrounds instanceof Array ? backgrounds : [];

                this.interactives = interactives instanceof Array ? interactives : [];

                this.forces = forces instanceof Array ? forces : [];

                this.canvas = canvas || false;

                document.body.style.position = "absolute";

                document.body.style.width = "100%";

                document.body.style.height = "100%";

                if (!this.canvas) {
                        console.info('creating new canvas');
                        this.canvas = document.createElement('CANVAS');

                        document.body.append(this.canvas);

                        this.canvas.style.position = 'absolute';

                        this.canvas.style.width = '100%';

                        this.canvas.style.height = '100%';

                        this.canvas.style.background = 'black';

                        var c = this.canvas;

                        this.adjustSize();
                }

                this.ctx = this.canvas.getContext('2d');

                __gameStack.canvas = this.canvas;

                __gameStack.ctx = this.ctx;

                window.onresize = function () {

                        __gameStack.__gameWindow.adjustSize();
                };

                this.camera = new Camera();

                this.camera.target = false;

                __gameStack.camera = this.camera;

                if (typeof update == 'function') {
                        this.onUpdate(update);
                }

                __gameStack.__gameWindow = this;
        }

        _createClass(GameWindow, [{
                key: 'adjustSize',
                value: function adjustSize(w, h) {
                        w = w || this.canvas.clientWidth;

                        h = h || this.canvas.clientHeight;

                        __gameStack.WIDTH = w;

                        __gameStack.HEIGHT = h;

                        this.canvas.width = w;

                        this.canvas.height = h;
                }
        }, {
                key: 'uniques',
                value: function uniques(list) {

                        var listout = [];

                        $Q.each(list, function (ix, item) {

                                if (!listout.indexOf(item.id) >= 0) {

                                        var str = item.name;

                                        listout.push({ "sprite": item });
                                }
                        });

                        return listout;
                }
        }, {
                key: 'setPlayer',
                value: function setPlayer(player) {
                        this.player = player;

                        if (!this.sprites.indexOf(player) >= 0) {
                                this.sprites.push(player);
                        }
                }
        }, {
                key: 'update',
                value: function update() {

                        GameStack.each(this.sprites, function (ix, item) {

                                if (typeof item.update == 'function') {
                                        item.update(item);
                                }

                                if (typeof item.def_update == 'function') {
                                        //  console.log('def_update');

                                        item.def_update(item);
                                }
                        });

                        GameStack.each(this.forces, function (ix, item) {

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
                key: 'loadLevelFile',
                value: function loadLevelFile(filepath, callback) {

                        $.getJSON(filepath, function (data) {

                                callback(false, data);
                        });
                }
        }, {
                key: 'draw',
                value: function draw() {

                        var _gw = this;

                        GameStack.each(this.sprites, function (ix, item) {

                                Canvas.draw(item, _gw.ctx);
                        });
                }
        }]);

        return GameWindow;
}();

;

var TextDisplay = function () {
        function TextDisplay(args) {
                _classCallCheck(this, TextDisplay);

                if (!args) {
                        args = {};
                }

                this.widthFloat = args.width || args.widthFloat || 0.5;

                this.heightFloat = args.height || args.heightFloat || 0.5;

                this.topFloat = args.top || 0.25;

                this.targetTop = this.get_target(this.topFloat, document.body.clientHeight);

                this.leftFloat = args.left || 0.25;

                this.targetLeft = this.get_target(this.leftFloat, document.body.clientWidth);

                this.color = args.color || '#ffffff';

                this.text = args.text || "This is the text";

                this.fontFamily = args.font || args.fontFamily || "GameStack";

                this.fadeIn = args.fadeIn || args.fade || true;

                this.border = "2px inset " + this.color;

                this.fontSize = args.fontSize || "20px";

                this.fromLeft = args.fromLeft || false;

                if (this.fromLeft) {
                        this.leftFloat = 1.5;
                }

                this.fromRight = args.fromRight || false;

                if (this.fromRight) {
                        this.leftFloat = -0.5;
                }

                this.fromTop = args.fromTop || false;

                if (this.fromTop) {
                        this.topFloat = -0.5;
                }

                this.fromBottom = args.fromBottom || false;

                if (this.fromBottom) {
                        this.topFloat = 1.5;
                }

                this.duration = args.duration || 5000;

                this.stay_duration = Math.round(this.duration / 2);

                this.complete = args.complete || function () {};
        }

        _createClass(TextDisplay, [{
                key: 'get_target',
                value: function get_target(float, dimen) {
                        return Math.round(dimen * float) + 'px';
                }
        }, {
                key: 'onComplete',
                value: function onComplete(fun) {

                        this.complete = fun;
                }
        }, {
                key: 'show',
                value: function show() {
                        //create an html element

                        this.domElement = document.createElement('P');

                        this.domElement.style.position = "fixed";

                        this.domElement.style.color = this.color;

                        this.domElement.style.padding = "10px";

                        this.domElement.style.top = Math.round(document.body.clientHeight * this.topFloat) + 'px';

                        this.domElement.style.left = Math.round(document.body.clientWidth * this.leftFloat) + 'px';

                        this.domElement.style.width = Math.round(document.body.clientWidth * this.widthFloat) + 'px';

                        this.domElement.style.height = Math.round(document.body.clientHeight * this.heightFloat) + 'px';

                        this.domElement.style.fontFamily = this.fontFamily;

                        this.domElement.style.fontSize = this.fontSize;

                        this.domElement.style.display = "block";

                        this.domElement.style.textAlign = "center";

                        this.domElement.style.zIndex = "9999";

                        this.domElement.innerText = this.text;

                        this.domElement.textContent = this.text;

                        this.domElement.style.opacity = this.fadeIn ? 0 : 1.0;

                        this.domElement.id = GameStack.create_id();

                        document.body.append(this.domElement);

                        var __inst = this;

                        Velocity(this.domElement, { opacity: 1.0, top: this.targetTop, left: this.targetLeft }, { duration: this.duration, easing: "quadratic" });

                        window.setTimeout(function () {

                                if (__inst.stay_duration >= 1) {
                                        window.setTimeout(function () {

                                                Velocity(__inst.domElement, { opacity: 0, display: 'none' }, { duration: 300, easing: "linear" });

                                                if (typeof __inst.complete == 'function') {
                                                        __inst.complete();
                                                }
                                        }, __inst.stay_duration);
                                }
                        }, this.duration);
                }
        }]);

        return TextDisplay;
}();

/**TODO:complete the following
 *  class: StatDisplay:
 *  class: BarDisplay
 *  class: VideoDisplay
 */

var ItemDisplay //show an item display (image with text/number to the right
= function () {
        function ItemDisplay(_ref2) {
                var font = _ref2.font,
                    fontSize = _ref2.fontSize;

                _classCallCheck(this, ItemDisplay);
        }

        _createClass(ItemDisplay, [{
                key: 'set',
                value: function set(text, image, color, font) {}
        }, {
                key: 'size',
                value: function size() {}
        }, {
                key: 'render',
                value: function render() {}
        }]);

        return ItemDisplay;
}();

var BarDisplay //show a display bar such as health bar
= function () {
        function BarDisplay(_ref3) {
                var font = _ref3.font,
                    fontSize = _ref3.fontSize;

                _classCallCheck(this, BarDisplay);
        }

        _createClass(BarDisplay, [{
                key: 'set',
                value: function set(text, image, color, font) {}
        }, {
                key: 'size',
                value: function size() {}
        }, {
                key: 'render',
                value: function render() {}
        }]);

        return BarDisplay;
}();

var VideoDisplay //show a video
= function () {
        function VideoDisplay(_ref4) {
                var src = _ref4.src,
                    size = _ref4.size;

                _classCallCheck(this, VideoDisplay);

                this.domElement = undefined;

                this.src = src;

                this.size = new Vector3(size.x, size.y, size.z || 0);

                GameStack.log('VideoDisplay():: TODO: create dom element');
        }

        _createClass(VideoDisplay, [{
                key: 'play',
                value: function play() {}
        }]);

        return VideoDisplay;
}();

;
/**
 * Animation({name:string,description:string,frames:[],image:GameImage(),src:string,domElement:Image(),type:string})
 * [See Live Demo with Usage-Example]{@link http://www.google.com}
 * @returns {Animation} object of Animation()
 * */

var Animation = function () {
        function Animation(args) {
                _classCallCheck(this, Animation);

                args = args || {};

                var _anime = this;

                this.name = this.getArg(args, 'name', '_blank'), this.description = this.getArg(args, 'description', '_blank');

                this.frames = this.getArg(args, 'frames', []);

                this.image = new GameImage(__gameStack.getArg(args, 'src', __gameStack.getArg(args, 'image', false)));

                this.src = this.image.domElement.src;

                this.domElement = this.image.domElement;

                this.type = this.getArg(args, 'type', 'basic');

                this.delay = this.getArg(args, 'delay', 0);

                this.cix = 0;

                this.frameSize = this.getArg(args, 'frameSize', new Vector3(44, 44, 0));

                this.frameBounds = this.getArg(args, 'frameBounds', new VectorFrameBounds(new Vector3(0, 0, 0), new Vector3(0, 0, 0), new Vector3(0, 0, 0)));

                this.frameOffset = this.getArg(args, 'frameOffset', new Vector3(0, 0, 0));

                this.extras = this.getArg(args, 'extras', false);

                if ((typeof args === 'undefined' ? 'undefined' : _typeof(args)) == 'object' && args.frameBounds && args.frameSize) {
                        this.apply2DFrames(args.parent || {});
                };

                this.flipX = this.getArg(args, 'flipX', false);

                this.priority = this.getArg(args, 'priority', 0);

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

                                if (this.hang) {
                                        this.cix = this.cix + 1;

                                        if (this.cix > this.frames.length - 1) {
                                                this.cix = this.frames.length - 1;
                                        }
                                } else {

                                        if (this.cix == 0 && this.extras) {
                                                this.extras.call(); //fire any extras attached
                                        }

                                        if (this.cix >= this.frames.length - 1 && typeof this.complete == 'function') {
                                                this.complete(this);
                                        }

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
  * Camera : has simple x, y, z, position / Vector, follows a specific sprite
  *
  * *TODO : implement camera class
  */

var Camera = function Camera(args) {
        _classCallCheck(this, Camera);

        this.position = new Vector3(0, 0, 0);
};

;

var Extras = function () {
        function Extras(args) {
                _classCallCheck(this, Extras);

                this.items = args || [];

                if (_typeof(this.items) == 'object') {
                        this.items = [this.items]; //assert array from single object
                }

                var allowedTypes = ['Sound', 'GameText', 'StatDisplay', 'Menu'];

                if (!(this.items instanceof Array)) {

                        return console.error('Quick2d.Extras.call(), needs array argument');
                }
        }

        _createClass(Extras, [{
                key: 'call',
                value: function call() {

                        var items = this.items;

                        //a callable item can be one-time executed: it will have any of the following functions attached

                        for (var x = 0; x < items.length; x++) {
                                var item = items[x];

                                if (typeof item.play == 'function') {
                                        item.play();
                                }

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
                        }
                }
        }]);

        return Extras;
}();

;
/**
 * Force()
 *
 * <ul >
 *  <li> a 'physics' object
 *  <li> easily instantiate physical behaviors, applied to specific groups of objects
 * </ul>
 *
 * [See Live Demos with Suggested Usage-Examples]{@link http://www.google.com}
 * @returns {Force} object of Force()
 * */

var GravityForce = function () {
        function GravityForce(args) {
                _classCallCheck(this, GravityForce);

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

        _createClass(GravityForce, [{
                key: 'getArg',
                value: function getArg(args, key, fallback) {

                        if (args.hasOwnProperty(key)) {

                                return args[key];
                        } else {
                                return fallback;
                        }
                }
        }, {
                key: 'update',
                value: function update() {

                        var subjects = this.subjects;

                        var origin = this.origin || {};

                        var massObjects = this.massObjects;

                        var accel = this.accel || {};

                        var max = this.max || {};

                        __gameStack.each(subjects, function (ix, itemx) {

                                itemx.accelY(accel, max);

                                itemx.__inAir = true;

                                __gameStack.each(massObjects, function (iy, itemy) {

                                        itemx.collide_stop(itemy);
                                });
                        });
                }
        }]);

        return GravityForce;
}();

;

var Force = GravityForce;

;

/**
 * GamepadAdapter()
 *
 * <ul >
 *  <li> supports game-controller input for web-games
 *  <li> accesses live gamepad input from the HTML5 Gamepad Api
 * </ul>
 *
 * [See Live Demos with Suggested Usage-Examples]{@link http://www.google.com}
 * @returns {GamepadAdapter} object of GamepadAdapter()
 * */

var GamepadAdapter = function () {
        function GamepadAdapter() {
                _classCallCheck(this, GamepadAdapter);

                this.__gamepads = [];

                this.intervals = [];

                var controller_stack = this;

                var _gpinst = this;

                this.events = [];

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

                        gp.extendFunc = function (f1, f2) {

                                var fc = f2;

                                return function (x, y) {

                                        f2(x, y);

                                        f1(x, y);
                                };
                        };

                        gp.on = function (key, callback) {

                                if (this[key] && key !== "on") {

                                        var current_cb = typeof this[key] == 'function' ? this[key] : function (x, y) {};

                                        this[key] = this.extendFunc(callback, current_cb);
                                } else if (key.indexOf('button') >= 0 && key.indexOf('_') >= 0) {
                                        var parts = key.split('_');

                                        var number;

                                        try {

                                                number = parseInt(parts[1]);

                                                var current_cb = typeof this['buttons'][number] == 'function' ? this['buttons'][number] : function (x, y) {};

                                                this['buttons'][number] = this.extendFunc(callback, current_cb);
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

                        if (gpix >= this.__gamepads.length) {

                                this.__gamepads.push(this.GamepadEvents({}));
                        }

                        this.__gamepads[gpix].on(key, callback);
                }
        }]);

        return GamepadAdapter;
}();

;

if (!__gameInstance.GamepadAdapter) {
        __gameInstance.GamepadAdapter = new GamepadAdapter();

        __gameInstance.gamepads = [];

        GameStack.GamepadAdapter = __gameInstance.GamepadAdapter;

        GameStack.gamepads = __gameInstance.gamepads;

        GameStack.GamepadAdapter.on('stick_left', 0, function (x, y) {

                console.log('Gamepad stick left');
        });

        GameStack.GamepadAdapter.on('button_0', 0, function (x, y) {

                console.log('Gamepad button 0');
        });

        GameStack.GamepadAdapter.on('button_1', 0, function (x, y) {

                console.log('Gamepad button 1');
        });

        GameStack.GamepadAdapter.on('button_2', 0, function (x, y) {

                console.log('Gamepad button 2');
        });

        GameStack.GamepadAdapter.on('button_3', 0, function (x, y) {

                console.log('Gamepad button 3');
        });

        // __gameInstance.gamepads.push(gamepad);
};

;

var GravityAction = function GravityAction() {
        _classCallCheck(this, GravityAction);
};

var Graviton = function Graviton(args) {
        _classCallCheck(this, Graviton);
};

var GravitationalRay = function GravitationalRay(args) {
        _classCallCheck(this, GravitationalRay);
};

;

var Motion = function () {
        function Motion(args) {
                _classCallCheck(this, Motion);

                this.getArg = $Q.getArg;

                this.distance = this.getArg(args, 'distance', this.getArg(args, 'distances', false));

                this.curvesList = this.curvesObject(); //Tween.Easing

                this.parent_id = args.parent_id || args.object_id || "__blank"; //The parent object

                this.curve = this.getArg(args, 'curve', TWEEN.Easing.Quadratic.InOut);

                this.targetRotation = this.getArg(args, 'targetRotation', 0);

                this.name = this.getArg(args, 'name', "__");

                this.description = this.getArg(args, 'description', false);

                this.curveString = this.getCurveString(); //store a string key for the Tween.Easing || 'curve'

                this.setCurve(this.curveString);

                this.line = this.getArg(args, 'line', false);

                this.duration = this.getArg(args, 'duration', 500);

                this.delay = this.getArg(args, 'delay', 0);

                this.duration = this.getArg(args, 'duration', false);
        }

        _createClass(Motion, [{
                key: 'curvesObject',
                value: function curvesObject() {

                        var c = [];

                        GameStack.each(TWEEN.Easing, function (ix, easing) {

                                GameStack.each(easing, function (iy, easeType) {

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

var Rectangle = function Rectangle(min, max) {
        _classCallCheck(this, Rectangle);

        this.min = min;
        this.max = max;
};

;

var VectorBounds = Rectangle;

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

var Circle = function Circle(args) {
        _classCallCheck(this, Circle);

        this.position = this.getArg(args, 'position', new Vector3(0, 0, 0));

        this.radius = this.getArgs(args, 'radius', 100);
};

; /**
  * Sprite({name:string, description:string, size:Vector3, position:Vector3})
  *
  * <ul >
  *  <li> an Object-container for multiple animations
  *  <li> supports a variety of game objects and logic
  * </ul>
  *
  * [See Live Demos with Suggested Usage-Examples]{@link http://www.google.com}
  * @returns {Sprite} object of Sprite()
  * */

var Sprite = function () {
        function Sprite(args) {
                _classCallCheck(this, Sprite);

                if (!args) {
                        args = {};
                }

                this.active = true; //active sprites are visible

                this.name = args.name || "__";

                this.description = args.description || "__";

                this.__initializers = __gameStack.getArg(args, '__initializers', []);

                var _spr = this;

                Quazar.each(args, function (ix, item) {
                        //apply all args

                        if (ix !== 'parent') {
                                _spr[ix] = item;
                        }
                });

                this.type = __gameStack.getArg(args, 'type', 'basic');

                this.animations = __gameStack.getArg(args, 'animations', []);

                this.motions = __gameStack.getArg(args, 'motions', []);

                var __inst = this;

                this.id = __gameStack.getArg(args, 'id', this.create_id());

                this.sounds = __gameStack.getArg(args, 'sounds', []);

                this.image = new GameImage(__gameStack.getArg(args, 'src', __gameStack.getArg(args, 'image', false)));

                this.size = __gameStack.getArg(args, 'size', new Vector3(100, 100));

                this.position = __gameStack.getArg(args, 'position', new Vector3(0, 0, 0));

                this.collision_bounds = __gameStack.getArg(args, 'collision_bounds', new VectorBounds(new Vector3(0, 0, 0), new Vector3(0, 0, 0)));

                this.rotation = __gameStack.getArg(args, 'rotation', new Vector3(0, 0, 0));

                this.selected_animation = {};

                this.speed = __gameStack.getArg(args, 'speed', new Vector3(0, 0, 0));

                this.acceleration = __gameStack.getArg(args, 'acceleration', new Vector3(0, 0, 0));

                this.rot_speed = __gameStack.getArg(args, 'rot_speed', new Vector3(0, 0, 0));

                this.rot_accel = __gameStack.getArg(args, 'rot_accel', new Vector3(0, 0, 0));

                //Apply / instantiate Sound(), Motion(), and Animation() args...

                $Q.each(this.sounds, function (ix, item) {

                        __inst.sounds[ix] = new Sound(item);
                });

                $Q.each(this.motions, function (ix, item) {

                        __inst.motions[ix] = new Motion(item);
                });

                $Q.each(this.animations, function (ix, item) {

                        __inst.animations[ix] = new Animation(item);
                });

                //Apply initializers:

                $Q.each(this.__initializers, function (ix, item) {

                        __inst.onInit(item);
                });

                if (args.selected_animation) {
                        this.selected_animation = new Animation(args.selected_animation);
                } else {

                        this.setAnimation(this.animations[0] || new Animation({

                                image: this.image,

                                frameSize: new Vector3(this.image.domElement.width, this.image.domElement.height),

                                frameBounds: new VectorFrameBounds(new Vector3(), new Vector3())

                        }));
                }
        }

        /**
         * This function initializes sprites when necessary. Called automatically on GameStack.add(mySprite);
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

                                var f = Quazar.options.SpriteInitializers[keys[0]][keys[1]];

                                if (typeof f == 'function') {
                                        alert('found func');

                                        var __inst = this;

                                        var f_init = this.init;

                                        this.init = function (sprite) {

                                                f_init(sprite);

                                                f(sprite);
                                        };
                                }
                        } else if (typeof fun == 'function') {

                                console.log('extending init:');

                                var f_init = this.init;

                                this.init = function (sprite) {

                                        f_init(sprite);

                                        fun(sprite);
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
                 * This function gets the 'id' of the object()
                 * <ul>
                 *     <li>See usage links</li>
                 * </ul>
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
                 * This function creates the 'id' of the Sprite()
                 * <ul>
                 *     <li>Called automatically on constructor()</li>
                 * </ul>
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
                 * <ul>
                 *     <li></li>
                 * </ul>
                 * @function
                 * @memberof Sprite
                 **********/

        }, {
                key: 'setSize',
                value: function setSize(size) {
                        this.size = new Vector3(size.x, size.y, size.z);

                        this.selected_animation.size = new Vector3(size.x, size.y, size.z);
                }
        }, {
                key: 'setPos',
                value: function setPos(pos) {
                        this.position = new Vector3(pos.x, pos.y, pos.z || 0);
                }
        }, {
                key: 'getAbsolutePosition',
                value: function getAbsolutePosition(offset) {

                        if (this.position instanceof Vector3) {} else {
                                this.position = new Vector3(this.position);
                        }

                        return this.position.add(offset);
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
                 * This function sets the 'selected_animation' property of the Sprite()
                 * <ul>
                 *     <li></li>
                 * </ul>
                 * @function
                 * @memberof Sprite
                 * @params {Animation}
                 **********/

        }, {
                key: 'setAnimation',
                value: function setAnimation(anime) {

                        if (anime instanceof Animation && this.animations.indexOf(anime) < 0) {
                                this.animations.push(anime);
                        }

                        this.selected_animation = anime;

                        Quazar.log('declared default animation');

                        return this;
                }

                /*****************************
                 *  defaultAnimation(anime)
                 *  -set the default_animation of this sprite
                 *  -TODO : determine whether to implement a default animatio OR simply use setAnimation() plus selected_animation
                 ***************************/

        }, {
                key: 'defaultAnimation',
                value: function defaultAnimation(anime) {

                        this.animations['default'] = anime;

                        Quazar.log('declared default animation');

                        return this;
                }

                /*****************************
                 * onScreen :
                 * -returns boolean
                 * -takes and requires w, h of screen
                 * -detects if object is on the screen
                 ***************************/

                /**
                 * This function detects whether the Sprite() is onScreen, according to its size and position on the GameStack.canvas
                 * <ul>
                 *     <li></li>
                 * </ul>
                 * @function
                 * @memberof Sprite
                 **********/

        }, {
                key: 'onScreen',
                value: function onScreen(w, h) {

                        w = w || __gameStack.WIDTH;

                        h = h || __gameStack.HEIGHT;

                        var camera = __gameStack.__gameWindow.camera || new Vector3(0, 0, 0);

                        var p = new Vector3(this.position.x - camera.position.x, this.position.y - camera.position.y, this.position.z - camera.position.z);

                        return p.x - this.size.x >= -10000 && p.x < 10000 && p.y + this.size.y >= -1000 && p.y < 10000;
                }

                /*****************************
                 * Updates
                 ***************************/

                /*****************************
                 * update()
                 * -starts empty:: is used by Quick2d.js as the main sprite update
                 ***************************/

                /**
                 * This function is the recursive update() for the Sprite()
                 *
                 * <ul>
                 *     <li>*Called automatically by the GameStack library</li>
                 * </ul>
                 * @function
                 * @memberof Sprite
                 * @params {sprite}
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
                 *
                 * <ul>
                 *     <li>Normally no need to use this. It is called automatically by the GameStack init()</li>
                 *     <li>*Allows properties of Sprite().speed, Sprite().rot_speed, and Sprite().accel, Sprite().rot_accel to control speed and acceleration.</li>
                 * </ul>
                 * @function
                 * @memberof Sprite
                 * @params {sprite}
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
                 * This function is for persistence of data and behavior for the Sprite()
                 *
                 * <ul>
                 *     <li>a function may be resolved from keyString args from within the obj arg.</li>
                 *     <li>Callback is then triggered on this function</li>
                 *     <li>Used by GameStack to restore the behavioral options of Sprites from GameStack.options.SpriteInitializers</li>
                 * </ul>
                 * @function
                 * @memberof Sprite
                 * @params {keyString1, keyString2, obj, callback}
                 **********/

        }, {
                key: 'resolveFunctionFromDoubleKeys',
                value: function resolveFunctionFromDoubleKeys(keyString1, keyString2, obj, callback) {

                        callback(typeof obj[keyString1][keyString2] == 'function' ? obj[keyString1][keyString2] : {});
                }

                /**
                 * This function will extend 2nd function arg with 1st function arg, and return the combined function()
                 *
                 * <ul>
                 *     <li>Applied in GameStack for extending functions when onInit(fun) is called</li>
                 * </ul>
                 * @function
                 * @memberof Sprite
                 * @params {fun, extendedFunc}
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
                 * This function will extend the update of a Sprite()
                 *
                 * <ul>
                 *     <li>Use this function to apply multiple update-calls for an object</li>
                 * </ul>
                 * @function
                 * @memberof Sprite
                 * @params {fun}
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

                /*****************************
                 *  collidesRectangular(sprite)
                 * -args: 1 sprite object
                 * -returns boolean of true on collision or false on no-collision
                 * -TODO : add options object with highlight=true||false,
                 * -TODO:allow stateffects, graphiceffects into the collision function
                 ***************************/

                /**
                 * Get the boolean(T || F) results of a Collision between two Sprites(), based on their position Vector3's and Size()
                 * <ul>
                 *     <li>A rectangular style position</li>
                 *      <li>Takes another sprite as argument</li>
                 *       <li>Returns basic true || false during runtime</li>
                 * </ul>
                 * @function
                 * @memberof Sprite
                 * @params {sprite}
                 **********/

        }, {
                key: 'collidesRectangular',
                value: function collidesRectangular(sprite, padding) {

                        return Quazar.Collision.spriteRectanglesCollide(this, sprite, padding);
                }

                /*****************************
                 *  collidesByPixels(sprite)
                 *  -TODO : this function is incomplete
                 *  -process collision according to the non-transparent pixels of the sprite::
                 *  -provides a more realistic collision than basic rectangular
                 ***************************/

                /**
                 * Get the boolean(T || F) results of a Collision between two Sprites(), based on non-transparent pixels
                 * <ul>
                 *     <li>Detects collision or overlap of any non-transparent pixels</li>
                 *     <li>*TODO: This function is not-yet implemented in GameStack</li>
                 * </ul>
                 * @function
                 * @memberof Sprite
                 * @params {sprite}
                 **********/

        }, {
                key: 'collidesByPixels',
                value: function collidesByPixels(sprite) {

                        return console.info("TODO: Sprite().collidesByPixels(sprite): finish this function");
                }

                /*****************************
                 *  shoot(sprite)
                 *  -fire a shot from the sprite:: as in a firing gun or spaceship
                 *  -takes options{} for number of shots anglePerShot etc...
                 *  -TODO: complete and test this code
                 ***************************/

                /**
                 * Sprites() fires a projectile object
                 * <ul>
                 *     <li>Easy instantiator for bullets and propelled objects in GameStack</li>
                 *     <li>*TODO: This function is not-yet implemented in GameStack</li>
                 * </ul>
                 * @function
                 * @memberof Sprite
                 * @params {options} *numerous args
                 **********/

        }, {
                key: 'shoot',
                value: function shoot(options) {
                        //character shoots an animation

                        this.prep_key = 'shoot';

                        var animation = options.bullet || options.animation || new Animation();

                        var speed = options.speed || 1;

                        var position = options.position || new Vector3(0, 0, 0);

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
                        }
                }

                /**
                 * Creates a subsprite
                 * <ul>
                 *     <li>Use this function to anchor one sprite to another.</li>
                 * </ul>
                 * @function
                 * @memberof Sprite
                 * @params {options} object
                 * @params {options.animation} Animation()
                 * @params {options.position} Position()
                 * @params {options.offset} Position()
                 * @params {options.size} Size()
                 **********/

        }, {
                key: 'subsprite',
                value: function subsprite(options) {

                        var animation = options.animation || new Animation();

                        var position = options.position || this.position;

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

                                var __parent = this;

                                return subsprite;
                        }
                }

                /**
                 * Simple call to animate the sprite
                 * <ul>
                 *     <li>Calls animate on the Sprite.selected_animation</li>
                 *     <li>*TODO: This function is not-yet implemented in GameStack</li>
                 * </ul>
                 * @function
                 * @memberof Sprite
                 * @params {animation}
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
                 * Overwrites the complete() function of the selected animation
                 * <ul>
                 *     <li>Use this function when a change must be made, but not until the current animation is complete</li>
                 * </ul>
                 * @function
                 * @memberof Sprite
                 * @params {fun} function
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
                 * This function accelerates the Sprite() on the y-axis
                   * @function
                 * @memberof Sprite
                 * @params {accel, max}
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
                 * This function accelerates the Sprite() on the y-axis
                   * @function
                 * @memberof Sprite
                 * @params {accel, max}
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
                 * This function accelerates the Sprite() on any or all axis, depending on arguments
                   * @function
                 * @memberof Sprite
                 * @params {prop, key, accel, max}
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
                 * This function decelerates the Sprite() on any or all axis, depending on arguments
                   * @function
                 * @memberof Sprite
                 * @params {prop, key, accel, max}
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
                 *  decelX
                 *  -decelerate on the X axis
                 *  -args: 1 float:amt
                 ***************************/

        }, {
                key: 'deccelX',
                value: function deccelX(rate) {
                        if ((typeof rate === 'undefined' ? 'undefined' : _typeof(rate)) == 'object') {

                                rate = rate.rate;
                        }

                        rate = Math.abs(rate);

                        if (Math.abs(this.speed['x']) <= rate) {
                                this.speed['x'] = 0;
                        }

                        if (this.speed['x'] > 0) {
                                this.speed['x'] -= rate;
                        } else if (this.speed['x'] < 0) {
                                this.speed['x'] += rate;
                        } else {

                                this.speed['x'] = 0;
                        }
                }

                /*****************************
                 *  decelY
                 *  -decelerate on the Y axis
                 *  -args: 1 float:amt
                 ***************************/

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

                /*****************************
                 *  collide_stop(item)
                 *  -both collide and stop on the object, when falling on Y axis::
                 *  -sets the special property: __falling to false on stop :: helps to control Sprite() state
                 *  -TODO : rename to fallstop || something that resembles a function strictly on Y-Axis
                 ***************************/

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
        }, {
                key: 'center',
                value: function center() {
                        return new Vector3(this.position.x + this.size.x / 2, this.position.y + this.size.y / 2);
                }

                /*************
                 * #BE CAREFUL
                 * -with this function :: change sensitive / tricky / 4 way collision
                 * *************/

        }, {
                key: 'overlap_x',
                value: function overlap_x(item, padding) {
                        if (!padding) {
                                padding = 0;
                        }

                        var paddingX = padding * this.size.x,
                            paddingY = padding * this.size.y,
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

        }, {
                key: 'overlap_y',
                value: function overlap_y(item, padding) {
                        if (!padding) {
                                padding = 0;
                        }

                        var paddingX = padding * this.size.x,
                            paddingY = padding * this.size.y,
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

                                var distX = Math.abs(this.size.x / 2 + item.size.x / 2);

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

        }, {
                key: 'collide_stop',
                value: function collide_stop(item) {

                        // collide top


                        if (this.id == item.id) {
                                return false;
                        }

                        if (this.collidesRectangular(item)) {

                                var diff = this.center().sub(item.center());

                                if (this.overlap_x(item, 0.3) && Math.abs(diff.x) < Math.abs(diff.y)) {

                                        var apart = false;

                                        var ct = 10000;

                                        while (!apart && ct > 0) {

                                                ct--;

                                                var diffY = this.center().sub(item.center()).y;

                                                var distY = Math.abs(this.size.y / 2 + item.size.y / 2);

                                                if (Math.abs(diffY) < distY) {

                                                        this.position.y -= diffY > 0 ? -1 : 1;
                                                } else {

                                                        if (diffY < 0) {
                                                                this.__inAir = false;
                                                        };

                                                        apart = true;
                                                }
                                        }
                                }
                                if (this.overlap_y(item, 0.3)) {

                                        this.collide_stop_x(item);
                                }
                        }
                }
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

                /**
                 * This function restores a Sprite() from json file
                   * @function
                 * @memberof Sprite
                 * @params {file_path}
                 **********/

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

var SpriteInitializersOptions = {

        ControllerStickMotion: {

                __args: {},

                player_move_x: function player_move_x(sprite) {

                        alert('applying initializer');

                        console.log('side_scroll_player_run:init-ing');

                        var __lib = Quazar || Quick2d;

                        Quazar.GamepadAdapter.on('stick_left', 0, function (x, y) {

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

                        var __lib = Quazar || Quick2d;

                        Quazar.GamepadAdapter.on('stick_left', 0, function (x, y) {

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

                        alert('applying initializer');

                        var __lib = Quazar || Quick2d;

                        Quazar.GamepadAdapter.on('stick_left', 0, function (x, y) {

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

Quazar.options = Quazar.options || {};

Quazar.options.SpriteInitializers = SpriteInitializersOptions;;

/**
 * Vector3({x:number,y:number,z:number,r:number})
 *
 * required arguments: x, y
 * optional arguments: z, r
 *
 * [See Live Demo with Usage-Example]{@link http://www.google.com}
 * @returns {Vector3} object of Vector3()
 *
 * Vector objects are treated alike in GameStack.js, with Vector() and Vector2() equivalent to Vector3()
 * Other class names synonymous with Vector() are Pos(), Size(), Position(), Rotation()
 * */

var Vector3 = function () {
        function Vector3(x, y, z, r) {
                _classCallCheck(this, Vector3);

                if ((typeof x === 'undefined' ? 'undefined' : _typeof(x)) == 'object' && x.x && x.y) //optionally pass vector3
                        {
                                this.x = x.x;
                                this.y = x.y;
                                this.z = x.z || 0;

                                return this;
                        }

                this.x = x;
                this.y = y;
                this.z = z;
                this.r = r;
        }

        _createClass(Vector3, [{
                key: 'sub',
                value: function sub(v) {
                        if (typeof v == 'number') {
                                v = { x: v, y: v, z: v };
                        };

                        return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
                }
        }, {
                key: 'add',
                value: function add(v) {
                        if (typeof v == 'number') {
                                v = { x: v, y: v, z: v };
                        };

                        return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
                }
        }, {
                key: 'mult',
                value: function mult(v) {
                        if (typeof v == 'number') {
                                v = { x: v, y: v, z: v };
                        };

                        return new Vector3(this.x * v.x, this.y * v.y, this.z * v.z);
                }
        }, {
                key: 'div',
                value: function div(v) {
                        if (typeof v == 'number') {
                                v = { x: v, y: v, z: v };
                        };

                        return new Vector3(this.x / v.x, this.y / v.y, this.z / v.z);
                }
        }, {
                key: 'round',
                value: function round() {
                        return new Vector3(Math.round(this.x), Math.round(this.y), Math.round(this.z));
                }
        }, {
                key: 'floor',
                value: function floor() {
                        return new Vector3(Math.floor(this.x), Math.floor(this.y), Math.floor(this.z));
                }
        }, {
                key: 'ceil',
                value: function ceil() {
                        return new Vector3(Math.ceil(this.x), Math.ceil(this.y), Math.ceil(this.z));
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

                }
        }]);

        return Vector3;
}();

;

var Pos = Vector3,
    Size = Vector3,
    Position = Vector3,
    Vector2 = Vector3,
    Vector = Vector3,
    Rotation = Vector3;

//The above are a list of synonymous expressions for Vector3. All of these do the same thing in this library (store x,y,z values)
; /**
  * Created by The Blakes on 04-13-2017
  *
  */

var InterfaceCallback = function () {
        function InterfaceCallback(_ref5) {
                var name = _ref5.name,
                    description = _ref5.description,
                    callback = _ref5.callback;

                _classCallCheck(this, InterfaceCallback);

                this.name = name;

                this.description = description;

                this.callback = callback || function () {
                        console.info('The call was empty');
                };
        }

        _createClass(InterfaceCallback, [{
                key: 'run',
                value: function run() {

                        this.callback();
                }
        }]);

        return InterfaceCallback;
}();

var SpeechInterfaceStructure = function SpeechInterfaceStructure(_ref6) {
        var name = _ref6.name,
            description = _ref6.description;

        _classCallCheck(this, SpeechInterfaceStructure);

        this.name = name || "Program helper.";

        this.description = description || "An interface for the game-builder program.";

        this.options_structure = {

                scroll: function scroll(x, y) {}, //simple scroll controller


                create_object_resource: {

                        constructors: Quazar.IF.__allConstructors(),

                        selectedType: false,

                        selectByName: Quazar.IF.selectByName,

                        apply_speech_value: Quazar.IF.applySpeechValue()

                }, //apply each class in the program, with means of creating / instantiating

                save_object_resource: {

                        selected_object: false,

                        confirm: Quazar.IF.confirmation()

                }, //apply each class in the program, with means of saving

                retrieve_object_resource: {}, //retrieve

                browse_object_resources: {}, //browsing

                search_object_resources: {}, //searching

                delete_object_resources: {}, //delete

                apply_value: {} //apply a value to an object resource

        };
};
//# sourceMappingURL=GameStack.js.map
