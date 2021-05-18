//Component stateless utilisé dans ShareTraining.js et Preview.js

import React, { Fragment } from 'react'

//Partage réseaux sociaux, pour plus d'infos : https://github.com/nygardk/react-share#readme
import {
    FacebookShareButton,
    LinkedinShareButton,
    TwitterShareButton,
} from 'react-share'

//i18n
import { withTranslation } from 'react-i18next'

//Style
import './ShareTools.scss'

const ShareTools = ({t, shareUrl, quote}) => {
    return (
        <Fragment>
            <li className='share__element' title={t('_SHARE_FB')}>
                <FacebookShareButton
                    url={shareUrl}
                    quote={quote}
                    className='share__btn fb'
                >
                Facebook
                </FacebookShareButton>
            </li>
            <li className='share__element' title={t('_SHARE_LINKEDIN')}>
                <LinkedinShareButton 
                    url={shareUrl}
                    title={quote}
                    summary={'test'}
                    source={'www.crealearning.com'}
                    className='share__btn linkedin'
                >
                LinkedIn
                </LinkedinShareButton>
            </li>
            <li className='share__element' title={t('_SHARE_TWITTER')}>
                <TwitterShareButton
                    url={shareUrl}
                    title={quote}
                    via='test'
                    className='share__btn twitter'
                >
                Twitter
                </TwitterShareButton>
            </li>
        </Fragment>
    )
}

export default withTranslation()(ShareTools)