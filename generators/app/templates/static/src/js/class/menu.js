//# Menu
//
//*

'use strict';

import { ScreenMatch } from '@js/class/utilities';

export default class {
    constructor(classRoot) {
        this.classRoot = classRoot;
        this.class = {
            elActive: 'c-' + this.classRoot + '-active',
            bodyActive: 'v-' + this.classRoot + '-active',
        };
        this.selector = {
            btn: '.js-' + this.classRoot + '-btn',
            box: '.js-' + this.classRoot + '-box',
        };
        this.data = {
            // ref: 'data-' + this.classRoot + '-ref',
            visible: 'data-' + this.classRoot + '-visible',
            view: 'data-' + this.classRoot + '-view',
        };
        this.menu = {
            $btns: document.querySelectorAll(this.selector.btn),
            $boxes: document.querySelectorAll(this.selector.box),
            iActive: null,
        };
        this.fn = {
            hide: null
        };
    }

    toggleAccessibility($box, state) {
        $box.setAttribute('aria-hidden', state);

        return $box;
    }

    accessibility(iSelf) {
        const
            $box = this.menu.$boxes[iSelf],
            dataThreshold = $box.getAttribute(this.data.visible),
            hasAccessibility = dataThreshold !== null,
            updateAccessibility = () => {
                const
                    isActive = iSelf === this.menu.iActive,
                    isVisible = new ScreenMatch(dataThreshold).define();

                if (!isActive) {
                    this.toggleAccessibility($box, !isVisible);
                }
            };

        if (hasAccessibility) {
            updateAccessibility();

            window.addEventListener('resize', updateAccessibility);
        }

        return hasAccessibility;
    }

    toggle(index, state = true) {
        const
            action = state ? 'add' : 'remove',
            $btn = this.menu.$btns[index],
            $box = this.menu.$boxes[index];

        [$btn, $box].forEach($el => $el.classList[action](this.class.elActive));

        if ($btn.getAttribute(this.data.view) === 'true') {
            document.body.classList[action](this.class.bodyActive);
        }

        this.toggleAccessibility($box, !state);

        if (!state) {
            index = null;
        }

        return index;
    }

    hide(index) {
        this.toggle(index, false);

        this.menu.iActive = null;
        document.removeEventListener('click', this.fn.hide);

        return index;
    }

    hideOut(e, index) {
        if (e.target.closest(this.selector.box) === null) {
            this.hide(index);
        }

        return index;
    }

    init() {
        this.menu.$btns.forEach(($btn, iSelf) => {
            const
                toggle = () => {
                    if (this.menu.iActive !== iSelf) {
                        this.menu.iActive = this.toggle(iSelf);

                        setTimeout(() => {
                            this.fn.hide = (e) => {
                                return this.hideOut(e, iSelf);
                            };

                            document.addEventListener('click', this.fn.hide);
                        }, 0);
                    }
                };

            $btn.addEventListener('click', toggle);

            this.accessibility(iSelf);
        });
    }
}
