'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var fs = require('fs-extra');
var mkdirp = require('mkdirp');
var _s = require('underscore.string');

module.exports = yeoman.generators.Base.extend({

    prompting: function () {

        var done = this.async();

        var prompts = [
            {
                type: "input",
                name: "project_name",
                message: "What's your project's name?",
                default: function () { return "My project"; }
            },
            {
                type: "confirm",
                name: "slick",
                message: "Do you need slider?",
                default: true
            },
            {
                type: "confirm",
                name: "underscore",
                message: "Do you need underscore.js?",
                default: true
            }
        ];

        this.prompt(prompts, function (answers) {
            this.project_name = answers.project_name;
            // To access props later use this.props.someOption;
            this.slick = answers.slick;
            this.underscore = answers.underscore;

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
                    { project: _s.slugify(this.project_name) }  // Put this.name in the title attribute
            );
            // Install
            this.fs.copy(
                this.templatePath('_Gruntfile-install.js'),
                this.destinationPath('install/Gruntfile.js')
            );
            this.fs.copy(
                this.templatePath('_package-install.json'),
                this.destinationPath('install/package.json')
            );

        }

    },

    install: {

        npm: function () {

            process.chdir('install/');
            this.npmInstall();

        },

        bower: function () {

            this.bowerInstall(['components-bootstrap', 'git://github.com/h5bp/html5-boilerplate.git']);

            if (this.slick) {
                this.bowerInstall(['slick-carousel']);
            };

            if (this.underscore) {
                this.bowerInstall(['underscore']);
            };

        }

    },


    end: {

        task: function () {

            this.spawnCommand('grunt', ['bower', 'replace', 'concat']);

            if (this.slick) {
                this.spawnCommand('grunt', ['slick']);
            };

            if (this.underscore) {
                this.spawnCommand('grunt', ['underscore']);
            };

        },

        project: function () {

            process.chdir('..');
            this.installDependencies({ bower: false });

        },

        clean: function () {

            fs.remove('install');

        }

    }

});
