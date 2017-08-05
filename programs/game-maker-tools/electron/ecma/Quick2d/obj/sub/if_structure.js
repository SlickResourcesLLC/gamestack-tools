/**
 * Created by The Blakes on 04-13-2017
 *
 */


class InterfaceCallback
{
    constructor({name, description, callback})
    {

       this.name = name;

       this.description = description;

       this.callback = callback || function(){ console.info('The call was empty'); };

    }

    run()
    {

        this.callback();

    }

}


class SpeechInterfaceStructure
{
    constructor({name, description})
    {
        this.name = name || "Program helper.";

        this.description = description || "An interface for the game-builder program.";

        this.options_structure = {

        scroll:function(x, y){}, //simple scroll controller



        create_object_resource:{

            constructors:Quazar.IF.__allConstructors(),

            selectedType:false,

            selectByName:Quazar.IF.selectByName,

            apply_speech_value:Quazar.IF.applySpeechValue()

        }, //apply each class in the program, with means of creating / instantiating

        save_object_resource:{

            selected_object:false,

            confirm:Quazar.IF.confirmation()

        }, //apply each class in the program, with means of saving

        retrieve_object_resource:{}, //retrieve

        browse_object_resources:{}, //browsing

        search_object_resources:{}, //searching

        delete_object_resources:{}, //delete

        apply_value:{} //apply a value to an object resource

        }

    }

}








