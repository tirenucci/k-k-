import React from 'react'

//Utilitaires
import Image from '../Components/Image'
import Fields from './formWidget/Fields'

const SkinInformation = ({skin}) => {
    return (
        <ul className='skin__info__list'>
            <Fields
                htmlFor='author' 
                text='_AUTHOR'
                inputType='text'
                value={skin.author} 
                disabled={true}
                colon={true}
            >
            </Fields>
            <Fields
                htmlFor='description' 
                text='_DESCRIPTION'
                inputType='text'
                value={skin.description} 
                disabled={true}
                size='35'
                colon={true}
            />
            <Fields
                htmlFor='version' 
                text='_VERSION'
                inputType='text'
                value={skin.version} 
                disabled={true}
                colon={true}
            />
            <Fields
                htmlFor='skinName' 
                text='_NAME'
                inputType='text'
                value={skin.name} 
                disabled={true}
                size='35'
                colon={true}
            />
            <li>
                <Image src={`/assets/skins/${skin.theme_folder}/${skin.skin_folder}/thumb.jpg`} alt='_SKIN' figcaptionText='_SKIN_OVERVIEW'/>
            </li>
        </ul>
    )
}

export default SkinInformation