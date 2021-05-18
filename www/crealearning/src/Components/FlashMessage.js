import React from 'react'

//i18n
import { withTranslation } from 'react-i18next'

//Style
import './FlashMessage.scss'

const FlashMessage = ({children, messageClass, t}) => {

    return(
        <p className={`flash__message ${messageClass}`}>{t(children)}.</p>
    )
}

export default withTranslation()(FlashMessage)