import React, { Fragment } from 'react'

//i18n
import { withTranslation } from 'react-i18next'

//Style
import './TrainingDetails.scss'

const TrainingDetails = ({t, training}) => {
    return (
        <ul className='training__details'>
            {
                // si version ou habillage déjà existant la class est red sinon grey
            }
            <li>
                {t('_IMPORT_NAME')}<span className='grey'>{training.name}</span>
            </li>
            <li>
                {t('_IMPORT_VERSION')}<span className='red'>{training.version} {training.module_version !== null ? ' - ' + t('_ACTUEL_VERSION') + training.module_version : <Fragment />}</span>
            </li>
            <li>
                {t('_IMPORT_SKIN_2')}<span className='red'>{training.module_skin} {training.module_skin_version !== null ? ' - ' + t('_ACTUEL_VERSION') + training.module_skin_version : <Fragment />}</span>
            </li>
            <li>
                {t('_IMPORT_DESC')}<span className='grey'>{training.description}</span>
            </li>
            <li>
                {t('_IMPORT_LANG')}<span className='grey'>{training.language}</span>
            </li>
        </ul>
    );
};

export default withTranslation()(TrainingDetails);