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

    add(item)
    {

        if(typeof(item.engage) == 'function')
        {
           this.list.push(item);

        }

       else if(typeof(item.fire) == 'function')
        {
            this.list.push(item);

        }

       else if(typeof(item.start) == 'function')
        {
            this.list.push(item);

        }

       else if(typeof(item.run) == 'function')
        {
            this.list.push(item);

        }

       else if(typeof(item.process) == 'function')
        {
            this.list.push(item);

        }


    }

    call()
    {
        $.each(this.list, function (ix, item) {


            if(typeof(item.engage) == 'function')
            {
                item.engage();

            }

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










