// global module:false

var jsList = [
        // '<%= sourceDir %>/js/vendor/jquery-1.11.3.min.js',
        // '<%= sourceDir %>/js/app.js',
        // '<%= sourceDir %>/js/carousel.js'
    ],
    uncssIgnoreClass = [
        /^textarea/,
        //* Bootstrap
        /^.active/,
        /^.open/,
        /^.modal/,
        /^.in/,
        /^.fade/,
        //* App
        /^.o-/,
        /^.u-/,
        /^.c-/,
        /^.t-/,
        /^.s-/,
        /^.is-/,
        /^.has-/,
        /^.i-/,
        //* Plugins
        /^.slick/,      // slick
        /^.lg/,         // light gallery
        /^.clndr/,      // clndr
        /^.table-clndr/
    ];

module.exports = function (grunt) {
    'use strict';

    require('jit-grunt')(grunt, {
        sprite: 'grunt-spritesmith'
    });
    require('time-grunt')(grunt);

    grunt.initConfig({
        baseDir: 'static',
        sourceDir: '<%= baseDir %>/src',
        publicDir: '<%= baseDir %>/pub',

        watch: {
            options: {
                livereload: true,
                spawn: false
            },

            sass: {
                files: ['<%= sourceDir %>/scss/**/*.scss'],
                tasks: ['sass:dev', 'autoprefixer:sourcemap']
            },

            twig: {
                files: ['<%= baseDir %>/layouts/_includes/**/*'],
                tasks: ['twigRender']
            },

            js: {
                files: [
                    '<%= sourceDir %>/js/**/*.js',
                    '!<%= sourceDir %>/js/vendor/**/*',
                    '!<%= sourceDir %>/js/atom/**/*'
                ],
                tasks: [
                    'jshint:src',
                    'jscs:src'
                ]
            },

            sprite: {
                files: ['<%= sourceDir %>/img/ui-icons/**/*.png'],
                tasks: ['sprite', 'sass:dev', 'autoprefixer:sourcemap']
            }
        },

        jshint: {
            src: [
                '<%= sourceDir %>/js/**/*.js',
                '!<%= sourceDir %>/js/vendor/**/*',
                '!<%= sourceDir %>/js/atom/**/*'
            ],

            options: {
                jshintrc: '.jshintrc'
            }
        },

        jscs: {
            src: [
                '<%= sourceDir %>/js/**/*.js',
                '!<%= sourceDir %>/js/vendor/**/*',
                '!<%= sourceDir %>/js/atom/**/*'
            ],

            options: {
                config: '.jscsrc'
            }
        },

        sprite: {
            compile: {
                src: '<%= sourceDir %>/img/ui-icons/**/*.png',
                retinaSrcFilter: ['<%= sourceDir %>/img/ui-icons/**/*@2x.png'],
                dest: '<%= sourceDir %>/img/sprites/ui-icons.png',
                retinaDest: '<%= sourceDir %>/img/sprites/ui-icons@2x.png',
                destCss: '<%= sourceDir %>/scss/~ui-icons.scss',
                cssFormat: 'css_retina',
                padding: 1,
                cssTemplate: function (data) {
                    var classMediaRespond = '.i-icon';
                    var namespace = 'i-';

                    var result =
                        classMediaRespond + ' {\n\tbackground-image: url(' + data.spritesheet.image + ');\n}' +
                        '\n\n@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {' +
                        '\n\t' + classMediaRespond + ' {' +
                        '\n\t\tbackground-image: url(' + data.retina_spritesheet.image + ');' +
                        '\n\t\tbackground-size: ' + data.spritesheet.px.width + ' ' + data.spritesheet.px.height + ';\n\t}\n}';

                    for (var i = 0; i < data.items.length; i++) {
                        result +=
                            '\n\n$' + namespace + data.items[i].name + '-bg-position: ' + data.items[i].offset_x + 'px ' + data.items[i].offset_y + 'px;' +
                            '\n$' + namespace + data.items[i].name + '-width: ' + data.items[i].width + 'px;' +
                            '\n$' + namespace + data.items[i].name + '-height: ' + data.items[i].height + 'px;' +
                            '\n.' + namespace + data.items[i].name + ' {' +
                            '\n\tbackground-position: ' + data.items[i].offset_x + 'px ' + data.items[i].offset_y + 'px;' +
                            '\n\twidth: ' + data.items[i].width + 'px;' +
                            '\n\theight: ' + data.items[i].height + 'px;' +
                            '\n}';
                    }

                    return result;
                }
            }
        },

        sass: {
            dev: {
                options: {
                    sourceMap: true,
                    sourceMapFilename: 'static/src/css/app.css.map',  // Path to save map
                    sourceMapBasepath: 'static',                      // Deleting excessive prefixes
                    sourceMapRootpath: '/'                            // Path prefix (*.map file)
                },

                files: {
                    '<%= sourceDir %>/css/app.css': '<%= sourceDir %>/scss/app.scss'
                }
            },

            production: {
                files: {
                    '<%= publicDir %>/css/app.min.css': '<%= sourceDir %>/scss/app.scss'
                }
            }
        },

        cssmin: {
            options: {
                roundingPrecision: -1
            },

            target: {
                files: {
                    '<%= publicDir %>/css/app.min.css': ['<%= publicDir %>/css/app.min.css']
                }
            }
        },

        uncss: {
            dist: {
                options: {
                    ignore: uncssIgnoreClass,
                    csspath: '../../../',
                    stylesheets: ['<%= publicDir %>/css/app.min.css']
                },

                files: {
                    '<%= publicDir %>/css/app.min.css': ['<%= baseDir %>/layouts/render/*.html']
                }
            }
        },

        autoprefixer: {
            options: {
                browsers: ['last 3 versions']
            },

            sourcemap: {
                options: {
                    map: {
                        prev: '<%= sourceDir %>/css/'
                    }
                },

                src: '<%= sourceDir %>/css/app.css',
                dest: '<%= sourceDir %>/css/app.css'
            },

            pub: {
                src: '<%= publicDir %>/css/app.min.css',
                dest: '<%= publicDir %>/css/app.min.css'
            },
        },

        twigRender: {
            html: {
                files : [{
                    data: '<%= baseDir %>/layouts/_includes/__datafile.yml',
                    expand: true,
                    cwd: '<%= baseDir %>/layouts/_includes/',
                    src: ['*.twig'],
                    dest: '<%= baseDir %>/layouts/render/',
                    ext: '.html'
                }]
            }
        },

        prettify: {
            options: {
                'indent': 4
            },

            all: {
                expand: true,
                cwd: '<%= baseDir %>/layouts/render/',
                ext: '.html',
                src: ['*.html'],
                dest: '<%= baseDir %>/layouts/render/'
            }
        },

        clean: {
            css: ['<%= publicDir %>/css'],
            js: ['<%= publicDir %>/js'],
            img: ['<%= publicDir %>/img'],
            srcjs: ['<%= sourceDir %>/js/*.js.gz']
        },

        copy: {
            img: {
                cwd: '<%= sourceDir %>/img/',
                src: ['**/*',
                    '!ui-icons',
                    '!ui-icons/**/*',
                    '!zzz',
                    '!zzz/**/*'//,
                    // '!atom',
                    // '!atom/**/*'
                ],
                dest: '<%= publicDir %>/img/',
                expand: true // required when using cwd
            },

            font: {
                cwd: '<%= sourceDir %>',
                src: ['font/**/*'],
                dest: '<%= publicDir %>/',
                expand: true
            }

        },

        uglify: {
            js: {
                files: [
                    {
                        src: jsList,
                        dest: '<%= publicDir %>/js/app.min.js'
                    }
                ]
            }
        },

        filerev: {
            //  options: {
            //    algorithm: 'md5', // def: md5
            //    length: 8         // def: 8
            //  },

            js: {
                src: ['<%= publicDir %>/js/app.min.js'],
                dest: '<%= publicDir %>/js/'
            },

            css: {
                src: ['<%= publicDir %>/css/app.min.css'],
                dest: '<%= publicDir %>/css/'
            },

            img: {
                src: '<%= publicDir %>/img/**/*.{jpg,jpeg,png,gif}'
            }
        },

        filerev_assets: {
            dist: {
                options: {
                    prettyPrint: true,
                    cwd: '<%= publicDir %>/',
                    dest: '<%= publicDir %>/manifest.json'
                }
            }
        },

        usemin: {
            css: '<%= publicDir %>/**/*.css',

            options: {
                assetsDirs: ['<%= publicDir %>'],

                patterns: {
                    css: [
                        [/(img\/.*?\.(?:png|jpe?g|gif))/gm, 'Replacing reference to *.png, *.jpg, *.jpeg, *.gif']
                    ]
                }
            }
        },

        modernizr: {
            dist: {
                'crawl': false,
                'dest': '<%= sourceDir %>/js/vendor/modernizr.min.js',
                'tests': [
                    // 'touchevents'
                ],
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
        },

        chmod: {
            staticDirs: {
                options: {
                    mode: '755'
                },
                src: ['**/*', '!node_modules/**/*'],
                filter: 'isDirectory'
            },

            staticFiles: {
                options: {
                    mode: '644'
                },
                src: [
                    '**/*',
                    '!node_modules/**/*',
                    '!artisan',
                    '!*.json' //* g.sus: for some reason `chmod:staticFiles` return error (Mac OSX)
                ],
                filter: 'isFile'
            }
        },

        browserSync: {
            dev: {
                bsFiles: {
                    src : [
                        '<%= sourceDir %>/css/*.css',
                        '<%= sourceDir %>/js/*.js',
                        '<%= baseDir %>/layouts/render/*.html'
                    ]
                },

                options: {
                    watchTask: true,
                    ghostMode: false,
                    server: {
                        baseDir: '<%= baseDir %>',
                        directory: true
                    }
                }
            }
        }
    });

    //* Register tasks
    grunt.registerTask('default', [
        'browserSync',
        'watch'
    ]);

    grunt.registerTask('spritesheet', [
        'sprite',
        'sass',
        'autoprefixer:sourcemap'
    ]);

    grunt.registerTask('build', [
        'prettify',
        'clean',
        'uglify', // minify js
        'sass:production', // minify css
        'uncss',
        'cssmin',
        'autoprefixer:pub',
        'copy:img',
        'filerev:img',
        'filerev:js', 'filerev:css', 'filerev_assets',
        'usemin:css',
        'copy:font'
    ]);
};
