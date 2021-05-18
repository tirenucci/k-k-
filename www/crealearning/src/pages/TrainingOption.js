import React, {Component, Fragment} from 'react'
import {Redirect} from 'react-router-dom'
import cookie from 'react-cookies'

//Global
import NavBarSecondary from '../Components/NavBarSecondary'
import NavBar from '../Components/NavBar'
import UserMenu from '../Components/home/UserMenu'
import FlashMessage from '../Components/FlashMessage'
import Footer from '../Components/home/Footer'
import DeleteModal from '../Components/modal/DeleteModal'
import Loader from '../Components/modal/Loader'
import ArchiveExist from '../Components/modal/ArchiveExist'
import MainSection from '../Components/MainSection'

//TrainingOption
import PropertyForm from '../Components/trainingOption/PropertyForm'
import TrainingComplements from '../Components/trainingOption/TrainingComplements'
import TrainingAuthor from '../Components/trainingOption/TrainingAuthor'
import ExportTraining from '../Components/trainingOption/ExportTraining'
import ShareTraining from '../Components/trainingOption/ShareTraining'
import DeleteForm from '../Components/trainingOption/DeleteForm'
import {fetchApi} from "../Utils/Fetch";
import {getUserInformation} from "../Utils/GetUserInformation";
import Header from "../Components/Header";


class TrainingOption extends Component {

    state = {
        training: [],
        flashMessageStatus: false,
        flashMessage: '',
        changeImage: undefined,
        deleteModal: false,
        currentTab: 'properties',
        format: 'scorm',
        archiveExist: false,
        confirmation: '',
        grain: [],
        pdfOption: {
            header: true,
            footer: true,
            displayResponse: true,
            cover: true
        },
        file: {
            scorm: '',
            pdf: '',
            monograin: ''
        },
        isDownloaded: {
            scorm: false,
            PDF: false,
            monograin: false
        },
        loading: false,
        tabs: [
            {'text': '_PROPERTIES', 'class': 'tab__link actif', 'link': '#properties', 'type': 'property'},
            {'text': '_COMPLEMENTS', 'class': 'tab__link', 'link': '#complement', 'type': 'complements'},
            {'text': '_AUTHORS', 'class': 'tab__link', 'link': '#author', 'type': 'author'},
            {'text': '_EXPORT', 'class': 'tab__link', 'link': '#exports', 'type': 'export'},
            {'text': '_SHARE', 'class': 'tab__link', 'link': '#shares', 'type': 'share'},
            {'text': '_DELETE', 'class': 'tab__link', 'link': '#delete', 'type': 'delete'},
        ],
        tools: [
            {'type': 'view', 'link': `/training/***`, 'title': '_TRAINING_OPEN', 'text': '_TRAINING_OPEN'},
            {'type': 'listing', 'link': '/trainings', 'title': '_NAV_LIST', 'text': '_NAV_LIST'}
        ],
        formatOptions: [
            {value: 'scorm', textTranslate: 'SCORM 1.2'},
            {value: 'pdf', textTranslate: '_EXPORT_PDF'},
            {value: 'monograin', textTranslate: 'SCORM 1.2 Monograin'},
        ],
        quote: 'test',
        iframeWidth: '',
        iframeHeight: '',
        to: '',
        emailText: '',
    }

    async componentDidMount() {
        await getUserInformation().then(user => this.setState({user}))
        document.title = this.props.title
        await this.getTraining()
        await this.getAllAuthor()
        await this.downloadScormZip('scorm')
        await this.downloadScormZip('monograin')
        await this.downloadPdfFile();
        let link = window.location.href.split('#')
        if (link[1] !== undefined) {
            document.getElementsByClassName('actif')[0].classList.remove('actif')
            let tabs = this.state.tabs
            let onglet = document.getElementsByClassName('tab__link')
            tabs.forEach((tab, key) => {
                if (tab.link === '#' + link[1]) {
                    onglet[key].classList.add('actif')
                    this.setState({currentTab: tab.type})
                }
            });
        } else {
            this.setState({currentTab: 'property'})
        }
    }

