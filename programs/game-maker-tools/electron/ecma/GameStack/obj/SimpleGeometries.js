

class Rectangle {

    constructor(min, max) {

        this.min = min;
        this.max = max;

    }


}
;

let VectorBounds = Rectangle;

class VectorFrameBounds extends Rectangle {

    constructor(min, max, termPoint) {

        super(min, max);

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


}

