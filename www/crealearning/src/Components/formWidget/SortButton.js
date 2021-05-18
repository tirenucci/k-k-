import React from 'react'

//i18n
import { withTranslation } from 'react-i18next'

import './Button.scss'

const SortButton = ({t, onClick}) => {
    return (
        <button 
            className='sortable'
            type='button'
            title={t('_SORT')}
            onClick={(event) => onClick(event)}>
        </button>
    );
};

export default withTranslation()(SortButton)