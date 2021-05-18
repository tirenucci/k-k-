import React, {Component, Fragment} from 'react'

//Swipe sur mobile
import SwipeableViews from 'react-swipeable-views'

//Le resizer 
import {Section, Bar, Container} from 'react-simple-resizer'

//i18n
import {Translation} from 'react-i18next'

/*Global*/
import MainSection from '../Components/MainSection'
import NavBarSecondary from '../Components/NavBarSecondary'
import NavBar from '../Components/NavBar'
import UserMenu from '../Components/home/UserMenu'
import Button from '../Components/formWidget/Button'
import FlashMessage from '../Components/FlashMessage'
import Footer from '../Components/home/Footer'

/*Components for BlockPage HOC*/
import AddGrain from '../Blocks/General/AddGrain'
import ConfigGrainHandler from '../Blocks/General/ConfigGrainHandler'
import TrainingArea from '../Blocks/General/TrainingArea'
import Notes from '../Blocks/General/Notes'
import ButtonBlock from '../Blocks/General/ButtonBlock'
import QuestionBlock from '../Blocks/General/QuestionBlock'
import HelpBlock from '../Blocks/General/HelpBlock'

/*Main Blocks*/
import BlockTitle from '../Blocks/BlockTitle'
import BlockParagraph from '../Blocks/BlockParagraph'
import BlockSeparator from '../Blocks/BlockSeparator'
import BlockImage from '../Blocks/BlockImage'
import BlockTextLeft from '../Blocks/BlockTextLeft'
import BlockTextRight from '../Blocks/BlockTextRight'
import BlockVideo from '../Blocks/BlockVideo'
import BlockScreenShot from '../Blocks/BlockScreenShot'
import BlockAudio from '../Blocks/BlockAudio'
import BlockDocument from '../Blocks/BlockDocument'
import BlockFormula from '../Blocks/BlockFormula'
import BlockIntegratedObjects from '../Blocks/BlockIntegratedObjects'
import BlockPDF from '../Blocks/BlockPDF'

/*Questions Blocks*/
import BlockStatement from '../Blocks/BlockStatement'
import BlockTrueFalse from '../Blocks/BlockTrueFalse'
import BlockNumeric from '../Blocks/BlockNumeric'
import BlockQCM from '../Blocks/BlockQCM'
import BlockGaps from '../Blocks/BlockGaps'
import BlockPairing from '../Blocks/BlockPairing'
import BlockSequence from '../Blocks/BlockSequence'
import BlockLikert from '../Blocks/BlockLikert'

/*Modal*/
import FileManagerModal from '../Components/modal/FileManagerModal'
import SendBlockModal from '../Components/modal/SendBlockModal'
import DeleteModal from '../Components/modal/DeleteModal'
import ModalSubscriber from '../Components/modal/ModalSubscriber'
import FreeLibrary from '../Components/modal/FreeLibrary'
import Loader from '../Components/modal/Loader'

//Style
import './BlockPage.scss'
import ChangeNameGrainModal from '../Components/modal/ChangeNameGrainModal'

import {fetchApi} from "../Utils/Fetch";
import Header from "../Components/Header";

