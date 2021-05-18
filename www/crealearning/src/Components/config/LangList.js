import React from 'react'

//i18n
import { withTranslation } from 'react-i18next'

//Component utilitaire
import HelpIcon from '../formWidget/HelpIcon'

//Style
import './LangList.scss'
import Image from "../Image";

const LangList = ({t, languages, editLanguage}) => {

    return (
        <table className='lang__list'>
            <colgroup>
                <col/>
                <col/>
                <col/>
                <col/>
                <col/>
                <col/>
                <col/>
            </colgroup>
            <thead>
                <tr>
                    <th className='large__view'>{t('_ORDER')}</th>
                    <th className='small__view'>{t('_LANG_NAME_TRANS')}</th>
                    <th className='small__view'>{t('_LANG_NATIVE')}</th>
                    <th className='medium__view'>{t('_LANG_ISO_1')}</th>
                    <th className='medium__view'>{t('_LANG_ISO_2')}</th>
                    <th>{t('_LANG_FLAG')}</th>
                    <th className='large__view'>{t('_LANG_CODE')}</th>
                    <th>{t('_LANG_STATE')}</th>
                </tr>
            </thead>
            <tbody>
            {
                languages.map((language, key) => (

                    <tr key={key} onClick={(event) => editLanguage(event, language)}>
                    <td className='large__view'>{language.position}</td>
                    <td className='small__view'>{t(language.label_fr)}</td>
                    <td className='small__view'>{language.label}</td>
                    <td className='medium__view'>{language.iso_code_6393}</td>
                    <td className='medium__view'>{language.iso_code_6391}</td>
                    <td>
                        <img src={`/assets/img/flag/${language.image_name}`} alt={t('_LANG_FLAG')}/>
                    </td>
                    <td className='large__view'>{language.encode}</td>
                    {
                        language.active === true ?
                        <td>
                            {t('_ACTIVE')}
                        </td>
                        :
                        <td>
                            {t('_INACTIVE')}
                            <HelpIcon
                                helpTitle={t('_LANG_HELP')}
                            />
                        </td>
                    }
                </tr>
                ))
            }
            </tbody>
        </table>
    )
}

export default withTranslation()(LangList)