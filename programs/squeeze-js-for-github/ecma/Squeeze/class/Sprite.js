/**
 * Takes an object of arguments and returns Sprite() object. Sprite() is a container for multiple Animations, Motions, and Sounds. Sprites have several behavioral functions for 2d-Game-Objects.

 * @param   {Object} args object of arguments
 * @param   {string} args.name optional
 * @param   {string} args.description optional

 * @param   {string} args.src the source file for the GameImage:Sprite.image :: use a string / file-path

 * @param   {Vector} args.size the size of the Sprite
 * @param   {Vector} args.position the position of the Sprite
 * @param   {Vector} args.padding the 'float-type' Vector of x and y padding to use when processing collision on the Sprite. A padding of new Vector(0.2, 0.2) will result in 1/5 of Sprite size for padding



 * @param   {Animation} args.selected_animation the selected_animation of the Sprite:: pass during creation or use Sprite.setAnimation after created
 *
 * @returns {Sprite} a Sprite object
 */

class Sprite {
    constructor(args) {

        if (!args) {
            args = {};
        }

        if(args instanceof Animation)
        {

            args = {selected_animation:args, size:new Vector(args.frameSize)};
        }

        this.active = true; //active sprites are visible

        this.name = args.name || "__";

        this.description = args.description || "__";

        this.gravity = "medium";

        this.__initializers = __gameStack.getArg(args, '__initializers', []);

        var _spr = this;

        Gamestack.each(args, function (ix, item) { //apply all args

            if (ix !== 'parent') {
                _spr[ix] = item;
            }

        });

        this.type = __gameStack.getArg(args, 'type', 'basic');

        this.animations = __gameStack.getArg(args, 'animations', []);

        this.motions = __gameStack.getArg(args, 'motions', []);

        this.projectiles = __gameStack.getArg(args, 'projectiles', []);

        let __inst = this;

        this.id = __gameStack.getArg(args, 'id', this.create_id());

        this.sounds = __gameStack.getArg(args, 'sounds', []);

        this.image = new GameImage(__gameStack.getArg(args, 'src', __gameStack.getArg(args, 'image', false)));

        this.size = new Vector(__gameStack.getArg(args, 'size', new Vector3(100, 100)));

        this.position = new Vector( __gameStack.getArg(args, 'position', new Vector3(0, 0, 0)));

        this.collision_bounds = __gameStack.getArg(args, 'collision_bounds', new VectorBounds(new Vector3(0, 0, 0), new Vector3(0, 0, 0)));

        this.rotation =  new Vector(__gameStack.getArg(args, 'rotation', new Vector3(0, 0, 0)));

        this.selected_animation = {};

        this.speed = __gameStack.getArg(args, 'speed', new Vector3(0, 0, 0));

        this.acceleration = __gameStack.getArg(args, 'acceleration', new Vector3(0, 0, 0));

        this.rot_speed = __gameStack.getArg(args, 'rot_speed', new Vector3(0, 0, 0));

        this.rot_accel = __gameStack.getArg(args, 'rot_accel', new Vector3(0, 0, 0));


        this.padding = __gameStack.getArg(args, 'padding', new Vector3(0, 0, 0));

        //Apply / instantiate Sound(), Motion(), and Animation() args...

        GameStack.each(this.sounds, function (ix, item) {

            __inst.sounds[ix] = new Sound(item);

        });

        GameStack.each(this.motions, function (ix, item) {

            __inst.motions[ix] = new Motion(item);

        });

        GameStack.each(this.animations, function (ix, item) {

            __inst.animations[ix] = new Animation(item);


        });

        GameStack.each(this.projectiles, function (ix, item) {

            __inst.projectiles[ix] = new Projectile(item);

        });

        //Apply initializers:

        GameStack.each(this.__initializers, function (ix, item) {

            __inst.onInit(item);

        });


        if (args.selected_animation) {
            this.selected_animation = new Animation(args.selected_animation);

        }
        else {

            this.image.domElement.onload = function(){

                __inst.setAnimation(__inst.animations[0] || new Animation({

                        image:  __inst.image,

                        frameSize: new Vector3( __inst.image.domElement.width,  __inst.image.domElement.height),

                        frameBounds: new VectorFrameBounds(new Vector3(), new Vector3())


                    }));

            };

        }

    }


