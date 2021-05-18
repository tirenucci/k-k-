import React, { Component, Fragment } from 'react'
import JSZip from 'jszip'
import { Redirect } from 'react-router-dom'

//i18n
import { Translation } from 'react-i18next'

//Utilitaires
import NavBarSecondary from '../NavBarSecondary'
import FlashMessage from '../FlashMessage'
import Button from '../../Components/formWidget/Button'
import Image from '../Image'
import Fields from '../formWidget/Fields'

//TabMenu
import SkinExist from '../modal/SkinExist'

//Style
import './TabMenu.scss'
import {fetchApi} from "../../Utils/Fetch";

class TabMenu extends Component {
    state = {
        //State pour la gestion du menu par onglets
        tabProp: true,//Par défaut, c'est l'onglet propriétés qui est actif
        tabPropClass: 'onglet-lien actif', //Classe de l'onglet Propriétés
        tabDeleteClass: 'onglet-lien',
        skinDiv: 'displayed', //Affichage du formulaire de l'onglet Propriétés
        deleteDiv: 'masked',
        colorName: '',
        colorCode: '',
        themes: [],//le tableau qui va récupérer les données de l'API
        position: '',
        theme: this.props.theme,    //id du theme
        fileInput: '',
        author: '',
        description: '',
        version: '',
        name: '',
        redirectToTemplate: false,
        redirectHGP: false,  //Redirection vers la page 'Habillage graphique - Propriétés / Supprimer l'habillage'
        redirectHGT: false,    //Redirection vers la page 'Habillage graphique - Thème / Supprimer'
        skinExist: false,
        redirect_state:'',
        redirect_path:'',
        message: '',
        tabs: [
            {'text': '_PROPERTIES', 'class': 'tab__link actif', 'link': '#pro'}
        ],
        zipContent: [],
    }

    //Important : On lance la fonction dans le constructeur et non pas dans componentDidMount car il faut que ca s'exécute en premier
    constructor(props){
        super(props)
        this.state.fileInput = React.createRef()
    }

    componentDidMount = async() => {
        await this.getUserInformation()
        await this.getAllThemes(this.state.theme)
    }

    async getAllThemes(theme){  //Passage du paramètre Thème pour la gestion de l'ordre suivant le thème choisi
        let response = await fetchApi(`skin/get_all_by_theme?society_id=${window.$user.society_id}&theme=${theme}`, 'GET')

        if (response){
            const themesAndPosition = await response  //On récupère la liste de tous les thèmes
            const position = themesAndPosition[1] //On récupère la position dans le deuxième tableau, après les thèmes [0]
            const themes = themesAndPosition[0]
            this.setState({themes, position})
        }
    }

    //Handle générique qui prend en compte les changements dans les inputs 
    handleChange = (event, target) => { //On récupère l'évènement et un id du membre
        let state = this.state
        state[target] = event.target.value
        this.setState(state) //Mise à jour du state
    }

    handleChangeTab = () => {
        if (this.props.hash !== '#delete')
        {
            this.setState({deleteDiv: 'displayed', skinDiv: 'masked'})
        }
        else
        {
            this.setState({deleteDiv: 'masked', skinDiv: 'displayed'})
        }
    }

    //Handle qui prend en charge les changements de la liste déroulante Thème
    handleChangeSelect = async(event) => {
        const theme = event.target.value//récup de la valeur de la liste
        this.setState({theme})
        //réactualisation du champ Ordre avec la position du theme choisi
        await this.getAllThemes(theme)   //On passe le nouveau thème à l'API pour récupérer la nouvelle position
    }

    //Affichage du thumb du skin uploadé et lecture du creamanifest.xml
    //Important : faire une fonction fléchée pour pas avoir d'erreur.
    uploadSkin = () => {
        const zip = new JSZip()
        const {fileInput} = this.state
        let _this = this

        //récupération des states
        let author = this.state.author
        let description = this.state.description
        let version = this.state.version
        let name = this.state.name
        let colorCode = this.state.colorCode
        let colorName = this.state.colorName

        zip.loadAsync(fileInput.current.files[0])
            .then((zip) => {
                this.setState({zipContent: zip.files})

                zip.files['creamanifest.xml'].async('string')
                .then((data) => {
                    //Mise en place du parser XML
                    let parser = new DOMParser()
                    let xmlDoc = parser.parseFromString(data,'text/xml')

                    //Affichage de l'auteur
                    const authorXML = xmlDoc.getElementsByTagName('author')[0].childNodes[0].nodeValue
                    document.getElementById('author').innerHTML = authorXML
                    author = authorXML
                    this.setState({author})

                    //Affichage de la description
                    const descriptionXML = xmlDoc.getElementsByTagName('description')[0].childNodes[0].nodeValue
                    document.getElementById('description').innerHTML = descriptionXML
                    description = descriptionXML
                    this.setState({description})

                    //Affichage de la version
                    const versionXML = xmlDoc.getElementsByTagName('version')[0].childNodes[0].nodeValue
                    document.getElementById('version').innerHTML = versionXML
                    document.getElementById('version').style = 'color: rgb(255, 0, 0)'
                    version = versionXML
                    this.setState({version})    

                    //Affichage du nom
                    const nameXML = xmlDoc.getElementsByTagName('name')[0].childNodes[0].nodeValue
                    document.getElementById('name').innerHTML = nameXML
                    name = nameXML
                    this.setState({name})

                    //ColorCode
                    const colorCodeXML = xmlDoc.getElementsByTagName('color_code')[0].childNodes[0].nodeValue
                    colorCode = colorCodeXML
                    this.setState({colorCode})

                    //ColorName
                    const colorNameXML = xmlDoc.getElementsByTagName('color_name')[0].childNodes[0].nodeValue
                    colorName = colorNameXML
                    this.setState({colorName})

                    //Affichage de la div archive__infos
                    document.getElementById('archive__infos').style = 'display: block'

                    //console.log(data)
                })

                zip.files['thumb.jpg'].async('base64')
                .then(function (thumb) {
                    //Affichage de l'aperçu du skin
                    let image =  document.getElementById('thumb')
                    image.src = 'data:image/jpgbase64, ' + thumb
                    //console.log(thumb)

                    //Affichage de l'image de l'habillage : on passe la propriété display : none du css en block
                    document.getElementById('skin__thumb').style.display = 'block'
                })

            }, function() {
                _this.setState({flashMessage: true, messageClass: 'error', message: '_SKIN_FILE_ERROR'})
                setTimeout(() => {
                    _this.setState({flashMessage: false})
                }, 1500)
            })
    }

