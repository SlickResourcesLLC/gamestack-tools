/*
 DatGui
 -implements dat.gui
 -live update of objects/properties

 * */

var DatGui = {

    gui: false,

    latest_folder: false,

    options: {},

    getArg: function (args, key, fallback) {
        return args[key] || fallback;

    },

    image_upload: __ServerSideImage.image_upload, /*__ServerSideImage.image_upload(filename, content, callback)*/

    expandables: [],

    createObjectSelect: function (gui, obj, key, optionsObject) {

        return gui.add(obj, key, optionsObject);

    },

    saveable: function (save_callback, remove_callback) {

        var guiHTML = $('#dat-gui-gs-container div.dg.main li'),
            last = $(guiHTML).last();

        $('<button id="save_current_object">Save</button><button id="cancel_current_object">Cancel</button>').insertAfter(last);

        $('#save_current_object').click(function () {
            save_callback();
        });

        $('#cancel_current_object').click(function () {
            $('#dat-gui-gs-container div.dg.main.member').last().remove();
            remove_callback();
        });

    },

    addSuperSelectButton(gui, object, key, list)
    {

        var type = gui.add(object, 'type', __levelMaker.settings.psuedoSpriteTypes);

        var dom = type.domElement;

        if (dom) {

            var button = $(dom).parent().find('#edit-button');

            if ($(button).length) {
                $(button).remove()

            }

            $(dom).parent().find('.c').append('<button id="edit-button" class="edit-button"></button>');

            $(dom).parent().find('.c #edit-button').click(function () {

                App.superSelectOptions("Update Available Types", list, function () {

                    var el = $(dom).find('select');
                    $(el).html('');

                    $.each(list, function (key, value) {
                        $(el).append($("<option></option>")
                            .attr("value", value).text(value));
                    });

                });

            });

        }

    },

    expandOnArray: function (parent, key, cl, save_callback) {
        //make parent property expandable

        //modify the GUI to contain a button, allowing a line of added objects for the array


        var __instance = this;

        this.latest_folder = this.main_gui.addFolder(key);

        var obj = {
            add_animation: function () {

                // alert('hello');

                if (cl == Animation) {
                    parent[key].push(new Animation());


                    var len = parent[key].length - 1;

                    var name = parent[key][len].name || 'Animation_' + len;


                    DatGui.expand(parent[key][len], name);

                    __instance.saveable(function () {

                        //  alert('SAVE CODE GO HERE');

                        $('span').each(function (ix, item) {

                            if ($(this).text() == 'add_animation') {

                                $(this).parent().append('<button class="sprite_prop">' + name + '</button>');

                            }

                        });

                    });

                }

            }
        };

        this.latest_folder.add(obj, 'add_animation');

    },

    each: function (list, callback, flaggedKeys, flaggedTypes) {

        if (list instanceof Array) {

            for (var x = 0; x < list.length; x++) {

                callback(x, list[x]);

            }

        }

        else if (typeof(list) == 'object') {

            for (var x in list) {

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

        var tweenCreate = function (obj, tween) {
            var ct = 0;

            Quazar.each(_inst.main_gui.__folders, function (ix, item) {

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

    guiCheckables: function (obj, keys) {
        //show every key member belonging to the passed obj

        var rels = [];

        Quazar.each(keys, function (kix, key) {


            Quazar.each(obj[kix] || {}, function (ix, item) {

                if (ix.indexOf('__') == -1) //The string __ is a flag for special members, treated differently
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


    fuis: {},

    addSrc: function (key, obj, parent, fui) {

        if (key == 'src') {

            fui.add(parent, key, ['source1.mp3', 'source1.mp3', 'source1.mp3', 'source1.mp3']);

        }

    },

    onValidFunc(obj, key, call)
    {
        if (typeof(obj) == 'function') {
            call();

        }


    },

    addEachNumeric: function (obj, fui, callback) {

        $.each(obj, function (ix, o) {

            if (DatGui.isNumeric(obj[ix])) {


                var g = fui.add(obj, ix, -1000, 1000).step(1.0);

                if (callback) {
                    g.onChange(function (v) {

                        callback(v);

                    });

                }

            }

        });

    },

    Display: function (name, object) {

        this.each(this.__settings, function (ix, item) {

            item.show(name, object);

        });

    },

    addEachText: function (obj, fui) {
        var discludedKeys = ['src', 'curveString'];

        this.each(obj, function (ix, o) {

            if (discludedKeys.indexOf(ix) == -1 && typeof(obj[ix]) == 'string') {

                fui.add(obj, ix, obj[ix]);

            }

        });

    },

    fillSelectedObject: function (object) {

    },

    expandSelectedObject(object)
    {

        //call object constructor again

        var obj = object.constructor();


    },

    create_id: function () {
        var S4 = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());

    },

    addVectorFromProperty: function (gui, prop, name, min, max, callback) {

        dat.GUI.prototype.removeFolder = function (name) {
            var folder = this.__folders[name];
            if (!folder) {
                return;
            }
            folder.close();
            this.__ul.removeChild(folder.domElement.parentNode);
            delete this.__folders[name];
            this.onResize();
        }

        gui.removeFolder(name);

        var fui = gui.addFolder(name);

        if (!prop instanceof Vector && !prop instanceof Vector2) {
            return console.error('passed non-vector');

        }

        var guis = {};

        for (var x in prop) {
            if (typeof(prop[x]) == 'number') {

                guis[x] = fui.add(prop, x).min(min).max(max);

                guis[x].onChange(function (value) {

                    if (callback) {
                        callback(value);

                    }

                });

            }

        }

    },

    arrayToObject: function (list) {
        var obj = {};

        for (var x in list) {

            obj[list[x].name] = list[x];

        }

        return obj;
    },

    mainSpriteAnimationSelect(parent, obj)
    {

        var animations = DatGui.arrayToObject(Game.sprites[0].animations);

        DatGui.main_gui.add(obj, 'animation', animations);

    },

    addOffsetSelect(obj, gui, key, min, max, callback)
    {

        callback = callback || function () {
            };

        var fui = gui.addFolder(key),

            x = fui.add(obj, 'x', min, max),
            y = fui.add(obj, 'y', min, max);

        x.onChange(function () {

            callback();

        });

        y.onChange(function () {

            callback();

        });


    },

    addLineCurveSelect(obj, gui, key, ix, callback)
    {

        if (!ix) {
            ix = 0;

        }

        key = key || 'curve';

        var testMotion = new Motion();

var curves = testMotion.curvesList;

var line_curves = [];

for(var x= 0; x < curves.length; x++)
{

    if(['cubic', 'quadratic', 'quartic', 'quintic'].indexOf(x.toLowerCase()) >= 0) {

        line_curves.push(curves[x]);

    }

}

            var c = gui.add(obj, key, line_curves);

        c.onFinishChange(function (value) {

            var parts = value.split('_');

            obj[key] = TWEEN.Easing[parts[0]][parts[1]];

            var canvasDom = $(gui.domElement).parent().find('canvas.motion-curve');

            var canvas = testMotion.getGraphCanvas(value.replace('_', '.'), obj[key], canvasDom[ix]);

            if (!canvasDom.length || canvasDom.length < (ix + 1)) {
                $($(gui.domElement).children('ul')[0]).append(canvas);
            }

            callback();

        });

        c.setValue('Linear_None');



        },

    addCurveSelect(obj, gui, key, ix, callback)
    {

        if (!ix) {
            ix = 0;

        }

        key = key || 'curve';

        var testMotion = new Motion();

        var c = gui.add(obj, key, testMotion.curvesList);

        c.onFinishChange(function (value) {

            var parts = value.split('_');

            obj[key] = TWEEN.Easing[parts[0]][parts[1]];

            var canvasDom = $(gui.domElement).parent().find('canvas.motion-curve');

            var canvas = testMotion.getGraphCanvas(value.replace('_', '.'), obj[key], canvasDom[ix]);

            if (!canvasDom.length || canvasDom.length < (ix + 1)) {
                $($(gui.domElement).children('ul')[0]).append(canvas);
            }

            callback();

        });

        c.setValue('Linear_None');

    },


    typeHandlerSpriteMaker: function (ix, obj, parent) {
        var o = obj, type = typeof(obj) == 'object' ? obj.constructor : false;

        var fui;

        var selectedLib = window;

        var projectile = projectile || false;

        var isParent = function (list) {
            return list.indexOf(parent.constructor) >= 0;

        };

        var isType = function (type) {

            return typeof type == 'function' && obj instanceof type;

        };


        if (isType(Sprite)) {

            alert('sprite');

            console.log('detected sprite');

            var fuisize = DatGui.main_gui.addFolder('size');

            var max = DatGui.addEachNumeric(o.size, fuisize);

        }

        if (isType(VectorFrameBounds)) {

            fui = DatGui.main_gui.addFolder(ix + '');

            //todo = add folder for min

            var fuimin = fui.addFolder('min');

            var min = DatGui.addEachNumeric(o.min, fuimin, function (v) {

                parent.resetFrames();


            });


            var fuimax = fui.addFolder('max');


            var max = DatGui.addEachNumeric(o.max, fuimax, function (v) {

                parent.resetFrames();


            });


            var fuiterm = fui.addFolder('termPoint');


            var term = DatGui.addEachNumeric(o.termPoint, fuiterm, function (v) {

                parent.resetFrames();


            });

            //todo = add folder for max

            if(isParent([Animation]))
            {

                var seesaw = this.main_gui.add(parent, 'seesaw_mode');

                seesaw.onChange(function(v){

                    parent.resetFrames();

                });

            }

        }


        if (isType(Projectile)) {
            projectile = true;

            var fui = DatGui.main_gui.addFolder('Info');

            var name = fui.add(obj, 'name');

            name.onChange(function (v) {


                Game.refreshBuilder();

            });

            DatGui.mainSpriteAnimationSelect(parent, obj);

            var r = DatGui.main_gui.add(obj.line, 'rotation', -360, 360).step(0.1);

            r.onChange(function () {

                obj.line.fill(obj.line.size, obj.line.pointDist);

            });

            //todo = add folder for min

            DatGui.addLineCurveSelect(obj.line, DatGui.main_gui, 'curve', 0, function () {

                obj.line.fill(obj.line.size, obj.line.pointDist);

            });


            var sui = DatGui.main_gui.addFolder('size');


            var x = sui.add(obj.line.size, 'x');

            var y = sui.add(obj.line.size, 'y');


            x.onChange(function (v) {

                //fill the line over again with new size
                obj.line.fill(obj.line.size, obj.line.pointDist);


            });

            y.onChange(function (v) {

                //fill the line over again with new size
                obj.line.fill(obj.line.size, obj.line.pointDist);


            });


            var pui = DatGui.main_gui.addFolder('position');


            var px = pui.add(obj.line.position, 'x');

            var py = pui.add(obj.line.position, 'y');


            px.onChange(function (v) {

                //fill the line over again with new size
                obj.line.fill(obj.line.size, obj.line.pointDist);


            });

            py.onChange(function (v) {

                //fill the line over again with new size
                obj.line.fill(obj.line.size, obj.line.pointDist);


            });


        }

        if (isType(Vector) && ['frameSize'].indexOf(ix) >= 0) {


            fui = DatGui.main_gui.addFolder(ix + '');

            DatGui.addEachNumeric(o, fui, function (v) {

                parent.resetFrames();


            });

        }


        if (isType(Motion)) {
            //add main text values

            var fui = DatGui.main_gui.addFolder('Info');

            var name = fui.add(obj, 'name');

            name.onChange(function (v) {


                Game.refreshBuilder();

            });

            var desc = fui.add(obj, 'description');

            var t = DatGui.main_gui.add(obj, 'targetRotation', -720, 720);

            //todo = add folder for min

            DatGui.addCurveSelect(obj, DatGui.main_gui, 'motion_curve', 0);

            DatGui.addLineCurveSelect(obj, DatGui.main_gui, 'line_curve', 1);


            var t = DatGui.main_gui.add(obj, 'duration', -5000, 5000);

            var fuidist = DatGui.main_gui.addFolder('distance');

            var d = DatGui.addEachNumeric(o.distance, fuidist);

        }


        if (isType(Force)) {

            this.main_gui.add(parent, 'selected_force', Game.forces);

        }


        if (isType(Sprite) || isType(TextDisplay)) {

            //add main text values

            fui = DatGui.main_gui.addFolder('Info');

            DatGui.addEachText(obj, fui);

        }

        if (isType(Animation) || isType(Sound)) {

            var fui = DatGui.main_gui.addFolder('Info');

            var name = fui.add(obj, 'name');

            name.onChange(function (v) {

                Game.refreshBuilder();

            });

        }

        if (isType(Animation) && obj.hasOwnProperty('duration')) {

           var d = this.main_gui.add(obj, 'duration').step(1.0);

           d.onChange(function(v){

               obj.resetFrames();


           });

        }


        if (fui && parent) {

            fui.onChange = function (f) {
                var i, j;
                for (i in this.__controllers) this.__controllers[i].onChange(f);
                for (i in this.__folders) for (j in this.__folders[i].__controllers) this.__folders[i].__controllers[j].onChange(f);
            };


            if (isParent([Animation])) {

                $('#selected_object_src').click(function () {

                    //  alert('dat.gui.interface :: clicked ...object_src');

                    App.GTUI.fileOptions('image', function (src) {

                        parent.src = src;

                        parent.image.src = src;

                        parent.reset();

                        //  alert('File Selected');

                    });

                });


            }

        }

    },

    gameControllerGUI()
    {

        var allEventsOptions = {

            button_a:['one', 'two', 'three'],
            button_b:['one', 'two', 'three']

        }

        var allEvents = {

            button_a:'one',
            button_b:'two'

        }

        var gui = new dat.GUI({autoPlace:false});

       var a = gui.add(allEvents, 'button_a', allEventsOptions.button_a);

       var b = gui.add(allEvents, 'button_b', allEventsOptions.button_b);

        return gui;

    },

    spriteMakerGuiByKeys: function (ix, obj) {
        //anything numeric:

        if (typeof(obj) == 'object') {

            var complete;

            var _inst = this;

            complete = _inst.typeHandlerSpriteMaker(ix, obj, parent);

            this.each(obj, function (ix, o) {

                //#typeHandler

                if (!complete) {
                    complete = _inst.typeHandlerSpriteMaker(ix, o, obj)
                }
                ;


            });


            if (obj instanceof Animation || obj instanceof Sound) {

                var first_list = $('#dat-gui-gs-container div.main ul')[0];

                if (!$(first_list).find('input[type="file"]').length) {

                    var id = this.create_id();

                    var fname;

                    if (obj.src.length > 270) {

                        fname = obj.src.substring(0, 270);
                    }

                    $(first_list).prepend("<input type='file' id='" + id + "'  class='dat_gui_file'/>" +
                        "<label class='file_special' id='file_special" + id + "' for='" + id + "'>Select File: <br/> " + (fname || obj.src) + "</label>");

                }

                $('#' + id).on('change', function (evt) {

                    var input = evt.target;

                    var file = levelMaker.getRawImageFile(this, function (imagesrc) {

                        if (obj instanceof Animation) {

                            var filename = $(input).val().split('\\').pop();

                            DatGui.image_upload(filename, imagesrc, function (relpath, content) {

                                relpath = relpath.replace('client/', '../');

                                alert('uploaded image:' + filename + ":using relative path:" + relpath);

                                $('file_special' + id).text(relpath);

                                obj.src = relpath;

                                obj.image = new GameImage(relpath);

                                obj.image.domElement.onload = function () {

                                    obj = new Animation(obj);

                                    Game.sprites[0].selected_animation = obj;


                                };


                            });

                        }

                        else if (obj instanceof Sound) {

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

        return this.main_gui;

    },

    count: 0,

    fui: false,

    isInTypeList: function (object, typelist) {
        var isType = false;

        this.each(typelist, function (ix, type) {

            isType = typeof(object) == 'object' && object instanceof type ? true : isType;

        });

        return isType;

    },

    guis: [],

    expand: function (object, name, callback) {

        // alert('hello');

        this.guis.push(this.main_gui);

        this.main_gui = new dat.GUI();

        return this.addGuiByKeys(name, object, this.latest_folder);


    },

    gui: function () {

        return new dat.GUI({autoPlace: false});

    },


    updateableAnimationObjectToGui: function (gui, effects) {

        var first_gui = $('div.main ul')[0];

        var fname;

        effects.animation = new Animation();

        if (effects.animation.image.domElement.src) {

            fname = effects.animation.image.domElement.src.length > 270 ? effects.animation.image.domElement.src.substring(0, 270) : effects.animation.image.domElement.src;

            var value = 'Select File: <br/> ' + fname;

            $(effects.animation.file_input).text(value);

        }

        if (effects.animation instanceof Animation) {

            if (!effects.animation.file_input && !$(first_gui).find('input[type="file"]').length) { //add file input

                var id = DatGui.create_id();

                $(first_gui).prepend("<img style='display:none;'/><input type='file' name='" + id + "' id='" + id + "'  class='dat_gui_file'/>" +
                    "<label class='file_special' id='file_special" + id + "' for='" + id + "'>Select File: <br/> " + fname + "</label>" +
                    "<canvas id='image-test-canvas'></canvas>");

                effects.animation.file_input = $('#' + id)[0];

            }


        }


        $(effects.animation.file_input).on('change', function (evt) {

            var input = evt.target;

            __ServerSideImage.getRawImageFile(this, function (image) {

                if (effects.animation instanceof Animation) {

                    var filename = $(input).val().split('\\').pop();

                    DatGui.image_upload(filename, image, function (relpath, content) {

                        relpath = relpath.replace('client/', '../');

                        $(input).parent().find('.file_special').html("Select File: <br/> " + relpath);

                        alert('uploaded image:' + filename + ":using relative path:" + relpath);

                        $('file_special' + id).text(relpath);

                        // effects.animation = new Animation({src:relpath});

                        effects.animation.src = relpath;

                        effects.src = relpath;

                        effects.animation.image = new GameImage(relpath);

                        effects.animation.image.domElement.onload = function () {

                            effects.animation.frameSize = new Vector(effects.animation.image.domElement.width, effects.animation.image.domElement.height, 0);

                            effects.animation.animate();

                            __ServerSideImage.animationPreview(effects.animation, effects);

                        };
                    });
                }

            });

            //DatGui.get(obj);

            evt.preventDefault();

            return false;


        });


    },

    getLevelObjectGui: function (object, create_new) { //dat.gui specific to the LevelEditor :: Editing Level (Sprite) Objects

        var gui = new dat.GUI({autoPlace: false});

        if (object instanceof Sprite) {

            var name = gui.add(object, 'name');

            var description = gui.add(object, 'description');

            DatGui.addSuperSelectButton(gui, object, 'type', __levelMaker.settings.psuedoSpriteTypes);

            if (create_new) {
                object.selected_animation = new Animation({
                    frameSize: new Vector(object.size),
                    frameBounds: new VectorFrameBounds(new Vector(0, 0), new Vector(0, 0))
                });

            }

            var obj = object.selected_animation;

            window.setTimeout(function () {

                if (create_new && (obj instanceof Animation || obj instanceof Sound)) {

                    obj.framePos = new Vector(0, 0, 0);

                    var first_list = $('div#sprite-space div.main ul')[0];

                    if (!$(first_list).children().find('input[type="file"]').length) {

                        var id = DatGui.create_id();

                        var fname;

                        if (obj.image.domElement.src) {

                            fname = obj.image.domElement.src.length > 270 ? obj.image.domElement.src.substring(0, 270) : obj.image.domElement.src;
                        }


                        $(first_list).prepend("<img style='display:none;'/><input type='file' name='" + id + "' id='" + id + "'  class='dat_gui_file'/>" +
                            "<label class='file_special' id='file_special" + id + "' for='" + id + "'>Select File: <br/> " + fname + "</label>" +
                            "<canvas id='image-test-canvas'></canvas>");

                        $('#' + id).change(function (evt) {

                            var input = evt.target;

                            __levelMaker.getRawImageFile(this, function (image) {

                                if (obj instanceof Animation) {

                                    var filename = $(input).val().split('\\').pop();


                                    DatGui.image_upload(filename, image, function (relpath, content) {

                                        relpath = relpath.replace('client/', '../');

                                        $(input).parent().find('.file_special').html("Select File: <br/> " + relpath);

                                        // alert('uploaded image:' + filename + ":using relative path:" + relpath);

                                        $('file_special' + id).text(relpath);

                                        obj.src = relpath;

                                        obj.image = new GameImage(relpath);

                                        object.image = obj.image;

                                        object.selected_animation = new Animation(obj).singleFrame(object.frameSize);

                                        var img = object.selected_animation.image.domElement;


                                        object.selected_animation.image.domElement.onload = function () {

                                            object.position = new Vector(0, 0, 0);

                                            object.size = new Vector(this.width, this.height, 0);

                                            object.selected_animation = new Animation({
                                                image: this, frameSize: new Vector(object.size),
                                                frameBounds: new VectorFrameBounds(new Vector(0, 0), new Vector(0, 0))
                                            });


                                            object.frameSize = object.selected_animation.selected_frame.frameSize;


                                            DatGui.addVectorFromProperty(gui, object.size, 'this.size', 0, 1000, function () {

                                                alert('getting object');

                                                DatGui.get(object);

                                            });

                                            DatGui.addVectorFromProperty(gui, object.selected_animation.selected_frame.frameSize, 'this.selected_animation::frameSize', 0, 1000, function () {

                                                alert('getting object');

                                                DatGui.get(object);

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

                    else {
                        alert('already had file input');
                    }

                }


            }, 250);


        }

        else if (mode.toLowerCase() == 'sprite' && object instanceof Sprite) {
            console.log('TODO: level edit for actual Sprite()');

        }

        else if (mode.toLowerCase() == 'list' && object instanceof Array && object.length && object[0] instanceof Sprite) {

            console.log('TODO: present gui to edit all selected sprite objects at once');

        }

        return gui;

    },

    get: function (object, name, gui, cont) {

        this.selectedObject = object;

        $('#dat-gui-gs-container .dg.main').remove();

        this.main_gui = gui || new dat.GUI({autoPlace: false});

        $('#dat-gui-gs-container').append($(this.main_gui.domElement));

        $('#dat-gui-gs-container').css('top', 0);

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


