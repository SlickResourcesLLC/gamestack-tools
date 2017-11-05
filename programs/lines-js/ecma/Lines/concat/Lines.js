/**@author
Jordan Edward Blake
 * */

function Lines()
{
    this.each = function(obj, callback)
    {
        for(var x in obj)
        {

            callback(x, obj[x]);

        }
    };

}




;
let VectorBounds = Rectangle;

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

var Shapes = {

    circle:function(radius, freq) {

        return {

            radius:radius,

            points:[],

            fill:function(center, freq)
            {



            }

        }
    },

    square:function(s, freq)
    {
        console.error('STILL NEED TO BUILD THIS SQUARE IN GS-API');

        return{

            size:new Vector(s, s),

            width:w,

            height:h,

            freq:freq,

            points:[],

            fill:function(start, freq)
            {


            }
        }

    },

    rect:function(w, h, freq)
    {
        console.error('STILL NEED TO BUILD THIS TRIANGLE');

        return{

            size:new Vector(w, h),

            width:w,

            height:h,

            freq:freq,

            points:[],

            fill:function(start, freq)
            {


            }
        }

    },

    triangle:function(base, h, freq)
    {

        console.error('STILL NEED TO BUILD THIS TRIANGLE');

        return{

            base:base,

            height:height,

            freq:freq,

            points:[],

            fill:function(start, freq)
            {


            }
        }

    }
};

