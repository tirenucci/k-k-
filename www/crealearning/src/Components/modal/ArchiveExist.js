import React from 'react'

import Button from '../formWidget/Button'

//Style
import './Modal.scss'

import { withTranslation } from 'react-i18next'

const ArchiveExist = ({onAnnul, onOk, t}) => {
    return (
        <div className='modal__wrapper'>
            <section className='modal__section'>
                <div className='title'>
                    <h2 className='modal-h2'>{t('_CONFIRMATION')}</h2>
                    <Button 
                        className='close__btn' 
                        buttonTitle='_CLOSE'
                        type='button'
                        onClick={(event) => onAnnul(event)}
                    />
                </div>
                <div className='body'>
                    <p>
                        {t('_ARCHIVE_EXIST')}<br />
                        {t('_DELETE_MESS_2')}
                    </p>
                </div>
                    <hr />
                <ul className='modal-button'>
                    <li>
                        <Button
                            className='orange__btn'
                            buttonType='button'
                            onClick={(event) => onOk(event)}
                            buttonText='_OK'
                            autoFocus
                        />
                    </li>
                    <li>
                        <Button
                            className='grey__btn'
                            buttonType='button'
                            onClick={(event) => onAnnul(event)}
                            buttonText='_CANCEL'
                        />
                    </li>
                </ul>
            </section>
        </div>
    )
}

export default withTranslation()(ArchiveExist)