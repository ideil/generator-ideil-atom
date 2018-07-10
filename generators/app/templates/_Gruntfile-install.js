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

            scssBS: {
                cwd: '<%= sourceDir %>/scss/vendor/bootstrap/',
                src: 'bootstrap.scss',
                dest: '<%= sourceDir %>/scss/',
                expand: true,
                rename: function(dest, src) {
                    return dest + src.replace('bootstrap.scss', 'bs.scss');
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
                src: ['<%= sourceDir %>/scss/bs.scss'],
                overwrite: true,
                replacements:[
                    {
                        from:   '@import "',
                        to:     '@import "vendor/bootstrap/'
                    }, {
                        from:   '@import "vendor/bootstrap/functions',
                        to:     '@import "set/set";\n// @import "vendor/bootstrap/functions'
                    }, {
                        from:   '@import "vendor/bootstrap/variables',
                        to:     '// @import "vendor/bootstrap/variables'
                    }, {
                        from:   '@import "vendor/bootstrap/mixins',
                        to:     '// @import "vendor/bootstrap/mixins'
                    }, {
                        from:   '/*!',
                        to:     '/*'
                    }
                ]
            },

            photoswipe: {
                src: ['<%= sourceDir %>/scss/vendor/default-skin.scss'],
                overwrite: true,
                replacements: [{
                    from: 'url(',
                    to: 'url(../img/'
                }]
            }
        }
    });

    // Load tasks
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-text-replace');

    // Register tasks
    grunt.registerTask('bower', [
        'copy:jsBootstrap',
        'copy:jsBootstrapFull',
        'copy:jsBoilerplate',
        'copy:scssBootstrap',
        'copy:scssBS'
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
