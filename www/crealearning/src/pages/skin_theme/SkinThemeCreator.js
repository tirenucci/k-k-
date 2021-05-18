import React, {Component} from 'react'
import { Redirect } from 'react-router-dom'
import cookie from 'react-cookies'

//Global
import MainSection from '../../Components/MainSection'
import NavBar from '../../Components/NavBar'
import UserMenu from '../../Components/home/UserMenu'
import Footer from '../../Components/home/Footer'
import NavBarSecondary from '../../Components/NavBarSecondary'

//Utilitaires
import Button from '../../Components/formWidget/Button'
import Fields from '../../Components/formWidget/Fields'

//Style
import './SkinThemeCreator.scss'
import {getUserInformation} from "../../Utils/GetUserInformation";
import {fetchApi} from "../../Utils/Fetch";
import Header from "../../Components/Header";

class SkinThemeCreator extends Component {

    state = {
        redirect: false,
        redirect_path: '/connection',
        redirect_state: '',
        skinTheme: [],
        tabs: [
            {'text': '_THEME', 'class': 'tab__link actif', 'link': '#theme'},
        ],
        tool:[
            {'type': 'listing', 'link': '/skintheme', 'title': '_SKIN_THEME_LIST', 'text':'_SKIN_THEME_LIST'}
        ],
        position: '',
        title: ''
    }

    async getLastPosition() {
        await getUserInformation().then(user => this.setState({user}))

        let response = await fetchApi(`skintheme/last_theme?society=${this.state.user.society_id}`, 'GET')

        if (response){
            const {position} = await response
            this.setState({position})
        }
    }    

    handleChange = (event, target) => { //On récupère l'évènement et un id du state
        let state = this.state
        state[target] = event.target.value;
        this.setState(state)
    }

    componentDidMount = async () => {
        await this.getLastPosition()
        document.title = this.props.title
    }

    async createNewTheme(){
        let response = await fetchApi('skintheme/create_theme', 'POST', true, {
            society: this.state.user.society_id,
            title: this.state.title,
            position: this.state.position
        })

        if (response){
            let data = await response
            this.setState({redirect: true, redirect_path: '/skintheme/' + data.id, redirect_state: {message: '_THEME_CREATE_SUCCESS', isRedirection: true, messageClass: 'success'}})
        }
    }

    createTheme = async (event) => {
        event.preventDefault()
        await this.createNewTheme()
    }

    render() {
        if (this.state.redirect)
        {
            return <Redirect to={{
                pathname: this.state.redirect_path,
                state: this.state.redirect_state
            }} />
        }

        return (
            <div id='container'>
                <Header />
                <MainSection titleText='_CREATE_THEME' tools={this.state.tool}>
                    <NavBarSecondary 
                        tabs={this.state.tabs}
                        className='tab__menu'
                    />
                    <form className='skinTheme__form' onSubmit={(event) => this.createTheme(event)}>
                        <fieldset>
                            <ul>
                                <Fields
                                    htmlFor='order' 
                                    text='_ORDER'
                                    inputType='number' 
                                    min='1' 
                                    onChange={(event, target) => this.handleChange(event, 'position')} 
                                    value={this.state.position}
                                />
                                <Fields
                                    htmlFor='title' 
                                    text='_TITLE'
                                    inputType='text' 
                                    onChange={(event, target) => this.handleChange(event, 'title')} 
                                    value={this.state.title}
                                    helpTitle='_REQUIRED' 
                                    required={true}
                                />
                                <Fields
                                    htmlFor='society'
                                    text='_SOCIETY'
                                    inputType='text'
                                    value={""}
                                    disabled={true}
                                />
                            </ul>
                        </fieldset>
                        <ul className='btn__list'>
                            <li>
                                <Button
                                    buttonText='_SAVE'
                                    buttonType='submit'
                                    className='orange__btn'
                                    onClick={(event) => this.createTheme(event)}
                                />
                            </li>
                        </ul>
                    </form>
                </MainSection>           
                <Footer/>
            </div>
        )

    }
}


export default SkinThemeCreator