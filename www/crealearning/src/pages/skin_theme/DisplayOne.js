import React, {Component, Fragment} from 'react'
import { Redirect } from 'react-router-dom'
import cookie from 'react-cookies'

//Global
import MainSection from '../../Components/MainSection'
import NavBar from '../../Components/NavBar'
import UserMenu from '../../Components/home/UserMenu'
import Footer from '../../Components/home/Footer'
import NavBarSecondary from '../../Components/NavBarSecondary'
import FlashMessage from '../../Components/FlashMessage'
import DeleteModal from '../../Components/modal/DeleteModal'
import Button from '../../Components/formWidget/Button'

//DisplayOne
import DeleteModalThemeNoEmpty from '../../Components/modal/DeleteModalThemeNoEmpty'
import AllSkin from '../../Components/skinTheme/displayOne/AllSkin'
import ThemeDisplay from '../../Components/skinTheme/displayOne/ThemeDisplay'
import SkinPreview from '../../Components/modal/SkinPreview'
import {fetchApi} from "../../Utils/Fetch";
import Header from "../../Components/Header";

class DisplayOne extends Component {

    state = {
        deleted: false,
        theme: [],
        title : '',
        position: '',
        redirect_path: '',
        redirect_state: '',
        flashMessageStatus: false,
        theme_id: this.props.match.params['id'],
        tabs: [
            {'text': '_THEME', 'class': 'tab__link actif', 'link': '#theme'},
            {'text': '_DELETE', 'class': 'tab__link', 'link': '#suppression'},
        ],
        buttons: [
            {'class':'orange__btn', 'type':'submit', 'text':'_SAVE'}
        ],
        tools: [
            {'type': 'import', 'link':`/skin/import/${this.props.match.params['id']}`, 'title': '_IMPORT_SKIN', 'text':'_IMPORT_SKIN'},
            {'type': 'listing', 'link': '/skintheme', 'title': '_SKIN_THEME_LIST', 'text':'_SKIN_THEME_LIST'}
        ]
    }

    componentDidMount(){
        if (this.props.location.state !== undefined){
            this.setState({
                message: this.props.location.state.message,
                isRedirection: this.props.location.state.isRedirection,
                messageClass: this.props.location.state.messageClass
            })
        }
        if (this.props.location.hash === '#suppression')
        {
            this.setState({tabs: [
                                    {'text': '_THEME', 'class': 'tab__link', 'link': '#theme'},
                                    {'text': '_DELETE', 'class': 'tab__link actif', 'link': '#suppression'},
                                 ]
                            })
        }
        document.title = this.props.title
        this.getTheme()
    } 

    handleChange = (event, target) => { //On récupère l'évènement et un id du state
        this.state[target] = event.target.value
        this.setState({target})
    }

    async getTheme(){
        let response = await fetchApi(`skintheme/theme?id=${this.state.theme_id}`, 'GET')

        if (response){
            const theme = await response
            this.setState({theme})
            const {position, title} = this.state.theme
            this.setState({position, title})
        }
    }

    updateTheme = async(event) => {
        event.preventDefault()
        await this.updateThemeBack()
    }

    async updateThemeBack(){
        let response = await fetchApi('skintheme/update_all', 'PUT', true, {
            id: this.state.theme_id,
            title: this.state.title,
            position: this.state.position
        })


        if (response){
            this.setState({flashMessageStatus: true, flashMessage: '_THEME_UPDATE_SUCCESS', messageClass:'success'})
        }
    }

    async delete(id){
        let response = await fetchApi('skintheme/delete', 'DELETE', true, {
            id: id
        })

        if (response){
            this.setState({redirect: true, redirect_path: '/skintheme', redirect_state: {isRedirection: true, redirect_message: '_THEME_DELETE_SUCCESS', messageClass:'success'}})
        }
    }

    async updateSkinTheme(id, status, all){
        let response
        if (all){
            response = await fetchApi('skin/update_all_skin', 'PUT', true, {
                id: id,
                status: status
            })
        } else {
            response = await fetchApi('skin/update_one_skin', 'PUT', true, {
                id: id,
                status: status
            })
        }
    }

