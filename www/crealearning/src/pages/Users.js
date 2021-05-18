import React, { Component, Fragment } from 'react'
import {Redirect} from 'react-router-dom'
import cookie from 'react-cookies'

//Global
import MainSection from '../Components/MainSection'
import NavBar from '../Components/NavBar'
import UserMenu from '../Components/home/UserMenu'
import Footer from '../Components/home/Footer'
import Pagination from '../Components/trainings/Pagination'

//For Users Component
import UserList from '../Components/users/UserList'
import SearchBar from '../Components/SearchBar'
import DeleteModal from '../Components/modal/DeleteModal'
import UserCreator from '../Components/modal/UserCreator'
import FlashMessage from '../Components/FlashMessage'
import { findByLabelText } from '@testing-library/react'
import {getUserInformation} from "../Utils/GetUserInformation";
import {fetchApi} from "../Utils/Fetch";
import Header from "../Components/Header";

class Users extends Component {

    constructor ({props}) {
        super(props)
    }

    state = {
        redirect: false,
        options: [
            {'textTranslate': '_AUTHOR_ADMIN', 'value':'ROLE_ADMINISTRATOR'},
            {'textTranslate': '_AUTHOR', 'value':'ROLE_AUTHOR'},
            {'textTranslate': '_AUTHOR_CONSULTANT', 'value':'ROLE_USER'},
        ],
        tools: [
            {'type': 'new', 'title': '_USER_ADD', 'text':'_USER_ADD'}
        ],
        selectOptions: [
            {'value':'choice', 'unselectable':true, 'textTranslate':'_CHOOSE'},
            {'value':'ROLE_ADMINISTRATOR', 'title':'_ADMIN_DESC', 'textTranslate':'_AUTHOR_ADMIN'},
            {'value':'ROLE_AUTHOR', 'title':'_AUTHOR_DESC', 'textTranslate':'_AUTHOR'},
            {'value':'ROLE_USER', 'title':'_CONSULTANT_DESC', 'textTranslate':'_AUTHOR_CONSULTANT'},
        ],
        width:0,
        wordSearch:'',
        currentPage: 0,
        authors:[],
        nameAuthor:'',
        firstnameAuthor:'',
        mailAuthor:'',
        roleAuthor:'',

    }

    componentDidMount = async() => {
        await this.getAllAuthor()
        document.title = this.props.title
    }

    //Affiche les auteurs de la socitété
    async getAllAuthor(){
        let response = await fetchApi('user/get_all', 'GET')

        if (response){
            this.setState({authors: response['authors'], number_account: response['number_account'], page: Math.floor(response['authors'].length / 25)})
        }
    }

