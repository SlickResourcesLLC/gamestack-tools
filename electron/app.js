/**
 * Created by The Blakes on 6/16/2017.
 */


module.exports = function() {


   require(__dirname + '/static-express.js')(3137, function (err, app) {

       var fs = require('fs');

       var express = require('express');




       console.log("Initializing");

       var bodyParser = require('body-parser');
       app.use(bodyParser.json()); // support json encoded bodies
       app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


       app.get('/test', function (req, res) {


           res.end('done');


       });



       app.post('/save', function(req, res){

           var content = req.body.content;

           var filename = req.body.filename;

           var writer = fs.createWriteStream(filename);

           res.writeHead(200, {'Content-Type': 'application/force-download','Content-disposition':'attachment; filename='+filename});

           res.end(content);

       });



       app.post('/save-map-options', function (req, res) {

            var data = req.body.data;

            var data_test = {};

            if (data) {
                try {

                    data_test = JSON.parse(data);

                    var path = __dirname + '/client/assets/system-data/level-maker-2d-options.json';

                    fs.writeFile(path, data, function (err) {
                        if (err) return console.log(err);
                        console.log('File:' + path + ' was saved');

                        res.end('done');

                    });




                }

                catch(e)
                {

                    console.log(e);



                    res.end('failed');

                }



            }
            else
            {
                res.end('failed');

            }



        });


       console.log('listing:' + app.port);

       app.listen(app.port);


    });


};

