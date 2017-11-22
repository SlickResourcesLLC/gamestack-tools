'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**@author
Jordan Edward Blake
 * */

/**@copyright

 Copyright 2016

 **/

/**
 * Object, instance of GamestackLibrary() : references Gamestack classes
 * attaches to window object || module.exports (when loading via require)
 * */

var Gamestack = {};

var GameStackLibrary = function GameStackLibrary() {

        var lib = {

                DEBUG: false,

                gui_mode: true,

                __gameWindow: {},

                __sprites: [],

                __animations: [],

                spriteTypes: [],

                systemSpriteTypes: ['player', 'enemy', 'background', 'interactive'],

                systemAnimationTypes: {

                        attack_0: "System.attack_0",

                        attack_1: "System.attack_1",

                        attack_2: "System.attack_2",

                        attack_3: "System.attack_3",

                        attack_4: "System.attack_4",

                        defend_0: "System.defend_0",

                        defend_1: "System.defend_1",

                        defend_2: "System.defend_2",

                        defend_3: "System.defend_3",

                        defend_4: "System.defend_4",

                        heal_0: "System.heal_0",

                        heal_1: "System.heal_1",

                        heal_2: "System.heal_2",

                        heal_3: "System.heal_3",

                        heal_4: "System.heal_4"

                },

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

                getObjectById: function getObjectById(id) {

                        for (var x = 0; x < this.all_objects.length; x++) {
                                if (this.all_objects[x].id == id) {

                                        return this.all_objects[x];
                                }
                        }
                },


                getAllCallables: function getAllCallables() {
                        //every unique sound, animation, tweenmotion in the game

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
                        spriteRectanglesCollide: function spriteRectanglesCollide(obj1, obj2) {

                                var paddingX = Math.round(obj1.padding.x * obj1.size.x),
                                    paddingY = Math.round(obj1.padding.y * obj1.size.y),
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

                ExtendEvents: function ExtendEvents(extendedObject, extendedKey, extendor, extendorKey) {
                        var evtLink = new GSEventLink(extendedObject, extendedKey, extendor, extendorKey);

                        this.all_objects.push(new GSEventLink(extendedObject, extendedKey, extendor, extendorKey));

                        var parent = extendedObject;

                        // console.log(parent);

                        if (parent) {
                                console.log('Gamestack:EXTENDING EVENTS:' + extendedKey + ":" + extendorKey);

                                if (parent.onRun) //Any extendable object has an onRun ... OR
                                        {
                                                parent.onRun(extendor, extendorKey);
                                        }
                                if (parent.onComplete) //object has an onComplete
                                        {
                                                parent.onComplete(extendor, extendorKey);
                                        }
                        }
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

                reload: function reload() {
                        this.callReady();
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

                        this.__running = true;
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

                        var __inst = this;

                        function isWindow() {
                                return __inst.hasOwnProperty('__gameWindow') && __inst.__gameWindow instanceof GameWindow;
                        };

                        if (isWindow()) {

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
                        }

                        if (obj instanceof GSEvent) {

                                if (__gameStack.__running) {

                                        return console.error('Events can only be added before Gamstack.animate() is called::aka before the main update / loop begins');
                                } else {

                                        obj.apply();
                                }
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

                getById: function getById(id) {

                        for (var x in this.all_objects) {

                                if (this.all_objects[x].id == id) {
                                        return this.all_objects[x];
                                }
                        }
                },

                select: function select(constructor_name, name, type /*ignoring spaces and CAPS/CASE on type match*/) {

                        var objects_out = [];

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

var GamestackApi = {
        get: function get() {},

        post: function post(object) {
                //TODO decycle the object before saving

                if (!object.id) {
                        object.id = Gamestack.create_id();
                }

                var name = object.name,
                    type = object.constructor.name,
                    contents = jstr(object),
                    id = object.id;
        }

};

/**
 * Simple Sound object:: implements Jquery: Audio()
 * @param   {string} src : source path / name of the targeted sound-file

 * @returns {Sound} object of Sound()
 * */

var Sound = function () {
        function Sound(src, data) {
                _classCallCheck(this, Sound);

                if ((typeof src === 'undefined' ? 'undefined' : _typeof(src)) == 'object') {

                        this.sound = document.createElement('audio');

                        this.sound.src = src.src;

                        this.src = src.src;
                } else if (typeof src == 'string') {

                        this.sound = document.createElement('audio');

                        this.sound.src = src;

                        this.src = src;
                }

                if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) == 'object') {
                        for (var x in data) {
                                if (x !== 'sound') {
                                        this[x] = data[x];
                                }
                        }
                }

                this.onLoad = this.onLoad || function () {};

                if (typeof this.onLoad == 'function') {

                        this.onLoad(this.sound);
                }
        }

        _createClass(Sound, [{
                key: 'volume',
                value: function volume(val) {

                        this.sound.volume = val;

                        return this;
                }
        }, {
                key: 'play',
                value: function play() {
                        if (_typeof(this.sound) == 'object' && typeof this.sound.play == 'function') {

                                this.sound.play();
                        }
                }
        }]);

        return Sound;
}();

var SoundList = function () {
        function SoundList(list) {
                _classCallCheck(this, SoundList);

                this.cix = 1;

                this.sounds = [];

                if (list instanceof Array) {
                        for (var x in list) {
                                if (list[x].src) {
                                        this.sounds.push(new Sound(list[x].src, list[x]));
                                } else if (typeof list[x] == 'string') {
                                        this.sounds.push(new Sound(list[x]));
                                }
                        }
                }
        }

        _createClass(SoundList, [{
                key: 'add',
                value: function add(src, name) {
                        if ((typeof src === 'undefined' ? 'undefined' : _typeof(src)) == 'object' && src.src) {
                                this.sounds.push(new Sound(src.src, src));
                        } else if (typeof src == 'string') {
                                var data = {};

                                if (name) {
                                        data.name = name;
                                }

                                this.sounds.push(new Sound(list[x], data));
                        }
                }
        }, {
                key: 'playNext',
                value: function playNext() {
                        this.sounds[this.cix % this.sounds.length].play();

                        this.cix += 1;
                }
        }, {
                key: 'play',
                value: function play() {

                        this.sounds[this.cix % this.sounds.length].play();

                        this.cix += 1;
                }
        }]);

        return SoundList;
}();

/**
 * GameImage
 *
 * Simple GameImage
 * @param   {string} src source name/path of the targeted image-file

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

//GameStack: a main / game lib object::
//TODO: fix the following set of mixed references:: only need to refer to (1) lib-object-instance


var GameStack = new GameStackLibrary();
Gamestack = GameStack;
var __gameStack = GameStack;
var Quick2d = GameStack; //Exposing 'Quick2d' as synonymous reference to Gamestack
var __gameInstance = Gamestack;

Gamestack.Sound = Sound;
Gamestack.GameImage = GameImage;

if (typeof module !== 'undefined' && module.exports) {

        //This library is being instaniated via require() aka node.js require or similar library loader
        module.exports = Gamestack;
} else {}

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

Gamestack.jstr = jstr;

/**********
 * $Q : Selector Function
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

                        Gamestack.GamepadAdapter.on(evt_profile.evt_key, 0, function (x, y) {

                                callback(x, y);
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
                                    key = criterion || evt_profile.evt_key;

                                if (key.indexOf('[') >= 0 || key.indexOf(']') >= 0) {
                                        key = $Q.between('[', ']', key);
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

                                console.info('Gamestack:Processing condition with:' + condition);

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

                                                console.log('Q():Detected parts in selector:' + jstr(cparts));

                                                __targetName = cleanSelectorString(cparts[1]);

                                                break;

                                        case "type":

                                                console.log('Q():Detected parts in selector:' + jstr(cparts));

                                                __targetType = cleanSelectorString(cparts[1]);

                                                break;

                                }
                        }

                        if (cparts.length >= 4) {

                                cparts[2] = cparts[2].replace(",", "");

                                switch (cparts[2].toLowerCase()) {

                                        case "name":

                                                //get all objects according to name=name

                                                console.log('Q():Detected parts in selector:' + jstr(cparts));

                                                __targetName = cleanSelectorString(cparts[3]);

                                                break;

                                        case "type":

                                                console.log('Q():Detected parts in selector:' + jstr(cparts));

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
        //leftover method of hand-testing
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

Gamestack.$Q = $Q;

Gamestack.query = $Q;

/********************
 * GameStack.InputEvents
 * -Various PC Input Events
 ********************/

Gamestack.InputEvents = { //PC input events
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

Gamestack.ready(function (lib) {

        Gamestack.log('GameStack:lib :: ready');
});

/**
 * Instantiates a GameWindow object
 * @param   {Object} args : the object of arguments
 * @param   {Object} args.canvas : the canvas object of the window: GameWindow constructor will create one if not supplied in args
 *
 * @param   {Object} args.ctx : the canvas context
 *
 * @param   {Array} args.sprites : the list of sprites, to be applied with GameWindow
 *
 * @param   {Array} args.forces : the list of forces, such as gravity, to be applied with GameWindow
 *

 * @returns {GameWindow} object of GameWindow()
 * */

var GameWindow = function () {
        function GameWindow() {
                var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
                    _ref$canvas = _ref.canvas,
                    canvas = _ref$canvas === undefined ? false : _ref$canvas,
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
                }

                this.canvas.style.position = 'absolute';

                this.canvas.style.width = '100%';

                this.canvas.style.height = '100%';

                this.canvas.style.background = 'black';

                var c = this.canvas;

                this.ctx = this.canvas.getContext('2d');

                __gameStack.canvas = this.canvas;

                __gameStack.ctx = this.ctx;

                this.adjustSize();

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

                        var c = document.getElementById('#gs-container');

                        if (c) {
                                c.setAttribute('width', w);
                        };

                        if (c) {
                                c.setAttribute('height', h);
                        };

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

                                if (typeof item.def_update == 'function') {

                                        item.def_update(item);
                                }

                                if (typeof item.update == 'function') {
                                        item.update(item);
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

Gamestack.GameWindow = GameWindow;

/**
 * Instantiates a TextDisplay(), HTML/DOM object
 * @param   {Object} args the object of arguments
 * @param   {Number} args.widthFloat the pct 0-1.0 of screen-Width
 * @param   {Number} args.heightFloat the pct 0-1.0 of screen-Height
 *
 * @param   {Number} args.topFloat the pct 0-1.0 of screen-top-margin
 * @param   {Number} args.leftFloat the pct 0-1.0 of screen-left-margin
 * @param   {Number} args.targetLeft the pct 0-1.0 of target-left location (for slide-animation behavior)
 * @param   {Number} args.targetTop the pct 0-1.0 of target-top location (for slide-animation behavior)
 * @param   {string} args.color the css-text-color
 * @param   {string} args.text the text-value
 *
 * @param   {string} args.fontFamily the css fontFamily

 * @param {boolean} args.fromTop true || false, triggers a sliding-text animation from direction
 *
 *
 * @param {boolean} args.fromBottom true || false, triggers a sliding-text animation from direction
 *
 *
 * @param {boolean} args.fromLeft true || false, triggers a sliding-text animation from direction
 *
 *
 * @param {boolean} args.fromRight true || false, triggers a sliding-text animation from direction
 *
 *
 *@returns TextDisplay()
 *
 * */

var TextDisplay = function () {
        function TextDisplay(args) {
                _classCallCheck(this, TextDisplay);

                if (!args) {
                        args = {};
                }

                this.widthFloat = args.width || args.widthFloat || 0.5;

                this.heightFloat = args.height || args.heightFloat || 0.5;

                this.topFloat = args.top || 0.25;

                this.targetTop = this.get_float_pixels(this.topFloat, document.body.clientHeight);

                this.leftFloat = args.left || 0.25;

                this.targetLeft = this.get_float_pixels(this.leftFloat, document.body.clientWidth);

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
                key: 'get_float_pixels',
                value: function get_float_pixels(float, dimen) {
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

Gamestack.TextDisplay = TextDisplay;

/**
 * Instantiates an ItemDisplay() object : Displays item-image with number, such as the number of theoretical Coins collected
 * @param   {Object} args the object of arguments
 * @param   {string} args.src the src of the image
 * @param   {Vector} args.size the size(x, y) of the image, when displayed
 * @param   {Number} args.topFloat the pct 0-1.0 of screen-top-margin
 * @param   {Number} args.leftFloat the pct 0-1.0 of screen-left-margin
 * @param   {Number} args.targetLeft the pct 0-1.0 of target-left location (for slide-animation behavior)
 * @param   {Number} args.targetTop the pct 0-1.0 of target-top location (for slide-animation behavior)
 * @param   {string} args.color the css-text-color
 * @param   {string} args.text the text-value
 *
 * @param   {string} args.fontFamily the css fontFamily
 * @param   {string} args.fontSize the size of font
 *
 *@returns ItemDisplay()
 *
 * */

var ItemDisplay //show an item display (image with text/number to the right
= function () {
        function ItemDisplay(args) {
                _classCallCheck(this, ItemDisplay);

                this.src = args.src || "__NONE";

                this.size = args.size || new Vector3(50, 50);

                this.topFloat = args.top || 0;

                this.targetTop = this.get_float_pixels(this.topFloat, GameStack.HEIGHT);

                this.leftFloat = args.left || 0;

                this.targetLeft = this.get_float_pixels(this.leftFloat, GameStack.WIDTH);

                this.color = args.color || '#ffffff';

                this.text = args.text || "This is the text";

                this.fontFamily = args.font || args.fontFamily || "GameStack";

                this.fontSize = args.fontSize || args.textSize || "15px";

                this.text_id = GameStack.create_id();

                this.id = GameStack.create_id();

                this.img_id = GameStack.create_id();
        }

        _createClass(ItemDisplay, [{
                key: 'setValue',
                value: function setValue(value) {
                        document.getElementById(this.text_id);
                }
        }, {
                key: 'get_float_pixels',
                value: function get_float_pixels(float, dimen) {
                        return Math.round(dimen * float) + 'px';
                }
        }, {
                key: 'get_id',
                value: function get_id() {
                        return this.id;
                }
        }, {
                key: 'update',
                value: function update(v) {
                        var e = document.getElementById(this.text_id);

                        this.text = v + "";

                        e.innerText = this.text;
                }
        }, {
                key: 'show',
                value: function show() {

                        //create an html element

                        this.domElement = document.createElement('DIV');

                        this.domElement.setAttribute('class', 'gameStack-stats');

                        this.domElement.innerHTML += '<img style="float:left;" width="' + this.size.x + '" height="' + this.size.y + '" id="' + this.img_id + '" src="' + this.src + '"/>';

                        this.domElement.style.color = this.color;

                        this.domElement.innerHTML += '<span id="' + this.text_id + '" style="padding:5px; vertical-align:middle; display:table-cell; font-size:' + this.fontSize + '; color:' + this.color + ';">' + this.text + '</span>';

                        this.domElement.style.position = "fixed";

                        //this.domElement.style.padding = "10px";

                        this.domElement.style.top = this.targetTop;

                        this.domElement.style.left = this.targetLeft;

                        this.domElement.style.fontFamily = this.fontFamily;

                        this.domElement.style.fontSize = this.fontSize;

                        this.domElement.style.zIndex = "9999";

                        this.domElement.id = this.id;

                        document.body.append(this.domElement);
                }
        }]);

        return ItemDisplay;
}();

Gamestack.ItemDisplay = ItemDisplay;

var Bar = function () {
        function Bar(background, border) {
                _classCallCheck(this, Bar);

                this.background = background;
                var e = document.createElement("SPAN");

                e.style.position = 'fixed';

                e.style.background = this.background;

                e.style.zIndex = "9999";

                e.style.backgroundSize = "100% 100%";

                e.style.backgroundPosition = "center bottom";

                if (border) {
                        e.style.border = border;
                }

                this.domElement = e;
        }

        _createClass(Bar, [{
                key: 'width',
                value: function width(w) {
                        this.domElement.style.width = w;

                        return this;
                }
        }, {
                key: 'height',
                value: function height(h) {
                        this.domElement.style.height = h;

                        return this;
                }
        }]);

        return Bar;
}();

Gamestack.Bar = Bar;

var BarFill = function () {
        function BarFill(background) {
                _classCallCheck(this, BarFill);

                this.background = background;
                var e = document.createElement("SPAN");

                e.style.background = this.background;

                e.style.position = 'fixed';

                e.style.zIndex = "9995";

                this.domElement = e;
        }

        _createClass(BarFill, [{
                key: 'width',
                value: function width(w) {
                        this.domElement.style.width = w;

                        return this;
                }
        }, {
                key: 'height',
                value: function height(h) {
                        this.domElement.style.height = h;

                        return this;
                }
        }]);

        return BarFill;
}();

Gamestack.BarFill = BarFill;

var BarDisplay //show a display bar such as health bar
= function () {
        function BarDisplay() {
                var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                _classCallCheck(this, BarDisplay);

                this.border = args.border || "none";

                if (args.fill_src) {
                        this.fill = new BarFill(args.fill_src).width(args.fill_width || "80px").height(args.fill_height || "10px");
                } else {
                        this.fill = args.fill || new BarFill(args.fill_color || 'green').width(args.fill_width || "80px").height(args.fill_height || "10px");
                }

                if (args.bar_src) {
                        this.bar = new Bar(args.bar_src, this.border).width(args.bar_width || "80px").height(args.bar_height || "10px");
                } else {
                        this.bar = new Bar(args.bar_color || 'goldenrod', this.border).width(args.bar_width || "80px").height(args.bar_height || "10px");
                }

                this.topFloat = args.top || args.topFloat || 0.25;

                this.leftFloat = args.left || args.leftFloat || 0.25;

                this.widthFloat = args.width || args.widthFloat || 0.25;

                this.heightFloat = args.height || args.heightFloat || 0.25;

                document.body.append(this.fill.domElement);

                document.body.append(this.bar.domElement);
        }

        _createClass(BarDisplay, [{
                key: 'get_float_pixels',
                value: function get_float_pixels(float, dimen) {
                        return Math.round(dimen * float) + 'px';
                }
        }, {
                key: 'portion_top',
                value: function portion_top(v) {

                        this.fill.domElement.style.top = this.get_float_pixels(v || this.topFloat, GameStack.HEIGHT);

                        this.bar.domElement.style.top = this.get_float_pixels(v || this.topFloat, GameStack.HEIGHT);
                }
        }, {
                key: 'portion_left',
                value: function portion_left(v) {

                        this.fill.domElement.style.left = this.get_float_pixels(v || this.leftFloat, GameStack.WIDTH);

                        this.bar.domElement.style.left = this.get_float_pixels(v || this.leftFloat, GameStack.WIDTH);
                }
        }, {
                key: 'portion_width',
                value: function portion_width(w) {

                        this.fill.domElement.style.width = this.get_float_pixels(w || this.widthFloat, GameStack.WIDTH);

                        this.bar.domElement.style.width = this.get_float_pixels(w || this.widthFloat, GameStack.WIDTH);
                }
        }, {
                key: 'portion_height',
                value: function portion_height(h) {
                        this.fill.domElement.style.height = this.get_float_pixels(h || this.heightFloat, GameStack.HEIGHT);

                        this.bar.domElement.style.height = this.get_float_pixels(h || this.heightFloat, GameStack.HEIGHT);
                }
        }, {
                key: 'update',
                value: function update(f) {
                        this.fill.domElement.style.width = this.get_float_pixels(f || 0, parseFloat(this.bar.domElement.style.width));
                }
        }]);

        return BarDisplay;
}();

Gamestack.BarDisplay = BarDisplay;

var VideoDisplay //show a video
= function () {
        function VideoDisplay(_ref2) {
                var src = _ref2.src,
                    size = _ref2.size;

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

Gamestack.VideoDisplay = VideoDisplay;

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

                        size: new Vector3(20, 20, 20),

                        reverse_frames: false
                };

                for (var x in this.defaultArgs) {
                        if (!args.hasOwnProperty(x)) {
                                args[x] = this.defaultArgs[x];
                        }
                }
                ;

                for (var x in this.args) {
                        this[x] = args[x];
                }

                this.name = args.name || "__animationName";

                this.description = args.description || "__animationDesc";

                this.image = new GameImage(__gameStack.getArg(args, 'src', __gameStack.getArg(args, 'image', false)));

                this.src = this.image.domElement.src;

                this.domElement = this.image.domElement;

                var __inst = this;

                this.domElement.onload = function () {

                        __inst.__isValid = true;
                };

                this.frameSize = new Vector(args.frameSize || new Vector3(44, 44, 0));

                if (args.frameBounds) {
                        this.frameBounds = new VectorFrameBounds(args.frameBounds.min, args.frameBounds.max, args.frameBounds.termPoint);
                } else {
                        this.frameBounds = new VectorFrameBounds(new Vector3(0, 0, 0), new Vector3(0, 0, 0), new Vector3(0, 0, 0));
                }

                this.frameOffset = this.getArg(args, 'frameOffset', new Vector3(0, 0, 0));

                if ((typeof args === 'undefined' ? 'undefined' : _typeof(args)) == 'object' && args.frameBounds && args.frameSize) {
                        this.apply2DFrames();
                }
                ;

                this.flipX = this.getArg(args, 'flipX', false);

                this.cix = 0;

                this.selected_frame = this.frames[0] || {};

                this.timer = 0;

                this.duration = args.duration || 2000;

                this.seesaw_mode = args.seesaw_mode || false;

                this.reverse_frames = args.reverse_frames || false;

                this.run_ext = args.run_ext || [];

                this.complete_ext = args.complete_ext || [];
        }

        /*****
        * Overridable / Extendable functions
        * -allows stacking of external object-function calls
        ******/

        _createClass(Animation, [{
                key: 'onRun',
                value: function onRun(caller, callkey) {
                        this.run_ext = this.run_ext || [];

                        if (this.run_ext.indexOf(caller[callkey]) == -1) {
                                this.run_ext.push({ caller: caller, callkey: callkey });
                        }
                }
        }, {
                key: 'onComplete',
                value: function onComplete(caller, callkey) {
                        this.complete_ext = this.complete_ext || [];

                        if (this.complete_ext.indexOf(caller[callkey]) == -1) {
                                this.complete_ext.push({ caller: caller, callkey: callkey });
                        }
                }
        }, {
                key: 'call_on_run',
                value: function call_on_run() {
                        //call any function extension that is present
                        for (var x = 0; x < this.run_ext.length; x++) {
                                this.run_ext[x].caller[this.run_ext[x].callkey]();
                        }
                }
        }, {
                key: 'call_on_complete',
                value: function call_on_complete() {
                        //call any function extension that is present
                        for (var x = 0; x < this.complete_ext.length; x++) {
                                this.complete_ext[x].caller[this.complete_ext[x].callkey]();
                        }
                }
        }, {
                key: 'reverseFrames',
                value: function reverseFrames() {

                        this.frames.reverse();
                }
        }, {
                key: 'singleFrame',
                value: function singleFrame(frameSize, size) {
                        this.__frametype = 'single';

                        this.frameSize = frameSize || this.frameSize;

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

                                for (var _x4 = this.frameBounds.min.x; _x4 <= this.frameBounds.max.x; _x4++) {

                                        var framePos = {
                                                x: _x4 * this.frameSize.x + this.frameOffset.x,
                                                y: y * this.frameSize.y + this.frameOffset.y
                                        };

                                        this.frames.push({ image: this.image, frameSize: this.frameSize, framePos: framePos });

                                        if (_x4 >= this.frameBounds.termPoint.x && y >= this.frameBounds.termPoint.y) {

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
                        if (this.reverse_frames) {
                                this.reverseFrames();
                        }

                        // this.selected_frame = this.frames[this.cix % this.frames.length] || this.frames[0];
                }
        }, {
                key: 'update',
                value: function update() {

                        this.selected_frame = this.frames[Math.round(this.cix) % this.frames.length];
                }
        }, {
                key: 'reset',
                value: function reset() {

                        this.apply2DFrames();

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
                        this.call_on_run();
                        duration = duration || 2000;

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

                                __inst.call_on_complete();

                                __inst.cix = 0;

                                __inst.isComplete = true;
                        });

                        this.tween.start();
                }
        }, {
                key: 'animate',
                value: function animate() {

                        this.apply2DFrames();

                        this.timer += 1;

                        if (this.delay == 0 || this.timer % this.delay == 0) {

                                if (this.cix >= this.frames.length - 1) {
                                        this.call_on_complete();
                                }

                                this.cix = this.cix >= this.frames.length - 1 ? this.frameBounds.min.x : this.cix + 1;

                                this.update();
                        }
                }
        }]);

        return Animation;
}();

;

Gamestack.Animation = Animation;; /**
                                  * Camera : has simple x, y, z, position / Vector values
                                  *
                                  * @returns {Vector}
                                  */

var Camera = function Camera(args) {
        _classCallCheck(this, Camera);

        this.position = new Vector3(0, 0, 0);
};

;

/**
 * instantiates Gamestack.js Canvas (CanvasLib) controller

 @description
 This Canvas library handles the low-level drawing of Sprite() objects on HTML5Canvas.
 -draws Sprites(), handling their rotation, size, and other parameters.
 * @returns {CanvasLib} a CanvasLib object
 */

var CanvasLib = function CanvasLib() {
        _classCallCheck(this, CanvasLib);

        return {

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

                drawData: function drawData(x, y, w, h, data, ctx) {

                        ctx.putImageData(data, x, y, 0, 0, w, h);
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

                                var camera = __gameStack.__gameWindow.camera || { x: 0, y: 0, z: 0 };

                                var x = p.x,
                                    y = p.y;

                                x -= camera.x || 0;
                                y -= camera.y || 0;
                                //optional animation : gameSize

                                var targetSize = sprite.size || sprite.selected_animation.size;

                                var realWidth = targetSize.x;
                                var realHeight = targetSize.y;

                                //optional animation : offset

                                if (sprite.selected_animation && sprite.selected_animation.hasOwnProperty('offset')) {
                                        x += sprite.selected_animation.offset.x;

                                        y += sprite.selected_animation.offset.y;
                                }

                                var rotation;

                                if (_typeof(sprite.rotation) == 'object') {

                                        rotation = sprite.rotation.x;
                                } else {
                                        rotation = sprite.rotation;
                                }

                                var frame = sprite.selected_animation.selected_frame;

                                if (frame && frame.image && frame.image.data) {

                                        ctx.putImageData(frame.image.data, x, y, 0, 0, sprite.size.x, sprite.size.y);
                                } else {

                                        if (sprite.selected_animation.image.domElement instanceof HTMLImageElement) {

                                                this.drawFrameWithRotation(sprite.selected_animation.image.domElement, frame.framePos.x, frame.framePos.y, frame.frameSize.x, frame.frameSize.y, Math.round(x + realWidth / 2), Math.round(y + realHeight / 2), realWidth, realHeight, rotation % 360, ctx, sprite.flipX);
                                        }
                                }
                        }
                }

        };
};

var Canvas = new CanvasLib();

Gamestack.Canvas = Canvas;

;
/**
* GravityForce, calling new GravityForce() is equivalent to calling new Force()
 *
 * Takes an object of arguments and returns GravityForce() Object.
 *@param   {Object} args the object of arguments
* @param   {string} args.name optional
* @param   {string} args.description optional
* @param   {Array} args.subjects the subjects to be pulled by the GravityForce
* @param   {Array} args.clasticObjects any clastic object that should have collision-stop behavior with args.subjects when collision occurs
* @param   {Vector} args.max the speed of gravity AKA terminal velocity
* @param   {number} args.accel the increment to use when accelerating speed of fall
*
* @returns {Motion} a Motion object
*/

var GravityForce = function () {
        function GravityForce(args) {
                _classCallCheck(this, GravityForce);

                this.name = args.name || "";

                this.description = args.description || "";

                this.subjects = args.subjects || [];

                this.clasticObjects = args.clasticObjects || [];

                this.topClastics = args.topClastics || [];

                this.max = args.max || new Vector3(3, 3, 3);
                this.accel = args.accel || new Vector3(1.3, 1.3, 1.3);

                for (var x in this.clasticObjects) {
                        if (!this.clasticObjects[x] instanceof Sprite) {
                                this.clasticObjects[x] = Gamestack.getById(this.clasticObjects[x].id);
                        }
                }

                for (var x in this.topClastics) {
                        if (!this.topClastics[x] instanceof Sprite) {
                                this.topClastics[x] = Gamestack.getById(this.topClastics[x].id);
                        }
                }

                for (var x in this.subjects) {
                        if (!this.subjects[x] instanceof Sprite) {
                                this.subjects[x] = Gamestack.getById(this.subjects[x].id);
                        }
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

                        var clasticObjects = this.clasticObjects;

                        var topClastics = this.topClastics;

                        var accel = this.accel || {};

                        var max = this.max || {};

                        __gameStack.each(subjects, function (ix, itemx) {

                                itemx.accelY(accel, max);

                                itemx.__inAir = true;

                                if (itemx.position.y >= itemx.groundMaxY) {

                                        itemx.position.y = itemx.groundMaxY;
                                }

                                itemx.groundMaxY = 3000000; //some crazy number you'll never reach in-game

                                __gameStack.each(clasticObjects, function (iy, itemy) {

                                        itemx.collide_stop(itemy);
                                });

                                __gameStack.each(topClastics, function (iy, itemy) {

                                        itemx.collide_stop_top(itemy);
                                });
                        });
                }
        }]);

        return GravityForce;
}();

;

var Force = GravityForce;

Gamestack.Force = Force;

Gamestack.GravityForce = GravityForce;

;

/**
 * ControllerEventKeys()
 *
 * <ul >
 *  <li> an object representation of the controller
 *  <li> all keys are set to false
 * </ul>
 * @returns {ControllerEventKeys} object of ControllerEventKeys()
 * */

var ControllerEventKeys = function ControllerEventKeys() {
        _classCallCheck(this, ControllerEventKeys);

        return {

                left_stick: false,

                right_stick: false,

                0: false,

                1: false,

                2: false,

                3: false,

                4: false,

                5: false,

                6: false,

                7: false,

                8: false,

                9: false,

                10: false,

                11: false,

                12: false,

                13: false,

                14: false,

                15: false,

                16: false,

                17: false,

                18: false,

                19: false

        };
};

Gamestack.ControllerEventKeys = ControllerEventKeys;

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

GameStack.gamepads = GameStack.gamepads || __gameInstance.gamepads;

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

                        gp.constructor = { name: "GamepadEvents" };

                        this.__gamepads.push(gp);

                        Gamestack.gamepads = this.__gamepads;

                        return gp;
                }
        }, {
                key: 'getGamepads',
                value: function getGamepads() {
                        return Gamestack.gamepads;
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

/**
 * ControllerSetting()
 * takes arguments of button(string) || stick(string), plus event(function),
 *
 * @returns {ControllerSetting
 * }
 */

/**********
 * NOTE: here we bind the instance, and NOT the instantiator.
 *
 * *********/

if (!__gameInstance.GamepadAdapter) {
        Gamestack.GamepadAdapter = new GamepadAdapter();

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
}

;

var GamestackModel = function () {
        function GamestackModel() {
                var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                _classCallCheck(this, GamestackModel);

                this.__isMaster = args.master || args.isMaster || false;

                this.images = args.images || [];

                this.sounds = args.sounds || [];

                this.motions = args.motions || [];

                this.sprites = args.sprites || [];

                this.backgrounds = args.backgrounds || [];

                this.terrains = args.terrains || [];

                this.interactives = args.interactives || [];
        }

        _createClass(GamestackModel, [{
                key: 'add',
                value: function add(object) {
                        var isAllOfAny = function isAllOfAny(list, types) {
                                for (var x = 0; x < list.length; x++) {
                                        if (![types].indexOf(list[x].constructor.name) >= 0) {
                                                return false;
                                        }
                                }
                                return true;
                        };

                        if (object instanceof object) {
                                object = [object];
                        }

                        var cleanCheck = isAllOfAny(object, ['Sprite', 'Background', 'Terrain', 'Motion', 'Projectile', 'GameImage', 'Sound']);

                        if (!cleanCheck) {
                                return console.error('Must have: valid contents (Sprite OR [] of Sprite())');
                        }

                        var __inst = this;

                        Gamestack.each(object, function (ix, item) {

                                switch (item.constructor.name) {
                                        case "Sprite":

                                                __inst.sprites.push(item);

                                                break;

                                        case "Background":

                                                __inst.background.push(item);

                                                break;

                                        case "Terrain":

                                                __inst.terrains.push(item);

                                                break;

                                        case "Interactive":

                                                __inst.interactives.push(item);

                                                break;

                                        case "Sound":

                                                __inst.sounds.push(item);

                                                break;

                                        case "Motion":

                                                __inst.motions.push(item);

                                                break;

                                        case "Projectile":

                                                __inst.projectiles.push(item);

                                                break;

                                        case "GameImage":

                                                __inst.images.push(item);

                                                break;

                                        default:

                                                console.log('GamestackModel.add():UNKNOWN TYPE');
                                }

                                return;
                        });

                        this.contents.concat(object);

                        return this;
                }
        }]);

        return GamestackModel;
}();

;;

var GSEvent = function () {
        function GSEvent() {
                var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                _classCallCheck(this, GSEvent);

                this.name = args.name || "blankEvent";

                this.on = args.on || "collision";

                this.object = args.object || {};

                this.gpix = args.gpix || 0;

                this.ix = args.ix || 0; //the button-index OR stick-index

                this.targets = args.targets || [];

                this.triggered = args.triggered || function () {};

                this.statKey = args.statKey || false;

                this.lessThan = args.lessThan || false;

                this.greaterThan = args.greaterThan || false;
        }

        _createClass(GSEvent, [{
                key: 'apply',
                value: function apply() {

                        var __inst = this;

                        switch (this.on) {
                                case "collision":
                                case "collide":

                                        $Q(this.object).on('collision', this.targets, function (obj1, obj2) {

                                                __inst.triggered(obj1, obj2);
                                        });

                                        break;

                                case "button":

                                        //rig the button call

                                        $Q(this.object).on('button' + this.ix, function (pressed) {

                                                __inst.triggered(pressed);
                                        });

                                        break;

                                case "stick_left":
                                case "stick_right":
                                case "right_stick":
                                case "left_stick":

                                        //rig the stick call

                                        $Q(this.object).on(this.on, function (x, y) {

                                                __inst.triggered(x, y);
                                        });

                                        break;

                                case "stat":

                                        //rig the stat call

                                        console.error('STAT CALLS ARE NOT SET-UP YET. Please add this to the Gamestack library');

                                        var isStrOrNum = function isStrOrNum(str) {
                                                return typeof str == 'string' || typeof str == 'number';
                                        };

                                        var onKey = "[" + this.statKey + (isStrOrNum(this.greaterThan) ? ">" : "") + (isStrOrNum(this.lessThan) ? "<" : "") + (this.greaterThan || this.lessThan);

                                        $Q(this.object).on(onKey, function (x, y) {

                                                __inst.triggered(x, y);
                                        });

                                        break;

                        }
                }
        }, {
                key: 'triggered',
                value: function triggered() {} //called when triggered

        }, {
                key: 'onTriggered',
                value: function onTriggered(fun) {
                        this.triggered = function () {
                                fun();
                        };
                } //adds a function argument for triggered

        }, {
                key: 'rejected',
                value: function rejected() {}
        }, {
                key: 'onRejected',
                value: function onRejected(fun) {
                        this.rejected = function () {
                                fun();
                        };
                }
        }]);

        return GSEvent;
}();

function GSEventLink(extendedObject, extendedKey, extendor, extendorKey) {
        this.parent_id = extendedObject.id, this.child_id = extendor.id, this.parent_key = extendedKey, this.child_key = extendorKey;
};

function makeExtendableOverrides(object) {
        if (!object.run_ext instanceof Array) object.run_ext || [];
};;

var Level = function () {
        function Level() {
                var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                _classCallCheck(this, Level);

                this.sprites = args.sprites || [];

                this.backgrounds = args.backgrounds || [];

                this.terrains = args.terrains || [];

                this.interactives = args.interactives || [];

                this.threes = args.threes || []; //3d objects
        }

        _createClass(Level, [{
                key: 'add',
                value: function add() {}
        }, {
                key: 'add_all_to_game',
                value: function add_all_to_game() {}
        }]);

        return Level;
}();

;
/**
 * Takes an object of arguments and returns Motion() object. Motion animates movement of position and rotation properties for any Sprite()

 * @param   {Object} args object of arguments
 * @param   {string} args.name optional
 * @param   {string} args.description optional
 * @param   {TWEEN.Easing.'objectGroup'.'objectMember'} args.curve the TWEEN.Easing function to be applied (Example: TWEEN.Easing.Quadratic.InOut)
 * @param   {Vector} args.targetRotation the targeted rotation result, when using rotation with movement
 * @param   {Vector} args.distance the target distance of position change, when moving position
 * @param   {number} args.duration the milliseconds duration of the Motion
 * @param   {number} args.delay the milliseconds delay before the Motion occurs (on call of Motion.engage())
 *
 *
 * @returns {Motion} a Motion object
 */

var Motion = function () {
        function Motion() {
                var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                _classCallCheck(this, Motion);

                this.getArg = $Q.getArg;

                this.distance = new Vector(Gamestack.getArg(args, 'distance', new Vector(0, 0)));

                this.curvesList = this.curvesToArray(); //Tween.Easing

                this.lineCurvesList = this.lineCurvesToArray();

                if (args.parent instanceof Sprite) {
                        this.parent = args.parent;

                        this.parent_id = args.parent.id;
                } else {
                        this.parent_id = args.parent_id || args.object_id || "__blank"; //The parent object

                        this.parent = Gamestack.getObjectById(this.parent_id);
                }

                this.motion_curve = Gamestack.getArg(args, 'curve', TWEEN.Easing.Quadratic.InOut);

                this.line_curve = Gamestack.getArg(args, 'line_curve', TWEEN.Easing.Linear.None);

                this.rotation = Gamestack.getArg(args, 'rotation', 0);

                this.size = Gamestack.getArg(args, 'size', new Vector(0, 0, 0));

                this.targetRotation = Gamestack.getArg(args, 'targetRotation', 0);

                this.name = Gamestack.getArg(args, 'name', "__");

                this.description = Gamestack.getArg(args, 'description', false);

                this.motionCurveString = this.getMotionCurveString(); //store a string key for the Tween.Easing || 'curve'

                this.lineCurveString = this.getLineCurveString(); //store a string key for the Tween.Easing || 'curve'

                this.setMotionCurve(this.motionCurveString);

                this.setLineCurve(this.lineCurveString);

                this.duration = Gamestack.getArg(args, 'duration', 500);

                this.delay = Gamestack.getArg(args, 'delay', 0);

                this.object = this.getParent();

                this.run_ext = args.run_ext || [];

                this.complete_ext = args.complete_ext || [];
        }

        /*****
         * Overridable / Extendable functions
         * -allows stacking of external object-function calls
         ******/

        _createClass(Motion, [{
                key: 'onRun',
                value: function onRun(caller, callkey) {
                        this.run_ext = this.run_ext || [];

                        if (this.run_ext.indexOf(caller[callkey]) == -1) {
                                this.run_ext.push({ caller: caller, callkey: callkey });
                        }
                }
        }, {
                key: 'onComplete',
                value: function onComplete(caller, callkey) {
                        this.complete_ext = this.complete_ext || [];

                        if (this.complete_ext.indexOf(caller[callkey]) == -1) {
                                this.complete_ext.push({ caller: caller, callkey: callkey });
                        }
                }
        }, {
                key: 'call_on_run',
                value: function call_on_run() {
                        //call any function extension that is present
                        for (var x = 0; x < this.run_ext.length; x++) {
                                this.run_ext[x].caller[this.run_ext[x].callkey]();
                        }
                }
        }, {
                key: 'call_on_complete',
                value: function call_on_complete() {
                        //call any function extension that is present
                        for (var x = 0; x < this.complete_ext.length; x++) {
                                this.complete_ext[x].caller[this.complete_ext[x].callkey]();
                        }
                }
        }, {
                key: 'curvesToArray',
                value: function curvesToArray() {

                        var c = [];

                        GameStack.each(TWEEN.Easing, function (ix, easing) {

                                GameStack.each(easing, function (iy, easeType) {

                                        if (['in', 'out', 'inout', 'none'].indexOf(iy.toLowerCase()) >= 0) {

                                                c.push(ix + "_" + iy);
                                        }
                                });
                        });

                        return c;
                }
        }, {
                key: 'lineCurvesToArray',
                value: function lineCurvesToArray() {

                        var c = [];

                        GameStack.each(TWEEN.Easing, function (ix, easing) {

                                GameStack.each(easing, function (iy, easeType) {

                                        if (['linear', 'cubic', 'quadratic', 'quartic', 'quintic'].indexOf(ix.toLowerCase()) >= 0) {

                                                c.push(ix + "_" + iy);
                                        }
                                });
                        });

                        return c;
                }
        }, {
                key: 'getMotionCurveString',
                value: function getMotionCurveString() {

                        var __inst = this;

                        var c;

                        $.each(TWEEN.Easing, function (ix, easing) {

                                $.each(TWEEN.Easing[ix], function (iy, easeType) {

                                        if (__inst.motion_curve == TWEEN.Easing[ix][iy]) {

                                                c = ix + "_" + iy;
                                        }
                                });
                        });

                        return c;
                }
        }, {
                key: 'getLineCurveString',
                value: function getLineCurveString() {

                        var __inst = this;

                        var c;

                        $.each(TWEEN.Easing, function (ix, easing) {

                                $.each(TWEEN.Easing[ix], function (iy, easeType) {

                                        if (__inst.line_curve == TWEEN.Easing[ix][iy]) {

                                                c = ix + "_" + iy;
                                        }
                                });
                        });

                        return c;
                }
        }, {
                key: 'setLineCurve',
                value: function setLineCurve(c) {

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

                        this.line_curve = curve;

                        return curve;
                }
        }, {
                key: 'setMotionCurve',
                value: function setMotionCurve(c) {

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

                        this.motion_curve = curve;

                        return curve;
                }
        }, {
                key: 'onRun',
                value: function onRun(caller, callkey) {

                        this.run_ext = this.run_ext || [];

                        this.run_ext.push({ caller: caller, callkey: callkey });
                }
        }, {
                key: 'getParent',
                value: function getParent() {

                        var object = {},
                            __inst = this;

                        $.each(Gamestack.all_objects, function (ix, item) {

                                if (item.id == __inst.parent_id) {

                                        object = item;
                                }
                        });

                        if (!this.size) {
                                this.size = new Vector(object.size);
                        }

                        return object;
                }
        }, {
                key: 'engage',
                value: function engage() {

                        var __inst = this;

                        var tweens = [];

                        var object = this.getParent();

                        var targetPosition = {

                                x: __inst.distance.x + object.position.x,
                                y: __inst.distance.y + object.position.y,
                                z: __inst.distance.z + object.position.z

                        };

                        var targetR = __inst.targetRotation + object.rotation.x,
                            targetSize = __inst.size;

                        __inst.call_on_run(); //call any on-run extensions

                        //we always have a targetPosition
                        //construct a tween::
                        tweens.push(new TWEEN.Tween(object.position).easing(__inst.curve || __inst.motion_curve).to(targetPosition, __inst.duration).onUpdate(function () {
                                //console.log(objects[0].position.x,objects[0].position.y);


                        }).onComplete(function () {
                                //console.log(objects[0].position.x, objects[0].position.y);
                                if (__inst.complete) {

                                        __inst.call_on_complete(); //only call once
                                }
                        }));

                        //we have a target
                        tweens.push(new TWEEN.Tween(object.size).easing(__inst.curve || __inst.motion_curve).to(targetSize, __inst.duration).onUpdate(function () {
                                //console.log(objects[0].position.x,objects[0].position.y);


                        }).onComplete(function () {
                                //console.log(objects[0].position.x, objects[0].position.y);
                                if (__inst.complete) {}
                        }));

                        //we have a target
                        tweens.push(new TWEEN.Tween(object.rotation).easing(__inst.curve || __inst.motion_curve).to({ x: targetR }, __inst.duration).onUpdate(function () {
                                //console.log(objects[0].position.x,objects[0].position.y);


                        }).onComplete(function () {
                                //console.log(objects[0].position.x, objects[0].position.y);
                                if (__inst.complete) {}
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

                /**
                 * start the Motion transition
                 *
                 * @function
                 * @memberof Motion
                 *
                 **********/

        }, {
                key: 'start',
                value: function start() {
                        this.engage().fire();
                }

                /**
                 * specify a function to be called when Motion is complete
                 *
                 * @function
                 * @memberof Motion
                 * @param {Function} fun the function to be called when complete
                 **********/

        }, {
                key: 'onComplete',
                value: function onComplete(fun) {
                        this.complete = fun;
                }

                // obj.getGraphCanvas( $(c.domElement), value.replace('_', '.'), TWEEN.Easing[parts[0]][parts[1]] );

        }, {
                key: 'getGraphCanvas',
                value: function getGraphCanvas(t, f, c) {

                        var canvas = c || document.createElement('canvas');

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
        }, {
                key: 'getTweenPoints',
                value: function getTweenPoints(size, line) {

                        //must have line.minPointDist

                        var curve = line.curve,
                            duration = line.duration;

                        var points = [];

                        var position = new Vector(line.position);

                        var target = new Vector(position).add(size);

                        var start = new Vector(position);

                        var dist = new Vector(0, 0, 0);

                        var ptrack;

                        var easeInOutQuad = function easeInOutQuad(t) {
                                return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
                        };

                        return points;

                        var t1 = new TWEEN.Tween(position).to({ x: target.x }, 2000).easing(TWEEN.Easing.Linear.None).start();

                        if (t2) {
                                t2.stop();
                        }

                        var t2 = new TWEEN.Tween(position).to({ y: target.y }, 2000).easing(curve).onUpdate(function () {

                                if (ptrack) {

                                        dist = ptrack.sub(p);

                                        var d = Math.sqrt(dist.x * dist.x + dist.y * dist.y);

                                        if (d >= line.minPointDist) {

                                                points.push(p);

                                                ptrack = new Vector(p);
                                        }
                                } else {
                                        ptrack = p;

                                        points.push(p);
                                };
                        }).onComplete(function () {

                                // alert(line.minPointDist);

                                line.first_segment = points.slice();

                                var extendLinePoints = function extendLinePoints(segment, points, ix) {

                                        var next_points = segment.slice();

                                        var last_point = points[points.length - 1];

                                        for (var x = 0; x < next_points.length; x++) {

                                                var sr = new Vector(Gamestack.GeoMath.rotatePointsXY(line.size.x * ix, line.size.y * ix, line.rotation));

                                                var p = next_points[x].add(sr);

                                                if (points.indexOf(p) <= -1) {

                                                        points.push(p);
                                                }
                                        }
                                };

                                for (var x = 0; x <= line.curve_iterations; x++) {
                                        if (x > 1) {

                                                extendLinePoints(line.first_segment, line.points, x - 1);
                                        }
                                }
                        }).start();

                        return points;
                }
        }]);

        return Motion;
}();

Gamestack.Motion = Motion;

; /**
  * Takes an object of arguments and returns Projectile() object. Projectile fires a shot from the parent sprite, with specified offset, rotation, motion_curve, line_curve
  
  * @param   {Object} args object of arguments
  * @param   {string} args.name optional
  * @param   {string} args.description optional
  * @param   {string} args.distance the distance before dissappearance
  * @param   {TWEEN.Easing.'objectGroup'.'objectMember'} args.motion_curve the TWEEN.Easing function to be applied for motion/speed (Example: TWEEN.Easing.Quadratic.InOut)
  *
  *  * @param   {TWEEN.Easing.'objectGroup'.'objectMember'} args.line_curve the TWEEN.Easing function to be applied for line (Example: TWEEN.Easing.Quadratic.InOut)
  *
  * @returns {Projectile} a Projectile object
  */

var Projectile = function () {
        function Projectile() {
                var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                _classCallCheck(this, Projectile);

                this.getArg = $Q.getArg;

                for (var x in args) {
                        this[x] = args[x];
                }

                this.name = args.name || "__";

                this.description = args.description || "__";

                this.line = new Line(Gamestack.getArg(args, 'line', new Line()));

                this.animation = Gamestack.getArg(args, 'animation', new Animation());

                this.parent_id = args.parent_id || args.object_id || "__blank"; //The parent object

                this.name = Gamestack.getArg(args, 'name', "__");

                this.size = Gamestack.getArg(args, 'size', new Vector());

                this.origin = args.origin || false;

                this.description = Gamestack.getArg(args, 'description', false);

                this.duration = Gamestack.getArg(args, 'duration', 500);

                this.delay = Gamestack.getArg(args, 'delay', 0);

                this.position = Gamestack.getArg(args, 'position', new Vector(0, 0, 0));

                this.motion_curve = Gamestack.getArg(args, 'motion_curve', TWEEN.Easing.Linear.None);

                this.highlighted = false;

                this.sprites = [];

                this.run_ext = args.run_ext || [];
        }

        /**
         * specify a function to be called when Motion is complete
         *
         * @function
         * @memberof Projectile
         * @param {Function} fun the function to be called when complete
         *
         **********/

        _createClass(Projectile, [{
                key: 'onComplete',
                value: function onComplete(fun) {
                        this.complete = fun;
                }
        }, {
                key: 'onCollide',
                value: function onCollide(fun) {
                        this.collide = fun;
                }
        }, {
                key: 'setAnimation',
                value: function setAnimation(anime) {

                        this.animation = anime;

                        return this;
                }
        }, {
                key: 'setMotionCurve',
                value: function setMotionCurve(c) {

                        this.motion_curve = c;

                        return this;
                }
        }, {
                key: 'kill_one',
                value: function kill_one() {

                        var spr = this.sprites[this.sprites.length - 1];

                        Gamestack.remove(spr);
                }
        }, {
                key: 'onRun',
                value: function onRun(caller, callkey) {

                        this.run_ext = this.run_ext || [];

                        this.run_ext.push({ caller: caller, callkey: callkey });
                }
        }, {
                key: 'fire',
                value: function fire(origin) {

                        for (var x = 0; x < this.run_ext.length; x++) {

                                this.run_ext[x].caller[this.run_ext[x].callkey]();
                        }

                        if (!origin) {

                                origin = this.origin;
                        }

                        console.log('FIRING FROM:' + jstr(origin));

                        var sprite = new Sprite({ image: this.animation.image });

                        sprite.setAnimation(this.animation);

                        sprite.setSize(this.size);

                        sprite.position = new Vector(0, 0, 0);

                        var __inst = this;

                        var lp = __inst.line.transpose(origin);

                        sprite.position = new Vector(lp[0]);

                        sprite.onUpdate(function (sprite) {

                                for (var x = 0; x < lp.length; x++) {

                                        if (sprite.position.equals(lp[x]) && x < lp.length - 1) {

                                                sprite.position = new Vector(lp[x + 1]);

                                                break;
                                        }

                                        if (x == lp.length - 1) {
                                                Gamestack.remove(sprite);
                                        }
                                }
                        });

                        Gamestack.add(sprite);

                        this.sprites.push(sprite);
                }
        }]);

        return Projectile;
}();

Gamestack.Projectile = Projectile;

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

        this.min = new Vector(min);
        this.max = new Vector(max);
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

var Shapes = {

        circle: function circle(radius, freq) {

                return {

                        radius: radius,

                        points: [],

                        fill: function fill(center, freq) {}

                };
        },

        square: function square(s, freq) {
                console.error('STILL NEED TO BUILD THIS SQUARE IN GS-API');

                return {

                        size: new Vector(s, s),

                        width: w,

                        height: h,

                        freq: freq,

                        points: [],

                        fill: function fill(start, freq) {}
                };
        },

        rect: function rect(w, h, freq) {
                console.error('STILL NEED TO BUILD THIS TRIANGLE');

                return {

                        size: new Vector(w, h),

                        width: w,

                        height: h,

                        freq: freq,

                        points: [],

                        fill: function fill(start, freq) {}
                };
        },

        triangle: function triangle(base, h, freq) {

                console.error('STILL NEED TO BUILD THIS TRIANGLE');

                return {

                        base: base,

                        height: height,

                        freq: freq,

                        points: [],

                        fill: function fill(start, freq) {}
                };
        }
};

Gamestack.Shapes = Shapes;

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

                this.curve_options = Curves; //Curves Object (of functions)
                this.curve_string = args.curve_string || "linearNone";

                this.curve = this.get_curve_from_string(this.curve_string);

                this.motion_curve = args.motion_curve || TWEEN.Easing.Linear.None;

                if (typeof args.curve == 'function') {
                        this.curve = args.curve;
                }

                this.points = args.points || [];

                this.position = args.position || new Vector();

                this.is_highlighted = args.is_highlighted || false;

                this.offset = args.offset || new Vector();

                this.pointDist = 5;

                this.size = args.size || new Vector();

                this.rotation = args.rotation || 0;

                this.iterations = 1;

                this.growth = args.growth || 1.2;
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
                key: 'Rotation',
                value: function Rotation(r) {
                        this.rotation = r;
                        return this;
                }
        }, {
                key: 'next',
                value: function next(position) {

                        var found = false;

                        for (var x = 0; x < this.points.length; x++) {

                                if (position.equals(this.points[x]) && x < this.points.length - 1) {
                                        found = true;
                                        return new Vector(this.points[x + 1]);
                                }

                                if (x == this.points.length - 1 && !found) {

                                        return new Vector(this.points[0]);
                                }
                        }
                }
        }, {
                key: 'get_curve_from_string',
                value: function get_curve_from_string(str) {

                        console.log('Applying Line():curve:' + str);

                        for (var x in this.curve_options) {

                                if (x.toLowerCase() == str.toLowerCase()) {
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

                        var points = this.transpose(origin);

                        for (var x in points) {

                                var point = points[x];

                                var dist = point.sub(Gamestack.point_highlighter.position);

                                var d = Math.sqrt(dist.x * dist.x + dist.y * dist.y);

                                if (d >= 10) {
                                        Gamestack.point_highlighter.position = new Vector2(points[x]);
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
        function Sprite() {
                var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                _classCallCheck(this, Sprite);

                if (args instanceof Animation) {
                        args = { selected_animation: args, size: new Vector(args.frameSize) };
                }

                this.active = true; //active sprites are visible

                this.name = args.name || "__blankName";

                this.description = args.description || "__spriteDesc";

                this.gravity = "medium";

                this.__initializers = __gameStack.getArg(args, '__initializers', []);

                var _spr = this;

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

                if (__inst.projectiles[0]) {
                        __inst.selected_projectile = __inst.projectiles[0];
                }

                //Apply initializers:

                GameStack.each(this.__initializers, function (ix, item) {

                        __inst.onInit(item);
                });

                this.selected_animation = new Animation(args.selected_animation || {});

                this.image.domElement.onload = function () {

                        __inst.setAnimation(__inst.animations[0] || new Animation({

                                image: __inst.image,

                                frameSize: new Vector3(__inst.image.domElement.width, __inst.image.domElement.height),

                                frameBounds: new VectorFrameBounds(new Vector3(), new Vector3())

                        }));
                };
        }

        /**
         * This function adds objects to the Sprite. Objects of Animation(), Projectile().
         *
         * @function
         * @memberof Sprite
         **********/

        _createClass(Sprite, [{
                key: 'add',
                value: function add(obj) {

                        switch (obj.constructor.name) {

                                case "Animation":

                                        this.animations.push(obj);

                                        break;

                                case "Projectile":

                                        obj.origin = obj.origin || this.position;

                                        this.projectiles.push(obj);

                                        break;

                                case "Motion":

                                        this.motions.push(obj);

                                        break;

                                case "Sound":

                                        this.sounds.push(obj);

                                        break;

                        }
                }

                /**
                 * This function initializes sprites. Call to trigger all functions previously passed to onInit().
                 *
                 * @function
                 * @memberof Sprite
                 **********/

        }, {
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
                key: 'getSizeByMax',
                value: function getSizeByMax(mx, my) {

                        var size = new Vector3(this.size);

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

                        var __playerInst = this;

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

                                if (!options.line) {

                                        shot.speed.x = Math.cos(shot.rotation.x * 3.14 / 180) * speed;

                                        shot.speed.y = Math.sin(shot.rotation.x * 3.14 / 180) * speed;
                                } else {
                                        options.line.fill(new Vector(500, 500), 4);

                                        var nextPos = new Vector(0, 0, 0);

                                        shot.onUpdate(function (spr) {

                                                nextPos = options.line.next(nextPos);

                                                spr.position = __playerInst.position.add(nextPos);

                                                console.log(spr.position);
                                        });
                                }

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
        }, {
                key: 'toJSONString',
                value: function toJSONString() {
                        for (var x = 0; x < this.motions.length; x++) {
                                this.motions[x].parent = false;
                        }

                        return jstr(this);
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
                        };

                        return new Vector(this.x - v.x, this.y - v.y, this.z - v.z);
                }
        }, {
                key: 'add',
                value: function add(v) {
                        if (typeof v == 'number') {
                                v = { x: v, y: v, z: v };
                        };

                        return new Vector(this.x + v.x, this.y + v.y, this.z + v.z);
                }
        }, {
                key: 'mult',
                value: function mult(v) {
                        if (typeof v == 'number') {
                                v = { x: v, y: v, z: v };
                        };

                        return new Vector(this.x * v.x, this.y * v.y, this.z * v.z);
                }
        }, {
                key: 'div',
                value: function div(v) {
                        if (typeof v == 'number') {
                                v = { x: v, y: v, z: v };
                        };

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

;

var Vector3 = Vector,
    Pos = Vector,
    Size = Vector,
    Position = Vector,
    Vector2 = Vector,
    Rotation = Vector;

Gamestack.Vector = Vector;

//The above are a list of synonymous expressions for Vector. All of these do the same thing in this library (store x,y,z values)
;
var Background = function (_Sprite) {
        _inherits(Background, _Sprite);

        function Background() {
                var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                _classCallCheck(this, Background);

                var _this2 = _possibleConstructorReturn(this, (Background.__proto__ || Object.getPrototypeOf(Background)).call(this, args));

                _this2.type = args.type || "parallax" || "basic" || false;

                _this2.orientation = args.orientation || "x" || "y" || "xy";

                _this2.contents = args.contents || [];

                if (_this2.contents instanceof Object) {
                        _this2.contents = [_this2.contents]; //encapsulate in array (always) for simple processing
                };

                _this2.reverseX = args.reverseX || false;

                _this2.reverseY = args.reverseY || false;

                _this2.speedFloat = args.speedFloat || 1.0;

                return _this2;
        }

        _createClass(Background, [{
                key: 'scroll',
                value: function scroll(speedX, speedY) {

                        Gamestack.each(this.contents, function (ix, element) {

                                element.position.x += speedX * this.speedFloat;
                                element.position.y += speedY * this.speedFloat;
                        });
                }
        }, {
                key: 'scrollX',
                value: function scrollX(speed) {
                        Gamestack.each(this.contents, function (ix, element) {

                                element.position.x += speed * this.speedFloat;
                        });
                }
        }, {
                key: 'scrollY',
                value: function scrollY(speed) {
                        Gamestack.each(this.contents, function (ix, element) {

                                element.position.y += speed * this.speedFloat;
                        });
                }
        }, {
                key: 'add',
                value: function add(object) {
                        var cleanCheck = object instanceof Sprite || object instanceof Array && object[0] instanceof Sprite;

                        if (!cleanCheck) {
                                return console.error('Must have: valid contents (Sprite OR [] of Sprite())');
                        }

                        if (object instanceof Array) {
                                this.contents.cancat(object);
                        } else {
                                this.contents.push(object);
                        }

                        return this;
                }
        }]);

        return Background;
}(Sprite);

;

var Interactive = function (_Sprite2) {
        _inherits(Interactive, _Sprite2);

        function Interactive() {
                var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                _classCallCheck(this, Interactive);

                return _possibleConstructorReturn(this, (Interactive.__proto__ || Object.getPrototypeOf(Interactive)).call(this, args)); //init as Sprite()
        }

        _createClass(Interactive, [{
                key: 'onCollide',
                value: function onCollide() {}
        }]);

        return Interactive;
}(Sprite);

;

var Terrain = function (_Sprite3) {
        _inherits(Terrain, _Sprite3);

        function Terrain() {
                var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                _classCallCheck(this, Terrain);

                //init as Sprite()

                var _this4 = _possibleConstructorReturn(this, (Terrain.__proto__ || Object.getPrototypeOf(Terrain)).call(this, args));

                _this4.collision_type = args.collision_type || "FULL_COLLIDE" || "TOP_COLLIDE" || "NO_COLLIDE";

                return _this4;
        }

        _createClass(Terrain, [{
                key: 'onCollide',
                value: function onCollide() {}
        }]);

        return Terrain;
}(Sprite);

;

var Three = function (_Sprite4) {
        _inherits(Three, _Sprite4);

        function Three() {
                var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                _classCallCheck(this, Three);

                //init as Sprite()

                var _this5 = _possibleConstructorReturn(this, (Three.__proto__ || Object.getPrototypeOf(Three)).call(this, args));

                if (!THREE) //THREE.js library must be loaded
                        {
                                var _ret;

                                return _ret = console.error('ThreeJSObject():Library: Three.js is required for this object.'), _possibleConstructorReturn(_this5, _ret);
                        }

                _this5.scene = new THREE.Scene();

                _this5.geometry = args.geometry || new THREE.TorusGeometry(50, 10, 16, 100);

                _this5.scene.add(new THREE.AmbientLight(0x404040, 0.8));

                _this5.renderer = Gamestack.renderer || new THREE.WebGLRenderer({
                        preserveDrawingBuffer: true
                });

                _this5.renderer.setSize(1000, 1000);

                _this5.camera = new THREE.PerspectiveCamera(70, 1, 1, 1000);

                _this5.camera.position.z = 1000 / 8;

                var __inst = _this5;

                _this5.loader = new THREE.TextureLoader();
                _this5.loader.load("../assets/game/image/tiles/perlin_3.png", function (texture) {

                        __inst.material = args.material || new THREE.MeshPhongMaterial({
                                map: texture
                        });

                        if (!__inst.__init) {

                                __inst.mesh = new THREE.Mesh(__inst.geometry, __inst.material);

                                __inst.scene.add(__inst.mesh);

                                __inst.__init = true;
                        }

                        __inst.renderer.render(__inst.scene, __inst.camera);

                        __ServerSideFile.file_upload('test.png', __inst.renderer.domElement.toDataURL('image/png'), function (relpath, content) {

                                relpath = relpath.replace('client/', '../');

                                __inst.selected_animation = new Animation({ src: relpath, frameSize: new Vector(1000, 1000), frameBounds: new VectorFrameBounds(new Vector(0, 0, 0), new Vector(0, 0, 0), new Vector(0, 0, 0)) }).singleFrame();

                                __inst.selected_animation.image.domElement.onload = function () {

                                        __inst.setSize(new Vector(__inst.selected_animation.image.domElement.width, __inst.selected_animation.image.domElement.height));

                                        __inst.selected_animation.animate();

                                        console.log(jstr(__inst.selected_animation.frames));
                                };
                        });
                });

                return _this5;
        }

        _createClass(Three, [{
                key: 'three_update',
                value: function three_update() {
                        console.log('THREE --GS-Object UPDATE');

                        this.mesh.rotation.y += 0.05;

                        this.renderer.clear();

                        this.renderer.setSize(this.size.x, this.size.y);

                        var pixels = new Uint8Array(this.size.x * this.size.y * 4);

                        this.renderer.render(this.scene, this.camera);

                        var gl = this.renderer.getContext();

                        gl.readPixels(0, 0, this.size.x, this.size.y, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

                        this.selected_animation.selected_frame = { image: {} };

                        this.selected_animation.selected_frame.image.data = new ImageData(new Uint8ClampedArray(pixels), this.size.x, this.size.y);
                }
        }, {
                key: 'applyAnimativeState',
                value: function applyAnimativeState() {}
        }]);

        return Three;
}(Sprite //dependency: THREE.js
);
//# sourceMappingURL=Gamestack.js.map
