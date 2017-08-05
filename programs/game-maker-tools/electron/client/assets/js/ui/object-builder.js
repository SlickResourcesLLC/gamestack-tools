/**********
 *
 * deps:
 * 	-DatGui (dat.gui.interface.js)
 *
 * ***********/


var ObjectArrayBuilder = function(instance, allowedTypes, allowedMembers)
{

	this.constructor_key = instance.constructor;

	this.__members = [];

	this.__selectedObject = instance;

	this.__members.push(this.__selectedObject);

    __arrayBuilderInstance = this;

	return new ObjectBuilder(this, allowedTypes, allowedMembers);

};


var __arrayBuilderInstance = {};

var ObjectBuilder = function(obj, allowedMembers) {

	this.selectedIndex = 0;

    this.listmemberkeys = allowedMembers;

    this.__members = obj.__members || [];

    this.selectObjectByName = function (name) {

    	for(var x = 0; x < this.__members.length; x++)
		{
			if(this.__members[x].name == name)
			{
				return this.__members[x];

			}

		}

		return this.__members[0];

    };

    var inConstructorList = function (obj, list) {

        if (list == '*') {
            return true;
        }

        for (var x = 0; x < list.length; x++) {

            if (obj instanceof list[x]) {
                return true;

            }


        }

        return false;
    };

    this.refresh = function (obj, ix) {

    	if(isNaN(ix))
		{
			ix = 0;
		}

        if (obj instanceof ObjectArrayBuilder) {
            //create screen gui for buildable [] of object

			var __inst = this;

            this.__multiple = true;

            this.add = function (obj) {

                this.__members.push(obj);

            };

            //Main List needs 'plus' button for building Array[]

			var heading = $(".controllable li")[0],

                add_button = $(".tree-add-special");

            if(!$(heading).find('span.special-text').length)
			{

                $(heading).append('<span class="special-text">(Array[])</span>');

			};

			if(!$(add_button).length)
			{
                var  add_button_html= '<img id="main_plus" class="tree-add-special ctrl" />';

                $(heading).append(add_button_html);

                alert($('#main_plus').length);

                $('#main_plus').click(function(){

                	//Add a new Sprite():

					var baseObject = __inst.__members[__inst.__members.length - 1];

                    var nextInstance = new baseObject.constructor(JSON.parse(jstr(baseObject)));

					nextInstance.name = baseObject.name + '_c';

					__inst.__members.push(nextInstance);

                   __inst.refresh(obj, ix);

				});

            }

			//set events next


        }
        else {//single object ?

            alert('You passed single object: using this to instantiate object()');

            this.__members[0] = obj;

        }


        alert('rendering');

        this.renderObjectControllable(this.__members[ix], $('.selected_object')[0], {multiple:this.__multiple});

        return  this;

    };


    this.refresh(obj);


};


ObjectBuilder.prototype.objectMembers=function()
{
	var object = {};

   for(var x = 0; x < this.__members.length; x++)
   {

   	var o = this.__members[x].name || x;

   	object[o] = this.__members[x];

   }

   return object;

};


ObjectBuilder.prototype.createGui=function()
{
    var gui = DatGui.gui();

    this.gui = gui;

    return gui;

};


ObjectBuilder.prototype.listSelect = function(gui, obj, members)
{
	var testObject = {Select_Object:obj};

    var object_select = gui.add(testObject, 'Select_Object', members);

    var __inst = this;

    $(object_select.domElement).find('option').each(function(ix, item){

    	$(item).prop('selected', false);

    	if($(item).text()==obj.name )
		{

			alert('found');
            $(item).prop('selected', true);
		}


	});

    object_select.onChange(function(value)
    {
    	var n = $(this.domElement).find('option:selected').text();

    	var ct =-1;

    	$.each(members, function(ix, item){

    		ct += 1;

    		if(item.name == n)
			{

                alert('ix:' + ix);

                __inst.refresh(__arrayBuilderInstance, ct);


            }

		});


    });

};

