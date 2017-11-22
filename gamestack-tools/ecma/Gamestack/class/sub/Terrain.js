
class Terrain extends Sprite
{
    constructor(args={})
    {
        super(args); //init as Sprite()

        this.collision_type = args.collision_type || "FULL_COLLIDE" || "TOP_COLLIDE" || "NO_COLLIDE";

    }

    onCollide()
    {




    }

}