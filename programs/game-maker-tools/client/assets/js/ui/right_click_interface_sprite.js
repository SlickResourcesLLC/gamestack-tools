

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
        var img = key.toLowerCase().indexOf('control') >= 0 ? /*is conroller function*/ 'img/controller_icon.png' : 'img/settings_icon.png';

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
        var img = key.toLowerCase().indexOf('control') >= 0 ? /*is conroller function*/ 'img/controller_icon.png' : 'img/settings_icon.png';

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
    name: 'combo_builder',
    img: 'img/cross_icon.png',
    title: 'combo_builder',
    id:'combo_builder',

    fun: function () {

        alert('complete the combo builder');

    }
},

    {
        name: 'add_action_resources',
        img: 'img/cross_icon.png',
        title: 'add_action_resources',
        id:'add_action_resources',

        fun: function () {

            alert('complete the action resources');


        }
    },

    {
        name: 'conversion_to',
        img: 'img/cross_icon.png',
        title: 'conversion_to',
        id:'conversion_to',

        subMenu: [{
            name: 'particle_system',
            img:'images/top.png',
            fun:function(){
                alert('todo-sprite-particle-system');
            }

        }
        ]

    }


    ]


$(document).ready( function(){

    console.log('Applying right-click interface');


    $(document).bind('contextmenu', function(){



    });



    //Calling context menu
    $('body #mainContainer').contextMenu(__rightClickInterface,{triggerOn:'contextmenu'});
    //Calling context menu


});

