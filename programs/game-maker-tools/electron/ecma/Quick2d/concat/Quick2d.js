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

;/**
 * Created by The Blakes on 04-13-2017
 *
 */



class Animation {
    constructor(args) {

        args = args || {};

        var _anime = this;

        this.name = $Q.getArg(args, 'name', '_blank'),

        this.description =  $Q.getArg(args, 'description', '_blank')

        this.frames = $Q.getArg(args, 'frames', []);

        this.image = new GameImage( $Q.getArg(args, 'src',  $Q.getArg(args, 'image', false)));


        this.src = this.image.domElement.src;

        this.domElement = this.image.domElement;

        this.type = $Q.getArg(args, 'type', 'basic');

        this.delay = $Q.getArg(args, 'delay', 0);

        this.cix = 0;

        this.frameSize = this.getArg(args, 'frameSize', new Vector3(0, 0, 0));

        this.frameBounds = this.getArg(args, 'frameBounds', new VectorFrameBounds(new Vector3(0, 0, 0), new Vector3(0, 0, 0), new Vector3(0, 0, 0)));

        this.frameOffset = this.getArg(args, 'frameOffset', new Vector3(0, 0, 0));


      if(typeof(args) == 'object' && args.frameBounds && args.frameSize){  this.apply2DFrames(args.parent || {}) };

        this.flipX = $Q.getArg(args, 'flipX', false);

        this.priority = $Q.getArg(args, 'priority', 0);

        this.cix = 0;

        this.selected_frame = this.frames[0];

        this.earlyTerm = this.getArg(args, 'earlyTerm', false);

        this.hang =this.getArg(args, 'hang', false);

        this.duration = this.getArg(args, 'duration', 1000);

        this.size =  this.getArg(args, 'size', new Vector3(20, 20, 20));

        this.effects = [];

        this.timer = 0;

        this.__gameLogic = false;

        this.setType = function(){  };

    }

    singleFrame(frameSize, size)
    {

        this.__frametype = 'single';

        this.frameSize = frameSize;

        this.size = size;

        this.selected_frame = {
            image: this.image,
            frameSize: this.frameSize,
            framePos: {x: 0, y: 0}
        };

        this.frames[0] = this.selected_frame;


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

        Quazar.log('ANIMATING with frame count:' + this.frames.length);

        if(this.timer % this.delay == 0) {

            if(this.hang)
            {
                this.cix = this.cix + 1;

                if(this.cix > this.frames.length - 1)
                {
                    this.cix =  this.frames.length - 1;

                }

            }
            else
            {

                this.cix = this.cix >= this.frames.length - 1 ? this.frameBounds.min.x : this.cix + 1;
            }

            this.update();

        }

    }

};
;/**
 * Created by The Blakes on 04-13-2017
 *
 */


