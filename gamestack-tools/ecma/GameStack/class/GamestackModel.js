
class GamestackModel {

    constructor(args={}) {

        this.__isMaster = args.master || args.isMaster || false;

        this.images = args.images || [];

        this.sounds = args.sounds || [];

        this.motions = args.motions || [];

        this.sprites = args.sprites || [];

        this.backgrounds = args.backgrounds || [];

        this.terrains = args.terrains || [];

        this.interactives = args.interactives || [];

    }

    add(object)
    {
        var isAllOfAny = function(list, types)
        {
            for(var x = 0; x < list.length; x++)
            {
                if(![types].indexOf(list[x].constructor.name) >= 0)
                {
                    return false;
                }

            }
            return true;
        };

        if(object instanceof(object))
        {
            object = [object];
        }

        var cleanCheck = isAllOfAny(object, ['Sprite', 'Background', 'Terrain', 'Motion', 'Projectile', 'GameImage', 'Sound']);

        if(!cleanCheck)
        {
            return console.error('Must have: valid contents (Sprite OR [] of Sprite())');
        }

        var __inst = this;

        Gamestack.each(object, function(ix, item){

            switch(item.constructor.name)
            {
                case "Sprite":

                    __inst.sprites.push(item);

                    break;

                case "Background":

                    __inst.background.push(item);

                    break;

                case "Terrain":

                    __inst.terrains.push(item);

                    break;

                case "Interactive":

                    __inst.interactives.push(item);

                    break;

                case "Sound":

                    __inst.sounds.push(item);

                    break;

                case "Motion":

                    __inst.motions.push(item);

                    break;

                case "Projectile":

                    __inst.projectiles.push(item);

                    break;

                case "GameImage":

                    __inst.images.push(item);

                    break;

                default:

                    console.log('GamestackModel.add():UNKNOWN TYPE');
            }

            return;

        });

        this.contents.concat(object)

        return this;
    }

};