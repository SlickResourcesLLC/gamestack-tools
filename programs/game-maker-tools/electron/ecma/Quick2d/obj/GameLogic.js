/**
 * Created by The Blakes on 7/27/2017.
 */

class StatEffect{

    constructor(name, value) {

        this.__is = "a game logic effect";

        this.name =name;

        this.value = value;

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

}

class Collision
{
    constructor({object, collideables, extras})
    {
        this.object = object || [];

        this.collideables = collideables instanceof Array ? collideables : [];

        this.extras = extras instanceof Array ? extras : []; //anything extra to execute onCollision
        //note: extras are any StatEffect, Animation, Movement to be simultaneously executed with this Collision

    }

    Object(object)
    {
        this.object = object;

    }

    Extras(extras)
    {
        this.extras = extras;

    }

    Collideables(collideables)
    {
        this.collideables = collideables;

    }

    onCollide(fun)
    {
        this.callback = fun;

    }

    collide()
    {
        this.callback();
    }

    process()
    {
        //if collision, call collide()

    }


};



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

            for(var x = 0; x < this.gameEffects.length; x++)
            {

                this.gameEffects[x].process();

            }

    }
    add(gameeffect)
    {

        this.gameEffects.push(gameeffect);

    }

}
