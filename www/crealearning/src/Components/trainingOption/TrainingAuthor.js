    import React, {Fragment} from 'react'

//i18n
import { withTranslation } from 'react-i18next'

//Utilitaires
import Button from '../formWidget/Button'
import Image from '../Image'

//Style
import './TrainingAuthor.scss'

const TrainingAuthor = ({offer, t, authors, authors_training, addAuthor, deleteAuthor, handleChange}) => {
    return (
        <Fragment>
            {
                offer === 'pro' || offer === 'open' ?
                    <section className='lock-author-access'>
                        <h2>{t('_LOCK_AUTHOR_TRAINING')}</h2>
                        <p>{t('_LOCK_AUTHOR_TRAINING_ACCESS_1')}<span>{t('_CUSTOMER_ORG')}</span>{t('_LOCK_AUTHOR_TRAINING_ACCESS_2')}{t('_LOCK_CONTACT')}</p>
                        <Button
                            className='subscribe__btn'
                            buttonType='button'
                            buttonTitle='_BTN_SUBSCRIBE_OFFER'
                            buttonText='_BTN_SUBSCRIBE'
                            onClick={() => window.open('https://open.crea-learning.com/index.php#four', '_blank')}
                        />
                    </section>
                :
                    <form className='authors__section'>
                        <fieldset>
                            <legend>{t('_AUTHORS')}</legend>
                            <ul>
                                <li className='search__author'>
                                    <datalist id='authors'>
                                        {
                                            authors !== undefined ?
                                                authors.map((author, key) => (
                                                    <option value={author.id}>{author.firstname} {author.lastname} ({author.email})</option>
                                                ))
                                                :
                                                <Fragment />
                                        }
                                    </datalist>
                                    <input id='newauthor' type='text' autoComplete='on' list='authors' placeholder={t('_AUTHORS_SEARCH_2')} onChange={(event) => addAuthor(event)} size='35'/> 
                                </li>
                                <li>
                                    <table>
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
                                                <th>{t('_NAME')}</th>
                                                <th className='small__view'>{t('_FIRST_NAME')}</th>
                                                <th className='small__view'>{t('_AUTHORS_ROLE')}</th>
                                                <th>{t('_MODIFY')}</th>
                                                <th>{t('_CONSULT')}</th>
                                                <th>
                                                    <Image src='/assets/img/ico-delete.png' alt='_DELETE_ICON'/>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {  
                                                authors_training instanceof Array ?
                                                    authors_training.map((author, key) => (
                                                        author.is_owner ?
                                                        <tr>
                                                            <td>{author.last_name}</td>
                                                            <td className='small__view'>{author.first_name}</td>
                                                            <td className='small__view'>
                                                                {
                                                                    author.isOwner ?
                                                                        t('_OWNER')
                                                                    :
                                                                        t(author.role)
                                                                }
                                                            </td>
                                                            <td>
                                                                <label htmlFor='configRight-1'></label>
                                                                <input type='checkbox' name='configRight-1' id='configRight-1' checked disabled/>
                                                            </td>
                                                            <td>
                                                                <label htmlFor='contentRight-1'></label>
                                                                <input type='checkbox' name='contentRight-1' id='contentRight-1' checked disabled/>
                                                            </td>
                                                            <td>
                                                                
                                                            </td>
                                                        </tr>
                                                        :
                                                        
                                                        <tr>
                                                            <td className='small__view'>{author.first_name}</td>
                                                            <td className='small__view'>{author.last_name}</td>
                                                            <td className='small__view'>
                                                                {t(author.role)}
                                                            </td>       
                                                            <td>
                                                                <label htmlFor='configRight-1'></label>
                                                                <input type='checkbox' name='configRight-1' id='configRight-1' checked={author.is_editor} onChange={(event, k) => handleChange(event, key)}/>
                                                            </td>
                                                            <td>
                                                                <label htmlFor='contentRight-1'></label>
                                                                <input type='checkbox' name='contentRight-1' id='contentRight-1' disabled checked/>
                                                            </td>
                                                            <td>
                                                                <a href='#remove' title={t('_DELETE')} onClick={(event, id) => deleteAuthor(event, author.id)}>
                                                                    <Image src='/assets/img/cross.png' alt='_CROSS_ICON'/>
                                                                </a>
                                                                
                                                            </td>
                                                        </tr>
                                                    ))
                                                    :
                                                    <Fragment />
                                            }
                                        </tbody>
                                    </table>
                                </li>
                            </ul>
                        </fieldset>
                    </form>
                }
        </Fragment>
    )
}

export default withTranslation()(TrainingAuthor)