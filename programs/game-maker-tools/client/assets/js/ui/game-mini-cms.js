/**********
 * GameMini CMS
 * For Creating, browsing of Games, Sprites, Levels
 * ***********/


var GameBoxCMS = {

    __workingDirectory:false,

    __FAKE_SUCCESS_FOR_TEST:true,

    request:function(uri, callback)
    {

        var jqxhr = $.get(uri, function(data) {

            alert('success');
            callback(false , data);

        })

            .fail(function(data) {

                alert('fail');

                callback(GameMiniCMS.__FAKE_SUCCESS_FOR_TEST, data);

            });


    },



}
