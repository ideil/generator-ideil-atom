//# Nav
//
//* atomTODO: update script

import Menu from '@front/class/menu';

const NAV = () => {
    const DropdownList = [
        'menu',
    ];

    let $dropdownList = [];

    for (let i = 0; i < DropdownList.length; i++) {
        let $nav = new Menu(DropdownList[i]).init();

        $dropdownList.push($nav);
    }

    return $dropdownList;
};

NAV();
// console.log(NAV());
