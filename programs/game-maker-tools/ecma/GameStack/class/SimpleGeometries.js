

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

        this.curve = args.curve || TWEEN.Easing.Linear.None;

        this.motion_curve = args.motion_curve || TWEEN.Easing.Linear.None;

        this.duration = args.duration || 500;

        this.points = [];

        this.position = new Vector();

        this.minPointDist = 5;

        this.size = new Vector();

        this.rotation = args.rotation || 0;

    }

    Pos(p)
    {

        this.position = p;
        return this;
    }

    PointDisp(num)
    {
        this.minPointDist = num;
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

    fill(size, minPointDist)
    {

        if(!size || !minPointDist) //***PREVENT DOUBLE RUN
        {
            return 0;
        }

        this.size = size;

        this.minPointDist = minPointDist;

        this.points = new Motion().getTweenPoints(size, this);

    }

    transpose(origin)
    {

        var t_points = [];

        for(var x = 0; x < this.points.length; x++) {

            t_points.push(this.points[x].add(origin));

        }

        return t_points;

    }

    Highlight(origin, ctx)
    {

        ctx = ctx || Gamestack.ctx;

        for(var x in this.points)
        {

            var point = origin.add(this.points[x]).sub(Gamestack.point_highlighter.size.mult(0.5));

            var dist = point.sub(Gamestack.point_highlighter.position);

            var d = Math.sqrt( dist.x * dist.x + dist.y * dist.y );


            if(d >= 10)
            {
                Gamestack.point_highlighter.position = new Vector2(origin.add(this.points[x]).sub(Gamestack.point_highlighter.size.mult(0.5)));
            }


               Canvas.draw(Gamestack.point_highlighter, ctx);

        }

        return this;

    }

}



var GeoMath = {

        rotatePointsXY:function(x,y,angle) {

            var theta = angle*Math.PI/180;

            var point = {};
            point.x = x * Math.cos(theta) - y * Math.sin(theta);
            point.y = x * Math.sin(theta) + y * Math.cos(theta);

            point.z = 0;

            return point
        }

}

Gamestack.GeoMath = GeoMath;

Gamestack.Circle = Circle;