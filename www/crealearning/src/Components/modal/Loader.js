import React from 'react'

//i18n
import { withTranslation } from 'react-i18next'

//Style
import './Modal.scss'

const Loader = ({t}) => {
    return (
        <div className='modal__wrapper'>
            <section className='modal__section loader'>
                <h4>{t('_LOADER')}</h4>
                <p>{t('_WAIT')}...</p>
            </section>
        </div>
    );
};

export default withTranslation()(Loader)