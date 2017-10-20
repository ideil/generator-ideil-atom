// global module:false

module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        baseDir: '../static',
        sourceDir: '<%= baseDir %>/src',
        publicDir: '<%= baseDir %>/pub',

        copy: {
            jsBootstrap: {
                cwd: 'bower_components/bootstrap/js/',
                src: '**',
                dest: '<%= sourceDir %>/js/vendor/bootstrap/',
                expand: true
            },

            jsBootstrapFull: {
                cwd: 'bower_components/bootstrap/dist/js/',
                src: 'bootstrap*.js',
                dest: '<%= sourceDir %>/js/vendor/bootstrap/',
                expand: true
            },

            jsBoilerplate: {
                cwd: 'bower_components/jquery/dist/',
                src: 'jquery.min.js',
                dest: '<%= sourceDir %>/js/vendor/',
                expand: true
            },

            lessBootstrap: {
                cwd: 'bower_components/bootstrap/less/',
                src: '**',
                dest: '<%= sourceDir %>/less/vendor/bootstrap/',
                expand: true
            },

            variablesBootstrap: {
                cwd: 'bower_components/bootstrap/less/',
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

            jsPs: {
                cwd: 'bower_components/photoswipe/dist/',
                src: '*.min.js',
                dest: '<%= sourceDir %>/js/vendor/',
                expand: true
            },

            lessPs: {
                cwd: 'bower_components/photoswipe/dist/',
                src: '**/*.css',
                dest: '<%= sourceDir %>/less/vendor/',
                expand: true,
                flatten: true,
                rename: function(dest, src) {
                    return dest + src.replace('.css', '.less');
                }
            },

            imgPs: {
                cwd: 'bower_components/photoswipe/dist/default-skin/',
                src: ['*', '!*.css'],
                dest: '<%= sourceDir %>/img/',
                expand: true
            },

            underscore: {
                cwd: 'bower_components/underscore/',
                src: '*min.js',
                dest: '<%= sourceDir %>/js/vendor/',
                expand: true
            },

            lodash: {
                cwd: 'bower_components/lodash/dist/',
                src: 'lodash.min.js',
                dest: '<%= sourceDir %>/js/vendor/',
                expand: true
            }
        },

        replace: {
            bootstrap: {
                src: ['<%= sourceDir %>/less/vendor/bootstrap/bootstrap.less'],
                overwrite: true,
                replacements: [{
                    from: '@import "',
                    to: '@import "vendor/bootstrap/'
                },
                {
                    from: 'vendor/bootstrap/variables.less',
                    to: 'vars-bootstrap.less'
                }]
            },

            photoswipe: {
                src: ['<%= sourceDir %>/less/vendor/default-skin.less'],
                overwrite: true,
                replacements: [{
                    from: 'url(',
                    to: 'url(../img/'
                }]
            }
        },

        concat: {
            dist: {
                src: ['<%= sourceDir %>/less/vendor/bootstrap/bootstrap.less', '<%= sourceDir %>/less/app.less'],
                dest: '<%= sourceDir %>/less/app.less'
            }
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
        'copy:jsBootstrapFull',
        'copy:jsBoilerplate',
        'copy:lessBootstrap',
        'copy:variablesBootstrap'
    ]);

    grunt.registerTask('slick', [
        'copy:lessSlick',
        'copy:jsSlick'
    ]);

    grunt.registerTask('photoswipe', [
        'copy:lessPs',
        'copy:jsPs',
        'copy:imgPs',
        'replace:photoswipe'
    ]);

    grunt.registerTask('underscore', [
        'copy:underscore'
    ]);

    grunt.registerTask('lodash', [
        'copy:lodash'
    ]);
};
