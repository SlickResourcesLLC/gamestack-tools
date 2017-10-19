/**
 * Created by Administrator on 9/5/2017.
 */

Canvas.__levelMaker = true;


//App{}: a collection of UI functionality

var App = {

  stats:{},

  TESTGAME:true,

  DEVMODE: false,


  replace_map_object:function(item) {

    $.each(App.map_objects, function (n, map_item) {

      if (map_item.id == item.id) {

        var action = Option_Funx.OptionActionList(item.name, item, function (err, element) {

          console.log('added 1 map object');

          var value = $(element).text();

          __levelMaker.selectedElement = __levelMaker.get(value);

        });

        App.map_objects[n] = action;

      }

    });
  },

  add_map_object:function(item){

    $.each(App.map_objects, function(n, map_item){

      if(map_item.id == item.id)
      {

        App.map_objects.splice(n, 1);
      }

    });

    App.map_objects.push(Option_Funx.OptionActionList(item.tag, item, function (err, element) {

      console.log('added 1 map object');

      var value = $(element).text();

      __levelMaker.selectedElement = __levelMaker.get(value);

    }));

  },

  image_upload: __ServerSideImage.image_upload, /*__ServerSideImage.image_upload(filename, content, callback)*/

  superSelectOptions:function(name, options, callback)
  {
    var addListHTML = '<div class="add-list">' +

      '<label>'+name+'</label>' +

      '<button type="button" class="add-list add">+</button>' +

      '<ul class="add-list"> </ul>' +
      '</div>';

    App.message(addListHTML);

    var setForAddition = function () {

      $('div#message').find('input.list').each(function (ix, item) {

        $(item).on('change', function (evt) {

          options[ix] = $(item).val();


        });

      });

    };

    var setForDeletion = function () {

      $('div#message').find('button.list-delete').each(function (ix, item) {

        $(item).on('click', function (evt) {

          var value = $(this).parent().find('input').val();

          if(value == ""){ value = $(this).parent().find('input').prop('placeholder');}

          var li = options[ix];

          var alist = options;

          for (var x in alist) {

            if (alist[x] == value) {
              options.splice(x, 1);

            }

          }

          $(this).parent().remove();


        });

      });

    };

    $('div.add-list button.add').unbind().on('click', function (evt) {

      var len = $(this).parent().find('li').length, tvalue = "list_value_" + len;

      while (__levelMaker.settings.psuedoSpriteTypes.indexOf(tvalue) >= 0) {
        tvalue += '_c';

      }

      $(this).parent().find('ul').append('<li> <input type="text" class="list" placeholder="' + tvalue + '" /> <button type="button" class="list-delete">X</button></li>');

      setForDeletion();

      setForAddition();

      evt.preventDefault();

      return false;

    });

    $.each(options, function(ix, item){

      $('div#message ul').append('<li> <input type="text" class="list" placeholder="' + item + '" /> <button type="button" class="list-delete">X</button> </li>');

    });


    setForAddition();

    setForDeletion();

    $('button#message-ok').click(function(){

      if(callback)
      {
        callback();

      }



    });

  },

  create_level: function (data, callback) {

    var __inst = Game;

    __levelMaker.mapElements = [];

    var usingOptFile = true;

    if(data && data.settings)
    {

      __inst.settings = data.settings;

      __levelMaker.settings = data.settings;

    }

    if(data && data.sprites instanceof Array)
    {

      $.each(data.sprites, function(ix, item){

        __inst.sprites[ix] = new Sprite().restoreFrom(item);

        __inst.sprites[ix].init();

      });

    };

    if(data && data.gameWindow && data.gameWindow.forces instanceof Array)
    {

      $.each(data.gameWindow.forces, function(ix, item){

        __inst.forces[ix] = new Force(item);

      });

    };


    var start_level = function () {

      __levelMaker.applySettings(__levelMaker.settings);

      __inst.canvas = document.getElementById('myCanvas');

      __inst.ctx = __inst.canvas.getContext('2d');

      __inst.collective_forces = [];

      //2. create a GameWindow to be sychronizd

      __inst.GameWindow = new GameWindow({
        canvas: __inst.canvas,
        ctx:__inst.ctx,
        sprites: __inst.sprites,
        forces: __inst.forces
      }, function () {


      });

      __levelMaker.selectedElement = __levelMaker.get();

      var sprMapItem = __levelMaker.get();

      if (sprMapItem) {
        __levelMaker.selectedSprite = __levelMaker.createMapSprite(sprMapItem, __levelMaker.mouse.x, __levelMaker.mouse.y);
      }

      __inst.is_init = true;


      if (usingOptFile) {

        App.loadDefaultMapElements(function () {


          $.each(__levelMaker.mapElements, function (ix, item) {

            App.add_map_object(item);

          });


        });


      }
      else {

        $.each(__levelMaker.mapElements, function (ix, item) {

          App.add_map_object(item);

        });


      }


      if (typeof(callback) == 'function') {

        callback();

      }

    };


    start_level();

  },

  applyRecentFiles: function () {
    var files = localStorage.getItem('recent-files');

    App.recent_files = JSON.parse(files);

    if (!App.recent_files instanceof Array) {
      App.recent_files = [];

    }

  },

  addRecentFile: function (filename) {

    var files = localStorage.getItem('recent-files');

    if (files) {

      App.recent_files = JSON.parse(files);


    }


    if (App.recent_files instanceof Array) {
      App.recent_files = [];

    }

    if (filename) {

      App.recent_files.push(filename);

    }


    if (App.recent_files.length >= 4) {
      App.recent_files.shift();

    }

    localStorage.setItem('recent-files', JSON.stringify(App.recent_files));

    //  alert(localStorage.getItem('recent-files'));

  },

  closeMessage:function(callback)
  {

    $('#message').hide();


  },

  collectNumber:function(min, max, inputValueCallback)
  {

    this.message("<input type='number' value='0' min='"+min+"'  max='"+max+"'   />");

    $('button#message-ok').unbind().click(function(){

      var value = $(this).parent().find("input").val();

      value = parseFloat(value);

      inputValueCallback(value);

    });

  },

  message:function(v)
  {

    $('#message span').html(v + "<br/><button class='ok' id='message-ok' onclick='App.closeMessage();'>OK</button>");

    $('#message').show();

  },

  applyLevelSave:function()
  {

    var name = $('#message-file-name').val();

    App.saveLevel(name);

  },

  beginLevelSave:function()
  {

    $('#message span').html( "Enter File Name" +

      "<br/><input id='message-file-name' type='text' value='"+__levelMaker.settings.name+"' class='message-file'  />" +

      "<br/><button class='ok' onclick='App.applyLevelSave();'>OK</button><button class='cancel' onclick='App.closeMessage();'>Cancel</button>");

    $('#message').show();

  },


  saveLevel: function (name) {

    if(name == "")
    {
      alert('Applying default level name:' + __levelMaker.settings.name);
      name = false;
    }

    __levelMaker.settings.name = name || __levelMaker.settings.name;

    if(!__levelMaker.settings.name.endsWith('.json'))
    {
      __levelMaker.settings.name += ".json";
    }

    //onBeforeSave :: take every image reference from the 'uploads' catch, save the image to a permanent folder in

    //assets/game/image/

    var data = __levelMaker.MapData(Game.sprites, __levelMaker.settings, Game.GameWindow.forces);

    data = jstr(data);

    App.triggerDownload(__levelMaker.settings.name, data, function(data){

      data = JSON.parse(data);

      if(data.path)
      {

        App.message('file saved to:' + '<a target="_blank" href="file:///'+data.path + '" >'+data.path+'</a>');

      }

    });

  },

  newLevel: function () {


    window.location.reload();

  },

  loadLevelReady: function () {


    $('#level-file-input').change(function (evt) {

      __levelMaker.getRawLevelFile(this, function (result) {


        if (!App.loadComplete) {

          __levelMaker.level_file_str = result;

          __levelMaker.applySettings(result);

          var level = JSON.parse(result);

          App.loadComplete = true;

          App.create_level(level);

        }
        ;

      });

    });

    $('#load-level').click(function () {

      $('#level-file-input').click();

    });


    $('#multi-map-object-file-input').change(function (evt) {

      var files = evt.target.files;

      $.each(files, function (ix, fitem) {

        __levelMaker.getImageFileCallback(fitem, function (name, w, h, result) {

          App.image_upload(name, result, function (relpath, content) {

            __levelMaker.selected_image_src = '..' + relpath.replace('client', '');

            // alert(__levelMaker.selected_image_src);

            console.log('Making objects in create event');

            var args = {type: "game object", description: "multi-loaded object"};

            args.size = new Vector3(w, h, 0);

            args.name = name;

            if (args.name && args.description) {

              var mapElementArgs = {name: args.name, src: __levelMaker.selected_image_src};

              var sprite = __levelMaker.createMapElement(mapElementArgs, function (sprite) {

                sprite.frameSize = new Vector3(sprite.img.width, sprite.img.height, 0);

                sprite.__mapSize = new Vector3(sprite.img.width, sprite.img.height, 0);

                sprite.mapSize = sprite.__mapSize;

                sprite.size = sprite.__mapSize;

                __levelMaker.addLevelObjectToUI(sprite);

                if (ix == files.length - 1) {

                  //  alert('last file');

                  App.dialog(App.map_objects,
                    0, 120, function () {
                      console.log('dialog shown');
                    });

                }

              });

            }

          });


        });


      });


    });


    $('#load-map-objects').click(function () {


      $('#multi-map-object-file-input').click();

    });


  },

  MapOptions: function (elements) {


    return {elements: elements}

  },


  loadDefaultMapElements: function (callback) //load map elements
  {

    $.getJSON("assets/system-data/level-maker-2d-options.json", function (data) {

      var myObject = data;

      var elements = myObject.elements;

      for (var x = 0; x < elements.length; x++) {
        if (elements[x].src) {

          elements[x] = __levelMaker.createMapElement(elements[x]);

          //  __gameStack.addImageSrc(elements[x].img.src, elements[x].img_id || false);

          //  elements[x].img_id = __gameStack.getImageId(elements[x].img.src);

        }


      }

      __levelMaker.mapElements = myObject.elements;


      __levelMaker.selectedElement = __levelMaker.get();


      if (typeof(callback) == 'function') {
        callback();

      }

    });

  },

  triggerDownload: function (filename, content, callback) {

    $.post("http://localhost:3137/save", {filename: filename, content: content})
      .done(function (data) {

        if (typeof(callback) == 'function') {

          callback(data);

        }

        //  alert( "Data Saved: " + data );
      });

  },

  saveMapOptions: function (data, callback) {

    $.post("http://localhost:3137/save-map-options", {data: data})
      .done(function (data) {

        if (typeof(callback) == 'function') {

          callback();

        }

        //  alert( "Data Saved: " + data );
      });

  },

  createDemo: function (lib) {


    var pathPref = __levelMaker.url_prefix;


    var saveLevel = function () {

      $.post('/levelmaker', level, function (data) {


        console.log("response:" + JSON.stringify(data));
      });
    }

  },

  map_objects:[],

  placeRCMenu: function (x, y, visible) {

    if (visible) {
      $('.dropdown.rc').show();

    }
    else {
      $('.dropdown.rc').hide();

    }


    var ct = 0;


    var d = $('.dropdown.rc')[0];

    $(d).css('left', x);

    $(d).css('top', y - 50);


  },

  setInputEvents: function (lib) {

    lib.InputEvents.extend('mousemove', function (x, y) {

      var zoom = $('.level-maker-canvas').css('zoom');

      zoom = parseFloat(zoom);

      console.log('zoom:' + 1.0 / zoom);

      __levelMaker.mouse.x = x * (1.0 / zoom);
      __levelMaker.mouse.y = y * (1.0 / zoom);


      if (!App.left_click_locked) {

        __levelMaker.moveSelected(__levelMaker.mouse.x, __levelMaker.mouse.y);

      }

    });



    lib.InputEvents.extend('leftclick', function (x, y) {

      if (!App.left_click_locked) {

        __levelMaker.leftClick(x, y);

        __levelMaker.mouse.down = true;

      }
      else {
        if (confirm('Go back to normal level-building mode?')) {

          var zoom = $('.level-maker-canvas').css('zoom', 1.0);

          App.left_click_locked = false;

          App.refreshRightClick();

          if(Game.TEST_MODE !== false)
          {

            App.restart();

            Game.TEST_MODE = false;

          }

        }
        ;

      }

    }, function (x, y) {

      //button was released

      __levelMaker.release_hover_select();

      __levelMaker.release_drag_select();

      if (!__levelMaker.shift) {
        __levelMaker.release_select();

      }


      __levelMaker.mouse.down = false;

    });

    var container = $('#gs-container')[0];

    container.oncontextmenu = function (e) {

      if (!App.DEVMODE) {

      }

    };

    lib.InputEvents.extend('rightclick', function (x, y) {

      //   __levelMaker.rightClick(x, y);
    }, function (x, y) {

      //button was released

    });
    lib.InputEvents.extend('mousemove', function (x, y) {

      __levelMaker.mouse.x = x;
      __levelMaker.mouse.y = y;

      __levelMaker.moveSelected(__levelMaker.mouse.x, __levelMaker.mouse.y);

    });


    __gameStack.InputEvents.init();





  },

  setTravelModeGui: function () {

    var sgui = new dat.GUI({autoPlace: false});

    sgui.add(__levelMaker.assembled_sprite.travel_mode, 'key', __levelMaker.assembled_sprite.travel_mode_keys);
    sgui.add(__levelMaker.assembled_sprite.travel_mode, 'acceleration').min(0.002).max(2.0).step(0.05);

    sgui.add(__levelMaker.assembled_sprite.travel_mode, 'decel').min(0.002).max(2.0).step(0.05);

    sgui.add(__levelMaker.assembled_sprite.travel_mode, 'max_speed').min(0.1).max(20.0).step(0.05);


    $('.travel-mode-gui').append($(sgui.domElement));

  },

  setRotationVectorGui: function () {


    var rsgui = new dat.GUI({autoPlace:false});

    //  rsgui.add(__levelMaker.assembled_sprite.rot_speed, 'x').min(-50).max(50);

    //  $('.rotation-speed-gui').append($(rsgui.domElement));

    var agui = new dat.GUI({autoPlace: false});

    agui.add(__levelMaker.assembled_sprite.rot_accel, 'x').min(-50).max(50);

    $('.rotation-accel-gui').append($(agui.domElement));


  },

  option_funx_assembler: function () {

    var OptionActionList = function (text, data, callback) {

      return {text: text, id:data.id, data: data, callback: callback}

    };

    var app_out = {
      _objects: {},
      OptionActionList: OptionActionList

    };

    return app_out;
  },

  dialog: function (list, targetPX, targetPY, callback) {

    $('.free-select ul').html('');

    var show = function () {

      $('.free-select').show();

      $('.free-select').css('top', targetPY);

      $('.free-select').css('left', targetPX);


    };

    var hide = function () {

      $('.free-select').hide('slow');

    };


    $.each(list, function (x, item) {

      var cmText = item.text;

      var cmCallback = item.callback, hCall = item.hoverCallback;

      var data = item.data;

      var cm_id = data.id;

      var found = false;

      if($('.free-select ul li').length)
      {


        $('.free-select ul li').each( function(ix, item){

          if($(this).text() == cmText)
          {
            found = true;

          }

        });


      }

      if(!found) {

        $('.free-select ul').append('<li ><a id="' + cm_id + '">' + cmText + '</a><img  src="' + item.data.image.domElement.src + '"  /></li>');


      }

      var link = $('.free-select ul li a')[x];

      var lparent = $(link).parent();

      $(lparent).data('id', cm_id);

      $(link).on('click', function () {

        cmCallback(false, this);

        hide();

      });

      $(lparent).on('contextmenu', function (evt) {

        var textItem = $(this).find('a')[0], value = $(textItem).text();

        __levelMaker.selectedElement = __levelMaker.get(value);


      });


      $(lparent).on('click', function () {
        cmCallback(false, $(link));

        hide();

      });


    });

    show();

  }

};


