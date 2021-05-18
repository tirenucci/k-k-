import React, { Fragment } from 'react'
import { useHistory } from 'react-router-dom'

//i18n
import { withTranslation } from 'react-i18next'

//Utilitaires
import Button from '../formWidget/Button'
import Image from '../Image'

const DataList = ({user, t, stat_module, showEdit, customerArea, showPwdForm, percent, changeTabs}) => {
    return (
        
        <Fragment>
            <ul className={!customerArea ? 'data__list' : 'data__list customer__area'}>
                <li className='avatar__wrapper'>
                    {t('_AVATAR')} :
                    {
                        user.avatar === undefined ?
                            <Image src='/assets/img/avatar/default.svg' alt='_AVATAR_DEFAULT' figcaptionText='_AVATAR_DEFAULT' hideFigcaption={true}/>
                        : 
                            <Image src={user.avatar.path} alt='_AVATAR' figcaptionText='_AVATAR' hideFigcaption={true}/>

                    }
                </li>
                <li>{t('_LOGIN')} : <span>{user.username}</span></li>
                <li>{t('_FAMILY_NAME')} : <span>{user.lastname}</span></li>
                <li>{t('_FIRST_NAME')} : <span>{user.firstname}</span></li>
                {user.offer === 'Logipro' || user.offer === 'org' ? <li>{t('_MAIL')} : <span>{user.email}</span></li>: <Fragment/>}
                <li>{t('_USER_REGISTRATION')} : <span>{user.registration}</span></li>
                <li>{t('_USER_LAST_LOG')} : <span></span></li>
                <li>{t('_USER_CREATED_TRAINING')} : <span>{stat_module !== undefined ? stat_module[0].total_training : <Fragment />}</span></li>
                <li>{t('_USER_GRAINS_TRAINING')} : <span>{stat_module !== undefined ? stat_module[0].grain_average : <Fragment />}</span></li>
                {user.offer === 'open' ? <li>{t('_OFFER')} : <span>{user.offer}</span></li>:<Fragment/>}
                {
                    percent !== undefined ?
                        <li>Quota :<span title={percent['percent'] + '%'}> {percent['used']}Mo / {percent['quota']}Mo</span></li>
                    :
                        <Fragment />
                }
                <li>{t('_LANG')} : <span>{t(user.lang)}</span></li>
            </ul>
            <ul className='btn__list'>
                <li>
                    <Button
                        className='orange__btn'
                        type='button'
                        buttonText='_EDIT'
                        onClick={() => customerArea !== undefined ? showEdit() : changeTabs('edit')}
                    />
                </li>
                <li>
                    <Button
                        className='grey__btn'
                        type='button'
                        buttonText='_CHANGE_PSWD'
                        onClick={() => customerArea !== undefined ? showPwdForm() : changeTabs('changePassword')}
                    />
                </li>
            </ul>
        </Fragment>
    )
}

export default withTranslation()(DataList)