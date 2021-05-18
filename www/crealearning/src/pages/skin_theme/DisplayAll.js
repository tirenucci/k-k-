import React, {Component, Fragment} from 'react'
import { Redirect } from 'react-router-dom'
import cookie from 'react-cookies'

//DisplayAll
import SkinTheme from '../../Components/skinTheme/SkinTheme'

//Global
import MainSection from '../../Components/MainSection'
import NavBar from '../../Components/NavBar'
import UserMenu from '../../Components/home/UserMenu'
import Footer from '../../Components/home/Footer'

//Utilitaires
import FlashMessage from '../../Components/FlashMessage'
import Pagination from '../../Components/trainings/Pagination'
import Loader from '../../Components/modal/Loader'
import SearchBar from '../../Components/SearchBar'
import {fetchApi} from "../../Utils/Fetch";
import {getUserInformation} from "../../Utils/GetUserInformation";
import Header from "../../Components/Header";

class DisplayAll extends Component{

    constructor(props) {
        super(props)
        this.state = {
            wordSearch: "",
            redirect: false,
            redirect_path: '/connection',
            skinTheme: [],
            currentPage: 0,
            pages : 0,
            loading: false,
            width:0,
            search: '',
            status: '_ALL',
            options:[
                {'textTranslate':'_ALL', 'value':'_ALL'},
                {'textTranslate':'_ACTIVATE', 'value':'_ACTIVE'},
                {'textTranslate':'_DESACTIVATE', 'value':'_DESACTIVE'}
            ],
            tool: [
                {'type': 'new', 'link': '/skintheme/new', 'title': '_CREATE_THEME', 'text':'_CREATE_THEME'}
            ]
        }
    }

    onThemeClick(event, id){
        this.setState({redirect_path: '/skintheme/' + id, redirect: true})
    }

    handleChange = (event, target) => {
        this.setState({'search': event.target.value})
    }

    handleChangeBy = (event) => {
        let status = this.state.status
        status = event.target.value
        this.setState({status})
    }

    componentDidMount = async() => {
        await this.getSocieties()
        await this.getAllSkinTheme()
        if (this.props.location.state !== undefined){
            this.setState({
                message: this.props.location.state.redirect_message,
                isRedirection: this.props.location.state.isRedirection,
                messageClass: this.props.location.state.messageClass,
            })
        }
        document.title = this.props.title
    }

    sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }

    async getAllSkinTheme(id_society = undefined){
        this.setState({loading: true})

        let response = await fetchApi(`skintheme/get_all?wantSkin=${true}&society_id=${id_society === undefined ? null : id_society}`, 'GET')

        if (response){
            let skinTheme = await response
            if (skinTheme.length > 0) {
                this.setState({skinTheme, loading:false, pages: Math.floor(skinTheme.length / 25)})
            } else {
                this.setState({skinTheme, loading:false, pages: 0})
            }
        }
    }

    async getSocieties() {
        this.setState({loading: true})
        let response = await fetchApi(`society/get_all?wordSearch=${this.state.wordSearch}`,'GET')

        if (response){
            let societies = await response
            this.setState({societies, loading: false})
        }
    }

    async updateSkinTheme(skinTheme){

        let response = await fetchApi('skintheme/update', 'PUT', true, {
            skin_theme_id: skinTheme.id,
            skin_theme_status: skinTheme.status
        })
    }

    handleClick = async (event, key) => {
        const {skinTheme} = this.state
        skinTheme[key].status === '_ACTIVE' ? skinTheme[key].status = '_DESACTIVE' : skinTheme[key].status = '_ACTIVE'
        skinTheme[key].skin.map((s) => (
            s.status = skinTheme[key].status
        ))
        this.setState([skinTheme[key]])
        await this.updateSkinTheme(skinTheme[key])
    }

    handleChangeSociety(event) {
        this.getAllSkinTheme(event.target.value)
    }

    async buttonClick(value) {
        await this.setState({currentPage: value})
        await this.getAllSkinTheme()
    }

    render(){

        if (this.state.redirect){
            return <Redirect to={this.state.redirect_path} />
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
                <MainSection titleText='_SKIN_THEME_LIST' additionalTitleClass='with__tool' tools={this.state.tool}>
                    {
                        this.state.loading ? 
                            <Loader/>
                        : this.state.isRedirection ? 
                            <FlashMessage messageClass={this.state.messageClass}>{this.state.message}</FlashMessage> 
                        : 
                            <Fragment/>
                    }
                    <Pagination 
                        page={this.state.pages} 
                        currentPage={this.state.currentPage} 
                        maxElement={25}
                        count={this.state.skinTheme.length} 
                        nextClick={() => this.buttonClick(this.state.currentPage + 1)} 
                        choicePage={(event, page) => this.buttonClick(page)}
                        lastClick={() => this.buttonClick(this.state.pages)} 
                        firstClick={() => this.buttonClick(0)} 
                        previousClick={() => this.buttonClick(this.state.currentPage - 1)} 
                    />
                    <section className='skin__section'>
                        <div className='top__skin__all'>
                            <SearchBar
                                additionalClass='search__skin '
                                marginDisable={true}
                                placeholder='_SEARCH_BY_NAME'
                                inputSize={`${this.state.width < 610 ? 40 : 50}`}
                                handleChange={(event, type) => this.handleChange(event, type)}
                                onChangeBy={(event) => this.handleChangeBy(event)}
                                filterLabel='_STATE'
                                filterOptions={this.state.options}
                                searchButton={false}
                            />
                            <select onChange={(event) => this.handleChangeSociety(event)}>
                                {
                                    this.state.societies instanceof Array ?
                                        this.state.societies.map((society, key) => (
                                            <option value={society.id}>{society.name}</option>
                                        ))
                                        :
                                        <Fragment/>
                                }
                            </select>
                        </div>
                        <SkinTheme 
                            allTheme={this.state.skinTheme}
                            handleClick={(event, id) => this.handleClick(event, id)}
                            onThemeClick={(event, id) => this.onThemeClick(event, id)}
                            page={this.state.pages}
                            search={this.state.search}
                            currentPage={this.state.currentPage}
                            status={this.state.status}
                        />
                    </section>
                </MainSection>
                <Footer/>
            </div>
        )
    }
}

export default DisplayAll