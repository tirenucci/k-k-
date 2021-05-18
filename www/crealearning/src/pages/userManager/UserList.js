import React, { Fragment } from 'react'

//i18n
import { withTranslation } from 'react-i18next'

//Utilitaires
import Button from '../../Components/formWidget/Button'
import SortButton from '../../Components/formWidget/SortButton'

const UserList = ({t, users, currentPage, onDelete, onSort, onAccess}) => {
    return (
        <table className='user__table'>
            <colgroup>
                <col/>
                <col className='small__view'/>
                <col className='small__view'/>
                <col/>
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
                    <th className='small__view'>{t('_FIRST_NAME')}</th>
                    <th className='small__view'><SortButton onClick={(event) => onSort(event, 'email', 'text')}/>{t('_MAIL')}</th>
                    <th>{t('_OFFER')}</th>
                    <th>{t('_SOCIETY')}</th>
                    <th>{t('_STATUS')}</th>
                    <th>{t('_ACTIONS')}</th>
                    <th>{'Accès'}</th>
                </tr>
            </thead>
            <tbody>
            {
                users !== undefined && users instanceof Array ?
                users.slice(currentPage * 25, currentPage * 25 + 25).map((user, key) => (
                <tr key={key}>
                    <td>{user.lastname}</td>
                    <td className='small__view'>{user.firstname}</td>
                    <td className='small__view'>{user.email}</td>
                    <td>{user.offer}</td>
                    <td>{user.society_name}</td>
                    <td>{t(user.status)}</td>
                    <td>
                        <ul>
                            <li>
                                <Button
                                    className='btn-crealist btn__edit'
                                    buttonTitle='_EDIT'
                                    buttonType='button'
                                    onClick={(event, id) => window.location.pathname = '/userManager/edit/' + user.id}
                                />
                            </li>
                            <li>
                                <Button
                                    className='btn-crealist btn__delete'
                                    buttonTitle='_DELETE'
                                    buttonType='button'
                                    onClick={(event) => onDelete(event, user.id)}
                                />
                            </li>
                        </ul>
                    </td>
                    <td>
                        {
                            user.role !== 'ROLE_LOGIPRO' ?
                                <ul>
                                    <Button
                                        className='search__btn'
                                        buttonText='Se Connecter à ce compte'
                                        buttonType='button'
                                        onClick={(event) => onAccess(event, user.id)}
                                    />
                                </ul>
                            :
                                <Fragment />
                        }

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

export default withTranslation()(UserList)