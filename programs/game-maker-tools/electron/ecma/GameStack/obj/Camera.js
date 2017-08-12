/**
 * Created by The Blakes on 04-13-2017
 *
 * Camera : has simple x, y, z, position / Vector, follows a specific sprite
 *
 * *incomplete as of 07-20-2017
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



