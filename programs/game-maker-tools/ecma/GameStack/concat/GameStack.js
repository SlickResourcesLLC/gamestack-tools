
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

let Gamestack = {};

let GameStackLibrary = function () {

    var lib = {

        DEBUG: false,

        gui_mode: true,

        __gameWindow: {}
        ,

        __sprites: [],

        __animations: [],


        spriteTypes:[],

        systemSpriteTypes: ['player', 'enemy', 'background', 'interactive'],

        systemAnimationTypes: {

            attack_0:"System.attack_0",

            attack_1:"System.attack_1",

            attack_2:"System.attack_2",

            attack_3:"System.attack_3",

            attack_4:"System.attack_4",

            defend_0:"System.defend_0",

            defend_1:"System.defend_1",

            defend_2:"System.defend_2",

            defend_3:"System.defend_3",

            defend_4:"System.defend_4",

            heal_0:"System.heal_0",

            heal_1:"System.heal_1",

            heal_2:"System.heal_2",

            heal_3:"System.heal_3",

            heal_4:"System.heal_4",

        },


        samples: {}
        ,

        log_modes: ['reqs', 'info', 'warning'],

        log_mode: "all",

        recursionCount: 0,

        __gameWindowList: [],


        create_id: function () {

            var d = new Date().getTime();
            if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
                d += performance.now(); //use high-precision timer if available
            }
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });

        }

        ,

        getActionablesCheckList: function () {
            //every unique sound, animation, tweenmotion in the game

            let __inst = {};

            let actionables = [];

            $Q.each(this.sprites, function (ix, item) {

                actionables.concat(item.sounds);

                actionables.concat(item.motionstacks);

                actionables.concat(item.animations);


            });


        }
        ,

        interlog: function (message, div) //recursive safe :: won't go crazy with recursive logs
        {
            this.recursionCount++;

            if (!isNaN(div) && this.recursionCount % div == 0) {
                //   console.log('Interval Log:'+  message);

            }

        }
        ,

        error: function (quit, message) {

            if (quit) {
                throw new Error(message);

            }
            else {
                console.error('E!' + message);

            }

        }
        ,

        info: function (m) {

            if (GameStack.DEBUG) {

                console.info('Info:' + m);

            }
        }
        ,


        log: function (m) {

            if (GameStack.DEBUG) {

                console.log('GameStack:' + m);

            }
        }
        ,

        //animate() : main animation call, run the once and it will recurse with requestAnimationFrame(this.animate);

        animate: function (time) {

            __gameStack.isAtPlay = true;


            TWEEN.update(time);

            requestAnimationFrame(__gameStack.animate);

            __gameStack.__gameWindow.update();

            __gameStack.__gameWindow.ctx.clearRect(0, 0, __gameStack.__gameWindow.canvas.width, __gameStack.__gameWindow.canvas.height);

            __gameStack.__gameWindow.draw();

        }
        ,

        start: function () {

            this.animate();

        }
        ,


        Collision: {

            spriteRectanglesCollide(obj1, obj2)
            {


               var paddingX = Math.round(obj1.padding.x * obj1.size.x),

                   paddingY =Math.round(obj1.padding.y * obj1.size.y), left = obj1.position.x + paddingX, right = obj1.position.x + obj1.size.x - paddingX,

               top = obj1.position.y + paddingY, bottom = obj1.position.y + obj1.size.y - paddingY;

                if (right > obj2.position.x && left < obj2.position.x + obj2.size.x &&
                   bottom > obj2.position.y && top < obj2.position.y + obj2.size.y) {

                    return true;

                }

            }
        }
        ,

        TWEEN: TWEEN,

        _gameWindow: {}
        ,

        setGameWindow: function (gameWindow) {

            this._gameWindow = gameWindow;

        }
        ,

        getGameWindow: function () {


            return this._gameWindow;

        }
        ,

        assignAll: function (object, args, keys) {

            __gameStack.each(keys, function (ix, item) {

                object[ix] = args[ix];

            });


        }
        ,


        each: function (list, onResult, onComplete) {
            for (var i in list) {
                onResult(i, list[i]);
            }

            if (typeof(onComplete) === 'function') {
                onComplete(false, list)
            }
            ;

        }
        ,

        ready_callstack: [],

        ready: function (callback) {

            this.ready_callstack.push(callback);

        }

        ,

        callReady: function () {

            var funx = this.ready_callstack;

            var gameWindow = this._gameWindow, lib = this, sprites = this.__gameWindow.sprites;

            //call every function in the ready_callstack


            this.each(funx, function (ix, call) {

                call(lib, gameWindow, sprites);

            });

            this.InputEvents.init();


        }
        ,

        getArg: function (args, key, fallback) {
            if (args && args.hasOwnProperty(key)) {
                return args[key];
            }
            else {
                return fallback;

            }

        }

        ,

        add: function (obj) {
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

        }

        ,

        remove: function (obj) {
            //1: if Sprite(), Add object to the existing __gameWindow

            if (obj instanceof Sprite) {

                var ix = this.__gameWindow.sprites.indexOf(obj);

                this.__gameWindow.sprites.splice(ix, 1);

            }

        },

        all_objects: [],

        collect: function (obj) {

            this.all_objects.push(obj);

        },


        isNormalStringMatch: function (str1, str2) {

            return str1.toLowerCase().replace(' ', '') == str2.toLowerCase().replace(' ', '');

        },

        instance_type_pairs: function () {
            //get an array of all instance/type pairs added to the library

            //example : [ {constructor_name:Sprite, type:enemy_basic}, {constructor_name:Animation, type:enemy_attack}  ];

            var objectList = [];

            this.each(this.all_objects, function (ix, item) {


                objectList.push({constructor_name: item.constructor.name, type: item.type});

            });

            return objectList;

        },

        getById:function(id){


            for(var x in this.all_objects)
            {

                if(this.all_objects[x].id == id)
                {
                    return this.all_objects[x];

                }

            }




        },

        select: function (constructor_name, name, type /*ignoring spaces and CAPS/CASE on type match*/) {


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

    }


    return lib;

};


/**
 * Simple Sound object:: implements Jquery: Audio()
 * @param   {string} src : source path / name of the targeted sound-file

 * @returns {Sound} object of Sound()
 * */


class Sound {

    constructor(src, data) {

        if (typeof(src) == 'object') {

            for (var x in src) {
                this[x] = src[x];

            }

            this.sound = new Audio(src.src);

            this.onLoad = src.onLoad || function () {
                };

        }

        else if (typeof(src) == 'string') {

            this.src = src;

            this.sound = new Audio(this.src);

        }

        if(typeof(data) == 'object')
        {
            for(var x in data)
            {
              if(x !== 'volume' && x !== 'play'){  this[x] = data[x]; }

            }

        }


        this.onLoad = this.onLoad || function () {
            };

        if (typeof(this.onLoad) == 'function') {

            this.onLoad(this.sound);

        }

    }

    volume(val)
    {

        this.sound.volume = val;

        return this;

    }

    play() {
        if (typeof(this.sound) == 'object' && typeof(this.sound.play) == 'function') {

            this.sound.play();

        }


    }

}


class SoundList{

    constructor(list)
    {

       this.cix = 1;

       this.sounds = [];

        if(list instanceof Array)
        {
            for(var x in list)
            {
                if(list[x].src)
                {
                    this.sounds.push(new Sound(list[x].src, list[x]));

                }
                else if(typeof(list[x]) == 'string')
                {
                    this.sounds.push(new Sound(list[x]));

                }

            }

        }



    }

    add(src, name)
    {
        if(typeof(src) == 'object' && src.src)
        {
            this.sounds.push(new Sound(src.src, src));

        }
        else if(typeof(src) == 'string')
        {
            var data = {};

            if(name)
            {
                data.name = name;
            }

            this.sounds.push(new Sound(list[x], data));

        }

    }

    playNext()
    {
        this.sounds[this.cix % this.sounds.length].play();

        this.cix += 1;

    }

}

/**
 * GameImage
 *
 * Simple GameImage
 * @param   {string} src source name/path of the targeted image-file

 * @returns {GameImage} object of GameImage()

 * */

class GameImage {

    constructor(src, onCreate) {

        // GameStack.log('initializing image');

        if (src instanceof Object) {

            //alert('getting image from image');

            this.image = document.createElement('IMG');

            this.image.src = src.src;

            this.src = src.src;

        }

        else if (typeof(src) == 'string') {

            let ext = src.substring(src.lastIndexOf('.'), src.length);

            this.image = document.createElement('IMG');

            this.image.src = src;

            this.src = this.image.src;


        }


        if (!this.image) {
            this.image = {error: "Image not instantiated, set to object by default"};

        }
        else {
            this.image.onerror = function () {
                this.__error = true;
            };

        }

        this.domElement = this.image;

        this.image.onload = function () {

            if (typeof(this.onCreate) == 'function') {

                this.onCreate(this.image);

            }


        }

    }


    getImage() {
        return this.image;
    }

}


//GameStack: a main / game lib object::
//TODO: fix the following set of mixed references:: only need to refer to (1) lib-object-instance
let GameStack = new GameStackLibrary();
Gamestack = GameStack;
let __gameStack = GameStack;
let Quick2d = GameStack; //Exposing 'Quick2d' as synonymous reference to Gamestack
let __gameInstance = Gamestack;

Gamestack.Sound = Sound;
Gamestack.GameImage = GameImage;

if (typeof module !== 'undefined' && module.exports) {

    //This library is being instaniated via require() aka node.js require or similar library loader
    module.exports = Gamestack;

} else {


}

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

    $GFunx.each = function(callback)
    {

        var objects = [];

        for(var x = 0; x < this.length; x++)
        {
            if(typeof x == 'number')
            {

                callback(x, this[x]);
            }

        }


    };

    $GFunx.on = function (evt_key, selectorObject, controller_ix, callback) //handle each event such as on('collide') OR on('stick_left_0') << first controller stick_left
    {

        if(__gameStack.isAtPlay)
        {
            return console.error('Cannot call $Q().on while game is at play. Please rig your events before gameplay.');

        }

        var criterion = $Q.between('[', ']', evt_key);

        if(criterion.indexOf('===') >= 0)
        {
            criterion = criterion.replace('===', '=');
        }

        if(criterion.indexOf('==') >= 0)
        {
            criterion =  criterion.replace('==', '=').replace('==', 0);
        }

       var cparts = criterion.split('=');

        var  __targetType = "*", __targetName = "*";

        if(evt_key.indexOf('[') >= 0)
        {
            evt_key = $Q.before('[', evt_key).trim();

        }


        var padding = 0;

        if(cparts[0].toLowerCase() == 'padding')
        {

            padding = parseFloat(cparts[1]);

            alert('padding:' + padding);

        }

        //if controller_ix is function, and callback not present, then controller_ix is the callback aka optional argument

        if(controller_ix && typeof controller_ix == 'function' && !callback)
        {
            callback = controller_ix;
            controller_ix = 0;
        }

        //if controller_ix is function, and callback not present, then selectorObject is the callback aka optional argument

        if(selectorObject && typeof selectorObject == 'function' && !callback)
        {

            callback = selectorObject;

            selectorObject = $Q('*');

            controller_ix = 0;
        };

        var evt_profile = {};

        //which controller?

        evt_profile.cix = controller_ix;

        //Need the control key: 'left_stick', 'button_0', etc..

        evt_profile.evt_key = evt_key;

        if($Q.contains_any(['stick', 'button', 'click', 'key'], evt_profile.evt_key))
        {

            var button_mode = evt_profile.evt_key.indexOf('button') >= 0;

            Gamestack.GamepadAdapter.on(evt_profile.evt_key, 0, function (x, y) {

               callback(x, y);

            });

            console.info('detected input event key in:' + evt_profile.evt_key);

            console.info('TODO: rig events');

        }

        //TODO: test collision events:

      else if($Q.contains_any(['collide', 'collision', 'hit', 'touch'],  evt_profile.evt_key))
        {

            console.info('Rigging a collision event');

            console.info('detected collision event key in:' +  evt_profile.evt_key);

            console.info('TODO: rig collision events');

            this.each(function(ix, item1){

                selectorObject.each(function(iy, item2){

                    if(typeof(item1.onUpdate) == 'function')
                    {

                        item1.onUpdate(function(sprite){

                            if(item1.collidesRectangular(item2, padding))
                            {

                              callback(item1, item2);

                            };

                        });

                    }


                });

            });


        }


       else {
            console.info('Rigging a property event');

            //TODO: test property-watch events:

            console.info('detected property threshhold event key in:' + evt_profile.evt_key);

            console.info('TODO: rig property events');

            var condition = "_", key = evt_profile.evt_key;

            if(key.indexOf('[') >= 0 || key.indexOf(']') >= 0)
            {
                key = key.replace('[', '').replace('[', ']');

            }

            var evt_parts = [];

            var run = function()
            {
                console.error('Sprite property check was not set correctly');

            };

            if(key.indexOf('>=') >= 0)
            {
                condition = ">=";


            }
           else if(key.indexOf('<=') >= 0)
            {
                condition = "<=";
            }
           else if(key.indexOf('>') >= 0)
            {
                condition = ">";
            }
          else if(key.indexOf('<') >= 0)
            {
                condition = "<";
            }

            else if(key.indexOf('=') >= 0)
            {
                condition = "=";
            }

            evt_parts = key.split(condition);

            for(var x = 0; x < evt_parts.length; x++)
            {
                evt_parts[x] = evt_parts[x].replace('=', '').replace('=', '').trim(); //remove any trailing equals and trim()

            }

            var mykey, number;

           // alert(evt_parts[0]);

            try{

            mykey = evt_parts[0];

            number = parseFloat(evt_parts[1]);

            }
            catch(e)
            {
                console.log(e);
            }

            console.info('Processing condition with:' + condition);

            switch(condition)
            {

                case ">=":


                    run = function(obj, key){ if(obj[key] >= number){ callback(); } };

                    break;

                case "<=":

                    run = function(obj, key){ if(obj[key] <= number){ callback(); } };

                    break;


                case ">":

                    run = function(obj, key){ if(obj[key] > number){ callback(); } };

                    break;

                case "<":

                    run = function(obj, key){ if(obj[key] < number){ callback(); } };

                    break;

                case "=":

                    run = function(obj, key){ if(obj[key] == number){ callback(); } };

                    break;

            }


            /************
             * Attach update to each member
             *
             * **************/

            var keys = mykey.split('.'), propkey = "";

            this.each(function(ix, item){

                var object = {};

                if(keys.length == 1)
                {
                    object = item;

                    propkey = mykey;

                }
                else if(keys.length == 2)
                {
                    object = item[keys[0]];

                    propkey = keys[1];


                }

                else if(keys.length == 3)
                {
                    object = item[keys[0]][keys[1]];

                    propkey = keys[2];

                }
                else
                {
                    console.error(":length of '.' notation out of range. We use max length of 3 or prop.prop.key.");

                }

                if(typeof item.onUpdate == 'function')
                {


                    var spr = item;

                    item.onUpdate(function(sprite){

                        run(object, propkey);

                    });

                }

            });

        }

    };


    var object_out = {};

    //handle selector / selection of objects:

    if(selector && selector !== '*')
    {

    var s = selector || '';

    console.info('selector:' + s);

    var mainSelector = $Q.before('[', s).trim(), msfChar = mainSelector.substring(0, 1);

    var __targetClassName = "*";

    var output = [];

    var cleanSelectorString = function(str)
    {
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

         var criterion = $Q.between('[', ']', s), cparts = criterion.split('=');

        var  __targetType = "*", __targetName = "*";

  var getParts = function() {

      if(cparts.length >= 2) {

          switch (cparts[0].toLowerCase()) {

              case "name":

                  //get all objects according to name=name

                  console.log('Detected parts in selector:' + jstr(cparts));

                  __targetName =  cleanSelectorString(cparts[1]);

                  break;

              case  "type":

                  console.log('Detected parts in selector:' + jstr(cparts));

                  __targetType =  cleanSelectorString(cparts[1]);

                  break;

          }

      }

      if(cparts.length >= 4) {

          cparts[2] = cparts[2].replace(",", "");

          switch (cparts[2].toLowerCase()) {

              case "name":

                  //get all objects according to name=name

                  console.log('Detected parts in selector:' + jstr(cparts));

                  __targetName =  cleanSelectorString(cparts[3]);

                  break;

              case  "type":

                  console.log('Detected parts in selector:' + jstr(cparts));

                  __targetType =  cleanSelectorString(cparts[3]);

                  break;

          }

      }

      };

  getParts(cparts);


        object_out = GameStack.select(__targetClassName, __targetName, __targetType);
    }
   else if(selector == '*')
    {
        object_out = GameStack.all_objects;

    }

   for(var x in $GFunx)
   {
       object_out[x] = $GFunx[x];

   };

   return object_out;

}


