import React from 'react'
import { useHistory } from 'react-router-dom'

//i18n
import { withTranslation } from 'react-i18next'

//Style
import './CustomerMenu.scss'

const CustomerMenu = ({t, email, offer, changeTabs}) => {
    
    const history = useHistory()
    
    return (
        <ul className='customer-menu'>
            <li className='display-welcome-bloc'>
                <h5>{t('_WELCOME_TITLE')}</h5>
                <span>{email}</span>
                <p className='typeCompte'>{t('_USER_OFFER')}<strong className='open'>{offer}</strong></p>
            </li>
            <li onClick={() => changeTabs('')}>{t('_CUSTOMER_MENU_1')}</li>
            <li onClick={() => changeTabs('offer')}>{t('_CUSTOMER_MENU_2')}</li>
            <li onClick={() => changeTabs('account')}>{t('_CUSTOMER_MENU_3')}</li>
            <li onClick={() => changeTabs('information')}>{t('_CUSTOMER_MENU_4')}</li>
            <li onClick={() => changeTabs('bill')}>{t('_CUSTOMER_MENU_5')}</li>
            <li onClick={() => changeTabs('schedule')}>{t('_CUSTOMER_MENU_6')}</li>
            <li className='display-tl-bloc'>
                <a href='https://www.tree-learning.fr/' className='image-bloc' target='_blank' rel='noopener noreferrer' title={t('_TL_LINK')}>
                    <span>{t('_TREE_LEARNING_TEXT')}</span>
                </a>
            </li>
        </ul>
    );
};

export default withTranslation()(CustomerMenu);