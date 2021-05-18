import React, { Fragment, Component } from 'react'
import cookie from 'react-cookies'
import { Redirect } from 'react-router-dom'

//i18n
import { withTranslation, Translation } from 'react-i18next'

//Utilitaires
import Button from '../../Components/formWidget/Button'
import FlashMessage from '../../Components/FlashMessage'
import Option from '../../Components/html/Option'
import Fields from '../../Components/formWidget/Fields'
import NavBar from "../../Components/NavBar";
import UserMenu from "../../Components/home/UserMenu";
import MainSection from "../../Components/MainSection";

import {fetchApi} from "../../Utils/Fetch";
import Header from "../../Components/Header";

class EditUser extends Component {
    state = {
        username: '',
        password: '',
        civility: '',
        firstname: '',
        lastname: '',
        zip: '',
        address: '',
        city: '',
        country: '',
        phone: '',
        email: '',
        society_id: '',
        role: '',
        offer_id: '',
        function: '',
        code_lang: '',
        status: '',
        offer: '',
        lang: '',
        wordSearch: '',
        civilityOptions: [
            {value:'-1', textTranslate:'_CHOOSE'},
            {value:'Madame', textTranslate:'_FEMALE'},
            {value:'Monsieur', textTranslate:'_MALE'},
        ],
        roleOptions:[
            {value:'-1', textTranslate:'_CHOOSE'},
            {value:'ROLE_ADMINISTRATOR', textTranslate:'ROLE_ADMINISTRATOR'},
            {value:'ROLE_LOGIPRO', textTranslate:'ROLE_LOGIPRO'},
            {value:'ROLE_AUTHOR', textTranslate:'ROLE_AUTHOR'},
            {value:'ROLE_USER', textTranslate:'ROLE_USER'}
        ],
        statusOptions: [
            {value:'-1', textTranslate:'_CHOOSE'},
            {value:'_USER_ACTIF', textTranslate:'_USER_ACTIVE'},
            {value:'_USER_INACTIF', textTranslate:'_USER_INACTIVE'}
        ],
        langOptions: [
            {value:'-1', textTranslate:'_CHOOSE'},
            {value:'Français', textTranslate:'_FR'},
            {value:'English', textTranslate:'_EN'}
        ],
        editTool: [
            {'type': 'listing', 'link': '/userManager', 'title': '_USER_MANAG', 'text':'_USER_MANAG'},
            {'type': 'new', 'link': '/userManager/add', 'title': '_USER_ADD', 'text':'_USER_ADD'}
        ],
    }

    constructor({props}){
        super(props)
    }
    
    componentDidMount = async() => {
        await this.getSocieties()
        await this.getOffers()
        await this.getUserData()
    }

    //Récupère les infos du user cliqué via le bouton modifier
    async getUserData(){
        let response = await fetchApi(`user/get_data?id=${this.props.match.params.id}&security=false`, 'GET', true)

        if (response)
        {
            const state = await response
            this.setState(state)
        }
    }

    handleSubmit = async(event) => {
        event.preventDefault()
        await this.handleFormSubmit(event)
    }

    handleChange(event){
        let state = this.state
        state[event.target.name] = event.target.value
        this.setState(state)
    }

    generatePassword() {
        let lenght = Math.random() * 12 + 8
        let charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789,;:ù*$%µ§?'
        let password = ''
        for (let i = 0, n = charset.length; i < lenght; ++i)
        {
            password += charset.charAt(Math.floor(Math.random() * n))
        }
        this.setState({password})
    }

