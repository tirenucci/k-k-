import React, {Fragment, Component} from 'react'
import cookie from 'react-cookies'

//i18n
import { Translation } from 'react-i18next'

//Utilitaires
import Button from '../formWidget/Button'
import Input from '../html/Input'
import Fields from '../formWidget/Fields'
import Image from '../Image'

//Pour l'onglet propriétés
import SkinList from '../createTraining/SkinList'
//Pour les habillages
import SkinPreview from '../modal/SkinPreview'

//Style
import './PropertyForm.scss'
import {fetchApi} from "../../Utils/Fetch";

class PropertyForm extends Component {
    constructor({props}){
        super(props)
    }

    state = {
        skinTheme: [],
        width : 0,
        newLangue: '',
        options: [
            {'value': true, 'textTranslate':'_YES' },
            {'value': false, 'textTranslate':'_NO' }
        ],
        optionLicence: [
            {'value':'_CC', 'text': 'Creative Commons NC BY SA'}
        ],
        optionLicence2: [
            {'value':'_CC', 'text': 'Creative Commons NC BY SA'},
            {'value':'_PROPRIETARY', 'textTranslate': '_OWNER'}
        ]
    }

    //Handle générique qui prend en compte les changements dans les inputs 
    handleChange = (event, target) => { //On récupère l'évènement et un id du membre
        let state = this.state
        state[target] = event.target.value
        this.setState(state) //Mise à jour du state
    }

    componentDidMount = async() => {
        await this.getAllSkinTheme()
        document.addEventListener('mousedown', this.handleClick, false)
    }

    componentWillUnmount(){
        document.removeEventListener('mousedown', this.handleClick, false)
    }

    handleClick = (e) => {
        if (!this.nodeLang.contains(e.target) && !this.nodeSelectLang.contains(e.target)){
            let language = document.getElementsByClassName('all__language__sort')[0]
            language.classList.remove('display')
        }
    }

    skinHandle = (event, id) => {
        if (this.state.themeSelected === undefined && this.state.skinSelected === undefined)
            this.setState({themeSelected: id, skinSelected: 0})
        if (this.state.themeSelected !==  id)
        {
            const skin = this.state.skinTheme[id].skin[this.state.skinTheme[id].default_skin].id
            this.setState({themeSelected: id, skin})
        }
    }

    onSkinClick = (event, index, id, key) => {
        const theme = this.state.skinTheme[index]
        theme.default_skin = key
        this.setState({skin: id, themeSelected: index})
    }

    arrayContains(lang){
        let returning = false
        if (lang !== undefined && this.state.languages !== undefined){
            this.state.languages.map((language) => {
                if (lang.label === language.label){
                    returning = true
                }
            })
        }
        return returning
    }



    async getAllSkinTheme(){
        let response = await fetchApi('training/get_all_theme', 'GET')

        if (response){
            let skinTheme = await response
            this.setState({skinTheme})
            await this.getLanguage()
        }
    }

    async getLanguage(){
        let response = await fetchApi(`training_language/get_all_by_training?id=${this.props.training.id}`, 'GET')

        if (response){
            const languages = await response
            await this.getAllLanguage()
            this.setState({languages})
        }
    }

    async getAllLanguage(){
        let response = await fetchApi(`training_language/get_all`, 'GET')

        if (response){
            const languageEnable = await response
            this.setState({languageEnable})
        }
    }

    deleteLang(event, key){
        let {languages} = this.state
        languages.splice(key, 1)
        this.setState({languages})
    }

    handleEnterNewLangue(){
        let language = document.getElementsByClassName('all__language__sort')[0]
        language.classList.add('display')
    }

    addLanguage(event, key){
        let language = this.state.languageEnable[key]
        let {languages} = this.state
        languages.push(language)
        this.setState({languages})
    }