    /**
     * This function initializes sprites. Call to trigger all functions previously passed to onInit().
     *
     * @function
     * @memberof Sprite
     **********/

    init() {



    }

    /**
     * This function extends the init() function. Takes single function() argument OR single string argument
     * @function
     * @memberof Sprite
     * @param {function} fun the function to be passed into the init() event of the Sprite()
     **********/

    onInit(fun) {

        if (typeof fun == 'string') {

            if (this.__initializers.indexOf(fun) < 0) {

                this.__initializers.push(fun)
            }
            ;

            var __inst = this;

            var keys = fun.split('.');

            console.log('finding init from string:' + fun);

            if (!keys.length >= 2) {
                return console.error('need min 2 string keys separated by "."');
            }

            var f = GameStack.options.SpriteInitializers[keys[0]][keys[1]];

            if (typeof(f) == 'function') {

                var __inst = this;

                var f_init = this.init;

                this.init = function () {

                    f_init(__inst);

                    f(__inst);

                };

            }


        }

        else if (typeof fun == 'function') {

            console.log('extending init:');


            var f_init = this.init;
            var __inst = this;

            this.init = function () {

                f_init(__inst);

                fun(__inst);

            };


        }

        else if (typeof fun == 'object') {

            console.log('extending init:');

            console.info('Quick2D does not yet implement onInit() from arg of object type');

        }

    }

    /*****************************
     * Getters
     ***************************/

    /**
     * This function gets the 'id' of the Sprite()
     * @function
     * @memberof Sprite
     * @returns {string}
     **********/

    get_id() {
        return this.id;
    }



    to_map_object(size, framesize) {

        this.__mapSize = new Vector3(size || this.size);

        this.frameSize = new Vector3(framesize || this.size);

        return this;

    }

    /*****************************
     * Setters and Creators
     ***************************/

    /**
     * This function creates the 'id' of the Sprite():Called automatically on constructor()
     * @function
     * @memberof Sprite
     * @returns {string}
     **********/

    create_id() {

        return Quick2d.create_id();

    }


    /**
     * This function sets the size of the Sprite()
     * @function
     * @memberof Sprite
     **********/

    setSize(size) {

        this.size = new Vector3(size.x, size.y, size.z);

    }

    /**
     * This function sets the position of the Sprite()
     * @function
     * @memberof Sprite
     **********/

    setPos(pos) {
        this.position = new Vector3(pos.x, pos.y, pos.z || 0);

    }

    /**
     * This function sizes the Sprite according to minimum dimensions and existing w/h ratios
     * @param {number} mx the maximum size.x for the resize
     * @param {number} my the maximum size.y for the resize
     * @function
     * @memberof Sprite
     **********/

   getCappedSizeXY(mx, my, currentSize)
    {

        var size = new Vector3(currentSize || this.size);

        var wth = size.y /  size.x;

        var htw = size.x /  size.y;

        if( size.x > mx)
        {
            size.x = mx;

            size.y = size.x * wth;

        }

        if( size.y > my)
        {
            size.y = my;

            size.x = size.y * htw;

        }

        return size;

    }




    /*****************************
     *  assertSpeed()
     *  -assert the existence of a speed{} object
     ***************************/

    assertSpeed() {
        if (!this.speed) {

            this.speed = new Vector3(0, 0, 0);

        }

    }



    /*****************************
     *  setAnimation(anime)
     *  -set the select_animation of this sprite
     ***************************/

    /**
     * This function sets the 'selected_animation' property of the Sprite():: *all Sprites must have a 'selected_animation'
     * @function
     * @memberof Sprite
     * @param {Animation}
     **********/

    setAnimation(anime) {

        if (anime instanceof Animation && this.animations.indexOf(anime) < 0) {
            this.animations.push(anime);
        }

        this.selected_animation = anime;

        Gamestack.log('declared default animation');

        return this;

    }

