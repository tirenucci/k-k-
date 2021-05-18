import React, { Component, Fragment } from 'react'
import {Redirect} from 'react-router-dom'
import cookie from 'react-cookies'

//Global
import NavBar from '../Components/NavBar'
import UserMenu from '../Components/home/UserMenu'
import Footer from '../Components/home/Footer'

//Utilitaires
import MainSection from '../Components/MainSection'
import SearchBar from '../Components/SearchBar'
import DeleteModal from '../Components/modal/DeleteModal'
import FlashMessage from '../Components/FlashMessage'
import Loader from '../Components/modal/Loader'
import Pagination from '../Components/trainings/Pagination'

//SocietyManager only
import NewSociety from '../Components/societyManager/NewSociety'
import SocietyList from '../Components/societyManager/SocietyList'
import EditSociety from '../Components/societyManager/EditSociety'

//Style du tableau
import './userManager/UserList.scss'
//Style NewSociety & EditSociety
import './userManager/NewUser.scss'
import {fetchApi} from "../Utils/Fetch";
import Header from "../Components/Header";


class SocietyManager extends Component {

    constructor ({props}) {
        super(props)
    }

    state = {
        redirect: false,
        modalShow: false,
        width: 0,
        currentPage: 0,
        societies: [],
        wordSearch: '',
        oldTarget: 'DESC',
        order: 'DESC',
        target: 'name',
        default_skin: 0,
        regexPathEdit: new RegExp('^[a-zA-Z0-9\/]+(?:-[a-z0-9]+)*$'),
        mainTool: [
            {'type': 'new', 'link': '/societyManager/add', 'title': '_SOCIETY_ADD', 'text':'_SOCIETY_ADD'}
        ],
        addTool: [
            {'type': 'listing', 'link': '/societyManager', 'title': '_SOCIETY_LIST', 'text':'_SOCIETY_LIST'}
        ],
        editTool: [
            {'type': 'listing', 'link': '/societyManager', 'title': '_SOCIETY_LIST', 'text':'_SOCIETY_LIST'},
            {'type': 'new', 'link': '/societyManager/add', 'title': '_SOCIETY_ADD', 'text':'_SOCIETY_ADD'}
        ]
    }

    componentDidMount = async() => {
        await this.getSocieties()
        if (this.props.location.state !== undefined){
            this.setState({flashMessage: true, message: this.props.location.state.message, messageClass: this.props.location.state.messageClass})

            setTimeout(() => {
                this.setState({flashMessage: false})
            }, 5000)
        }
        document.title = this.props.title
    }

    //Récupère toute les sociétés pour le tableau
    async getSocieties() {
        this.setState({loading: true})
        let response = await fetchApi(`society/get_all?wordSearch=${this.state.wordSearch}`, 'GET')

        if (response){
            let societies = await response
            this.setState({societies, loading: false, page: Math.floor(societies.length / 25)})
        }
    }

    //Affiche le modal pour confirmer la suppression d'une société
    async showDeleteModal(event, id){
        this.setState({deleted: true, idDeleted: id})
    }

    //Supprime la société sélectionnée
    async deleteUser(id){
        this.setState({loading:true})
        let response = await fetchApi('society/delete', 'DELETE', true, {
            id: id
        })

        if (response) {
            await this.getSocieties()
            this.setState({loading: false, flashMessage: true, message: 'Société supprimée avec succès', messageClass:'success', deleted: false})
        } else {
            this.setState({loading: false, flashMessage: true, message: '_ERROR_DELETE_MESS', messageClass:'error', deleted: false})
        }
    }

    async buttonClick(value) {
        await this.setState({currentPage: value})
        await this.getSocieties()
    }

    handleChange = (event, target) => {
        let state = this.state
        state[target] = event.target.value
        this.setState({target})
    }

    handleChangeBy = async(event) => {
        this.setState({status: event.target.value})
        await this.getSocieties()
    }

    handleSubmit = async(event) => {
        event.preventDefault()
        await this.getSocieties()
    }

    /*Tri dans les colonnes du tableau*/
    handleSort = (event, target, type) => {
        if (document.getElementsByClassName('ascent').length > 0)
        {
            document.getElementsByClassName('ascent')[0].classList.remove('ascent')
        }
        else if (document.getElementsByClassName('descent').length > 0)
        {
            document.getElementsByClassName('descent')[0].classList.remove('descent')
        }
        if(type === 'text' && this.state.oldTarget !== 'text')
        {
            this.setState({order: 'ASC'})
            event.target.classList.add('ascent')
        }
        else{
            if (this.state.order === 'DESC'){
                this.setState({order: 'ASC'})
                event.target.classList.add('ascent')
            }else{
                this.setState({order: 'DESC'})
                event.target.classList.add('descent')
            }
        }
        this.setState({target, oldTarget: type})
        this.getSocieties()
    }

    render() {
        let currentRoute = window.location.pathname

        if (this.state.redirect){
            return <Redirect to={this.state.redirect_path} />
        }

        return (
            <div id='container'>
                <Header />
                <MainSection
                    titleText={`${currentRoute === '/societyManager' ? '_SOCIETY_LIST' : currentRoute === '/societyManager/add' ? '_SOCIETY_ADD' : '_SOCIETY_EDIT'}`}
                    tools={currentRoute === '/societyManager' ? this.state.mainTool : currentRoute === '/societyManager/add' ? this.state.addTool : this.state.editTool}
                >
                    {
                        this.state.deleted === true ? 
                            <DeleteModal onOk={() => this.deleteUser(this.state.idDeleted)} onAnnul={() => this.setState({deleted: false})}/> 
                        : 
                        this.state.flashMessage ? 
                            <FlashMessage messageClass={this.state.messageClass}>{this.state.message}</FlashMessage>
                        :
                            this.state.loading ? 
                                <Loader/>
                        :
                        <Fragment/>
                    }
                    {
                        currentRoute === '/societyManager' ?
                            <Fragment>
                                <Pagination 
                                    page={this.state.page} 
                                    currentPage={this.state.currentPage} 
                                    count={this.state.societies.length}
                                    maxElement={25}
                                    nextClick={() => this.buttonClick(this.state.currentPage + 1)} 
                                    lastClick={() => this.buttonClick(this.state.page)} 
                                    firstClick={() => this.buttonClick(0)} 
                                    previousClick={() => this.buttonClick(this.state.currentPage - 1)}
                                />
                                <SearchBar
                                    additionalClass='search__society'
                                    placeholder='_SOCIETY_SEARCH'
                                    inputSize={this.state.width < 610 ? 45 : 50}
                                    handleChange={(event, target) => this.handleChange(event, target)}
                                    handleSubmit={(event) => this.handleSubmit(event)}
                                    onChangeBy = {(event) => this.handleChangeBy(event)}
                                    wordSearch={this.state.wordSearch}
                                />
                                <SocietyList
                                    societies={this.state.societies}
                                    currentPage={this.state.currentPage}
                                    deleteSociety={(event, id) => this.showDeleteModal(event, id)}
                                    onSort ={(event, target, type) => this.handleSort(event, target, type)}
                                />
                            </Fragment>
                        : currentRoute === '/societyManager/add' ?
                            <NewSociety/>
                        : this.state.regexPathEdit.test(currentRoute) ?
                            <EditSociety
                                society_id={this.props.match.params.id}
                            />
                        :
                            <Fragment/>
                    }   
                </MainSection>
                <Footer/>
            </div>
        )
    }
}

export default SocietyManager