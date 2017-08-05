
/*****************
 *  Controls():
 *
 *  Dependencies: (1) :
 *      -Quick2d.GamepadAdapter, HTML5 Gamepad Api
 ******************/

class Controls {

    constructor(args) {


        this.__controller = args.controller;

    }

    extendedCall(call, extension)
    {

        var formerCall = call;

        call = function(){ call(); extension(); };

        return call;

    }

    on(key, callback)
    {

        if(typeof(this.__controller) == 'object' && typeof(this.__controller[key]) == 'function')
        {

            console.info('applying controller function:' + key);

            this.__controller[key] = this.extendedCall(this.__controller[key], callback);

        }
        else
        {
            console.error('could not apply controller function');

        }

    }


};




