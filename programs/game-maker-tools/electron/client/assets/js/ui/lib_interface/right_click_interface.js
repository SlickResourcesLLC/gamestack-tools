

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



    var getClonesSubMenu = function()
    {

        var subMenu = [];

        for(var x = 1; x < 10; x++)
        {

            var obj = {};

            obj.name = "create_" + x;

            obj.id = "create_" + x;

            obj.title = "create_" + x;

            obj.subMenu = [];

            var dirs = {
                up_left:"Diag-Up-Left &#8598;",
                up:"Up &#8593;",
                up_right:"Diag-Up-Right &#8599;",
                left:"Left &#8592;",
                down_left:"Diag-Up-Left &#8598;",
                down:"Down &#8595;",
                down_right:"Diag-Down-Right &#8601;",
                right:"Right &#8594;"
            };

            for(var x2 in dirs)
            {

                var subobj = {};

                subobj.name = "line_" + dirs[x2];

                subobj.id = "line_" + x;

                subobj.title = "line_" + dirs[x2];

                subobj.fun = function()
                {

                    alert('TODO: make clones');

                }

                obj.subMenu.push(subobj);


            }

            subMenu.push(obj);

        }

        return subMenu;
    };

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

            subMenu: [
                {
                    name: '10px',
                    title: 'pixel_snap',
                    fun: function () {

                        var number = 10;

                        if(typeof(number) == 'number') {

                            __levelMaker.settings.pixelSnap = number;

                        }

                    }
                },

                {
                    name: '20px',
                    title: 'pixel_snap',
                    fun: function () {

                        var number = 20;

                        if(typeof(number) == 'number') {

                            __levelMaker.settings.pixelSnap = number;

                        }

                    }
                },

                {
                    name: '50px',
                    title: 'pixel_snap',
                    fun: function () {

                        var number = 50;

                        if(typeof(number) == 'number') {

                            __levelMaker.settings.pixelSnap = number;

                        }

                    }
                },

                {
                name: '1/8 object size',
                title: 'pixel_snap',
                fun: function () {

                    var number = Math.ceil(__levelMaker.selectedElement.size.x / 8);

                    if(typeof(number) == 'number') {

                        __levelMaker.settings.pixelSnap = number;

                    }

                }
            },

                {
                    name: '1/4 object size',
                    title: 'pixel_snap',

                    fun: function () {

                        var number = Math.ceil(__levelMaker.selectedElement.size.x / 4);

                        if(typeof(number) == 'number') {

                            __levelMaker.settings.pixelSnap = number;

                        }

                    }
                },

                {
                    name: '1/2 object size',
                    title: 'pixel_snap',

                    fun: function () {

                        var number = Math.ceil(__levelMaker.selectedElement.size.x / 2);

                        if(typeof(number) == 'number') {

                            __levelMaker.settings.pixelSnap = number;

                        }

                    }
                }

            ]


        },

        {
            name: 'With_Selected_Map_Item...',
            img: 'image/sprite_icon.png',
            title: 'Selected_Sprite...',
            subMenu: [{
                name: 'Create Clones (Next Click)',
                title: 'Create Clones',
                img: 'img/target-green.png',

                subMenu:getClonesSubMenu()

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

