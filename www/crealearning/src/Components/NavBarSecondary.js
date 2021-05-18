import React, {Fragment} from 'react'

//i18n
import { withTranslation } from 'react-i18next'

//Style
import './NavBarSecondary.scss'

const NavBarSecondary = ({tabs, evenement, t, className, variable}) => {

    const changeTab = (event, key) => {
        let activTab = document.getElementsByClassName('actif')
        let tabs = document.getElementsByClassName('tab__link')
        activTab[0].classList.remove('actif')
        tabs[key].classList.add('actif')
        if (evenement !== undefined)
        {
            if (activTab[0].id !== undefined && activTab[0].id !== ''){
                evenement(activTab[0].id)
            } else {
                evenement(activTab[0].innerText)
            }
        }
    }

    return (
        tabs !== undefined ?
            <ul className={className}>
                {
                    tabs.map((tab, key) => (
                        <li key={key} className={tab.class} id={tab.type} onClick={(event, k) => changeTab(event, key)}>
                            {
                                tab.variable !== undefined ?
                                <a href={tab.link}>{t(tab.text) + ' ' + tab.variable.replace('***', variable)}</a>
                                :

                                <a href={tab.link}>{t(tab.text)}</a>
                            }
                        </li>
                    ))
                }
            </ul> 
        : 
            <Fragment/>
    )
}

export default withTranslation()(NavBarSecondary)