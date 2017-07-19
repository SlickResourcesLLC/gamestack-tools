/**
 * Created by The Blakes on 04-13-2017
 *
 */


class GravityOption {
    constructor(args) {

    }

    getArg(args, key, fallback) {

        if (args.hasOwnProperty(key)) {

            return args[key];

        }
        else {
            return fallback;

        }

    }

    onFire()
    {


    }

}










