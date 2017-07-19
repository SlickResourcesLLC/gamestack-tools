/**
 * Created by The Blakes on 04-13-2017
 *
 */


class Callables {
    constructor(args) {

        this.list = [];

        if(args instanceof Array)
        {
            this.list = args;

        }
        else
        {
            this.list = this.getArg(args, 'list', []);

        }

    }

    getArg(args, key, fallback) {

        if (args.hasOwnProperty(key)) {

            return args[key];

        }
        else {
            return fallback;

        }

    }

    call()
    {
        $.each(this.list, function (ix, item) {

            if(typeof(item.fire) == 'function')
            {
                item.fire();

            }

            if(typeof(item.start) == 'function')
            {
                item.start();

            }

            if(typeof(item.run) == 'function')
            {
                item.run();

            }

            if(typeof(item.process) == 'function')
            {
                item.process();

            }

        });

    }

}










