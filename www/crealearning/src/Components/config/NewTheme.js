import React, { Component } from 'react'
import {Redirect} from 'react-router-dom'
import cookie from 'react-cookies'

//Utilitaires
import NavBarSecondary from '../NavBarSecondary'
import Button from '../formWidget/Button'
import Fields from '../formWidget/Fields'
import {fetchApi} from "../../Utils/Fetch";

class NewTheme extends Component {
    state = {
        themePosition: '',
        themeTitle: '',
        tabs: [
            {'text': '_THEME', 'class': 'tab__link actif', 'link': '#theme'},
        ],
     }

    //Au submit du formulaire = création du thème
    async handleFormSubmit(event) {
        event.preventDefault()
        let response = await fetchApi('eot/new', 'POST', true, {
            themePosition: this.state.themePosition,
            themeTitle: this.state.themeTitle,
        })
    
        if(this.state.themeTitle){
            if (response){
                this.setState({flashMessage: true, message: '_THEME_CREATE_SUCCESS', messageClass:'success', redirect:true, redirect_path:'/EOManager'})
                
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
            <section>
                <NavBarSecondary
                    tabs={this.state.tabs}
                    className='tab__menu'
                />
                <form className='eoTheme__form' onSubmit={(event) => this.handleFormSubmit(event)}>
                    <fieldset>
                        <ul>
                            <Fields
                                htmlFor='themePosition' 
                                text='_ORDER'
                                inputType='number'
                                onChange={(event) => this.handleChange(event, 'themePosition')}
                                min='1'
                            />
                            <Fields
                                htmlFor='themeTitle' 
                                text='_TITLE'
                                inputType='text'
                                onChange={(event) => this.handleChange(event, 'themeTitle')}
                                required={true} 
                                helpTitle='_REQUIRED'
                            />
                        </ul>
                    </fieldset>
                    <li className='btn__list'>
                        <Button
                            className='orange__btn'
                            buttonText='_SAVE'
                            buttonType='submit'
                            onClick={(event) => this.handleFormSubmit(event)}
                        />
                    </li>
                </form>
            </section>
        );
    }
}

export default NewTheme