var Option_Funx = App.option_funx_assembler();

var Game = {

  TEST_MODE:false,

  WIDTH: 0,

  HEIGHT: 0,

  GameWindow: {},

  canvas: {},

  ctx: {},

  sprites: [],

  forces:[],

  is_init: false,


  update: function () {

    this.WIDTH = __levelMaker.settings.levelSizeX;

    this.HEIGHT = __levelMaker.settings.levelSizeY;

    if (!this.is_init) {
      return 0;

    }

    if(this.TEST_MODE == true) {

      this.GameWindow.update();

    }

  },


  render: function () {

    if (!this.is_init) {
      return 0;

    }


    this.GameWindow.draw();

    var __inst = this;


    Canvas.draw(__levelMaker.hover_selection_sprite, this.GameWindow.ctx);

    $.each(this.sprites, function (ix, item) {

      if (item.selected) {
        __levelMaker.selection_sprite.setSize(item.size);
        __levelMaker.selection_sprite.setPos(item.position);

        Canvas.draw(__levelMaker.selection_sprite, __inst.GameWindow.ctx);

      }

    });


  },

  init: function (callback) {


    App.create_level(false, function () {

      if (typeof(callback) == 'function') {
        callback();

      }


    });


    $('#create_map_object').click(function () {

      __levelMaker.showObjectDialog(this);

    });


    $('#settings_button').click(function () {

      __levelMaker.settings.show();

    });


    $('#download').click(function () {

      var sprites = Game.sprites;

      var remove = function (list, my_item) {

        $.each(list, function (ix, item) {

          if (item == my_item) {
            //   alert('removing sprite');

            list.splice(ix, 1);

          }

        });

      };

      $.each(sprites, function (ix, item) {

        if (item == __levelMaker.selection_sprite || item == __levelMaker.hover_selection_sprite) {
          //  alert('removing sprite');

          Game.sprites = Game.sprites.splice(ix, 1);

        }

      });

      //$(this).prop('download', __levelMaker.settings.name + '.json');

      // $(this).prop('target', '_blank');

      function roughSizeOfObject(object) {

        var objectList = [];
        var stack = [object];
        var bytes = 0;

        while (stack.length) {
          var value = stack.pop();

          if (typeof value === 'boolean') {
            bytes += 4;
          }
          else if (typeof value === 'string') {
            bytes += value.length * 2;
          }
          else if (typeof value === 'number') {
            bytes += 8;
          }
          else if
          (
            typeof value === 'object'
            && objectList.indexOf(value) === -1
          ) {
            objectList.push(value);

            for (var i in value) {
              stack.push(value[i]);
            }
          }
        }
        return bytes;
      };

      App.beginLevelSave(function(bool){

        console.log('Level Saved:' + bool);

      });



    });

    $('form').submit(function (evt) {


      evt.preventDefault();

      return false;

    });

  }

};

