// global module:false
var path = require('path');

var jsList = [
	'<%= sourceDir %>/js/vendor/jquery-1.11.3.min.js',
	'<%= sourceDir %>/js/ui.js',
	'<%= sourceDir %>/js/app.js'
];

var ignorClass = [
	'/^.is/',
	'/^.has/',
	'/^.slick/'
];

module.exports = function (grunt) {

	grunt.initConfig({
		baseDir: 'static',
		sourceDir: '<%= baseDir %>/src',
		publicDir: '<%= baseDir %>/pub',

		watch: {
			options: {
				livereload: true
			},

			less: {
				files: ['<%= sourceDir %>/less/**/*.less'],
				tasks: ['less:dev', 'autoprefixer:sourcemap']
			},

			includes: {
				files: ['<%= baseDir %>/layouts/_includes/**/*'],
				tasks: ['preprocess:html']
			},

			jshint: {
				files: ['<%= sourceDir %>/js/ui.js'],
				tasks: ['jshint:all']
			},

			sprite: {
				files: ['<%= sourceDir %>/img/ui-icons/**/*.png'],
				tasks: ['sprite', 'less:dev', 'autoprefixer:sourcemap']
			}
		},

		jshint: {
			options: {
				jshintrc: '.jshintrc',
			},

			all: ['<%= sourceDir %>/js/ui.js']
		},

		sprite: {
			compile: {
				src: '<%= sourceDir %>/img/ui-icons/**/*.png',
				retinaSrcFilter: ['<%= sourceDir %>/img/ui-icons/**/*@2x.png'],
				dest: '<%= sourceDir %>/img/sprites/ui-icons.png',
				retinaDest: '<%= sourceDir %>/img/sprites/ui-icons@2x.png',
				destCss: '<%= sourceDir %>/less/~ui-icons.less',
				cssFormat: 'css_retina',
				padding: 1,
				cssTemplate: function (data) { 
				    var classMediaRespond = '.icon';
				    var classNamespace = '.i-';

				    var result = classMediaRespond +
				        '{background-image:url(' + data.spritesheet.image + ');}' +
				        '@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {' +
				        classMediaRespond + '{' +
				        'background-image:url(' + data.retina_spritesheet.image + ');' +
				        'background-size:' + data.spritesheet.px.width + ' ' + data.spritesheet.px.height +
				        ';}}';

				    for (var i = 0; i < data.items.length; i++) {
				        result += '@' + data.items[i].name + '-bg-position:' + data.items[i].offset_x + 'px ' + data.items[i].offset_y + 'px;' +
				        	'@' + data.items[i].name + '-width:' + data.items[i].width + 'px;' +
				            '@' + data.items[i].name + '-height:' + data.items[i].height + 'px;' +
				            classNamespace + data.items[i].name + '{' +
				            'background-position:' + data.items[i].offset_x + 'px ' + data.items[i].offset_y + 'px;' +
				            'width:' + data.items[i].width + 'px;' +
				            'height:' + data.items[i].height + 'px;' +
				            '}';
				    };

				    return result;
				}
			}
		},

		less: {
			dev: {
				options: {
					sourceMap: true,
					sourceMapFilename: 'static/src/css/app.css.map',	// Path to save map
					sourceMapBasepath: 'static',											// Deleting excessive prefixes
					sourceMapRootpath: '/'														// Path prefix (*.map file)
				},

				files: {
					'<%= sourceDir %>/css/app.css': ['<%= sourceDir %>/less/app.less']
				}
			},

			production: {
				files: {
					'<%= publicDir %>/css/app.min.css': ['<%= sourceDir %>/less/app.less']
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
					ignore: ignorClass,
					csspath: '../../',
					stylesheets: ['<%= publicDir %>/css/app.min.css']
				},
				
				files: {
				  '<%= publicDir %>/css/app.min.css': ['<%= baseDir %>/layouts/*.html']
				}
			}
		},

		autoprefixer: {
			options: {
				browsers: ['last 3 versions', 'ie 9']
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

		preprocess: {
			options: {
				context : {
					DEBUG: true
				}
			},

			html: {
				files: [{
					expand: true,
					cwd: '<%= baseDir %>/layouts/_includes',
					src: 'tpl.*',
					dest: '<%= baseDir %>/layouts/',
					rename: function (dest, src) {
						return dest + src.replace('tpl.', '');
					}
				}]
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
			// 	options: {
			// 		algorithm: 'md5', // init: md5
			// 		length: 8         // init: 8
			// 	},

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

		compress: {
			js: {
				options: {
					mode: 'gzip',
					pretty: true,
					level: 9
				},

				files: [
					// Each of the files in the pub/ folder will be output to
					// the pub/ folder with the extension .gz
					{
						expand: true,
						src: ['<%= publicDir %>/js/*.js'],
						rename: function (dest, src) {
							return src + '.gz';
						}
					},

					{
						expand: true,
						src: ['<%= sourceDir %>/js/vendor/modernizr-*.js'],
						rename: function (dest, src) {
							return src + '.gz';
						}
					}
				]
			},

			css: {
				options: {
					mode: 'gzip',
					pretty: true,
					level: 9
				},

				files: [
					// Each of the files in the pub/ folder will be output to
					// the pub/ folder with the extension .gz
					{
						expand: true,
						src: ['<%= publicDir %>/css/*.css'],
						rename: function (dest, src) {
							return src + '.gz';
						}
					}
				]
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
				src: ['**/*', '!node_modules/**/*'],
				filter: 'isFile'
			}
		}

	});

	// Load
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-preprocess');
	grunt.loadNpmTasks('grunt-usemin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-filerev');
	grunt.loadNpmTasks('grunt-filerev-assets');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-chmod');
	grunt.loadNpmTasks('grunt-spritesmith');
	grunt.loadNpmTasks('grunt-uncss');
	grunt.loadNpmTasks('grunt-contrib-cssmin');

	// Register
	grunt.registerTask('spritesheet', [
		'sprite',
		'less',
		'autoprefixer:sourcemap'
	]);

	grunt.registerTask('build', [
		'clean',
		'uglify', // minify js
		'less:production', // minify css
		'uncss',
		'cssmin',
		'autoprefixer:pub',
		'copy:img',
		'filerev:img',
		'filerev:js', 'filerev:css', 'filerev_assets',
		'usemin:css',
		'copy:font'
	]);

	grunt.registerTask('gzip-css', [
		'compress:css'
	]);

	grunt.registerTask('gzip-js', [
		'compress:js'
	]);

};
