import React, {Fragment} from 'react'

//Utilitaires
import Fields from '../../Components/formWidget/Fields'

const ImgOptions = ({scale, scaleChange, description, descriptionChange,href, hrefChange}) => {
    return (
        <Fragment>
            <Fields
                liClass='option-element'
                htmlFor='description' 
                text='_DESCRIPTION'
                inputType='text' 
                value={description} 
                onChange={(event, target) => descriptionChange(event, 'alt')} 
            />
            <Fields
                liClass='option-element'
                htmlFor='externalLink' 
                text='_IMG_EXT_LINK'
                inputType='text' 
                value={href} 
                onChange={(event, target) => descriptionChange(event, 'href')} 
            />
            <Fields
                liClass='option-element'
                htmlFor='scale' 
                text='_IMG_SCALE'
                inputType='text'
                onChange={(event, target) => scaleChange(event, 'scale')}
                value={scale}
            >%</Fields>
        </Fragment>
    )
}

export default ImgOptions