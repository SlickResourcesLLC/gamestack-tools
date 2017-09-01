
/*
 * Canvas
 *    draw animations, textures to the screen
 * */


class EffectSequence
{
    constructor(args)
    {

        this.animation = args.animation || false;

        if(!this.animation)
        {

         return console.error('EffectSequence requires an Animation');

        }

        this.effects = Gamestack.JSManipulate;

        this.selected_effect = this.effects.blur;

        this.numberSteps = 10;

        this.curve = args.curve || TWEEN.Easing.Linear.None;

        this.counter = 0;

         this.duration = 3000;

        this.andBack = false; //Use this to loop effects back to original state

        this.canvas = document.createElement('canvas');

        this.testCtx = this.canvas.getContext('2d');

        this.values = {};


    }



    guiCallback(effect, callback)
    {

        this.selected_effect = effect || this.effects.blur;

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


            __inst.startValues = JSON.parse(jstr(__inst.selected_effect.defaultValues));

            __inst.endValues = JSON.parse(jstr(__inst.selected_effect.defaultValues));

            __inst.values =  JSON.parse(jstr(__inst.startValues));

            __inst.ranges = __inst.selected_effect.valueRanges;

            for(var x in __inst.startValues)
            {
                if(__inst.ranges.hasOwnProperty(x))
                {
                    startValuesGUI.add(__inst.startValues, x).min(__inst.ranges[x].min).max(__inst.ranges[x].max);

                    endValuesGUI.add(__inst.endValues, x).min(__inst.ranges[x].min).max(__inst.ranges[x].max);

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

            if(!effect)
            {
                effect_select.setValue('blur');

                __inst.selected_effect = __inst.effects.blur;

            }

            effect_select.onFinishChange(function(value){

                __inst.selected_effect = __inst.effects[value];

                __inst.guiCallback(__inst.selected_effect, callback);


            });

            __inst.gui.add(__inst, 'numberSteps').min(1).max(20);



            DatGui.addCurveSelect(__inst, __inst.gui);


        }

        setValues(this.gui);

       callback(this.gui);


        DatGui.updateableAnimationObjectToGui(__inst.animation, __inst.gui, __inst);


        return this.gui;

    }

    apply(sprite, canvas)
    {
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


              var tween =  new TWEEN.Tween(this.values).to(this.endValues, this.duration).easing(this.curve).onUpdate(function () {

                  __inst.counter += 1;

                    if (!__inst.source_image) {

                        __inst.source_image = ctx.getImageData(sprite.position.x, sprite.position.y, sprite.size.x, sprite.size.y);

                        console.log('image is set');

                    }

                    sprite.selected_animation.selected_frame.image.data = false;

                    var img = copyImageData(ctx, __inst.source_image);

                  //  console.log(jstr(__inst.values));

                    __inst.selected_effect.filter(img, __inst.values);

                    sprite.selected_animation.selected_frame.image.data = img;


                }).onComplete(function(){  __inst.counter = 0; }).start();

            }

        }

    }


}







