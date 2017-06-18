/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = function (grunt) {
    // Project configuration.
  
  require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks 
 
grunt.initConfig({
    babel: {
        options: {
            sourceMap: true,
            presets: ['babel-preset-es2015']
        },
        dist: {
          files: [
            {
                expand: true,
                cwd: 'ecma/',
                src: ['**/*.js'],
                dest: 'client/dist/'
            }
        ]
        }
    }
});
 
grunt.registerTask('default', ['babel']);

};
