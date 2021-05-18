import React from 'react'

//i18n
import { withTranslation } from 'react-i18next'

//Style 
import './HomeBlock.scss'

//On passe en props les différents éléments qu'on veut moduler + la traduction avec t
function HomeBlock({blockType, link, textLink, spanText, t}) {
    return(
        <li className={'home__bubble ' + blockType}>
            <p className={'home__btn__' + blockType}>
                <a id={blockType} href={link}>
                    {t(textLink)}
                    <br></br>
                    <span>{t(spanText)}</span>
                </a>
            </p>
        </li>
    )
}

export default withTranslation()(HomeBlock);