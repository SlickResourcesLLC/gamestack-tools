/**
 * Camera : has simple x, y, z, position / Vector, follows a specific sprite
 *
 * *TODO : implement camera class
 */


class Camera
{

    constructor(position)
    {

      this.position = GameStack.getArg(args, 'position', GameStack.getArg(args, 'pos', new Vector3(0, 0, 0) ) );

    }

    follow(object, accel, max, distSize)
    {


    }

}