    /**
     * This function indicates if this Sprite is onScreen within the Gamestack.WIDTH && Gamestack.HEIGHT dimensions, OR any w & h passed as arguments
     * @function
     * @memberof Sprite
     * @param {number} w optional WIDTH argument, defaults to Gamestack.WIDTH
     * @param {number} h optional HEIGHT argument, defaults to Gamestack.HEIGHT
     **********/

    onScreen(w, h) {

        w = w || __gameStack.WIDTH;

        h = h || __gameStack.HEIGHT;


        var camera = __gameStack.camera ||__gameStack.__gameWindow.camera || new Vector3(0, 0, 0);

        var p = new Vector3(this.position.x - camera.position.x, this.position.y - camera.position.y, this.position.z - camera.position.z);

        var onScreen = p.x  > 0 - this.size.x && p.x < w + this.size.x
        &&  p.y  > 0 - this.size.x && p.y < h + this.size.y ? true : false;

        return onScreen;

    }

    /*****************************
     * Updates
     ***************************/

    /*****************************
     * update()
     * -starts empty:: is used by Quick2d.js as the main sprite update
     ***************************/

    /**
     * This function is the main update() function for the Sprite
     * @function
     * @memberof Sprite
     **********/


    update(sprite) {
    }

    /*****************************
     * def_update()
     * -applies speed and other default factors of movement::
     * -is used by Quick2d.js as the system def_update (default update)
     ***************************/

    /**
     * This function updates various speed and rotational-speed properties for the Sprite()
     * @function
     * @memberof Sprite
     **********/

    def_update(sprite) {


        for (var x in this.speed) {

            if (this.speed[x] > 0 || this.speed[x] < 0) {

                this.position[x] += this.speed[x];

            }

        }

        for (var x in this.acceleration) {

            if (this.acceleration[x] > 0 || this.acceleration[x] < 0) {

                this.speed[x] += this.acceleration[x];

            }

        }

        for (var x in this.rot_speed) {

            if ( this.rot_speed[x] > 0 || this.rot_speed[x] < 0) {

                this.rotation[x] += this.rot_speed[x];

            }


        }

        for (var x in this.rot_accel) {


            if (this.rot_accel[x] > 0 || this.rot_accel[x] < 0) {

                this.rot_speed[x] += this.rot_accel[x];

            }
        }
    }

    /**
     * This function resolves a function nested in an object, from a string-key, and it is applied by Gamestack.js for persistence of data and Sprite() behaviors
     * @function
     * @memberof Sprite
     **********/

    resolveFunctionFromDoubleKeys(keyString1, keyString2, obj, callback) {

        callback(typeof obj[keyString1][keyString2] == 'function' ? obj[keyString1][keyString2] : {});

    }

    /**
     * This function extends an existing function, and is applied by Gamestack in onInit();
     * @function
     * @memberof Sprite
     **********/

    extendFunc(fun, extendedFunc) {

        console.log('extending func');

        var ef = extendedFunc;

        var __inst = this;

        return function () {


            ef(__inst);

            //any new function comes after

            fun(__inst);


        };

    }


    /*****************************
     *  onUpdate(fun)
     * -args: 1 function(sprite){ } //the self-instance/sprite is passed into the function()
     * -overrides and maintains existing code for update(){} function
     ***************************/


    /**
     * Extends the update() of this sprite with a new function to be called during update()
     * @function
     * @memberof Sprite
     * @param {function} the function to apply to the Sprite:update()
     **********/


    onUpdate(fun) {
        fun = fun || function () {
            };

        let update = this.update;

        let __inst = this;

        this.update = function (__inst) {
            update(__inst);
            fun(__inst);
        };

    }


    /**
     *
     * <ul>
     *     <li>A rectangular style position</li>
     *      <li>Takes another sprite as argument</li>
     *       <li>Returns basic true || false during runtime</li>
     * </ul>
     * @function
     * @memberof Sprite
     * @param {sprite}
     **********/


    /**
     * Get the true || false results of a Collision between two Sprites(), based on their position Vectors and Sizes
     * @function
     * @memberof Sprite
     * @param {Sprite} sprite the alternate Sprite to process collision with
     **********/


