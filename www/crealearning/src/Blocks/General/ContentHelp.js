import React from 'react';
import { withTranslation } from 'react-i18next';

const ContentHelp = ({t, children}) => {
    return (
        <article>
            <h4>{t('_CONTENT')}</h4>
            {children}
        </article>
    );
};

export default withTranslation()(ContentHelp);