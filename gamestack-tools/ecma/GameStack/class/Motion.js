
/**
 * Takes an object of arguments and returns Motion() object. Motion animates movement of position and rotation properties for any Sprite()

 * @param   {Object} args object of arguments
 * @param   {string} args.name optional
 * @param   {string} args.description optional
 * @param   {TWEEN.Easing.'objectGroup'.'objectMember'} args.curve the TWEEN.Easing function to be applied (Example: TWEEN.Easing.Quadratic.InOut)
 * @param   {Vector} args.targetRotation the targeted rotation result, when using rotation with movement
 * @param   {Vector} args.distance the target distance of position change, when moving position
 * @param   {number} args.duration the milliseconds duration of the Motion
 * @param   {number} args.delay the milliseconds delay before the Motion occurs (on call of Motion.engage())
 *
 *
 * @returns {Motion} a Motion object
 */

class Motion {
    constructor(args={}) {

        this.getArg = $Q.getArg;

        this.distance = new Vector(Gamestack.getArg(args, 'distance', new Vector(0, 0)));

        this.curvesList = this.curvesToArray(); //Tween.Easing

        this.lineCurvesList = this.lineCurvesToArray();

        if(args.parent instanceof Sprite)
        {
            this.parent = args.parent;

            this.parent_id = args.parent.id;

        }
        else
        {
            this.parent_id = args.parent_id || args.object_id || "__blank"; //The parent object

            this.parent = Gamestack.getObjectById(this.parent_id);

        }

        this.motion_curve = Gamestack.getArg(args, 'curve', TWEEN.Easing.Quadratic.InOut);

        this.line_curve = Gamestack.getArg(args, 'line_curve', TWEEN.Easing.Linear.None);

        this.rotation = Gamestack.getArg(args, 'rotation', 0);

        this.size = Gamestack.getArg(args, 'size', new Vector(0, 0, 0));

        this.targetRotation = Gamestack.getArg(args, 'targetRotation', 0);

        this.name = Gamestack.getArg(args, 'name', "__");

        this.description = Gamestack.getArg(args, 'description', false);

        this.motionCurveString = this.getMotionCurveString(); //store a string key for the Tween.Easing || 'curve'

        this.lineCurveString = this.getLineCurveString(); //store a string key for the Tween.Easing || 'curve'

        this.setMotionCurve(this.motionCurveString);

        this.setLineCurve(this.lineCurveString);

        this.duration = Gamestack.getArg(args, 'duration', 500);

        this.delay = Gamestack.getArg(args, 'delay', 0);

        this.object = this.getParent();
        
        this.run_ext = args.run_ext || [];

        this.complete_ext = args.complete_ext || [];

    }

    /*****
     * Overridable / Extendable functions
     * -allows stacking of external object-function calls
     ******/

    onRun(caller, callkey) {
        this.run_ext = this.run_ext || [];

        if (this.run_ext.indexOf(caller[callkey]) == -1) {
            this.run_ext.push({caller: caller, callkey: callkey});
        }
    }

    onComplete(caller, callkey) {
        this.complete_ext = this.complete_ext || [];

        if (this.complete_ext.indexOf(caller[callkey]) == -1) {
            this.complete_ext.push({caller: caller, callkey: callkey});
        }
    }

    call_on_run() {
        //call any function extension that is present
        for (var x = 0; x < this.run_ext.length; x++) {
            this.run_ext[x].caller[this.run_ext[x].callkey]();
        }
    }

    call_on_complete() {
        //call any function extension that is present
        for (var x = 0; x < this.complete_ext.length; x++) {
            this.complete_ext[x].caller[this.complete_ext[x].callkey]();
        }
    }


