import React, { Fragment } from 'react'

//i18n
import { withTranslation, Translation } from 'react-i18next'

//Utilitaires
import Button from '../formWidget/Button'
import Fields from '../formWidget/Fields'

//Style
import './ExportTraining.scss'

const ExportTraining = ({t, id, format, handleChangeState, grain, createArchive, generateArchive, generatePDF, files, handlePdfOptionChange, pdfOption, agora, formatOptions}) => {
    return (
        <form className='export__section' onSubmit={(event) => event.preventDefault()}>
            <fieldset>
                <legend>{t('_EXPORT')}</legend>
                <ul>
                    <Fields
                       htmlFor='format' 
                       text='_FORMAT'
                       onChange={(event, field) => handleChangeState(event, 'format')} 
                       value={format}
                       options={formatOptions}
                    />
                    {
                    format === 'pdf' ?
                        <Fragment>
                            <Fields
                                htmlFor='PDFlanguage' 
                                text='_EXPORT_PDF_LANG'
                            >
                                <select name='PDFlanguage' id='PDFlanguage'>
                                    {
                                        // A compléter boucler sur le nombre de langues disponibles
                                    }
                                    <option value='fr' defaultValue>Français</option>
                                </select>
                            </Fields>
                            <li>
                                <p>{t('_EXPORT_PDF_GRAIN')} :</p>
                                <ul className='pdf-grains-list'>
                                    {
                                    //Ajouté la logique de checkbox
                                    }
                                    {
                                        grain.map((g, key) => (
                                            <li key={key}>
                                                <label htmlFor='selected-grains'>{g.name}</label>
                                                <input type='checkbox' name='selected-grains' checked onChange={() => {}}/>
                                            </li>
                                        ))
                                    }
                                </ul>
                            </li>
                            <li>
                            <p>{t('_EXPORT_PDF_PARAM')} :</p>
                                <ul className='pdf-options'>
                                    {/*<li>
                                        {t('_EXPORT_PDF_ANSWERS')} :
                                        <input type='radio' name='displayAnswer' id='displayAnswer1' value='true' checked onChange={(event, value, type) => handlePdfOptionChange(event, true, 'displayResponse')}/>
                                        <label htmlFor='displayAnswer'>{t('_YES')}</label>
                                        <input type='radio' name='displayAnswer' id='displayAnswer2' value='false' onChange={(event, value, type) => handlePdfOptionChange(event, false, 'displayResponse')}/>
                                        <label htmlFor='displayAnswer'>{t('_NO')}</label>
                                    </li>*/}
                                    {/*<li>
                                        {t('_EXPORT_PDF_INDEX')} :
                                        <input type='radio' name='autoIndex' id='autoIndex1' value='true' checked onChange={() => {}}/>
                                        <label htmlFor='autoIndex1'>{t('_YES')}</label>
                                        <input type='radio' name='autoIndex' id='autoIndex2' value='false' onChange={() => {}}/>
                                        <label htmlFor='autoIndex2'>{t('_NO')}</label>
                                    </li>*/}
                                    {/*<li>
                                        {t('_EXPORT_PDF_THEME')} :
                                        <input type='radio' name='cover' id='cover1' value='true' checked onChange={(event, value, type) => handlePdfOptionChange(event, true, 'cover')}/>
                                        <label htmlFor='cover'>{t('_YES')}</label>
                                        <input type='radio' name='cover' id='cover2' value='false' onChange={(event, value, type) => handlePdfOptionChange(event, false, 'cover')}/>
                                        <label htmlFor='cover'>{t('_NO')}</label>
                                    </li>*/}
                                    {/*<li>
                                        {t('_EXPORT_PDF_HEADER')} :
                                        <input type='radio' name='header' id='header1' value='true' checked onChange={(event, value, type) => handlePdfOptionChange(event, true, 'header')}/>
                                        <label htmlFor='header'>{t('_YES')}</label>
                                        <input type='radio' name='header' id='header2' value='false' onChange={(event, value, type) => handlePdfOptionChange(event, false, 'header')}/>
                                        <label htmlFor='header'>{t('_NO')}</label>
                                    </li>*/}
                                    <li>
                                        {t('_EXPORT_PDF_FOOTER')} :
                                        <input type='radio' name='footer' id='footer1' value='true' checked onChange={(event, value, type) => handlePdfOptionChange(event, true, 'footer')}/>
                                        <label htmlFor='footer'>{t('_YES')}</label>
                                        <input type='radio' name='footer' id='footer2' value='false' onChange={(event, value, type) => handlePdfOptionChange(event, false, 'footer')}/>
                                        <label htmlFor='footer'>{t('_NO')}</label>
                                    </li>
                                </ul>
                            </li>
                        </Fragment>
                    : 
                        <Fragment />
                    }
                    
                    <li>
                        <p>{t('_EXPORT_LAST')} :&nbsp;
                            {
                                // si jamais exporté alors 'inconnu' sinon afficher la date
                            }
                            <span>{t('_UNKNOWN')}</span>
                            
                        </p>
                    </li>
                    {//Si archive déjà créer cet élément s'affichera + lien dynamique dans le placeholder

                    <Fields
                        liClass='archive-link'
                        htmlFor='archiveLink' 
                        text={format === 'pdf' ? t('_EXPORT_URL_PDF') : t('_EXPORT_URL')}
                        inputType='text' 
                        value={files[format]} 
                        disabled={true}
                    />
                    }
                </ul>
                <ul className='export-btn__list'>
                <li>
                    {//si l'archive n'existe pas sinon remplacer la class par update-btn et le text par : Mettre à jour l'archive
                    }
                    {
                        format === 'pdf' && createArchive[format] === false ?
                        <Button
                            className='archive-btn'
                            type='submit'
                            buttonText='_EXPORT_PDF_CREATE'
                            onClick={(event) => generatePDF(event)}
                        />
                        : format === 'pdf' && createArchive[format] === true ?
                        <Button
                            className='archive-btn'
                            type='submit'
                            buttonText='_EXPORT_PDF_UPDATE'
                            onClick={(event) => generatePDF(event)}
                        />
                        :
                        <Fragment/>
                    }
                    {
                        format === 'scorm' || format === 'monograin' && createArchive[format] === false ?
                        <Button
                            className='archive-btn'
                            type='submit'
                            buttonText='_EXPORT_CREATE'
                            onClick={(event, f) => generateArchive(event, format)}
                        />
                        : format === 'scorm' || format === 'monograin' && createArchive[format] === true ?
                        <Button
                            className='archive-btn'
                            type='submit'
                            buttonText='_EXPORT_UPDATE'
                            onClick={(event, f) => generateArchive(event, format)}
                        />
                        :
                        <Fragment/>
                    }
                </li>
                {
                    ///Si archive créée + le texte dynamique selon le format
                    createArchive[format] === true ?
                    <Fragment>
                        
                    <li>
                        <a href={files[format]} download id='download' target='_blank' rel='noopener noreferrer'>
                            <Translation>
                            {(t) => 
                                <Button
                                    className='dl-btn'
                                    type='submit'
                                    buttonText={t('_EXPORT_DL', {format:format})}
                                    onClick={(event) => document.getElementById('download').click()}
                                />
                            }
                            </Translation>
                        </a>
                    </li>
                    </Fragment>
                    :
                    <Fragment/>
                }
                
                {
                    format === 'pdf' ?
                    <Fragment/>
                    :
                    <li>
                        <Button
                            className='agora-btn'
                            type='submit'
                            buttonTitle='_EXPORT_AGORA_EXPLAIN'
                            buttonText='_EXPORT_SEND_AGORA'
                            onClick={(event) => window.open(agora + 'index.php?action=45&urlExportCrea=' + window.location.protocol + '//' + window.location.hostname + '/training/export/agora/' + id, '_blank')}
                        />
                    </li>
                }
            </ul>
            </fieldset>
        </form>
    )
}

export default withTranslation()(ExportTraining)