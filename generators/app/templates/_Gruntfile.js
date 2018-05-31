//# Grunt
//
//* Task manager

module.exports = function (grunt) {
    'use strict';

    require('time-grunt')(grunt);
    require('jit-grunt')(grunt, {
        sprite: 'grunt-spritesmith'
    });

    const   SET =       require('./grunt/set'),
            UNCSS =     SET.uncss;

    // console.log(SET.sprite(data));

    grunt.initConfig({
        //## Vars

        //### Paths
        pApp:   'static',

        //#### Templates
        pTpl:       '<%= pApp %>/layouts',
        pTplData:   '<%= pTpl %>/_data',
        pTwigTpl:   '<%= pTpl %>/_includes',
        pDumpTpl:   '<%= pTpl %>/_dump',

        pTwigAppTpl:    '<%= pTwigTpl %>/pages',
        pAppTpl:        '<%= pTpl %>/pages',

        pCritTpl:       '<%= pTpl %>/critical',

        //#### Source
        pSrc:       '<%= pApp %>/src',

        pSassSrc:   '<%= pSrc %>/scss',
        pCssSrc:    '<%= pSrc %>/css',

        //#### Public
        pPub:       '<%= pApp %>/pub',
        pDumpPub:   '<%= pPub %>/_dump',

        pSassPub:   '<%= pPub %>/scss',
        pCssPub:    '<%= pPub %>/css',


        //## Setting Tasks

        //### Browser Sync
        browserSync: {
            dev: {
                options: {
                    watchTask: true,
                    // ghostMode: false,

                    server: {
                        directory:  true,

                        baseDir:    '<%= pApp %>'
                    }
                },

                bsFiles: {
                    src : [
                        '<%= pAppTpl %>/*',

                        '<%= pCssSrc %>/*.css',
                        '<%= pSrc %>/js/own/*.js',

                        '<%= pCssPub %>/*.css'
                    ]
                },
            }
        },

        //### Twig Render
        twigRender: {

            //#### Twig Devel
            app: {
                files : [{
                    expand: true,

                    data:   '<%= pTplData %>/datafile.yml',
                    cwd:    '<%= pTwigAppTpl %>',
                    src:    '*',
                    dest:   '<%= pAppTpl %>',
                    ext:    '.html',
                }]
            },

            //#### Twig Uncss
            uncssParts: {
                files : [{
                    expand: true,

                    data: [
                        '<%= pTplData %>/datafile.yml',
                        '<%= pTplData %>/uncss.json'
                    ],

                    cwd:    '<%= pTwigAppTpl %>',
                    src:    '*',
                    dest:   '<%= pDumpTpl %>/uncss/',
                    ext:    '.twig'
                }]
            },

            uncssTpl: {
                files : [{
                    expand: true,

                    data:   '<%= pTplData %>/datafile.yml',
                    cwd:    '<%= pTwigTpl %>/templates',
                    src:    '_uncss.twig',
                    dest:   '<%= pDumpTpl %>',
                    ext:    '.html'
                }]
            },

            //#### Twig Critical Devel
            criticalDev: {
                files : [{
                    expand: true,

                    data: [
                        '<%= pTplData %>/datafile.yml',
                        '<%= pTplData %>/critical/base.json',
                        '<%= pTplData %>/critical/dev.json'
                    ],

                    cwd:    '<%= pTwigAppTpl %>',
                    src: [
                        '01-*',
                    ],
                    dest:   '<%= pCritTpl %>',
                    ext:    '-dev.html'
                }]
            },

            //#### Twig Critical Public
            criticalPub: {
                files : [{
                    expand: true,

                    data: [
                        '<%= pTplData %>/datafile.yml',
                        '<%= pTplData %>/critical/base.json',
                        '<%= pTplData %>/critical/pub.json'
                    ],

                    cwd:    '<%= pTwigAppTpl %>',
                    src: [
                        '01-*',
                    ],
                    dest:   '<%= pCritTpl %>',
                    ext:    '.html'
                }]
            },
        },

        //### Prettify
        prettify: {
            options: {
                indent: 4
                // preserve_newlines: true,
                // max_preserve_newlines: 1
            },

            app: {
                expand: true,

                src:    '<%= pAppTpl %>/*',
                ext:    '.html'
            },

            critical: {
                options: {
                    unformatted: SET.prettify
                },

                expand: true,

                src:    '<%= pCritTpl %>/*',
                ext:    '.html'
            },
        },

        //### Sass
        sass: {
            //#### Sass Bootstrap
            bs: {
                options: {
                    sourceMap: true,
                    sourceMapFilename:  '<%= pCssSrc %>/bs.map',
                    sourceMapBasepath:  '<%= pSrc %>',
                    sourceMapRootpath:  '../',
                    sourceMapURL:       'bs.map',
                },

                files: {
                    '<%= pCssSrc %>/bs.css': [
                        '<%= pSassSrc %>/bs.scss',
                    ]
                }
            },

            //#### Sass App
            app: {
                options: {
                    sourceMap: true,
                    sourceMapFilename:  '<%= pCssSrc %>/app.map',
                    sourceMapBasepath:  '<%= pSrc %>',
                    sourceMapRootpath:  '../',
                    sourceMapURL:       'app.map',
                },

                files: {
                    '<%= pCssSrc %>/app.css': [
                        '<%= pSassSrc %>/app.scss'
                    ]
                }
            },

            //#### Sass Public
            public: {
                // options: {
                //     plugins: [
                //         new (require('less-plugin-autoprefix'))({
                //             browsers: ['last 3 versions']
                //         })
                //         /*new (require('less-plugin-clean-css'))({
                //             advanced: true,
                //             roundingPrecision: -1
                //             // keepBreaks: true
                //         })*/
                //     ]
                // },

                files: {
                    '<%= pDumpPub %>/bs.public.css': [
                        '<%= pSassSrc %>/bs.scss',
                    ],
                    '<%= pDumpPub %>/app.public.css': [
                        '<%= pSassSrc %>/app.scss',
                    ]
                }
            },

            //#### Sass Critical Develop
            criticalDev: {
                // options: {
                //     plugins: [
                //         new (require('less-plugin-autoprefix'))({
                //             browsers: ['last 3 versions']
                //         })
                //     ],
                //
                //     //** MOVED to cssmin
                //     //** Absolute path
                //     // rootpath: '/pub/_path-escape/'
                //     //** Relative path
                //     // rootpath: '../../pub/_path-escape/'
                // },

                files: {
                    '<%= pDumpPub %>/critical.css': [
                        '<%= pSassSrc %>/bs.scss',
                        '<%= pSassSrc %>/app.scss',
                        '<%= pSassSrc %>/critical/critical.scss',
                    ]
                }
            },

            //#### Sass Critical Public
            criticalPub: {
                // options: {
                //     plugins: [
                //         new (require('less-plugin-autoprefix'))({
                //             browsers: ['last 3 versions']
                //         })
                //     ],
                // },

                files: {
                    '<%= pDumpPub %>/critical.css': [
                        '<%= pSassSrc %>/bs.scss',
                        '<%= pSassSrc %>/app.scss',
                        '<%= pSassSrc %>/critical/critical.scss',
                    ],
                }
            },
        },

        //### Sprites
        sprite: {
            ii: {
                src:        [
                        '<%= pSrc %>/sprites/tpl/ii/**/*.png',
                    ],
                retinaSrcFilter: [
                        '<%= pSrc %>/sprites/tpl/ii/**/*@2x.png',
                    ],
                dest:           '<%= pSrc %>/sprites/ii.png',
                retinaDest:     '<%= pSrc %>/sprites/ii@2x.png',
                destCss:        '<%= pSassSrc %>/sprites/ii.scss',
                imgPath:        '../sprites/ii.png',
                retinaImgPath:  '../sprites/ii@2x.png',
                cssFormat:      'css_retina',
                padding:        1,
                cssTemplate: function (data) {
                    return SET.fn.sprite(data);
                }
            },

            // _SPRITE_TPL_2_: {
            //     src:        [
            //             '<%= pSrc %>/sprites/tpl/_SPRITE_TPL_2_/**/*.png',
            //         ],
            //     retinaSrcFilter: [
            //             '<%= pSrc %>/sprites/tpl/_SPRITE_TPL_2_/**/*@2x.png',
            //         ],
            //     dest:           '<%= pSrc %>/sprites/_SPRITE_TPL_2_.png',
            //     retinaDest:     '<%= pSrc %>/sprites/_SPRITE_TPL_2_@2x.png',
            //     destCss:        '<%= pSassSrc %>/sprites/_SPRITE_TPL_2_.scss',
            //     imgPath:        '../sprites/_SPRITE_TPL_2_.png',
            //     retinaImgPath:  '../sprites/_SPRITE_TPL_2_@2x.png',
            //     cssFormat:      'css_retina',
            //     padding:        1,
            //     cssTemplate: function (data) {
            //         return SET.fn.sprite(data, 'ii-_SPRITE_TPL_2_');
            //     }
            // },
        },

        //### Autoprefixer
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

        //### Uncss
        uncss: {

            //#### Uncss Public
            publicBS: {
                options: {
                    ignore:     UNCSS.web,

                    htmlroot:   '<%= pApp %>',
                    stylesheets: [
                        '/pub/_dump/bs.public.css'
                    ]
                },

                files: {
                    '<%= pDumpPub %>/bs.uncss.css': [
                        '<%= pDumpTpl %>/_uncss.html'
                    ]
                }
            },

            publicApp: {
                options: {
                    ignore:     UNCSS.web,

                    htmlroot:   '<%= pApp %>',
                    stylesheets: [
                        '/pub/_dump/app.public.css'
                    ]
                },

                files: {
                    '<%= pDumpPub %>/app.uncss.css': [
                        '<%= pDumpTpl %>/_uncss.html'
                    ]
                }
            },

            //#### Uncss First Screen (FS) Home Page 00
            criticalHome: {
                options: {
                    // ignore: UNCSS.web,
                    htmlroot:   '<%= pApp %>',
                    stylesheets: [
                        '/pub/_dump/critical.css'
                    ]
                },

                files: {
                    '<%= pDumpPub %>/crt-home.uncss.css': [
                        '<%= pCritTpl %>/01-*-dev.html'
                    ]
                }
            },
        },

        cssmin: {
            options: {
                level: 2,
                roundingPrecision: false
                // format: 'keep-breaks'
            },

            pubDev: {
                files: {
                    '<%= pPub %>/_css/bs.min.css':    ['<%= pPub %>/_css/bs.min.css'],
                    '<%= pPub %>/_css/app.min.css':   ['<%= pPub %>/_css/app.min.css']
                }
            },

            public: {
                files: {
                    '<%= pCssPub %>/bs.min.css':    ['<%= pDumpPub %>/bs.uncss.css'],
                    '<%= pCssPub %>/app.min.css':   ['<%= pDumpPub %>/app.uncss.css']
                }
            },

            criticalDev: {
                options: {
                    level: {
                        1: {
                            transform: function (propertyName, propertyValue) {
                                if (
                                    propertyName === 'background-image' ||
                                    propertyName === 'src' &&
                                    propertyValue.indexOf('../') > -1
                                ) {
                                    return propertyValue.replace('../', '/pub/');
                                }
                            }
                        }
                    }
                },

                files: {
                    '<%= pCssPub %>/critical/home.min.css': [
                        '<%= pDumpPub %>/crt-home.uncss.css'
                    ],
                    // '<%= pCssPub %>/critical/post.min.css': [
                    //     '<%= pDumpPub %>/crt-post.uncss.css',
                    // ],
                }
            },

            //#### Cssmin Critical Public
            criticalPub: {
                options: {
                    level: {
                        1: {
                            transform: function (propertyName, propertyValue) {
                                if (
                                    propertyName === 'background-image' ||
                                    propertyName === 'src' &&
                                    propertyValue.indexOf('../') > -1
                                ) {
                                    return propertyValue.replace('../', '/src/desktop/');
                                }
                            }
                        }
                    }
                },

                files: {
                    '<%= pCssPub %>/critical/home.min.css': [
                        '<%= pDumpPub %>/crt-home.uncss.css'
                    ],
                    // '<%= pCssPub %>/critical/post.min.css': [
                    //     '<%= pDumpPub %>/crt-post.uncss.css',
                    // ],
                }
            },
        },

        //### Filerev
        filerev: {
            //  options: {
            //    algorithm: 'md5', // def: md5
            //    length: 8         // def: 8
            //  },

            dev: {
                files: [{
                    src: [
                        '<%= pPub %>/sprites/*'
                    ],
                }]
            },

            pub: {
                files: [{
                    src: [
                        '<%= pSrc %>/desktop/sprites/*'
                    ],
                }]
            },
        },

        filerev_assets: {
            dist: {
                options: {
                    prettyPrint: true,
                    cwd: '<%= pApp %>',
                    // prefix: ,
                    dest: '<%= pPub %>/manifest.json'
                }
            }
        },

        //### Usemin
        usemin: {
            css: [
                '<%= pDumpPub %>/crt-*.uncss.css',
                '<%= pCssPub %>/bs.min.css',
                '<%= pCssPub %>/app.min.css'
            ],

            html: [
                '<%= pCritTpl %>/*.html'
            ],

            options: {
                assetsDirs: [
                    '<%= pApp %>',              // absolute css path
                    '<%= pPub %>/_path-escape', // relative css path
                ],

                patterns: {
                    //* 'Replacing reference to *.png, *.jpg, *.jpeg, *.gif'
                    css: [
                        [/(img\/.*?\.(?:png|jpe?g|gif))/gm]
                    ],
                    html: [
                        [/(img\/.*?\.(?:png|jpe?g|gif))/gm]
                    ]
                }
            }
        },

        //### Uglify
        uglify: {
            preload: {
                files: [{
                    src:    '<%= pSrc %>/js/vendor/loadCSS/cssrelpreload.js',
                    dest:   '<%= pPub %>/js/vendor/preload.min.js'
                }]
            }
        },

        //### Clean
        clean: {
            tplDump: [
                '<%= pDumpTpl %>'
            ],
            pubDump: [
                '<%= pDumpPub %>'
            ],

            fonts: [
                '<%= pPub %>/fonts/**/*'
            ],

            img: [
                '<%= pPub %>/img/**/*',
                '<%= pPub %>/sprites/*'
            ],

            fakeCriticalPub: [
                '<%= pSrc %>/desktop'
            ],
        },

        //### Copy
        copy: {
            fonts: {
                expand: true,

                cwd: '<%= pSrc %>/fonts/',
                src: [
                    '**/*.woff*',
                    '!**/reserve/*',
                ],
                dest: '<%= pPub %>/fonts/',
            },

            img: {
                expand: true,

                cwd: '<%= pSrc %>',
                src: [
                    'sprites/*.png',
                    // 'img/',
                ],
                dest: '<%= pPub %>',
            },

            fakeCriticalPub: {
                expand: true,

                cwd: '<%= pSrc %>',
                src: [
                    'sprites/*.png',
                    // 'img/',
                ],
                dest: '<%= pSrc %>/desktop'
            }
        },

        //### Watch
        watch: {
            options: {
                livereload: true,
                spawn:      false,
            },

            //#### Watch Twig App
            appTpl: {
                files: [
                    '<%= pTplData %>/**/*',
                    '<%= pTwigTpl %>/**/*'
                ],

                tasks: ['twigRender:app'] // 'prettify:app'
            },

            //#### Watch Twig Critical Devel
            // criticalTpl: {
            //     files: [
            //         '<%= pTwigTpl %>/**/*',
            //     ],

            //     tasks: ['twigRender:criticalDev']
            // },

            //#### Watch Sass App Scr
            bsSass: {
                files: [
                    '<%= pSassSrc %>/set/*',

                    '<%= pSassSrc %>/bs.sass',
                ],

                tasks: [
                    'sass:bs'
                ]
            },

            //#### Watch Sass App
            appSass: {
                files: [
                    '<%= pSassSrc %>/set/*',

                    //** Tsn layouts
                    '<%= pSassSrc %>/app.sass',
                    '<%= pSassSrc %>/components/**/*'
                ],
                tasks: [
                    'sass:app'
                ]
            },

            //#### Watch Sprite
            sprite: {
                files: [
                    '<%= pSrc %>/sprites/tpl/**/*.png'
                ],

                tasks: [
                    'sprite',
                    'sass:app'
                ]
            },

            svg: {
                files: [
                    '<%= pSrc %>/svg/**/*.svg'
                ],
                tasks: [
                    'twigRender:app'
                ]
            }
        },

        //### Modernizr
        modernizr: {
            dist: {
                'crawl': false,
                'dest': '<%= pSrc %>/js/vendor/modernizr.min.js',
                'tests': [
                    // 'touchevents',
                    // 'csscalc'
                ],
                'options': [
                    // 'domPrefixes',
                    // 'prefixes',
                    // 'testAllProps',
                    // 'testProp',
                    // 'testStyles',
                    // 'setClasses'
                ],
                'uglify': true
            }
        },

        chmod: {
            staticDirs: {
                options: {
                    mode: '755'
                },
                src: [
                    '**/*',
                    '!node_modules/**/*'
                ],
                filter: 'isDirectory'
            },

            staticFiles: {
                options: {
                    mode: '644'
                },
                src: [
                    '**/*',
                    '!node_modules/**/*',
                    '!*.json' //* g.sus: for some reason `chmod:staticFiles` return error (Mac OSX)
                ],
                filter: 'isFile'
            }
        },
    });

    //* Register tasks
    grunt.registerTask('default', [
        'browserSync',
        'watch'
    ]);

    grunt.registerTask('spritesheet', [
        'sprite',
        'sass:app',
        // 'autoprefixer:sourcemap'
    ]);

    grunt.registerTask('update-assets', [
        //* Remove old
        'clean:fonts',
        'clean:img',
        //* Add current
        'copy:fonts',
        'copy:img',
    ]);

    //### Filerev

    grunt.registerTask('rev', [
        'update-assets',
        'filerev:dev',
        'usemin',
    ]);

    grunt.registerTask('rev-fake-pub', [
        'copy:fakeCriticalPub',
        'filerev:pub',
        'filerev_assets',
        'usemin',
        'clean:fakeCriticalPub',
    ]);

    //### Build

    grunt.registerTask('build-css', [
        'update-assets',

        //* Sass to css + autoprefixer
        'sass:public',

        // //* Make uncss template(s)
        // 'twigRender:uncssParts',
        // 'twigRender:uncssTpl',
        // //* Remove excessive styles
        // 'uncss:publicBS',
        // 'uncss:publicApp',

        //* Minify css
        //** We can use single Sass task, but EVERY BYTE is IMPORTANT (uncss leave own comment) :(
        'cssmin:public',

        //* Clean dump
        'clean:tplDump',
        'clean:pubDump',
    ]);

    grunt.registerTask('build-critical-dev', [
        //* Prepare CSS
        //** TR1 build tpl for uncss
        'twigRender:criticalDev',
        'sass:criticalDev',

        'uncss:criticalHome',
        // 'uncss:criticalPostSimple',
        // 'uncss:criticalPostExtended',
        // 'uncss:criticalPostGallery',
        // 'uncss:criticalPostVideo',
        // 'uncss:criticalCommonBannerTheme',

        //* Filerev:css
        'rev',

        //* Minify css
        'cssmin:criticalDev',

        //* Output
        //** TR2 inline css
        'twigRender:criticalDev',
        'prettify:critical',

        //* Filerev:html
        'rev',

        //* Clean dump
        'clean:pubDump',
    ]);

    grunt.registerTask('build-critical', [
        //* Prepare CSS
        //** TwigRender 1: build tpl for uncss
        'twigRender:criticalPub',
        'sass:criticalPub',

        'uncss:criticalHome',
        // 'uncss:criticalPostSimple',
        // 'uncss:criticalPostExtended',
        // 'uncss:criticalPostGallery',
        // 'uncss:criticalPostVideo',

        //* Filerev
        'rev',

        //* Minify css
        'cssmin:criticalPub',

        //* Output
        //** TwigRender 2: inline css
        'twigRender:criticalPub',
        'prettify:critical',

        //* Filerev:html
        'rev-fake-pub',

        //* Clean dump
        'clean:pubDump',
    ]);

    grunt.registerTask('critical-full', [
        //** Minify "loadCSS.js" – `[rel=preload]` polyfill
        'uglify:preload',
        'build-critical',
    ]);

    grunt.registerTask('build', [
        'prettify:app',
        'build-css',
        'critical-full',
    ]);

    // grunt.registerTask('buildDev', [
    //     'sass:pubDev',
    //     'cssmin:pubDev',
    // ]);
};