    async getTraining() {
        let response = fetchApi(`training/get?id=${this.props.match.params.id}`, 'GET', true)

        if (response) {
            const data = await response
            const tags = data.tags.split(',')
            await this.setState({training: data, tags})
            await this.getAllAuthorByTraining()
        }
    }

    async getAllGrain(keepCurrent = false) {
        let response = await fetchApi(`grain/get_all_by_training?training_id=${this.props.match.params.id}`, 'GET', true)

        if (response) {
            let grain = await response
            if (!keepCurrent) {
                const currentGrain = 0
                this.setState({grain, currentGrain})
            } else {
                this.setState({grain})
            }
        }
    }

    async updateTrainingWithImage(e, skin_id, languages) {
        let formData = new FormData()
        formData.append('image', this.state.changeImage)
        formData.append('id', this.state.training.id)
        formData.append('skin_id', skin_id === undefined ? null : skin_id)
        formData.append('languages', languages === undefined ? null : JSON.stringify(languages))

        let response = await fetchApi('training/update_with_image', 'POST', true, formData, false)

        if (response) {
            await this.updateTrainingWithoutImage(skin_id, languages)
        }
    }

    async generatePDF() {
        this.setState({loading: true})
        let response = await fetchApi('training/export/pdf', 'POST', true, {
            id: this.props.match.params.id,
            pdfOption: this.state.pdfOption
        })

        if (response) {
            await this.downloadPdfFile();
            if (this.state.isDownloaded === undefined) {
                this.setState({
                    loading: false,
                    flashMessageStatus: true,
                    flashMessage: '_EXPORT_PDF_CREATED',
                    messageClass: 'success',
                })
            } else {
                this.setState({
                    loading: false,
                    flashMessageStatus: true,
                    flashMessage: '_EXPORT_PDF_UPDATED',
                    messageClass: 'success',
                })
            }
        }
    }

    async downloadPdfFile() {
        let response = fetchApi(`training/download/pdf?id=${this.props.match.params.id}`, 'GET')

        if (response) {
            let url = await response
            let pdfFile = this.state.file
            let {isDownloaded} = this.state
            pdfFile.pdf = url['link']
            isDownloaded.pdf = true

            this.setState({isDownloaded, file: pdfFile})
        } else {
            let {isDownloaded} = this.state
            isDownloaded.PDF = false
            this.setState({isDownloaded})
        }
    }

    async generateArchive(event, format) {
        this.setState({loading: true})

        let response = await fetchApi('training/export/scorm', 'POST', true, {
            id: this.props.match.params.id,
            monograin: format === 'monograin'
        })

        if (response) {
            if (this.state.isDownloaded === false) {
                this.setState({
                    loading: false,
                    flashMessageStatus: true,
                    flashMessage: '_EXPORT_CREATED',
                    messageClass: 'success',
                    archiveExist: false
                })
                await this.downloadScormZip(format === 'Scorm MonoGrain' ? 'monograin' : 'scorm')
            } else {
                this.setState({archiveExist: true})
                if (this.state.confirmation === true) {
                    await this.downloadScormZip(format === 'Scorm MonoGrain' ? 'monograin' : 'scorm')
                }
            }
        }
    }

    async downloadScormZip(format) {
        let response = await fetchApi(`training/download/scorm?id=${this.props.match.params.id}&monograin=${format === 'monograin'}`, 'GET')

        if (response) {
            let url = await response
            let file = this.state.file
            let isDownloaded = this.state.isDownloaded
            file[format] = url['link']
            let agora = url['agora']
            isDownloaded[format] = true

            this.setState({isDownloaded, file, agora})
        } else {
            this.setState({isDownloaded: false})
        }
    }

    async updateTrainingWithoutImage(skin_id, languages) {
        let response = await fetchApi('training/update', 'PUT', true, {
            training: this.state.training,
            skin_id: skin_id === undefined ? null : skin_id,
            languages: languages === undefined ? null : languages
        })


        if (response) {
            const training = await response
            this.setState({
                training,
                flashMessageStatus: true,
                flashMessage: '_TRAINING_UPDATED',
                messageClass: 'success'
            })
        }
    }

