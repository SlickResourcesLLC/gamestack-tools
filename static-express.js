/*global module:false*/
module.exports = function(portNumber, callback) {

    var app = {

        express: require('express'),

            isInit: false,

            app: {},

        port: portNumber,

            server: false,

            callback: callback,

            isAuthenticated: function (user) {

            console.log("Allowing all requests, until Authentication is implemented.");

            return true;

        },

        expressInit: function () {

            this.app = this.express();

            this.server = require('http').Server(this.app);

            // Allow some files to be server over HTTP
            this.app.use(this.express.static(__dirname + '/client'));

            this.app.listen(this.port);

            console.log("Express Server / SlickApi was initialized: Listening on port:" + this.port);

            this.isInit = true;


            if (typeof(this.callback) == 'function') {
                callback(false, this.app)
            }
            ;

        }


    };

    app.expressInit();

    return app;

}





