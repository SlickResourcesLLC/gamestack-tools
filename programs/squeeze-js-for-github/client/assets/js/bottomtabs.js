
(function ( $ ) {

    var relocate = function(selector, parent){

        if($(selector).length && $(parent).length)
        {
            $(parent).append($(selector));

        }
        else
        {
            alert('no elements');
        }
    };


    $.fn.bottomtabs = function(callback) {

        $(this).click(function(evt){


            callback = callback || function(){};

            var tabs = $(this).parent().parent().find('.tab-content')[0],

            tabHeader = $(tabs).parent().children('ul')[0];

            var button = $(this).parent().find('button.bottom-tabs'),

            char = $(button).text();

            switch (char)
            {
                case "-":

                    if($(this).hasClass('bottom-tabs')) {

                        $(button).text('+');

                        $(tabs).hide('fast');

                        $(tabHeader).animate({
                            opacity: 1.0,
                            height: 50
                        }, 250, function(){  });

                    }

                    break;

                case "+":

                    $(button).text('-');

                    $(tabs).show('fast');

                    $(tabHeader).animate({
                        opacity: 1.0,
                        height: "70%"
                    }, 250, function() {

                        $('.dg.main').animate({
                            opacity: 1.0,
                            zIndex: "9998"
                        }, 100, function () {
                        });

                    });


                        break;

            }



        });

        return this;
    };

}( jQuery ));

