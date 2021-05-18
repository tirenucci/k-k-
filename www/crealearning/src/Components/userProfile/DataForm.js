import React, { Fragment } from 'react'
import { useHistory } from 'react-router-dom'

//i18n
import { withTranslation, useTranslation } from 'react-i18next'

//Utilitaires
import Button from '../formWidget/Button'
import Image from '../Image'
import Fields from '../formWidget/Fields'

const DataForm = ({avatar, username, firstname, lastname, lang, t, handleChange, updateData, choiceHandle, customerArea, hideEdit, options, changeTabs}) => {
    
    const {i18n} = useTranslation()

    return (
        <form onSubmit={(event) => updateData(event, i18n)}>
            <fieldset>
                <ul className='data__list__form'>
                    <li className='avatar__wrapper'>
                        {t('_AVATAR')} :
                        { 
                            avatar === null ?
                                <Image src='/assets/img/avatar/default.svg' alt='_AVATAR_DEFAULT'/>
                            : 
                                <figure>
                                    {
                                        avatar !== undefined ?
                                            <Image src={avatar.path} alt='_AVATAR'/>
                                        :
                                            <Fragment />
                                    }
                                    <figcaption>
                                        <a href='#choice' onClick={choiceHandle}>{t('_CHOOSE')}</a>
                                    </figcaption>
                                </figure>
                        }
                    </li>
                    <li className='profile__fields login'>{t('_LOGIN')} : <span>&nbsp;{username}</span></li>
                    <Fields
                        liClass='profile__fields'
                        htmlFor='lastname' 
                        text='_FAMILY_NAME'
                        inputType='text'
                        onChange={(event, target) => handleChange(event, 'lastname')} 
                        value={lastname}
                        className='lastname'
                    />
                    <Fields
                        liClass='profile__fields'
                        htmlFor='firstname' 
                        text='_FIRST_NAME'
                        inputType='text'
                        onChange={(event, target) => handleChange(event, 'firstname')} 
                        value={firstname}
                        className='firstname'
                    />
                    <Fields
                        liClass='profile__fields'
                        htmlFor='language' 
                        text='_LANG'
                        onChange={(event, target) => handleChange(event, 'lang')} 
                        defaultValue={lang}
                        options={options}
                    />
                </ul>
            </fieldset>
            <ul className='btn__list'>
                <li>
                    <Button
                        className='orange__btn'
                        type='submit'
                        buttonText='_SAVE'
                        onClick={(event) => updateData(event, i18n)}
                    />
                </li>
                <li>
                    <Button
                        className='grey__btn'
                        type='reset'
                        buttonText='_CANCEL'
                        onClick={() => customerArea !== undefined ? hideEdit() : changeTabs('')}
                    />
                </li>
            </ul>
        </form>
    )
}

export default withTranslation()(DataForm)