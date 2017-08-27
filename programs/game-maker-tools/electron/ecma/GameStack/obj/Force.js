
 /**
 * GravityForce, calling new GravityForce() is equivalent to calling new Force()
  *
  * Takes an object of arguments and GravityForce() object.
 * @param   {string} args.name optional
 * @param   {string} args.description optional
 * @param   {Array} args.subjects the subjects to be pulled by the GravityForce
 * @param   {Array} args.clasticObjects any clastic object that should have collision-stop behavior with args.subjects when collision occurs
 * @param   {Vector} args.max the speed of gravity AKA terminal velocity
 * @param   {number} args.accel the increment to use when accelerating speed of fall
 *
 * @returns {Motion} a Motion object
 */

class GravityForce
{
    constructor(args)
    {

        this.name = args.name || "";

        this.description = args.description || "";

        this.subjects = args.subjects || [];

        this.clasticObjects = args.clasticObjects || [];

        this.max = args.max || new Vector3(3, 3, 3);
         this.accel = args.accel || new Vector3(1.3, 1.3, 1.3);

        for(var x in args)
        {
            this[x] = args[x];

        }


        for(var x in this.clasticObjects)
        {
            if(!this.clasticObjects[x] instanceof Sprite)
            {
                this.clasticObjects[x] = Gamestack.getById(this.clasticObjects[x].id);
            }

        }


        for(var x in this.subjects)
        {
            if(!this.subjects[x] instanceof Sprite)
            {
                this.subjects[x] = Gamestack.getById(this.subjects[x].id);
            }

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


    update()
    {

      var  subjects = this.subjects;

       var clasticObjects =  this.clasticObjects;

      var  accel =  this.accel || {};

        var max =  this.max || {};

        __gameStack.each(subjects, function(ix, itemx){

           itemx.accelY(accel, max);

           itemx.__inAir = true;

            __gameStack.each(clasticObjects, function(iy, itemy){

                itemx.collide_stop(itemy);


            });
        });
    }
};

let Force = GravityForce;






