import React from 'react'

//i18n
import { withTranslation } from 'react-i18next'

//Utilitaire
import Button from '../formWidget/Button'

//Style
import './Modal.scss'
import './ConnectionModal.scss'

const ConnectionModal = ({onOk, t}) => {
    return (
        <div className='modal__wrapper new__version'>
            <section className='modal__section'>
                <h4>{t('_NEW_VERSION')}</h4>
                <div className='planet'>
                    <div className='white__circle'></div>
                    <div className='circle__1'></div>
                    <div className='circle__2'></div>
                    <div className='circle__3'></div>
                    <div className='circle__4'></div>
                    <div className='circle__5'></div>
                </div>
                <article>
                    <div className='rocket'>
                        <div className='rocket-body'>
                            <div className='body'></div>
                            <div className='fin fin-left'></div>
                            <div className='fin fin-right'></div>
                            <div className='window'></div>
                        </div>
                        <div className='exhaust-flame'></div>
                        <ul className='exhaust-fumes'>
                            <li></li>
                            <li></li>
                            <li></li>
                            <li></li>
                            <li></li>
                            <li></li>
                            <li></li>
                            <li></li>
                            <li></li>
                        </ul>
                    </div>
                    <p>{t('_NEW_VERSION_EXPLAIN')}</p>
                    <p className='bold'><b>Pour y accéder, il vous suffit de définir votre mot de passe (le même ou un nouveau).</b></p>
                    <p>Bonnes créations !</p>
                </article>
                <Button
                    className='orange__btn'
                    type='submit'
                    buttonText='_OK'
                    onClick={(event) => onOk(event)}
                />
            </section>
        </div>
    )
}

export default withTranslation()(ConnectionModal)