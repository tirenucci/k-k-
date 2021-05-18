import React, {Fragment} from 'react'

//i18n
import { withTranslation } from 'react-i18next'

//Utilitaires
import Image from '../Image'
import Button from '../formWidget/Button'

//Style
import './SkinTheme.scss'

const SkinTheme = ({allTheme, handleClick, onThemeClick, t, pages, currentPage, search, status}) => {
    return(
        <ul className='skin__list'>
            {
                allTheme.slice(currentPage * 25, currentPage * 25 + 25).map((theme, key) => (
                    theme['title'].toLowerCase().includes(search.toLowerCase()) ?
                        status !== '_ALL' ?
                            theme['status'] === status ?
                                <li className='skin__el' key={key}>
                                    <section className='skin__el__theme'>
                                        {
                                            theme['skin'] !== undefined ?
                                                <span className='image-span'  onClick={(event, id) => onThemeClick(event, theme.id)} style={{backgroundImage: 'url(/assets/skins/' + theme.folder_name + '/' + theme['skin'][0].folder_name + '/thumb.jpg)'}}>
                                    <Image src={'/assets/skins/' + theme.title + '/' + theme['skin'][0].folder_name + '/thumb.jpg'} alt='_SKIN'/>
                                </span>
                                                :
                                                <span className='image-span'  onClick={(event, id) => onThemeClick(event, theme.id)} style={{backgroundImage: 'url(/assets/img/default-thumb.jpg)'}}>
                                    <Image src={'/assets/img/default-thumb.jpg'} alt='_DEFAULT_SKIN'/>
                                </span>
                                        }
                                        <h3 onClick={(event, id) => onThemeClick(event, theme.id)}>{t(theme.title)}</h3>
                                        <div className='switch__color'>
                                            {
                                                theme.status === '_ACTIVE' ?
                                                    <Button
                                                        className='activ__btn'
                                                        buttonTitle='_THEME_DESACTIVATE'
                                                        buttonText='_ACTIVATE'
                                                        onClick={(event) => handleClick(event, key)}
                                                    />
                                                    :
                                                    <Button
                                                        className='desactiv__btn'
                                                        buttonTitle='_THEME_ACTIVATE'
                                                        buttonText='_DESACTIVATE'
                                                        onClick={(event) => handleClick(event, key)}
                                                    />
                                            }
                                            <ul className='color'>
                                                {
                                                    theme['skin'] !== undefined ?
                                                        theme['skin'].map((s, key) => (
                                                            <li className={`${s.status === '_ACTIVE' ? 'activ__color' : 'inactiv__color'}`} key={key}>
                                                                <span style={{backgroundColor: s.color_code}}>{s.color}</span>
                                                            </li>
                                                        ))
                                                        :
                                                        <Fragment/>
                                                }
                                            </ul>
                                        </div>
                                    </section>
                                </li>
                                :
                                <Fragment/>
                            :
                            <li className='skin__el' key={key}>
                                <section className='skin__el__theme'>
                                    {
                                        theme['skin'] !== undefined ?
                                            <span className='img__wrapper'  onClick={(event, id) => onThemeClick(event, theme.id)} style={{backgroundImage: 'url(/assets/skins/' + theme.folder_name + '/' + theme['skin'][0].folder_name + '/thumb.jpg)'}}>
                            <Image src={'/assets/skins/' + theme.title + '/' + theme['skin'][0].folder_name + '/thumb.jpg'} alt='_SKIN'/>
                        </span>
                                            :
                                            <span className='img__wrapper'  onClick={(event, id) => onThemeClick(event, theme.id)} style={{backgroundImage: 'url(/assets/img/default-thumb.jpg)'}}>
                            <Image src={'/assets/img/default-thumb.jpg'} alt='_DEFAULT_SKIN'/>
                        </span>
                                    }
                                    <h3 onClick={(event, id) => onThemeClick(event, theme.id)}>{t(theme.title)}</h3>
                                    <div className='switch__color'>
                                        {
                                            theme.status === '_ACTIVE' ?
                                                <Button
                                                    className='activ__btn'
                                                    buttonTitle='_THEME_DESACTIVATE'
                                                    buttonText='_ACTIVATE'
                                                    onClick={(event) => handleClick(event, key)}
                                                />
                                                :
                                                <Button
                                                    className='desactiv__btn'
                                                    buttonTitle='_THEME_ACTIVATE'
                                                    buttonText='_DESACTIVATE'
                                                    onClick={(event) => handleClick(event, key)}
                                                />
                                        }
                                        <ul className='color'>
                                            {
                                                theme['skin'] !== undefined ? theme['skin'].map((s, key) => (
                                                        <li className={`${s.status === '_ACTIVE' ? 'activ__color' : 'inactiv__color'}`} key={key}>
                                                            <span style={{backgroundColor: s.color_code}}>{s.color}</span>
                                                        </li>
                                                    ))
                                                    :
                                                    <Fragment/>
                                            }
                                        </ul>
                                    </div>
                                </section>
                            </li>
                        :
                        <Fragment/>
                ))
            }
        </ul>
    )
}

export default withTranslation()(SkinTheme)
