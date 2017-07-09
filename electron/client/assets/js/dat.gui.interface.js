

/*
 DatGui
    -implements dat.gui
    -live update of objects/properties

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

        return typeof item == 'number' && !isNaN(item);
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

        $.each(obj, function(ix, o){

            if ( DatGui.isNumeric(obj[ix])) {


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

        var discludedKeys = ['src', 'curveString'];

        this.each(obj, function(ix, o){

            if (discludedKeys.indexOf(ix) == -1 && typeof(obj[ix])=='string') {

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

              fui =  DatGui.main_gui.addFolder(ix + '');

            DatGui.addEachNumeric(o, fui );

        }
        else if(type == Motionstack)
        {

            //add main text values

           var fui =  DatGui.main_gui.addFolder('Info');

            DatGui.addEachText(obj, fui );

            var t = DatGui.main_gui.add(obj, 'targetRotation', -720, 720 );

            //todo = add folder for min

            var fuicurve =  DatGui.main_gui.addFolder('curve');

            var c = fuicurve.add(obj, 'curve', obj.curvesList );

            c.onChange(function(value){

                obj.setCurve(value);


            });

            window.setTimeout(function(){

                $('.c select').val(obj.getCurveString());


            }, 100);



            var  fuitiming =  DatGui.main_gui.addFolder('timing');

            var n =  DatGui.addEachNumeric(obj, fuitiming );




            var  fuidist =  DatGui.main_gui.addFolder('distance');



            var d =  DatGui.addEachNumeric(o.distance, fuidist );



        }



        else if(type == Animation)
    {

        var fui =  DatGui.main_gui.addFolder('data');

        DatGui.addEachText(obj, fui );


    }

        else if(type == Force)
        {


            this.main_gui.add(parent, 'selected_force', Game.forces );

        }

        'selected_force', Game.forces


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

                        $(ul).prepend( "<input type='file' id='"+id+"'  class='dat_gui_file'/><label class='file_special' for='"+id+"'>Select file</label>");




                        $('#' + id).change(function(){

                          var file =  levelMaker.getRawImageFile(this, function(imagesrc){

                              obj.src = imagesrc;


                              obj.image = new GameImage(imagesrc);

                              obj = new Animation(obj);


                              Game.sprites[0].selected_animation = obj;

                                DatGui.get(obj);

                                if(!$('.file-notic').length) {

                                    $('.dg.main').prepend('<p class="file-notice">Raw File Applied</p>');

                                }


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


    get: function (object, name, gui, cont) {

         this.selectedObject = object;

         $('.dg.main').remove();

         this.main_gui = gui || new dat.GUI({autoPlace:false});

        $('#gui-container').append($(this.main_gui.domElement));

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

        alert('calling');

        return this.addGuiByKeys(name, object);

       // return this.Display(object);

    }

};