        //Soumet le formulaire de création puis enregistre la création en BDD
        async handleFormSubmit(event) {
            event.preventDefault()
            let response = await fetchApi('author/create', 'POST', true, {
                name:`${this.state.nameAuthor}`,
                firstName:`${this.state.firstnameAuthor}`,
                email: `${this.state.mailAuthor}`,
                role: `${this.state.roleAuthor}`,
            })
    
            if(this.state.nameAuthor && this.state.firstnameAuthor && this.state.mailAuthor && this.state.roleAuthor){
                if (response){
                    this.setState({flashMessage: true, message: '_AUTHOR_SUCCESS', messageClass:'success', userCreatorModal: false, firstnameAuthor: '', mailAuthor: '', roleAuthor: '', nameAuthor: ''})
                    setTimeout(() => {
                        this.setState({flashMessage: false})
                    }, 5000)
                    await this.getAllAuthor()
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

    //Pour le changement de valeur des inputs et select
    handleChange = (event, target) => {
        let state = this.state
        state[target] = event.target.value
        this.setState(state)
    }

    async handleChangeRole(event, key){
        let {authors} = this.state
        authors[key][event.target.name] = event.target.value
        this.setState({authors})
        await fetchApi('user/edit_user', 'PUT', true, {
            id: authors[key].id,
            role: authors[key].role,
            status: authors[key].status
        })
    }

    //Affiche le modal pour confirmer la suppression d'un user
    async showDeleteModal(event, id){
        event.preventDefault()
        this.setState({deleted: true, idDeleted: id})
    }

    //Suppression
    async deleteAuthor(id){
        let response = await fetchApi('user/delete', 'DELETE', {
            id: id
        })

        if (response) {
            this.setState({loading: false, flashMessage: true, message: '_AUTHOR_DELETE_SUCCESS', messageClass:'success', deleted: false})
            setTimeout(() => {
                this.setState({flashMessage: false})
            }, 5000)
            await this.getAllAuthor()
        } else {
            this.setState({loading: false, flashMessage: true, message: '_ERROR_DELETE_MESS', messageClass:'error', deleted: false})
            setTimeout(() => {
                this.setState({flashMessage: false})
            }, 5000)
        }
    }
    async buttonClick(value) {
        await this.setState({currentPage: value})
        await this.getAllAuthor()
    }

    render () {
        if (this.state.redirect){
            return <Redirect to={this.state.redirect_path}/>
        }

        setTimeout(() => {
            this.setState({width: window.innerWidth})
        }, 100)

        return (
            <Fragment>
                {
                    <div id='container'>
                        <Header />
                        <MainSection titleText='_USER_LIST' tools={this.state.authors.length < this.state.number_account || this.state.number_account === -1 ? this.state.tools : ''} onClick={() => {this.setState({userCreatorModal:true})}}>
                            {
                                this.state.userCreatorModal && (this.state.authors.length < this.state.number_account || this.state.number_account === -1) ?
                                    <UserCreator
                                        nameAuthor={this.state.nameAuthor}
                                        firstnameAuthor={this.state.firstnameAuthor}
                                        roleAuthor={this.state.roleAuthor}
                                        mailAuthor={this.state.mailAuthor}
                                        onChange={(event, target) => this.handleChange(event, target)}
                                        createAuthor={(event) => this.handleFormSubmit(event)}
                                        onAnnul={() => this.setState({userCreatorModal: false})}
                                        options={this.state.selectOptions}
                                    />
                                : this.state.deleted ?
                                    <DeleteModal
                                        onOk={() => this.deleteAuthor(this.state.idDeleted)}
                                        onAnnul={() => this.setState({deleted: false})}
                                    />
                                : this.state.flashMessage ?
                                    <FlashMessage messageClass={this.state.messageClass}>{this.state.message}</FlashMessage>
                                :
                                    <Fragment/>
                            }
                            <Pagination
                                page={this.state.page}
                                currentPage={this.state.currentPage}
                                count={this.state.authors.length}
                                maxElement={25}
                                nextClick={() => this.buttonClick(this.state.currentPage + 1)}
                                lastClick={() => this.buttonClick(this.state.page)}
                                firstClick={() => this.buttonClick(0)}
                                previousClick={() => this.buttonClick(this.state.currentPage - 1)}
                            />
                            <SearchBar
                                additionalClass='search__user'
                                placeholder={this.state.width < 700 ? '_AUTHORS_SEARCH_MOBILE' : '_AUTHORS_SEARCH'}
                                inputSize={this.state.width < 700 ? 45 : 50}
                                filterLabel='_AUTHORS_ROLE'
                                filterOptions={this.state.options}
                                wordSearch={this.state.wordSearch}
                                handleChange={(event, target) => this.handleChange(event, target)}
                                handleSubmit={(event) => this.handleSubmit(event)}
                                onChangeBy = {(event) => this.handleChangeBy(event)}
                            />
                            <UserList
                                authors={this.state.authors}
                                currentPage={this.state.currentPage}
                                onChange={(event, key) => this.handleChangeRole(event, key)}
                                deleteAuthor={(event, id) => this.showDeleteModal(event, id)}
                            />
                        </MainSection>
                        <Footer/>
                    </div>
                }
            </Fragment>
        )
    }
}

export default Users