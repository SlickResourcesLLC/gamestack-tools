

class Rectangle {

    constructor(min, max) {

        this.min = min;
        this.max = max;

    }


}
;



let VectorBounds = Rectangle;



Gamestack.Rectangle = Rectangle;

class VectorFrameBounds extends Rectangle {

    constructor(min, max, termPoint) {

        super(min, max);

        this.termPoint = termPoint || new Vector3(this.max.x, this.max.y, this.max.z);

    }


}
;



Gamestack.VectorFrameBounds = VectorFrameBounds;


class Circle //empty circle class
{


}

class Elipse
{

    constructor(args = {})
    {
        this.width = args.width || 100;

        this.height = args.height || 100;

    }

}

class Line
{
    constructor(args = {})
    {

        this.curve = args.curve || TWEEN.Easing.Quadratic.InOut;

        this.duration = args.duration || 1000;

        this.points = [];

        this.position = new Vector();

        this.size = new Vector();

    }

    Pos(p)
    {

        this.position = p;
        return this;
    }

    Curve(c)
    {
        this.curve = c;
        return this;
    }

    Duration(d)
    {
        this.duration = d;

        return this;
    }

    fill( size)
    {

        var __inst = this;

        this.size = size;

      this.points = new Motion().getTweenPoints(size, this, function(){



      });

        return this;

    }

    Highlight(origin, ctx)
    {
        ctx = ctx || Gamestack.ctx;

        for(var x in this.points)
        {

           if(x % 4 == 0) {

               Gamestack.point_highlighter.position = new Vector2(origin.add(this.points[x]));

               Canvas.draw(Gamestack.point_highlighter, ctx);

           }

        }

        return this;

    }

}


Gamestack.Circle = Circle;