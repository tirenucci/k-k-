import React, { Fragment } from 'react'

//Utilitaire
import Button from '../../formWidget/Button'

const AllSkin = ({skin, theme, theme_folder, handleClick, handleEnableClick, handleDisableClick, handleClickSkin, showSkinPreview}) => {
    return (
        <section className='skin__section one__skin'>
            <ul className='global__color__btn__list'>
                <li>
                    <Button
                        className='activated'
                        buttonType='button'
                        buttonText='_SKIN_COLORS_ACTIVE'
                        onClick={() => handleEnableClick()}
                    />
                </li>
                <li>
                    <Button
                        className='desactivated'
                        buttonType='button'
                        buttonText='_SKIN_COLORS_INACTIVE'
                        onClick={() => handleDisableClick()}
                    />
                </li>
            </ul>
            <ul className='skin__list'>
                {
                    skin !== undefined ?
                    skin.map((s, key) => (
                        <li className='skin__el' key={key}>
                            <section className='skin__el__theme'>
                                <span  onClick={(event) => handleClickSkin(event, s.id)} className='img__wrapper' style={{backgroundImage: 'url(/assets/skins/'+ theme_folder +'/'+ s.folder_name + '/thumb.jpg)'}}></span>
                                <Button 
                                    className='skin__preview__btn'
                                    buttonTitle='_SKIN_PREVIEW'
                                    onClick={(event, src) => showSkinPreview(event,`/assets/skins/${theme.folder_name}/${theme['skin'][theme.default_skin].folder_name}/thumb.jpg`)} 
                                />
                                <ul className='switch__color'>
                                    {
                                        s.status === '_ACTIVE' ? 
                                        <Button
                                            className='activ__btn'
                                            buttonTitle='_COLOR_DESACTIVATE'
                                            buttonText='_ACTIVATE'
                                            onClick={(event) => handleClick(event, key)}
                                        />
                                        :
                                        <Button
                                            className='desactiv__btn'
                                            buttonTitle='_COLOR_ACTIVATE'
                                            buttonText='_DESACTIVATE'
                                            onClick={(event) => handleClick(event, key)}
                                        />
                                    }
                                    <li className='color'>
                                        <li className={`${s.status === '_ACTIVE' ? 'activ__color' : 'inactiv__color'}`} key={key}>
                                            <span className='color-span' style={{backgroundColor: s.color_code}}>{s.color}</span>
                                        </li> 
                                    </li>
                                </ul>
                            </section>
                        </li>
                    )) :
                    <Fragment/>
                }
            </ul>
        </section>
    )
}

export default AllSkin