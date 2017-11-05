/**********
 *
 * deps:
 * 	-DatGui (dat.gui.interface.js)
 *
 * ***********/


Gamestack.onKeys = [

    "collision",

    "gp_button",

    "gp_stick",

    "stat"
];





function EventBuilder(name, parent, options)
{

    var on = options.on || "button";

    var arg1 = options.arg1 || 0;

    var arg2 = options.arg1 || 1;

    /*
    * Event examples:
    *

     new Event("attack_1", myFakeSprite, {

        on:"collision",

       arg1:"0" //Gamepad index, single player

     arg2:"1" //Button index,

     onTriggered:function()
     {



     }

     });

    *
    * */


  this.Event = function(){

      return {

          name: "sampleEvent",

          on: on,

          arg1: arg1,

          arg2: arg2,

          fun: function () {

              alert('event triggered');

          },

          trigger: function () {


          },

          suspend: function () {

              alert('event suspended');

          },

          onSuspended:function()
          {


          },

          onTriggered:function(fun)
          {
              this.fun = fun;

          }

      }

  }



};