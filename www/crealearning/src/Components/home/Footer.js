/**
 * Ne jamais mettre id="footer" car utilisé ailleurs pour l'habillage des modules
 * La balise small indique de façon explicite qu'il faut que le texte soit écrit petit
 */

import React from 'react'

//Style
import './Footer.scss'

const Footer = () => {
    return (
        <footer className='footer'>
            <small>Version %VERSION%</small>
        </footer>
    );
};

export default Footer;