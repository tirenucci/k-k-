import React from 'react'
import { withTranslation } from 'react-i18next'

import Button from '../formWidget/Button'

import './Modal.scss'
import Fields from "../formWidget/Fields";

const EditLanguageModal = ({idlang,handleChange, onAnnul, onOk, t}) => {
    return (
        <div className='modal__wrapper'>
            <section className='modal__section'>
                <h4>{t('_EDIT')}</h4>
                <Button
                    className='close__btn'
                    buttonTitle='_CLOSE'
                    type='button'
                    onClick={(event) => onAnnul(event)}
                />
                <img src={`/assets/img/flag/${idlang.image_name}`} alt={t('_LANG_FLAG')}/>
                <article>
                    <form className='skinTheme__form' onSubmit={(event)=>onOk(event)}>
                        <fieldset>
                            <ul>
                                <Fields
                                    htmlFor='name'
                                    text='_NAME'
                                    inputType='text'
                                    value={t(idlang.label_fr)}
                                    disabled={true}
                                />
                                <select onChange={(event)=>handleChange(event)} value={idlang.active}>
                                    <option value={true}>{t('_ACTIVATE')}</option>
                                    <option value={false}>{t('_DESACTIVATE')}</option>
                                </select>
                            </ul>
                        </fieldset>
                        <ul className='btn__list'>
                                <li>
                                    <Button
                                        className='orange__btn delete-training'
                                        type='submit'
                                        buttonText='_EDIT'
                                        onClick={(e)=>onOk(e)}
                                    />
                                </li>
                                <li>
                                    <Button
                                        className='grey__btn'
                                        type='submit'
                                        buttonText='_CANCEL'
                                        onClick={(event) => onAnnul(event)}
                                    />
                                </li>
                            </ul>
                    </form>
                </article>
            </section>
        </div>
    )
}

export default withTranslation()(EditLanguageModal)