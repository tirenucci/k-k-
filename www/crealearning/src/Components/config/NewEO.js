import React, { Component, Fragment } from 'react'
import cookie from 'react-cookies'
import {Redirect} from 'react-router-dom'

//Utilitaires
import Button from '../formWidget/Button'
import Option from '../html/Option'
import FlashMessage from '../FlashMessage'
import Image from '../Image'
import Fields from '../formWidget/Fields'
import {fetchApi} from "../../Utils/Fetch";

class NewEO extends Component {

    state = {
        eo:'',
        eoThemes:[],
        theme:'',
        position:'',
        title:'',
        url:'',
        description:'',
        logo:''
    }

    componentDidMount(){
        this.getAllEoThemes()
    }

    //Récupération des thèmes pour le select
    async getAllEoThemes() {
        let response = await fetchApi('eot/get_all', 'GET')

        if (response) {
            let eoThemes = await response
            this.setState({eoThemes})
        }
    }

        //Au submit du formulaire = création du thème
        async handleFormSubmit(event) {
            event.preventDefault()

            let response = await fetchApi('eo/new', 'POST', true, {
                theme: this.state.theme,
                position: this.state.position,
                title: this.state.title,
                url: this.state.url,
                description: this.state.description,
                logo: this.state.logo
            })
        
            if(this.state.theme){
                if (response){
                    this.setState({flashMessage: true, message: '_EO_ADD_SUCCESS', messageClass:'success', redirect:true, redirect_path:'/EOManager'})
                    
                    setTimeout(() => {
                        this.setState({flashMessage: false})
                    }, 5000)
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

    handleChange = (event, target) => {
        let state = this.state
        state[target] = event.target.value
        this.setState(state)
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
             <article>
                {
                    this.state.flashMessage ? <FlashMessage messageClass={this.state.messageClass}>{this.state.message}</FlashMessage> : <Fragment/>
                }
                    <form onSubmit={(event) => this.handleFormSubmit(event)} className='eo__creator'>
                        <fieldset>
                            <ul>
                                <Fields
                                    htmlFor='theme' 
                                    text='_THEME'
                                    required={true}
                                >
                                    <select name='theme' id='theme' onChange={(event) => this.handleChange(event, 'theme')} required>
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
                                    onChange={(event) => this.handleChange(event, 'position')}
                                    min='1'
                                />               
                                <Fields
                                    htmlFor='title' 
                                    text='_TITLE'
                                    inputType='text' 
                                    onChange={(event) => this.handleChange(event, 'title')}
                                    required={true}
                                />
                                <Fields
                                    htmlFor='url' 
                                    text='_URL'
                                    inputType='text' 
                                    onChange={(event) => this.handleChange(event, 'url')} 
                                />
                                <Fields
                                    htmlFor='description' 
                                    text='_DESCRIPTION'
                                    textarea={true}
                                    onChange={(event) => this.handleChange(event, 'description')} 
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
                                <Image src='/assets/img/small-default-thumb.png' alt='_NO_PICTURE' figcaptionText='_NO_PICTURE'/>
                            </ul>
                        </fieldset>
                        <li className='btn__list inherit'>
                            <Button
                                className='orange__btn'
                                buttonText='_SAVE'
                                buttonType='submit'
                                onClick={(event) => this.handleFormSubmit(event)}
                            />
                        </li>
                    </form>
        </article>
        )
    }
}

export default NewEO