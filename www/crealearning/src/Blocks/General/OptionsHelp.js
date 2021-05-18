import React from 'react'

//i18n

import { withTranslation } from 'react-i18next'

const OptionsHelp = ({t, children}) => {
    return(
        <article>
            <h4>{t('_OPTIONS')}</h4>
            {children}
        </article>
    )
}

export default withTranslation()(OptionsHelp)