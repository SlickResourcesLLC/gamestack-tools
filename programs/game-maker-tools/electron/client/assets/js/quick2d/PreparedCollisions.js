


let SpriteCollisions = {

    fourway:function(obj, collidables, collisionCallback) {

        collisionCallback = collisionCallback || function(){  };

        for(var x = 0; x < collidables.length; x++)
        {
            if(Quazar.Collision.spriteRectanglesCollide(obj, collidables[x]))
            {

                collisionCallback(obj, collidables[x]);

            }
        };

    }

};


