import React, { Component, Fragment } from 'react'
import {Redirect} from 'react-router-dom'
import cookie from 'react-cookies'

//i18n
import { withTranslation } from 'react-i18next'

//Global
import MainSection from '../Components/MainSection'
import UserMenu from '../Components/home/UserMenu'
import NavBar from '../Components/NavBar'
import Footer from '../Components/home/Footer'

//ImportTraining
import ImportModal from '../Components/modal/ImportModal'

//Utilitaires
import Button from '../Components/formWidget/Button'
import Fields from '../Components/formWidget/Fields'

//ImportTraining only
import TrainingDetails from '../Components/ImportTraining/TrainingDetails'

//Style
import './ImportTraining.scss'
import {fetchApi} from "../Utils/Fetch";
import Header from "../Components/Header";

class ImportTraining extends Component {

    constructor({props}){
        super(props)
    }

    state = {
        redirect: false,
        importModal: false,
        complements: {training: 'create', skin: 'true'},
    }

    handleChange = (event) => {
        let {complements} = this.state
        complements[event.target.name] = event.target.value
        this.setState({complements})
    }

    async getInformation(){
        let formData = new FormData();
        formData.append('moduleZip', document.getElementById('file_selector').files[0])
        let training = await fetchApi('import/training_information', 'POST', true, formData, false)

        if (training){
            this.setState({training}) 
        }
    }

    //Ouvre le modale d'import
    async handleImport(event){
        event.preventDefault()
        if (this.state.training.module_version !== null || this.state.training.module_skin_version !== null){
            this.setState({importModal: true})
        } else {
            let formData = new FormData();
            formData.append('moduleZip', document.getElementById('file_selector').files[0])
            formData.append('action_training', 'create')
            formData.append('exist_skin', false)
            let response = await fetchApi('import/crea', 'POST', true, formData, false)

            if (response){
                this.setState({redirect: true, messageClass: 'success', flashMessageStatus: true, flashMessage: '_ARCHIVE_SUCCESS', redirect_path: '/trainings'})
            }
        }
    }

    async handleImportWithModal(event){
        event.preventDefault()
        let formData = new FormData()
        formData.append('moduleZip', document.getElementById('file_selector').files[0])
        formData.append('action_training', this.state.complements.training)
        formData.append('exist_skin', this.state.complements.skin)

        let response = await fetchApi('import/crea', 'POST', true, formData, false)

        if (response){
            this.setState({importModal: false, redirect: true, redirect_path: '/trainings', redirect_state: {flashMessage: '_ARCHIVE_SUCCESS', isRedirection: true}})
            
        }
    }

    render () {
        if (this.state.redirect){
            return <Redirect  to={{
                pathname: this.state.redirect_path,
                state: this.state.redirect_state
            }}/>
        }
    
        return (
            <div id='container'>
                <Header />
                <MainSection
                        titleText='_HOME_IMPORT_LINK'
                        >
                    {
                        this.state.importModal ? 
                            <ImportModal
                                training={this.state.training}
                                handleChange={(event) => this.handleChange(event)}
                                onClose={() => this.setState({importModal:false})}
                                handleImport={(e) => this.handleImportWithModal(e)}
                                complement={this.state.complements}
                            />
                        : 
                            <Fragment/>
                    }
                    <form onSubmit={(e) => e.preventDefault()}>
                        <fieldset className='import__section'>
                            <legend>Archive Créa Learning</legend>
                            <ul className='crea-archive-btn__list'>
                                <Fields
                                    htmlFor='file_selector' 
                                    text='_ARCHIVE_CREA_SELECT'
                                    inputType='file'
                                    onChange={() => this.getInformation()}
                                />
                                {/* <li>
                                    <Button
                                        className='upload__btn'
                                        buttonType='button'
                                        buttonText='_DL_ARCHIVE'
                                        onClick={() => this.getInformation()}
                                    />
                                </li> */}
                            </ul>
                            {
                                this.state.training !== undefined ? 
                                    <TrainingDetails
                                        training={this.state.training}
                                    />
                                :
                                    <Fragment/>
                            }
                        </fieldset>
                        <ul className='btn__list'>
                            <li>
                                <Button
                                    className='orange__btn'
                                    type='button'
                                    buttonText='_IMPORT'
                                    onClick={(event) => this.handleImport(event)}
                                />
                            </li>
                            <li>
                                <Button
                                    className='grey__btn'
                                    type='button'
                                    buttonText='_RETURN'
                                    onClick={() => window.location.href='/'}
                                />
                            </li>
                        </ul>
                    </form>
                </MainSection>
                <Footer/>
            </div>
        )
    }
}

export default withTranslation()(ImportTraining)