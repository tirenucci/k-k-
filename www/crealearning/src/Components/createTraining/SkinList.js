import React, { Fragment } from 'react'

//i18n
import { withTranslation } from 'react-i18next'

//Utilitaire
import Fields from '../formWidget/Fields'
import Image from '../Image'

//Style
import './SkinList.scss'

function SkinList({allTheme, skin, onSkinClick, t, filter, input, handleChange, showSkinPreview}) {

    let search
    
    /*Au clic selectionne l'élément*/
    function handleSelected(event, index, skin){
        event.preventDefault()
        let selected = document.getElementsByClassName('selected')
        let li = document.getElementsByClassName('skin__el')
        let actif = document.getElementsByClassName('actif')
        
        if (selected.length > 0) {
            selected[0].classList.remove('selected')
        } 
        if (actif.length > 0) {
            actif[0].classList.remove('actif')
        }

        if (li){
            li[index].classList.add('selected')
            li[index].getElementsByClassName('color')[skin].classList.add('actif')
        } 
    }

    return(
        <ul className='skins__list'>
            {
                filter ?
                    <Fields
                        liClass='search__skin'
                        htmlFor='searchSkin' 
                        text='_SKIN_SEARCH'
                        inputType='text'
                        size='40'
                        value={input}
                        onChange={(e, target) => handleChange(e, 'searchWord')}
                    />
                :
                    <Fragment/>
            }
            {
                input !== undefined ?
                <Fragment>
                    {search = new RegExp(input, 'i'),
                    allTheme = allTheme.filter(theme => search.test(theme.title))}
                </Fragment>
                : 
                <Fragment/>,
                allTheme.map((theme, index) => (
                    <li className='skin__el' key={index}  onClick={(event) => handleSelected(event, index, theme.default_skin)}>
                        <section className='template-container' onClick={(event) => skin(event, index)}>
                            {
                                theme['skin'] !== undefined ?
                                    <Image src={`/assets/skins/${theme.folder_name}/${theme['skin'][theme.default_skin].folder_name}/thumb.jpg`} alt='_SKIN_IMG'/>
                                :
                                    <Image src='/assets/img/default-thumb.jpg' alt='_NO_PICTURE'/>
                            }
                            <a onClick={(event, src) => showSkinPreview(event,`/assets/skins/${theme.folder_name}/${theme['skin'][theme.default_skin].folder_name}/thumb.jpg`)} href={'/assets/skins/' + theme.folder_name + '/' + theme['skin'][theme.default_skin].folder_name + '/thumb.jpg'} className='skin__preview__btn' title={t('_SKIN_PREVIEW')}>{t('_SKIN_PREVIEW')}</a>
                            <h4>{t(theme.title)}</h4>
                            <ul className='color-container'>
                                {
                                    theme.skin !== undefined ?
                                        theme.skin.map((s, key) => (
                                            <a key={key} href='#activate' className='color' onClick={(event, i, id, k) => onSkinClick(event, index, s.id, key)}>
                                                <span className='color-buble' title={t(s.color)} style={{backgroundColor: s.color_code}}></span>
                                            </a>
                                                
                                        )) 
                                    : 
                                        <Fragment/>
                                }
                            </ul>
                        </section>
                    </li>  
                ))
            }
        </ul>
    )
}

export default withTranslation()(SkinList)