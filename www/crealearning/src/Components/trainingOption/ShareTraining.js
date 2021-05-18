import React, { Component, Fragment } from 'react'
import cookie from 'react-cookies'

import hmacSHA256 from 'crypto-js/hmac-sha256'

//i18n
import { Translation } from 'react-i18next'

//Utilitaires
import Button from '../formWidget/Button'
import ShareTools from '../ShareTools'
import Fields from '../formWidget/Fields'
import FlashMessage from '../FlashMessage'

//Style
import './ShareTraining.scss'
import {fetchApi} from "../../Utils/Fetch";

class ShareTraining extends Component{

    state = {
        training: [],
        flashMessageStatus: '',
        flashMessage: '',
        quote:'',
        iframeWidth:500,
        iframeHeight:500,
        to:'',
        emailText:'',
    }

    async sendMail(event){
        event.preventDefault()
        let emailText = document.getElementsByClassName('texteArea')[0].innerHTML

        let response = await fetchApi('mail/send_share_mail', 'POST', true, {
            to:`${this.state.to}`,
            emailText: `${emailText}`
        })

        if(this.state.to){
            if (response){
                this.setState({flashMessageStatus: true, flashMessage: '_MAIL_SEND', messageClass:'success'})
                setTimeout(() => {
                    this.setState({flashMessageStatus: false})
                }, 5000)
            }
        } else {
            this.setState({flashMessageStatus: true, flashMessage: '_MAIL_TO_ERROR', messageClass:'error'})
            setTimeout(() => {
                this.setState({flashMessageStatus: false})
            }, 5000)
        }
    }

    handleChange = (event, target) => {
        this.state[target] = event.target.value;
        this.setState({target})
    }

    replaceSpace =(event, target) => {
        if(event.keyCode === 32)
        {
            this.state[target] = event.target.value.replace(/[ ,]+/g, ';');
            this.setState({target})
        }
    }

    render(){
        return (
            <form className='share__section'>
                {
                    this.state.flashMessageStatus ? <FlashMessage messageClass={this.state.messageClass}>{this.state.flashMessage}</FlashMessage> : <Fragment/>
                }
                <fieldset>
                    <legend><Translation>{(t) => t('_SHARE')}</Translation></legend>
                    <ul>
                        <Fields
                            liClass='training__url'
                            htmlFor='trainingLink' 
                            text='_SHARE_LINK'
                            inputType='text' 
                            value={this.props.trainingLink}
                        />
                        <ShareTools
                            shareUrl={this.props.trainingLink}
                            quote={this.props.trainingName}
                        />
                    </ul>
                </fieldset>
                <fieldset className='integrate-part'>
                    <legend><Translation>{(t) => t('_SHARE_IFRAME')}</Translation></legend>
                    <ul>
                        <Fields
                            liClass='code-link'
                            htmlFor='code-link' 
                            text='_SHARE_CODE'
                            inputType='text'
                            value={`<iframe width='${this.state.iframeWidth}' height='${this.state.iframeHeight}' src='${this.props.trainingLink}' frameborder='0' allowfullscreen></iframe>`}
                        />
                        <Fields
                            liClass='iframeWidth'
                            htmlFor='iframeWidth' 
                            text='_SHARE_WIDTH'
                            inputType='text' 
                            onChange={(event) => this.handleChange(event, 'iframeWidth')} 
                            value={this.state.iframeWidth}
                        />
                        <Fields
                            liClass='iframeHeight'
                            htmlFor='iframeHeight' 
                            text='_SHARE_HEIGHT'
                            inputType='text' 
                            onChange={(event) => this.handleChange(event, 'iframeHeight')} 
                            value={this.state.iframeHeight}
                        />
                    </ul>
                </fieldset>
                <form onSubmit={(event) => this.sendMail(event)} method='POST'>
                    <Translation>
                        {(t) =>
                            <fieldset className='send-part'>
                                <legend>{t('_SHARE_MAIL')}</legend>
                                <ul>
                                    <Fields
                                        liClass='destination'
                                        htmlFor='to' 
                                        text='_TO'
                                        inputType='text'
                                        onChange={(event) => this.handleChange(event, 'to')} 
                                        onKeyDown={(event) => this.replaceSpace(event, 'to')} 
                                        value={this.state.to} 
                                        required={true}
                                    />
                                    <Fields
                                        htmlFor='message' 
                                        text='_SHARE_MESS'
                                        liClass='message'
                                    >
                                        <div 
                                            className='texteArea' 
                                            name='message'
                                            id='message' 
                                            contentEditable='true' 
                                            dangerouslySetInnerHTML={{__html: t('_SHARE_MESSAGE_MAIL', {trainingLink:this.props.trainingLink, userName:this.props.userName, trainingName:this.props.trainingName})}}>
                                        </div>
                                    </Fields>
                                    <li>
                                        <Button
                                            className='mail__btn'
                                            buttonType='submit'
                                            buttonText='_SHARE_SEND'
                                            onClick={(event) => this.sendMail(event)}
                                        />
                                    </li>
                                </ul>
                            </fieldset>
                        }
                    </Translation>
                </form>
            </form>
        )
    }
}

export default ShareTraining