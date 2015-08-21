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

			sprite: {
				files: ['<%= sourceDir %>/img/ui-icons/**/*.png'],
				tasks: ['sprite', 'less:dev', 'autoprefixer:sourcemap']
			}
		},

		jshint: {
			options: {
				jshintrc: '.jshintrc',
			},

			all: ['<%= sourceDir %>/js/**/*.js', '!<%= sourceDir %>/js/vendor/**/*.js']
		},

		sprite: {
			compile: {
				src: '<%= sourceDir %>/img/ui-icons/**/*.png',
				retinaSrcFilter: ['<%= sourceDir %>/img/ui-icons/**/*@2x.png'],
				dest: '<%= sourceDir %>/img/sprites/ui-icons.png',
				retinaDest: '<%= sourceDir %>/img/sprites/ui-icons@2x.png',
				destCss: '<%= sourceDir %>/less/~ui-icons.less',
				cssFormat: 'css_retina',
				padding: 5,
				cssOpts: {
				    cssSelector: function (sprite) {
				      return '.icon.' + sprite.name;
				    }
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
			}

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
	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-chmod');
	grunt.loadNpmTasks('grunt-spritesmith');

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
		'autoprefixer:sourcemap',
		'filerev:js', 'filerev:css', 'filerev_assets',
		'copy:img',
		'filerev:img',
		'usemin:css',
		'copy:font'
	]);

};
