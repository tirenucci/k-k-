import React, { Component, Fragment } from 'react'
import cookie from 'react-cookies'
import {Redirect} from 'react-router-dom'

//i18n
import { withTranslation } from 'react-i18next'

//Global
import MainSection from '../MainSection'
import NavBar from '../NavBar'
import UserMenu from '../home/UserMenu'
import NavBarSecondary from '../NavBarSecondary'

//Utilitaires
import DeleteButton from '../DeleteButton'
import FlashMessage from '../FlashMessage'
import DeleteModal from '../modal/DeleteModal'
import Button from '../formWidget/Button'
import Fields from '../formWidget/Fields'

//Style
import './EOForm.scss'
import {fetchApi} from "../../Utils/Fetch";
import Header from "../Header";

class EditTheme extends Component {

    constructor({props}){
        super(props)
    }

    state = {
        eoTheme:[],
        tabs: [
            {'text': '_THEME', 'class': 'tab__link actif', 'link': '#eo'},
            {'text': '_DELETE', 'class': 'tab__link', 'link': '#delete'},
        ],
        tool: [
            {'type': 'listing', 'link': '/EOManager', 'title': '_EO_SHOW_THEME_LIST', 'text':'_EO_SHOW_THEME_LIST'}
        ]
    }

    componentDidMount = () => {
        document.title = this.props.title
    }


    //Met à jour les infos du thème sélectionné
    async updateData(event) {
        event.preventDefault()
        let response = await fetchApi('eo/theme/update', 'PUT', true, {
            id: this.state.eoTheme.id,
            title: this.state.eoTheme.title,
            position: this.state.eoTheme.position,
        })

        if (response) {
            this.setState({flashMessage: true, message: '_THEME_UPDATE_SUCCESS', messageClass:'success', deleted: false, redirect:true, redirect_path:'/EOManager'})
        }
    }

     //Affiche le modal pour confirmer la suppression de l'objet intégré
     async showDeleteModal(event, id){
        this.setState({deleted: true, idDeleted: id})
    }

    //Supprime l'objet intégré sélectionné
    async deleteEOTheme(id){
        let response = await fetchApi('eo/theme/delete', 'DELETE', true, {
            id: id
        })

        if (response) {
            this.setState({flashMessage: true, message: '_THEME_DELETE_SUCCESS', messageClass:'success', deleted: false, redirect:true, redirect_path:'/EOManager'})
        } else {
            this.setState({loading: false, flashMessage: true, message: '_ERROR_DELETE_MESS', messageClass:'error', deleted: false})
        }
    }

    handleChange(event) {
        let {eo} = this.state
        eo[event.target.name] = event.target.value
        this.setState({eo})
    }

    //Lors du changement d'onglet
    async evenement(tabs){
        await this.setState({currentTab: tabs})
        window.scrollTo(0, window.scrollTo)
    } 

    render() {
        if (this.state.redirect)
        {
            return (<Redirect
                to={{
                    pathname: this.state.redirect_path,
                    state: {messageClass: this.state.messageClass, message: this.state.message, flashMessage: true}
                }}
            />)
        }

        return (
            <div id='container'>
                <Header />
                <MainSection titleText='_EO_EDIT_THEME' additionalTitleClass='with__tool' tools={this.state.tool}>
                    {
                        this.state.deleted === true ? 
                            <DeleteModal onOk={() => this.deleteEoTheme(this.state.idDeleted)} onAnnul={() => this.setState({deleted: false})}/>
                        : this.state.flashMessage ? 
                            <FlashMessage messageClass={this.state.messageClass}>{this.state.message}</FlashMessage>
                        : 
                            <Fragment/>
                    }
                    <NavBarSecondary
                        tabs={this.state.tabs}
                        className='tab__menu'
                        evenement={(tabs) => this.evenement(tabs)}
                    />
                    <section className='eoTheme__form'>
                        {
                            this.state.deleted === true ? 
                                <DeleteModal onOk={() => this.deleteEO(this.state.idDeleted)} onAnnul={() => this.setState({deleted: false})}/> 
                            : 
                                <Fragment/>
                        }
                        {
                            this.state.currentTab === 'SUPPRIMER' ?
                                <DeleteButton 
                                    deleteText='_THEME_DELETE'
                                    onDelete={(event, id) => this.showDeleteModal(event, this.state.eoTheme.id)}
                                />
                            :
                                <form onSubmit={(event) => this.updateData(event)}>
                                    <fieldset>
                                        <ul className='input__theme__list'>
                                            <Fields
                                                htmlFor='themePosition' 
                                                text='_ORDER'
                                                inputType='number'
                                                value={this.state.eoTheme.position}
                                                onChange={(event) => this.handleChange(event, 'themePosition')}
                                                min='1'
                                                size='1'
                                            />
                                            <Fields
                                                htmlFor='themeTitle' 
                                                text='_TITLE'
                                                inputType='text'
                                                value={this.state.eoTheme.title}
                                                onChange={(event) => this.handleChange(event, 'themeTitle')}
                                                size='20'
                                                required={true} 
                                                helpTitle='_REQUIRED'
                                            />
                                        </ul>
                                    </fieldset>
                                    <li className='btn__list'>
                                        <Button
                                            className='orange__btn'
                                            buttonText='_SAVE'
                                            buttonType='submit'
                                            onClick={(event) => this.updateData(event)}
                                        />
                                    </li>
                                </form>
                        }
                    </section>
                </MainSection>
            </div>
        )
    }
}

export default withTranslation()(EditTheme)