
import React, { Fragment } from 'react'

//i18n
import { withTranslation } from 'react-i18next'

//Utilitaire
import Button from '../formWidget/Button'
import FileManagerModel from '../FileManagerModel'

//Style
import './Modal.scss'

const FileManagerModal = ({onAnnul, t, changeUrl, elfinder_title, training, multi, validImage, onlyType}) => {
    return (
        <div className='modal__wrapper'>
            <section className='modal__section modal__filemanager'>
                <article className='title'>
                    {
                        elfinder_title === undefined ? <Fragment/> : <h2 className='modal-h2'>{t('_CONFIRMATION')}</h2>
                    }
                    <Button 
                        className='close__btn' 
                        buttonTitle='_CLOSE'
                        type='button'
                        onClick={(event) => onAnnul(event)}
                    />
                </article>
                <article className='body'>
                    {
                        training !== undefined ?
                            <FileManagerModel
                                validImage={(url) => validImage(url)}
                                onlyType={onlyType}
                                lib={[
                                    {'label': 'Bibliothèque du module', 'name': '/' + training +'/'},
                                    {'label': 'Bibliothèque général', 'name': '/general/'},
                                    {'label': 'Bibliothèque gratuite', 'name': '/free/'}
                                ]}
                            />
                        :
                            <Fragment />
                    }
                </article>
            </section>
        </div>
    )
}

export default withTranslation()(FileManagerModal)