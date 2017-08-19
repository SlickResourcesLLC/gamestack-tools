

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

    image_upload:__ServerSideImage.image_upload, /*__ServerSideImage.image_upload(filename, content, callback)*/

    expandables:[],

    createObjectSelect:function(gui, obj, key, optionsObject)
    {

        return gui.add(obj, key, optionsObject);

    },

    saveable:function(save_callback, remove_callback)
    {

        var guiHTML = $('#dat-gui-container div.dg.main li'),
        last = $(guiHTML).last();

        $('<button id="save_current_object">Save</button><button id="cancel_current_object">Cancel</button>').insertAfter(last);

        $('#save_current_object').click(function(){  save_callback(); });

        $('#cancel_current_object').click(function(){ $('#dat-gui-container div.dg.main.member').last().remove(); remove_callback();  });

    },

    addSuperSelectButton(gui, object, key, list)
    {

        var type = gui.add(object, 'type', __levelMaker.settings.psuedoTypes);

        var dom = type.domElement;

        if(dom) {

           var button = $(dom).parent().find('#edit-button');

           if($(button).length)
           {
            $(button).remove()

           }

            $(dom).parent().find('.c').append('<button id="edit-button" class="edit-button"></button>');

            $(dom).parent().find('.c #edit-button').click(function(){

                App.superSelectOptions("Update Available Types", list, function () {

                  var el = $(dom).find('select');
                  $(el).html('');

                    $.each(list, function(key,value) {
                        $(el).append($("<option></option>")
                            .attr("value", value).text(value));
                    });

                });

            });

        }

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

               // alert('hello');

                if(cl == Animation)
                {
                    parent[key].push(new Animation());


                    var len = parent[key].length - 1;

                    var name = parent[key][len].name || 'Animation_' + len;


                    DatGui.expand(parent[key][len], name);

                    __instance.saveable( function(){

                      //  alert('SAVE CODE GO HERE');

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


          //  alert('creating gui for :' + jstr(tween));

           _inst.TweenSelect(Game.player, ['position, rotation', 'pos', 'rot', 'size'], tween, gui);



        };


        tweenCreate(obj, tween);


        $('img.main-add').unbind().click(function (evt) {

          //  alert('expanding tween');

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


             var g =  fui.add(obj, ix, -1000, 1000).step(1.0);

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

    addVectorFromProperty:function(gui, prop, name, min, max, callback)
    {

        var fui = gui.addFolder(name);

        if(!prop instanceof Vector3  && !prop instanceof Vector2)
        {
            return console.error('passed non-vector');

        }

        for(var x in prop)
        {
            if(typeof(prop[x])=='number') {

                var g = fui.add(prop, x).min(min).max(max);

                g.onChange(function (value) {

                    if (callback) {
                        callback();

                    }

                });

            }

        }

    },

    typeHandlerSpriteMaker:function(ix, obj, parent)
    {
        var o = obj,  type = typeof(obj) == 'object' ?  obj.constructor : false;

        var  fui;

        var selectedLib = window;


        var isParent = function(list)
        {
            return list.indexOf(parent.constructor) >= 0;

        };

        var isType = function(type)
        {

            return  typeof type == 'function' && obj instanceof type;

        };


        if(isType(Sprite)) {

            console.log('detected sprite');

            var  fuisize =  DatGui.main_gui.addFolder('size');

            var max =  DatGui.addEachNumeric(o.size, fuisize );

        }


            if(isType(VectorFrameBounds))
        {

            fui =  DatGui.main_gui.addFolder(ix + '');

            //todo = add folder for min


            var  fuimin =  fui.addFolder('min');

          var min =   DatGui.addEachNumeric(o.min, fuimin );


            var  fuimax =  fui.addFolder('max');


            var max =  DatGui.addEachNumeric(o.max, fuimax );


            var  fuiterm =  fui.addFolder('termPoint');


            var term =  DatGui.addEachNumeric(o.termPoint, fuiterm );

            //todo = add folder for max



        }
        if(isType(Vector3))
        {

            fui =  DatGui.main_gui.addFolder(ix + '');

            DatGui.addEachNumeric(o, fui );

        }
        if(isType(Motion))
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

                var parts = value.split('_');

                var canvas =  obj.getGraphCanvas( value.replace('_', '.'), TWEEN.Easing[parts[0]][parts[1]] );


                $(c.domElement).children('canvas').remove();

                $(c.domElement).append(canvas);

            });

            c.setValue('Quadratic_InOut');

            window.setTimeout(function(){

                $('.c select').val(obj.getCurveString());


            }, 100);




            var t = DatGui.main_gui.add(obj, 'duration', -5000, 5000 );

            var  fuidist =  DatGui.main_gui.addFolder('distance');

            var d =  DatGui.addEachNumeric(o.distance, fuidist );

        }


        if(isType(Force))
        {


            this.main_gui.add(parent, 'selected_force', Game.forces );

        }


        if(isType(Sprite) || isType(TextDisplay))
        {

            //add main text values

             fui =  DatGui.main_gui.addFolder('Info');

            DatGui.addEachText(obj, fui );

        }

        if(isType(Animation) || isType(Sound))
        {

            var fui =  DatGui.main_gui.addFolder('Info');

            DatGui.addEachText(obj, fui );

        }

        if(isType(Animation))
        {

            this.main_gui.add(parent, 'duration').step(1.0);

        }


        if(fui && parent) {

            fui.onChange = function (f) {
                var i, j;
                for (i in this.__controllers) this.__controllers[i].onChange(f);
                for (i in this.__folders) for (j in this.__folders[i].__controllers) this.__folders[i].__controllers[j].onChange(f);
            };


            if (isParent([Animation])) {

                $('#selected_object_src').click(function(){


                  //  alert('dat.gui.interface :: clicked ...object_src');

                    App.GTUI.fileOptions('image', function(src){

                        parent.src = src;

                        parent.image.src = src;

                        parent.reset();

                      //  alert('File Selected');

                    });

                });

                fui.onChange(function () {



                    //parent.reset();

                });
            }

        }

    },

        spriteMakerGuiByKeys:function(ix, obj)
        {
            //anything numeric:

            alert('adding object');

            if(typeof(obj) == 'object')
            {

                var complete;

                var _inst = this;

              complete =   _inst.typeHandlerSpriteMaker(ix, obj, obj);


                this.each(obj, function(ix, o){

                  //#typeHandler

              if(!complete){ complete = _inst.typeHandlerSpriteMaker(ix, o, obj)};


                });


                if(obj instanceof Animation || obj instanceof  Sound)
                {


                    var first_list = $('#dat-gui-container div.main ul')[0];

                    if(!$(first_list).find('input[type="file"]').length)
                    {



                        var id = this.create_id();

                        var fname;

                        if(obj.src.length > 270)
                        {

                            fname = obj.src.substring(0, 270);
                        }

                        $(first_list).prepend( "<input type='file' id='"+id+"'  class='dat_gui_file'/>"  +
                            "<label class='file_special' id='file_special"+id+"' for='"+id+"'>Select File: <br/> "+ (fname || obj.src) +"</label>");

                        $('#' + id).change(function(evt){

                            var input = evt.target;

                            var file =  levelMaker.getRawImageFile(this, function(imagesrc){

                                if(obj instanceof Animation) {

                                    var filename = $(input).val().split('\\').pop();

                                    DatGui.image_upload(filename, imagesrc, function(relpath, content){

                                        relpath = relpath.replace('client/', '../');


                                        alert('uploaded image:' + filename + ":using relative path:" + relpath);


                                        $('file_special'+id).text(relpath);

                                        obj.src = relpath;

                                        obj.image = new GameImage(relpath);

                                        obj.image.domElement.onload = function()
                                        {

                                            obj = new Animation(obj);

                                            Game.sprites[0].selected_animation = obj;


                                        };


                                    });

                                }

                                else if(obj instanceof Sound) {

                                    obj.sound = new Audio(imagesrc);

                                    obj = new Sound(obj);

                                    Game.sprites[0].selected_sound = obj;

                                }

                            });

                            DatGui.get(obj);

                            evt.preventDefault();

                            return false;


                        });

                    }

                }

            }

            return  this.main_gui;

        },

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

       // alert('hello');

        this.guis.push(this.main_gui);

        this.main_gui = new dat.GUI();

        return this.addGuiByKeys(name, object, this.latest_folder);


    },

    gui:function()
    {

      return new dat.GUI({autoPlace:false});

    },

    getLevelObjectGui:function(mode, object){ //dat.gui specific to the LevelEditor :: Editing Level (Sprite) Objects

        var gui = new dat.GUI({autoPlace:false});

        if(mode.toLowerCase() == 'mapobject' && object instanceof Sprite)
        {

            var name = gui.add(object, 'name');

            var description = gui.add(object, 'description');

            DatGui.addSuperSelectButton(gui, object, 'type', __levelMaker.settings.psuedoTypes);

            object.selected_animation = new Animation({ frameSize: new Vector3(object.size),
            frameBounds: new VectorFrameBounds(new Vector3(0, 0), new Vector3(0, 0))});

            var obj = object.selected_animation;



            for(var x in object)
            {
                if(x == 'size' && object[x] instanceof Vector3)
                {
                    console.log('found vector');

                    DatGui.addVectorFromProperty(gui, object[x], 'size', 0, 1000);

                }


            }

            window.setTimeout(function(){

                if(obj instanceof Animation || obj instanceof  Sound) {


                    obj.framePos = new Vector3(0, 0, 0);

                    var first_list = $('div#sprite-space div.main ul')[0];

                    if (!$(first_list).children().find('input[type="file"]').length) {

                        var id = DatGui.create_id();

                        var fname;

                        if (obj.src && obj.src.length > 270) {

                            fname = obj.src.substring(0, 270);
                        }

                        $(first_list).prepend("<img style='display:none;'/><input type='file' id='" + id + "'  class='dat_gui_file'/>" +
                            "<label class='file_special' id='file_special" + id + "' for='" + id + "'>Select File: <br/> " + (fname || obj.src) + "</label>" +
                        "<canvas id='image-test-canvas'></canvas>");

                        $('#' + id).change(function (evt) {

                            var input = evt.target;

                            __levelMaker.getRawImageFile(this, function (image) {

                                if (obj instanceof Animation) {

                                    var filename = $(input).val().split('\\').pop();

                                    DatGui.image_upload(filename, image, function (relpath, content) {

                                        relpath = relpath.replace('client/', '../');

                                       // alert('uploaded image:' + filename + ":using relative path:" + relpath);

                                        $('file_special' + id).text(relpath);

                                        obj.src = relpath;

                                        obj.image = new GameImage(relpath);

                                        object.image = obj.image;

                                        object.selected_animation = new Animation(obj).singleFrame(object.frameSize);

                                        var img = object.selected_animation.image.domElement;

                                        object.selected_animation.image.domElement.onload = function () {

                                            object.position = new Vector3(0, 0, 0);

                                            object.size = new Vector3(this.width, this.height, 0);

                                            object.selected_animation = new Animation({ image:this, frameSize: new Vector3(object.size),
                                                frameBounds: new VectorFrameBounds(new Vector3(0, 0), new Vector3(0, 0))});

                                                console.log('found vector');

                                            object.frameSize = object.selected_animation.selected_frame.frameSize;

                                                DatGui.addVectorFromProperty(gui, object.selected_animation.selected_frame.frameSize, 'this.selected_animation::frameSize', 0, 1000, function(){



                                                    object.size = new Vector3(object.selected_animation.selected_frame.frameSize);

                                                    __levelMaker.imagePreview(object);

                                                });

                                            __levelMaker.imagePreview(object);

                                        };
                                    });
                                }

                                else if (obj instanceof Sound) {

                                    obj.sound = new Audio(imagesrc);

                                    obj = new Sound(obj);

                                    Game.sprites[0].selected_sound = obj;

                                }

                            });

                            //DatGui.get(obj);

                            evt.preventDefault();

                            return false;


                        });

                    }

                    else
                    {
                        alert('already had file input');
                    }

                }


            }, 250);



        }

        else if(mode.toLowerCase() == 'sprite' && object instanceof Sprite)
        {
            console.log('TODO: level edit for actual Sprite()');

        }

        else if (mode.toLowerCase() == 'list' && object instanceof Array && object.length && object[0] instanceof Sprite)
        {

            console.log('TODO: present gui to edit all selected sprite objects at once');

        }

        return gui;

    },

    get: function (object, name, gui, cont) {

         this.selectedObject = object;

         $('#dat-gui-container .dg.main').remove();

         this.main_gui = gui || new dat.GUI({autoPlace:false});

        $('#dat-gui-container').append($(this.main_gui.domElement));

        $('#dat-gui-container').css('top', 0);

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

       // alert('calling');

        return this.spriteMakerGuiByKeys(name, object);

       // return this.Display(object);

    }

};


