

/*
 DatGui
    -implements dat.gui
    -live update of properties

* */


var DatGui = {

    gui:false,

    latest_folder:false,

    options:{},

    getArg:function(args, key, fallback)
    {
        return args[key] || fallback;
        
    },


    expandables:[],

    saveable:function(save_callback, remove_callback)
    {


        var guiHTML = $('div.dg.main li'),
        last = $(guiHTML).last();

        $('<button id="save_current_object">Save</button><button id="cancel_current_object">Cancel</button>').insertAfter(last);

        $('#save_current_object').click(function(){  save_callback(); });

        $('#cancel_current_object').click(function(){ $('div.dg.main').last().remove(); remove_callback();  });

    },



    expandOnArray:function(parent, key, cl, save_callback)
    {
        //make parent property expandable

        //modify the GUI to contain a button, allowing a line of added objects for the array


        var __instance = this;

        this.latest_folder = this.main_gui.addFolder(key);

        var obj = {
            add_animation:
            function(){

                alert('hello');

                if(cl == Animation)
                {
                    parent[key].push(new Animation());


                    var len = parent[key].length - 1;



                    var name = parent[key][len].name || 'Animation_' + len;


                    DatGui.expand(parent[key][len], name);

                    __instance.saveable( function(){

                        alert('SAVE CODE GO HERE');

                        $('span').each(function(ix, item){

                            if($(this).text() == 'add_animation')
                            {

                                $(this).parent().append('<button class="sprite_prop">'+name+'</button>');

                            }

                        });

                    });







                }




            }
        };

       this.latest_folder.add(obj,'add_animation');





    },

    each:function(list, callback, flaggedKeys, flaggedTypes)
    {

        if(list instanceof Array)
        {

            for(var x = 0; x < list.length; x++)
            {

                callback(x, list[x]);

            }

        }

        else if(typeof(list) == 'object')
        {


            for(var x in list)
            {

                    console.log('PROCESSING OBJECT');

                    callback(x, list[x]);

            }

        }

    },

    isNumeric(item)
    {

        return !isNaN(item);
    },

    showTweenStack(obj, tween)
    {
        //test TweenStack builder


        var _inst = this;

        var tweenCreate = function(obj, tween)
        {
            var ct = 0;

            Quazar.each(_inst.main_gui.__folders, function(ix, item){

                ct += 1;

            });


            var gui = _inst.main_gui.addFolder('TweenStack_' + ct);


            alert('creating gui for :' + jstr(tween));

           _inst.TweenSelect(Game.player, ['position, rotation', 'pos', 'rot', 'size'], tween, gui);



        };


        tweenCreate(obj, tween);


        $('img.main-add').unbind().click(function (evt) {

            alert('expanding tween');

           tweenCreate(obj, {});

        });





    },

    TweenSelect:function(obj, desprops, tweenstack, gui)
    {

        var props = [], selected_property = false;



        for(var x1 = 0; x1 < desprops.length; x1++)
        {
            if(obj.hasOwnProperty(desprops[x1]))
            {

                var x = desprops[x1];

                if(!isNaN(obj[x]))
                {

                    props.push(x);

                }



                for(var y in obj[x])
                {

                    if(!isNaN(obj[x][y]))
                    {

                        props.push([x,y].join('.'));

                    }



                    for(var z in obj[x][y])
                    {


                        if(!isNaN(obj[x][y][z]))
                        {

                            props.push([x,y,z].join('.'));

                        }



                    }



                }

            }


        };

        var t;

        if(tweenstack.tweens.length == 1)
        {
            t = tweenstack.tweens[0];

        }


        alert(jstr(t));


        gui.add(t, 'property', props).setValue(t.property );

        var n = parseInt(t.targetObject[t.property]);

        if(isNaN(n))
        {
            n = 0;
        }


        gui.add(t.targetObject, t.property, 1).min(-800).max(800).setValue(n);


        var curveOptions = new TweenStack().curveOptionsToArray();

        gui.add(t, 'curve', curveOptions).setValue(t.curve || curveOptions[0]);




        return gui;

    },






    guiCheckables:function(obj, keys)
    {
        //show every key member belonging to the passed obj

        var rels = [];

        Quazar.each(keys, function(kix, key){


            Quazar.each(obj[kix]|| {}, function(ix, item){

                if(ix.indexOf('__') == -1) //The string __ is a flag for special members, treated differently
                {

                    rels.push(item);

                }

            }, /*watch-for*/ ['frameBounds', 'min', 'max'], []);



        });



        return rels;


    },


    /*addTwoLevelsGuiByKey
    *
    * returns --psuedo dat.gui().folder()
    *
    * */


    fuis:{},

    addSrc:function(key, obj, parent, fui)
    {

        if(key == 'src')
        {

            fui.add(parent, key, ['source1.mp3', 'source1.mp3','source1.mp3', 'source1.mp3']);

        }

    },

    onValidFunc(obj, key, call)
    {
        if(typeof(obj) == 'function')
        {
            call();

        }


    },

    addEachNumeric:function(obj, fui)
    {

        this.each(obj, function(ix, o){

            if (DatGui.isNumeric(obj[ix])) {

             var g =  fui.add(obj, ix, -1000, 1000).step(0.2);

            }

        });



    },

    Display:function(name, object)
    {

        this.each(this.__settings, function(ix, item){

            item.show(name, object);

        });

    },

    addEachText:function(obj, fui)
    {

        this.each(obj, function(ix, o){

            if (typeof(obj[ix])=='string') {

                fui.add(obj, ix, obj[ix]);

            }

        });

    },

    fillSelectedObject:function(object)
    {

    },

    expandSelectedObject(object)
    {

        //call object constructor again

        var obj = object.constructor();



    },

    create_id:function()
    {
        var S4 = function() {
            return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        };
        return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());

    },

    typeHandler:function(ix, obj, parent)
    {
        var o = obj,  type = typeof(obj) == 'object' ?  obj.constructor : false;

        var  fui;



        var isParent = function(list)
        {
            return list.indexOf(parent.constructor) >= 0;

        };


        if(type == VectorBounds)
        {

            fui =  DatGui.main_gui.addFolder(ix + '');

            //todo = add folder for min


            var  fuimin =  fui.addFolder('min');

            var  fuimax =  fui.addFolder('max');

          var min =   DatGui.addEachNumeric(o.min, fuimin );

          var max =  DatGui.addEachNumeric(o.max, fuimax );

            //todo = add folder for max



        }
        else if(type == Vector3)
        {

            //add all numerics


              fui =  DatGui.main_gui.addFolder(ix + '');

            DatGui.addEachNumeric(o, fui );

        }


        if([Sprite,  TextDisplay, VideoDisplay].indexOf(type) >= 0)
        {

            //add main text values

             fui =  DatGui.main_gui.addFolder('Info');

            DatGui.addEachText(obj, fui );

        }

        if([GameImage, GameSound].indexOf(type) >= 0)
        {

            //display special file input --see npm static-stack

        }


        /*

        if(isParent([TweenStack]))
        {




            this.showTweenStack(Game.player, obj);

            return true;

        }

        */



        if(fui && parent) {

            fui.onChange = function (f) {
                var i, j;
                for (i in this.__controllers) this.__controllers[i].onChange(f);
                for (i in this.__folders) for (j in this.__folders[i].__controllers) this.__folders[i].__controllers[j].onChange(f);
            };



            if (isParent([Animation])) {




                $('#selected_object_src').click(function(){


                    alert('dat.gui.interface :: clicked ...object_src');

                    App.GTUI.fileOptions('image', function(src){

                        parent.src = src;

                        parent.image.src = src;

                        parent.reset();

                        alert('File Selected');

                    });

                });


                fui.onChange(function () {

                    parent.reset();

                });
            }

        }

    },



        addGuiByKeys:function(ix, obj)
        {

            //anything numeric:


            if(typeof(obj) == 'object')
            {

                var complete;

                var _inst = this;

              complete =   _inst.typeHandler(ix, obj, obj);

                this.each(obj, function(ix, o){

                  //#typeHandler

              if(!complete){ complete = _inst.typeHandler(ix, o, obj)};





                });


                if(obj instanceof Animation)
                {


                    var lastBox = $('.dg.ac');

                    var lists = $('div.main');

                    var my_list = $(lists)[lists.length - 1];

                    if(!$(my_list).find('input[type="file"]').length)
                    {
                        var ul = $(my_list).first('ul');


                        var id = this.create_id();

                        $(ul).prepend( "<input   type='file' id='"+id+"' class='dat_gui_file' value='animation-image'>");

                        $('#' + id).change(function(){

                          var file =  levelMaker.getRawImageFile(this, function(image){

                              obj.image = image;

                          });

                        });

                    }


                }

            }


            return  this.main_gui;

        },




    /*
    * TODO: scopeDatRecursive:
    *
    *       -apply serious error defense to this function:: it will have to loop through an very broad scope
    *
    *
    * */

     count:0,

    fui:false,


    
    isInTypeList:function(object, typelist)
    {
        var isType = false;

        this.each(typelist, function(ix, type){

            isType = typeof(object) == 'object' &&  object instanceof type ? true : isType;
            
        });
      
      return isType;
        
    },

    guis:[],

    expand:function(object, name, callback)
    {

        alert('hello');


        this.guis.push(this.main_gui);

        this.main_gui = new dat.GUI();



        return this.addGuiByKeys(name, object, this.latest_folder);


    },


    get: function (object, name, gui) {

         this.selectedObject = object;

         $('.dg.main').remove();


         this.main_gui = gui || new dat.GUI();

        $('.dg.main').attr('z-index', '9999');

         //TODO: build the container to display images, etc..

        /*************************
         *
         *   return this.datGuiByKeys(
         ['vector2', 'vector', 'vector3',
         'vect', 'pos', 'position',
         'size', 'framepos', 'framesize',  'framebounds',
         'src', 'file', 'filepath', 'texture'],
         object, 0);

         * *****************************/

        return this.addGuiByKeys(name, object);

       // return this.Display(object);

    }

};