    deleteTags(event, key) {
        event.preventDefault()
        const {tags} = this.state
        delete (tags[key])
        this.setState({tags})
    }

    handleDelete() {
        this.setState({deleteModal: true})
    }

    writeNewTag(event) {
        if (event.keyCode === 13 || event.keyCode === 188) {
            event.preventDefault()
            if (event.target.value !== '') {
                let {tags} = this.state

                if (tags[0] === '') {
                    tags.splice(0, 1)
                }

                let value = event.target.value
                value = value.charAt(0).toUpperCase() + value.slice(1)

                if (tags.length > 0) {
                    tags.find((tag) => {
                        if (tag === value) {
                            return;
                        }
                    })
                }

                tags.push(value)

                this.setState({tags})

                setTimeout(() => {
                    document.getElementById('newtags').value = ''
                }, 100)
            }

        }
    }


    async getAllAuthor() {
        let response = await fetchApi('user/get_all', 'GET')

        if (response) {
            this.setState({authors: await response['authors']})
        }
    }

    async onDelete() {
        let response = fetchApi('training/delete', 'DELETE', true, {
            id: this.state.training.id
        })

        if (response) {
            this.setState({
                redirect_path: '/trainings',
                redirect_state: {
                    flashMessage: 'Le module a été supprimé',
                    isRedirection: true,
                    messageClass: 'success'
                },
                redirect: true
            })
        }
    }

    async getAllAuthorByTraining() {
        let response = fetchApi(`training_author/right?id_training=${this.state.training.id}`, 'GET')

        if (response) {
            this.setState({authors_training: await response})
        }
    }

    async addAuthor(event) {
        if (!isNaN(event.target.value)) {
            let response = await fetchApi('training_author/add', 'POST', true, {
                id_user: event.target.value,
                id_training: this.state.training.id
            })

            if (response) {
                await this.getAllAuthorByTraining()
                document.getElementById('newauthor').value = ''
            }
        }
    }

    async deleteAuthor(event, id) {
        let response = fetchApi('training_author/delete', 'DELETE', true, {
            user_id: id,
            training_id: this.state.training.id
        })

        if (response) {
            await this.getAllAuthorByTraining()
        }
    }

    async handleChangePermission(event, key) {

        let {authors_training} = this.state

        authors_training[key].is_editor = !authors_training[key].is_editor

        this.setState({authors_training})

        await fetchApi('training_author/update', 'PUT', true, {
            user_id: authors_training[key].id,
            training_id: this.state.training.id,
            is_editor: authors_training[key].is_editor
        })
    }


    /**
     * A déplacer dans PropertyForm Attention elle fait appel a deux fonction les déplacers aussi
     * @param {event} event
     * @param {int} skin_id
     * @param languages
     */
    handleSubmit = async (event, skin_id = undefined, languages = undefined) => {
        let {tags, training} = this.state

        if (tags.length > 1) {
            training.tags = tags.join(',')
        } else {
            training.tags = tags[0]
        }
        this.setState({training})
        if (this.state.changeImage !== undefined) {
            await this.updateTrainingWithImage(event, skin_id, languages);
        } else {
            await this.updateTrainingWithoutImage(skin_id, languages);
        }
    }

    handlePdfOptionChange = (event, value, type) => {
        let {pdfOption} = this.state
        pdfOption[type] = value
        this.setState({pdfOption})
    }

    async evenement(tabs) {
        await this.setState({currentTab: tabs})
        window.scrollTo(0, window.scrollTo)
    }

    takeNewImage(e) {
        this.setState({changeImage: e.target.files[0]})
    }

    handleChange = (event, field) => {
        let {training} = this.state
        training[field] = event.target.value
        this.setState({training})
    }

    handleChangeState = (event, target) => {
        let state = this.state
        state[target] = event.target.value;
        this.setState(state)
    }

    async getAllSkinTheme() {
        let response = await fetchApi('training/get_all_theme', 'GET')

        if (response) {
            let skinTheme = await response
            this.setState({skinTheme})
        }
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={{
                pathname: this.state.redirect_path,
                state: this.state.redirect_state
            }}/>
        }

