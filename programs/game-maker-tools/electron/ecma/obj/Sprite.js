let __gameInstance = __gameInstance || {};


class Stats {

    constructor(args) {

        var s = this.create_stats;

        for(var x in s)
        {
            this[x] = s[x];

        }

        if(typeof(args) == 'object') {

            for (var x in args) {
                this[x] = args[x];
            }

        }

    }

}


class Sprite {
    constructor(name, description, args) {

        this.name = name || "__";

        this.description = description || "__";

        this.active = true;

        if(typeof(name) == 'object')
        {
            args = name;
        }

        var _spr = this;

        Quazar.each(args, function (ix, item) {

            if (ix !== 'parent') {
                _spr[ix] = item;
            }


        });

        this.type = $Q.getArg(args, 'type', 'basic');

        this.animations = $Q.getArg(args, 'animations', []);

        this.motions = $Q.getArg(args, 'motions', []);

        let __inst = this;

        this.object_id =$Q.getArg(args, 'object_id', '__blank');

        this.sounds = $Q.getArg(args, 'sounds', []);

        this.image = $Q.getArg(args, 'image', new GameImage($Q.getArg(args, 'src', false)));

        this.size = $Q.getArg(args, 'size', new Vector2(100, 100));

        this.position = $Q.getArg(args, 'position', new Vector3(0, 0, 0));



        this.collision_bounds = $Q.getArg(args, 'collision_bounds', new VectorBounds(new Vector3(0, 0, 0), new Vector3(0, 0, 0)));

        this.rotation = $Q.getArg(args, 'rotation', new Vector3(0, 0, 0));

        this.selected_animation = {};

        this.selected_motionstack = {};

        this.selected_physics = {};

        this.onGround = false;

        this.clasticTo = []; //an array of sprite types


        this.damagedBy = []; //an array of animation types


        this.speed =  $Q.getArg(args, 'speed', new Vector3(0, 0, 0)); //store constant speed value

        this.accel =  $Q.getArg(args, 'accel', new Vector3(0, 0, 0)); //store constant accel value


        this.rot_speed =  $Q.getArg(args, 'rot_speed', new Vector3(0, 0, 0));

        this.rot_accel =  $Q.getArg(args, 'rot_accel', new Vector3(0, 0, 0));

        this.actionlists =  $Q.getArg(args, 'actionlists', []);

        this.stats = $Q.getArg(args, 'stats', new Stats());

        this.id = this.setid();

        $.each(this.sounds, function(ix, item){

            __inst.sounds[ix] = new Sound(item);

        });


        $.each(this.motions, function(ix, item){

            __inst.motions[ix] = new Motion(item);

        });


        $.each(this.animations, function(ix, item){

            __inst.animations[ix] = new Animation(item);

        });

    }

    setid()
     {
         return new Date().getUTCMilliseconds();

     }

     get_id()
     {

         return this.id;
     }

    onScreen(w, h) {
        return this.position.x + this.size.x >= 0 && this.position.x < w
            && this.position.y + this.size.y >= 0 && this.position.y < h;

    }

    type_options()
    {

        return[

            'player',
            'enemy',
            'powerup',
            'attachment',
            'projectile'

        ]

    }

    update() {}

    def_update() {

        for(var x in this.speed)
        {

            if(this.speed[x] > 0 || this.speed[x] < 0)
            {

                this.position[x] += this.speed[x];

            }

        }

        for(var x in this.accel)
        {

            if(this.accel[x] > 0 || this.accel[x] < 0)
            {

                this.speed[x] += this.accel[x];

            }

        }

        for(var x in this.rot_speed)
        {

            if(this.rot_speed[x] > 0 || this.rot_speed[x] < 0)
            {

                this.rotation[x] += this.rot_speed[x];

            }


        }

        for(var x in this.rot_accel)
        {


            if(this.rot_accel[x] > 0 || this.rot_accel[x] < 0)
            {

                this.rot_speed[x] += this.rot_accel[x];

            }
        }
    }

    collidesRectangular(sprite)
    {

        return Quazar.Collision.spriteRectanglesCollide(sprite);

    }

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

    allow(options)
    {
        this.prep_key = 'animate';


        this.event_arg(this.prep_key, '_', options);


    }

    animate(animation) {

        alert('calling animation');



        if (__gameInstance.isAtPlay) {

            this.setAnimation(animation);

            return this;

        }
        else {
            var evt = __gameInstance.event_args_list[__gameInstance.event_args_list.length - 1];

            evt.animation = animation;

            return this;

        }

        return this;

    }

    velocityY(accel, max) {

        this.assertSpeed();

        if(this.speed.y < max.y)
        {
            this.speed.y += accel;

        }

        this.position.y += this.speed.y;



    }

    collide(item)
    {

        var max_y = item.max ? item.max.y : item.position.y;

        if(this.position.y + this.size.y >= max_y)
        {

            this.position.y = max_y - this.size.y;

        }

    }



    assertSpeed() {
        if (!this.speed) {

            this.speed = new Vector3(0, 0, 0);

        }

    }

    swing()
    {


    }


    accel(options) {

        this.prep_key = 'accel';

        //targeting position

        if (__gameInstance.isAtPlay) {

            this.assertSpeed();

            if(options.hasOwnProperty('switch') && this[options.switch] !== true)
            {
                return false;

            }
            else
            {

              //  this[options.switch] = false;

            }

            if(options.extras && options.speed !== 0)
            {

                for(var x in options.extras)
                {
                    this[x] = options.extras[x];

                }
            }

            if(this.speed[options.key] < options.speed)
            {

                this.speed[options.key] += options.accel;

            }
            else if(this.speed[options.key] > options.speed)
            {

                this.speed[options.key] -= options.accel;

            }
            else if(options.speed == 0)
            {
                this.speed[options.key] = 0;

            }


        }
        else {


            this.event_arg(this.prep_key, '_', options);

        }

        return this;

    }

    deccelX(rate) {
        if (typeof(rate) == 'object') {

            rate = rate.rate;

        }

        if (this.speed['x'] > rate) {
            this.speed['x'] -= rate;

        }
        else if (this.speed['x'] < rate) {
            this.speed['x'] += rate;

        }
        else
        {

            this.speed['x'] = 0;

        }




    }



    setAnimation(anime) {

        this.animations['default'] = anime;

        this.selected_animation = anime;

        Quazar.log('declared default animation');

        return this;

    }

    defaultAnimation(anime) {

        this.animations['default'] = anime;

        Quazar.log('declared default animation');

        return this;

    }


    fromFile(file_path)
    {
        var __inst = this;

        $.getJSON(file_path, function(data){

            __inst = new Sprite(data);

        });

    }

}



let GameObjects = {

  init:function(){

      let BlockTile = new Sprite();




      this.sprites = [];


  }



};



