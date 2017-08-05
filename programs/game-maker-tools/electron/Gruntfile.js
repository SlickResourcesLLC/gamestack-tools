/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = function (grunt) {
    // Project configuration.
  
  require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks 
 
grunt.initConfig({

    concat: {
        options: {
            separator: ';',
        },
        api:{

            src: ['ecma/Protocol/rest/*.js'],
            dest: 'ecma/Protocol/concat/Protocol.js',
        },

        game_lib:{
            src: ['ecma/Quick2d/Main.js', 'ecma/Quick2d/Geometry.js', 'ecma/Quick2d/obj/*.js', 'ecma/Quick2d/obj/sub/*.js'],
            dest: 'ecma/Quick2d/concat/Quick2d.js'
        },


    },

    babel: {
        options: {
            sourceMap: true,
            presets: ['babel-preset-es2015']
        },
        game_lib: {
          files: [
            {
                expand: true,
                cwd: 'ecma/Quick2d/concat',
                src: ['Quick2d.js'],
                dest: 'client/dist/js'
            }
        ]

        }
        ,

        api: {
            files: [
                {
                    expand: true,
                    cwd: 'ecma/Protocol/concat',
                    src: ['Protocol.js'],
                    dest: 'client/dist/js'
                }
            ]
        }
    }
});

    grunt.registerTask('default', ['concat', 'babel']);

};