jQuery.expr.filters.offscreen = function (el) {
  var rect = el.getBoundingClientRect();
  return (
    (rect.x + rect.width) < 0
    || (rect.y + rect.height) < 0
    || (rect.x > window.innerWidth || rect.y > window.innerHeight)
  );
};


/***********************************************
 * __levelMaker
 *
 * :returns object{}
 * allows building of game levels
 * -map out sprites of various types on the canvas
 * -save them to a json file
 *********************************************/

function LevelMaker(filename, settings) {

  settings = settings || {};

  var mySettings = {

    name: filename || "level",

    description: "the default level for this game",

    pixelSnapX: 10,

    pixelSnapY: 10,

    levelSizeX: 5000,

    levelSizeY: 5000,

    levelSizeZ: 0,

    gameScale: 2.0,

    testGravity:"TODO",

    testPlayer:"TODO",

    psuedoSpriteTypes: GameStack.systemSpriteTypes, //The minimum psuedoTypes,

    psuedoAnimationTypes: GameStack.systemAnimationTypes, //The minimum psuedoTypes,

    show: function () {


      $('form#settings').on('submit', function (evt) {

        evt.preventDefault();

        return false;

      });


      $('div#settings-space form').show();

    }

  };

  if(settings)
  {
    for(var x in settings)
    {
      mySettings[x] = settings[x];

    }

  }

  return {

    topScroll: 0,

    selected_image_src: {},

    discluded_sprites: [],

    assembled_sprite: {},

    lastPlantedCountRecordArray: [],

    settings: mySettings,

    objectMemberToArray: function (object, key) {

      var list = [];

      for (var x in object) {

        list.push(object[key]);

      }

      return list;

    },

    removeLast: function () {

      var number = __levelMaker.lastPlantedCountRecordArray[__levelMaker.lastPlantedCountRecordArray.length - 1];

      for (var x = 0; x < number; x++) {

        Game.sprites.pop();

      }
    },


    removeList: function (list) {

      if(!list)
      {
        return 0;

      }

      var sprites = list;

      for (var x in sprites) {

        var ix = Game.sprites.indexOf(sprites[x]);

        if(ix >= 0)
        {

          Game.sprites.splice(ix, 1);

        }


      }
    },


    arrayToSelect: function (containerId, selectId, values) {

      var myDiv = document.getElementById(containerId);

      //Create array of options to be added
      var array = values;

      //Create and append select list
      var selectList = document.createElement("select");
      selectList.id = selectId;
      myDiv.appendChild(selectList);

      //Create and append the options
      for (var i = 0; i < array.length; i++) {
        var option = document.createElement("option");
        option.value = array[i];
        option.text = array[i];
        selectList.appendChild(option);
      }

    }

    ,


    applySettings: function (data) {

      alert('applying settings');

      data = data || __levelMaker.settings;

      if (typeof(data) == 'string') {
        data = JSON.parse(data).settings;

      }

      $('.level-maker-canvas,#gs-container').width(data.levelSizeX);
      $('.level-maker-canvas,#gs-container').height(data.levelSizeY);

      Game.canvas.width = data.levelSizeX;

      Game.canvas.height = data.levelSizeY;

      $('#map-item-space form').hide('slow');

    },

    showObjectDialog: function () {

      //TODO: create dat.GUI() for the Map Object(s)

      $('#map-item-space form .sprite-space').html('');

      __levelMaker.assembled_sprite =  new Sprite().to_map_object();

      var sprite_gui = DatGui.getLevelObjectGui( __levelMaker.assembled_sprite, true);

      $('#map-item-space form .sprite-space').append($(sprite_gui.domElement));

      // $('#map-item-space .title').text("Create Map Item Sprite");

      $('#map-item-space form').show();

      $('#map-item-space  button#close').click(function(){

        $('#map-item-space form').hide('fast');

      });


      $('button#create_object').click(function () {

        var hasLevelObjectName = function(name)
        {

          var found = false;

          $.each(__levelMaker.mapElements, function(ix, item){

            if(item.name == name)
            {
              found = true;

            }

          });

          return found;

        };


        if(hasLevelObjectName(__levelMaker.assembled_sprite.name))
        {

          return alert('Must have a unique name to create object.');

        }


        var sprite = __levelMaker.createMapElement(__levelMaker.assembled_sprite, false, true);

        sprite.animate();

        sprite.tag = sprite.name;


        __levelMaker.addLevelObjectToUI(sprite);

        //  alert('last file');


        App.dialog(App.map_objects,
          0, 120, function () {
            console.log('dialog shown');
          });


        $('#map-item-space form').hide();


      });


      $('#map-item-space #ok-cancel-space').show();

      $('#map-item-space #just-ok-space').hide();


    },


    objectMakerFormEvents: function () {

      __levelMaker.assembled_sprite = new Sprite();

      App.setRotationVectorGui();

    },

    image_preview_interval:false,

    imagePreview: function (sprite_object) {

      Canvas.__levelMaker = true;

      // alert(jstr(sprite_object.selected_animation));

      var canvas = document.getElementById('image-test-canvas');

      var ctx = canvas.getContext('2d');

      sprite_object.active = true;




      if(this.image_preview_interval)
      {
        window.clearInterval(this.image_preview_interval);

      }


      this.image_preview_interval = window.setInterval(function(){


        ctx.clearRect(0, 0, canvas.width, canvas.height);


        var minScale = canvas.width / sprite_object.size.x ;

        var minScaleY = canvas.height / sprite_object.size.y ;

        if(minScaleY < minScale)
        {
          minScale = minScaleY;

        }

        minScale = Math.round(minScale * 10) / 10;

        ctx.save();

        ctx.scale(minScale,minScale);

        sprite_object.position.x = canvas.width  / 2  - sprite_object.size.x *minScale  / 2;

        sprite_object.position.y = canvas.height  / 2 - sprite_object.size.y * minScale  / 2;


        __levelMaker.selection_sprite.position = new Vector3(sprite_object.position);

        __levelMaker.selection_sprite.size = new Vector3(sprite_object.size);

        Canvas.draw(sprite_object, ctx);

        Canvas.draw(__levelMaker.selection_sprite, ctx);

        ctx.restore();

      }, 500);

    },

    getRawImageFile: function (input, callback) {

      var preview = $(input).parent().find('img')[0];
      var file = input.files[0];
      var reader = new FileReader();

      reader.addEventListener("load", function () {

        preview.src = reader.result;

        __levelMaker.selected_image_src = preview.src;

        $('#image_data').val(reader.result);

        preview.onload = function () {

          if (typeof(callback) == 'function') {
            callback(this);

          }

        }

      }, false);

      if (file) {
        reader.readAsDataURL(file);
      }


    },

    getImageFileCallback: function (file, callback) {


      var reader = new FileReader();

      reader.name = file.name;

      reader.addEventListener("load", function () {

        var mapWidth = this.width,

          mapHeight = this.height;

        var x = 0, y = 0;

        if (typeof(callback) == 'function') {
          callback(this.name, mapWidth, mapHeight, this.result);

        }
      }, false);

      if (file) {
        reader.readAsDataURL(file);
      }


    },

    getRawLevelFile: function (input, callback) {

      var filename = $(input).val().split('\\').pop();

      if (filename.toLowerCase().indexOf('.json') >= 0) {

        var file = input.files[0];
        var reader = new FileReader();

        reader.addEventListener("load", function () {

          callback(reader.result)

        }, false);

        if (file) {
          reader.readAsText(file);
        }

      }
    },

    MapData: function (sprites, settings, gameWindow) {

      return {sprites: sprites, settings: settings, gameWindow:gameWindow};
    },

    selection_sprite: {},
    mouse: {
      x: 0, y: 0,

      down: false

    },
    getDocHeight: function () {
      var D = document;
      return Math.max(
        D.body.scrollHeight, D.documentElement.scrollHeight,
        D.body.offsetHeight, D.documentElement.offsetHeight,
        D.body.clientHeight, D.documentElement.clientHeight
      )
    },
    scrollAdjust: function () {
      var winheight = window.innerHeight || (document.documentElement || document.body).clientHeight
      var docheight = __levelMaker.getDocHeight();
      var scrollTop = window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop
      var trackLength = docheight - winheight
      var pctScrolled = Math.floor(scrollTop / trackLength * 100) // gets percentage scrolled (ie: 80 or NaN if tracklength == 0)
      console.log(pctScrolled + '% scrolled');

      __levelMaker.topScroll = Game.canvas.height * (pctScrolled / 100);

      return Game.canvas.height * (pctScrolled / 100);

    },
    mapElements: [],
    get: function (tag) {

      var e = this.mapElements[0];

      var hasTagMatch = function (obj, key) {

        return obj[key] && obj[key] == tag;
      };

      if (tag) {

        for (var x = 0; x < this.mapElements.length; x++) {

          if (hasTagMatch(this.mapElements[x], 'tag') || hasTagMatch(this.mapElements[x], 'name')) {


            e = this.mapElements[x];
          }

        }


      }

      return e;
    },
    createMapElement: function (args, callback, pushNow) {

      var img;

      var mapElement;

      if(args instanceof Sprite) {

        mapElement = args;

        mapElement.__mapSize = mapElement.__mapSize || mapElement.size;

      }
      else
      {
        img = document.createElement('IMG');

        img.src = args.src || args.imgPath;


        mapElement  = new Sprite({
          name: args.name || args.tag,

          img: img,
          src: img.src,
          __mapScale: args.__mapScale || false,
          __mapSize: new Vector3(args.__mapSize || args.mapSize || args.size),
          frameSize: new Vector3(args.frameSize)
        });

        mapElement.setSize(mapElement.__mapSize);

      }

      //make name equal to tag:

      mapElement.tag = mapElement.name;

      //

      //mapScale overwrites the __mapSize:

      if (mapElement.__mapScale) {
        mapElement.__mapSize = new Vector3(args.frameSize.mult(element.__mapScale));
      }


      if (args.extras) {

        var extras = args.extras;

        for (var x in extras) {
          mapElement[x] = JSON.parse(JSON.stringify(extras[x]));

        }
        ;

      }
      ;


      var __inst = this;

      if(pushNow)
      {

        __inst.mapElements.push(mapElement);

        return mapElement;

      }


      mapElement.image.domElement.onerror = function (e) {


        var ix = __inst.mapElements.indexOf(mapElement);

        __inst.mapElements.splice(ix, 1);

        this.__error = true;

      };


      mapElement.image.domElement.onload = function () {

        if (!this.__error) {

          var ix = __inst.mapElements.indexOf(mapElement);

          if(ix < 0){   __inst.mapElements.push(mapElement); }

          if (typeof(callback) == 'function') {
            callback(mapElement);
          }
        }

      };



      return mapElement;

    },


    selectedSprite: false,
    selectedTag: "",
    selectedElement: {},
    levelObjects: [],

    select_item: function (obj) {
      obj.selected = true;

      this.selection_sprite.active = true;

      this.selection_sprite.setSize(obj.size);

      this.selection_sprite.setPos(obj.position);


    },

    all_selected_sprites: function (callback) {

      var sprites = [];

      __gameStack.each(Game.sprites, function (ix, item) {

        if (item.selected) {
          sprites.push(item);

          if (callback && typeof(callback) == 'function') {
            callback(item);

          }

        }

      });

      return sprites;
    },

    release_select: function () {

      __gameStack.each(Game.sprites, function (ix, item) {

        //  item.selected = false;

        item.selected = false;

      });


    },


    release_hover_select: function () {

      __gameStack.each(Game.sprites, function (ix, item) {

        //  item.selected = false;

        item.hover_selected = false;

      });
    },

    release_drag_select: function () {

      __gameStack.each(Game.sprites, function (ix, item) {

        //  item.selected = false;

        item.drag_selected = false;

      });
    },

    getHoverSelected: function () {

      var getSpr = false;

      __gameStack.each(Game.sprites, function (ix, item) {

        if (item.hover_selected) {

          getSpr = item;

        }

      });


      return getSpr;

    },

    centerPos: function (sprite, x, y) {
      sprite.position.x = Math.floor(x - sprite.size.x / 2);
      sprite.position.y = Math.floor(y - $(Game.canvas).offset().top - sprite.size.y / 2);

      sprite.position.x = sprite.position.x - ( sprite.position.x % __levelMaker.settings.pixelSnapX);

      sprite.position.y = sprite.position.y - ( sprite.position.y % __levelMaker.settings.pixelSnapY);


    },

    moveSelected: function (x, y) {

      __gameStack.each(Game.sprites, function (ix, item) {

        if (item.drag_selected) {

          var x1 = x - (x % __levelMaker.settings.pixelSnapX),
            y1 = y - (y % __levelMaker.settings.pixelSnapY);


          __levelMaker.centerPos(item, x1, y1);

        }

      });
    },

    leftClickExtra: function () {


    },

    leftClick: function (x, y) {

      if($('form').is(':visible'))
      {
        return console.log("can't plant sprite with form open");

      }

      if (typeof(this.leftClickExtra) == 'function') {

        this.leftClickExtra();

        this.leftClickExtra = false;

        return false;

      }
      ;

      var notSelection = function (obj) {
        return obj !== __levelMaker.hover_selection_sprite &&

          obj !== __levelMaker.selection_sprite;

      };


      var selection = false;

      __gameStack.each(Game.sprites, function (ix, item) {

        item.drag_selected = false;

        if (item.hoverSelected) {
          if (!__levelMaker.shift) {
            item.drag_selected = true;
            //  DatGui.get(item);

          }
          else {

            __levelMaker.select_item(item);

          }

          selection = true;
        }

      });


      if (!selection) {

        __levelMaker.plantMapSprite(__levelMaker.selectedElement, x - (x % __levelMaker.settings.pixelSnapX), y - (y % __levelMaker.settings.pixelSnapY))

        __levelMaker.lastPlantedCountRecordArray.push(1);
      }

    },
    hoverSelect: function (x, y) {

      var selection = false, basic_selection = false;

      __gameStack.each(Game.sprites, function (ix, item) {

        if (item.drag_selected) {
          basic_selection = true;

        }

      });

      __gameStack.each(Game.sprites, function (ix, item) {

        if (x > item.position.x && x < item.position.x + item.size.x &&
          y > item.position.y && y < item.position.y + item.size.y) {

          //   item.hover_selected = !basic_selection && !item.selected ?  true : item.hover_selected;
          //   selection = true;
        }

      });


      if (!selection && !(__levelMaker.mouse.down)) {
        // __levelMaker.deselectAll()
      }
      ;


    },
    rightClick: function (x, y) {
      __gameStack.each(Game.sprites, function (ix, item) {

        if (x > item.position.x && x < item.position.x + item.size.x &&
          y > item.position.y && y < item.position.y + item.size.y) {

          var ix = Game.sprites.indexOf(item);
          Game.sprites.splice(ix, 1);
        }


      });
    },

    simpleMapObject: function (object, x, y) {

      var x = Math.floor(x - object.size.x / 2);
      var y = Math.floor(y - 50 - object.size.y / 2);

      x = x - ( object.position.x % __levelMaker.settings.pixelSnapX);

      y = y - ( object.position.y % __levelMaker.settings.pixelSnapY);

      return {size: new Vector3(object.size), position: {x: x, y: y}};

    },

    createMapSprite: function (mapElement, x, y) {

      // console.log("Selected Element:" + JSON.stringify(mapElement));
      var img = mapElement.img;
      // console.log("Img src:" + img.src);

      var sprite = new Sprite({name:'MapElement', description:'A level-builder element'});



      sprite.active = true;

      mapElement.src = img.src;


      var fs = mapElement.frameSize;


      sprite.setAnimation(new Animation({
        src: img,
        frameSize: fs,
        frameBounds: new VectorFrameBounds(new Vector3(0, 0), new Vector3(0, 0))
      }));


      sprite.setSize(mapElement.__mapSize || mapElement.size);

      // console.log(JSON.stringify(sprite));

      sprite.position.x = Math.floor(x - sprite.size.x / 2);
      sprite.position.y = Math.floor(y - $(Game.canvas).offset().top - sprite.size.y / 2);

      sprite.position.x = sprite.position.x - ( sprite.position.x % __levelMaker.settings.pixelSnapX);

      sprite.position.y = sprite.position.y - ( sprite.position.y % __levelMaker.settings.pixelSnapY);

      this.selectedSprite = sprite;

      console.log('spite:' + sprite);

      return sprite;

    },

    plantMapSprite: function (mapElement, x, y) {

      if (!mapElement.hasOwnProperty('__mapSize')) {
        mapElement.__mapSize = mapElement.mapSize;

      }

      if (!mapElement) {
        return false;
      }
      // console.log("Selected Element:" + JSON.stringify(mapElement));
      var img = mapElement.img || mapElement.image;
      //  console.log("Img src:" + img.src);

      __levelMaker.selectedElement.id = undefined;

      var sprite = new Sprite(JSON.parse(JSON.stringify(__levelMaker.selectedElement)));

      sprite.active = true;


      var fs = mapElement.frameSize;

      sprite.setSize(mapElement.size || mapElement.__mapSize || mapElement.mapSize);


      sprite.setAnimation(new Animation({
        src: img,
        frameSize: fs,
        frameBounds: new VectorFrameBounds(new Vector3(0, 0), new Vector3(0, 0))
      }));

      console.log(sprite);

      sprite.init();

      sprite.position.x = Math.floor(x - sprite.size.x / 2);
      sprite.position.y = Math.floor(y - $(Game.canvas).offset().top - sprite.size.y / 2);

      // sprite.position.x = sprite.position.x - ( sprite.position.x % __levelMaker.settings.pixelSnap);

      // sprite.position.y = sprite.position.y - ( sprite.position.y % __levelMaker.settings.pixelSnap);

      this.selectedSprite = sprite;


      console.log(sprite.selected_animation);

      Game.sprites.push(sprite);

    },
    simulateVerticalMouseMove: function (top) {

      __levelMaker.moveSelected(__levelMaker.mouse.x, top);
    },

    placeGroup: function (x1, y1, distX, distY, n, north, south, east, west) {

      //alert('dist=' + dist);

      var unitX = __levelMaker.selectedElement.__mapSize.x + distX,
        unitY = __levelMaker.selectedElement.__mapSize.y + distY;

      for (var x = 1; x < n; x++) {

        if (east) {
          x1 += x > 1 ? unitX : 0;
        }

        if (west) {
          x1 -= x > 1 ? unitX : 0;
        }

        if (north) {
          y1 -= x > 1 ? unitY : 0;
        }

        if (south) {
          y1 += x > 1 ? unitY : 0;
        }

        __levelMaker.plantMapSprite(__levelMaker.selectedElement, x1, y1);

        __levelMaker.lastPlantedCountRecordArray.push(n - 1);

      }

    },


    addLevelObjectToUI: function (item, replace) {

      if(replace)
      {
        $(".free-select li a").each(function(ix, a){

          if($(a).prop('id') == item.id)
          {
            alert('found id match');

            $.each( __levelMaker.mapElements, function(ix, mitem){

              if(mitem.id == item.id)
              {
                __levelMaker.mapElements[ix] = item;

                App.replace_map_object(item);

              }

            });

            $(a).text(item.name);

          }

        });

      }
      else {

        App.add_map_object(item);
      }


    },

    url_prefix: '../assets/game/image/'
  }

}


