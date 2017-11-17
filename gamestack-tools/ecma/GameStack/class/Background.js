class Background {

    constructor(type, contents, speedFloat) {

        this.type = type || "parallax" || "basic" || false;

        if(contents instanceof Object)
        {
            contents = [contents] //encapsulate in array (always) for simplistic processing
        }

        this.contents = contents;

        this.speedFloat = speedFloat || 1.0;

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