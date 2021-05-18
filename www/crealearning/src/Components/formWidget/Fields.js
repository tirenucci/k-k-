import React, { Fragment } from 'react'

//i18n
import { withTranslation } from 'react-i18next'

//Utilitaires
import HelpIcon from './HelpIcon'
import Option from '../html/Option'

//Style
import './Fields.scss'

const Fields = ({t, liClass, className, htmlFor, textTranslate, required, colon, text, inputType, helpTitle, value, onChange, textarea, options, title, disabled, textareaClass, textareaText, checked, sentence, defaultValue, placeholder, size, min, children, maxLength, cols, rows, onKeyDown, pattern, ref, dataInput, accept}) => {
    return (
        <li className={`fields__el ` + liClass}>
            <label className={className} htmlFor={htmlFor} required={false}>
                {t(text)}
                {
                    required === true ? 
                        '*' 
                    : colon ?
                        ' : '
                    :
                        ''
                }
                {
                    helpTitle !== undefined ?
                    <HelpIcon helpTitle={helpTitle}/>
                    :
                    <Fragment/>
                }
            </label>
            {
                inputType ? 
                    <input 
                        type={inputType} 
                        id={htmlFor} 
                        name={htmlFor} 
                        value={textTranslate ? t(textTranslate) : value} 
                        checked={checked} 
                        onChange={onChange} 
                        required={required} 
                        placeholder={t(placeholder)}
                        size={size} 
                        min={min} 
                        maxLength={maxLength} 
                        disabled={disabled} 
                        onKeyDown={onKeyDown} 
                        pattern={pattern} 
                        ref={ref} 
                        data-input={dataInput}
                        accept={accept}    
                    >
                    </input>
                : textarea ? 
                    <textarea className={textareaClass} name={htmlFor} id={htmlFor} onChange={onChange} value={value} placeholder={t(placeholder)} cols={cols} row={rows}>{t(textareaText)}</textarea>
                : options ?
                    <select name={htmlFor} id={htmlFor} title={t(title)} disabled={disabled} required={required} value={value} onChange={onChange}>
                        {
                            options instanceof Array ?
                                options.map((option, key) => (
                                    <Option
                                        key={key}
                                        value={option.value}
                                        textTranslate={option.textTranslate}
                                        text={option.text}
                                        title={option.title}
                                    />
                                ))
                            :
                                <Fragment/>
                        }
                    </select>
                :
                    <Fragment/>
            }
            {
                sentence ?
                    <p>{t(sentence)}</p>
                :
                    children
                
            }
        </li>
    )
}

export default withTranslation()(Fields)