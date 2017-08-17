

/**
 * Vector3({x:number,y:number,z:number,r:number})
 *
 * required arguments: x, y
 * optional arguments: z, r
 *
 * [See Live Demo with Usage-Example]{@link http://www.google.com}
 * @returns {Vector3} object of Vector3()
 *
 * Vector objects are treated alike in GameStack.js, with Vector() and Vector2() equivalent to Vector3()
 * Other class names synonymous with Vector() are Pos(), Size(), Position(), Rotation()
 * */

class Vector3 {
    constructor(x, y, z, r) {

        if(typeof(x) == 'object' && x.x && x.y) //optionally pass vector3
        {
            this.x = x.x;
            this.y = x.y;
            this.z = x.z || 0;

            return this;
        }

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
        };

        return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);

    }

    add(v)
    {
        if(typeof(v) == 'number')
        {
            v = {x:v, y:v, z:v};
        };

        return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);

    }

    mult(v)
    {
        if(typeof(v) == 'number')
        {
            v = {x:v, y:v, z:v};
        };

        return new Vector3(this.x * v.x, this.y * v.y, this.z * v.z);

    }
    div(v)
    {
        if(typeof(v) == 'number')
        {
            v = {x:v, y:v, z:v};
        };

        return new Vector3(this.x / v.x, this.y / v.y, this.z / v.z);
    }

    round()
    {
        return new Vector3(Math.round(this.x), Math.round(this.y), Math.round(this.z));

    }
    floor()
    {
        return new Vector3(Math.floor(this.x), Math.floor(this.y), Math.floor(this.z));

    }
    ceil()
    {
        return new Vector3(Math.ceil(this.x), Math.ceil(this.y), Math.ceil(this.z));

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

    }

}
;

let Pos = Vector3, Size = Vector3, Position = Vector3, Vector2 = Vector3, Vector = Vector3, Rotation = Vector3;

//The above are a list of synonymous expressions for Vector3. All of these do the same thing in this library (store x,y,z values)
