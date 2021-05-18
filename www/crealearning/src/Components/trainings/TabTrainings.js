import React, { Fragment } from 'react'

//i18n
import { withTranslation } from 'react-i18next'

//Component pour le tri des colonnes
import SortButton from '../formWidget/SortButton'
//Style
import './TabTrainings.scss'
const TabTrainings = ({trainings, onSort, user, handleDuplique, onDelete, t, openTraining, currentPage, page}) => {
    return (
        <table id='tableTraining'>
            <colgroup>
                <col></col>
                <col id='col2'></col>
                <col id='col3'></col>
                <col></col>
                <col></col>
                <col></col>
                <col></col>
                <col></col>
                <col></col>
                <col id='col10'></col>
                <col></col>
             </colgroup>
            <thead>
                <tr>
                    <th>
                        <SortButton onClick={(event) => onSort(event, 'name', 'text')}/>
                        <span>{t('_NAME')}</span>
                    </th>
                    <th className='large__view'>{t('_DESCRIPTION')}</th>
                    <th>{t('_AUTHOR')}(s)</th>
                    <th className='small__view'>
                        <SortButton onClick={(event) => onSort(event, 'duration', 'date')}/>
                        <span>{t('_DURATION')}</span>
                    </th>
                    <th className='large__view'>
                        <SortButton onClick={(event) => onSort(event, 'version', 'text')}/>
                        <span>{t('_VERSION')}</span>
                    </th>
                    <th className='small__view'>
                        <SortButton onClick={(event) => onSort(event, 'disk_space', 'text')}/>
                        <span>{t('_SIZE')} (Mo)</span>
                    </th>
                    <th className='medium__view'>
                        <SortButton onClick={(event) => onSort(event, 'created_at', 'date')}/>
                        <span>{t('_CREATED')}</span>
                    </th>
                    <th className='medium__view'>
                        <SortButton onClick={(event) => onSort(event, 'updated_at', 'date')}/>
                        <span>{t('_MODIF')}</span>
                    </th>
                    <th className='small__view'>{t('_STATUS')}</th>
                    <th>{t('_TAGS')}</th>
                    <th>{t('_ACTIONS')}</th>
                </tr>     
            </thead>     
            <tbody> 
            {
                trainings['training'] instanceof Array ?
                    trainings['training'].map((training, key) => (
                        <tr key={key} onClick={(event, id) => openTraining(event, training.id)}>
                            <td>{training.name}</td>
                            <td className='large__view'>{training.description}</td>
                            <td>
                                {
                                    training.author.map((a, key) => (
                                        <span title={t('_TRAINING_OWNER')} key={key}>{a.name}<br/></span>
                                    ))
                                }
                            </td>
                            <td className='small__view'>{training.duration}</td>
                            <td className='large__view'>{training.version}</td>
                            <td className='small__view'>{training.disk_space}</td>
                            <td className='medium__view'>{training.created_at}</td>
                            <td className='medium__view'>{training.updated_at}</td>
                            <td className='small__view'>
                                { 
                                    training.status === '_VALID' ? 
                                    <span title={t('_DONE')} className='statut-termine'></span> 
                                    : 
                                    <span title={t('_ONGOING')} className='statut-encours'></span> 
                                }
                            </td>
                            <td title={training.tags}>{training.tag.join(', ')}</td>
                            <td>
                                <ul className='table__actions'>
                                    <li>
                                        <a href={`/training/preview/${window.btoa(training.id + '&' + 0)}`} title={t('_PREVIEW')} onClick={(event) => event.stopPropagation(event)} className='btn-crealist btn__preview' target='_blank' rel='noopener noreferrer'>{t('_PREVIEW')}</a>
                                    </li>
                                    {
                                        user.role === 'ROLE_ADMINISTRATOR'  || training.author.find(author => author.id === user.id) ?
                                            <Fragment>
                                                <li>
                                                    <a href={`/training/${training.id}/option`} title={t('_SET')} onClick={(event) => event.stopPropagation(event)} className='btn-crealist btn__settings'>{t('_SET')}</a>
                                                </li>
                                                <li>
                                                    <a href={`/training/${training.id}/option/#exports`} title={t('_EXPORT')} onClick={(event) => event.stopPropagation(event)} className='btn-crealist btn__export'>{t('Exporter')}</a>
                                                </li>
                                                <li>
                                                    <a href={`/training/${training.id}/option/#shares`} title={t('_SHARE')} onClick={(event) => event.stopPropagation(event)} className='btn-crealist btn__share'>{t('_SHARE')}</a>
                                                </li>
                                                <li>
                                                    <a href='#lien' title={t('_DUPLICATE')} className='btn-crealist btn__duplicate' onClick={(event, id) => handleDuplique(event, training.id)}>{t('_DUPLICATE')}</a>
                                                </li>
                                                <li>
                                                    <a href='#suppression' title={t('_DELETE')} onClick={(event, id) => onDelete(event, training.id)} className='btn-crealist btn__delete'>{t('_DELETE')}</a>
                                                </li>
                                            </Fragment>
                                        :
                                        <Fragment/>
                                    }
                                </ul>
                            </td>
                        </tr>
                    ))
                :
                    <Fragment/>
                }
            </tbody>
            </table>

    );
};



export default withTranslation()(TabTrainings);