import React, {Component, Fragment} from 'react'
import {Redirect} from 'react-router-dom'
import cookie from 'react-cookies'

//Global
import MainSection from '../../Components/MainSection'
import NavBar from '../../Components/NavBar'
import UserMenu from '../../Components/home/UserMenu'
import Footer from '../../Components/home/Footer'
import './ConfigLang.scss'


//ConfigLang
import LangList from '../../Components/config/LangList'
import {getUserInformation} from "../../Utils/GetUserInformation";
import EditLanguageModal from "../../Components/modal/EditLanguageModal";
import {fetchApi} from "../../Utils/Fetch";
import Header from "../../Components/Header";

class ConfigLang extends Component {

    constructor({props}) {
        super(props)
    }

    state = {
        redirect: false,
        modalShow: false,
        img_selected: {
            path: '/assets/img/avatar/default.svg',
            name: 'default',
            id: 1
        },
        avatars: [],
        languages: [],
        wordSearch: "",
    }

    //Récupère toute les langues
    componentDidMount = async function () {

        await this.getSocieties()
        await this.getAllLanguages()
        document.title = this.props.title
    }

    async getAllLanguages(id_society = undefined) {
        await getUserInformation().then(user => this.setState({user}))

        let response = await fetchApi(`training_language/get_all?society_id=${id_society === undefined ? this.state.user.society_id : id_society}`, 'GET', true)

        if (response) {
            let languages = await response
            this.setState({languages})

        }
    }

    async getSocieties() {
        this.setState({loading: true})
        let response = await fetchApi(`society/get_all?wordSearch=${this.state.wordSearch}`, 'GET', true)

        if (response) {
            let societies = await response
            this.setState({societies, loading: false, page: Math.floor(societies.length / 25)})
        }
    }

    handleChange = async(event) => {
        await this.getAllLanguages(event.target.value)
    }

    async editLanguage(event) {
        event.preventDefault()
        let response = await fetchApi('activated_language/update', 'PATCH', true, {
            iso_code_6391: this.state.idEdit.iso_code_6391,
            active: this.state.idEdit.active
        })

        if (response) {
            this.setState({edit: false})
            await this.getAllLanguages()
        }
    }
    changeStatus(event){
        let {idEdit} = this.state

        idEdit.active = event.target.value

        this.setState({idEdit})

    }

    async showEditModal(event, id){
        this.setState({edit: true, idEdit: id})
    }

    render() {

        if (this.state.redirect) {
            return <Redirect to='/connection'/>
        }

        return (
            <div id='container'>
                <Header />
                <MainSection titleText='_LANG_LIST'>
                    <select onChange={(event) => this.handleChange(event)}>
                        {
                            this.state.societies instanceof Array ?
                                this.state.societies.map((society, key) => (
                                    <option value={society.id}>{society.name}</option>
                                ))
                                :
                                <Fragment/>
                        }
                    </select>
                    {
                        this.state.edit ?
                            <EditLanguageModal
                                idlang={this.state.idEdit}
                                onOk={(event) => this.editLanguage(event)}
                                onAnnul={() => this.setState({edit: false})}
                                handleChange={(event) => this.changeStatus(event)}
                            />
                            :
                            <Fragment/>
                    }
                    <LangList
                        languages={this.state.languages}
                        editLanguage={(event, id) => this.showEditModal(event, id)}
                    />
                </MainSection>
                <Footer/>
            </div>
        )
    }
}


export default ConfigLang