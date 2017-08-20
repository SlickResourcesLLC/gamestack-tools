/**
 * Sprite({name:string, description:string, size:Vector3, position:Vector3})
 *
 * <ul >
 *  <li> an Object-container for multiple animations
 *  <li> supports a variety of game objects and logic
 * </ul>
 *
 * [See Live Demos with Suggested Usage-Examples]{@link http://www.google.com}
 * @returns {Sprite} object of Sprite()
 * */

class Sprite {
    constructor(args) {

        if (!args) {
            args = {};
        }

        this.active = true; //active sprites are visible

        this.name = args.name || "__";

        this.description = args.description || "__";

        this.__initializers = __gameStack.getArg(args, '__initializers', []);

        var _spr = this;

        Quazar.each(args, function (ix, item) { //apply all args

            if (ix !== 'parent') {
                _spr[ix] = item;
            }

        });

        this.type = __gameStack.getArg(args, 'type', 'basic');

        this.animations = __gameStack.getArg(args, 'animations', []);

        this.motions = __gameStack.getArg(args, 'motions', []);

        let __inst = this;

        this.id = __gameStack.getArg(args, 'id', this.create_id());

        this.sounds = __gameStack.getArg(args, 'sounds', []);

        this.image = new GameImage(__gameStack.getArg(args, 'src', __gameStack.getArg(args, 'image', false)));

        this.size = __gameStack.getArg(args, 'size', new Vector3(100, 100));

        this.position = __gameStack.getArg(args, 'position', new Vector3(0, 0, 0));

        this.collision_bounds = __gameStack.getArg(args, 'collision_bounds', new VectorBounds(new Vector3(0, 0, 0), new Vector3(0, 0, 0)));

        this.rotation = __gameStack.getArg(args, 'rotation', new Vector3(0, 0, 0));

        this.selected_animation = {};

        this.speed = __gameStack.getArg(args, 'speed', new Vector3(0, 0, 0));

        this.acceleration = __gameStack.getArg(args, 'acceleration', new Vector3(0, 0, 0));

        this.rot_speed = __gameStack.getArg(args, 'rot_speed', new Vector3(0, 0, 0));

        this.rot_accel = __gameStack.getArg(args, 'rot_accel', new Vector3(0, 0, 0));

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
     * This function initializes sprites when necessary. Called automatically on GameStack.add(mySprite);
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
     * This function gets the 'id' of the object()
     * <ul>
     *     <li>See usage links</li>
     * </ul>
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
     * This function creates the 'id' of the Sprite()
     * <ul>
     *     <li>Called automatically on constructor()</li>
     * </ul>
     * @function
     * @memberof Sprite
     * @returns {string}
     **********/

    create_id() {

        return Quick2d.create_id();

    }


    /**
     * This function sets the size of the Sprite()
     * <ul>
     *     <li></li>
     * </ul>
     * @function
     * @memberof Sprite
     **********/

    setSize(size) {
        this.size = new Vector3(size.x, size.y, size.z);

        this.selected_animation.size = new Vector3(size.x, size.y, size.z);

    }

    setPos(pos) {
        this.position = new Vector3(pos.x, pos.y, pos.z || 0);

    }
    minDimensionsXY(mx, my)
    {

        var wth = this.size.x / this.size.y;

        var htw = this.size.y / this.size.x;

        if(this.size.x > mx)
        {
            this.size.x = mx;

            this.size.y = this.size.x * wth;

        }

        if(this.size.y > my)
        {
            this.size.y = my;

            this.size.x = this.size.y * htw;

        }


    }

    getAbsolutePosition(offset) {

        if (this.position instanceof Vector3) {

        }
        else {
            this.position = new Vector3(this.position);
        }

        return this.position.add(offset);

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
     * This function sets the 'selected_animation' property of the Sprite()
     * <ul>
     *     <li></li>
     * </ul>
     * @function
     * @memberof Sprite
     * @params {Animation}
     **********/

    setAnimation(anime) {

        if (anime instanceof Animation && this.animations.indexOf(anime) < 0) {
            this.animations.push(anime);
        }

        this.selected_animation = anime;

        Quazar.log('declared default animation');

        return this;

    }

    /*****************************
     *  defaultAnimation(anime)
     *  -set the default_animation of this sprite
     *  -TODO : determine whether to implement a default animatio OR simply use setAnimation() plus selected_animation
     ***************************/

    defaultAnimation(anime) {

        this.animations['default'] = anime;

        Quazar.log('declared default animation');

        return this;

    }

    /*****************************
     * onScreen :
     * -returns boolean
     * -takes and requires w, h of screen
     * -detects if object is on the screen
     ***************************/

    /**
     * This function detects whether the Sprite() is onScreen, according to its size and position on the GameStack.canvas
     * <ul>
     *     <li></li>
     * </ul>
     * @function
     * @memberof Sprite
     **********/


    onScreen(w, h) {

        w = w || __gameStack.WIDTH;

        h = h || __gameStack.HEIGHT;

        var camera = __gameStack.__gameWindow.camera || new Vector3(0, 0, 0);

        var p = new Vector3(this.position.x - camera.position.x, this.position.y - camera.position.y, this.position.z - camera.position.z);

        return p.x - this.size.x >= -10000 && p.x < 10000
            && p.y + this.size.y >= -1000 && p.y < 10000;

    }

    /*****************************
     * Updates
     ***************************/

    /*****************************
     * update()
     * -starts empty:: is used by Quick2d.js as the main sprite update
     ***************************/

    /**
     * This function is the recursive update() for the Sprite()
     *
     * <ul>
     *     <li>*Called automatically by the GameStack library</li>
     * </ul>
     * @function
     * @memberof Sprite
     * @params {sprite}
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
     *
     * <ul>
     *     <li>Normally no need to use this. It is called automatically by the GameStack init()</li>
     *     <li>*Allows properties of Sprite().speed, Sprite().rot_speed, and Sprite().accel, Sprite().rot_accel to control speed and acceleration.</li>
     * </ul>
     * @function
     * @memberof Sprite
     * @params {sprite}
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

            if (this.rot_speed[x] > 0 || this.rot_speed[x] < 0) {

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
     * This function is for persistence of data and behavior for the Sprite()
     *
     * <ul>
     *     <li>a function may be resolved from keyString args from within the obj arg.</li>
     *     <li>Callback is then triggered on this function</li>
     *     <li>Used by GameStack to restore the behavioral options of Sprites from GameStack.options.SpriteInitializers</li>
     * </ul>
     * @function
     * @memberof Sprite
     * @params {keyString1, keyString2, obj, callback}
     **********/

    resolveFunctionFromDoubleKeys(keyString1, keyString2, obj, callback) {

        callback(typeof obj[keyString1][keyString2] == 'function' ? obj[keyString1][keyString2] : {});

    }

    /**
     * This function will extend 2nd function arg with 1st function arg, and return the combined function()
     *
     * <ul>
     *     <li>Applied in GameStack for extending functions when onInit(fun) is called</li>
     * </ul>
     * @function
     * @memberof Sprite
     * @params {fun, extendedFunc}
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
     * This function will extend the update of a Sprite()
     *
     * <ul>
     *     <li>Use this function to apply multiple update-calls for an object</li>
     * </ul>
     * @function
     * @memberof Sprite
     * @params {fun}
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


    /*****************************
     *  collidesRectangular(sprite)
     * -args: 1 sprite object
     * -returns boolean of true on collision or false on no-collision
     * -TODO : add options object with highlight=true||false,
     * -TODO:allow stateffects, graphiceffects into the collision function
     ***************************/

    /**
     * Get the boolean(T || F) results of a Collision between two Sprites(), based on their position Vector3's and Size()
     * <ul>
     *     <li>A rectangular style position</li>
     *      <li>Takes another sprite as argument</li>
     *       <li>Returns basic true || false during runtime</li>
     * </ul>
     * @function
     * @memberof Sprite
     * @params {sprite}
     **********/

    collidesRectangular(sprite, padding) {

        return Quazar.Collision.spriteRectanglesCollide(this, sprite, padding);

    }

    /*****************************
     *  collidesByPixels(sprite)
     *  -TODO : this function is incomplete
     *  -process collision according to the non-transparent pixels of the sprite::
     *  -provides a more realistic collision than basic rectangular
     ***************************/

    /**
     * Get the boolean(T || F) results of a Collision between two Sprites(), based on non-transparent pixels
     * <ul>
     *     <li>Detects collision or overlap of any non-transparent pixels</li>
     *     <li>*TODO: This function is not-yet implemented in GameStack</li>
     * </ul>
     * @function
     * @memberof Sprite
     * @params {sprite}
     **********/

    collidesByPixels(sprite) {

        return console.info("TODO: Sprite().collidesByPixels(sprite): finish this function");

    }

    /*****************************
     *  shoot(sprite)
     *  -fire a shot from the sprite:: as in a firing gun or spaceship
     *  -takes options{} for number of shots anglePerShot etc...
     *  -TODO: complete and test this code
     ***************************/

    /**
     * Sprites() fires a projectile object
     * <ul>
     *     <li>Easy instantiator for bullets and propelled objects in GameStack</li>
     *     <li>*TODO: This function is not-yet implemented in GameStack</li>
     * </ul>
     * @function
     * @memberof Sprite
     * @params {options} *numerous args
     **********/


    shoot(options) {
        //character shoots an animation

        this.prep_key = 'shoot';

        let animation = options.bullet || options.animation || new Animation();

        let speed = options.speed || 1;

        let position = options.position || new Vector3(0, 0, 0);

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


        }

    }


    /**
     * Creates a subsprite
     * <ul>
     *     <li>Use this function to anchor one sprite to another.</li>
     * </ul>
     * @function
     * @memberof Sprite
     * @params {options} object
     * @params {options.animation} Animation()
     * @params {options.position} Position()
     * @params {options.offset} Position()
     * @params {options.size} Size()
     **********/

    subsprite(options) {

        let animation = options.animation || new Animation();

        let position = options.position || this.position;

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

            var __parent = this;

            return subsprite;

        }

    }

