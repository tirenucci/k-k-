import React, {Component, Fragment, PureComponent} from 'react'
import {Redirect} from 'react-router-dom'
import cookie from 'react-cookies'

//Global
import MainSection from '../Components/MainSection'
import NavBar from '../Components/NavBar'
import UserMenu from '../Components/home/UserMenu'
import Footer from '../Components/home/Footer'
import ChangeAvatar from '../Components/modal/ChangeAvatar'

//UserProfile Components
import DataList from '../Components/userProfile/DataList'
import DataForm from '../Components/userProfile/DataForm'
import ChangePwdForm from '../Components/userProfile/ChangePwdForm'
import FlashMessage from '../Components/FlashMessage'

//Style
import './UserProfile.scss'
import { getUserInformation} from "../Utils/GetUserInformation";
import {fetchApi} from "../Utils/Fetch";
import ContactModal from "../Components/modal/ContactModal";
import Title from "../Components/Title";
import CustomerMenu from "../Components/CustomerArea/CustomerMenu";
import CustomerHome from "../Components/CustomerArea/CustomerHome";
import CustomerOffer from "../Components/CustomerArea/CustomerOffer";
import CustomerContent from "../Components/CustomerArea/CustomerContent";
import CustomerBill from "../Components/CustomerArea/CustomerBill";
import CustomerInvoice from "../Components/CustomerArea/CustomerInvoice";
import CustomerSchedule from "../Components/CustomerArea/CustomerSchedule";
import CustomerAside from "../Components/CustomerArea/CustomerAside";
import Header from "../Components/Header";

class UserProfile extends PureComponent {

    state = {
        password: '',
        percent: [],
        redirect: false,
        modalShow: false,
        avatars: [],
        tools: [
            {'type': 'listing', 'link': '/authors', 'title': '_USER_LIST', 'text': '_USER_LIST'},
        ],
        options: [
            {value: 'Anglais', textTranslate: '_EN'},
            {value: 'Français', textTranslate: '_FR'}
        ],
        information: {
            password: '',
            newPassword: '',
            confirmPassword: '',
        },
        changeAvatar: false,
        tabs: ''
    }

    changeTabs(tabs) {
        this.setState({tabs})
    }

    async componentDidMount() {
        await getUserInformation().then(user => this.setState({user}))

        await this.getStatModule()
        await this.getPercent()
        document.title = this.props.title
    }

    //Permet de récuperer tout les avatars
    async getAvatars() {
        let response = await fetchApi(`user/take_all_avatars`, 'GET', true)

        if (response) {
            let avatars = await response
            this.setState({avatars})
        }
    }

    async uploadFile(e) {
        let formData = new FormData()
        formData.append('image', e.target.files[0])
        let img_selected = await fetchApi('user/profile/upload_avatar', 'POST', true, formData, false)

        if (img_selected) {
            this.setState({img_selected})
            await this.changeAvatarOwner()
        }
    }

    async changeAvatarOwner() {
        let img_selected = await fetchApi('user/profile/upload_new_avatar_post', 'POST', true, {
            id_user: this.state.user.id,
            id_image: this.state.img_selected.id
        })

        if (img_selected) {
            this.setState({img_selected})
            await this.getAvatars()
        }
    }


    //Changement de l'avatar au niveau du back
    async changeAvatar() {

        let response = await fetchApi('user/profile/change_avatar', 'PUT', true, {
            avatar_id: this.state.selectedImage.id,
            user_id: this.state.user.id
        })

        if (response) {
            await response
            await getUserInformation()
            this.setState({modalShow: false})
            await this.isAvatarChange()
        }
    }

    async isAvatarChange() {
        this.setState({changeAvatar: !this.state.changeAvatar})
    }

    updateData = async (event, i18n) => {
        event.preventDefault()
        await i18n.changeLanguage(this.state.user.lang)
        await this.updateUserData()
    }

