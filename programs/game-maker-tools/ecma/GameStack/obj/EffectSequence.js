/*
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



            DatGui.addCurveSelect(__inst, __inst.gui);


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