        if (this.state.flashMessageStatus) {
            setTimeout(() => {
                this.setState({flashMessageStatus: false, flashMessage: ''})
            }, 3000)
        }

        return (
            <div id='container'>
                <Header />
                <MainSection
                    titleText='_TRAINING_SET_UP'
                    value={this.state.training.name}
                    additionalTitleClass='with__tools'
                    tools={this.state.tools}
                    variable={this.props.match.params.id}
                >
                    <NavBarSecondary
                        evenement={(tabs) => this.evenement(tabs)}
                        tabs={this.state.tabs}
                        className='tab__menu'
                    />
                    {
                        this.state.flashMessageStatus ?
                            <FlashMessage
                                messageClass={this.state.messageClass}>{this.state.flashMessage}</FlashMessage>
                            :
                            this.state.deleteModal ?
                                <DeleteModal onOk={() => this.onDelete()}
                                             onAnnul={() => this.setState({deleteModal: false})}/>
                                :
                                this.state.archiveExist ?
                                    <ArchiveExist
                                        onAnnul={() => this.setState({
                                            archiveExist: false,
                                            loading: false,
                                            confirmation: ''
                                        })}
                                        onOk={() => this.setState({
                                            confirmation: true,
                                            archiveExist: false,
                                            loading: false,
                                            flashMessageStatus: true,
                                            flashMessage: '_EXPORT_UPDATED'
                                        })}
                                    />
                                    :
                                    this.state.loading ?
                                        <Loader/>
                                        :
                                        <Fragment/>
                    }
                    {
                        this.state.currentTab === 'property' ?
                            <PropertyForm
                                takeNewImage={(event) => this.takeNewImage(event)}
                                handleChange={(event, field) => this.handleChange(event, field)}
                                training={this.state.training}
                                tags={this.state.tags}
                                deleteTag={(event, key) => this.deleteTags(event, key)}
                                handleSubmit={(event, skin_id, languages) => this.handleSubmit(event, skin_id, languages)}
                                newTag={(event) => this.writeNewTag(event)}
                            />
                            :
                            this.state.currentTab === 'complements' ?
                                <TrainingComplements
                                    handleChange={(event, field) => this.handleChange(event, field)}
                                    training={this.state.training}
                                    handleSubmit={() => this.handleSubmit()}
                                />
                                :
                                this.state.currentTab === 'author' ?
                                    <TrainingAuthor
                                        authors={this.state.authors}
                                        training={this.state.training}
                                        authors_training={this.state.authors_training}
                                        addAuthor={(event) => this.addAuthor(event)}
                                        deleteAuthor={(event, id) => this.deleteAuthor(event, id)}
                                        handleChange={(event, key) => this.handleChangePermission(event, key)}
                                    />
                                    :
                                    this.state.currentTab === 'export' ?
                                        <ExportTraining
                                            format={this.state.format}
                                            grain={this.state.grain}
                                            createArchive={this.state.isDownloaded}
                                            handleChangeState={(event, field) => this.handleChangeState(event, field)}
                                            files={this.state.file}
                                            generateArchive={(event, format) => this.generateArchive(event, format)}
                                            generatePDF={(event) => this.generatePDF(event)}
                                            handlePdfOptionChange={(event, value, type) => this.handlePdfOptionChange(event, value, type)}
                                            pdfOption={this.state.pdfOption}
                                            agora={this.state.agora}
                                            id={this.state.training.id}
                                            formatOptions={this.state.formatOptions}
                                        />
                                        :
                                        this.state.currentTab === 'share' && this.state.user !== undefined ?
                                            <ShareTraining
                                                trainingLink={window.location.protocol + '//' + window.location.hostname + `/training/preview/${window.btoa(this.state.training.id + '&' + 0)}`}
                                                userName={this.state.user.username}
                                                trainingName={this.state.training.name}
                                            />
                                            :
                                            this.state.currentTab === 'delete' ?
                                                <DeleteForm onClick={() => this.handleDelete()}/>
                                                :
                                                <Fragment/>
                    }
                </MainSection>
                <Footer/>
            </div>
        )
    }
}

export default TrainingOption