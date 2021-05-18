import React, {Fragment} from 'react'
import { withTranslation } from 'react-i18next'
import Button from '../formWidget/Button'

const DeleteForm = ({onClick, t}) => {
    return(
        <Fragment>
            <section className='delete__btn__section'>
                <p>{t('_DELETE_TRAINING_MESS')}</p>
                <Button className='delete__btn' buttonText={t('_DELETE')} onClick={() => onClick()} />
            </section>
        </Fragment>
    )
}

export default withTranslation()(DeleteForm)