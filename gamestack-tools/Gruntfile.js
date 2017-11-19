/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = function (grunt) {
    // Project configuration.

  require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks

grunt.initConfig({

    jshint: {
        all: ['ecma/**/*.js'],
        options:{
            esversion:6
        }
    },

    concat: {
        options: {
            separator: ';',
        },

        game_lib:{
            src: [ 'ecma/GameStack/Main.js', 'ecma/GameStack/class/dep/jsmanipulate.js', 'ecma/GameStack/Canvas.js', 'ecma/GameStack/EffectSequence.js',  'ecma/GameStack/Geometry.js', 'ecma/GameStack/class/*.js', 'ecma/GameStack/class/sub/*.js'],
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
    },

    uglify: {
        options: {
            mangle: false
        },
        my_target: {
            files: {
                'client/dist/js/GameStack.min.js': ['client/dist/js/GameStack.js']
            }
        }
    },


    jsdoc : {
        dist : {
            src: ['ecma/GameStack/README.md', 'ecma/GameStack/concat/GameStack.js'],
            jsdoc: './node_modules/.bin/jsdoc',
            options: {
                destination: './docs',
                configure: './node_modules/ink-docstrap/template/jsdoc.conf.json',
                template: './node_modules/ink-docstrap/template'
            }
        }
    }

});



    grunt.registerTask('build', ['concat', 'babel', 'uglify',]);

    grunt.registerTask('default', ['concat', 'babel', 'uglify',]);

    grunt.registerTask('doc', ['jsdoc']);
    grunt.registerTask('docs', ['jsdoc']);

    grunt.registerTask('all', ['concat', 'babel', 'uglify', 'jsdoc']);


};
