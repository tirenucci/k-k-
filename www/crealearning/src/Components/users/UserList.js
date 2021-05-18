import React, {Fragment} from 'react'

//Utilitaire
import Image from '../Image'

//i18n
import { withTranslation } from 'react-i18next'

const UserList = ({t, authors, currentPage, onChange, deleteAuthor}) => {
    return (
        <form className='authors__section'>
            <fieldset>
                <legend>{t('_AUTHORS')}</legend>
                <table>
                    <colgroup>
                        <col/>
                        <col/>
                        <col/>
                        <col/>
                        <col/>
                    </colgroup>
                    <thead>
                        <tr>
                            <th>{t('_NAME')}</th>
                            <th className='small__view'>{t('_FIRST_NAME')}</th>
                            <th className='small__view'>{t('_MAIL')}</th>
                            <th>{t('_AUTHORS_ROLE')}</th>
                            <th>{t('_AUTHOR_STATUS')}</th>
                            <th><Image src='/assets/img/ico-delete.png' alt='_DELETE_ICON'/></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            authors !== undefined && authors instanceof Array ?
                            authors.slice(currentPage * 25, currentPage * 25 + 25).map((author, key) => (
                            <tr key={key}>
                                <td>{author.firstname}</td>
                                <td className='small__view'>{author.lastname}</td>
                                <td className='small__view'>{author.email}</td>
                                <td>
                                    {
                                        author.role !== 'ROLE_LOGIPRO' ?
                                            <Fragment>
                                                <label htmlFor='roleAuthor'></label>
                                                <select name='roleAuthor' id='roleAuthor' value={author.role} onChange={(event, k) => onChange(event, key)}>
                                                    <option value='ROLE_ADMINISTRATEUR'>{t('_AUTHOR_ADMIN')}</option>
                                                    <option value='ROLE_AUTHOR'>{t('_AUTHOR')}</option>
                                                    <option value='ROLE_USER'>{t('_AUTHOR_CONSULTANT')}</option>
                                                </select>
                                            </Fragment>
                                        :
                                            <Fragment>
                                                <label htmlFor='roleAuthor'></label>
                                                <select disabled name='roleAuthor' id='roleAuthor' value={author.role} onChange={(event, k) => onChange(event, key)}>
                                                    <option value='ROLE_ADMINISTRATEUR'>{t('_AUTHOR_ADMIN')}</option>
                                                    <option value='ROLE_AUTHOR'>{t('_AUTHOR')}</option>
                                                    <option value='ROLE_USER'>{t('_AUTHOR_CONSULTANT')}</option>
                                                </select>
                                            </Fragment>
                                    }
                                </td>
                                <td>
                                    {
                                        author.role !== 'ROLE_LOGIPRO' ?
                                            <Fragment>
                                                <label htmlFor='statusAuthor'></label>
                                                <select name='statusAuthor' id='statusAuthor' value={author.status} onChange={(event, k) => onChange(event, key)}>
                                                    <option value='_USER_ACTIF'>{t('_USER_ACTIF')}</option>
                                                    <option value='_USER_INACTIF'>{t('_USER_INACTIF')}</option>
                                                </select>
                                            </Fragment>
                                        :
                                            <Fragment>

                                                <label htmlFor='statusAuthor'></label>
                                                <select disabled name='statusAuthor' id='statusAuthor' value={author.status} onChange={(event, k) => onChange(event, key)}>
                                                    <option value='_USER_ACTIF'>{t('_USER_ACTIF')}</option>
                                                    <option value='_USER_INACTIF'>{t('_USER_INACTIF')}</option>
                                                </select>
                                            </Fragment>
                                    }
                                </td>
                                <td>
                                    {
                                        author.role !== 'ROLE_LOGIPRO' ?
                                            <button title={t('_DELETE')} onClick={(event) => deleteAuthor(event, author.id)}>
                                                <Image src='/assets/img/cross.png' alt='_CROSS_ICON'/>
                                            </button>
                                        :
                                            <Fragment/>
                                    }
                                </td>
                            </tr>
                            ))
                            :
                            <Fragment/>
                        }
                    </tbody>
                </table>
            </fieldset>
        </form>
    );
};

export default withTranslation()(UserList);