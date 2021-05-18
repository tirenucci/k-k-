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

class NewSociety extends Component {
    state = {
        name: '',
        quota: '',
        shareMail: '',
        agoraLink: '',
        defaultSkin: '',
        openMode: '',
        monograin: '',
        skins: []
    }

    componentDidMount = async() => {
        await this.getAllSkin()
    }

    async getAllSkin(){
        let response = await fetchApi('skin/get_all', 'GET')

        if (response){
            const skins = await response
            this.setState({skins})
        }
    }

    async handleFormSubmit(event) {
        event.preventDefault()
        let response = await fetchApi('society/create', 'POST', true, {
            societyName: this.state.name,
            societyQuota: this.state.quota,
            shareMail: this.state.shareMail,
            agoraLink: this.state.agoraLink,
            default_skin: this.state.defaultSkin,
            opencrea: this.state.openMode,
            monograin: this.state.monograin
        })

        if(this.state.name && this.state.quota){
            if (response){
                if (document.getElementById('avatarUpload').files[0] !== undefined) {
                    let society = await response
                    
                    let formData = new FormData()
                    formData.append('avatar', document.getElementById('avatarUpload').files[0])
                    formData.append('society_id', society.id)
                    let resp = await fetchApi('society/upload', 'POST', true, formData, false)
                    if (resp) {
                        this.setState({flashMessage: true, message: '_SOCIETY_ADD_SUCCESS', messageClass:'success', redirect:true, redirect_path:'/societyManager'})
                        setTimeout(() => {
                            this.setState({flashMessage: false})
                        }, 5000)
                    }
                } else {
                    this.setState({flashMessage: true, message: '_SOCIETY_ADD_SUCCESS', messageClass:'success', redirect:true, redirect_path:'/societyManager'})
                    setTimeout(() => {
                        this.setState({flashMessage: false})
                    }, 5000)
                }
            } else {
                this.setState({flashMessage: true, message: '_ERROR_CREATE_MESS', messageClass:'error'})
                setTimeout(() => {
                    this.setState({flashMessage: false})
                }, 5000)
            }
        } else {
            this.setState({flashMessage: true, message: '_PLEASE_FILL_MESS', messageClass:'error'})
            setTimeout(() => {
                this.setState({flashMessage: false})
            }, 5000)
        }
    }

    handleChange(event) {
        let state = this.state
        state[event.target.name] = event.target.value
        this.setState(state)
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
            <section>
                <form className='manager__form' onSubmit={(event) => this.handleFormSubmit(event)}>
                    <Translation>
                        {
                            (t) =>
                            <fieldset className='user__profile'>
                                <legend><Translation>{(t) => t('_USER_PROFIL')}</Translation></legend>
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
                                            required={true}
                                            inputType='text'
                                            onChange={(event) => this.handleChange(event)} 
                                            value={this.state.societyName}
                                        />
                                        <Fields
                                            htmlFor='quota' 
                                            text='_QUOTA' 
                                            required={true}
                                            inputType='number'
                                            onChange={(event) => this.handleChange(event)} 
                                            value={this.state.societyQuota}
                                        />
                                    </ul>
                                    <ul>
                                        <Fields
                                            htmlFor='shareMail' 
                                            text='_SOCIETY_SHARE_MAIL' 
                                            inputType='email'
                                            onChange={(event) => this.handleChange(event)} 
                                            value={this.state.shareMail}
                                        />
                                        <Fields
                                            htmlFor='agoraLink' 
                                            text='_SOCIETY_AGORA_LINK' 
                                            inputType='url'
                                            onChange={(event) => this.handleChange(event)} 
                                            value={this.state.agoraLink}
                                        />
                                    </ul>
                                    <ul>
                                        <Fields
                                            htmlFor='defaultSkin' 
                                            text='_DEFAULT_SKIN'
                                        >
                                            <select name='defaultSkin' id='defaultSkin' value={this.state.defaultStatus} onChange={(event) => this.handleChange(event)}>
                                                {
                                                    this.state.skins !== undefined && this.state.skins instanceof Array ?
                                                        this.state.skins.map((s, key) => (
                                                            <option key={key} value={s.id}>{s.theme_name} ({s.color})</option>
                                                        ))
                                                    :
                                                        <Fragment />
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
                                        />
                                    </ul>
                                    <ul>
                                        <Fields
                                            liClass='checkbox__el'
                                            htmlFor='monograin' 
                                            text='_MONOGRAIN' 
                                            inputType='checkbox'
                                            onChange={(event) => this.handleChange(event)} 
                                        />
                                    </ul>
                                    <Button
                                        className='orange__btn'
                                        buttonText='_SAVE'
                                        buttonType='submit'
                                        onClick={(event) => this.handleFormSubmit(event)}
                                    />
                                </div>
                            </fieldset>
                        }
                    </Translation>
                </form>
            </section>
        )
    }
}

export default withTranslation()(NewSociety)