    collidesRectangular(sprite) {

        return Gamestack.Collision.spriteRectanglesCollide(this, sprite);

    }


    /*****************************
     *  shoot(sprite)
     *  -fire a shot from the sprite:: as in a firing gun or spaceship
     *  -takes options{} for number of shots anglePerShot etc...
     *  -TODO: complete and test this code
     ***************************/

    /**
     * Sprite fires a projectile object
     * <ul>
     *     <li>Easy instantiator for bullets and propelled objects in GameStack</li>
     *     <li>*TODO: This function is not-yet implemented in GameStack</li>
     * </ul>
     * @function
     * @memberof Sprite
     * @param {options} *numerous args
     **********/


    /**
     * fire a projectile-subSprite from the Sprite
     * @function
     * @memberof Sprite
     * @param {Object} options an object of arguments
     * @param {Animation} animation the animation to fire from the Sprite
     * @param {number} speed the speed of the shot that is projected
     * @param {Vector} position the initial position of the shot: defaults to current Sprite position
     * @param {Vector} size the Vector size of the shot
     * @param {Vector} rot_offset the rotational offset to apply: controls direction of the shot
     **********/

    shoot(options) {
        //character shoots an animation

        this.prep_key = 'shoot';

        let animation = options.bullet || options.animation || new Animation();

        let speed = options.speed || 1;

        let position = options.position || new Vector3(this.position);

        let size = options.size || new Vector3(10, 10, 0);

        let rot_offset = options.rot_offset || new Vector3(0, 0, 0);

        if (__gameInstance.isAtPlay) {

            var bx = position.x, by = position.y, bw = size.x, bh = size.y;

            var shot = __gameStack.add(new Sprite({

                active: true,

                position: position,

                size: size,

                image: animation.image,

                rotation: new Vector3(0, 0, 0),

                flipX: false

            }));

            shot.setAnimation(animation);

            if (typeof(rot_offset) == 'number') {
                rot_offset = new Vector3(rot_offset, 0, 0);
            }

            shot.position.x = bx, shot.position.y = by;
            shot.rotation.x = 0 + rot_offset.x;

            shot.stats = {
                damage: 1

            };

            shot.speed.x = Math.cos((shot.rotation.x) * 3.14 / 180) * speed;

            shot.speed.y = Math.sin((shot.rotation.x) * 3.14 / 180) * speed;

            return shot;

        }

        return new Error("game was not in motion: Gamestack.isAtPlay must be true to create a shot.");

    }



    /**
     * create a subsprite of Sprite belonging to the current Sprite
     * @function
     * @memberof Sprite
     * @param {Object} options an object of arguments
     * @param {Animation} animation the animation to fire from the Sprite
     * @param {number} speed the speed of the shot that is projected
     * @param {Vector} position the initial position of the shot: defaults to current Sprite position
     * @param {Vector} size the Vector size of the shot
     * @param {Vector} offset the positional offset to apply
     **********/

    subsprite(options) {

        let animation = options.animation || new Animation();

        let position = options.position || new Vector3(this.position);

        let offset = options.offset || new Vector3(0, 0, 0);

        let size = options.size || this.size;

        if (__gameInstance.isAtPlay) {

            var subsprite = __gameStack.add(new Sprite({

                active: true,

                position: position,

                size: size,

                offset: offset,

                image: animation.image,

                rotation: new Vector3(0, 0, 0),

                flipX: false

            }));

            subsprite.setAnimation(animation);

            return subsprite;

        }
        else
        {
            alert('No subsprite when not at play');

        }

    }


    /**
     * animate Sprite.selected_animation  by one frame
     * @function
     * @memberof Sprite
     * @param {Animation} animation to use, defaults to Sprite.selected_animation
     **********/

    animate(animation) {

        if (__gameInstance.isAtPlay) {

            if (animation) {
                this.setAnimation(animation)
            }

            this.selected_animation.animate();

        }

    }

    /**
     * run a function when the Sprite.selected_animation is complete
     *
     * @function
     * @memberof Sprite
     * @param {Function} fun the function to call when the animation is complete
     *
     **********/

