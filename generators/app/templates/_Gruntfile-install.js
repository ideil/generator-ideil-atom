// global module:false

module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        baseDir: '../static',
        sourceDir: '<%= baseDir %>/src',

        copy: {
            jsBootstrap: {
                cwd: 'bower_components/bootstrap/js/src/',
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

            scssBootstrap: {
                cwd: 'bower_components/bootstrap/scss/',
                src: '**',
                dest: '<%= sourceDir %>/scss/vendor/bootstrap/',
                expand: true
            },

            variablesBootstrap: {
                cwd: 'bower_components/bootstrap/scss/',
                src: '_variables.scss',
                dest: '<%= sourceDir %>/scss/',
                expand: true,
                rename: function(dest, src) {
                    return dest + src.replace('_variables', 'vars-bootstrap');
                }
            },

            scssSlick: {
                cwd: 'bower_components/slick-carousel/slick/',
                src: 'slick.css',
                dest: '<%= sourceDir %>/scss/vendor/',
                expand: true,
                rename: function(dest, src) {
                    return dest + src.replace('.css', '.scss');
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

            scssPs: {
                cwd: 'bower_components/photoswipe/dist/',
                src: '**/*.css',
                dest: '<%= sourceDir %>/scss/vendor/',
                expand: true,
                flatten: true,
                rename: function(dest, src) {
                    return dest + src.replace('.css', '.scss');
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
                src: ['<%= sourceDir %>/scss/vendor/bootstrap/bootstrap.scss'],
                overwrite: true,
                replacements: [{
                    from: '@import "',
                    to: '@import "vendor/bootstrap/'
                },
                {
                    from: 'vendor/bootstrap/variables',
                    to: 'vars-bootstrap'
                }]
            },

            photoswipe: {
                src: ['<%= sourceDir %>/scss/vendor/default-skin.scss'],
                overwrite: true,
                replacements: [{
                    from: 'url(',
                    to: 'url(../img/'
                }]
            }
        },

        concat: {
            dist: {
                src: ['<%= sourceDir %>/scss/vendor/bootstrap/bootstrap.scss', '<%= sourceDir %>/scss/app.scss'],
                dest: '<%= sourceDir %>/scss/app.scss'
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
        'copy:scssBootstrap',
        'copy:variablesBootstrap'
    ]);

    grunt.registerTask('slick', [
        'copy:scssSlick',
        'copy:jsSlick'
    ]);

    grunt.registerTask('photoswipe', [
        'copy:scssPs',
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