var __levelMaker = LevelMaker("myLevel");

var create_selections = function () {

  var pathPref = __levelMaker.url_prefix;

  var selectionImg = document.createElement('IMG');

  selectionImg.src = pathPref + "selection.png";

  var hoverSelectionImg = document.createElement('IMG');

  hoverSelectionImg.src = pathPref + "hover_selection.png";

  __levelMaker.hover_selection_sprite = new Sprite({name:'Hover Selection Sprite', description:'Shows hover-selected area.'});

  __levelMaker.discluded_sprites.push(__levelMaker.hover_selection_sprite);

  var fs = new Size(730, 730);

  __levelMaker.hover_selection_sprite.setAnimation(new Animation({
    src: hoverSelectionImg.src,
    frameSize: fs,
    frameBounds: new VectorFrameBounds(new Vector3(0, 0), new Vector3(0, 0))
  }));

  __levelMaker.hover_selection_sprite.setSize(fs);

  __levelMaker.selection_sprite = new Sprite({name:'Selection Sprite', description:'Shows selected area.'});

  __levelMaker.selection_sprite.setSize(fs);

  __levelMaker.selection_sprite.setAnimation(new Animation({
    src: selectionImg.src,
    frameSize: fs,
    frameBounds: new VectorFrameBounds(new Vector3(0, 0), new Vector3(0, 0))
  }));


  __levelMaker.discluded_sprites.push(__levelMaker.selection_sprite);

};


