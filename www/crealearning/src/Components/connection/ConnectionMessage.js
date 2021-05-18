import React from 'react'

// Fichier style sous Connection.scss

//i18n
import { withTranslation } from 'react-i18next'

const ConnectionMessage = ({className, message, t, redirectMessage}) => {
    return(
        <p className={className}>{t(message)}
            <br/>
            <a href='/'>{t(redirectMessage)}</a>
        </p>
    )
}

export default withTranslation()(ConnectionMessage)