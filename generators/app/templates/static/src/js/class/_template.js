//# _TEMPLATE
//
//*

export default class {
    constructor($element, settings) {
        //## Settings
        this.DEFAULTS = {};

        //### Base
        settings = settings || {};

        //### Nodes
        this.$element = $element;

        //### Settings

        //** override settings programmatically
        Object.assign(this, settings);

        //## Private

        //## Events
        this.requestResize = this.requestResize.bind(this);
        this.requestScroll = this.requestScroll.bind(this);
        this.eResize = this.eResize.bind(this);
        this.eScroll = this.eScroll.bind(this);

        //## Initialize
        this.initialize();
    }

    //## Variables
    getProps() {}

    //## Function
    setPosition() {}

    //## Events
    requestResize() {}

    requestScroll() {}

    onResize() {
        this.updateResize();

        window.requestAnimationFrame(this.requestResize);
    }

    onScroll() {
        this.updateScroll();

        window.requestAnimationFrame(this.requestScroll);
    }

    //## Main
    initialize() {
        window.addEventListener('resize', this.eResize);
        window.addEventListener('scroll', this.eScroll);
    }

    remove() {
        window.removeEventListener('resize', this.eResize);
        window.cancelAnimationFrame(this.requestResize);

        window.removeEventListener('scroll', this.eScroll);
        window.cancelAnimationFrame(this.requestScroll);

        Object.keys(this).forEach((key) => {
            delete this[key];
        });

        return this;
    }
}