Gamestack.Shapes = Shapes;

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

        this.curve_string = args.curve_string || "Linear_None";

        this.curve = this.get_curve_from_string(this.curve_string);

        this.motion_curve = args.motion_curve || TWEEN.Easing.Linear.None;

        if(typeof(args.curve) == 'function')
        {
            this.curve = args.curve;
        }

        this.points = [];

        this.position = args.position ||  new Vector();

        this.is_highlighted = args.is_highlighted || false;

        this.offset = args.offset || new Vector();

        this.pointDist = 5;

        this.size = args.size || new Vector();

        this.rotation = args.rotation || 0;

        this.iterations = 1;

        this.growth = args.growth || 1.2;

        this.curve_options = Curves;

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
        this.curve_string = this.get_curve_string(c);
        return this;
    }

    Duration(d)
    {
        this.duration = d;

        return this;
    }
    Rotation(r)
    {
        this.rotation = r;
        return this;
    }
    next(position)
    {

        var found = false;

        for(var x = 0; x < this.points.length; x++)
        {

            if(position.equals(this.points[x]) &&  x < this.points.length - 1)
            {
                found = true;
                return new Vector(this.points[x + 1]);

            }

            if(x==this.points.length - 1 && !found)
            {

                return new Vector(this.points[0]);

            }

        }

    }

    get_curve_from_string(str)
    {

        for(var x in this.curve_options) {

            if(x.toLowerCase() == str.toLowerCase().replace('_', ''))
            {
                return this.curve_options[x];

            }

        }

    }


    get_curve_string(c)
    {
        for(var x in this.curve_options) {

            if(this.curve_options[x] == c)
            {
                return x;

            }

        }

    }

    getGraphCanvas(curveCall, existing_canvas) {

        var canvas = existing_canvas || document.createElement('canvas');

        canvas.style.position = "relative";

        canvas.id = 'curve-display';

        canvas.setAttribute('class', 'motion-curve');

        canvas.width = 180;
        canvas.height = 100;

        canvas.style.background = "black";

        var context = canvas.getContext('2d');
        context.fillStyle = "rgb(0,0,0)";
        context.fillRect(0, 0, 180, 100);

        context.lineWidth = 0.5;
        context.strokeStyle = "rgb(230,230,230)";

        context.beginPath();
        context.moveTo(0, 20);
        context.lineTo(180, 20);
        context.moveTo(0, 80);
        context.lineTo(180, 80);
        context.closePath();
        context.stroke();

        context.lineWidth = 2;
        context.strokeStyle = "rgb(255,127,127)";

        var position = {x: 0, y: 80};
        var position_old = {x: 0, y: 80};

        this.test_graph_size = new Vector(185, 80 -20);

       var points = this.get_line_segment(this.test_graph_size, 5, curveCall);

        for(var x in points)
        {
            var position = new Vector(points[x].x, this.test_graph_size.y + 20 - points[x].y);

            context.beginPath();
            context.moveTo(position_old.x, position_old.y);
            context.lineTo(position.x, position.y);
            context.closePath();
            context.stroke();

            position_old.x = position.x;
            position_old.y = position.y;
        }

        return canvas;
    }

    get_line_segment(size, pointDist, curveCall)
    {
        if(!size || !pointDist) //***PREVENT DOUBLE RUN
        {

            return 0;
        }

        var points = [];

        var current_point = new Vector(0, 0, 0);

        var position = new Vector(current_point),

            target = new Vector(position.add(size)),

            start = new Vector(position),

            curveMethod = curveCall,

            ptrack = new Vector(start);

        for (position.x = position.x; position.x < target.x; position.x += 1) {

            var dist = position.sub(start);

            var pct = dist.x / size.x;

            console.log(pct);

            position.y = Math.round(curveMethod(pct) * size.y);

            if (ptrack.trig_distance_xy(position) >= pointDist) {

                var p = new Vector(Gamestack.GeoMath.rotatePointsXY(position.x, position.y, 0));

                points.push(p);

                current_point = new Vector(position);

                ptrack = new Vector(current_point);

            }
        }

        return points;

    }

    fill(size, pointDist)
    {

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

                curveMethod = this.curve,

                ptrack = new Vector(start);

            for (position.x = position.x; position.x < target.x; position.x += 1) {

                var dist = position.sub(start);

                var pct = dist.x / size.x;

                position.y = start.y +  Math.round(curveMethod(pct) * size.y);

                if (current_point.trig_distance_xy(position) >= this.pointDist) {

                    var p = new Vector(Gamestack.GeoMath.rotatePointsXY(position.x, position.y, this.rotation));

                    this.points.push(p);

                    current_point = new Vector(position);

                }
            }

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
;
/**
 * Takes arguments of x, y, and (optionally) z, instantiates Vector object

 <ul>
 <li>Optional: use a Vector as the 'x' argument, and instantiate new distinct Vector from the argument</li>
 </ul>

 * @param   {number} x the x coordinate
 * @param   {number} y the y coordinate
 * @param   {number} z the z coordinate
 * @returns {Vector} a Vector object
 */


class Vector {
    constructor(x, y, z, r) {

        if(typeof(x) == 'object' && x.hasOwnProperty('x') && x.hasOwnProperty('y')) //optionally pass vector3
        {
            this.x = x.x;
            this.y = x.y;
            this.z = x.z || 0;

            if(this.z == null)
            {
                this.z = 0;
            }

            return this;
        }

        if(z == null){z = 0;}

        this.x = x;
        this.y = y;
        this.z = z;
        this.r = r;

    }


    sub(v)
    {
        if(typeof(v) == 'number')
        {
            v = {x:v, y:v, z:v};
        }

        return new Vector(this.x - v.x, this.y - v.y, this.z - v.z);

    }

    add(v)
    {
        if(typeof(v) == 'number')
        {
            v = {x:v, y:v, z:v};
        }

        return new Vector(this.x + v.x, this.y + v.y, this.z + v.z);

    }

    mult(v)
    {
        if(typeof(v) == 'number')
        {
            v = {x:v, y:v, z:v};
        }

        return new Vector(this.x * v.x, this.y * v.y, this.z * v.z);

    }
    div(v)
    {
        if(typeof(v) == 'number')
        {
            v = {x:v, y:v, z:v};
        }

        return new Vector(this.x / v.x, this.y / v.y, this.z / v.z);
    }

    round()
    {
        return new Vector(Math.round(this.x), Math.round(this.y), Math.round(this.z));

    }
    floor()
    {
        return new Vector(Math.floor(this.x), Math.floor(this.y), Math.floor(this.z));

    }
    ceil()
    {
        return new Vector(Math.ceil(this.x), Math.ceil(this.y), Math.ceil(this.z));

    }

    equals(v)
    {

        return this.x == v.x && this.y == v.y && this.z == v.z;
    }

    trig_distance_xy(v)
    {

        var dist = this.sub(v);

        return  Math.sqrt( dist.x * dist.x + dist.y * dist.y );

    }

    diff()
    {
        //TODO:this function


    }

    abs_diff()
    {
        //TODO:this function

    }

    is_between(v1, v2)
    {
       //TODO : overlap vectors return boolean

        return this.x >= v1.x && this.x <= v2.x &&
            this.y >= v1.y && this.y <= v2.y &&
            this.z >= v1.z && this.z <= v2.z;


    }

}

let Vector3 = Vector, Pos = Vector, Size = Vector, Position = Vector, Vector2 = Vector, Rotation = Vector;


Gamestack.Vector = Vector;


//The above are a list of synonymous expressions for Vector. All of these do the same thing in this library (store x,y,z values)
