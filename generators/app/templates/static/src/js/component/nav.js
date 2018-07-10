//# Nav
//
//*


import Toggle from '@front/class/toggle';

const NAV = () => {
    const Navs = [
        'nav',
        'search'
    ];

    const Focus = 'js-search-input';

    let $btns = [];

    for (let i = 0; i < Navs.length; i++) {
        let $btn = document.getElementsByClassName('js-' + Navs[i] + '-btn')[0];

        if (typeof $btn !== 'undefined') {
            new Toggle(
                $btn,
                document.body,
                'v-' + Navs[i] + '-shown'
            ).init((() => {
                let $input = document.getElementsByClassName(Focus)[0];

                if (typeof $input !== 'undefined') {
                    $input.focus();
                }
            }));
        }

        $btns.push($btn);
    }

    return $btns;
};

NAV();
// console.log(NAV());
