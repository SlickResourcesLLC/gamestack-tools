

$(document).ready( function(){

    console.log('Applying right-click interface');

    var objectFunctionsToRightClickSubMenu = function(obj)
    {
        var subMenu = [];

        var createSubMenuObject = function(key, call)
        {

            return{

                name: key,
                title: key,
                img: 'img/settings_icon.png',
                fun: call
            }

        };

        for(var x in obj) {

            if (typeof obj[x] == 'function') {

                subMenu.push(createSubMenuObject(x, obj[x]));

            }
            else if (typeof obj[x] == 'object') {

                for (var y in obj[x]) {


                    if (typeof obj[x][y] == 'function') {

                        subMenu.push(createSubMenuObject(x, obj[x]));

                    }
                    else if (typeof obj[x][y] == 'object') {

                        for (var z in obj[x][y]) {


                            if (typeof obj[x][y][z] == 'function') {

                                subMenu.push(createSubMenuObject(x, obj[x]));

                            }


                        }

                    }


                }

            }

        }

        return subMenu;

    };


    //For example we are defining menu in object. You can also define it on Ul list. See on documentation.
    var __rightClickInterface = [{
        name: 'delete',
        img: 'img/cross_icon.png',
        title: 'delete button',
        id:'delete',
        class:'delete',
        fun: function () {

            levelMaker.removeLast();

        }
    },

        {
            name: 'Selected_Sprite...',
            img: 'image/sprite_icon.png',
            title: 'Selected_Sprite...',
            subMenu: [{
                name: 'Clone_To_New_Map_Object',
                title: 'Clone To Map Object',
                img: 'img/settings_icon.png',
                fun: function () {
                    alert('Now show option select of all map object(s)')
                }
            },
                {
                    name: 'Edit_As_Single_Object',
                    title: 'Edit Selected Object',
                    img: 'img/settings_icon.png',
                    fun: function () {
                        alert('TODO: edit object(s)')
                    }
                },

                {
                    name: 'Object_Initializer_Option...',
                    title: 'Apply features on init.',
                    img: 'img/settings_icon.png',
                    // disable: true,
                    subMenu: objectFunctionsToRightClickSubMenu(Quazar.options.SpriteInitializers)
                }]
        },

        {
            name: 'Disperse_Clones...',
            title: 'Clone Generator',
            subMenu: [{
                name: 'Multi-Sprite Generator',
                title: 'Formulate large groups of sprites. Add them to the map on the following click.',
                img: 'img/settings_icon.png',
                fun: function () {
                    alert('Apply the auto-place form...')
                }
            }

            ]
        }

    ];

    //Calling context menu
    $('body canvas').contextMenu(__rightClickInterface,{triggerOn:'contextmenu'});

    //create the right click interface

});

