class Sprite {
    constructor(name, description, args) {

        this.active = true; //active sprites are visible

        if (typeof name == 'object') //accept first argument as full args object
        {
            args = name;

            this.name = args.name || "__";

            this.description = args.description || "__";

        }
        else {

            this.name = name || "__";

            this.description = description || "__";

        }

        this.__initializers = $Q.getArg(args, '__initializers', []);

        var _spr = this;

        Quazar.each(args, function (ix, item) { //apply all args

            if (ix !== 'parent') {
                _spr[ix] = item;
            }

        });

        this.type = $Q.getArg(args, 'type', 'basic');

        this.animations = $Q.getArg(args, 'animations', []);

        this.motions = $Q.getArg(args, 'motions', []);

        let __inst = this;

        this.id = $Q.getArg(args, 'id', this.create_id());

        this.sounds = $Q.getArg(args, 'sounds', []);

        this.image = $Q.getArg(args, 'image', new GameImage($Q.getArg(args, 'src', false)));

        this.size = $Q.getArg(args, 'size', new Vector3(100, 100));

        this.position = $Q.getArg(args, 'position', new Vector3(0, 0, 0));

        this.collision_bounds = $Q.getArg(args, 'collision_bounds', new VectorBounds(new Vector3(0, 0, 0), new Vector3(0, 0, 0)));

        this.rotation = $Q.getArg(args, 'rotation', new Vector3(0, 0, 0));

        this.selected_animation = {};

        this.speed = $Q.getArg(args, 'speed', new Vector3(0, 0, 0));

        this.acceleration = $Q.getArg(args, 'acceleration', new Vector3(0, 0, 0));

        this.rot_speed = $Q.getArg(args, 'rot_speed', new Vector3(0, 0, 0));

        this.rot_accel = $Q.getArg(args, 'rot_accel', new Vector3(0, 0, 0));

        //Apply / instantiate Sound(), Motion(), and Animation() args...

        $.each(this.sounds, function (ix, item) {

            __inst.sounds[ix] = new Sound(item);

        });

        $.each(this.motions, function (ix, item) {

            __inst.motions[ix] = new Motion(item);

        });


        $.each(this.animations, function (ix, item) {

            __inst.animations[ix] = new Animation(item);

        });


        //Apply initializers:

        $.each(this.__initializers, function(ix, item){

            __inst.onInit(item);

        });

        this.selected_animation = this.animations[0] || new Animation();

    }


    init() {


    }

    onInit(fun) {

        if (typeof fun == 'string') {

           if(this.__initializers.indexOf(fun) < 0){ this.__initializers.push(fun) };

            var __inst = this;

            var keys = fun.split('.');

            console.log('finding init from string:' + fun);

            if(!keys.length >= 2)
            {
                return console.error('need min 2 string keys separated by "."');
            }

            var f = Quazar.options.SpriteInitializers[keys[0]][keys[1]];

            if(typeof(f) == 'function')
            {
                alert('found func');


                __inst.init =   __inst.extendFunc(f, __inst.init);

            }


        }

        else if (typeof fun == 'function') {

            console.log('extending init:');

            __inst.extendFunc(initializer, this.init);


        }

        else if (typeof fun == 'object') {

            console.log('extending init:');

           console.info('Quick2D does not yet implement onInit() from arg of object type');

        }

    }

    /*****************************
     * Getters
     ***************************/


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

    create_id() {

        return Quick2d.create_id();

    }

    setSize(size) {
        this.size = new Vector3(size.x, size.y, size.z);

        this.selected_animation.size = new Vector3(size.x, size.y, size.z);

    }

