class Background extends Sprite {

    constructor(args={}) {

        super(args);

        this.type = args.type || "parallax" || "basic" || false;

        this.orientation = args.orientation || "x" || "y" || "xy";

        this.contents = args.contents || [];

        if(this.contents instanceof Object)
        {
            this.contents = [this.contents] //encapsulate in array (always) for simple processing
        };

        this.reverseX = args.reverseX || false;

        this.reverseY = args.reverseY || false;

        this.speedFloat = args.speedFloat || 1.0;

    }

    scroll(speedX, speedY)
    {

        Gamestack.each(this.contents, function(ix, element){

          element.position.x += speedX * this.speedFloat;
            element.position.y += speedY * this.speedFloat;

        });

    }

    scrollX(speed)
    {
        Gamestack.each(this.contents, function(ix, element){

            element.position.x += speed * this.speedFloat;

        });

    }

    scrollY(speed)
    {
        Gamestack.each(this.contents, function(ix, element){

            element.position.y += speed * this.speedFloat;

        });
    }
    add(object)
    {
        var cleanCheck = object instanceof Sprite || object instanceof Array && object[0] instanceof Sprite;

        if(!cleanCheck)
        {
            return console.error('Must have: valid contents (Sprite OR [] of Sprite())');
        }

        if(object instanceof Array)
        {
            this.contents.cancat(object)
        }
        else
        {
            this.contents.push(object);
        }

        return this;
    }

}