/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = function (grunt) {
    // Project configuration.

    require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks

    grunt.loadNpmTasks('grunt-contrib-jshint');

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

            squeeze_lib: {
                src: ['ecma/Squeeze/Main.js', 'ecma/Squeeze/class/dep/jsmanipulate', 'ecma/Squeeze/class/*.js', 'ecma/Squeeze/class/async/*.js'],
                dest: 'ecma/Squeeze/concat/Squeeze.js'
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
                        cwd: 'ecma/Squeeze/concat',
                        src: ['Squeeze.js'],
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
                    'client/dist/js/Squeeze.min.js': ['client/dist/js/Squeeze.js']
                }
            }
        },


        jsdoc: {
            dist: {
                src: ['ecma/Squeeze/README.md', 'ecma/Squeeze/concat/Squeeze.js'],
                jsdoc: './node_modules/.bin/jsdoc',
                options: {
                    destination: 'docs',
                    configure: './node_modules/jsdoc/conf.json',
                    template: './node_modules/ink-docstrap/template'
                }
            }
        }

    });


    grunt.registerTask('clean', ['jshint']);

    grunt.registerTask('build', ['concat', 'babel', 'uglify',]);

    grunt.registerTask('default', ['concat', 'babel', 'uglify',]);


    grunt.registerTask('doc', ['jsdoc']);
    grunt.registerTask('docs', ['jsdoc']);

    grunt.registerTask('all', ['concat', 'babel', 'uglify', 'jsdoc']);


};
