import React, { Fragment } from 'react'
import { withTranslation } from 'react-i18next'

//Utilitaires
import Button from './../../Components/formWidget/Button'
import Fields from '../../Components/formWidget/Fields'
import Option from '../../Components/html/Option'

//Style
import './ConfigGrain.scss'

const ConfigGrain = ({t, offer, deleteGrain, grain, handleGrainChange, saveGrain, has_question, lang}) => {
    return (
        <form className='config__grain__form' onSubmit={(event) => event.preventDefault()}>
            <ul className='config__list'>
                <Fields
                    htmlFor='name' 
                    text='_GRAIN_NAME'
                    inputType='text' 
                    onChange={(event, target) => handleGrainChange(event, 'name')} 
                    value={grain.name !== undefined ? grain.name['fr'] : ''}
                />
                {
                    //Pour les deux inputs ci-dessous il faut respecter le format 00:00:00 ou les secondes sont acceptées seules et traduites ensuite en 00:00:secondes
                }
                <Fields
                    htmlFor='duration' 
                    text='_DURATION'
                    inputType='number' 
                    onChange={(event, target) => handleGrainChange(event, 'duration')} 
                    value={grain.duration}
                />
                <li>
                    <ul>
                        <Fields
                            liClass='inline__fields'
                            htmlFor='minDuration' 
                            text='_MIN_DURATION'
                            inputType='text' 
                            pattern='^\d+:\d{2}:\d{2}$' 
                            value={grain.minimum_time} 
                            onChange={(event, target) => handleGrainChange(event, 'minimum_time')} 
                            placeholder='Format 00:00:00'
                        />
                        <Fields
                            liClass='inline__fields'
                            htmlFor='maxDuration' 
                            text='_MAX_DURATION'
                            inputType='text' 
                            pattern='^\d+:\d{2}:\d{2}$' 
                            value={grain.maximum_time} 
                            onChange={(event, target) => handleGrainChange(event, 'maximum_time')} 
                            placeholder='Format 00:00:00'
                        />
                    </ul>
                </li>
                <Fields
                    htmlFor='actionTimeLimit'
                    text='_ACTION_TIME_LIMIT'
                    >
                    <select name='actionTimeLimit' id='actionTimeLimit' onChange={(event, target) => handleGrainChange(event, 'action_time_limit')}  value={grain.action_time_limit}>
                        <Option value='exit,no message' textTranslate='_EXIT_NO_MESS'/>
                        <Option value='exit,message' textTranslate='_EXIT_MESS'/>
                        <Option value='no exit,no message' textTranslate='_CONTINUE_NO_MESS'/>
                        <Option value='no exit,message' textTranslate='_CONTINUE_MESS'/>
                    </select>
                </Fields>
                {
                    has_question !== undefined && has_question ?
                        <Fields
                            htmlFor='threshold' 
                            text='_SUCCEED_SCORE'
                            inputType='number' 
                            onChange={(event, target) => handleGrainChange(event, 'threshold')} 
                            value={grain.threshold}
                        />
                    :
                        <Fragment/>
                }
                <li>
                    <ul>
                        <Fields
                            htmlFor='contentValidation' 
                            text='_CONTENT_VALIDATION' 
                            helpTitle='_GRAIN_EXPLAIN_VALIDATION'
                        >
                        {
                            offer === 'Logipro' ?
                                <select name='contentValidation' id='contentValidation'>
                                    <Option value='_INVALID' textTranslate='_INVALID'/>
                                    <Option value='_VALID' textTranslate='_VALID'/>
                                </select>
                            :
                                <select name='contentValidation' id='contentValidation' title={t('_GRAIN_DISBALED_VALIDATION')} onChange={(event, target) => handleGrainChange(event, 'content_validation')} value={grain.content_validation}>
                                    <Option value='_INVALID' textTranslate='_INVALID'/>
                                </select>
                        }
                        </Fields>
                        <Fields
                            htmlFor='graphicValidation' 
                            text='_GRAPHIC_VALIDATION' 
                            helpTitle='_GRAIN_EXPLAIN_VALIDATION'
                        >
                        {
                            offer === 'Logipro' ?
                                <select name='graphicValidation' id='graphicValidation'>
                                    <Option value='_INVALID' textTranslate='_INVALID'/>
                                    <Option value='_VALID' textTranslate='_VALID'/>
                                </select>
                            :
                                <select name='graphicValidation' id='graphicValidation' title={t('_GRAIN_DISBALED_VALIDATION')} onChange={(event, target) => handleGrainChange(event, 'graphics_validation')} value={grain.graphics_validation}>
                                    <Option value='_INVALID' textTranslate='_INVALID'/>
                                </select>
                        }
                        </Fields>
                    </ul>
                </li>
                <li>
                    <ul>
                    {
                    has_question !== undefined && has_question ?
                        <Fragment>
                            <Fields
                                htmlFor='show_correct_answers' 
                                text='_SHOW_CORRECT_ANSWERS'
                            >
                                <select id ='show_correct_answers' name='show_correct_answers' onChange={(event, target) => handleGrainChange(event, 'show_correct_answers')} value={grain.show_correct_answers}>
                                    <Option value={true} textTranslate='_NO'/>
                                    <Option value={false} textTranslate='_YES'/>
                                </select>
                            </Fields>
                            <Fields
                                htmlFor='score_total' 
                                text='_TOTAL_NOTE'
                            >
                                <select id ='score_total' name='score_total' onChange={(event, target) => handleGrainChange(event, 'score_total')} value={grain.score_total}>
                                    <Option value='10' text='10'/>
                                    <Option value='20' text='20'/>
                                    <Option value='100' text='100'/>
                                </select>
                            </Fields>
                        </Fragment>
                    :
                        <Fragment/>
                }
                    </ul>
                </li>
                <li>
                    {
                        grain.created_at !== undefined ?
                        <Fragment>
                            <p>{t('_GRAIN_CREATION')} {grain.created_at.replace('_GRAIN_HOUR', t('_GRAIN_HOUR'))}</p>
                            <p>{t('_GRAIN_UPDATE')} {grain.updated_at.replace('_GRAIN_UPDATE_HOUR', t('_GRAIN_UPDATE_HOUR'))}</p>
                        </Fragment>
                        :
                        <Fragment />
                    }
                </li>
            </ul>
            <ul className='btn__list inherit'>
                <li>
                    <Button
                        className='orange__btn'
                        type='submit'
                        buttonText='_SAVE'
                        onClick={() => saveGrain()}
                    />
                </li>
                <li>
                    <Button
                        className='grey__btn'
                        type='button'
                        buttonText='_DELETE'
                        onClick={() => deleteGrain()}
                    />
                </li>
            </ul>
        </form>
    )
}

export default withTranslation()(ConfigGrain)