/**
 * Created by The Blakes on 04-13-2017
 *
 */



class Motionstack {
    constructor(args) {



        this.object_id =  this.getArg(args, 'object_id', this.getArg(args, 'object_ids', false));

        if(this.object_id instanceof Array)
        {


        }
        else
        {
            this.object_id = [this.object_id];

        }





        this.distance =  this.getArg(args, 'distance', this.getArg(args, 'distances', false));



        this.curve =  this.getArg(args, 'curve', TWEEN.Easing.Quadratic.InOut);

        this.curvesList =  this.curvesObject();

        this.name =  this.getArg(args, 'name', false);


        this.curveString = this.getArg(args, 'curveString', false);

        this.line =  this.getArg(args, 'line', false);

        this.dispersionAngle =  this.getArg(args, 'dispersionAngle', false);

        this.duration =  this.getArg(args, 'duration', false);

        this.delay =  this.getArg(args, 'delay',false);

        this.delayPerMember =  this.getArg(args, 'delayPerMember', false);


    }


    getArg(args, key, fallback) {

        if (args.hasOwnProperty(key)) {

            return args[key];

        }
        else {
            return fallback;

        }


    }


    curvesObject()
{

    var c =[];

  Quazar.each(TWEEN.Easing, function(ix, easing){

      Quazar.each(easing, function(iy, easeType){

          if(['in', 'out', 'inout'].indexOf(iy.toLowerCase()) >= 0)
          {

              c.push(ix + "_" + iy);

          }

      });

  });

    return c;

}


setCurve(c)
{


    var cps = c.split('_');

    var s1 = cps[0], s2 = cps[1];


    var curve = TWEEN.Easing.Quadratic.InOut;

    $.each(TWEEN.Easing, function(ix, easing){

        $.each(TWEEN.Easing[ix], function(iy, easeType){

            if(ix == s1 && iy == s2)
            {


                curve = TWEEN.Easing[ix][iy];

            }

        });

    });

    this.curve = curve;


    return curve;



}

    engageTween()
    {

        var tweens = [];

        //construct a tween::

        var __inst = this;


        var objects = {};




       $.each(Game.sprites, function(ix, item){

           $.each(__inst.object_id, function(iy, id_item) {

               if(item.id == id_item)
               {

                alert('mathc');

                objects[ix] = item;

               }

           });



       });


        var target = {

            x:__inst.distance.x + objects[0].position.x,
            y:__inst.distance.y + objects[0].position.y,
            z:__inst.distance.z + objects[0].position.z

        };



        //we have a target
        tweens[0] = new TWEEN.Tween(objects[0].position)
            .easing(__inst.curve || TWEEN.Easing.Elastic.InOut)

            .to(target, 500)
            .onUpdate(function() {
                console.log(objects[0].position.x,objects[0].position.y);
            })
            .onComplete(function() {
                console.log(objects[0].position.x, objects[0].position.y);
            });


        return{

               tweens:tweens,

                fire:function() {


                   this.tweens[0].start();

                }


        }


    }

    start()
    {
        this.engageTween().fire();

    }

    simultan()
    {
        Quazar.each(this.tweens, function (ix, item) {

            console('');

            item.start();

        });

    }
    synchro()
    {


    }



    onUpdate(callback) {


    }

    onComplete(callback) {

    }


}



var Motion = function(key_members, value)
{

    return {

        add:function(){  this.update = function(obj){ Quazar.each(key_members, function(ix, item){ obj[item] += value; }); }; },

        update:function(){ console.error('unset update'); },

        to:function(obj){ this.update(); },

        object:object,

        value:value,

        id: id

    }


};





