import React, {Fragment} from 'react'

//i18n
import { withTranslation } from 'react-i18next'

//Utilitaire
import Image from '../Image'

//Style
import './LangSelector.scss'

const LangSelector = ({t, lang, handleClick}) => {
    return (
        <section className='preview__lang cle-block-box cle-block-title'>
            {
                lang !== undefined ?
                    <Fragment>
                        <h2>{t('_LANG_SELECTOR')}</h2>
                        <ul>
                            {
                                lang.map((l, key) => (
                                    <li key={key}>
                                        <button onClick={(name) => handleClick(l.iso_code_6391)}>
                                            <Image src={`/assets/img/flag/${l.iso_code_6391}-flag-big.png`} alt='_FLAG' figcaptionText={l.label_fr} onClick={(name) => handleClick(l.iso_code_6391)}/>
                                        </button>
                                    </li>
                                ))
                            }
                        </ul>
                    </Fragment>
                :
                    <Fragment />
            }
        </section>
    )
}

export default withTranslation()(LangSelector)