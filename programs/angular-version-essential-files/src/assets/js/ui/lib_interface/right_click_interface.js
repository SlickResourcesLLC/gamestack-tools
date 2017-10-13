

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



var __contextMenuData = {};


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

        var disp = {
            zero_space:0,
            eighth_size_space:0.125,
            quarter_size_space:0.25,
            half_size_space:0.5,
            full_size_space:1.0,
            double_2X_space:2.0,
            quad_4X_space:4.0
        };

        for(var x2 in dirs)
        {
            var subobj = {};

            subobj.name = "line_" + dirs[x2];

            subobj.id = "line_" + x;

            subobj.title = "line_" + dirs[x2];

            subobj.subMenu = [];

            for(var x3 in disp)
            {
                var subobj2 = {};

                subobj2.name = x3;

                subobj2.id =  disp[x3];

               subobj2.json = {disp:disp[x3], count:x, dir:x2};

                subobj2.fun = function()
                {

                   var data = $(this).data();

                    var sprite = get_selected_map_object()[0];

                    var distX = sprite.size.x * data.disp,

                        distY = sprite.size.y * data.disp;

                    var count = data.count;

                    var north = data.dir.indexOf('up') >= 0 || false;

                    var south = data.dir.indexOf('down') >= 0 || false;

                    var east = data.dir.indexOf('right') >= 0 || false;

                    var west = data.dir.indexOf('left') >= 0 || false;

                    __levelMaker.leftClickExtra = function () {

                        var x = __levelMaker.mouse.x, y = __levelMaker.mouse.y;

                        __levelMaker.placeGroup(x, y, distX, distY, count, north, south, east, west)

                      if(__levelMaker.blink){  window.clearInterval(__levelMaker.blink); }

                    };

                    __levelMaker.blink = window.setInterval(function () {

                        __levelMaker.hover_selection_sprite.active = __levelMaker.hover_selection_sprite.active ? false : true;

                    }, 350);

                }

                subobj.subMenu.push(subobj2);


            }



            obj.subMenu.push(subobj);


        }

        subMenu.push(obj);

    }

    return subMenu;
};

var __clonesSubMenu = getClonesSubMenu();

