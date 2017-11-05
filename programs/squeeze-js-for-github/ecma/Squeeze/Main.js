
/**@author
Jordan Edward Blake
 * */



function Squeeze()
{
    this.EffectSequence = EffectSequence;


    this.each = function(obj, callback)
    {
        for(var x in obj)
        {

            callback(x, obj[x]);

        }

    };

    this.LayeredAnimation = function(animations)
    {


        console.log('TODO');

    };

    this.SequencedAnimation = function(animations)
    {


        console.log('TODO');

    };

}