    curvesToArray() {

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

    lineCurvesToArray() {

        var c = [];

        GameStack.each(TWEEN.Easing, function (ix, easing) {

            GameStack.each(easing, function (iy, easeType) {

                if (['linear', 'cubic', 'quadratic', 'quartic', 'quintic'].indexOf(ix.toLowerCase()) >= 0) {

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

    getLineCurveString() {

        var __inst = this;

        var c;

        $.each(TWEEN.Easing, function (ix, easing) {

            $.each(TWEEN.Easing[ix], function (iy, easeType) {


                if (__inst.line_curve == TWEEN.Easing[ix][iy]) {

                    c = ix + "_" + iy;

                }

            });

        });

        return c;

    }

    setLineCurve(c) {

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

        this.line_curve = curve;


        return curve;

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


    onRun(caller, callkey)
    {

        this.run_ext = this.run_ext  || [];

        this.run_ext.push({caller:caller, callkey:callkey});

    }

    getParent()
    {

        var object = {}, __inst = this;

        $.each(Gamestack.all_objects, function (ix, item) {

            if (item.id == __inst.parent_id) {

                object = item;
            }
        });

        if(!this.size)
        {
            this.size = new Vector(object.size);

        }

        return object;

    }

    engage() {

        var __inst = this;

        var tweens = [];


        var object = this.getParent();

        var targetPosition = {

            x: __inst.distance.x + object.position.x,
            y: __inst.distance.y + object.position.y,
            z: __inst.distance.z + object.position.z

        };

        var targetR = __inst.targetRotation + object.rotation.x,

        targetSize = __inst.size;

        __inst.call_on_run(); //call any on-run extensions

        //we always have a targetPosition
        //construct a tween::
        tweens.push(new TWEEN.Tween(object.position)
            .easing(__inst.curve || __inst.motion_curve)

            .to(targetPosition, __inst.duration)
            .onUpdate(function () {
                //console.log(objects[0].position.x,objects[0].position.y);


            })
            .onComplete(function () {
                //console.log(objects[0].position.x, objects[0].position.y);
                if (__inst.complete) {

                    __inst.call_on_complete(); //only call once

                }


            }));

        //we have a target
        tweens.push(new TWEEN.Tween(object.size)
            .easing(__inst.curve || __inst.motion_curve)

            .to(targetSize, __inst.duration)
            .onUpdate(function () {
                //console.log(objects[0].position.x,objects[0].position.y);


            })
            .onComplete(function () {
                //console.log(objects[0].position.x, objects[0].position.y);
                if (__inst.complete) {



                }


            }));

        //we have a target
        tweens.push(new TWEEN.Tween(object.rotation)
            .easing(__inst.curve || __inst.motion_curve)

            .to({x: targetR}, __inst.duration)
            .onUpdate(function () {
                //console.log(objects[0].position.x,objects[0].position.y);


            })
            .onComplete(function () {
                //console.log(objects[0].position.x, objects[0].position.y);
                if (__inst.complete) {



                }


            }));



        __inst.delay = !isNaN(__inst.delay) && __inst.delay > 0 ? __inst.delay : 0;


        return {

            tweens: tweens,

            delay: __inst.delay,

            fire: function () {

                var __tweenObject = this;

                window.setTimeout(function () {

                    for (var x = 0; x < __tweenObject.tweens.length; x++) {

                        __tweenObject.tweens[x].start();

                    }

                }, this.delay);

            }

        }

    }

    /**
     * start the Motion transition
     *
     * @function
     * @memberof Motion
     *
     **********/

    start() {
        this.engage().fire();

    }

    /**
     * specify a function to be called when Motion is complete
     *
     * @function
     * @memberof Motion
     * @param {Function} fun the function to be called when complete
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

    getTweenPoints(size, line) {

        //must have line.minPointDist

        var curve = line.curve,
        duration = line.duration;

        var points = [];

        var position = new Vector(line.position);

        var target = new Vector(position).add(size);

        var start = new Vector(position);

        var dist = new Vector(0, 0, 0);

        var ptrack;


       var  easeInOutQuad =  function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t };


        return points;

       var t1 =  new TWEEN.Tween(position).to({x:target.x}, 2000).easing(TWEEN.Easing.Linear.None).start();

       if(t2)
       {
           t2.stop();
       }

      var t2 =  new TWEEN.Tween(position).to({y:target.y}, 2000).easing(curve).onUpdate(function () {


          if(ptrack){

              dist = ptrack.sub(p);

              var d = Math.sqrt( dist.x * dist.x + dist.y * dist.y );

              if(d >= line.minPointDist)
              {

                  points.push(p);

                  ptrack = new Vector(p);
              }

          }

          else{
              ptrack = p;

              points.push(p);
          };

        }).onComplete(function() {

            // alert(line.minPointDist);

            line.first_segment = points.slice();

            var extendLinePoints = function (segment, points, ix)
            {

            var next_points = segment.slice();

            var last_point = points[points.length - 1];

            for (var x = 0; x < next_points.length; x++) {

                var sr = new Vector(Gamestack.GeoMath.rotatePointsXY(line.size.x * ix, line.size.y * ix, line.rotation));

                var p = next_points[x].add(sr);

                if(points.indexOf(p) <= -1) {

                    points.push(p);


                }

            }
        };

        for(var x = 0; x <= line.curve_iterations; x++)
        {
            if(x > 1) {

                extendLinePoints(line.first_segment, line.points, x - 1);

            }

        }


        }).start();

        return points;
    }
}


Gamestack.Motion = Motion;







