import React from 'react'
import { withTranslation } from 'react-i18next'

import Button from '../formWidget/Button'

import './Modal.scss'

const FormulaModal = ({onAnnul, onOk, t, code}) => {
    return (
        <div className='modal__wrapper'>
            <section className='modal__section'>
                <h4>{t('_FORMULA_EDIT')}</h4>
                <Button 
                    className='close__btn' 
                    buttonTitle='_CLOSE'
                    type='button'
                    onClick={() => onAnnul(t('_CANCEL_MESSAGE'))}
                />
                <article>
                    <textarea className='mathdoxformula' id='mathdoxtextarea' rows='10' cols='80' defaultValue={code}></textarea>
                </article>
                <ul className='modal__btn__list'>
                    <li>
                        <Button
                            className='orange__btn'
                            type='button'
                            buttonText='Ok'
                            onClick={() => onOk(t('_FORMULA_ERROR'))}
                        />
                    </li>
                    <li>
                        <Button
                            className='grey__btn'
                            type='button'
                            buttonText='_CANCEL'
                            onClick={() => onAnnul(t('_CANCEL_MESSAGE'))}
                        />
                    </li>
                </ul>
            </section>
        </div>
    )
}

export default withTranslation()(FormulaModal)