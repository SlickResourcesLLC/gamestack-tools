

$(document).ready( function(){

    console.log('Applying right-click interface');

    //For example we are defining menu in object. You can also define it on Ul list. See on documentation.
    var __rightClickInterface = [{
        name: 'delete',
        img: 'img/cross_icon.png',
        title: 'delete button',
        id:'delete',
        class:'delete',
        fun: function () {

            levelMaker.removeLast();

        }
    },

        {
            name: 'Selected_Sprite...',
            img: 'image/sprite_icon.png',
            title: 'Selected_Sprite...',
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
                    name: 'Apply_Behavior...',
                    title: 'Apply behaviors and events.',
                    img: 'img/settings_icon.png',
                    // disable: true,
                    subMenu: [{ //TODO : get all behaviors
                        name: 'TODO',
                        img: 'img/settings_icon.png',
                        fun: function () {
                            alert('TODO : apply');
                        }

                    },
                        {
                            name: 'TODO2',
                            img: 'img/settings_icon.png',
                            fun: function () {
                                alert('TODO2');
                            }
                        }]
                }]
        },

        {
            name: 'Disperse_Clones...',
            title: 'Clone Generator',
            subMenu: [{
                name: 'Multi-Sprite Generator',
                title: 'Formulate large groups of sprites. Add them to the map on the following click.',
                img: 'img/settings_icon.png',
                fun: function () {
                    alert('Apply the auto-place form...')
                }
            }

            ]
        }

    ];

    //Calling context menu
    $('body canvas').contextMenu(__rightClickInterface,{triggerOn:'contextmenu'});

    //create the right click interface

});

