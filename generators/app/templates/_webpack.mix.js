//# Webpack
//
//*

/* globals path */

const
    mix = require('laravel-mix');

mix.setPublicPath(path.normalize('static'));

mix.webpackConfig({
    devtool: 'source-map',
    resolve: {
        alias: {
            '@js': path.resolve(__dirname, 'static/src/js/')
        }
    },
    // externals: {
    //     jquery: 'jQuery'
    // },
});

mix
    .js(
        [
            'static/src/js/component/menu.js',
        ],
        '/src/js/build/common.js'
    );
