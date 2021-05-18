import React from 'react'

import CustomerContent from './CustomerContent'

//i18n
import { withTranslation } from 'react-i18next'

const CustomerSchedule = ({t}) => {
    return (
        <CustomerContent
            customerTitle={'_CUSTOMER_TITLE_6'}>
            <p className='customer__help'>{t('_CUSTOMER_SCHEDULE_DESC')}</p>
        </CustomerContent>
    );
};

export default withTranslation()(CustomerSchedule);