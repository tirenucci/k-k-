import React from 'react'

//Utilitaire
import Fields from '../formWidget/Fields'

//Style
import './FormDefinition.scss'

function FormDefinition({title, description, handleChange}) {
    return(
        <ul className='form__definition'>
            <Fields
                htmlFor='name' 
                text='_ENTER_NAME'
                inputType='text' 
                value={title}
                placeholder='_ENTER_NAME'
                onChange={(event, target) => handleChange(event, 'title')}
                required
                maxLength='200'
            />
            <Fields
                htmlFor='description' 
                text='_ENTER_DESC'
                textarea={true}
                value={description}
                placeholder='_ENTER_DESC'
                onChange={(event, target) => handleChange(event, 'description')}
            />
        </ul>
    )
}

export default FormDefinition

