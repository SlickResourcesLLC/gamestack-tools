
$(document).on('ready', function(){

var selected_interface_object = window.__levelMaker || window.__spriteMaker || window.__objectBrowser || console.error('An interface must be present');

var selected_hotkeys = selected_interface_object.hotkeys || {};

if(window.LevelMaker) //the LevelMaker exists
{

  var run_event = function(MY_HOT_KEY_TAG)
  {

      if(typeof(selected_hotkeys[MY_HOT_KEY_TAG]) == 'function') //run this function if exists
      {
          selected_hotkeys[MY_HOT_KEY_TAG]();
      }

  };



    $(document).bind('keydown', 'shift', function(){


       __levelMaker.shift = true;
    });


    $(document).bind('keyup', 'shift', function(){


        __levelMaker.shift = false;
    });




    $(document).bind('keyup', 'alt+r', function(){

    alert('Rotate the sprite by 90 degrees');

    run_event('alt_r');
});


$(document).bind('keyup', 'alt+f', function(){

    alert('Flip the sprite horizontally');

    run_event('alt_f');

});


$(document).bind('keyup', 'alt+b', function(){

    alert('Select Behaviors');


    run_event('alt_b');
});


$(document).bind('keyup', 'alt+p', function(){

    alert('Select Physics');

    run_event('alt_p');
});


    $(document).bind('keyup', 'alt+c', function(){

        alert('Define Object-Constants'); //constant rotation, velocity, acceleration, etc ::

        run_event('alt_c');
    });


}
});
