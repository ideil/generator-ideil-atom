// global module:false
var path = require('path');

// createConfig script for replacing Smarty {$STATIC_URL} references when building config for concat
// function createSmartyStaticConcatConfig(context, block) {
// 	var cfg = {files: []};
// 	var staticPattern = /\{\$\s*STATIC_URL\s*\}/;

// 	block.dest = block.dest.replace(staticPattern, '');
// 	var outfile = path.join(context.outDir, block.dest);

// 	var files = {
// 		dest: outfile,
// 		src: []
// 	};
// 	context.inFiles.forEach(function(f) {
// 		files.src.push(path.join(context.inDir, f.replace(staticPattern, '')));
// 	});
// 	cfg.files.push(files);
// 	context.outFiles = [block.dest];
// 	return cfg;
// };

// createConfig script for replacing Twig references when building config for concat
function createTwigStaticConcatConfig(context, block) {
	var cfg = {
		files: [
			{
				dest: path.join(context.outDir, block.dest),
				src: []
			}
		]
	};

	var matches = block.raw.join('').match(/\{\{ static_asset\(\'(.+?)\'\)/g) || [];

	context.outFiles = [block.dest];

	matches.forEach(function (el) {
		cfg.files[0].src.push(path.join(context.inDir,
			el.replace('{{ static_asset(\'', '').replace('\')', '')
		));
	});

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
				tasks: ['less:dev', 'autoprefixer:sourcemap']
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
					outputCss: '/less/~ui-icons.less',
					selector: '.icon',

					output: {
						legacy: {
							pixelRatio: 1,
							outputImage: '/img/sprites/ui-assets.png',
							filter: function (fullpath) {
								return fullpath.indexOf('@2x') === -1;
							}
						},

						retina: {
							pixelRatio: 2,
							outputImage: '/img/sprites/ui-assets@2x.png',
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
					'<%= sourceDir %>': '<%= sourceDir %>/img/ui-icons/*.png'
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
			img: ['<%= publicDir %>/img'],
			srcjs: ['<%= sourceDir %>/js/*.js.gz']
		},

		copy: {

			css: {
				// SMARTY
				// src: 'engine/application/view/themes/_default/_sources/css-files.smt',
				// dest: 'engine/application/view/themes/_default/_sources/css-files.min.smt'

				// TWIG
				src: 'engine/app/views/_sources/css-file.twig',
				dest: 'engine/app/views/_sources/css-file-min.twig'
			},

			js: {
				// SMARTY
				// src: 'engine/application/view/themes/_default/_sources/js-files.smt',
				// dest: 'engine/application/view/themes/_default/_sources/js-files.min.smt'

				// TWIG
				src: 'engine/app/views/_sources/js-files.twig',
				dest: 'engine/app/views/_sources/js-files-min.twig'
			},

			img: {
				cwd: '<%= sourceDir %>',																					// root to copy
				src: ['img/**/*', '!img/assets/**', '!img/**/zzz*'],							// copy folder
				dest: '<%= publicDir %>/',
				expand: true																											// required when using cwd
			}
		},

		useminPrepare: {
			// SMARTY
			// js: 'engine/application/view/themes/_default/_sources/js-files.smt',
			// css: 'engine/application/view/themes/_default/_sources/css-files.smt',

			// TWIG
			js: 'engine/app/views/_sources/js-files.twig',
			css: 'engine/app/views/_sources/css-file.twig',

			options: {
				root: '<%= baseDir %>',
				staging: '<%= baseDir %>/.tmp/',
				dest: '<%= publicDir %>',
				flow: {
					steps: {
						js: [{
								name: 'concat',
								// createConfig: createSmartyStaticConcatConfig
								createConfig: createTwigStaticConcatConfig
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
			// SMARTY
			// css: 'engine/application/view/themes/_default/_sources/css-files.min.smt',
			// js: 'engine/application/view/themes/_default/_sources/js-files.min.smt',

			// TWIG
			css: 'engine/app/views/_sources/css-file-min.twig',
			js: 'engine/app/views/_sources/js-files-min.twig',

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
					// SMARTY
					// js: function (block) {
					// 	return '<script src="{$STATIC_URL}pub' + block.dest + '"></script>';
					// },
					// css: function (block) {
					// 	return '<link rel="stylesheet" href="{$STATIC_URL}pub' + block.dest + '">';
					// }

					// TWIG
					js: function (block) {
						return '<script src="{{ static_asset(\'pub' + block.dest + '\') }}"></script>';
					},
					css: function (block) {
						return '<link rel="stylesheet" href="{{ static_asset(\'pub' + block.dest + '\') }}">';
					}
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
	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-chmod');

	grunt.registerTask('default', ['jshint']);
	grunt.registerTask('sprite', ['spritesheet']);
	grunt.registerTask('gzip-css', [
		'compress:css'
	]);

	grunt.registerTask('gzip-js', [
		'compress:js'
	]);

	grunt.registerTask('build-css', [
		'clean:css',
		'copy:css',
		'useminPrepare:css',
		'filerev:css',
		'usemin:css',
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
	]);

	grunt.registerTask('rev-img', [
		'clean:img',
		'copy:img',
		'filerev:img',
		'usemin:img'
	]);

	grunt.registerTask('build', ['build-css', 'rev-img', 'build-js', 'gzip-css', 'gzip-js']);
	grunt.registerTask('live', ['watch']);
};
