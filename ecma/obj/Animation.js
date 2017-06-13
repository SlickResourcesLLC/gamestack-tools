/**
 * Created by The Blakes on 04-13-2017
 *
 */






/**
 * Animation
 */


class Animation {
    constructor(args) {

        args = args || {};

        this.frames = $Q.getArg(args, 'frames', []);

        this.src = $Q.getArg(args, 'src', '!MISSING_ARG');

        this.image = $Q.getArg(args, 'image', new GameImage(this.src));

        this.attack_level = $Q.getArg(args, 'attack_level', 0);

        this.heal_level = $Q.getArg(args, 'heal_level', 0);



        this.delay = $Q.getArg(args, 'delay', 0);


        this.cix = 0;

        var _anime = this;


        Quazar.each(args, function (ix, item) {

            if (ix !== 'parent') {
                _anime[ix] = item;
            }


        });

        this.frameSize = this.getArg(args, 'frameSize', new Vector3(0, 0, 0));

        this.frameBounds = this.getArg(args, 'frameBounds', new VectorBounds(new Vector3(0, 0, 0), new Vector3(0, 0, 0)));


        this.frameOffset = this.getArg(args, 'frameOffset', new Vector3(0, 0, 0));


        this.apply2DFrames(args.parent || {});


        this.flipX = this.getArg(args, 'flipX', false);


        this.priority = this.getArg(args, 'priority', 0);


        this.cix = 0;


        this.selected_frame = this.frames[0];


        this.earlyTerm = this.getArg(args, 'earlyTerm', false);

        this.hang =this.getArg(args, 'hang', false);


        this.timer = 0;


    }


    getArg(args, key, fallback) {

        if (args.hasOwnProperty(key)) {

            return args[key];

        }
        else {
            return fallback;

        }


    }

    apply3DFrames(frames) {

        this.three_dimen = false;

        let _a = this;


        $Q.each(frames, function (ix, frame) {


            if (typeof(frame) == 'Frame3D') {

                _a.three_dimen = true;


                //Assemble a web-gl texture 3D from

                Quazar.log('TODO: apply webgl / threejs Texture3D set');


            }

        });

    }

    apply2DFrames(parent) {

        //this.parent = parent;


        this.frames = [];


        var fcount = 0;


        for (let y = this.frameBounds.min.y; y <= this.frameBounds.max.y; y++) {

            for (let x = this.frameBounds.min.x; x <= this.frameBounds.max.x; x++) {

                //Quazar.log('assembling animation with:' + jstr(this.frameBounds) + ':frames len:' + this.frames.length);



                let framePos = {x: x * this.frameSize.x + this.frameOffset.x, y: y * this.frameSize.y + this.frameOffset.y};

                this.frames.push({image: this.image, frameSize: this.frameSize, framePos: framePos});


                fcount += 1;

                if(!isNaN(this.earlyTerm))
                {

                    if(fcount >= this.earlyTerm) {
                        return 0;
                    }
                }

            }

        }

        this.frames[0] = !this.frames[0] ? {
                image: this.image,
                frameSize: this.frameSize,
                framePos: {x: this.frameBounds.min.x, y: this.frameBounds.min.y}
            } : this.frames[0];

        this.selected_frame = this.frames[0];


    }

    reset() //special reset function:: frames are re-rendered each reset()
    {

        //1. reset the GameImage


        //2. apply the frames

        this.apply2DFrames(this.parent);

    }

    update() {

        this.selected_frame = this.frames[this.cix % this.frames.length];


    }

    reset()
{

    this.cix = 0;

}


    animate() {

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
