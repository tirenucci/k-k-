import React from 'react'
import { withTranslation } from 'react-i18next'

const TextArea = ({t, text, className, onChange, id, name, rows, cols, value}) => {
    return (
        <textarea
            id={id}
            className={className}
            name={name}
            rows={rows}
            cols={cols}
            value={t(value)}
            onChange={onChange}
        >
            {t(text)}
        </textarea>
    );
};

export default withTranslation()(TextArea)