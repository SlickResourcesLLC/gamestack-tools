
/**
 * Sound
 * :Simple Sound object:: uses Jquery: audio
 * @param   {string} src : source path / name of the targeted sound-file

 * @returns {Sound} object of Sound()
 * */

class Sound {

    constructor(src) {

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

        this.onLoad = this.onLoad || function () {
            };

        if (typeof(this.onLoad) == 'function') {

            this.onLoad(this.sound);

        }

    }

    play() {
        if (typeof(this.sound) == 'object' && typeof(this.sound.play) == 'function') {

            this.sound.play();

        }


    }

}


/**
 * GameImage
 *
 * Simple GameImage
 * @param   {string} src : source path / name of the targeted image-file

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


let GameStackLibrary = function () {


    var lib = {

        DEBUG: false,

        gui_mode: true,

        __gameWindow: {}
        ,

        __sprites: [],

        __animations: [],

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

            spriteRectanglesCollide(obj1, obj2, padding)
            {
                if(!padding)
                {
                    padding = 0;
                }

               var paddingX = padding * obj1.size.x,

                   paddingY = padding * obj1.size.y, left = obj1.position.x + paddingX, right = obj1.position.x + obj1.size.x - paddingX,

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

        select: function (constructor_name, name, type /*ignoring spaces and CAPS/CASE on type match*/) {

            var objects_out = [];

            var normalizedType

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

//GameStack: a main / game lib object::
//TODO: fix the following set of mixed references:: only need to refer to (1) lib instance

let GameStack = new GameStackLibrary();
let __gameStack = GameStack;

let Quick2d = GameStack; //Exposing 'Quick2d' as synonymous reference to GameStack

let Quazar = GameStack; //Exposing 'Quazar' as synonymous reference to GameStack

let QUAZAR = GameStack; //Exposing 'QUAZAR' as synonymous reference to GameStack

let __gameInstance = GameStack;

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

            Quazar.GamepadAdapter.on(evt_profile.evt_key, 0, function (x, y) {

                if(!button_mode){callback(x, y);}
                else if(x){callback(x);};

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


__gameStack = QUAZAR;

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


var Canvas = {

    __levelMaker:false,

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

            var camera = __gameStack.__gameWindow.camera || {pos: {x: 0, y: 0, z: 0}};

            var x = p.x, y = p.y;


            x -= camera.position.x || 0;
            y -= camera.position.y  || 0;
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

            if (typeof(sprite.rotation) == 'object') {

                rotation = sprite.rotation.x;


            }
            else {
                rotation = sprite.rotation;

            }


            this.drawFrameWithRotation(sprite.selected_animation.image.domElement, frame.framePos.x, frame.framePos.y, frame.frameSize.x, frame.frameSize.y, Math.round(x + (realWidth / 2)), Math.round(y + (realHeight / 2)), realWidth, realHeight, rotation % 360, ctx, sprite.flipX);
        }

    }

}


GameStack.ready(function (lib) {

    GameStack.log('GameStack:lib :: ready');


});


/**
 *
 *  class: GameWindow:
 *  args{canvas, ctx, sprites, backgrounds, interactives, forces, update}
 */


class GameWindow {

    constructor({canvas, ctx, sprites, backgrounds, interactives, forces, update, camera}={}) {

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

            if (typeof(item.update) == 'function') {
                item.update(item);

            }

            if (typeof(item.def_update) == 'function') {
                //  console.log('def_update');

                item.def_update(item);

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

        this.targetTop = this.get_target(this.topFloat, document.body.clientHeight);

        this.leftFloat = args.left || 0.25;

        this.targetLeft = this.get_target(this.leftFloat,document.body.clientWidth);

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

    get_target(float, dimen)
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


/**TODO:complete the following
 *  class: StatDisplay:
 *  class: BarDisplay
 *  class: VideoDisplay
 */


class ItemDisplay //show an item display (image with text/number to the right
{
    constructor({font, fontSize}) {

    }

    set(text, image, color, font) {


    }

    size() {


    }

    render() {

    }

}


class BarDisplay //show a display bar such as health bar
{
    constructor({font, fontSize}) {

    }

    set(text, image, color, font) {


    }

    size() {


    }

    render() {

    }

}

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

