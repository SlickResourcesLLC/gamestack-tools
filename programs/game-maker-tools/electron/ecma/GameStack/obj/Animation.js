
/**
 * Animation({name:string,description:string,frames:[],image:GameImage(),src:string,domElement:Image(),type:string})
 * [See Live Demo with Usage-Example]{@link http://www.google.com}
 * @returns {Animation} object of Animation()
 * */

class Animation {
    constructor(args) {

        args = args || {};

        var _anime = this;

        this.name = this.getArg(args, 'name', '_blank'),

        this.description =  this.getArg(args, 'description', '_blank')

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

      if(typeof(args) == 'object' && args.frameBounds && args.frameSize){  this.apply2DFrames(args.parent || {}) };

        this.flipX = this.getArg(args, 'flipX', false);

        this.priority = this.getArg(args, 'priority', 0);

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

                if(this.cix == 0 && this.extras)
                {
                    this.extras.call(); //fire any extras attached

                }

                if(this.cix >= this.frames.length - 1 && typeof(this.complete) == 'function')
                {
                    this.complete(this);

                }

                this.cix = this.cix >= this.frames.length - 1 ? this.frameBounds.min.x : this.cix + 1;
            }

            this.update();

        }

    }

};
