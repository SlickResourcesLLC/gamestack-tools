
class Parallax
{
    constructor(options)
    {
        this.grid = options.grid;

        this.position = options.position || new Vector();

        this.scrollCall = options.callback || options.scrollCall || options.scrollCallback || function(){};

        this.focus = options.object || options.focus || options.sprite || function(){};

    }
    scrollX()
    {


    }
    scrollY()
    {


    }
    scroll()
    {


    }
}

