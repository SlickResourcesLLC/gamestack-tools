"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __gameInstance = __gameInstance || {};

var Sprite = function () {
        function Sprite(name, description, args) {
                _classCallCheck(this, Sprite);

                this.name = name || "__";

                this.description = description || "__";

                var _spr = this;

                Quazar.each(args, function (ix, item) {

                        if (ix !== 'parent') {
                                _spr[ix] = item;
                        }
                });

                this.type = $Q.getArg(args, 'type', 'basic');

                this.animations = $Q.getArg(args, 'animations', []);

                this.motionstacks = $Q.getArg(args, 'motionstacks', []);

                var __inst = this;

                this.sounds = {};

                this.image = $Q.getArg(args, 'image', new GameImage($Q.getArg(args, 'src', false)));

                this.size = $Q.getArg(args, 'size', new Vector2(100, 100));

                this.position = $Q.getArg(args, 'position', new Vector3(0, 0, 0));

                this.rotation = $Q.getArg(args, 'rotation', new Vector3(0, 0, 0));

                this.selected_animation = {};

                this.selected_motionstack = {};

                this.selected_physics = {};

                this.onGround = false;

                this.clasticTo = []; //an array of sprite types


                this.damagedBy = []; //an array of animation types


                this.speed = $Q.getArg(args, 'speed', new Vector3(0, 0, 0)); //store constant speed value


                this.accel = $Q.getArg(args, 'accel', new Vector3(0, 0, 0)); //store constant accel value


                this.rot_speed = $Q.getArg(args, 'rot_speed', new Vector3(0, 0, 0));

                this.rot_accel = $Q.getArg(args, 'rot_accel', new Vector3(0, 0, 0));

                this.travel_mode_keys = ['none', 'topscroll_freeflight', 'tsidescroll_freeflight', 'sidescroll_runner'];

                this.travel_modes = [this.create_travel_mode('topscroll_freeflight', 0.3, 0.3, 5.0), this.create_travel_mode('sidescroll_freeflight', 0.3, 0.3, 5.0), this.create_travel_mode('sidescroll_runner', 0.3, 0.3, 7.0)];

                this.travel_mode = this.create_travel_mode('none', 0, 0, 0);

                this.stats = this.create_stats();

                this.id = this.setid();

                $.each(this.motionstacks, function (ix, item) {

                        __inst.motionstacks[ix] = new Motionstack(item);
                });

                $.each(this.animations, function (ix, item) {

                        __inst.animations[ix] = new Animation(item);
                });
        }

        _createClass(Sprite, [{
                key: "setid",
                value: function setid() {
                        return new Date().getUTCMilliseconds();
                }
        }, {
                key: "get_id",
                value: function get_id() {

                        return this.id;
                }
        }, {
                key: "onScreen",
                value: function onScreen(w, h) {
                        return this.position.x + this.size.x >= 0 && this.position.x < w && this.position.y + this.size.y >= 0 && this.position.y < h;
                }
        }, {
                key: "type_options",
                value: function type_options() {

                        return ['player', 'enemy', 'powerup', 'attachment', 'projectile'];
                }
        }, {
                key: "create_travel_mode",
                value: function create_travel_mode(key, accel, decel, max_speed) {

                        return { key: key, accel: accel, decel: decel, max_speed: max_speed };
                }
        }, {
                key: "create_stats",
                value: function create_stats() {
                        return {

                                "health": 100,
                                "magic": 10,
                                "strength": 20,
                                "ammo": 10,
                                "max_speed": 5.0
                        };
                }
        }, {
                key: "update",
                value: function update() {}
        }, {
                key: "def_update",
                value: function def_update() {

                        for (var x in this.speed) {

                                if (this.speed[x] > 0 || this.speed[x] < 0) {

                                        this.position[x] += this.speed[x];
                                }
                        }

                        for (var x in this.accel) {

                                if (this.accel[x] > 0 || this.accel[x] < 0) {

                                        this.speed[x] += this.accel[x];
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
        }, {
                key: "move",
                value: function move(options) //move from one position to another , or spread movement over a complex line, with curved acceleration
                {

                        if (!options.targets instanceof Array) {

                                options.targets = options.targets ? [options.targets] : [options.target || false];
                        }
                        ;

                        if (options.startCurve) {}

                        if (options.endCurve) {}

                        if (options.loopFactor) {//use repeating of startCurve and endCurve over each loopFactor amount of targets

                        }

                        this.tween_movement_sequence = [];

                        Quazar.each(options.targets, function (ix, item) {

                                if (item && (typeof item === "undefined" ? "undefined" : _typeof(item)) == 'object') {}
                        });

                        //do the movement as described


                        var __playerInstance = this; //grab a reference to the player

                        __playerInstance.speed.y = -0.8;

                        this.tween_movement_sequence.push(this.tween_movement_sequence[ix] || new TWEEN.Tween(this.position).to({ y: targetY }, 350).easing(TWEEN.Easing.Cubic.Out).onUpdate(function () {
                                console.log(this.x, this.y);
                        }).onComplete(function () {

                                //  alert('complete');

                                __playerInstance.jump_position_tween = false;
                        }).start());

                        return this;
                }
        }, {
                key: "event_prep",
                value: function event_prep(key, ctrl, args) {
                        return { key: key, ctrl: ctrl, args: args };
                }
        }, {
                key: "event_arg",
                value: function event_arg(key, ctrl, args) {

                        if (__gameInstance.event_args_list instanceof Array !== true) {
                                __gameInstance.event_args_list = [];
                        }

                        alert('applying event arguments');

                        __gameInstance.event_args_list.push(this.event_prep(key, ctrl, args));
                }
        }, {
                key: "line_movement",
                value: function line_movement() //an array movement
                {}
        }, {
                key: "jump",
                value: function jump(options) {

                        //character does a jump move

                        this.prep_key = 'jump';

                        if (__gameInstance.isAtPlay) //do a jump move only if the game is running... else this call is instructional ...aka prepare a jump
                                {
                                        //do the jump as described

                                        if (options.hasOwnProperty('switch') && this[options.switch] !== true) {
                                                return false;
                                        }

                                        var height = options.height,
                                            duration = options.duration,
                                            speed = options.speed;

                                        if (!isNaN(height)) {
                                                height = this.stat('jump_height') || 40;
                                        }

                                        var targetY = this.position.y - height;

                                        var __playerInstance = this; //grab a reference to the player

                                        if (!this.speed) {
                                                this.speed = { x: 0, y: 0, z: 0 };
                                        }

                                        this.speed.y = -0.8;

                                        this.jump_position_tween = this.jump_position_tween || new TWEEN.Tween(this.position).to({ y: targetY }, 350).easing(TWEEN.Easing.Cubic.Out).onUpdate(function () {
                                                console.log(this.x, this.y);
                                        }).onComplete(function () {

                                                //  alert('complete');

                                                __playerInstance.jump_position_tween = false;
                                        }).start();

                                        this.onGround = false;

                                        return this;
                                } else {

                                this.event_arg(this.prep_key, '_', options);
                        }

                        return this;
                }
        }, {
                key: "shoot",
                value: function shoot(options) {
                        //character shoots an animation


                        this.prep_key = 'shoot';

                        var spread = options.spread || options.angleSpread || false;

                        var total = options.total || options.totalBullets || options.numberBullets || false;

                        var animation = options.bullet || options.animation || false;

                        var duration = options.duration || options.screenDuration || false;

                        var speed = options.speed || false;

                        if (__gameInstance.isAtPlay) {} else {

                                this.event_arg(this.prep_key, '_', options);
                        }

                        return this;
                }
        }, {
                key: "allow",
                value: function allow(options) {
                        this.prep_key = 'animate';

                        this.event_arg(this.prep_key, '_', options);
                }
        }, {
                key: "animate",
                value: function animate(animation) {

                        alert('calling animation');

                        if (__gameInstance.isAtPlay) {

                                this.setAnimation(animation);

                                return this;
                        } else {
                                var evt = __gameInstance.event_args_list[__gameInstance.event_args_list.length - 1];

                                evt.animation = animation;

                                return this;
                        }

                        return this;
                }
        }, {
                key: "velocityY",
                value: function velocityY(accel, max) {

                        this.assertSpeed();

                        if (this.speed.y < max.y) {
                                this.speed.y += accel;
                        }

                        this.position.y += this.speed.y;
                }
        }, {
                key: "collide",
                value: function collide(item) {

                        var max_y = item.max ? item.max.y : item.position.y;

                        if (this.position.y + this.size.y >= max_y) {

                                this.position.y = max_y - this.size.y;
                        }
                }
        }, {
                key: "assertSpeed",
                value: function assertSpeed() {
                        if (!this.speed) {

                                this.speed = new Vector3(0, 0, 0);
                        }
                }
        }, {
                key: "swing",
                value: function swing() {}
        }, {
                key: "accel",
                value: function accel(options) {

                        this.prep_key = 'accel';

                        //targeting position

                        if (__gameInstance.isAtPlay) {

                                this.assertSpeed();

                                if (options.hasOwnProperty('switch') && this[options.switch] !== true) {
                                        return false;
                                } else {

                                        //  this[options.switch] = false;

                                }

                                if (options.extras && options.speed !== 0) {

                                        for (var x in options.extras) {
                                                this[x] = options.extras[x];
                                        }
                                }

                                if (this.speed[options.key] < options.speed) {

                                        this.speed[options.key] += options.accel;
                                } else if (this.speed[options.key] > options.speed) {

                                        this.speed[options.key] -= options.accel;
                                } else if (options.speed == 0) {
                                        this.speed[options.key] = 0;
                                }
                        } else {

                                this.event_arg(this.prep_key, '_', options);
                        }

                        return this;
                }
        }, {
                key: "deccelX",
                value: function deccelX(rate) {
                        if ((typeof rate === "undefined" ? "undefined" : _typeof(rate)) == 'object') {

                                rate = rate.rate;
                        }

                        if (this.speed['x'] > rate) {
                                this.speed['x'] -= rate;
                        } else if (this.speed['x'] < rate) {
                                this.speed['x'] += rate;
                        } else {

                                this.speed['x'] = 0;
                        }
                }
        }, {
                key: "on",
                value: function on(options) {

                        var controller_index = options.controller || false;

                        var __sprite = this;

                        var evt = __gameInstance.event_args_list[__gameInstance.event_args_list.length - 1];

                        evt.object = __sprite;

                        evt.ctrl = options.ctrl;

                        for (var x in options) {

                                evt.args[x] = options[x];
                        }

                        // alert('event done');
                }
        }, {
                key: "setAnimation",
                value: function setAnimation(anime) {

                        this.animations['default'] = anime;

                        this.selected_animation = anime;

                        Quazar.log('declared default animation');

                        return this;
                }
        }, {
                key: "defaultAnimation",
                value: function defaultAnimation(anime) {

                        this.animations['default'] = anime;

                        Quazar.log('declared default animation');

                        return this;
                }
        }, {
                key: "getImage",
                value: function getImage(key) {
                        key = this.normalKey(key);

                        return this.images[key] || false;
                }
        }, {
                key: "getAnimation",
                value: function getAnimation(key) {
                        key = this.normalKey(key);

                        return this.animations[key] || false;
                }
        }, {
                key: "add",
                value: function add(objects) // add any object to the sprite
                {

                        if (!objects instanceof Array) {
                                objects = [objects];
                        }
                        ;

                        var _inst = this;

                        Quazar.each(this.__collections, function (ic, coll) {

                                Quazar.each(objects, function (ix, obj) {

                                        if (obj instanceof coll.__typeProfile.constructor) {
                                                coll.list.push(obj); //add the object to collection by class-type
                                        }
                                });
                        });
                }
        }]);

        return Sprite;
}();
//# sourceMappingURL=Sprite.js.map