var spriteInitializersSubMenu = function(obj, spriteGroupGetter)
{

    var subMenu = [];


    var createSubMenuLevel = function(key)
    {

        //determine the img path
        var img = key.toLowerCase().indexOf('control') >= 0 ? /*is conroller function*/ 'assets/css/img/controller_icon.png' : 'assets/css/img/settings_icon.png';

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
        var img = key.toLowerCase().indexOf('control') >= 0 ? /*is conroller function*/ 'assets/css/img/controller_icon.png' : 'assets/css/img/settings_icon.png';

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
    img: 'assets/css/img/cross_icon.png',
    title: 'delete button',
    id:'delete',

    fun: function () {

        __levelMaker.removeLast();

    }
},

    {
        name: 'Zoom',
        img: 'assets/css/img/target-blue.png',
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
        img: 'assets/css/img/target-green.png',
        title: 'pixel snap button',
        id:'pixel_snap',

        subMenu: [

            {
                name: '1px',
                title: 'pixel_snap',

                fun: function () {

                    var number = 1;

                    if(typeof(number) == 'number') {

                        __levelMaker.settings.pixelSnapX = number;

                        __levelMaker.settings.pixelSnapY = number;

                        rightClickDisplayCalls.showExclusiveCheck($(this));

                    }

                }
            },

            {
                name: '5px',
                title: 'pixel_snap',

                fun: function () {

                    var number = 5;

                    if(typeof(number) == 'number') {

                        __levelMaker.settings.pixelSnapX = number;

                        __levelMaker.settings.pixelSnapY = number;

                        rightClickDisplayCalls.showExclusiveCheck($(this));

                    }

                }
            },

            {
                name: '10px',
                title: 'pixel_snap_one',
                fun: function () {

                    var number = 10;

                    if(typeof(number) == 'number') {

                        __levelMaker.settings.pixelSnapX = number;

                        __levelMaker.settings.pixelSnapY = number;

                        rightClickDisplayCalls.showExclusiveCheck($(this));

                    }

                }
            },

            {
                name: '20px',
                title: 'pixel_snap',
                fun: function () {

                    var number = 20;

                    if(typeof(number) == 'number') {

                        __levelMaker.settings.pixelSnapX = number;

                        __levelMaker.settings.pixelSnapY = number;

                        rightClickDisplayCalls.showExclusiveCheck($(this));

                    }

                }
            },

            {
                name: '50px',
                title: 'pixel_snap',
                fun: function () {

                    var number = 50;

                    if(typeof(number) == 'number') {

                        __levelMaker.settings.pixelSnapX = number;

                        __levelMaker.settings.pixelSnapY = number;

                        rightClickDisplayCalls.showExclusiveCheck($(this));

                    }

                }
            },

            {
                name: '1/8 object size',
                title: 'pixel_snap',
                fun: function () {

                    var numberX = Math.ceil(__levelMaker.selectedElement.size.x / 8),

                        numberY = Math.ceil(__levelMaker.selectedElement.size.y / 8);

                    if(typeof(numberX) == 'number') {

                        __levelMaker.settings.pixelSnapX = numberX;

                    }

                    if(typeof(numberY) == 'number') {

                        __levelMaker.settings.pixelSnapY = numberY;

                        rightClickDisplayCalls.showExclusiveCheck($(this));

                    }

                }
            },

            {
                name: '1/4 object size',
                title: 'pixel_snap',

                fun: function () {

                    var numberX = Math.ceil(__levelMaker.selectedElement.size.x / 4),

                        numberY = Math.ceil(__levelMaker.selectedElement.size.y / 4);

                    if(typeof(numberX) == 'number') {

                        __levelMaker.settings.pixelSnapX = numberX;

                    }

                    if(typeof(numberY) == 'number') {

                        __levelMaker.settings.pixelSnapY = numberY;

                        rightClickDisplayCalls.showExclusiveCheck($(this));

                    }

                }
            },

            {
                name: '1/2 object size',
                title: 'pixel_snap',

                fun: function () {

                    var numberX = Math.ceil(__levelMaker.selectedElement.size.x / 2),

                        numberY = Math.ceil(__levelMaker.selectedElement.size.y / 2);

                    if(typeof(numberX) == 'number') {

                        __levelMaker.settings.pixelSnapX = numberX;

                    }

                    if(typeof(numberY) == 'number') {

                        __levelMaker.settings.pixelSnapY = numberY;

                        rightClickDisplayCalls.showExclusiveCheck($(this));

                    }


                }
            }

        ]


    },

    {
        name: 'Place Array-Clones' ,
        img: 'assets/css/img/target-green.png',
        title: 'place_array_clones',
        id: 'place_array_clones',

        subMenu: __clonesSubMenu

    },

    {
        name: 'With_Selected_Sprites...',
        img: 'assets/css/img/sprite_icon.png',
        title: 'Selected_Sprite...',
        disable: false,
        subMenu: [
            {
                name: 'Delete',
                title: 'Delete Selected Objects',
                img: 'assets/css/img/cross_icon.png',
                fun: function () {

                    var sprites = get_selected_sprites();

                    if (sprites.length >= 1) {
                        __levelMaker.removeList(get_selected_sprites());

                    }
                    else {
                        alert('Nothing selected. Sprites must be SHIFT + left-clicked to select.');

                    }

                }
            }

            ,

            {
                name: 'Rotate +45 degrees',
                title: 'Rotate Selected Objects',
                img: 'assets/css/img/settings_icon.png',
                fun: function () {

                    var sprites = get_selected_sprites();

                    if (sprites.length >= 1) {
                        $.each(sprites, function (ix, item) {

                            item.rotation.x += 45;


                        });

                    }
                    else {
                        alert('Nothing selected. Sprites must be SHIFT + left-clicked to select.');

                    }

                }
            },

                      {
                name: 'Rotate +180 degrees',
                title: 'Rotate Selected Objects',
                img: 'assets/css/img/settings_icon.png',
                fun: function () {

                    var sprites = get_selected_sprites();

                    if (sprites.length >= 1) {
                        $.each(sprites, function (ix, item) {

                            item.rotation.x += 180;


                        });

                    }
                    else {
                        alert('Nothing selected. Sprites must be SHIFT + left-clicked to select.');

                    }

                }
            },

            {
                name: 'Flip Image Horizontal',
                title: 'Flip Image Horizontal',
                img: 'assets/css/img/settings_icon.png',
                fun: function () {

                    var sprites = get_selected_sprites();

                    if (sprites.length >= 1) {
                        $.each(sprites, function (ix, item) {

                            item.flipX = item.flipX ? false : true;


                        });

                    }
                    else {
                        alert('Nothing selected. Sprites must be SHIFT + left-clicked to select.');

                    }

                }
            },

            {
                name: 'Persistent Rotational Speed',
                title: 'Persistent Rotational Speed',
                img: 'assets/css/img/settings_icon.png',
                fun: function () {

                    var sprites = get_selected_sprites();

                    if (sprites.length >= 1) {

                        App.collectNumber(-20, 20, function(value){

                            $.each(sprites, function (ix, item) {

                                item.rot_speed.x = value;


                            });


                        });

                    }
                    else {
                        alert('Nothing selected. Sprites must be SHIFT + left-clicked to select.');

                    }




                }
            },


            {
                name: 'Apply Sprite_Initializer(s)...',
                title: 'Apply features on init.',
                img: 'assets/css/img/settings_icon.png',
                // disable: true,
                subMenu: spriteInitializersSubMenu(GameStack.options.SpriteInitializers, get_selected_sprites)
            },

        ]

    }

    ]


