import React from 'react'

import './CustomerContent.scss'
import { withTranslation } from 'react-i18next'

const CustomerContent = ({customerTitle, children, t}) => {
    return (
        <section className='customer-content'>
            <h3>{t(customerTitle)}</h3>
            {children}
        </section>
    );
};

export default withTranslation()(CustomerContent);