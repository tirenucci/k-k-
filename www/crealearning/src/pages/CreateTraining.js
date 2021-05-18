import React, { Component, Fragment } from 'react'
import { Redirect } from 'react-router-dom'
import cookie from 'react-cookies'

import NavBar from '../Components/NavBar'
import MainSection from '../Components/MainSection'
import UserMenu from '../Components/home/UserMenu'
import Footer from '../Components/home/Footer'
import ModalSubscriber from '../Components/modal/ModalSubscriber'

//CreateTraining only
import StepBlock from '../Components/createTraining/StepBlock'
import FormDefinition from '../Components/createTraining/FormDefinition'
import SkinList from '../Components/createTraining/SkinList'
import SkinPreview from '../Components/modal/SkinPreview'

import FlashMessage from '../Components/FlashMessage'

//i18n
import {Translation} from 'react-i18next'

//Style
import './CreateTraining.scss'
import {getUserInformation} from "../Utils/GetUserInformation";
import {fetchApi} from "../Utils/Fetch";
import Header from "../Components/Header";

class CreateTraining extends Component {
    constructor({props}){
        super(props)
    }

    state = {
        redirect: false,
        redirect_path: '/connection',
        skinTheme: [],
        skinSelected: undefined,
        themeSelected: undefined,
        title: '',
        description: '', 
        skin: 0, 
        showModal: false,
        trainings: [],//le tableau qui va récupérer les données de l'API
    }

    componentDidMount = async () => {

        await this.getAllSkinTheme()
        document.title = this.props.title
    }

    
    async getAllSkinTheme(){
        let response = await fetchApi('training/get_all_theme', 'GET')

        if (response){
            let skinTheme = await response
            this.setState({skinTheme})
        }
    }

    handleChange = (event, target) => {
        let state = this.state
        state[target] = event.target.value
        this.setState({target}) //Mise à jour du state
    }

    async handleSubmit(event) {
        event.preventDefault()
        const {title, description, skin} = this.state

        if (title !== "") {
            let response = await fetchApi('training/create', 'POST', true, {
                skin: this.state.skin,
                name: this.state.title,
                description: this.state.description,
            })
    
            if (response){
                const id = await response
                if (id !== -1) {
                    this.setState({redirect_path: '/training/' + id['id'], redirect: true})
                } else {
                    this.setState({nospace: true})
                }
            }   
        } else {
            this.setState({flashMessage: true})

            setTimeout(() => {
                this.setState({flashMessage: false})
            }, 1500)
        }
    }

    /** INDEX = INDEX DU THEME KEY = KEY DU SKIN */
    onSkinClick = (event, index, id, key) => {
        const theme = this.state.skinTheme[index]
        theme.default_skin = key
        this.setState({skin: id, themeSelected: index})
    }

    skinHandle = (event, id) => {
        if (this.state.themeSelected === undefined && this.state.skinSelected === undefined)
            this.setState({themeSelected: id, skinSelected: 0})
        if (this.state.themeSelected !==  id)
        {
            const skin = this.state.skinTheme[id].skin[this.state.skinTheme[id].default_skin].id

            this.setState({themeSelected: id, skin})
        }
    }

    render () {
        if (this.state.redirect){
            return <Redirect to={this.state.redirect_path} />
        }

        return (
            <div id='container'>
                <Header />
                {
                    this.state.nospace ? 
                    <ModalSubscriber
                        bkgd='quota__bkgd' 
                        modalTitle='_LOCK_QUOTA' 
                        onClose={() => this.setState({nospace:false})} 
                        >
                            <Translation> 
                                { //La balise Translation attends la méthode t pour traduire
                                    (t)=><p>{t('_LOCK_QUOTA_ACCESS')}<hr/>{t('_LOCK_CONTACT')}</p>
                                }
                            </Translation>
                        </ModalSubscriber> 
                    : 
                    <Fragment/>
                }
                {
                    this.state.flashMessage ?
                        <FlashMessage messageClass="error">_NAME_MODULE</FlashMessage>
                    :
                        <Fragment />
                }
                <MainSection titleText='_NAV_CREATE'>
                    <form name='formTraining' className='form__training' onSubmit = {(event) => this.handleSubmit(event)}>
                        <ul className='form__step__list'>
                                <StepBlock step='1'
                                    text='_CHOOSE_NAME_1'
                                    stepSentence='_CHOOSE_NAME_2'
                                >
                                    <FormDefinition
                                        title={this.state.title}
                                        description={this.state.description}
                                        skin={this.state.skin}
                                        handleChange= {(event, target) => this.handleChange(event, target)}
                                    />
                                </StepBlock>
                                <StepBlock step='2'
                                    text='_APPLY'
                                    stepSentence='_APPLY_2'
                                >
                                    {
                                        this.state.showSkinPreview ?
                                        <SkinPreview
                                            src={this.state.previewSrc}
                                            onAnnul={() => this.setState({showSkinPreview:false})}
                                        />
                                        :
                                        <Fragment/>
                                    }
                                    <SkinList
                                        filter={false}
                                        allTheme={this.state.skinTheme}
                                        skin={(event, id) => this.skinHandle(event, id)}
                                        handleSelected={(event, key) => this.handleSelected(event, key)}
                                        skinSelected={this.state.skinSelected}
                                        themeSelected={this.state.themeSelected}
                                        skinActif={this.state.skin}
                                        onSkinClick={(event, index, id, key) => this.onSkinClick(event, index, id, key)}
                                        showSkinPreview={(event, src) => this.setState({showSkinPreview:true, previewSrc: src})}
                                    />
                                </StepBlock>
                                <StepBlock step='3'
                                    text='_START'
                                    stepSentence='_START_2'
                                    onClick={(event) => this.handleSubmit(event)}
                                />
                        </ul>
                    </form>
                </MainSection>
                <Footer/>
            </div>
        )
    }
}

export default CreateTraining