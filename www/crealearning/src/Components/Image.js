import React, { Fragment } from 'react'

import { withTranslation } from 'react-i18next'

const Image = ({t, className, src, alt, hideFigcaption, figcaptionText}) => {
    return (
        <Fragment>
        {
            figcaptionText !== undefined ?
            <figure>
                <img className={className} src={src} alt={t(alt)}/>
                <figcaption style={{display: hideFigcaption ? 'none' : 'block'}}>{t(figcaptionText)}</figcaption>
            </figure>
            :
            <img className={className} src={src} alt={t(alt)}/>
        }
        </Fragment>
    )
}

export default withTranslation()(Image)