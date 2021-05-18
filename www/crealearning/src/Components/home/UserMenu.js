import React, {Fragment, Component, PureComponent} from 'react'

import cookie from 'react-cookies'

//i18n
import { withTranslation, Translation } from 'react-i18next'

//Components utilitaires
import Button from '../formWidget/Button'
import Image from '../Image'
import ProgressRing from './ProgressRing'

//Style
import './UserMenu.scss'
import {getUserInformation} from "../../Utils/GetUserInformation";


class UserMenu extends PureComponent {

    constructor({props}){
        super(props)

        this.state = {
            redirect: false,
            modalShow: false,
            //Charge un avatar par défaut si l'SSID n'en choisit aucun
            img_selected: {
                path: '/assets/img/avatar/default.svg',
                name: 'default',
                id: 1
            },
            //Permet de stocker tout les avatars dans un tableau
            avatars: [],
        }
    }

    async disconnectHandle() {
        await cookie.remove('SSID', {
            path: '/'
        })

        window.location.href = '/connection'
    }

    componentDidMount = async function(){
        await getUserInformation().then(r => this.setState({user: r}))
    }

    componentDidUpdate = async(prevProps, prevState, snapshot) => {
        if (prevProps.updateAvatar === true){
            await this.props.setChangeAvatar(false)
            await getUserInformation().then(r => this.setState({user: r}))
        }
    }

    render() {
        return(
            <Fragment>
                {
                    this.state.user !== undefined ?
                        <nav id='user__nav' >
                            <ol>
                                    <li className='user__info' onClick={(() => this.state.user.offer === 'org' || this.state.user.offer === 'Logipro' ? window.location.href = "/profile" :  window.location.href = "/customerArea")}>
                                    <h6>
                                        {
                                            this.state.user.avatar === null ?
                                            <Image src='/assets/img/avatar/default.svg' alt='_AVATAR'/>
                                            :
                                            <Image src={this.state.user.avatar.path} alt='_AVATAR_DEFAULT' figcaptionText={`${this.state.user.firstname} ${this.state.user.lastname}`}/>
                                        }
                                    </h6>
                                    <ul className='user__list__info'>
                                        <li className='user__arrow user__arrow__center'/>
                                        <li className='user__name'>{this.state.user.firstname}&nbsp;{this.state.user.lastname}</li>
                                        <li className='user__space'>
                                        <Translation>{(t) => <span>{t('_DISK_SPACE')}</span>}</Translation>
                                            <ProgressRing
                                                user={this.state.user}
                                                radius={40}
                                                stroke={4}
                                            />
                                        </li>
                                        {
                                            this.state.user.offer === 'org' ?
                                            <Fragment/>
                                            :
                                            <Fragment>
                                                <li>{this.state.user.email}</li>
                                                <li>
                                                    <Translation>{(t) => t('_USER_OFFER')}</Translation>
                                                    <strong className={`${this.state.user.offer}`}>{this.state.user.offer}</strong>
                                                </li>
                                            </Fragment>
                                        }
                                        <li>
                                            <ul className='user__list__btn'>
                                                <li>
                                                    {
                                                        this.state.user.offer === 'org' || this.state.user.offer === 'Logipro' ?
                                                            <a href='/profile'><Translation>{(t) => t('_USER_PROFILE')}</Translation></a>
                                                        :
                                                            this.state.user.offer === 'Logipro' || this.state.user.offer === 'open' || this.state.user.offer === 'pro' ?
                                                            <a href='/customerArea'><Translation>{(t) => t('_CUSTOMER_SPACE')}</Translation></a>
                                                        :
                                                        <Fragment/>
                                                    }
                                                </li>
                                                <li>
                                                    <a onClick={() => this.disconnectHandle()} href='/connection'><Translation>{(t) => t('_LOGOUT')}</Translation></a>
                                                </li>
                                            </ul>
                                        </li>
                                    </ul>
                                </li>
                            </ol>
                        {
                            this.state.user.role === 'ROLE_LOGIPRO' || this.state.user.role === 'ROLE_ADMINISTRATOR' ?
                            <nav className='user__config__menu' >
                                <span className='config__cog'></span>
                                <ul>
                                    {
                                        this.state.user.role === 'ROLE_LOGIPRO' ?
                                            <Fragment>
                                                <li className='user__arrow user__arrow__right'/>
                                                <li>
                                                    <a href='/userManager'><Translation>{(t) => t('_USER_MANAG')}</Translation></a>
                                                </li>
                                                <li>
                                                    <a href='/societyManager'><Translation>{(t) => t('_USER_MANAG_SOCIETY')}</Translation></a>
                                                </li>
                                            </Fragment>
                                        :
                                            <Fragment/>
                                    }
                                    {
                                        this.state.user.role === 'ROLE_LOGIPRO' || this.state.user.role === 'ROLE_ADMINISTRATOR' ?
                                            <Fragment>
                                                <li>
                                                    <a href='/society-config'><Translation>{(t) => t('_CONFIG_APP')}</Translation></a>
                                                </li>
                                                <li>
                                                    <a href='/EOManager'><Translation>{(t) => t('_EO_CONFIG')}</Translation></a>
                                                </li>
                                                <li>
                                                    <a href='/configLang'><Translation>{(t) => t('_CONFIG_LANG')}</Translation></a>
                                                </li>
                                            </Fragment>
                                        :
                                            <Fragment />
                                    }
                                </ul>
                            </nav>
                        : this.state.user.offer === 'open' ?
                            <ul className='user__subscriber'>
                                <li>
                                    <Button
                                        className='subscribe__btn small__version'
                                        buttonType='button'
                                        buttonText='_BTN_SUBSCRIBE'
                                        buttonTitle='_BTN_SUBSCRIBE_OFFER'
                                        onClick={() => window.open('https://open.crea-learning.com/index.php#four', '_blank')}
                                    />
                                </li>
                            </ul>
                        :
                            <Fragment/>
                        }
                    </nav>
                :
                    <Fragment />
                }
            </Fragment>
        )
    }
    
}

export default withTranslation()(UserMenu)