    setPos(pos) {
        this.position = new Vector3(pos.x, pos.y, pos.z || 0);

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

    setAnimation(anime) {

        if(anime instanceof Animation && this.animations.indexOf(anime) < 0)
        {
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

    onScreen(w, h) {
        return this.position.x + this.size.x >= 0 && this.position.x < w
            && this.position.y + this.size.y >= 0 && this.position.y < h;

    }

    /*****************************
     * Updates
     ***************************/

    /*****************************
     * update()
     * -starts empty:: is used by Quick2d.js as the main sprite update
     ***************************/

    update(sprite) {
    }

    /*****************************
     * def_update()
     * -applies speed and other default factors of movement::
     * -is used by Quick2d.js as the system def_update (default update)
     ***************************/

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

    resolveFunctionFromDoubleKeys(keyString1, keyString2, obj, callback) {

        callback(typeof obj[keyString1][keyString2] == 'function' ? obj[keyString1][keyString2] : {});

    }


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

    collidesRectangular(sprite) {

        return Quazar.Collision.spriteRectanglesCollide(sprite);

    }

    /*****************************
     *  collidesByPixels(sprite)
     *  -TODO : this function is incomplete
     *  -process collision according to the non-transparent pixels of the sprite::
     *  -provides a more realistic collision than basic rectangular
     ***************************/

    collidesByPixels(sprite) {

        return console.info("TODO: Sprite().collidesByPixels(sprite): finish this function");

    }

    /*****************************
     *  shoot(sprite)
     *  -fire a shot from the sprite:: as in a firing gun or spaceship
     *  -takes options{} for number of shots, anglePerShot, etc...
     *  -TODO: complete and test this code
     ***************************/

    shoot(options) {
        //character shoots an animation

        this.prep_key = 'shoot';

        let spread = options.spread || options.angleSpread || false;

        let total = options.total || options.totalBullets || options.numberBullets || false;

        let animation = options.bullet || options.animation || false;

        let duration = options.duration || options.screenDuration || false;

        let speed = options.speed || false;

        if (__gameInstance.isAtPlay) {


        }
        else {

            this.event_arg(this.prep_key, '_', options);

        }

        return this;

    }

    /*****************************
     *  animate(animation)
     *  -simply animate, set the animation to the arg 'animation'
     ***************************/

    animate(animation) {

        alert('calling animation');

        if (__gameInstance.isAtPlay) {

            if (animation) {
                this.setAnimation(animation)
            }
            ;

            this.selected_animation.animate();

            return this;

        }

    }

    /*****************************
     *  accelY
     *  -accelerate on Y-Axis with 'accel' and 'max' (speed) arguments
     *  -example-use: gravitation of sprite || up / down movement
     ***************************/

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

    decel(prop, key, rate) {
        if (typeof(rate) == 'object') {

            rate = rate.rate;

        }

        rate = Math.abs(rate);

        if(Math.abs(prop[key]) <= rate)
        {
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

            if(Math.abs(this.speed['x']) <= rate)
            {
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

    collide_stop(item) {

        var max_y = item.max ? item.max.y : item.position.y;

        if (this.position.y + this.size.y >= max_y) {

            this.position.y = max_y - this.size.y;

            this.__falling = false;

        }

    }

    /*****************************
     *  fromFile(file_path)
     *  -TODO : complete this function based on code to load Sprite() from file, located in the spritemaker.html file
     *  -TODO: test this function
     ***************************/

    fromFile(file_path) {
        var __inst = this;

        $.getJSON(file_path, function (data) {

            __inst = new Sprite(data);

        });

    }

};

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

                if(Math.abs(x) < 0.2)
                {
                    return 0;
                }

                var  accel =  0.2; //todo : options for accel
                var  max =  7;

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

                if(Math.abs(x) < 0.2)
                {
                    x = 0;
                }

                if(Math.abs(y) < 0.2)
                {
                    y = 0;
                }

                var  accel =  0.2; //todo : options for accel
                var  max =  7;

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

            alert('applying initializer');


            let __lib = Quazar || Quick2d;

            Quazar.GamepadAdapter.on('stick_left', 0, function (x, y) {

                console.log('stick-x:' + x);

                if(Math.abs(x) < 0.2)
                {
                    return 0;
                }

                var  accel =  0.25; //todo : options for accel
                var  max =  7;

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

Quazar.options = Quazar.options || {};

Quazar.options.SpriteInitializers = SpriteInitializersOptions;