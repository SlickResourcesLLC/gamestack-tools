/**
 * Created by The Blakes on 04-13-2017
 *
 */



class MotionStack {
    constructor() {

        this.tweens = [];

    }

    getCurveFromKey(key)
    {

        let keys = key.split('.');

        let curves = JSON.parse(JSON.stringify(this.Curves()));



        for(let x in keys)
        {

            if(curves[x])
            {
                curves = curves[x];

            }


        }

        return curves;

    }

    custom_tween(args)
    {

        return args;

    }

    add(args) {

        // create the tween


        let property = Quazar.getArg(args, 'prop', Quazar.getArg(args, 'property', false));


        let target = Quazar.getArg(args, 'target', false);
        let object = Quazar.getArg(args, 'object', false);

        let duration = Quazar.getArg(args, 'duration', false);

        let cancel = Quazar.getArg(args, 'cancel', false);

        let repeat = Quazar.getArg(args, 'repeat', false);

        let curve = Quazar.getArg(args, 'curve', 'Linear');


        let targetObject = {};

        targetObject[property] = target;

        this.tweens.push({object, targetObject, property, duration, curve});



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



    start() {

        this.tweenObject.start();


    }

    onUpdate(callback) {


    }

    onComplete(callback) {

    }

    resolveCurve(key) {

    }

    Curves() {

        return $Q.TWEEN.Easing;

    }


    curveOptionsToArray() {
        let cs = [];

        Quazar.each(TWEEN.Easing, function (ix, item) {

            if (item.hasOwnProperty('In')) {
                cs.push(ix + '.In');

            }

            if (item.hasOwnProperty('Out')) {
                cs.push(ix + '.Out');

            }
            if (item.hasOwnProperty('InOut')) {
                cs.push(ix + '.InOut');

            }


        });


        return cs;


    }


}
;



var Game = Game || {};


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



var TweenMotion = function({object, name, speed, direction, accel_curve,  dispersionAngle, duration, delay, delayPerMember})
{

    var directions_avail = ['up', 'upleft', 'left', 'downleft', 'down', 'downright', 'right', 'upright'];

    if(this.directions_avail.indexOf(direction.replace(' ', '').replace('-', '').replace('_', '').toLowerCase()) >= 0)
    {

    return{

        movement_name:movement_name,

        direction:direction,

        accel_curve:accel_curve,

        dispersionAngle:dispersionAngle,

        delay:delay,

        delayPerMember:delayPerMember,


        fire:function()
        {


            for(var x = 0; x <= speed; x++)
            {


                for(var y = 0; y <= speed; y++)
                {


                    for(var z = 0; z <= speed; z++)
                    {





                    }



                }


            }

            switch(name)
            {



            }






        }

    }

    }


}




Game.motion_actions = {

  zigzag:new MotionAction(
      {
          name:'zigzag',
          speed:3,
          direction:'left',
          accel_curve:TWEEN.Easing().Quadratic.InOut,
          dispersionAngle:15,
          duration:20,
          delay:0,

          delayPerMember:10,

          repeat:true

      }, 3, )


};


