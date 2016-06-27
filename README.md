# Ideil Atom Generator
> [Yeoman](http://yeoman.io/) generator that scaffolds out a front-end web app using [Grunt](http://gruntjs.com/) for the build process

## Features
- [Twig](http://twig.sensiolabs.org/), the flexible, fast, and secure template engine
- [Bootstrap](http://getbootstrap.com/) in LESS, [Modernizr](https://modernizr.com/)
- [Browsersync](https://www.browsersync.io/)
- Built-in preview server with [LiveReload](http://livereload.com/)
- CSS [Autoprefixing](https://github.com/postcss/autoprefixer/) 
- Automagically compile [LESS](http://lesscss.org/)
- Removing unused CSS with [UnCSS](https://github.com/giakki/uncss)
- Automagically create sprite sheets
- [Slick](https://github.com/kenwheeler/slick/) carousel (Optional)
- [Underscore.js](http://underscorejs.org/) (Optional)

For more information on what generator-ideil-atom can do for you, take a look at the [Grunt tasks](https://github.com/ideil/generator-ideil-atom/blob/master/generators/app/templates/_package.json) used in our `package.json`.

## Getting Started
Install dependencies:
```sh
$ npm install -g yo bower grunt-cli
```
Install the generator:
```sh
$ npm install -g generator-ideil-atom
```
Create a directory for new project:
```sh
$ mkdir new-project
$ cd new-project
```
Run:
```sh
$ yo ideil-atom
```
To build your webapp for production, run:
```sh
$ npm grunt
```
## License
[MIT License](https://en.wikipedia.org/wiki/MIT_License)
