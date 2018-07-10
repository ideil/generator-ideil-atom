//# Toggle
//
//*

export default class Toggle {
    constructor($elem, $box, classActive) {
        this.btn =          $elem;
        this.box =          $box;
        this.classActive =  classActive;
    }

    init(callback) {
        this.btn.addEventListener('click', () => {
            this.box.classList.toggle(this.classActive);

            callback();
        });
    }
}
