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

                this.active = true;

                if ((typeof name === "undefined" ? "undefined" : _typeof(name)) == 'object') {
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

                var __inst = this;

                this.id = $Q.getArg(args, 'id', this.setid());

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


                this.speed = $Q.getArg(args, 'speed', new Vector3(0, 0, 0)); //store constant speed value

                this.accel = $Q.getArg(args, 'accel', new Vector3(0, 0, 0)); //store constant accel value


                this.rot_speed = $Q.getArg(args, 'rot_speed', new Vector3(0, 0, 0));

                this.rot_accel = $Q.getArg(args, 'rot_accel', new Vector3(0, 0, 0));

                this.actionlists = $Q.getArg(args, 'actionlists', []);

                $.each(this.sounds, function (ix, item) {

                        __inst.sounds[ix] = new Sound(item);
                });

                $.each(this.motions, function (ix, item) {

                        __inst.motions[ix] = new Motion(item);
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
                key: "collidesRectangular",
                value: function collidesRectangular(sprite) {

                        return Quazar.Collision.spriteRectanglesCollide(sprite);
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
                key: "fromFile",
                value: function fromFile(file_path) {
                        var __inst = this;

                        $.getJSON(file_path, function (data) {

                                __inst = new Sprite(data);
                        });
                }
        }]);

        return Sprite;
}();

var GameObjects = {

        init: function init() {

                var BlockTile = new Sprite();

                this.sprites = [];
        }

};
//# sourceMappingURL=Sprite.js.map
