import React from 'react'

import { withTranslation } from 'react-i18next'

import Button from '../formWidget/Button'

import './Modal.scss'

const SendBlockModal = ({onAnnul, sendBlock, t, grain, lang}) => {
    return (
         <div className='modal__wrapper'>
            <section className='modal__section'>
                <h4>{t('_SEND_GRAIN')}</h4>
                <Button 
                    className='close__btn' 
                    buttonTitle='_CLOSE'
                    type='button'
                    onClick={(event) => onAnnul(event)}
                />
                <article className='grain-selector'>
                    <label htmlFor='selectGrain'>{t('_SEND_MESSAGE')}</label>
                    <select name='selectGrain' id='grainSelector'>
                        {
                            grain.map((g, key) => (
                                <option value={g.id}>{g.name[lang]}</option>
                            ))
                        }
                    </select>
                </article>
                <ul className='modal__btn__list'>
                    <li>
                        <Button
                            className='orange__btn'
                            type='button'
                            buttonText='_SEND'
                            onClick={(event) => sendBlock(event)}
                        />
                    </li>
                    <li>
                        <Button
                            className='grey__btn'
                            type='button'
                            buttonText='_CANCEL'
                            onClick={(event) => onAnnul(event)}
                        />
                    </li>
                </ul>
            </section>
        </div>
    );
};

export default withTranslation()(SendBlockModal)