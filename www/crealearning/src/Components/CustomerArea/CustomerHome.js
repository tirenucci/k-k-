import React from 'react';
import CustomerContent from './CustomerContent';
import { withTranslation } from 'react-i18next';

const CustomerHome = ({t}) => {
    return (
         <CustomerContent
            customerTitle={'_CUSTOMER_TITLE_1'}>
            <ul>
                <li>{t('_CUSTOMER_HOME_1')}</li>
                <li>{t('_CUSTOMER_HOME_2')}</li>
                <li>{t('_CUSTOMER_HOME_3')}</li>
                <li>{t('_CUSTOMER_HOME_4')}</li>
            </ul>
        </CustomerContent>
    );
};

export default withTranslation()(CustomerHome);