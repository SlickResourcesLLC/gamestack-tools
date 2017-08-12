






var rightClickDisplayCalls = {

    assertCheckedSiblingOf:function(element){ //takes li element

        console.log('check assertion: one sibling must be checked');

        if(!$(element).siblings().find('span.check').length)
        {

            $(element).append('<span style="color:green; float:right;" class="check">&#10004;</span>');


        }

    },


    showExclusiveCheck:function(element){ //takes li element

        $(element).parent().find('span.check').remove();

        $(element).append('<span style="color:green; float:right;" class="check">&#10004;</span>');

    },

    toggleCheckAndBoolCall:function(element, boolCall){ //takes li element

        boolCall = boolCall || function(){};

        if($(element).find('span.check').length)
        {
            $(element).remove('span.check');

            boolCall(false);

        }

        $(element).append('<span style="color:green; float:right;" class="check">&#10004;</span>');

    }


};


function getRCItemByKey(key, obj)
{

    for(var x in obj)
    {

        if(obj[x].name == key)
        {
            return obj[x];
        }

        if(typeof obj[x]=='object') {

            for (var y in obj[x]) {

                if(obj[x][y].name == key)
                {
                    return obj[x][y];
                }

                if(typeof obj[x][y]=='object') {

                    for (var z in obj[x][y]) {

                        if(obj[x][y][z].name == key)
                        {

                            return obj[x][y][z];

                        }


                    }

                }


            }

        }

    }

};




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




var spriteInitializersSubMenu = function(obj, spriteGroupGetter)
{

    var subMenu = [];

    var createSubMenuObject = function(key, call)
    {

        //determine the img path
        var img = key.toLowerCase().indexOf('control') >= 0 ? /*is conroller function*/ 'img/controller_icon.png' : 'img/settings_icon.png';

        return{

            name: key,

            title: key, //must be applicable to sprite.onInit();

            img: img,

            fun: function(){

                var sprites = spriteGroupGetter();

                var __inst = this;

                $.each(sprites, function(ix, item){

                    item.onInit(__inst.title);

                    item.init();


                });


            }
        }

    };

    var addItem = function(key, obj)
    {
        var rcItem = createSubMenuObject(key, obj);

        subMenu.push(rcItem);

    };



    for(var x in obj) {

        if (typeof obj[x] == 'function') {

          addItem(x, obj[x]);

        }
        else if (typeof obj[x] == 'object') {

            for (var y in obj[x]) {

                if (typeof obj[x][y] == 'function') {



                    addItem(x+"." + y, obj[x][y]);

                }
                else if (typeof obj[x][y] == 'object') {

                    for (var z in obj[x][y]) {

                        if (typeof obj[x][y][z] == 'function') {

                            addItem(x+"." + y + '.' + z, obj[x][y][z]);

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


var get_selected_sprites = function(){  return __levelMaker.all_selected_sprites();};


var get_selected_map_object = function(){  return [__levelMaker.selectedElement];};


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
            name: '1.0',
            title: 'zoom_one',


            checked:false,

            fun: function () {

                $('.level-maker-canvas').css('zoom', '1.0');

                 rightClickDisplayCalls.showExclusiveCheck(this);

            }
        },

            {
                name: '0.5',
                title: '0.5',

                fun: function () {
                    $('.level-maker-canvas').css('zoom', '0.5');


                    rightClickDisplayCalls.showExclusiveCheck(this);


                }
            },

            {
                name: '0.2',
                title: '0.2',

                fun: function () {
                    $('.level-maker-canvas').css('zoom', '0.2');

                    rightClickDisplayCalls.showExclusiveCheck(this);

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
                name: '1px',
                title: 'pixel_snap',

                fun: function () {

                    var number = 1;

                    if(typeof(number) == 'number') {

                        __levelMaker.settings.pixelSnap = number;

                    }

                }
            },

            {
                name: '5px',
                title: 'pixel_snap',

                fun: function () {

                    var number = 5;

                    if(typeof(number) == 'number') {

                        __levelMaker.settings.pixelSnap = number;

                    }

                }
            },

            {
                name: '10px',
                title: 'pixel_snap_one',

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
        name: 'With_Selected_Sprites...',
        img: 'image/sprite_icon.png',
        title: 'Selected_Sprite...',
        disable:true, //reference as getRCItemByKey('With_Selected_Sprites...').disabled = value
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
                subMenu: spriteInitializersSubMenu(Quazar.options.SpriteInitializers, get_selected_sprites)
            }]
    },




];


$(document).ready( function(){

    console.log('Applying right-click interface');


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
        },
        {
            name: 'Apply Sprite_Initializer(s)...',
            title: 'Apply features on init.',
            img: 'img/settings_icon.png',
            // disable: true,
            subMenu: spriteInitializersSubMenu(Quazar.options.SpriteInitializers, get_selected_map_object)
        }
        ];


    App.refreshRightClick = function()
    {
        $('.iw-contextMenu').remove();

        //Calling context menu
        $('body .map-list').contextMenu(__mapListRightClickInterface,{triggerOn:'contextmenu'});

        //Calling context menu

        $('body canvas').contextMenu(__rightClickInterface,{triggerOn:'contextmenu'});

        rightClickDisplayCalls.assertCheckedSiblingOf($('li[title="zoom_one"]'));

        rightClickDisplayCalls.assertCheckedSiblingOf($('li[title="pixel_snap_one"]'));

    };

    App.refreshRightClick();


});

