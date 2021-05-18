import React from 'react'
import { withTranslation } from 'react-i18next'

//Utilitaires
import Image from '../../Image'
import Button from '../../formWidget/Button'
import Fields from '../../formWidget/Fields'

//Style
import './ThemeDisplay.scss'

const ThemeDisplay = ({theme, handleChange, title, position, updateTheme, t}) =>{
    return(
        <section className='one__skin__section'>
            <figure>
                {
                    theme.skin !== undefined ? 
                    <Image src={'/assets/skins/' + theme.folder_name + '/' + theme.skin[0].folder_name + '/thumb.jpg'} alt='_SKIN'/>
                    : 
                    <Image src='/assets/img/default-thumb.jpg' alt='_DEFAULT_SKIN'/>
                }
            </figure>
            <form onSubmit={(event) => updateTheme(event)}>
                <fieldset id='skin-theme'>
                    <ul>
                        <Fields
                            htmlFor='order' 
                            text='_ORDER'
                            inputType='number'
                            onChange={(event, target) => handleChange(event, 'position')} 
                            value={position} 
                            size='20'
                        />
                        <Fields
                            htmlFor='title' 
                            text='_TITLE'
                            inputType='text'
                            onChange={(event, target) => handleChange(event, 'title')} 
                            value={title} 
                            size='60'
                            helpTitle='_REQUIRED' 
                            required={true}
                        />
                        <li>
                            <Button
                                className='orange__btn'
                                type='submit'
                                buttonText='_SAVE'
                                onClick={(event) => updateTheme(event)}
                            />
                        </li>
                    </ul>
                </fieldset>
            </form>
        </section>
    )
}


export default withTranslation()(ThemeDisplay)