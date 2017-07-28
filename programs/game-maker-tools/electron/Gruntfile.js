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
        dist: {
            src: ['ecma/Main.js', 'ecma/Geometry.js', 'ecma/obj/*.js', 'ecma/obj/sub/*.js'],
            dest: 'ecma/concat/Quick2d.js',
        },
    },

    babel: {
        options: {
            sourceMap: true,
            presets: ['babel-preset-es2015']
        },
        dist: {
          files: [
            {
                expand: true,
                cwd: 'ecma/concat',
                src: ['Quick2d.js'],
                dest: 'client/dist/js'
            }
        ]
        }
    }
});

    grunt.registerTask('default', ['concat', 'babel']);

};
