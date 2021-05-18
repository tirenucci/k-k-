import React, { Component, Fragment } from 'react'
import {Redirect} from 'react-router-dom'
import cookie from 'react-cookies'

//Global
import MainSection from '../../Components/MainSection'
import NavBar from '../../Components/NavBar'
import UserMenu from '../../Components/home/UserMenu'
import Footer from '../../Components/home/Footer'
import FlashMessage from '../../Components/FlashMessage'

//For EO Component
import EOList from '../../Components/config/EOList'
import NewEO from '../../Components/config/NewEO'
import DeleteModal from '../../Components/modal/DeleteModal'
import EditEO from '../../Components/config/EditEO'
import NewTheme from '../../Components/config/NewTheme'

//Style pour le tableau
import '../../Components/config/EOList.scss'
//Style (EditTheme, EditEO, NewEO, NewTheme )
import '../../Components/config/EOForm.scss'
import {fetchApi} from "../../Utils/Fetch";
import Header from "../../Components/Header";

class EOManager extends Component {

    constructor ({props}) {
        super(props)
    }

    state = {
        redirect: false,
        eoThemes: [],
        eo:[],
        wordSearch: "",
        regexPathEdit: new RegExp('^[a-zA-Z0-9\/]+(?:-[a-z0-9]+)*$'),
        mainTool: [
            {'type': 'new', 'link': '/EOManager/newTheme', 'title': '_CREATE_THEME', 'text':'_CREATE_THEME'}
        ],
        secondaryTool: [
            {'type': 'listing', 'link': '/EOManager', 'title': '_EO_SHOW_THEME_LIST', 'text':'_EO_SHOW_THEME_LIST'}
        ]
    }

    //Récupère tous les thèmes des objets intégrés
    componentDidMount= async function(){
        await this.getSocieties()
        await this.getAllEoThemes()
        await this.getAllEo()
        if (this.props.location.state !== undefined){
            this.setState({flashMessage: true, message: this.props.location.state.message, messageClass: this.props.location.state.messageClass})
        }
        setTimeout(() => {
            this.setState({flashMessage: false})
        }, 5000)
        document.title = this.props.title
    }

    //Récupération des données de l'API en asynchrone
    async getAllEoThemes() {

        let response = fetchApi('eot/get_all', 'GET')

        if (response){
            let eoThemes = await response
            this.setState({eoThemes})
        }
    }

    //Récupération des données de l'API en asynchrone
    async getAllEo() {
        let response = await fetchApi('eo', 'GET')

        if (response){
            let eo = await response
            this.setState({eo})
        }
    }

    //Récupère toute les sociétés pour le tableau
    async getSocieties() {
        this.setState({loading: true})
        let response = await fetchApi(`society/get_all?wordSearch=${this.state.wordSearch}`, 'GET')

        if (response){
            let societies = await response
            this.setState({societies, loading: false, page: Math.floor(societies.length / 25)})
            console.log(this.state.societies)
        }
    }

    //Affiche le modal pour confirmer la suppression d'un EO
    async showDeleteModal(event, id){
        this.setState({deleted: true, idDeleted: id})
    }

    //Supprimer un thème
    async deleteEoTheme(id){
        let response = await fetchApi('eot/delete', 'DELETE', true, {
            id: id
        })

        if (response) {
            await this.getAllEoThemes()
            this.setState({flashMessage: true, message: '_THEME_DELETE_SUCCESS', messageClass:'success', deleted: false})

            setTimeout(() => {
                this.setState({flashMessage: false})
            }, 1500)
        } else {
            this.setState({flashMessage: true, message: '_ERROR_DELETE_MESS', messageClass:'error', deleted: false})
            setTimeout(() => {
                this.setState({flashMessage: false})
            }, 1500)
        }
    }

    handleChange = async(event, society) => {
        society[event.target.name] = event.target.value
        this.setState({society})
        await this.getAllEo()
    }

    render () {
        let currentRoute = window.location.pathname

        if (this.state.redirect){
            return <Redirect to={this.state.redirect_path}/>
        }


        return (
            <div id='container'>
                <Header />
                <MainSection
                    tools={currentRoute === '/EOManager' ? this.state.mainTool : this.state.secondaryTool}
                    additionalClass='eo__section'
                    additionalTitleClass='with__tool'
                    titleText={`${currentRoute === '/EOManager' ? '_EO_LIST' 
                                : currentRoute === '/EOManager/newTheme' ? '_CREATE_THEME' 
                                : this.state.regexPathEdit.test(currentRoute) ? '_EO_EDIT'
                                : '_EO_ADD'}`}
                >
                    <select onChange={(event, target)=>this.handleChange(event, target)}>
                        {
                            this.state.societies instanceof Array ?
                                this.state.societies.map((society,key) =>(
                                    <option value= {society.id}>{society.name}</option>
                                ))
                            :
                            <Fragment/>
                        }
                    </select>
                    {
                        this.state.deleted === true ? 
                            <DeleteModal onOk={() => this.deleteEoTheme(this.state.idDeleted)} onAnnul={() => this.setState({deleted: false})}/> 
                        : this.state.flashMessage ? 
                            <FlashMessage messageClass={this.state.messageClass}>{this.state.message}</FlashMessage>
                        : 
                            <Fragment/>
                    }
                    {
                        currentRoute === '/EOManager' ? 
                            <EOList
                                eoThemes={this.state.eoThemes}
                                eo={this.state.eo}
                                deleteEoTheme={(event, id) => this.showDeleteModal(event, id)}
                                openEO={(event, id) => this.openEO(event, id)}
                            />
                        : currentRoute === '/EOManager/newTheme' ?
                            <NewTheme/>
                        : this.state.regexPathEdit.test(currentRoute) ?
                            <EditEO
                                eo_id={this.props.match.params.id}
                            />
                        :  
                        <NewEO/>
                    }
                </MainSection>
                <Footer/>
            </div>
        )
    }
}

export default EOManager