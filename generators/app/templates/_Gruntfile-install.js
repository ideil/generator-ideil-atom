// global module:false
var path = require('path');

module.exports = function (grunt) {
	grunt.initConfig({
		baseDir: '../static',
		sourceDir: '<%= baseDir %>/src',
		publicDir: '<%= baseDir %>/pub',

		copy: {
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
			variables_bootstrap: {
				cwd: 'bower_components/components-bootstrap/less/',
				src: 'variables.less',
				dest: '<%= sourceDir %>/less/',
				expand: true,
				rename: function(dest, src) {
				  return dest + src.replace('variables', 'vars-bootstrap');
				}
			},
			font_bootstrap: { 
			  cwd: 'bower_components/components-bootstrap/fonts/',
			  src: '**',
			  dest: '<%= sourceDir %>/font/glyphicons/',
			  expand: true
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
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-text-replace');

	// Register
	grunt.registerTask('bower', [
		'copy:js_bootstrap', 
		'copy:js_boilerplate', 
		'copy:less_bootstrap',
		'copy:variables_bootstrap',
		'copy:font_bootstrap'
	]);

	grunt.registerTask('slick', [
		'copy:less_slick',
		'copy:js_slick'
	]);

};