class Callables {
    constructor(args) {

        this.list = [];

        if(args instanceof Array)
        {
            this.list = args;

        }
        else
        {
            this.list = this.getArg(args, 'list', []);

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

    add(item)
    {

        if(typeof(item.engage) == 'function')
        {
           this.list.push(item);

        }

       else if(typeof(item.fire) == 'function')
        {
            this.list.push(item);

        }

       else if(typeof(item.start) == 'function')
        {
            this.list.push(item);

        }

       else if(typeof(item.run) == 'function')
        {
            this.list.push(item);

        }

       else if(typeof(item.process) == 'function')
        {
            this.list.push(item);

        }


    }

    call()
    {
        $.each(this.list, function (ix, item) {


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

        });

    }

}










;/**
 * Created by The Blakes on 04-13-2017
 *
 * Camera : has simple x, y, z, position / Vector, follows a specific sprite
 *
 * *incomplete as of 07-20-2017
 */


class Camera
{

    constructor(position)
    {

      this.position = Quazar.getArg(args, 'position', Quazar.getArg(args, 'pos', new Vector3(0, 0, 0) ) );

    }

    follow(object, accel, max, distSize)
    {


    }

}



;
/*****************
 *  Controls():
 *
 *  Dependencies: (1) :
 *      -Quick2d.GamepadAdapter, HTML5 Gamepad Api
 ******************/

class Controls {

    constructor(args) {


        this.__controller = args.controller;

    }

    extendedCall(call, extension)
    {

        var formerCall = call;

        call = function(){ call(); extension(); };

        return call;

    }

    on(key, callback)
    {

        if(typeof(this.__controller) == 'object' && typeof(this.__controller[key]) == 'function')
        {

            console.info('applying controller function:' + key);

            this.__controller[key] = this.extendedCall(this.__controller[key], callback);

        }
        else
        {
            console.error('could not apply controller function');

        }

    }


};




;/**
 * Created by The Blakes on 04-13-2017
 *
 */

class Force
{
    constructor(args)
    {

        this.name = args.name || "";

        this.description = args.description || "";

        this.subjects = args.subjects || [];
        this.origin =  args.origin || {};
        this.massObjects = args.massObjects || [];

        this.minSpeed = args.minSpeed || new Vector3(1, 1, 1);

        this.max = args.max || new Vector3(3, 3, 3);
         this.accel = args.accel || new Vector3(1.3, 1.3, 1.3);

        for(var x in args)
        {
            this[x] = args[x];

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


    gravitateY()
    {

      var  subjects = this.subjects;

       var origin =  this.origin || {};

       var massObjects =  this.massObjects;

      var  accel =  this.accel || {};

        var max =  this.max || {};

        $.each(subjects, function(ix, itemx){

           itemx.accelY(accel, max);

           itemx.__falling = true;

            $.each(massObjects, function(iy, itemy){

                itemx.collide_stop(itemy);


            });
        });
    }
};






;

class FrameEffectsApi{

    constructor()
    {
        this.__effects = [];

    }

    add(effect)
    {
        this.__effects.push(effect);

    }

};

;/**
 * Created by The Blakes on 7/27/2017.
 */

class StatEffect{

    constructor(name, value) {

        this.__is = "a game logic effect";

        this.name =name;

        this.value = value;

    }

    process(object)
    {
        //if the object has any property by effect.name, the property is incremenented by effect value
        //a health decrease is triggered by Effect('health', -10);


        for(var x in object)
        {
            if(x.toLowerCase() == this.name.toLowerCase() && typeof(value) == typeof(object[x]))
            {

                object[x] += this.value;

            }

        }

    }

}

class Collision
{
    constructor({object, collideables, extras})
    {
        this.object = object || [];

        this.collideables = collideables instanceof Array ? collideables : [];

        this.extras = extras instanceof Array ? extras : []; //anything extra to execute onCollision
        //note: extras are any StatEffect, Animation, Movement to be simultaneously executed with this Collision

    }

    Object(object)
    {
        this.object = object;

    }

    Extras(extras)
    {
        this.extras = extras;

    }

    Collideables(collideables)
    {
        this.collideables = collideables;

    }

    onCollide(fun)
    {
        this.callback = fun;

    }

    collide()
    {
        this.callback();
    }

    process()
    {
        //if collision, call collide()

    }


};



class GameLogic {

    constructor(gameEffectList)
    {
        if(!gameEffectList instanceof Array)
        {

            console.info('GameLogic: gameEffectList was not an array');

            gameEffectList = [];

        }

       this.gameEffects = gameEffectList;

    }
    process_all()
    {
        //process all game logic objects::

            for(var x = 0; x < this.gameEffects.length; x++)
            {

                this.gameEffects[x].process();

            }

    }
    add(gameeffect)
    {

        this.gameEffects.push(gameeffect);

    }

}
;

/*****************
 *  GamepadAdapter:
 *
 *  Dependencies: (1) :
 *      -HTML5 Gamepad Api
 ******************/

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

        gp.on = function(key, callback)
        {

            if(this[key] && key !== "on")
            {

                this[key] = callback;


            }

            else if(key.indexOf('button') >= 0 && key.indexOf('_') >= 0 )
            {
                var parts = key.split('_');

                var number;

                try
                {

                    number = parseInt(parts[1]);

                    this['buttons'][number] = callback;

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

            if (gp.buttons[i].pressed) {

               // console.log('button:' + i);

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



    }


    on(key, gpix, callback) {

        if(gpix >= this.__gamepads.length)
        {

            this.__gamepads.push(this.GamepadEvents({}));

        }

        this.__gamepads[gpix].on(key, callback);

    }


};




if(!__gameInstance.GamepadAdapter)
{
    __gameInstance.GamepadAdapter = new GamepadAdapter();

    __gameInstance.gamepads = [];

    Quazar.GamepadAdapter = __gameInstance.GamepadAdapter;

    Quazar.gamepads = __gameInstance.gamepads;

    Quazar.GamepadAdapter.on('stick_left', 0, function(x, y){

        console.log('Gamepad stick left');

    });

    Quazar.GamepadAdapter.on('button_0', 0, function(x, y){

        console.log('Gamepad button 0');

    });


    Quazar.GamepadAdapter.on('button_1', 0, function(x, y){

        console.log('Gamepad button 1');

    });

    Quazar.GamepadAdapter.on('button_2', 0, function(x, y){

        console.log('Gamepad button 2');

    });

    Quazar.GamepadAdapter.on('button_3', 0, function(x, y){

        console.log('Gamepad button 3');

    });

   // __gameInstance.gamepads.push(gamepad);

};



;/**
 * Created by Jordan Blake on 04-13-2017
 *
 */
class GravityAction
{
    constructor()
    {

    }

}

class Graviton {
    constructor(args) {

    }
}

class GravitationalRay {
    constructor(args) {

    }
}










;/**
 * Created by The Blakes on 04-13-2017
 *
 */

class Motion {
    constructor(args) {

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


    curvesObject() {

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


    getCurveString() {

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


    setCurve(c) {

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

        this.curve = curve;


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
                .easing(__inst.curve || TWEEN.Easing.Elastic.InOut)

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
            .easing(__inst.curve || TWEEN.Easing.Elastic.InOut)

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

    start() {
        this.engage().fire();

    }


    onComplete(fun) {
        this.complete = fun;

    }

    // obj.getGraphCanvas( $(c.domElement), value.replace('_', '.'), TWEEN.Easing[parts[0]][parts[1]] );

    getGraphCanvas( t, f, c) {

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
}









;/**
 * Created by Administrator on 7/15/2017.
 */


class Rectangle {

    constructor(min, max) {

        this.min = min;
        this.max = max;

    }


}
;

let VectorBounds = Rectangle;

class VectorFrameBounds extends Rectangle {

    constructor(min, max, termPoint) {

        super(min, max);

        this.termPoint = termPoint || new Vector3(this.max.x, this.max.y, this.max.z);

    }


}
;

class Circle
{
    constructor(args) {

        this.position = this.getArg(args, 'position', new Vector3(0, 0, 0));

        this.radius = this.getArgs(args, 'radius', 100);

    }


}

;
class Sprite {
    constructor(name, description, args) {

        this.active = true; //active sprites are visible

        this.__initializers = []; //apply options to this variable
        
        if(typeof name == 'object') //accept first argument as full args object
        {

            args = name;

            this.name = args.name || "__";

            this.description = args.description || "__";

        }
        else
        {

            this.name = name || "__";

            this.description = description || "__";

        }

        var _spr = this;

        Quazar.each(args, function (ix, item) { //apply all args

            if (ix !== 'parent') {
                _spr[ix] = item;
            }

        });

        this.type = $Q.getArg(args, 'type', 'basic');

        this.animations = $Q.getArg(args, 'animations', []);

        this.motions = $Q.getArg(args, 'motions', []);

        let __inst = this;

        this.id = $Q.getArg(args, 'id',  this.create_id());

        this.sounds = $Q.getArg(args, 'sounds', []);

        this.image = $Q.getArg(args, 'image', new GameImage($Q.getArg(args, 'src', false)));

        this.size = $Q.getArg(args, 'size', new Vector3(100, 100));

        this.position = $Q.getArg(args, 'position', new Vector3(0, 0, 0));

        this.collision_bounds = $Q.getArg(args, 'collision_bounds', new VectorBounds(new Vector3(0, 0, 0), new Vector3(0, 0, 0)));

        this.rotation = $Q.getArg(args, 'rotation', new Vector3(0, 0, 0));

        this.selected_animation = {};

        this.speed =  $Q.getArg(args, 'speed', new Vector3(0, 0, 0));

        this.accel =  $Q.getArg(args, 'accel', new Vector3(0, 0, 0));

        this.rot_speed =  $Q.getArg(args, 'rot_speed', new Vector3(0, 0, 0));

        this.rot_accel =  $Q.getArg(args, 'rot_accel', new Vector3(0, 0, 0));

        //Apply / instantiate Sound(), Motion(), and Animation() args...

        $.each(this.sounds , function(ix, item){

            __inst.sounds[ix] = new Sound(item);

        });

        $.each(this.motions, function(ix, item){

            __inst.motions[ix] = new Motion(item);

        });


        $.each(this.animations, function(ix, item){

            __inst.animations[ix] = new Animation(item);

        });

    }

    /*****************************
     * Getters
     ***************************/


    get_id()
    {
        return this.id;
    }


    /*****************************
     * Setters and Creators
     ***************************/

    create_id()
    {
        return new Date().getUTCMilliseconds();

    }

    setSize(size)
    {
        this.size = new Vector3(size.x, size.y, size.z);

        this.selected_animation.size = new Vector3(size.x, size.y, size.z);

    }

    setPos(pos)
    {
        this.position = new Vector3(pos.x, pos.y, pos.z || 0);

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

    setAnimation(anime) {

        this.animations['default'] = anime;

        this.selected_animation = anime;

        Quazar.log('declared default animation');

        return this;

    }

    /*****************************
     *  defaultAnimation(anime)
     *  -set the default_animation of this sprite
     *  -TODO : determine whether to implement a default animatio OR simply use setAnimation() plus selected_animation
     ***************************/

    defaultAnimation(anime) {

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

    onScreen(w, h) {
        return this.position.x + this.size.x >= 0 && this.position.x < w
            && this.position.y + this.size.y >= 0 && this.position.y < h;

    }

    /*****************************
     * Updates
     ***************************/

    /*****************************
     * update()
     * -starts empty:: is used by Quick2d.js as the main sprite update
     ***************************/

    update(sprite) {}

    /*****************************
     * def_update()
     * -applies speed and other default factors of movement::
     * -is used by Quick2d.js as the system def_update (default update)
     ***************************/

    def_update(sprite) {

        for(var x in this.speed)
        {

            if(this.speed[x] > 0 || this.speed[x] < 0)
            {

                this.position[x] += this.speed[x];

            }

        }

        for(var x in this.accel)
        {

            if(this.accel[x] > 0 || this.accel[x] < 0)
            {

                this.speed[x] += this.accel[x];

            }

        }

        for(var x in this.rot_speed)
        {

            if(this.rot_speed[x] > 0 || this.rot_speed[x] < 0)
            {

                this.rotation[x] += this.rot_speed[x];

            }


        }

        for(var x in this.rot_accel)
        {


            if(this.rot_accel[x] > 0 || this.rot_accel[x] < 0)
            {

                this.rot_speed[x] += this.rot_accel[x];

            }
        }
    }

    /*****************************
     *  onUpdate(fun)
     * -args: 1 function(sprite){ } //the self-instance/sprite is passed into the function()
     * -overrides and maintains existing code for update(){} function
     ***************************/

    onUpdate(fun)
    {
        fun = fun || function(){};

        let update = this.update;

        let __inst = this;

        this.update = function(__inst){ update(__inst); fun(__inst); };

    }

    /*****************************
     *  collidesRectangular(sprite)
     * -args: 1 sprite object
     * -returns boolean of true on collision or false on no-collision
     * -TODO : add options object with highlight=true||false,
     * -TODO:allow stateffects, graphiceffects into the collision function
     ***************************/

    collidesRectangular(sprite)
    {

        return Quazar.Collision.spriteRectanglesCollide(sprite);

    }

    /*****************************
     *  collidesByPixels(sprite)
     *  -TODO : this function is incomplete
     *  -process collision according to the non-transparent pixels of the sprite::
     *  -provides a more realistic collision than basic rectangular
     ***************************/

    collidesByPixels(sprite)
    {

        return console.info("TODO: Sprite().collidesByPixels(sprite): finish this function");

    }

    /*****************************
     *  shoot(sprite)
     *  -fire a shot from the sprite:: as in a firing gun or spaceship
     *  -takes options{} for number of shots, anglePerShot, etc...
     *  -TODO: complete and test this code
     ***************************/

    shoot(options) {
        //character shoots an animation

        this.prep_key = 'shoot';

        let spread = options.spread || options.angleSpread || false;

        let total = options.total || options.totalBullets || options.numberBullets || false;

        let animation = options.bullet || options.animation || false;

        let duration = options.duration || options.screenDuration || false;

        let speed = options.speed || false;

        if (__gameInstance.isAtPlay) {


        }
        else {

            this.event_arg(this.prep_key, '_', options);

        }

        return this;

    }

    /*****************************
     *  animate(animation)
     *  -simply animate, set the animation to the arg 'animation'
     ***************************/

    animate(animation) {

        alert('calling animation');

        if (__gameInstance.isAtPlay) {

          if(animation){ this.setAnimation(animation) };

            this.selected_animation.animate();

            return this;

        }

    }

    /*****************************
     *  accelY
     *  -accelerate on Y-Axis with 'accel' and 'max' (speed) arguments
     *  -example-use: gravitation of sprite || up / down movement
     ***************************/

    accelY(accel, max) {

        accel = Math.abs(accel);

        if(typeof(max) == 'number')
        {
            max = {y:max};

        }

        this.assertSpeed();

        let diff =  max.y - this.speed.y;

        if(diff > 0)
        {
            this.speed.y += Math.abs(diff) >= accel ? accel : diff;

        };

        if(diff < 0)
        {
            this.speed.y -= Math.abs(diff) >= accel ? accel : diff;

        };

    }


    /*****************************
     *  accelX
     *  -accelerate on X-Axis with 'accel' and 'max' (speed) arguments
     *  -example-use: running of sprite || left / right movement
     ***************************/

    accelX(accel, max) {

        accel = Math.abs(accel);

        if(typeof(max) == 'number')
        {
            max = {x:max};

        }

        this.assertSpeed();

        let diff =  max.x - this.speed.x;

        if(diff > 0)
        {
            this.speed.x += Math.abs(diff) >= accel ? accel : diff;

        };

        if(diff < 0)
        {
            this.speed.x -= Math.abs(diff) >= accel ? accel : diff;

        };

    }

    /*****************************
     *  decelX
     *  -decelerate on the X axis
     *  -args: 1 float:amt
     ***************************/

    deccelX(rate) {
        if (typeof(rate) == 'object') {

            rate = rate.rate;

        }

        if (this.speed['x'] > rate) {
            this.speed['x'] -= rate;

        }
        else if (this.speed['x'] < rate) {
            this.speed['x'] += rate;

        }
        else
        {

            this.speed['x'] = 0;

        }

    }


    /*****************************
     *  decelY
     *  -decelerate on the Y axis
     *  -args: 1 float:amt
     ***************************/

    decelY(amt) {

        amt = Math.abs(amt);

        if(Math.abs(this.speed.y) <= amt)
        {
            this.speed.y = 0;

        }
        else if(this.speed.y > amt)
        {

            this.speed.y -= amt;
        }
        else if(this.speed.y < amt * -1)
        {

            this.speed.y += amt;
        }

    }

    /*****************************
     *  decelX
     *  -decelerate on the X axis
     *  -args: 1 float:amt
     ***************************/

    decelX(amt) {

        amt = Math.abs(amt);

        if(Math.abs(this.speed.x) <= amt)
        {
            this.speed.x = 0;

        }
        else if(this.speed.x > amt)
        {

            this.speed.x -= amt;
        }
        else if(this.speed.x < amt * -1)
        {

            this.speed.x += amt;
        }

    }

    /*****************************
     *  collide_stop(item)
     *  -both collide and stop on the object, when falling on Y axis::
     *  -sets the special property: __falling to false on stop :: helps to control Sprite() state
     *  -TODO : rename to fallstop || something that resembles a function strictly on Y-Axis
     ***************************/

    collide_stop(item)
    {

        var max_y = item.max ? item.max.y : item.position.y;

        if(this.position.y + this.size.y >= max_y)
        {

            this.position.y = max_y - this.size.y;

            this.__falling = false;

        }

    }

    /*****************************
     *  fromFile(file_path)
     *  -TODO : complete this function based on code to load Sprite() from file, located in the spritemaker.html file
     *  -TODO: test this function
     ***************************/

    fromFile(file_path)
    {
        var __inst = this;

        $.getJSON(file_path, function(data){

            __inst = new Sprite(data);

        });

    }

};


/****************
 * TODO : Complete SpritePresetsOptions::
 *  Use these as options for Sprite Control, etc...
 ****************/



let SpriteInitializersOptions = {
    Flight: {

        __args: {},

        top_down_flight: function (sprite) {
        },

        side_scroll_flight: function (sprite) {
        }

    },

    Running: {

        __args: {},

        side_scroll_runner: function (sprite) {

            let __lib = Quazar || Quick2d;

            Quazar.GamepadAdapter.on('stick_left', 0, function(x, y){

                accel = accel || 0.25; max = max || 7;

                sprite.accelX(accel, x * max);

                if(x < -0.2)
                {
                    sprite.flipX = true;

                }
                else if(x > 0.2)
                {
                    sprite.flipX = false;

                }

            });

            sprite.onUpdate(function(spr){

                spr.decelX(0.1);

                if(!spr.__falling){ spr.decelY(0.2) };

            });


        }

    },

    Collision: {

        __args: {},


        basic_stop_collideable: function (sprite) {
        },

        top_stop_collideable: function (sprite) {
        } //pass through bottom, but land on top, as with certain platforms


    },

    Powerups: {

        __args: {},

        grabbable_power_up: function (sprite) {
        }

    },

    ControllerStickMotion: {

        __args: {},

        stick_move_x: function (sprite) {
        },

        stick_move_y: function (sprite) {
        }

    }

    ,

    Jumping: {

        __args: {}

    },

    Shooting: {

        __args: {}

    }

};

Quazar.options = Quazar.options || {};

Quazar.options.SpriteInitializers = SpriteInitializersOptions;;
//Vector3:

class Vector3 {
    constructor(x, y, z, r) {

        if(typeof(x) == 'object' && x.x && x.y) //optionally pass vector3
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

        this.__relativeTo = false;

    }

    relativeTo(v)
    {
        this.__relativeTo = v;
    }

    sub(v)
    {
        if(typeof(v) == 'number')
        {
            v = {x:v, y:v, z:v};
        };

        return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);

    }

    add(v)
    {
        if(typeof(v) == 'number')
        {
            v = {x:v, y:v, z:v};
        };

        return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);

    }

    mult(v)
    {
        if(typeof(v) == 'number')
        {
            v = {x:v, y:v, z:v};
        };

        return new Vector3(this.x * v.x, this.y * v.y, this.z * v.z);

    }
    div(v)
    {
        if(typeof(v) == 'number')
        {
            v = {x:v, y:v, z:v};
        };

        return new Vector3(this.x / v.x, this.y / v.y, this.z / v.z);
    }

    round()
    {
        return new Vector3(Math.round(this.x), Math.round(this.y), Math.round(this.z));

    }
    floor()
    {
        return new Vector3(Math.floor(this.x), Math.floor(this.y), Math.floor(this.z));

    }
    ceil()
    {
        return new Vector3(Math.ceil(this.x), Math.ceil(this.y), Math.ceil(this.z));

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

    }

}
;

let Pos = Vector3, Size = Vector3, Position = Vector3, Vector2 = Vector3, Vector = Vector3, Rotation = Vector3;

//The above are a list of synonymous expressions for Vector3. All of these do the same thing in this library (store x,y,z values)
;/**
 * Created by The Blakes on 04-13-2017
 *
 */


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








