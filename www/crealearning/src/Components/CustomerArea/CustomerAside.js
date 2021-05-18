import React from 'react'

//i18n
import { withTranslation } from 'react-i18next'

//Style
import './CustomerAside.scss'

const CustomerAside = ({email, offer, t}) => {
    return (
        <aside className='welcome__aside'>
            <section>
                <h5>{t('_WELCOME_TITLE')}</h5>
                <span>{email}</span>
                <p>{t('_USER_OFFER')}<strong>{offer}</strong></p>
            </section>
            <a href='https://www.tree-learning.fr/' target='_blank' rel='noopener noreferrer' title={t('_TL_LINK')}>
                <span>{t('_TREE_LEARNING_TEXT')}</span>
            </a>
        </aside>
    );
};

export default withTranslation()(CustomerAside);