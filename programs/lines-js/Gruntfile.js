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

            lines_lib: {
                src: ['ecma/Lines/Main.js', 'ecma/Lines/class/*.js'],
                dest: 'ecma/Lines/concat/Lines.js'
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
                        cwd: 'ecma/Lines/concat',
                        src: ['Lines.js'],
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
                    'client/dist/js/Lines.min.js': ['client/dist/js/Lines.js']
                }
            }
        },
        
        jsdoc: {
            dist: {
                src: ['ecma/Lines/README.md', 'ecma/Lines/concat/Lines.js'],
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
