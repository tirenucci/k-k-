import React, {Component, Fragment} from 'react'
import {Redirect} from 'react-router-dom'

//Global
import NavBar from '../Components/NavBar'
import UserMenu from '../Components/home/UserMenu'
import Footer from '../Components/home/Footer'

//Utilitaires
import Pagination from '../Components/trainings/Pagination'
import SearchBar from '../Components/SearchBar'
import TabTrainings from '../Components/trainings/TabTrainings'
import DeleteModal from '../Components/modal/DeleteModal'
import FlashMessage from '../Components/FlashMessage'
import Loader from '../Components/modal/Loader'
import MainSection from '../Components/MainSection'
import {getUserInformation} from "../Utils/GetUserInformation";
import {fetchApi} from "../Utils/Fetch";
import Header from "../Components/Header";

class TrainingsList extends Component {


    constructor({props}) {
        super(props);

        this.state = {
            redirect_path: '/connection',
            skinTheme: [],
            skinSelected: undefined,
            themeSelected: undefined,
            title: '',
            description: '',
            skin: 0,
            showModal: false,
            trainings: [],//le tableau qui va récupérer les données de l'API
            idDeleted: false,
            redirect: false,
            firstname: '',
            lastname: '',
            email: '',
            avatar: '',
            offer: '',
            order: 'DESC',
            target: 'name',
            oldTarget: 'DESC',
            wordSearch: '',
            filterStatus: '',
            width: 0,
            flashMessageStatus: false,
            flashMessage: '',
            deleted: false,
            loading: false,
            message: '',
            isRedirection: false,
            currentPage: 0,
            options: [
                {'textTranslate': '_ALL', 'value': ''},
                {'textTranslate': '_ONGOING', 'value': '_UNDERCONSTRUCTION'},
                {'textTranslate': '_DONE', 'value': '_VALID'},
            ],
            tools: [
                {'type': 'new', 'link': '/create', 'title': '_NAV_CREATE', 'text': '_NAV_CREATE'},
                {'type': 'import', 'link': '/importTraining', 'title': '_IMPORT_TITLE', 'text': '_IMPORT_TITLE'}
            ],
        }

    }


    async handleDuplique(e, id) {
        this.stopPropagation(e)
        let response = await fetchApi('training/duplique', 'POST', true, {
            id: id
        })

        if (response) {
            await this.getAllTrainings()
            this.setState({flashMessageStatus: true, flashMessage: '_TRAINING_DUPLICATED', messageClass: 'success',})
        }
    }

    async getInformation(){
        let user = await getUserInformation()
        await this.setState({user})
    }

    async componentDidMount() {
        await this.getAllTrainings()
        document.title = this.props.title
        if (this.props.location.state !== undefined) {
            this.setState({
                flashMessage: this.props.location.state.flashMessage,
                isRedirection: this.props.location.state.isRedirection
            })
        }
    }

    sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }


    //Récupération des données de l'API en asynchrone
    async getAllTrainings() {
        await getUserInformation().then(user => this.setState({user}))
        if (this.state.user !== undefined) {
            let response = await fetchApi(`training/get_all?order=${this.state.order}&target=${this.state.target}&status=${this.state.filterStatus}&wordSearch=${this.state.wordSearch}&user_id=${this.state.user.id}&page=${this.state.currentPage}`, 'GET')

            if (response) {
                let trainings = await response
                if (trainings.length !== 0) {
                    this.setState({trainings, loading: false, page: Math.floor(trainings['count'] / 10)})
                } else {
                    this.setState({trainings, loading: false, page: 0})
                }

            }
        }
    }

    //Affiche le modal pour confirmer la suppression du module
    async showDeleteModal(e, id) {
        this.stopPropagation(e)
        this.setState({deleted: true, idDeleted: id})
    }


    async deleteTraining(id) {
        this.setState({loading: true})
        let response = await fetchApi('training/delete', 'DELETE', true, {
            id: id
        })

        if (response) {
            await this.getAllTrainings()
            this.setState({
                loading: false,
                flashMessageStatus: true,
                flashMessage: '_TRAINING_DELETED',
                messageClass: 'success',
                deleted: false
            })
        }
    }

    async buttonClick(value) {
        await this.setState({currentPage: value})
        await this.getAllTrainings()
    }

    /*Tri dans les colonnes du tableau*/
    handleSort = async (event, target, type) => {
        if (document.getElementsByClassName('ascent').length > 0) {
            document.getElementsByClassName('ascent')[0].classList.remove('ascent')
        } else if (document.getElementsByClassName('descent').length > 0) {
            document.getElementsByClassName('descent')[0].classList.remove('descent')
        }
        if (type === 'date' && this.state.oldTarget !== 'date') {
            this.setState({order: 'DESC'})
            event.target.classList.add('descent')
        } else if (type === 'text' && this.state.oldTarget !== 'text') {
            this.setState({order: 'ASC'})
            event.target.classList.add('ascent')
        } else {
            if (this.state.order === 'DESC') {
                this.setState({order: 'ASC'})
                event.target.classList.add('ascent')
            } else {
                this.setState({order: 'DESC'})
                event.target.classList.add('descent')
            }
        }
        this.setState({target, oldTarget: type})
        await this.getAllTrainings()
    }

    handleChangeBy = async (event) => {
        this.setState({status: event.target.value})
        await this.getAllTrainings()
    }

    handleSubmit = async (event) => {
        event.preventDefault()
        await this.getAllTrainings()
    }

    openTraining(event, id) {
        this.setState({redirect_path: '/training/' + id, redirect: true})
    }

    //Permet d'empêcher la propagation de l'event openTraining à ces enfants
    stopPropagation = (e) => {
        e.stopPropagation();
    }

    handleChange(event, t) {
        let state = this.state
        state[t] = event.target.value;
        this.setState(state)
    }


    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect_path}/>
        }

        if (this.state.flashMessageStatus) {
            setTimeout(() => {
                this.setState({flashMessageStatus: false, flashMessage: ''})
            }, 5000)
        }


        if (this.state.isRedirection) {
            setTimeout(() => {
                this.setState({isRedirection: false, flashMessage: ''})
            }, 5000)
        }

        setTimeout(() => {
            this.setState({width: window.innerWidth})
        }, 100)

        return (
            this.state.user !== undefined ?
                <div id='container'>
                    <Header />
                    <main id='main'>
                        <MainSection
                            titleText='_TRAINING_LIST'
                            additionalTitleClass='with__tools'
                            tools={this.state.tools}
                        >
                            {
                                this.state.loading ?
                                    <Loader/>
                                    : this.state.deleted === true ?
                                    <DeleteModal onOk={() => this.deleteTraining(this.state.idDeleted)}
                                                 onAnnul={() => this.setState({deleted: false})}/>
                                    : this.state.flashMessageStatus ?
                                        <FlashMessage
                                            messageClass={this.state.messageClass}>{this.state.flashMessage}</FlashMessage>
                                        : this.state.isRedirection ?
                                            <FlashMessage
                                                messageClass='success'>{this.state.flashMessage}</FlashMessage>
                                            :
                                            <Fragment/>
                            }
                            <section className='trainingList__wrapper'>
                                <Pagination
                                    page={this.state.page}
                                    maxElement={this.state.trainings['training'] !== undefined ? this.state.trainings['training'].length : undefined}
                                    currentPage={this.state.currentPage}
                                    count={this.state.trainings['count'] !== undefined ? this.state.trainings['count'] : undefined}
                                    nextClick={() => this.buttonClick(this.state.currentPage + 1)}
                                    choicePage={(event, page) => this.buttonClick(page)}
                                    lastClick={() => this.buttonClick(this.state.page)}
                                    firstClick={() => this.buttonClick(0)}
                                    previousClick={() => this.buttonClick(this.state.currentPage - 1)}
                                />
                                <SearchBar
                                    additionalClass='search__training'
                                    placeholder={`${this.state.width < 1050 ? '_SEARCH_MOBILE' : '_TRAINING_SEARCH'}`}
                                    inputSize={`${this.state.width < 610 ? 20 : 50}`}
                                    filterLabel='_STATUS'
                                    filterOptions={this.state.options}
                                    handleChange={(event, target) => this.handleChange(event, target)}
                                    handleSubmit={(event) => this.handleSubmit(event)}
                                    onChangeBy={(event) => this.handleChangeBy(event)}
                                />
                                <TabTrainings
                                    handleDuplique={(event, id) => this.handleDuplique(event, id) && window.scrollTo(0, 0)}
                                    user={this.state.user}
                                    trainings={this.state.trainings}
                                    onSort={(event, target, type) => this.handleSort(event, target, type)}
                                    onDelete={(e, id) => this.showDeleteModal(e, id)}
                                    openTraining={(event, id) => this.openTraining(event, id)}
                                    page={this.state.page}
                                    currentPage={this.state.currentPage}
                                />
                            </section>
                        </MainSection>
                    </main>
                    <Footer/>
                </div>
                :
                <Fragment/>
        )
    }
}

export default TrainingsList