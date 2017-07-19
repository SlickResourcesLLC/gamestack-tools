/**
 * Created by The Blakes on 6/16/2017.
 */

var opn = require('opn');


require(__dirname +  '/static-express.js')(3137, function(){



// opens the url in the default browser
    opn('http://localhost:3137/tools/' + 'level-maker.html');


    
});

