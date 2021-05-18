import React, { Fragment } from 'react';

//i18n
import { withTranslation } from 'react-i18next';

//Style
import './ButtonPreview.scss'

const Button = ({iText, align,href, className, buttonType, buttonTitle, onSubmit, onClick, buttonText, t, disable = false}) => {
    return (
        <button
            className={className} 
            type={buttonType}
            disabled={disable}
            title={t(buttonTitle)}
            onSubmit={() => onSubmit()}
            onClick={() => window.location.pathname = href}>
            {
                align === 'left' ?
                <i className='material-icons'>{iText}</i>
                :
                <Fragment />
            }
            {t(buttonText)}
            {
                align === 'right' ?
                <i className='material-icons'>{iText}</i>
                :
                <Fragment />
            }
        </button>
    );
};

export default withTranslation()(Button);