import React from 'react'

//i18n
import { withTranslation } from 'react-i18next'

//Utilitaire
import Button from '../formWidget/Button'

//Style
import './Modal.scss'

const SkinExist = ({onAnnul, onOk, t}) => {
    return (
        <div className='modal__wrapper'>
            <section className='modal__section'>
                <article className='title'>
                    <h2 className='modal-h2'>{t('_CONFIRMATION')}</h2>
                    <button onClick={() => onAnnul()} className='close__btn'></button>
                </article>
                <article className='body'>
                    <p>
                        {t('_SKIN_EXIST')}<br />
                        {t('_DELETE_MESS_2')}
                    </p>
                </article>
                    <hr />
                <ul className='modal-button'>
                    <li>
                        <Button
                            className='orange__btn'
                            buttonText='_OK'
                            onClick={() => onOk()}
                        />
                    </li>
                    <li>
                        <Button
                            className='grey__btn'
                            buttonText='_CANCEL'
                            onClick={() => onAnnul()}
                        />
                    </li>
                </ul>
            </section>
        </div>
    )
}

export default withTranslation()(SkinExist)