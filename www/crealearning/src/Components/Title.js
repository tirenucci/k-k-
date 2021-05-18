
//Component stateless représentant le bandeau gris avec le texte en vert

import React from 'react'

//i18n
import { withTranslation } from 'react-i18next'

//Style
import '../Components/Title.scss'

const Title = ({additionalClass, text, value, t}) => {
    return (
        <h2 className={`secondary__title ${additionalClass !== undefined ? additionalClass : ''}`}>{t(text, {trainingName:value})}</h2>
    )
}

export default withTranslation()(Title)