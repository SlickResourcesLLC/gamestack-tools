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





class Vector3 {
    constructor(x, y, z, r) {

        this.x = x;
        this.y = y;
        this.z = z;
        this.r = r;

    }


}
;

let Vector2 = Vector3, Point = Vector3, Size = Vector3, Vertex = Vector3, Rotation = Vector3, Rot = Vector3, Position = Vector3,

    Pos = Vector3;




class VectorBounds {

    constructor(min, max) {

        this.min = min;
        this.max = max;

    }


}
;





class GameSound {

    constructor(src, onCreate) {

        if (src) {

            this.src = src;

            let parts = src.split('.'), ext = parts[parts.length - 1];

            if (['mp3', 'wav', 'flac'].indexOf(ext) >= 0) {
                //treat as sound

                Quazar.log('initializing audio sound');

                this.sound = new Audio(src);

                this.onCreate = onCreate;

                if (typeof(this.onCreate) == 'function') {

                    this.onCreate(this.sound);

                }


            }

        }

    }

    play() {
        if (typeof(this.sound) == 'object' && typeof(this.sound.play) == 'function') {

            this.sound.play();

        }


    }

}


class GameImage {

    constructor(src, onCreate) {

        Quazar.log('initializing image');

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

            this.src = src;


        }




        if(!this.image)
        {
            this.image = {error:"Image not instantiated, set to object by default"};

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





//Quazar: a main / game lib object::


let __gameInstance = __gameInstance || {};



let Quazar = {

    DEBUG: false,

    __gameWindow:{},

    __sprites:[],

    __animations:[],

    samples: {},

    log_modes:['reqs', 'info', 'warning'],

    log_mode:"all",

    recursionCount:0,

    interlog:function(message, div) //recursive safe :: won't go crazy with recursive logs
    {
        this.recursionCount++;

        if(!isNaN(div) && this.recursionCount % div == 0)
        {
         //   console.log('Interval Log:'+  message);

        }

    },

    error:function(quit, message)
    {

        if(quit)
        {
            throw new Error(message);

        }
        else
        {
            console.error('E!' + message);

        }

    },

    req: function (m) {


        if (this.REQS) {

            console.info('Requirement:' + m); //info is logged like "program guide"


        }

    },

    info: function (m) {

            console.info('Info:' + m); //info is logged like "program guide"


    },


    log: function (m) {

      //  console.log('Quazar:' + m); //info is logged like "program guide"


    },

    animation_types:function()
    {
        let types = [];

      this.each(this.__animations, function(ix, item){

          if(!types.indexOf(item.type) >= 0)
          {
              types.push(item.type);

          }

      });


      return types;

    },


    sprite_types:function()
    {
        let types = [];

        this.each(this.__sprites, function(ix, item){

            if(!types.indexOf(item.type) >= 0)
            {
                types.push(item.type);

            }

        });

        return types;

    },



    mustHave: function (obj, keytypes, callback) {

        this.each(keytypes, function (ix, item) {

            callback(false);


        });


        callback(true);

    },


    TWEEN: TWEEN,

    _gameWindow: {},

    setGameWindow: function (gameWindow) {

        this._gameWindow = gameWindow;

    },

    getGameWindow: function () {


        return this._gameWindow;

    },

    assignAll: function (object, args, keys) {
        $Q.each(keys, function (ix, item) {

            object[ix] = args[ix];

        });


    },


    each: function (list, onResult, onComplete) {
        for (var i in list) {
            onResult(i, list[i]);
        }

        if (typeof(onComplete) === 'function') {
            onComplete(false, list)
        }
        ;

    },

    ready_callstack: [],

    ready: function (callback) {


        this.ready_callstack.push(callback);

    },

    onReady: function () {
        var funx = this.ready_callstack;

        var lib = this;

        this.each(funx, function (ix, call) {

            call(lib);

        });


        __gameInstance.isAtPlay = true;


    },

    getArg: function (args, key, fallback) {
        if (args && args.hasOwnProperty(key)) {
            return args[key];

        }
        else {
            return fallback;

        }

    }

};

__gameInstance = Quazar;

let QUAZAR = Quazar;

let $q = Quazar; let $Q = Quazar;


//Store events here, including callable events


Quazar.InputEvents = {
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
            Quazar.InputEvents[cleanKey] = Quazar.InputEvents[cleanKey] || [];
            return Quazar.InputEvents[cleanKey].push({down: callback, up: onFinish});
        } else {

            Quazar.InputEvents[evt_key] = Quazar.InputEvents[evt_key] || [];
            return Quazar.InputEvents[evt_key].push({down: callback, up: onFinish});
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
            x -= Quazar.canvas.offsetLeft;
            y -= Quazar.canvas.offsetTop;
            return {x: x, y: y};
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

                    if (typeof (item.down) == 'function') {

                        //   alert('RUNNING');

                        item.down();
                    }


                });
            }

        }


        document.onkeyup = function (e) {

            //    alert(JSON.stringify(Quazar.InputEvents, true, 2));

            var value = 'key_' + String.fromCharCode(e.keyCode).toLowerCase();
            if (Quazar.InputEvents[value] instanceof Array) {

                Quazar.each(Quazar.InputEvents[value], function (ix, item) {

                    if (typeof (item.up) == 'function') {

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

    if (typeof(window._preQuazar_windowLoad) == 'function') {
        window._preQuazar_windowLoad();

    }

    $Q.onReady();

}


/*
 * Canvas
 *
 *    draw animations, textures to the screen
 *
 *
 * */


var Canvas = {
    draw: function (sprite, ctx) {

        if (sprite.active && sprite.onScreen(Game.WIDTH, Game.HEIGHT)) {

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

            var x = sprite.position.x;
            var y = sprite.position.y;

            var camera = $Q.camera || {pos: {x: 0, y: 0, z: 0}};


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

            var targetSize = sprite.selected_animation.gameSize ? sprite.selected_animation.gameSize : sprite.size;


            var realWidth = targetSize.x;
            var realHeight = targetSize.y;

            //optional animation : offset

            if (sprite.selected_animation.offset) {
                x += sprite.selected_animation.offset.x;

                y += sprite.selected_animation.offset.y;

            }

            var rotation;

            if(typeof(sprite.rotation) == 'object')
            {

                rotation = sprite.rotation.x;


            }
            else
            {
                rotation = sprite.rotation;

            }



            this.drawFrameWithRotation(sprite.selected_animation.image.domElement, frame.framePos.x, frame.framePos.y, frame.frameSize.x, frame.frameSize.y, Math.round(x + (realWidth / 2)), Math.round(y + (realHeight / 2)), realWidth, realHeight, rotation % 360, ctx, sprite.flipX);
        }

    }

}


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


class Collection {

    constructor(list, type) {


        this.list = list;

        //if type is undefined, then no type profile is needed (assume basic array, object types)

        //else the type profile must exist ::


        this.type = type;



        this.__flyingIndex = 0;

    }

    add(object) {

        this.list.push(object);

    }

    remove(object) {

        var ix = this.list.indexOf(object);

        if (ix >= 0)
            this.list = this.list.splice(ix, 1);

    }

    next(callback) {
        var object = this.list(this.__flyingIndex % this.list.length);

        if (callback) {
            return callback(object);
        }//run callback with reference to the object


    }

    all(callback) {
        Quazar.each(this.list, function (ix, item) {

            callback(item); //run callback with reference to the object

        });

    }

    toCheckableGui(gui, list, key) {

        let fui = gui.addFolder(this.type);

        Quazar.each(this.list, function (ix, el) {

// store this reference somewhere reasonable or just look it up in
// __controllers or __folders like other examples show

            let testObject = {};

            testObject[key] = {};

            let o = fui.add(testObject, key).onChange(function (value) {

              //  alert('Value changed to:' + value);

                list.push(value);


            });

// some later time you manually update
            o.updateDisplay();
            o.__prev = o.__checkbox.checked;


        });


        return gui;


    }


};




/**
 *
 *  class: GameWindow:
 *
 *      Requires a canvas, all sprites on canvas, and physical collective_forces on screen
 *
 *
 */


class GameWindow {

    constructor({canvas, ctx, sprites, backgrounds, interactives, forces, update}) {

        this.sprite_set = new Collection(sprites || [], 'Sprite');


        this.background_set = new Collection(backgrounds || [], 'Sprite');

        this.interactive_set = new Collection(interactives || [], 'Sprite');

        this.force_set = new Collection(forces || [], 'Force');

        this.actionstack_set = new Collection(forces || [], 'ActionStack');

        this.canvas = canvas;

        this.ctx = ctx;


        Quazar.canvas = canvas;

        Quazar.ctx = ctx;


        this.extraUpdate = update || function () {
            };


    }

    extraUpdate()
    {

    }

    add(object)
    {

        var c = object.constructor;

        switch(c)
        {

            case Sprite:

                this.sprite_set.add(object);

                break;

            case Background:

                this.background_set.add(object);

                break;

            case Interactive:

                this.interactive_set.add(object);

                break;

            case Force:

                this.force_set.add(object);

                break;


            case ActionStack:

                this.actionstack_set.add(object);

                break;


        }

    }

    all_checkables() {
        let stackables = [

            this.sound_set.list,

            this.animation_set.list,

            this.tweenstack_set.list

        ];

        let allchecks = [];

        for (let x in stackables) {

            allchecks = allchecks.concat(stackables[x]);

        }

        return allchecks;

    }


    render() {



        Quazar.each(this.force_set.list, function (ix, item) {


            item.update();

        });

        this.update();


    }

    update()
    {

        Quazar.each(this.sprite_set.list, function (ix, item) {


            if(typeof(item.update) == 'function')
            {
                item.update();

            }

            if(typeof(item.def_update) == 'function')
            {
              //  console.log('def_update');

                item.def_update();

            }



        });


    }

    draw() {

        var _gw = this;

        Quazar.each(this.sprite_set.list, function (ix, item) {


            Canvas.draw(item, _gw.ctx);

        });

    }

}
;





class TextDisplay //show a text element
{
    constructor({font, size, text /*single text or array of text*/, color}) {


    }

    next() {

    }

    show() {

    }
}

class VideoDisplay //show a video sequence
{
    constructor({src, size}) {

        this.domElement = undefined;

        this.src = src || "__NO-SRC!";

        this.size = new Vector3(size.x, size.y, size.z || 0);


        Quazar.log('VideoDisplay():: TODO: create dom element');

    }

    play() {

    }
}


let Animation_Samples = [


    function(){return  new Animation({
        src: "../assets/texture/2d/char/frogman1.png",
        duration: 1000, repeat: true,
        parent: {},
        frameSize: new Vector2(100, 120),
        frameBounds: new VectorBounds(new Vector2(0, 0),
            new Vector2(0, 0))
    })}
,

    function(){return  new Animation({
        src: "../assets/texture/2d/char/frogman1.png",
        duration: 1000, repeat: true,
        parent: {},
        frameSize: new Vector2(100, 120),
        frameBounds: new VectorBounds(new Vector2(0, 0),
            new Vector2(0, 0))
    })}

];


var Sprite_Samples = [function() {



    let frog = new Sprite('frog', 'a frog sprite');


    frog.setAnimation(new Animation({
        src: "../assets/texture/2d/char/frogman1.png",
        duration: 1000, repeat: true,
        parent: {},
        frameSize: new Vector2(100, 120),
        frameBounds: new VectorBounds(new Vector2(0, 0),
            new Vector2(9, 0))
    }));


return frog;

},


    function(){




        let barrel = new Sprite('barrel', 'a barrel, interactive sprite');


        barrel.setAnimation(new Animation({
            src: "../assets/texture/2d/object/barrel1.png",
            duration: 1000, repeat: true,
            parent: {},
            frameSize: new Vector2(100, 100),
            frameBounds: new VectorBounds(new Vector2(0, 0),
                new Vector2(0, 0))
        }));


        return barrel;


    }

];


__gameInstance.event_args_list = [];