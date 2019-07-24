//# Utilities
//
//*

'use strict';


//## Screen Match
//
//* Define if screen match threshold

export default class ScreenMatch {
    constructor(size, isValue) {
        this.size = size;
        this.isValue = isValue;
        this.screen = {
            sm: 540,
            md: 720,
            lg: 960,
            xl: 1140,
        };
    }

    define() {
        let result;

        if (this.isValue) {
            result = this.screen[this.size];
        } else {
            result =
                window.matchMedia(
                    `(min-width: ${ this.screen[this.size] }px)`
                ).matches;
        }

        return result;
    }
}


//## Debounce
//
//* Credits: https://codeburst.io/throttling-and-debouncing-in-javascript-b01cad5c8edf

//** Example of use
// window.addEventListener('resize', debounce(function () {
//     console.info('Hey! It is', new Date().toUTCString());
// }, 1000));

const debounce = (func, delay) => {
    let inDebounce;

    return function () {
        const
            context = this,
            args = arguments;

        clearTimeout(inDebounce);
        inDebounce = setTimeout(() => func.apply(context, args), delay);
    };
};


//# Throttle
//
//* Credits: https://codeburst.io/throttling-and-debouncing-in-javascript-b01cad5c8edf

//** Example of use
// window.addEventListener('reisze', throttle(function () {
//     return console.log('Hey! It is', new Date().toUTCString());
// }, 1000));

const throttle = (func, limit) => {
    let lastFunc;
    let lastRan;

    return function () {
        const context = this;
        const args = arguments;
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function () {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
};


//## Export
//
//* import * as Utils from '@js/class/utilities';

export { debounce, throttle };
