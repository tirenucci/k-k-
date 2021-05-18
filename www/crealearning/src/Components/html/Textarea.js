import React from 'react'

import {withTranslation} from 'react-i18next'

const Textarea = ({valueTranslate, value, t, classname, name, size, placeHolder, onChange}) => {
    return (
        <textarea value={t(valueTranslate) + value} placeholder={t(placeHolder)} className={classname} size={size} name={name} onChange={(event) => onChange(event)}></textarea>
    )
}

export default withTranslation()(Textarea)