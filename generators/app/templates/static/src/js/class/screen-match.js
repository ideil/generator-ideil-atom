//# Screen Match
//
//*

export default class Screen {
    constructor(size, isValue) {
        this.size =     size;
        this.isValue =  isValue;
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
