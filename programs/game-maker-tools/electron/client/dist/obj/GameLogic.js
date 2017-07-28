'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by The Blakes on 7/27/2017.
 */

var StatEffect = function () {
    function StatEffect(name, value, onEffect) {
        _classCallCheck(this, StatEffect);

        this.__is = "a game logic effect";

        this.name = name;

        this.value = value;

        this.onEffect = onEffect || function () {};
    }

    _createClass(StatEffect, [{
        key: 'limit',
        value: function limit(numberTimes, withinDuration) {}
    }, {
        key: 'process',
        value: function process(object) {
            //if the object has any property by effect.name, the property is incremenented by effect value
            //a health decrease is triggered by Effect('health', -10);


            for (var x in object) {
                if (x.toLowerCase() == this.name.toLowerCase() && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == _typeof(object[x])) {

                    object[x] += this.value;
                }
            }
        }
    }, {
        key: 'onEffect',
        value: function onEffect() {}
    }]);

    return StatEffect;
}();

;

var GameEffect = function () {
    function GameEffect(args) {
        _classCallCheck(this, GameEffect);

        var myChance = this.chance(args.chance || 1.0); //the chance the effect will happen

        this.trigger = args.trigger || 'always' || 'collide';

        this.parent = args.parent || false;

        if (!this.parent) {
            console.error('GameEffect Must have valid parent sprite');
        }

        this.objects = args.objects || [];

        for (var x in args) {

            if (x instanceof Animation) {

                //trigger the Animation

            }

            if (x instanceof StatEffect) {

                //trigger the StatEffect


            }
        }
    }

    _createClass(GameEffect, [{
        key: 'chance',
        value: function chance(floatPrecision) {}
    }, {
        key: 'collide',
        value: function collide(object, collidables) {}
    }]);

    return GameEffect;
}();

var GameLogic = function () {
    function GameLogic(gameEffectList) {
        _classCallCheck(this, GameLogic);

        if (!gameEffectList instanceof Array) {

            console.info('GameLogic: gameEffectList was not an array');

            gameEffectList = [];
        }

        this.gameEffects = gameEffectList;
    }

    _createClass(GameLogic, [{
        key: 'process_all',
        value: function process_all() {

            //process all game logic objects::


        }
    }, {
        key: 'add',
        value: function add(effect) {

            this.gameEffects.push(effect);
        }
    }]);

    return GameLogic;
}();
//# sourceMappingURL=GameLogic.js.map
