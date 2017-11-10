
var App = App || {};

var get_selected_sprites = function()
{
    //return the public Game.sprites[0], within an array

    return [Game.sprites[0]];
};

var spriteInitializersSubMenu = function(obj, spriteGroupGetter)
{

    var subMenu = [];


    var createSubMenuLevel = function(key)
    {
        //determine the img path
        var img = key.toLowerCase().indexOf('control') >= 0 ? /*is conroller function*/ 'image/controller_icon.png' : 'image/settings_icon.png';

        return {

            name: key,

            title: key, //must be applicable to sprite.onInit();
            img: img,

            subMenu:[]
        }



    };

    var createSubMenuObject = function(key, call)
    {

        //determine the img path
        var img = key.toLowerCase().indexOf('control') >= 0 ? /*is conroller function*/ 'image/controller_icon.png' : 'image/settings_icon.png';

        return{

            name: key,

            title: key, //must be applicable to sprite.onInit();

            img: img,

            fun: function(){

                var sprites = spriteGroupGetter();

                var __inst = this;

                if(sprites.length) {

                    $.each(sprites, function (ix, item) {

                        sprites[ix].onInit(__inst.title);

                        if(spriteGroupGetter == get_selected_sprites) //these are active sprites
                        {
                            sprites[ix].init();

                        }
                        // item.onInit(__inst.title);
                    });

                }
                else
                {
                    alert('Must have selected sprites: use SHIFT + left-click');

                }


            }
        }

    };

    var addItem = function(key, obj, subMenu)
    {
        var rcItem = createSubMenuObject(key, obj);

        subMenu.push(rcItem);

    };

    for(var x in obj) {

        if (typeof obj[x] == 'function') {

            addItem(x, obj[x], subMenu);

        }
        else if (typeof obj[x] == 'object') {

            var nextLevel = createSubMenuLevel(x);

            subMenu.push(nextLevel);

            for (var y in obj[x]) {

                if (typeof obj[x][y] == 'function') {

                    addItem(x+"." + y, obj[x][y], nextLevel.subMenu);

                }
                else if (typeof obj[x][y] == 'object') {

                    var nextLevel = createSubMenuLevel(x+"." + y );

                    subMenu.push(nextLevel);

                    for (var z in obj[x][y]) {

                        if (typeof obj[x][y][z] == 'function') {

                            addItem(x+"." + y + '.' + z, obj[x][y][z], nextLevel.subMenu);

                        }


                    }

                }


            }

        }

    }

    return subMenu;

};


function __allMainCallablesSubMenu()
{

    return [];
}

function __getSelectedRightClickItemSubMenu()
{

    var app = !App ? {} : App, item =  app.selectedRightClickItem || {name:"__blank"};

    return[

        {
            name: 'bind_events...',
            title: 'bind main-call of item to another event',
            img: 'image/settings_icon.png',
            id:'Event_Binder',
            // disable: true,
            fun:function(){   //test
                var g =   DatGui.allCallablesCheckGui(App.selectedRightClickItem, [Game.sprites[0]], 'Bind Events To:');

                App.showGui(g.domElement);
            }
        }
    ]

};

//For example we are defining menu in object. You can also define it on Ul list. See on documentation.
var __rightClickInterface = [{
    name: 'ComboCall_Builder',
    img: 'image/multiple_icon.png',
    title: 'combo_builder',
    id:'ComboCall_Builder',

    fun: function () {

        alert('complete the combo builder');

    }
},

    {
        name: 'Sprite...',
        img: 'image/sprite_icon.png',
        title: 'sprite',
        id:'Sprite',

       subMenu:[

           {
               name: 'Apply Sprite_Initializer(s)...',
               title: 'Apply feature/behavior on init.',
               img: 'image/settings_icon.png',
               // disable: true,
               subMenu: spriteInitializersSubMenu(GameStack.options.SpriteInitializers, get_selected_sprites)
           },

           {
               name: 'New JavaScript Update',
               title: 'Apply code to the sprite-update.',
               img: 'image/settings_icon.png',
               // disable: true,
              fun:function()
              {

                 App.showScriptEditor();

              }
           }

       ]
    },



]


var __rightClickInterfaceOnSelectedObject= [
    {
        name: 'Selected Object...',
        img: 'image/settings_icon.png',
        title: 'selected_item_settings',
        id:'selected_item_settings',

       subMenu:__getSelectedRightClickItemSubMenu()
    }

];



var __rightClickInterfaceOnSprite = [
    {
        name: 'Edit Sprite Settings',
        img: 'image/sprite_icon.png',
        title: 'sprite_settings',
        id:'sprite_settings',

        fun:function(){

            var gui = DatGui.mainSpriteSettingsGui(Game.sprites[0]);

            App.showGui(gui.domElement);

        }
    }

];




$(document).ready( function(){

    console.log('Applying right-click interface');

    if(Gamestack.CONTEXT_MENU) {

        $(document).bind('contextmenu', function () {

        });

        //Calling context menu
        $('#gs-container').contextMenu(__rightClickInterface, {triggerOn: 'contextmenu'});

        $('#controllable ul li').contextMenu(__rightClickInterfaceOnSelectedObject, {triggerOn: 'contextmenu'});

        $('#sprite_settings').contextMenu(__rightClickInterfaceOnSprite, {triggerOn: 'contextmenu'});

        //Calling context menu

    }


});

