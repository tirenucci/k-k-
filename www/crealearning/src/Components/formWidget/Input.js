import React from 'react'

import { withTranslation } from 'react-i18next'

import Image from '../Image'

import './Input.scss'

function Input({ labelText, inputType, value, className, onchange, t, autocomplete, name, info=false, disabled=false}){
    return(
        <li className='input-div'>
            {
                info === true  ?
                <label title={t('_ID_EXPLAIN')} className='label'>{t(labelText)}<i className='material-icons'>info</i></label>
                :
                <label className='label'>{t(labelText)}</label>
            }
            <span className={'input-' + inputType + ' img-input'}>
                <input name={name !== undefined ? name : ''} className={className} type={inputType} value={value} onChange={onchange} autoComplete={autocomplete} disabled={disabled}/>
            </span>
        </li>
    )
}

export default withTranslation()(Input)