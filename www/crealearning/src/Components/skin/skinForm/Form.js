import React, {Fragment} from 'react'
import { useHistory } from 'react-router-dom'


//i18n
import { withTranslation } from 'react-i18next'

//Utilitaires
import Button from '../../formWidget/Button'
import Fields from '../../formWidget/Fields'

//Style
import './Form.scss'

const Form = ({skin, handleChange, themes, handleSubmit, t}) => {

    const history = useHistory()

    return(
        <form onSubmit={(event) => handleSubmit(event)} className='formulaire'>
            <fieldset>
                <ul className='info__form'>
                    <li>
                        <ul className='one__row'>
                            <Fields
                                className='skin-theme-create' 
                                htmlFor='theme' 
                                text='_THEME' 
                                required={true} 
                                helpTitle='_THEME_REQUIRED'
                            >
                                {
                                    themes[skin.theme_id] !== undefined ?
                                    <select name='theme' id='theme' value={skin.theme_id} readOnly onChange={(event) => handleChange(event, 'theme_id')}>
                                        {
                                            themes.map((theme, key) =>(
                                                <option key={key} name='theme' value={theme.id}>{t(theme.title)}</option>
                                            ))
                                        }
                                    </select>
                                    :
                                    <Fragment/>
                                }
                            </Fields>
                            <Fields
                                htmlFor='order' 
                                text='_ORDER'
                                inputType='number'
                                onChange={(event) => handleChange(event, 'position')} 
                                value={skin.position}
                                min='1'
                            />
                        </ul>
                    </li>
                    <li>
                        <ul className='one__row'>
                            <Fields
                                htmlFor='colorName' 
                                text='_SKIN_COLOR'
                                inputType='text'
                                onChange={(event) => handleChange(event, 'colorName')} 
                                value={skin.colorName}
                                helpTitle='_REQUIRED' 
                                required={true}
                                size='20'
                            />
                            <Fields
                                htmlFor='colorCode' 
                                text='_SKIN_COLOR_CODE'
                                inputType='text'
                                onChange={(event) => handleChange(event, 'colorCode')} 
                                value={skin.colorCode}
                                helpTitle='_COLOR_FORMAT_REQUIRED' 
                                required={true}
                                size='20'
                            >
                                <div style={{backgroundColor: skin.colorCode}} className='circle-color'></div>
                            </Fields>
                        </ul>
                    </li>
                </ul>
            </fieldset>
            <ul className='btn__list inherit'>
                <li>
                    <Button
                        className='orange__btn'
                        type='submit'
                        buttonText='_SAVE'
                    />
                </li>
                <li>
                    <Button
                        className='grey__btn'
                        type='reset'
                        buttonText='_CANCEL'
                        onClick={(event) => history.push('/skinTheme')}
                    />
                </li>
            </ul>
        </form>
    )
}

export default withTranslation()(Form)