$Q.each = function (obj, callback, complete) {

    for(var x in obj)
    {
        callback(obj);

    }

    if(typeof(complete) == 'function')
    {
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
    return test_str.substring(start_pos, end_pos)
};


$Q.test_selector_method =  function () {
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
    extend: function (evt_key, callback, onFinish) {

        if (evt_key.toLowerCase().indexOf('key_') >= 0) {
            //process this as a key event

            var cleanKey = evt_key.toLowerCase();
            GameStack.InputEvents[cleanKey] = GameStack.InputEvents[cleanKey] || [];
            return GameStack.InputEvents[cleanKey].push({down: callback, up: onFinish});
        } else {

            GameStack.InputEvents[evt_key] = GameStack.InputEvents[evt_key] || [];
            return GameStack.InputEvents[evt_key].push({down: callback, up: onFinish});
        }

    },
    init: function () {


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
            return {x: x, y: y};
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

                    if (typeof (item.down) == 'function') {

                        //   alert('RUNNING');

                        item.down();
                    }


                });
            }

        }


        document.onkeyup = function (e) {

            //    alert(JSON.stringify(GameStack.InputEvents, true, 2));

            var value = 'key_' + String.fromCharCode(e.keyCode).toLowerCase();
            if (GameStack.InputEvents[value] instanceof Array) {

                GameStack.each(GameStack.InputEvents[value], function (ix, item) {

                    if (typeof (item.up) == 'function') {

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

    if (typeof(window._preGameStack_windowLoad) == 'function') {
        window._preGameStack_windowLoad();
    }

    __gameStack.callReady();

}


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



class GameWindow {

    constructor({canvas=false, ctx, sprites, backgrounds, interactives, forces, update, camera}={}) {

        this.sprites = sprites instanceof Array ? sprites : [];

        this.backgrounds = backgrounds instanceof Array ? backgrounds : [];

        this.interactives = interactives instanceof Array ? interactives : [];

        this.forces = forces instanceof Array ? forces : [];

        this.canvas = canvas|| false;

        document.body.style.position = "absolute";

        document.body.style.width = "100%";

        document.body.style.height = "100%";

        if(!this.canvas)
        {
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

        window.onresize = function(){

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

    adjustSize(w, h)
    {



        w = w || this.canvas.clientWidth;

        h = h || this.canvas.clientHeight;

      var c = document.getElementById('#gs-container');

      if(c){c.setAttribute('width', w) };

        if(c){c.setAttribute('height', h) };

        __gameStack.WIDTH = w;

        __gameStack.HEIGHT = h;

        this.canvas.width = w;

        this.canvas.height = h;

    }

    uniques(list) {

        var listout = [];

        $Q.each(list, function (ix, item) {

            if (!listout.indexOf(item.id) >= 0) {

                var str = item.name;

                listout.push({"sprite": item});

            }

        });

        return listout;

    }

    setPlayer(player) {
        this.player = player;

        if (!this.sprites.indexOf(player) >= 0) {
            this.sprites.push(player);

        }

    }

    update() {


        GameStack.each(this.sprites, function (ix, item) {

            if (typeof(item.def_update) == 'function') {



                item.def_update(item);

            }

            if (typeof(item.update) == 'function') {
                item.update(item);

            }



        });



        GameStack.each(this.forces, function (ix, item) {

            if (typeof(item.update) == 'function') {

                item.update(item);

            }

            if (typeof(item.def_update) == 'function') {
                //  console.log('def_update');

                item.def_update(item);

            }

        });



    }



    loadLevelFile(filepath, callback)
    {

        $.getJSON(filepath, function(data) {

            callback(false, data);

        });
    }


    draw() {

        var _gw = this;

        GameStack.each(this.sprites, function (ix, item) {

            Canvas.draw(item, _gw.ctx);

        });

    }

}
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


class TextDisplay {

    constructor(args)
    {
        if(!args)
        {
            args = {};

        }

        this.widthFloat = args.width || args.widthFloat || 0.5;

        this.heightFloat = args.height || args.heightFloat || 0.5;

        this.topFloat = args.top || 0.25;

        this.targetTop = this.get_float_pixels(this.topFloat, document.body.clientHeight);

        this.leftFloat = args.left || 0.25;

        this.targetLeft = this.get_float_pixels(this.leftFloat,document.body.clientWidth);

        this.color = args.color || '#ffffff';

        this.text = args.text || "This is the text";

        this.fontFamily = args.font || args.fontFamily || "GameStack";

        this.fadeIn = args.fadeIn || args.fade || true;

        this.border = "2px inset " + this.color;

        this.fontSize = args.fontSize || "20px";

        this.fromLeft = args.fromLeft || false;

        if(this.fromLeft){ this.leftFloat = 1.5; }

        this.fromRight = args.fromRight || false;

        if(this.fromRight){ this.leftFloat = -0.5; }

        this.fromTop = args.fromTop || false;

        if(this.fromTop){ this.topFloat = -0.5; }

        this.fromBottom = args.fromBottom || false;

        if(this.fromBottom){ this.topFloat = 1.5; }

        this.duration = args.duration || 5000;

        this.stay_duration = Math.round(this.duration / 2);

        this.complete = args.complete || function(){};

    }

    get_float_pixels(float, dimen)
    {
        return  Math.round(dimen * float) + 'px';
    }

    onComplete(fun){

        this.complete = fun;

    }

    show()
    {
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

        this.domElement.style.opacity = this.fadeIn ?  0 : 1.0;

        this.domElement.id = GameStack.create_id();

        document.body.append(this.domElement);


        var __inst = this;

        Velocity(this.domElement, { opacity:1.0, top:this.targetTop, left:this.targetLeft}, { duration: this.duration, easing:"quadratic"});

        window.setTimeout(function(){

            if(__inst.stay_duration >= 1)
            {
                window.setTimeout(function(){

                    Velocity(__inst.domElement, { opacity:0, display:'none'}, { duration:300, easing:"linear"});

                    if(typeof(__inst.complete) == 'function')
                    {
                        __inst.complete();

                    }



                }, __inst.stay_duration);

            }


        }, this.duration);

    }

}

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


class ItemDisplay //show an item display (image with text/number to the right
{
    constructor(args) {

        this.src = args.src || "__NONE";

        this.size = args.size || new Vector3(50, 50);

        this.topFloat = args.top || 0;

        this.targetTop = this.get_float_pixels(this.topFloat, GameStack.HEIGHT);

        this.leftFloat = args.left || 0;

        this.targetLeft = this.get_float_pixels(this.leftFloat,GameStack.WIDTH);

        this.color = args.color || '#ffffff';

        this.text = args.text || "This is the text";

        this.fontFamily = args.font || args.fontFamily || "GameStack";

        this.fontSize = args.fontSize || args.textSize || "15px";

        this.text_id = GameStack.create_id();

        this.id = GameStack.create_id();

        this.img_id = GameStack.create_id();

    }

    setValue(value)
    {
        document.getElementById(this.text_id)
    }

    get_float_pixels(float, dimen)
    {
        return  Math.round(dimen * float) + 'px';
    }


    get_id()
    {
        return  this.id;
    }

    update(v)
    {
        var e = document.getElementById(this.text_id);

        this.text = v + "";

        e.innerText = this.text;
    }

    show() {

        //create an html element

        this.domElement = document.createElement('DIV');

        this.domElement.setAttribute('class', 'gameStack-stats');

        this.domElement.innerHTML+='<img style="float:left;" width="'+this.size.x+'" height="'+this.size.y+'" id="'+this.img_id+'" src="'+this.src+'"/>';

        this.domElement.style.color = this.color;

        this.domElement.innerHTML+='<span id="'+this.text_id+'" style="padding:5px; vertical-align:middle; display:table-cell; font-size:'+this.fontSize+'; color:'+this.color+';">'+this.text+'</span>';

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
}

Gamestack.ItemDisplay = ItemDisplay;

class Bar
{
    constructor(background, border)
    {
        this.background = background;
        var e = document.createElement("SPAN");

        e.style.position = 'fixed';

        e.style.background=this.background;

        e.style.zIndex = "9999";

        e.style.backgroundSize = "100% 100%";

        e.style.backgroundPosition = "center bottom";

        if(border)
        {
            e.style.border = border;

        }


        this.domElement = e;

    }


    width(w)
    {
        this.domElement.style.width = w;

        return this;
    }

    height(h)
    {
        this.domElement.style.height = h;

        return this;
    }

}

Gamestack.Bar = Bar;

class BarFill
{
    constructor(background)
    {
        this.background = background;
        var e = document.createElement("SPAN");

        e.style.background=this.background;

        e.style.position = 'fixed';


        e.style.zIndex = "9995";


        this.domElement = e;

    }

    width(w)
    {
        this.domElement.style.width = w;

        return this;
    }

    height(h)
    {
        this.domElement.style.height = h;

        return this;
    }

}

Gamestack.BarFill = BarFill;

class BarDisplay //show a display bar such as health bar
{
    constructor(args={}) {

        this.border = args.border || "none";

        if(args.fill_src)
        {
            this.fill = new BarFill(args.fill_src).width(args.fill_width || "80px").height(args.fill_height || "10px");
        }
        else
        {
            this.fill = args.fill || new BarFill(args.fill_color || 'green').width(args.fill_width || "80px").height(args.fill_height || "10px");
        }

        if(args.bar_src)
        {
            this.bar = new Bar(args.bar_src, this.border).width(args.bar_width || "80px").height(args.bar_height  || "10px");
        }
        else
        {
            this.bar = new Bar(args.bar_color || 'goldenrod', this.border).width(args.bar_width  || "80px").height(args.bar_height || "10px");
        }


        this.topFloat = args.top || args.topFloat || 0.25;

        this.leftFloat = args.left || args.leftFloat || 0.25;

        this.widthFloat = args.width || args.widthFloat || 0.25;

        this.heightFloat = args.height || args.heightFloat || 0.25;

        document.body.append(this.fill.domElement);

        document.body.append(this.bar.domElement);


    }


    get_float_pixels(float, dimen)
    {
        return  Math.round(dimen * float) + 'px';
    }

    portion_top(v)
    {

        this.fill.domElement.style.top = this.get_float_pixels(v || this.topFloat, GameStack.HEIGHT);

        this.bar.domElement.style.top = this.get_float_pixels(v || this.topFloat, GameStack.HEIGHT);

    }

    portion_left(v)
    {

        this.fill.domElement.style.left = this.get_float_pixels(v || this.leftFloat, GameStack.WIDTH);

        this.bar.domElement.style.left = this.get_float_pixels(v || this.leftFloat, GameStack.WIDTH);

    }

    portion_width(w)
    {

        this.fill.domElement.style.width = this.get_float_pixels(w || this.widthFloat, GameStack.WIDTH);

        this.bar.domElement.style.width = this.get_float_pixels(w || this.widthFloat, GameStack.WIDTH);


    }

    portion_height(h)
    {
        this.fill.domElement.style.height = this.get_float_pixels(h || this.heightFloat, GameStack.HEIGHT);

        this.bar.domElement.style.height = this.get_float_pixels(h || this.heightFloat, GameStack.HEIGHT);

    }

    update(f)
    {
        this.fill.domElement.style.width = this.get_float_pixels(f || 0,  parseFloat(this.bar.domElement.style.width));

    }

}

Gamestack.BarDisplay = BarDisplay;

class VideoDisplay //show a video
{
    constructor({src, size}) {

        this.domElement = undefined;

        this.src = src;

        this.size = new Vector3(size.x, size.y, size.z || 0);

        GameStack.log('VideoDisplay():: TODO: create dom element');

    }

    play() {

    }
}

Gamestack.VideoDisplay = VideoDisplay;













;/* 
=========================================================================
   JSManipulate v1.0 (2011-08-01)

Javascript image filter & effect library

Developed by Joel Besada (http://www.joelb.me)
Demo page: http://www.joelb.me/jsmanipulate

MIT LICENSED (http://www.opensource.org/licenses/mit-license.php)
Copyright (c) 2011, Joel Besada
=========================================================================
*/


/**
 * Contains common filter functions.
 */
function FilterUtils(){
	this.HSVtoRGB = function (h, s, v){
		var r, g, b;
		var i = Math.floor(h * 6);
		var f = h * 6 - i;
		var p = v * (1 - s);
		var q = v * (1 - f * s);
		var t = v * (1 - (1 - f) * s);
		switch(i % 6){
			case 0: r = v; g = t; b = p; break;
			case 1: r = q; g = v; b = p; break;
			case 2: r = p; g = v; b = t; break;
			case 3: r = p; g = q; b = v; break;
			case 4: r = t; g = p; b = v; break;
			case 5: r = v; g = p; b = q; break;
			default: break;
		}
		return [r * 255, g * 255, b * 255];
	};
	this.RGBtoHSV = function (r, g, b){
		r = r/255; g = g/255; b = b/255;
		var max = Math.max(r, g, b);
		var min = Math.min(r, g, b);
		var h, s, v = max;
		var d = max - min;
		s = max === 0 ? 0 : d / max;
		if(max === min){
			h = 0;
		}else{
			switch(max){
				case r: h = (g - b) / d + (g < b ? 6 : 0); break;
				case g: h = (b - r) / d + 2; break;
				case b: h = (r - g) / d + 4; break;
				default: break;
			}
			h /= 6;
		}
		return [h, s, v];
	};
	this.getPixel = function (pixels,x,y,width,height){
		var pix = (y*width + x)*4;
		if (x < 0 || x >= width || y < 0 || y >= height) {
			return [pixels[((this.clampPixel(y, 0, height-1) * width) + this.clampPixel(x, 0, width-1))*4],
			pixels[((this.clampPixel(y, 0, height-1) * width) + this.clampPixel(x, 0, width-1))*4 + 1],
			pixels[((this.clampPixel(y, 0, height-1) * width) + this.clampPixel(x, 0, width-1))*4 + 2],
			pixels[((this.clampPixel(y, 0, height-1) * width) + this.clampPixel(x, 0, width-1))*4 + 3]];
		}
		return [pixels[pix],pixels[pix+1],pixels[pix+2],pixels[pix+3]];
	};
	var haveNextGaussian = false;
	var nextGaussian;
	this.gaussianRandom = function(){
		if(haveNextGaussian){
			haveNextGaussian = false;
			return nextGaussian;
		} else {
			var v1, v2, s;
			do {
				v1 = 2 * Math.random() - 1;
				v2 = 2 * Math.random() - 1;
				s = v1 * v1 + v2 * v2;
			} while (s >= 1 || s === 0);
			var mult = Math.sqrt(-2 * Math.log(s)/s);
			nextGaussian = v2 * mult;
			haveNextGaussian = true;
			return v1 * mult;
		}
	};
	this.clampPixel = function (x,a,b){
		return (x < a) ? a : (x > b) ? b : x;
	};
	this.triangle = function(x){
		var r = this.mod(x, 1);
		return 2*(r < 0.5 ? r : 1-r);
	};
	this.mod = function(a,b){
		var n = parseInt(a/b,10);
		a -= n*b;
		if(a < 0){
			return a + b;
		}
		return a;
	};
	this.mixColors = function(t, rgb1, rgb2){
		var r = this.linearInterpolate(t,rgb1[0],rgb2[0]);
		var g = this.linearInterpolate(t,rgb1[1],rgb2[1]);
		var b = this.linearInterpolate(t,rgb1[2],rgb2[2]);
		var a = this.linearInterpolate(t,rgb1[3],rgb2[3]);
		return [r,g,b,a];
	};

	this.linearInterpolate = function(t,a,b){
		return a + t * (b-a);
	};
	this.bilinearInterpolate = function (x,y,nw,ne,sw,se){
		var m0, m1;
		var r0 = nw[0]; var g0 = nw[1]; var b0 = nw[2]; var a0 = nw[3];
		var r1 = ne[0]; var g1 = ne[1]; var b1 = ne[2]; var a1 = ne[3];
		var r2 = sw[0]; var g2 = sw[1]; var b2 = sw[2]; var a2 = sw[3];
		var r3 = se[0]; var g3 = se[1]; var b3 = se[2]; var a3 = se[3];
		var cx = 1.0 - x; var cy = 1.0 - y;

		m0 = cx * a0 + x * a1;
		m1 = cx * a2 + x * a3;
		var a = cy * m0 + y * m1;

		m0 = cx * r0 + x * r1;
		m1 = cx * r2 + x * r3;
		var r = cy * m0 + y * m1;

		m0 = cx * g0 + x * g1;
		m1 = cx * g2 + x * g3;
		var g = cy * m0 + y * m1;

		m0 = cx * b0 + x * b1;
		m1 = cx * b2 + x * b3;
		var b =cy * m0 + y * m1;
		return [r,g,b,a];
	};
	this.tableFilter = function (inputData, table, width, height){
		for (var y = 0; y < height; y++) {
			for (var x = 0; x < width; x++) {
				var pixel = (y*width + x)*4;
				for(var i = 0; i < 3; i++){
					inputData[pixel+i] = table[inputData[pixel+i]];
				}
			}
		}
	};
	this.convolveFilter = function(inputData, matrix, width, height){
		var outputData = [];
		var rows, cols;
		rows = cols = Math.sqrt(matrix.length);
		var rows2 = parseInt(rows/2,10);
		var cols2 = parseInt(cols/2,10);
		var trace = true;
		for(var y = 0; y < height; y++){
			for (var x = 0; x < width; x++){
				var pixel = (y*width + x)*4;
				var r = 0, g = 0, b = 0;
				for(var row = -rows2; row <= rows2; row++){
					var iy = y+row;
					var ioffset;
					if (0 <= iy && iy < height) {
						ioffset = iy*width;
					} else {
						ioffset = y*width;
					}
					var moffset = cols*(row+rows2)+cols2;
					for (var col = -cols2; col <= cols2; col++) {
						var f = matrix[moffset+col];
						if (f !== 0) {
							var ix = x+col;
							if (!(0 <= ix && ix < width)) {
								ix = x;
							}
							var iPixel = (ioffset+ix)*4;
							r += f * inputData[iPixel];
							g += f * inputData[iPixel+1];
							b += f * inputData[iPixel+2];
						}
					}
				}
				outputData[pixel] = parseInt(r+0.5,10);
				outputData[pixel+1] = parseInt(g+0.5,10);
				outputData[pixel+2] = parseInt(b+0.5,10);
				outputData[pixel+3] = inputData[pixel+3];
			}
		}
		for(var k = 0; k < outputData.length; k++){
			inputData[k] = outputData[k];
		}
	};
	this.transformFilter = function(inputData, transformInverse, width, height){
		var out = [];
		var outputData = [];
		for(var j = 0; j < inputData.length; j++){
			outputData[j] = inputData[j];
		}
		for(var y = 0; y < height; y++){
			for (var x = 0; x < width; x++){
				var pixel = (y*width + x)*4;
				transformInverse.apply(this,[x,y,out]);
				var srcX = Math.floor(out[0]);
				var srcY = Math.floor(out[1]);
				var xWeight = out[0]-srcX;
				var yWeight = out[1]-srcY;
				var nw,ne,sw,se;
				if(srcX >= 0 && srcX < width-1 && srcY >= 0 && srcY < height-1){
					var i = (width*srcY + srcX)*4;
					nw = [inputData[i],inputData[i+1],inputData[i+2],inputData[i+3]];
					ne = [inputData[i+4],inputData[i+5],inputData[i+6],inputData[i+7]];
					sw = [inputData[i+width*4],inputData[i+width*4+1],inputData[i+width*4+2],inputData[i+width*4+3]];
					se = [inputData[i+(width + 1)*4],inputData[i+(width + 1)*4+1],inputData[i+(width + 1)*4+2],inputData[i+(width + 1)*4+3]];
				} else {
					nw = this.getPixel( inputData, srcX, srcY, width, height );
					ne = this.getPixel( inputData, srcX+1, srcY, width, height );
					sw = this.getPixel( inputData, srcX, srcY+1, width, height );
					se = this.getPixel( inputData, srcX+1, srcY+1, width, height );
				}
				var rgba = this.bilinearInterpolate(xWeight,yWeight,nw,ne,sw,se);
				outputData[pixel] = rgba[0];
				outputData[pixel + 1] = rgba[1];
				outputData[pixel + 2] = rgba[2];
				outputData[pixel + 3] = rgba[3];
			}
		}
		for(var k = 0; k < outputData.length; k++){
			inputData[k] = outputData[k];
		}
	};
}
/**
 * Blurs the image with Gaussian blur.
 */
function BlurFilter(){
	this.name = "Blur";
	this.isDirAnimatable = false;
	this.defaultValues = {
		amount : 3
	};
	this.valueRanges = {
		amount : {min:0, max:10}
	};
	this.filter = function(input,values){
		var width = input.width;
		var width4 = width << 2;
		var height = input.height;
		var inputData = input.data;
		var q;
		var amount = values.amount;
		if (amount < 0.0) {
			amount = 0.0;
		}
		if (amount >= 2.5) {
			q = 0.98711 * amount - 0.96330; 
		} else if (amount >= 0.5) {
			q = 3.97156 - 4.14554 * Math.sqrt(1.0 - 0.26891 * amount);
		} else {
			q = 2 * amount * (3.97156 - 4.14554 * Math.sqrt(1.0 - 0.26891 * 0.5));
		}
		var qq = q * q;
		var qqq = qq * q;
		var b0 = 1.57825 + (2.44413 * q) + (1.4281 * qq ) + (0.422205 * qqq);
		var b1 = ((2.44413 * q) + (2.85619 * qq) + (1.26661 * qqq)) / b0;
		var b2 = (-((1.4281 * qq) + (1.26661 * qqq))) / b0;
		var b3 = (0.422205 * qqq) / b0; 
		var bigB = 1.0 - (b1 + b2 + b3); 
		var c = 0;
		var index;
		var indexLast;
		var pixel;
		var ppixel;
		var pppixel;
		var ppppixel;
		for (c = 0; c < 3; c++) {
			for (var y = 0; y < height; y++) {
				index = y * width4 + c;
				indexLast = y * width4 + ((width - 1) << 2) + c;
				pixel = inputData[index];
				ppixel = pixel;
				pppixel = ppixel;
				ppppixel = pppixel;
				for (; index <= indexLast; index += 4) {
					pixel = bigB * inputData[index] + b1 * ppixel + b2 * pppixel + b3 * ppppixel;
					inputData[index] = pixel; 
					ppppixel = pppixel;
					pppixel = ppixel;
					ppixel = pixel;
				}
				index = y * width4 + ((width - 1) << 2) + c;
				indexLast = y * width4 + c;
				pixel = inputData[index];
				ppixel = pixel;
				pppixel = ppixel;
				ppppixel = pppixel;
				for (; index >= indexLast; index -= 4) {
					pixel = bigB * inputData[index] + b1 * ppixel + b2 * pppixel + b3 * ppppixel;
					inputData[index] = pixel;
					ppppixel = pppixel;
					pppixel = ppixel;
					ppixel = pixel;
				}
			}
		}
		for (c = 0; c < 3; c++) {
			for (var x = 0; x < width; x++) {
				index = (x << 2) + c;
				indexLast = (height - 1) * width4 + (x << 2) + c;
				pixel = inputData[index];
				ppixel = pixel;
				pppixel = ppixel;
				ppppixel = pppixel;
				for (; index <= indexLast; index += width4) {
					pixel = bigB * inputData[index] + b1 * ppixel + b2 * pppixel + b3 * ppppixel;
					inputData[index] = pixel;
					ppppixel = pppixel;
					pppixel = ppixel;
					ppixel = pixel;
				} 
				index = (height - 1) * width4 + (x << 2) + c;
				indexLast = (x << 2) + c;
				pixel = inputData[index];
				ppixel = pixel;
				pppixel = ppixel;
				ppppixel = pppixel;
				for (; index >= indexLast; index -= width4) {
					pixel = bigB * inputData[index] + b1 * ppixel + b2 * pppixel + b3 * ppppixel;
					inputData[index] = pixel;
					ppppixel = pppixel;
					pppixel = ppixel;
					ppixel = pixel;
				}
			}
		} 
	};
}
/**
 * Adjusts the brightness of the image by going over to HSV values.
 * Negative values decrease brightness while positive values increase brightness.
 */
function BrightnessFilter(){
	this.name = "Brightness";
	this.isDirAnimatable = true;
	this.defaultValues = {
		amount : 0.0
	};
	this.valueRanges = {
		amount : {min:-1.0, max:1.0}
	};
	var filterUtils = new FilterUtils();
	this.filter = function(input,values){
		var width = input.width, height = input.height;
		var inputData = input.data;
		if(values === undefined){ values = this.defaultValues; }
		var amount = (values.amount === undefined) ? this.defaultValues.amount : values.amount;
		for (var y = 0; y < height; y++) {
			for (var x = 0; x < width; x++) {
				var pixel = (y*width + x)*4;
				var hsv = filterUtils.RGBtoHSV(inputData[pixel],inputData[pixel+1],inputData[pixel+2]);
				hsv[2] += amount;
				if(hsv[2] < 0){
					hsv[2] = 0;
				} else if (hsv[2] > 1){ 
					hsv[2] = 1;
				}
				var rgb = filterUtils.HSVtoRGB(hsv[0],hsv[1],hsv[2]);
				for(var i = 0; i < 3; i++){
					inputData[pixel+i] = rgb[i];
				}
			}
		}
	};
}
/**
 * Embosses the edges of the image.
 * This filter takes no parameters but can be applied several times for
 * further effect.
 */
function BumpFilter(){
	this.name = "Bump";
	this.isDirAnimatable = true;
	this.defaultValues = {
	};
	this.valueRanges = {
	};
	var filterUtils = new FilterUtils();
	this.filter = function(input,values){
		var width = input.width, height = input.height;
		var inputData = input.data;
		var matrix = [-1,-1, 0,
					  -1, 1, 1,
					   0, 1, 1];
		filterUtils.convolveFilter(inputData,matrix,width,height);
	};
}
/**
 * Smears out the image with circular shapes to create a painting style effect.
 * The mix values sets the intensity of the effect.
 * NOTE: This filter can be very slow, especially at higher densities/sizes. Use with caution.
 */
function CircleSmearFilter(){
	this.name = "Circle Smear";
	this.isDirAnimatable = false;
	this.defaultValues = {
		size : 4,
		density : 0.5,
		mix : 0.5
	};
	this.valueRanges = {
		size : {min:1, max:10},
		density : {min:0.0, max:1.0},
		mix : {min:0.0, max:1.0}
	};

	var filterUtils = new FilterUtils();
	this.filter = function(input,values){
		var width = input.width, height = input.height;
		var inputData = input.data;
		var outputData = [];
		 for(var j = 0; j < inputData.length; j++){
			outputData[j] = inputData[j];
		}
		if(values === undefined){ values = this.defaultValues; }
		var size = (values.size === undefined) ? this.defaultValues.size : values.size;
		if(size < 1){ size = 1;}
		size = parseInt(size,10);
		var density = (values.density === undefined) ? this.defaultValues.density : values.density;
		var mix = (values.mix === undefined) ? this.defaultValues.mix : values.mix;
		var radius = size+1;
		var radius2 = radius*radius;
		var numShapes = parseInt(2*density/30*width*height / 2,10);
		for(var i = 0; i < numShapes; i++){
			var sx = (Math.random()*Math.pow(2,32) & 0x7fffffff) % width;
			var sy = (Math.random()*Math.pow(2,32) & 0x7fffffff) % height;
			var rgb2 = [inputData[(sy*width+sx)*4],inputData[(sy*width+sx)*4+1],inputData[(sy*width+sx)*4+2],inputData[(sy*width+sx)*4+3]];
			for(var x = sx - radius; x < sx + radius + 1; x++){
				for(var y = sy - radius; y < sy + radius + 1; y++){
					var f = (x - sx) * (x - sx) + (y - sy) * (y - sy);
					if (x >= 0 && x < width && y >= 0 && y < height && f <= radius2) {
						var rgb1 = [outputData[(y*width+x)*4],outputData[(y*width+x)*4+1],outputData[(y*width+x)*4+2],outputData[(y*width+x)*4+3]];
						var mixedRGB = filterUtils.mixColors(mix,rgb1,rgb2);
						for(var k = 0; k < 3; k++){
							outputData[(y*width+x)*4+k] = mixedRGB[k];
						}
					}
				}
			}
		}
		for(var l = 0; l < outputData.length; l++){
			inputData[l] = outputData[l];
		}
	};
}
/**
 * Adjusts the contrast of the image.
 */
function ContrastFilter(){
	this.name = "Contrast";
	this.isDirAnimatable = true;
	this.defaultValues = {
		amount : 1.0
	};
	this.valueRanges = {
		amount : {min:0.0, max:2.0}
	};
	if(!FilterUtils){
			if(console){
				console.error("Unable to find filterutils.js, please include this file! (Required by " + this.name + " filter)");
			}
			return;
		}
	var filterUtils = new FilterUtils();
	this.filter = function(input,values){
		var width = input.width, height = input.height;
		var inputData = input.data;
		if(values === undefined){ values = this.defaultValues; }
		var amount = (values.amount === undefined) ? this.defaultValues.amount : values.amount;
		if(amount < 0){
			amount = 0.0;
		}
		var table = [];

		for(var i = 0; i < 256; i++){
			table[i] = parseInt(255 * (((i/255)-0.5)*amount+0.5),10);
		}
		filterUtils.tableFilter(inputData,table,width,height);
	};
}
/**
 * Smears out the image with cross shapes to create a painting style effect.
 * The mix values sets the intensity of the effect.
 */
function CrossSmearFilter(){
	this.name = "Cross Smear";
	this.isDirAnimatable = false;
	this.defaultValues = {
		distance : 8,
		density : 0.5,
		mix : 0.5
	};
	this.valueRanges = {
		distance : {min:0, max:30},
		density : {min:0.0, max:1.0},
		mix : {min:0.0, max:1.0}
	};

	var filterUtils = new FilterUtils();
	this.filter = function(input,values){
		var width = input.width, height = input.height;
		var inputData = input.data;
		var outputData = [];
		 for(var j = 0; j < inputData.length; j++){
			outputData[j] = inputData[j];
		}
		if(values === undefined){ values = this.defaultValues; }
		var distance = (values.distance === undefined) ? this.defaultValues.distance : values.distance;
		if(distance < 0){ distance = 0;}
		distance = parseInt(distance,10);
		var density = (values.density === undefined) ? this.defaultValues.density : values.density;
		var mix = (values.mix === undefined) ? this.defaultValues.mix : values.mix;
		var numShapes = parseInt(2*density*width * height / (distance + 1),10);
		for(var i = 0; i < numShapes; i++){
			var x = (Math.random()*Math.pow(2,32) & 0x7fffffff) % width;
			var y = (Math.random()*Math.pow(2,32) & 0x7fffffff) % height;
			var length = (Math.random()*Math.pow(2,32)) % distance + 1;
			var rgb2 = [inputData[(y*width+x)*4],inputData[(y*width+x)*4+1],inputData[(y*width+x)*4+2],inputData[(y*width+x)*4+3]];
			var rgb1;
			var mixedRGB;
			var k;
			for (var x1 = x-length; x1 < x+length+1; x1++) {
				if(x1 >= 0 && x1 < width){
					rgb1 = [outputData[(y*width+x1)*4],outputData[(y*width+x1)*4+1],outputData[(y*width+x1)*4+2],outputData[(y*width+x1)*4+3]];
					mixedRGB = filterUtils.mixColors(mix,rgb1,rgb2);
					for(k = 0; k < 3; k++){
						outputData[(y*width+x1)*4+k] = mixedRGB[k];
					}
				}

			} 
			for (var y1 = y-length; y1 < y+length+1; y1++) {
				if(y1 >= 0 && y1 < height){
					rgb1 = [outputData[(y1*width+x)*4],outputData[(y1*width+x)*4+1],outputData[(y1*width+x)*4+2],outputData[(y1*width+x)*4+3]];
					mixedRGB = filterUtils.mixColors(mix,rgb1,rgb2);
					for(k = 0; k < 3; k++){
						outputData[(y1*width+x)*4+k] = mixedRGB[k];
					}
				}

			} 
		}
		for(var l = 0; l < outputData.length; l++){
			inputData[l] = outputData[l];
		}
	};
}
/**
 * Diffuses the image creating a frosted glass effect.
 */
function DiffusionFilter(){
	this.name = "Diffusion";
	this.isDirAnimatable = false;
	this.defaultValues = {
		scale: 4
	}; 
	this.valueRanges = {
		scale: {min: 1, max: 100}
	};

	var filterUtils = new FilterUtils();
	this.filter = function (input, values){
		var width = input.width, height = input.height;
		var inputData = input.data;
		if(values === undefined){ values = this.defaultValues; }
		var scale = (values.scale === undefined) ? this.defaultValues.scale : values.scale; 
		var out = [];
		var outputData = [];
		var sinTable = [];
		var cosTable = [];
		for(var i = 0; i < 256; i++){
			var angle = Math.PI*2*i/256;
			sinTable[i] = scale*Math.sin(angle);
			cosTable[i] = scale*Math.cos(angle);
		}
		transInverse = function (x,y,out){
			var angle = parseInt(Math.random() * 255,10);
			var distance = Math.random();
			out[0] = x + distance * sinTable[angle];
			out[1] = y + distance * cosTable[angle];
		};
		filterUtils.transformFilter(inputData,transInverse,width,height);
  };
}
/**
 * Dithers the image to the specified number of colors. Setting color to false
 * grayscales the image.
 */
function DitherFilter(){
	this.name = "Dither";
	this.isDirAnimatable = false;
	this.defaultValues = {
		levels : 3,
		color : true
	};
	this.valueRanges = {
		levels : {min:2, max:30},
		color : {min:false, max:true}
	};

	var filterUtils = new FilterUtils();
	this.filter = function(input,values){
		var width = input.width, height = input.height;
		var inputData = input.data;
		var outputData = [];
		var i, j;
		for (j=0; j < inputData.length; j++) {
			outputData[j] = 0;
		}
		if(values === undefined){ values = this.defaultValues; }
		var levels = (values.levels === undefined) ? this.defaultValues.levels : values.levels;
		var color = (values.color === undefined) ? this.defaultValues.color : values.color;
		if(levels <= 1){
			levels = 1;
		}
		var matrix = [0,0,0,
					  0,0,7,
					  3,5,1];
		var sum = 7+3+5+1;
		var index = 0;
		var map = [];
		
		for (i=0; i < levels; i++) {
			map[i] = parseInt(255* i / (levels-1),10);
		}
		var div = [];
		for (i=0; i < 256; i++) {
			div[i] = parseInt(levels*i / 256,10);
		}
	  	for (var y = 0; y < height; y++) {
			var reverse = ((y & 1) == 1);
			var direction;
			if(reverse){
				index = (y*width+width-1)*4;
				direction = -1;
			} else {
				index = y*width*4;
				direction = 1;
			}
			for (var x = 0; x < width; x++) {
				var r1 = inputData[index]; var g1 = inputData[index+1]; var b1 = inputData[index+2];
				if(!color){
					r1 = g1 = b1 = parseInt((r1+g1+b1) / 3,10);
				}
				var r2 = map[div[r1]];var g2 = map[div[g1]];var b2 = map[div[b1]];

				outputData[index] = r2; outputData[index + 1] = g2; outputData[index+2] = b2; outputData[index+3] = inputData[index+3];

				var er = r1-r2; var eg = g1-g2; var eb = b1-b2;

				for (i = -1; i <= 1; i++) {
					var iy = i+y;
					if (0 <= iy && iy < height) {
						for (j = -1; j <= 1; j++) {
							var jx = j+x;
							if (0 <= jx && jx < width) {
								var w;
								if (reverse){
									w = matrix[(i+1)*3-j+1];
								} else{
									w = matrix[(i+1)*3+j+1];
								}
								if (w !== 0) {
									var k = (reverse) ? index - j*4 : index + j*4;
									r1 = inputData[k]; g1 = inputData[k+1]; b1 = inputData[k+2];
									var factor = w/sum;
									r1 += er * factor; g1 += eg * factor; b1 += eb * factor;
									inputData[k] = r1; inputData[k+1] = g1 ;inputData[k+2] = b1;
								}
							}
						}
					}
				}
				index += direction*4;
			}
		}
		for(j = 0; j < outputData.length; j++){
			inputData[j] = outputData[j];
		}
	};
}
/** 
 * Highlights the edges of the image.
 */
function EdgeFilter(){
	this.name = "Edge Detection";
	this.isDirAnimatable = true;
	this.defaultValues = {
	};
	this.valueRanges = {
	};
	var matrixH = [-1,-2,-1,
					0, 0, 0,
					1, 2, 1];
	var matrixV = [-1, 0, 1,
				   -2, 0, 2,
				   -1, 0, 1];
	this.filter = function(input,values){
		var width = input.width, height = input.height;
		var inputData = input.data;
		var outputData = [];
		for (var y = 0; y < height; y++) {
			for (var x = 0; x < width; x++) {
				var pixel = (y*width + x)*4;
				var rh = 0; gh = 0; bh = 0;
				var rv = 0; gv = 0; bv = 0;
				for(var row = -1; row <= 1; row++){
					var iy = y+row;
					var ioffset;
					if(iy >= 0 && iy < height){
						ioffset = iy*width*4;
					} else {
						ioffset = y*width*4;
					}
					var moffset = 3*(row+1)+1;
					for(var col = -1; col <= 1; col++){
						var ix = x+col;
						if(!(ix >= 0 && ix < width)){
							ix = x;
						}
						ix *= 4;
						var r = inputData[ioffset+ix];
						var g = inputData[ioffset+ix+1];
						var b = inputData[ioffset+ix+2];
						var h = matrixH[moffset+col];
						var v = matrixV[moffset+col];
						rh += parseInt(h*r,10);
						bh += parseInt(h*g,10);
						gh += parseInt(h*b,10);
						rv += parseInt(v*r,10);
						gv += parseInt(v*g,10);
						bv += parseInt(v*b,10);
					}
				}
				r = parseInt(Math.sqrt(rh*rh + rv*rv) / 1.8,10);
				g = parseInt(Math.sqrt(gh*gh + gv*gv) / 1.8,10);
				b = parseInt(Math.sqrt(bh*bh + bv*bv) / 1.8,10);

				outputData[pixel] = r;
				outputData[pixel+1] = g;
				outputData[pixel+2] = b;
				outputData[pixel+3] = inputData[pixel+3];
			}   
		}
		for(var k = 0; k < outputData.length; k++){
			inputData[k] = outputData[k];
		}
	};
}
/**
 * Embosses the image with a simulated light source. 
 * Angle and elevation sets the position of the light.
 */
function EmbossFilter(){
	this.name = "Emboss";
	this.isDirAnimatable = false;
	this.defaultValues = {
		height : 1,
		angle : 135,
		elevation : 30
	};
	this.valueRanges = {
		height : {min:1, max:10},
		angle : {min:0, max:360},
		elevation : {min:0, max:180}
	};
	this.filter = function(input,values){
		var width = input.width, height = input.height;
		var inputData = input.data;
		if(values === undefined){ values = this.defaultValues; }
		var bumpHeight = (values.height === undefined) ? this.defaultValues.height : values.height;
		var angle = (values.angle === undefined) ? this.defaultValues.angle : values.angle;
		var elevation = (values.elevation === undefined) ? this.defaultValues.elevation : values.elevation; 
		angle = angle / 180 * Math.PI;
		elevation = elevation / 180 * Math.PI;
		var width45 = 3 * bumpHeight;
		var pixelScale = 255.9;

		var bumpPixels = [];
		var bumpMapWidth = width;
		var bumpMapHeight = height;
		for(var i = 0; i < inputData.length; i+=4){
			bumpPixels[i/4] = (inputData[i] + inputData[i+1] + inputData[i+2])/3;
		}
		var Nx, Ny, Nz, Lx, Ly, Lz, Nz2, NzLz, NdotL;
		var shade, background;

		Lx = parseInt(Math.cos(angle) * Math.cos(elevation) * pixelScale,10);
		Ly = parseInt(Math.sin(angle) * Math.cos(elevation) * pixelScale,10);
		Lz = parseInt(Math.sin(elevation) * pixelScale,10);

		Nz = parseInt(6 * 255 / width45,10);
		Nz2 = Nz * Nz;
		NzLz = Nz * Lz;
		background = Lz;

		var bumpIndex = 0;
		
		for (var y = 0; y < height; y++, bumpIndex += bumpMapWidth) {
			var s1 = bumpIndex;
			var s2 = s1 + bumpMapWidth;
			var s3 = s2 + bumpMapWidth;
			for (var x = 0; x < width; x++, s1++, s2++, s3++) {
				var pixel = (y*width + x)*4;
				if (y !== 0 && y < height-2 && x !== 0 && x < width-2) {
					Nx = bumpPixels[s1-1] + bumpPixels[s2-1] + bumpPixels[s3-1] - bumpPixels[s1+1] - bumpPixels[s2+1] - bumpPixels[s3+1];
					Ny = bumpPixels[s3-1] + bumpPixels[s3] + bumpPixels[s3+1] - bumpPixels[s1-1] - bumpPixels[s1] - bumpPixels[s1+1];
					if (Nx === 0 && Ny === 0){
						shade = background;
					} else if ((NdotL = Nx*Lx + Ny*Ly + NzLz) < 0){
						shade = 0;
					} else {
						shade = parseInt(NdotL / Math.sqrt(Nx*Nx + Ny*Ny + Nz2),10);
					}
				} else {
					shade = background;
				}
				inputData[pixel] = inputData[pixel+1] = inputData[pixel+2] = shade;
			}   
		}
	};
}
/**
 * Adjust simulated exposure values on the image.
 */
function ExposureFilter(){
	this.name = "Exposure";
	this.isDirAnimatable = true;
	this.defaultValues = {
		exposure : 1.0
	};
	this.valueRanges = {
		exposure : {min:0, max:5}
	};

	var filterUtils = new FilterUtils();
	this.filter = function(input,values){
		var width = input.width, height = input.height;
		var inputData = input.data;
		if(values === undefined){ values = this.defaultValues; }
		var exposure = (values.exposure === undefined) ? this.defaultValues.exposure : values.exposure;
		var table = [];
		for(var i = 0; i < 256; i++){
			table[i] = parseInt(255 *(1-Math.exp(-(i/255) * exposure)),10);
		}
		filterUtils.tableFilter(inputData, table, width, height);
	};
}
/**
 * Adjusts the gain and bias of the image. Gain alters the contrast while bias biases
 * colors towards lighter or darker.
 */
function GainFilter(){
	this.name = "Gain/Bias";
	this.isDirAnimatable = true;
	this.defaultValues = {
		gain: 0.5,
		bias: 0.5
	};
	this.valueRanges = {
		gain: {min:0.0, max:1.0},
		bias: {min:0.0, max:1.0}
	};
	var table = [];

	var filterUtils = new FilterUtils();
	this.filter = function(input,values){
		var width = input.width, height = input.height;
		var inputData = input.data;
		if(values === undefined){ values = this.defaultValues; }
		var gain = (values.gain === undefined) ? this.defaultValues.gain : values.gain;
		var bias = (values.bias === undefined) ? this.defaultValues.bias : values.bias;
		
		var table = [];
		
		for(var i = 0; i < 256; i++){
			var val = i/255;
			var k = (1/gain-2) * (1-2*val);
			val = (val < 0.5) ? val/(k+1) : (k-val)/(k-1);
			val /= (1/bias-2)*(1-val)+1; 
			table[i] = parseInt(255 * val,10);
		}
		filterUtils.tableFilter(inputData,table,width,height);
	};
}
/**
 * Adjusts the gamma values of the image. Values over 1 increase the gamma while values over 0 decrease gamma.
 */
function GammaFilter(){
	this.name = "Gamma";
	this.isDirAnimatable = true;
	this.defaultValues = {
		amount : 1.0
	};
	this.valueRanges = {
		amount : {min:0.0, max:2.0}
	};
	this.filter = function(input,values){
		var width = input.width, height = input.height;
		var inputData = input.data;
		if(values === undefined){ values = this.defaultValues; }
		var amount = (values.amount === undefined) ? this.defaultValues.amount : values.amount;
		if(amount < 0){
			amount = 0.0;
		}
		if(!FilterUtils){
			if(console){
				console.error("Unable to find filterutils.js, please include this file! (Required by " + this.name + " filter)");
			}
			return;
		}
		var filterUtils = new FilterUtils();
		var table = [];
		for(var i = 0; i < 256; i++){
			table[i] = 255 * Math.pow(i/255, 1/amount) + 0.5;
		}
		filterUtils.tableFilter(inputData,table,width,height);
	};
}
/**
 * Sets the image to grayscale.
 */
function GrayscaleFilter(){
	this.name = "Grayscale";
	this.isDirAnimatable = true;
	this.defaultValues = {
	};
	this.valueRanges = {
	};
	this.filter = function(input,values){
		var width = input.width, height = input.height;
		var inputData = input.data;
		for (var y = 0; y < height; y++) {
			for (var x = 0; x < width; x++) {
				var pixel = (y*width + x)*4;
				var luma = inputData[pixel]*0.3 + inputData[pixel+1]*0.59 + inputData[pixel+2]*0.11;
				inputData[pixel] = inputData[pixel+1] = inputData[pixel+2] = luma;
			}   
		}
	};
}
/**
 * Adjusts the hue of the image by going over to HSV values.
 */
function HueFilter(){
	this.name = "Hue";
	this.isDirAnimatable = true;
	this.defaultValues = {
		amount : 0.0
	};
	this.valueRanges = {
		amount : {min:-1.0, max:1.0}
	};

	var filterUtils = new FilterUtils();
	this.filter = function(input,values){
		var width = input.width, height = input.height;
		var inputData = input.data;
		if(values === undefined){ values = this.defaultValues; }
		var amount = (values.amount === undefined) ? this.defaultValues.amount : values.amount;
		for (var y = 0; y < height; y++) {
			for (var x = 0; x < width; x++) {
				var pixel = (y*width + x)*4;
				var hsv = filterUtils.RGBtoHSV(inputData[pixel],inputData[pixel+1],inputData[pixel+2]);
				hsv[0] += amount;
				while(hsv[0] < 0){
					hsv[0] += 360;
				}
				var rgb = filterUtils.HSVtoRGB(hsv[0],hsv[1],hsv[2]);
				for(var i = 0; i < 3; i++){
					inputData[pixel+i] = rgb[i];
				}
			}   
		}
	};
}
/**
 * Inverts the colors of the image.
 */
function InvertFilter(){
	this.name = "Invert";
	this.isDirAnimatable = true;
	this.defaultValues = {
	};
	this.valueRanges = {
	};
	this.filter = function(input,values){
		var width = input.width, height = input.height;
		var inputData = input.data;
		for (var y = 0; y < height; y++) {
			for (var x = 0; x < width; x++) {
				var pixel = (y*width + x)*4;
				for(var i = 0; i < 3; i++){
					inputData[pixel+i] = 255 - inputData[pixel+i];
				}
			}   
		}
	};
}
/**
 * Creates a kaleidoscope effect on the image. CenterX and CenterY specify the
 * position in terms of ratios of width and height.
 */
function KaleidoscopeFilter(){
	this.name = "Kaleidoscope";
	this.isDirAnimatable = false;
	this.defaultValues = {
		angle : 0,
		rotation : 0,
		sides : 3,
		centerX : 0.5,
		centerY : 0.5
	};
	this.valueRanges = {
		angle : {min: 0, max: 360},
		rotation : {min: 0, max: 360},
		sides : {min: 1, max: 30},
		centerX : {min: 0.0, max:1.0},
		centerY : {min: 0.0, max:1.0}
	};

	var filterUtils = new FilterUtils();
	this.filter = function (input, values){
		var width = input.width, height = input.height;
		var inputData = input.data;
		if(values === undefined){ values = this.defaultValues; }
		var angle = (values.angle === undefined) ? this.defaultValues.angle : values.angle; 
		var rotation = (values.rotation === undefined) ? this.defaultValues.rotation : values.rotation; 
		var sides = (values.sides === undefined) ? this.defaultValues.sides : values.sides; 
		var centerX = (values.centerX === undefined) ? this.defaultValues.centerX : values.centerX; 
		var centerY = (values.centerY === undefined) ? this.defaultValues.centerY : values.centerY; 
		var iCenterX = width * centerX; var iCenterY = height * centerY;
		angle = angle/180 * Math.PI;
		rotation = rotation/180 * Math.PI;
		var transInverse = function(x,y,out){
			var dx = x - iCenterX;
			var dy = y - iCenterY;
			var r = Math.sqrt(dx*dx + dy*dy);
			var theta = Math.atan2(dy,dx) - angle - rotation;
			theta = filterUtils.triangle(theta/Math.PI*sides*0.5);
			theta += angle;
			out[0] = iCenterX + r*Math.cos(theta);
			out[1] = iCenterY + r*Math.sin(theta);
		};
		filterUtils.transformFilter(inputData,transInverse,width,height);
	};
}
/**
 * Applies a fisheye lens distortion effect on the image. CenterX and CenterY specify the
 * position in terms of ratios of width and height.
 */
function LensDistortionFilter(){
	this.name = "Lens Distortion";
	this.isDirAnimatable = false;
	this.defaultValues = {
		refraction : 1.5,
		radius : 50,
		centerX : 0.5,
		centerY : 0.5
	};
	this.valueRanges = {
		refraction : {min: 1, max: 10},
		radius : {min: 1, max: 200},
		centerX : {min: 0.0, max:1.0},
		centerY : {min: 0.0, max:1.0}
	};

	var filterUtils = new FilterUtils();

	this.filter = function (input, values){
		var width = input.width, height = input.height;
		var inputData = input.data;
		if(values === undefined){ values = this.defaultValues; }
		var refraction = (values.refraction === undefined) ? this.defaultValues.refraction : values.refraction; 
		var centerX = (values.centerX === undefined) ? this.defaultValues.centerX : values.centerX; 
		var centerY = (values.centerY === undefined) ? this.defaultValues.centerY : values.centerY; 
		var radius = (values.radius === undefined) ? this.defaultValues.radius : values.radius;  
		var radius2 = radius*radius;
		var iCenterX = width * centerX; var iCenterY = height * centerY;
		var transInverse = function(x,y,out){
			var dx = x-iCenterX;
			var dy = y-iCenterY;
			var x2 = dx*dx;
			var y2 = dy*dy;
			if (y2 >= (radius2 - (radius2*x2)/radius2)) {
				out[0] = x;
				out[1] = y;
			} else {
				var rRefraction = 1.0 / refraction;

				var z = Math.sqrt((1.0 - x2/radius2 - y2/radius2) * radius2);
				var z2 = z*z;

				var xAngle = Math.acos(dx / Math.sqrt(x2+z2));
				var angle1 = Math.PI/2 - xAngle;
				var angle2 = Math.asin(Math.sin(angle1)*rRefraction);
				angle2 = Math.PI/2 - xAngle - angle2;
				out[0] = x - Math.tan(angle2)*z;

				var yAngle = Math.acos(dy / Math.sqrt(y2+z2));
				angle1 = Math.PI/2 - yAngle;
				angle2 = Math.asin(Math.sin(angle1)*rRefraction);
				angle2 = Math.PI/2 - yAngle - angle2;
				out[1] = y - Math.tan(angle2)*z;
			}
		};
		filterUtils.transformFilter(inputData,transInverse,width,height);
	};
}
/**
 * Smears out the image with line shapes to create a painting style effect. Mix specifies
 * the intensity of the effect.
 */
function LineSmearFilter(){
	this.name = "Line Smear";
	this.isDirAnimatable = false;
	this.defaultValues = {
		distance : 8,
		density : 0.5,
		angle : 0,
		mix : 0.5
	};
	this.valueRanges = {
		distance : {min:1, max:30},
		density : {min:0.0, max:1.0},
		angle : {min:0, max:360},
		mix : {min:0.0, max:1.0}
	};

	var filterUtils = new FilterUtils();
	this.filter = function(input,values){
		var width = input.width, height = input.height;
		var inputData = input.data;
		var outputData = [];
		var k;
		for(k = 0; k < inputData.length; k++){
			outputData[k] = inputData[k];
		}
		if(values === undefined){ values = this.defaultValues; }
		var distance = (values.distance === undefined) ? this.defaultValues.distance : values.distance;
		if(distance < 1){ distance = 1;}
		distance = parseInt(distance,10);
		var density = (values.density === undefined) ? this.defaultValues.density : values.density;
		var angle = (values.angle === undefined) ? this.defaultValues.angle : values.angle;
		var mix = (values.mix === undefined) ? this.defaultValues.mix : values.mix;
		angle = angle/180*Math.PI;
		var sinAngle = Math.sin(angle);
		var cosAngle = Math.cos(angle);
		var numShapes = parseInt(2*density*width*height / 2,10);
		for(var i = 0; i < numShapes; i++){
			var sx = (Math.random()*Math.pow(2,32) & 0x7fffffff) % width;
			var sy = (Math.random()*Math.pow(2,32) & 0x7fffffff) % height;
			var length = (Math.random()*Math.pow(2,32) & 0x7fffffff) % distance + 1;
			var rgb2 = [inputData[(sy*width+sx)*4],inputData[(sy*width+sx)*4+1],inputData[(sy*width+sx)*4+2],inputData[(sy*width+sx)*4+3]];
			var dx = parseInt(length*cosAngle,10);
			var dy = parseInt(length*sinAngle,10);

			var x0 = sx-dx;
			var y0 = sy-dy;
			var x1 = sx+dx;
			var y1 = sy+dy;
			var x, y, d, incrE, incrNE, ddx, ddy;
			
			if (x1 < x0){ 
				ddx = -1;
			} else {
				ddx = 1;
			}
			if (y1 < y0){
				ddy = -1;
			} else {
				ddy = 1;
			}
			dx = x1-x0;
			dy = y1-y0;
			dx = Math.abs(dx);
			dy = Math.abs(dy);
			x = x0;
			y = y0;
			var rgb1;
			var mixedRGB;
			if (x < width && x >= 0 && y < height && y >= 0) {
				rgb1 = [outputData[(y*width+x)*4],outputData[(y*width+x)*4+1],outputData[(y*width+x)*4+2],outputData[(y*width+x)*4+3]];
				mixedRGB = filterUtils.mixColors(mix,rgb1,rgb2);
				for(k = 0; k < 3; k++){
					outputData[(y*width+x)*4+k] = mixedRGB[k];
				}
			}
			if (Math.abs(dx) > Math.abs(dy)) {
				d = 2*dy-dx;
				incrE = 2*dy;
				incrNE = 2*(dy-dx);

				while (x != x1) {
					if (d <= 0){
						d += incrE;
					} else {
						d += incrNE;
						y += ddy;
					}
					x += ddx;
					if (x < width && x >= 0 && y < height && y >= 0) {
						rgb1 = [outputData[(y*width+x)*4],outputData[(y*width+x)*4+1],outputData[(y*width+x)*4+2],outputData[(y*width+x)*4+3]];
						mixedRGB = filterUtils.mixColors(mix,rgb1,rgb2);
						for(k = 0; k < 3; k++){
							outputData[(y*width+x)*4+k] = mixedRGB[k];
						}
					}
				}
			} else {
				d = 2*dx-dy;
				incrE = 2*dx;
				incrNE = 2*(dx-dy);

				while (y != y1) {
					if (d <= 0) {
						d += incrE;
					}else {
						d += incrNE;
						x += ddx;
					}
					y += ddy;
					if (x < width && x >= 0 && y < height && y >= 0) {
						rgb1 = [outputData[(y*width+x)*4],outputData[(y*width+x)*4+1],outputData[(y*width+x)*4+2],outputData[(y*width+x)*4+3]];
						mixedRGB = filterUtils.mixColors(mix,rgb1,rgb2);
						for(k = 0; k < 3; k++){
							outputData[(y*width+x)*4+k] = mixedRGB[k];
						}
					}
				}
			}
		}
		for(k = 0; k < outputData.length; k++){
			inputData[k] = outputData[k];
		}
	};
}
/**
 * Replaces every pixel with the maximum RGB value of the neighboring pixels. Each color is 
 * considered separately.
 */
function MaximumFilter(){
	this.name = "Maximum";
	this.isDirAnimatable = true;
	this.defaultValues = {
	};
	this.valueRanges = {
	};
	this.filter = function(input,values){
		var width = input.width, height = input.height;
		var inputData = input.data;
		var outputData = [];
		for (var y = 0; y < height; y++) {
			for (var x = 0; x < width; x++) {
				var pixel = (y*width + x)*4;
				var maxR = 0;
				var maxG = 0;
				var maxB = 0;
				for (var dy = -1; dy <= 1; dy++){
					var iy = y+dy;
					if(iy >= 0 && iy < height){
						for (var dx = -1; dx <= 1; dx++){
							var ix = x+dx;
							if(ix >= 0 && ix < width){
								var iPixel = (iy*width + ix)*4;
								maxR = Math.max(maxR,inputData[iPixel]);
								maxG = Math.max(maxG,inputData[iPixel+1]);
								maxB = Math.max(maxB,inputData[iPixel+2]);
							}
						}
					}
				}
				outputData[pixel] = maxR;
				outputData[pixel+1] = maxG;
				outputData[pixel+2] = maxB;
				outputData[pixel+3] = inputData[pixel+3];
			}   
		}
		for(var k = 0; k < outputData.length; k++){
			inputData[k] = outputData[k];
		}
	};
}
/**
 * Replaces every pixel with the median RGB value of the neighboring pixels. Each color is 
 * considered separately.
 */
function MedianFilter(){
	this.name = "Median";
	this.isDirAnimatable = false;
	this.defaultValues = {
	};
	this.valueRanges = {
	};
	this.filter = function(input,values){
		var width = input.width, height = input.height;
		var inputData = input.data;
		var outputData = [];
		for (var y = 0; y < height; y++) {
			for (var x = 0; x < width; x++) {
				var pixel = (y*width + x)*4;
				var rList = [];
				var gList = [];
				var bList = [];
				for (var dy = -1; dy <= 1; dy++){
					var iy = y+dy;
					if(iy >= 0 && iy < height){
						for (var dx = -1; dx <= 1; dx++){
							var ix = x+dx;
							if(ix >= 0 && ix < width){
								var iPixel = (iy*width + ix)*4;
								rList.push(inputData[iPixel]);
								gList.push(inputData[iPixel+1]);
								bList.push(inputData[iPixel+2]);

							}
						}
					}
				}
				var sortFunc = function(a,b){
					return a-b;
				};
				rList.sort(sortFunc);
				gList.sort(sortFunc);
				bList.sort(sortFunc);
				outputData[pixel] = rList[4];
				outputData[pixel+1] = gList[4];
				outputData[pixel+2] = bList[4];
				outputData[pixel+3] = inputData[pixel+3];
			}   
		}
		for(var k = 0; k < outputData.length; k++){
			inputData[k] = outputData[k];
		}
	};
}
/**
 * Replaces every pixel with the minimum RGB value of the neighboring pixels. Each color is 
 * considered separately.
 */
function MinimumFilter(){
	this.name = "Minimum";
	this.isDirAnimatable = true;
	this.defaultValues = {
	};
	this.valueRanges = {
	};
	this.filter = function(input,values){
		var width = input.width, height = input.height;
		var inputData = input.data;
		var outputData = [];
		for (var y = 0; y < height; y++) {
			for (var x = 0; x < width; x++) {
				var pixel = (y*width + x)*4;
				var minR = 255;
				var minG = 255;
				var minB = 255;
				for (var dy = -1; dy <= 1; dy++){
					var iy = y+dy;
					if(iy >= 0 && iy < height){
						for (var dx = -1; dx <= 1; dx++){
							var ix = x+dx;
							if(ix >= 0 && ix < width){
								var iPixel = (iy*width + ix)*4;
								minR = Math.min(minR,inputData[iPixel]);
								minG = Math.min(minG,inputData[iPixel+1]);
								minB = Math.min(minB,inputData[iPixel+2]);
							}
						}
					}
				}
				outputData[pixel] = minR;
				outputData[pixel+1] = minG;
				outputData[pixel+2] = minB;
				outputData[pixel+3] = inputData[pixel+3];
			}   
		}
		for(var k = 0; k < outputData.length; k++){
			inputData[k] = outputData[k];
		}
	};
}
/**
 * Creates random noise on the image, with or without color.
 */
function NoiseFilter(){
	this.name = "Noise";
	this.isDirAnimatable = true;
	this.defaultValues = {
		amount : 25,
		density : 1,
		monochrome : true
	};
	this.valueRanges = {
		amount : {min:0, max:100},
		density : {min:0, max:1.0},
		monochrome : {min:false, max:true}
	};
	this.filter = function(input,values){
		var width = input.width, height = input.height;
		var inputData = input.data;
		if(values === undefined){ values = this.defaultValues; }
		var amount = (values.amount === undefined) ? this.defaultValues.amount : values.amount;
		var density = (values.density === undefined) ? this.defaultValues.density : values.density;
		var monochrome = (values.monochrome === undefined) ? this.defaultValues.monochrome : values.monochrome;
		for (var y = 0; y < height; y++) {
			for (var x = 0; x < width; x++) {
				var pixel = (y*width + x)*4;
				if(Math.random() <= density){
					var n;
					if(monochrome){
						n = parseInt((2*Math.random()-1) * amount,10);
						inputData[pixel] += n;
						inputData[pixel+1] += n;
						inputData[pixel+2] += n;
					} else {
						for(var i = 0; i < 3; i++){
							n = parseInt((2*Math.random()-1) * amount,10);
							inputData[pixel+i] += n; 
						}
					}
				}
			}   
		}
	};
}
/**
 * Produces an oil painting effect on the image.
 * NOTE: This filter can be very slow, especially at higher ranges. Use with caution.
 */
function OilFilter(){
	this.name = "Oil Painting";
	this.isDirAnimatable = false;
	this.defaultValues = {
		range : 3
	};
	this.valueRanges = {
		range : {min:0, max:5}
	};
	this.filter = function(input,values){
		var width = input.width, height = input.height;
		var inputData = input.data;
		var outputData = [];
		if(values === undefined){ values = this.defaultValues; }
		var range = (values.range === undefined) ? this.defaultValues.range : values.range;
		range = parseInt(range,10);
		var index = 0;
		var rHistogram = [];
		var gHistogram = [];
		var bHistogram = [];
		var rTotal = [];
		var gTotal = [];
		var bTotal = [];
		var levels = 256;
		for (var y = 0; y < height; y++) {
			for (var x = 0; x < width; x++) {
				var pixel = (y*width + x)*4;
				for (var j = 0; j < levels; j++){
					rHistogram[j] = gHistogram[j] = bHistogram[j] = rTotal[j] = gTotal[j] = bTotal[j] = 0;
				}
				for (var row = -range; row <= range; row++) {
					var iy = y+row;
					var ioffset;
					if (0 <= iy && iy < height) {
						ioffset = iy*width;
						for (var col = -range; col <= range; col++) {
							var ix = x+col;
							if (0 <= ix && ix < width) {
								var ro = inputData[(ioffset+ix)*4];
								var go = inputData[(ioffset+ix)*4+1];
								var bo = inputData[(ioffset+ix)*4+2];
								var ri = ro*levels/256;
								var gi = go*levels/256;
								var bi = bo*levels/256;
								rTotal[ri] += ro;
								gTotal[gi] += go;
								bTotal[bi] += bo;
								rHistogram[ri]++;
								gHistogram[gi]++;
								bHistogram[bi]++;
							}
						}
					}
				}
				var r = 0, g = 0, b = 0;
				for (var i = 1; i < levels; i++) {
					if (rHistogram[i] > rHistogram[r]){
						r = i;
					}
					if (gHistogram[i] > gHistogram[g]){
						g = i;
					}
					if (bHistogram[i] > bHistogram[b]){
						b = i;
					}
				}
				r = rTotal[r] / rHistogram[r];
				g = gTotal[g] / gHistogram[g];
				b = bTotal[b] / bHistogram[b];
				outputData[pixel] = r;
				outputData[pixel+1] = g;
				outputData[pixel+2] = b;
				outputData[pixel+3] = inputData[pixel+3];
			}   
		}
		for(var k = 0; k < outputData.length; k++){
			inputData[k] = outputData[k];
		}
	};
}
/**
 * Changes the opacity of the image.
 */
function OpacityFilter(){
	this.name = "Opacity";
	this.isDirAnimatable = true;
	this.defaultValues = {
		amount : 1.0
	};
	this.valueRanges = {
		amount : {min:0.0, max:1.0}
	};
	this.filter = function(input,values){
		var width = input.width, height = input.height;
		var inputData = input.data;
		if(values === undefined){ values = this.defaultValues; }
		var amount = (values.amount === undefined) ? this.defaultValues.amount : values.amount;
		for (var y = 0; y < height; y++) {
			for (var x = 0; x < width; x++) {
				var pixel = (y*width + x)*4;
				inputData[pixel+3] = 255*amount;
			}   
		}
	};
}
/**
 * Pinches and whirls the image toward the center point. CenterX and CenterY specify the
 * position in terms of ratios of width and height.
 */
function PinchFilter(){
	this.name = "Pinch/Whirl";
	this.isDirAnimatable = false;
	this.defaultValues = {
		amount : 0.5,
		radius : 100,
		angle : 0,
		centerX : 0.5,
		centerY : 0.5
	};
	this.valueRanges = {
		amount : {min: -1.0, max: 1.0},
		radius : {min: 1, max: 200},
		angle : {min: 0, max: 360},
		centerX : {min: 0.0, max:1.0},
		centerY : {min: 0.0, max:1.0}
	};

	var filterUtils = new FilterUtils();

	this.filter = function (input, values){
		var width = input.width, height = input.height;
		var inputData = input.data;
		if(values === undefined){ values = this.defaultValues; }
		var amount = (values.amount === undefined) ? this.defaultValues.amount : values.amount; 
		var angle = (values.angle === undefined) ? this.defaultValues.angle : values.angle; 
		var centerX = (values.centerX === undefined) ? this.defaultValues.centerX : values.centerX; 
		var centerY = (values.centerY === undefined) ? this.defaultValues.centerY : values.centerY; 
		var radius = (values.radius === undefined) ? this.defaultValues.radius : values.radius;  
		var radius2 = radius*radius;
		angle = angle/180 * Math.PI;
		var iCenterX = width * centerX; var iCenterY = height * centerY;
		var transInverse = function(x,y,out){
			var dx = x-iCenterX;
			var dy = y-iCenterY;
			var distance = dx*dx + dy*dy;
			if(distance > radius2 || distance === 0){
				out[0] = x;
				out[1] = y;
			} else {
				var d = Math.sqrt( distance / radius2 );
				var t = Math.pow( Math.sin( Math.PI*0.5 * d ), -amount);
				dx *= t;
				dy *= t;
				var e = 1 - d;
				var a = angle * e * e;
				var s = Math.sin(a);
				var c = Math.cos(a);
				out[0] = iCenterX + c*dx - s*dy;
				out[1] = iCenterY + s*dx + c*dy;
			}
		};
		filterUtils.transformFilter(inputData,transInverse,width,height);
	};
}
/**
 * Pixelates the image i.e. divides the image into blocks of color.
 */
function PixelationFilter(){
	this.name = "Pixelation";
	this.isDirAnimatable = false;
	this.defaultValues = {
		size : 5
	};
	this.valueRanges = {
		size : {min:1, max:50}
	};
	this.filter = function(input,values){
		var width = input.width, height = input.height;
		var inputData = input.data;
		if(values === undefined){ values = this.defaultValues; }
		var size = (values.size === undefined) ? this.defaultValues.size : values.size;
		size = parseInt(size,10);
		var pixels = [];
		var by, bx, bPixel;
		for (var y = 0; y < height; y+=size) {
			for (var x = 0; x < width; x+=size) {
				var pixel = (y*width + x)*4;
				var w = Math.min(size, width-x);
				var h = Math.min(size, height-y);
				var t = w*h;
				var r = 0, g = 0, b = 0;
				for(by = y; by < y+h; by++){
					for(bx = x; bx < x+w; bx++){
						bPixel = (by*width + bx)*4;
						r += inputData[bPixel];
						g +=  inputData[bPixel+1];
						b += inputData[bPixel+2];
					}
				}
				for(by = y; by < y+h; by++){
					for(bx = x; bx < x+w; bx++){
						bPixel = (by*width + bx)*4;
						inputData[bPixel] = r/t;
						inputData[bPixel+1] = g/t;
						inputData[bPixel+2] = b/t;
					}
				}
			}   
		}
	};
}
/**
 * Posterizes the image, i.e. restricts the color values to a set amount of levels.
 */
function PosterizeFilter(){
	this.name = "Posterize";
	this.isDirAnimatable = false;
	this.defaultValues = {
		levels : 6
	};
	this.valueRanges = {
		levels : {min:2, max:30 }
	};

	var filterUtils = new FilterUtils();
	this.filter = function(input,values){
		var width = input.width, height = input.height;
		var inputData = input.data;
		if(values === undefined){ values = this.defaultValues; }
		var levels = (values.levels === undefined) ? this.defaultValues.levels : parseInt(values.levels,10);
		if(levels <= 1){
			return;
		}
		var table = [];
		for(var i = 0; i < 256; i++){
			table[i] = parseInt(255 * parseInt(i*levels/256,10) / (levels-1),10);
		}
		filterUtils.tableFilter(inputData,table,width,height);
	};
}
/**
 * Adjust the factor of each RGB color value in the image.
 */
function RGBAdjustFilter(){
	this.name = "RGBAdjust";
	this.isDirAnimatable = true;
	this.defaultValues = {
		red: 1.0,
		green: 1.0,
		blue: 1.0
	};
	this.valueRanges = {
		red: {min: 0.0, max: 2.0},
		green: {min: 0.0, max: 2.0},
		blue: {min: 0.0, max: 2.0}
	};
	this.filter = function(input,values){
		var width = input.width, height = input.height;
		var inputData = input.data;
		if(values === undefined){ values = this.defaultValues; }
		var red = (values.red === undefined) ? this.defaultValues.red : values.red;
		var green = (values.green === undefined) ? this.defaultValues.green : values.green;
		var blue = (values.blue === undefined) ? this.defaultValues.blue : values.blue;
		if(red < 0){ red = 0; }
		if(green < 0){ green = 0; }
		if(blue < 0){ blue = 0; }
		for (var y = 0; y < height; y++) {
			for (var x = 0; x < width; x++) {
				var pixel = (y*width + x)*4;
				inputData[pixel] *= red;
				inputData[pixel+1] *= green;
				inputData[pixel+2] *= blue;
			}   
		}
	};
}
/**
 * Adjusts the saturation value of the image. Values over 1 increase saturation while values below decrease saturation.
 * For a true grayscale effect, use the grayscale filter instead.
 */
function SaturationFilter(){
	this.name = "Saturation";
	this.isDirAnimatable = true;
	this.defaultValues = {
		amount : 1.0
	};
	this.valueRanges = {
		amount : {min:0.0, max:2.0}
	};
	this.filter = function(input,values){
		var width = input.width, height = input.height;
		var inputData = input.data;
		if(values === undefined){ values = this.defaultValues; }
		var amount = (values.amount === undefined) ? this.defaultValues.amount : values.amount;
		var RW = 0.3;
		var RG = 0.59;
		var RB = 0.11;
		var a = (1 - amount) * RW + amount;
		var b = (1 - amount) * RW;
		var c = (1 - amount) * RW;
		var d = (1 - amount) * RG;
		var e = (1 - amount) * RG + amount;
		var f = (1 - amount) * RG;
		var g = (1 - amount) * RB;
		var h = (1 - amount) * RB;
		var i = (1 - amount) * RB + amount;
		for (var y = 0; y < height; y++) {
			for (var x = 0; x < width; x++) {
				var pixel = (y*width + x)*4;
				var pR = inputData[pixel];
				var pG = inputData[pixel+1];
				var pB = inputData[pixel+2];
				inputData[pixel]   = a*pR + d*pG + g*pB;
				inputData[pixel+1] = b*pR + e*pG + h*pB;
				inputData[pixel+2]  = c*pR + f*pG + i*pB;
			}   
		}
	};
}
/**
 * Creates ripples on the image horizontally/vertically in a sawtooth pattern.
 */
function SawtoothRippleFilter(){
	this.name = "Sawtooth Ripples";
	this.isDirAnimatable = false;
	this.defaultValues = {
		xAmplitude : 5,
		yAmplitude : 5,
		xWavelength : 16,
		yWavelength : 16 
	};
	this.valueRanges = {
		xAmplitude : {min:0, max:30},
		yAmplitude : {min:0, max:30},
		xWavelength : {min:1, max:50},
		yWavelength : {min:1, max:50} 
	};

	var filterUtils = new FilterUtils();

	this.filter = function (input, values){
		var width = input.width, height = input.height;
		var inputData = input.data;
		if(values === undefined){ values = this.defaultValues; }
		var xAmplitude = (values.xAmplitude === undefined) ? this.defaultValues.xAmplitude : values.xAmplitude; 
		var yAmplitude = (values.yAmplitude === undefined) ? this.defaultValues.yAmplitude : values.yAmplitude; 
		var xWavelength = (values.xWavelength === undefined) ? this.defaultValues.xWavelength : values.xWavelength; 
		var yWavelength = (values.yWavelength === undefined) ? this.defaultValues.yWavelength : values.yWavelength; 
		var transInverse = function(x,y,out){
			var nx = y/xWavelength;
			var ny = x/yWavelength;
			var fx = filterUtils.mod(nx,1);
			var fy = filterUtils.mod(ny,1);
			out[0] = x + xAmplitude * fx;
			out[1] = y + yAmplitude * fy;
		};
		filterUtils.transformFilter(inputData,transInverse,width,height);
	};
}
/**
 * Creates a sepia effect on the image i.e. gives the image a yellow-brownish tone.
 */
function SepiaFilter(){
	this.name = "Sepia";
	this.isDirAnimatable = true;
	this.defaultValues = {
		amount : 10
	};
	this.valueRanges = {
		amount : {min:0, max:30}
	};

	var filterUtils = new FilterUtils();
	this.filter = function(input,values){
		var width = input.width, height = input.height;
		var inputData = input.data;
		if(values === undefined){ values = this.defaultValues; }
		var amount = (values.amount === undefined) ? this.defaultValues.amount : values.amount;
		amount *= 255/100;
		for (var y = 0; y < height; y++) {
			for (var x = 0; x < width; x++) {
				var pixel = (y*width + x)*4;
				var luma = inputData[pixel]*0.3 + inputData[pixel+1]*0.59 + inputData[pixel+2]*0.11;
				var r,g,b;
				r = g = b = luma;
				r += 40;
				g += 20;
				b -= amount;
				
				inputData[pixel] = r;
				inputData[pixel+1] = g;
				inputData[pixel+2] = b;
			}   
		}
	};
}
/**
 * Sharpens the image slightly. For increased effect, apply the filter multiple times.
 */
function SharpenFilter(){
	this.name = "Sharpen";
	this.isDirAnimatable = true;
	this.defaultValues = {
	};
	this.valueRanges = {
	};

	var filterUtils = new FilterUtils();
	this.filter = function(input,values){
		var width = input.width, height = input.height;
		var inputData = input.data;
		var matrix = [ 0.0,-0.2, 0.0,
					  -0.2, 1.8,-0.2,
					   0.0, -0.2, 0.0];
		filterUtils.convolveFilter(inputData,matrix,width,height);
	};
}
/**
 * Creates ripples on the image horizontally/vertically in a sine pattern.
 */
function SineRippleFilter(){
	this.name = "Sine Ripples";
	this.isDirAnimatable = false;
	this.defaultValues = {
		xAmplitude : 5,
		yAmplitude : 5,
		xWavelength : 16,
		yWavelength : 16 
	};
	this.valueRanges = {
		xAmplitude : {min:0, max:30},
		yAmplitude : {min:0, max:30},
		xWavelength : {min:1, max:50},
		yWavelength : {min:1, max:50} 
	};

	var filterUtils = new FilterUtils();

	this.filter = function (input, values){
		var width = input.width, height = input.height;
		var inputData = input.data;
		if(values === undefined){ values = this.defaultValues; }
		var xAmplitude = (values.xAmplitude === undefined) ? this.defaultValues.xAmplitude : values.xAmplitude; 
		var yAmplitude = (values.yAmplitude === undefined) ? this.defaultValues.yAmplitude : values.yAmplitude; 
		var xWavelength = (values.xWavelength === undefined) ? this.defaultValues.xWavelength : values.xWavelength; 
		var yWavelength = (values.yWavelength === undefined) ? this.defaultValues.yWavelength : values.yWavelength; 
		var transInverse = function(x,y,out){
			var nx = y/xWavelength;
			var ny = x/yWavelength;
			var fx = Math.sin(nx);
			var fy = Math.sin(ny);
			out[0] = x + xAmplitude * fx;
			out[1] = y + yAmplitude * fy;
		};
		filterUtils.transformFilter(inputData,transInverse,width,height);
	};
}
/**
 * Produces a solarization effect on the image.  
 */
function SolarizeFilter(){
	this.name = "Solarize";
	this.isDirAnimatable = true;
	this.defaultValues = {
	};
	this.valueRanges = {
	};

	var filterUtils = new FilterUtils();
	this.filter = function(input,values){
		var width = input.width, height = input.height;
		var inputData = input.data;
		var table = [];
		for(var i = 0; i < 256; i++){
			var val = (i/255 > 0.5) ? 2*(i/255-0.5) : 2*(0.5-i/255);
			table[i] = parseInt(255 * val,10);
		}
		filterUtils.tableFilter(inputData, table, width, height);
	};
}
/**
 * Generates a sparkle/sunburst effect on the image. CenterX and CenterY specify the
 * position in terms of ratios of width and height.
 */
function SparkleFilter(){
	this.name = "Sparkle";
	this.isDirAnimatable = false;
	this.defaultValues = {
		rays : 50,
		size : 25,
		amount : 50,
		randomness : 25,
		centerX : 0.5,
		centerY : 0.5
	};
	this.valueRanges = {
		rays : {min:1, max:100},
		size : {min:1, max:200},
		amount : {min:0, max:100},
		randomness : {min:0, max:50},
		centerX : {min:0, max:1.0},
		centerY : {min:0, max:1.0}
	};

	var filterUtils = new FilterUtils();
	this.filter = function(input,values){
		var width = input.width, height = input.height;
		var inputData = input.data;
		if(values === undefined){ values = this.defaultValues; }
		var rays = (values.rays === undefined) ? this.defaultValues.rays : values.rays;
		rays = parseInt(rays, 10);
		var size = (values.size === undefined) ? this.defaultValues.size : values.size;
		var amount = (values.amount === undefined) ? this.defaultValues.amount : values.amount;
		var randomness = (values.randomness === undefined) ? this.defaultValues.randomness : values.randomness;
		var centerX = (values.centerX === undefined) ? this.defaultValues.centerX : values.centerX;
		var centerY = (values.centerY === undefined) ? this.defaultValues.centerY : values.centerY;
		var iCenterX = centerX * width;
		var iCenterY = centerY * height;
		var rayLengths = [];
		for(var j = 0; j < rays; j++){
			rayLengths[j]= size + randomness / 100 * size * filterUtils.gaussianRandom();
		}
		for (var y = 0; y < height; y++) {
			for (var x = 0; x < width; x++) {
				var pixel = (y*width + x)*4;
				var dx = x-iCenterX;
				var dy = y-iCenterY;
				var distance = dx*dx + dy*dy;
				var angle = Math.atan2(dy,dx);
				var d = (angle+Math.PI) / (Math.PI*2) * rays;
				var i = parseInt(d,10);
				var f = d - i;
				if(size !== 0){
					var length = filterUtils.linearInterpolate(f, rayLengths[i % rays], rayLengths[(i+1) % rays]);
					var g = length*length / (distance+0.0001);
					g = Math.pow(g, (100-amount) / 50);
					f -= 0.5;
					f = 1 - f*f;
					f *= g;
				}
				f = filterUtils.clampPixel(f,0,1);
				var mixedRGB = filterUtils.mixColors(f,[inputData[pixel],inputData[pixel+1],inputData[pixel+2],inputData[pixel+3]],[255,255,255,255]);
				for(var k = 0; k < 3; k++){
					inputData[pixel+k] = mixedRGB[k]; 
				}
			}   
		}
	};
}
/**
 * Smears out the image with square shapes to create a painting style effect.
 * The mix values sets the intensity of the effect.
 * NOTE: This filter can be very slow, especially at higher densities/sizes. Use with caution.
 */
function SquareSmearFilter(){
	this.name = "Square Smear";
	this.isDirAnimatable = false;
	this.defaultValues = {
		size : 4,
		density : 0.5,
		mix : 0.5
	};
	this.valueRanges = {
		size : {min:1, max:10},
		density : {min:0.0, max:1.0},
		mix : {min:0.0, max:1.0}
	};

	var filterUtils = new FilterUtils();
	this.filter = function(input,values){
		var width = input.width, height = input.height;
		var inputData = input.data;
		var outputData = [];
		var k;
		for(k = 0; k < inputData.length; k++){
			outputData[k] = inputData[k];
		}
		if(values === undefined){ values = this.defaultValues; }
		var size = (values.size === undefined) ? this.defaultValues.size : values.size;
		if(size < 1){ size = 1;}
		size = parseInt(size,10);
		var density = (values.density === undefined) ? this.defaultValues.density : values.density;
		var mix = (values.mix === undefined) ? this.defaultValues.mix : values.mix;
		var radius = size+1;
		var radius2 = radius*radius;
		var numShapes = parseInt(2*density/30*width*height / 2,10);
		for(var i = 0; i < numShapes; i++){
			var sx = (Math.random()*Math.pow(2,32) & 0x7fffffff) % width;
			var sy = (Math.random()*Math.pow(2,32) & 0x7fffffff) % height;
			var rgb2 = [inputData[(sy*width+sx)*4],inputData[(sy*width+sx)*4+1],inputData[(sy*width+sx)*4+2],inputData[(sy*width+sx)*4+3]];
			for(var x = sx - radius; x < sx + radius + 1; x++){
				
				for(var y = sy - radius; y < sy + radius + 1; y++){
					if (x >= 0 && x < width && y >= 0 && y < height) {
						var rgb1 = [outputData[(y*width+x)*4],outputData[(y*width+x)*4+1],outputData[(y*width+x)*4+2],outputData[(y*width+x)*4+3]];
						var mixedRGB = filterUtils.mixColors(mix,rgb1,rgb2);
						for(k = 0; k < 3; k++){
							outputData[(y*width+x)*4+k] = mixedRGB[k];
						}
					}
				}
			}
		}
		for(k = 0; k < outputData.length; k++){
			inputData[k] = outputData[k];
		}
	};
}
/**
 * Divides the colors into black and white following the treshold value. Brightnesses above the threshold
 * sets the color to white while values below the threshold sets the color to black.
 */
function ThresholdFilter(){
	this.name = "Black & White";
	this.isDirAnimatable = true;
	this.defaultValues = {
		threshold : 127
	};
	this.valueRanges = {
		threshold : {min:0, max:255}
	};
	this.filter = function(input,values){
		var width = input.width, height = input.height;
		var inputData = input.data;
		if(values === undefined){ values = this.defaultValues; }
		var threshold = (values.threshold === undefined) ? this.defaultValues.threshold : values.threshold;
		for (var y = 0; y < height; y++) {
			for (var x = 0; x < width; x++) {
				var pixel = (y*width + x)*4;
				var brightness = (inputData[pixel] + inputData[pixel+1] + inputData[pixel+2])/3;
				var colorVal = 0;
				if(brightness > threshold){
					colorVal = 255;
				}
				inputData[pixel] = inputData[pixel+1] = inputData[pixel+2] = colorVal;
			}   
		}
	};
}
/**
 * Creates ripples on the image horizontally/vertically in a sine pattern.
 */
function TriangleRippleFilter(){
	this.name = "Triangle Ripples";
	this.isDirAnimatable = false;
	this.defaultValues = {
		xAmplitude : 5,
		yAmplitude : 5,
		xWavelength : 16,
		yWavelength : 16 
	};
	this.valueRanges = {
		xAmplitude : {min:0, max:30},
		yAmplitude : {min:0, max:30},
		xWavelength : {min:1, max:50},
		yWavelength : {min:1, max:50} 
	};

	var filterUtils = new FilterUtils();

	this.filter = function (input, values){
		var width = input.width, height = input.height;
		var inputData = input.data;
		if(values === undefined){ values = this.defaultValues; }
		var xAmplitude = (values.xAmplitude === undefined) ? this.defaultValues.xAmplitude : values.xAmplitude; 
		var yAmplitude = (values.yAmplitude === undefined) ? this.defaultValues.yAmplitude : values.yAmplitude; 
		var xWavelength = (values.xWavelength === undefined) ? this.defaultValues.xWavelength : values.xWavelength; 
		var yWavelength = (values.yWavelength === undefined) ? this.defaultValues.yWavelength : values.yWavelength; 
		var transInverse = function(x,y,out){
			var nx = y/xWavelength;
			var ny = x/yWavelength;
			var fx = filterUtils.triangle(nx,1);
			var fy = filterUtils.triangle(ny,1);
			out[0] = x + xAmplitude * fx;
			out[1] = y + yAmplitude * fy;
		};
		filterUtils.transformFilter(inputData,transInverse,width,height);
	};
}
/**
 * Twists the image around a given center point. CenterX and CenterY specify the
 * position in terms of ratios of width and height.
 */
function TwirlFilter(){
	this.name = "Twirl";
	this.isDirAnimatable = false;
	this.defaultValues = {
		radius : 100,
		angle : 180,
		centerX : 0.5,
		centerY : 0.5
	};
	this.valueRanges = {
		radius : {min: 1, max: 200},
		angle : {min: 0, max: 360},
		centerX : {min: 0.0, max:1.0},
		centerY : {min: 0.0, max:1.0}
	};

	var filterUtils = new FilterUtils();

	this.filter = function (input, values){
		var width = input.width, height = input.height;
		var inputData = input.data;
		if(values === undefined){ values = this.defaultValues; }
		var angle = (values.angle === undefined) ? this.defaultValues.angle : values.angle; 
		var centerX = (values.centerX === undefined) ? this.defaultValues.centerX : values.centerX; 
		var centerY = (values.centerY === undefined) ? this.defaultValues.centerY : values.centerY; 
		var radius = (values.radius === undefined) ? this.defaultValues.radius : values.radius;  
		var radius2 = radius*radius;
		angle = angle/180 * Math.PI;
		var iCenterX = width * centerX; var iCenterY = height * centerY;
		var transInverse = function(x,y,out){
			var dx = x-iCenterX;
			var dy = y-iCenterY;
			var distance = dx*dx + dy*dy;
			if(distance > radius2){
				out[0] = x;
				out[1] = y;
			} else {
				distance = Math.sqrt(distance);
				var a = Math.atan2(dy, dx) + angle * (radius-distance) / radius;
				out[0] = iCenterX + distance*Math.cos(a);
				out[1] = iCenterY + distance*Math.sin(a);
			}
		};
		filterUtils.transformFilter(inputData,transInverse,width,height);
	};
}
/**
 * Creates a classical vignette effect on the image i.e. darkens the corners.
 */
function VignetteFilter(){
	this.name = "Vignette";
	this.isDirAnimatable = false;
	this.defaultValues = {
		amount : 0.3
	};
	this.valueRanges = {
		amount : {min:0.0, max:1.0}
	};
	this.filter = function(input,values){
		var width = input.width, height = input.height;
		var inputData = input.data;
		var outputData = [];
		if(values === undefined){ values = this.defaultValues; }
		var amount = (values.amount === undefined) ? this.defaultValues.amount : values.amount;
		var canvas = document.createElement("canvas");
		canvas.width = width;
		canvas.height = height;
		var context = canvas.getContext("2d");
		var gradient;
		var radius = Math.sqrt( Math.pow(width/2, 2) + Math.pow(height/2, 2) );
		context.putImageData(input,0,0);
		context.globalCompositeOperation = 'source-over';
		
		gradient = context.createRadialGradient(width/2, height/2, 0, width/2, height/2, radius);
		gradient.addColorStop(0, 'rgba(0,0,0,0)');
		gradient.addColorStop(0.5, 'rgba(0,0,0,0)');
		gradient.addColorStop(1, 'rgba(0,0,0,' + amount + ')');
		context.fillStyle = gradient;
		context.fillRect(0, 0, width, height);
		outputData = context.getImageData(0,0,width,height).data;
		for(var k = 0; k < outputData.length; k++){
			inputData[k] = outputData[k];
		}
	};
}
/**
 * Produces a water ripple/waves on the image. CenterX and CenterY specify the
 * position in terms of ratios of width and height.
 */
function WaterRippleFilter(){
	this.name = "Water Ripples";
	this.isDirAnimatable = false;
	this.defaultValues = {
		phase : 0,
		radius : 50,
		wavelength : 16,
		amplitude : 10,
		centerX : 0.5,
		centerY : 0.5
	};
	this.valueRanges = {
		phase : {min: 0, max: 100},
		radius : {min: 1, max: 200},
		wavelength : {min: 1, max: 100},
		amplitude : {min: 1, max: 100},
		centerX : {min: 0.0, max:1.0},
		centerY : {min: 0.0, max:1.0}
	};
	var filterUtils = new FilterUtils();

	this.filter = function (input, values){
		var width = input.width, height = input.height;
		var inputData = input.data;
		if(values === undefined){ values = this.defaultValues; }
		var wavelength = (values.wavelength === undefined) ? this.defaultValues.wavelength : values.wavelength; 
		var amplitude = (values.amplitude === undefined) ? this.defaultValues.amplitude : values.amplitude; 
		var phase = (values.phase === undefined) ? this.defaultValues.phase : values.phase; 
		var centerX = (values.centerX === undefined) ? this.defaultValues.centerX : values.centerX; 
		var centerY = (values.centerY === undefined) ? this.defaultValues.centerY : values.centerY; 
		var radius = (values.radius === undefined) ? this.defaultValues.radius : values.radius;  
		var radius2 = radius*radius;
		var iCenterX = width * centerX; var iCenterY = height * centerY;
		var transInverse = function(x,y,out){
			var dx = x-iCenterX;
			var dy = y-iCenterY;
			var distance2 = dx*dx + dy*dy;
			if(distance2 > radius2){
				out[0] = x;
				out[1] = y;
			} else {
				var distance = Math.sqrt(distance2);
				var amount = amplitude * Math.sin(distance/wavelength * Math.PI * 2 - phase);
				amount *= (radius-distance)/radius;
				if(distance !== 0){
					amount *= wavelength/distance;
				}
				out[0] = x + dx*amount;
				out[1] = y + dy*amount;
			}
		};
		filterUtils.transformFilter(inputData,transInverse,width,height);
	};
}
/**
 * A collection of all the filters.
 */
var JSManipulate = {
	blur : new BlurFilter(),
	brightness : new BrightnessFilter(),
	bump : new BumpFilter(),
	circlesmear : new CircleSmearFilter(),
	contrast : new ContrastFilter(),
	crosssmear : new CrossSmearFilter(),
	diffusion : new DiffusionFilter(),
	dither : new DitherFilter(),
	edge : new EdgeFilter(),
	emboss : new EmbossFilter(),
	exposure : new ExposureFilter(),
	gain : new GainFilter(),
	gamma : new GammaFilter(),
	grayscale : new GrayscaleFilter(),
	hue : new HueFilter(),
	invert : new InvertFilter(),
	kaleidoscope : new KaleidoscopeFilter(),
	lensdistortion : new LensDistortionFilter(),
	linesmear : new LineSmearFilter(),
	maximum : new MaximumFilter(),
	median : new MedianFilter(),
	minimum : new MinimumFilter(),
	noise : new NoiseFilter(),
	oil : new OilFilter(),
	opacity : new OpacityFilter(),
	pinch : new PinchFilter(),
	pixelate : new PixelationFilter(),
	posterize : new PosterizeFilter(),
	rgbadjust : new RGBAdjustFilter(),
	saturation : new SaturationFilter(),
	sawtoothripple : new SawtoothRippleFilter(),
	sepia : new SepiaFilter(),
	sharpen : new SharpenFilter(),
	sineripple : new SineRippleFilter(),
	solarize : new SolarizeFilter(),
	sparkle : new SparkleFilter(),
	squaresmear : new SquareSmearFilter(),
	threshold : new ThresholdFilter(),
	triangleripple : new TriangleRippleFilter(),
	twirl : new TwirlFilter(),
	vignette : new VignetteFilter(),
	waterripple : new WaterRippleFilter() 
};


var MyJSManipulate = {};

for(var x in JSManipulate)
{
	if(JSManipulate[x].hasOwnProperty('defaultValues'))
	{
        MyJSManipulate[x] = JSManipulate[x];

	}

}


Gamestack.JSManipulate = MyJSManipulate;;

/**
 * instantiates Gamestack.js Canvas (CanvasLib) controller

 @description
 This Canvas library handles the low-level drawing of Sprite() objects on HTML5Canvas.
 -draws Sprites(), handling their rotation, size, and other parameters.
 * @returns {CanvasLib} a CanvasLib object
 */

class CanvasLib {

    constructor() {

        return {

            __levelMaker: false,

            draw: function (sprite, ctx) {

                if (sprite.active && (this.__levelMaker || sprite.onScreen(__gameStack.WIDTH, __gameStack.HEIGHT))) {

                    this.drawPortion(sprite, ctx);

                }

            },
            drawFrameWithRotation: function (img, fx, fy, fw, fh, x, y, width, height, deg, canvasContextObj, flip) {

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
                } else {

                }

                //draw the image
                canvasContextObj.drawImage(img, fx, fy, fw, fh, width / 2 * (-1), height / 2 * (-1), width, height);
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


            drawPortion: function (sprite, ctx) {

                var frame;

                if (sprite.active) {

                    if (sprite.selected_animation && sprite.selected_animation.selected_frame) {

                        frame = sprite.selected_animation.selected_frame;

                    }
                    else {

                        console.error('Sprite is missing arguments');

                    }

                    var p = sprite.position;

                    var camera = __gameStack.__gameWindow.camera || {x: 0, y: 0, z: 0};

                    var x = p.x, y = p.y;


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

                    if (typeof(sprite.rotation) == 'object') {

                        rotation = sprite.rotation.x;


                    }
                    else {
                        rotation = sprite.rotation;

                    }

                    var frame = sprite.selected_animation.selected_frame;

                    if (frame && frame.image && frame.image.data) {
                        ctx.putImageData(frame.image.data, x, y);

                    }
                    else {

                        this.drawFrameWithRotation(sprite.selected_animation.image.domElement, frame.framePos.x, frame.framePos.y, frame.frameSize.x, frame.frameSize.y, Math.round(x + (realWidth / 2)), Math.round(y + (realHeight / 2)), realWidth, realHeight, rotation % 360, ctx, sprite.flipX);

                    }

                }

            }

        }

    }

}


let Canvas = new CanvasLib();

Gamestack.Canvas = Canvas;








;/**
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

class Animation {
    constructor(args = {}) {

        args = args || {};

        var _anime = this;

        this.defaultArgs = {

            name:"my-animation",

            description:"my-description",

            frames:[],

            type:"none",

            delay:0,

            frameSize:new Vector3(44, 44, 0),

            frameBounds:new VectorFrameBounds(new Vector3(0, 0, 0), new Vector3(0, 0, 0), new Vector3(0, 0, 0)),

            frameOffset:new Vector3(0, 0, 0),

            flipX:false,

            duration:1000,

            size:new Vector3(20, 20, 20)
        };


        for(var x in this.defaultArgs)
        {
            if(!args.hasOwnProperty(x))
            {
                args[x] = this.defaultArgs[x]

            }

        };

        for(var x in this.args)
        {
           this[x] = args[x];

        }

        this.image = new GameImage(__gameStack.getArg(args, 'src', __gameStack.getArg(args, 'image', false)));

        this.src = this.image.domElement.src;

        this.domElement = this.image.domElement;

        this.frameSize = this.getArg(args, 'frameSize', new Vector3(44, 44, 0));

        this.frameBounds = this.getArg(args, 'frameBounds', new VectorFrameBounds(new Vector3(0, 0, 0), new Vector3(0, 0, 0), new Vector3(0, 0, 0)));

        this.frameOffset = this.getArg(args, 'frameOffset', new Vector3(0, 0, 0));

        this.extras = this.getArg(args, 'extras', false);

      if(typeof(args) == 'object' && args.frameBounds && args.frameSize){  this.apply2DFrames(args.parent || {}) };

        this.flipX = this.getArg(args, 'flipX', false);

        this.cix = 0;

        this.selected_frame = this.frames[0];

        this.timer = 0;

        this.duration = args.duration || 2000;

        this.seesaw_mode = args.seesaw_mode || false;


    }

    singleFrame(frameSize, size)
    {

        this.__frametype = 'single';

        this.frameSize = frameSize;

        this.size = size || this.frameSize;

        this.selected_frame = {
            image: this.image,
            frameSize: this.frameSize,
            framePos: {x: 0, y: 0}
        };

        this.frames[0] = this.selected_frame;

        return this;

    }

    getArg(args, key, fallback) {

        if (args.hasOwnProperty(key)) {

            return args[key];

        }
        else {
            return fallback;

        }

    }

    apply2DFrames() {

        this.frames = [];

        var fcount = 0;

        var quitLoop = false;

        for (let y = this.frameBounds.min.y; y <= this.frameBounds.max.y; y++) {

            for (let x = this.frameBounds.min.x; x <= this.frameBounds.max.x; x++) {

                let framePos = {x: x * this.frameSize.x + this.frameOffset.x, y: y * this.frameSize.y + this.frameOffset.y};

                this.frames.push({image: this.image, frameSize: this.frameSize, framePos: framePos});

                if( x >= this.frameBounds.termPoint.x && y >= this.frameBounds.termPoint.y)
                {

                    quitLoop = true;

                    break;
                }

                fcount += 1;

                if(quitLoop)
                    break;

            }

        }

        this.frames[0] = !this.frames[0] ? {
                image: this.image,
                frameSize: this.frameSize,
                framePos: {x: this.frameBounds.min.x, y: this.frameBounds.min.y}
            } : this.frames[0];


        if(this.seesaw_mode)
        {
            console.log('ANIMATION: applying seesaw');

            var frames_reversed = this.frames.slice().reverse();

            this.frames.pop();

            this.frames = this.frames.concat(frames_reversed);

        }

       // this.selected_frame = this.frames[this.cix % this.frames.length] || this.frames[0];

    }

    resetFrames() //special reset function:: frames are re-rendered each reset()
    {

        this.apply2DFrames();

    }

    update() {

        this.selected_frame = this.frames[Math.round(this.cix) % this.frames.length];


    }


    reset()
{

    this.resetFrames();

    this.cix = 0;

}

continuous(duration)
{

    if(this.__frametype == 'single')
    {
        return 0;

    }

  this.apply2DFrames();

    //update once:
    this.update();


    if(this.cix == 0)
  {

      this.engage();

  }


}

engage(duration, complete)
{

    if(this.__frametype == 'single')
    {
        return 0;

    }


    let __inst = this;

    this.complete = complete || this.complete || function(){  };

    var duration = duration || typeof(this.duration) == 'number' ? this.duration : this.frames.length * 20;

    if(this.cix == 0 && this.extras)
    {
        this.extras.call(); //fire any extras attached

    }

    //we have a target
  this.tween = new TWEEN.Tween(this)
        .easing(__inst.curve || TWEEN.Easing.Linear.None)

        .to({cix:__inst.frames.length - 1}, duration)
        .onUpdate(function() {
            //console.log(objects[0].position.x,objects[0].position.y);

         //   __inst.cix = Math.ceil(__inst.cix);

        __inst.update();

        })
        .onComplete(function() {
            //console.log(objects[0].position.x, objects[0].position.y);

            if(__inst.complete)
            {

                __inst.complete();

            }

            __inst.cix = 0;

            __inst.isComplete = true;

        });


  this.tween.start();


}

onComplete(fun)
{
    this.complete = fun;

}

    animate() {

        this.apply2DFrames();

        this.timer += 1;

        if(this.delay == 0 || this.timer % this.delay == 0) {

                if(this.cix == 0 && this.extras)
                {
                    this.extras.call(); //fire any extras attached

                }

                if(this.cix >= this.frames.length - 1 && typeof(this.complete) == 'function')
                {
                    this.complete(this);

                }

                this.cix = this.cix >= this.frames.length - 1 ? this.frameBounds.min.x : this.cix + 1;

                this.update();

        }

    }

};

Gamestack.Animation = Animation;;/**
 * Camera : has simple x, y, z, position / Vector values
 *
 * @returns {Vector}
 */


class Camera
{

    constructor(args)
    {

      this.position = new Vector3(0, 0, 0);

    }


}



;/*
 * Canvas
 *    draw animations, textures to the screen
 * */

class EffectSequence
{
    constructor(args = {})
    {

        console.log('Effect Sequence');

        this.animation = args.animation || false;

        this.effects = Gamestack.JSManipulate;

        this.selected_effect = this.effects.triangleripple;

        this.effects_list = [];

        this.effects_list[0] = this.selected_effect;

        this.effect_guis = [];

        this.numberSteps = 10;

        this.curve = args.curve || TWEEN.Easing.Linear.None;

        this.counter = 0;

         this.duration = 3000;

        this.loopBack = true; //Use this to loop effects back to original state

        this.canvas = document.createElement('canvas');

        this.testCtx = this.canvas.getContext('2d');

        this.values = {};

        this.initValues();

        this.minFloat = function(portion)
        {
            for(var x in this.startValues)
            {

                this.startValues[x] = this.valueRanges[x].max * portion;

            }

        }

        this.maxFloat = function(portion)
        {
            for(var x in this.endValues)
            {

                this.endValues[x] = this.valueRanges[x].max * portion;

            }

        }


    }

    initValues()
    {
        this.startValues = {};

        this.endValues = {};

        for(var x in this.selected_effect.valueRanges)
        {

            this.startValues[x] = this.selected_effect.valueRanges[x].min;

            this.endValues[x] = this.selected_effect.valueRanges[x].max;

        }

        this.values =  JSON.parse(jstr(this.startValues));

        this.valueRanges = this.selected_effect.valueRanges;


    }

    Effect(key)
    {

        if(typeof(key) == 'object')
        {
            this.selected_effect = key;

        }
        else if (typeof(key) == 'string')
        {

            for(var x in this.effects)
            {

                if(x.toLowerCase() == key.toLowerCase())
                {
                    this.selected_effect = this.effects[key];


                }

            }

        }

        this.initValues();

        return this;

    }


    foldLeft()
    {
        this.foldLeft = true;
        return this;
    }


    foldTop()
    {
        this.foldTop = true;
        return this;

    }

    guiCallback(effect, callback)
    {

        this.selected_effect = effect || this.effects.triangleripple;

        dat.GUI.prototype.removeFolder = function(name) {
            var folder = this.__folders[name];
            if (!folder) {
                return;
            }
            folder.close();
            this.__ul.removeChild(folder.domElement.parentNode);
            delete this.__folders[name];
            this.onResize();
        }

        var __inst = this;

        __inst.gui = __inst.gui ||  false;


        var setValues = function(my_gui)
        {

            my_gui.removeFolder('start-values');
            my_gui.removeFolder('end-values');
            var startValuesGUI =  my_gui.addFolder('start-values'),
                endValuesGUI =  my_gui.addFolder('end-values');

            for(var x in __inst.startValues)
            {
                if(__inst.valueRanges.hasOwnProperty(x))
                {
                    startValuesGUI.add(__inst.startValues, x).min(__inst.valueRanges[x].min).max(__inst.valueRanges[x].max);

                    endValuesGUI.add(__inst.endValues, x).min(__inst.valueRanges[x].min).max(__inst.valueRanges[x].max);

                }


            }


        };


        if(__inst.gui)
        {


        }
        else
        {

            __inst.gui = new dat.GUI();

            var effect_select = __inst.gui.add(__inst, 'selected_effect', Object.keys(__inst.effects));

            $(effect_select.domElement).append('<button style="float:right; color:#333333;  " class="effect-add-button">+</button>');

            $('.effect-add-button').on('click', function(){

                var effect =__inst.effects_list[__inst.effects_list.length - 1];

                effect =  __inst.effects.triangleripple;

                var effect_select_next = __inst.gui.add(__inst, __inst.effects_list[__inst.effects_list.length - 1], Object.keys(__inst.effects));


            });

            if(!effect)
            {
                effect_select.setValue('triangleripple');

                __inst.selected_effect = __inst.effects.triangleripple;

            }

            effect_select.onFinishChange(function(value){

                __inst.selected_effect = __inst.effects[value];

                __inst.guiCallback(__inst.selected_effect, callback);



            });


          var lp =  __inst.gui.add(__inst, 'loopBack');

          lp.onChange(function(value){

             __inst.loopBack = value;

          });

            DatGui.addMotionCurveSelect(__inst, __inst.gui);

        }

        setValues(this.gui);

        DatGui.updateableAnimationObjectToGui( __inst.gui, __inst);

        window.setTimeout(function(){

            callback(__inst.gui);

        }, 200);

        return this.gui;

    }

    get_image_data_array(sourceImageData, dataListCallback)
    {

        __inst.image_data_list = [];

            if (sourceImageData && this.selected_effect.hasOwnProperty('filter')) {

                this.values = JSON.parse(jstr(this.startValues));

                var __inst = this;

                var tween =  new TWEEN.Tween(this.values).to(this.endValues, this.duration).easing(this.curve).onUpdate(function () {

                    __inst.counter += 1;

                    var img = {data:__inst.image_data_list.data.slice(0)} ;

                    __inst.selected_effect.filter(img, __inst.values);



                    __inst.image_data_list.push(img);


                    console.log('tween update');



                }).onComplete(function(){  __inst.counter = 0;


                    __inst.image_data_list = __inst.loopBack ? __inst.image_data_list.concat(__inst.image_data_list.slice().reverse()): __inst.image_data_list;


                if(dataListCallback){

                    dataListCallback(image_data_list); }



                }).start();

            }

        }

     get_canvas_array(sourceImageData, canvasCallback) {

    this.canvasList = [];

    if (sourceImageData && this.selected_effect.hasOwnProperty('filter')) {

        var timer = 0;

        var __inst = this;

        this.image_ix = 0;


        var copyImageData = function copyImageData(ctx, src) {
            var dst = ctx.createImageData(src.width, src.height);
            dst.data.set(src.data);
            return dst;
        };

        if(!this.complete) {

            this.values = JSON.parse(jstr(this.startValues));

           __inst.tween = new TWEEN.Tween(this.values).to(this.endValues, this.duration).easing(this.curve).onUpdate(function () {

                var c = document.createElement('CANVAS'), ct = c.getContext('2d');

                c.width = sourceImageData.width;

                c.height = sourceImageData.height;

                c.style.background = "blue";

                ct.restore();

                ct.save();

                var img = copyImageData(ct, sourceImageData);

                __inst.selected_effect.filter(img, __inst.values);

                ct.putImageData(img, 0, 0);

                if(__inst.foldLeft)
                {
                    var left = ct.getImageData(0, 0, c.width / 2, c.height);

                    ct.translate(c.width / 2, 0);

                    ct.scale(-1, 1);

                    ct.putImageData(left, 0, 0);

                }

               if(__inst.foldTop)
               {
                   var top = ct.getImageData(0, 0, c.width, c.height / 2);

                   ct.translate(0, c.height / 2);

                   ct.scale(1, -1);

                   ct.putImageData(top, 0, 0);

               }



               __inst.canvasList.push(c);

                console.log('tween update');




            }).onComplete(function () {

                console.log('complete');

               if(!__inst.complete)
                {

                __inst.complete = true;


                    __inst.canvasList = __inst.loopBack ? __inst.canvasList.concat(__inst.canvasList.slice().reverse()): __inst.canvasList;

                    if(canvasCallback){



                        canvasCallback(__inst.canvasList) };


                    __inst.tween.stop();



                }


            }).start();

        }

    }

    var animate = function()
    {
        if(!__inst.complete) {

            TWEEN.update();

            requestAnimationFrame(animate);

        }

    }

        animate();

}

    apply(sprite, canvas)
    {

        this.sprite = sprite;

        this.canvas = canvas;

        if(this.counter == 0) {

            if (canvas && this.selected_effect && this.selected_effect.hasOwnProperty('filter')) {

                this.timer_diff = 0;

                var frameIndex = 0;

                var ctx = canvas.getContext('2d');

                this.source_image = this.source_image || false;


                function copyImageData(ctx, src) {
                    var dst = ctx.createImageData(src.width, src.height);
                    dst.data.set(src.data);
                    return dst;
                }

                this.values = JSON.parse(jstr(this.startValues));

                var __inst = this;


                __inst.image_data_list = [];

              var tween =  new TWEEN.Tween(this.values).to(this.endValues, this.duration).easing(this.curve).onUpdate(function () {

                    if (!__inst.source_image) {

                        __inst.source_image = ctx.getImageData(sprite.position.x, sprite.position.y, sprite.size.x, sprite.size.y);

                        console.log('image is set');

                    }

                    sprite.selected_animation.selected_frame.image.data = false;

                    var img = copyImageData(ctx, __inst.source_image);

                  //  console.log(jstr(__inst.values));



                    __inst.selected_effect.filter(img, __inst.values);


                  __inst.image_data_list.push(img);

                  sprite.selected_animation.selected_frame.image.data = img;


                  __inst.counter += 1;



                }).onComplete(function(){

if(__inst.loopBack)
{


    var tween2 =  new TWEEN.Tween(__inst.values).to(__inst.startValues, __inst.duration).easing(__inst.curve).onUpdate(function () {

        if (!__inst.source_image) {

            __inst.source_image = ctx.getImageData(sprite.position.x, sprite.position.y, sprite.size.x, sprite.size.y);

        }

        sprite.selected_animation.selected_frame.image.data = false;

        var img = copyImageData(ctx, __inst.source_image);

        //  console.log(jstr(__inst.values));



        __inst.selected_effect.filter(img, __inst.values);


        __inst.image_data_list.push(img);

        sprite.selected_animation.selected_frame.image.data = img;


    }).onComplete(function(){  __inst.counter = 0;


    }).start();

}
                  else
                  {
                      __inst.counter = 0;
                  }


              }).start();

            }

        }

    }


}







;


class Extras
{

    constructor(args)
    {
        this.items = args || [];

        if(typeof(this.items)== 'object')
        {
            this.items = [this.items]; //assert array from single object
        }

        var allowedTypes = ['Sound', 'GameText', 'StatDisplay', 'Menu'];

        if(!(this.items instanceof Array))
        {

            return console.error('Quick2d.Extras.call(), needs array argument');

        }

    }

    call()
    {
        var items = this.items;
        //a callable item can be one-time executed: it will have any of the following functions attached

        for(var x = 0; x < items.length; x++)
        {
            var item = items[x];

            if(typeof(item.play) == 'function')
            {
                item.play();

            }


            if(typeof(item.engage) == 'function')
            {
                item.engage();

            }

            if(typeof(item.fire) == 'function')
            {
                item.fire();

            }

            if(typeof(item.start) == 'function')
            {
                item.start();

            }

            if(typeof(item.run) == 'function')
            {
                item.run();

            }

            if(typeof(item.process) == 'function')
            {
                item.process();

            }

        }

    }

}










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

class GravityForce
{
    constructor(args)
    {

        this.name = args.name || "";

        this.description = args.description || "";

        this.subjects = args.subjects || [];

        this.clasticObjects = args.clasticObjects || [];

        this.topClastics = args.topClastics || [];

        this.max = args.max || new Vector3(3, 3, 3);
         this.accel = args.accel || new Vector3(1.3, 1.3, 1.3);


        for(var x in this.clasticObjects)
        {
            if(!this.clasticObjects[x] instanceof Sprite)
            {
                this.clasticObjects[x] = Gamestack.getById(this.clasticObjects[x].id);
            }

        }


        for(var x in this.topClastics)
        {
            if(!this.topClastics[x] instanceof Sprite)
            {
                this.topClastics[x] = Gamestack.getById(this.topClastics[x].id);
            }

        }



        for(var x in this.subjects)
        {
            if(!this.subjects[x] instanceof Sprite)
            {
                this.subjects[x] = Gamestack.getById(this.subjects[x].id);
            }

        }

    }

    getArg(args, key, fallback) {

        if (args.hasOwnProperty(key)) {

            return args[key];

        }
        else {
            return fallback;

        }

    }


    update()
    {

      var  subjects = this.subjects;

       var clasticObjects =  this.clasticObjects;

        var topClastics =  this.topClastics;

      var  accel =  this.accel || {};

        var max =  this.max || {};

        __gameStack.each(subjects, function(ix, itemx){

           itemx.accelY(accel, max);

           itemx.__inAir = true;


            if(itemx.position.y >= itemx.groundMaxY)
            {


                itemx.position.y = itemx.groundMaxY;

            }

            itemx.groundMaxY = 3000000; //some crazy number you'll never reach in-game

            __gameStack.each(clasticObjects, function(iy, itemy){

                itemx.collide_stop(itemy);

            });

            __gameStack.each(topClastics, function(iy, itemy){

                itemx.collide_stop_top(itemy);

            });

        });
    }
};

let Force = GravityForce;

 Gamestack.Force = Force;

 Gamestack.GravityForce = GravityForce;





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

class GamepadAdapter {

    constructor() {

        this.__gamepads = [];

        this.intervals = [];

        let controller_stack = this;

        let _gpinst = this;

        this.events = [];

        window.setInterval(function () {

            var gps = navigator.getGamepads();

            _gpinst.gps = gps;

            for(var x = 0; x < gps.length; x++) {

            var events = _gpinst.__gamepads[x] ? _gpinst.__gamepads[x] : {};

             _gpinst.process(gps[x], events);

            }


        }, 20);

    }

    gamepads()
    {

        return  navigator.getGamepads();

    }


    disconnect_all() {

        for (var x = 0; x < this.intervals.length; x++) {

            window.clearInterval(this.intervals[x]);

        }

    }


    disconnect_by_index(game_pad_index) {

        window.clearInterval(this.intervals[game_pad_index]);

    }

    hasAnyPad() {
        return "getGamepads" in navigator;

    }

    Event(key, game_pad, callback) {
        return {

            key: key, game_pad:game_pad, callback: callback


        }

    }


    GamepadEvents(args)
    {

        var gp = {};

        gp.stick_left = args.stick_left || function(x, y)
        {

          //  console.log('Def call');

        }


        gp.stick_right = args.stick_right ||  function(x, y)
        {

        }

        gp.buttons = [];

        gp.extendFunc = function(f1, f2)
        {

            var fc = f2;

           return function(x, y){

                f2(x, y);

               f1(x, y);

            }

        };

        gp.on = function(key, callback)
        {

            if(this[key] && key !== "on")
            {

                var current_cb =  typeof(this[key]) == 'function' ? this[key] : function(x, y){};

               this[key] = this.extendFunc(callback, current_cb);


            }

            else if(key.indexOf('button') >= 0 && key.indexOf('_') >= 0 )
            {
                var parts = key.split('_');

                var number;

                try
                {

                    number = parseInt(parts[1]);


                    var current_cb =  typeof(this['buttons'][number]) == 'function' ? this['buttons'][number] : function(x, y){};

                    this['buttons'][number] = this.extendFunc(callback, current_cb);

                }
                catch (e)
                    {
                      console.error('could not parse "on" event with ' + key);

                    }

            }


        }

        this.__gamepads.push(gp);

        return gp;

    }



    process(gp, gpEvents)
    {

        this.process_buttons(gp, gpEvents);

        this.process_axes(gp, gpEvents);

    }

    process_axes(gp, events)
    {

        if(!gp || !gp['axes'])
        {

            return false;

        }



            for (var i = 0; i < gp.axes.length; i += 2) {

            var axis1 = gp.axes[i], axia2 = gp.axes[i + 1];

            var ix = (Math.ceil(i / 2) + 1), x = gp.axes[i], y = gp.axes[i + 1];

            if(ix == 1 && events.stick_left)
            {
                events.stick_left(x, y);

            }

            if(ix == 2 && events.stick_right)
            {
                events.stick_right(x, y);

            }

            if (this.events && this.events['stick_' + i] && typeof(this.events['stick_' + i].callback) == 'function') {
                this.events['stick_' + i].callback();

            }
        }

    }


    process_buttons(gp, events) {

        if(!gp || !gp['buttons'])
        {
             return false;

        }

        for (var i = 0; i < gp.buttons.length; i++) {


            if (typeof(events.buttons[i]) == 'function') {
                events.buttons[i](gp.buttons[i].pressed);
            }
            else if (typeof( events.buttons[i]) == 'object' && typeof(events.buttons[i].update) == 'function') {
                events.buttons[i].update(events.buttons[i].pressed);

            }
                var clearance_1 = this.events && this.events[i], gpc, bkey = "button_" + i;

                if (clearance_1) {
                    gpc = this.events[bkey] && !isNaN(this.events[bkey].game_pad) ? this.gamepads[this.events[bkey].game_pad] : this.events[bkey].game_pad;
                }
                ;

                if (clearance_1 && gpc && typeof(this.events[bkey].callback) == 'function') {
                    //call the callback
                    this.events[i].callback();

                }

            }


        }


    on(key, gpix, callback) {

        if(gpix >= this.__gamepads.length)
        {

            this.__gamepads.push(this.GamepadEvents({}));

        }

        this.__gamepads[gpix].on(key, callback);

    }


};

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

if(!__gameInstance.GamepadAdapter)
{
    __gameInstance.GamepadAdapter = new GamepadAdapter();

    __gameInstance.gamepads = [];

    GameStack.GamepadAdapter = __gameInstance.GamepadAdapter;

    GameStack.gamepads = __gameInstance.gamepads;

    GameStack.GamepadAdapter.on('stick_left', 0, function(x, y){

        console.log('Gamepad stick left');

    });

    GameStack.GamepadAdapter.on('button_0', 0, function(x, y){

        console.log('Gamepad button 0');

    });


    GameStack.GamepadAdapter.on('button_1', 0, function(x, y){

        console.log('Gamepad button 1');

    });

    GameStack.GamepadAdapter.on('button_2', 0, function(x, y){

        console.log('Gamepad button 2');

    });

    GameStack.GamepadAdapter.on('button_3', 0, function(x, y){

        console.log('Gamepad button 3');

    });

   // __gameInstance.gamepads.push(gamepad);

};



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

class Motion {
    constructor(args={}) {

        this.getArg = $Q.getArg;

        this.distance = Gamestack.getArg(args, 'distance', Gamestack.getArg(args, 'distances', false));

        this.curvesList = this.curvesObject(); //Tween.Easing

        this.parent_id = args.parent_id || args.object_id || "__blank"; //The parent object

        this.motion_curve = Gamestack.getArg(args, 'curve', TWEEN.Easing.Quadratic.InOut);

        this.line_curve = Gamestack.getArg(args, 'line_curve', TWEEN.Easing.Linear.None);

        this.rotation = Gamestack.getArg(args, 'rotation', 0);

        this.targetRotation = Gamestack.getArg(args, 'targetRotation', 0);

        this.name = Gamestack.getArg(args, 'name', "__");

        this.description = Gamestack.getArg(args, 'description', false);

        this.motionCurveString = this.getMotionCurveString(); //store a string key for the Tween.Easing || 'curve'

        this.lineCurveString = this.getLineCurveString(); //store a string key for the Tween.Easing || 'curve'

        this.setMotionCurve(this.motionCurveString);

        this.setLineCurve(this.lineCurveString);

        this.duration = Gamestack.getArg(args, 'duration', 500);

        this.delay = Gamestack.getArg(args, 'delay', 0);

    }


    curvesObject() {

        var c = [];

        GameStack.each(TWEEN.Easing, function (ix, easing) {

            GameStack.each(easing, function (iy, easeType) {

                if (['in', 'out', 'inout','none'].indexOf(iy.toLowerCase()) >= 0) {

                    c.push(ix + "_" + iy);

                }

            });

        });

        return c;

    }

    getMotionCurveString() {

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

    getLineCurveString() {

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

    setLineCurve(c) {

        var cps = c.split('_');

        var s1 = cps[0], s2 = cps[1];

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

    setMotionCurve(c) {

        var cps = c.split('_');

        var s1 = cps[0], s2 = cps[1];

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

    engage() {

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
            tweens[0] = new TWEEN.Tween(objects[0].rotation)
                .easing(__inst.curve || __inst.motion_curve)

                .to({x: targetR}, __inst.duration)
                .onUpdate(function () {
                    //console.log(objects[0].position.x,objects[0].position.y);


                })
                .onComplete(function () {
                    //console.log(objects[0].position.x, objects[0].position.y);
                    if (__inst.complete) {

                        __inst.complete();

                    }


                });


        }

        //we have a target
        tweens.push(new TWEEN.Tween(objects[0].position)
            .easing(__inst.motion_curve)

            .to(target, __inst.duration)
            .onUpdate(function () {
                //console.log(objects[0].position.x,objects[0].position.y);


            })
            .onComplete(function () {
                //console.log(objects[0].position.x, objects[0].position.y);

                if (__inst.complete) {

                    __inst.complete();

                }


            }));


        __inst.delay = !isNaN(__inst.delay) && __inst.delay > 0 ? __inst.delay : 0;


        return {

            tweens: tweens,

            delay: __inst.delay,

            fire: function () {

                var __tweenObject = this;

                window.setTimeout(function () {

                    for (var x = 0; x < __tweenObject.tweens.length; x++) {

                        __tweenObject.tweens[x].start();

                    }

                }, this.delay);

            }

        }

    }

    /**
     * start the Motion transition
     *
     * @function
     * @memberof Motion
     *
     **********/

    start() {
        this.engage().fire();

    }

    /**
     * specify a function to be called when Motion is complete
     *
     * @function
     * @memberof Motion
     * @param {Function} fun the function to be called when complete
     **********/

    onComplete(fun) {
        this.complete = fun;

    }

    // obj.getGraphCanvas( $(c.domElement), value.replace('_', '.'), TWEEN.Easing[parts[0]][parts[1]] );

    getGraphCanvas( t, f, c) {

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

        var position = {x: 5, y: 80};
        var position_old = {x: 5, y: 80};

        new TWEEN.Tween(position).to({x: 175}, 2000).easing(TWEEN.Easing.Linear.None).start();
        new TWEEN.Tween(position).to({y: 20}, 2000).easing(f).onUpdate(function () {

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

    getTweenPoints(size, line) {

        //must have line.minPointDist

        var curve = line.curve,
        duration = line.duration;

        var points = [];

        var position = new Vector(line.position);

        var target = new Vector(position).add(size);

        var start = new Vector(position);

        var dist = new Vector(0, 0, 0);

        var ptrack;


       var  easeInOutQuad =  function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t };


        return points;

       var t1 =  new TWEEN.Tween(position).to({x:target.x}, 2000).easing(TWEEN.Easing.Linear.None).start();

       if(t2)
       {
           t2.stop();
       }

      var t2 =  new TWEEN.Tween(position).to({y:target.y}, 2000).easing(curve).onUpdate(function () {


          if(ptrack){

              dist = ptrack.sub(p);

              var d = Math.sqrt( dist.x * dist.x + dist.y * dist.y );

              if(d >= line.minPointDist)
              {

                  points.push(p);

                  ptrack = new Vector(p);
              }

          }

          else{
              ptrack = p;

              points.push(p);
          };

        }).onComplete(function() {

            // alert(line.minPointDist);

            line.first_segment = points.slice();

            var extendLinePoints = function (segment, points, ix)
            {

            var next_points = segment.slice();

            var last_point = points[points.length - 1];

            for (var x = 0; x < next_points.length; x++) {

                var sr = new Vector(Gamestack.GeoMath.rotatePointsXY(line.size.x * ix, line.size.y * ix, line.rotation));

                var p = next_points[x].add(sr);

                if(points.indexOf(p) <= -1) {

                    points.push(p);


                }

            }
        };

        for(var x = 0; x <= line.curve_iterations; x++)
        {
            if(x > 1) {

                extendLinePoints(line.first_segment, line.points, x - 1);

            }

        }


        }).start();

        return points;
    }

}


Gamestack.Motion = Motion;







;
/**
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

class Projectile {

    constructor(args={}) {

        this.getArg = $Q.getArg;

        for(var x in args)
        {
            this[x] = args[x];

        }

        this.line = Gamestack.getArg(args, 'line', new Line());

        this.animation = Gamestack.getArg(args, 'animation', new Animation());

        this.parent_id = args.parent_id || args.object_id || "__blank"; //The parent object

        this.name = Gamestack.getArg(args, 'name', "__");

        this.size = Gamestack.getArg(args, 'size', new Vector());

        this.description = Gamestack.getArg(args, 'description', false);

        this.duration = Gamestack.getArg(args, 'duration', 500);

        this.delay = Gamestack.getArg(args, 'delay', 0);

        this.position = Gamestack.getArg(args, 'position', new Vector(0, 0, 0));

        this.motion_curve = Gamestack.getArg(args, 'motion_curve', TWEEN.Easing.Linear.None);

        this.highlighted = false;

        this.sprites = [];

    }

    /**
     * specify a function to be called when Motion is complete
     *
     * @function
     * @memberof Projectile
     * @param {Function} fun the function to be called when complete
     *
     **********/

    onComplete(fun) {
        this.complete = fun;

    }

    onCollide(fun) {
        this.collide = fun;

    }

    setAnimation(anime) {

        this.animation = anime;

        return this;

    }

    setMotionCurve(c) {

        this.motion_curve = c;

        return this;

    }

    kill_one()
    {

        var spr = this.sprites[this.sprites.length - 1];

        Gamestack.remove(spr);

    }


    fire(origin)
    {

        var sprite = new Sprite({image:this.animation.image});

        sprite.setAnimation(this.animation);

        sprite.setSize(this.size);

        sprite.position = new Vector(0, 0, 0);

        var __inst = this;

        var lp = __inst.line.transpose(origin);

        sprite.position = new Vector(lp[0].sub(sprite.size.div(2)));

        sprite.onUpdate(function(sprite)
        {

            for(var x = 0; x <  lp.length; x++)
            {

                if(sprite.center().equals(lp[x]) && x < lp.length - 1)
                {

                    sprite.position = new Vector(lp[x+1].sub(sprite.size.div(2)));

                    break;
                }

                if(x==lp.length - 1)
                {
                    Gamestack.remove(sprite);

                }

            }

        });

        Gamestack.add(sprite);

        this.sprites.push(sprite);

    }

}


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

class Rectangle {

    constructor(min, max) {

        this.min = min;
        this.max = max;

    }


}
;


let VectorBounds = Rectangle;



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


class VectorFrameBounds extends Rectangle {

    constructor(min, max, termPoint) {

        super(min, max);

        this.termPoint = termPoint || new Vector3(this.max.x, this.max.y, this.max.z);

    }


}
;



Gamestack.VectorFrameBounds = VectorFrameBounds;




var Curves = { //ALL HAVE INPUT AND OUTPUT OF: 0-1.0
    // no easing, no acceleration
    linearNone: function (t) { return t },
    // accelerating from zero velocity
    easeInQuadratic: function (t) { return t*t },
    // decelerating to zero velocity
    easeOutQuadratic: function (t) { return t*(2-t) },
    // acceleration until halfway, then deceleration
    easeInOutQuadratic: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
    // accelerating from zero velocity
    easeInCubic: function (t) { return t*t*t },
    // decelerating to zero velocity
    easeOutCubic: function (t) { return (--t)*t*t+1 },
    // acceleration until halfway, then deceleration
    easeInOutCubic: function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
    // accelerating from zero velocity
    easeInQuartic: function (t) { return t*t*t*t },
    // decelerating to zero velocity
    easeOutQuartic: function (t) { return 1-(--t)*t*t*t },
    // acceleration until halfway, then deceleration
    easeInOutQuartic: function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
    // accelerating from zero velocity
    easeInQuintic: function (t) { return t*t*t*t*t },
    // decelerating to zero velocity
    easeOutQuintic: function (t) { return 1+(--t)*t*t*t*t },
    // acceleration until halfway, then deceleration
    easeInOutQuintic: function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t }
}


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

class Line
{
    constructor(args = {})
    {

        this.curve = args.curve || TWEEN.Easing.Linear.None;

        this.motion_curve = args.motion_curve || TWEEN.Easing.Linear.None;

        this.points = [];

        this.position = args.position ||  new Vector();

        this.offset = args.offset || new Vector();

        this.pointDist = 5;

        this.size = args.size || new Vector();

        this.rotation = args.rotation || 0;

        this.iterations = 1;

        this.growth = args.growth || 1.2;

    }

    Iterations(n)
    {

       this.iterations = n;
       return this;
    }

    Growth(n)
    {
        this.growth = n;

        return this;

    }

    Pos(p)
    {

        this.position = p;
        return this;
    }

    PointDisp(num)
    {
        this.minPointDist = num;
        return this;
    }

    Curve(c)
    {
        this.curve = c;
        return this;
    }

    Duration(d)
    {
        this.duration = d;

        return this;
    }

    get_curve_from_keys(xkey, ykey)
    {

            for (var x in Curves) {
                if (x.toLowerCase().indexOf(xkey) >= 0 && x.toLowerCase().indexOf(ykey) >= 0) {
                    // alert('found curve at:' + x)

                    return Curves[x];

                }

            }


    }

    get_curve(c)
    {

        for(var x in TWEEN.Easing)
    {

        for(var y in TWEEN.Easing[x])
        {

           if( TWEEN.Easing[x][y] == c)
           {

              // alert('found curve at:' + x + ':' + y);

               return this.get_curve_from_keys(x.toLowerCase(), y.toLowerCase());

           }


        }

    }

    }

    fill(size, pointDist)
    {

       console.log(jstr([size, pointDist]));

        if(!size || !pointDist) //***PREVENT DOUBLE RUN
        {

            return 0;
        }

        this.size = size;

        this.pointDist = pointDist;

        var __inst = this;

        this.points = [];

        var current_point = new Vector(this.position), yTrack = 0;

        for(var x= 0; x <= this.iterations; x++) {

            var position = new Vector(current_point),

                target = new Vector(position.add(size)),

                start = new Vector(position),

                curveMethod = this.get_curve(this.curve),

                ptrack = new Vector(start);

            for (position.x = position.x; position.x < target.x; position.x += 1) {

                var dist = position.sub(start);

                var pct = dist.x / size.x;

                console.log(pct);

                position.y = Math.round(curveMethod(pct) * size.y + (yTrack));

                if (ptrack.trig_distance_xy(position) >= this.pointDist) {

                    var p = new Vector(Gamestack.GeoMath.rotatePointsXY(position.x, position.y, this.rotation));

                    this.points.push(p);

                    current_point = new Vector(position);

                }
            }

            yTrack += size.y;

            size = size.mult(this.growth);


        }
    }

    transpose(origin)
    {

        var t_points = [];

        for(var x = 0; x < this.points.length; x++) {

            t_points.push(this.points[x].add(origin));

        }

        return t_points;

    }

    add_segment(next_segment, offset)
    {
        for(var x = 0; x < next_segment.length; x++) {

            next_segment[x] = new Vector(next_segment[x]).add(offset);

            this.points.push(next_segment[x]);

        }

    }


    get_flipped_segment(points)
    {

        var t_points = points.slice(), t_len = t_points.length;

        for(var x = 0; x < points.length; x++) {

            t_points[t_len - x].x = points[x].x

        }

        return t_points;

    }

    Highlight(origin, ctx)
    {

        ctx = ctx || Gamestack.ctx;

        for(var x in this.points)
        {

            var point = origin.add(this.points[x]).sub(Gamestack.point_highlighter.size.mult(0.5));

            var dist = point.sub(Gamestack.point_highlighter.position);

            var d = Math.sqrt( dist.x * dist.x + dist.y * dist.y );


            if(d >= 10)
            {
                Gamestack.point_highlighter.position = new Vector2(origin.add(this.points[x]).sub(Gamestack.point_highlighter.size.mult(0.5)));
            }


               Canvas.draw(Gamestack.point_highlighter, ctx);

        }

        return this;

    }

}


var GeoMath = {

        rotatePointsXY:function(x,y,angle) {

            var theta = angle*Math.PI/180;

            var point = {};
            point.x = x * Math.cos(theta) - y * Math.sin(theta);
            point.y = x * Math.sin(theta) + y * Math.cos(theta);

            point.z = 0;

            return point
        }

}

Gamestack.GeoMath = GeoMath;
;
/**
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

class Sprite {
    constructor(args) {

        if (!args) {
            args = {};
        }

        if(args instanceof Animation)
        {

            args = {selected_animation:args, size:new Vector(args.frameSize)};
        }

        this.active = true; //active sprites are visible

        this.name = args.name || "__";

        this.description = args.description || "__";

        this.gravity = "medium";

        this.__initializers = __gameStack.getArg(args, '__initializers', []);

        var _spr = this;

        Gamestack.each(args, function (ix, item) { //apply all args

            if (ix !== 'parent') {
                _spr[ix] = item;
            }

        });

        this.type = __gameStack.getArg(args, 'type', 'basic');

        this.animations = __gameStack.getArg(args, 'animations', []);

        this.motions = __gameStack.getArg(args, 'motions', []);

        this.projectiles = __gameStack.getArg(args, 'projectiles', []);

        let __inst = this;

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


        //Apply initializers:

        GameStack.each(this.__initializers, function (ix, item) {

            __inst.onInit(item);

        });


        if (args.selected_animation) {
            this.selected_animation = new Animation(args.selected_animation);

        }
        else {

            this.image.domElement.onload = function(){

                __inst.setAnimation(__inst.animations[0] || new Animation({

                        image:  __inst.image,

                        frameSize: new Vector3( __inst.image.domElement.width,  __inst.image.domElement.height),

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

    init() {



    }

    /**
     * This function extends the init() function. Takes single function() argument OR single string argument
     * @function
     * @memberof Sprite
     * @param {function} fun the function to be passed into the init() event of the Sprite()
     **********/

    onInit(fun) {

        if (typeof fun == 'string') {

            if (this.__initializers.indexOf(fun) < 0) {

                this.__initializers.push(fun)
            }
            ;

            var __inst = this;

            var keys = fun.split('.');

            console.log('finding init from string:' + fun);

            if (!keys.length >= 2) {
                return console.error('need min 2 string keys separated by "."');
            }

            var f = GameStack.options.SpriteInitializers[keys[0]][keys[1]];

            if (typeof(f) == 'function') {

                var __inst = this;

                var f_init = this.init;

                this.init = function () {

                    f_init(__inst);

                    f(__inst);

                };

            }


        }

        else if (typeof fun == 'function') {

            console.log('extending init:');


            var f_init = this.init;
            var __inst = this;

            this.init = function () {

                f_init(__inst);

                fun(__inst);

            };


        }

        else if (typeof fun == 'object') {

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

    get_id() {
        return this.id;
    }



    to_map_object(size, framesize) {

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

    create_id() {

        return Quick2d.create_id();

    }


    /**
     * This function sets the size of the Sprite()
     * @function
     * @memberof Sprite
     **********/

    setSize(size) {

        this.size = new Vector3(size.x, size.y, size.z);

    }

    /**
     * This function sets the position of the Sprite()
     * @function
     * @memberof Sprite
     **********/

    setPos(pos) {
        this.position = new Vector3(pos.x, pos.y, pos.z || 0);

    }

    /**
     * This function sizes the Sprite according to minimum dimensions and existing w/h ratios
     * @param {number} mx the maximum size.x for the resize
     * @param {number} my the maximum size.y for the resize
     * @function
     * @memberof Sprite
     **********/

   getCappedSizeXY(mx, my, currentSize)
    {

        var size = new Vector3(currentSize || this.size);

        var wth = size.y /  size.x;

        var htw = size.x /  size.y;

        if( size.x > mx)
        {
            size.x = mx;

            size.y = size.x * wth;

        }

        if( size.y > my)
        {
            size.y = my;

            size.x = size.y * htw;

        }

        return size;

    }




    /*****************************
     *  assertSpeed()
     *  -assert the existence of a speed{} object
     ***************************/

    assertSpeed() {
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

    setAnimation(anime) {

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

    onScreen(w, h) {

        w = w || __gameStack.WIDTH;

        h = h || __gameStack.HEIGHT;


        var camera = __gameStack.camera ||__gameStack.__gameWindow.camera || new Vector3(0, 0, 0);

        var p = new Vector3(this.position.x - camera.position.x, this.position.y - camera.position.y, this.position.z - camera.position.z);

        var onScreen = p.x  > 0 - this.size.x && p.x < w + this.size.x
        &&  p.y  > 0 - this.size.x && p.y < h + this.size.y ? true : false;

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


    update(sprite) {
    }

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

    def_update(sprite) {


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

            if ( this.rot_speed[x] > 0 || this.rot_speed[x] < 0) {

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

    resolveFunctionFromDoubleKeys(keyString1, keyString2, obj, callback) {

        callback(typeof obj[keyString1][keyString2] == 'function' ? obj[keyString1][keyString2] : {});

    }

    /**
     * This function extends an existing function, and is applied by Gamestack in onInit();
     * @function
     * @memberof Sprite
     **********/

    extendFunc(fun, extendedFunc) {

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


    onUpdate(fun) {
        fun = fun || function () {
            };

        let update = this.update;

        let __inst = this;

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


    collidesRectangular(sprite) {

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

    shoot(options) {
        //character shoots an animation

        this.prep_key = 'shoot';

        let animation = options.bullet || options.animation || new Animation();

        let speed = options.speed || 1;

        let position = options.position || new Vector3(this.position);

        let size = options.size || new Vector3(10, 10, 0);

        let rot_offset = options.rot_offset || new Vector3(0, 0, 0);

        if (__gameInstance.isAtPlay) {

            var bx = position.x, by = position.y, bw = size.x, bh = size.y;

            var shot = __gameStack.add(new Sprite({

                active: true,

                position: position,

                size: size,

                image: animation.image,

                rotation: new Vector3(0, 0, 0),

                flipX: false

            }));

            shot.setAnimation(animation);

            if (typeof(rot_offset) == 'number') {
                rot_offset = new Vector3(rot_offset, 0, 0);
            }

            shot.position.x = bx, shot.position.y = by;
            shot.rotation.x = 0 + rot_offset.x;

            shot.stats = {
                damage: 1

            };

            shot.speed.x = Math.cos((shot.rotation.x) * 3.14 / 180) * speed;

            shot.speed.y = Math.sin((shot.rotation.x) * 3.14 / 180) * speed;

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

    subsprite(options) {

        let animation = options.animation || new Animation();

        let position = options.position || new Vector3(this.position);

        let offset = options.offset || new Vector3(0, 0, 0);

        let size = options.size || this.size;

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

        }
        else
        {
            alert('No subsprite when not at play');

        }

    }


    /**
     * animate Sprite.selected_animation  by one frame
     * @function
     * @memberof Sprite
     * @param {Animation} animation to use, defaults to Sprite.selected_animation
     **********/

    animate(animation) {

        if (__gameInstance.isAtPlay) {

            if (animation) {
                this.setAnimation(animation)
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

    onAnimationComplete(fun) {
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

    accelY(accel, max) {

        accel = Math.abs(accel);

        if (typeof(max) == 'number') {
            max = {y: max};

        }

        this.assertSpeed();

        let diff = max.y - this.speed.y;

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


    accelX(accel, max) {

        accel = Math.abs(accel);

        if (typeof(max) == 'number') {
            max = {x: max};

        }

        this.assertSpeed();

        let diff = max.x - this.speed.x;

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

    accel(prop, key, accel, max) {

        accel = Math.abs(accel);

        if (typeof(max) == 'number') {
            max = {x: max};

        }

        let speed = prop[key];

        // this.assertSpeed();

        let diff = max.x - prop[key];

        if (diff > 0) {
            prop[key] += Math.abs(diff) >= accel ? accel : diff;

        }
        ;

        if (diff < 0) {
            prop[key] -= Math.abs(diff) >= accel ? accel : diff;

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

    decel(prop, key, rate) {
        if (typeof(rate) == 'object') {

            rate = rate.rate;

        }

        rate = Math.abs(rate);

        if (Math.abs(prop[key]) <= rate) {
            prop[key] = 0;
        }

        else if (prop[key] > 0) {
            prop[key] -= rate;

        }
        else if (prop[key] < 0) {
            prop[key] += rate;

        }
        else {

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

    decelY(amt) {

        amt = Math.abs(amt);

        if (Math.abs(this.speed.y) <= amt) {
            this.speed.y = 0;

        }
        else if (this.speed.y > amt) {

            this.speed.y -= amt;
        }
        else if (this.speed.y < amt * -1) {

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

    decelX(amt) {

        amt = Math.abs(amt);


        if (this.speed.x > amt) {

            this.speed.x -= amt;
        }
        else if (this.speed.x < amt * -1) {

            this.speed.x += amt;
        }

        if (Math.abs(this.speed.x) <= amt) {

            this.speed.x = 0;

        }

    }



    shortest_stop(item, callback) {
        var diff_min_y = item.min ? item.min.y : Math.abs(item.position.y - this.position.y + this.size.y);

        var diff_min_x = item.min ? item.min.x : Math.abs(item.position.x - this.position.x + this.size.x);

        var diff_max_y = item.max ? item.max.y : Math.abs(item.position.y + item.size.y - this.position.y);

        var diff_max_x = item.max ? item.max.x : Math.abs(item.position.x + item.size.x - this.position.y);

        var dimens = {top: diff_min_y, left: diff_min_x, bottom: diff_max_y, right: diff_max_x};

        var minkey = "", min = 10000000;

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

    center() {


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

    overlap_x(item, padding) {
        if (!padding) {
            padding = 0;
        }

        var paddingX = Math.round(padding * this.size.x),

            paddingY = Math.round(padding * this.size.y), left = this.position.x + paddingX,
            right = this.position.x + this.size.x - paddingX,

            top = this.position.y + paddingY, bottom = this.position.y + this.size.y - paddingY;

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

    overlap_y(item, padding) {
        if (!padding) {
            padding = 0;
        }

        var paddingX = Math.round(padding * this.size.x),

            paddingY = Math.round(padding * this.size.y), left = this.position.x + paddingX,
            right = this.position.x + this.size.x - paddingX,

            top = this.position.y + paddingY, bottom = this.position.y + this.size.y - paddingY;

        return bottom > item.position.y && top < item.position.y + item.size.y;

    }

    /*************
     * #BE CAREFUL
     * -with this function :: change sensitive / tricky / 4 way collision
     * *************/



    collide_stop_x(item)
    {

        var apart = false;

            var ct = 10000;

            while (!apart && ct > 0) {

                ct--;

                var diffX = this.center().sub(item.center()).x;

                var distX = Math.abs(this.size.x / 2 + item.size.x / 2 - Math.round(this.size.x * this.padding.x));

                if (Math.abs(diffX) < distX) {

                    this.position.x -= diffX > 0 ? -1 : 1;



                }
                else
                {

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

    collide_stop(item) {

        if(this.id == item.id)
        {
            return false;

        }

       // this.position = this.position.sub(this.speed);

        if(this.collidesRectangular(item)) {

            var diff = this.center().sub(item.center());

            if(this.overlap_x(item, this.padding.x + 0.1) && Math.abs(diff.x) < Math.abs(diff.y))
           {

               var apart = false;

                   var ct = 10000;

                   while (!apart && ct > 0) {

                       ct--;

                       var diffY = this.center().sub(item.center()).y;

                       var distY = Math.abs(this.size.y / 2 + item.size.y / 2- Math.round(this.size.y * this.padding.y));

                       if (Math.abs(diffY) < distY) {

                           this.position.y -= diffY > 0 ? -1 : diffY < 0 ? 1 : 0;

                           this.position.y = Math.round(this.position.y);

                       }

                     else {

                           if (diffY <= 0){
                               this.__inAir = false;
                           };


                          return apart = true;


                       }


               }



           }


            if(this.overlap_y(item, this.padding.y ) && Math.abs(diff.y) < Math.abs(diff.x)) {

                this.collide_stop_x(item);

            }


        }


    }



    collide_stop_top(item)
    {


        if(this.id == item.id)
        {
            return false;

        }


            if(this.overlap_x(item, this.padding.x + 0.1))
            {

                console.log('OVERLAP_X');

                var paddingY = this.padding.y * this.size.y;

                if(this.position.y + this.size.y - paddingY <= item.position.y)
                {

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

    restoreFrom(data) {
        data.image = new GameImage(data.src || data.image.src);

        return new Sprite(data);

    }


    /*****************************
     *  fromFile(file_path)
     *  -TODO : complete this function based on code to load Sprite() from file, located in the spritemaker.html file
     *  -TODO: test this function
     ***************************/

    fromFile(file_path) {

        if (typeof file_path == 'string') {

            var __inst = this;

            $.getJSON(file_path, function (data) {

                __inst = new Sprite(data);

            });

        }


    }

}
;

/****************
 * TODO : Complete SpritePresetsOptions::
 *  Use these as options for Sprite Control, etc...
 ****************/



Gamestack.Sprite = Sprite;

let SpriteInitializersOptions = {

    Collideables:{

        top_collideable:function(sprite)
        {

            for(var x in Gamestack.__gameWindow.forces)
            {
                var force = Gamestack.__gameWindow.forces[x];

                force.topClastics.push(sprite);

            }


            sprite.onUpdate(function(){


            });

        },

        fourside_collideable:function(sprite)
        {

            for(var x in Gamestack.__gameWindow.forces)
            {
                var force = Gamestack.__gameWindow.forces[x];

                force.clasticObjects.push(sprite);

            }

            sprite.onUpdate(function(){


            });


        }
    },

    MainGravity:{

        very_light:function(sprite)
        {
            //Add a gravity to the game

            var gravity = Gamestack.add(new Force({
                name:"very_light_grav",
                accel:0.05,
                max:new Vector3(0, 3.5, 0),
                subjects:[sprite], //sprite is the subject of this Force, sprite is pulled by this force
                clasticObjects:[] //an empty array of collideable objects

            }));

            sprite.onUpdate(function(){


            });

        },

        light:function(sprite)
        {

            var gravity = Gamestack.add(new Force({
                name:"light_grav",
                accel:0.1,
                max:new Vector3(0, 4.5, 0),
                subjects:[sprite], //sprite is the subject of this Force, sprite is pulled by this force
                clasticObjects:[] //an empty array of collideable objects

            }));


            sprite.onUpdate(function(){


            });

        },

        medium:function(sprite)
        {

            var gravity = Gamestack.add(new Force({
                name:"medium_grav",
                accel:0.2,
                max:new Vector3(0, 7.5, 0),
                subjects:[sprite], //sprite is the subject of this Force, sprite is pulled by this force
                clasticObjects:[] //an empty array of collideable objects

            }));


            sprite.onUpdate(function(){


            });

        },


        strong:function(sprite)
        {

            var gravity = Gamestack.add(new Force({
                name:"strong_grav",
                accel:0.4,
                max:new Vector3(0, 10.5, 0),
                subjects:[sprite], //sprite is the subject of this Force, sprite is pulled by this force
                clasticObjects:[] //an empty array of collideable objects

            }));

            sprite.onUpdate(function(){


            });

        },

        very_strong:function(sprite)
        {

            var gravity = Gamestack.add(new Force({
                name:"strong_grav",
                accel:0.5,
                max:new Vector3(0, 12.5, 0),
                subjects:[sprite], //sprite is the subject of this Force, sprite is pulled by this force
                clasticObjects:[] //an empty array of collideable objects

            }));

            sprite.onUpdate(function(){


            });

        },

    },


    ControllerStickMotion: {

        player_move_x: function (sprite) {

            alert('applying initializer');

            console.log('side_scroll_player_run:init-ing');

            let __lib = Gamestack || Quick2d;

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

                }
                else if (x > 0.2) {
                    sprite.flipX = false;

                }

            });

            sprite.onUpdate(function (spr) {

                spr.decelX(0.1);

                if (!spr.__falling) {
                    spr.decelY(0.2)
                }
                ;

            });


        },

        player_move_xy: function (sprite) {

            alert('applying initializer');

            console.log('side_scroll_player_run:init-ing');

            let __lib = Gamestack || Quick2d;

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

                }
                else if (x > 0.2) {
                    sprite.flipX = false;

                }

            });

            sprite.onUpdate(function (spr) {

                sprite.decel(sprite.speed, 'x', 0.1);

                sprite.decel(sprite.speed, 'y', 0.1);

            });


        },

        player_rotate_x: function (sprite) {

            let __lib = Gamestack || Quick2d;

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

                }
                else if (x > 0.2) {
                    sprite.flipX = false;

                }

            });

            sprite.onUpdate(function (spr) {

                sprite.decel(sprite.rot_speed, 'x', 0.1);

                if (!spr.__falling) {
                    spr.decelY(0.2)
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


class Vector {
    constructor(x, y, z, r) {

        if(typeof(x) == 'object' && x.hasOwnProperty('x') && x.hasOwnProperty('y')) //optionally pass vector3
        {
            this.x = x.x;
            this.y = x.y;
            this.z = x.z || 0;

            if(this.z == null)
            {
                this.z = 0;
            }

            return this;
        }

        if(z == null){z = 0;}

        this.x = x;
        this.y = y;
        this.z = z;
        this.r = r;

    }


    sub(v)
    {
        if(typeof(v) == 'number')
        {
            v = {x:v, y:v, z:v};
        };

        return new Vector(this.x - v.x, this.y - v.y, this.z - v.z);

    }

    add(v)
    {
        if(typeof(v) == 'number')
        {
            v = {x:v, y:v, z:v};
        };

        return new Vector(this.x + v.x, this.y + v.y, this.z + v.z);

    }

    mult(v)
    {
        if(typeof(v) == 'number')
        {
            v = {x:v, y:v, z:v};
        };

        return new Vector(this.x * v.x, this.y * v.y, this.z * v.z);

    }
    div(v)
    {
        if(typeof(v) == 'number')
        {
            v = {x:v, y:v, z:v};
        };

        return new Vector(this.x / v.x, this.y / v.y, this.z / v.z);
    }

    round()
    {
        return new Vector(Math.round(this.x), Math.round(this.y), Math.round(this.z));

    }
    floor()
    {
        return new Vector(Math.floor(this.x), Math.floor(this.y), Math.floor(this.z));

    }
    ceil()
    {
        return new Vector(Math.ceil(this.x), Math.ceil(this.y), Math.ceil(this.z));

    }

    equals(v)
    {

        return this.x == v.x && this.y == v.y && this.z == v.z;
    }

    trig_distance_xy(v)
    {

        var dist = this.sub(v);

        return  Math.sqrt( dist.x * dist.x + dist.y * dist.y );

    }

    diff()
    {
        //TODO:this function


    }

    abs_diff()
    {
        //TODO:this function

    }

    is_between(v1, v2)
    {
       //TODO : overlap vectors return boolean

        return this.x >= v1.x && this.x <= v2.x &&
            this.y >= v1.y && this.y <= v2.y &&
            this.z >= v1.z && this.z <= v2.z;


    }

}
;

let Vector3 = Vector, Pos = Vector, Size = Vector, Position = Vector, Vector2 = Vector, Rotation = Vector;


Gamestack.Vector = Vector;


//The above are a list of synonymous expressions for Vector. All of these do the same thing in this library (store x,y,z values)
;

class InterfaceCallback
{
    constructor({name, description, callback})
    {

       this.name = name;

       this.description = description;

       this.callback = callback || function(){ console.info('The call was empty'); };

    }

    run()
    {

        this.callback();

    }

}


class SpeechInterfaceStructure
{
    constructor({name, description})
    {
        this.name = name || "Program helper.";

        this.description = description || "An interface for the game-builder program.";

        this.options_structure = {

        scroll:function(x, y){}, //simple scroll controller



        create_object_resource:{

            constructors:Quazar.IF.__allConstructors(),

            selectedType:false,

            selectByName:Quazar.IF.selectByName,

            apply_speech_value:Quazar.IF.applySpeechValue()

        }, //apply each class in the program, with means of creating / instantiating

        save_object_resource:{

            selected_object:false,

            confirm:Quazar.IF.confirmation()

        }, //apply each class in the program, with means of saving

        retrieve_object_resource:{}, //retrieve

        browse_object_resources:{}, //browsing

        search_object_resources:{}, //searching

        delete_object_resources:{}, //delete

        apply_value:{} //apply a value to an object resource

        }

    }

}








