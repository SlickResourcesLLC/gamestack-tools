/**
 * Created by The Blakes on 3/16/2017.
 */



/*
 * #Section Media
 *
 * */


/*
 * Sound
 *
 * Simple Sound object:: uses Jquery: audio
 *
 * TODO : test Sound() for multiple simultaneous sounds, modify as needed
 *
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


/*
 * GameImage
 *
 * Simple GameImage
 *
 * */

class GameImage {

    constructor(src, onCreate) {

        // Quazar.log('initializing image');

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



    let QuazarLibrary = function () {


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


        createid: function () {
            new Date().getUTCMilliseconds() + "";
        }

        ,

        getActionablesCheckList: function () {
            //every unique sound, animation, tweenmotion in the game

            let __inst = {};

            let actionables = [];

            $.each(this.sprites, function (ix, item) {

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

            if (Quazar.DEBUG) {

                console.info('Info:' + m);

            }
        }
        ,


        log: function (m) {

            if (Quazar.DEBUG) {

                console.log('Quazar:' + m);

            }
        }
        ,

        //animate() : main animation call, run the once and it will recurse with requestAnimationFrame(this.animate);

        animate: function () {
            TWEEN.update(time);

            requestAnimationFrame(this.animate);

            this.__gameWindow.update();

            this.__gameWindow.ctx.clearRect(0, 0, this.__gameWindow.canvas.width, this.__gameWindow.canvas.height);

            this.__gameWindow.draw();

        }
        ,

        start: function () {

            this.animate();

        }
        ,


        Collision: {

            spriteRectanglesCollide(obj1, obj2)
            {
                if (obj1.position.x + obj1.size.x > obj2.size.x && obj1.position.x < obj2.size.x + obj2.size.x &&
                    obj1.position.y + obj1.size.y > obj2.size.y && obj1.position.y < obj2.size.y + obj2.size.y) {

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

            $Q.each(keys, function (ix, item) {

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


            __gameInstance.isAtPlay = true;


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

    }


    return lib;

};


//Quazar: a main / game lib object::
//TODO: fix the following set of mixed references:: only need to refer to (1) lib instance

let Quazar = new QuazarLibrary();
let QUAZAR = Quazar;


let __gameInstance = Quazar;


let $q = Quazar;
let $Q = Quazar;

/********************
 * Quazar.InputEvents
 * -Various PC Input Events
 ********************/

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
            y -= Quazar.canvas.style.top;
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

//Override the existing window.onload function

window._preQuazar_windowLoad = window.onload;

window.onload = function () {

    if (typeof(window._preQuazar_windowLoad) == 'function') {
        window._preQuazar_windowLoad();
    }

    $Q.callReady();

}


/*
 * Canvas
 *    draw animations, textures to the screen
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


Quazar.ready(function (lib) {

    Quazar.log('Quazar:lib :: ready');


});


/**
 *
 *  class: GameWindow:
 *  args{canvas, ctx, sprites, backgrounds, interactives, forces, update}
 */


class GameWindow {

    constructor({canvas, ctx, sprites, backgrounds, interactives, forces, update}) {

        this.sprites = sprites instanceof Array ? sprites : [];

        this.backgrounds = backgrounds instanceof Array ? backgrounds : [];

        this.interactives = interactives instanceof Array ? interactives : [];

        this.forces = forces instanceof Array ? forces : [];

        this.canvas = canvas;

        if (!this.canvas) {
            this.canvas = document.createElement('CANVAS');
            console.info('GameWindow(): Created New Canvas');
        }

        this.ctx = ctx || canvas.getContext('2d');

        this.__camera = new Vector3(0, 0, 0);

        if (typeof update == 'function') {
            this.onUpdate(update);

        }

        Quazar.__gameWindow = this;

        Quazar.canvas = this.canvas;

        Quazar.ctx = this.ctx;

    }

    uniques(list) {

        var listout = [];

        $.each(list, function (ix, item) {

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

        Quazar.each(this.sprites, function (ix, item) {

            if (typeof(item.update) == 'function') {
                item.update(item);

            }

            if (typeof(item.def_update) == 'function') {
                //  console.log('def_update');

                item.def_update(item);

            }

        });


    }

    onUpdate(arg) {
        if (typeof(arg) == 'function') {
            let up = this.update;

            this.update = function (sprites) {
                up(sprites);
                arg(sprites);
            }

        }

    }

    draw() {

        var _gw = this;

        Quazar.each(this.sprites, function (ix, item) {

            Canvas.draw(item, _gw.ctx);

        });

    }

}
;


class TextDisplay {


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

        Quazar.log('VideoDisplay():: TODO: create dom element');

    }

    play() {

    }
}