$(document).ready( function(){

    console.log('Applying right-click interface');


    $(document).bind('contextmenu', function(){



    });


    //For example we are defining menu in object. You can also define it on Ul list. See on documentation.
    var __mapListRightClickInterface = [{
        name: 'delete_MapObject',
        img: 'assets/css/img/cross_icon.png',
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
            img: 'assets/css/img/circle_icon.png',
            title: 'edit Map Object',
            id:'edit',

            fun: function () {
                //TODO: edit a single sprite with dat.GUI.interface.js();

                if(confirm('This will effect all objects mapped from:' + __levelMaker.selectedElement.name)){

                    $('#map-item-space form .sprite-space').html('');

                    var sprite = __levelMaker.get(__levelMaker.selectedElement.name);

                    var sprite_gui = DatGui.getLevelObjectGui(__levelMaker.get(__levelMaker.selectedElement.name));

                    $('#map-item-space form .sprite-space').append($(sprite_gui.domElement));

                    $('#map-item-space .title').text("Edit Existing Map Item Sprite");

                    $('#map-item-space form').show();

                    $('#map-item-space  button#close').click(function(){

                        $('#map-item-space form').hide('fast');

                    });

                    $('#map-item-space  button.ok').click(function(){

                        __levelMaker.addLevelObjectToUI(sprite,true);

                        $('#map-item-space form').hide('fast');

                    });

                    $('#map-item-space #ok-cancel-space').hide();

                    $('#map-item-space #just-ok-space').show();


                }else{

                    //do nothing

                };


            }
        },
        {
            name: 'Apply Sprite_Initializer(s)...',
            title: 'Apply features on init.',
            img: 'assets/css/img/settings_icon.png',
            // disable: true,
            subMenu: spriteInitializersSubMenu(GameStack.options.SpriteInitializers, get_selected_map_object)
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

