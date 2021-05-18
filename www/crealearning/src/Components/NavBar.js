import React, { Fragment } from 'react'

import Image from '../Components/Image'

//i18n
import { withTranslation } from 'react-i18next'

//Style
import './NavBar.scss'

function NavBar({t, is_logipro, reverseAccount}) {
    return(
        <Fragment>
            <section className='nav__wrapper'> 
                <h1>
                    <a href='/' id='home' title={t('_HOME')}>
                        <Image src='/assets/img/header/logo.png' alt='_NAV_LOGO'/>
                    </a>
                </h1>
                <nav id='nav' >
                    <ul>
                        <li className='nav__btn'>
                            <span>Menu</span>
                            <ul>
                                <li>
                                    <a href='/'>{t('_HOME')}</a>
                                </li>
                                <li>
                                    <a href='/create'>{t('_NAV_CREATE')}</a>
                                </li>
                                <li>
                                    <a href='/trainings'>{t('_NAV_LIST')}</a>
                                </li>
                                {
                                    is_logipro ?
                                        <li className={'reverse__account'}>
                                            <a href='#' onClick={() => reverseAccount()}>{t('_REVERSE_ACCOUNT')}</a>
                                        </li>
                                    :
                                        <Fragment />
                                }
                            </ul>
                        </li>
                    </ul>
                </nav>
            </section>
        </Fragment>
    )
}

export default withTranslation()(NavBar)