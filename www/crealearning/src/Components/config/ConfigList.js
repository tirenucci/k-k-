import React, { Fragment } from 'react'

//i18n
import { withTranslation } from 'react-i18next'

//Utilitaire
import Button from '../formWidget/Button'

//Style
import './ConfigList.scss'

const ConfigList = ({t, config, handleChange, save}) => {
    return (
        config !== undefined ?
            <section className='config-section'>
                <table className='config-table'>
                    <caption>{t('_CONFIG_PARAMETERS')}</caption>
                    <colgroup>
                        <col/>
                        <col/>
                    </colgroup>
                    <thead>
                        <tr>
                            <th>{t('_CONFIG_DESCRIPTION')}</th>
                            <th>{t('_CONFIG_VALUE')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{t('_CONFIG_OPEN')}</td>
                            <td>
                                <label htmlFor='open_crea'>{t('_CONFIG_OPEN')}</label>
                                <select name='open_crea' id='open_crea' defaultValue={config.open_crea} onChange={(event) => handleChange(event)}>
                                    <option value={false}>{t('_NO')}</option>
                                    <option value={true}>{t('_YES')}</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>{t('_CONFIG_SHARE_MAIL')}</td>
                            <td>
                                <label htmlFor='share_mail'>{t('_CONFIG_SHARE_MAIL')}</label>
                                <input type='text' name='share_mail' value={config.share_mail} onChange={(event) => handleChange(event)}/>
                            </td>
                        </tr>
                        <tr>
                            <td>{t('_CONFIG_SCORM_EXPORT')}</td>
                            <td>
                                <label htmlFor='monograin_scorm'>{t('_CONFIG_SCORM_EXPORT')}</label>
                                <select name='monograin_scorm' id='monograin_scorm' value={config.monograin_scorm} onChange={(event) => handleChange(event)}>
                                    <option value={false}>{t('_NO')}</option>
                                    <option value={true}>{t('_YES')}</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>{t('_LINK_SOFT_AGORA_SMART')}</td>
                            <td>
                                <label htmlFor='agora_smart'>{t('_LINK_SOFT_AGORA_SMART')}</label>
                                <input type='text' name='agora_smart' value={config.agora_smart} onChange={(event) => handleChange(event)}/>
                            </td>
                        </tr>
                        <tr>
                            <td>{t('_QUOTA')}</td>
                            <td>
                                <label htmlFor='quota'>{t('_QUOTA')}</label>
                                <input type='text' name='quota' value={config.quota} onChange={(event) => handleChange(event)}/>
                            </td>
                        </tr>
                        <tr>
                            <td>{t('_CONFIG_DEFAULT_TEMPLATE')}</td>
                            <td>
                                <label htmlFor='skin_default'>{t('_CONFIG_DEFAULT_TEMPLATE')}</label>
                                <input type='text' name='skin_default' value={config.skin_default} onChange={(event) => handleChange(event)}/>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <article>
                    <Button
                        className='orange__btn'
                        buttonType='button'
                        buttonTitle='_SAVE'
                        buttonText='_SAVE'
                        onClick={() => save()}
                    />
                </article>
            </section>
        :
            <Fragment />
    );
};

export default withTranslation()(ConfigList)