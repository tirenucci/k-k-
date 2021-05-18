import React, { Fragment, Component } from 'react'
import {Redirect} from 'react-router-dom'
import cookie from 'react-cookies'

//i18n
import { withTranslation, Translation } from 'react-i18next'

//Utilitaires
import Button from '../formWidget/Button'
import Image from '../Image'
import Fields from '../formWidget/Fields'
import {fetchApi} from "../../Utils/Fetch";

class EditSociety extends Component {

    state = {
        society: '',
        skins: []
    }

    componentDidMount = async() => {
        await this.getAllSkin()
        await this.getSocietyData()
    }

    async getAllSkin(){
        let response = await fetchApi('skin/get_all', 'GET')

        if (response){
            const skins = await response
            this.setState({skins})
        }
    }

    async getSocietyData(){
        let response = await fetchApi(`society/get_data?id=${this.props.society_id}`, 'GET')

        if (response) {
            const society = await response
            this.setState({society})
        }
    }

    handleChange(event) {
        let {society} = this.state
        society[event.target.name] = event.target.value
        this.setState({society})
    }

    //Met à jour les infos sur la société 
    async updateSocietyData(event) {
        event.preventDefault()
        let response = await fetchApi('society/update', 'PUT', true, {
            societyName: this.state.society.name,
            societyQuota: this.state.society.quota,
            shareMail: this.state.society.share_mail,
            agoraLink: this.state.society.agora_smart,
            default_skin: this.state.society.skin_default,
            opencrea: this.state.society.open_crea,
            monograin: this.state.society.monograin_scorm,
            id: this.state.society.id
        })

        if (response)
        {
            if (document.getElementById('avatarUpload').files[0] !== undefined) {
                let society = await response
                
                let formData = new FormData()
                formData.append('avatar', document.getElementById('avatarUpload').files[0])
                formData.append('society_id', society.id)
                let resp = await fetchApi('society/upload', 'POST', true, formData, false)

                if (resp.ok) {
                    this.setState({flashMessage: true, message: '_SOCIETY_EDIT_SUCCESS', messageClass:'success', redirect:true, redirect_path:'/societyManager'})
                    setTimeout(() => {
                        this.setState({flashMessage: false})
                    }, 5000)
                }
            } else {
                this.setState({flashMessage: true, message: '_SOCIETY_EDIT_SUCCESS', messageClass:'success', redirect:true, redirect_path:'/societyManager'})
                setTimeout(() => {
                    this.setState({flashMessage: false})
                }, 5000)
            }
        }
    }

    render(){
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
            <form className='manager__form' onSubmit={(event) => this.updateSocietyData(event)}>
                <Translation>
                    {
                        (t) => 
                        <fieldset className='user__profile'>
                            <legend>{t('_USER_PROFIL')}</legend>
                            <ul className='society__avatar'>
                                <Image src='/assets/img/small-default-thumb.png' alt='_LOGO' figcaptionText='_LOGO'/>
                                <Fields
                                    htmlFor='avatarUpload' 
                                    text='_CHOOSE_FILE'
                                    inputType='file'
                                    accept='image/png, image/jpeg'
                                />
                            </ul>
                                <div className='society__wrapper'>
                                    <ul>
                                        <Fields
                                            htmlFor='name' 
                                            text='_NAME'
                                            inputType='text'
                                            required={true}
                                            onChange={(event) => this.handleChange(event)} 
                                            value={this.state.society.name}
                                        />
                                        <Fields
                                            htmlFor='quota' 
                                            text='_QUOTA'
                                            inputType='text'
                                            required={true}
                                            onChange={(event) => this.handleChange(event)} 
                                            value={this.state.society.quota}
                                        />
                                    </ul>
                                    <ul>
                                        <Fields
                                            htmlFor='share_mail' 
                                            text='_SOCIETY_SHARE_MAIL'
                                            inputType='text'
                                            onChange={(event) => this.handleChange(event)} 
                                            value={this.state.society.share_mail}
                                        />
                                        <Fields
                                            htmlFor='agora_smart'
                                            text='_SOCIETY_AGORA_LINK'
                                            inputType='text'
                                            onChange={(event) => this.handleChange(event)} 
                                            value={this.state.society.agora_smart}
                                        />
                                    </ul>
                                    <ul>
                                        <Fields
                                            htmlFor='defaultSkin' 
                                            text='_DEFAULT_SKIN'
                                        >
                                            <select id='defaultSkin' name='defaultSkin' value={this.state.society.skin_default} onChange={(event) => this.handleChange(event)}>
                                                {
                                                    this.state.skins !== undefined && this.state.skins instanceof Array ?
                                                        this.state.skins.map((s, key) => (
                                                            <option key={key} value={s.id}>{s.theme_name} ({s.color})</option>
                                                        ))
                                                    :
                                                        <Fragment/>
                                                }
                                                <option value='0'>{t('_CHOOSE_SKIN')}</option>
                                            </select>
                                        </Fields>
                                    </ul>
                                    <ul>
                                        <Fields
                                            liClass='checkbox__el'
                                            htmlFor='openMode' 
                                            text='_OPEN_MODE'
                                            inputType='checkbox'
                                            onChange={(event) => this.handleChange(event)} 
                                            value={this.state.society.open_crea}
                                        />
                                    </ul>
                                    <ul>
                                        <Fields
                                            liClass='checkbox__el'
                                            htmlFor='monograin' 
                                            text='_MONOGRAIN'
                                            inputType='checkbox'
                                            onChange={(event) => this.handleChange(event)} 
                                            value={this.state.society.monograin_scorm}
                                        />
                                    </ul>
                                    <Button
                                        className='orange__btn'
                                        buttonText='_SAVE'
                                        buttonType='submit'
                                        onClick={(event) => this.updateSocietyData(event)}
                                    />
                                </div>
                        </fieldset>
                    }
                </Translation>
            </form>
        )
    }
}

export default withTranslation()(EditSociety)