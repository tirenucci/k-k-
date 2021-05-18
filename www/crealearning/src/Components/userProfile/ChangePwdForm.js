import React from 'react'
import { useHistory } from 'react-router-dom'

//Utilitaires
import Button from '../formWidget/Button'
import Fields from '../formWidget/Fields'

const ChangePwdForm = ({handleChange, password, newPassword, newConfirmedPassword, updatePassword, customerArea, hidePwdForm, changeTabs}) => {

    const history = useHistory()

    return (
        <form onSubmit={(event) => updatePassword(event)}>
            <fieldset>
                <ul className='data__list__form'>
                    <Fields
                        liClass='profile__fields'
                        htmlFor='password' 
                        text='_CURRENT_PSWD'
                        inputType='password'
                        onChange={(event, target) => handleChange(event, 'password')} 
                        value={password}
                    />
                    <Fields
                        liClass='profile__fields'
                        htmlFor='newPassword' 
                        text='_NEW_PSWD'
                        inputType='password'
                        onChange={(event, target) => handleChange(event, 'newPassword')} 
                        value={newPassword}
                    />
                    <Fields
                        liClass='profile__fields'
                        htmlFor='confirmPassword' 
                        text='_REPEAT_PSWD'
                        inputType='password'
                        onChange={(event) => handleChange(event, 'confirmPassword')} 
                        value={newConfirmedPassword}
                    />
                </ul>
            </fieldset>
            <ul className='btn__list'>
                <li>
                    <Button
                        className='orange__btn'
                        type='submit'
                        buttonText='_SAVE'
                        onClick={(event) => updatePassword(event)}
                    />
                </li>
                <li>
                    <Button
                        className='grey__btn'
                        type='button'
                        buttonText='_RETURN'
                        onClick={() => customerArea !== undefined ? hidePwdForm() : changeTabs('')}
                    />
                </li>
            </ul>
        </form>
    )
}

export default ChangePwdForm