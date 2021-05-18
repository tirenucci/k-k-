import React from 'react'

//i18n
import { withTranslation } from 'react-i18next'

//Style
import './../Components/formWidget/Button.scss'

const DeleteButton = ({onDelete, deleteText, t}) => {

    return (
        <p className='delete__btn__section'>
            <button className='delete__btn' onClick={(event) => onDelete(event)}>{t(deleteText)}</button>
        </p>
    )
}

export default withTranslation()(DeleteButton)