    render() {
        setTimeout(() => {
            this.setState({width: window.innerWidth})
        }, 100)

        return(
            <Fragment>
                <form className='property__form' onSubmit={(event) => event.preventDefault()}>
                    <fieldset>
                        <legend><Translation>{t => t('Propriétés')}</Translation></legend>
                        <ul>
                            <Fields htmlFor='trainingName' text='_NAME' inputType='text' onChange={(event, field) => this.props.handleChange(event, 'name')} value={this.props.training.name}/>
                            <Fields htmlFor='trainingDescription' text='_DESCRIPTION' textarea={true} value={this.props.training.description} onChange={(event, field) => this.props.handleChange(event, 'description')}/>
                            <ul className='property__one__row'>
                                    <Fields htmlFor='trainingVersion' text='_VERSION' inputType='text' value={this.props.training.version} onChange={(event, field) => this.props.handleChange(event, 'version')}/>
                                    <Fields htmlFor='duration' text='_DURATION' inputType='text' value={this.props.training.duration}  onChange={(event, field) => this.props.handleChange(event, 'duration')}/>
                                    <Fields htmlFor='trainingStatus' text='_STATUS' value={this.props.training.status} onChange={(event, field) => this.props.handleChange(event, 'status')} options={this.state.options}/>
                                    <Fields htmlFor='questionsWeight' text='_PROPERTIES_QUESTIONS' value={this.props.training.show_ponderation} onChange={(event, field) => this.props.handleChange(event, 'show_ponderation')} options={this.state.options}/>
                                {
                                    this.props.offer === 'open' ? 
                                        <Fields 
                                            htmlFor='licence' 
                                            text='_PROPERTIES_LICENCE' 
                                            title='_PROPERTIES_LICENCE_IF_OPEN' 
                                            disabled={true} 
                                            options={this.state.optionLicence}
                                        />
                                    : 
                                    this.props.offer === 'pro' || 'logipro' ?
                                        <Fields 
                                            htmlFor='licence' 
                                            text='_PROPERTIES_LICENCE' 
                                            title='_PROPERTIES_LICENCE_IF_OPEN' 
                                            options={this.state.optionLicence2}
                                            onChange={(event, field) => this.props.handleChange(event, 'licence')}
                                        />
                                    :
                                        <Fragment/>
                                }
                            </ul>
                            <Fields
                                liClass='all__language__sort_parent'
                                htmlFor='moduleLanguage' 
                                text='_TRAINING_LANG' 
                                helpTitle='_TRAINING_LANG_HELP'
                            >
                                <ul className={`language-list ${undefined !== this.state.languages && this.state.languages.length === 0 ? "error__input" : ""}`} ref={nodeLang => this.nodeLang = nodeLang}>
                                        {
                                            this.state.languages !== undefined ?
                                            this.state.languages.map((lang, key) => (
                                                <Fragment>
                                                    <li key={key} className='language-element'>
                                                        <Input classname='selected-language' name='moduleLanguage' valueTranslate={lang.label_fr} value={`(${lang.label})`} disabled/>
                                                        <Button
                                                            buttonText='x'
                                                            buttonTitle='_REMOVE'
                                                            onClick={(event, k) => this.deleteLang(event, key)}
                                                        />
                                                    </li>
                                                </Fragment>
                                            ))
                                            : <Fragment />
                                        }
                                    <li className='blank-element' onClick={() => this.handleEnterNewLangue()}>
                                        <input name='moduleLanguage' value={this.state.newLangue} size='' onChange={(event, t) => this.handleChange(event, 'newLangue')} />
                                    </li>
                                </ul>
                                <div className='all__language__sort' ref={nodeSelectLang => this.nodeSelectLang = nodeSelectLang}>
                                    <ul>
                                        {
                                            this.state.languageEnable !== undefined && this.state.languageEnable instanceof Array ?
                                                this.state.languageEnable.map((lang, key) => (
                                                    lang['active'] === true ?
                                                        this.arrayContains(lang) === false ?
                                                            <li id='item' key={key} onClick={(event, k) => this.addLanguage(event, key)}>{lang.label} (<Translation>{t => t(lang.label_fr)}</Translation>)</li>
                                                        :
                                                            <li id='item-using' key={key}>{lang.label} (<Translation>{t => t(lang.label_fr)}</Translation>)</li>
                                                    :
                                                        <Fragment/>
                                                ))
                                            :
                                                <Fragment/>
                                        }
                                    </ul>
                                </div>
                            </Fields>
                            <Fields
                                htmlFor='tags' 
                                text='_TAGS'
                            >
                                <ul className='tag-list'>
                                    {
                                        undefined !== this.props.tags ?
                                            this.props.tags.map((tag, key) => (
                                                '' !== tag ? 
                                                    <li className='tag-element' key={key}>
                                                        <Input id={'tag-' + key} classname='selected-tag' type='text' name='tags' size={tag.length} value={tag} disabled/>
                                                        <Button
                                                            buttonText='x'
                                                            buttonTitle='_REMOVE'
                                                            onClick={(event, k) => this.props.deleteTag(event, key)}
                                                        />
                                                    </li>
                                                : 
                                                    <Fragment/>
                                            ))
                                        :
                                            <Fragment/>
                                    }
                                    {
                                        //L'input initial si le champ est vide
                                    }
                                    <li className='blank-element'>
                                        <input name='tags' id='newtags' size='' onKeyDown={(event, key) => this.props.newTag(event, key)} autoComplete='true'/>
                                    </li>
                                </ul>
                                <p className='text-help'><Translation>{t => t('_PROPERTIES_TAG_HELP')}</Translation></p>
                            </Fields>
                            {
                                this.state.width < 700 ?
                                    <Fields
                                        liClass='skins__wrapper'
                                        text='_SKIN_SEARCH'
                                    >
                                        {
                                            this.state.showSkinPreview ?
                                            <SkinPreview
                                                src={this.state.previewSrc}
                                                onAnnul={() => this.setState({showSkinPreview:false})}
                                            />
                                            :
                                            <Fragment/>
                                        }
                                        <SkinList
                                            allTheme={this.state.skinTheme}
                                            skin={(event, id) => this.skinHandle(event, id)}
                                            handleSelected={(event, key) => this.handleSelected(event, key)}
                                            skinSelected={this.state.skinSelected}
                                            themeSelected={this.state.themeSelected}
                                            skinActif={this.state.skin}
                                            onSkinClick={(event, index, id, key) => this.onSkinClick(event, index, id, key)}
                                            showSkinPreview={(event, src) => this.setState({showSkinPreview:true, previewSrc: src})}
                                        />
                                    </Fields>                                       
                                : 
                                    <Fragment/>
                            }
                            <Fields
                                liClass='property__logo'
                                htmlFor='logoImage' 
                                text='_LOGO'
                                inputType='file'
                                sentence='_PROPERTIES_IMG_TYPE'
                                onChange={(event) => this.props.takeNewImage(event)}
                            />
                            {
                                this.props.training.logo !== '0' ? 
                                <Image src={this.props.training.logo} width='100' alt='_LOGO'/>
                                : 
                                <Image src='/assets/img/small-default-thumb.png' alt='_NO_PICTURE' figcaptionText='_NO_PICTURE'/>
                            }
                            <li>
                                <p className='position__text'><Translation>{t => t('_PROPERTIES_LOGO')}</Translation></p>
                                <ul className='logo__position'>
                                    <Fields htmlFor='positionLeft' text='_LEFT' inputType='radio' checked={this.props.training.logo_position === 'left'} value='left' onChange={(event, field) => this.props.handleChange(event, 'logo_position')}/>
                                    <Fields htmlFor='positionCenter' text='_CENTER' inputType='radio' checked={this.props.training.logo_position === 'center'} value='center' onChange={(event, field) => this.props.handleChange(event, 'logo_position')}/>
                                    <Fields htmlFor='positionRight' text='_RIGHT' inputType='radio' checked={this.props.training.logo_position === 'right'} value='right' onChange={(event, field) => this.props.handleChange(event, 'logo_position')}/>
                                </ul>
                            </li>
                            <li>
                                <label><Translation>{t => t('_PROPERTIES_GRAINS')}</Translation><span>{this.props.training.grain_count}</span></label>
                            </li>

                            <li>
                                <label><Translation>{t => t('_PROPERTIES_GRAINS_DURATION')}</Translation><span>{this.props.training.grain_duration}</span></label>
                            </li>
                            <li>
                                <label><Translation>{t => t('_PROPERTIES_DATE')}</Translation><span>{this.props.training.created_at}</span></label>
                            </li>
                            <li>
                                <label><Translation>{t => t('_PROPERTIES_UPDATE_DATE')}</Translation><span>{this.props.training.updated_at}</span></label>
                            </li>
                            <li>
                                <label><Translation>{t => t('_PROPERTIES_WEIGHT')}</Translation><span>{this.props.training.disk_space}</span></label>
                            </li>
                        </ul>
                    </fieldset>
                    {
                        this.state.width > 700 ?
                            <Fragment>
                                 {
                                     this.state.showSkinPreview ?
                                     <SkinPreview
                                        src={this.state.previewSrc}
                                        onAnnul={() => this.setState({showSkinPreview:false})}
                                     />
                                     :
                                     <Fragment/>
                                 }
                                <SkinList
                                    input={this.state.searchWord}
                                    handleChange={(e, target) => this.handleChange(e, target)}
                                    filter={true}
                                    allTheme={this.state.skinTheme}
                                    skin={(event, id) => this.skinHandle(event, id)}
                                    handleSelected={(event, key) => this.handleSelected(event, key)}
                                    skinSelected={this.state.skinSelected}
                                    themeSelected={this.state.themeSelected}
                                    skinActif={this.state.skin}
                                    onSkinClick={(event, index, id, key) => this.onSkinClick(event, index, id, key)}
                                    showSkinPreview={(event, src) => this.setState({showSkinPreview:true, previewSrc: src})}
                                />
                            </Fragment>
                        : 
                            <Fragment/>
                    }
                </form>
                <ul className='btn__list inherit'>
                    <li>
                        <Button 
                            className='orange__btn' 
                            buttonType='submit'
                            buttonText='_SAVE' 
                            onClick={(event, skin_id, languages) => this.state.languages.length !== 0 ? this.props.handleSubmit(event, this.state.skin, this.state.languages) : null}
                        />
                    </li>
                </ul>
            </Fragment>
        )   
    }
}

export default PropertyForm