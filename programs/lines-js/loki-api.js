/*global module:false*/
module.exports = function(expressApp, callback) {

    var loki = require('lokijs');

    var database = {
        entries:[]
    };

    var db = new loki('storage.db', {
        autoload: true,
        autoloadCallback : databaseInitialize,
        autosave: true,
        autosaveInterval: 4000
    });

// implement the autoloadback referenced in loki constructor
    function databaseInitialize() {

        console.log('Initializing simple loki.js (json-storage) api');

        database.refresh = function() {

            database.entries = db.getCollection("entries");
            if (database.entries === null) {
                database.entries = db.addCollection("entries");
            }

        };

        database.add = function(obj)
        {

            this.storage.insert(obj);

        };

      expressApp.get('/entries-by-type?', function(req, res){ //get entry by type


          res.end('ENTRIES-BY-TYPE__TODO');

      });

        expressApp.post('/entry-update-by-type-and-contents?', function(req, res){ //post/edit entry by type


            res.end('ENTRY-UPDATE__TODO');

        });

        expressApp.post('/entry-delete-by-type-and-contents?', function(req, res){ //delete entry by type

            res.end('ENTRY-DELETE__TODO');

        });

        //SERVER LISTENS
        expressApp.listen(expressApp.port);
        callback();

    }

    return;

}





