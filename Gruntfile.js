// global module:false
var path = require('path');

// createConfig script for replacing Smarty {$STATIC_URL} references when building config for concat
function createSmartyStaticConcatConfig(context, block) {
	var cfg = {files: []};
	var staticPattern = /\{\$\s*STATIC_URL\s*\}/;

	block.dest = block.dest.replace(staticPattern, '');
	var outfile = path.join(context.outDir, block.dest);

	var files = {
		dest: outfile,
		src: []
	};
	context.inFiles.forEach(function(f) {
		files.src.push(path.join(context.inDir, f.replace(staticPattern, '')));
	});
	cfg.files.push(files);
	context.outFiles = [block.dest];
	return cfg;
};

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
				tasks: ['less:dev']
			},
			includes: {
				files: ['<%= baseDir %>/layouts/_includes/**/*'],
				tasks: ['preprocess:html']
			},
			jshint: {
				files: ['<%= sourceDir %>/js/**/*.js'],
				tasks: ['jshint:all']
			}
		},

		jshint: {
			options: {
				jshintrc: '.jshintrc',
			},
			all: ['<%= sourceDir %>/js/**/*.js', '!<%= sourceDir %>/js/vendor/**/*.js', '!<%= sourceDir %>/js/modules/**/*.js']
		},

		spritesheet: {
			assets: {
				options: {
					outputCss: '/less/assets.less',
					selector: '.assets',

					output: {
						legacy: {
							pixelRatio: 1,
							outputImage: '/img/sprites/assets.png',
							filter: function (fullpath) {
								return fullpath.indexOf('@2x') === -1;
							}
						},

						retina: {
							pixelRatio: 2,
							outputImage: '/img/sprites/assets@2x.png',
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
					'<%= sourceDir %>': '<%= sourceDir %>/img/assets/*.png'
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

			css: {
				src: 'engine/application/view/themes/_default/_sources/css-files.smt',
				dest: 'engine/application/view/themes/_default/_sources/css-files.min.smt'
			},

			js: {
				src: 'engine/application/view/themes/_default/_sources/js-files.smt',
				dest: 'engine/application/view/themes/_default/_sources/js-files.min.smt'
			},

			img: {
				cwd: '<%= sourceDir %>',																												// root to copy
				src: ['img/**/*', '!img/assets/**', '!img/ignore/**', '!img/**/zzz*'],							// copy folder
				dest: '<%= publicDir %>/',
				expand: true																																		// required when using cwd
			}
		},

		useminPrepare: {
			js: 'engine/application/view/themes/_default/_sources/js-files.smt',
			css: 'engine/application/view/themes/_default/_sources/css-files.smt',
			options: {
				root: '<%= baseDir %>',
				staging: '<%= baseDir %>/.tmp/',
				dest: '<%= publicDir %>',
				flow: { // remove {$STATIC} from *.smt
					steps: {
						js: [{
								name: 'concat',
								createConfig: createSmartyStaticConcatConfig
							},
							'uglifyjs'
						]},
					post: {} // REQUIRED! DO NOT REMOVE
				}
			}
		},

		filerev: { // change versions (only if was chages!)
			options: {
				encoding: 'utf8',
				algorithm: 'md5',
				length: 8
			},
			css: {
				src: '<%= publicDir %>/css/*.css'
			},
			js: {
				src: '<%= publicDir %>/js/*.js'
			},
			img: {
				src: '<%= publicDir %>/img/**/*.{jpg,jpeg,png}'
			}
		},

		usemin: {
			css: 'engine/application/view/themes/_default/_sources/css-files.min.smt',
			js: 'engine/application/view/themes/_default/_sources/js-files.min.smt',
			img: '<%= publicDir %>/css/**/*.css',
			options: {
				assetsDirs: ['<%= publicDir %>', '<%= publicDir %>/css', '<%= publicDir %>/js', '<%= publicDir %>/img/sprites'],
				patterns: {
					css: [
						[/(css\/app\.min\.css)/, 'Replace CSS references']
					],
					js: [
						[/(js\/app\.min\.js)/, 'Replace JS references']
					],
					img: [
						[/(img\/.*?\.(?:jpg|jpeg|png))/img, 'Image src replacement in css files']
					]
				},
				blockReplacements: {
					js: function (block) {
						return '<script src="{$STATIC_URL}pub' + block.dest + '"></script>';
					},
					css: function (block) {
						return '<link rel="stylesheet" href="{$STATIC_URL}pub' + block.dest + '">';
					}
				}
			}
		},

		compress: {
			js: {
				options: {
					mode: 'gzip',
					pretty: true
				},
				files: [
					// Each of the files in the pub/ folder will be output to
					// the pub/ folder with the extension .gz
					{
						expand: true,
						src: ['<%= publicDir %>/js/*.js']
					},
					{
						expand: true,
						src: ['<%= sourceDir %>/js/vendor/modernizr-*.js']
					}
				]
			},
			css: {
				options: {
					mode: 'gzip',
					pretty: true
				},
				files: [
					// Each of the files in the pub/ folder will be output to
					// the pub/ folder with the extension .gz
					{
						expand: true,
						src: ['<%= publicDir %>/css/*.css']
					}
				]
			}
		}

	});

	grunt.loadTasks(path.join(__dirname, 'node_modules', 'node-spritesheet', 'tasks'));

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-preprocess');
	grunt.loadNpmTasks('grunt-usemin');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-filerev');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-compress');

	grunt.registerTask('default', ['jshint']);
	grunt.registerTask('sprite', ['spritesheet']);
	grunt.registerTask('build-css', [
		'clean:css',
		'copy:css',
		'less:production',
		'useminPrepare:css',
		'filerev:css',
		'usemin:css',
		'compress:css'
	]);
	grunt.registerTask('build-js', [
		'clean:js',
		'clean:srcjs',
		'copy:js',
		'useminPrepare:js',
		'concat',
		'uglify',
		'filerev:js',
		'usemin:js',
		'compress:js'
	]);
	grunt.registerTask('rev-img', [
		'clean:img',
		'copy:img',
		'filerev:img',
		'usemin:img'
	]);
	grunt.registerTask('build', ['build-css', 'rev-img', 'build-js']);
	grunt.registerTask('live', ['watch']);
};
