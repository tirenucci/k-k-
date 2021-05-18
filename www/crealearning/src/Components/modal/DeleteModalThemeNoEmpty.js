import React from 'react'

//i18n
import { withTranslation } from 'react-i18next'

import Button from '../formWidget/Button'

//Style
import './Modal.scss'

const DeleteModalThemeNoEmpty = ({onAnnul, t}) => {
    return (
        <div className='modal__wrapper'>
            <section className='modal__section'>
                <h4>{t('_ERROR')}</h4>
                <Button 
                    className='close__btn' 
                    buttonTitle='_CLOSE'
                    type='button'
                    onClick={(event) => onAnnul(event)}
                />
                <article>
                    <p>
                        {t('_THEME_WITH_SKIN_ERROR')}.
                    </p>
                </article>
                <ul className='modal__btn__list'>
                    <li>
                        <Button
                            className='orange__btn'
                            type='button'
                            buttonText='_OK'
                            onClick={(event) => onAnnul(event)}
                        />
                    </li>
                </ul>
            </section>
        </div>
    )
}

export default withTranslation()(DeleteModalThemeNoEmpty)