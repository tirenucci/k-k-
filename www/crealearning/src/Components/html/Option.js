import React from 'react'

import {withTranslation} from 'react-i18next'

const Option = ({value, t, title, textTranslate, text = undefined}) => {
    return (
        <option value={value} title={t(title)}>{t(textTranslate)} { text === undefined ? '' : text }</option>
    )
}

export default withTranslation()(Option)