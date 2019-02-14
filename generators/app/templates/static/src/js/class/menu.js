//# Menu
//
//*

import ClosestIndex from '@front/class/closest-index';

export default class Menu {
    constructor(id) {
        this.id = id;
    }

    init() {
        const
            Class = {
                active: 'c-' + this.id + '-active',
            },
            Selector = {
                btn: '.js-' + this.id + '-btn',
                box: '.js-' + this.id + '-box',
            },
            Attribute = {
                wrap: 'data-menu-body',
            },
            $btns = document.querySelectorAll(Selector.btn),
            $boxes = document.querySelectorAll(Selector.box);

        function menuClick($btn) {
            const
                index = Array.from($btns).indexOf($btn),
                wrap = $btn.getAttribute(Attribute.wrap),
                $box = $boxes[index],
                isBoxVisible = $btn.getAttribute('data-visible') === 'true';

            let $wrap = $box,
                $wrapBtns,
                isActive;

            if (wrap !== null) {
                $wrap = document.body;

                if (wrap.length) {
                    $wrapBtns =
                        document.querySelectorAll(
                            Selector.btn +
                            '[' +
                            Attribute.wrap +
                            '="' +
                            wrap +
                            '"]'
                        );

                    $wrap =
                        document.querySelectorAll(wrap)[
                            Array.from($wrapBtns).indexOf($btn)
                        ];
                }
            }

            isActive = $wrap.classList.contains(Class.active);

            function hide(e) {
                const
                    target = e.target,
                    isClosestBox =
                        e ?
                        new ClosestIndex(target, Selector.box, index)
                            .check() :
                        false,
                    isClosestBtn =
                        e ?
                        new ClosestIndex(target, Selector.btn, index)
                            .check() :
                        false;

                if (!isClosestBox || isClosestBtn) {
                    document.removeEventListener(
                        'click',
                        hide,
                        false
                    );

                    $wrap.classList.remove(Class.active);

                    if (!isBoxVisible) {
                        $box.setAttribute('aria-hidden', true);
                    }
                }
            }

            function show() {
                $wrap.classList.add(Class.active);

                $box.removeAttribute('aria-hidden');
            }

            if (!isActive) {
                show();

                setTimeout(() => {
                    document.addEventListener(
                        'click',
                        hide,
                        false
                    );
                }, 0);
            }
        }

        $btns.forEach(($btn) => {
            $btn.addEventListener('click', () => {
                menuClick($btn);
            }, false);
        });

        return $btns;
    }
}
