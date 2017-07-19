/**
 * Created by The Blakes on 04-13-2017
 *
 * --note :: file started 04-13-2017, target completion : 04-25-2017
 *
 * SpecialMoves:{} //an object for special moves, such as jump(), fire_projectile(), etc..
 */



class TerrainSprite
{

    constructor(sprite, args)
    {

     this.collision = $Q.hasArg(args, 'collision', 'full');

       this.collision_options = ['full', 'all', '*',  'top', 'bottom', 'left', 'right', 'vertical', 'horizontal'];

       this.collision_callback = function()
       {



       };

    }

    collide(sprite, callable)
    {

        switch(this.collision)
        {

            case 'full':

            case '*':

            case 'all':

                break;

            case 'top':

                break;

            case 'left':

                break;

            case 'bottom':

                break;

            case 'right':

                break;

        }

    }

}