    onAnimationComplete(fun) {
        this.selected_animation.onComplete(fun);

    }

    /*****************************
     *  accelY
     *  -accelerate on Y-Axis with 'accel' and 'max' (speed) arguments
     *  -example-use: gravitation of sprite || up / down movement
     ***************************/

    /**
     * accelerate speed on the Y-Axis
     *
     * @function
     * @memberof Sprite
     * @param {number} accel the increment of acceleration
     * @param {number} max the maximum for speed
     *
     **********/

    accelY(accel, max) {

        accel = Math.abs(accel);

        if (typeof(max) == 'number') {
            max = {y: max};

        }

        this.assertSpeed();

        let diff = max.y - this.speed.y;

        if (diff > 0) {
            this.speed.y += Math.abs(diff) >= accel ? accel : diff;

        }
        ;

        if (diff < 0) {
            this.speed.y -= Math.abs(diff) >= accel ? accel : diff;

        }
        ;

    }


    /*****************************
     *  accelX
     *  -accelerate on X-Axis with 'accel' and 'max' (speed) arguments
     *  -example-use: running of sprite || left / right movement
     ***************************/




    /**
     * accelerate speed on the X-Axis
     *
     * @function
     * @memberof Sprite
     * @param {number} accel the increment of acceleration
     * @param {number} max the maximum for speed
     *
     **********/


    accelX(accel, max) {

        accel = Math.abs(accel);

        if (typeof(max) == 'number') {
            max = {x: max};

        }

        this.assertSpeed();

        let diff = max.x - this.speed.x;

        if (diff > 0) {
            this.speed.x += Math.abs(diff) >= accel ? accel : diff;

        }
        ;

        if (diff < 0) {
            this.speed.x -= Math.abs(diff) >= accel ? accel : diff;

        }
        ;

    }


    /*****************************
     *  accel
     *  -accelerate any acceleration -key
     ***************************/


    /**
     * accelerate toward a max value on any object-property:: intended for self-use
     *
     * @function
     * @memberof Sprite
     * @param {Object} prop The object to control
     * @param {string} key the property-key for targeted property of prop argument
     *
     * @param {number} accel the increment of acceleration
     *
     * @param {number} max the max value to accelerate towards
     *
     *
     **********/

    accel(prop, key, accel, max) {

        accel = Math.abs(accel);

        if (typeof(max) == 'number') {
            max = {x: max};

        }

        let speed = prop[key];

        // this.assertSpeed();

        let diff = max.x - prop[key];

        if (diff > 0) {
            prop[key] += Math.abs(diff) >= accel ? accel : diff;

        }
        ;

        if (diff < 0) {
            prop[key] -= Math.abs(diff) >= accel ? accel : diff;

        }
        ;

    }


    /*****************************
     *  decel
     *  -deceleration -key
     ***************************/

    /**
     * decelerate toward a max value on any object-property:: intended for self-use
     *
     * @function
     * @memberof Sprite
     * @param {Object} prop The object to control
     * @param {string} key the property-key for targeted property of prop argument
     *
     * @param {number} decel the increment of deceleration
     *
     * @param {number} max the max value to decelerate towards
     *
     *
     **********/

    decel(prop, key, rate) {
        if (typeof(rate) == 'object') {

            rate = rate.rate;

        }

        rate = Math.abs(rate);

        if (Math.abs(prop[key]) <= rate) {
            prop[key] = 0;
        }

        else if (prop[key] > 0) {
            prop[key] -= rate;

        }
        else if (prop[key] < 0) {
            prop[key] += rate;

        }
        else {

            prop[key] = 0;

        }
    }




    /*****************************
     *  decelY
     *  -decelerate on the Y axis
     *  -args: 1 float:amt
     ***************************/


    /**
     * decelerate speed on the Y-Axis, toward zero
     *
     * @function
     * @memberof Sprite
     * @param {number} amt the increment of deceleration, negatives ignored
     *
     **********/

    decelY(amt) {

        amt = Math.abs(amt);

        if (Math.abs(this.speed.y) <= amt) {
            this.speed.y = 0;

        }
        else if (this.speed.y > amt) {

            this.speed.y -= amt;
        }
        else if (this.speed.y < amt * -1) {

            this.speed.y += amt;
        }

    }

