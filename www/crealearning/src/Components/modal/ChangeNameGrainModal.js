import React from 'react'
import { withTranslation } from 'react-i18next'

import Button from '../formWidget/Button'

import './Modal.scss'

const DeleteModal = ({onAnnul, onOk, t, name, changeHandle}) => {
    return (
        <div className='modal__wrapper'>
            <section className='modal__section change__grain_name'>
                <h4>{t('_CHANGE_NAME_GRAIN')}</h4>
                <Button 
                    className='close__btn' 
                    buttonTitle='_CLOSE'
                    type='button'
                    onClick={(event) => onAnnul(event)}
                />
                <article>
                    <input value={name} type="text" className={"input__change__grain_name"} maxLength={100} onChange={(event) => changeHandle(event)} />
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