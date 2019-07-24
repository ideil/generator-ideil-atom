//# Misc (dev)
//
//*

'use strict';


//## Backend requirement
//
//*

window.App = {
    staticUrl: 'http://localhost:3000/'
};


//## Disable Demo Links Click
//
//*

function disableHashLinks() {
    const
        $links = document.getElementsByTagName('a');

    let
        $linkHash,
        LinksHash = [];

    for (let i = 0; i < $links.length; i++) {
        if ($links[i].getAttribute('href') === '#') {
            $linkHash = $links[i];

            $linkHash.addEventListener('click', (e) => {
                e.preventDefault();

                console.log('link#' + i);
            });

            LinksHash.push($linkHash);
        }
    }

    return LinksHash;
}

disableHashLinks();