    /*****************************
     *  decelX
     *  -decelerate on the X axis
     *  -args: 1 float:amt
     ***************************/


    /**
     * decelerate speed on the X-Axis, toward zero
     *
     * @function
     * @memberof Sprite
     * @param {number} amt the increment of deceleration, negatives ignored
     *
     **********/

    decelX(amt) {

        amt = Math.abs(amt);


        if (this.speed.x > amt) {

            this.speed.x -= amt;
        }
        else if (this.speed.x < amt * -1) {

            this.speed.x += amt;
        }

        if (Math.abs(this.speed.x) <= amt) {

            this.speed.x = 0;

        }

    }



    shortest_stop(item, callback) {
        var diff_min_y = item.min ? item.min.y : Math.abs(item.position.y - this.position.y + this.size.y);

        var diff_min_x = item.min ? item.min.x : Math.abs(item.position.x - this.position.x + this.size.x);

        var diff_max_y = item.max ? item.max.y : Math.abs(item.position.y + item.size.y - this.position.y);

        var diff_max_x = item.max ? item.max.x : Math.abs(item.position.x + item.size.x - this.position.y);

        var dimens = {top: diff_min_y, left: diff_min_x, bottom: diff_max_y, right: diff_max_x};

        var minkey = "", min = 10000000;

        for (var x in dimens) {
            if (dimens[x] < min) {
                min = dimens[x];
                minkey = x; // a key of top left bottom or right

            }
        }

        callback(minkey);

    }


    /**
     * get the center of a Sprite
     *
     * @function
     * @memberof Sprite
     *
     * @returns (Vector)
     *
     **********/

    center() {


        return new Vector(this.position.x + this.size.x / 2, this.position.y + this.size.y / 2, 0);

    }

    /*************
     * #BE CAREFUL
     * -with this function :: change sensitive / tricky / 4 way collision
     * *************/


    /**
     * determine if Sprite overlaps on X axis with another Sprite
     *
     * @function
     * @memberof Sprite
     * @param {Sprite} item the Sprite to compare with
     * @param {number} padding the 0-1.0 float value of padding to use on self when testing overlap
     * @returns {var} a true || false var
     *
     **********/

    overlap_x(item, padding) {
        if (!padding) {
            padding = 0;
        }

        var paddingX = Math.round(padding * this.size.x),

            paddingY = Math.round(padding * this.size.y), left = this.position.x + paddingX,
            right = this.position.x + this.size.x - paddingX,

            top = this.position.y + paddingY, bottom = this.position.y + this.size.y - paddingY;

        return right > item.position.x && left < item.position.x + item.size.x;


    }

    /*************
     * #BE CAREFUL
     * -with this function :: change sensitive / tricky / 4 way collision
     * *************/


    /**
     * determine if Sprite overlaps on Y axis with another Sprite
     *
     * @function
     * @memberof Sprite
     * @param {Sprite} item the Sprite to compare with
     * @param {number} padding the 0-1.0 float value of padding to use on self when testing overlap
     * @returns (true || false}
     *
     **********/

    overlap_y(item, padding) {
        if (!padding) {
            padding = 0;
        }

        var paddingX = Math.round(padding * this.size.x),

            paddingY = Math.round(padding * this.size.y), left = this.position.x + paddingX,
            right = this.position.x + this.size.x - paddingX,

            top = this.position.y + paddingY, bottom = this.position.y + this.size.y - paddingY;

        return bottom > item.position.y && top < item.position.y + item.size.y;

    }

    /*************
     * #BE CAREFUL
     * -with this function :: change sensitive / tricky / 4 way collision
     * *************/



    collide_stop_x(item)
    {

        var apart = false;

            var ct = 10000;

            while (!apart && ct > 0) {

                ct--;

                var diffX = this.center().sub(item.center()).x;

                var distX = Math.abs(this.size.x / 2 + item.size.x / 2 - Math.round(this.size.x * this.padding.x));

                if (Math.abs(diffX) < distX) {

                    this.position.x -= diffX > 0 ? -1 : 1;



                }
                else
                {

                    apart = true;



                }


        }


    }

