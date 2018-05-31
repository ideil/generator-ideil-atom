'use strict';

var SET = {
    prettify: [
        'pre',
        'code',

        'style',
        'script'
    ],

    uncss: {
        web: [
            /^textarea/,

            /^.active/,
            /^.open/,
            /^.modal/,
            /^.in/,
            /^.fade/,

            /^.i-/,
            /^.o-/,
            /^.c-/,
            /^.u-/,
            /^.s-/,
            /^.t-/,
            /^.is-/,
            /^.has-/,

            /^.slick/,
            // /^.lg/,
            // /^.clndr/,
            // /^.table-clndr/,
            // /^./,
        ]
    },

    fn: {
        sprite: function (data, classMedia) {
            var classNS =    '.i-',
                i,
                result;

            classMedia =
                classMedia ?
                classNS + classMedia :
                classNS + 'ii';

            // console.log(classMedia);

            result =
                classMedia + ' {\n\tbackground-image: url(' + data.spritesheet.image + ');\n}' +
                '\n\n@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {' +
                '\n\t' + classMedia + ' {' +
                '\n\t\tbackground-image: url(' + data.retina_spritesheet.image + ');' +
                '\n\t\tbackground-size: ' + data.spritesheet.px.width + ' ' + data.spritesheet.px.height + ';\n\t}\n}';

            for (i = 0; i < data.items.length; i++) {
                result +=
                    '\n\n@i-' + data.items[i].name + '-bg: ' + data.items[i].offset_x + 'px ' + data.items[i].offset_y + 'px;' +
                    '\n@i-' + data.items[i].name + '-w: ' + data.items[i].width + 'px;' +
                    '\n@i-' + data.items[i].name + '-h: ' + data.items[i].height + 'px;' +
                    '\n' + classNS + data.items[i].name + ' {' +
                    '\n\tbackground-position: ' + data.items[i].offset_x + 'px ' + data.items[i].offset_y + 'px;' +
                    '\n\twidth: ' + data.items[i].width + 'px;' +
                    '\n\theight: ' + data.items[i].height + 'px;' +
                    '\n}';
            }

            return result;
        }
    },
};

module.exports = SET;
