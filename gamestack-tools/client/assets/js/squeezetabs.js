(function ($) {

    var relocate = function (selector, parent) {

        if ($(selector).length && $(parent).length) {
            $(parent).append($(selector));

        }
        else {
            alert('no elements');
        }
    };


    $.fn.squeeze = function (callback) {

        $(this).unbind().click(function (evt) {

            callback = callback || function () {
                };

            var tabs = $(evt.target).parent().parent().find('.tab-content')[0],

                tabHeader = $(tabs).parent().children('ul')[0];

            var button = $(evt.target).parent().find('button.squeeze'),

                char = $(button).text();

            switch (char) {
                case "-":

                    if ($(evt.target).hasClass('squeeze')) {

                        $(button).text('+');


                        $(tabHeader).animate({
                            opacity: 1.0,
                            height: 50
                        }, 100, function () {

                        });


                        $(tabs).hide('fast', function () {

                            callback(false);

                        });


                    }

                    break;

                case "+":

                    $(button).text('-');

                    $(tabs).show('fast', function () {

                        callback(true);
                    });


                    $(tabHeader).animate({
                        opacity: 1.0,
                        height: "70%"
                    }, 100, function () {

                    });


                    break;

            }

            evt.preventDefault();

            return false;

        });

        return this;
    };

}(jQuery));

