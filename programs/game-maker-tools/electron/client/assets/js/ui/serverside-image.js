
var __ServerSideImage = {

    image_upload:function(filename, content, callback)
    {

        if(content.src)
        {
            alert('found src');

        }

        content = content.src;

        // Assign handlers immediately after making the request,
// and remember the jqxhr object for this request
        var jqxhr = $.post( 'http://localhost:3137/save', {filename:filename, content:content}, function(data) {

           // console.log( "upload success:" + jstr(data) );


        })
            .done(function(data) {
                console.log( "second ajax success" );


                var d = JSON.parse(data);

                if(typeof(callback) == 'function')
                {

                    console.log('content len:' + content.length);

                    callback(d.relpath, content);

                }


            })
            .fail(function(e) {
                console.info( "error:" + jstr(e) );
            })
            .always(function() {
                console.log( "ran ajax upload" );
            });

// Perform other work here ...

// Set another completion function for the request above
        jqxhr.always(function() {
            console.log( "always message" );
        });

    }

};