window.setTimeout(function () {


  Game.canvas.width = 5000;
  Game.canvas.height = 5000;
  window.onresize = function () {


    Game.canvas.width = 5000;
    Game.canvas.height = 5000;
  }


  window.addEventListener("scroll", function () {
    var topScroll = __levelMaker.scrollAdjust();


    __levelMaker.simulateVerticalMouseMove(topScroll);

  }, false);


}, 500);

__gameStack.ready(function (lib) {

  App.createDemo(lib);

  //log the completion of the ready function

  var centerSpriteToSprite = function (cSprite, aSprite) {
    cSprite.setSize(aSprite.size);

    cSprite.setPos(aSprite.position);


  };

  create_selections();

  console.log(__levelMaker.selection_sprite);

  window.setInterval(function () {

    if (!__levelMaker.blink) {
      __levelMaker.hover_selection_sprite.active = false;
    }
    //  __levelMaker.selection_sprite.active = false;

    var notSelection = function (obj) {
      return obj !== __levelMaker.hover_selection_sprite &&

        obj !== __levelMaker.selection_sprite;

    };

    var x = __levelMaker.mouse.x, y = __levelMaker.mouse.y;

    var hoverSelect = false;

    __gameStack.each(Game.sprites, function (ix, item) {

      item.hoverSelected = false;

      if (notSelection(item) && x > item.position.x && x < item.position.x + item.size.x &&
        y > item.position.y + __levelMaker.offsetTop && y < item.position.y + item.size.y + __levelMaker.offsetTop) {

        centerSpriteToSprite(__levelMaker.hover_selection_sprite, item);

        hoverSelect = true;

        __levelMaker.selection_sprite.active = true;

        __levelMaker.hover_selection_sprite.active = true;

        item.hoverSelected = true;

      }


    });


    if (!hoverSelect) {

      var hoverSize = new Vector3(__levelMaker.selectedSprite.size);

      var item = {position: {x: __levelMaker.mouse.x, y: __levelMaker.mouse.y, z: 0}, size: hoverSize};

      item = __levelMaker.simpleMapObject(item, __levelMaker.mouse.x, __levelMaker.mouse.y);

      centerSpriteToSprite(__levelMaker.hover_selection_sprite, item);

      if (!__levelMaker.blink) {

        __levelMaker.hover_selection_sprite.active = true
      }
      ;

    }

  }, 10);


});