    /*************
     * #BE CAREFUL
     * -with this function :: change sensitive / tricky / 4 way collision
     * *************/


    /**
     * cause a fourway collision-stop between this and another Sprite :: objects will behave clastically and resist passing through one another
     *
     * @function
     * @memberof Sprite
     * @param {Sprite} item the Sprite to compare with
     *
     **********/

    collide_stop(item) {

        if(this.id == item.id)
        {
            return false;

        }

       // this.position = this.position.sub(this.speed);

        if(this.collidesRectangular(item)) {

            var diff = this.center().sub(item.center());

            if(this.overlap_x(item, this.padding.x + 0.1) && Math.abs(diff.x) < Math.abs(diff.y))
           {

               var apart = false;

                   var ct = 10000;

                   while (!apart && ct > 0) {

                       ct--;

                       var diffY = this.center().sub(item.center()).y;

                       var distY = Math.abs(this.size.y / 2 + item.size.y / 2- Math.round(this.size.y * this.padding.y));

                       if (Math.abs(diffY) < distY) {

                           this.position.y -= diffY > 0 ? -1 : diffY < 0 ? 1 : 0;

                           this.position.y = Math.round(this.position.y);

                       }

                     else {

                           if (diffY <= 0){
                               this.__inAir = false;
                           };


                          return apart = true;


                       }


               }



           }


            if(this.overlap_y(item, this.padding.y ) && Math.abs(diff.y) < Math.abs(diff.x)) {

                this.collide_stop_x(item);

            }


        }


    }



    collide_stop_top(item)
    {


        if(this.id == item.id)
        {
            return false;

        }


            if(this.overlap_x(item, this.padding.x + 0.1))
            {

                console.log('OVERLAP_X');

                var paddingY = this.padding.y * this.size.y;

                if(this.position.y + this.size.y - paddingY <= item.position.y)
                {

                    this.groundMaxY = item.position.y - this.size.y + paddingY;

                }

            }

    }



    /**
     * Restore a sprite from saved .json data
     *
     * @function
     * @memberof Sprite
     *
     * @returns (Sprite)
     **********/

    restoreFrom(data) {
        data.image = new GameImage(data.src || data.image.src);

        return new Sprite(data);

    }


    /*****************************
     *  fromFile(file_path)
     *  -TODO : complete this function based on code to load Sprite() from file, located in the spritemaker.html file
     *  -TODO: test this function
     ***************************/

    fromFile(file_path) {

        if (typeof file_path == 'string') {

            var __inst = this;

            $.getJSON(file_path, function (data) {

                __inst = new Sprite(data);

            });

        }


    }

}
;

/****************
 * TODO : Complete SpritePresetsOptions::
 *  Use these as options for Sprite Control, etc...
 ****************/

Gamestack.Sprite = Sprite;

