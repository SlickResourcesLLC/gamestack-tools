/*global module:false*/
module.exports = function(portNumber, callback) {

    var app = {

        express: require('express'),

            isInit: false,

            app: {},

        port: portNumber,

            server: false,

            callback: callback,


        get:function(key, callback)
        {

            this.app.get(key,  function(req, res){

                callback(req, res);

            });

        },

        downloadable:function(key, callback)
        {

            this.app.get(key,  function(req, res){

                callback(req, res);

            });

        },


        expressInit: function () {

            this.app = this.express();

            this.server = require('http').Server(this.app);

            // Allow some files to be server over HTTP
            this.app.use(this.express.static(__dirname + '/client'));

            console.log("Express Server / GamestackApi was initialized: Listening on port:" + this.port);

            this.isInit = true;



        }


    };

    app.expressInit();

    app.app.port = app.port;

    if (typeof(callback) == 'function') {
        callback(false, app.app)
    }
    ;




    return app.app;

}





