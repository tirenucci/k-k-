import React from 'react'

//i18n
import { withTranslation } from 'react-i18next'

//Style
import '../Components/Tool.scss'

function Tool ({type, link, title, text, target, rel, onClick, t}) {
    return (
        <li className={'btn__'+ type}>
            {
                link ?
                <a href={link} title={t(title)} target={target} rel={rel}>
                    {t(text)}
                </a>
                :
                <span title={t(title)} target={target} onClick={onClick}>
                    {t(text)}
                </span>
            }
        </li>
    )
}


export default withTranslation()(Tool)