class BlockPage extends Component {
    state = {
        training: [],
        nbBlock: 0,
        isDeletedBlock: false,
        currentTab: 'blocs',
        show: false,
        modalNameGrain: false,
        component: '',
        grain: [],
        currentGrain: '',
        grainHtml: '',
        block: true,
        width: 0,
        sendBlockModal: false,
        quotaMax: false,
        right: [],
        tabs: [
            {'text': '_BLOCS', 'class': 'tab__link actif', 'link': '#blocs', 'id': 'blocs', 'type': 'blocs'},
            {'text': '_QUESTIONS', 'class': 'tab__link', 'link': '#questions', 'id': 'questions', 'type': 'questions'},
            {'text': '_HELP', 'class': 'tab__link', 'link': '#aide', 'id': 'help', 'type': 'help'},
        ],
        blocks: [
            {'style': 'title-block', 'title': '_BLOC_DESC_TITLE', 'text': '_TITLE', 'type': '_TITLE'},
            {'style': 'paragraph-block', 'title': '_TEXT_DESC', 'text': '_TEXT', 'type': '_TEXT'},
            {'style': 'hr-block', 'title': '_HR_DESC', 'text': '_HR', 'type': '_HR'},
            {'style': 'img-block', 'title': '_IMG_DESC', 'text': '_IMG', 'type': '_IMG'},
            {'style': 'left-img-block', 'title': '_IMGL_DESC', 'text': '_IMGL', 'type': '_IMGL'},
            {'style': 'right-img-block', 'title': '_IMGR_DESC', 'text': '_IMGR', 'type': '_IMGR'},
            {'style': 'video-block', 'title': '_VIDEO_DESC', 'text': '_VIDEO', 'type': '_VIDEO'},
            {'style': 'capture-block', 'title': '_SCREEN_DESC', 'text': '_SCREEN', 'type': '_SCREEN'},
            {'style': 'audio-block', 'title': '_AUDIO_DESC', 'text': '_AUDIO', 'type': '_AUDIO'},
            {'style': 'document-block', 'title': '_BLOC_DESC_DOC', 'text': '_DOC', 'type': '_DOC'},
            {'style': 'formula-block', 'title': '_BLOC_DESC_FORMULA', 'text': '_FORMULA', 'type': '_FORMULA'},
            {'style': 'integrate-block', 'title': '_BLOC_DESC_EO', 'text': '_EO_BLOCK', 'type': '_EO_BLOCK'},
            {'style': 'pdf-block', 'title': '_PDF_DESC', 'text': '_PDF_READER', 'type': '_PDF_READER'},
        ],
        questionBlocks: [
            {'style': 'quiz-block', 'title': '_QUIZ_TITLE_DESC', 'text': '_QUIZ_TITLE', 'type': '_QUIZ_TITLE'},
            {
                'style': 'true-block',
                'title': '_QUIZ_TRUE_FALSE_DESC',
                'text': '_QUIZ_TRUE_FALSE',
                'type': '_QUIZ_TRUE_FALSE'
            },
            {'style': 'num-block', 'title': '_QUIZ_NUMERIC_DESC', 'text': '_QUIZ_NUMERIC', 'type': '_QUIZ_NUMERIC'},
            {'style': 'qcm-block', 'title': '_QUIZ_MCQ_DESC', 'text': '_QUIZ_MCQ', 'type': '_QUIZ_MCQ'},
            {'style': 'gaps-block', 'title': '_QUIZ_GAPS_DESC', 'text': '_QUIZ_GAPS', 'type': '_QUIZ_GAPS'},
            {'style': 'pairing-block', 'title': '_QUIZ_MATCH_DESC', 'text': '_QUIZ_MATCH', 'type': '_QUIZ_MATCH'},
            {
                'style': 'sequence-block',
                'title': '_QUIZ_SEQUENCE_DESC',
                'text': '_QUIZ_SEQUENCE',
                'type': '_QUIZ_SEQUENCE'
            },
            {'style': 'likert-block', 'title': '_QUIZ_LIKER_DESC', 'text': '_QUIZ_LIKERT', 'type': '_QUIZ_LIKERT'}
        ],
        tool: [
            {'type': 'listing', 'link': '/trainings', 'title': '_NAV_LIST', 'text': '_NAV_LIST'}
        ]
    }


    components = {
        '_TITLE': BlockTitle,
        '_TEXT': BlockParagraph,
        '_HR': BlockSeparator,
        '_IMG': BlockImage,
        '_IMGL': BlockTextLeft,
        '_IMGR': BlockTextRight,
        '_VIDEO': BlockVideo,
        '_SCREEN': BlockScreenShot,
        '_AUDIO': BlockAudio,
        '_DOC': BlockDocument,
        '_FORMULA': BlockFormula,
        '_EO_BLOCK': BlockIntegratedObjects,
        '_PDF_READER': BlockPDF,
        '_QUIZ_TITLE': BlockStatement,
        '_QUIZ_TRUE_FALSE': BlockTrueFalse,
        '_QUIZ_NUMERIC': BlockNumeric,
        '_QUIZ_MCQ': BlockQCM,
        '_QUIZ_GAPS': BlockGaps,
        '_QUIZ_MATCH': BlockPairing,
        '_QUIZ_SEQUENCE': BlockSequence,
        '_QUIZ_LIKERT': BlockLikert
    }

    constructor({props}) {
        super(props)
    }

