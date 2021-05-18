
import React, {Fragment} from 'react'

//i18n
import { withTranslation } from 'react-i18next'

//Utilitaires
import Button from '../formWidget/Button'
import Image from '../Image'

//Style
import './ChangeAvatar.scss'

const ChangeAvatar = ({onClose, allImages, selectedImage, selectHandler, choiceHandle, uploadFile, t}) => {
    
    // Permet d'ouvrir la box selectionner un fichier de l'input en display none
    function openUploader(){
        document.getElementById('uploader').click();
    }

    return (
        <div className='avatar__bkgd'>
            <section className='avatar__section'>
                <figure>
                    <Image src={selectedImage.path} alt={selectedImage.name}/>
                </figure>
                <div className='avatar__list__wrapper'>
                    <h4>{t('_AVATAR_CHOICE')}</h4>
                    <Button 
                        className='close__btn' 
                        buttonTitle='_CLOSE'
                        type='button'
                        onClick={(event) => onClose(event)}
                    />
                    <ul className='avatar__list'>
                    {   //On boucle sur tout les avatars disponibles en bdd
                        allImages.map((avatar, key) => (
                            <li key={key}>
                                {
                                    avatar !== undefined ?
                                        <img src={avatar.path} alt={t('avatar ' + avatar.name)}/>
                                    :
                                        <Fragment />
                                }
                                <span>{t(avatar.name)}</span>
                                {
                                    //Si l'avatar à le nom 'Local' alors on créé un bouton spécial avec un input pour insérer une image
                                    avatar.name === '_LOCAL' ?
                                    <button onClick={() => openUploader()}>{t('_BROWSE')}
                                        <input accept='image/*' type='file' style={{display: 'none'}} id='uploader' onChange={(e) => uploadFile(e)}/>
                                    </button>
                                    :
                                    <Button 
                                        buttonText='_SELECT'
                                        type='button'
                                        onClick={(event) => selectHandler(event, avatar)}
                                    />
                                }
                            </li>
                        ))
                    }
                    </ul>
                    <div className='avatar__btn__wrapper'>
                        <Button 
                            className='choice__btn' 
                            buttonText='_CHOOSE'
                            type='button'
                            onClick={(event) => choiceHandle(event)}
                        />
                    </div>
                </div>
            </section>
        </div>
    )
}

export default withTranslation()(ChangeAvatar);