function animate(time) {

  App.stats.begin();

  requestAnimationFrame(animate);

  TWEEN.update(time);

  Game.update();

  Game.ctx.clearRect(0, 0, Game.canvas.width, Game.canvas.height);

  Game.render();

  App.stats.end();

};



var startLevelMaker = function()
{


  /********************************
   * Game Init / ready
   *******************************/

  App.stats = new Stats();
  App.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
  document.getElementById('gs-container').appendChild(App.stats.dom);


  $(document).ready(function () {

    $('body').css('cursor', 'crosshair');


    $('#play').click(function(){


      if(Game.TEST_MODE == false) {

        __levelMaker.sprite_data_save = jstr(Game.sprites);

        __levelMaker.forces_save = jstr(Game.forces);

        Game.TEST_MODE = "READY";

      };

      Game.TEST_MODE = Game.TEST_MODE == true ? "STOPPED" : true;

      App.left_click_locked = true;


    });


    App.restart = function()
    {

      App.create_level(__levelMaker.MapData( JSON.parse( __levelMaker.sprite_data_save), __levelMaker.settings,  JSON.parse( __levelMaker.forces_save)));


    };


    $('#stop').click(function(){

      App.restart();

    });



    $('#new-level').click(function () {

      if(confirm("Start a new level? All changes will be lost.")){


        App.newLevel();


      };

    });


    $('.save-map-options').click(function () {

      var data = App.MapOptions(__levelMaker.mapElements, __levelMaker.settings);

      App.saveMapOptions(JSON.stringify(data), function () {

        //  alert('Map options saved.');

      });


    });


    App.loadLevelReady();


    $('#auto-place').on("click", function (e) {

      var blink = false;

      if ($('.up').data('on') == 'on') {
        //  alert('got the up class');

        __levelMaker.leftClickExtra = function () {

          var x = __levelMaker.mouse.x, y = __levelMaker.mouse.y;

          __levelMaker.placeGroup(x, y, parseInt($('#dist').val()), parseInt($('#count').val()), true)

          window.clearInterval(__levelMaker.blink);

        };

        blink = true;

      }

      if ($('.up-left').data('on') == 'on') {
        //  alert('got the up-left class');



      }

      if ($('.left').data('on') == 'on') {

        __levelMaker.leftClickExtra = function () {

          var x = __levelMaker.mouse.x, y = __levelMaker.mouse.y;

          __levelMaker.placeGroup(x, y, parseInt($('#dist').val()), parseInt($('#count').val()), false, false, true)

          window.clearInterval(__levelMaker.blink);

        };

        blink = true;

      }

      if ($('.down-left').data('on') == 'on') {


        __levelMaker.leftClickExtra = function () {

          var x = __levelMaker.mouse.x, y = __levelMaker.mouse.y;

          __levelMaker.placeGroup(x, y, parseInt($('#dist').val()), parseInt($('#count').val()), false, true, true)

          window.clearInterval(__levelMaker.blink);

        };

        blink = true;

      }

      if ($('.down').data('on') == 'on') {

        __levelMaker.leftClickExtra = function () {

          var x = __levelMaker.mouse.x, y = __levelMaker.mouse.y;

          __levelMaker.placeGroup(x, y, parseInt($('#dist').val()), parseInt($('#count').val()), false, true)

          window.clearInterval(__levelMaker.blink);

        };

        blink = true;

      }

      if ($('.down-right').data('on') == 'on') {

        __levelMaker.leftClickExtra = function () {

          var x = __levelMaker.mouse.x, y = __levelMaker.mouse.y;

          __levelMaker.placeGroup(x, y, parseInt($('#dist').val()), parseInt($('#count').val()), false, true, false, true)

          window.clearInterval(__levelMaker.blink);

        };

        blink = true;

      }

      if ($('.right').data('on') == 'on') {

        __levelMaker.leftClickExtra = function () {

          var x = __levelMaker.mouse.x, y = __levelMaker.mouse.y;

          __levelMaker.placeGroup(x, y, parseInt($('#dist').val()), parseInt($('#count').val()), false, false, false, true)

          window.clearInterval(__levelMaker.blink);

        };

        blink = true;

      }

      if ($('.up-right').data('on') == 'on') {

        __levelMaker.leftClickExtra = function () {

          var x = __levelMaker.mouse.x, y = __levelMaker.mouse.y;


          __levelMaker.placeGroup(x, y, parseInt($('#dist').val()), parseInt($('#count').val()), true, false, false, true)

          window.clearInterval(__levelMaker.blink);

        };

        blink = true;


      }


      if (blink) {

        __levelMaker.blink = window.setInterval(function () {

          __levelMaker.hover_selection_sprite.active = __levelMaker.hover_selection_sprite.active ? false : true;

        }, 350);

      }


    });


    $('.dropdown-submenu a.test').on("click", function (e) {

      $(this).next('ul').toggle();
      e.stopPropagation();
      e.preventDefault();

    });

    $('button.button-top').on('click', function (e) {

      var id = $(this).attr('id').replace('-', '_');

      var x = 0, y = 120;

      App.dialog(App.map_objects,
        x, y, function () {
          console.log('dialog shown');
        });

    });


  });


  __gameStack.ready(function (lib) {


    Game.init(function () {

      App.setInputEvents(lib);

      __levelMaker.objectMakerFormEvents();

      animate();
    });

    $('.add_object').click(function () {


    });

    $('.switch-label').click(function (evt) {

      $('.switch-label').removeClass('selected');

      $('.switch-label').data('on', 'off');

      $(evt.target).data('on', 'on');

      $(evt.target).addClass('selected');


      evt.preventDefault();

      return false;

    });

    $('div').click(function (evt) {

      var type = $(evt.target).prop('tagName');

      var dissallowed = ['LI', 'UL', 'A', 'SPAN', 'IMG', 'BUTTON', 'INPUT', 'RADIO', 'LABEL'];

      if ($(evt.target).attr('id') !== 'gs-container') {

        if (!$(evt.target).find('form').length) {

          if (dissallowed.indexOf(type) == -1 && !$(evt.target).parents('form').length >= 1) {

            $('.free-select').hide('slow');

          }

        }

      }

    });

    var settingsGuiArgs = {

      name: {

        key: 'name',

        type: 'string'
      }
      ,

      description: {

        key: 'description',

        type: 'string'
      }
      ,

      levelSizeX: {
        key: 'levelSizeX',

        type: 'number',

        min: 500,

        max: 15000,

        step: 200,

        onChange: function (value) {

          if(value > 15000)
          {
            alert('Max level-size-dimension is 15000');

          }

          __levelMaker.applySettings(__levelMaker.settings);

        }

      }
      ,

      levelSizeY: {
        key: 'levelSizeY',

        type: 'number',

        min: 500,

        max: 15000,

        step: 200,

        onChange: function (value) {

          __levelMaker.applySettings(__levelMaker.settings);

        }

      }
      ,

      levelSizeZ: {
        key: 'levelSizeZ',

        type: 'number',

        min: 500,

        max: 15000,

        step: 200

      }
      ,

      psuedoSpriteTypes: {

        key: 'psuedoSpriteTypes',
        type: 'array'

      },

      gameScale: {

        key: 'gameScale',
        type: 'number'

      }

    };


    window.setTimeout(function () {

      var settings = new dat.GUI({autoPlace: false});

      for (var x in settingsGuiArgs) {

        var sargs = settingsGuiArgs[x];

        if(__levelMaker.settings[x] instanceof Array)
        {

        }
        else if(__levelMaker.settings[x] )
        {
          var guiitem = settings.add(__levelMaker.settings, x);

          for(var y in sargs)
          {
            var arg = sargs[y];

            if(typeof guiitem[y] == 'function')
            {

              guiitem =  guiitem[y](arg);

            }

          }



        }

      }

      $('#level-settings-gui').html('');

      $('#level-settings-gui').append($(settings.domElement));

    }, 1000);

    __levelMaker.offsetTop = $(__gameStack.canvas).offset().top;

  });

}

