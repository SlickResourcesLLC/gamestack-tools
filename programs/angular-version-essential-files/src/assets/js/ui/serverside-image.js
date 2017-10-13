
var __ServerSideImage = {


    animationPreview: function (animation, effects) {

        Canvas.__levelMaker = true;

        var sprite_object = new Sprite(animation);

        // alert(jstr(sprite_object.selected_animation));

        var canvas = document.getElementById('image-test-canvas');

        var ctx = canvas.getContext('2d');

        canvas.width = 180;
        canvas.height = 180;

        sprite_object.active = true;


        console.log(jstr(sprite_object));

        console.log(jstr(sprite_object.selected_animation));



        if(this.image_preview_interval)
        {
            window.clearInterval(this.image_preview_interval);

        }


        this.image_preview_interval = window.setInterval(function(){

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if(effects)
            {
                effects.apply(sprite_object, canvas);

            }


            if(!sprite_object.original_size)
            {
                sprite_object.original_size =new Vector(sprite_object.size);
            }

            sprite_object.size = sprite_object.getCappedSizeXY(Math.round(canvas.width * 0.8), Math.round(canvas.height * 0.8));

            sprite_object.position.x = canvas.width  / 2  - sprite_object.size.x / 2;

            sprite_object.position.y = canvas.height  / 2 - sprite_object.size.y / 2;


            Canvas.draw(sprite_object, ctx);


        }, 20);

    },

    getRawImageFile: function (input, callback) {

        var preview = $(input).parent().find('img')[0];
        var file = input.files[0];
        var reader = new FileReader();

        reader.addEventListener("load", function () {

            preview.src = reader.result;

            preview.onload = function () {

                if (typeof(callback) == 'function') {
                    callback(this);

                }

            }

        }, false);

        if (file) {
            reader.readAsDataURL(file);
        }


    },


    image_upload:function(filename, content, callback)
    {

        if(content.src)
        {

            content = content.src;

        }

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

    },



    image_post_persistent:function(filename, content, callback)
    {

        if(content.src)
        {

            content = content.src;

        }

        // Assign handlers immediately after making the request,
        // and remember the jqxhr object for this request
        var jqxhr = $.post( 'http://localhost:3137/save-image-persistent', {filename:filename, content:content}, function(data) {

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


