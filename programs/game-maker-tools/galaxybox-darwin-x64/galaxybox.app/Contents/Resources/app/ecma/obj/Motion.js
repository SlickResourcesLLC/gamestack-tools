/**
 * Created by The Blakes on 04-13-2017
 *
 */

//SimpleMathDescriptor({operator:['+', '-', '/', '*', '%'], operand_key:['speed']})

//MotionDirections({})


class GUIMotion
{

    constructor(parent, key, operator,  value)
    {

        var m = this;

        this.parent = parent; this.key = key; this.value =value;

        if(typeof(this.parent.update) == 'function' )
        {
            var update = this.parent.update;

            this.parent.update = function()
            {
                update();


                if(operator == '+')
                {
                    parent[key] += value;

                }

                if(operator == '-')
                {
                    parent[key] -= value;

                }

                if(operator == '*')
                {
                    parent[key] *= value;

                }

                if(operator == '/')
                {
                    parent[key] /= value;

                }

            }



        }

    }

}

