

/**
 * Takes the min and max vectors of rectangular shape and returns Rectangle Object.
 * @param   {Object} args object of arguments
 * @param   {Vector} args.min the minimum vector point (x,y)
 * @param   {Vector} args.max the maximum vector point (x,y)
 *
 * @returns {Rectangle} a Rectangle object
 */

class Rectangle {

    constructor(min, max) {

        this.min = min;
        this.max = max;

    }


}
;


let VectorBounds = Rectangle;



Gamestack.Rectangle = Rectangle;



/**
 * Takes the min and max vectors plus termPoint ('termination-point'), returns VectorFrameBounds
 *  *use this to define the bounds of an Animation object.
 * @param   {Object} args object of arguments
 * @param   {Vector} args.min the minimum vector point (x,y)
 * @param   {Vector} args.max the maximum vector point (x,y)
 * @param   {Vector} args.termPoint the termPoint vector point (x,y)
 * -While a min and max Vector(x,y) will describe the grid of Animation frames, the termPoint will indicate the last frame to show on the grid (Animations may stop early on the 'grid')
 * @returns {VectorFrameBounds} a VectorFrameBounds object
 */


class VectorFrameBounds extends Rectangle {

    constructor(min, max, termPoint) {

        super(min, max);

        this.termPoint = termPoint || new Vector3(this.max.x, this.max.y, this.max.z);

    }


}
;



Gamestack.VectorFrameBounds = VectorFrameBounds;




var Curves = { //ALL HAVE INPUT AND OUTPUT OF: 0-1.0
    // no easing, no acceleration
    linearNone: function (t) { return t },
    // accelerating from zero velocity
    easeInQuadratic: function (t) { return t*t },
    // decelerating to zero velocity
    easeOutQuadratic: function (t) { return t*(2-t) },
    // acceleration until halfway, then deceleration
    easeInOutQuadratic: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
    // accelerating from zero velocity
    easeInCubic: function (t) { return t*t*t },
    // decelerating to zero velocity
    easeOutCubic: function (t) { return (--t)*t*t+1 },
    // acceleration until halfway, then deceleration
    easeInOutCubic: function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
    // accelerating from zero velocity
    easeInQuartic: function (t) { return t*t*t*t },
    // decelerating to zero velocity
    easeOutQuartic: function (t) { return 1-(--t)*t*t*t },
    // acceleration until halfway, then deceleration
    easeInOutQuartic: function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
    // accelerating from zero velocity
    easeInQuintic: function (t) { return t*t*t*t*t },
    // decelerating to zero velocity
    easeOutQuintic: function (t) { return 1+(--t)*t*t*t*t },
    // acceleration until halfway, then deceleration
    easeInOutQuintic: function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t }
}


Gamestack.Curves = Curves;


/**
 * Takes several args and returns Line object. Intended for curved-line / trajectory of Projectile Object.
 * @param   {Object} args object of arguments
 * @param   {Easing} args.curve the curve applied to line see TWEEN.Easing , limited options for immediate line-drawing
 * @param   {number} args.duration the millisecond duration of Line
 * @param   {Vector} args.position the position vector
 *
 * @param   {number} args.pointDist the numeric point-distance
 *
 * @param   {Vector} args.size the size vector
 *
 * @param   {number} args.rotation the numeric rotation of -360 - 360
 *
 * @param   {number} args.growth the numeric growth
 *
 * -While a min and max Vector(x,y) will describe the grid of Animation frames, the termPoint will indicate the last frame to show on the grid (Animations may stop early on the 'grid')
 * @returns {VectorFrameBounds} a VectorFrameBounds object
 */

class Line
{
    constructor(args = {})
    {

        this.curve = args.curve || TWEEN.Easing.Linear.None;

        this.motion_curve = args.motion_curve || TWEEN.Easing.Linear.None;

        this.points = [];

        this.position = args.position ||  new Vector();

        this.offset = args.offset || new Vector();

        this.pointDist = 5;

        this.size = args.size || new Vector();

        this.rotation = args.rotation || 0;

        this.iterations = 1;

        this.growth = args.growth || 1.2;

    }

    Iterations(n)
    {

       this.iterations = n;
       return this;
    }

    Growth(n)
    {
        this.growth = n;

        return this;

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

    get_curve_from_keys(xkey, ykey)
    {

            for (var x in Curves) {
                if (x.toLowerCase().indexOf(xkey) >= 0 && x.toLowerCase().indexOf(ykey) >= 0) {
                    // alert('found curve at:' + x)

                    return Curves[x];

                }

            }


    }

    get_curve(c)
    {

        for(var x in TWEEN.Easing)
    {

        for(var y in TWEEN.Easing[x])
        {

           if( TWEEN.Easing[x][y] == c)
           {

              // alert('found curve at:' + x + ':' + y);

               return this.get_curve_from_keys(x.toLowerCase(), y.toLowerCase());

           }


        }

    }

    }

    fill(size, pointDist)
    {

       console.log(jstr([size, pointDist]));

        if(!size || !pointDist) //***PREVENT DOUBLE RUN
        {

            return 0;
        }

        this.size = size;

        this.pointDist = pointDist;

        var __inst = this;

        this.points = [];

        var current_point = new Vector(this.position), yTrack = 0;

        for(var x= 0; x <= this.iterations; x++) {

            var position = new Vector(current_point),

                target = new Vector(position.add(size)),

                start = new Vector(position),

                curveMethod = this.get_curve(this.curve),

                ptrack = new Vector(start);

            for (position.x = position.x; position.x < target.x; position.x += 1) {

                var dist = position.sub(start);

                var pct = dist.x / size.x;

                console.log(pct);

                position.y = Math.round(curveMethod(pct) * size.y + (yTrack));

                if (ptrack.trig_distance_xy(position) >= this.pointDist) {

                    var p = new Vector(Gamestack.GeoMath.rotatePointsXY(position.x, position.y, this.rotation));

                    this.points.push(p);

                    current_point = new Vector(position);

                }
            }

            yTrack += size.y;

            size = size.mult(this.growth);


        }
    }

    transpose(origin)
    {

        var t_points = [];

        for(var x = 0; x < this.points.length; x++) {

            t_points.push(this.points[x].add(origin));

        }

        return t_points;

    }

    add_segment(next_segment, offset)
    {
        for(var x = 0; x < next_segment.length; x++) {

            next_segment[x] = new Vector(next_segment[x]).add(offset);

            this.points.push(next_segment[x]);

        }

    }


    get_flipped_segment(points)
    {

        var t_points = points.slice(), t_len = t_points.length;

        for(var x = 0; x < points.length; x++) {

            t_points[t_len - x].x = points[x].x

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
