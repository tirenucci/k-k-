import React from 'react';

//I18n
import { withTranslation } from 'react-i18next'

//General Componenents
import Button from '../formWidget/Button'

//Style
import './Modal.scss'


const ModalSubscriber = ({t, onClose, bkgd, modalTitle, children}) => {
    return (
         <div className='modal__wrapper'>
            <section className={`modal__section subscribe ${bkgd}`}>
                <h4>{t(modalTitle)}</h4>
                <Button 
                    className='close__btn' 
                    buttonTitle='_CLOSE'
                    type='button'
                    onClick={() => onClose()}
                />
                <article>
                {children}
                <Button
                    className='subscribe__btn'
                    buttonType='button'
                    buttonText='_BTN_SUBSCRIBE'
                    buttonTitle='_BTN_SUBSCRIBE_OFFER'
                    onClick={() => window.open('https://open.crea-learning.com/index.php#four', '_blank')}
                />
                </article>
            </section>
        </div>
    );
};

export default withTranslation()(ModalSubscriber);