// global module:false
var path = require('path');

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
				files: ['<%= baseDir %>/layouts/_includes/**/*.html'],
				tasks: ['preprocess:html']
			},

			jshint: {
				files: ['<%= sourceDir %>/js/**/*.js'],
				tasks: ['jshint:all']
			},

			spritesheet: {
				files: ['<%= sourceDir %>/img/ui-icons/**/*.png'],
				tasks: ['spritesheet', 'less:dev', 'autoprefixer:sourcemap']
			}
		},

		jshint: {
			options: {
				jshintrc: '.jshintrc',
			},

			all: ['<%= sourceDir %>/js/**/*.js', '!<%= sourceDir %>/js/vendor/**/*.js']
		},

		spritesheet: {
			compile: {
				options: {
					outputCss: '/less/~ui-icons.less',
					selector: '.icon',

					output: {
						legacy: {
							pixelRatio: 1,
							outputImage: '/img/sprites/ui-icons.png',
							filter: function (fullpath) {
								return fullpath.indexOf('@2x') === -1;
							}
						},

						retina: {
							pixelRatio: 2,
							outputImage: '/img/sprites/ui-icons@2x.png',
							filter: function (fullpath) {
								return fullpath.indexOf('@2x') >= 0;
							}
						}
					},

					resolveImageSelector: function (name, fullpath) {
						return name.split('@2x').join('');
					}
				},

				files: {
					'<%= sourceDir %>': '<%= sourceDir %>/img/ui-icons/**/*.png'
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
				options: {
					sourceMap: false,
					compress: true,
					cleancss: true
				},

				files: {
					'<%= publicDir %>/css/app.min.css': ['<%= sourceDir %>/less/app.less']
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
			img: ['<%= publicDir %>/img']
		},

		copy: {
			img: {
				cwd: '<%= sourceDir %>/img/',
				src: ['**/*',
					'!ui-icons',
					'!ui-icons/**/*',
					'!zzz',
					'!zzz/**/*',
					'!atom',
					'!atom/**/*'
				],
				dest: '<%= publicDir %>/img/',
				expand: true // required when using cwd
			},

			font: {
				cwd: '<%= sourceDir %>',
				src: ['font/**/*'],
				dest: '<%= publicDir %>/',
				expand: true
			},

			js_bootstrap: { 
			  cwd: 'bower_components/components-bootstrap/js/',
			  src: '**',
			  dest: '<%= sourceDir %>/js/vendor/bootstrap/',
			  expand: true
			},

			js_boilerplate: { 
			  cwd: 'bower_components/html5-boilerplate/dist/js/vendor/',
			  src: 'jquery*.js',
			  dest: '<%= sourceDir %>/js/vendor/',
			  expand: true
			},

			less_bootstrap: { 
			  cwd: 'bower_components/components-bootstrap/less/',
			  src: '**',
			  dest: '<%= sourceDir %>/less/vendor/bootstrap/',
			  expand: true,
			},
			less_slick: {
				cwd: 'bower_components/slick-carousel/slick/',
				src: 'slick.css',
				dest: '<%= sourceDir %>/less/vendor/',
				expand: true,
				rename: function(dest, src) {
				  return dest + src.replace('.css', '.less');
				}
			},
			js_slick: {
				cwd: 'bower_components/slick-carousel/slick/',
				src: 'slick.js',
				dest: '<%= sourceDir %>/js/vendor/',
				expand: true
			}

			// html_boilerplate: {
			// 	src: 'bower_components/html5-boilerplate/dist/index.html',
			// 	dest: '<%= baseDir %>/layouts/index.html'
			// }
		},

		uglify: {
			js: {
				files: [
					{
						src: ['<%= sourceDir %>/js/**/*.js'],
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
				src: '<%= publicDir %>/img/**/*.{jpg,jpeg,png}'
			}
		},

		filerev_assets: {
			dist: {
				options: {
					prettyPrint: true,
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
						[/(img\/.*?\.(?:png|jpe?g|gif))/gm, 'Replacing reference to *.png, *.jpg, *.jpeg']
					]
				}
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
		}
	});

	// Load
	grunt.loadTasks(path.join(__dirname, 'node_modules', 'node-spritesheet', 'tasks'));

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
	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-chmod');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-text-replace');

	// Register
	grunt.registerTask('sprite', [
		'spritesheet',
		'less',
		'autoprefixer:sourcemap'
	]);

	grunt.registerTask('build', [
		'clean',
		'uglify', // minify js
		'less:production', // minify css
		'autoprefixer:sourcemap',
		'filerev:js', 'filerev:css', 'filerev_assets',
		'copy:img',
		'filerev:img',
		'usemin:css',
		'copy:font'
	]);

	grunt.registerTask('bower', [
		'copy:js_bootstrap', 
		'copy:js_boilerplate', 
		'copy:less_bootstrap',
		'copy:less_slick',
		'copy:js_slick'
	]);

	grunt.registerTask('slick', [
		'copy:less_slick',
		'copy:js_slick'
	]);

};
