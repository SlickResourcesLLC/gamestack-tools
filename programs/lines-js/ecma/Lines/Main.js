/**@author
Jordan Edward Blake
 * */

function Lines()
{
    this.each = function(obj, callback)
    {
        for(var x in obj)
        {

            callback(x, obj[x]);

        }
    };

}




