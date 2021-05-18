import React from 'react'

//i18n
import { withTranslation } from 'react-i18next'

//Utilitaires
import Fields from '../formWidget/Fields'
import Button from '../formWidget/Button'

import './TrainingComplements.scss'

const TrainingComplements = ({training, handleChange, handleSubmit, t}) => {
    return (
        <form className='complements__section'>
            <fieldset>
            <legend>{t('_COMPLEMENTS')}</legend>
                <ul>
                    <Fields htmlFor='goal' text='_OBJECTIVES' textarea={true} value={training.objective} onChange={(event, field) => handleChange(event, 'objective')}/>
                    <Fields htmlFor='educational' text='_EDUC_MEANS' textarea={true} value={training.educ_means} onChange={(event, field) => handleChange(event, 'educ_means')}/>
                    <Fields htmlFor='technical' text='_TECH_MEANS' textarea={true} value={training.tech_means} onChange={(event, field) => handleChange(event, 'tech_means')}/>
                    <Fields htmlFor='supervision' text='_SUPERVISION' textarea={true} value={training.management} onChange={(event, field) => handleChange(event, 'management')}/>
                    <Fields htmlFor='evaluation' text='_EVALUATION' textarea={true} value={training.achievements} onChange={(event, field) => handleChange(event, 'achievements')}/>
                    <Fields htmlFor='public' text='_TARGET' textarea={true} value={training.public_target} onChange={(event, field) => handleChange(event, 'public_target')}/>
                    <Fields htmlFor='prerequisite' text='_PREREQUISITE' textarea={true} value={training.prerequisite} onChange={(event, field) => handleChange(event, 'prerequisite')}/>
                </ul>
            </fieldset>
            <ul className='btn__list inherit'>
                <li>
                    <Button 
                        className='orange__btn' 
                        type='submit' 
                        buttonText='_SAVE' 
                        onClick={() => handleSubmit()} 
                    />
                </li>
            </ul>    
        </form>
    )
}

export default withTranslation()(TrainingComplements)