    async updatePassword(event) {
        event.preventDefault()
        if (this.state.information.newPassword === this.state.information.confirmPassword) {
            let response = await fetchApi('user/change_password', 'PUT', true, {
                password: this.state.information.newPassword,
                current_password: this.state.information.password
            })

            if (response) {
                this.setState({
                    flashClass: 'success',
                    flashMessage: 'Votre mot de passe a bien été changé',
                    flash: true
                })
                setTimeout(() => {
                    this.setState({flash: false})
                }, 1500)
            } else {
                this.setState({flashClass: 'error', flashMessage: 'Votre mot de passe n\'est pas le bon', flash: true})
                setTimeout(() => {
                    this.setState({flash: false})
                }, 1500)
            }
        }
    }

    handleChangeAvatar = async () => {
        this.setState({modalShow: true})
        await this.getAvatars()
    }

    async getStatModule() {
        let stat_module = await fetchApi(`user/stat_module`, 'GET')

        if (stat_module) {
            this.setState({stat_module})
        }
    }

    handleChangePassword(event, target) {
        let information = this.state.information
        information[target] = event.target.value
        this.setState({information})
    }

    async updateUserData() {

        let response = await fetchApi('user/update', 'PUT', true, {
            firstname: this.state.user.firstname,
            lastname: this.state.user.lastname,
            lang: this.state.user.lang,
            id: this.state.user.id,
        })
    }

    async getPercent() {
        let percent = await fetchApi('society/quota', 'GET')

        if (percent) {
            this.setState({percent})
        }
    }

    //Pour la selection de l'avatar
    selectHandler = (event, avatar) => {
        const selectedImage = avatar
        this.setState({selectedImage})
    }

    handleChange = (event, target) => {
        window.$user[target] = event.target.value
        if (target === 'lang') {
            localStorage.clear()
            localStorage.setItem('i18nextLng', event.target.value)
        }
        this.setState({target})
    }

