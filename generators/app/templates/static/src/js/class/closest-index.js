//# Closest by Index
//
//*

export default class ClosestIndex {
    constructor(target, selector, index) {
        this.selector = selector;
        this.index = index;
        this.target = target;
    }

    check() {
        const
            $elements = Array.from(document.querySelectorAll(this.selector));

        let isClosest =
                $elements.indexOf(this.target.closest(this.selector)) ===
                this.index;

        return isClosest;
    }
}
