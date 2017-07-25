/**
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


        this.apply2DFrames(args.parent || {});

        this.flipX = $Q.getArg(args, 'flipX', false);

        this.priority = $Q.getArg(args, 'priority', 0);

        this.cix = 0;

        this.selected_frame = this.frames[0];

        this.earlyTerm = this.getArg(args, 'earlyTerm', false);

        this.hang =this.getArg(args, 'hang', false);

        this.duration = this.getArg(args, 'duration', false);

        this.size =  this.getArg(args, 'size', new Vector3(20, 20, 20));

        this.effects = [];

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

        this.selected_frame = this.frames[this.cix % this.frames.length];


    }

    reset()
{

    this.resetFrames();

    this.cix = 0;

}

engage_once()
{

    let __inst = this;

    //we have a target
  this.tween = new TWEEN.Tween(this)
        .easing(__inst.curve || TWEEN.Easing.Linear)

        .to({cix:this.frames.length - 1}, this.duration || this.frames.length * 20)
        .onUpdate(function() {
            //console.log(objects[0].position.x,objects[0].position.y);



        })
        .onComplete(function() {
            //console.log(objects[0].position.x, objects[0].position.y);

            if(__inst.complete)
            {

                __inst.complete();

            }

        });


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
