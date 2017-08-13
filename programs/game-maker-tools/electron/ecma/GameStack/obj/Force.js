
/**
 * Force()
 *
 * <ul >
 *  <li> a 'physics' object
 *  <li> easily instantiate physical behaviors, applied to specific groups of objects
 * </ul>
 *
 * [See Live Demos with Suggested Usage-Examples]{@link http://www.google.com}
 * @returns {Force} object of Force()
 * */

class Force
{
    constructor(args)
    {

        this.name = args.name || "";

        this.description = args.description || "";

        this.subjects = args.subjects || [];
        this.origin =  args.origin || {};
        this.massObjects = args.massObjects || [];

        this.minSpeed = args.minSpeed || new Vector3(1, 1, 1);

        this.max = args.max || new Vector3(3, 3, 3);
         this.accel = args.accel || new Vector3(1.3, 1.3, 1.3);

        for(var x in args)
        {
            this[x] = args[x];

        }

    }

    getArg(args, key, fallback) {

        if (args.hasOwnProperty(key)) {

            return args[key];

        }
        else {
            return fallback;

        }

    }


    gravitateY()
    {

      var  subjects = this.subjects;

       var origin =  this.origin || {};

       var massObjects =  this.massObjects;

      var  accel =  this.accel || {};

        var max =  this.max || {};

        $.each(subjects, function(ix, itemx){

           itemx.accelY(accel, max);

           itemx.__falling = true;

            $.each(massObjects, function(iy, itemy){

                itemx.collide_stop(itemy);


            });
        });
    }
};






