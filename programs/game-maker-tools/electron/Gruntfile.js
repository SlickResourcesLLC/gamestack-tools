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
            src: [ 'ecma/GameStack/Main.js', 'ecma/GameStack/Canvas.js', 'ecma/GameStack/Geometry.js', 'ecma/GameStack/obj/*.js', 'ecma/GameStack/obj/sub/*.js'],
            dest: 'ecma/GameStack/concat/GameStack.js'
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
                cwd: 'ecma/GameStack/concat',
                src: ['GameStack.js'],
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

    },

    jsdoc : {
        dist : {
            src: ['ecma/GameStack/README.md', 'ecma/GameStack/concat/GameStack.js'],
            jsdoc: './node_modules/.bin/jsdoc',
            options: {
                destination: 'docs',
                configure: './node_modules/jsdoc/conf.json',
                template: './node_modules/ink-docstrap/template'
            }
        }
    }

});

    grunt.registerTask('default', ['concat', 'babel', 'jsdoc']);

};
