
//Vector3:

class Vector3 {
    constructor(x, y, z, r) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.r = r;

        this.__relativeTo = false;

    }

    relativeTo(v)
    {
        this.__relativeTo = v;
    }

    sub()
    {
        //TODO : subtract vectors


    }

    add()
    {
        //TODO : add vectors

    }

    is_between(v1, v2)
    {
        //TODO : overlap vectors return boolean

    }

}
;

let Pos = Vector3, Size = Vector3, Position = Vector3, Vector2 = Vector3, Vector = Vector3, Rotation = Vector3;

//The above are a list of synonymous expressions for Vector3. All of these do the same thing in this library (store x,y,z values)
