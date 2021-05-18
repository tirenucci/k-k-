import React from 'react'

//i18n
import { withTranslation } from 'react-i18next'


//Utilitaires
import Button from '../formWidget/Button'
import Fields from '../formWidget/Fields'

//Style
import './Modal.scss'

const UserCreator = ({t, onAnnul, nameAuthor, firstnameAuthor, mailAuthor, roleAuthor, onChange, createAuthor, options}) => {
    return (
        <div className='modal__wrapper'>
            <section className='modal__section'>
                <h4>{t('_USER_CREATE')}</h4>
                <Button 
                    className='close__btn' 
                    buttonTitle='_CLOSE'
                    type='button'
                    onClick={() => onAnnul()}
                />
                <form className='authors__form' onSubmit={(event) =>createAuthor(event)}>
                    <legend>{t('_AUTHOR_DATA')}</legend>
                    <ul>
                        <Fields htmlFor='nameAuthor' text='_NAME' required={true} inputType='text' value={nameAuthor} onChange={(event) => onChange(event, 'nameAuthor')}/>
                        <Fields htmlFor='firstnameAuthor' text='_FIRST_NAME' required={true} inputType='text' value={firstnameAuthor} onChange={(event) => onChange(event, 'firstnameAuthor')}/>
                        <Fields htmlFor='mailAuthor' text='_MAIL' required={true} inputType='text' value={mailAuthor} onChange={(event) => onChange(event, 'mailAuthor')} sentence='_AUTHOR_MAIL_EXPLAIN'/>
                        <Fields 
                            htmlFor='roleAuthor' 
                            text='_AUTHORS_ROLE' 
                            required={true} 
                            defaultValue={'choice'} 
                            value={roleAuthor} 
                            onChange={(event) => onChange(event, 'roleAuthor')}
                            options={options}
                        />
                        <li>{t('_REQUIRED_FIELDS')}</li>
                    </ul>
                </form>
                <ul className='modal__btn__list'>
                    <li>
                        <Button
                            className='orange__btn'
                            type='submit'
                            buttonText='_CREATE'
                            onClick={(event) => createAuthor(event)}
                        />
                    </li>
                    <li>
                        <Button
                            className='grey__btn'
                            type='button'
                            buttonText='_CANCEL'
                            onClick={() => onAnnul()}
                        />
                    </li>
                </ul>
            </section>
        </div>
    );
};

export default withTranslation()(UserCreator);