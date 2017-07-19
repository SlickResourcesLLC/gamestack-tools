'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by The Blakes on 04-13-2017
 *
 * --note :: file started 04-13-2017, target completion : 04-25-2017
 *
 * SpecialMoves:{} //an object for special moves, such as jump(), fire_projectile(), etc..
 */

var SpriteEffect = function SpriteEffect(effect, floatPortion) {
    _classCallCheck(this, SpriteEffect);

    switch (effect) {

        case 'attack':

            break;

        case 'weakness':
            //weakness of health during attack


            break;

        case 'stun':

            break;

        case 'slow':

            break;

        case 'speed':

            break;

    }
};

var CharacterSprite = function () {
    function CharacterSprite() {
        _classCallCheck(this, CharacterSprite);

        this.effects_queue = [];
    }

    _createClass(CharacterSprite, [{
        key: 'attack',
        value: function attack(animations, movements, damage) {}
    }, {
        key: 'take_damage',
        value: function take_damage(animations, movements, damage) {}
    }, {
        key: 'stick_move_x',
        value: function stick_move_x() {}
    }, {
        key: 'stick_move_y',
        value: function stick_move_y() {}
    }, {
        key: 'fireShots',
        value: function fireShots() {}
    }, {
        key: 'subsprite',
        value: function subsprite() {}
    }, {
        key: 'jump',
        value: function jump(height, animation, duration) {}
    }]);

    return CharacterSprite;
}();
//# sourceMappingURL=CharacterSprite.js.map
