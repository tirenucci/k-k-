import React, { Component, Fragment } from 'react'
import cookie from 'react-cookies'
import {Redirect} from 'react-router-dom'

//i18n
import { withTranslation } from 'react-i18next'

//Utilitaires
import Button from '../formWidget/Button'
import NavBarSecondary from '../NavBarSecondary'
import Option from '../html/Option'
import DeleteButton from '../DeleteButton'
import FlashMessage from '../FlashMessage'
import DeleteModal from '../modal/DeleteModal'
import Image from '../Image'
import Fields from '../formWidget/Fields'
import {fetchApi} from "../../Utils/Fetch";

class EditEO extends Component {

    state = {
        eo:'',
        eoThemes:[],
        tabs: [
            {'text': '_EO_BLOCK', 'class': 'tab__link actif', 'link': '#eo'},
            {'text': '_DELETE', 'class': 'tab__link', 'link': '#delete'},
        ],
    }

    componentDidMount = async() => {
        await this.getAllEoThemes()
        await this.getEoData()
    }

    //Récupération des thèmes pour le select
    async getAllEoThemes() {
        let response = await fetchApi('eot/get_all', 'GET')

        if (response) {
            let eoThemes = await response
            this.setState({eoThemes})
        
        }
    }

    //Récupération des infos propres à un EO
    async getEoData(){
        let eo = await fetchApi(`eo/get_data?id=${this.props.eo_id}`, 'GET')

        if (eo) {
            this.setState({eo})
        }
    }

    //Met à jour les infos sur l'objet intégré
    async updateData(event) {
        event.preventDefault()
        let response = await fetchApi('eo/update', 'PUT', true, {
            id: this.state.eo.id,
            integrated_object_theme_id:this.state.eo.integrated_object_theme_id,
            title: this.state.eo.title,
            position: this.state.eo.position,
            url: this.state.eo.url,
            description: this.state.eo.description,
            logo: this.state.eo.logo,
        })

        if (response) {
            if (document.getElementById('eoLogo').files[0] !== undefined) {
                let eo = await response
                
                let formData = new FormData()
                formData.append('logo', document.getElementById('eoLogo').files[0])
                formData.append('eo_id', eo.id)
                let resp = await fetchApi('society/upload', 'POST', true, formData, false)

                if (resp) {
                    this.setState({flashMessage: true, message: '_EO_EDIT_SUCCESS', messageClass:'success', redirect:true, redirect_path:'/EOManager'})
    
                    setTimeout(() => {
                        this.setState({flashMessage: false})
                    }, 5000)
                }
            } else {
                this.setState({flashMessage: true, message: '_EO_EDIT_SUCCESS', messageClass:'success', redirect:true, redirect_path:'/EOManager'})
                setTimeout(() => {
                    this.setState({flashMessage: false})
                }, 5000)
            }
        }
    }

     //Affiche le modal pour confirmer la suppression de l'objet intégré
     async showDeleteModal(event, id){
        this.setState({deleted: true, idDeleted: id})
    }

    //Supprime l'objet intégré sélectionné
    async deleteEO(id){
        let response = await fetchApi('eo/delete', 'DELETE', true, {
            id: id
        })

        if (response) {
            this.setState({flashMessage: true, message: '_EO_DELETE_SUCCESS', messageClass:'success', deleted: false, redirect:true, redirect_path:'/EOManager'})
        } else {
            this.setState({loading: false, flashMessage: true, message: '_ERROR_DELETE_MESS', messageClass:'error', deleted: false})
        }
    }

    handleChange(event) {
        let {eo} = this.state
        eo[event.target.name] = event.target.value
        this.setState({eo})
    }

    //Lors du changement d'onglet
    async evenement(tabs){
        await this.setState({currentTab: tabs})
        window.scrollTo(0, window.scrollTo)
    } 

    render() {
        if (this.state.redirect)
        {
            return (<Redirect
                to={{
                    pathname: this.state.redirect_path,
                    state: {messageClass: this.state.messageClass, message: this.state.message, flashMessage: true}
                }}
            />)
        }

        return (
            <Fragment>
            <NavBarSecondary
                tabs={this.state.tabs}
                className='tab__menu'
                evenement={(tabs) => this.evenement(tabs)}
                />
             <article>
                {
                    this.state.flashMessage ? 
                        <FlashMessage messageClass={this.state.messageClass}>{this.state.message}</FlashMessage> 
                    : this.state.deleted === true ? 
                        <DeleteModal onOk={() => this.deleteEO(this.state.idDeleted)} onAnnul={() => this.setState({deleted: false})}/> 
                    : 
                        <Fragment/>
                }
                {
                    this.state.currentTab === 'SUPPRIMER' ?
                    <DeleteButton 
                        deleteText='_DELETE'
                        onDelete={(event, id) => this.showDeleteModal(event, this.state.eo.id)}
                        />
                    :
                    <form onSubmit={(event) => this.updateData(event)} className='eo__creator'>
                        <fieldset>
                            <ul>
                                <Fields
                                    htmlFor='theme' 
                                    text='_THEME'
                                    required={true}
                                >
                                    <select name='theme' id='theme' value={this.state.eo.integrated_object_theme_id} onChange={(event) => this.handleChange(event)} required>
                                        {
                                            this.state.eoThemes.map((eoTheme, key) => (
                                                <Option key={key} value={eoTheme.id} textTranslate={eoTheme.title}/>
                                            ))
                                        }
                                    </select>
                                </Fields>
                                <Fields
                                    htmlFor='position' 
                                    text='_ORDER'
                                    inputType='number' 
                                    min='1' 
                                    onChange={(event) => this.handleChange(event)} 
                                    value={this.state.eo.position}
                                />
                                <Fields
                                    htmlFor='title' 
                                    text='_TITLE'
                                    inputType='text' 
                                    onChange={(event) => this.handleChange(event)} 
                                    value={this.state.eo.title}
                                    required={true}
                                />
                                <Fields
                                    htmlFor='url' 
                                    text='_URL'
                                    inputType='text' 
                                    onChange={(event) => this.handleChange(event)} 
                                    value={this.state.eo.url}
                                />
                                <Fields
                                    htmlFor='description' 
                                    text='_DESCRIPTION'
                                    textarea={true}
                                    onChange={(event) => this.handleChange(event)} 
                                    value={this.state.eo.description}
                                    textareaText={this.state.eo.description}
                                    cols='35'
                                    rows='5'
                                />
                                <Fields
                                    htmlFor='logo' 
                                    text='_LOGO'
                                    inputType='file'
                                    accept='image/png, image/jpeg, image/jpg' 
                                    onChange={(event) => this.handleChange(event, 'logo')}
                                />
                                {
                                    this.state.eo.logo !== '' ?
                                        <Image 
                                            className='eo__logo__file' 
                                            src={`/assets/img/eoLogo/${this.state.eo.logo}`} 
                                            alt='_LOGO' 
                                            figcaptionText='_LOGO'
                                        />
                                    :
                                        <Image 
                                            className='eo__logo__file' 
                                            src='/assets/img/small-default-thumb.png'
                                            alt='_NO_PICTURE'
                                            figcaptionText='_NO_PICTURE'
                                        />
                                }
                            </ul>
                        </fieldset>
                        <li className='btn__list inherit'>
                            <Button
                                className='orange__btn'
                                buttonText='_SAVE'
                                buttonType='submit'
                                onClick={(event) => this.updateData(event)}
                            />
                        </li>
                    </form>
                }
        </article>
        </Fragment>
        )
    }
}

export default withTranslation()(EditEO)