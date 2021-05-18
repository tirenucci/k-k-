import React from 'react'
import { withTranslation } from 'react-i18next'

import Button from '../formWidget/Button';

import './Modal.scss'

const ContactModal = ({onAnnul, onOk, t}) => {
    return (
        <div className='modal__wrapper'>
            <section className='modal__section'>
                <h4>{t('_CONTACT')}</h4>
                <Button 
                    className='close__btn' 
                    buttonTitle='_CLOSE'
                    type='button'
                    onClick={(event) => onAnnul(event)}
                />
                <article>
                    <p>{t('_CONFIRM_CONTACT')}</p>
                </article>
                <ul className='modal__btn__list'>
                    <li>
                        <Button
                            className='orange__btn'
                            type='submit'
                            buttonText='_CONFIRM'
                            onClick={(event) => onOk(event)}
                            autoFocus
                        />
                    </li>
                    <li>
                        <Button
                            className='grey__btn'
                            type='submit'
                            buttonText='_CANCEL'
                            onClick={(event) => onAnnul(event)}
                        />
                    </li>
                </ul>
            </section>
        </div>
    )
}

export default withTranslation()(ContactModal)