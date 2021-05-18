import React, {Component, Fragment} from 'react'
import {Redirect} from 'react-router-dom'

//Global
import MainSection from '../../Components/MainSection'
import NavBar from '../../Components/NavBar'
import UserMenu from '../../Components/home/UserMenu'
import Footer from '../../Components/home/Footer'

//Utilitaires
import NavBarSecondary from '../../Components/NavBarSecondary'
import Button from '../../Components/formWidget/Button'
import DeleteModal from '../../Components/modal/DeleteModal'
import FlashMessage from '../../Components/FlashMessage'

//For SkinForm
import Form from '../../Components/skin/skinForm/Form'
import SkinInformation from '../../Components/SkinInformation'

//Style
import './SkinForm.scss'
import {fetchApi} from "../../Utils/Fetch";
import Header from "../../Components/Header";

class SkinForm extends Component{

    state = {
        redirect: false,
        isRedirection: false,
        redirect_path: '',
        redirect_state: [],
        skin: [],
        themes: [],
        message: '',
        deleted: false,
        tabs: [
            {'text': '_PROPERTIES', 'class': 'tab__link actif', 'link': '#theme'},
            {'text': '_DELETE', 'class': 'tab__link', 'link': '#suppression'},
        ],
        tool: [
            {'type': 'listing', 'link': '/skintheme', 'title': '_SKINS_LIST', 'text':'_SKINS_LIST'}
        ]
    }

    componentDidMount = async() =>{
        await this.getThemes()
        await this.getSkin()
        if (this.props.location.hash === '#suppression')
        {
            this.setState({
                tabs: [
                    {'text': '_THEME', 'class': 'tab__link', 'link': '#theme'},
                    {'text': '_DELETE', 'class': 'tab__link actif', 'link': '#suppression'}
                ]
            })
        }
    }

    async updateSkin(){
        let response = await fetchApi('skin/update_with_form', 'POST', true, {
            id: this.state.skin.id,
            theme_id: this.state.skin.theme_id,
            position: this.state.skin.position,
            colorName: this.state.skin.colorName,
            colorCode: this.state.skin.colorCode,
            oldThemeFolder: this.state.skin.theme_folder,
            oldSkinFolder: this.state.skin.skin_folder
        })

        if (response){
            this.setState({isRedirection: true, message: '_SKIN_UPDATE_SUCCESS', messageClass:'success'})
        }
    }

    async getThemes(){
        let response = await fetchApi(`skintheme/get_all?wantSkin=${false}&society_id=${window.$user.society_id}`, 'GET')

        if (response){
            const themes = await response
            this.setState({themes})
        }
    }

    async getSkin(){
        let response = await fetchApi(`skin/get_one?id=${this.props.match.params.skin}`, 'GET')

        if (response) {
            const skin = await response
            this.setState({skin})
        }
    }

    handleChange = (event, field) => {
        let {skin} = this.state
        skin[field] = event.target.value
        this.setState({skin})
    }

    handleSubmit = async(event) => {
        event.preventDefault()
        await this.updateSkin()
    }

    onDelete(){
        this.setState({deleted: true})
    }

    async deleteSkin(){
        let response = await fetchApi('skin/delete', 'POSt', true, {
            id: this.state.skin.id,
            skin_folder: this.state.skin.skin_folder,
            theme_folder: this.state.skin.theme_folder
        })


        if (response) {
            this.setState({redirect: true, redirect_path: '/skintheme/' + this.state.skin.theme_id, redirect_state: {message: '_SKIN_DELETE_SUCCESS', messageClass:'success', isRedirection: true}})
        } else {
            //A compléter
        }
    }

    render(){
        if (this.state.redirect)
        {
            return <Redirect to={{
                pathname: this.state.redirect_path,
                state: this.state.redirect_state
            }} />
        }
        if (this.state.isRedirection)
        {
            setTimeout(() => {
                this.setState({isRedirection: false, message: ''})
            }, 5000)
        }

        return(
            <div id='container'>
                <Header />
                <MainSection titleText='_SKIN' tools={this.state.tool}>
                    <NavBarSecondary 
                        tabs={this.state.tabs}
                        className='tab__menu'
                    />
                    {
                        this.state.isRedirection ? <FlashMessage>{this.state.message}</FlashMessage> 
                        :
                        this.state.deleted ? <DeleteModal onOk={() => this.deleteSkin()} onAnnul={() => this.setState({deleted: false})}/>
                        :
                        <Fragment/>
                    }
                    { 
                        this.props.location.hash !== '#suppression' ?
                        <section className='skin__info__section'>
                            <SkinInformation
                                skin={this.state.skin} 
                            />
                            <Form
                                skin={this.state.skin} 
                                themes={this.state.themes}
                                handleSubmit={(event) => this.handleSubmit(event)}
                                handleChange={(event, target) => this.handleChange(event, target)}
                            />
                        </section>
                        :
                        <section className='delete__btn__section'>
                            <Button 
                                className='delete__btn'
                                type='button'
                                buttonText='_SKIN_DELETE'
                                onClick={() => this.onDelete()}
                            />
                        </section>
                    }
                </MainSection>
                <Footer/>
            </div>
        )
    }
}

export default SkinForm