
(function ( $ ) {

    $.fn.squeeze = function() {

        $(this).click(function(evt){

            var tabs = $(this).parent().parent().find('.tab-content')[0],

            tabHeader = $(tabs).parent().children('ul')[0];

            $(tabs).toggle('fast');

            var char = $(evt.target).text();

            switch (char)
            {
                case "-":

                    $(evt.target).text('+');

                    $(tabHeader).animate({
                        opacity: 1.0,
                        height: "50px"
                    }, 250);

                    break;

                case "+":

                    $(evt.target).text('-');


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

