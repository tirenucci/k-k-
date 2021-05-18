import React, { Fragment } from 'react'

//i18n
import { withTranslation } from 'react-i18next'

//Component utilitaire
import Button from './../formWidget/Button'

const EOList = ({t, eoThemes, eo, deleteEoTheme}) => {

    return (
        <table className='eo__table'>
            <colgroup>
                <col className='eo__width'/>
                <col/>
                <col className='eo__width'/>
                <col className='eo__width'/>
            </colgroup>
            <thead>
                <tr>
                    <th className='small__view'>{t('_ORDER')}</th>
                    <th>{t('_THEME')}</th>
                    <th>{t('_EO')}</th>
                    <th>{t('_ACTIONS')}</th>
                </tr>
            </thead>
            <tbody>
                {
                eoThemes.map((theme, key) => (
                <tr key={key}>
                    <td className='eo__strong small__view' onClick={() => window.location.pathname = `/EOManager/theme/edit/${theme.id}`}>{theme.position}</td>
                    <td className='eo__strong' onClick={() => window.location.pathname = `/EOManager/theme/edit/${theme.id}`}>{t(theme.title)}</td>
                    <td>
                        <table className='eo__secondTable'>
                            <colgroup>
                                <col/>
                                <col/>
                            </colgroup>
                            <thead>
                                <tr>
                                    <th className='small__view'>{t('_TITLE')}</th>
                                    <th className='small__view'>{t('_URL')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    eo[theme.title] !== undefined ?
                                        eo[theme.title].map((eos, key) => (
                                            <tr key={key} onClick={() => window.location.pathname = '/EOManager/edit/' + eos.id}>
                                                <td>{eos.title}</td>
                                                <td className='small__view'>{eos.url}</td>
                                            </tr>
                                        ))
                                    : 
                                        <Fragment/>
                                }
                            </tbody>
                        </table>
                    </td>
                    <td>
                        <ul>
                            <li>
                                <Button
                                    className='btn-crealist'
                                    buttonTitle='_EO_ADD'
                                    buttonText='_EO_ADD'
                                    onClick={() => window.location.pathname = '/EOManager/newEO/' + theme.title}
                                />
                            </li>
                            <li>
                                <Button
                                    className='btn-crealist btn__delete'
                                    buttonTitle='_DELETE'
                                    buttonType='button'
                                    onClick={(event) => deleteEoTheme(event, theme.id)}
                                />
                            </li>
                        </ul>
                    </td>
                </tr>
                ))
                }
            </tbody>
        </table>
    )
}

export default withTranslation()(EOList)