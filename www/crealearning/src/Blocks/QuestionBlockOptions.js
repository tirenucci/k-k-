import React, {Fragment} from 'react'

//i18n
import { withTranslation } from 'react-i18next'

//Utilitaire
import Fields from '../Components/formWidget/Fields'

const QuestionBlockOptions = ({question_score ,changeNote, t}) => {
    return (
        <Fragment>
            <h6 className='grey__label'>{t('_QUIZ_OPTIONS')}</h6>
            <Fields
                liClass='option-element'
                htmlFor='points' 
                text='_QUIZ_POINTS'
                value={question_score} onChange={(event) => changeNote(event)}
            />
            <p className='score'>{question_score}{t('_QUIZ_TOTAL')}</p>
        </Fragment>
    )
}

export default withTranslation()(QuestionBlockOptions)