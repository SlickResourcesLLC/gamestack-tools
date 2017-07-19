/**
 * Created by Administrator on 7/16/2017.
 */







class SmartSprite
{

    constructor(args)
    {

        this.canvas = args.canvas;

        this.ctx = args.ctx;

        this.image = args.image;

    }

    detectFrames()
    {

        let framesDefined = false, w = 0, h = 0;

        let __inst = this;

        for(var x = 0; x < this.image.domElement.width; x++)
        {
            for(var y = 0; y < this.image.domElement.height; y++) {

                this.canvas.width = x;

                this.canvas.height = y;

                this.ctx.drawImage(this.image.domElement,0,0); // Or at whatever offset you like

                var imgData = ctx.getImageData(0,0,x, y);

                window.setTimeout(function(){

                    __inst.detectWhiteSpace(imgData, x, y);

                }, 250);

                if (framesDefined) {
                    break; //exit loop

                }

            }

        }

    }

    squeeze(canvas, w, h)
    {

        for(var x = 0; x < w; x++)
        {

            if(this.detectWhiteSpace())

        }

    }
    white_space_left(canvas, ctx)
    {
        var trans = false;

        var pixels = [];

        for(var y= 0; y < canvas.height; y++) {
            //top
            // edge all trans
            var pixel = ctx.getImageData(0, y , 1, 1);

            pixels.push(new Vector2(0, y));

            if(!this.is_white_space(pixel))
            {
                return [];
            }
        }
        return pixels;
    }

    white_space_right(canvas, ctx)
    {
        var trans = false;
        var pixels = [];

        for(var y= 0; y < canvas.height; y++) {
            //top
            // edge all trans
            var pixel = ctx.getImageData(canvas.width, y , 1, 1);

            pixels.push(new Vector2(canvas.width, y));

            if(!this.is_white_space(pixel))
            {
                return [];
            }
        }
        return pixels;
    }

    white_space_top(canvas, ctx)
    {
        var trans = false;

        var pixels = [];

        for(var x = 0; x < canvas.width; x++) {
            //top
            // edge all trans
            var pixel = ctx.getImageData(x, 0, 1, 1);

            pixels.push(new Vector2(x, 0));

            if(!this.is_white_space(pixel))
            {
                return [];
            }
        }
        return pixels;
    }

    white_space_bottom(canvas, ctx)
    {
        var trans = false;

        var pixels = [];

        for(var x = 0; x < canvas.width; x++) {
            //top
            // edge all trans
            var pixel = ctx.getImageData(x, canvas.height, 1, 1);

            pixels.push(new Vector2(x, canvas.height));

            if(!this.is_white_space(pixel))
            {
                return [];
            }
        }
        return pixels;
    }


    is_white_space(pixel)
    {

        console.log('todo: is_white_space');

        return false;

    }

    detectWhiteSpace(imagedata, w, h)
    {

        var trans = "rgba(0,0,0,0)";

        var min = 0;

        for(var x = 0; x < w; x++)
        {
            //top edge all trans

            if(imagedata[x] == trans)
            {
                console.log('Found transparent pixel at:' + jstr([x, y]));

            }

            //bottom edge all trans

            if(imagedata[w * h - x] == trans)
            {
                console.log('Found transparent pixel at:' + jstr([x, y]));

            }

            for(var y = 0; y < h; y++)
            {
                //top edge all trans

                if(imagedata[w * y + 1] == trans)
                {
                    console.log('Found transparent pixel at:' + jstr([x, y]));

                }

                //bottom edge all trans

                if(imagedata[w * y] == trans)
                {
                    console.log('Found transparent pixel at:' + jstr([x, y]));

                }

            }

        }

}

    centerToPositon(sprite, position)
    {


    }

}