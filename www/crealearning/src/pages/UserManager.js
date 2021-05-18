import React, { Component, Fragment } from 'react'
import {Redirect} from 'react-router-dom'

//Global
import MainSection from '../Components/MainSection'
import NavBar from '../Components/NavBar'
import UserMenu from '../Components/home/UserMenu'
import Footer from '../Components/home/Footer'

//UserManager only
import UserList from './userManager/UserList'
import NewUser from './userManager/NewUser'
import EditUser from './userManager/EditUser'
import SearchBar from '../Components/SearchBar'
import DeleteModal from '../Components/modal/DeleteModal'
import FlashMessage from '../Components/FlashMessage'
import Loader from '../Components/modal/Loader'
import Pagination from '../Components/trainings/Pagination'
import cookie from 'react-cookies'

//Style du tableau
import './userManager/UserList.scss'
//Style NewUser & EditUser
import './userManager/NewUser.scss'
import {fetchApi} from "../Utils/Fetch";
import {getUserInformation} from "../Utils/GetUserInformation";
import Header from "../Components/Header";

class UserManager extends Component {

    constructor ({props}) {
        super(props)
    }

    state = {
        width: 0,
        redirect: false,
        modalShow: false,
        currentPage: 0,
        oldTarget: 'DESC',
        order: 'DESC',
        target: 'name',
        users:[],
        wordSearch:'',
        regexPathEdit: new RegExp('^[a-zA-Z0-9\/]+(?:-[a-z0-9]+)*$'),
        options: [
            {'textTranslate': '_ALL', 'value':'_ALL'},
            {'textTranslate': '_USER_ACTIVE', 'value':'_USER_ACTIF'},
            {'textTranslate': '_USER_INACTIVE', 'value':'_USER_INACTIF'},
        ],
        mainTool: [
            {'type': 'new', 'link': '/userManager/add', 'title': '_USER_ADD', 'text':'_USER_ADD'}
        ],
        offerFilter: '_ALL_OFFER',
        filterStatus: '_ALL',
    }

    componentDidMount = async() => {
        await this.getUsers()
        if (this.props.location.state !== undefined){
            this.setState({flashMessage: true, message: this.props.location.state.message, messageClass: this.props.location.state.messageClass})
            setTimeout(() => {
                this.setState({flashMessage: false})
            }, 1500)
        }
        document.title = this.props.title
    }

    //Récupère tout les users pour le tableau
    async getUsers() {
        this.setState({loading: true})
        let response = await fetchApi(`user/all_user?searchWord=${this.state.wordSearch}&status=${this.state.filterStatus}&offer=${this.state.offerFilter}`,
            'GET')


        if (response){
            let users = await response
            this.setState({users, loading: false, page: Math.floor(users.length / 25)})
        }
    }

    //Récupère toute les offres de l'appli
    async getOffers() {
        let response = await fetchApi('offer/all', 'GET')

        if (response){
            let creaOffers = await response
            this.setState({creaOffers})
        }
    }

    async getSocieties() {
        let response = await fetchApi(`society/get_all?wordSearch=${this.state.wordSearch}`, 'GET')

        if (response){
            let societies = await response
            this.setState({societies})
        }
    }

    async showDeleteModal(e, id){
        this.setState({deleted: true, idDeleted: id})
    }

    async deleteUser(id){
        this.setState({loading:true})
        let response = await fetchApi('user/delete', 'DELETE', true, {
            id: `${id}`
        })


        if (response) {
            await this.getUsers()
            this.setState({loading: false, flashMessage: true, message: '_USER_DELETE_SUCCESS', messageClass:'success', deleted: false})
        } else {
            this.setState({loading: false, flashMessage: true, message: '_ERROR_DELETE_MESS', messageClass:'error', deleted: false})
        }
    }

    async buttonClick(value) {
        await this.setState({currentPage: value})
        await this.getUsers()
    }

    async buttonAccess (event, id) {

        let response = await fetchApi(`user/get_data?id=${id}&security=true`, 'GET')

        if (response) {
            let data = await response
            await cookie.save('crea_oldcookie', cookie.load('SSID'), {
                path: '/'
            })
            await cookie.save('SSID', data['connection_token'], {
                path: '/'
            })
            window.location.pathname =`/`
        }
    }

    /*Tri dans les colonnes du tableau*/
    handleSort = async(event, target, type) => {
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
        await this.getUsers()
    }

    handleChange = (event, target) => {
        let state = this.state
        state[target] = event.target.value
        this.setState(state)
    }

    handleSubmit = async(event) => {
        event.preventDefault()
        await this.getUsers()
    }

    render() {
        setTimeout(() => {
            this.setState({width: window.innerWidth})
        }, 100)

        if (this.state.redirect){
            return <Redirect to={this.state.redirect_path}/>
        }

        return (
            <Fragment>
                {
                    this.state.users !== undefined ?
                        <div id='container'>
                            <Header />
                            <MainSection 
                                titleText={'_USER_LIST'}
                                tools={this.state.mainTool}
                            >
                                    {
                                        this.state.deleted ? 
                                            <DeleteModal onOk={() => this.deleteUser(this.state.idDeleted)} onAnnul={() => this.setState({deleted: false})}/> 
                                        : 
                                        this.state.flashMessage ? 
                                            <FlashMessage messageClass={this.state.messageClass}>{this.state.message}</FlashMessage> 
                                        :
                                        this.state.loading ? <Loader/>
                                        : 
                                        <Fragment/>                    
                                    }
                                    {
                                        <Fragment>
                                            <Pagination 
                                                page={this.state.page} 
                                                currentPage={this.state.currentPage} 
                                                count={this.state.users.length}
                                                maxElement={25}
                                                nextClick={() => this.buttonClick(this.state.currentPage + 1)} 
                                                lastClick={() => this.buttonClick(this.state.page)} 
                                                firstClick={() => this.buttonClick(0)} 
                                                previousClick={() => this.buttonClick(this.state.currentPage - 1)}
                                            />
                                            <SearchBar
                                                additionalClass='search__user'
                                                placeholder={this.state.width < 700 ? '_SEARCH_BY_NAME' : '_USER_SEARCH'}
                                                inputSize={50}
                                                filterLabel='_STATUS'
                                                filterOptions={this.state.options}
                                                secondFilter={true}
                                                offerFilter={this.state.offerFilter}
                                                wordSearch={this.state.wordSearch}
                                                handleChange={(event, target) => this.handleChange(event, target)}
                                                handleSubmit={(event) => this.handleSubmit(event)}
                                            />
                                            <UserList
                                                users={this.state.users}
                                                currentPage={this.state.currentPage}
                                                onDelete={(e, id) => this.showDeleteModal(e, id)}
                                                onSort ={(event, target, type) => this.handleSort(event, target, type)}
                                                onAccess={(e,id)=> this.buttonAccess(e,id)}
                                            />
                                        </Fragment>
                                    }
                            </MainSection>
                            <Footer/>
                        </div>

                    :
                        <Fragment/>
                }
            </Fragment>
        )
    }
}

export default UserManager