import React from 'react'
import './Modal.scss'
import { withTranslation } from 'react-i18next'
import Button from '../formWidget/Button'

const EditElement = ({onAnnul, onOk, t, value, change}) => {
    return (
        <div className='modal__wrapper'>
            <section className='modal__section'>
                <article className='title'>
                    <h2 className='modal-h2'>{t('_EDIT_ELEM')}</h2>
                    <Button
                        className='close__btn'
                        buttonTitle='_CLOSE'
                        buttonType='button'
                        onClick={() => onAnnul(t('_CANCEL_MESSAGE'))}
                    />
                </article>
                <article className='body'>
                    <textarea rows='1' style={{width: '100%'}} value={value} onChange={(event) => change(event)}>
                    </textarea>
                </article>
                    <hr />
                <article className='modal-button'>
                    <Button
                        className='orange__btn'
                        buttonType='button'
                        onClick={(event) => onOk(event)}
                        buttonText='_OK'
                    />
                    <Button
                        className='grey__btn'
                        buttonType='button'
                        onClick={(event) => onAnnul(event)}
                        buttonText='_CANCEL'
                    />
                </article>
            </section>
        </div>
    )
}

export default withTranslation()(EditElement)