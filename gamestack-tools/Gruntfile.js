/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = function (grunt) {
    // Project configuration.

    var fs = require('fs');

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
            src: [ 'ecma/Gamestack/Main.js', 'ecma/Gamestack/Canvas.js','ecma/Gamestack/Geometry.js', 'ecma/Gamestack/class/*.js', 'ecma/Gamestack/class/sub/*.js'],
            dest: 'ecma/Gamestack/concat/Gamestack.js'
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
                cwd: 'ecma/Gamestack/concat',
                src: ['Gamestack.js'],
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
                'client/dist/js/Gamestack.min.js': ['client/dist/js/Gamestack.js']
            }
        }
    },


    jsdoc : {
        dist : {
            src: ['ecma/Gamestack/README.md', 'ecma/Gamestack/concat/Gamestack.js'],
            jsdoc: './node_modules/.bin/jsdoc',
            options: {
                destination: './docs',
                configure: './node_modules/ink-docstrap/template/jsdoc.conf.json',
                template: './node_modules/ink-docstrap/template'
            }
        }
    }

});


    grunt.registerTask('package', 'apply intro and outro for closed context ', function() { //NOT USING as of 11-20-2017

        var INTRO_CODE = fs.readFileSync('ecma/Gamestack/intro.js'),
        OUTRO_CODE = fs.readFileSync('ecma/Gamestack/outro.js');//read existing contents into data

        var data = fs.readFileSync('ecma/Gamestack/concat/Gamestack.js', 'utf-8');

        data = INTRO_CODE + "\r\n" +  data  + "\r\n" +  OUTRO_CODE;

        fs.writeFileSync('ecma/Gamestack/concat/Gamestack.js', data, 'utf-8');

    });

    grunt.registerTask('build', ['concat',  'babel',  'uglify']);

    grunt.registerTask('default', ['concat', 'babel',  'uglify']);

    grunt.registerTask('doc', ['jsdoc']);
    grunt.registerTask('docs', ['jsdoc']);

    grunt.registerTask('all', ['concat', 'babel', 'uglify',  'jsdoc']);


};
