import React, { Component, Fragment } from 'react'
import { Redirect } from 'react-router-dom'
import cookie from 'react-cookies'

//i18n
import { Translation } from 'react-i18next'

//Utilitaires
import Title from '../Components/Title'
import Input from '../Components/formWidget/Input'
import Button from '../Components/formWidget/Button'
import Fields from '../Components/formWidget/Fields'

//Connection
import ConnectionMessage from '../Components/connection/ConnectionMessage'
import ConnectionModal from '../Components/modal/ConnectionModal'

//Style
import './Connection.scss'
import {fetchApi} from "../Utils/Fetch";

class Connection extends Component {

    constructor({props}){
        super(props)
        this.state = {
            redirect: false,
            redirect_path: '',
            error: '',
            email: '',
            password: '',
            remember: false,
            fromTurboLead: false,
            forgot:false
        }
    }

    componentDidMount(){
        if (cookie.load('SSID')){
            this.setState({redirect_path: '/',redirect: true})
        }
        /*Permet d'ajouter une classe différente au body afin de ne pas conserver le style définit pour le body d'autre components*/
        document.body.className='body__connection'
        document.title = this.props.title
    }

    async sendFormInformation(){
        let response = await fetchApi('user/connection', 'POST', false, {
            password: this.state.password,
            email: this.state.email
        })

        if (!response){
            this.setState({error_message: '_CONNECTION_ERROR'})
            this.setState({error: 'incorrect'})
            setTimeout(() => {
                this.setState({error: false})
            }, 5000)
        } else {
            let data = await response
            if (this.state.remember) {
                cookie.save('SSID', data['connection_token'], {
                    path: '/',
                    maxAge: 315569520
                })
            } else {
                cookie.save('SSID', data['connection_token'], {
                    path: '/'
                })
            }

            localStorage.setItem('i18nextLng', data.lang)
            let last_path = sessionStorage.getItem('last_path')
            sessionStorage.removeItem('last_path')
            window.location.href = window.location.protocol + '//' +  (window.location.hostname === '192.168.30.6' ? '192.168.30.6:3000' : window.location.hostname) + (last_path !== null ? last_path : "/")
        }
    }

    handleMail = (event) => {
        const email = event.target.value
        this.setState({email})
    }

    handlePassword = (event) => {
        const password = event.target.value
        this.setState({password})
    }

    handleFormSubmit = async(event) => {
        if (event !== undefined && this.state.error !== undefined){
            event.preventDefault()
        }
        if(this.state.password && this.state.email){
            await this.sendFormInformation()
        } else {
            this.setState({error:'empty'})
            setTimeout(() => {
                this.setState({error: false})
            }, 5000)
        } 
    }

    async handlePswdRecovery(){
        let response = await fetchApi('mail/recovery', 'POST', true, {
            email: this.state.email
        })

        if (response){
            this.setState({recoverMessageSend:true})
        } else {
            this.setState({error: 'invalid', error_message: '_RECOVERY_ERROR'})
            setTimeout(() => {
                this.setState({error: false})
            }, 5000)
        }
    }

    render() {        
        if (this.state.redirect)
        {
            return <Redirect to={this.state.redirect_path}/>
        } else {
            return(
                <section className='connection__section'>
                    <Title 
                        additionalClass='connection__title' 
                        text={this.state.forgot ? '_GET_NEW_PSWD' : '_CONECTION_ID'}
                    />
                    <form autoComplete='on' className='connection__form' onSubmit={(event) => this.handleFormSubmit(event)}>
                        { 
                            this.state.error ? 
                            <ConnectionMessage
                                className='connection__error'
                                message={`${this.state.error === 'empty' ? '_CONNECTION_ERROR' : this.state.error === 'incorrect' ? '_CONNECTION_ERROR_2' : '_RECOVERY_ERROR'}`}
                            />
                            : this.state.fromTurboLead ?
                            <ConnectionModal
                                onOk={(event) => this.setState({fromTurboLead:false})}
                            />
                            :
                            <Fragment/>
                        }
                        {
                            this.state.forgot ?
                            <ul>
                                {
                                    this.state.recoverMessageSend ?
                                    <li>
                                        <Translation>
                                            {
                                                (t) => 
                                                <ConnectionMessage 
                                                    className='pswd__explain' 
                                                    message={t('_PSWD_RECOVERY_EXPLAIN', {mail: this.state.email})}
                                                    />
                                            }
                                        </Translation>
                                    </li>
                                    :
                                    <Fragment>
                                        <li>
                                            <ConnectionMessage
                                                className='pswd__explain'
                                                message='_PSWD_EXPLAIN'
                                            />
                                        </li>
                                            <Input
                                                labelText='_MAIL' 
                                                inputType='text'
                                                value={this.state.email}
                                                className='input__mail'
                                                onchange={(event) => this.handleMail(event)}
                                            />
                                        <li>
                                            <Button 
                                                className='connect__btn' 
                                                buttonType='button' 
                                                buttonText='_SEND'
                                                onClick={() => this.handlePswdRecovery()}
                                            />
                                        </li>
                                    </Fragment>
                                }
                            </ul>
                            :
                            <ul>
                                <Input
                                    labelText='_ID' 
                                    inputType='text'
                                    value={this.state.email}
                                    className='input__mail'
                                    onchange={(event) => this.handleMail(event)}
                                    info={true}
                                />  
                                <Input 
                                    labelText='_PSWD' 
                                    inputType='password' 
                                    value={this.state.password}
                                    className='input__pswd'
                                    onchange={(event) => this.handlePassword(event)}
                                />
                                {
                                    //A terminer le stay connect
                                }
                                <li>
                                    <ul className='connection__group__btn'>
                                        <Fields
                                            htmlFor='stayConnect' 
                                            text='_STAY_CO'
                                            inputType='checkbox'
                                            checked={this.state.remember}
                                            onChange={(e) => this.setState({remember: e.target.checked})}
                                        />
                                        <li>
                                            <Button
                                                className='forget__btn'
                                                buttonType='button'
                                                buttonText='_PSWD_FORGET'
                                                onClick={(event) => this.setState({forgot:true})}
                                            />
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <Button 
                                        className='connect__btn' 
                                        buttonType='submit' 
                                        buttonText='_CONNECT' 
                                        onClick={(event) => this.handleFormSubmit(event)}
                                    />
                                </li>
                            </ul>
                        }
                    </form>
                    <footer>
                        <a href='http://www.logipro.com/' target='_blank' rel='noopener noreferrer' className='logo__logipro'>Logipro</a>
                    </footer>
                </section>
            )
        }
    }
}

export default  Connection