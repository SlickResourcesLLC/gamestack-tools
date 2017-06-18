'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by The Blakes on 04-13-2017
 *
 */

//SimpleMathDescriptor({operator:['+', '-', '/', '*', '%'], operand_key:['speed']})

//MotionDirections({})


var GUIMotion = function GUIMotion(parent, key, operator, value) {
                _classCallCheck(this, GUIMotion);

                var m = this;

                this.parent = parent;this.key = key;this.value = value;

                if (typeof this.parent.update == 'function') {
                                var update = this.parent.update;

                                this.parent.update = function () {
                                                update();

                                                if (operator == '+') {
                                                                parent[key] += value;
                                                }

                                                if (operator == '-') {
                                                                parent[key] -= value;
                                                }

                                                if (operator == '*') {
                                                                parent[key] *= value;
                                                }

                                                if (operator == '/') {
                                                                parent[key] /= value;
                                                }
                                };
                }
};
//# sourceMappingURL=Motion.js.map