    /**
     * Simple call to animate the sprite
     * <ul>
     *     <li>Calls animate on the Sprite.selected_animation</li>
     *     <li>*TODO: This function is not-yet implemented in GameStack</li>
     * </ul>
     * @function
     * @memberof Sprite
     * @params {animation}
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
     * Overwrites the complete() function of the selected animation
     * <ul>
     *     <li>Use this function when a change must be made, but not until the current animation is complete</li>
     * </ul>
     * @function
     * @memberof Sprite
     * @params {fun} function
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
     * This function accelerates the Sprite() on the y-axis

     * @function
     * @memberof Sprite
     * @params {accel, max}
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
     * This function accelerates the Sprite() on the y-axis

     * @function
     * @memberof Sprite
     * @params {accel, max}
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
     * This function accelerates the Sprite() on any or all axis, depending on arguments

     * @function
     * @memberof Sprite
     * @params {prop, key, accel, max}
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
     * This function decelerates the Sprite() on any or all axis, depending on arguments

     * @function
     * @memberof Sprite
     * @params {prop, key, accel, max}
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
     *  decelX
     *  -decelerate on the X axis
     *  -args: 1 float:amt
     ***************************/

    deccelX(rate) {
        if (typeof(rate) == 'object') {

            rate = rate.rate;

        }

        rate = Math.abs(rate);

        if (Math.abs(this.speed['x']) <= rate) {
            this.speed['x'] = 0;

        }

        if (this.speed['x'] > 0) {
            this.speed['x'] -= rate;

        }
        else if (this.speed['x'] < 0) {
            this.speed['x'] += rate;

        }
        else {

            this.speed['x'] = 0;

        }

    }


