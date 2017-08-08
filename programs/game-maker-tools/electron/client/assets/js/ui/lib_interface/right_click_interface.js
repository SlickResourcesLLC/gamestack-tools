

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

                        subMenu.push(createSubMenuObject(x, obj[x][y]));

                    }
                    else if (typeof obj[x][y] == 'object') {

                        for (var z in obj[x][y]) {


                            if (typeof obj[x][y][z] == 'function') {

                                subMenu.push(createSubMenuObject(x, obj[x][y][z]));

                            }


                        }

                    }


                }

            }

        }

        return subMenu;

    };


    var alterMenu= function(name, callback)
    {

        for(var x = 0; x < __rightClickInterface.length; x++)
        {
            if(__rightClickInterface[x].name == name)
            {
                callback(__rightClickInterface[x]);

            }

        }

    };


    $(document).bind('contextmenu', function(){



    });





    //For example we are defining menu in object. You can also define it on Ul list. See on documentation.
    var __mapListRightClickInterface = [{
        name: 'delete_MapObject',
        img: 'img/cross_icon.png',
        title: 'delete button',
        id:'delete',

        fun: function () {


            if(confirm('Delete Map_Object:' + __levelMaker.selectedElement.name + '?')){

               alert('TODO: code the deletion');

            }else{

                //do nothing

            };

        }
    },

        {
            name: 'Edit_MapObject',
            img: 'img/circle_icon.png',
            title: 'edit Map Object',
            id:'edit',

            fun: function () {
                //TODO: edit a single sprite with dat.GUI.interface.js();

                if(confirm('This will effect all objects mapped from:' + __levelMaker.selectedElement.name)){

                    DatGui.getLevelEdit('mapobject', __levelMaker.selectedElement);

                }else{

                    //do nothing

                };


            }
        }

        ];




    //Calling context menu
    $('body .map-list').contextMenu(__mapListRightClickInterface,{triggerOn:'contextmenu'});







    //For example we are defining menu in object. You can also define it on Ul list. See on documentation.
    var __rightClickInterface = [{
        name: 'delete_previous',
        img: 'img/cross_icon.png',
        title: 'delete button',
        id:'delete',

        fun: function () {

            __levelMaker.removeLast();

        }
    },


        {
            name: 'Zoom',
            img: 'img/target-blue.png',
            title: 'zoom button',
            id:'zoom',

            subMenu: [{
                name: '0.2',
                title: '0.2',

                fun: function () {
                    $('.level-maker-canvas').css('zoom', '0.2');
                }
            },

                {
                    name: '0.5',
                    title: '0.5',

                    fun: function () {
                        $('.level-maker-canvas').css('zoom', '0.5');
                    }
                },

                {
                    name: '1.0',
                    title: '1.0',

                    fun: function () {
                        $('.level-maker-canvas').css('zoom', '1.0');
                    }
                }

            ]


        },

        {
            name: 'Set-Pixel-Snap-Size',
            img: 'img/target-green.png',
            title: 'pixel snap button',
            id:'pixel_snap',

            subMenu: [{
                name: '1/8 object size',
                title: '0.2',
                fun: function () {

                    console.info('DEV-TODO');

                }
            },

                {
                    name: '1/4 object size',
                    title: '1/4 object size',

                    fun: function () {

                        console.info('DEV-TODO');

                    }
                },

                {
                    name: '1/2 object size',
                    title: '1/4 object size',

                    fun: function () {

                        console.info('DEV-TODO');

                    }
                }

            ]


        },

        {
            name: 'With_Selected_Map_Items...',
            img: 'image/sprite_icon.png',
            title: 'Selected_Sprite...',
            subMenu: [{
                name: 'Clone_To_New_Map_Object',
                title: 'Clone To Map Object',
                img: 'img/target-green.png',
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
            name: 'With_Selected_Sprites...',
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




    ];

    //Calling context menu
    $('body canvas').contextMenu(__rightClickInterface,{triggerOn:'contextmenu'});

    //create the right click interface

});