    async unzip(skin_folder, theme_folder, id){
        const formData = new FormData()
        formData.append('skin', document.getElementById('upload__btn').files[0])
        formData.append('skin_folder', skin_folder)
        formData.append('theme_folder', theme_folder)
        let response = await fetchApi('skin/extract_zip', 'POST', true, formData, false)

        if (!response) {
            this.setState({redirect: true, redirect_path: '/skin/' + id, redirect_state: {message: '_SKIN_IMPORT_SUCCESS', isRedirection: true}})
        }
    }

    //Vérification si le skin qu'on veut enregistrer n'existe pas déjà dans l'API
    async verifySkin(){
        //On vérifie le skin avec l'id de la société, le code couleur et le nom
        let response = await fetchApi(`skin/verify?theme_id=${this.state.theme}&color_name=${this.state.colorName}`, 'GET')

        if (!response){
            this.setState({skinExist: true})
        } else {
            await this.sendNewSkin()
        }
    }

    //Mise à jour du skin s'il existe déjà en BDD
    async updateSkin(){
        const {theme, position, colorName, colorCode, author, description, version, name} = this.state
        this.setState({skinExist: false})
        if (author !== '' && description !== '' && version !=='' && name !==''){
            let response = await fetchApi('skin/update', 'PUT', true, {
                society_id: `${this.state.user.society_id}`,
                theme_id: `${this.state.theme}`,
                position: `${this.state.position}`,
                colorName: `${this.state.colorName}`,
                colorCode: `${this.state.colorCode}`,
                author: `${this.state.author}`,
                description: `${this.state.description}`,
                version: `${this.state.version}`,
                name: `${this.state.name}`
            })


            if (response){
                const data = await response
                this.setState({flashMessage: true, messageClass:'success', message: '_SKIN_UPDATE_SUCCESS'})
                this.setState({redirectHG: true})
                await this.unzip(data['skin_folder'], data['theme_folder'], data['id'])
                setTimeout(() => {
                    this.setState({flashMessage: false})
                }, 1500)

            }
        }
    }

    //Import du nouveau skin dans l'API
    async sendNewSkin(){
        //Envoi du thème, de la position, du nom de la couleur et du code couleur en BDD
        //Envoi du zip uploadé
        const {theme, position, colorName, colorCode, author, description, version, name} = this.state

        if (author !== '' && description !== '' && version !=='' && name !==''){
            let response = await fetchApi('skin/new', 'POST', true, {
                society_id: `${this.state.user.society_id}`,
                theme_id: `${theme}`,
                position: `${position}`,
                colorName: `${colorName}`,
                colorCode: `${colorCode}`,
                author: `${author}`,
                description: `${description}`,
                version: `${version}`,
                name: `${name}`
            })

            if (response){
                const data = await response
                await this.unzip(data['skin_folder'], data['theme_folder'], data['id'])

            }
    
        }
    }

    //Handler qui s'exécute sur le Form Submit
    handleSubmit = async(event) => {
        event.preventDefault()
        await this.verifySkin()
    }

    //Bouton _CANCEL
    handleCancel = () => {
        this.setState({'redirectHGT': true})
    }

