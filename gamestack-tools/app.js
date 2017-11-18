/**
 * Created by The Blakes on 6/16/2017.
 */

module.exports = function(openNow) {

   require(__dirname + '/static-express.js')(3137, function (err, app) {

       var fs = require('fs');

       var express = require('express');

       console.log("Initializing");

       var bodyParser = require('body-parser');

       app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
       app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

       app.get('/test', function (req, res) {


           res.end('done');


       });

       function decodeBase64Image(dataString) {
           var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
               response = {};

           if (matches.length !== 3) {
               return new Error('Invalid input string');
           }

           response.type = matches[1];
           response.data = new Buffer(matches[2], 'base64');

           return response;
       }

       app.post('/save', function(req, res){

           var content = req.body.content, filename = req.body.filename, type = req.body.type;

           var relpath = 'client/assets/file_storage/' + filename;

           var dataString = content;

           if(filename.toLowerCase().indexOf('.mp3') >= 0)
           {
               var response = {};
               response.data = new Buffer(dataString, 'base64');

               response.type = "audo/mp3";

               // Save decoded binary image to disk
               try {
                   require('fs').writeFile(relpath, response.data,
                       function () {
                           console.log('DEBUG - feed:message: Saved to disk image attached by user:', relpath);

                           res.end(JSON.stringify({relpath: relpath, content: content}));

                       });
               }
               catch (error) {
                   console.log('ERROR:', error);

                   res.end('save-file: error:' + error);
               }


           }

           if(filename.indexOf('.json') >= 0)
           {
               // Save decoded binary image to disk
               try
               {
                   if(type && ['Level', 'Sprite', 'Background', 'Terrain', 'Interactive', 'Sound', 'GameImage'].indexOf(type.toLowerCase()))
                   {
                       relpath = relpath.replace('/file_storage/', '/game/json/' + type.toLowerCase() + "/");

                   }

                   require('fs').writeFile(relpath, content,
                       function()
                       {
                           console.log('DEBUG - feed:message: Saved to disk json attached by user:', relpath);

                           var path = __dirname +  "/" + relpath;

                           res.end(JSON.stringify({action:"download", status:"complete", path:path}));

                           // res.end(JSON.stringify({relpath:relpath, content:content}));

                       });
               }
               catch(error)
               {
                   console.log('ERROR:', error);
               }

           }

           else {
               // Save base64 image to disk
               try {
                   // Decoding base-64 image
                   // Source: http://stackoverflow.com/questions/20267939/nodejs-write-base64-image-file
                   function decodeBase64Image(dataString) {
                       var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
                       var response = {};

                       if (matches.length !== 3) {
                           return false;
                       }

                       response.type = matches[1];
                       response.data = new Buffer(matches[2], 'base64');

                       return response;
                   }

                   // Regular expression for image type:
                   // This regular image extracts the "jpeg" from "image/jpeg"
                   var imageTypeRegularExpression = /\/(.*?)$/;

                   // Generate random string
                   var crypto = require('crypto');
                   var seed = crypto.randomBytes(20);
                   var uniqueSHA1String = crypto
                       .createHash('sha1')
                       .update(seed)
                       .digest('hex');

                   var base64Data = dataString;

                   var imageBuffer = decodeBase64Image(base64Data);

                   if (imageBuffer) {

                       var userUploadedFeedMessagesLocation = '../img/upload/feed/';

                       var uniqueRandomImageName = 'image-' + uniqueSHA1String;
                       // This variable is actually an array which has 5 values,
                       // The [1] value is the real image extension
                       var imageTypeDetected = imageBuffer
                           .type
                           .match(imageTypeRegularExpression);

                       var userUploadedImagePath = userUploadedFeedMessagesLocation +
                           uniqueRandomImageName +
                           '.' +
                           imageTypeDetected[1];


                       // Save decoded binary image to disk
                       try {
                           require('fs').writeFile(relpath, imageBuffer.data,
                               function () {
                                   console.log('DEBUG - feed:message: Saved to disk image attached by user:', relpath);

                                   res.end(JSON.stringify({relpath: relpath, content: content}));

                               });
                       }
                       catch (error) {
                           console.log('ERROR:', error);
                       }


                   }


               }
               catch (error) {
                   console.log('ERROR:', error);
               }


           }


       });

       var fs = require('fs');

       function copy(oldPath, newPath) {
           var readStream = fs.createReadStream(oldPath);
           var writeStream = fs.createWriteStream(newPath);

           readStream.on('error', callback);
           writeStream.on('error', callback);

           readStream.on('close', function () {
               fs.unlink(oldPath, callback);
           });

           readStream.pipe(writeStream);
       }

       app.post('/save-image-persistent', function(req, res){

           var content = req.body.content;

           var filename = req.body.filename;

           fs.rename('client/assets/file_storage/' + filename, 'client/assets/system-image-stash/' + filename, function (err) {
               if (err) {
                   if (err.code === 'EXDEV') {
                       copy(oldPath, newPath);

                       res.end(JSON.stringify({relpath: relpath, content: content}));


                   } else {

                       res.end(JSON.stringify({relpath: relpath, content: content}));


                   }
                   return;
               }
               callback();
           });


           setTimeout(function(){


               res.end(JSON.stringify({error:"time-out", relpath: relpath, content: content}));


           }, 10000);


       });

       app.post('/save-object', function (req, res) {

           console.log('received post request:/save-object');

           var data = req.body.data;

           console.log(JSON.stringify(data));

           console.log(data);

           var data_test = {};

           if (data && data.type && data.name && data.object) {

               console.log('had params');

               try {

                   data.name = data.name.replace('.json', '');

                   var path = __dirname +

                       '/client/assets/json/' + data.type + '/' + data.name + '.json';

                   fs.writeFile(path, data.object, function (err) {
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

               res.end('failed params');

           }

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

       console.log('listening at:' + 'http://localhost:3137/main.html');

       app.listen(app.port);

       if(openNow) {

           var opn = require('opn');

           opn('http://localhost:3137/main.html', {app:"chrome"}) // Opens the url in the default browser

       }

   });

};

//call module.exports as a function: --direct-call

module.exports(true);




