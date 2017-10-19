
let Game = __gameInstance || {};

/*****************
 *  ResourceApi():
 *
 *  Dependencies: (1) :
 *      -$JQuery : ajax
 ******************/

class ResourceApi {

    constructor(args) {

        this.__constructors = args.constructors;

        this.__onGet = args.onGet || function(){};

        if(!this.__constructors instanceof Array)
        {

            this.__constructors = [];

        }

    }

    get_all_by_type(constructor, callback)
    {
        this.get(constructor, '*', callback);

    }

    get_all(callback)
    {
        let __inst = this;

        $.each(this.__constructors, function(ix, item){

            __inst.get_all_by_type(item, callback);

        });

    }

    get(constructor, name, callback)
    {
        var c = constructor instanceof String ? c : c.name;

        var __inst = this;

        $.get('/resources/' + c + '/' + name, function(data){

            callback(data);

            if(typeof(__inst.__onGet) == 'function')
            {
                __inst.onGet(data);

            }

        });

    }

    save(constructor, name, contents) //TOTEST:
    {
        var c = constructor instanceof String ? c : c.name;

        if(name.indexOf('.json') >= 0)
        {
            var e = '".json" is not allowed in the name of saved objects';

            alert( e );

            return console.error(e);

        }

        $.post('/resources/' + c + '/' + name + '?', {filename:name, contents:contents}, function(data){

            console.info(jstr(data));

        });

    }

};




