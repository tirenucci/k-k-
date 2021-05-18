import React, {Fragment, Component} from 'react'
import {Redirect} from 'react-router-dom'

//i18n
import {withTranslation, Translation} from 'react-i18next'

//Utilitaires
import Button from '../../Components/formWidget/Button'
import FlashMessage from '../../Components/FlashMessage'
import Option from '../../Components/html/Option'
import Fields from '../../Components/formWidget/Fields'
import NavBar from "../../Components/NavBar";
import UserMenu from "../../Components/home/UserMenu";
import MainSection from "../../Components/MainSection";
import Footer from "../../Components/home/Footer";
import {fetchApi} from "../../Utils/Fetch";
import {getUserInformation} from "../../Utils/GetUserInformation";
import Header from "../../Components/Header";

class NewUser extends Component {
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
        mail: '',
        society: '',
        role: '',
        function: '',
        status: '',
        offer: '',
        lang: '',
        wordSearch: '',
        addTool: [
            {'type': 'listing', 'link': '/userManager', 'title': '_USER_MANAG', 'text': '_USER_MANAG'}
        ],
        options: {
            civility: [
                {value: '-1', textTranslate: '_CHOOSE'},
                {value: 'Female', textTranslate: '_FEMALE'},
                {value: 'Male', textTranslate: '_MALE'}
            ],
            roles: [
                {value: '-1', textTranslate: '_CHOOSE'},
                {value: 'ROLE_ADMINISTRATOR', textTranslate: 'ROLE_ADMINISTRATOR'},
                {value: 'ROLE_LOGIPRO', textTranslate: 'ROLE_LOGIPRO'},
                {value: 'ROLE_AUTHOR', textTranslate: 'ROLE_AUTHOR'},
                {value: 'ROLE_USER', textTranslate: 'ROLE_USER'}
            ],
            status: [
                {value: '-1', textTranslate: '_CHOOSE'},
                {value: '_USER_ACTIF', textTranslate: '_USER_ACTIVE'},
                {value: '_USER_INACTIF', textTranslate: '_USER_INACTIVE'}
            ],
            langs: [
                {value: '-1', textTranslate: '_CHOOSE'},
                {value: 'fr', textTranslate: '_FR'},
                {value: 'en', textTranslate: '_EN'}
            ]
        }
    }

    componentDidMount = async () => {
        await this.getSocieties()
        await this.getOffers()
    }

    handleSubmit = async (event) => {
        event.preventDefault()
        await this.handleFormSubmit(event)
    }

    handleChange(event) {
        let state = this.state
        state[event.target.name] = event.target.value
        this.setState({state})
    }

    generatePassword() {
        let lenght = Math.random() * 12 + 8
        let charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789,;:ù*$%µ§?'
        let password = ''
        for (let i = 0, n = charset.length; i < lenght; ++i) {
            password += charset.charAt(Math.floor(Math.random() * n))
        }
        this.setState({password})
    }

    async handleFormSubmit(event) {
        event.preventDefault()
        if (this.state.username !== '' && this.state.password !== '' && this.state.civility !== '' && this.state.firstname !== '' && this.state.lastname !== '' && this.state.mail !== '' && this.state.society !== '' && this.state.status !== '' && this.state.role !== '' && this.state.offer !== '' && this.state.lang !== '') {
            let response = await fetchApi('user/create', 'POST', true, {
                    userName: `${this.state.username}`,
                    userCivility: `${this.state.civility}`,
                    userLastName: `${this.state.lastname}`,
                    userFirstName: `${this.state.firstname}`,
                    userAddress: `${this.state.address}`,
                    userZip: `${this.state.zip}`,
                    userCity: `${this.state.city}`,
                    userCountry: `${this.state.country}`,
                    userPhone: `${this.state.phone}`,
                    userMail: `${this.state.mail}`,
                    userStatus: `${this.state.status}`,
                    userSociety: `${this.state.society}`,
                    userRole: `${this.state.role}`,
                    userOffer: `${this.state.offer}`,
                    userFunction: `${this.state.function}`,
                    userLang: `${this.state.lang}`,
                    password: `${this.state.password}`
                }
            )

            if (response) {
                this.setState({
                    flashMessage: true,
                    message: '_USER_ADD_SUCCESS',
                    messageClass: 'success',
                    redirect: true,
                    redirect_path: '/userManager'
                })
            } else {
                this.setState({flashMessage: true, message: '_ERROR_CREATE_MESS', messageClass: 'error'})
            }
        } else {
            this.setState({flashMessage: true, message: '_PLEASE_FILL_MESS', messageClass: 'error'})
        }

        setTimeout(() => {
            this.setState({flashMessage: false})
        }, 1500)
    }

    //Récupère toute les offres de l'appli
    async getOffers() {

        let response = fetchApi('offer/all', 'GET')


        if (response) {
            let offers = await response
            this.setState({offers})
        }
    }

    async getSocieties() {
        let response = await fetchApi(`society/get_all?wordSearch=${this.state.wordSearch}`, 'GET')

        if (response) {
            let societies = await response
            this.setState({societies})
        }
    }

    render() {
        if (this.state.redirect) {
            return (<Redirect
                to={{
                    pathname: this.state.redirect_path,
                    state: {messageClass: this.state.messageClass, message: this.state.message, flashMessage: true}
                }}
            />)
        }
        return (
            <Fragment>
                {
                    <div id='container'>
                        <Header/>
                        <MainSection
                            titleText={'_USER_ADD'}
                            tools={this.state.addTool}
                        >
                            <section>
                                <form className='manager__form' onSubmit={(event) => this.handleSubmit(event)}>
                                    {
                                        this.state.flashMessage ? <FlashMessage
                                                messageClass={this.state.messageClass}>{this.state.message}</FlashMessage> :
                                            <Fragment/>
                                    }
                                    <fieldset>
                                        <legend><Translation>{(t) => t('_USER_ID_CO')}</Translation></legend>
                                        <ul className='id__user'>
                                            <Fields
                                                htmlFor='username'
                                                text='_USER_ID'
                                                inputType='text'
                                                placeHolder='_USER_EXPLAIN_ID'
                                                onChange={(event) => this.handleChange(event)}
                                                value={this.state.username}
                                                required={true}
                                            />
                                            <Fields
                                                htmlFor='password'
                                                text='_USER_PSWD'
                                                inputType='text'
                                                onChange={(event) => this.handleChange(event)}
                                                value={this.state.password}
                                                required={true}
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
                                        <legend><Translation>{(t) => t('_USER_PROFIL')}</Translation></legend>
                                        <ul className='small'>
                                            <Fields
                                                htmlFor='civility'
                                                text='_GENDER'
                                                value={this.state.civility}
                                                onChange={(event) => this.handleChange(event)}
                                                required={true}
                                                options={this.state.options.civility}
                                            />
                                        </ul>
                                        <ul>
                                            <Fields
                                                htmlFor='lastname'
                                                text='_NAME'
                                                inputType='text'
                                                onChange={(event) => this.handleChange(event)}
                                                value={this.state.lastname}
                                                required={true}
                                            />
                                            <Fields
                                                htmlFor='firstname'
                                                text='_FIRST_NAME'
                                                inputType='text'
                                                onChange={(event) => this.handleChange(event)}
                                                value={this.state.firstname}
                                                required={true}
                                            />
                                        </ul>
                                        <ul>
                                            <Fields
                                                htmlFor='address'
                                                text='_ADDRESS'
                                                inputType='text'
                                                onChange={(event) => this.handleChange(event)}
                                                value={this.state.address}
                                            />
                                        </ul>
                                        <ul>
                                            <Fields
                                                htmlFor='zip'
                                                text='_ZIP'
                                                inputType='text'
                                                onChange={(event) => this.handleChange(event)}
                                                value={this.state.zip}
                                            />
                                            <Fields
                                                htmlFor='city'
                                                text='_CITY'
                                                inputType='text'
                                                onChange={(event) => this.handleChange(event)}
                                                value={this.state.city}
                                            />
                                            <Fields
                                                htmlFor='country'
                                                text='_COUNTRY'
                                                inputType='text'
                                                onChange={(event) => this.handleChange(event)}
                                                value={this.state.country}
                                            />
                                        </ul>
                                        <ul>
                                            <Fields
                                                htmlFor='phone'
                                                text='_PHONE'
                                                inputType='text'
                                                onChange={(event) => this.handleChange(event)}
                                                value={this.state.phone}
                                            />
                                            <Fields
                                                htmlFor='mail'
                                                text='_MAIL'
                                                inputType='text'
                                                onChange={(event) => this.handleChange(event)}
                                                value={this.state.mail}
                                                required={true}
                                            />
                                        </ul>
                                        <ul>
                                            <Fields
                                                htmlFor='society_id'
                                                text='_SOCIETY'
                                                required={true}
                                            >
                                                <select name='society' value={this.state.society_id}
                                                        onChange={(event) => this.handleChange(event)} required>
                                                    <Option value='-1' textTranslate='_CHOOSE'/>
                                                    {
                                                        this.state.societies instanceof Array ?
                                                            this.state.societies.map((society, key) => (
                                                                <option key={key}
                                                                        value={society.id}>{society.name}</option>
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
                                                options={this.state.options.roles}
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
                                                required={true}
                                                options={this.state.options.status}
                                            />
                                            <Fields
                                                htmlFor='offer'
                                                text='_OFFER'
                                                required={true}
                                            >
                                                <select name='offer' value={this.state.offer}
                                                        onChange={(event) => this.handleChange(event)} required>
                                                    <Option value='-1' textTranslate='_CHOOSE'/>
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
                                                options={this.state.options.langs}
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
                                            onClick={(event) => this.handleSubmit(event)}
                                        />
                                    </li>
                                    <li>
                                        <Button
                                            className='grey__btn'
                                            type='button'
                                            buttonText='_RETURN'
                                            onClick={() => window.location.href = '/userManager'}
                                        />
                                    </li>
                                </ul>
                            </section>
                        </MainSection>
                        <Footer/>
                    </div>
                }
            </Fragment>
        )
    }
}

export default withTranslation()(NewUser)