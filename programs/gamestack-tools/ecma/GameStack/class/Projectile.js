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

    constructor(args = {}) {

        this.getArg = $Q.getArg;

        for (var x in args) {
            this[x] = args[x];

        }

        this.name = args.name || "__";

        this.description = args.description || "__";

        this.line = new Line(Gamestack.getArg(args, 'line', new Line()));

        this.animation = Gamestack.getArg(args, 'animation', new Animation());

        this.parent_id = args.parent_id || args.object_id || "__blank"; //The parent object

        this.name = Gamestack.getArg(args, 'name', "__");

        this.size = Gamestack.getArg(args, 'size', new Vector());

        this.origin = args.origin || false;

        this.description = Gamestack.getArg(args, 'description', false);

        this.duration = Gamestack.getArg(args, 'duration', 500);

        this.delay = Gamestack.getArg(args, 'delay', 0);

        this.position = Gamestack.getArg(args, 'position', new Vector(0, 0, 0));

        this.motion_curve = Gamestack.getArg(args, 'motion_curve', TWEEN.Easing.Linear.None);

        this.highlighted = false;

        this.sprites = [];

        this.run_ext = args.run_ext || [];

    }

    /**
     * specify a function to be called when Motion is complete
     *
     * @function
     * @memberof Projectile
     * @param {Function} fun the function to be called when complete
     *
     **********/

    onComplete(fun) {
        this.complete = fun;

    }

    onCollide(fun) {
        this.collide = fun;

    }

    setAnimation(anime) {

        this.animation = anime;

        return this;

    }

    setMotionCurve(c) {

        this.motion_curve = c;

        return this;

    }

    kill_one() {

        var spr = this.sprites[this.sprites.length - 1];

        Gamestack.remove(spr);

    }

    onRun(caller, callkey) {

        this.run_ext = this.run_ext || [];

        this.run_ext.push({caller: caller, callkey: callkey});

    }


    fire(origin) {

        for (var x = 0; x < this.run_ext.length; x++) {

            this.run_ext[x].caller[this.run_ext[x].callkey]();

        }

        if (!origin) {

            origin = this.origin;
        }


        console.log('FIRING FROM:' + jstr(origin));

        var sprite = new Sprite({image: this.animation.image});

        sprite.setAnimation(this.animation);

        sprite.setSize(this.size);

        sprite.position = new Vector(0, 0, 0);

        var __inst = this;

        var lp = __inst.line.transpose(origin);

        sprite.position = new Vector(lp[0].sub(sprite.size.div(2)));

        sprite.onUpdate(function (sprite) {

            for (var x = 0; x < lp.length; x++) {

                if (sprite.center().equals(lp[x]) && x < lp.length - 1) {

                    sprite.position = new Vector(lp[x + 1].sub(sprite.size.div(2)));

                    break;
                }

                if (x == lp.length - 1) {
                    Gamestack.remove(sprite);

                }

            }

        });

        Gamestack.add(sprite);

        this.sprites.push(sprite);

    }

}


Gamestack.Projectile = Projectile;