    render() {

        if (this.state.redirect) {
            return <Redirect to='/connection'/>
        }

        return (
            this.state.user !== undefined ?
                <div id='container'>
                    <header className='main__header'>
                        <Header />
                    </header>
                    {
                        this.state.user.offer === 'org' ||  this.state.user.offer === 'Logipro'?
                            <Fragment>
                                {
                                    this.state.flash ?
                                        <FlashMessage
                                            messageClass={this.state.flashClass}>{this.state.flashMessage}</FlashMessage>
                                        :
                                        this.state.modalShow ?
                                            <ChangeAvatar
                                                selectHandler={(event, selectedImage) => this.selectHandler(event, selectedImage)}
                                                allImages={this.state.avatars}
                                                selectedImage={this.state.selectedImage}
                                                onClose={() => this.setState({modalShow: false})}
                                                choiceHandle={() => this.changeAvatar()}
                                                openUploader={() => this.openUploader()}
                                                uploadFile={(e) => this.uploadFile(e)}
                                            />
                                            :
                                            <Fragment/>
                                }
                                <MainSection
                                    additionalClass='user__section'
                                    titleText='_USER_DATA'
                                    tools={this.state.tools}
                                >
                                    {
                                        this.state.tabs === 'edit' && this.state.user !== undefined ?
                                            <DataForm
                                                username={this.state.user.username}
                                                lastname={this.state.user.lastname}
                                                firstname={this.state.user.firstname}
                                                lang={this.state.user.lang}
                                                avatar={this.state.user.avatar}
                                                handleChange={(event, target) => this.handleChange(event, target)}
                                                updateData={(event, i18n) => this.updateData(event, i18n)}
                                                choiceHandle={() => this.handleChangeAvatar()}
                                                options={this.state.options}
                                                changeTabs={(tabs) => this.changeTabs(tabs)}
                                            />
                                            : this.state.tabs === 'changePassword' ?
                                            <ChangePwdForm
                                                updatePassword={(event) => this.updatePassword(event)}
                                                handleChange={(event, target) => this.handleChangePassword(event, target)}
                                                changeTabs={(tabs) => this.changeTabs(tabs)}
                                            />
                                            :
                                            this.state.user !== undefined ?
                                                <DataList
                                                    stat_module={this.state.stat_module}
                                                    user={this.state.user}
                                                    percent={this.state.percent}
                                                    changeTabs={(tabs) => this.changeTabs(tabs)}
                                                />
                                                :
                                                <Fragment/>
                                    }
                                </MainSection>
                            </Fragment>
                            :

                            <main id='main'>
                                {
                                    this.state.contact ? <ContactModal onOk={() => this.confirmContact()}
                                                                       onAnnul={() => this.setState({contact: false})}/>
                                        :
                                        this.state.cancel ? <ContactModal onOk={() => this.cancelOffer()}
                                                                          onAnnul={() => this.setState({contact: false})}/>
                                            :
                                            this.state.modalShow ?
                                                <ChangeAvatar
                                                    selectHandler={(event, selectedImage) => this.selectHandler(event, selectedImage)}
                                                    allImages={this.state.avatars}
                                                    selectedImage={this.state.selectedImage}
                                                    onClose={() => this.setState({modalShow: false})}
                                                    choiceHandle={() => this.changeAvatar()}
                                                    openUploader={() => this.openUploader()}
                                                    uploadFile={(e) => this.uploadFile(e)}
                                                />
                                                :
                                                <Fragment/>
                                }
                                <Title text='_CUSTOMER_SPACE'/>
                                {
                                    this.state.flashMessage ? <FlashMessage
                                            messageClass={this.state.messageClass}>{this.state.message}</FlashMessage> :
                                        <Fragment/>
                                }
                                <article className='customer-area'>
                                    <CustomerMenu
                                        email={this.state.user.email}
                                        offer={this.state.user.offer}
                                        changeTabs={(tabs) => this.changeTabs(tabs)}
                                    />
                                    {
                                        this.state.tabs === '' ?
                                            <CustomerHome/>
                                            :
                                            this.state.tabs === 'offer' ?
                                                <CustomerOffer
                                                    offer={this.state.user.offer}
                                                    contact={() => this.setState({contact: true})}
                                                    cancelOffer={() => this.setState({cancel: true})}
                                                />
                                                :
                                                this.state.tabs === 'account' ?
                                                    <CustomerContent
                                                        customerTitle={'_CUSTOMER_TITLE_3'}>
                                                        {
                                                            this.state.display === 'edit' && this.state.user !== undefined ?
                                                                <DataForm
                                                                    username={this.state.user.username}
                                                                    lastname={this.state.user.lastname}
                                                                    firstname={this.state.user.firstname}
                                                                    lang={this.state.user.lang}
                                                                    avatar={this.state.user.avatar}
                                                                    handleChange={(event, target) => this.handleChange(event, target)}
                                                                    showEdit={() => this.setState({display: 'edit'})}
                                                                    hideEdit={() => this.setState({display: ''})}
                                                                    updateData={(event, i18n) => this.updateData(event, i18n)}
                                                                    choiceHandle={() => this.handleChangeAvatar()}
                                                                    customerArea={true}
                                                                    options={this.state.options}
                                                                />
                                                                :
                                                                this.state.display === 'password' ?
                                                                    <ChangePwdForm
                                                                        updatePassword={(event) => this.updatePassword(event)}
                                                                        handleChange={(event, target) => this.handleChange(event, target)}
                                                                        hidePwdForm={() => this.setState({display: ''})}
                                                                        customerArea={true}
                                                                    />
                                                                    :
                                                                    <DataList
                                                                        user={this.state.user}
                                                                        showEdit={() => this.setState({display: 'edit'})}
                                                                        showPwdForm={() => this.setState({display: 'password'})}
                                                                        percent={this.state.percent}
                                                                        stat_module={this.state.stat_module}
                                                                        customerArea={true}
                                                                        changeTabs={(tabs) => this.changeTabs(tabs)}
                                                                    />
                                                        }
                                                    </CustomerContent>
                                                    :
                                                    this.state.tabs === 'information' ?
                                                        <CustomerBill/>
                                                        :
                                                        this.state.tabs === 'bill' ?
                                                            <CustomerInvoice/>
                                                            :
                                                            this.state.tabs === 'schedule' ?
                                                                <CustomerSchedule/>
                                                                :
                                                                <Fragment/>
                                    }
                                    <CustomerAside
                                        email={this.state.user.email}
                                        offer={this.state.user.offer}
                                    />
                                </article>
                            </main>
                    }
                    <Footer/>
                </div>
            :
                <Fragment />
        )
    }
}

export default UserProfile