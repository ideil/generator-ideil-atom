//# Nav
//
//* atomTODO: update script

'use strict';

import Menu from '@js/class/menu';

const NAV = () => {
    const
        NavIds = [
            'nav',
        ];

    let Navs = [];

    for (let i = 0; i < NavIds.length; i++) {
        let $nav = new Menu(NavIds[i]).init();

        Navs.push($nav);
    }

    return Navs;
};

// console.log(NAV());
NAV();