    componentDidMount = async () => {
        await this.getTraining()
        document.title = this.props.title
        this.setState({
            tools: [
                {
                    'type': 'preview',
                    'link': `/training/preview/${window.btoa(this.props.match.params.id + '&' + 0)}`,
                    'title': '_TRAINING_PREVIEW',
                    'text': '_TRAINING_PREVIEW',
                    'target': '_blank',
                    'rel': 'noopener noreferrer'
                },
                {
                    'type': 'export',
                    'link': `/training/${this.props.match.params.id}/option#exports`,
                    'title': '_TRAINING_EXPORT',
                    'text': '_TRAINING_EXPORT'
                },
                {
                    'type': 'share',
                    'link': `/training/${this.props.match.params.id}/option#shares`,
                    'title': '_TRAINING_SHARE',
                    'text': '_TRAINING_SHARE'
                },
                {
                    'type': 'settings',
                    'link': `/training/${this.props.match.params.id}/option`,
                    'title': '_TRAINING_CONFIG',
                    'text': '_TRAINING_CONFIG'
                },
                {'type': 'listing', 'link': '/trainings', 'title': '_NAV_LIST', 'text': '_NAV_LIST'}
            ]
        })
    }


    async getRight() {
        let right = await fetchApi(`training_author/get_right?id_training=${this.state.training.id}`, 'GET')

        if (right) {
            this.setState({right})
        }
    }

    async getAllGrain(keepCurrent = false) {
        let grain = await fetchApi(`grain/get_all_by_training?training_id=${this.props.match.params.id}`, 'GET')

        if (grain) {
            if (!keepCurrent) {
                const currentGrain = 0
                this.setState({grain, currentGrain})
            } else {
                this.setState({grain})
            }
            if (this.state.grain.length !== 0) {
                await this.getHtmlGrain()
            }
        }
    }

    async deleteGrain() {
        let response = await fetchApi('grain/delete', 'DELETE', true, {
            id_grain: this.state.delete_grain
        })

        if (response) {
            this.setState({isDelete: false})
            await this.getAllGrain()
            await this.getHtmlGrain()
        }
    }

    async duplicateGrain(event, id) {
        let response = await fetchApi('grain/duplicate', 'POST', true, {
            id_grain: id
        })

        if (response) {
            let data = await response
            await this.getAllGrain()
            await this.setState({currentGrain: data['position']})
            await this.getHtmlGrain()
        }
    }

    async getTraining() {
        let response = await fetchApi(`training/get?id=${this.props.match.params.id}`, 'GET', true)

        if (response) {
            let training = await response
            let lang = training['language_code']
            await this.setState({training, lang})
            await this.getAllGrain()
            await this.getRight()
        }
    }

    async createGrain() {
        let response = await fetchApi('grain/create', 'POST', true, {
            id: this.state.training.id
        })

        if (response) {
            await this.getAllGrain()
            await this.setState({currentGrain: this.state.grain.length - 1})
            await this.getHtmlGrain()
        }
    }

    async switchPosition(first, second) {
        let response = await fetchApi('block/position', 'POST', true, {
            first_position: first,
            second_position: second,
            id: this.state.grain[this.state.currentGrain].id
        })

        if (response) {
            await this.getHtmlGrain()
        }
    }

    async changeLang(lang) {
        await this.setState({lang})
        await this.getHtmlGrain();
    }

    async getHtmlGrain(idBlock, submit) {
        if (this.state.grain.length === 0) {
            this.setState({grainHtml: ''})
            this.setState({loading: false})
        } else {
            this.setState({loading: true})
            let response = await fetchApi(`grain/generate_html?grain_id=${this.state.grain[this.state.currentGrain].id}&language=${this.state.lang}&newBlock=${!submit}`, 'GET', true)

            if (response) {
                const grainResponse = await response
                const grainHtml = grainResponse[0]
                const nbBlock = grainResponse[1]
                if (grainHtml.length > 0) {
                    if (idBlock !== undefined) {
                        if (submit) {
                            this.setState({
                                grainHtml,
                                nbBlock,
                                selectedBlock: undefined,
                                currentTab: 'blocs',
                                show: false,
                                loading: false
                            })
                        } else {
                            this.setState({grainHtml, nbBlock, selectedBlock: idBlock, newBlock: true, loading: false})
                            setTimeout(() => {
                                this.setState({newBlock: undefined})
                            }, 100)
                        }
                    } else {
                        this.setState({grainHtml, nbBlock, loading: false})
                    }
                } else {
                    this.setState({grainHtml, nbBlock, selectedBlock: undefined, loading: false})
                }
            }
        }
    }

    async handleSelectBlock(event, id, block) {
        await this.setState({show: false, selectedBlock: undefined})
        this.setState({show: true, selectedBlock: id, currentTab: block})
    }

