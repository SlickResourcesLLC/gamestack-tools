'use strict';

/**
 * Created by Jordan Blake
 */

var Game = Game || {};

Game.terrain = [];

Game.sprites = Game.sprites || [];

var terrain_init = function terrain_init(sprite_list) {

            for (var y = 0; y < 10; y++) {

                        var onY = y % 2 == 0 || false;

                        for (var x = 0; x < 10; x++) {

                                    var onX = x % 2 == 0 || false;

                                    var z = x / y * 100;

                                    var xpos = x * 20;

                                    var ypos = y * 20;

                                    var block = new Sprite('Terrain Block', 'a block of basic terrain', { pos: new Vector2(xpos, ypos), size: new Vector2(10, 10) });

                                    block.active = true;

                                    block.setAnimation(new Animation({
                                                src: "image/block_blue.png",
                                                frameSize: new Vector3(64, 64, 0),
                                                frameBounds: new VectorBounds(new Vector3(0, 0, 0), new Vector3(0, 0, 0)) //basic single frame :: stays on same frame
                                    }));

                                    sprite_list.push(block);
                        }
            }
};
//# sourceMappingURL=Terrain.js.map
