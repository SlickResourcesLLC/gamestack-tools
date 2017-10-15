
/**
 * Takes an object of arguments and returns Projectile() object. Projectile fires a shot from the parent sprite, with specified offset, rotation, motion_curve, line_curve

 * @param   {Object} args object of arguments
 * @param   {string} args.name optional
 * @param   {string} args.description optional
 * @param   {string} args.distance the distance before dissappearance
 * @param   {TWEEN.Easing.'objectGroup'.'objectMember'} args.motion_curve the TWEEN.Easing function to be applied for motion/speed (Example: TWEEN.Easing.Quadratic.InOut)
 *
 *  * @param   {TWEEN.Easing.'objectGroup'.'objectMember'} args.line_curve the TWEEN.Easing function to be applied for line (Example: TWEEN.Easing.Quadratic.InOut)
 *
 * @returns {Projectile} a Projectile object
 */



class Projectile {

    constructor(args={}) {

        this.getArg = $Q.getArg;

        for(var x in args)
        {
            this[x] = args[x];

        }

        this.line = Gamestack.getArg(args, 'line', new Line());

        this.animation = Gamestack.getArg(args, 'animation', new Animation());

        this.parent_id = args.parent_id || args.object_id || "__blank"; //The parent object

        this.motion_curve = Gamestack.getArg(args, 'curve', TWEEN.Easing.Quadratic.InOut);

        this.rotation = Gamestack.getArg(args, 'rotation', 0);

        this.name = Gamestack.getArg(args, 'name', "__");

        this.description = Gamestack.getArg(args, 'description', false);

        this.motionCurveString = this.getMotionCurveString(); //store a string key for the Tween.Easing || 'curve'

        this.setMotionCurve(this.motionCurveString);

        this.duration = Gamestack.getArg(args, 'duration', 500);

        this.delay = Gamestack.getArg(args, 'delay', 0);

        this.target = new Vector2();

        this.position = Gamestack.getArg(args, 'position', new Vector);


        this.highlighted = false;

    }

    curvesObject() {

        var c = [];

        GameStack.each(TWEEN.Easing, function (ix, easing) {

            GameStack.each(easing, function (iy, easeType) {

                if (['in', 'out', 'inout','none'].indexOf(iy.toLowerCase()) >= 0) {

                    c.push(ix + "_" + iy);

                }

            });

        });

        return c;

    }

    getMotionCurveString() {

        var __inst = this;

        var c;

        $.each(TWEEN.Easing, function (ix, easing) {

            $.each(TWEEN.Easing[ix], function (iy, easeType) {


                if (__inst.motion_curve == TWEEN.Easing[ix][iy]) {

                    c = ix + "_" + iy;

                }

            });

        });

        return c;

    }


    setMotionCurve(c) {

        var cps = c.split('_');

        var s1 = cps[0], s2 = cps[1];

        var curve = TWEEN.Easing.Quadratic.InOut;

        $.each(TWEEN.Easing, function (ix, easing) {

            $.each(TWEEN.Easing[ix], function (iy, easeType) {


                if (ix == s1 && iy == s2) {

                    // alert('setting curve');

                    curve = TWEEN.Easing[ix][iy];

                }

            });

        });

        this.motion_curve = curve;


        return curve;

    }

    Distance(d)
    {
        this.target.y = d;

    }



    fire() {

        //reference list of sprites

        //create and start() the tween, with point-vectors

        //we have a target


        this.tween = new TWEEN.Tween(this.position)

            .easing()

            .to({x:this.target.x})

            .onUpdate(function () {
                //console.log(objects[0].position.x,objects[0].position.y);

                alert('tween updating');

                this.position.y =0;

                __inst.Update();

            })

            .onComplete(function () {
                //console.log(objects[0].position.x, objects[0].position.y);
                if (__inst.complete) {

                    __inst.complete();

                }


            });



    }

    /**
     * start the Motion transition
     *
     * @function
     * @memberof Motion
     *
     **********/

    start() {
        this.fire();

    }

    /**
     * specify a function to be called when Motion is complete
     *
     * @function
     * @memberof Motion
     * @param {Function} fun the function to be called when complete
     *
     **********/

    onComplete(fun) {
        this.complete = fun;

    }

    // obj.getGraphCanvas( $(c.domElement), value.replace('_', '.'), TWEEN.Easing[parts[0]][parts[1]] );

    getGraphCanvas( t, f, c) {

        var canvas = c || document.createElement('canvas');

        canvas.style.position = "relative";

        canvas.id = 'curve-display';

        canvas.setAttribute('class', 'motion-curve');

        canvas.width = 180;
        canvas.height = 100;

        canvas.style.background = "black";

        var context = canvas.getContext('2d');
        context.fillStyle = "rgb(0,0,0)";
        context.fillRect(0, 0, 180, 100);

        context.lineWidth = 0.5;
        context.strokeStyle = "rgb(230,230,230)";

        context.beginPath();
        context.moveTo(0, 20);
        context.lineTo(180, 20);
        context.moveTo(0, 80);
        context.lineTo(180, 80);
        context.closePath();
        context.stroke();

        context.lineWidth = 2;
        context.strokeStyle = "rgb(255,127,127)";

        var position = {x: 5, y: 80};
        var position_old = {x: 5, y: 80};

        new TWEEN.Tween(position).to({x: 175}, 2000).easing(TWEEN.Easing.Linear.None).start();
        new TWEEN.Tween(position).to({y: 20}, 2000).easing(f).onUpdate(function () {

            context.beginPath();
            context.moveTo(position_old.x, position_old.y);
            context.lineTo(position.x, position.y);
            context.closePath();
            context.stroke();

            position_old.x = position.x;
            position_old.y = position.y;

        }).start();

        return canvas;
    }
}


Gamestack.Motion = Motion;







