'use strict';

var yeoman = require('yeoman-generator');
// var chalk = require('chalk');
// var yosay = require('yosay');
var fs = require('fs-extra');
var mkdirp = require('mkdirp');
var _s = require('underscore.string');

module.exports = yeoman.generators.Base.extend({
    prompting: function () {
        var done = this.async();

        var prompts = [
            {
                type: 'input',
                name: 'projectName',
                message: 'What\'s your project\'s name?',
                default: function () {
                    return 'My project';
                }
            },
            {
                type: 'confirm',
                name: 'slick',
                message: 'Do you need carousel?',
                default: true
            },
            {
                type: 'confirm',
                name: 'photoswipe',
                message: 'Do you need gallery?',
                default: true
            },
            {
                type: 'list',
                name: 'library',
                message: 'Do you need JavaScript library?',
                choices: [
                    {
                        name: 'No',
                        value: 0
                    },
                    {
                        name: 'Lodash',
                        value: 1
                    },
                    {
                        name: 'Underscore.js',
                        value: 2
                    }
                ]
            }
        ];

        this.prompt(prompts, function (answers) {
            this.projectName = answers.projectName;
            // To access props later use this.props.someOption;
            this.slick = answers.slick;
            this.photoswipe = answers.photoswipe;
            this.library = answers.library;
            done();
        }.bind(this));
    },

    writing: {
        atom: function () {
            mkdirp('static.www');
            mkdirp('static');
            mkdirp('install');

            this.fs.copy(
                this.templatePath('static/**/*'),
                this.destinationPath('static/')
            );

            this.fs.copy(
                this.templatePath('_.editorconfig'),
                this.destinationPath('.editorconfig')
            );

            this.fs.copy(
                this.templatePath('_.gitignore'),
                this.destinationPath('.gitignore')
            );

            this.fs.copy(
                this.templatePath('_.jshintrc'),
                this.destinationPath('.jshintrc')
            );

            this.fs.copy(
                this.templatePath('_.jscsrc'),
                this.destinationPath('.jscsrc')
            );

            this.fs.copy(
                this.templatePath('_Gruntfile.js'),
                this.destinationPath('Gruntfile.js')
            );

            this.fs.copy(
                this.templatePath('_LICENSE'),
                this.destinationPath('LICENSE')
            );

            this.fs.copy(
                this.templatePath('_README.md'),
                this.destinationPath('README.md')
            );

            this.fs.copyTpl(
                this.templatePath('_package.json'),
                this.destinationPath('package.json'),
                { project: _s.slugify(this.projectName) }  // Put this.name in the title attribute
            );

            this.fs.copy(
                this.templatePath('_Gruntfile-install.js'),
                this.destinationPath('install/Gruntfile.js')
            );

            this.fs.copy(
                this.templatePath('_package-install.json'),
                this.destinationPath('install/package.json')
            );

            if (this.slick) {
                this.fs.copy(
                    this.templatePath('plugins/slick/*.js'),
                    this.destinationPath('static/src/js/app/')
                );
            }

            if (this.photoswipe) {
                this.fs.copy(
                    this.templatePath('plugins/photoswipe/*.js'),
                    this.destinationPath('static/src/js/')
                );
                this.fs.copy(
                    this.templatePath('plugins/photoswipe/*.twig'),
                    this.destinationPath('static/layouts/_includes/parts/photoswipe')
                );
            }
        }
    },

    install: {
        npm: function () {
            process.chdir('install/');
            this.npmInstall();
        },

        bower: function () {
            this.bowerInstall(['bootstrap', 'jquery#3.2.1']);

            if (this.slick) {
                this.bowerInstall(['slick-carousel']);
            }

            if (this.photoswipe) {
                this.bowerInstall(['https://github.com/dimsemenov/PhotoSwipe.git']);
            }

            if (this.library == 1) {
                this.bowerInstall(['lodash']);
            }

            if (this.library == 2) {
                this.bowerInstall(['underscore']);
            }
        }
    },

    end: {
        task: function () {
            this.spawnCommand('grunt', ['bower', 'replace:bootstrap']);

            if (this.slick) {
                this.spawnCommand('grunt', ['slick']);
            }

            if (this.photoswipe) {
                this.spawnCommand('grunt', ['photoswipe']);
            }

            if (this.library == 1) {
                this.spawnCommand('grunt', ['lodash']);
            }

            if (this.library == 2) {
                this.spawnCommand('grunt', ['underscore']);
            }
        },

        project: function () {
            process.chdir('..');

            this.installDependencies({
                bower: false
            });
        },

        clean: function () {
            fs.remove('install');
        }
    }
});
