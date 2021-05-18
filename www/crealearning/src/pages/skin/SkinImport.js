import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'

//Global
import NavBar from '../../Components/NavBar'
import UserMenu from '../../Components/home/UserMenu'
import Footer from '../../Components/home/Footer'
import MainSection from '../../Components/MainSection'

//For SkinImport
import TabMenu from '../../Components/skinImport/TabMenu'
import Header from "../../Components/Header";

class SkinImport extends Component {
    state = {
        redirect: false,
        firstname: '',
        lastname: '',
        email : '', 
        avatar: '',
        offer: '',
        theme: this.props.match.params.theme, //Récupération de l'id du thème dans l'url
        tool:[
            {type: 'listing', link: '/skintheme', title:'_SKINS_LIST', text: '_SKINS_LIST'}
        ]
    }

    componentDidMount = () => {
        document.title = this.props.title
    }

    render() {
        //Gestion de la redirection vers la page de connection
        const { redirect } = this.state
        if (redirect){
            return <Redirect to='/connection'/>
        }

        //Récup des données SSID
        const {society_id} = window.$user
        
        return (
            <div id='container'>
                <Header />
                <MainSection titleText='_IMPORT_SKIN' additionalTitleClass='with__tool' tools={this.state.tool}>
                    <TabMenu
                        society = {society_id}
                        theme = {this.state.theme}
                        hash={this.props.location.hash}
                    /> 
                </MainSection>
                <Footer/>
            </div>
        )
    }
}

export default SkinImport