    /*****************************
     *  decelY
     *  -decelerate on the Y axis
     *  -args: 1 float:amt
     ***************************/

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

    /*****************************
     *  collide_stop(item)
     *  -both collide and stop on the object, when falling on Y axis::
     *  -sets the special property: __falling to false on stop :: helps to control Sprite() state
     *  -TODO : rename to fallstop || something that resembles a function strictly on Y-Axis
     ***************************/

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

    center() {
        return new Vector3(this.position.x + this.size.x / 2, this.position.y + this.size.y / 2);

    }

    /*************
     * #BE CAREFUL
     * -with this function :: change sensitive / tricky / 4 way collision
     * *************/

    overlap_x(item, padding) {
        if (!padding) {
            padding = 0;
        }

        var paddingX = padding * this.size.x,

            paddingY = padding * this.size.y, left = this.position.x + paddingX,
            right = this.position.x + this.size.x - paddingX,

            top = this.position.y + paddingY, bottom = this.position.y + this.size.y - paddingY;

        return right > item.position.x && left < item.position.x + item.size.x;


    }

    /*************
     * #BE CAREFUL
     * -with this function :: change sensitive / tricky / 4 way collision
     * *************/

    overlap_y(item, padding) {
        if (!padding) {
            padding = 0;
        }

        var paddingX = padding * this.size.x,

            paddingY = padding * this.size.y, left = this.position.x + paddingX,
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

                var distX = Math.abs(this.size.x / 2 + item.size.x / 2);

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

    collide_stop(item) {

        // collide top



        if(this.id == item.id)
        {
            return false;

        }

        if(this.collidesRectangular(item)) {

            var diff = this.center().sub(item.center());

           if(this.overlap_x(item, 0.3) && Math.abs(diff.x) < Math.abs(diff.y))
           {

                   var apart = false;

                   var ct = 10000;

                   while (!apart && ct > 0) {

                       ct--;

                       var diffY = this.center().sub(item.center()).y;

                       var distY = Math.abs(this.size.y / 2 + item.size.y / 2);

                       if (Math.abs(diffY) < distY) {

                           this.position.y -= diffY > 0 ? -1 : 1;



                       }

                     else {

                           if (diffY < 0){
                               this.__inAir = false;
                           };


                           apart = true;


                       }


               }



           }
          if(this.overlap_y(item, 0.3)) {

               this.collide_stop_x(item);

           }

        }


    }


    restoreFrom(data) {
        data.image = new GameImage(data.src || data.image.src);

        return new Sprite(data);

    }


    /*****************************
     *  fromFile(file_path)
     *  -TODO : complete this function based on code to load Sprite() from file, located in the spritemaker.html file
     *  -TODO: test this function
     ***************************/


    /**
     * This function restores a Sprite() from json file

     * @function
     * @memberof Sprite
     * @params {file_path}
     **********/


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


let SpriteInitializersOptions = {

    ControllerStickMotion: {

        __args: {},

        player_move_x: function (sprite) {

            alert('applying initializer');

            console.log('side_scroll_player_run:init-ing');

            let __lib = Quazar || Quick2d;

            Quazar.GamepadAdapter.on('stick_left', 0, function (x, y) {

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

            let __lib = Quazar || Quick2d;

            Quazar.GamepadAdapter.on('stick_left', 0, function (x, y) {

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

            let __lib = Quazar || Quick2d;

            Quazar.GamepadAdapter.on('stick_left', 0, function (x, y) {

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

GameStack.options = GameStack.options || {};

GameStack.options.SpriteInitializers = SpriteInitializersOptions;