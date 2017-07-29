/**
 * Created by The Blakes on 7/27/2017.
 */



class StatEffect{

    constructor(name, value, onEffect) {

        this.__is = "a game logic effect";

        this.name =name;

        this.value = value;

        this.onEffect = onEffect || function(){};


    }

    limit(numberTimes, withinDuration)
    {


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

    onEffect()
    {



    }

};


class GameEffect {

    constructor(args) {

        var myChance = this.chance(args.chance || 1.0); //the chance the effect will happen

        this.trigger = args.trigger || 'always' || 'collide';

        this.parent = args.parent || false;

        if(!this.parent)
        {
            console.error('GameEffect Must have valid parent sprite');

        }

        this.objects = args.objects || [];

        for(var x in args)
        {

            if(x instanceof Animation)
            {

                //trigger the Animation

            }

            if(x instanceof StatEffect)
            {

                //trigger the StatEffect


            }


        }

    }

    chance(floatPrecision) {



    }
    collide(object, collidables) {


    }

}


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




    }

    add(effect)
    {

        this.gameEffects.push(effect);

    }

}