    async changeCurrentGrain(event, key) {
        const currentGrain = await key;
        this.setState({currentGrain})
        await this.getHtmlGrain()
    }

    async openSender() {
        this.setState({sendBlockModal: true})
    }

    handleChange = (event, field, blockPosition = undefined) => {
        this.setState({show: true, currentTab: field, blockPosition});
    }

    async handleChangeInput(event) {
        let response = await fetchApi('grain/change_name', 'PUT', true, {
            id: this.state.grain[this.state.currentGrain].id,
            name: this.state.grain[this.state.currentGrain].name[this.state.lang],
            lang: this.state.lang
        })


        if (response) {
            this.setState({modalNameGrain: false})
        }
    }


    onDoubleClickName = () => {
        this.setState({modalNameGrain: true})
    }

    async duplicateBlock() {
        let response = await fetchApi('block/duplicate', 'POST', true, {
            grain_id: this.state.grain[this.state.currentGrain],
            id_block: this.state.selectedBlock
        })


        if (response) {
            await this.getHtmlGrain()
        }
    }

    changeName = (event) => {
        let {grain} = this.state

        grain[this.state.currentGrain].name[this.state.lang] = event.target.value

        this.setState({grain})
    }

    async sendBlock() {
        let grain = document.getElementById('grainSelector').value;


        let response = await fetchApi('block/send', 'POST', true, {
            new_grain: grain,
            id_block: this.state.selectedBlock
        })

        if (response) {
            this.setState({currentGrain: grain - 1, sendBlockModal: false})
            await this.getHtmlGrain()
        }
    }

    async evenement(tabs) {
        await this.setState({currentTab: tabs})
    }

