import React from 'react'

import Button from '../formWidget/Button'

//i18n
import { withTranslation } from 'react-i18next'

//Style
import './Modal.scss'

const FilenameModal = ({onAnnul, onOk, t, name, change}) => {
    return (
        <div className='modal__wrapper'>
            <section className='modal__section'>
                <article className='title'>
                    <h4 className='modal-h2'>Nom du fichier (sans extension)</h4>
                    <Button 
                        className='close__btn' 
                        buttonTitle='_CLOSE'
                        type='button'
                        onClick={() => onAnnul(t('_CANCEL_MESSAGE'))}
                    />
                </article>
                <article className='body'>
                    <input rows='1' style={{width: "100%"}} value={name} onChange={(event) => change(event)} />
                </article>
                    <hr />
                <article className='modal-button'>
                    <Button
                        className='orange__btn'
                        buttonType='button'
                        onClick={() => onOk(t('_FORMULA_ERROR'))}
                        buttonText='_OK'
                        autoFocus
                    />
                    <Button
                        className='grey__btn'
                        buttonType='button'
                        onClick={() => onAnnul(t('_CANCEL_MESSAGE'))}
                        buttonText='_CANCEL'
                    />
                </article>
            </section>
        </div>
    )
}

export default withTranslation()(FilenameModal)