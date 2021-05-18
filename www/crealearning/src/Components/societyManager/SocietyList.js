import React, { Fragment } from 'react'

//i18n
import { withTranslation } from 'react-i18next'

//Components utilitaires
import Button from '../formWidget/Button'
import SortButton from '../formWidget/SortButton'
import Image from '../Image'

const SocietyList = ({t, societies, deleteSociety, currentPage, onSort}) => {

    return (
        <table className='society__table'>
            <colgroup>
                <col/>
                <col className='small__view'/>
                <col/>
                <col/>
                <col/>
            </colgroup>
            <thead>
                <tr>
                    <th>
                        <SortButton onClick={(event) => onSort(event, 'name', 'text')}/>
                        {t('_NAME')}
                    </th>
                    <th className='small__view'>{t('_LOGO')}</th>
                    <th>{t('_QUOTA')}</th>
                    <th>{t('_DISK_SPACE')}</th>
                    <th>{t('_ACTIONS')}</th>
                </tr>
            </thead>
            <tbody>
            {
                societies !== undefined && societies instanceof Array ?
                societies.slice(currentPage * 25, currentPage * 25 + 25).map((society, key) => (
                <tr key={key}>
                    <td>{society.name}</td>
                    <td className='small__view'>
                        {
                            society.logo_name !== null ?
                            //A compléter pour le src
                                <Image src='/assets/' alt='_LOGO'/>
                            :
                                <Image src='/assets/img/small-default-thumb.png' alt='_NO_PICTURE' figcaptionText='_NO_PICTURE'/>
                        }
                    </td>
                    <td>{society.quota}</td>
                    <td>{society.disk_space} Mo</td>
                    <td>
                        <ul>
                            <li>
                                <Button
                                    className='btn-crealist btn__edit'
                                    buttonTitle='_EDIT'
                                    buttonType='button'
                                    onClick={() => window.location.pathname = '/societyManager/edit/' + society.id}
                                />
                            </li>
                            <li>
                                <Button
                                    className='btn-crealist btn__delete'
                                    buttonTitle='_DELETE'
                                    buttonType='button'
                                    onClick={(event, target) => deleteSociety(event, society.id)}
                                />
                            </li>
                        </ul>
                    </td>
                </tr>
                ))
                :
                <Fragment/>
            }
            </tbody>
        </table>
    )
}

export default withTranslation()(SocietyList)