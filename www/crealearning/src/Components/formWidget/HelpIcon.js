import React from 'react'

//i18n
import { withTranslation } from 'react-i18next'

//Style
import './HelpIcon.scss'

const HelpIcon = ({helpTitle, t}) => {
    return (
        <img className='help__icon' src='/assets/img/skinImport/ico-help.svg' alt={t('_HELP_ICON')} title={t(helpTitle)}/>
    )
}

export default withTranslation()(HelpIcon)