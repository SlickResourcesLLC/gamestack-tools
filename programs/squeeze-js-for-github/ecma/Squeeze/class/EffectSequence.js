/*
 * Canvas
 *    draw animations, textures to the screen
 * */

class EffectSequence
{
    constructor(args = {})
    {
        console.log('Effect Sequence');

        for(var x in args)
        {
            this[x] = args[x];

        }

        this.animation = args.animation || false;

        this.name = args.name || "__none";

        this.effects = Gamestack.JSManipulate;

        this.setEffect(args.selected_effect_key || args.selected_effect || this.effects.triangleripple);


        console.log('created effect of: ' + this.getSelectedEffectKey());

        this.effects_list = [];

        this.effects_list[0] = this.selected_effect;

        this.effect_guis = [];

        this.numberSteps = 10;

        this.curve = args.curve || TWEEN.Easing.Linear.None;

        this.counter = 0;

        this.duration = 3000;

        this.seesaw_mode = args.seesaw_mode || true; //loop effects back to original state

        this.canvas = document.createElement('canvas');

        this.testCtx = this.canvas.getContext('2d');

        this.values = {};

        this.initValues(args);

            this.minFloat = function (portion) {
                for (var x in this.startValues) {

                    this.startValues[x] = this.valueRanges[x].max * portion;

                }

            };

            this.maxFloat = function (portion) {
                for (var x in this.endValues) {

                    this.endValues[x] = this.valueRanges[x].max * portion;
                }
            };

            this.iterables = {

                __canvasList:[],

                __dataList:[]

            }

    }

    getSelectedEffectKey()
    {
       return this.selected_effect_key;
    }

    setEffect(effect)
    {

        for(var x in this.effects)
        {
            if(x==effect || effect == this.effects[x])
            {

                this.selected_effect_key = x;

                this.selected_effect = this.effects[x];

                this.effects_list = [];

                this.effects_list[0] = this.selected_effect;


            }

        }

    }

    initValues(args)
    {
        this.startValues = args.startValues || {};

        this.endValues = args.endValues || {};

            for (var x in this.selected_effect.valueRanges) {

               if(typeof(this.startValues[x]) !== 'number') {

                   this.startValues[x] = this.selected_effect.valueRanges[x].min;

                   this.endValues[x] = this.selected_effect.valueRanges[x].max;

               }

            }

            this.values = JSON.parse(jstr(this.startValues));

            this.valueRanges = this.selected_effect.valueRanges;


    }

    ondone(){}
    onerror(){}
    onchunk(){}

    apply(sprite, canvas, completeCallback)
    {
        var __inst = this;

        __inst.sprite = sprite;

        __inst.canvas = canvas;

        var frames = [];

        function copyImageData(ctx, src) {
            var dst = ctx.createImageData(src.width, src.height);
            dst.data.set(src.data);
            return dst;
        };

        function callCompletion()
        {
            if(__inst.ondone) {

            __inst.ondone(__inst.iterables);

            }

            if(completeCallback){ completeCallback(__inst.image_data_list); }

        }

        function frameToCanvas(img)
        {
            if(!__inst.iterables.__canvasList[__inst.counter]) {

                var c = document.createElement('CANVAS'), ct = c.getContext('2d');

                c.width = __inst.source_image.width;

                c.height = __inst.source_image.height;

                c.style.background = "blue";

                ct.restore();

                ct.save();

                ct.putImageData(img, 0, 0);

                __inst.iterables.__canvasList.push(c);

                __inst.iterables.__dataList.push(img);

                if (__inst.onchunk) {
                    __inst.onchunk(c, img);
                }
            }
            else
            {
                //do nothing
            }
        }

        if(this.counter == 0) {

            if (canvas && this.selected_effect && this.selected_effect.hasOwnProperty('filter')) {

                this.timer_diff = 0;

                var ctx = canvas.getContext('2d');

                __inst.values = JSON.parse(jstr(__inst.startValues));

              var tween =  new TWEEN.Tween(this.values).to(this.endValues, this.duration).easing(this.curve).onUpdate(function () {

                    if (!__inst.source_image) {

                        __inst.source_image = ctx.getImageData(sprite.position.x, sprite.position.y, sprite.size.x, sprite.size.y);

                        console.log('image is set');

                    }

                    var img = copyImageData(ctx, __inst.source_image);

                  __inst.selected_effect.filter(img, __inst.values);

                  sprite.selected_animation.selected_frame.image.data = img;

                 frameToCanvas(img);

                  __inst.counter += 1;

              }).onComplete(function(){


if(__inst.seesaw_mode)
{

    var tween2 =  new TWEEN.Tween(__inst.values).to(__inst.startValues, __inst.duration).easing(__inst.curve).onUpdate(function () {

        if (!__inst.source_image) {

            __inst.source_image = ctx.getImageData(sprite.position.x, sprite.position.y, sprite.size.x, sprite.size.y);

            console.log('image is set');

        }

        var img = copyImageData(ctx, __inst.source_image);

        __inst.selected_effect.filter(img, __inst.values);

        sprite.selected_animation.selected_frame.image.data = img;

        frameToCanvas(img);

        __inst.counter += 1;


    }).onComplete(function(){

        callCompletion(__inst.source_image);

        __inst.counter = 0;

    }).start();

}
                  else
                  {
                      callCompletion(__inst.source_image);

                      __inst.counter = 0;
                  }

              }).start();

            }

        }

    }

}







