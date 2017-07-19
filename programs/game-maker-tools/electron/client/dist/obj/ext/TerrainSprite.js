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

var TerrainSprite = function () {
            function TerrainSprite(sprite, args) {
                        _classCallCheck(this, TerrainSprite);

                        this.collision = $Q.hasArg(args, 'collision', 'full');

                        this.collision_options = ['full', 'all', '*', 'top', 'bottom', 'left', 'right', 'vertical', 'horizontal'];

                        this.collision_callback = function () {};
            }

            _createClass(TerrainSprite, [{
                        key: 'collide',
                        value: function collide(sprite, callable) {

                                    switch (this.collision) {

                                                case 'full':

                                                case '*':

                                                case 'all':

                                                            break;

                                                case 'top':

                                                            break;

                                                case 'left':

                                                            break;

                                                case 'bottom':

                                                            break;

                                                case 'right':

                                                            break;

                                    }
                        }
            }]);

            return TerrainSprite;
}();
//# sourceMappingURL=TerrainSprite.js.map
