/**
 * Created by Administrator on 7/15/2017.
 */




class Vector3 {
    constructor(x, y, z, r) {

        this.x = x;
        this.y = y;
        this.z = z;
        this.r = r;

    }


}
;

let Vector2 = Vector3, Point = Vector3, Size = Vector3, Vertex = Vector3, Rotation = Vector3, Rot = Vector3, Position = Vector3,

    Pos = Vector3;




class Rectangle {

    constructor(min, max) {

        this.min = min;
        this.max = max;

    }


}
;

let VectorBounds = Rectangle;



class VectorFrameBounds {

    constructor(min, max, termPoint) {

        this.min = min;
        this.max = max;

        this.termPoint = termPoint || new Vector3(this.max.x, this.max.y, this.max.z);

    }


}
;



class Circle
{
    constructor(args) {

        this.position = this.getArg(args, 'position', new Vector3(0, 0, 0));

        this.radius = this.getArgs(args, 'radius', 100);

    }

    getArg(args, key, fallback) {

        if (args.hasOwnProperty(key)) {

            return args[key];

        }
        else {
            return fallback;

        }

    }

}

