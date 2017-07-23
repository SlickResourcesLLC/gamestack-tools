
(function ( $ ) {
    $.fn.squeeze = function() {

        $(this).click(function(evt){

            var tabs = $(this).parent().parent().find('.tab-content')[0],

            tabHeader = $(tabs).parent().children('ul')[0];

            var button = $(this).parent().find('button.squeeze'),

            char = $(button).text();

            switch (char)
            {
                case "-":

                    if($(this).hasClass('squeeze')) {

                        $(button).text('+');

                        $(tabs).hide('fast');

                        $(tabHeader).animate({
                            opacity: 1.0,
                            height: "50px"
                        }, 250);

                    }

                    break;

                case "+":

                    $(button).text('-');


                    $(tabs).show('fast');

                    $(tabHeader).animate({
                        opacity: 1.0,
                        height: "70%"
                    }, 250);

                    break;

            }

        });

        return this;
    };

}( jQuery ));

