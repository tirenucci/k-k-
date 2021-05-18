import React, { Fragment } from 'react';
import './Modal.scss'
import { withTranslation } from 'react-i18next'
import Button from '../formWidget/Button';

const ImportModal = ({t, onClose, training, handleChange, handleImport, complement}) => {
    return (
        <div className='modal__wrapper'>
            <section className='modal__section'>
                <h4>{t('_IMPORT_TITLE')}</h4>
                <Button 
                    className='close__btn' 
                    buttonTitle='_CLOSE'
                    type='button'
                    onClick={() => onClose()}
                />
                <article>
                    <ul>
                        {
                            //les deux li apparaissent uniquement si le module et/ou l'habillage existe déjà
                            //remplacer par les variables permettant de récupérer le titre du module et de l'habillage
                        }
                        {
                            training.module_version !== null ? <li>{t('_IMPORT_MODAL_EXIST_1', {trainingTitle: training.name})}</li> : <Fragment />
                        }
                        
                        {
                            training.module_skin_version !== null ? <li>{t('_IMPORT_MODAL_EXIST_2', {trainingSkin: training.module_skin})}</li> : <Fragment />
                        }
                        
                    </ul>
                    <hr/>
                    <ul>
                        
                        <li>Actions :</li>
                        {
                            training.module_version !== null ?
                                <li className='training-choice'>
                                    <label htmlFor='choiceForTraining'>{t('Module')} : </label>
                                    <select name='training' onChange={(event) => handleChange(event)} id='choiceForTraining'  value={complement.training}>
                                        <option value='replace'>{t('_IMPORT_REPLACE')}</option>
                                        <option value='create'>{t('_IMPORT_CREATE')}</option>
                                        <option value='add'>{t('_IMPORT_ADD')}</option>
                                    </select>
                                </li>
                            :
                                <Fragment />
                        }
                        {
                            training.module_skin_version !== null ?
                                <li className='skin-choice'>
                                    <label htmlFor='choiceForSkin'>{t('_TEMPLATE')} : </label>
                                    <select name='skin' onChange={(event) => handleChange(event)} id='choiceForSkin' value={complement.skin}>
                                        <option value={true}>{t('_IMPORT_KEEP')}</option>
                                        <option value={false}>{t('_IMPORT_CHANGE')}</option>
                                    </select>
                                </li>
                            :
                                <Fragment />
                        }
                        
                    </ul>
                </article>
                <ul className='modal__btn__list'>
                    <li>
                        <Button
                            className='orange__btn'
                            type='button'
                            buttonText='_IMPORT'
                            onClick={(e) => handleImport(e)}
                        />
                    </li>
                    <li>
                        <Button
                            className='grey__btn'
                            type='button'
                            buttonText='_CANCEL'
                            onClick={() => onClose()}
                        />
                    </li>
                </ul>
            </section>
        </div>
    );
};

export default withTranslation()(ImportModal);