import React, {Component, Fragment} from 'react'
import { Redirect } from 'react-router-dom'
import cookie from 'react-cookies'

//Utilitaires
import Button from '../Components/formWidget/Button'
import Input from '../Components/formWidget/Input'
import Title from '../Components/Title'
import Fields from '../Components/formWidget/Fields'

//ResetPassword
import ExpiredToken from './ExpiredToken'
import ConnectionMessage from '../Components/connection/ConnectionMessage'

//Style
import './Connection.scss'
import {fetchApi} from "../Utils/Fetch";

class ResetPassword extends Component {

    constructor({props}){
        super(props)
        this.state = {
            redirect: false,
            error : false,
            tokenOk: undefined,
            resestOk: '',
            information: {
                password: '',
                confirmed_password: '',
                username: ''
            }
        }
    }

    componentDidMount = async() => {
        await this.resetPossible()
        this.setState({token: this.props.match.params.token})
        /*Permet d'ajouter une classe différente au body afin de ne pas conserver le style définit pour le body d'autre components*/
        document.body.className='body__connection'
        document.title = this.props.title
    }

    async resetPossible() {

        let response = await fetchApi(`user/connection/${this.props.match.params.token}`, 'GET', false)

        if (!response)
        {
            this.setState({'redirect': true})
        } else {
            let data = await response
            let {status, avatar, id, username, infinity} = data
            this.setState({tokenOk: status, avatar, id, username, infinity })
            if (this.state.infinity !== undefined) {
                let {information} = this.state
                information.username = username
                this.setState({information})
            }
        }


    }

    handleChange = (event) => {
        let {information} = this.state
        information[event.target.name] = event.target.value
        this.setState({information})

    }

    handleFormSubmit = async(event) => {
        if(event !== undefined){
            event.preventDefault()
        }
        if (this.state.information.password === this.state.information.confirmed_password){
            await this.sendNewPassword()
            this.setState({resestOk:true})
        }
        else
        {
            this.setState({error: true})
            setTimeout(() => {
                this.setState({error: false})
            }, 5000)
        }
    }

    async sendNewPassword(){
        let response = await fetchApi(`user/connection/${this.state.token}`, 'POST', false, {
            information: {...this.state.information}
        })

        if (response) {
            let data = await response
            cookie.save('SSID', data['ssid'], {
                path: '/'
            })
            this.setState({redirect: true})
        }
    }

    render () {
        let currentRoute = window.location.pathname

        if (this.state.redirect) {
            return <Redirect to='/connection' />
        }
        return (
            <section className='connection__section'>
                {
                    this.state.tokenOk === undefined ? <Fragment />
                    :
                        this.state.tokenOk === 'valid' ?
                            <Fragment>
                                <Title additionalClass='connection__title' text={ currentRoute === `/connection/${this.state.token}` ? '_CONECTION_ID' : '_NEW_PSWD'}/>
                                <form  className='connection__form' onSubmit={(event) => this.handleFormSubmit(event)}>
                                        {
                                            this.state.error ? 
                                            <ConnectionMessage
                                                className='connection__error'
                                                message='_CONNECTION_ERROR_3'
                                            />
                                            :
                                            <Fragment/>
                                        }
                                    <ul>
                                        {
                                            this.state.resestOk ? 
                                            <li>
                                                <ConnectionMessage
                                                    className='pswd__explain'
                                                    message='_PSWD_RESET'
                                                    redirectMessage='_REDIRECT_MESSAGE'
                                                />
                                            </li>
                                            :
                                            <Fragment>
                                                <Input
                                                    disabled={this.state.infinity !== undefined }
                                                    className='input__mail'
                                                    labelText='_CUSTOMER_USERNAME'
                                                    inputType='text'
                                                    name='username'
                                                    value={this.state.information.username}
                                                    onchange={(event) => this.handleChange(event)}
                                                />
                                                <Input 
                                                    className='input__pswd'
                                                    labelText='_USER_PSWD' 
                                                    inputType='password'
                                                    name='password'
                                                    onchange={(event) => this.handleChange(event)}
                                                />
                                                <Input
                                                    className='input__pswd'
                                                    labelText='_USER_PSWD_CONFIRM' 
                                                    inputType='password' 
                                                    name='confirmed_password'
                                                    onchange={(event) => this.handleChange(event)}
                                                />
                                                {
                                                    //A terminer
                                                }
                                                <Fields
                                                    liClass='connection__group__btn'
                                                    htmlFor='stayConnect' 
                                                    text='_STAY_CO'
                                                    inputType='checkbox'
                                                />
                                            </Fragment>
                                        }
                                    </ul>
                                    {
                                        this.state.resestOk ?
                                        <Fragment/>
                                        :
                                        <Button 
                                            className='connect__btn' 
                                            buttonType='submit' 
                                            buttonText='_CONFIRM' 
                                            onClick={(event) => this.handleFormSubmit(event)} 
                                        />
                                    }
                                </form>
                            </Fragment>
                        :
                            <ExpiredToken
                                avatar={this.state.avatar}
                                id={this.state.id}
                            />
                }
            </section>
        )
    }
}

export default ResetPassword