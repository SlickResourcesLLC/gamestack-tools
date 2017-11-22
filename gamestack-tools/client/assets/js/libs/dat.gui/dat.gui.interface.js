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

    file_upload: __ServerSideFile.file_upload, /*__ServerSideFile.file_upload(filename, content, callback)*/

    expandables: [],


    addSuperSelectButton: function (gui, object, key, list) {

        var type = gui.add(object, 'type', Gamestack.systemSpriteTypes);

        var dom = type.domElement;

        if (dom) {

            var button = $(dom).parent().find('#edit-button');

            if ($(button).length) {
                $(button).remove()

            }

            $(dom).parent().find('.c').append('<button id="edit-button" class="edit-button"></button>');

            $(dom).parent().find('.c .edit-button').click(function () {

                $('div#message').show('fast');

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

    isNumeric: function (item) {
        return typeof item == 'number' && !isNaN(item);
    },

    /*addTwoLevelsGuiByKey
     *
     * returns --psuedo dat.gui().folder()
     *
     * */

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

    addEachText: function (obj, fui) {
        var discludedKeys = ['src', 'curveString'];

        $.each(obj, function (ix, o) {

            if (discludedKeys.indexOf(ix) == -1 && typeof(obj[ix]) == 'string') {

                fui.add(obj, ix, obj[ix]);

            }

        });

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

    arrayToNameKeyArray: function (list) {

        var obj = [];

        for (var x in list) {

            obj.push(list[x].name);

        }

        return obj;
    },

    mainSpriteAnimationSelect: function (parent, obj) {

        var animations = DatGui.arrayToNameKeyArray(Game.sprites[0].animations);

        var anim_select = DatGui.main_gui.add(obj, 'animation', animations);


        anim_select.onFinishChange(function (value) {

            $.each(Game.sprites[0].animations, function (ix, item) {

                if (item.name == value && item instanceof Animation) {

                    alert('SETTING .animation to:' + item.name);

                    obj.animation = new Animation(item);

                }


            });


        });

        if (obj.animation instanceof Animation)
            anim_select.setValue(obj.animation.name);


    },

    addLineCurveSelect: function (obj, gui, key, ix, callback) {

        if (!ix) {
            ix = 0;

        }

        key = key || 'curve';

        var line_curves = obj.curve_options;

        var c = gui.add(obj, key, line_curves);

        c.onFinishChange(function (value) {

            for (var x in obj.curve_options) {
                if (obj.curve_options[x] == value) {

                    obj[key] = obj.curve_options[x];
                }
            }

            var canvasDom = $(gui.domElement).parent().find('canvas.motion-curve');

            var canvas = obj.getGraphCanvas(obj[key], canvasDom[ix]);

            if (!canvasDom.length || canvasDom.length < (ix + 1)) {
                $($(gui.domElement).children('ul')[0]).append(canvas);
            }

            callback();

        });

        for (var x in obj.curve_options) {
            if (obj.curve == obj.curve_options[x]) {
                // alert('found curve');
                c.setValue(obj.curve_options[x]);

            }

        }


    },

    addCurveSelect: function (obj, gui, key, ix, callback) {

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

            if (callback) {
                callback()
            }
            ;

        });

        c.setValue('Linear_None');

    },

    addTweenCurveSelect: function (obj, gui, key, ix, callback) {

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

            if (callback) {
                callback()
            }
            ;

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

            console.log('detected sprite');

            var fuisize = DatGui.main_gui.addFolder('size');

            alert('adding');

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

            if (isParent([Animation])) {

                var seesaw = this.main_gui.add(parent, 'seesaw_mode');

                seesaw.onChange(function (v) {

                    parent.resetFrames();

                });

                var reverseFrames = this.main_gui.add(parent, 'reverse_frames');

                reverseFrames.onChange(function (v) {

                    parent.resetFrames();
                    //happens automatically in Animation() class

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

            var r = DatGui.main_gui.add(obj.line, 'rotation', -360, 360).step(0.1);

            r.onChange(function () {

                obj.line.fill(obj.line.size, obj.line.pointDist);

            });

            //todo = add folder for min

            DatGui.addLineCurveSelect(obj.line, DatGui.main_gui, 'curve', 0, function () {

                obj.line.fill(obj.line.size, obj.line.pointDist);

            });

            var i = DatGui.main_gui.add(obj.line, 'iterations').step(1.0).min(0).max(5);

            i.onChange(function () {

                obj.line.fill(obj.line.size, obj.line.pointDist);

            });


            var p = DatGui.main_gui.add(obj.line, 'pointDist').step(1.0).min(1).max(50);

            p.onChange(function () {

                obj.line.fill(obj.line.size, obj.line.pointDist);

            });


            var g = DatGui.main_gui.add(obj.line, 'growth').step(0.1).min(1).max(5);

            g.onChange(function () {

                obj.line.fill(obj.line.size, obj.line.pointDist);

            });


            var sui = DatGui.main_gui.addFolder('size');


            var x = sui.add(obj.line.size, 'x').step(1.0);

            var y = sui.add(obj.line.size, 'y').step(1.0);


            x.onChange(function (v) {

                //fill the line over again with new size
                obj.line.fill(obj.line.size, obj.line.pointDist);


            });

            y.onChange(function (v) {

                //fill the line over again with new size
                obj.line.fill(obj.line.size, obj.line.pointDist);


            });


            var pui = DatGui.main_gui.addFolder('position');


            var px = pui.add(obj.line.position, 'x').step(1.0);

            var py = pui.add(obj.line.position, 'y').step(1.0);


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

            var fuisize = DatGui.main_gui.addFolder('size');

            var s = DatGui.addEachNumeric(o.size, fuisize);

            return true;

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

            if (obj.hasOwnProperty('name')) {

                var fui = DatGui.main_gui.addFolder('Info');

                var name = fui.add(obj, 'name');

                name.onChange(function (v) {

                    Game.refreshBuilder();

                });

            }
        }

        if (isType(Animation) && obj.hasOwnProperty('duration')) {

            var d = this.main_gui.add(obj, 'duration').step(1.0);

            d.onChange(function (v) {

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


    gameControllerGUI: function () {

        var allEventsOptions = {

            button_a: ['one', 'two', 'three'],
            button_b: ['one', 'two', 'three']

        }

        var allEvents = {

            button_a: 'one',
            button_b: 'two'

        }

        var gui = new dat.GUI({autoPlace: false});

        var a = gui.add(allEvents, 'button_a', allEventsOptions.button_a);

        var b = gui.add(allEvents, 'button_b', allEventsOptions.button_b);

        return gui;

    },

    spriteMakerGuiByKeys: function (ix, obj, reset) {
        //anything numeric:

        if (typeof(obj) == 'object') {

            var complete;

            var _inst = this;

            if (!reset) {

                complete = _inst.typeHandlerSpriteMaker(ix, obj, parent);

                $.each(obj, function (ix, o) {

                    //#typeHandler

                    if (!complete) {
                        complete = _inst.typeHandlerSpriteMaker(ix, o, obj)
                    }
                    ;


                });

            }

            if (obj instanceof Animation || obj instanceof Sound) {

                var id = id || this.create_id();

                var first_list = $('#dat-gui-gs-container div.main ul')[0];

                if (!$(first_list).find('input[type="file"]').length) {


                    var fname = 'UNDEFINED';

                    if (obj.src && obj.src.length > 270) {

                        fname = obj.src.substring(0, 270);
                    }

                    $(first_list).prepend("<input type='file' id='" + id + "'  class='dat_gui_file'/>" +
                        "<label class='file_special' id='file_special" + id + "' for='" + id + "'>Select File: <br/> " + (fname || obj.src) + "</label>");

                }

                else {

                    //   var src = obj.src || obj.image.domElement.src;

                    //   $('#file_special' + id).text(src);


                }

                $('#' + id).on('change', function (evt) {

                    var input = evt.target;

                    var file = __ServerSideFile.getRawFile(this, function (imagesrc) {

                        if (obj instanceof Animation) {

                            var filename = $(input).val().split('\\').pop();

                            DatGui.file_upload(filename, imagesrc, function (relpath, content) {

                                relpath = relpath.replace('client/', '../');

                                alert('uploaded image:' + filename + ":using relative path:" + relpath);

                                obj.src = relpath;

                                obj.image = new GameImage(relpath);

                                obj.image.domElement.onload = function () {
                                    alert('loaded');

                                    //obj = new Animation(obj);

                                    Game.sprites[0].selected_animation = obj;

                                    obj.reset();

                                    $('.file_special').text(relpath);

                                };


                            });

                        }

                        else if (obj instanceof Sound) {

                            var filename = $(input).val().split('\\').pop();

                            DatGui.file_upload(filename, imagesrc, function (relpath, content) {

                                relpath = relpath.replace('client/', '../');

                                $('#file_special' + id).text(relpath);

                                obj.src = relpath;

                                obj.sound.src = relpath;

                                Game.sprites[0].selected_sound = obj;

                                $('.file_special').text(relpath);


                            });


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

        $.each(typelist, function (ix, type) {

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

    updateableAnimationObjectToGui: function (gui, animation) {

        var first_gui = gui || $('div.main ul')[0];

        var fname;

        if (animation.image.domElement.src) {

            fname = animation.image.domElement.src.length > 270 ? animation.image.domElement.src.substring(0, 270) : animation.image.domElement.src;

            var value = 'Select File: <br/> ' + fname;

            $(animation.file_input).text(value);

        }

        if (animation instanceof Animation) {

            if (!animation.file_input && !$(first_gui).find('input[type="file"]').length) { //add file input

                var id = DatGui.create_id();

                $(first_gui).prepend("<img style='display:none;'/><input type='file' name='" + id + "' id='" + id + "'  class='dat_gui_file'/>" +
                    "<label class='file_special' id='file_special" + id + "' for='" + id + "'>Select File: <br/> " + fname + "</label>" +
                    "<canvas id='image-test-canvas' class='image-test-canvas'></canvas>");

                animation.file_input = $('#' + id)[0];

            }


        }


        $(animation.file_input).on('change', function (evt) {

            var input = evt.target;

            __ServerSideFile.getRawImageFile(this, function (image) {

                if (animation instanceof Animation) {

                    var filename = $(input).val().split('\\').pop();

                    DatGui.file_upload(filename, image, function (relpath, content) {

                        relpath = relpath.replace('client/', '../');

                        $(input).parent().find('.file_special').html("Select File: <br/> " + relpath);

                        alert('uploaded image:' + filename + ":using relative path:" + relpath);

                        $('file_special' + id).text(relpath);

                        // animation = new Animation({src:relpath});

                        animation.src = relpath;

                        animation.image = new GameImage(relpath);

                        animation.image.domElement.onload = function () {

                            animation.frameSize = new Vector(animation.image.domElement.width, animation.image.domElement.height, 0);

                            animation.animate();

                        };
                    });
                }

            });

            //DatGui.get(obj);

            evt.preventDefault();

            return false;


        });


    },

    levelMakerAnyObjectGui(object)
    {
        var gui = new dat.GUI({autoPlace: false});

        DatGui.applyTempGuiSettings(gui, 'Edit:', object.constructor.name);

        gui.add(object, 'name');

        gui.add(object, 'description');

        DatGui.addSuperSelectButton(gui, object, 'type', Gamestack.systemSpriteTypes);

        var obj = object.selected_animation;

        if (obj instanceof Animation ) {

            var id = id || "file_ref_" + this.create_id();

            var first_list = $(gui.domElement).find('ul')[0];

            if (!$(first_list).find('input[type="file"]').length) {

                var fname = 'UNDEFINED';

                if (obj.src && obj.src.length > 270) {

                    fname = obj.src.substring(0, 270);
                }

                $(first_list).prepend("<input type='file' id='" + id + "'  name='" + id + "' class='dat_gui_file' />" +
                    "<label class='file_special' id='file_special" + id + "' for='" + id + "' >Select File: <br/> " + (fname || obj.src) + "</label><canvas class='image-test-canvas'  ></canvas>");

            }

            var file =  $(gui.domElement).find('input[type="file"]')[0];

            if(!file.length)
            {
                alert('Missing a file input');
            }

            $(file).on('change', function (evt) {

                var input = evt.target;

                var file = __ServerSideFile.getRawFile(this, function (imagesrc) {

                    if (obj instanceof Animation) {

                        var filename = $(input).val().split('\\').pop();

                        DatGui.file_upload(filename, imagesrc, function (relpath, content) {

                            relpath = relpath.replace('client/', '../');

                            //alert('uploaded image:' + filename + ":using relative path:" + relpath);

                            obj.src = relpath;

                            obj.image = new GameImage(relpath);

                            obj.image.domElement.onload = function () {

                                //obj = new Animation(obj);

                                obj.frameSize = new Vector(obj.image.domElement.width, obj.image.domElement.height);

                                object.setSize(obj.frameSize);

                                object.selected_animation = new Animation(obj);

                                obj.reset();

                                $('.file_special').text(relpath);

                                App.animationPreview(gui, object);


                            };


                        });

                    }

                    else if (obj instanceof Sound) {

                        var filename = $(input).val().split('\\').pop();

                        DatGui.file_upload(filename, imagesrc, function (relpath, content) {

                            relpath = relpath.replace('client/', '../');

                            $('#file_special' + id).text(relpath);

                            obj.src = relpath;

                            obj.sound.src = relpath;

                            Game.sprites[0].selected_sound = obj;

                            $('.file_special').text(relpath);


                        });


                    }

                });

                evt.preventDefault();

                return false;


            });


        }

        DatGui.addVectorFromProperty(gui, object.size, 'size', 0, 5000, function () {
        });

        switch(object.constructor.name)
        {

            case "Background":

                //allow 9 images, tileSize, and more
                gui.add(object, 'orientation', ['x', 'y', 'xy']);

                gui.add(object, 'reverseX');

                gui.add(object, 'reverseY');

                gui.add(object, 'speedFloat').min(0).max(1.0).step(0.01);

                console.info("TODO: create Full GUI for editable BACKGROUND: object: src-image, etc..");

                break;

            case "Terrain":

                gui.add(object, 'collision_type', ["FULL_COLLIDE" , "TOP_COLLIDE" ,  "BOTTOM_COLLIDE", "SIDE_COLLIDE", "LEFT_COLLIDE", "RIGHT_COLLIDE", "NO_COLLIDE"]);

                break;

            case "Interactive":

                console.info("TODO: create Full GUI for editable INTERACTIVE: object, powerblock, powerup, collectable");

                break;



            case "Three":

                console.info("TODO: create Full GUI for editable THREE.js object");
              var geometry = gui.add(object, 'geometry', ["DodecahedronGeometry", "BoxGeometry", "SphereGeometry", "CylinderGeometry", "TorusGeometry"]);

              geometry.onChange(function(){
                //create new geometry



              });

                break;

            case "Sprite":


                break;

            default:


        }

        App.animationPreview(gui, object);

        return gui;

    },

    mainSpriteSettingsGui: function (object) {
        var gui = new dat.GUI({autoPlace: false});

        $(gui.domElement).addClass('.tempGui');

        var name = gui.add(object, 'name');

        var description = gui.add(object, 'description');

        DatGui.addSuperSelectButton(gui, object, 'type', Gamestack.systemSpriteTypes);

        DatGui.addVectorFromProperty(gui, object.size, 'size', 0, 5000, function () {
        });

        DatGui.addVectorFromProperty(gui, object.position, 'position', -1000, 1000, function () {


        });

        gui = DatGui.applyTempGuiSettings(gui, 'Basic Settings:', object.name);

        $(gui.domElement).find('button.ok').on('click', function () {

            $(gui.domElement).remove();

        });

        return gui;

    },

    get_alt:function(object, name, gui)
    {

        this.main_gui = gui;

        return this.spriteMakerGuiByKeys(name, object);
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

    },

    applyTempGuiSettings: function (gui, title, name) //modifier: tempGui
    {
        var dom;

        if(gui.domElement)
        {
            dom = gui.domElement;

        }
        else
        {
            dom = gui;
        }

        $(dom).addClass('tempGui');

        if(!$(dom).find('button.gui-close-button').length) {

            $(dom).prepend("<h4 style=' font-size:1.2em; padding:2px; background:black;'> " + title + ": &nbsp;&#9655;&nbsp;<span style=' position:absolute; display:inline-block; font-size:1.2em;  color:#c56c00; margin-top:-3px; '>" + name + "</span><button class='gui-close-button' style='float:right; width:23px; height:30px; background:transparent; padding:5px; margin-top:-4px; margin-right:3px; color:darkorange;' class='close'>X</button></h4>");

            $(dom).css('position', 'absolute');

            $(dom).css('z-index', '9998');

            $(dom).css('left', '!important');

            $(dom).css('right', '80px');

            $(dom).css('min-width', '400px');

            $(dom).css('overflow-y', 'scroll');

            $(dom).css('width', '40%');

            $(dom).css('background', 'black');

            $(dom).css('top', '50px');

            $(dom).css('font-size', '80%');

            $(dom).append('<button style="width:80%;" class="ok">Ok</button>');

            $($(dom).find('ul')[0]).css('background', 'black');

            $(dom).find('div.close-button').remove();

            $(dom).find('button.close').on('click', function () {

                App.hideAndRemoveTempGuis();

            });
        }

        return gui;

    },

    allControllerEventsCheckGui(linkableObject, object, title)
    {
        var gp_events = new Gamestack.ControllerEventKeys();

        console.error('allControllerEventsCheckGui(): THIS FUNCTION STILL MUST BE COMPLETED');

        var gui = new dat.GUI({autoPlace: false});

        var combinables = [];

        for (var x in gp_events) {

            gui.add(gp_events, x);
        };

        gp_events['gamepad_ix'] = 0;

        gui.add(gp_events, 'gamepad_ix').min(0).max(4).step(1);

        DatGui.applyTempGuiSettings(gui, "<img style='max-height:35px; width:auto;' src='image/controller_icon.png' />" +  title, linkableObject.name);

        $(gui.domElement).find('button.ok').on('click', function () {

            var propKeysMain = Object.getOwnPropertyNames(linkableObject.constructor.prototype);

            for (var ix in gp_events) {

            }

            App.hideAndRemoveTempGuis();

        });

        return gui;

    },

    allObjectEventsCheckGui: function (linkableObject, objects, title) {

        function startKey(obj)
        {

            return obj.constructor.name + '():' + obj.name + '@Start';
        };

        function endKey(obj)
        {

            return obj.constructor.name + '():' + obj.name + '@Complete';
        };

        var gui = new dat.GUI({autoPlace: false});

        var combinables = [];

        for (var x = 0; x < objects.length; x++) {

            if (objects[x] instanceof Sprite) {
                var sprite = objects[x];

                for (var y in sprite) {

                    if (sprite[y] instanceof Array) {

                        for (var z = 0; z < sprite[y].length; z++) {

                            var obj = sprite[y][z],

                                ctr = obj.constructor.name;

                            var keyComplete = endKey(obj),

                                keySimultaneous = startKey(obj);

                            switch (ctr) {

                                case "Animation":

                                    combinables.push(obj);

                                    console.log('We have animation');

                                    obj[keyComplete] = false;

                                    obj[keySimultaneous] = false;

                                    var c = gui.add(obj, keyComplete);

                                    var s = gui.add(obj, keySimultaneous);

                                    break;

                                case "Motion":

                                    combinables.push(obj);


                                    console.log('We have motion');


                                    obj[keyComplete] = false;

                                    obj[keySimultaneous] = false;

                                    var c = gui.add(obj, keyComplete);

                                    var s = gui.add(obj, keySimultaneous);
                                    break;


                                case "Sound":

                                    combinables.push(obj);


                                    console.log('We have motion');

                                    obj[keyComplete] = false;

                                    obj[keySimultaneous] = false;

                                    var c = gui.add(obj, keyComplete);

                                    var s = gui.add(obj, keySimultaneous);
                                    break;


                                case "Projectile":

                                    combinables.push(obj);

                                    console.log('We have motion');

                                    obj[keyComplete] = false;

                                    obj[keySimultaneous] = false;

                                    var c = gui.add(obj, keyComplete);

                                    var s = gui.add(obj, keySimultaneous);
                                    break;


                            }


                        }


                    }


                }


            }


        }

        DatGui.applyTempGuiSettings(gui, title, linkableObject.name);

        $(gui.domElement).find('button.ok').on('click', function () {

            var propKeysMain = Object.getOwnPropertyNames(linkableObject.constructor.prototype);

            for (var ix in combinables) {

                var obj = combinables[ix], objDone = false;

                var propKeysExtendor = Object.getOwnPropertyNames(obj.constructor.prototype), found = false;

                if (!found)
                    for (var q in propKeysMain) {
                        var x = propKeysMain[q];

                        for (var iz in propKeysExtendor) {

                            var itemz = propKeysExtendor[iz];

                            var keyComplete = endKey(obj),

                                keySimultaneous = startKey(obj);

                            for (var y in obj) {

                                if (!found && obj[keySimultaneous] && ['onRun'].indexOf(x) >= 0) {

                                    if (['apply', 'fire', 'start', 'run', 'play', 'engage'].indexOf(itemz) >= 0) {

                                        alert('extending');

                                        found = true;

                                        Gamestack.ExtendEvents(linkableObject, x, obj, itemz);

                                    }


                                }


                                else if (!found && obj[keyComplete] && ['complete'].indexOf(x) >= 0
                                    && ['apply', 'fire', 'start', 'run', 'play'].indexOf(itemz) >= 0) {

                                    Gamestack.ExtendEvents(linkableObject, x, obj, itemz);

                                    found = true;


                                }


                            }

                        }
                    }
            }


            App.hideAndRemoveTempGuis();


        });

        return gui;

    }

};