    //Soumet le formulaire de création puis enregistre la création en BDD
    async handleFormSubmit(event) {
        event.preventDefault()

        let response = await fetchApi('user/edit', 'PUT', true, {
            userName:`${this.state.username}`,
            userCivility:`${this.state.civility}`,
            userLastName: `${this.state.lastname}`,
            userFirstName: `${this.state.firstname}`,
            userAddress:`${this.state.address}`,
            userZip:`${this.state.zip}`,
            userCity:`${this.state.city}`,
            userCountry:`${this.state.country}`,
            userPhone: `${this.state.phone}`,
            userMail:`${this.state.email}`,
            userStatus:`${this.state.status}`,
            userSociety:`${this.state.society_id}`,
            userRole:`${this.state.role}`,
            userOffer:`${this.state.offer_id}`,
            userFunction:`${this.state.function}`,
            userLang:`${this.state.code_lang}`,
            password:`${this.state.password}`,
            id: this.props.match.params.id
        })

        if(this.state.lastname && this.state.firstname && this.state.email){
            if (response){
                this.setState({flashMessage: true, message: '_USER_EDIT_SUCCESS', messageClass:'success', redirect:true, redirect_path:'/userManager'})
            } else {
                this.setState({flashMessage: true, message: '_USER_EDIT_ERROR', messageClass:'error'})
            }
        } else {
            this.setState({flashMessage: true, message: '_PLEASE_FILL_MESS', messageClass:'error'})
        }

        setTimeout(() => {
            this.setState({flashMessage: false})
        }, 1500)
    }

    //Récupère toute les offres de l'appli
    async getOffers() {
        let response = await fetchApi('offer/all', 'GET')

        if (response) {
            let offers = await response
            this.setState({offers})
        }
    }