ObjectBuilder.prototype.renderObjectControllable = function(obj, container, options)
{

    var gui =  this.createGui(), __inst = this;

    options = options || {};

    if(options.multiple)
	{
		this.listSelect(gui, obj, this.objectMembers());
    }

    DatGui.addEachText(obj, gui);

    var folders = [];

    $.each(obj /*This is where our 'MainGame' Object would go*/, function(ix, element_object){

        if(__inst.listmemberkeys.indexOf(ix) >= 0)
        {

            var html = "";

            var f = gui.addFolder(ix);

            folders.push(f);

            if(ix === 'frames')
            {
                //   alert('frame element');

            }

            if((!element_object) || (typeof(ix) == 'string' &&  ix.indexOf('__') >= 0))
            {
                return;
            }

            var element =  element_object instanceof Array ? element_object : element_object.hasOwnProperty('list') && element_object.list  instanceof Array ? element_object.list : element_object;

            if(element instanceof Array ) {

                //  alert('processing array of len:' + element.length);

                var eye_icon = '<img data-name="*"  class="tree-edit ctrl eye xcl__" />';

                html += '<ul class="' + ix + '">' + App.objectListToUL(ix, element /*INSERT Members of actual array(s)*/, [eye_icon, ""]) + '</ul>';


            }


            else if(__inst.listmemberkeys.indexOf(ix) >= 0)
            {

                var eye_icon = '<img data-name="*"  class="tree-edit ctrl eye xcl__" />';

                html += App.objectListToUL(ix, element /*INSERT Members of objects*/, [eye_icon, ""]) + '</ul>';

                $(f.domElement).addClass(ix);

            }

            f.__listTag = ix;

            $(f.domElement).find('ul').append(html);

        }

    });

    var mainElement = $(container);

    if($(container).length < 1) {

        mainElement = $('.controllable')[0];

    }

    $(mainElement).find('ul').remove();

    $(mainElement).append($(gui.domElement));

    $.each(obj /*This is where our 'MainGame' Object would go*/, function(ix, element_object){

        if((!element_object) || (typeof(ix) == 'string' &&  ix.indexOf('__') >= 0))
        {
            return;
        }


        var element = element_object instanceof Array ? element_object : element_object.list  instanceof Array ? element_object.list : element_object;

        var  add_button_html= '<img id="*" class="tree-add ctrl" ></img>';

        var my_id = ix + '_add';


        var nameElement = ix; //always should be the name of the variable

        add_button_html = add_button_html.replace('*', my_id);


        var relationals = ['action'];

        var object_watch = __inst.listmemberkeys;

        var relMode = false, proceed = false;

        Quazar.each(relationals, function(ir, item){

            if(ix !== '' && ix && item.indexOf(ix) >= 0) //the relational key contains text of non-empty object key
            {
                proceed = true;
                relMode = true;

            }
        });


        if(!object_watch.indexOf('*') >= 0)
        Quazar.each(object_watch, function(io, item){

            if(ix !== '*' && ix && item.indexOf(ix) >= 0) //the object_watch key contains sought after text
            {
                proceed = true;

            }
        });


        if(proceed || element instanceof Array ) {

            App.applyControl({parent:$('.' + ix /*The class previously inserted*/), clName:ix, list:element,
                id: my_id,html: add_button_html,
                folders:folders,
                callback:function(list, clName, folders){

                    for(var x =0; x < folders.length; x++)
                    {
                        if(folders[x].__listTag === ix)
                        {

                            folders[x].open();

                        }

                    }

                    App.lock_events();

                    var instantiator;

                    var tp_inst = false;

                    if(element instanceof  Array )
                    {
                        instantiator =  element[0] && element[0].constructor ? element[0].constructor.name : false;

                    }
                    else
                    {
                        tp_inst = element.hasOwnProperty('__typeProfile') ? element.__typeProfile.__key : instantiator;

                        instantiator = tp_inst;

                    }


                    var addElement = function() {

                        if (element instanceof (Array)) {


                            element.push(myNewObject);

                            renderListMembers(element, clName);


                        }
                        else if (typeof(element) == 'object') {

                            //    alert('click on element:' + clName + ':with members::' + jstr(element));

                            var done = false;

                            var x = 0;

                            while (!done && x < 200) {

                                x++;

                                if (!element['instance_' + x]) {

                                    element['instance_' + x] = myNewObject;
                                    done = true;
                                }

                            }

                            renderListMembers(element, clName);

                        }

                    }


                    if(window[instantiator]) {

                        // alert('adding the object');

                        var lastObject = element[element.length - 1];

                        var name = lastObject.name + "*";

                        myNewObject = new window[instantiator](lastObject);

                        myNewObject.name = name;

                        addElement();

                    }


                }


            });

        }


        var arrayListEvents = function(list, clName) {

            //  alert('showing array for:' + clName + ":" + list);

            var lix = 0;

            $.each($('.' + clName + ' li'), function (ix, el) {

                //distinguish a callback for displaying the element

                var member = list[ix];

                lix+= 1;

                //we have: 1. The selected class

                var cl = $(el).attr('class').replace('_member', '');


                console.log(list + ' :li click');

                var prevent = false;


                $('.' + cl + '-tab-pane ul').on('click', function(evt){

                    $('.tab-pane li').removeClass('selected');

                    $(evt.target).addClass('selected');

                    var ix = $(evt.target).index();

                    App.selectItem(Game.sprites[0][cl][ix] || false);

                });


                $(el).on('click', function (evt) {

                    $(el).parent().find('li').css('color', 'white');

                    $(el).css('color', 'springgreen');

                    //get reference to the object

                    if(!prevent)
                    {
                        prevent = true;

                        window.setTimeout(function(){

                            prevent = false;

                        },100);

                        $(this).find('.tree-edit').click();

                    }

                });

                $(el).hover(function () {

                    $(this).css('background-color', '#003366');

                }, function () {
                    $(this).css('background-color', '#1a1a1a');


                });

            });

        };



        var renderListMembers = function(list, clName) {

            // alert('showing array for:' + clName + ":" + list);


            // alert('processing array');


            var eye_icon = '<img data-name="*"  class="tree-edit ctrl eye xcl__" />';

            html = App.objectListToUL(clName, list /*INSERT Members of actual array(s)*/, [eye_icon, ""]) + '</ul>';


            var container =  $('.' + clName);

            $(container).html( html);


            arrayListEvents(list, clName);

        };

        arrayListEvents(element, ix);


    });


};






