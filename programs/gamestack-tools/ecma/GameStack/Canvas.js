

/**
 * instantiates Gamestack.js Canvas (CanvasLib) controller

 @description
 This Canvas library handles the low-level drawing of Sprite() objects on HTML5Canvas.
 -draws Sprites(), handling their rotation, size, and other parameters.
 * @returns {CanvasLib} a CanvasLib object
 */

class CanvasLib {

    constructor() {

        return {

            __levelMaker: false,

            draw: function (sprite, ctx) {

                if (sprite.active && (this.__levelMaker || sprite.onScreen(__gameStack.WIDTH, __gameStack.HEIGHT))) {

                    this.drawPortion(sprite, ctx);

                }

            },
            drawFrameWithRotation: function (img, fx, fy, fw, fh, x, y, width, height, deg, canvasContextObj, flip) {

                canvasContextObj.save();
                deg = Math.round(deg);
                deg = deg % 360;
                var rad = deg * Math.PI / 180;
                //Set the origin to the center of the image
                canvasContextObj.translate(x, y);
                canvasContextObj.rotate(rad);
                //Rotate the canvas around the origin

                canvasContextObj.translate(0, canvasContextObj.width);
                if (flip) {

                    canvasContextObj.scale(-1, 1);
                } else {

                }

                //draw the image
                canvasContextObj.drawImage(img, fx, fy, fw, fh, width / 2 * (-1), height / 2 * (-1), width, height);
                //reset the canvas

                canvasContextObj.restore();
            },


            /*
             * drawPortion:
             *
             *   expects: (sprite{selected_animation{selected_frame{frameSize, framePos } offset?, gameSize? }  })
             *
             *
             * */


            drawPortion: function (sprite, ctx) {

                var frame;

                if (sprite.active) {

                    if (sprite.selected_animation && sprite.selected_animation.selected_frame) {

                        frame = sprite.selected_animation.selected_frame;

                    }
                    else {

                        console.error('Sprite is missing arguments');

                    }

                    var p = sprite.position;

                    var camera = __gameStack.__gameWindow.camera || {x: 0, y: 0, z: 0};

                    var x = p.x, y = p.y;


                    x -= camera.x || 0;
                    y -= camera.y || 0;
                    //optional animation : gameSize

                    var targetSize = sprite.size || sprite.selected_animation.size;

                    var realWidth = targetSize.x;
                    var realHeight = targetSize.y;

                    //optional animation : offset

                    if (sprite.selected_animation && sprite.selected_animation.hasOwnProperty('offset')) {
                        x += sprite.selected_animation.offset.x;

                        y += sprite.selected_animation.offset.y;

                    }

                    var rotation;

                    if (typeof(sprite.rotation) == 'object') {

                        rotation = sprite.rotation.x;


                    }
                    else {
                        rotation = sprite.rotation;

                    }

                    var frame = sprite.selected_animation.selected_frame;

                    if (frame && frame.image && frame.image.data) {
                        ctx.putImageData(frame.image.data, x, y);

                    }
                    else {

                        this.drawFrameWithRotation(sprite.selected_animation.image.domElement, frame.framePos.x, frame.framePos.y, frame.frameSize.x, frame.frameSize.y, Math.round(x + (realWidth / 2)), Math.round(y + (realHeight / 2)), realWidth, realHeight, rotation % 360, ctx, sprite.flipX);

                    }

                }

            }

        }

    }

}


let Canvas = new CanvasLib();

Gamestack.Canvas = Canvas;