    async getSocieties() {
        let response = await fetchApi(`society/get_all?wordSearch=${this.state.wordSearch}`, 'GET', true)

        if (response) {
            let societies = await response
            this.setState({societies})
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
        return(
            <div id='container'>
                <Header />
                <MainSection
                    titleText={`_USER_EDIT`}
                    tools={this.state.editTool}
                >
                    <section>
                        <form className='manager__form' onSubmit={(event) => this.handleSubmit(event)}>
                            {
                                this.state.flashMessage ?
                                    <FlashMessage messageClass={this.state.messageClass}>{this.state.message}</FlashMessage>
                                :
                                    <Fragment/>
                            }
                            <fieldset>
                                <legend><Translation>{(t) => t('_USER_ID_CO')}</Translation></legend>
                                <ul className='id__user'>
                                    <Fields
                                        htmlFor='username'
                                        text='_USER_ID'
                                        inputType='text'
                                        size='40'
                                        placeHolder='_USER_EXPLAIN_ID'
                                        value={this.state.username}
                                        onChange={(event) => this.handleChange(event)}
                                        required={true}
                                    />
                                    <Fields
                                        htmlFor='password'
                                        text='_USER_PSWD'
                                        inputType='text'
                                        value={this.state.password}
                                        onChange={(event) => this.handleChange(event)}
                                    />
                                    <li>
                                        <Button
                                            className='generator__btn'
                                            buttonType='button'
                                            buttonText='_USER_PSWD_GENERATE'
                                            onClick={() => this.generatePassword()}
                                        />
                                    </li>
                                </ul>
                            </fieldset>
                            <fieldset className='user__profile'>
                                <legend><Translation>{t => t('_USER_PROFIL')}</Translation></legend>
                                <ul className='small'>
                                    <Fields
                                        htmlFor='civility'
                                        text='_GENDER'
                                        value={this.state.civility}
                                        onChange={(event) => this.handleChange(event)}
                                        required={true}
                                        options={this.state.civilityOptions}
                                    />
                                </ul>
                                <ul>
                                    <Fields
                                        htmlFor='lastname'
                                        text='_NAME'
                                        inputType='text'
                                        value={this.state.lastname}
                                        onChange={(event) => this.handleChange(event)}
                                    />
                                    <Fields
                                        htmlFor='firstname'
                                        text='_FIRST_NAME'
                                        inputType='text'
                                        value={this.state.firstname}
                                        onChange={(event) => this.handleChange(event)}
                                    />
                                </ul>
                                <ul>
                                    <Fields
                                        htmlFor='address'
                                        text='_ADDRESS'
                                        inputType='text'
                                        value={this.state.address}
                                        onChange={(event) => this.handleChange(event)}
                                    />
                                </ul>
                                <ul>
                                    <Fields
                                        htmlFor='zip'
                                        text='_ZIP'
                                        inputType='text'
                                        value={this.state.zip}
                                        onChange={(event) => this.handleChange(event)}
                                    />
                                    <Fields
                                        htmlFor='city'
                                        text='_CITY'
                                        inputType='text'
                                        value={this.state.city}
                                        onChange={(event) => this.handleChange(event)}
                                    />
                                    <Fields
                                        htmlFor='country'
                                        text='_COUNTRY'
                                        inputType='text'
                                        value={this.state.country}
                                        onChange={(event) => this.handleChange(event)}
                                    />
                                </ul>
                                <ul>
                                    <Fields
                                        htmlFor='phone'
                                        text='_PHONE'
                                        inputType='text'
                                        value={this.state.phone}
                                        onChange={(event) => this.handleChange(event)}
                                    />
                                    <Fields
                                        htmlFor='email'
                                        text='_MAIL'
                                        inputType='text'
                                        value={this.state.email}
                                        onChange={(event) => this.handleChange(event)}
                                        required={true}
                                    />
                                </ul>
                                <ul>
                                    <Fields
                                        htmlFor='society_id'
                                        text='_SOCIETY'
                                        required={true}
                                    >
                                        <select name='society_id' value={this.state.society_id} onChange={(event) => this.handleChange(event)} required>
                                            <Option value='-1' textTranslate='_CHOOSE' />
                                            {
                                                this.state.societies instanceof Array ?
                                                    this.state.societies.map((society, key) =>(
                                                        <option key={key} value={society.id}>{society.name}</option>
                                                    ))
                                                :
                                                    <Fragment/>
                                            }
                                        </select>
                                    </Fields>
                                    <Fields
                                        htmlFor='role'
                                        text='_ROLE'
                                        value={this.state.role}
                                        onChange={(event) => this.handleChange(event)}
                                        required={true}
                                        options={this.state.roleOptions}
                                    />
                                    <Fields
                                        htmlFor='function'
                                        text='_FUNCTION'
                                        inputType='text'
                                        value={this.state.function}
                                        onChange={(event) => this.handleChange(event)}
                                    />
                                </ul>
                                <ul>
                                    <Fields
                                        htmlFor='status'
                                        text='_STATUS'
                                        value={this.state.status}
                                        onChange={(event) => this.handleChange(event)}
                                        options={this.state.statusOptions}
                                    />
                                    <Fields
                                        htmlFor='offer'
                                        text='_OFFER'
                                    >
                                        <select name='offer' value={this.state.offer_id} onChange={(event) => this.handleChange(event)} required>
                                            <Option value='-1' textTranslate='_CHOOSE' />
                                                {
                                                    this.state.offers instanceof Array ?
                                                        this.state.offers.map((o, key) => (
                                                            <option key={key} value={o.id}>{o.label}</option>
                                                        ))
                                                    :
                                                        <Fragment/>
                                                }
                                        </select>
                                    </Fields>
                                    <Fields
                                        htmlFor='lang'
                                        text='_LANG'
                                        value={this.state.lang}
                                        onChange={(event) => this.handleChange(event)}
                                        required={true}
                                        options={this.state.langOptions}
                                    />
                                </ul>
                                <ul>
                                    <li><Translation>{t => t('_REQUIRED_FIELDS')}</Translation></li>
                                </ul>
                            </fieldset>
                        </form>
                        <ul className='btn__list inherit'>
                            <li>
                                <Button
                                    className='orange__btn'
                                    buttonText='_SAVE'
                                    buttonType='submit'
                                    onClick={(event) =>  this.handleSubmit(event)}
                                />
                            </li>
                            <li>
                                <Button
                                    className='grey__btn'
                                    type='button'
                                    buttonText='_RETURN'
                                    onClick={() => window.location.href='/userManager'}
                                />
                            </li>
                        </ul>
                    </section>
                </MainSection>
            </div>
        )
    }
}


export default withTranslation()(EditUser)