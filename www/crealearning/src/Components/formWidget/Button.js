import React from 'react';

//i18n
import { withTranslation } from 'react-i18next'

//Style
import './Button.scss'

const Button = ({className, buttonType, buttonTitle, onSubmit, onClick, buttonText, t, disable = false}) => {
    return (
        <button 
            className={className} 
            type={buttonType}
            disabled={disable}
            title={t(buttonTitle)}
            onSubmit={() => onSubmit()}
            onClick={(event) => onClick(event)}>
            {t(buttonText)}
        </button>
    )
}

export default withTranslation()(Button)