import React from 'react'
import { withTranslation } from 'react-i18next'

import Button from '../formWidget/Button'

import './Modal.scss'

const DeleteModal = ({onAnnul, onOk, t}) => {
    return (
        <div className='modal__wrapper'>
            <section className='modal__section'>
                <h4>{t('_CONFIRMATION')}</h4>
                <Button 
                    className='close__btn' 
                    buttonTitle='_CLOSE'
                    type='button'
                    onClick={(event) => onAnnul(event)}
                />
                <article>
                    <p>{t('_DELETE_MESS_1')}.</p>
                    <p>{t('_DELETE_MESS_2')}</p>
                </article>
                <ul className='modal__btn__list'>
                    <li>
                        <Button
                            className='orange__btn delete-training'
                            type='submit'
                            buttonText='_OK'
                            onClick={(event) => onOk(event)}
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

export default withTranslation()(DeleteModal)