    render() {
        const {tabs, skinDiv, theme, fileInput, redirectHGP, redirect, skinExist, flashMessage, themes, redirect_state, redirect_path, redirectToTemplate} = this.state
        const { society_id } = window.$url
        //Redirection vers la page 'Habillage graphique : Thème / Supprimer'

        if (redirect)
        {
            return <Redirect to={{
                pathname: redirect_path,
                state: {redirect_state}
            }} />
        }

        //Redirection vers la page 'Habillage graphique : Propriétés / Supprime l'habillage'
        if (redirectHGP){
            return <Redirect to={`/skin/update/${society_id}/${theme}`}/>
        }

        if (redirectToTemplate){
            return <Redirect to={`/skintheme/${theme}`}/>
        }

        return (
            <Fragment>
                <NavBarSecondary 
                    tabs={tabs}
                    evenement={() => this.handleChangeTab()}
                    className='tab__menu'
                />
                <form className='form__skin'>
                    {
                        this.state.flashMessage ? 
                            <FlashMessage messageClass={this.state.messageClass}>{this.state.message}</FlashMessage> 
                        : this.state.skinExist ?
                            <SkinExist onAnnul={() => this.setState({skinExist: false})} onOk={() => this.updateSkin()} /> 
                        :
                            <Fragment/>
                    }
                    <Translation>
                    {(t) => <div id='skin' className={skinDiv}>
                        <fieldset>
                            <legend>{t('_ARCHIVE')}</legend>
                            <ul>
                                <Fields
                                    liClass='archive__field'
                                    htmlFor='fileSelector' 
                                    text='_SKIN_ARCHIVE'
                                    inputType='hidden' 
                                    dataInput='false'
                                    ref={fileInput}
                                >
                                    <Button
                                        id='btn_upload' 
                                        className='upload__btn'
                                        buttonType='button'
                                        buttonText='_DL_ARCHIVE'
                                        onClick={() => this.uploadSkin()}
                                        />
                                </Fields>
                            </ul>
                        </fieldset>
                        <fieldset>
                            <legend>{t('_PROPERTIES')}</legend>
                            <ul className='archive__infos'>
                                <li>
                                    {t('_AUTHOR')} :&nbsp;
                                    <span className='formOutput' title='' id='author'></span>
                                </li>
                                <li>
                                    {t('_DESCRIPTION')} :&nbsp;
                                    <span className='formOutput' title='' id='description'></span>
                                </li>
                                <li>
                                    {t('_VERSION')} :&nbsp;
                                    <span className='formOutput' title='' id='version'></span>
                                </li>
                                <li>
                                    {t('_NAME')} :&nbsp;
                                    <span className='formOutput' title='' id='name'></span>
                                </li>                            
                            </ul>
                            <p id='skin__thumb'>
                                <Image id='thumb' src='images/default-thumb.jpg' alt='_DEFAULT_SKIN'/>
                            </p>
                            <ul className='skin__info'>
                                <li>
                                    <ul className='one__row'>
                                        <Fields
                                            htmlFor='skinTheme' 
                                            text='_THEME' 
                                            helpTitle='_THEME_REQUIRED' 
                                            required={true}
                                            >
                                            <select required value={theme} onChange ={(e) => this.handleChangeSelect(e)} name='skinTheme' id='skinTheme' required>
                                                <option value=''></option>
                                                {
                                                    //On vérifie si le tableau des thèmes est bien parvenu pour afficher la liste déroulante
                                                    themes !== undefined ?
                                                        themes.map((theme, key) => (
                                                            <option key={key} value={theme.position}>{t(theme.title)}</option>
                                                        ))
                                                    : 
                                                        <Fragment/>
                                                }
                                            </select>
                                        </Fields>
                                        <Fields
                                            htmlFor='skinOrder' 
                                            text='_ORDER'
                                            inputType='number'
                                            value={this.state.position} 
                                            onChange={(e, target) => this.handleChange(e, 'position')}
                                        />
                                    </ul>
                                </li>
                                <li>
                                    <ul className='one__row'>
                                        <Fields
                                            htmlFor='skinColor' 
                                            text='_SKIN_COLOR'
                                            inputType='number'
                                            value={this.state.colorName} 
                                            onChange={(e, target) => this.handleChange(e, 'colorName')}
                                            helpTitle='_REQUIRED' 
                                            required={true}
                                        />
                                        <Fields
                                            htmlFor='colorCode' 
                                            text='_SKIN_COLOR_CODE' 
                                            helpTitle='_COLOR_FORMAT_REQUIRED' 
                                            required={true}
                                            inputType='text'
                                            value={this.state.colorCode} 
                                            onChange={(e,target) => this.handleChange(e, 'colorCode')}
                                            size='20'
                                        >
                                            <div className='circle' style={{backgroundColor: this.state.colorCode}}></div>
                                        </Fields>
                                    </ul>
                                </li>
                            </ul>
                        </fieldset>
                        <ul className='btn__list inherit'>
                            <li>
                                <Button
                                    className='orange__btn'
                                    type='submit'
                                    buttonText='_IMPORT'
                                    onSubmit={(event) => this.handleSubmit(event)}
                                />
                            </li>
                            <li>
                                <Button
                                    className='grey__btn'
                                    type='button'
                                    buttonText='_CANCEL'
                                    onClick={() => this.setState({redirectToTemplate:true})}
                                />
                            </li>
                        </ul>
                    </div>}
                    </Translation>
                </form>
            </Fragment>
        )
    }
}

export default TabMenu

