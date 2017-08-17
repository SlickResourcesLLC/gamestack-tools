
class Motion {
    constructor(args) {

        this.getArg = $Q.getArg;

        this.distance = this.getArg(args, 'distance', this.getArg(args, 'distances', false));

        this.curvesList = this.curvesObject(); //Tween.Easing

        this.parent_id = args.parent_id || args.object_id || "__blank"; //The parent object

        this.curve = this.getArg(args, 'curve', TWEEN.Easing.Quadratic.InOut);

        this.targetRotation = this.getArg(args, 'targetRotation', 0);

        this.name = this.getArg(args, 'name', "__");

        this.description = this.getArg(args, 'description', false);

        this.curveString = this.getCurveString(); //store a string key for the Tween.Easing || 'curve'

        this.setCurve(this.curveString);

        this.line = this.getArg(args, 'line', false);

        this.duration = this.getArg(args, 'duration', 500);

        this.delay = this.getArg(args, 'delay', 0);

        this.duration = this.getArg(args, 'duration', false);


    }


    curvesObject() {

        var c = [];

        GameStack.each(TWEEN.Easing, function (ix, easing) {

            GameStack.each(easing, function (iy, easeType) {

                if (['in', 'out', 'inout'].indexOf(iy.toLowerCase()) >= 0) {

                    c.push(ix + "_" + iy);

                }

            });

        });

        return c;

    }


    getCurveString() {

        var __inst = this;

        var c;

        $.each(TWEEN.Easing, function (ix, easing) {

            $.each(TWEEN.Easing[ix], function (iy, easeType) {


                if (__inst.curve == TWEEN.Easing[ix][iy]) {

                    c = ix + "_" + iy;

                }

            });

        });

        return c;

    }


    setCurve(c) {

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

        this.curve = curve;


        return curve;

    }

    engage() {

        var tweens = [];

        //construct a tween::

        var __inst = this;


        var objects = {};

        $.each(Game.sprites, function (ix, item) {

            if (item.id == __inst.parent_id) {

                objects[ix] = item;

            }
        });


        var target = {

            x: __inst.distance.x + objects[0].position.x,
            y: __inst.distance.y + objects[0].position.y,
            z: __inst.distance.z + objects[0].position.z

        };

        if (__inst.targetRotation > 0 || __inst.targetRotation < 0) {


            var targetR = __inst.targetRotation + objects[0].rotation.x;

            //we have a target
            tweens[0] = new TWEEN.Tween(objects[0].rotation)
                .easing(__inst.curve || TWEEN.Easing.Elastic.InOut)

                .to({x: targetR}, __inst.duration)
                .onUpdate(function () {
                    //console.log(objects[0].position.x,objects[0].position.y);


                })
                .onComplete(function () {
                    //console.log(objects[0].position.x, objects[0].position.y);
                    if (__inst.complete) {

                        __inst.complete();

                    }


                });


        }

        //we have a target
        tweens.push(new TWEEN.Tween(objects[0].position)
            .easing(__inst.curve || TWEEN.Easing.Elastic.InOut)

            .to(target, __inst.duration)
            .onUpdate(function () {
                //console.log(objects[0].position.x,objects[0].position.y);


            })
            .onComplete(function () {
                //console.log(objects[0].position.x, objects[0].position.y);

                if (__inst.complete) {

                    __inst.complete();

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

    start() {
        this.engage().fire();

    }


    onComplete(fun) {
        this.complete = fun;

    }

    // obj.getGraphCanvas( $(c.domElement), value.replace('_', '.'), TWEEN.Easing[parts[0]][parts[1]] );

    getGraphCanvas( t, f, c) {

        var canvas = document.createElement('canvas');

        canvas.id = 'curve-display';

        canvas.width = 180;
        canvas.height = 100;


        var context = canvas.getContext('2d');
        context.fillStyle = "rgb(250,250,250)";
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









