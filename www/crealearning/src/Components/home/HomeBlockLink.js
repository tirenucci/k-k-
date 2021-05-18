import React from 'react'

//i18n
import { withTranslation } from 'react-i18next'

//Style
import './HomeBlockLink.scss'

//On passe en props l'offre afin d'afficher les bons éléments + les fonctions qu'on appelera au clic sur chaque boutons + la traduction avec t
function HomeBlockLink({t, offer, openImportSubscriber, openAuthorSubscriber, openSkinSubscriber, openLibrarySubscriber}) {
    return(
        <li className='home__aside'>
            <ul>
                <li>
                {
                    offer === 'open' ?
                    <button onClick={()=> openImportSubscriber()} className='disabled'>
                            <img src='/assets/img/main/btn-import.png' alt={t('_IMPORT_ICON_DES')}/>
                        <p>{t('_HOME_IMPORT_LINK')}</p>
                    </button> 
                    :
                    <a href='/import'>
                        <img src='/assets/img/main/btn-import.png' alt={t('_IMPORT_ICON')}/>
                        <p>{t('_HOME_IMPORT_LINK')}</p>
                    </a>
                }
                </li>
                <li>
                    <a href='/trainings'>
                        <img src='/assets/img/main/btn-export.png' alt={t('_EXPORT_ICON')}/>
                        <p>{t('_HOME_EXPORT_LINK')}</p>
                    </a>
                </li>
                <li>
                {
                    offer === 'open' || offer === 'pro' ?
                    <button onClick={()=> openAuthorSubscriber()} className='disabled'>
                            <img src='/assets/img/main/btn-author.png' alt={t('_AUTHOR_ICON_DES')}/>
                        <p>{t('_HOME_AUTHOR_LINK')}</p>
                    </button> 
                    :
                    <a href='/authors'>
                        <img src='/assets/img/main/btn-author.png' alt={t('_AUTHOR_ICON')}/>
                        <p>{t('_HOME_AUTHOR_LINK')}</p>
                    </a>
                }
                </li>
                <li>
                {
                    offer === 'open' || offer === 'pro' ?
                    <button onClick={()=> openSkinSubscriber()} className='disabled'>
                            <img src='/assets/img/main/btn-template.png' alt={t('_TEMPLATE_ICON_DES')}/>
                        <p>{t('_HOME_TEMPLATE_LINK')}</p>
                    </button> 
                    :
                    <a href='/skintheme'>
                        <img src='/assets/img/main/btn-template.png' alt={t('_TEMPLATE_ICON')}/>
                        <p>{t('_HOME_TEMPLATE_LINK')}</p>
                    </a>
                }
                </li>
                <li>
                {
                    offer === 'open' || offer === 'pro' ?
                    <button onClick={()=> openLibrarySubscriber()} className='disabled'>
                            <img src='/assets/img/main/btn-library.png' alt={t('_LIB_ICON_DES')}/>
                        <p>{t('_LIB_TITLE')}</p>
                    </button> 
                    :
                    <a href='/general-librairie'>
                        <img src='/assets/img/main/btn-library.png' alt={t('_LIB_ICON')}/>
                        <p>{t('_LIB_TITLE')}</p>
                    </a>
                }
                </li>
            </ul>
        </li>
    )
}

export default withTranslation()(HomeBlockLink)