// global module:false

module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        baseDir: '../static',
        sourceDir: '<%= baseDir %>/src',
        publicDir: '<%= baseDir %>/pub',

        copy: {
            jsBootstrap: {
                cwd: 'bower_components/components-bootstrap/js/',
                src: '**',
                dest: '<%= sourceDir %>/js/vendor/bootstrap/',
                expand: true
            },

            jsBoilerplate: {
                cwd: 'bower_components/html5-boilerplate/dist/js/vendor/',
                src: 'jquery*.js',
                dest: '<%= sourceDir %>/js/vendor/',
                expand: true
            },

            lessBootstrap: {
                cwd: 'bower_components/components-bootstrap/less/',
                src: '**',
                dest: '<%= sourceDir %>/less/vendor/bootstrap/',
                expand: true,
            },

            variablesBootstrap: {
                cwd: 'bower_components/components-bootstrap/less/',
                src: 'variables.less',
                dest: '<%= sourceDir %>/less/',
                expand: true,
                rename: function(dest, src) {
                    return dest + src.replace('variables', 'vars-bootstrap');
                }
            },

            lessSlick: {
                cwd: 'bower_components/slick-carousel/slick/',
                src: 'slick.css',
                dest: '<%= sourceDir %>/less/vendor/',
                expand: true,
                rename: function(dest, src) {
                    return dest + src.replace('.css', '.less');
                }
            },

            jsSlick: {
                cwd: 'bower_components/slick-carousel/slick/',
                src: 'slick.js',
                dest: '<%= sourceDir %>/js/vendor/',
                expand: true
            },

            underscore: {
                cwd: 'bower_components/underscore/',
                src: '*min.js',
                dest: '<%= sourceDir %>/js/vendor/',
                expand: true
            }
        },

        replace: {
            source: {
                src: ['<%= sourceDir %>/less/vendor/bootstrap/bootstrap.less'],
                overwrite: true,
                replacements: [{
                    from: '@import "',
                        to: '@import "vendor/bootstrap/'
                },
                {
                    from: 'vendor/bootstrap/variables.less',
                    to: 'vars-bootstrap.less'
                }],
            },
        },

        concat: {
            dist: {
                    src: ['<%= sourceDir %>/less/vendor/bootstrap/bootstrap.less', '<%= sourceDir %>/less/app.less'],
                    dest: '<%= sourceDir %>/less/app.less',
                },
        },

        modernizr: {
            dist: {
                'crawl': false,
                'dest': '<%= sourceDir %>/js/vendor/modernizr.min.js',
                // 'tests': [],
                'options': [
                    'domPrefixes',
                    'prefixes',
                    'testAllProps',
                    'testProp',
                    'testStyles',
                    'setClasses'
                ],
                'uglify': true
            }
        }
    });

    // Load tasks
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-modernizr');

    // Register tasks
    grunt.registerTask('bower', [
        'copy:jsBootstrap',
        'copy:jsBoilerplate',
        'copy:lessBootstrap',
        'copy:variablesBootstrap'
    ]);

    grunt.registerTask('slick', [
        'copy:lessSlick',
        'copy:jsSlick'
    ]);

    grunt.registerTask('underscore', [
        'copy:underscore'
    ]);
};
