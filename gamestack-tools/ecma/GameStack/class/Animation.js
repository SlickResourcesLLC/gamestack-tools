/**
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
                args[x] = this.defaultArgs[x]

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

        this.domElement.onload = function()
        {

        __inst.__isValid = true;

        };

        this.frameSize = new Vector(args.frameSize || new Vector3(44, 44, 0));

        if (args.frameBounds) {
            this.frameBounds = new VectorFrameBounds(args.frameBounds.min, args.frameBounds.max, args.frameBounds.termPoint);

        }
        else {
            this.frameBounds = new VectorFrameBounds(new Vector3(0, 0, 0), new Vector3(0, 0, 0), new Vector3(0, 0, 0))

        }

        this.frameOffset = this.getArg(args, 'frameOffset', new Vector3(0, 0, 0));

        if (typeof(args) == 'object' && args.frameBounds && args.frameSize) {
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

    onRun(caller, callkey) {
        this.run_ext = this.run_ext || [];

        if (this.run_ext.indexOf(caller[callkey]) == -1) {
            this.run_ext.push({caller: caller, callkey: callkey});
        }
    }

    onComplete(caller, callkey) {
        this.complete_ext = this.complete_ext || [];

        if (this.complete_ext.indexOf(caller[callkey]) == -1) {
            this.complete_ext.push({caller: caller, callkey: callkey});
        }
    }

    call_on_run() {
        //call any function extension that is present
        for (var x = 0; x < this.run_ext.length; x++) {
            this.run_ext[x].caller[this.run_ext[x].callkey]();
        }
    }

    call_on_complete() {
        //call any function extension that is present
        for (var x = 0; x < this.complete_ext.length; x++) {
            this.complete_ext[x].caller[this.complete_ext[x].callkey]();
        }
    }

    reverseFrames() {

        this.frames.reverse();

    }

    singleFrame(frameSize, size) {
        this.__frametype = 'single';

        this.frameSize = frameSize || this.frameSize;

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

                let framePos = {
                    x: x * this.frameSize.x + this.frameOffset.x,
                    y: y * this.frameSize.y + this.frameOffset.y
                };

                this.frames.push({image: this.image, frameSize: this.frameSize, framePos: framePos});

                if (x >= this.frameBounds.termPoint.x && y >= this.frameBounds.termPoint.y) {

                    quitLoop = true;

                    break;
                }

                fcount += 1;

                if (quitLoop)
                    break;

            }

        }

        this.frames[0] = !this.frames[0] ? {
            image: this.image,
            frameSize: this.frameSize,
            framePos: {x: this.frameBounds.min.x, y: this.frameBounds.min.y}
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

    update() {

        this.selected_frame = this.frames[Math.round(this.cix) % this.frames.length];

    }

    reset() {

        this.apply2DFrames();

        this.cix = 0;

    }

    continuous(duration) {

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

    engage(duration, complete) {
        this.call_on_run();
        duration = duration || 2000;

        if (this.__frametype == 'single') {
            return 0;

        }

        let __inst = this;

        this.complete = complete || this.complete || function () {
            };

        var duration = duration || typeof(this.duration) == 'number' ? this.duration : this.frames.length * 20;


        //we have a target
        this.tween = new TWEEN.Tween(this)
            .easing(__inst.curve || TWEEN.Easing.Linear.None)

            .to({cix: __inst.frames.length - 1}, duration)
            .onUpdate(function () {
                //console.log(objects[0].position.x,objects[0].position.y);

                //   __inst.cix = Math.ceil(__inst.cix);

                __inst.update();

            })
            .onComplete(function () {
                //console.log(objects[0].position.x, objects[0].position.y);

               __inst.call_on_complete();

                __inst.cix = 0;

                __inst.isComplete = true;

            });

        this.tween.start();

    }

    animate() {

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

}
;

Gamestack.Animation = Animation;