    handleClick = async(event, key) => {
        const {theme} = this.state
        theme.skin[key].status === '_ACTIVE' ? theme.skin[key].status = '_DESACTIVE' : theme.skin[key].status = '_ACTIVE'
        this.setState({theme})
        await this.updateSkinTheme(theme.skin[key].id, theme.skin[key].status, false)
    }

    handleEnableClick = async() => {
        const {theme} = this.state
        theme.skin.map((m) => (
            m.status = '_ACTIVE'
        ))
        this.setState({theme})
        await this.updateSkinTheme(theme.id, '_ACTIVE', true)
    }

    handleDisableClick = async() => {
        const {theme} = this.state
        theme.skin.map((m) => (
            m.status = '_DESACTIVE'
        ))
        this.setState({theme})
        await this.updateSkinTheme(theme.id, '_DESACTIVE', true)
    }

    handleClickSkin = (event, id) => {
        this.setState({redirect: true, redirect_path: `/skin/${id}`})
    }

    render(){
        const {theme} = this.state
        if (this.state.isRedirection)
        {
            setTimeout(() => {
                this.setState({isRedirection: false, message: ''})
            }, 5000)
        }

        if (this.state.flashMessageStatus){
            setTimeout(() => {
                this.setState({flashMessageStatus: false, flashMessage: ''})
            }, 5000)
        }

        if (this.state.redirect){
            return <Redirect  to={{
                pathname: this.state.redirect_path,
                state: this.state.redirect_state
            }}  />
        }
        return(
            <div id='container'>
                <Header />
                <MainSection titleText='_SKIN' additionalTitleClass='with__tools' tools={this.state.tools}>
                    <NavBarSecondary 
                        tabs={this.state.tabs}
                        className='tab__menu'
                    />
                    {
                        this.state.flashMessageStatus ? 
                            <FlashMessage messageClass={this.state.messageClass}>{this.state.flashMessage}</FlashMessage> 
                        :
                        this.state.deleted && this.state.theme.skin === undefined ? 
                            <DeleteModal onOk={() => this.delete(this.state.theme.id)} onAnnul={() => this.setState({deleted: false})}/> 
                        : 
                        this.state.deleted && this.state.theme.skin !== undefined ? 
                            <DeleteModalThemeNoEmpty onAnnul={() => this.setState({deleted: false})}/>
                        :
                        this.state.isRedirection ? 
                            <FlashMessage messageClass={this.state.messageClass}>{this.state.message}</FlashMessage>
                        :
                        this.state.showSkinPreview ?
                            <SkinPreview
                                src={this.state.previewSrc}
                                onAnnul={() => this.setState({showSkinPreview:false})}
                            />
                        :
                            <Fragment/>
                    }
                    {
                        this.props.location.hash === '#suppression' ? 
                        <section className='delete__btn__section'>
                            <Button 
                                className='delete__btn'
                                type='button'
                                buttonText='_THEME_DELETE'
                                onClick={() => this.setState({deleted: true})}
                            />
                        </section>
                         :
                        <Fragment>
                            <ThemeDisplay
                                theme={this.state.theme}
                                position={this.state.position}
                                title={this.state.title}
                                handleChange={(event, target) => this.handleChange(event, target)}
                                updateTheme={(event) => this.updateTheme(event)}
                            />
                            <AllSkin
                                theme={this.state.theme}
                                skin={this.state.theme.skin}
                                theme_folder={theme.folder_name}
                                handleClick={(event, key) => this.handleClick(event, key)}
                                handleEnableClick={() => this.handleEnableClick()}
                                handleDisableClick={() => this.handleDisableClick()}
                                handleClickSkin={(event, id) => this.handleClickSkin(event, id)}
                                showSkinPreview={(event, src) => this.setState({showSkinPreview:true, previewSrc: src})}
                            />
                        </Fragment>
                    }
                </MainSection>
                <Footer/>
            </div>
        )
    }
}

export default DisplayOne