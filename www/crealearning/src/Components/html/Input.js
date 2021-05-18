import React from 'react'

import {withTranslation} from 'react-i18next'

const Input = ({valueTranslate, value, t, classname, name, size, placeHolder, onChange}) => {
    return (
        <input value={t(valueTranslate) + value} placeholder={t(placeHolder)} className={classname} size={size} name={name} onChange={(event) => onChange(event)} />
    )
}

export default withTranslation()(Input)