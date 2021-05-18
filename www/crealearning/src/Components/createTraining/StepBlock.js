import React from 'react'

//i18n
import { withTranslation } from 'react-i18next'

//Style
import './StepBlock.scss'

function StepBlock({step, text, stepSentence, children, t, onClick}) {
    return(
        <li className='step'>
            {
                step === '3' ? 
                    <button type='submit' className="step__btn" onClick={(event) => onClick(event)}> 
                        <h3>
                            <span>{step}</span>
                            {t(text)}
                            <p>{t(stepSentence)}</p>
                        </h3>
                    </button> 
                : 
                    <h3>
                        <span>{step}</span>
                        {t(text)}
                        <p>{t(stepSentence)}</p>
                    </h3>
            }
            {children}
        </li>
    )
}

export default withTranslation()(StepBlock)