    render() {
        const {flashMessageStatus, blocks, questionBlocks, nbBlock} = this.state
        const {offer} = window.$user
        const Block = this.components[this.state.currentTab]
        const QuestionBlocks = this.components[this.state.currentTab]

        if (flashMessageStatus) {
            setTimeout(() => {
                this.setState({flashMessageStatus: false, flashMessage: ''})
            }, 5000)
        }

        setTimeout(() => {
            this.setState({width: window.innerWidth})
        }, 100)

        return (
            <div id='container'>
                {
                    this.state.width < 700 ?
                        <header className='main__header mobile__header'/>
                        :
                        <Header />
                }
                {
                    this.state.modalNameGrain && this.state.grain[this.state.currentGrain] !== undefined ?
                        <ChangeNameGrainModal
                            name={this.state.grain[this.state.currentGrain].name[this.state.lang]}
                            changeHandle={(event) => this.changeName(event)}
                            onOk={(event) => this.handleChangeInput(event)}
                            onAnnul={(event) => this.setState({modalNameGrain: false})}
                        />
                        :
                        <Fragment/>
                }
                <MainSection
                    titleText={`${this.state.training.name}`}
                    additionalTitleClass='with__tool__and__logo'
                    tools={this.state.right !== undefined && this.state.right.is_editor ? this.state.tools : this.state.tool}
                    width={this.state.width}
                >
                    {
                        this.state.loading ?
                            <Loader/>
                            :
                            this.state.flashMessageStatus ? <FlashMessage>{this.state.flashMessage}</FlashMessage>
                                :
                                this.state.sendBlockModal ?
                                    <SendBlockModal lang={this.state.lang} grains={this.state.grain}
                                                    sendBlock={() => this.sendBlock()}
                                                    onAnnul={() => this.setState({sendBlockModal: false})}/>
                                    :
                                    this.state.isDelete ?
                                        <DeleteModal onOk={() => this.deleteGrain()}
                                                     onAnnul={() => this.setState({isDelete: false})}/>
                                        :
                                        this.state.quotaMax === true ?
                                            <ModalSubscriber
                                                bkgd='quota__bkgd'
                                                modalTitle='_LOCK_QUOTA'
                                                onClose={() => this.setState({quotaMax: false})}
                                            >
                                                <Translation>
                                                    { //La balise Translation attends la méthode t pour traduire
                                                        (t) => <p>{t('_LOCK_QUOTA_ACCESS')}
                                                            <hr/>
                                                            {t('_LOCK_CONTACT')}</p>
                                                    }
                                                </Translation>
                                            </ModalSubscriber>
                                            :
                                            <Fragment/>
                    }
                    <div className='main-training'>
                        {
                            this.state.width < 770 ?
                                <Fragment>
                                    {
                                        this.state.freeLibrary
                                            ?
                                            <FreeLibrary
                                                onClose={() => this.setState({freeLibrary: false})}
                                                selectImage={(path) => this.setState({image_path: path})}
                                            />
                                            :
                                            <Fragment/>
                                    }
                                    <SwipeableViews enableMouseEvents className='swipper'>
                                        <div className='training-container'>
                                            <AddGrain
                                                setNewLang={(lang) => this.changeLang(lang)}
                                                grain_language={this.state.lang}
                                                id_training={this.state.training.id}
                                                grains={this.state.grain}
                                                deleteGrain={(event, id) => this.setState({
                                                    isDelete: true,
                                                    delete_grain: id
                                                })}
                                                duplicateGrain={(event, id) => this.duplicateGrain(event, id)}
                                                createGrain={() => this.createGrain()}
                                                currentGrain={this.state.currentGrain}
                                                changeCurrentGrain={(event, key) => this.changeCurrentGrain(event, key)}
                                                onDoubleClickName={() => this.onDoubleClickName()}
                                                addNote={() => this.setState({currentTab: '_NOTES'})}
                                                showConfig={() => (this.setState({currentTab: 'CONFIG'}))}
                                                generateHtml={() => this.getHtmlGrain()}
                                                right={this.state.right}
                                            />
                                            <section className='training-section'>
                                                {
                                                    this.state.selectedBlock !== undefined ?
                                                        this.state.grainHtml ?
                                                            <TrainingArea
                                                                right={this.state.right}
                                                                grain_language={this.state.lang}
                                                                id_grain={this.state.grain[this.state.currentGrain] !== undefined ? this.state.grain[this.state.currentGrain].id : null}
                                                                htmlCode={this.state.grainHtml}
                                                                newBlock={this.state.newBlock}
                                                                currentBlock={(e, target, position) => this.handleChange(e, target, position)}
                                                                skinPath={this.state.training.skin_path}
                                                                selectedBlock={this.state.selectedBlock}
                                                                selectNewBlock={(event, id, block) => this.handleSelectBlock(event, id, block)}
                                                                onDeleteBlock={() => this.setState({isDeletedBlock: true})}
                                                                openSender={() => this.openSender()}
                                                                duplicateBlock={() => this.duplicateBlock()}
                                                            />
                                                            :
                                                            <Fragment/>
                                                        :
                                                        this.state.grainHtml ?
                                                            <TrainingArea
                                                                right={this.state.right}
                                                                grain_language={this.state.lang}
                                                                id_grain={this.state.grain[this.state.currentGrain] !== undefined ? this.state.grain[this.state.currentGrain].id : null}
                                                                htmlCode={this.state.grainHtml}
                                                                newBlock={this.state.newBlock}
                                                                currentBlock={(e, target, position) => this.handleChange(e, target, position)}
                                                                skinPath={this.state.training.skin_path}
                                                                selectNewBlock={(event, id, block) => this.handleSelectBlock(event, id, block)}
                                                                onDeleteBlock={() => this.setState({isDeletedBlock: true})}
                                                                openSender={() => this.openSender()}
                                                                duplicateBlock={() => this.duplicateBlock()}
                                                            />
                                                            :
                                                            <Fragment/>
                                                }
                                            </section>
                                        </div>
                                        <div className='block__wrapper'>
                                            {
                                                this.state.currentTab === '_NOTES' ?
                                                    <Notes
                                                        getAllGrain={(keepCurrent) => this.getAllGrain(keepCurrent)}
                                                        grain_id={this.state.grain[this.state.currentGrain].id}
                                                        close={() => this.setState({currentTab: 'blocs'})}
                                                    />
                                                    :
                                                    this.state.currentTab === 'CONFIG' ?
                                                        <ConfigGrainHandler
                                                            lang={this.state.lang}
                                                            grain={this.state.grain[this.state.currentGrain]}
                                                            currentGrain={this.state.grain[this.state.currentGrain].id}
                                                            getAllGrain={() => this.getAllGrain()}
                                                            getHtmlGrain={() => this.getHtmlGrain()}
                                                            close={() => this.setState({currentTab: 'blocs'})}
                                                            offer={offer}
                                                        />
                                                        :
                                                        <aside>
                                                            {
                                                                this.state.show === true || this.state.grain.length === 0 ?
                                                                    <Fragment/>
                                                                    :
                                                                    <NavBarSecondary
                                                                        tabs={this.state.tabs}
                                                                        className='tab__menu blocks__tab'
                                                                        evenement={(tabs) => this.evenement(tabs)}
                                                                    />
                                                            }
                                                            {
                                                                this.state.grain.length !== 0 ?
                                                                    this.state.currentTab === 'blocs' && this.state.show !== true ?

                                                                        <ul className='button-block-list'>
                                                                            <ButtonBlock
                                                                                blocks={blocks}
                                                                                onClick={(event, target) => this.handleChange(event, target)}
                                                                            />
                                                                        </ul>
                                                                        :
                                                                        this.state.currentTab === 'questions' ?
                                                                            <ul className='button-block-list'>
                                                                                <QuestionBlock
                                                                                    trainingUuid={this.state.training['uuid']}
                                                                                    questionBlocks={questionBlocks}
                                                                                    onClick={(event, target) => this.handleChange(event, target)}
                                                                                />
                                                                            </ul>
                                                                            : this.state.currentTab === 'help' ?
                                                                            <HelpBlock/>
                                                                            :
                                                                            <section className='blocks__section'>
                                                                                <Translation>
                                                                                    {(t) => <h3
                                                                                        className='blocks__title'>{t(this.state.currentTab)}</h3>}
                                                                                </Translation>
                                                                                <Button
                                                                                    className='close__btn'
                                                                                    buttonTitle='_CLOSE'
                                                                                    type='button'
                                                                                    onClick={() => this.setState({
                                                                                        currentTab: 'blocs',
                                                                                        show: false,
                                                                                        selectedBlock: undefined
                                                                                    })}
                                                                                />
                                                                                {
                                                                                    this.state.right !== undefined && this.state.right.is_editor ?
                                                                                        this.state.block === true ?
                                                                                            this.state.blockPosition !== undefined ?
                                                                                                <Block
                                                                                                    trainingUuid={this.state.training['uuid']}
                                                                                                    image_path={this.state.image_path}
                                                                                                    changeFreeLibrary={(freeLibrary) => this.setState({freeLibrary})}
                                                                                                    lang={this.state.lang}
                                                                                                    nbBlock={nbBlock}
                                                                                                    newBlock={(idBlock, submit) => this.getHtmlGrain(idBlock, submit)}
                                                                                                    id_grain={this.state.grain[this.state.currentGrain].id}
                                                                                                    grainName={this.state.grain[this.state.currentGrain].name}
                                                                                                    position={this.state.blockPosition}
                                                                                                    id_block={this.state.selectedBlock}
                                                                                                    delete={() => this.setState({
                                                                                                        isDeletedBlock: false,
                                                                                                        currentTab: 'blocs',
                                                                                                        show: false,
                                                                                                        selectedBlock: undefined
                                                                                                    })}
                                                                                                    askDelete={this.state.isDeletedBlock}
                                                                                                />
                                                                                                :
                                                                                                <Block
                                                                                                    trainingUuid={this.state.training['uuid']}
                                                                                                    image_path={this.state.image_path}
                                                                                                    changeFreeLibrary={(freeLibrary) => this.setState({freeLibrary})}
                                                                                                    lang={this.state.lang}
                                                                                                    nbBlock={nbBlock}
                                                                                                    newBlock={(idBlock, submit) => this.getHtmlGrain(idBlock, submit)}
                                                                                                    grainName={this.state.grain[this.state.currentGrain].name}
                                                                                                    id_grain={this.state.grain[this.state.currentGrain].id}
                                                                                                    id_block={this.state.selectedBlock}
                                                                                                    delete={() => this.setState({
                                                                                                        isDeletedBlock: false,
                                                                                                        currentTab: 'blocs',
                                                                                                        show: false,
                                                                                                        selectedBlock: undefined
                                                                                                    })}
                                                                                                    askDelete={this.state.isDeletedBlock}
                                                                                                />
                                                                                            :
                                                                                            <QuestionBlocks
                                                                                                trainingUuid={this.state.training['uuid']}
                                                                                                nbBlock={nbBlock}
                                                                                                newBlock={(idBlock, submit) => this.getHtmlGrain(idBlock, submit)}
                                                                                            />
                                                                                        :
                                                                                        <Fragment/>
                                                                                }
                                                                            </section>
                                                                    :
                                                                    <Fragment/>
                                                            }
                                                        </aside>
                                            }
                                        </div>
                                    </SwipeableViews>
                                </Fragment>
                                :
                                <Container className='training-wrapper'>
                                    {
                                        this.state.freeLibrary
                                            ?
                                            <FreeLibrary
                                                onClose={() => this.setState({freeLibrary: false})}
                                                selectImage={(path) => this.setState({image_path: path})}
                                            />
                                            :
                                            <Fragment/>
                                    }
                                    <Section className='training-container'>
                                        <AddGrain
                                            setNewLang={(lang) => this.changeLang(lang)}
                                            grain_language={this.state.lang}
                                            id_training={this.state.training.id}
                                            grains={this.state.grain}
                                            createGrain={() => this.createGrain()}
                                            duplicateGrain={(event, id) => this.duplicateGrain(event, id)}
                                            deleteGrain={(event, id) => this.setState({
                                                isDelete: true,
                                                delete_grain: id
                                            })}
                                            currentGrain={this.state.currentGrain}
                                            changeCurrentGrain={(event, key) => this.changeCurrentGrain(event, key)}
                                            onDoubleClickName={() => this.onDoubleClickName()}
                                            addNote={() => (this.setState({currentTab: '_NOTES'}))}
                                            showConfig={() => (this.setState({currentTab: 'CONFIG'}))}
                                            generateHtml={() => this.getHtmlGrain()}
                                            right={this.state.right}
                                        />
                                        <div className='training-section'>
                                            {
                                                this.state.selectedBlock !== undefined ?
                                                    this.state.grainHtml ?
                                                        <TrainingArea
                                                            right={this.state.right}
                                                            grain_language={this.state.lang}
                                                            id_grain={this.state.grain[this.state.currentGrain] !== undefined ? this.state.grain[this.state.currentGrain].id : null}
                                                            htmlCode={this.state.grainHtml}
                                                            newBlock={this.state.newBlock}
                                                            currentBlock={(e, target, position) => this.handleChange(e, target, position)}
                                                            skinPath={this.state.training.skin_path}
                                                            selectedBlock={this.state.selectedBlock}
                                                            selectNewBlock={(event, id, block) => this.handleSelectBlock(event, id, block)}
                                                            onDeleteBlock={() => this.setState({isDeletedBlock: true})}
                                                            openSender={() => this.openSender()}
                                                            duplicateBlock={() => this.duplicateBlock()}
                                                        />
                                                        :
                                                        <Fragment/>
                                                    :
                                                    this.state.grainHtml ?
                                                        <TrainingArea
                                                            right={this.state.right}
                                                            grain_language={this.state.lang}
                                                            id_grain={this.state.grain[this.state.currentGrain] !== undefined ? this.state.grain[this.state.currentGrain].id : null}
                                                            htmlCode={this.state.grainHtml}
                                                            newBlock={this.state.newBlock}
                                                            currentBlock={(e, target, position) => this.handleChange(e, target, position)}
                                                            skinPath={this.state.training.skin_path}
                                                            selectNewBlock={(event, id, block) => this.handleSelectBlock(event, id, block)}
                                                            onDeleteBlock={() => this.setState({isDeletedBlock: true})}
                                                            openSender={() => this.openSender()}
                                                            duplicateBlock={() => this.duplicateBlock()}
                                                        />
                                                        :
                                                        <Fragment/>

                                            }
                                        </div>
                                    </Section>
                                    <Bar id='resizer'>
                                        <div id='resize-cursor'></div>
                                    </Bar>
                                    <Section className='block__wrapper' style={{flex: 'none'}}>
                                        {
                                            this.state.currentTab === '_NOTES' ?
                                                <Notes
                                                    getAllGrain={(keepCurrent) => this.getAllGrain(keepCurrent)}
                                                    grain_id={this.state.grain[this.state.currentGrain].id}
                                                    close={() => this.setState({currentTab: 'blocs'})}
                                                />
                                                :
                                                this.state.currentTab === 'CONFIG' && this.state.right.is_editor ?
                                                    <ConfigGrainHandler
                                                        lang={this.state.lang}
                                                        grain={this.state.grain[this.state.currentGrain]}
                                                        currentGrain={this.state.grain[this.state.currentGrain].id}
                                                        getAllGrain={() => this.getAllGrain()}
                                                        getHtmlGrain={() => this.getHtmlGrain()}
                                                        close={() => this.setState({currentTab: 'blocs'})}
                                                        offer={offer}
                                                    />
                                                    :
                                                    <aside>
                                                        {
                                                            this.state.show === true || this.state.grain.length === 0 || (this.state.right !== undefined && !this.state.right.is_editor) ?
                                                                <Fragment/>
                                                                :
                                                                <NavBarSecondary
                                                                    tabs={this.state.tabs}
                                                                    className='tab__menu blocks__tab'
                                                                    evenement={(tabs) => this.evenement(tabs)}
                                                                />
                                                        }
                                                        {
                                                            this.state.right !== undefined && this.state.right.is_editor ?
                                                                this.state.grain.length !== 0 ?
                                                                    this.state.currentTab === 'blocs' && this.state.show !== true ?
                                                                        <ul className='button-block-list'>
                                                                            <ButtonBlock
                                                                                blocks={blocks}
                                                                                onDoubleClick={(event, target) => this.handleChange(event, target)}
                                                                                onClick={() => {
                                                                                }}
                                                                            />
                                                                        </ul>
                                                                        : this.state.currentTab === 'questions' ?
                                                                        <ul className='button-block-list'>
                                                                            <QuestionBlock
                                                                                trainingUuid={this.state.training['uuid']}
                                                                                questionBlocks={questionBlocks}
                                                                                onDoubleClick={(event, target) => this.handleChange(event, target)}
                                                                                onClick={() => {
                                                                                }}
                                                                            />
                                                                        </ul>
                                                                        : this.state.currentTab === 'help' ?
                                                                            <HelpBlock/>
                                                                            :
                                                                            <section className='blocks__section'>
                                                                                <Translation>
                                                                                    {(t) => <h3
                                                                                        className='blocks__title'>{t(this.state.currentTab)}</h3>}
                                                                                </Translation>
                                                                                <Button
                                                                                    className='close__btn'
                                                                                    buttonTitle='_CLOSE'
                                                                                    type='button'
                                                                                    onClick={() => this.setState({
                                                                                        currentTab: 'blocs',
                                                                                        show: false,
                                                                                        selectedBlock: undefined
                                                                                    })}
                                                                                />
                                                                                {
                                                                                    this.state.block === true ?
                                                                                        this.state.blockPosition !== undefined ?
                                                                                            <Block
                                                                                                trainingUuid={this.state.training['uuid']}
                                                                                                image_path={this.state.image_path}
                                                                                                changeFreeLibrary={(freeLibrary) => this.setState({freeLibrary})}
                                                                                                lang={this.state.lang}
                                                                                                nbBlock={nbBlock}
                                                                                                newBlock={(idBlock, submit) => this.getHtmlGrain(idBlock, submit)}
                                                                                                id_grain={this.state.grain[this.state.currentGrain].id}
                                                                                                grainName={this.state.grain[this.state.currentGrain].name}
                                                                                                position={this.state.blockPosition}
                                                                                                id_block={this.state.selectedBlock}
                                                                                                delete={() => this.setState({
                                                                                                    isDeletedBlock: false,
                                                                                                    currentTab: 'blocs',
                                                                                                    show: false,
                                                                                                    selectedBlock: undefined
                                                                                                })}
                                                                                                askDelete={this.state.isDeletedBlock}
                                                                                            />
                                                                                            :
                                                                                            <Block
                                                                                                trainingUuid={this.state.training['uuid']}
                                                                                                image_path={this.state.image_path}
                                                                                                changeFreeLibrary={(freeLibrary) => this.setState({freeLibrary})}
                                                                                                lang={this.state.lang}
                                                                                                nbBlock={nbBlock}
                                                                                                newBlock={(idBlock, submit) => this.getHtmlGrain(idBlock, submit)}
                                                                                                grainName={this.state.grain[this.state.currentGrain].name}
                                                                                                id_grain={this.state.grain[this.state.currentGrain].id}
                                                                                                id_block={this.state.selectedBlock}
                                                                                                delete={() => this.setState({
                                                                                                    isDeletedBlock: false,
                                                                                                    currentTab: 'blocs',
                                                                                                    show: false,
                                                                                                    selectedBlock: undefined
                                                                                                })}
                                                                                                askDelete={this.state.isDeletedBlock}
                                                                                            />
                                                                                        :
                                                                                        <QuestionBlocks
                                                                                            trainingUuid={this.state.training['uuid']}
                                                                                            nbBlock={nbBlock}
                                                                                            newBlock={(idBlock, submit) => this.getHtmlGrain(idBlock, submit)}
                                                                                        />
                                                                                }
                                                                            </section>
                                                                    :
                                                                    <Fragment/>
                                                                :
                                                                <Fragment/>
                                                        }
                                                    </aside>
                                        }
                                    </Section>
                                </Container>
                        }
                    </div>
                </MainSection>
                <Footer/>
            </div>
        )
    }
}

export default BlockPage