let SpriteInitializersOptions = {

    Clastics:{

        top_collideable:function(sprite)
        {

            for(var x in Gamestack.__gameWindow.forces)
            {
                var force = Gamestack.__gameWindow.forces[x];

                force.topClastics.push(sprite);

            }


            sprite.onUpdate(function(){


            });

        },

        fourside_collideable:function(sprite)
        {

            for(var x in Gamestack.__gameWindow.forces)
            {
                var force = Gamestack.__gameWindow.forces[x];

                force.clasticObjects.push(sprite);

            }

            sprite.onUpdate(function(){


            });


        }
    },

    MainGravity:{

        very_light:function(sprite)
        {
            //Add a gravity to the game

            var gravity = Gamestack.add(new Force({
                name:"very_light_grav",
                accel:0.05,
                max:new Vector3(0, 3.5, 0),
                subjects:[sprite], //sprite is the subject of this Force, sprite is pulled by this force
                clasticObjects:[] //an empty array of collideable objects

            }));

            sprite.onUpdate(function(){


            });

        },

        light:function(sprite)
        {

            var gravity = Gamestack.add(new Force({
                name:"light_grav",
                accel:0.1,
                max:new Vector3(0, 4.5, 0),
                subjects:[sprite], //sprite is the subject of this Force, sprite is pulled by this force
                clasticObjects:[] //an empty array of collideable objects

            }));


            sprite.onUpdate(function(){


            });

        },

        medium:function(sprite)
        {

            var gravity = Gamestack.add(new Force({
                name:"medium_grav",
                accel:0.2,
                max:new Vector3(0, 7.5, 0),
                subjects:[sprite], //sprite is the subject of this Force, sprite is pulled by this force
                clasticObjects:[] //an empty array of collideable objects

            }));


            sprite.onUpdate(function(){


            });

        },


        strong:function(sprite)
        {

            var gravity = Gamestack.add(new Force({
                name:"strong_grav",
                accel:0.4,
                max:new Vector3(0, 10.5, 0),
                subjects:[sprite], //sprite is the subject of this Force, sprite is pulled by this force
                clasticObjects:[] //an empty array of collideable objects

            }));

            sprite.onUpdate(function(){


            });

        },

        very_strong:function(sprite)
        {

            var gravity = Gamestack.add(new Force({
                name:"strong_grav",
                accel:0.5,
                max:new Vector3(0, 12.5, 0),
                subjects:[sprite], //sprite is the subject of this Force, sprite is pulled by this force
                clasticObjects:[] //an empty array of collideable objects

            }));

            sprite.onUpdate(function(){


            });

        },

    },


    ControllerStickMotion: {

        player_move_x: function (sprite) {

            alert('applying initializer');

            console.log('side_scroll_player_run:init-ing');

            let __lib = Gamestack || Quick2d;

            Gamestack.GamepadAdapter.on('stick_left', 0, function (x, y) {

                console.log('stick-x:' + x);

                if (Math.abs(x) < 0.2) {
                    return 0;
                }

                var accel = 0.2; //todo : options for accel
                var max = 7;

                sprite.accelX(accel, x * max);

                if (x < -0.2) {
                    sprite.flipX = true;

                }
                else if (x > 0.2) {
                    sprite.flipX = false;

                }

            });

            sprite.onUpdate(function (spr) {

                spr.decelX(0.1);

                if (!spr.__falling) {
                    spr.decelY(0.2)
                }
                ;

            });


        },

        player_move_xy: function (sprite) {

            alert('applying initializer');

            console.log('side_scroll_player_run:init-ing');

            let __lib = Gamestack || Quick2d;

            Gamestack.GamepadAdapter.on('stick_left', 0, function (x, y) {

                console.log('stick-x:' + x);

                if (Math.abs(x) < 0.2) {
                    x = 0;
                }

                if (Math.abs(y) < 0.2) {
                    y = 0;
                }

                var accel = 0.2; //todo : options for accel
                var max = 7;

                sprite.accelX(accel, x * max);

                sprite.accelY(accel, y * max);

                if (x < -0.2) {
                    sprite.flipX = true;

                }
                else if (x > 0.2) {
                    sprite.flipX = false;

                }

            });

            sprite.onUpdate(function (spr) {

                sprite.decel(sprite.speed, 'x', 0.1);

                sprite.decel(sprite.speed, 'y', 0.1);

            });


        },

        player_rotate_x: function (sprite) {

            let __lib = Gamestack || Quick2d;

            Gamestack.GamepadAdapter.on('stick_left', 0, function (x, y) {

                console.log('stick-x:' + x);

                if (Math.abs(x) < 0.2) {
                    return 0;
                }

                var accel = 0.25; //todo : options for accel
                var max = 7;

                sprite.accel(sprite.rot_speed, 'x', accel, x * max);

                if (x < -0.2) {
                    sprite.flipX = true;

                }
                else if (x > 0.2) {
                    sprite.flipX = false;

                }

            });

            sprite.onUpdate(function (spr) {

                sprite.decel(sprite.rot_speed, 'x', 0.1);

                if (!spr.__falling) {
                    spr.decelY(0.2)
                }
                ;

            });


        }


    }

};


Gamestack.options = Gamestack.options || {};

Gamestack.options.SpriteInitializers = SpriteInitializersOptions;